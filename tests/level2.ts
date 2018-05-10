import {test} from "./ouput.shema"
import {A, DFlow} from "../src";
// import {A, AFlow} from "../src";


test("level2", (t: any) => {

  let m2 = A.m.meta2('value')

  t.ok(m2.isMeta("meta2"), "A.f.meta2('value') - isMeta(\"meta2\")")
  t.ok(m2.isValue("value"), "A.f.meta2('value') - isValue(\"value\")")
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

  let coolParams = ["2",2]
  let isCool
  A.install('cool', (...a)=>{
    isCool = coolParams
  })
  t.ok(A.cool, "A.cool")
  A.cool(...coolParams)
  t.ok(isCool == coolParams, "A very cool")

  m2.setId("im a name")
  console.log(m2.id)

  t.ok(m2.id == "im a name", "named")
  t.end()

})