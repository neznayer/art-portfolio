/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      smartphone: "475px",
      tablet: "640px",
      desktop: "1024px",
    },
    extend: {
      backgroundColor: {
        "bg-gray": "#e6e1e1",
      },
      textColor: {
        "dark-gray": "rgb(75,73,73)",
      },
    },
  },
  plugins: [],
};
