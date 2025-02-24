import type { Config } from "tailwindcss";
// import colorsTheme from "./src/data/colorsTheme.json";
// import daisyui from "daisyui";

// let themes: any = [
//   {
//     custom: colorsTheme,
//   },
// ];

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // daisyui: {
  //   themes,
  // },
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-content": "#FFFFFF",
        secondary: "#dcdcf4",
        "secondary-content": "#000000",
        accent: "#5452EB",
        "accent-content": "#f1f1f1",
        neutral: "#3F3F3F",
        "neutral-content": "#FFFFFF",
        "base-100": "#ffffff",
        "base-200": "#DDDDDD",
        "base-300": "#8C8C8C",
        "base-content": "#181B1D",
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
        sans: ["Inter", "sans-serif"],
        serif: ["var(--sectra-font)"],
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
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  // plugins: [daisyui],
};
export default config;
