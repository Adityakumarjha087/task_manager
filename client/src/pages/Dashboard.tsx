import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  ListTodo, 
  AlertCircle,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Clock,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

interface Task {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
  priority?: string;
  assignee?: { _id: string; name: string }[];
  project?: { _id: string; name: string };
}

interface Stats {
  totalTasks: number;
  statusBreakdown: {
    todo: number;
    inProgress: number;
    done: number;
  };
  overdueTasks: number;
  assignedTasks: Task[];
  totalProjects: number;
}

const DonutChart: React.FC<{ todo: number; inProgress: number; done: number; total: number }> = ({ todo, inProgress, done, total }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = total || 1;
  
  const donePercent = done / safeTotal;
  const inProgressPercent = inProgress / safeTotal;
  const todoPercent = todo / safeTotal;

  const doneOffset = 0;
  const inProgressOffset = donePercent * circumference;
  const todoOffset = (donePercent + inProgressPercent) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#10b981" strokeWidth="20"
          strokeDasharray={`${donePercent * circumference} ${circumference}`}
          strokeDashoffset={-doneOffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#f59e0b" strokeWidth="20"
          strokeDasharray={`${inProgressPercent * circumference} ${circumference}`}
          strokeDashoffset={-inProgressOffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="20"
          strokeDasharray={`${todoPercent * circumference} ${circumference}`}
          strokeDashoffset={-todoOffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-foreground">{total}</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Tasks</span>
      </div>
    </div>
  );
};



const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
        setRecentTasks(data.assignedTasks?.slice(0, 8) || []);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const todo = stats?.statusBreakdown.todo || 0;
  const inProgress = stats?.statusBreakdown.inProgress || 0;
  const done = stats?.statusBreakdown.done || 0;
  const total = stats?.totalTasks || 0;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const cards = [
    { 
      label: 'Active Projects', 
      value: stats?.totalProjects || 0, 
      icon: <Briefcase size={24} />,
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+2 this week'
    },
    { 
      label: 'Total Tasks', 
      value: stats?.totalTasks || 0, 
      icon: <ListTodo size={24} />,
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
      change: `${inProgress} in progress`
    },
    { 
      label: 'Completed', 
      value: stats?.statusBreakdown.done || 0, 
      icon: <CheckCircle2 size={24} />,
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      change: `${completionRate}% completion`
    },
    { 
      label: 'Overdue', 
      value: stats?.overdueTasks || 0, 
      icon: <AlertCircle size={24} />,
      textColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
      change: 'Needs attention'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Welcome Back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>
        <Link to="/projects">
          <Button className="group bg-primary text-primary-foreground">
            View Projects
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Card key={idx} className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  {card.icon}
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 flex items-center gap-1">
                  <TrendingUp size={12} /> Live
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                <h3 className="text-3xl font-black text-foreground mt-1">{card.value}</h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium">{card.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <PieChart size={18} className="text-primary" />
                Task Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart todo={todo} inProgress={inProgress} done={done} total={total} />
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-muted-foreground">Done ({done})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-muted-foreground">Progress ({inProgress})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="text-xs font-bold text-muted-foreground">To Do ({todo})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                Task Progress Overview
              </CardTitle>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{completionRate}% Complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['To Do', 'In Progress', 'Done'].map((status) => {
                const val = status === 'To Do' ? todo :
                            status === 'In Progress' ? inProgress : done;
                const percentage = total > 0 ? Math.round((val / total) * 100) : 0;
                const barColor = status === 'Done' ? 'bg-emerald-500' : 
                                 status === 'In Progress' ? 'bg-amber-500' : 'bg-primary/40';
                const iconColor = status === 'Done' ? 'text-emerald-500' : 
                                  status === 'In Progress' ? 'text-amber-500' : 'text-primary/60';
                
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {status === 'Done' && <CheckCircle2 size={16} className={iconColor} />}
                        {status === 'In Progress' && <Clock size={16} className={iconColor} />}
                        {status === 'To Do' && <ListTodo size={16} className={iconColor} />}
                        <span className="text-sm font-bold text-foreground">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-foreground">{val}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 p-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Project Completion Rate</h3>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black">{completionRate}%</span>
                  <span className="text-primary-foreground/70 text-sm pb-2 font-medium">of all tasks completed</span>
                </div>
              </div>
              <Activity size={100} className="absolute -right-4 -bottom-4 text-primary-foreground/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ListTodo size={18} className="text-primary" />
                My Assigned Tasks
              </CardTitle>
              <Badge variant="secondary">{stats?.assignedTasks.length || 0} active</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {stats?.assignedTasks.map((task) => (
                <div key={task._id} className="flex items-center p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-sm transition-all cursor-default group">
                  <div className={`w-2.5 h-2.5 rounded-full mr-4 shrink-0 ${
                    task.status === 'Done' ? 'bg-emerald-500' : 
                    task.status === 'In Progress' ? 'bg-amber-500' : 'bg-primary/40'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-foreground truncate block">{task.title}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {task.priority && (
                      <Badge variant="secondary" className={`text-[9px] font-black uppercase tracking-wider border-0 ${
                        task.priority === 'High' ? 'bg-destructive/10 text-destructive' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {task.priority}
                      </Badge>
                    )}
                    <span className="text-[10px] font-black text-muted-foreground uppercase">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats?.assignedTasks || stats.assignedTasks.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-muted-foreground text-sm italic">No tasks assigned to you yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                Notifications
              </CardTitle>
              {recentTasks.length > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">{recentTasks.length}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500' : 
                    task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-primary/10 text-primary'
                  }`}>
                    {task.status === 'Done' ? <CheckCircle2 size={14} /> : 
                     task.status === 'In Progress' ? <Clock size={14} /> : 
                     <ListTodo size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground leading-tight">
                      Task assigned: <span className="text-primary">{task.title}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                      Status: {task.status} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No deadline'}
                    </p>
                  </div>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-3">
                    <Bell size={20} />
                  </div>
                  <p className="text-muted-foreground text-xs italic">No new notifications</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Assign tasks, track progress, and stay in sync with your team.</p>
            </div>
          </div>
          <Link to="/projects">
            <Button className="font-bold">
              Go to Projects <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
