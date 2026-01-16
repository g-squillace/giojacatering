import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        "primary-content": "#3E3930",
        secondary: "#F4F4F1",
        "secondary-content": "#3E3930",
        accent: "#5452EB",
        "accent-content": "#f1f1f1",
        neutral: "#F4F5F2",
        "neutral-content": "#3E3930",
        "base-100": "#9E9A94",
        "base-200": "#776F60",
        "base-300": "#696359",
        "base-content": "#3E3930",
        info: "#0057FF",
        "info-content": "#181B1D",
        success: "#00A96E",
        "success-content": "#181B1D",
        warning: "#FFBE00",
        "warning-content": "#181B1D",
        error: "#FF5861",
        "error-content": "#181B1D",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          "2xl": "5rem",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      fontSize: {
        xs: ["12px", "14px"],
        sm: ["14px", "20px"],
        base: ["16px", "22px"],
        md: ["18px", "30px"],
        lg: ["24px", "34px"],
        xl: ["28px", "40px"],
        "2xl": ["38px", "46px"],
        "3xl": ["50px", "60px"],
        "4xl": ["67px", "75px"],
        "5xl": ["80px", "90px"],
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
};
export default config;
