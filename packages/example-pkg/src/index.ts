export interface User {
  first_name: string
  last_name: string
  email: string
  is_admin: boolean
}

export const greetUser = (user: User): string => {
  return `Hello, ${user.first_name} ${user.last_name}! You are ${
    user.is_admin ? 'an admin.' : 'not an admin.'
  }`
}
