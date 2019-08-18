import { AFunctor, notifyTheChildren, setFunctorValue } from "./aFunctor";
import { deleteParams } from "./utils";
import { patternMatch } from "./match";
import { effects } from "./AFX";
import { aFromFlows } from "./aFrom";

export const alive = v => (v !== undefined && v !== null) as boolean;
export const isTruth = v => !!v;
export const nullFilter = f => v => (alive(v) ? f(v) : null);
export const someFilter = f => v => (!alive(v) ? f(v) : null);
export const trueFilter = f => v => (isTruth(v) ? f(v) : null);
const dipFun = (functor, f) => (...a) => f(functor, ...a);
export const aProxyHandler: ProxyHandler<AFunctor> = {
  get(functor: AFunctor, prop: string) {
    switch (prop) {
      case "v":
      case "value":
      case "data":
        return functor.value.length > 1 ? functor.value : functor.value[0];
      case "apply":
        return (context, v) => {
          functor.bind(context);
          setFunctorValue(functor, v[0]);
        };
      case "next":
        return f => functor.children.add(f);
      case "up":
      case "$":
      case "on":
        return f => {
          functor.children.add(f);
          if (functor.value && functor.value.length) f.apply(f, functor.value);
        };
      case "once":
        return f => {
          if (functor.value && functor.value.length) f.apply(f, functor.value);
          else {
            const once = v => {
              f.apply(f, functor.value);
              functor.children.delete(once)
            }
            functor.children.add(once)
          }
        };
      case "isEmpty":
        return !functor.value.length
      case "is":
        return v => {
          if (functor.value && functor.value.length) {
            return functor.value[0] === v;
          } else {
            return v === null || v === undefined;
          }
        };
      case "isAsync":
        return functor.meta && functor.meta.born;
      case "useFx":
        return (name, f) => effects.use(functor, name, f);
      case "addFx":
        return (name, f) => effects.add(functor, name, f);
      case "removeFx":
        return (name, f) => effects.remove(functor, name, f);
      // case "onFx":
      //   return (name, f) => onFx(functor, name, f);
      case "upSome":
        return f => {
          functor.grandChildren.set(f, nullFilter(f));
          let v = functor.value[0];
          if (alive(v)) f.apply(f, [v]);
        };
      case "upTrue":
        return f => {
          functor.grandChildren.set(f, trueFilter(f));
          let v = functor.value[0];
          if (v) f.apply(f, [v]);
        };
      case "upNone":
        return f => {
          functor.grandChildren.set(f, someFilter(f));
          let v = functor.value[0];
          if (functor.value.length && !alive(v)) f.apply(f, [v]);
        };
      case "nullSafe":
      case "safe":
        return v => {
          if (alive(v)) setFunctorValue(functor, v);
        };
      case "down":
      case "off":
        return f => {
          if (functor.children.has(f)) functor.children.delete(f);
          else if (functor.grandChildren.has(f)) functor.grandChildren.delete(f);
        };
      case "clear":
        return ()=> {
          functor.children.clear();
          functor.grandChildren.clear();
          functor.value = []
          delete functor.haveFrom
        }
      case "clearValue":
        return ()=> functor.value = []
      case "kill":
      case "end":
        return () => {
          functor.children.clear();
          deleteParams(functor);
        };
      case "notify":
      case "notifyChildren":
      case "emit":
        return () => notifyTheChildren(functor);
      case "match":
        return (...pattern) => {
          let f = patternMatch(pattern);
          functor.children.add(f);
          if (functor.value && functor.value.length) f.apply(f, functor.value);
        };
      case "mutate":
        return mutatorFn => setFunctorValue(functor, mutatorFn(...functor.value));
      case "setId":
        return id => (functor.id = id);
      case "id":
        return functor.id;
      case "from":
        return (...flows) => aFromFlows(functor, ...flows);
      case "addMeta":
        return (metaName, value?) => {
          if (!functor.metaMap) functor.metaMap = new Map<string, any>();
          functor.metaMap.set(metaName, value ? value : null);
        };
      case "hasMeta":
        return metaName => {
          if (!functor.metaMap) return false;
          return functor.metaMap.has(metaName);
        };
      case "getMeta":
        return metaName => {
          if (!functor.metaMap) return null;
          return functor.metaMap.get(metaName);
        };
    }
    return false;
  }
};
