import { test } from "./ouput.shema";
import { isArray, isNumber, isString } from "util";
import { A, DFlow } from "../src";

test("level4 - from", (t: any) => {
  const aFlow = A.flow("know ");
  const bFlow = A.flow();

  const partlyFlow = A.flow();

  partlyFlow.from(aFlow, bFlow, partlyFlow).waterfall((a, b) => a + b);
  t.ok(partlyFlow.value == "know undefined", "waterfall");

  const holisticFlow = A.flow("ox");
  holisticFlow.from(aFlow, bFlow, holisticFlow).holistic((a, b, prev) => {
    t.ok(prev == "ox", "prev holistic");
    return a + b * 10 + "%";
  });
  holisticFlow.next(v => {
    t.ok(v == "know 100%", "next holistic");
  });
  bFlow(10);




  let flow1 = DFlow()
  let flow2 = DFlow()
  let flow3 = DFlow()
  let flow4 = DFlow()

  let hf = DFlow()

  hf.from(flow1,flow2,flow3,flow4).holistic((...v)=>{
    console.log(v)
    return "ko"
  })
  flow1(1)
  flow2(1)
  flow3(1)
  flow4(1)






  const asyncFlow = A.flow();
  const xFlow = A.flow();
  asyncFlow
    .from(xFlow, aFlow)
    .holistic(
      async (a, b) => new Promise(done => setTimeout(() => done(a + b), 100))
    );
  xFlow("we ");
  t.ok(!asyncFlow.value, "async from")
  asyncFlow.on(x => {
    t.ok(x="we know", "async return")
    t.end();
  });
});
