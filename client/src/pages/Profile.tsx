import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { User as UserIcon, Mail, Shield, Phone, Users, Save, X } from 'lucide-react';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.put('/users/profile', formData);
      updateUser(data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and personal information.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground font-medium">{user?.role || 'Team Member'}</p>
            </div>
            <Button variant="outline" className="w-full font-bold" onClick={() => alert('Avatar upload feature coming soon!')}>
              Edit Avatar
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 bg-background transition-colors">
                <div className="p-3 bg-primary/10 text-primary rounded-lg shrink-0">
                  <UserIcon size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Full Name</p>
                  {isEditing ? (
                    <Input name="name" value={formData.name} onChange={handleChange} className="max-w-md" />
                  ) : (
                    <p className="text-base font-bold text-foreground">{user?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 bg-background transition-colors">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                  <Mail size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Email Address (Read Only)</p>
                  <p className="text-base font-bold text-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 bg-background transition-colors">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
                  <Shield size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Role (Read Only)</p>
                  <p className="text-base font-bold text-foreground capitalize">{user?.role || 'Employee'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 bg-background transition-colors">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg shrink-0">
                  <Phone size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Phone Number</p>
                  {isEditing ? (
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Add phone number" className="max-w-md" />
                  ) : (
                    <p className="text-base font-bold text-foreground">{user?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 bg-background transition-colors">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg shrink-0">
                  <Users size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">Gender</p>
                  {isEditing ? (
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-base font-bold text-foreground capitalize">{user?.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button className="font-bold" onClick={handleSave} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
