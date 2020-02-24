const { A } = require('../facade')

test('compute some strategy', () => {
  const a1 = A(1)
  const a2 = A()
  const a3 = A()
  const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
    return v1 + v2 + (v3 ? '!' : ':')
  })
  a2("a")
  expect(c())
  a3(true)
  a2(null)
  expect(c()).toBe("1a!")
})
