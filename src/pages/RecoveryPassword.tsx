import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { verifyRecoveryToken, resetPassword } from '@/lib/auth';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Key, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const RecoveryPassword = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Verify token
    const isValidToken = verifyRecoveryToken(email, token);
    
    if (!isValidToken) {
      toast.error('Invalid or expired token', { 
        description: 'Please request a new recovery email.' 
      });
      setIsLoading(false);
      return;
    }

    // Reset password
    const result = resetPassword(email, newPassword);
    
    if (result.success) {
      setIsSuccess(true);
      toast.success('Password reset successful!', { 
        description: 'You can now login with your new password.' 
      });
    } else {
      toast.error('Failed to reset password', { description: result.message });
    }
    
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
            >
              <CheckCircle className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold mb-4">Password Reset!</h1>
            <p className="text-muted-foreground mb-8">
              Your password has been successfully reset.
            </p>
            <Link to="/login">
              <Button variant="gradient" size="lg">
                Go to Login
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4"
              >
                <ShieldCheck className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold mb-2">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your recovery token and new password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Recovery Token</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter recovery token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link
                to="/forgot-password"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Request new token
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RecoveryPassword;
