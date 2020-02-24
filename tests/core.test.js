const { A } = require('../facade')

const startValue = 0
const finalValue = 1

const beStart = v => expect(v).toBe(startValue)
const beFinal = v => expect(v).toBe(finalValue)
const neverBe = v => expect(v).toThrow


test('up down next', async () => {
  let a = A()
  a.up(beStart)
  a(startValue)
  a.down(beStart)
  a.next(beFinal)
  a(finalValue)
  a.clear()
  a.up(neverBe)
  expect(a.value).toBe(undefined)
  expect.assertions(3)
})


test('context', async () => {
  let a = A()
  a.setId("zero")
  function fn() {
    expect(this.id).toBe("zero")
  }
  a.up(fn)
  a.upSome(fn)
  a(startValue)
  expect.assertions(2)
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
  a.close()
  expect(a.id).toBeUndefined()
  expect(a.up).toBeUndefined()
})
