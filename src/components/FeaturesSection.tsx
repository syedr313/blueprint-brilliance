import { motion } from "framer-motion";
import { Gamepad2, Mic, Brain, Video, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "50 Unique Games",
    description: "Each level features a uniquely designed interactive game — from alphabet avalanches to debate simulators.",
    gradient: "gradient-primary",
  },
  {
    icon: Mic,
    title: "Speech Recognition",
    description: "Real-time pronunciation feedback powered by advanced speech recognition technology.",
    gradient: "gradient-secondary",
  },
  {
    icon: Brain,
    title: "AI Tutor — Lingua",
    description: "An always-available AI assistant that answers questions at your level and adapts to your progress.",
    gradient: "gradient-accent",
  },
  {
    icon: Video,
    title: "Video Lessons",
    description: "Embedded video instruction for every level, with progress tracking and summarized notes.",
    gradient: "gradient-primary",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Skill radar charts, vocabulary growth tracking, and personalized weak-area recommendations.",
    gradient: "gradient-secondary",
  },
  {
    icon: Globe,
    title: "Live Classes",
    description: "Connect with real instructors after every module for practice, feedback, and pronunciation coaching.",
    gradient: "gradient-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md font-display mb-4">
            Everything You Need to{" "}
            <span className="text-gradient-primary">Master English</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Proven methodologies meets modern technology for the most engaging English learning experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
