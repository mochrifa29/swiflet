module.exports = {
  plugins: ["prettier-plugin-ejs"],
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  bracketSpacing: true,
   overrides: [
    {
      files: "*.ejs",
      options: {
        parser: "ejs"
      }
    }
  ]
};
