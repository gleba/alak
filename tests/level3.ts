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

  const deepInc = (o,p="") => Object.keys(o).forEach(k=>{
    let ok = o[k]
    // console.log(p)
    switch (typeof ok){
      case "object":
        deepInc(ok,p+"."+k)
        break
      default:
        o[k]++
    }
  })


  let off = false
  const imF = v => {
    deepInc(v)
    t.ok(v.a3.b1 != o1.a3.b1, "A.immutable")
    if (off){
      t.ok(false, "A.immutable off")
    }
  }
  f.im(imF)

  o1.a3.b1++
  f(o1)
  f.off(imF)
  off = true
  f(o1)

  t.end()

})