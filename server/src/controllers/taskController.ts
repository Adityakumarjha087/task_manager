import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate, priority, project, assignee } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }


    const isPrivileged = req.user?.role === 'Admin' || 
                        req.user?.role === 'Project Head' || 
                        projectExists.admin.toString() === req.user?._id.toString();

    if (!isPrivileged) {
      return res.status(403).json({ message: 'Only admin or project head can create tasks' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignee,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProjectTasks = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(m => m.toString() === req.user?._id.toString());
    const isAdmin = req.user?.role === 'Admin';

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ project: req.params.projectId as any })
      .populate('assignee', 'name email')
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate, priority, status, assignee } = req.body;

  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.project as any;


    const isPrivileged = req.user?.role === 'Admin' || 
                        req.user?.role === 'Project Head' || 
                        project.admin.toString() === req.user?._id.toString();
    const isAssignee = task.assignee?.some((a: any) => a.toString() === req.user?._id.toString());

    if (!isPrivileged && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }


    if (isPrivileged) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.assignee = assignee || task.assignee;
    } else if (isAssignee) {
      task.status = status || task.status;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.project as any;
    const isPrivileged = req.user?.role === 'Admin' || 
                        req.user?.role === 'Project Head' || 
                        project.admin.toString() === req.user?._id.toString();

    if (!isPrivileged) {
      return res.status(403).json({ message: 'Only admin or project head can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
