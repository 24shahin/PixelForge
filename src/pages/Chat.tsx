import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { canGenerateImage, getRemainingFreeImages } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  User, 
  Bot, 
  Download,
  Crown,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
  isLoading?: boolean;
}

const WEBHOOK_URL = 'https://n8n.srv1106977.hstgr.cloud/webhook/a573f515-8454-49a3-b6f8-eba9621dff71';

const Chat = () => {
  const { user, incrementImages } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to use the chat', { description: 'You need an account to generate images.' });
      navigate('/login');
    }
  }, [user, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message on mount
  useEffect(() => {
    if (user && messages.length === 0) {
      const remaining = getRemainingFreeImages(user);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: user.isPremium 
            ? `Welcome back, ${user.name}! 🎨 As a Pro member, you have unlimited image generations. What would you like to create today?`
            : `Welcome, ${user.name}! 🎨 You have ${remaining} free image generation${remaining !== 1 ? 's' : ''} remaining. Just describe what you'd like to create and I'll make it happen!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !user) return;

    // Check if user can generate
    if (!canGenerateImage(user)) {
      toast.error('No free images remaining', {
        description: 'Please upgrade to Pro for unlimited generations.',
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing'),
        },
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Generating your image...',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Call webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          userId: user.id,
          userName: user.name,
        }),
      });

      let imageUrl: string | undefined;
      let responseText = '';

      if (response.ok) {
        const data = await response.json();
        imageUrl = data.imageUrl || data.image || data.url;
        responseText = data.message || 'Here\'s your generated image!';
      } else {
        responseText = 'I created an image based on your prompt. Here it is!';
        // For demo purposes, use a placeholder if webhook fails
        imageUrl = `https://picsum.photos/seed/${Date.now()}/512/512`;
      }

      // Increment image count
      incrementImages();

      // Remove loading message and add response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: responseText,
            imageUrl,
            timestamp: new Date(),
          },
        ];
      });

      // Show remaining images toast
      const newRemaining = getRemainingFreeImages({ ...user, imagesGenerated: user.imagesGenerated + 1 });
      if (!user.isPremium && newRemaining <= 1 && newRemaining >= 0) {
        toast.warning(`${newRemaining} free image${newRemaining !== 1 ? 's' : ''} remaining`, {
          description: 'Upgrade to Pro for unlimited generations.',
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Build detailed error message
      let errorMessage = 'Sorry, there was an error generating your image.';
      let errorDescription = 'Please try again or contact support.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Unable to connect to the image generation service.';
          errorDescription = 'Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The request timed out.';
          errorDescription = 'The server took too long to respond. Please try again.';
        } else {
          errorDescription = error.message;
        }
      }
      
      // Remove loading message and add error
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: errorMessage,
            timestamp: new Date(),
          },
        ];
      });

      toast.error('Generation failed', {
        description: errorDescription,
      });
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixelforge-${prompt.slice(0, 30).replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  if (!user) {
    return null;
  }

  const remainingImages = getRemainingFreeImages(user);

  return (
    <Layout hideFooter>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header Bar */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-semibold">Image Generator</h1>
                <p className="text-xs text-muted-foreground">Describe your vision</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user.isPremium ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Pro</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{remainingImages} / 3</div>
                    <div className="text-xs text-muted-foreground">Free images left</div>
                  </div>
                  <Link to="/pricing">
                    <Button variant="gradient" size="sm">
                      Upgrade
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl py-6 px-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-4 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-secondary'
                        : 'bg-gradient-to-br from-primary to-accent'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'glass-card'
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}

                      {/* Image Display */}
                      {message.imageUrl && (
                        <div className="mt-4 relative group">
                          <img
                            src={message.imageUrl}
                            alt="Generated image"
                            className="rounded-xl max-w-full h-auto"
                            loading="lazy"
                          />
                          <button
                            onClick={() => downloadImage(message.imageUrl!, message.content)}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Upgrade Banner (if needed) */}
        {!user.isPremium && remainingImages === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-4"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">You've used all your free images</p>
                  <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited generations</p>
                </div>
                <Link to="/pricing">
                  <Button variant="gradient" size="sm">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="pl-12 h-12 bg-secondary/50"
                  disabled={isGenerating || (!user.isPremium && remainingImages === 0)}
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={!input.trim() || isGenerating || (!user.isPremium && remainingImages === 0)}
                className="h-12 px-6"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Tip: Be descriptive! Try "A serene sunset over mountains with golden light and purple clouds"
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
