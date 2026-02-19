import Link from "next/link";
import { Gavel, Shield, Activity, ArrowRight, CheckCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col bg-[#050508] font-sans text-white selection:bg-neon-yellow selection:text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-electric-blue/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-electric-blue flex items-center justify-center rounded-lg rotate-3 shadow-[0_0_15px_rgba(0,51,255,0.5)]">
            <Gavel className="text-neon-yellow -rotate-3" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic">
            AMP LEGAL <span className="text-neon-yellow">SOLUTIONS</span>
          </h1>
        </div>
        
        {session ? (
          <Link 
            href="/dashboard" 
            className="px-6 py-2 bg-electric-blue text-white hover:bg-neon-yellow hover:text-black transition-all duration-300 font-bold uppercase text-xs tracking-widest rounded-sm"
          >
            Open Dashboard
          </Link>
        ) : (
          <Link 
            href="/api/auth/signin" 
            className="px-6 py-2 border border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-black transition-all duration-300 font-bold uppercase text-xs tracking-widest glow-yellow rounded-sm"
          >
            Portal Login
          </Link>
        )}
      </nav>

      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative w-full overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-electric-blue/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-neon-yellow/5 rounded-full blur-[120px]" />
          
          <div className="z-10">
            <h2 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter uppercase italic leading-[0.85]">
              Result Driven <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-white to-neon-yellow">
                Legal Mastery
              </span>
            </h2>
            
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              High-performance litigation management for modern firms. 
              Track hearings, automate proxies, and dominate workflows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href={session ? "/dashboard" : "/api/auth/signin"}
                className="group flex h-14 items-center justify-center gap-3 bg-neon-yellow px-10 text-black font-black uppercase italic transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto shadow-[0_0_30px_rgba(204,255,0,0.3)]"
              >
                Access Command Center
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-1 px-6 w-full border-y border-gray-900 bg-gray-900/20">
          <FeatureCard 
            title="Bordio Workflows" 
            desc="Kanban-style task tracking designed specifically for legal result-driven teams."
          />
          <FeatureCard 
            title="Hearing Registry" 
            desc="Automated court date tracking with real-time field clerk proxy dispatch."
            highlight
          />
          <FeatureCard 
            title="Statutory Master" 
            desc="Instant access to statutory sections, penalties, and case law references."
          />
        </section>

        {/* New: Quick Inquiry Section (Landing Page Lead Gen) */}
        <section className="py-32 px-6 max-w-4xl w-full">
          <div className="bg-[#0A0A0F] border border-electric-blue/30 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield size={120} className="text-electric-blue" />
            </div>
            <h3 className="text-3xl font-black italic uppercase mb-2">Legal Consultation</h3>
            <p className="text-gray-400 mb-8">Submit an inquiry and our lead counsel will reach out within 24 hours.</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="bg-black border border-gray-800 p-4 text-sm focus:border-neon-yellow outline-none" />
              <input type="email" placeholder="Email Address" className="bg-black border border-gray-800 p-4 text-sm focus:border-neon-yellow outline-none" />
              <textarea placeholder="Brief Case Summary" className="md:col-span-2 bg-black border border-gray-800 p-4 text-sm focus:border-neon-yellow outline-none h-32" />
              <button className="md:col-span-2 bg-electric-blue text-white font-black uppercase italic p-4 hover:bg-neon-yellow hover:text-black transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 border-t border-gray-900 bg-[#020205]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black italic text-lg tracking-tighter">
            AMP <span className="text-neon-yellow">LEGAL</span>
          </div>
          <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase text-center">
            &copy; 2026 AMP Legal Solutions Private Limited // Sector 44, Gurugram
          </p>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-neon-yellow animate-ping" />
             <span className="text-[10px] text-gray-400 font-bold uppercase">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, highlight = false }: { title: string, desc: string, highlight?: boolean }) {
  return (
    <div className={`p-12 transition-all ${highlight ? 'bg-electric-blue/10 border-x border-electric-blue/20' : 'bg-transparent'} hover:bg-white/[0.02]`}>
      <div className={`w-8 h-1 mb-6 ${highlight ? 'bg-neon-yellow' : 'bg-electric-blue'}`} />
      <h3 className={`text-xl font-black mb-3 uppercase italic ${highlight ? 'text-neon-yellow' : 'text-white'}`}>
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}