import { db } from "@/db";
import { tasks, inquiries, users, notifications } from "@/db/schema";
import { sql, desc, gte, isNotNull, eq, and } from "drizzle-orm";
import { Gavel, MessageSquare, Clock, ArrowUpRight, Calendar, User, Activity, Zap } from "lucide-react";
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

  // 1. Data Fetching
  const [taskCount] = await db.select({ count: sql<number>`count(*)` }).from(tasks);
  const [inquiryCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
  const [upcomingHearingCount] = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(gte(tasks.deadline, today));

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

  const userId = parseInt(session.user.id, 10);
  const recentAlerts = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, isNaN(userId) ? 0 : userId), eq(notifications.isRead, false)))
    .orderBy(desc(notifications.createdAt))
    .limit(3);

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-end border-b border-white/5 pb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-8 bg-neon-yellow shadow-[0_0_15px_#D4FF00]" />
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                AMP <span className="text-neon-yellow text-glow-yellow">COMMAND</span>
              </h1>
            </div>
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.6em] ml-4">
              Sector 44 // Gurugram Central // {today.toLocaleDateString('en-IN', { weekday: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-sm backdrop-blur-md">
            <div className="text-right">
              <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Operator_Auth</p>
              <p className="text-[10px] font-black text-white uppercase italic">{session.user.name} // {session.user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-neon-yellow/10 flex items-center justify-center border border-neon-yellow/20">
              <Zap size={14} className="text-neon-yellow" />
            </div>
          </div>
        </header>

        {/* --- KPI TILES: VERTICAL BLADE STYLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatTile label="Hearings Scheduled" value={upcomingHearingCount.count} icon={<Gavel size={18}/>} />
          <StatTile label="Active Protocols" value={taskCount.count} icon={<Clock size={18}/>} />
          <StatTile label="Client Inquiries" value={inquiryCount.count} icon={<MessageSquare size={18}/>} />
        </div>

        {/* --- DATA BOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Upcoming Docket (Left 8 Columns) */}
          <div className="lg:col-span-8 space-y-6 bg-white/[0.01] border border-white/5 p-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Calendar size={120} />
            </div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                <span className="w-4 h-[1px] bg-neon-yellow" /> LIVE_DOCKET_FEED
              </h2>
              <Link href="/tasks" className="text-[9px] font-black text-neon-yellow border border-neon-yellow/30 px-4 py-2 hover:bg-neon-yellow hover:text-black transition-all uppercase italic">
                Access Full Board
              </Link>
            </div>

            <div className="space-y-1 relative z-10">
              {upcomingDocket.length > 0 ? upcomingDocket.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-5 bg-white/[0.01] hover:bg-white/[0.04] transition-all border-b border-white/[0.03] group relative">
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-neon-yellow group-hover:h-3/4 transition-all duration-300" />
                  
                  <div className="flex items-center gap-8">
                    <span className="text-[11px] font-mono text-gray-700 w-16 group-hover:text-white transition-colors">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}) : "---"}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-neon-yellow transition-colors">
                        {task.title}
                      </span>
                      <span className="text-[9px] text-electric-blue font-bold uppercase italic mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        Assigned Counsel: {task.assigneeName || "AWAITING_ALLOCATION"}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-800 group-hover:text-neon-yellow transition-all transform group-hover:-translate-y-1" />
                </div>
              )) : (
                <div className="py-20 text-center border border-dashed border-white/5">
                   <p className="text-gray-800 font-mono text-[10px] uppercase tracking-[0.5em] italic">Zero active protocol streams detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Efficiency & System Feed (Right 4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SYSTEM ALERTS FEED */}
            <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-vibrant-pink/5 blur-3xl rounded-full" />
              <div className="flex justify-between items-center mb-8 relative z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">System_Log</p>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-vibrant-pink animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-vibrant-pink/20" />
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                {recentAlerts.length > 0 ? recentAlerts.map((alert) => (
                  <div key={alert.id} className="border-l border-white/10 pl-4 py-1 hover:border-vibrant-pink transition-colors">
                    <p className="text-[10px] font-bold text-white uppercase leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[7px] font-mono text-vibrant-pink uppercase px-1.5 py-0.5 bg-vibrant-pink/10">{alert.type}</span>
                       <span className="text-[7px] font-mono text-gray-700 uppercase italic">
                         {new Date(alert.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-[9px] font-mono text-gray-800 uppercase italic">No pending uplink alerts.</p>
                )}
              </div>
              
              <Link href="/notifications" className="block mt-10 text-center py-3 border border-white/5 text-[9px] font-black text-gray-600 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.3em] italic">
                Sync Communication Hub
              </Link>
            </div>

            {/* PERFORMANCE METRIC */}
            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-sm overflow-hidden relative group">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">System_Efficiency</p>
              <div className="flex items-end justify-between mb-4">
                 <h4 className="text-4xl font-black italic tracking-tighter text-white">94<span className="text-neon-yellow font-mono text-xl">%</span></h4>
                 <Activity size={20} className="text-neon-yellow/30 group-hover:text-neon-yellow transition-colors" />
              </div>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                 <div className="absolute inset-0 bg-neon-yellow shadow-[0_0_10px_#D4FF00] w-[94%] transition-all duration-1000" />
                 <div className="absolute inset-0 bg-white/20 w-1/2 animate-shimmer" />
              </div>
              <p className="text-[8px] font-mono text-gray-800 uppercase mt-4 tracking-widest">Protocol Execution Rate // Global</p>
            </div>
            
            <div className="p-8 border border-dashed border-white/5 opacity-40 flex flex-col items-center justify-center text-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow animate-ping mb-4" />
              <p className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.4em]">Node_Sec_Protocol</p>
              <p className="text-[9px] font-black text-white mt-2 italic uppercase">End-to-End Encrypted</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string, value: number, icon: any }) {
  return (
    <div className="relative bg-white/[0.02] border border-white/5 p-10 hover:bg-white/[0.04] transition-all group overflow-hidden">
      {/* The Vertical Blade (Matches Sidebar) */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon-yellow shadow-[0_0_15px_#D4FF00] opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <div className="flex items-center gap-3 text-gray-600 mb-6 group-hover:text-white transition-colors">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</p>
      </div>
      <p className="text-7xl font-black italic tracking-tighter text-white group-hover:text-neon-yellow group-hover:glow-yellow transition-all duration-500 leading-none">
        {value.toString().padStart(2, '0')}
      </p>
      
      {/* Subtle Background Mark */}
      <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
         <Zap size={80} />
      </div>
    </div>
  );
}