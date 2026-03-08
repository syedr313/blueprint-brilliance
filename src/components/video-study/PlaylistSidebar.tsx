import { motion } from "framer-motion";
import { Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface VideoItem {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  status: string;
  position: number;
}

interface PlaylistSidebarProps {
  videos: VideoItem[];
  activeVideoDbId: string | null;
  onSelectVideo: (videoDbId: string) => void;
  watchProgress: Record<string, number>; // videoDbId -> percent
}

const PlaylistSidebar = ({ videos, activeVideoDbId, onSelectVideo, watchProgress }: PlaylistSidebarProps) => {
  if (videos.length <= 1) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Playlist ({videos.length} videos)
      </h3>
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
        {videos.map((v, idx) => {
          const isActive = v.id === activeVideoDbId;
          const progress = watchProgress[v.id] || 0;
          const statusIcon = v.status === "ready"
            ? <CheckCircle2 className="w-3 h-3 text-green-500" />
            : v.status === "extracting"
            ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            : v.status === "no_captions"
            ? <AlertCircle className="w-3 h-3 text-accent" />
            : null;

          return (
            <motion.button
              key={v.id}
              layout
              onClick={() => onSelectVideo(v.id)}
              className={`w-full text-left rounded-xl p-3 border transition-all flex gap-3 ${
                isActive ? "border-primary bg-primary/5 shadow-soft" : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{idx + 1}.</span>
                  {statusIcon}
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight mt-0.5">{v.title}</p>
                {progress > 0 && (
                  <div className="h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistSidebar;
