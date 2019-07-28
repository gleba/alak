import { AFunctor } from "./aFunctor";

export enum AFX {
  BornFx = "bornFx",
  Busy = "busy"
}

export const effects = {
  use(f: AFunctor, name: string, metaValue: any) {
    if (!f.meta) f.meta = {};
    f.meta[name] = metaValue;
  },
  add(f: AFunctor, name: string, metaValue: any) {
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
      return await knownEffects[name](f);
    }
  }
};

function toFxHolders(f: AFunctor, fxName, v) {
  if (f.metaMap && f.metaMap.has(fxName)) {
    f.metaMap.get(fxName).forEach(f => f(v));
  }
}

const knownEffects = {
  async [AFX.BornFx](f: AFunctor) {
    return new Promise(async done => {
      toFxHolders(f, AFX.Busy, true);
      let v = await f.meta[AFX.BornFx]();
      toFxHolders(f, AFX.Busy, false);
      done(v);
    });
    return null;
  }
};
