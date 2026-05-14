import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Project from '../models/Project';

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description, deadline } = req.body;

  if (req.user?.role !== 'Admin' && req.user?.role !== 'Project Head') {
    return res.status(403).json({ message: 'Only Admin or Project Head can create projects' });
  }

  if (deadline && new Date(deadline).getFullYear() > 3000) {
    return res.status(400).json({ message: 'Deadline year cannot be beyond 3000' });
  }

  try {
    const project = await Project.create({
      name,
      description,
      deadline,
      admin: req.user?._id as any,
      members: [req.user?._id as any],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    let query = {};
    if (req.user?.role !== 'Admin') {
      query = { members: req.user?._id };
    }
    
    const projects = await Project.find(query).populate('admin', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(m => m._id.toString() === req.user?._id.toString());
    const isAdmin = req.user?.role === 'Admin';

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProjectMembers = async (req: AuthRequest, res: Response) => {
  const { memberId, action } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isAuthorized = req.user?.role === 'Admin' || 
                        req.user?.role === 'Project Head' || 
                        project.admin.toString() === req.user?._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Only admin or project head can manage members' });
    }

    if (action === 'add') {
      if (!project.members.includes(memberId)) {
        project.members.push(memberId);
      }
    } else if (action === 'remove') {
      if (memberId.toString() === project.admin.toString()) {
        return res.status(400).json({ message: 'Cannot remove admin from project' });
      }
      project.members = project.members.filter(m => m.toString() !== memberId);
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { name, description, deadline } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isAuthorized = req.user?.role === 'Admin' || 
                        req.user?.role === 'Project Head' || 
                        project.admin.toString() === req.user?._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    if (deadline && new Date(deadline).getFullYear() > 3000) {
      return res.status(400).json({ message: 'Deadline year cannot be beyond 3000' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user?.role !== 'Admin' && project.admin.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Only admin or creator can delete project' });
    }

    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
