import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS to bypass local DNS issues with SRV records
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
