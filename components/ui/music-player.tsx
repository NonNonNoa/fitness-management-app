"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

/**
 * Phonk音楽プレーヤーコンポーネント
 * public/music/phonk.mp3 などの音楽ファイルを再生します
 */
export function MusicPlayer({ 
  src = "/music/phonk.mp3", 
  autoPlay = false,
  loop = true 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // デフォルト音量30%
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Audio play failed:", err);
        // 自動再生がブロックされた場合、ユーザー操作後に再生可能
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-3 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
      >
        <audio ref={audioRef} src={src} loop={loop} />
        
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Pause className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-1 bg-purple-500/20 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {!audioRef.current?.src && (
          <p className="text-xs text-purple-300/70 mt-2 text-center">
            音楽ファイルを public/music/phonk.mp3 に配置してください
          </p>
        )}
      </motion.div>
    </div>
  );
}

