"use server";

import { db } from "@/db";
import { statutoryMaster } from "@/db/schema";
import { fetchGeminiLegalResearch } from "@/lib/ai/gemini";
import { revalidatePath } from "next/cache";

export async function executeAIProtocol(query: string) {
  try {
    console.log(`[AI_SCAN]: Starting research for "${query}"`);

    // 1. Double check DB first
    const existing = await db.query.statutoryMaster.findFirst({
      where: (table, { ilike, or }) => or(
        ilike(table.section, `%${query}%`),
        ilike(table.actName, `%${query}%`)
      ),
    });

    if (existing) {
      console.log(`[AI_SCAN]: Record found in cache. Skipping AI.`);
      return { success: true };
    }

    // 2. Fetch from Gemini
    const intel = await fetchGeminiLegalResearch(query);
    
    if (!intel) {
      console.error("[AI_SCAN]: Gemini returned null.");
      return { success: false, error: "AI_FAILED" };
    }

    // 3. Insert into DB
    const inserted = await db.insert(statutoryMaster).values({
      actName: intel.actName.toUpperCase(),
      section: intel.section,
      description: intel.description,
      penalty: intel.penalty,
    }).returning(); // Adding .returning() ensures the query waits for completion

    console.log(`[AI_SCAN]: Success. Inserted ID: ${inserted[0].id}`);
    
    revalidatePath("/statutory"); // Clear cache
    return { success: true };
  } catch (error) {
    console.error("[AI_SCAN]: CRITICAL_ERROR", error);
    return { success: false, error: "DB_INSERT_FAILED" };
  }
}