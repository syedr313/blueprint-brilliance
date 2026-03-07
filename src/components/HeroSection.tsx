import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Sparkles, Star, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-warm">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 7, delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            50 Interactive Levels • AI-Powered Learning
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-display-xl font-display mb-6"
          >
            Master English with{" "}
            <span className="text-gradient-hero">Lingual Quest</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            From alphabet basics to advanced rhetoric — learn English through 50 uniquely
            designed games, real-time speech recognition, and an AI tutor that adapts to you.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow hover:shadow-elevated transition-all hover:scale-105 flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Learning Free
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-card shadow-card hover:shadow-elevated transition-all text-foreground border border-border/50">
              <Play className="w-5 h-5 text-primary" />
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto mt-16"
          >
            {[
              { value: "50", label: "Interactive Levels" },
              { value: "4000+", label: "Words to Master" },
              { value: "5", label: "Live Class Sessions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:block">
          <motion.div
            className="absolute top-32 left-12 bg-card rounded-2xl shadow-card p-4 border border-border/50"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <Star className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Level Complete!</div>
                <div className="text-xs text-muted-foreground">⭐⭐⭐ 95%</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-16 bg-card rounded-2xl shadow-card p-4 border border-border/50"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦉</span>
              <div>
                <div className="text-xs font-semibold text-foreground">Lingua says</div>
                <div className="text-xs text-muted-foreground">"Great pronunciation!"</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
