import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "#1f9eff",
        secondary: "#0064ff",
        gray: "#f3f3f3",
        darkgray: "#868e96",
        black: "#000000",
        white: "#ffffff",
      },
      screens: {
        xl: "1280px",
        xxl: "1440px",
        xxxl: "1920px",
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};

export default config;
