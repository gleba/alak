import { test } from "./ouput.shema";
import { isArray, isNumber, isString } from "util";
import { DFlow } from "../src";

test("level5 - Meta name", (t: any) => {
  let flow1 = DFlow();
  let flow2 = DFlow();
  // let flow3 = DFlow()
  // let flow4 = DFlow()
  flow1.addMeta("metaone");
  t.ok(flow1.hasMeta("metaone"), "has meta");
  t.ok(!flow2.hasMeta("metaone"), "has meta");
  t.end();
});
