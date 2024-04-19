import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

import tailwindConfig from './tailwind.config.js'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [tailwindcss(tailwindConfig), autoprefixer],
}

export default config
