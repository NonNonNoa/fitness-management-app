"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

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

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
}: {
  userId: string;
  type: "reminder" | "achievement" | "goal" | "system";
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


