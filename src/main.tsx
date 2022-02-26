import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Engine, EngineResources, EngineState } from './engine/Engine'
import { Viewport, Flexbox, Block, Text, Grid, Meter, Header, Button } from '@stage-ui/core'

let engine: Engine
const resources: EngineResources = {
  player: {
    class: 'Zeppelin',
  },
  backgrounds: [
    { class: 'Background', src: '/assets/hills_01.svg', height: 600 },
    { class: 'Background', src: '/assets/hills_02.svg', height: 200 },
    { class: 'Background', src: '/assets/hills_03.svg', height: 150, speedMultiplexor: 1.2 },
    { class: 'Background', src: '/assets/hills_04.svg', height: 450, speedMultiplexor: 1.3, opacity: 0.2, blur: 2 },
    { class: 'Background', src: '/assets/hills_05.svg', height: 23 },
    { class: 'Background', src: '/assets/hills_05.svg', height: 23 }
  ],
  skyObjects: [
    { class: 'JetYellow', delay: 50 },
    { class: 'JetYellow', delay: 200 },
    { class: 'JetBlue', delay: 300 },
    { class: 'SkyObject', src:'/assets/star_01.svg', type: 'SPEED_BOOST', speed: 1, width: 32, height: 32, delay: 1000 },
  ],
  groudObjects: [
    { class: 'GroudObject', src: '/assets/house_01.svg', width: 85, height: 55, speedMultiplexor: 1.3 },
    { class: 'GroudObject', src: '/assets/house_02.svg', width: 85, height: 55, speedMultiplexor: 1.3, delay: 100 },
  ]
}

function App() {
  const [engineState, setEngineState] = useState<EngineState | null>(null)
  const ref = useRef<HTMLCanvasElement>(null)

  const start = () => {
    engine?.init(resources)
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
            <Button onClick={start} mt="m">Try again</Button>
          </Flexbox>
        </Block>
      </Flexbox>
    </Viewport>
  )
}

ReactDOM.render( <App />, document.getElementById('root'))
