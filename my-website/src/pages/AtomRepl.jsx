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
global.trace = function(...a) {
  traceAtom(`> ${a.join(' ')}`)
}
const wrapCode = code=>`async function run(){
${code}
}
run().then(complete)
`
let lastChange
export function useRpl(startCode) {
  const [log, setLog] = useState()
  const [debugBox, setDebug] = useState()
   function runCode(code) {
    clearTimeout(lastChange)
    lastChange = setTimeout(() => {
      traceAtom.clear()
      const traceLogs = []
      setLog('')
      traceAtom.up(string=>{
        console.log(">>>>>>>", string)
        traceLogs.push(string)
        setLog(traceLogs.join('\n'))
      })
      try {
        debugTool.startCollect()
        function complete(){
          console.log("complete!")
        }
        eval(wrapCode(code))
        const box = ABox()
        debugTool.stopCollect().forEach(c => box.push(c[2], c))
        setDebug(box)
      } catch (e) {
        setLog(`${traced.join('\n')}
ERROR: ${e.toString()}`)
      }
    }, 200)
  }
  useEffect(() => runCode(startCode), [startCode])
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
