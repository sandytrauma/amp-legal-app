"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // Import signOut
import { 
  LayoutDashboard, Gavel, Users, Calendar, 
  Bell, Briefcase, ShieldCheck, Search, Activity, LogOut 
} from "lucide-react";
import { UserRole } from "@/types/next-auth";

interface SidebarProps {
  userRole: UserRole;
  unreadCount: number;
}

export default function Sidebar({ userRole, unreadCount }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Command Center", href: "/", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "My Assignments", href: "/my-tasks", icon: Briefcase, roles: ["LAWYER", "CLERK"] },
    { name: "Task Protocol", href: "/tasks", icon: Gavel, roles: ["ADMIN", "LAWYER"] },
    { name: "Weekly Docket", href: "/calendar", icon: Calendar, roles: ["ADMIN", "LAWYER", "CLERK"] },
    { 
      name: "Notifications", 
      href: "/notifications", 
      icon: Bell, 
      roles: ["ADMIN", "LAWYER", "CLERK"],
      badge: unreadCount 
    },
  ];

  return (
    <aside className="w-72 bg-[#020203] border-r border-white/5 h-screen sticky top-0 flex flex-col p-6 shrink-0">
      <div className="mb-10">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
          AMP <span className="text-neon-yellow">OS</span>
        </h2>
        <p className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.4em]">v2.0.26 // STABLE</p>
      </div>

      {/* SEARCH */}
      <div className="mb-8 relative group">
        <Search className="absolute left-3 top-2.5 text-gray-700 group-focus-within:text-neon-yellow transition-colors" size={12} />
        <input 
          placeholder="SEARCH CASE REF..." 
          className="w-full bg-white/5 border border-white/10 py-2.5 pl-9 text-[9px] font-mono text-white outline-none focus:border-neon-yellow/40 transition-all uppercase placeholder:text-gray-800"
        />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all relative group ${
              pathname === item.href 
                ? "bg-white text-black italic" 
                : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <item.icon size={14} />
            {item.name}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-vibrant-pink text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
        
        {userRole === "ADMIN" && (
           <div className="mt-8 pt-8 border-t border-white/5 space-y-1">
             <Link href="/staff" className="flex items-center gap-3 px-4 py-3 text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors">
               <Users size={14} /> Personnel Registry
             </Link>
           </div>
        )}
      </nav>

      {/* FOOTER: STATUS & LOGOUT */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-sm">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse"></div>
             <div>
                <p className="text-[9px] font-mono text-gray-600 uppercase italic leading-none">Status</p>
                <p className="text-[7px] font-black text-white uppercase mt-1">Live_Node</p>
             </div>
          </div>
          <Activity size={12} className="text-gray-800" />
        </div>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-500 hover:text-vibrant-pink hover:bg-vibrant-pink/5 transition-all uppercase tracking-[0.2em] border border-transparent hover:border-vibrant-pink/20 rounded-sm"
        >
          <LogOut size={14} />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}