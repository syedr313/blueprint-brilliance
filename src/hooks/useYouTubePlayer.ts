import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerProps {
  videoId: string;
  containerId: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onStateChange?: (state: number) => void;
}

export function useYouTubePlayer({ videoId, containerId, onTimeUpdate, onStateChange }: UseYouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadAPI = useCallback(() => {
    if (window.YT && window.YT.Player) return Promise.resolve();
    return new Promise<void>((resolve) => {
      if (document.getElementById("yt-iframe-api")) {
        window.onYouTubeIframeAPIReady = resolve;
        return;
      }
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = resolve;
      document.head.appendChild(tag);
    });
  }, []);

  const initPlayer = useCallback(async () => {
    await loadAPI();
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    playerRef.current = new window.YT.Player(containerId, {
      videoId,
      playerVars: { rel: 0, modestbranding: 1, enablejsapi: 1 },
      events: {
        onReady: () => setIsReady(true),
        onStateChange: (e: any) => {
          const state = e.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          onStateChange?.(state);

          if (state === window.YT.PlayerState.PLAYING) {
            intervalRef.current = setInterval(() => {
              if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
                onTimeUpdate?.(playerRef.current.getCurrentTime(), playerRef.current.getDuration());
              }
            }, 350);
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        },
      },
    });
  }, [videoId, containerId, loadAPI, onTimeUpdate, onStateChange]);

  useEffect(() => {
    initPlayer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo?.(seconds, true);
  }, []);

  const getCurrentTime = useCallback(() => {
    return playerRef.current?.getCurrentTime?.() || 0;
  }, []);

  const getDuration = useCallback(() => {
    return playerRef.current?.getDuration?.() || 0;
  }, []);

  return { isReady, isPlaying, seekTo, getCurrentTime, getDuration, player: playerRef };
}
