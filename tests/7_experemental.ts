import { test } from './ouput.shema'
import { A } from '../src'

test('plugins', async ({ plan, ok, end, pass, fail, equal }) => {
  const flow = A.flow()
  end()
})
