// Seed script to populate the database with demo data
const API = 'http://localhost:5000/api';

async function seed() {
  console.log('🌱 Starting seed process...\n');

  // Step 1: Login as Admin (Rahul Sharma)
  console.log('1️⃣  Logging in as Admin (Rahul Sharma)...');
  let adminToken;
  try {
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'Rahul123@hr.com', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message);
    adminToken = loginData.token;
    console.log(`   ✅ Logged in as ${loginData.name} (${loginData.role})\n`);
  } catch (err) {
    console.error('   ❌ Failed to login as admin:', err.message);
    console.log('   Trying to register Rahul Sharma...');
    const regRes = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Rahul Sharma', email: 'Rahul123@hr.com', password: 'Admin@123' })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message);
    adminToken = regData.token;
    console.log(`   ✅ Registered and logged in as ${regData.name} (${regData.role})\n`);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  // Step 2: Create 25 Employees
  console.log('2️⃣  Creating 25 employee accounts...');
  const employees = [
    { name: 'Priya Patel',       email: 'Priya.patel@gmail.com',       password: 'Pass@123' },
    { name: 'Amit Kumar',        email: 'Amit.kumar@outlook.com',      password: 'Pass@123' },
    { name: 'Sneha Reddy',       email: 'Sneha.reddy@yahoo.com',       password: 'Pass@123' },
    { name: 'Vikram Singh',      email: 'Vikram.singh@gmail.com',      password: 'Pass@123' },
    { name: 'Neha Gupta',        email: 'Neha.gupta@outlook.com',      password: 'Pass@123' },
    { name: 'Arjun Mehta',       email: 'Arjun.mehta@gmail.com',       password: 'Pass@123' },
    { name: 'Kavita Joshi',      email: 'Kavita.joshi@yahoo.com',      password: 'Pass@123' },
    { name: 'Rohit Verma',       email: 'Rohit.verma@gmail.com',       password: 'Pass@123' },
    { name: 'Deepika Nair',      email: 'Deepika.nair@outlook.com',    password: 'Pass@123' },
    { name: 'Sanjay Rao',        email: 'Sanjay.rao@gmail.com',        password: 'Pass@123' },
    { name: 'Ananya Sharma',     email: 'Ananya.sharma@yahoo.com',     password: 'Pass@123' },
    { name: 'Rajesh Tiwari',     email: 'Rajesh.tiwari@gmail.com',     password: 'Pass@123' },
    { name: 'Meera Iyer',        email: 'Meera.iyer@outlook.com',      password: 'Pass@123' },
    { name: 'Karan Malhotra',    email: 'Karan.malhotra@gmail.com',    password: 'Pass@123' },
    { name: 'Pooja Desai',       email: 'Pooja.desai@yahoo.com',       password: 'Pass@123' },
    { name: 'Aakash Bansal',     email: 'Aakash.bansal@gmail.com',     password: 'Pass@123' },
    { name: 'Ritu Saxena',       email: 'Ritu.saxena@outlook.com',     password: 'Pass@123' },
    { name: 'Manish Chauhan',    email: 'Manish.chauhan@gmail.com',    password: 'Pass@123' },
    { name: 'Swati Mishra',      email: 'Swati.mishra@yahoo.com',      password: 'Pass@123' },
    { name: 'Nitin Agarwal',     email: 'Nitin.agarwal@gmail.com',     password: 'Pass@123' },
    { name: 'Divya Kapoor',      email: 'Divya.kapoor@outlook.com',    password: 'Pass@123' },
    { name: 'Suresh Pandey',     email: 'Suresh.pandey@gmail.com',     password: 'Pass@123' },
    { name: 'Tanvi Bhatt',       email: 'Tanvi.bhatt@yahoo.com',       password: 'Pass@123' },
    { name: 'Gaurav Sinha',      email: 'Gaurav.sinha@gmail.com',      password: 'Pass@123' },
    { name: 'Ishita Choudhary',  email: 'Ishita.choudhary@outlook.com',password: 'Pass@123' },
  ];

  const createdEmployees = [];
  for (const emp of employees) {
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(emp)
      });
      const data = await res.json();
      if (res.ok) {
        createdEmployees.push(data);
        process.stdout.write('.');
      } else {
        // Already exists, try to find via search
        const searchRes = await fetch(`${API}/users?search=${emp.email}`, { headers });
        const searchData = await searchRes.json();
        if (searchData.length > 0) {
          createdEmployees.push(searchData[0]);
          process.stdout.write('~');
        } else {
          process.stdout.write('x');
        }
      }
    } catch (err) {
      process.stdout.write('x');
    }
  }
  console.log(`\n   ✅ ${createdEmployees.length} employees ready\n`);

  // Step 3: Create Projects
  console.log('3️⃣  Creating projects...');
  const projects = [
    { name: 'E-Commerce Platform Redesign',   description: 'Complete overhaul of the customer-facing e-commerce platform with modern UI/UX, improved performance, and mobile-first responsive design.' },
    { name: 'Mobile Banking App v2.0',         description: 'Next generation mobile banking application with biometric auth, real-time notifications, and AI-powered spending insights.' },
    { name: 'HR Management System',            description: 'Internal HR tool for employee onboarding, leave management, payroll processing, and performance reviews.' },
    { name: 'Customer Support Chatbot',        description: 'AI-powered chatbot integrated with our support system to handle common queries and reduce ticket volume by 40%.' },
    { name: 'Data Analytics Dashboard',        description: 'Real-time analytics dashboard for business intelligence, with interactive charts, KPI tracking, and automated reporting.' },
  ];

  const createdProjects = [];
  for (const proj of projects) {
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify(proj)
      });
      const data = await res.json();
      if (res.ok) {
        createdProjects.push(data);
        console.log(`   ✅ Created: "${proj.name}"`);
      } else {
        console.log(`   ⚠️  ${proj.name}: ${data.message}`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${proj.name}`);
    }
  }
  console.log(`   Total: ${createdProjects.length} projects created\n`);

  // Step 4: Add members to each project (5 employees per project)
  console.log('4️⃣  Adding employees to projects...');
  for (let i = 0; i < createdProjects.length; i++) {
    const proj = createdProjects[i];
    const startIdx = i * 5;
    const membersToAdd = createdEmployees.slice(startIdx, startIdx + 5);

    for (const member of membersToAdd) {
      try {
        await fetch(`${API}/projects/${proj._id}/members`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ memberId: member._id, action: 'add' })
        });
        process.stdout.write('+');
      } catch {
        process.stdout.write('-');
      }
    }
    console.log(` → ${proj.name} (${membersToAdd.length} members)`);
  }
  console.log('');

  // Step 5: Create Tasks for each project
  console.log('5️⃣  Creating tasks for each project...');
  const taskTemplates = [
    // Project 1 tasks
    [
      { title: 'Design Homepage Mockup',      description: 'Create Figma mockups for the new homepage layout',          priority: 'High',   status: 'Done',        dueDate: '2026-06-01' },
      { title: 'Implement Product Catalog',    description: 'Build the product listing page with filters and sorting',  priority: 'High',   status: 'In Progress', dueDate: '2026-06-10' },
      { title: 'Shopping Cart API',            description: 'Develop REST API endpoints for cart operations',           priority: 'Medium', status: 'In Progress', dueDate: '2026-06-15' },
      { title: 'Payment Gateway Integration',  description: 'Integrate Stripe/Razorpay for secure payments',           priority: 'High',   status: 'To Do',       dueDate: '2026-06-20' },
      { title: 'User Reviews Module',          description: 'Build review and rating system for products',             priority: 'Low',    status: 'To Do',       dueDate: '2026-06-25' },
    ],
    // Project 2 tasks
    [
      { title: 'Biometric Login Flow',         description: 'Implement fingerprint and face ID authentication',        priority: 'High',   status: 'In Progress', dueDate: '2026-06-05' },
      { title: 'Account Dashboard UI',         description: 'Design and build the main account overview screen',       priority: 'Medium', status: 'Done',        dueDate: '2026-06-01' },
      { title: 'Push Notification Service',    description: 'Set up Firebase Cloud Messaging for real-time alerts',    priority: 'Medium', status: 'To Do',       dueDate: '2026-06-12' },
      { title: 'Fund Transfer Module',         description: 'Build UPI and NEFT/RTGS transfer functionality',          priority: 'High',   status: 'In Progress', dueDate: '2026-06-18' },
      { title: 'Spending Analytics',           description: 'AI-powered categorization and spending trend charts',     priority: 'Low',    status: 'To Do',       dueDate: '2026-06-30' },
    ],
    // Project 3 tasks
    [
      { title: 'Employee Onboarding Wizard',   description: 'Multi-step onboarding form with document upload',         priority: 'High',   status: 'Done',        dueDate: '2026-05-28' },
      { title: 'Leave Management System',      description: 'Apply, approve, and track employee leaves',              priority: 'Medium', status: 'In Progress', dueDate: '2026-06-08' },
      { title: 'Payroll Calculator',           description: 'Automated salary calculation with tax deductions',        priority: 'High',   status: 'To Do',       dueDate: '2026-06-20' },
      { title: 'Performance Review Forms',     description: 'Quarterly review templates and feedback collection',      priority: 'Medium', status: 'To Do',       dueDate: '2026-06-25' },
      { title: 'Attendance Tracker',           description: 'Daily check-in/out with work hours summary',             priority: 'Low',    status: 'In Progress', dueDate: '2026-06-15' },
    ],
    // Project 4 tasks
    [
      { title: 'NLP Intent Recognition',       description: 'Train model to classify customer query intents',         priority: 'High',   status: 'In Progress', dueDate: '2026-06-10' },
      { title: 'Chat Widget UI',               description: 'Embed-ready chat widget with smooth animations',         priority: 'Medium', status: 'Done',        dueDate: '2026-05-30' },
      { title: 'Knowledge Base Integration',   description: 'Connect chatbot to FAQ and documentation database',      priority: 'High',   status: 'To Do',       dueDate: '2026-06-18' },
      { title: 'Escalation to Agent Flow',     description: 'Seamless handoff from bot to human support agent',       priority: 'Medium', status: 'To Do',       dueDate: '2026-06-22' },
      { title: 'Analytics & Metrics',          description: 'Track resolution rate, response time, user satisfaction',priority: 'Low',    status: 'To Do',       dueDate: '2026-06-28' },
    ],
    // Project 5 tasks
    [
      { title: 'Database Schema Design',       description: 'Design data warehouse schema for analytics',             priority: 'High',   status: 'Done',        dueDate: '2026-05-25' },
      { title: 'Interactive Charts Library',   description: 'Implement D3.js/Chart.js visualizations',                priority: 'Medium', status: 'In Progress', dueDate: '2026-06-08' },
      { title: 'KPI Widgets',                  description: 'Create configurable KPI cards with real-time data',      priority: 'High',   status: 'In Progress', dueDate: '2026-06-12' },
      { title: 'PDF Report Generator',         description: 'Auto-generate weekly/monthly PDF reports',               priority: 'Medium', status: 'To Do',       dueDate: '2026-06-20' },
      { title: 'Role-Based Data Access',       description: 'Restrict dashboard data based on user department',       priority: 'High',   status: 'To Do',       dueDate: '2026-06-25' },
    ],
  ];

  let taskCount = 0;
  for (let i = 0; i < createdProjects.length; i++) {
    const proj = createdProjects[i];
    const tasks = taskTemplates[i] || [];
    const startIdx = i * 5;
    const projectMembers = createdEmployees.slice(startIdx, startIdx + 5);

    for (let j = 0; j < tasks.length; j++) {
      const task = tasks[j];
      // Assign 1-3 random members to each task
      const numAssignees = Math.min(1 + (j % 3), projectMembers.length);
      const assignees = projectMembers.slice(0, numAssignees).map(m => m._id);

      try {
        const res = await fetch(`${API}/tasks`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...task,
            project: proj._id,
            assignee: assignees
          })
        });
        if (res.ok) {
          taskCount++;
          process.stdout.write('✓');
        } else {
          const errData = await res.json();
          process.stdout.write('x');
        }
      } catch {
        process.stdout.write('x');
      }
    }
    console.log(` → ${proj.name}`);
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   📊 Summary:`);
  console.log(`   • ${createdEmployees.length} employees`);
  console.log(`   • ${createdProjects.length} projects`);
  console.log(`   • ${taskCount} tasks`);
  console.log(`\n   Admin Login: Rahul123@hr.com / Admin@123`);
  console.log(`   Employee Login: Priya.patel@gmail.com / Pass@123`);
}

seed().catch(console.error);
