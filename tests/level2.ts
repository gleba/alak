import { test } from "./ouput.shema";
import {A, AFX, DFlow} from "../src";

// import {AFX} from "../src/AFX";
// import {A, AFlow} from "../src";

test("level2", async (t: any) => {
  let m2 = A.flow()
  let i1 = 0
  const l2 = ()=>new Promise(done=>{
    setTimeout(done, 400)
  })
  const bFx = v =>{
    console.log("bFx:", v,i1++)
  }
  m2.useFx(AFX.Born, l2)
  m2.addFx(AFX.Busy,bFx)
  await m2()
  m2.removeFx(AFX.Busy, bFx)
  await m2()
  t.ok(i1 == 2, "AFX");

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
  t.end();
});
