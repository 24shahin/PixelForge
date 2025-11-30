import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, X, Sparkles, Zap, Crown, Building } from 'lucide-react';

const Pricing = () => {
  const { user, upgradeToPremium } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out PixelForge',
      features: [
        { text: '3 image generations', included: true },
        { text: 'Basic quality', included: true },
        { text: 'Community support', included: true },
        { text: 'Standard styles', included: true },
        { text: 'HD quality', included: false },
        { text: 'Priority support', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Get Started',
      popular: false,
      action: () => navigate('/register'),
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$19',
      period: '/month',
      description: 'For creators who need more',
      features: [
        { text: 'Unlimited generations', included: true },
        { text: 'HD quality', included: true },
        { text: 'Priority support', included: true },
        { text: 'All styles unlocked', included: true },
        { text: 'Advanced prompting', included: true },
        { text: 'API access', included: true },
        { text: 'Commercial license', included: true },
      ],
      cta: 'Subscribe Now',
      popular: true,
      action: () => {
        if (!user) {
          toast.error('Please login first', { description: 'You need an account to subscribe.' });
          navigate('/login');
          return;
        }
        // Simulate subscription
        upgradeToPremium();
        toast.success('Welcome to Pro!', { description: 'You now have unlimited image generations!' });
      },
    },
    {
      name: 'Enterprise',
      icon: Building,
      price: 'Custom',
      period: '',
      description: 'For teams and businesses',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Custom model training', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'White-label option', included: true },
        { text: 'Team management', included: true },
        { text: 'Priority API access', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
      action: () => navigate('/contact'),
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
    },
    {
      question: 'Do unused free images expire?',
      answer: 'No, your free images never expire. Use them whenever you\'re ready.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely! You can change your plan at any time. Changes take effect immediately.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6"
            >
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Simple, transparent pricing</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Start free with 3 images. Upgrade when you need more power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'gradient-border bg-card glow-effect'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-display font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'gradient' : 'outline'}
                  className="w-full"
                  size="lg"
                  onClick={plan.action}
                >
                  {plan.cta}
                </Button>

                {user?.isPremium && plan.name === 'Pro' && (
                  <p className="text-center text-sm text-primary mt-4">
                    ✓ You're subscribed
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Compare <span className="gradient-text">Plans</span>
            </h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-display">Feature</th>
                  <th className="text-center py-4 px-4 font-display">Free</th>
                  <th className="text-center py-4 px-4 font-display text-primary">Pro</th>
                  <th className="text-center py-4 px-4 font-display">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Image Generations', '3', 'Unlimited', 'Unlimited'],
                  ['Image Quality', 'Basic', 'HD', 'HD + Custom'],
                  ['Support', 'Community', 'Priority', 'Dedicated'],
                  ['API Access', '✗', '✓', '✓ Priority'],
                  ['Commercial License', '✗', '✓', '✓'],
                  ['Custom Models', '✗', '✗', '✓'],
                ].map(([feature, free, pro, enterprise], index) => (
                  <motion.tr
                    key={feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50"
                  >
                    <td className="py-4 px-4">{feature}</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">{free}</td>
                    <td className="text-center py-4 px-4">{pro}</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">{enterprise}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-display font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to unleash your creativity?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start with 3 free images, no credit card required.
            </p>
            <Link to="/register">
              <Button variant="hero" size="xl">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
