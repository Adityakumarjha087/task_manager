import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Layout as LayoutIcon,
  Globe,
  Send,
  Briefcase
} from 'lucide-react';
import { Button } from "../components/ui/button";

const Landing: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, we can optionally redirect or just show the "Go to Dashboard" button
  // For now, let's just show the landing page with appropriate buttons.

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <LayoutIcon size={20} />
              </div>
              <span className="text-xl font-black tracking-tight">Task<span className="text-primary"> Manager </span></span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="default" className="font-bold">
                    Dashboard <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="font-bold">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                      Sign Up Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} />
            The Future of Team Management
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Manage Tasks with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-gradient">Zero Gravity.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The all-in-one platform for high-performance teams to plan, track, and execute projects with absolute precision and speed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 group">
                  Go to Dashboard
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 group">
                    Get Started Now
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl border-2">
                    Live Demo
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-3xl border border-border/50 bg-muted/30 p-2 backdrop-blur-sm shadow-2xl shadow-primary/5">
              <div className="rounded-2xl border border-border/50 bg-background overflow-hidden aspect-[16/9] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 opacity-20 group">
                  <LayoutIcon size={80} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-2xl font-black uppercase tracking-[0.2em]">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Powerful Features</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight">Everything you need to scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-amber-500" />,
                title: "Real-time Sync",
                description: "Collaborate with your team in real-time. Changes are reflected instantly across all devices."
              },
              {
                icon: <Shield className="text-blue-500" />,
                title: "Enterprise Security",
                description: "Role-based access control and encrypted data ensure your project information stays safe."
              },
              {
                icon: <BarChart3 className="text-emerald-500" />,
                title: "Advanced Analytics",
                description: "Track project progress with detailed charts and productivity metrics for your entire team."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-10">Trusted by modern companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-black italic tracking-tighter">VOLT</div>
            <div className="text-2xl font-black italic tracking-tighter">NEXUS</div>
            <div className="text-2xl font-black italic tracking-tighter">ORBIT</div>
            <div className="text-2xl font-black italic tracking-tighter">ATLAS</div>
            <div className="text-2xl font-black italic tracking-tighter">SPHERE</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] bg-primary p-12 md:p-20 overflow-hidden text-primary-foreground text-center shadow-2xl shadow-primary/30">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-tighter mb-8">
              Ready to accelerate <br />your team's workflow?
            </h2>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl">
                  Get Started Free
                </Button>
              </Link>
              <p className="text-primary-foreground/70 text-sm font-medium">No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground">
                <LayoutIcon size={14} />
              </div>
              <span className="text-lg font-black tracking-tight">Task Manager</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              &copy; 2026 Task Manager Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <Globe size={20} className="hover:text-primary transition-colors cursor-pointer" />
              <Send size={20} className="hover:text-primary transition-colors cursor-pointer" />
              <Briefcase size={20} className="hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
