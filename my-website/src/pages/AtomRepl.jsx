import React, { useEffect, useState } from 'react'
import { MirrorRepl } from './Mirror'
import { installAtomDebuggerTool } from 'alak/debug'
import A from 'alak'
import { DebugTable } from './DebugTable'
import { DebugLog } from './DebugLog'
import { ABox } from './Abox'

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
  const [debugBox, setDebug] = useState()
  function runCode(code) {
    clearTimeout(lastChange)
    lastChange = setTimeout(() => {
      try {
        traced = []
        debugTool.startCollect()
        eval(code)
        setLog(traced.join('\n'))
        const box = ABox()
        debugTool.stopCollect().forEach(c => box.push(c[2], c))
        setDebug(box)
      } catch (e) {
        setLog(`${traced.join('\n')}
ERROR: ${e.toString()}`)
      }
    }, 200)
  }
  useEffect(() => runCode(startCode), [])
  return [log, debugBox, runCode]
}

export function AtomRepl(props) {
  const [log, debugBox, codeChange] = useRpl(props.code)

  return (
    <>
      {/*<div className='full-width'>*/}
      <MirrorRepl code={props.code} onCodeChange={codeChange} />
      {/*<DebugLog box={debugBox} head={debugTool.logsHead}/>*/}
      {/*</div>*/}
      <div className='atom-stats'>
        <pre>{log}</pre>
        <div className='table-con'>
          <DebugTable box={debugBox} />
        </div>
      </div>
    </>
  )
}
