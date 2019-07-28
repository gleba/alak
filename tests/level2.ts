import { test } from "./ouput.shema";
import { A, DFlow } from "../src";
// import {A, AFlow} from "../src";

test("level2", (t: any) => {
  // let m2 = A.m.meta2("value");
  // t.ok(m2.isMeta("meta2"), "A.f.meta2('value') - isMeta(\"meta2\")");
  // t.ok(m2.isValue("value"), "A.f.meta2('value') - isValue(\"value\")");

  // let v = { x: 1 };
  // let m3 = A.flow(v);
  //
  // m3.im(f=>{
  //   f.x = 2
  // })

  // m3.im(f=>{
  //   t.ok(f.x == 1, "immutable im listener");
  // })
  //
  // let o = m3.imv
  // t.ok(o.x == 1, "immutable get imv");
  //
  // let m4 = A.f(v);
  // m4.immutable
  // v.x = 2
  // t.ok(m4().x == 2, "immutable");
  // m4.immutable()
  // v.x = 3
  // t.ok(m4().x == 2, "immutable()");
  //
  // let coolParams = ["2", 2];
  // let isCool;
  // A.install("cool", (...a) => {
  //   isCool = coolParams;
  // });
  // t.ok(A.cool, "A.cool");
  // A.cool(...coolParams);
  // t.ok(isCool == coolParams, "A very cool");

  // m2.setId("im a name");
  // console.log(m2.id);

  // t.ok(m2.id == "im a name", "named");
  // t.end();
});
