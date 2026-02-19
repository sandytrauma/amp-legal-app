import { db } from "@/db";
import { users } from "@/db/schema";
import { createStaffMember } from "@/lib/actions/staff/action";
import { authOptions } from "@/lib/auth";
import { ShieldCheck, UserPlus, Mail, Key } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StaffPage() {
 const session = await getServerSession(authOptions);

  // STRICT ROLE CHECK: Only ADMIN can enter
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard"); // Boot them out if they aren't Admin
  }

  const staff = await db.select().from(users);
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
          Staff <span className="text-neon-yellow">Registry</span>
        </h2>
        <p className="text-gray-500 font-mono text-xs mt-1">AMP-OS // ACCESS CONTROL</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Registration Form */}
        <div className="lg:col-span-1 bg-[#0A0A0F] border border-electric-blue/30 p-8 shadow-[0_0_30px_rgba(0,51,255,0.05)]">
          <h3 className="text-white font-bold uppercase italic mb-6 flex items-center gap-2">
            <UserPlus size={18} className="text-neon-yellow" /> Create Access ID
          </h3>
          
          <form 
  action={async (formData) => {
    await createStaffMember(formData);
  }} className="space-y-4">
            <input 
              name="name" 
              placeholder="Full Name" 
              required 
              className="w-full bg-black border border-gray-800 p-3 text-sm text-white focus:border-neon-yellow outline-none" 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Registry Email" 
              required 
              className="w-full bg-black border border-gray-800 p-3 text-sm text-white focus:border-neon-yellow outline-none" 
            />
            <input 
              name="password" 
              type="text" 
              placeholder="Assign Passkey" 
              required 
              className="w-full bg-black border border-gray-800 p-3 text-sm text-white focus:border-neon-yellow outline-none font-mono" 
            />
            
            <select 
              name="role" 
              className="w-full bg-black border border-gray-800 p-3 text-sm text-white focus:border-neon-yellow outline-none appearance-none"
            >
              <option value="LAWYER">LAWYER</option>
              <option value="CLERK">CLERK</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button className="w-full bg-neon-yellow text-black font-black uppercase italic py-3 hover:glow-yellow transition-all text-xs">
              Generate Identity
            </button>
          </form>
        </div>

        {/* Staff List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">Active Personnel</h3>
          <div className="grid gap-3">
            {staff.map((member) => (
              <div key={member.id} className="bg-[#0A0A0F] border border-gray-900 p-4 flex items-center justify-between group hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold rounded-sm italic">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase">{member.name}</h4>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] text-gray-600 flex items-center gap-1 font-mono">
                        <Mail size={10} /> {member.email}
                      </span>
                      <span className="text-[10px] text-neon-yellow flex items-center gap-1 font-black italic">
                        <ShieldCheck size={10} /> {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="text-[10px] text-gray-700 font-mono bg-black px-2 py-1 flex items-center gap-1">
                     <Key size={10} /> ****
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}