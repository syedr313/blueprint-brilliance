import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Star, Play, RotateCcw } from "lucide-react";
import type { Level } from "@/data/levels";
import { moduleColors } from "@/data/levels";

interface LevelCardProps {
  level: Level;
  index: number;
}

const LevelCard = ({ level, index }: LevelCardProps) => {
  const colors = moduleColors[level.module - 1];
  const isCompleted = level.bestScore !== null;
  const canPlay = !level.isLocked;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={canPlay ? `/level/${level.id}` : "#"}
        className={`block relative rounded-2xl p-4 border transition-all ${
          level.isLocked
            ? "bg-muted/50 border-border/30 opacity-60 cursor-not-allowed"
            : "bg-card border-border/50 shadow-card hover:shadow-elevated hover:-translate-y-1 cursor-pointer"
        }`}
      >
        {/* Module indicator */}
        <div
          className="w-full h-1.5 rounded-full mb-3"
          style={{
            background: level.isLocked
              ? "hsl(var(--muted))"
              : `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
          }}
        />

        <div className="flex items-start justify-between mb-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: level.isLocked ? "hsl(var(--muted))" : `${colors.from}20`,
              color: level.isLocked ? "hsl(var(--muted-foreground))" : colors.from,
            }}
          >
            Level {level.id}
          </span>

          {level.isLocked ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : isCompleted ? (
            <div className="flex gap-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= level.stars ? "text-accent fill-accent" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <h4 className="font-display text-sm text-foreground mb-1 leading-tight">{level.title}</h4>
        <p className="text-xs text-muted-foreground">{level.moduleName}</p>

        {canPlay && (
          <div className="mt-3 flex items-center justify-between">
            {isCompleted ? (
              <>
                <span className="text-xs font-semibold text-success">{level.bestScore}%</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RotateCcw className="w-3 h-3" />
                  Replay
                </div>
              </>
            ) : (
              <div
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: colors.from }}
              >
                <Play className="w-3 h-3" />
                Start
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default LevelCard;
