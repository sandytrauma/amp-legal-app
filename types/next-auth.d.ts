import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}

export type UserRole = "ADMIN" | "LAWYER" | "CLERK";

export interface SidebarProps {
  userRole: UserRole;
  unreadCount: number;
}