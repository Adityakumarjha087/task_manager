import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Bell,
  Settings,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains('dark');
  });

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

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban className="w-5 h-5" /> },
  ];

  navItems.push({ name: 'Team', path: '/employees', icon: <Users className="w-5 h-5" /> });

  return (
    <div className="flex h-screen bg-background overflow-hidden w-full text-foreground">
      <aside className="hidden md:flex md:flex-col md:w-72 border-r shadow-sm z-20 bg-card">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <FolderKanban size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground">TaskFlow</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className={`mr-4 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/40">
          <div className="bg-muted/50 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-background border-b h-20 flex items-center justify-between px-6 md:px-10 z-10 sticky top-0">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mr-4 text-muted-foreground"
            >
              <Menu size={24} />
            </Button>
            <h2 className="text-xl font-bold text-foreground">
              {navItems.find(item => item.path === location.pathname)?.name || 
               (location.pathname === '/profile' ? 'Profile' : 'Project Details')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground rounded-full hover:bg-muted"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative text-muted-foreground rounded-full hover:bg-muted">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>
            <div className="h-8 w-px bg-border/60 mx-2"></div>
            
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="relative h-10 w-10 rounded-full border-0 outline-none hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none flex items-center justify-center"
              >
                <Avatar className="h-10 w-10 border border-border shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-popover ring-1 ring-border z-50 border border-border animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-1.5">
                    <div className="px-2 py-1.5 text-sm font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="h-px bg-border my-1 -mx-1.5"></div>
                    <button 
                      onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }} 
                      className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md flex items-center transition-colors"
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => setProfileMenuOpen(false)} 
                      className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md flex items-center transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <div className="h-px bg-border my-1 -mx-1.5"></div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <FolderKanban size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto pt-6 border-t border-border">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
