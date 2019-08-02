import {test} from "./ouput.shema"
import {A, DFlow} from "../src";
// import {A, AFlow} from "../src";


test("level3 - true some none", (t: any) => {
  let l3 = A.flow()
  let f3 = A.flow()
  const testTrue = v => t.ok(v, "testTrue")
  const testFalse = v => t.ok(!v, "testFalse")
  l3.upTrue(testTrue)
  l3(false)
  l3(true)
  l3.upSome(testTrue)
  l3.down(testTrue)
  l3.upTrue(testTrue)
  l3(null)
  l3.upNone(testFalse)
  l3(false)
  l3.upSome(testFalse)


  l3.up(f3)

  t.ok(l3.value === f3.value, "==")
  console.log(l3.value , f3.value)

  t.end()
})
