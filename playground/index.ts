import A from '../packages/facade'

const a1 = A(1)
a1.setId("a1")
const a2 = A()
a2.setId("a2")
const a3 = A()
a3.setId("a3")
const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
  console.log(v1,v2,v3)
  return v1 + v2 // + (v3 ? '!' : ':')
})



function jestFx(v){
  console.log("fx", v, this.id)
}
// a2.upNone(jestFx)
// a1.upSome(jestFx)
// a3.upSome(jestFx)

// a2("a")
// a3("x")
// a2(null)
// a1(3)
console.log(c())
a2(2)
a3(3)
console.log(c.value)
console.log(c())
//
// const us = name => v=> console.log(name, v)
//
// // a1.upSome(us("a1"))
// // a2.upSome(us("a2"))
// // a3.upSome(us("a3"))
//
// console.log(c.value)

// console.log(A().from)

// console.log(A.from(a1))

// console.log("?", a1['from'])
