/**
 * @fileoverview Framer Motion関連のエクスポートとアニメーションバリアント
 * アプリ全体で使用する共通のアニメーション定義を提供
 */
"use client";

export { motion, AnimatePresence } from "framer-motion";
export type { Variants, Transition, TargetAndTransition } from "framer-motion";

/**
 * フェードインアニメーションバリアント
 * @example
 * <motion.div variants={fadeIn} initial="initial" animate="animate">
 *   コンテンツ
 * </motion.div>
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * 下から上へスライドするアニメーションバリアント
 * @example
 * <motion.div variants={slideUp} initial="initial" animate="animate">
 *   下からスライドイン
 * </motion.div>
 */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * 上から下へスライドするアニメーションバリアント
 * @example
 * <motion.div variants={slideDown} initial="initial" animate="animate">
 *   上からスライドイン
 * </motion.div>
 */
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * 左から右へスライドするアニメーションバリアント
 * @example
 * <motion.div variants={slideRight} initial="initial" animate="animate">
 *   左からスライドイン
 * </motion.div>
 */
export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * スケールアニメーションバリアント
 * @example
 * <motion.div variants={scale} initial="initial" animate="animate">
 *   スケールイン
 * </motion.div>
 */
export const scale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/**
 * 子要素を順次アニメーションさせるコンテナバリアント
 * staggerItemと組み合わせて使用する
 * @example
 * <motion.ul variants={staggerContainer} initial="initial" animate="animate">
 *   <motion.li variants={staggerItem}>アイテム1</motion.li>
 *   <motion.li variants={staggerItem}>アイテム2</motion.li>
 * </motion.ul>
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * 順次アニメーション用の子アイテムバリアント
 * staggerContainerと組み合わせて使用する
 * @example
 * <motion.li variants={staggerItem}>アイテム</motion.li>
 */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
