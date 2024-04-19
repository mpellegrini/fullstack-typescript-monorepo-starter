import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import forms from '@tailwindcss/forms'

import sharedConfig from '@packages/ui-svelte/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(
      fileURLToPath(import.meta.resolve('@packages/ui-svelte/tailwind.config.js')),
      '../**/*.{html,js,svelte,ts}',
    ),
  ],
  presets: [sharedConfig],
  plugins: [forms],
}

export default config
