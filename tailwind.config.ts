
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4361EE", // More vibrant blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4F1FF", // Lighter purple tint
          foreground: "#2D3748",
        },
        accent: {
          DEFAULT: "#FF5D8F", // Vibrant pink
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F9F7FF", // Soft purple tint
          foreground: "#6B7280",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3748",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-soft": "pulse-soft 2s infinite ease-in-out",
        "float": "float 3s infinite ease-in-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-dots': 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        'gradient-primary': 'linear-gradient(to right, #4361EE, #3A0CA3)',
        'gradient-accent': 'linear-gradient(to right, #FF5D8F, #FF8E72)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
