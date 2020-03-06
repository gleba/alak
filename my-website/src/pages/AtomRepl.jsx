import React, { useEffect, useState } from 'react'
import { MirrorRepl } from './Mirror'
import { installAtomDebuggerTool } from 'alak/debug'
import A from 'alak'
import { DebugTable } from './DebugTable'
import { DebugLog } from './DebugLog'
import { ABox } from './Abox'

const debugTool = installAtomDebuggerTool.instance()
global.A = A
const traceAtom = A()
traceAtom.setId("tracer")
global.trace = function(...a) {
  traceAtom(`> ${a.join(' ')}`)
}
const wrapCode = code=>`async function run(){
try {
${code}
} catch(e){
onError(e)
}}
run().then(complete).catch(onError)`
let lastChange
export function useRpl(startCode) {
  const [log, setLog] = useState()
  const [debugBox, setDebug] = useState()
   function runCode(code) {
    setLog('')
    setDebug(null)
    clearTimeout(lastChange)
    lastChange = setTimeout(() => {
      traceAtom.clear()
      const traceLogs = []
      traceAtom.up(string=>{
        traceLogs.push(string)
        setLog(traceLogs.join('\n'))
      })
      debugTool.startCollect()
      function complete(){
        const box = ABox()
        debugTool.stopCollect().forEach(c => {
          if (c[3] !== "tracer")
            box.push(c[2], c)
        })
        setDebug(box)
      }
      function onError(e) {
        setLog(`${e.toString()}`)
      }
      eval(wrapCode(code))

    }, 200)
  }
  useEffect(() => runCode(startCode), [startCode])
  return [log, debugBox, runCode]
}

export function AtomRepl(props) {
  const [log, debugBox, codeChange] = useRpl(props.code)
  return (
    <>
      <MirrorRepl code={props.code} onCodeChange={codeChange} />
      <div className='atom-stats'>
        <pre>{log}</pre>
        <div className='table-con'>
          <DebugTable box={debugBox} />
        </div>
      </div>
    </>
  )
}
