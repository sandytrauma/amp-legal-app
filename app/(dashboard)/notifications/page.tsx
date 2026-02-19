import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { Bell, Check, Clock, MailOpen, Terminal, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  // 1. Production Security: Get the logged-in user
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) return <div>Security Error: Invalid Session</div>;

  // 2. Fetch notifications specific to this user
  const allNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  // 3. Server Action for UI responsiveness
  async function markAsRead(id: number) {
    "use server";
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    
    revalidatePath("/notifications");
    revalidatePath("/", "layout"); // Update the Sidebar badge
  }

  return (
    <div className="min-h-screen space-y-10">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
            System <span className="text-vibrant-pink">Alerts</span>
          </h1>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mt-3">
            AMP LEGAL // {session.user.role}_FEED_ACTIVE
          </p>
        </div>
        
        {allNotifications.length > 0 && (
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">
            {allNotifications.filter(n => !n.isRead).length} UNREAD TRANSMISSIONS
          </p>
        )}
      </header>

      <div className="max-w-4xl space-y-3">
        {allNotifications.length > 0 ? (
          allNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`group flex items-center justify-between p-5 border transition-all duration-300 ${
                notif.isRead 
                  ? "bg-transparent border-white/5 opacity-40 hover:opacity-100" 
                  : "bg-white/[0.02] border-white/10 border-l-vibrant-pink border-l-4 shadow-[L_0_20px_rgba(255,0,128,0.05)]"
              }`}
            >
              <div className="flex items-start gap-5">
                <div className={`mt-1 transition-colors ${notif.isRead ? "text-gray-800" : "text-vibrant-pink"}`}>
                  {notif.isRead ? (
                    <MailOpen size={18} strokeWidth={1.5} />
                  ) : (
                    <Bell size={18} strokeWidth={2.5} className="animate-pulse" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className={`text-sm font-bold tracking-tight uppercase ${notif.isRead ? "text-gray-500" : "text-white"}`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-gray-700 flex items-center gap-1.5 uppercase">
                      <Clock size={10} /> 
                      {new Intl.DateTimeFormat('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      }).format(notif.createdAt)}
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 text-gray-600 rounded-full uppercase tracking-tighter">
                      {notif.type || 'LOG'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2">
                {!notif.isRead && (
                  <form action={markAsRead.bind(null, notif.id)}>
                    <button 
                      title="Mark as Read"
                      className="p-2 text-gray-700 hover:text-vibrant-pink hover:bg-vibrant-pink/10 rounded-sm transition-all"
                    >
                      <Check size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-sm bg-white/[0.01]">
             <Terminal className="mx-auto mb-4 text-gray-800" size={32} />
             <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-700">
                No active transmissions in your sector.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}