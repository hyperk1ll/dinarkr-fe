import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '300px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      '2xl': '1600px',
    },
    extend: {
      colors: {
        // Hijau botol / Islami
        emerald: {
          950: '#0a2118',
          900: '#0f3524',
          850: '#134a30',
          800: '#18603e',
          750: '#1c704a',
          700: '#1f7a50',
          600: '#27965f',
          500: '#30b06e',
          400: '#4dc98a',
          300: '#7ddba8',
          200: '#b0ecc9',
          100: '#d9f7e4',
          50: '#edfbf2',
        },
        // Kuning keemasan
        gold: {
          950: '#3d2e05',
          900: '#5c4508',
          800: '#7a5c0a',
          700: '#a17a0d',
          600: '#c99910',
          500: '#d4a817',
          400: '#e6c040',
          300: '#f0d46e',
          200: '#f7e6a0',
          100: '#fbf0cc',
          50: '#fdf8e8',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
