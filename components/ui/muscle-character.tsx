"use client";

import { motion } from "framer-motion";

/**
 * リアルな筋肉質なキャラクターコンポーネント
 * 詳細な筋肉の描写とリアルなプロポーション
 */
export function MuscleCharacter() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[500px] sm:h-[600px] md:h-[700px]">
      {/* 背景エフェクト - エネルギッシュな光の放射 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* 放射状の光の線 */}
          <svg className="w-full h-full" viewBox="0 0 500 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="energyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="rgba(168,85,247,0.8)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="rgba(236,72,153,0.8)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgba(168,85,247,0.8)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* 放射状の光の線 */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const x1 = 250;
              const y1 = 350;
              const x2 = 250 + Math.cos(angle) * 350;
              const y2 = 350 + Math.sin(angle) * 350;
              return (
                <motion.g
                  key={i}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#energyGradient)"
                    strokeWidth="2"
                    opacity={0.3}
                  />
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* メインキャラクター */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 500 700"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* リアルな肌のグラデーション */}
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b1f6b" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#2d1b4e" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#1a0d2e" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>
            
            {/* 筋肉のグラデーション */}
            <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#6d28d9" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
            </linearGradient>
            
            {/* 筋肉のハイライト */}
            <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#9333ea" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.4" />
            </linearGradient>
            
            {/* 影のグラデーション */}
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>
            
            {/* 髪のグラデーション */}
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="30%" stopColor="#a855f7" />
              <stop offset="60%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            
            {/* ハイライト */}
            <radialGradient id="highlightGradient" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            
            <filter id="characterGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="muscleGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* キャラクター本体 */}
          <g filter="url(#characterGlow)">
            {/* 頭部 - よりリアルな形状 */}
            <ellipse
              cx="250"
              cy="140"
              rx="65"
              ry="75"
              fill="url(#skinGradient)"
              stroke="#a855f7"
              strokeWidth="2.5"
              opacity="0.95"
            />
            
            {/* 頭部のハイライト */}
            <ellipse
              cx="240"
              cy="120"
              rx="35"
              ry="40"
              fill="url(#highlightGradient)"
              opacity="0.5"
            />
            
            {/* 紫のグローする髪 - よりリアルな形状 */}
            <g>
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i - 5) * 12;
                const baseX = 250;
                const baseY = 80;
                const x = baseX + Math.sin((angle * Math.PI) / 180) * 55;
                const y = baseY - Math.abs(Math.cos((angle * Math.PI) / 180)) * 45;
                const height = 50 + Math.random() * 20;
                return (
                  <motion.g
                    key={i}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      d={`M ${x} ${y} Q ${x + Math.sin((angle * Math.PI) / 180) * 25} ${y - height * 0.6} ${x + Math.sin((angle * Math.PI) / 180) * 20} ${y - height}`}
                      fill="url(#hairGradient)"
                      stroke="#ec4899"
                      strokeWidth="1.5"
                      opacity="0.95"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(168,85,247,0.9))",
                      }}
                    />
                  </motion.g>
                );
              })}
            </g>
            
            {/* 顔の特徴 - より詳細 */}
            {/* 眉 */}
            <path
              d="M 170 100 Q 200 95 230 100"
              stroke="#4c1d95"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* 目 - よりリアル */}
            <ellipse cx="220" cy="125" rx="10" ry="14" fill="#000000" />
            <ellipse cx="280" cy="125" rx="10" ry="14" fill="#000000" />
            {/* 目のハイライト */}
            <ellipse cx="222" cy="122" rx="5" ry="7" fill="#ffffff" />
            <ellipse cx="282" cy="122" rx="5" ry="7" fill="#ffffff" />
            {/* 瞳孔 */}
            <ellipse cx="223" cy="123" rx="2" ry="3" fill="#a855f7" />
            <ellipse cx="283" cy="123" rx="2" ry="3" fill="#a855f7" />
            
            {/* 鼻 - よりリアル */}
            <path
              d="M 250 135 Q 245 145 250 155 Q 255 145 250 135"
              fill="#4c1d95"
              stroke="#6d28d9"
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* 鼻の影 */}
            <path
              d="M 245 140 L 250 155 L 255 140"
              fill="url(#shadowGradient)"
              opacity="0.4"
            />
            
            {/* 頬骨のハイライト */}
            <ellipse cx="205" cy="145" rx="12" ry="8" fill="url(#highlightGradient)" opacity="0.3" />
            <ellipse cx="295" cy="145" rx="12" ry="8" fill="url(#highlightGradient)" opacity="0.3" />
            
            {/* 口 - よりリアルな表情 */}
            <path
              d="M 230 160 Q 250 165 270 160"
              stroke="#ec4899"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* 口の影 */}
            <path
              d="M 230 162 Q 250 167 270 162"
              stroke="#000000"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            
            {/* あごのライン */}
            <path
              d="M 220 180 Q 250 185 280 180"
              stroke="#4c1d95"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            
            {/* 首 - よりリアルな形状 */}
            <path
              d="M 220 215 Q 250 220 280 215 L 275 245 Q 250 250 225 245 Z"
              fill="url(#skinGradient)"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            {/* 首の影 */}
            <path
              d="M 220 215 L 225 245"
              fill="url(#shadowGradient)"
              opacity="0.5"
            />
            
            {/* 鎖骨 */}
            <path
              d="M 220 245 Q 250 248 280 245"
              stroke="#6d28d9"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            
            {/* 肩と三角筋 - より詳細 */}
            <g>
              {/* 左肩/三角筋 */}
              <ellipse
                cx="180"
                cy="260"
                rx="45"
                ry="35"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="3"
                transform="rotate(-15 180 260)"
                filter="url(#muscleGlow)"
              />
              {/* 左三角筋のハイライト */}
              <ellipse
                cx="175"
                cy="255"
                rx="25"
                ry="18"
                fill="url(#muscleHighlight)"
                opacity="0.6"
              />
              
              {/* 右肩/三角筋 */}
              <ellipse
                cx="320"
                cy="260"
                rx="45"
                ry="35"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="3"
                transform="rotate(15 320 260)"
                filter="url(#muscleGlow)"
              />
              {/* 右三角筋のハイライト */}
              <ellipse
                cx="325"
                cy="255"
                rx="25"
                ry="18"
                fill="url(#muscleHighlight)"
                opacity="0.6"
              />
            </g>
            
            {/* 胸筋 - より詳細な分離 */}
            <g>
              {/* 左胸筋 */}
              <path
                d="M 220 250 Q 235 280 220 320 Q 205 300 220 250"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="3"
                filter="url(#muscleGlow)"
              />
              {/* 左胸筋のハイライト */}
              <ellipse
                cx="215"
                cy="280"
                rx="18"
                ry="25"
                fill="url(#muscleHighlight)"
                opacity="0.7"
              />
              
              {/* 右胸筋 */}
              <path
                d="M 280 250 Q 265 280 280 320 Q 295 300 280 250"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="3"
                filter="url(#muscleGlow)"
              />
              {/* 右胸筋のハイライト */}
              <ellipse
                cx="285"
                cy="280"
                rx="18"
                ry="25"
                fill="url(#muscleHighlight)"
                opacity="0.7"
              />
              
              {/* 胸筋の中央の分離線 */}
              <path
                d="M 250 250 L 250 320"
                stroke="#9333ea"
                strokeWidth="2"
                opacity="0.8"
              />
            </g>
            
            {/* 前鋸筋（肋骨の下の筋肉） */}
            <g>
              {Array.from({ length: 4 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${220 + i * 8} 320 Q ${220 + i * 8} 340 ${210 + i * 8} 360`}
                  stroke="#6d28d9"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <path
                  key={`right-${i}`}
                  d={`M ${280 - i * 8} 320 Q ${280 - i * 8} 340 ${290 - i * 8} 360`}
                  stroke="#6d28d9"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              ))}
            </g>
            
            {/* 腹直筋 - よりリアルな6パック */}
            <g>
              {Array.from({ length: 6 }).map((_, i) => {
                const row = Math.floor(i / 2);
                const col = i % 2;
                const x = 235 + col * 30;
                const y = 330 + row * 20;
                return (
                  <g key={i}>
                    {/* 各腹筋のブロック */}
                    <rect
                      x={x - 12}
                      y={y - 8}
                      width="24"
                      height="16"
                      rx="3"
                      fill="url(#muscleGradient)"
                      stroke="#6d28d9"
                      strokeWidth="1.5"
                      opacity="0.9"
                      filter="url(#muscleGlow)"
                    />
                    {/* 腹筋のハイライト */}
                    <ellipse
                      cx={x}
                      cy={y - 2}
                      rx="8"
                      ry="5"
                      fill="url(#muscleHighlight)"
                      opacity="0.6"
                    />
                    {/* 腹筋の影 */}
                    <rect
                      x={x - 12}
                      y={y + 2}
                      width="24"
                      height="4"
                      fill="url(#shadowGradient)"
                      opacity="0.4"
                    />
                  </g>
                );
              })}
            </g>
            
            {/* 左腕 - より詳細な筋肉 */}
            <g>
              {/* 上腕二頭筋 */}
              <ellipse
                cx="140"
                cy="280"
                rx="28"
                ry="45"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
                transform="rotate(-25 140 280)"
                filter="url(#muscleGlow)"
              />
              {/* 上腕二頭筋のハイライト */}
              <ellipse
                cx="135"
                cy="275"
                rx="15"
                ry="25"
                fill="url(#muscleHighlight)"
                opacity="0.7"
              />
              
              {/* 上腕三頭筋 */}
              <ellipse
                cx="155"
                cy="300"
                rx="22"
                ry="35"
                fill="url(#muscleGradient)"
                stroke="#6d28d9"
                strokeWidth="2"
                transform="rotate(-20 155 300)"
                opacity="0.85"
              />
              
              {/* 前腕 */}
              <ellipse
                cx="110"
                cy="350"
                rx="20"
                ry="45"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
                transform="rotate(-35 110 350)"
                filter="url(#muscleGlow)"
              />
              {/* 前腕のハイライト */}
              <ellipse
                cx="108"
                cy="345"
                rx="12"
                ry="30"
                fill="url(#muscleHighlight)"
                opacity="0.6"
              />
              
              {/* 拳 */}
              <circle
                cx="95"
                cy="390"
                r="22"
                fill="url(#skinGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              {/* 拳のハイライト */}
              <ellipse
                cx="92"
                cy="385"
                rx="10"
                ry="12"
                fill="url(#highlightGradient)"
                opacity="0.5"
              />
              
              {/* 稲妻シンボル（拳の中） */}
              <motion.g
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 95 375 L 82 390 L 95 400 L 88 408 L 108 385 L 102 395 L 108 375 Z"
                  fill="#ffffff"
                  stroke="#ec4899"
                  strokeWidth="2"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(255,255,255,1)) drop-shadow(0 0 8px rgba(236,72,153,0.8))",
                  }}
                />
              </motion.g>
            </g>
            
            {/* 右腕 - より詳細な筋肉 */}
            <g>
              {/* 上腕二頭筋 */}
              <ellipse
                cx="360"
                cy="280"
                rx="28"
                ry="45"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
                transform="rotate(25 360 280)"
                filter="url(#muscleGlow)"
              />
              {/* 上腕二頭筋のハイライト */}
              <ellipse
                cx="365"
                cy="275"
                rx="15"
                ry="25"
                fill="url(#muscleHighlight)"
                opacity="0.7"
              />
              
              {/* 上腕三頭筋 */}
              <ellipse
                cx="345"
                cy="300"
                rx="22"
                ry="35"
                fill="url(#muscleGradient)"
                stroke="#6d28d9"
                strokeWidth="2"
                transform="rotate(20 345 300)"
                opacity="0.85"
              />
              
              {/* 前腕 */}
              <ellipse
                cx="390"
                cy="350"
                rx="20"
                ry="45"
                fill="url(#muscleGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
                transform="rotate(35 390 350)"
                filter="url(#muscleGlow)"
              />
              {/* 前腕のハイライト */}
              <ellipse
                cx="392"
                cy="345"
                rx="12"
                ry="30"
                fill="url(#muscleHighlight)"
                opacity="0.6"
              />
              
              {/* 拳 */}
              <circle
                cx="405"
                cy="390"
                r="22"
                fill="url(#skinGradient)"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              {/* 拳のハイライト */}
              <ellipse
                cx="408"
                cy="385"
                rx="10"
                ry="12"
                fill="url(#highlightGradient)"
                opacity="0.5"
              />
            </g>
            
            {/* 体全体のハイライト */}
            <ellipse
              cx="250"
              cy="290"
              rx="70"
              ry="100"
              fill="url(#highlightGradient)"
              opacity="0.3"
            />
            
            {/* 体の影 */}
            <ellipse
              cx="250"
              cy="320"
              rx="80"
              ry="120"
              fill="url(#shadowGradient)"
              opacity="0.4"
            />
          </g>
          
          {/* エネルギーのオーラ */}
          <motion.ellipse
            cx="250"
            cy="350"
            rx="180"
            ry="250"
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth="4"
            opacity="0.4"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "blur(12px)",
            }}
          />
        </svg>
      </div>
    </div>
  );
}
