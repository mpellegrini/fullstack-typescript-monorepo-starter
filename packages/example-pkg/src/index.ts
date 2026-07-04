// Demo change (push 1): touch example-pkg to seed its cache.
export interface User {
  email: string
  first_name: string
  is_admin: boolean
  last_name: string
}

export const greetUser = (user: User): string =>
  `Hello, ${user.first_name} ${user.last_name}! You are ${
    user.is_admin ? 'an admin.' : 'not an admin.'
  }`
