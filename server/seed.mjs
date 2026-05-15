import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

// Simple models for seeding
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Project Head', 'Employee'], default: 'Employee' },
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Task = mongoose.model('Task', TaskSchema);

const firstNames = ['Amit', 'Priya', 'Suresh', 'Ananya', 'Vikram', 'Neha', 'Rahul', 'Sneha', 'Arjun', 'Kavita', 'Rohit', 'Deepika', 'Sanjay', 'Meera', 'Karan', 'Pooja', 'Aakash', 'Ritu', 'Manish', 'Swati', 'Nitin', 'Divya', 'Gaurav', 'Ishita', 'Rajesh', 'Tanvi', 'Abhishek', 'Komal', 'Varun', 'Shweta'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Reddy', 'Nair', 'Mehta', 'Joshi', 'Malhotra', 'Iyer', 'Bansal', 'Saxena', 'Chauhan', 'Mishra', 'Agarwal', 'Kapoor', 'Pandey', 'Bhatt', 'Sinha', 'Choudhary', 'Tiwari', 'Desai', 'Rao', 'Dubey', 'Kulkarni', 'Pillai', 'Yadav', 'Lodha'];

const projectNames = [
  'E-Commerce Platform Redesign', 'Mobile Banking App v2.0', 'HR Management System', 
  'Customer Support Chatbot', 'Data Analytics Dashboard', 'Cloud Infrastructure Migration',
  'Social Media Marketing Tool', 'Inventory Management System', 'AI Content Generator',
  'Blockchain Wallet Integration', 'Fitness Tracking App', 'Smart Home Controller',
  'E-Learning Portal', 'Cybersecurity Audit Tool', 'Virtual Reality Tour'
];

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    // Wipe all data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Wiped all data');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 1. Create 1 Admin (HR)
    const admin = await User.create({
      name: 'Aditya HR',
      email: 'hr@hr.com',
      password,
      role: 'Admin'
    });
    console.log('Created Admin (HR)');

    // 2. Create 5 Project Heads
    const projectHeads = [];
    for (let i = 0; i < 5; i++) {
      const ph = await User.create({
        name: `${firstNames[i]} ${lastNames[i]} (Head)`,
        email: `head${i+1}@projecthead.com`,
        password,
        role: 'Project Head'
      });
      projectHeads.push(ph);
    }
    console.log('Created 5 Project Heads');

    // 3. Create 24 Employees
    const employees = [];
    for (let i = 5; i < 29; i++) {
      const emp = await User.create({
        name: `${firstNames[i]} ${lastNames[i]}`,
        email: `employee${i-4}@gmail.com`,
        password,
        role: 'Employee'
      });
      employees.push(emp);
    }
    console.log('Created 24 Employees');

    const allUsers = [admin, ...projectHeads, ...employees];

    // 4. Create 15 Projects
    for (let i = 0; i < 15; i++) {
      const assignedPH = projectHeads[i % projectHeads.length];
      // Pick 4-6 random employees
      const shuffledEmps = [...employees].sort(() => 0.5 - Math.random());
      const selectedEmps = shuffledEmps.slice(0, 4 + Math.floor(Math.random() * 3));
      
      const project = await Project.create({
        name: projectNames[i],
        description: `Description for ${projectNames[i]}. This is a high-priority project focused on innovation and efficiency.`,
        deadline: new Date(Date.now() + (30 + Math.random() * 90) * 24 * 60 * 60 * 1000),
        admin: assignedPH._id,
        members: [admin._id, assignedPH._id, ...selectedEmps.map(e => e._id)]
      });

      // 5. Create 3-5 Tasks for each project
      const taskCount = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < taskCount; j++) {
        // Random assignees from project members (excluding admin)
        const projMembers = [assignedPH, ...selectedEmps];
        const taskAssignees = projMembers.sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 2));

        await Task.create({
          title: `Task ${j+1} for ${project.name}`,
          description: `Deliverable ${j+1} requirement analysis and implementation for ${project.name}.`,
          status: ['To Do', 'In Progress', 'Done'][Math.floor(Math.random() * 3)],
          priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          dueDate: new Date(Date.now() + (10 + Math.random() * 20) * 24 * 60 * 60 * 1000),
          project: project._id,
          assignee: taskAssignees.map(a => a._id)
        });
      }
      process.stdout.write('.');
    }

    console.log('\n✅ Final Seed successful!');
    console.log('Summary:');
    console.log('- 1 Admin (hr@hr.com)');
    console.log('- 5 Project Heads (head1-5@projecthead.com)');
    console.log('- 24 Employees (employee1-24@gmail.com)');
    console.log('- 15 Projects with associated tasks');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
