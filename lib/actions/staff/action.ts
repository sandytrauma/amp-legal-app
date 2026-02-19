"use server"

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createStaffMember(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "LAWYER" | "CLERK" | "CLIENT";

  try {
    await db.insert(users).values({
      name,
      email,
      password,
      role,
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("Failed to create staff:", error);
    return { success: false, error: "Email already exists or Database Error" };
  }
}

export async function registerStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  // Matching your schema roles: ADMIN, LAWYER, CLERK, or CLIENT
  const role = formData.get("role") as "ADMIN" | "LAWYER" | "CLERK";

  await db.insert(users).values({
    name,
    email,
    role,
    password: "temporary-password-123", // Required field based on your error
  });

  revalidatePath("/staff");
  revalidatePath("/tasks");
}

export async function removeStaff(id: number) {
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/staff");
  revalidatePath("/tasks");
}

