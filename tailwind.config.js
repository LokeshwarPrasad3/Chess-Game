// Example tailwind.config.js
module.exports = {
  content: [
    './views/**/*.ejs',   // Adjust path based on your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        "overpass": ['overpass'],
        "play": ['Playwrite PL'],
      }
    },
  },
  plugins: [],
};
