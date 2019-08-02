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
  t.end();
});
