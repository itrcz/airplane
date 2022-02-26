import { Block, Button, Flexbox, Grid, Header, Meter, Text, Viewport } from '@stage-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Engine, EngineState } from './engine/Engine'
import levels from './levels'

let engine: Engine

function App() {
  const [engineState, setEngineState] = useState<EngineState | null>(null)
  const ref = useRef<HTMLCanvasElement>(null)

  const start = () => {
    if (Math.random() > 0.1) {
      engine?.init(levels.mountains)
    } else {
      engine?.init(levels.city)
    }
  }

  useEffect(() => {
    engine = new Engine({
      debug: true,
      canvas: ref.current!,
      width: 800,
      height: 600,
      onStateChange: (state) => {
        setEngineState({ ...state })
      },
    })
    start()
  }, [])
  
  return (
    <Viewport theme="dark">
      <Flexbox column centered>
        <Grid flex={1} templateColumns="repeat(4, 1fr)" w="50rem" my="m">
          <Text size="xs" p="0 xs">Speed: <Text weight="bold">{engineState?.playerSpeed} km/h</Text></Text>
          <Text size="xs" p="0 xs">VSpeed: <Text weight="bold">{engineState?.playerVerticalSpeed} m/s</Text></Text>
          <Text size="xs" p="0 xs">Collides: <Text weight="bold">{engineState?.playerCollisions}</Text></Text>
          <Text size="xs" p="0 xs">Distance: <Text weight="bold">{engineState?.playerDistance} meters</Text></Text>
          <Meter size="xs" mt="s" w="10rem" value={(engineState?.playerSpeed || 0) / 0.8}/>
          <Meter size="xs" mt="s" w="10rem" color="orange500" value={100 + (engineState?.playerVerticalSpeed || 0)  - 20}/>
          <Meter size="xs" mt="s" w="10rem" color="red500" value={engineState?.playerCollisions}/>
          <Meter size="xs" mt="s" w="10rem" color="green500" value={(engineState?.playerDistance || 0) / 100}/>
        </Grid>
        <Block shadow="m" w="50rem" h="37.5rem" overflow="hidden" borderRadius="xl">
          <canvas ref={ref} />
          <Flexbox
            column
            centered
            backgroundColor={(c) => c.black.alpha(0.5)}
            style={{
              top: 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
              visibility: engineState?.gameOver ? 'visible' : 'hidden',
              opacity: engineState?.gameOver ? 1 : 0,
              transition: 'all 0.5s',
            }}
          >
            <Header color="white">Game Over</Header>
            <Button onClick={() => start()} mt="m">Try again</Button>
          </Flexbox>
        </Block>
      </Flexbox>
    </Viewport>
  )
}

ReactDOM.render( <App />, document.getElementById('root'))
