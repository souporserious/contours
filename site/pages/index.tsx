import * as React from 'react'

const contours = []
let contoursModule = null
let start, localTime, globalTime, previousTimeStamp

function generateIsoLines() {
  return JSON.parse(contoursModule.generate_iso_lines())
}

function tick(timestamp, resolve, pathElement) {
  if (start === undefined) {
    globalTime = performance.now()
    start = timestamp
  }

  const elapsed = timestamp - start

  if (previousTimeStamp !== timestamp) {
    localTime = performance.now()
    const pathData = generateIsoLines()
    pathElement.setAttribute('d', pathData)
    contours.push(pathData)
    console.log(
      `Generated lines in ${(performance.now() - localTime).toFixed(2)}ms`
    )
  }

  if (elapsed < 1000) {
    previousTimeStamp = timestamp
    requestAnimationFrame((timestamp) => tick(timestamp, resolve, pathElement))
  } else {
    resolve()
  }
}

async function init(pathElement: SVGPathElement) {
  if (contoursModule === null) {
    contoursModule = await import('contours')
  }
  return new Promise((resolve) => {
    requestAnimationFrame((timestamp) => tick(timestamp, resolve, pathElement))
  })
}

export default function Index() {
  const ref = React.useRef(null)
  const [message, setMessage] = React.useState('Generating lines...')

  React.useLayoutEffect(() => {
    init(ref.current).then(() => {
      console.log(contours)
      setMessage(
        `Generated ${contours.length} lines in ${(
          performance.now() - globalTime
        ).toFixed(2)}ms`
      )
    })
  }, [])

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
      }}
    >
      <h1>{message}</h1>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <path ref={ref} />
      </svg>
    </div>
  )
}
