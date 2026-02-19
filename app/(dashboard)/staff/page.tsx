import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { registerStaff, removeStaff } from "@/lib/actions/staff/action";
import { UserPlus, Shield, User, Trash2, Mail, Briefcase } from "lucide-react";

export default async function StaffPage() {
  const team = await db.select().from(users).orderBy(desc(users.id));

  return (
    <div className="p-6 md:p-12 space-y-12">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
          Personnel <span className="text-electric-blue">Registry</span>
        </h1>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] mt-3">
          AMP LEGAL // ROSTER MANAGEMENT
        </p>
      </header>

      {/* Register New Staff Form */}
      <section className="max-w-5xl">
        <form action={registerStaff} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-6 border border-white/10 rounded-sm">
          <input 
            name="name" 
            placeholder="Legal Name" 
            required 
            className="bg-black border border-white/10 p-4 text-xs text-white outline-none focus:border-electric-blue transition-all" 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Firm Email" 
            required 
            className="bg-black border border-white/10 p-4 text-xs text-white outline-none focus:border-electric-blue transition-all" 
          />
          <select 
            name="role" 
            required
            className="bg-black border border-white/10 p-4 text-xs text-white outline-none focus:border-electric-blue appearance-none cursor-pointer"
          >
            <option value="LAWYER">Lawyer</option>
            <option value="CLERK">Clerk</option>
            <option value="ADMIN">Managing Partner</option>
          </select>
          <button type="submit" className="bg-electric-blue text-white font-black uppercase italic text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
            <UserPlus size={14} /> Register Staff
          </button>
        </form>
      </section>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-[#0A0A0F] border border-white/5 p-6 rounded-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              {member.role === 'ADMIN' ? <Shield size={40} /> : <Briefcase size={40} />}
            </div>
            
            <div className="relative z-10 space-y-4">
              <div>
                <span className={`text-[8px] font-black px-2 py-1 rounded mb-2 inline-block ${
                  member.role === 'ADMIN' ? 'bg-vibrant-pink text-white' : 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                }`}>
                  {member.role}
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{member.name}</h3>
              </div>

              <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px]">
                <Mail size={12} /> {member.email}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">ID: {member.id.toString().padStart(3, '0')}</span>
                <form action={removeStaff.bind(null, member.id)}>
                  <button className="text-gray-800 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}