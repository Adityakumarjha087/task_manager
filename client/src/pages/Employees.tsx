import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Users, UserPlus, Trash2, Shield, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Employees: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'Employee' });
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/users');
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/users', newEmployee);
      setNewEmployee({ name: '', email: '', password: '', role: 'Employee' });
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee', err);
      }
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Shield size={64} className="text-destructive/50" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">You do not have permission to view or manage employees. Please contact your administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage employees and their access to the system.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <Button>
              <UserPlus size={20} className="mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new account for a team member to access the system.
              </DialogDescription>
            </DialogHeader>
            {error && <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <form onSubmit={handleCreateEmployee} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Note: Email must start with an uppercase letter. Admin access is automatically granted only to emails ending in <strong>@hr.com</strong>. All other emails will be registered as Employees.
              </p>
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee._id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${employee.name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{employee.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-foreground">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Mail size={14} className="mr-1" />
                        {employee.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center">
                    <Shield size={16} className={`mr-2 ${employee.role === 'Admin' ? 'text-purple-500' : 'text-blue-500'}`} />
                    <span className="text-sm font-semibold">{employee.role || 'Employee'}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteEmployee(employee._id)}>
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {employees.length === 0 && (
            <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
              <Users size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">No other employees found in the system.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Employees;
