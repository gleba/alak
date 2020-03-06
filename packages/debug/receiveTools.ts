import { Core } from '../atom'

export type AtomSnap = [number, string, string, string[], any, number]
const orNone = v => (v != undefined ? v : '')
export function atomSnapshot(atom: Core): AtomSnap {
  const { uid, id, _name, metaMap, children, grandChildren } = atom
  const meta = metaMap ? [...metaMap.keys()] : ''
  let size = children.size
  if (grandChildren) size += grandChildren.size
  const value = atom.value ? JSON.parse(JSON.stringify(atom.value)) : ''
  return [uid, orNone(id), orNone(_name), orNone(meta), value, size]
}
