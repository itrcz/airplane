import { Block, Button, Flexbox, Header, Paragraph } from '@stage-ui/core'
import React from 'react'
import { Engine, EngineState } from '../engine/Engine'

type GameOverType = {
  engine: Engine
  state: EngineState | null
}

export const GameOver: React.FC<GameOverType> = (props) => {
  const { state, engine } = props
  return (
    <Flexbox
      column
      centered
      style={{
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        visibility: state?.gameOver ? 'visible' : 'hidden',
        opacity: state?.gameOver ? 1 : 0,
        transition: 'all 0.5s',
      }}
    >
      <Block
        p="m"
        style={{ maxWidth: '30rem' }}
        backgroundColor="surface"
        borderRadius="m"
      >
        <Header color="gray900">Game Over!</Header>
        <Paragraph color="gray600">
          
        </Paragraph>
        <Flexbox mt="m">
          <Button mr="m" onClick={() => engine.reset()}>
            Try again
          </Button>
        </Flexbox>
      </Block>
    </Flexbox>
  )
}

export default GameOver
