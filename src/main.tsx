import { Block, Button, Flexbox, Grid, Header, Meter, Text, Viewport } from '@stage-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Engine, EngineState } from './engine/Engine'
import GameOverlay from './overlay'

let engine: Engine

function App() {
  const [engineState, setEngineState] = useState<EngineState | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    engine = new Engine({
      debug: true,
      container: ref.current!,
      width: 800,
      height: 600,
      onStateChange: (state) => {
        setEngineState({ ...state })
      },
    })
  }, [])
  
  return (
    <Viewport>
      <Flexbox column centered mt="m">
        <Block shadow="m" w="50rem" h="37.5rem" overflow="hidden" borderRadius="xl">
          <div ref={ref} />
          <GameOverlay engine={engine} state={engineState} />
        </Block>
      </Flexbox>
    </Viewport>
  )
}

ReactDOM.render( <App />, document.getElementById('root'))
