import A from '../packages/facade'

const inAwaiting = atom => console.log(atom.id,(typeof atom().then === 'function'))

const aAuthors = A
const aBooks = A.getter(() => new Promise(done => setTimeout(() => done(['books']), 24)))
const aHero = A
// const aProfile = A.from(aAuthors, aBooks, aHero).strong((authors, books, hero) => {
//   console.log('mix fn : ', JSON.stringify({ authors, books, hero }))
//   return { authors, books, hero }
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
