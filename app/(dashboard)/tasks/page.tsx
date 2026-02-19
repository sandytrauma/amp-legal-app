import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import CreateTaskForm from "./create-form";
import { Gavel, Activity, LayoutGrid, Terminal } from "lucide-react";

export default async function TaskProtocolPage() {
  const allTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      deadline: tasks.deadline,
      isPriority: tasks.isPriority,
      assigneeName: users.name,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .orderBy(desc(tasks.id));

  const staffMembers = await db.select({ id: users.id, name: users.name }).from(users);

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 flex flex-col gap-12">
      
      {/* --- COMMAND HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-end border-b border-white/[0.05] pb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-8 bg-neon-yellow shadow-[0_0_15px_#D4FF00]" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              TASK <span className="text-neon-yellow text-glow-yellow">PROTOCOL</span>
            </h1>
          </div>
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.6em] ml-4">
            DOCKET INTELLIGENCE // SECTOR_ASSIGNMENT_V4
          </p>
        </div>

        {/* SYSTEM STATS TOOLBAR */}
        <div className="flex items-center gap-8 bg-white/[0.02] border border-white/5 p-4 rounded-sm backdrop-blur-md">
          <div className="flex flex-col">
             <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Active_Nodes</span>
             <span className="text-xl font-black italic text-white leading-none">{allTasks.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/5" />
          <Activity size={20} className="text-neon-yellow animate-pulse" />
        </div>
      </header>

      {/* --- ACTION LAYER: CREATE TASK --- */}
      <div className="relative group">
        {/* Subtle glow behind the form */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-yellow/10 to-transparent blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
        
        <div className="relative bg-[#050508] border border-white/5 p-1 rounded-sm overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-white/[0.05] to-transparent">
             <div className="flex items-center gap-2 px-6 py-2 border-b border-white/[0.03]">
                <Terminal size={12} className="text-gray-700" />
                <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.3em]">Protocol_Initiation_Form</span>
             </div>
             <CreateTaskForm staff={staffMembers} />
          </div>
        </div>
      </div>

      {/* --- INTERFACE LAYER: KANBAN --- */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4 mb-4">
           <LayoutGrid size={16} className="text-neon-yellow" />
           <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Live_Visual_Board</h2>
           <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {/* The interactive Kanban Board with your custom styles */}
        <div className="relative">
           <KanbanBoard initialTasks={allTasks} />
           
           {/* Visual Frame Decorations */}
           <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-neon-yellow/30" />
           <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-neon-yellow/30" />
        </div>
      </div>

      {/* --- FOOTER STATUS --- */}
      <footer className="pt-10 border-t border-white/[0.03] flex justify-between items-center opacity-40">
        <div className="flex gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow" />
           <span className="text-[7px] font-mono uppercase tracking-[0.5em]">System_Encrypted</span>
        </div>
        <span className="text-[7px] font-mono uppercase tracking-[0.5em]">AMP_LEGAL_2026</span>
      </footer>
    </div>
  );
}