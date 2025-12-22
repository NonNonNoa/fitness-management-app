/**
 * @fileoverview 通知に関するサーバーアクション
 * 通知の取得、作成、既読管理、削除などの操作を提供する
 */
"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

/**
 * ユーザーの通知一覧を取得する
 * @param {number} [limit=20] - 取得件数
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>} 通知一覧（作成日降順）
 */
export async function getNotifications(limit = 20) {
  try {
    const session = await requireSession();
    
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return { success: false, error: "Failed to get notifications" };
  }
}

/**
 * 未読通知の件数を取得する
 * @returns {Promise<{success: boolean, count?: number, error?: string}>} 未読件数
 */
export async function getUnreadCount() {
  try {
    const session = await requireSession();
    
    const result = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.isRead, false)
        )
      );

    return { success: true, count: result.length };
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return { success: false, error: "Failed to get count" };
  }
}

/**
 * 指定の通知を既読にする
 * @param {string} notificationId - 通知ID
 * @returns {Promise<{success: boolean, error?: string}>} 更新結果
 */
export async function markAsRead(notificationId: string) {
  try {
    const session = await requireSession();
    
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to mark as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

/**
 * 全ての通知を既読にする
 * @returns {Promise<{success: boolean, error?: string}>} 更新結果
 */
export async function markAllAsRead() {
  try {
    const session = await requireSession();
    
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

/**
 * 通知タイプの型定義
 * - reminder: リマインダー
 * - achievement: 実績達成
 * - goal: 目標関連
 * - system: システム通知
 */
type NotificationType = "reminder" | "achievement" | "goal" | "system";

/**
 * 新しい通知を作成する
 * @param {Object} params - 通知パラメータ
 * @param {string} params.userId - 対象ユーザーID
 * @param {NotificationType} params.type - 通知タイプ
 * @param {string} params.title - 通知タイトル
 * @param {string} params.message - 通知メッセージ
 * @param {string} [params.actionUrl] - アクションURL（オプション）
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} 作成された通知
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}) {
  try {
    const result = await db.insert(notifications).values({
      id: generateId(),
      userId,
      type,
      title,
      message,
      actionUrl,
    }).returning();

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

/**
 * 通知を削除する
 * @param {string} notificationId - 削除する通知のID
 * @returns {Promise<{success: boolean, error?: string}>} 削除結果
 */
export async function deleteNotification(notificationId: string) {
  try {
    const session = await requireSession();
    
    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}
