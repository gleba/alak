import {test} from "./ouput.shema"
import {A, AFlow} from "../src";


test("weak", (t: any) => {

  let m1 = A.f.meta1
  // m1.meta1
  // console.log(m1)

  // let mz = A.f

  //
  t.ok(m1.isMeta("meta1"), "A.f.meta1")
  //
  let m2 = A.flow("value").meta2 //A.f("value").meta2//("value")
  //
  t.ok(m2.isMeta("meta2"), "A.f(\"value\").meta2 - isMeta(\"meta2\")")
  t.ok(m2.isValue("value"), "A.f(\"value\").meta2 - isValue(\"value\")")
  //
  //
  let v = {s: "s"}
  let m3 = A.f({s: "s"})
  let o = m3.immutable
  t.ok(o.s == v.s, "immutable object")
  m3({s: "v"})
  t.ok(o.s == "v", "immutable object 2")
  t.ok(m3.isFlow, "m3.isFlow")
  t.ok(m3.isFlow("on"), "m3.isFlow('on')")
  t.ok(m3.isFlow(), "m3.isFlow()")
  t.ok(!m3.isFlow("onz"), "!m3.isFlow('onz')")
  //
  //
  //
  //
  //
  // console.log({t: typeof o})
  // console.log({o})
  // console.log(o.s)
  // m3({s: "v"})
  // console.log(o.s)

  // t.ok(m2.isMeta("meta2"),"A.f.meta1")
  // x.meta("metax")
  // let o = x.immutable
  // console.log(o)
  //
  // x.sss.ok("s_s")
  // console.log("o",x.v, o)
  // console.log(x.meta())
  // console.log(x())
  //
  // console.log(x.isMeta("sss"))
  // console.log(x.isMeta("ss"))
  // console.log(x())
  // console.log(A.flow)

  // setInterval(()=>{
  //   console.log("-")
  //   w1(Math.random())
  //   global.gc()
  // },1000)
  //
  // let o = {
  //   f:v=>{
  //     console.log(v)
  //
  //   },
  //   z(){
  //     setInterval(()=>{
  //       console.log("z")
  //       global.gc()
  //     },1000)
  //   }
  // }
  //
  // // w1.weakOn(o.f)
  //
  // o.z()
  // delete o.f
  // o = null
  t.end()

})