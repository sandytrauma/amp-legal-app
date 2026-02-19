import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { asc, eq, and, gte, lte } from "drizzle-orm";
import { Gavel, Calendar as CalendarIcon, User, Clock, ChevronRight, Zap } from "lucide-react";

export default async function WeeklyDocket() {
  // 1. Calculate the date range (Current Week)
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  end.setHours(23, 59, 59, 999);

  // 2. Fetch hearings scheduled for this week
  const hearings = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      deadline: tasks.deadline, 
      assigneeName: users.name,
      status: tasks.status,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .where(
      and(
        gte(tasks.deadline, start),
        lte(tasks.deadline, end)
      )
    )
    .orderBy(asc(tasks.deadline));

  // 3. Grouping Logic
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const groupedHearings = hearings.reduce((acc: any, task) => {
    if (!task.deadline) return acc;
    const dateKey = new Date(task.deadline).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 space-y-12">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-end border-b border-white/5 pb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-8 bg-electric-blue shadow-[0_0_15px_#00E0FF]" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              WEEKLY <span className="text-electric-blue">DOCKET</span>
            </h1>
          </div>
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.5em] ml-4">
            Operational Forecast // Period: {start.toLocaleDateString()} - {end.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-sm backdrop-blur-md">
           <div className="text-right">
              <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Active_Sessions</p>
              <p className="text-2xl font-black text-white italic leading-none">{hearings.length.toString().padStart(2, '0')}</p>
           </div>
           <Zap size={20} className="text-neon-yellow" />
        </div>
      </header>

      {/* --- HORIZONTAL DOCKET FEED --- */}
      <div className="flex gap-6 overflow-x-auto pb-10 snap-x custom-scrollbar">
        {weekDays.map((date) => {
          const dateKey = date.toDateString();
          const dayHearings = groupedHearings[dateKey] || [];
          const isToday = dateKey === new Date().toDateString();

          return (
            <div 
              key={dateKey} 
              className={`min-w-[320px] md:min-w-[380px] snap-start flex flex-col transition-all duration-500 ${
                isToday ? 'scale-[1.02] z-10' : 'opacity-80'
              }`}
            >
              {/* Day Tab */}
              <div className={`p-6 border-t-2 ${
                isToday ? 'border-electric-blue bg-electric-blue/5' : 'border-white/10 bg-white/[0.01]'
              } backdrop-blur-sm rounded-t-sm`}>
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-electric-blue' : 'text-gray-600'}`}>
                    {days[date.getDay()]} {isToday && "// TODAY"}
                  </p>
                  {isToday && <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-ping" />}
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter">
                  {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </h2>
              </div>

              {/* Hearings List */}
              <div className={`flex-1 p-4 space-y-4 min-h-[500px] border-x border-b ${
                isToday ? 'border-electric-blue/20 bg-electric-blue/[0.02]' : 'border-white/5 bg-black'
              }`}>
                {dayHearings.length > 0 ? dayHearings.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="group relative p-5 bg-white/[0.02] border border-white/5 hover:border-electric-blue/30 transition-all duration-300"
                  >
                    {/* Vertical Blade Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-electric-blue opacity-0 group-hover:opacity-100 shadow-[0_0_10px_#00E0FF] transition-all" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[8px] font-mono text-gray-700 font-bold uppercase tracking-widest group-hover:text-electric-blue transition-colors">
                        PROTOCOL_REF_{task.id}
                      </span>
                      <Gavel size={12} className="text-gray-800 group-hover:text-electric-blue transition-colors" />
                    </div>

                    <h3 className="text-[12px] font-bold text-white uppercase tracking-tight leading-relaxed mb-6 group-hover:translate-x-1 transition-transform">
                      {task.title}
                    </h3>

                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                           <User size={10} className="text-gray-500" />
                        </div>
                        <span className="text-[9px] font-black text-gray-500 uppercase italic group-hover:text-white transition-colors">
                          {task.assigneeName?.split(' ')[0] || "UNASSIGNED"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                           task.status === 'COMPLETED' 
                           ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20' 
                           : 'bg-white/5 text-gray-600 border border-white/5'
                         }`}>
                           {task.status}
                         </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="h-64 border border-dashed border-white/[0.03] flex flex-col items-center justify-center opacity-30">
                    <Clock size={20} className="text-gray-700 mb-3" />
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">Clear_Docket</p>
                  </div>
                )}
              </div>
              
              {/* Card Footer Decoration */}
              <div className="h-2 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
            </div>
          );
        })}
      </div>
    </div>
  );
}