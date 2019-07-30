import {test} from "./ouput.shema"
import {A, DFlow} from "../src";
// import {A, AFlow} from "../src";


test("level3", (t: any) => {
  let l3 = A.flow()
  const testTrue = v => t.ok(v, "testTrue")
  const testFalse = v => t.ok(!v, "testFalse")
  l3.ifTrue(testTrue)
  l3(false)
  l3(true)
  l3.ifSome(testTrue)
  l3.down(testTrue)
  l3.ifTrue(testTrue)
  l3(null)
  l3.ifNone(testFalse)
  l3(false)
  l3.ifSome(testFalse)
  t.end()
})
