import Sidebar from "@/components/dashboard/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { UserRole } from "@/types/next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Auth Guard
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 2. Safe ID Parsing (Prevents the NaN Runtime Error)
  // We extract the ID and force it to a valid integer. 
  // If it's missing, we use 0, which is a valid integer for SQL.
  const rawId = session.user.id;
  const parsedId = parseInt(typeof rawId === 'string' ? rawId : "0", 10);
  const safeUserId = isNaN(parsedId) ? 0 : parsedId;

  // 3. Database Fetch for Notifications
  const [unread] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, safeUserId),
        eq(notifications.isRead, false)
      )
    );

  // 4. Role Casting
  const userRole = (session.user.role as UserRole) || "CLERK";

  return (
    <div className="flex h-screen bg-[#050508] text-white">
      {/* Sidebar Component */}
      <Sidebar 
        userRole={userRole} 
        unreadCount={unread?.count || 0} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto m-2 custom-scrollbar">
        <div className="max-w-7xl mx-auto lg:m-4 p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}