import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({
  HOMEASSISTANT_BASE_URI: {
    schema: (input) => {
      if (!input || !URL.canParse(input)) {
        throw new Error('HOMEASSISTANT_BASE_URI must be a valid URL')
      }

      return input
    },
  },
})
