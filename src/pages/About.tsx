import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Sparkles, Users, Target, Rocket, Heart, Globe } from 'lucide-react';

const About = () => {
  const team = [
    { name: 'Alex Chen', role: 'CEO & Founder', avatar: 'AC' },
    { name: 'Sarah Miller', role: 'CTO', avatar: 'SM' },
    { name: 'David Park', role: 'Lead Designer', avatar: 'DP' },
    { name: 'Emma Wilson', role: 'AI Engineer', avatar: 'EW' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Pushing the boundaries of AI-powered creativity.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive ecosystem for creators.',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Making AI art creation available to everyone.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Empowering creators worldwide to express themselves.',
    },
  ];

  const milestones = [
    { year: '2022', title: 'Founded', description: 'PixelForge was born from a passion for AI and creativity.' },
    { year: '2023', title: 'Public Launch', description: 'Opened our doors to creators worldwide.' },
    { year: '2024', title: '10M Images', description: 'Reached 10 million generated images milestone.' },
    { year: '2025', title: 'Global Expansion', description: 'Expanding to serve creators in 100+ countries.' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6"
            >
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">PixelForge</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              We're on a mission to democratize creativity through AI. Our platform empowers 
              anyone to transform their ideas into stunning visual art, regardless of their 
              artistic background or technical skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  PixelForge started with a simple question: What if everyone could create 
                  beautiful art, regardless of their technical skills?
                </p>
                <p>
                  Founded by a team of AI researchers and artists, we set out to build 
                  a platform that would make AI-powered image generation accessible, 
                  intuitive, and enjoyable for everyone.
                </p>
                <p>
                  Today, millions of creators use PixelForge to bring their imagination 
                  to life, from professional designers to hobbyists exploring their creativity.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden gradient-border">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden gradient-border">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop"
                  alt="AI Art"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:-translate-y-2 transition-transform"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {milestone.year.slice(2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <span className="text-sm text-primary font-medium">{milestone.year}</span>
                  <h3 className="font-display text-xl font-semibold mt-1">{milestone.title}</h3>
                  <p className="text-muted-foreground mt-2">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The people behind PixelForge.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  {member.avatar}
                </div>
                <h3 className="font-display font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
