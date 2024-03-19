/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: false,
  endOfLine: "lf",
  overrides: [
    {
      files: ["*.json", "*.config.*"],
      options: {
        tabWidth: 2,
      },
    },
  ],
}

export default config
