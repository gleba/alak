const { A } = require('../facade')

const alive = v => (v !== undefined && v !== null)

test('upSome', () => {
  let a = A()
  a.upSome(v => {
    expect(alive(v)).toBeTruthy()
  })
  a(false) // +
  a(1)  // +
  a(0) // +
  a(null)
  a(undefined)
  expect.assertions(3)
})

test('upTrue', () => {
  let a = A()
  a.upTrue(v => {
    expect(v).toBeTruthy()
  })
  a(false)
  a(1)  // +
  a(0)
  a(null)
  a(undefined)
  expect.assertions(1)
})
//
test('upFalse', () => {
  let a = A()
  a.upFalse(v => {
    expect(v).toBeFalsy()
  })
  a(false) // +
  a(1)
  a(0) // +
  a(null) // +
  a(undefined) // +
  expect.assertions(4)
})

test('upSomeFalse', () => {
  let a = A()
  a.upSomeFalse(v => {
    expect(v).toBeFalsy()
  })
  a(false) // +
  a(1)
  a(0) // +
  a(null)
  a(undefined)
  expect.assertions(2)
})


test('upNone', () => {
  let a = A()
  a.upNone(v => {
    expect(alive(v)).toBeFalsy()
  })
  a(false)
  a(1)
  a(0)
  a(null)  // +
  a(undefined)  // +
  expect.assertions(2)
})

test('grand down', () => {
  const a = A()
  const fn = jest.fn()
  a.upSome(fn)
  a(false)
  a(1) // +
  a.down(fn)
  a(true)
  expect(fn).toHaveBeenCalledTimes(2)
  a.clearValue()
  a.upSome(fn)
  a(true)
  a.clear()
  a(true)
  expect(fn).toHaveBeenCalledTimes(3)
})
