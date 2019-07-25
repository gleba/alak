

export function setFunctorValue(functor: AFunctor, ...a) {

  if (!functor.childs){
    console.error("Attempt to pass in the killed flow")
    console.warn("it's possible memory leak in application")
    return
  }
  if (a.length > 0) {
    functor.value = a
  }
  notifyTheChildren(functor)
}
export function notifyTheChildren(functor:AFunctor ) {
  if (functor.childs.size > 0) {
    functor.childs.forEach(f => {
      f.apply(f, functor.value)
    })
  }
}


export const newAFunctor = () => {
  let childs = new Set<AChildFlow>()
  const functor = function (...a) {
    if (a.length)
      setFunctorValue(functor, ...a)
    else return functor.value
  } as AFunctor
  functor.childs = childs

  return functor as AFunctor
}

export type AChildFlow = {
  (...v: any[]): any
}

export interface AFunctor {
  childs: Set<AChildFlow>
  // passIn: (v: any) => void
  value: any
  (...a: any[]): void
}
