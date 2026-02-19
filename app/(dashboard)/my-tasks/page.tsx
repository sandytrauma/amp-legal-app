import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { eq, and, ne, asc } from "drizzle-orm";
import { updateTaskDetails, toggleTaskStatus } from "@/lib/actions/tasks/action";
import { Gavel, Clock, Send, CheckCircle2, Circle, AlertCircle, Zap, Terminal } from "lucide-react";

export default async function StaffPortal() {
  // In a production environment, this would come from your Auth session
  const currentUserId = 4; 

  const myTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      deadline: tasks.deadline,
      isPriority: tasks.isPriority,
    })
    .from(tasks)
    .where(
      and(
        eq(tasks.assignedTo, currentUserId),
        ne(tasks.status, "COMPLETED") 
      )
    )
    .orderBy(asc(tasks.deadline));

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 space-y-12">
      
      {/* --- HEADER: OPERATIONAL QUEUE --- */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-end border-b border-white/5 pb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-8 bg-electric-blue shadow-[0_0_15px_#00E0FF]" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              MY <span className="text-electric-blue">ASSIGNMENTS</span>
            </h1>
          </div>
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.5em] ml-4">
            OPERATIONAL QUEUE // AUTH_ID: 00{currentUserId}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-sm">
           <div className="text-right">
              <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Active_Protocols</p>
              <p className="text-xl font-black text-white italic leading-none">{myTasks.length.toString().padStart(2, '0')}</p>
           </div>
           <Terminal size={18} className="text-electric-blue" />
        </div>
      </header>

      {/* --- TASK GRID --- */}
      {myTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {myTasks.map((task) => (
            <div key={task.id} className="relative group bg-white/[0.01] border border-white/5 rounded-sm transition-all duration-500 hover:bg-white/[0.03]">
              
              {/* Vertical Neon Blade Accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${task.isPriority ? 'bg-vibrant-pink shadow-[0_0_15px_#FF00D4]' : 'bg-electric-blue shadow-[0_0_15px_#00E0FF]'} opacity-40 group-hover:opacity-100`} />

              <div className="p-8">
                {/* TASK METADATA */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                  <div className="flex gap-6">
                    <form action={toggleTaskStatus.bind(null, task.id, task.status || "PENDING")}>
                      <button type="submit" className="mt-1 hover:scale-110 transition-transform">
                        {task.status === "COMPLETED" 
                          ? <CheckCircle2 size={24} className="text-neon-yellow shadow-[0_0_10px_#D4FF00]" /> 
                          : <Circle size={24} className="text-gray-800 hover:text-white transition-colors" />
                        }
                      </button>
                    </form>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-electric-blue transition-colors">
                          {task.title}
                        </h3>
                        {task.isPriority && (
                          <span className="bg-vibrant-pink/10 text-vibrant-pink text-[7px] font-black uppercase px-2 py-0.5 border border-vibrant-pink/20 animate-pulse">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase">Ref_ID // 00{task.id}_LOG</p>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-4 rounded-sm min-w-[140px] text-center md:text-right">
                    <p className="text-[8px] text-gray-600 uppercase font-black tracking-[0.2em] mb-1">Target Deadline</p>
                    <p className={`text-sm font-black italic ${task.isPriority ? 'text-vibrant-pink' : 'text-neon-yellow'}`}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : "NOT_SPECIFIED"}
                    </p>
                  </div>
                </div>

                {/* ACTION SPLIT-VIEW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* PREVIOUS DIRECTIONS (Read-Only Terminal) */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 tracking-widest">
                      <Clock size={12} className="text-gray-700" /> Procedural History
                    </span>
                    <div className="bg-[#050508] p-5 rounded-sm h-32 overflow-y-auto border border-white/[0.03] text-[11px] font-mono text-gray-500 leading-relaxed custom-scrollbar relative">
                      <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[8px]">READ_ONLY</div>
                      {task.description || "NO_HISTORICAL_LOGS_FOUND."}
                    </div>
                  </div>

                  {/* INPUT AREA (Actionable) */}
                  <form action={updateTaskDetails} className="space-y-4">
                    <input type="hidden" name="taskId" value={task.id} />
                    <span className="text-[10px] font-black uppercase text-electric-blue flex items-center gap-2 tracking-widest">
                      <Gavel size={12} /> Log Court Direction
                    </span>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <textarea 
                        name="newDirection" 
                        placeholder="INPUT NEW CASE PROTOCOLS OR JUDGE DIRECTIONS..."
                        className="flex-1 bg-white/[0.03] border border-white/10 p-4 text-[11px] text-white outline-none focus:border-electric-blue/50 transition-all h-20 md:h-24 resize-none font-mono placeholder:text-gray-800"
                      />
                      <button 
                        type="submit" 
                        className="bg-white text-black px-6 py-4 md:py-0 hover:bg-neon-yellow transition-all flex items-center justify-center group/btn"
                      >
                        <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Decorative Footer Shimmer */}
              <div className="h-[1px] w-full bg-white/[0.02] relative overflow-hidden">
                 <div className="absolute inset-0 bg-electric-blue/20 w-1/3 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center border border-dashed border-white/5 rounded-sm">
          <Zap size={32} className="mx-auto text-gray-800 mb-6 opacity-20" />
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.5em] italic">Queue_Status: Null // No active assignments</p>
        </div>
      )}
    </div>
  );
}