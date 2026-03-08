import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AiTutor from "@/components/AiTutor";
import YouTubeQuiz, { type QuizQuestion } from "@/components/YouTubeQuiz";
import { supabase } from "@/integrations/supabase/client";
import {
  Youtube,
  Play,
  Clock,
  Brain,
  FileText,
  TrendingUp,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface VideoEntry {
  id: string;
  url: string;
  videoId: string;
  title: string;
  transcript: string | null;
  timeSpent: number; // seconds
  progress: number; // 0-100
  quizScores: { score: number; total: number; timestamp: number }[];
  addedAt: number;
}

const STORAGE_KEY = "yt-learning-videos";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const YouTubeLearning = () => {
  const [videos, setVideos] = useState<VideoEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [urlInput, setUrlInput] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeVideo = videos.find((v) => v.id === activeVideoId) || null;

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, [videos]);

  // Time tracking
  useEffect(() => {
    if (activeVideoId) {
      timerRef.current = setInterval(() => {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === activeVideoId
              ? { ...v, timeSpent: v.timeSpent + 10, progress: Math.min(100, v.progress + 0.05) }
              : v
          )
        );
      }, 10000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeVideoId]);

  const handleAddVideo = async () => {
    const videoId = extractVideoId(urlInput.trim());
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    if (videos.find((v) => v.videoId === videoId)) {
      toast.info("This video is already in your list");
      setActiveVideoId(videos.find((v) => v.videoId === videoId)!.id);
      setUrlInput("");
      return;
    }

    setFetchingVideo(true);
    let title = "YouTube Video";
    let transcript: string | null = null;

    try {
      const { data, error } = await supabase.functions.invoke("fetch-transcript", {
        body: { videoId },
      });
      if (!error && data) {
        title = data.title || title;
        transcript = data.transcript || null;
      }
    } catch (e) {
      console.error("Transcript fetch failed:", e);
    }

    const entry: VideoEntry = {
      id: crypto.randomUUID(),
      url: urlInput.trim(),
      videoId,
      title,
      transcript,
      timeSpent: 0,
      progress: 0,
      quizScores: [],
      addedAt: Date.now(),
    };

    setVideos((prev) => [entry, ...prev]);
    setActiveVideoId(entry.id);
    setUrlInput("");
    setFetchingVideo(false);
    toast.success("Video added to your learning list!");
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideoId === id) {
      setActiveVideoId(null);
      setShowQuiz(false);
    }
  };

  const handleGenerateQuiz = useCallback(async () => {
    if (!activeVideo) return;
    setQuizLoading(true);
    setShowQuiz(true);
    setQuizQuestions([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: {
          videoTitle: activeVideo.title,
          transcript: activeVideo.transcript,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setQuizQuestions(data.questions || []);
    } catch (e: any) {
      console.error("Quiz generation failed:", e);
      toast.error(e.message || "Failed to generate quiz");
      setShowQuiz(false);
    } finally {
      setQuizLoading(false);
    }
  }, [activeVideo]);

  const handleQuizComplete = (score: number, total: number) => {
    if (!activeVideoId) return;
    setVideos((prev) =>
      prev.map((v) =>
        v.id === activeVideoId
          ? {
              ...v,
              quizScores: [...v.quizScores, { score, total, timestamp: Date.now() }],
              progress: Math.min(100, v.progress + 15),
            }
          : v
      )
    );
    toast.success(`Quiz complete! ${score}/${total} correct`);
  };

  const totalTimeSpent = videos.reduce((a, v) => a + v.timeSpent, 0);
  const avgProgress = videos.length
    ? Math.round(videos.reduce((a, v) => a + v.progress, 0) / videos.length)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-secondary rounded-2xl p-6 md:p-8 shadow-glow mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-secondary-foreground mb-1">
                YouTube Learning Hub 🎬
              </h1>
              <p className="text-secondary-foreground/80 text-sm">
                Add any YouTube video, watch it, get AI-powered quizzes, and track your progress
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-secondary-foreground/10 rounded-xl px-4 py-3 text-center">
                <Clock className="w-5 h-5 text-secondary-foreground/80 mx-auto mb-1" />
                <div className="text-sm font-bold text-secondary-foreground">
                  {formatTime(totalTimeSpent)}
                </div>
                <div className="text-xs text-secondary-foreground/60">Time Spent</div>
              </div>
              <div className="bg-secondary-foreground/10 rounded-xl px-4 py-3 text-center">
                <TrendingUp className="w-5 h-5 text-secondary-foreground/80 mx-auto mb-1" />
                <div className="text-sm font-bold text-secondary-foreground">{avgProgress}%</div>
                <div className="text-xs text-secondary-foreground/60">Avg Progress</div>
              </div>
              <div className="bg-secondary-foreground/10 rounded-xl px-4 py-3 text-center">
                <Youtube className="w-5 h-5 text-secondary-foreground/80 mx-auto mb-1" />
                <div className="text-sm font-bold text-secondary-foreground">{videos.length}</div>
                <div className="text-xs text-secondary-foreground/60">Videos</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add video input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-card mb-6"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
                placeholder="Paste a YouTube video URL..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <button
              onClick={handleAddVideo}
              disabled={fetchingVideo || !urlInput.trim()}
              className="gradient-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold shadow-soft hover:shadow-glow transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {fetchingVideo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video list sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Your Videos ({videos.length})
            </h3>
            {videos.length === 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
                <Youtube className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No videos yet. Add one above!</p>
              </div>
            )}
            {videos.map((v) => (
              <motion.div
                key={v.id}
                layout
                className={`bg-card rounded-xl p-4 border cursor-pointer transition-all ${
                  activeVideoId === v.id
                    ? "border-primary shadow-soft"
                    : "border-border/50 hover:border-primary/30"
                }`}
                onClick={() => {
                  setActiveVideoId(v.id);
                  setShowQuiz(false);
                }}
              >
                <div className="flex gap-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatTime(v.timeSpent)}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{Math.round(v.progress)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVideo(v.id);
                    }}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round(v.progress)}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {activeVideo ? (
                <motion.div
                  key={activeVideo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Embedded player */}
                  <div className="aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-card">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>

                  {/* Video info & controls */}
                  <div className="bg-card rounded-2xl p-5 border border-border/50">
                    <h2 className="text-lg font-display text-foreground mb-3">{activeVideo.title}</h2>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Time: {formatTime(activeVideo.timeSpent)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Progress: {Math.round(activeVideo.progress)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="w-4 h-4" />
                        <span>Quizzes: {activeVideo.quizScores.length}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full gradient-primary"
                          animate={{ width: `${Math.round(activeVideo.progress)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(activeVideo.progress)}% completed
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleGenerateQuiz}
                        disabled={quizLoading}
                        className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm shadow-soft hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {quizLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                        Take Quiz
                      </button>
                      {activeVideo.transcript && (
                        <button
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="bg-muted text-foreground px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/80 transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Transcript
                          {showTranscript ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Transcript */}
                  <AnimatePresence>
                    {showTranscript && activeVideo.transcript && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-card rounded-2xl p-5 border border-border/50 max-h-80 overflow-y-auto">
                          <h3 className="font-display text-foreground mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Transcript
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {activeVideo.transcript}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quiz */}
                  <AnimatePresence>
                    {showQuiz && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <YouTubeQuiz
                          questions={quizQuestions}
                          onComplete={handleQuizComplete}
                          isLoading={quizLoading}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quiz history */}
                  {activeVideo.quizScores.length > 0 && (
                    <div className="bg-card rounded-2xl p-5 border border-border/50">
                      <h3 className="font-display text-foreground mb-3">📊 Quiz History</h3>
                      <div className="space-y-2">
                        {activeVideo.quizScores.map((qs, i) => {
                          const pct = Math.round((qs.score / qs.total) * 100);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-20">
                                Quiz #{i + 1}
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-foreground w-12 text-right">
                                {pct}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl p-12 border border-border/50 text-center"
                >
                  <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
                  <h3 className="text-lg font-display text-foreground mb-2">Select a Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a YouTube video URL above or select one from your list to start learning
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AiTutor />
    </div>
  );
};

export default YouTubeLearning;
