import { AtomSnap, atomSnapshot } from './receiveTools'

export type AtomLog = [number, string, number, any, string, string,  string[], number, string?]
const logsHead = ['time', 'event', 'uid', 'value', 'name', 'id', 'meta', 'children', 'context']
export function debugInstance() {
  let isCollecting = false
  let collection: AtomLog[] = []

  function startCollect() {
    isCollecting = false
    collection = []
  }
  function stopCollect() {
    isCollecting = true
    return collection
  }

  let recordListener
  function onRecord(fn) {
    recordListener = fn
  }
  const records = []
  const controller = {
    logsHead,
    records,
    startCollect,
    stopCollect,
    onRecord,
  } as {
    startCollect(): void
    stopCollect(): AtomLog[]
    onRecord(recordListener: (log: AtomLog) => void): void
  }
  const timeStart = Date.now()
  return {
    controller,
    receiver(event: string, atom, ...context) {
      const snap = atomSnapshot(atom)
      context && snap.push(context)
      const record = [Date.now() - timeStart, event, ...snap] as AtomLog
      isCollecting && collection.push(record)
      records.push(record)
      recordListener && recordListener(record)
    },
  }
}
