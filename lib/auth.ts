import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Passkey", type: "password" }
      },
      async authorize(credentials) {
        // 1. DEFINING THE DEFAULT ADMIN (Hardcoded)
        const DEFAULT_ADMIN = {
          email: "admin@amplegal.com",
          passkey: "amp2026", // Your secure default password
          name: "Master Admin",
          role: "ADMIN"
        };

        if (!credentials?.email || !credentials?.password) return null;

        // 2. CHECK IF DEFAULT ADMIN IS LOGGING IN
        if (
          credentials.email === DEFAULT_ADMIN.email && 
          credentials.password === DEFAULT_ADMIN.passkey
        ) {
          return {
            id: "0", // Unique ID for default user
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email,
            role: DEFAULT_ADMIN.role,
          };
        }

        // 3. IF NOT DEFAULT, CHECK NEON DATABASE
       try {
    const userArray = await db.select()
      .from(users)
      .where(
        and(
          eq(users.email, credentials.email),
          eq(users.password, credentials.password)
        )
      )
      .limit(1);

    const user = userArray[0];

    // If no user found in DB, return null
    if (!user) return null;

    // FIX: Ensure role is a string and not null
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      // Use the '??' operator to provide a fallback if the DB value is null
      role: user.role ?? "LAWYER", 
    };
  } catch (error) {
    console.error("Auth Database Error:", error);
    return null;
  }
}
    })
  ],
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }
    return session;
  }
}
};