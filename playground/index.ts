import A from '../packages/facade'

const a1 = A(1)
a1.setId("a1")
const a2 = A()
a2.setId("a2")
const a3 = A()
a3.setId("a3")
const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
  console.log(v1,v2,v3)
  return v1 + v2  + (v3 ? '!' : ':')
})

const us = name => v=> console.log(name, v)

let a = A()
// a.upSome(us("some"))
// a.upTrue(us("true"))
// a.upNone(us("none"))
a.upFalse(us("false"))
// a.upSomeFalse(us("some-false"))
a(false)
a(null)
a(undefined)
a(1)
a(0)
//
// a2(null)
// a3(3)
// // a1(3)
// console.log(c())
// a2(2)
//
// console.log(c())
//
//
// // a1.upSome(us("a1"))
// // a2.upSome(us("a2"))
// // a3.upSome(us("a3"))
//
// console.log(c.value)

// console.log(A().from)

// console.log(A.from(a1))

// console.log("?", a1['from'])
