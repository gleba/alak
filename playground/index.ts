import A from '../packages/facade'
import chalk from 'chalk'
import { ComputeStrategy, installComputedExtension } from '../packages/ext-computed'
import { AC } from '../packages/core'
import { installMatchingExtension } from '../packages/ext-matching'
const inAwaiting = atom =>
  typeof atom().then === 'function'
    ? console.log(chalk.green('async'))
    : console.log(chalk.red('sync'))

installComputedExtension()
installMatchingExtension()

declare module '../packages/core' {
  interface ProxyAtom<T> {
    match(...pattern: any[]): ProxyAtom<T>
    from<A extends ProxyAtom<any>[]>(...a: A): ComputeStrategy<T, A>
  }
}
let a = A()

a.match(
  3, v => console.log("is 3"),
  Array.isArray, v=> console.log("is array", v),
  _ => console.log("мимо")
)

a(1)
a(3)
a('8')
a([0])


console.log(a.match)


// console.log(a.children)
// const a = A()
// a.decay()
// a()
// console.log(a.up)

// const c = A.wrap<number>(v => v * v)
// c(2)
// c.up(console.log)

// c.from(a).some(v=>{
//
// })
// c.from(a).weak(a_V => a_V)

//
// const a1 = A.getter(() => {
//   console.log("f1")
//   return new Promise(done=> setTimeout(()=>done(Math.random()),100))
// })
//
// const a2 = A.getOnce(() => {
//   // console.log('f2')
//   return '-'
// })
// const a3 = A()
// a1()
//
// const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
//   return new Promise(done => setTimeout(()=>done(v1 + v2 + (v3 ? '!' : ':')),24))
// })
// a2()
// c.up(v => {
//   console.log("up", v)
// })
// a3(true)
// console.log("==============")
// async function test(){
//   inAwaiting(c)
//   await c()
//   console.log(c())
//   // console.log(c())
//   // await c()
//   // a2()
//   // await a1()
//   // await a1()
//   // await a1()
//   // await a1()
// }
// test()

// console.log(c())

// c()
// console.log("-")

// console.log('---')
// console.log(c())
// // console.log(c.value)
// console.log('-')
//
// console.log('---')
// console.log(c())
// // console.log(c.value)
// console.log('-')

// console.log(c.value)
// console.log(c())
// console.log(c())
// console.log(c.value)

// a1.up(console.log)
// a1()
// a1()
// a1()
// console.log(c.value)
// console.log(c())
// console.log(c.value)

// console.log(c())

// const a1 = A.id("a1", 1)
// const a2 = A.id("a2")
// const a3 = A.id("a3")
// const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
//   console.log("::::::", v2)
//   return v1 + v2 + (v3 ? '!' : ':')
// })

// a2("a")
// // inAwaiting(c)
// a3(true)
// // console.log(c())
//
// console.log("---")
// a2(undefined)
// // a2("v")
// console.log("---")
// // console.log(c())
// inAwaiting(c)
//
// c.up(v=>{
//   console.log("up")
// })
// console.log(c.value)

// const a1 = A(1)
// const a2 = A()
// const a3 = A()
// const c = A.from(a1, a2, a3).some((v1, v2, v3) => {
//   console.log("::", v1,v2,v3)
//   return v1 + v2 + (v3 ? '!' : ':')
// })
//
// a2('a')
// inAwaiting(c)
// a3(true)
// console.log(c())
// a3(null)
// inAwaiting(c)
// console.log(c.value)
// a3(false)
// console.log(c())

// console.log(c())
// console.log(c())

//
// const aHero = A()
// const aAuthor = A.from(aHero).strong(hero => {
//   return `Author of ${hero}`
// })
// const aBooks = A.getOnce(() => {
//   console.log('books getter')
//   return new Promise(done => setTimeout(() => done(['books', 'library']), 24))
// })
//
// const aProfile = A
//   .from(aAuthor, aBooks, aHero)
//   .strong((author, books, hero) => {
//   // console.log('mix fn : ', JSON.stringify({ author, books, hero }))
//   return { author, books, hero }
// })
// // aBooks()/
// //
// // // console.log('?-?')
// //
// //
// //
// // // console.log(aProfile())
//
//
// aHero("Zorro")
// // console.log("?")
// aProfile()['then'](v=>{
//   console.log("------")
//   aHero('Batman')
// })
// aProfile.up(()=>{
//   console.log("end")
// })
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
