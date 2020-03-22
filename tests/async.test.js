const { A } = require('../facade')


const startValue = 0
const finalValue = 1
function asyncFn() {
  return new Promise(done => {
    setTimeout(() => done(finalValue), 24)
  })
}


test('async getter', async () => {
  let a = A(startValue)
  a.setGetter(asyncFn)
  expect(a.isComposite).toBeTruthy()
  expect(a.isAsync).toBeFalsy()
  a()
  expect(a.value).toBe(startValue)
  expect(a.isAwaiting).toBeTruthy()
  await a()
  expect(a.isAwaiting).toBeFalsy()
  expect(a.value).toBe(finalValue)
})

test('async onAwait', async () => {
  let a = A(startValue)
  a.setGetter(asyncFn)
  let isWait = true
  a.onAwait(isAwaiting=>{
    expect(isAwaiting).toBe(isWait)
    isWait = !isWait
  })
  await a()

  a.clear()
  const fn = jest.fn()
  a.onAwait(fn)
  a.onAwait(()=>null)
  await a()
  a.offAwait(fn)
  await a()
  await a()
  expect(fn).toHaveBeenCalledTimes(2)
  expect.assertions(3)
})

