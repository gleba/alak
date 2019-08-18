import { test } from './ouput.shema'
import { A } from '../src'

test('born', async ({ plan, ok, end, pass, fail }) => {
  const flow = A.flow(()=>"bored")


  const flow2 = A.flow(
    () =>
      new Promise(done =>
        setTimeout(() => {
          done('bored')
        }, 200),
      ),
  )


  console.log(flow())
  console.log(await flow2())



  end()
})
