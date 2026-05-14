import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, ChevronRight, User as UserIcon, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline?: string;
  admin: {
    _id: string;
    name: string;
  };
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '', deadline: '' });
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and collaborate on your team projects.</p>
        </div>
        
        { (user?.role === 'Admin' || user?.role === 'Project Head') && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={<Button />}>
              <Plus size={20} className="mr-2" />
              Create Project
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to start managing tasks with your team.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="What is this project about?"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Project</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="group outline-none"
          >
            <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <Briefcase size={24} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary transition-colors rounded-full h-8 w-8">
                    <ChevronRight size={18} />
                  </Button>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.description || 'No description provided for this project.'}
                </CardDescription>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter className="pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
                <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <UserIcon size={14} className="mr-2" />
                  <span className="truncate max-w-[100px]">Admin: {project.admin?.name || 'Unassigned'}</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center text-[10px] font-black text-amber-600 uppercase tracking-tighter ml-2">
                    <Calendar size={12} className="mr-1" />
                    {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                )}
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Active</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="text-center py-20 border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-muted-foreground mb-6 shadow-sm border border-border">
              <Briefcase size={40} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Create your first project to start managing tasks with your team.</p>
            { (user?.role === 'Admin' || user?.role === 'Project Head') && (
              <Button onClick={() => setIsModalOpen(true)} size="lg">
                <Plus size={20} className="mr-2" />
                Get Started
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projects;
