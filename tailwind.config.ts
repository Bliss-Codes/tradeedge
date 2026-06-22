import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1020",
        surface: "#111827",
        card: "#151B2D",
        edge: "#1F2937",
        ink: "#F8FAFC",
        sub: "#CBD5E1",
        mute: "#94A3B8",
        pos: "#22C55E",
        neg: "#EF4444",
        warn: "#F59E0B",
        accent: "#60A5FA",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
