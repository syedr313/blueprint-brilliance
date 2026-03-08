
-- Study sessions (a video or playlist import)
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Session',
  session_type TEXT NOT NULL DEFAULT 'video' CHECK (session_type IN ('video', 'playlist')),
  playlist_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting_transcript', 'transcript_ready', 'generating_quiz', 'ready', 'failed')),
  goal_days INTEGER,
  goal_minutes_per_day INTEGER,
  target_finish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Videos within a session
CREATE TABLE public.study_session_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.study_sessions(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Video',
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'ready', 'no_captions', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transcript tracks per video
CREATE TABLE public.transcript_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.study_session_videos(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  track_kind TEXT NOT NULL DEFAULT 'manual' CHECK (track_kind IN ('manual', 'asr', 'unknown')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transcript segments
CREATE TABLE public.transcript_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES public.transcript_tracks(id) ON DELETE CASCADE NOT NULL,
  segment_index INTEGER NOT NULL DEFAULT 0,
  start_seconds REAL NOT NULL DEFAULT 0,
  duration_seconds REAL NOT NULL DEFAULT 0,
  text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Watch progress per video per user
CREATE TABLE public.video_watch_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.study_session_videos(id) ON DELETE CASCADE NOT NULL,
  current_time_seconds REAL NOT NULL DEFAULT 0,
  duration_seconds REAL NOT NULL DEFAULT 0,
  percent_watched REAL NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Quizzes generated per video
CREATE TABLE public.transcript_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.study_session_videos(id) ON DELETE CASCADE NOT NULL,
  quiz_mode TEXT NOT NULL DEFAULT 'quick' CHECK (quiz_mode IN ('quick', 'deep')),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  chunk_start_seconds REAL,
  chunk_end_seconds REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz attempts
CREATE TABLE public.transcript_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.transcript_quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- For now, allow public access (no auth required yet) - we'll add auth later
CREATE POLICY "Allow all access to study_sessions" ON public.study_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to study_session_videos" ON public.study_session_videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transcript_tracks" ON public.transcript_tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transcript_segments" ON public.transcript_segments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to video_watch_progress" ON public.video_watch_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transcript_quizzes" ON public.transcript_quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transcript_quiz_attempts" ON public.transcript_quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for progress tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_watch_progress;
