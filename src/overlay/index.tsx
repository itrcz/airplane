import React from 'react'

import { Flexbox } from '@stage-ui/core'

import { Engine, EngineState } from '../engine/Engine'

import GameMenu from './GameMenu'
import GameOver from './GameOver'
import GameUIOverlay from './GameUIOverlay'

type GameOverlayType = {
  engine: Engine
  state: EngineState | null
}

export const GameOverlay: React.FC<GameOverlayType> = (props) => {
  return (
    <Flexbox
      style={{
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        transition: 'all 0.5s',
      }}
    >
      <GameMenu {...props} />
      <GameUIOverlay {...props} />
      <GameOver {...props} />
    </Flexbox>
  )
}

export default GameOverlay
