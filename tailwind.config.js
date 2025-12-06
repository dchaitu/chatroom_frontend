const withMT = require("@material-tailwind/react/utils/withMT");
const { themeColors } = require("../insta_ai_creator_frontend/src/styles/theme");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'component-background': 'var(--color-component-background)',
        content: 'var(--color-content)',
        border: 'var(--color-border)',
        'text-on-background': 'var(--color-text-on-background)',
        'text-on-content': 'var(--color-text-on-content)',
        'hover-on-background': 'var(--color-hover-on-background)',
        'text-on-bg-options': 'var(--color-text-on-bg-options)',
        'text-on-options': 'var(--color-text-on-options)',

      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
