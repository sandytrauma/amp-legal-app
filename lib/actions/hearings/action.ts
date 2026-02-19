"use server"

import { db } from "@/db";
import { hearings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function hitProxy(hearingId: number, clerkId: number) {
  try {
    await db.update(hearings)
      .set({ 
        proxyRequired: true,
        proxyStatus: 'HIT_SENT',
        // In a real app, you'd link the clerk here
      })
      .where(eq(hearings.id, hearingId));

    revalidatePath('/hearings');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to dispatch proxy" };
  }
}