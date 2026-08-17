import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { Header } from '../../components/Header';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!');
      if (localStorage.getItem('pendingJob')) {
        navigate('/', { replace: true });
      } else {
        navigate('/pricing', { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Registration failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-orb bg-orb--4" />
      </div>
      <div className="bg-grid" />
      
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md z-10 glass-card border-none rounded-3xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-card-foreground">Create an account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign up to start chunking your videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-background/50 border-input text-foreground"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-input text-foreground"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/50 border-input text-foreground"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/50 border-input text-foreground"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="gradient-btn w-full" disabled={loading}>
              <span>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Up'}</span>
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
          </Card>
      </main>
    </>
  );
}
