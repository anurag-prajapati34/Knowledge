import { ArrowRight, Brain, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      // Toast notification is fired in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 relative overflow-hidden text-black font-sans">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center space-x-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Brain className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-black tracking-tight font-serif-heading">
          Knowledge<span className="text-zinc-500">Base</span>
        </span>
      </Link>

      <Card className="w-full max-w-md p-8 bg-white border-zinc-200 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black tracking-tight font-serif-heading">Welcome Back</h2>
          <p className="text-xs text-zinc-600 mt-1.5">Sign in to access your knowledge bases & documents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-black hover:underline font-semibold underline-offset-4">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};
