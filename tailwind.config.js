const withMT = require("@material-tailwind/react/utils/withMT");
const { themeColors } = require("./src/styles/theme");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: themeColors.background,
        content: themeColors.content,
        border: themeColors.border,
        'text-on-background': themeColors['text-on-background'],
        'text-on-content': themeColors['text-on-content'],
        'hover-on-background': themeColors['hover-on-background'],
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
