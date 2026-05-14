import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    let projectQuery = {};
    const isAdmin = req.user?.role === 'Admin';
    
    if (!isAdmin) {
      projectQuery = { members: req.user?._id };
    }
    
    const userProjects = await Project.find(projectQuery);
    const projectIds = userProjects.map(p => p._id);

    
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignee', 'name')
      .populate('project', 'name');

    const totalTasks = tasks.length;
    const statusBreakdown = {
      todo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length,
    };

    const overdueTasks = tasks.filter(t => 
      t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    const assignedTasks = tasks.filter(t => 
      t.assignee?.some((a: any) => a._id?.toString() === req.user?._id.toString())
    );

    res.json({
      totalTasks,
      statusBreakdown,
      overdueTasks,
      assignedTasks,
      totalProjects: userProjects.length
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
