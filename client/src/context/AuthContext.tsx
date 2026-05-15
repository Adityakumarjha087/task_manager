import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  role?: string;
  phone?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Inactivity Timeout (5 Minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        // Optional: notify user or redirect
      }, 5 * 60 * 1000); 
    };

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateUser = (userData: User) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
