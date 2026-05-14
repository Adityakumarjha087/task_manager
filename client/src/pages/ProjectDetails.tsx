import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  User as UserIcon,
  Users as UsersIcon,
  Calendar,

  ChevronRight,
  Layout,
  Search,
  UserPlus,
  UserMinus,
  Edit2,

  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline?: string;
  admin: { _id: string; name: string; email: string };
  members: { _id: string; name: string; email: string }[];
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: { _id: string; name: string }[];
}

interface SearchUser {
  _id: string;
  name: string;
  email: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignee: [] as string[]
  });

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    deadline: ''
  });

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setEditProjectData({
        name: projectRes.data.name,
        description: projectRes.data.description,
        deadline: projectRes.data.deadline ? projectRes.data.deadline.split('T')[0] : ''
      });
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch project details', err);
      setError(err.response?.data?.message || 'Failed to load project details. Please check your connection or permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setIsTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '',
        assignee: []
      });
      fetchData();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, editProjectData);
      setIsEditProjectOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to update project', err);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will delete all tasks within it.')) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const { data } = await api.get(`/users?search=${searchQuery}`);
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleMember = async (memberId: string, action: 'add' | 'remove') => {
    try {
      await api.put(`/projects/${id}/members`, { memberId, action });
      fetchData();
      if (action === 'add') {
        setSearchResults(results => results.filter(u => u._id !== memberId));
      }
    } catch (err) {
      console.error('Member update failed', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <Card className="m-8 border-destructive/50 bg-destructive/5">
      <CardContent className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">Error Loading Project</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </CardContent>
    </Card>
  );

  if (!project) return <Card className="text-center p-12 text-muted-foreground font-bold">Project not found.</Card>;

  const isPrivileged = user?.role === 'Admin' || user?.role === 'Project Head' || project.admin?._id === user?._id;
  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Layout size={120} />
        </div>
        <CardContent className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8">
          <div className="max-w-2xl">
            <nav className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <ChevronRight size={14} />
              <span className="text-primary">Detail</span>
            </nav>
            <h1 className="text-4xl font-black text-foreground tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-2 text-lg leading-relaxed">{project.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Project Lead</p>
                  <p className="text-sm font-bold text-foreground">{project.admin?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <UsersIcon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Team Size</p>
                  <p className="text-sm font-bold text-foreground">{project.members.length} Members</p>
                </div>
              </div>
              {project.deadline && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Deadline</p>
                    <p className="text-sm font-bold text-foreground">
                      {new Date(project.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             {isPrivileged && (
               <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
                 <DialogTrigger render={<Button variant="outline" className="group" />}>
                   <Edit2 size={18} className="mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                   Edit Project
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md">
                   <DialogHeader>
                     <DialogTitle>Edit Project Details</DialogTitle>
                     <DialogDescription>Update the name, description or deadline for this project.</DialogDescription>
                   </DialogHeader>
                   <form onSubmit={handleUpdateProject} className="space-y-4 pt-4">
                     <div className="space-y-2">
                       <Label>Project Name</Label>
                       <Input 
                         value={editProjectData.name}
                         onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                         required
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Description</Label>
                       <textarea 
                         className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                         value={editProjectData.description}
                         onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Deadline</Label>
                       <Input 
                         type="date"
                         value={editProjectData.deadline}
                         onChange={(e) => setEditProjectData({...editProjectData, deadline: e.target.value})}
                       />
                     </div>
                     <div className="flex justify-between items-center pt-4">
                       <Button variant="destructive" type="button" onClick={handleDeleteProject}>
                         <Trash2 size={16} className="mr-2" /> Delete
                       </Button>
                       <div className="flex space-x-2">
                         <Button variant="outline" type="button" onClick={() => setIsEditProjectOpen(false)}>Cancel</Button>
                         <Button type="submit">Save Changes</Button>
                       </div>
                     </div>
                   </form>
                 </DialogContent>
               </Dialog>
             )}

             <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
               <DialogTrigger render={<Button variant="outline" className="group" />}>
                 <UsersIcon size={18} className="mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                 Team
               </DialogTrigger>
               <DialogContent className="sm:max-w-xl h-[600px] flex flex-col">
                 <DialogHeader>
                   <DialogTitle>Team Members</DialogTitle>
                   <DialogDescription>Manage the members of this project.</DialogDescription>
                 </DialogHeader>
                 
                 {isPrivileged && (
                   <div className="mb-4">
                     <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 block">Search New Members</Label>
                     <div className="flex space-x-3">
                       <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                         <Input 
                           type="text" 
                           className="pl-10" 
                           placeholder="Search by name or email..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
                         />
                       </div>
                       <Button 
                         onClick={handleSearchUsers}
                         disabled={isSearching}
                       >
                         {isSearching ? '...' : 'Search'}
                       </Button>
                     </div>
                   </div>
                 )}

                 <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                   {searchResults.length > 0 && (
                     <div>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Search Results</p>
                       <div className="space-y-3">
                         {searchResults.map(u => (
                           <div key={u._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                             <div className="flex items-center space-x-3">
                               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                 {u.name.charAt(0)}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-foreground">{u.name}</p>
                                 <p className="text-xs text-muted-foreground">{u.email}</p>
                               </div>
                             </div>
                             <Button 
                               variant="ghost"
                               size="icon"
                               onClick={() => toggleMember(u._id, 'add')}
                               className="text-primary hover:text-primary hover:bg-primary/10"
                             >
                               <UserPlus size={20} />
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   <div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Project Members</p>
                     <div className="space-y-3">
                       {project.members.map(m => (
                         <div key={m._id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                               {m.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-foreground">{m.name}</p>
                               <p className="text-xs text-muted-foreground">{m.email}</p>
                             </div>
                           </div>
                           {isPrivileged && m._id !== project.admin?._id && (
                             <Button 
                               variant="ghost"
                               size="icon"
                               onClick={() => toggleMember(m._id, 'remove')}
                               className="text-destructive hover:text-destructive hover:bg-destructive/10"
                             >
                               <UserMinus size={20} />
                             </Button>
                           )}
                           {m._id === project.admin?._id && (
                             <Badge variant="secondary" className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 border-0">Admin</Badge>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </DialogContent>
             </Dialog>

             {isPrivileged && (
               <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                 <DialogTrigger render={<Button />}>
                   <Plus size={18} className="mr-2" />
                   Create Task
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-xl">
                   <DialogHeader>
                     <DialogTitle>Create New Task</DialogTitle>
                     <DialogDescription>Add a new task to this project.</DialogDescription>
                   </DialogHeader>
                   <form onSubmit={handleCreateTask} className="space-y-6 pt-4">
                     <div className="space-y-2">
                       <Label>Task Title</Label>
                       <Input
                         type="text"
                         required
                         autoFocus
                         placeholder="e.g. Design Landing Page"
                         value={newTask.title}
                         onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Description</Label>
                       <textarea
                         className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                         placeholder="Describe the task in detail..."
                         value={newTask.description}
                         onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Priority</Label>
                         <select
                           className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                           value={newTask.priority}
                           onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                         >
                           <option value="Low">Low</option>
                           <option value="Medium">Medium</option>
                           <option value="High">High</option>
                         </select>
                       </div>
                       <div className="space-y-2">
                         <Label>Due Date</Label>
                         <Input
                           type="date"
                           value={newTask.dueDate}
                           onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                         />
                       </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Assignees (select multiple)</Label>
                        <div className="max-h-40 overflow-y-auto rounded-md border border-input p-2 space-y-1">
                          {project.members.map(member => {
                            const isSelected = newTask.assignee.includes(member._id);
                            return (
                              <label key={member._id} className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    setNewTask(prev => ({
                                      ...prev,
                                      assignee: isSelected
                                        ? prev.assignee.filter(id => id !== member._id)
                                        : [...prev.assignee, member._id]
                                    }));
                                  }}
                                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium">{member.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                     <div className="pt-4 flex justify-end space-x-2">
                       <Button variant="outline" type="button" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                       <Button type="submit">Create Task</Button>
                     </div>
                   </form>
                 </DialogContent>
               </Dialog>
             )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {statuses.map(status => (
          <div key={status} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'Done' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                  status === 'In Progress' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                  'bg-primary/40'
                }`}></div>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">{status}</h2>
                <Badge variant="secondary" className="bg-muted text-muted-foreground font-black px-2 py-0 h-5 border-0">
                  {tasks.filter(t => t.status === status).length}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <Card key={task._id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-default">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`text-[9px] font-black uppercase tracking-wider border-0 ${
                        task.priority === 'High' ? 'bg-destructive/10 text-destructive' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {task.priority}
                      </Badge>
                      {isPrivileged && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {task.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-4">
                      <Calendar size={12} className="mr-1.5" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-border">
                      <div className="flex items-center">
                        {task.assignee && task.assignee.length > 0 ? (
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {task.assignee.slice(0, 3).map((a, i) => (
                                <div key={a._id || i} className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center ring-2 ring-background">
                                  {a.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                              ))}
                              {task.assignee.length > 3 && (
                                <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-[10px] font-black flex items-center justify-center ring-2 ring-background">
                                  +{task.assignee.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="ml-2.5 text-[11px] font-bold text-muted-foreground truncate max-w-[80px]">
                              {task.assignee.length === 1 ? (task.assignee[0]?.name || 'Unknown') : `${task.assignee.length} assigned`}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-[10px] font-black flex items-center justify-center ring-2 ring-background ring-offset-1">
                              ?
                            </div>
                            <span className="ml-2.5 text-[11px] font-bold text-muted-foreground">
                              Unassigned
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="relative">
                        <select 
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                          className="appearance-none text-[10px] font-black uppercase tracking-widest bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer pr-6 transition-colors"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <ChevronRight size={10} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
