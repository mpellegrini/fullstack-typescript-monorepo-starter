import { greetUser, type User } from './index.js'

describe('greet user tests', () => {
  const user: User = {
    first_name: 'Bob',
    last_name: 'Loblaw',
    email: 'bob@loblaw.com',
    is_admin: false,
  }

  it('user is an admin', () => {
    user.is_admin = true
    expect(greetUser(user)).toBe('Hello, Bob Loblaw! You are an admin.')
  })

  it('should greet user as a non-admin', () => {
    user.is_admin = false
    expect(greetUser(user)).toBe('Hello, Bob Loblaw! You are not an admin.')
  })
})
