import * as React from 'react'

export default function Index() {
  const [count, setCount] = React.useState(null)

  React.useEffect(() => {
    async function init() {
      const module = await import('contours')
      const time = performance.now()
      const isolines = JSON.parse(await module.generate_iso_lines())
      console.log(isolines, performance.now() - time)
      // setCount(await module.generate_iso_lines())
    }
    init()
  }, [])

  return count === null ? 'Fetching count...' : `Count: ${count}`
}
