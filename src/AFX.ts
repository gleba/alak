import {AFunctor, notifyTheChildren, setFunctorValue} from "./aFunctor";

export enum AFX {
  Born = "born",
  Busy = "busy"
}

const maybePromise = (fn, v) => new Promise(done=>{
  let r = fn(v)
  if (r.then) r.then(done)
  else done()
})

export const effects = {
  use(f: AFunctor, name: string, metaValue: any) {
    if (!f.meta) f.meta = {};
    f.meta[name] = metaValue;
    // console.log("use fx", name)

  },
  add(f: AFunctor, name: string, metaValue: any) {
    // console.log("fx add", name)
    if (!f.metaMap) f.metaMap = new Map();
    if (!f.metaMap.has(name)) f.metaMap.set(name, new Set<any>());
    f.metaMap.get(name).add(metaValue);
  },
  remove(f: AFunctor, name: string, metaValue: any) {
    if (!f.metaMap.has(name)) return;
    let m = f.metaMap.get(name);
    if (!m.has(metaValue)) return;
    m.delete(metaValue);
  },
  async run(f: AFunctor, name) {
    if (knownEffects[name]) {
      const v = await knownEffects[name](f);
      setFunctorValue(f, v)
      return v
    }
  }
};

function toFxHolders(f: AFunctor, fxName, v) {
  if (f.metaMap && f.metaMap.has(fxName)) {
    f.metaMap.get(fxName).forEach(f => f(v));
  }
}

const knownEffects = {
  async [AFX.Born](f: AFunctor) {
    // console.log("knownEffects", f.id, f.meta, )
    return new Promise(async done => {
      // console.log("fx run", AFX.Born)
      let r = f.meta[AFX.Born]();
      if (r.then){
        toFxHolders(f, AFX.Busy, true);
        r.then(v=>{
          toFxHolders(f, AFX.Busy, false);
          // console.log(f.id, "async", v)
          done(v);
        })
      } else {
        // console.log(f.id, "sync", r)
        done(r)
      }
    });
    return null;
  }
};
