import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { PasswordInput } from "../../components/ui/password-input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { Header } from "../../components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const user = response.data.user;
      login(response.data.token, user);
      toast.success("Logged in successfully!");
      
      if (user.role === 'admin') {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
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
            <CardTitle className="text-2xl text-card-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Email
                </label>
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-card-foreground ">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-input text-foreground"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="gradient-btn w-full"
                disabled={loading}
              >
                <span>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
