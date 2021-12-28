import * as React from 'react'

const contours = []
let contoursModule = null
let start, localTime, globalTime, previousTimeStamp

function generateIsoLines() {
  return JSON.parse(contoursModule.generate_iso_lines())
}

function tick(timestamp, resolve) {
  if (start === undefined) {
    globalTime = performance.now()
    start = timestamp
  }

  const elapsed = timestamp - start

  if (previousTimeStamp !== timestamp) {
    localTime = performance.now()
    contours.push(generateIsoLines())
    console.log(
      `Generated lines in ${(performance.now() - localTime).toFixed(2)}ms`
    )
  }

  if (elapsed < 1000) {
    previousTimeStamp = timestamp
    requestAnimationFrame((timestamp) => tick(timestamp, resolve))
  } else {
    resolve()
  }
}

async function init() {
  if (contoursModule === null) {
    contoursModule = await import('contours')
  }
  return new Promise((resolve) => {
    requestAnimationFrame((timestamp) => tick(timestamp, resolve))
  })
}

export default function Index() {
  const [message, setMessage] = React.useState('Generating lines...')

  React.useEffect(() => {
    init().then(() => {
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
    </div>
  )
}
