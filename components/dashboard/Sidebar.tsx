"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Gavel, Users, Calendar, 
  Bell, Briefcase, LogOut, Menu, X, Search, Database, Scale
} from "lucide-react";

export default function Sidebar({ userRole, unreadCount }: { userRole: string, unreadCount: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Command", href: "/", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Protocols", href: "/tasks", icon: Gavel, roles: ["ADMIN", "LAWYER"] },
    // NEW: Statutory Master Route
    { name: "Intel", href: "/statutory", icon: Database, roles: ["ADMIN", "LAWYER", "CLERK"] },
    { name: "Docket", href: "/calendar", icon: Calendar, roles: ["ADMIN", "LAWYER", "CLERK"] },
    { name: "Comms", href: "/notifications", icon: Bell, roles: ["ADMIN", "LAWYER", "CLERK"], badge: unreadCount },
  ];

  return (
    <>
      {/* MOBILE TRIGGER - Blur backdrop header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5 z-[100]">
        <span className="text-neon-yellow font-black tracking-tighter uppercase italic text-sm">AMP.</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className={`
        fixed lg:sticky top-0 left-0 z-[90]
        w-64 h-screen bg-[#020203] border-r border-white/[0.05]
        flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* BRANDING - Surgical Precision */}
        <div className="px-10 pt-12 pb-10">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-8 bg-neon-yellow shadow-[0_0_20px_#D4FF00]" />
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                AMP<span className="text-neon-yellow">.</span>
              </h1>
              <p className="text-[6px] font-mono text-gray-700 uppercase tracking-[0.6em] mt-2">OS_INTEL_v2.6</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION - Minimalist List */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.filter(item => item.roles.includes(userRole)).map((item) => {
            const isActive = pathname === item.href;
            const hasBadge = typeof item.badge === 'number' && item.badge > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-6 py-3.5 transition-all duration-300 relative ${
                  isActive 
                    ? "text-white bg-white/[0.03]" 
                    : "text-gray-600 hover:text-white"
                }`}
              >
                {/* Neon Glow Sidebar Indicator */}
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-full bg-neon-yellow shadow-[5px_0_15px_rgba(212,255,0,0.3)]" />
                )}
                
                <item.icon size={15} className={`mr-4 transition-colors ${isActive ? "text-neon-yellow" : "group-hover:text-neon-yellow"}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                
                {hasBadge && (
                  <span className="ml-auto bg-vibrant-pink text-white text-[8px] px-2 py-0.5 rounded-sm font-black animate-pulse shadow-[0_0_15px_#FF00D4]">
                    {item.badge}
                  </span>
                )}

                {/* Cyberpunk Hover Effect */}
                {!isActive && (
                   <div className="absolute right-0 w-0 h-[1px] bg-neon-yellow/20 group-hover:w-8 transition-all duration-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER - System Status */}
        <div className="p-8 mt-auto">
          {/* AI Uplink Status Indicator */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-mono text-gray-700 uppercase">AI_UPLINK_READY</span>
              <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-neon-yellow animate-bounce" />
                 <div className="w-1 h-1 rounded-full bg-neon-yellow animate-bounce [animation-delay:-0.1s]" />
                 <div className="w-1 h-1 rounded-full bg-neon-yellow animate-bounce [animation-delay:-0.2s]" />
              </div>
            </div>
            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-yellow/30 to-transparent w-full animate-shimmer" />
            </div>
          </div>

          <button 
            onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
            className="w-full flex items-center justify-between px-4 py-3 border border-white/5 text-[9px] font-black text-gray-600 hover:text-vibrant-pink hover:border-vibrant-pink/40 hover:bg-vibrant-pink/5 transition-all uppercase tracking-[0.3em] italic group"
          >
            <span>TERMINATE_SESSION</span>
            <LogOut size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>
    </>
  );
}