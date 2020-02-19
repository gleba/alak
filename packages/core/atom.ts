import { FState, notifyStateListeners } from './state'


type AnyFunction = {
  (...v: any[]): any
}

export type Atom = {
  children: Set<AnyFunction>
  grandChildren: Map<AnyFunction, AnyFunction>
  stateListeners: Map<string, Set<AnyFunction>>
  getterFn: any
  wrapperFn: any
  meta: any
  // metaSet: Set<string>
  metaMap: Map<string, any>
  proxy: any
  value: any
  uid: number
  id: string
  flowName: string
  haveFrom: boolean
  isAsync: boolean
  inAwaiting: boolean
  strongFn: Function
  (...a: any[]): void
}


export function setAtomValue(atom: Atom, ...a) {
  if (!atom.children) {
    console.error('Attempt to pass in the ended newFlow ', atom.id ? atom.id : '')
    console.warn("it's possible memory leak in application")
    return atom.proxy
  }

  let [value, context] = a
  // if (dev.debug) dev.updatingStarted(atom, context)
  const setValue = finalValue => {
    if (atom.wrapperFn) {
      let wrappedValue = atom.wrapperFn(finalValue, atom.value[0])
      if (wrappedValue.then) return setAsyncValue(atom, wrappedValue)
      atom.value = [wrappedValue]
    } else {
      atom.value = [finalValue]
    }
    // if (dev.debug) dev.updatingFinished(atom.uid, finalValue)
    notifyChildes(atom)
    return atom.value[0]
  }

  if (value && value.then) {
    return setAsyncValue(atom, value)
  } else {
    return setValue(value)
  }
}

async function setAsyncValue(atom: Atom, promise: PromiseLike<any>) {
  notifyStateListeners(atom, FState.AWAIT, true)
  atom.inAwaiting = true
  atom.isAsync = true
  let v = await promise
  atom.value = [v]
  atom.inAwaiting = false
  notifyStateListeners(atom, FState.AWAIT, false)
  // if (dev.debug) dev.updatingFinished(atom.uid, v)
  notifyChildes(atom)
  return v
}


const notify = (atom: Atom, whose) =>
  whose && whose.size > 0 && whose.forEach(f => f.apply(atom.proxy, atom.value))

export function notifyChildes(atom: Atom) {
  // console.log('→', atom.flowName, atom.value)
  notify(atom, atom.children)
  notify(atom, atom.grandChildren)
}


export function grandUpFn(atom:Atom, f:AnyFunction, ff:AnyFunction):any {
  if (!atom.grandChildren) atom.grandChildren =  new Map()
  atom.grandChildren.set(f, ff)
  return atom.value[0]
}
export const createAtom = (...a) => {
  const atom = function() {
    if (arguments.length) {
      if (typeof arguments[0] == 'function') {
        atom.getterFn = arguments[0]
      } else {
        return setAtomValue(atom, ...arguments)
      }
    } else {
      if (atom.strongFn) {
        return atom.strongFn()
      }
      if (atom.getterFn) return setAtomValue(atom, atom.getterFn(), 'getter')
      let v = atom.value
      return v && v.length ? v[0] : undefined
    }
  } as Atom
  atom.children = new Set<AnyFunction>()
  // atom.grandChildren = new Map<AnyFunction, AnyFunction>()
  // atom.stateListeners = new Map<string, Set<AnyFunction>>()
  atom.value = []
  // atom.uid = Math.random()
  if (a.length) {
    atom(...a)
  }
  return atom as any
}
