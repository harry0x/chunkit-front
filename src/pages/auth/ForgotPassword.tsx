import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { Header } from '../../components/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Failed to send OTP');
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
          <CardTitle className="text-2xl text-card-foreground">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email to receive a reset OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button type="submit" className="gradient-btn w-full" disabled={loading}>
              <span>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}</span>
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Remember your password?{' '}
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
