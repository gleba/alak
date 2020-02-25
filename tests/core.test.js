//const { AC } = require('../core')
const { A } = require('../facade')

const startValue = 0
const finalValue = 1

const beStart = v => expect(v).toBe(startValue)
const beFinal = v => expect(v).toBe(finalValue)
const neverBe = v => expect(v).toThrow


test('mini', () => {
  let a = A.object()
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
  let a = A()
  a.setId('sky')
  a.setName('bob')
  expect(a.id).toBe('sky')
  expect(a.name).toBe('bob')
  a.addMeta('m')
  a.addMeta('k', finalValue)
  expect(a.hasMeta('m')).toBeTruthy()
  expect(a.getMeta('k')).toBe(finalValue)
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

  const b = A.wrap(v => new Promise(done=>setTimeout(()=>done(v*v),24)))
  await b(4)
  expect(a()).toBe(4)
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
  let a = A(startValue)
  expect(!!a.id).toBeTruthy()
  expect(()=>a.illusion).toThrowError()
  a.decay()
  expect(()=>a()).toThrowError()
  expect(()=>a.id).toThrowError()
  expect(()=>a.up).toThrowError()
})
