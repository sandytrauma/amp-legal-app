"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Access Denied.");
    } else {
window.location.href = "/dashboard";    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0A0A0F] border border-electric-blue/30 p-10 shadow-[0_0_50px_rgba(0,51,255,0.1)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-electric-blue flex items-center justify-center rounded-xl mb-4 shadow-[0_0_20px_rgba(0,51,255,0.4)]">
            <Gavel className="text-neon-yellow" size={32} />
          </div>
          <h1 className="text-2xl font-black italic text-white tracking-tighter uppercase">
            AMP LEGAL <span className="text-neon-yellow">LOGIN</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2 font-bold">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 text-xs flex items-center gap-2 mb-6 animate-shake">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
              Registry Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 p-4 text-white focus:border-neon-yellow outline-none transition-colors"
              placeholder="name@amplegal.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
              Access Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 p-4 text-white focus:border-neon-yellow outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-electric-blue text-white font-black uppercase italic py-4 hover:bg-neon-yellow hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,51,255,0.2)]"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-700 font-mono uppercase tracking-tight">
            AMP-OS v1.0 // Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
}