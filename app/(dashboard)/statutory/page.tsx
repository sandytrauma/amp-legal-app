import { db } from "@/db";
import { statutoryMaster } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { Search, Gavel, Scale, AlertTriangle } from "lucide-react";

export default async function StatutoryPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  // Fetching data based on search
  const records = await db
    .select()
    .from(statutoryMaster)
    .where(
      or(
        ilike(statutoryMaster.actName, `%${query}%`),
        ilike(statutoryMaster.section, `%${query}%`)
      )
    )
    .limit(20);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Statutory <span className="text-neon-yellow">Master</span>
        </h1>
        <p className="text-gray-500 font-mono text-xs mt-1">AMP LEGAL // REFERENCE DATABASE</p>
      </section>

      {/* Search Bar */}
      <form className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by Act (e.g. IPC) or Section (e.g. 302)..."
          className="w-full bg-[#0A0A0F] border border-gray-800 p-5 pl-14 text-white focus:border-electric-blue outline-none transition-all italic font-medium"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-electric-blue text-white px-4 py-2 text-[10px] font-black uppercase">
          Query
        </button>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4">
        {records.length > 0 ? (
          records.map((item) => (
            <div key={item.id} className="bg-[#0A0A0F] border border-gray-900 p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-neon-yellow transition-colors group">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-electric-blue/20 text-electric-blue px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                    {item.actName}
                  </span>
                  <h3 className="text-xl font-bold text-white italic group-hover:text-neon-yellow transition-colors">
                    {item.section}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <div className="flex flex-col justify-center items-end border-l border-gray-800 pl-6 min-w-[200px]">
                <span className="text-[10px] text-gray-600 font-bold uppercase mb-1">Potential Penalty</span>
                <span className="text-vibrant-pink font-black text-xs italic text-right uppercase">
                  {item.penalty || "Refer to Counsel"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-900 rounded-lg">
            <Scale className="mx-auto text-gray-800 mb-4" size={48} />
            <p className="text-gray-600 font-mono text-xs uppercase">No statutory records found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}