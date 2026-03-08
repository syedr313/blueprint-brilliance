import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Calendar, Clock } from "lucide-react";

interface StudyGoalModalProps {
  videoTitle: string;
  isPlaylist: boolean;
  onSetGoal: (goal: { days: number; minutesPerDay: number }) => void;
  onSkip: () => void;
}

const StudyGoalModal = ({ videoTitle, isPlaylist, onSetGoal, onSkip }: StudyGoalModalProps) => {
  const [days, setDays] = useState(7);
  const [minutesPerDay, setMinutesPerDay] = useState(30);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl border border-border/50 shadow-elevated p-6 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <Target className="w-12 h-12 mx-auto mb-3 text-primary" />
          <h3 className="text-lg font-display text-foreground">Set Your Study Goal</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{videoTitle}</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              In how many days do you want to finish?
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={1} max={30} value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-bold text-foreground w-16 text-right">{days} days</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              How many minutes per day?
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={5} max={120} step={5} value={minutesPerDay}
                onChange={(e) => setMinutesPerDay(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-bold text-foreground w-16 text-right">{minutesPerDay}m</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-3 mt-5">
          <p className="text-xs text-muted-foreground text-center">
            📅 Target finish: <strong className="text-foreground">{new Date(Date.now() + days * 86400000).toLocaleDateString()}</strong>
            <br />⏱️ {minutesPerDay} min/day for {days} days
          </p>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors">
            Skip
          </button>
          <button
            onClick={() => onSetGoal({ days, minutesPerDay })}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all"
          >
            Set Goal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyGoalModal;
