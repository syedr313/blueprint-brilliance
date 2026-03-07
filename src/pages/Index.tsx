import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ModulesPreview from "@/components/ModulesPreview";
import AiTutor from "@/components/AiTutor";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ModulesPreview />

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-display-md font-display mb-4">
              Ready to Begin Your <span className="text-gradient-primary">Quest?</span>
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Join thousands of learners on the path to English mastery. Start with Level 1 and work your way through all 50 levels.
            </p>
            <Link
              to="/dashboard"
              className="inline-block gradient-primary text-primary-foreground px-10 py-4 rounded-2xl font-semibold text-lg shadow-glow hover:shadow-elevated transition-all hover:scale-105"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display text-xs">LQ</span>
            </div>
            <span className="font-display text-foreground">Lingual Quest</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Lingual Quest. Making English learning accessible and engaging for everyone.
          </p>
        </div>
      </footer>

      <AiTutor />
    </div>
  );
};

export default Index;
