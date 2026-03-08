import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AiTutor from "@/components/AiTutor";
import VideoStudyInput from "@/components/video-study/VideoStudyInput";
import TranscriptPanel from "@/components/video-study/TranscriptPanel";
import StudyQuizPanel from "@/components/video-study/StudyQuizPanel";
import PlaylistSidebar from "@/components/video-study/PlaylistSidebar";
import StudyGoalModal from "@/components/video-study/StudyGoalModal";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { supabase } from "@/integrations/supabase/client";
import {
  Clock, TrendingUp, Brain, PanelRightOpen, PanelRightClose,
  FileText, AlertCircle, BookOpen, Loader2, ListVideo, Target
} from "lucide-react";
import { toast } from "sonner";

interface SessionData {
  id: string;
  title: string;
  session_type: string;
  status: string;
  goal_days: number | null;
  goal_minutes_per_day: number | null;
  target_finish_date: string | null;
}

interface VideoData {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  status: string;
  position: number;
  duration_seconds: number;
}

interface SegmentData {
  id: string;
  segment_index: number;
  start_seconds: number;
  duration_seconds: number;
  text: string;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const VideoStudy = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeVideoDbId, setActiveVideoDbId] = useState<string | null>(null);
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [importing, setImporting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({});

  const activeVideo = videos.find(v => v.id === activeVideoDbId);
  const activeSession = sessions.find(s => s.id === activeSessionId);

  // YouTube player
  const handleTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
  }, []);

  const { seekTo, isReady } = useYouTubePlayer({
    videoId: activeVideo?.video_id || "",
    containerId: "yt-player",
    onTimeUpdate: handleTimeUpdate,
  });

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data } = await supabase.from("study_sessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSessions(data as SessionData[]);
  };

  // Load videos when session changes
  useEffect(() => {
    if (!activeSessionId) return;
    loadSessionVideos(activeSessionId);
  }, [activeSessionId]);

  const loadSessionVideos = async (sessionId: string) => {
    const { data } = await supabase.from("study_session_videos")
      .select("*")
      .eq("session_id", sessionId)
      .order("position", { ascending: true });
    if (data) {
      setVideos(data as VideoData[]);
      if (data.length > 0 && !activeVideoDbId) {
        setActiveVideoDbId(data[0].id);
      }
    }
  };

  // Load transcript when video changes
  useEffect(() => {
    if (!activeVideoDbId) { setSegments([]); return; }
    loadTranscript(activeVideoDbId);
  }, [activeVideoDbId]);

  const loadTranscript = async (videoDbId: string) => {
    const { data: tracks } = await supabase.from("transcript_tracks")
      .select("id")
      .eq("video_id", videoDbId)
      .eq("is_active", true)
      .limit(1);
    
    if (!tracks?.length) { setSegments([]); return; }

    const { data: segs } = await supabase.from("transcript_segments")
      .select("id, segment_index, start_seconds, duration_seconds, text")
      .eq("track_id", tracks[0].id)
      .order("segment_index", { ascending: true });
    
    setSegments((segs || []) as SegmentData[]);
  };

  // Save watch progress periodically
  useEffect(() => {
    if (!activeVideoDbId || duration <= 0) return;
    const pct = Math.min(100, (currentTime / duration) * 100);
    
    const timeout = setTimeout(() => {
      setWatchProgress(prev => ({ ...prev, [activeVideoDbId]: pct }));
      supabase.from("video_watch_progress").upsert({
        video_id: activeVideoDbId,
        current_time_seconds: currentTime,
        duration_seconds: duration,
        percent_watched: pct,
        completed: pct >= 95,
        last_watched_at: new Date().toISOString(),
      }, { onConflict: "user_id,video_id" }).then(() => {});
    }, 5000);

    return () => clearTimeout(timeout);
  }, [currentTime, activeVideoDbId, duration]);

  // Import handler
  const handleImport = async (url: string) => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-video", {
        body: { url },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const sessionId = data.sessionId;
      setPendingSessionId(sessionId);
      await loadSessions();
      
      // Show goal modal
      setShowGoalModal(true);
    } catch (e: any) {
      toast.error(e.message || "Failed to import video");
    } finally {
      setImporting(false);
    }
  };

  const handleGoalSet = async (goal: { days: number; minutesPerDay: number }) => {
    if (!pendingSessionId) return;
    const targetDate = new Date(Date.now() + goal.days * 86400000).toISOString();
    
    await supabase.from("study_sessions").update({
      goal_days: goal.days,
      goal_minutes_per_day: goal.minutesPerDay,
      target_finish_date: targetDate,
    }).eq("id", pendingSessionId);

    setActiveSessionId(pendingSessionId);
    setActiveVideoDbId(null);
    setShowGoalModal(false);
    setPendingSessionId(null);
    await loadSessions();
    toast.success("Study session created!");
  };

  const handleGoalSkip = () => {
    if (pendingSessionId) {
      setActiveSessionId(pendingSessionId);
      setActiveVideoDbId(null);
    }
    setShowGoalModal(false);
    setPendingSessionId(null);
    toast.success("Study session created!");
  };

  // Quiz
  const handleGenerateQuiz = async (mode: "quick" | "deep" = "quick") => {
    if (!activeVideoDbId) return;
    setQuizLoading(true);
    setShowQuiz(true);
    setQuizQuestions([]);

    try {
      // Check if quiz already exists
      const { data: existing } = await supabase.from("transcript_quizzes")
        .select("questions")
        .eq("video_id", activeVideoDbId)
        .eq("quiz_mode", mode)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing?.length && (existing[0].questions as any[]).length > 0) {
        setQuizQuestions(existing[0].questions as any[]);
        setQuizLoading(false);
        return;
      }

      // Generate new quiz
      const { data, error } = await supabase.functions.invoke("generate-study-quiz", {
        body: { videoDbId: activeVideoDbId, mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setQuizQuestions(data.quiz?.questions || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate quiz");
      setShowQuiz(false);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    if (!activeVideoDbId) return;
    // Get quiz id
    const { data: quizzes } = await supabase.from("transcript_quizzes")
      .select("id")
      .eq("video_id", activeVideoDbId)
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (quizzes?.length) {
      await supabase.from("transcript_quiz_attempts").insert({
        quiz_id: quizzes[0].id,
        score,
        total,
        answers: [],
      });
    }
    toast.success(`Quiz complete! ${score}/${total} correct`);
  };

  // Overall stats
  const totalProgress = Object.values(watchProgress).length
    ? Math.round(Object.values(watchProgress).reduce((a, b) => a + b, 0) / Object.values(watchProgress).length)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-secondary rounded-2xl p-6 md:p-8 shadow-glow mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-secondary-foreground mb-1">
                Video Study 📚
              </h1>
              <p className="text-secondary-foreground/80 text-sm">
                Import YouTube videos or playlists, read synced transcripts, and take AI quizzes
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-secondary-foreground/10 rounded-xl px-4 py-3 text-center">
                <BookOpen className="w-5 h-5 text-secondary-foreground/80 mx-auto mb-1" />
                <div className="text-sm font-bold text-secondary-foreground">{sessions.length}</div>
                <div className="text-xs text-secondary-foreground/60">Sessions</div>
              </div>
              <div className="bg-secondary-foreground/10 rounded-xl px-4 py-3 text-center">
                <TrendingUp className="w-5 h-5 text-secondary-foreground/80 mx-auto mb-1" />
                <div className="text-sm font-bold text-secondary-foreground">{totalProgress}%</div>
                <div className="text-xs text-secondary-foreground/60">Progress</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Import input */}
        <div className="mb-6">
          <VideoStudyInput onImport={handleImport} isLoading={importing} />
        </div>

        {/* Session selector */}
        {sessions.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSessionId(s.id); setActiveVideoDbId(null); setShowQuiz(false); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeSessionId === s.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  {s.session_type === "playlist" && <ListVideo className="w-3 h-3" />}
                  <span className="truncate max-w-[200px]">{s.title}</span>
                  {s.status === "ready" ? (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  ) : s.status === "failed" ? (
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        {activeSessionId && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Playlist sidebar */}
            {videos.length > 1 && (
              <div className="lg:col-span-3">
                <PlaylistSidebar
                  videos={videos}
                  activeVideoDbId={activeVideoDbId}
                  onSelectVideo={(id) => { setActiveVideoDbId(id); setShowQuiz(false); }}
                  watchProgress={watchProgress}
                />
              </div>
            )}

            {/* Main player area */}
            <div className={videos.length > 1 ? "lg:col-span-9" : "lg:col-span-12"}>
              {activeVideo ? (
                <div className="space-y-4">
                  {/* Player + Transcript */}
                  <div className={`flex gap-4 ${showTranscript && segments.length ? "flex-col xl:flex-row" : ""}`}>
                    <div className={showTranscript && segments.length ? "xl:flex-1" : "w-full"}>
                      <div className="aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-card bg-muted">
                        <div id="yt-player" className="w-full h-full" />
                      </div>
                    </div>

                    {showTranscript && segments.length > 0 && (
                      <div className="xl:w-96 xl:flex-shrink-0">
                        <TranscriptPanel
                          segments={segments}
                          currentTime={currentTime}
                          onSeek={seekTo}
                          visible={showTranscript}
                          onClose={() => setShowTranscript(false)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Video info & controls */}
                  <div className="bg-card rounded-2xl p-5 border border-border/50">
                    <h2 className="text-lg font-display text-foreground mb-3">{activeVideo.title}</h2>

                    {/* Progress bar */}
                    {duration > 0 && (
                      <div className="mb-4">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full gradient-primary"
                            animate={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
                        </div>
                      </div>
                    )}

                    {/* Goal info */}
                    {activeSession?.goal_days && (
                      <div className="flex items-center gap-2 mb-4 bg-primary/5 rounded-lg p-3 border border-primary/10">
                        <Target className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="text-xs text-foreground">
                          Goal: {activeSession.goal_minutes_per_day}min/day for {activeSession.goal_days} days
                          {activeSession.target_finish_date && (
                            <> — finish by <strong>{new Date(activeSession.target_finish_date).toLocaleDateString()}</strong></>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Transcript status */}
                    {activeVideo.status === "no_captions" && (
                      <div className="flex items-start gap-2 mb-4 bg-muted/50 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Transcript not available for this video. Captions may not be enabled.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {segments.length > 0 && (
                        <>
                          <button
                            onClick={() => handleGenerateQuiz("quick")}
                            disabled={quizLoading}
                            className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm shadow-soft hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                            Quick Quiz (8Q)
                          </button>
                          <button
                            onClick={() => handleGenerateQuiz("deep")}
                            disabled={quizLoading}
                            className="bg-accent text-accent-foreground px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <Brain className="w-4 h-4" /> Deep Review (15Q)
                          </button>
                          <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 ${
                              showTranscript
                                ? "bg-primary/10 text-primary border border-primary/30"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {showTranscript ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                            Transcript
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quiz */}
                  <AnimatePresence>
                    {showQuiz && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <StudyQuizPanel
                          questions={quizQuestions}
                          isLoading={quizLoading}
                          onComplete={handleQuizComplete}
                          onReviewSection={(start) => seekTo(start)}
                          onRetake={() => {}}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-12 border border-border/50 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
                  <h3 className="text-lg font-display text-foreground mb-2">Select a Video</h3>
                  <p className="text-sm text-muted-foreground">Choose a video from the playlist to start studying</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {sessions.length === 0 && !importing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl p-12 border border-border/50 text-center mt-4"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
            <h3 className="text-lg font-display text-foreground mb-2">Start Studying</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Paste a YouTube video or playlist URL above to import it. We'll extract the transcript,
              sync it with the player, and generate AI-powered quizzes based on what's actually taught.
            </p>
          </motion.div>
        )}
      </main>

      {/* Goal modal */}
      <AnimatePresence>
        {showGoalModal && pendingSessionId && (
          <StudyGoalModal
            videoTitle={sessions.find(s => s.id === pendingSessionId)?.title || "New Session"}
            isPlaylist={sessions.find(s => s.id === pendingSessionId)?.session_type === "playlist"}
            onSetGoal={handleGoalSet}
            onSkip={handleGoalSkip}
          />
        )}
      </AnimatePresence>

      <AiTutor />
    </div>
  );
};

export default VideoStudy;
