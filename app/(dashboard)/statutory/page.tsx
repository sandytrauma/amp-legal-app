import { db } from "@/db";
import { statutoryMaster } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { Scale, AlertTriangle, Cpu } from "lucide-react";
import SearchTerminal from "./search-terminal";

// CRITICAL: Prevent caching of search results
export const dynamic = "force-dynamic";

export default async function StatutoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Standard Drizzle Query
  const records = await db
  .select()
  .from(statutoryMaster)
  .where(
    query 
      ? or(
          ilike(statutoryMaster.actName, `%${query}%`),
          ilike(statutoryMaster.section, `%${query}%`),
          ilike(statutoryMaster.description, `%${query}%`) // Added description search
        )
      : undefined
  )
  .orderBy(statutoryMaster.id);

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 space-y-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-end border-b border-white/5 pb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-8 bg-neon-yellow shadow-[0_0_15px_#D4FF00]" />
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              STATUTORY <span className="text-neon-yellow">MASTER</span>
            </h1>
          </div>
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.5em] ml-4">
            Legal Intelligence Repository // AI_ENABLED_V3
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-sm">
           <Cpu size={16} className="text-neon-yellow animate-pulse" />
           <div className="text-right">
              <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest text-gray-500">AI_Node</p>
              <p className="text-xs font-black text-white italic leading-none uppercase tracking-tighter">Gemini_2.5_Flash</p>
           </div>
        </div>
      </header>

      <SearchTerminal initialQuery={query} />

      {/* RESULTS FEED */}
      <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 overflow-hidden">
        {records.length > 0 ? (
          records.map((item) => (
            <div key={item.id} className="relative bg-[#020203] p-8 flex flex-col md:flex-row justify-between gap-8 hover:bg-white/[0.02] transition-all group border-b border-white/5 last:border-0">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-electric-blue opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#00E0FF] transition-all" />
              
              <div className="space-y-4 max-w-4xl">
                <div className="flex items-center gap-4">
                  <span className="bg-electric-blue/10 text-electric-blue border border-electric-blue/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
                    {item.actName}
                  </span>
                  <div className="h-[1px] w-8 bg-white/10" />
                  <h3 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-neon-yellow transition-colors leading-none">
                    SECTION {item.section}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-[11px] font-medium leading-relaxed uppercase tracking-tight group-hover:text-gray-200 transition-colors">
                  {item.description}
                </p>
              </div>
              
              <div className="flex flex-col justify-center items-end md:border-l border-white/5 md:pl-10 min-w-[240px]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={12} className="text-vibrant-pink" />
                  <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Sanction_Protocol</span>
                </div>
                <span className="text-vibrant-pink font-black text-xs italic text-right uppercase bg-vibrant-pink/5 px-3 py-1 border border-vibrant-pink/10 shadow-[0_0_10px_rgba(255,0,212,0.1)]">
                  {item.penalty || "REFER_TO_COUNSEL"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-[#020203]">
            <Scale className="mx-auto text-gray-900 mb-6 opacity-20" size={64} />
            <p className="text-gray-700 font-mono text-[10px] uppercase tracking-[0.6em] italic">
              {query ? "DATA_REFINE_IN_PROGRESS" : "NO_RECORDS_INDEXED"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}