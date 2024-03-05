/* Documentation for this file: https://prettier.io/docs/en/configuration.html */

/** @type {import("prettier").Config} */
const config = {
  // Extend the line length that the printer will wrap on beyond the default of 80.
  printWidth: 100,

  // Indent lines with spaces instead of tabs.
  useTabs: false,

  // Print spaces between brackets in object literals.
  bracketSpacing: true,

  // Use .gitattributes to manage newlines.
  endOfLine: 'auto',

  // Use single quotes instead of double quotes.
  singleQuote: true,

  // Trailing commas wherever possible (including function parameters and calls).
  trailingComma: 'all',

  // Only add semicolons at the beginning of lines that may introduce ASI failures.
  semi: false,

  // Enforce single attribute per line in HTML, Svelte, Vue and JSX.
  singleAttributePerLine: false,

  // Put the > of a multi-line HTML element at the end of the last line instead of being alone on the next line.
  bracketSameLine: true,

  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],

  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
  ],
}

export default config
