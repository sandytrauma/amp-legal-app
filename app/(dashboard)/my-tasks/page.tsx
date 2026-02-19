import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { eq, and, ne, asc } from "drizzle-orm";
import { updateTaskDetails, toggleTaskStatus } from "@/lib/actions/tasks/action";
import { Gavel, Clock, Send, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default async function StaffPortal() {
  // SIMULATED: In a real app, you'd get this ID from your Auth session (Auth.js/Clerk)
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
        ne(tasks.status, "COMPLETED") // Focus only on active work
      )
    )
    .orderBy(asc(tasks.deadline));

  return (
    <div className="min-h-screen p-6 md:p-12 space-y-10">
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
          My <span className="text-electric-blue">Assignments</span>
        </h1>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mt-3">
          AMP LEGAL // PERSONAL OPERATIONAL QUEUE
        </p>
      </header>

      {myTasks.length > 0 ? (
        <div className="space-y-6">
          {myTasks.map((task) => (
            <div key={task.id} className="bg-[#0A0A0F] border border-white/10 rounded-sm overflow-hidden group hover:border-electric-blue/30 transition-all">
              
              {/* TASK HEADER */}
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01]">
                <div className="flex gap-4">
                  <form action={toggleTaskStatus.bind(null, task.id, task.status || "PENDING")}>
                    <button type="submit">
                      {task.status === "COMPLETED" ? <CheckCircle2 className="text-neon-yellow" /> : <Circle className="text-gray-800" />}
                    </button>
                  </form>
                  <div>
                    <h3 className="text-sm font-bold uppercase text-white tracking-tight">{task.title}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[9px] font-mono text-gray-700">REF_{task.id}</span>
                      {task.isPriority && <span className="text-[9px] font-black text-vibrant-pink uppercase">Priority</span>}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Next Hearing</p>
                  <p className="text-xs font-bold text-neon-yellow italic">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString('en-IN', {day:'2-digit', month:'short'}) : "TBD"}
                  </p>
                </div>
              </div>

              {/* ACTION AREA: PROCEDURAL UPDATE */}
              <div className="p-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-gray-600 flex items-center gap-2">
                    <Clock size={10} /> Case History
                  </span>
                  <div className="bg-black p-3 rounded-sm h-24 overflow-y-auto border border-white/5 text-[10px] font-mono text-gray-500 leading-relaxed">
                    {task.description || "No previous directions."}
                  </div>
                </div>

                <form action={updateTaskDetails} className="space-y-3">
                  <input type="hidden" name="taskId" value={task.id} />
                  <span className="text-[9px] font-black uppercase text-electric-blue flex items-center gap-2">
                    <Gavel size={10} /> Log Court Direction
                  </span>
                  <div className="flex gap-2">
                    <textarea 
                      name="newDirection" 
                      placeholder="Update the produce or judge's direction..."
                      className="flex-1 bg-white/5 border border-white/10 p-2 text-xs text-white outline-none focus:border-electric-blue h-12 resize-none"
                    />
                    <button type="submit" className="bg-white text-black px-4 hover:bg-electric-blue hover:text-white transition-all">
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-white/5">
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.5em]">No active protocols assigned to your ID.</p>
        </div>
      )}
    </div>
  );
}