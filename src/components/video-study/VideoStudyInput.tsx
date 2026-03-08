import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Loader2, Link2, ListVideo } from "lucide-react";

interface VideoStudyInputProps {
  onImport: (url: string) => Promise<void>;
  isLoading: boolean;
}

const VideoStudyInput = ({ onImport, isLoading }: VideoStudyInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    if (!url.trim() || isLoading) return;
    await onImport(url.trim());
    setUrl("");
  };

  const isPlaylist = url.includes("list=");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-5 border border-border/50 shadow-card"
    >
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Paste a YouTube video or playlist URL..."
            className="w-full pl-10 pr-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim()}
          className="gradient-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaylist ? (
            <ListVideo className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          {isLoading ? "Importing..." : "Import"}
        </button>
      </div>
      {isPlaylist && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <ListVideo className="w-3 h-3" /> Playlist detected — all videos will be imported
        </p>
      )}
    </motion.div>
  );
};

export default VideoStudyInput;
