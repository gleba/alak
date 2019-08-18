import { test } from './ouput.shema'
import { A } from '../src'

test('state', ({ plan, ok, end, pass, fail }) => {
  const flow = A.flow()
  // flow.on.running
  end()
})
