import {test} from "./ouput.shema"
import {isArray, isNumber, isString} from "util";
import DFlow from "../src";


test("Alak test", (t: any) => {

  const a1 = DFlow()

  a1.on(x => t.fail("end test"))
  a1.end()
  a1(0)

  const s1 = DFlow([0, 0, 0], 5 as any)
  s1.on((v1: any, v2) => {
    t.ok(v1.length == 3 && v2 == 5, "base");
  })


  const s2 = DFlow()
  s2.on(x => {
    t.ok(x == 4, "base+ " + x);
  })
  s2(4)
  s2(4, 0)


  const s3 = DFlow()
  s3.on(x => {
    t.ok(true, "emit ok")
  })

  s3.emit()
  const s4 = DFlow()

  s4.match(
    3, x => t.ok(3 == x, "pattern matching by key"),
    "never", x => t.fail("silent pattern matching *", x)
  )
  s4.match(v => [
    isNumber(v), v => t.ok(typeof v == "number", "fn pattern matching isNumber"),
    isArray(v), v => t.fail("fn pattern matching"),
    v == 3, v => t.ok(v == 3, "fn pattern matching +"),
    v => t.pass('fn pattern matching else')
  ])
  s4(3)
  s4(1)
  s4("8")


  let state1 = [5, true, "1"]
  let state2 = [1, 0, [0, 1]]
  const s5 = DFlow(Math.random() as any)
  s5.match(
    ...state1, v => t.pass('s5: pattern matching user state 1'),
    ...state2, v => t.pass('s5: pattern matching user state 2'),
    5, false, "2", (...v) => t.pass('s5: pattern matching user state +'),
    5, true, "3", (...v) => t.pass('s5: map base done'),
    (...v) => t.pass('s5: pattern matching else state ' + v),
  )

  s5.match((a, b, c) => [
    isArray(c), () => t.pass("s5: fn pattern matching isArray(c)"),
    a == "_" && isString(c), (...v) => t.ok(s5()[0] == "_", "s5: fn pattern matching multi")
  ])
  // s5(5, false, "2")
  // s5(105, true, "2")
  s5(...state2)
  s5(...state1)
  s5.mutate((...v) => {
    t.ok(state1[2] == v[2], 's5: mutate in')
    v[2] = "3"
    v[0] = "_"
    return v
  })
  t.ok(s5.v[2] == '3', 's5: mutate out')


  let s6 = DFlow(1)
  t.ok(s6.data == s6.v as any, 's6.data == s6.v')
  s6(2)
  s6.mutate(x => x + 1)
  t.ok(3 == s6() && s6.data == s6.v as any, 's6')


  let s7 = DFlow().stateless()
  s7("any")
  let neverFn = v=>t.ok(false, 'neverFn called')
  s7.on(neverFn)
  s7.off(neverFn)

  s7.match(
    'stateless', v=>t.ok(true, 's7: stateless'),
  )


  s7('stateless')
  s7.on(neverFn)
  s7()
  s7.off(neverFn)
  s7.on(v=>{
    t.ok(true, 's7: emitter')
  })
  s7.emitter(true)
  s7()

})