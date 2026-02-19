"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Zap, Loader2 } from "lucide-react";
import { executeAIProtocol } from "@/lib/actions/legal-ai/action";

export default function SearchTerminal({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("AWAITING_INPUT");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync input value with URL changes (back/forward buttons)
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isPending) return;

    startTransition(async () => {
      try {
        setStatus("INITIALIZING_AI_SCAN");
        
        // 1. Run AI Protocol
        await executeAIProtocol(value);
        
        setStatus("REFINING_INTEL");
        
        // 2. Build URL and push
        const params = new URLSearchParams();
        params.set("q", value);
        
        // 3. Navigation
        router.push(`/statutory?${params.toString()}`);
        
        // Force server to re-run the Drizzle query
        router.refresh();
        
        setStatus("SYNC_COMPLETE");
      } catch (err) {
        setStatus("SCAN_FAILED");
        console.error(err);
      }
    });
  };

  return (
    <div className="relative group max-w-4xl">
      <div className="absolute -inset-0.5 bg-electric-blue opacity-10 blur group-focus-within:opacity-30 transition-opacity" />
      
      <form onSubmit={handleSearch} className="relative flex bg-[#0A0A0F] border border-white/10 overflow-hidden">
        <div className="flex items-center justify-center pl-6 pr-4 border-r border-white/5 text-gray-600">
          {isPending ? <Loader2 size={18} className="animate-spin text-neon-yellow" /> : <Search size={18} />}
        </div>
        
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ENTER ACT OR SECTION (e.g. 302 IPC)..."
          disabled={isPending}
          className="w-full bg-slate p-6 text-[11px] font-mono text-white placeholder:text-gray-800 outline-none uppercase tracking-widest disabled:opacity-50"
        />
        
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-white text-black px-10 text-[10px] font-black uppercase hover:bg-neon-yellow transition-all flex items-center gap-2 disabled:bg-gray-800"
        >
          {isPending ? "REFINING" : "Query_System"} <Zap size={12} />
        </button>
      </form>

      {/* Typewriter Status Indicator */}
      {isPending && (
        <div className="mt-2 ml-1 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-pulse" />
          <p className="text-[9px] font-mono text-neon-yellow uppercase tracking-tighter">
            System_Status: <span className="italic">{status}...</span>
          </p>
        </div>
      )}
    </div>
  );
}