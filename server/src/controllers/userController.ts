import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const searchUsers = async (req: AuthRequest, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search as string, $options: 'i' } },
          { email: { $regex: req.query.search as string, $options: 'i' } },
        ],
      }
    : {};

  try {
    const users = await User.find({ ...keyword, _id: { $ne: req.user?._id as any } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const emailPrefix = email.split('@')[0];
    if (!emailPrefix || !/^[A-Z]/.test(emailPrefix)) {
      return res.status(400).json({ 
        message: 'Email must start with an uppercase letter (e.g., John123@hr.com)' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const lowEmail = email.toLowerCase();
    const assignedRole = lowEmail.endsWith('@hr.com') ? 'Admin' : 
                         lowEmail.endsWith('@projecthead.com') ? 'Project Head' : 'Employee';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
