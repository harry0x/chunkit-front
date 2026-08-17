import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { Header } from '../../components/Header';

export default function ResetPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email is missing. Go back and try again.');
      return;
    }
    setResending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('A new OTP has been sent to your email.');
      setResendTimer(60); // Reset timer
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Failed to resend OTP');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Failed to reset password');
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
          <CardTitle className="text-2xl text-card-foreground">Enter OTP</CardTitle>
          <CardDescription className="text-muted-foreground">
            Check your email for the 6-digit OTP
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
                readOnly={!!location.state?.email}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">OTP</label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="bg-background/50 border-input text-foreground tracking-widest text-center text-lg"
                placeholder="123456"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">New Password</label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <span>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}</span>
            </button>
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resending}
                className="text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline transition-opacity flex items-center justify-center h-8"
              >
                {resending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
        </Card>
      </main>
    </>
  );
}
