export class AFlowInjectable {
  mapObjects: Map<any, Function>
  inject(obj?) {
    if (!obj) obj = {}
    if (!this.mapObjects) this.mapObjects = new Map<any, Function>()
    Object.keys(this).forEach(k => {
      let f = this[k]
      if (f.on) {
        obj[k] = f.data[0]
        let fn = v => obj[k] = v
        f.on(fn)
        this.mapObjects.set(obj, fn)
      }
    })
    return obj
  }

  to(obj) {
    Object.keys(this).forEach(k => {
      let flow = this[k]
      if (flow.on) {
        flow.on(obj[k])
      }
    })
  }

  from(obj) {
    Object.keys(this).forEach(k => {
      let flow = obj[k]
      if (flow.on) {
        flow.on(this[k])
      }
    })
  }
}