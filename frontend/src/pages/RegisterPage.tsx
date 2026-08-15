import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Brain, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

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

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });
      navigate('/dashboard');
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
          <h2 className="text-2xl font-bold text-black tracking-tight font-serif-heading">Create your Account</h2>
          <p className="text-xs text-zinc-600 mt-1.5">Start building private knowledge bases today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Johnson"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            leftIcon={<UserIcon className="w-4 h-4 text-zinc-500" />}
            autoFocus
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
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
            Create Free Account
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline font-semibold underline-offset-4">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
