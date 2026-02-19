"use server"

import { db } from "@/db";
import { notifications, tasks, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const deadline = formData.get("deadline") ? new Date(formData.get("deadline") as string) : null;
  const isPriority = formData.get("isPriority") === "on";
  const assignedTo = formData.get("assignedTo") ? Number(formData.get("assignedTo")) : null;

  await db.insert(tasks).values({
    title,
    deadline,
    isPriority,
    assignedTo,
    status: "PENDING",
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTaskDetails(formData: FormData) {
  const taskId = Number(formData.get("taskId"));
  const direction = formData.get("newDirection") as string;
  const nextHearing = formData.get("nextHearing") as string;

  // 1. Fetch the task to know who is updating it
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!task) throw new Error("Task not found");

  const updateData: any = { status: "IN_PROGRESS" };

  if (direction) {
    const timestamp = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
    const logEntry = `\n[${timestamp}]: ${direction}`;
    updateData.description = sql`COALESCE(${tasks.description}, '') || ${logEntry}`;
    
    // --- NOTIFICATION TRIGGER ---
    // Fetch all ADMIN users to notify them of this staff update
    const admins = await db.select().from(users).where(eq(users.role, "ADMIN"));
    
    // Create a notification for every Admin in the system
    for (const admin of admins) {
      await db.insert(notifications).values({
        userId: admin.id, // Recipient
        message: `Case Update: ${task.title} - "${direction.substring(0, 30)}..."`,
        type: "TASK_UPDATE",
        isRead: false,
      });
    }
  }

  if (nextHearing) updateData.deadline = new Date(nextHearing);

  // Update the task itself
  await db.update(tasks).set(updateData).where(eq(tasks.id, taskId));

  // Refresh data across the app
  revalidatePath("/tasks");
  revalidatePath("/notifications");
  revalidatePath("/", "layout"); // Crucial: refreshes the sidebar badge
}


export async function updateTaskStatus(taskId: number, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
  await db
    .update(tasks)
    .set({ status: newStatus })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tasks");
}
export async function toggleTaskStatus(id: number, currentStatus: string) {
  const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
  await db.update(tasks).set({ status: newStatus }).where(eq(tasks.id, id));
  revalidatePath("/tasks");
}