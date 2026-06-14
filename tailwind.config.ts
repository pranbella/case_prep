import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bcg: {
          green: "#177b57",
          dark: "#0b3d2e",
          accent: "#21b07e",
        },
        ink: {
          900: "#0a0e14",
          800: "#11161f",
          700: "#1a212d",
          600: "#27303f",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        pulseUrgent: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseUrgent: "pulseUrgent 1s ease-in-out infinite",
        slideIn: "slideIn 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
