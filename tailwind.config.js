/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    daisyui: {
      darkTheme: false, // Set to false to disable dark mode
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
});
