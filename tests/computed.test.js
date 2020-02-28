const { A } = require('../facade')

const inAwaiting = atom => expect(typeof atom().then === 'function').toBeTruthy()

test('some strategy', () => {
  const a = A(1)
  const b = A()
  const d = A()
  const c = A.from(a, b, d).some((aV, bV, dV) => {
    expect(b).toBeDefined()
    return aV + bV + (dV ? '!' : ':')
  })
  b('b')
  inAwaiting(c)
  d(true)
  expect(c()).toBe('1b!')
  d(null)
  inAwaiting(c)
  expect(c.value).toBe('1b!')
  d(false)
  expect(c()).toBe('1b:')
  expect.assertions(9)
})

test('some async strategy', async () => {
  const aGetter = jest.fn()
  const a = A.getter(() => {
    aGetter()
    return new Promise(done => setTimeout(() => done(Math.random()), 24))
  })
  const b = A(0)
  a()
  inAwaiting(a)
  const someMix = jest.fn()
  const c = A.from(a, b).some((aV, bV) => {
    someMix()
    return new Promise(done => setTimeout(() => done(aV + bV), 24))
  })
  inAwaiting(c)
  a()
  a()
  a()
  c()
  c()
  await c()
  expect(aGetter).toHaveBeenCalledTimes(1)
  expect(someMix).toHaveBeenCalledTimes(1)
})

test('strong get sync strategy', () => {
  const aGetter = jest.fn()
  const bOnceGetter = jest.fn()
  const a = A.getter(() => {
    aGetter()
    return Math.random()
  })
  const b = A.getOnce(() => {
    bOnceGetter()
    return '-'
  })
  const c = A.from(a, b).strong((aV, bV) => aV + bV)
  const cUpReceiver = jest.fn()
  c.up(cUpReceiver)
  c()
  expect(aGetter).toHaveBeenCalledTimes(2)
  expect(bOnceGetter).toHaveBeenCalledTimes(1)
  expect(cUpReceiver).toHaveBeenCalledTimes(2)
})

test('strong get async strategy', async () => {
  const aGetter = jest.fn()
  const bOnceGetter = jest.fn()
  const a = A.getter(() => {
    aGetter()
    return new Promise(done => setTimeout(() => done(Math.random()), 24))
  })
  const b = A.getOnce(() => {
    bOnceGetter()
    return '-'
  })
  const c = A.from(a, b).strong((aV, bV) => aV + bV)
  inAwaiting(c)
  const cUpReceiver = jest.fn()
  c.up(cUpReceiver)
  await c()
  await c()
  expect(aGetter).toHaveBeenCalledTimes(2)
  expect(bOnceGetter).toHaveBeenCalledTimes(1)
  expect(cUpReceiver).toHaveBeenCalledTimes(2)
})

test('error strategy', async () => {
  const a = A()
  const c = A.from(a).weak(a_V => a_V)
  expect(()=>c.from(a).weak).toThrowError()
})
