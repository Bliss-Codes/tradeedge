import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0B0A",
        surface: "#141614",
        card: "#181B18",
        edge: "#272A27",
        ink: "#F4F7F3",
        sub: "#C9CEC7",
        mute: "#8C928A",
        pos: "#22C55E",
        neg: "#EF4444",
        warn: "#F59E0B",
        accent: "#A3E635",
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
