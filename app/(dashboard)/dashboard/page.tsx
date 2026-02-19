import { db } from "@/db";
import { tasks, inquiries, users, notifications } from "@/db/schema";
import { sql, desc, gte, isNotNull, eq, and } from "drizzle-orm";
import { Gavel, MessageSquare, Clock, ArrowUpRight, Calendar, User, Activity } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Unified Counts
  const [taskCount] = await db.select({ count: sql<number>`count(*)` }).from(tasks);
  const [inquiryCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
  
  const [upcomingHearingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(gte(tasks.deadline, today));

  // 2. Fetch Recent Tasks with Hearing Dates & Assigned Counsel
  const upcomingDocket = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      deadline: tasks.deadline,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .where(isNotNull(tasks.deadline))
    .orderBy(desc(tasks.deadline))
    .limit(8);

  // 3. Fetch Recent Unread Notifications for the logged-in user
  const userId = parseInt(session.user.id, 10);
  const recentAlerts = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, isNaN(userId) ? 0 : userId),
        eq(notifications.isRead, false)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(3);

  return (
    <div className="min-h-screen bg-[#020203] text-white md:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              AMP <span className="text-neon-yellow">COMMAND</span>
            </h1>
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em]">Sector 44 // Gurugram Hub</p>
          </div>
          <Link href="/staff" className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-neon-yellow transition-colors uppercase tracking-widest bg-white/5 px-4 py-2 rounded">
            <User size={12} /> {session.user.role} // SYSTEM ACCESS
          </Link>
        </header>

        {/* --- KEY PERFORMANCE TILES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden py-2 rounded-sm">
          <StatTile label="Hearings Scheduled" value={upcomingHearingCount.count} icon={<Gavel size={16}/>} />
          <StatTile label="Active Protocols" value={taskCount.count} icon={<Clock size={16}/>} />
          <StatTile label="Client Inquiries" value={inquiryCount.count} icon={<MessageSquare size={16}/>} />
        </div>

        {/* --- DATA BOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 py-2 gap-8">
          
          {/* Upcoming Docket (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Calendar size={14} className="text-neon-yellow" /> Upcoming Docket
              </h2>
              <Link href="/tasks" className="text-[10px] bg-white text-black px-3 py-1 font-black uppercase italic hover:bg-neon-yellow transition-colors">
                View Full Board
              </Link>
            </div>

            <div className="space-y-1">
              {upcomingDocket.length > 0 ? upcomingDocket.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10 group">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-gray-600 w-12">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}) : "---"}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-tight group-hover:text-neon-yellow transition-colors">
                        {task.title}
                      </span>
                      <span className="text-[9px] text-electric-blue font-bold uppercase italic opacity-60">
                        Counsel: {task.assigneeName || "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <Link href={`/tasks`}>
                      <ArrowUpRight size={14} className="text-gray-800 group-hover:text-white transition-colors" />
                    </Link>
                  </div>
                </div>
              )) : (
                <p className="text-gray-800 font-mono text-[10px] py-10 text-center uppercase tracking-widest">No upcoming hearings found in system.</p>
              )}
            </div>
          </div>

          {/* Efficiency & System Feed (1 Column) */}
          <div className="space-y-6">
            
            {/* SYSTEM ALERTS FEED */}
            <div className="bg-[#0A0A0F] border border-white/5 p-5 rounded-sm">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Feed</p>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-vibrant-pink animate-pulse"></div>
                  <div className="w-1 h-1 bg-vibrant-pink animate-pulse delay-75"></div>
                </div>
              </div>

              <div className="space-y-4">
                {recentAlerts.length > 0 ? recentAlerts.map((alert) => (
                  <div key={alert.id} className="border-l-2 border-vibrant-pink pl-3 py-1">
                    <p className="text-[10px] font-bold text-white uppercase leading-tight truncate">
                      {alert.message}
                    </p>
                    <p className="text-[8px] font-mono text-gray-700 mt-1 uppercase italic">
                      {new Date(alert.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} // {alert.type}
                    </p>
                  </div>
                )) : (
                  <p className="text-[9px] font-mono text-gray-800 uppercase italic">No pending alerts.</p>
                )}
              </div>
              
              <Link href="/notifications" className="block mt-6 text-center py-2 border border-white/5 text-[8px] font-black text-gray-600 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                Open Full Comms
              </Link>
            </div>

            {/* EXECUTION RATE */}
            <div className="bg-[#0A0A0F] border border-white/5 p-6 rounded-sm">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Execution Rate</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-neon-yellow bg-neon-yellow/10">
                    Task Success
                  </span>
                  <span className="text-xs font-bold inline-block text-white">94%</span>
                </div>
                <div className="overflow-hidden h-1 mb-4 text-xs flex rounded bg-white/5">
                  <div style={{ width: "94%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-neon-yellow"></div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border border-dashed border-white/10 opacity-30 flex flex-col items-center justify-center text-center py-8">
              <p className="text-[9px] font-mono text-gray-600 uppercase">Docket Security</p>
              <p className="text-[10px] font-black text-white mt-2 italic">ENCRYPTED SESSION ACTIVE</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string, value: number, icon: any }) {
  return (
    <div className="bg-[#050508] p-10 hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-3 text-gray-500 mb-4">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="text-6xl font-black italic tracking-tighter group-hover:text-neon-yellow transition-colors">
        {value.toString().padStart(2, '0')}
      </p>
    </div>
  );
}