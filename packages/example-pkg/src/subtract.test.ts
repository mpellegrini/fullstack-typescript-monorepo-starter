import { subtract } from './subtract.js'

describe('test subtract function', () => {
  it('should return 5 for subtract(10,5)', () => {
    expect.assertions(1)
    expect(subtract(10, 5)).toBe(5)
  })

  it('should return -1 for subtract(2,3)', () => {
    expect.assertions(1)
    expect(subtract(2, 3)).toBe(-1)
  })
})
