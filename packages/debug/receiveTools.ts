import { CoreAtom } from '../core'

export type AtomSnap = [number, string, string, string[], any, number]
const orNone = v => (v != undefined ? v : '-')
export function atomSnapshot(atom: CoreAtom): AtomSnap {
  const { uid, id, flowName, metaMap, children, grandChildren } = atom
  const meta = metaMap ? [...metaMap.keys()] : '-'
  let size = children.size
  if (grandChildren) size += grandChildren.size
  const value = atom.value.length ? JSON.parse(JSON.stringify(atom.value[0])) : '-'
  return [uid, orNone(id), orNone(flowName), orNone(meta), value, size]
}
