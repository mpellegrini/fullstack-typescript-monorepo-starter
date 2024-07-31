import { type User, greetUser } from './index.js'

describe('greet user tests', () => {
  const user: User = {
    email: 'bob@loblaw.com',
    first_name: 'Bob',
    is_admin: false,
    last_name: 'Loblaw',
  }

  it('user is an admin', () => {
    expect.assertions(1)

    user.is_admin = true
    expect(greetUser(user)).toBe('Hello, Bob Loblaw! You are an admin.')
  })

  it('should greet user as a non-admin', () => {
    expect.assertions(1)

    user.is_admin = false
    expect(greetUser(user)).toBe('Hello, Bob Loblaw! You are not an admin.')
  })
})
