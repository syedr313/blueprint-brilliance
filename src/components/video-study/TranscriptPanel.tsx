import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PanelRightClose, MousePointerClick, ChevronUp, ChevronDown } from "lucide-react";

interface Segment {
  id: string;
  segment_index: number;
  start_seconds: number;
  duration_seconds: number;
  text: string;
}

interface TranscriptPanelProps {
  segments: Segment[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  visible: boolean;
  onClose: () => void;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const TranscriptPanel = ({ segments, currentTime, onSeek, visible, onClose }: TranscriptPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeIndex = useMemo(() => {
    for (let i = segments.length - 1; i >= 0; i--) {
      if (currentTime >= segments[i].start_seconds) return i;
    }
    return -1;
  }, [segments, currentTime]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-card rounded-2xl border border-border/50 flex flex-col h-full"
        style={{ maxHeight: "500px" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 flex-shrink-0">
          <h3 className="font-display text-foreground text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Live Transcript
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{segments.length} segments</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors ml-2">
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground/60 px-4 py-1.5 flex items-center gap-1 border-b border-border/20">
          <MousePointerClick className="w-3 h-3" /> Click any line to jump to that timestamp
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {segments.map((seg, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={seg.id}
                ref={isActive ? activeRef : undefined}
                onClick={() => onSeek(seg.start_seconds)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex gap-2 group ${
                  isActive
                    ? "bg-primary/10 text-foreground border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span className={`text-xs font-mono flex-shrink-0 mt-0.5 ${isActive ? "text-primary font-semibold" : "text-muted-foreground/50 group-hover:text-primary/60"}`}>
                  {formatTimestamp(seg.start_seconds)}
                </span>
                <span className="leading-relaxed">{seg.text}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TranscriptPanel;
