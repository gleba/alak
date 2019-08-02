import { AFlow } from "../index";
import { setFunctorValue } from "./aFunctor";

export function aFromFlows(functor, ...flows: AFlow<any>[]) {
  if (functor.haveAfromMix) {
    console.warn(functor)
    throw `functor ${functor.id?functor.id:""} already has a assigned 'from(function..', reassign 'from' to attest to business logic errors`
  } else {
    functor.haveAfromMix = true
  }

  const notify = (fn) => {
    let values = flows.map(flow => flow.value);
    // console.log("notify")
    setFunctorValue(functor, fn(...values));
  };
  function waterfall(fn) {
    flows.forEach(flow => {
      if (flow != functor.proxy) flow.next(()=>notify(fn));
    });
    notify(fn);
  }
  function holistic(fn) {
    let needToRun = flows.length;
    let waitSet = new Set();
    const countActiveFlows = f => {
      // console.log("-")
      if (waitSet) waitSet.add(f);
      if (!waitSet || waitSet.size == needToRun) {
        // console.log("ready")
        notify(fn)
        waitSet = null
      }
    };
    flows.forEach(flow => {
      if (flow == functor.proxy) needToRun--;
      else flow.on(() => countActiveFlows(flow));
    });
  }
  return {
    waterfall,
    holistic
  };
}
