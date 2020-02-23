const { A } = require('../facade')

const startValue = 0
const finalValue = 1
function asyncFn() {
  return new Promise(done => {
    setTimeout(() => done(finalValue), 24)
  })
}

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

test('resend', async () => {
  let a = A(startValue)
  a.next(beStart)
  a.resend()
  expect.assertions(1)
})

test('name id', ()=>{
  let a = A()
  a.setId("sky")
  a.setName("bob")
  expect(a.id).toBe("sky")
  expect(a.name).toBe("bob")
})

test('sugar', ()=>{
  let a = A()
  a.upSome(v => expect(v !== undefined && v !== null).toBeTruthy())
  a.upTrue(v => expect(v).toBeTruthy())
  a.upNone(v => expect(v).toBeFalsy())
  a(false)
  a(finalValue)
  a(null)
  a(undefined)
  expect.assertions(5)
})


test('fmap', ()=>{
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

test("close", ()=>{
  let a = A(startValue)
  expect(!!a.id).toBeTruthy()
  a.close()
  expect(a.id).toBeUndefined()
  expect(a.up).toBeUndefined()
})
