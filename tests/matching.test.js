const { A } = require('../facade')

const startValue = 0
const finalValue = 1
function asyncFn() {
  return new Promise(done => {
    setTimeout(() => done(finalValue), 24)
  })
}

test('matching base', async () => {
  const a = A(startValue)
  const arrayResolver = jest.fn()
  const nothingResolver = jest.fn()
  const dataObjectResolver = jest.fn()
  const dataObject = {
    id: 1,
  }
  // prettier-ignore
  a.match(
    startValue, v => expect(v).toBe(startValue),
    Array.isArray, arrayResolver,
    dataObject, dataObjectResolver,
    nothingResolver
  )
  a(finalValue)
  a([1, 2])
  a({ id: 1 })
  expect(arrayResolver).toHaveBeenCalledTimes(1)
  expect(nothingResolver).toHaveBeenCalledTimes(1)
  expect(dataObjectResolver).toHaveBeenCalledTimes(1)
  expect.assertions(4)
})

// prettier-ignore
test('matching array', async () => {
  const atom = A()
  const cFalseResolver = jest.fn()
  const stringResolver = jest.fn()
  const noOneResolver = jest.fn()
  atom.match(([a, b, c]) => [
    a && b, ()=> expect(a && b).toBeTruthy(),
    typeof b == 'string', stringResolver,
    c === false, cFalseResolver,
    noOneResolver
  ])
  atom([true, true, false])
  atom([false, "A", true])
  atom([false, false, false])
  atom([false, false, true])
  expect(stringResolver).toHaveBeenCalledTimes(1)
  expect(cFalseResolver).toHaveBeenCalledTimes(2)
  expect(noOneResolver).toHaveBeenCalledTimes(1)
  expect(5)
})
