
const { A } = require('../facade')

const startValue = 0
const finalValue = 1

const beStart = v => expect(v).toBe(startValue)
const beFinal = v => expect(v).toBe(finalValue)
const neverBe = v => expect(v).toThrow

test('mini', () => {
  let a = A()
  a.up(beStart)
  a(startValue)
  expect.assertions(1)
})

test('up down next', async () => {
  let a = A()
  a.up(beStart)
  a(startValue)
  a.down(beStart)
  a.next(beFinal)
  a(finalValue)
  a.clear()
  a.up(neverBe)
  expect(a.value).toBeUndefined()
  expect.assertions(3)
})

test('once is', () => {
  const a = A()
  expect(a.is(undefined)).toBeTruthy()
  a.once(beStart)
  a(startValue)
  a(finalValue)
  a.once(beFinal)
  expect(a.is(finalValue)).toBeTruthy()
  expect(a.is(startValue)).toBeFalsy()
  a(startValue)
  expect.assertions(5)
})

test('context', async () => {
  let a = A()
  a.setId('zero')
  expect(a.uid).toBeDefined()
  expect(a.uid).not.toBe(a.id)
  function fn() {
    expect(this.id).toBe('zero')
  }
  a.up(fn)
  a.upSome(fn)
  a(startValue)
  expect.assertions(4)
})

test('resend', async () => {
  let a = A(startValue)
  a.next(beStart)
  a.resend()
  expect.assertions(1)
})

test('name id meta', () => {
  let a = A.id('ground', startValue)
  expect(a.id).toBe('ground')
  expect(a.value).toBe(startValue)
  a.setId('sky')
  a.setName('bob')
  expect(a.id).toBe('sky')
  expect(a.name).toBe('bob')

  expect(a.hasMeta('x')).toBeFalsy()
  expect(a.getMeta('x')).toBeFalsy()

  a.addMeta('m')
  a.addMeta('k', finalValue)
  expect(a.hasMeta('m')).toBeTruthy()
  expect(a.getMeta('k')).toBe(finalValue)
  expect(A.id(finalValue).id).toBe(finalValue)
})

test('fmap', () => {
  const a = A(3)
  a.fmap(v => v + 2)
  expect(a()).toBe(5)
})

test('wrap', async () => {
  const a = A.wrap(v => v * v)
  a(2)
  expect(a()).toBe(4)

  const b = A.wrap(v => new Promise(done => setTimeout(() => done(v * v), 24)))
  await b(4)
  expect(a()).toBe(4)
})

test('inject', () => {
  const a = A.id('start', finalValue)
  const o = {}
  a.injectOnce(o)
  a.injectOnce(o, 'final')
  expect(o).toHaveProperty('final', finalValue)
  expect(o).toHaveProperty('start', finalValue)

  const c = A(o)
  const c_clone = c.cloneValue()
  expect(c_clone.start).toBe(c.value.start)
  c.value.final = startValue
  expect(c_clone.final).not.toBe(c.value.final)
  expect(() => a.injectOnce(null)).toThrowError()
})

test('clear', () => {
  let a = A(startValue)
  expect(a.isEmpty).toBeFalsy()
  a.next(beFinal)
  a.clearValue()
  expect(a.isEmpty).toBeTruthy()
  a(finalValue)
  a.clear()
  a(startValue)
  expect.assertions(3)
})

test('close', () => {
  let a = A.proto(startValue)
  expect(!!a.uid).toBeTruthy()
  a.decay()
  expect(() => a()).toThrowError()
  expect(a.uid).toBeUndefined()
  let b = A.proxy(startValue)
  expect(()=> b.wow).toThrowError()
  b.decay()
  expect(() => b()).toThrowError()
  expect(()=> b.uid).toThrowError()
})
