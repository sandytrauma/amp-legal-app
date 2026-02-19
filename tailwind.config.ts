// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Intensity Legal Tech Palette
        "neon-yellow": "#D4FF00", // The core "AMP" brand color
        "vibrant-pink": "#FF00D4", // For alerts and badges
        "electric-blue": "#00E0FF", // For counsel names/secondary links
        "deep-slate": "#393945",   // A slightly "bluer" black for depth
      },
      animation: {
        'progress-fast': 'progress 1s infinite linear',
      },
      keyframes: {
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;