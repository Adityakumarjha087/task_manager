import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, User, Mail, Lock, AlertCircle, FolderKanban, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const validateEmail = (_email: string): string | null => {
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/signup', { name, email, password, phone, gender, role });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-primary-foreground shadow-xl shadow-primary/30 mb-6">
            <FolderKanban size={32} />
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tight">Join the Team</h2>
          <p className="text-muted-foreground mt-2 font-medium">Create your account to start managing tasks.</p>

          {/* Role Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="bg-muted p-1 rounded-full flex relative w-64 h-12 shadow-inner border border-border/50">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full shadow-lg transition-all duration-300 ease-in-out z-0 ${
                  role === 'Project Head' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
              />
              <button
                type="button"
                onClick={() => setRole('Employee')}
                className={`flex-1 relative z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  role === 'Employee' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setRole('Project Head')}
                className={`flex-1 relative z-10 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  role === 'Project Head' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Project Head
              </button>
            </div>
          </div>
        </div>

        <Card>
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-start space-x-3 animate-in shake duration-300">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-bold leading-tight">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
                  <Input
                    type="text"
                    required
                    className="pl-10 bg-background/50 border-border"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
                  <Input
                    type="email"
                    required
                    className="pl-10 bg-background/50 border-border"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 bg-background/50 border-border"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Phone</Label>
                  <Input
                    type="tel"
                    className="bg-background/50 border-border"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Gender</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 text-base font-bold flex items-center justify-center space-x-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 transition-transform'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={20} />
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-black text-primary hover:text-primary/80 transition-colors underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
