import A from '../packages/facade'
const inAwaiting = atom => console.log(typeof atom().then === 'function')
// const a1 = A.id("a1", 1)
// const a2 = A.id("a2")
// const a3 = A.id("a3")
// const c = A.from(a1, a2, a3).strong((v1, v2, v3) => {
//   console.log(v2)
//   return v1 + v2 + (v3 ? '!' : ':')
// })
// a2("a")
// inAwaiting(c)
// a3(true)
// console.log(c())
//
// a3(null)
// inAwaiting(c)
// console.log(c.value)
// a3(false)
// console.log(c())

//
const aHero = A()
const aAuthor = A.from(aHero).some(hero => {
  return `Author of ${hero}`
})
const aBooks = A.getOnce(() => {
  console.log('books getter')
  return new Promise(done => setTimeout(() => done(['books', 'library']), 24))
})

const aProfile = A
  .from(aAuthor, aBooks, aHero)
  .some((author, books, hero) => {
  // console.log('mix fn : ', JSON.stringify({ author, books, hero }))
  return { author, books, hero }
})
aBooks()
//
// // console.log('?-?')
//
//
//
// // console.log(aProfile())


aHero("Zorro")
// console.log("?")
aProfile()['then'](v=>{
  console.log("------")
  aHero('Batman')
})
aProfile.up(()=>{
  console.log("end")
})
// aProfile.up(()=>{
//   console.log("end")
// })
// aProfile.up(()=>{
//   console.log("end")
// })


// expect(c()).toBe("1a!")
// const us = name => v=> console.log(name, v)
//
// let a = A()
// // a.upSome(us("some"))
// // a.upTrue(us("true"))
// // a.upNone(us("none"))
// a.upFalse(us("false"))
// // a.upSomeFalse(us("some-false"))
// a(false)
// a(null)
// a(undefined)
// a(1)
// a(0)
// //
// // books(null)
// // a3(3)
// // // a1(3)
// // console.log(c())
// // books(2)
// //
// // console.log(c())
// //
// //
// // // a1.upSome(us("a1"))
// // // books.upSome(us("books"))
// // // a3.upSome(us("a3"))
// //
// // console.log(c.value)
//
// // console.log(A().from)
//
// // console.log(A.from(a1))
//
// // console.log("?", a1['from'])
