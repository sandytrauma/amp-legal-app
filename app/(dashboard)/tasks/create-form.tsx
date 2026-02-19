"use client"

import { createTask } from "@/lib/actions/tasks/action";
import { useRef } from "react";
import { User, Calendar } from "lucide-react";

interface StaffMember {
  id: number;
  name: string | null;
}

export default function CreateTaskForm({ staff }: { staff: StaffMember[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form 
      ref={formRef}
      action={async (fd) => {
        await createTask(fd);
        formRef.current?.reset();
      }}
      className="bg-[#0A0A0F] border border-white/10 p-8 rounded-sm space-y-6 mb-12 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue via-neon-yellow to-vibrant-pink opacity-50"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2 lg:col-span-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Task Objective</label>
          <input 
            name="title" 
            required
            placeholder="e.g., Draft Written Statement for Sharma vs State"
            className="w-full bg-black border border-white/5 p-4 text-sm text-white focus:border-neon-yellow outline-none transition-all placeholder:text-gray-800 italic"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
            <User size={12} className="text-electric-blue" /> Assign To
          </label>
          <select 
            name="assignedTo"
            required
            className="w-full bg-black border border-white/5 p-4 text-sm text-white focus:border-electric-blue outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Counsel...</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>{member.name || `Staff #${member.id}`}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
            <Calendar size={12} className="text-neon-yellow" /> Deadline
          </label>
          <input 
            name="deadline" 
            type="date"
            required
            className="w-full bg-black border border-white/5 p-4 text-sm text-white focus:border-neon-yellow outline-none transition-all invert brightness-90 grayscale"
          />
        </div>

        <div className="flex items-center gap-4 md:pt-8">
          <label className="relative inline-flex items-center cursor-pointer group">
            <input name="isPriority" type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-pink"></div>
            <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-gray-500 peer-checked:text-vibrant-pink">Priority Alpha</span>
          </label>
        </div>
      </div>

      <button type="submit" className="w-full bg-white text-black font-black uppercase italic py-4 text-xs tracking-[0.3em] hover:bg-neon-yellow transition-all active:scale-[0.98]">
        Execute Assignment
      </button>
    </form>
  );
}