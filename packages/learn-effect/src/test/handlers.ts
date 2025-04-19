import { http, HttpResponse } from 'msw'

import type { Pokemon } from '../schemas.js'

const mockPokemon: Pokemon = {
  id: 1,
  height: 10,
  name: 'Poketest',
  order: 1,
  weight: 10,
}

export const handlers = [
  http.get(
    'http://localhost:3000/api/v2/pokemon/*', //
    () => HttpResponse.json(mockPokemon),
  ),
]
