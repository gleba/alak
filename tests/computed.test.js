const { A } = require('../facade')

const inAwaiting = atom => expect(typeof atom().then === 'function').toBeTruthy()

test('some strategy', () => {
  const a1 = A(1)
  const a2 = A()
  const a3 = A()
  const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
    expect(a2).toBeDefined()
    return v1 + v2 + (v3 ? '!' : ':')
  })
  a2('a')
  inAwaiting(c)
  a3(true)
  expect(c()).toBe('1a!')
  a3(null)
  inAwaiting(c)
  expect(c.value).toBe('1a!')
  a3(false)
  expect(c()).toBe('1a:')
  expect.assertions(9)
})

test('strong get strategy', () => {
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  const a1 = A.getter(() => {
    fn1()
    return Math.random()
  })
  const a2 = A.getOnce(() => {
    fn2()
    return '-'
  })

  const c = A.from(a1, a2).strong((v1, v2) => v1 + v2)
  const fn3 = jest.fn()
  c.up(fn3)
  c()
  expect(fn1).toHaveBeenCalledTimes(2)
  expect(fn2).toHaveBeenCalledTimes(1)
  expect(fn3).toHaveBeenCalledTimes(2)
})
