import {test} from "./ouput.shema"
import {A, DFlow} from "../src";
// import {A, AFlow} from "../src";


test("level2", (t: any) => {

  let o1 = {
    a0: [1, 1, 1],
    a1: "1",
    a2: 1,
    a3: {
      b0: [1, {
        c0: 1,
        c1: [1, 1],
      }],
      b1: 1,
    }
  }
  let f = A.f(o1)
  //
  const deepInc = (o, p = "") => Object.keys(o).forEach(k => {
    let ok = o[k]
    // console.log(p)
    switch (typeof ok) {
      case "object":
        deepInc(ok, p + "." + k)
        break
      default:
        o[k]++
    }
  })
  //
  //
  let off = false
  const imF = v => {

    deepInc(v)
    t.ok(v.a3.b1 != o1.a3.b1, "A.immutable")
    if (off) {
      t.ok(false, "A.immutable off")
    }
  }
  f.im(imF)

  o1.a3.b1++
  f(o1)
  f.off(imF)
  off = true
  f(o1)

  let f2 = A.f([":lljljlkjkllj", 2])
  t.ok(Array.isArray(f2.v) == Array.isArray(f2.imv), "immutable array")
  t.ok(Array.isArray(f2.v[0]) == Array.isArray(f2.imv[0]), "immutable array")
  // f2.im(v=> console.log(v))
  //
  let o3 = {a: ["oxxx"], sp: true}
  let f3 = A.f(o3)
  t.ok(f3.imv.a[0] == o3.a[0] , "immutable object")
  let imv = f3.imv
  imv.a.push("zzz")

  t.ok(imv != o3 , "imv")

  let o4 = A.f
  o4.on(v=>{
    t.ok(false, "silent")
  })

  let os = {a:1,b:2} as any
  o4.silent(os)
  t.ok(o4.v == os, "silent")

  let o5= A.f
  o5.im(x=>{
    console.log(x)
  })

  o5(null)


  t.end()

})