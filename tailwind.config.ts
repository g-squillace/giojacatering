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
          "2xl": "clamp(5rem, 5.2vw, 8rem)",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      fontSize: {
        xs: ["clamp(12px, 0.86vw, 18px)", "clamp(14px, 1vw, 21px)"],
        sm: ["clamp(14px, 1vw, 21px)", "clamp(20px, 1.43vw, 30px)"],
        base: ["clamp(16px, 1.14vw, 24px)", "clamp(22px, 1.57vw, 33px)"],
        md: ["clamp(18px, 1.29vw, 27px)", "clamp(30px, 2.14vw, 45px)"],
        lg: ["clamp(24px, 1.71vw, 36px)", "clamp(34px, 2.43vw, 51px)"],
        xl: ["clamp(28px, 2vw, 42px)", "clamp(40px, 2.86vw, 60px)"],
        "2xl": ["clamp(38px, 2.71vw, 57px)", "clamp(46px, 3.29vw, 69px)"],
        "3xl": ["clamp(50px, 3.57vw, 65px)", "clamp(60px, 4.29vw, 90px)"],
        "4xl": ["clamp(67px, 4.79vw, 100px)", "clamp(75px, 5.36vw, 112px)"],
        "5xl": ["clamp(80px, 5.71vw, 120px)", "clamp(90px, 6.43vw, 135px)"],
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
};
export default config;
