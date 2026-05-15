import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, gender } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const lowEmail = email.toLowerCase();
    const domainRole = lowEmail.endsWith('@hr.com') ? 'Admin' : 
                          lowEmail.endsWith('@projecthead.com') ? 'Project Head' : 'Employee';
    const assignedRole = req.body.role || domainRole;

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      gender
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            // Verify role if provided (Admins can bypass)
            if (role && user.role !== role && user.role !== 'Admin') {
                return res.status(401).json({ message: 'Access denied.' });
            }


      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
