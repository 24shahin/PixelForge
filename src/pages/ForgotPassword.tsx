import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { sendRecoveryEmail } from '@/lib/auth';
import { toast } from 'sonner';
import { KeyRound, Mail, ArrowLeft, ArrowRight, Copy } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = sendRecoveryEmail(email);
    
    if (result.success) {
      toast.success('Recovery email sent!', { 
        description: 'Check your inbox for the recovery link.' 
      });
      if (result.token) {
        setRecoveryToken(result.token);
      }
    } else {
      toast.error('Failed to send recovery email', { description: result.message });
    }
    
    setIsLoading(false);
  };

  const copyToken = () => {
    if (recoveryToken) {
      navigator.clipboard.writeText(recoveryToken);
      toast.success('Token copied to clipboard');
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

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
                <KeyRound className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? 'Sending...' : 'Send Recovery Email'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>

            {/* Recovery Token Display (Demo) */}
            {recoveryToken && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20"
              >
                <p className="text-sm font-medium text-primary mb-2">Demo Recovery Token:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-background text-sm font-mono">
                    {recoveryToken}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyToken}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use this token on the recovery page to reset your password.
                </p>
                <Link to={`/recovery-password?email=${encodeURIComponent(email)}`}>
                  <Button variant="outline" className="w-full mt-3" size="sm">
                    Go to Recovery Page
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
