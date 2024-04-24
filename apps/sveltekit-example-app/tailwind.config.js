import sharedConfig from '@packages/ui-svelte/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{html,svelte,ts}',
    './../../packages/ui-svelte/src/components/**/*.{svelte,ts}',
  ],
  presets: [sharedConfig],
}

export default config
