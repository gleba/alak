import { debug } from '../core/atom'
import { CoreAtom } from '../core'
import { DebugEvent } from './events'
import { debugInstance } from './instance'

const receivers = []

export const installAtomDebuggerTool = {
  default(options?: { port: number }) {
    pathCore()
  },
  host() {},
  instance() {
    pathCore()
    const inst = debugInstance()
    receivers.push(inst.receiver)
    return inst.controller
  },
}

function pathCore() {
  debug.enabled = true
  Object.keys(DebugEvent).forEach(
    eventName => (debug[eventName] = (...a) => routeEvent(eventName, ...a)),
  )
}
//event: string, atom: Atom, context?: string
function routeEvent(...args) {
  receivers.forEach(r => r(...args))
}
