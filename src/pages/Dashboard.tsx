import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AiTutor from "@/components/AiTutor";
import LevelCard from "@/components/LevelCard";
import { levels, moduleNames, moduleColors } from "@/data/levels";
import { Flame, Target, Trophy, BookOpen } from "lucide-react";

const Dashboard = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const filteredLevels = selectedModule
    ? levels.filter((l) => l.module === selectedModule)
    : levels;

  const completedCount = levels.filter((l) => l.bestScore !== null).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        {/* Welcome bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-2xl p-6 md:p-8 shadow-glow mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-primary-foreground mb-1">
                Welcome Back, Learner! 👋
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Continue your English learning journey. You're on Level 3!
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { icon: Flame, label: "Streak", value: "5 days" },
                { icon: Target, label: "Completed", value: `${completedCount}/50` },
                { icon: Trophy, label: "Best", value: "92%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-primary-foreground/10 rounded-xl px-4 py-3 text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary-foreground/80 mx-auto mb-1" />
                  <div className="text-sm font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Module filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedModule(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedModule === null
                ? "gradient-primary text-primary-foreground shadow-soft"
                : "bg-card text-muted-foreground border border-border/50 hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-1.5" />
            All Levels
          </button>
          {moduleNames.map((name, i) => (
            <button
              key={name}
              onClick={() => setSelectedModule(i + 1)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedModule === i + 1
                  ? "text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground border border-border/50 hover:text-foreground"
              }`}
              style={
                selectedModule === i + 1
                  ? { background: `linear-gradient(135deg, ${moduleColors[i].from}, ${moduleColors[i].to})` }
                  : {}
              }
            >
              Module {i + 1}
            </button>
          ))}
        </div>

        {/* Level grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredLevels.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} />
          ))}
        </div>
      </main>

      <AiTutor />
    </div>
  );
};

export default Dashboard;
