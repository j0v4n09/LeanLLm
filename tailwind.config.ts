import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      backgroundImage: {
        "lean-glow":
          "radial-gradient(circle at top, rgba(16, 185, 129, 0.18), transparent 32%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.16), transparent 28%), radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.12), transparent 34%)",
      },
      animation: {
        pulseSlow: "pulse 2.4s ease-in-out infinite",
        slideDown: "slideDown 0.28s ease-out",
      },
      keyframes: {
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        glass: "0 20px 80px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
