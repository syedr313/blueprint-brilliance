import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { moduleNames, moduleColors } from "@/data/levels";
import { ArrowRight, BookOpen, Star } from "lucide-react";

const moduleDescriptions = [
  "Letters, sounds, basic words, and first sentences. Build your foundation.",
  "Verbs, adjectives, questions, and simple grammar structures.",
  "Idioms, reading, writing, debates, and intermediate mastery.",
  "Academic vocabulary, essays, passive voice, and formal English.",
  "Rhetoric, literary analysis, professional communication, and mastery.",
];

const ModulesPreview = () => {
  return (
    <section className="py-20 md:py-32 gradient-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md font-display mb-4">
            5 Modules, <span className="text-gradient-hero">50 Adventures</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Progress from zero to near-native proficiency through carefully crafted learning modules.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {moduleNames.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-elevated transition-all h-full flex flex-col">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${moduleColors[i].from}, ${moduleColors[i].to})`,
                  }}
                >
                  <span className="text-sm font-display text-primary-foreground">{i + 1}</span>
                </div>
                <h3 className="font-display text-base text-foreground mb-1">{name}</h3>
                <p className="text-xs text-muted-foreground flex-1 mb-3">{moduleDescriptions[i]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Levels {i * 10 + 1}–{(i + 1) * 10}
                  </span>
                  <Star className="w-4 h-4 text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow hover:shadow-elevated transition-all hover:scale-105"
          >
            Explore All Levels
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ModulesPreview;
