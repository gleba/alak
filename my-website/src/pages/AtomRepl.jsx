import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MirrorRepl } from './Mirror'
import { installAtomDebuggerTool } from 'alak/debug'
import A from 'alak'
import { DebugTable } from './DebugTable'

const debugTool = installAtomDebuggerTool.instance()
global.A = A
let traced = []
global.trace = function(...a) {
  console.log(a.join(' '))
  traced.push(`> ${a.join(' ')}`)
}
let lastChange
export function useRpl(startCode) {
  const [log, setLog] = useState()
  const [debugLog, setDebug] = useState()
  function runCode(code) {
    clearTimeout(lastChange)
    lastChange = setTimeout(() => {
      try {
        traced = []
        debugTool.startCollect()
        eval(code)
        setLog(traced.join('\n'))
        setDebug(debugTool.stopCollect())
      } catch (e) {
        setLog(`${traced.join('\n')}
ERROR: ${e.toString()}`)
      }
    }, 200)
  }
  useEffect(() => runCode(startCode), [])
  return [log, debugLog, debugTool. runCode]
}

export function AtomRepl(props) {
  const [log, debug, codeChange] = useRpl(props.code)


  return (
    <>
      <MirrorRepl code={props.code} onCodeChange={codeChange} />
      <div className='atom-stats'>
        <pre>{log}</pre>
        <DebugTable debug={debug} head={debugTool.logsHead}/>
      </div>
    </>
  )
}
