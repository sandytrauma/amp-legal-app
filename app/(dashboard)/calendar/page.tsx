import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { asc, eq, and, gte, lte } from "drizzle-orm";
import { Gavel, Calendar as CalendarIcon, User, Clock } from "lucide-react";

export default async function WeeklyDocket() {
  // 1. Calculate the date range (Current Week)
  // We use .toISOString().split('T')[0] to ensure we send 'YYYY-MM-DD' 
  // if your column is a 'date' type, or a clean Date object for 'timestamp'.
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
      deadline: tasks.deadline, // This is your 'Next Hearing Date'
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

  // 3. Grouping Logic (Remains the same)
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
    <div className="min-h-screen p-6 md:p-12 space-y-10">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
            Weekly <span className="text-electric-blue">Docket</span>
          </h1>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mt-3">
            AMP LEGAL // 7-DAY OPERATIONAL FORECAST
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Active Hearings</p>
          <p className="text-2xl font-black text-white italic">{hearings.length}</p>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
        {weekDays.map((date) => {
          const dateKey = date.toDateString();
          const dayHearings = groupedHearings[dateKey] || [];
          const isToday = dateKey === new Date().toDateString();

          return (
            <div 
              key={dateKey} 
              className={`min-w-[300px] flex-1 flex flex-col rounded-sm border ${
                isToday ? 'border-electric-blue bg-electric-blue/[0.03]' : 'border-white/5 bg-[#07070B]'
              }`}
            >
              <div className={`p-4 border-b ${isToday ? 'border-electric-blue/50' : 'border-white/5'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-electric-blue' : 'text-gray-600'}`}>
                  {days[date.getDay()]}
                </p>
                <h2 className="text-xl font-black text-white italic">
                  {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </h2>
              </div>

              <div className="flex-1 p-3 space-y-3 min-h-[400px]">
                {dayHearings.length > 0 ? dayHearings.map((task: any) => (
                  <div key={task.id} className="p-4 bg-black border border-white/5 rounded-sm hover:border-electric-blue/40 transition-all group">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Gavel size={14} className="text-electric-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[8px] font-mono text-gray-700 font-bold uppercase tracking-tighter">REF_{task.id}</span>
                    </div>
                    <h3 className="text-[11px] font-bold text-white uppercase leading-tight mb-4">{task.title}</h3>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1.5">
                        <User size={10} className="text-gray-600" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight italic">
                          {task.assigneeName || "Unassigned"}
                        </span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-neon-yellow shadow-[0_0_8px_#ccff00]' : 'bg-gray-800'}`}></div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                    <Clock size={24} className="text-gray-600 mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">No Hearings</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}