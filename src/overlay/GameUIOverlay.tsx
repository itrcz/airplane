import React from 'react'

import { Flexbox, Text, Meter } from '@stage-ui/core'
import { Heart } from '@stage-ui/icons'

import { Engine, EngineState } from '../engine/Engine'

type GameUIOverlayType = {
  engine: Engine
  state: EngineState | null
}

export const GameUIOverlay: React.FC<GameUIOverlayType> = (props) => {
  const { state, engine } = props

  if (!state) {
    return null
  }

  return (
    <Flexbox
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity: state?.ready ? 1 : 0,
        translate: 'all 0.25s',
        textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      <Flexbox column p="m" flex={1}>
        <Text color="surface" weight="900" size="m">
          Passed {state.playerPassSkyObject} / 25
        </Text>
        <Meter mt="xs" size="xs" w="100%" backgroundColor="transparent">
          <Meter.Thumb
            value={100}
            color={(c) => c.surface.alpha(0.1).rgb().string()}
            loading
          />
          <Meter.Thumb
            color="primary"
            value={(state.playerPassSkyObject * 100) / 25}
            loading
          />
        </Meter>
      </Flexbox>

      <Flexbox column p="m">
        <Text color="surface" weight="900" size="m">
          {state?.playerSpeed} км/ч
        </Text>
        <Text color="surface" size="xs">
          Speed
        </Text>
      </Flexbox>

      <Flexbox column p="m">
        <Text color="surface" weight="900" size="m">
          {state?.playerDistance} м
        </Text>
        <Text color="surface" size="xs">
          Distance
        </Text>
      </Flexbox>

      <Flexbox p="xs s" m="s" mr="0.75rem" backgroundColor="surface" borderRadius="10rem">
        <Heart
          size="2rem"
          type={state.hearts >= 1 ? 'filled' : 'outline'}
          color="rose500"
        />
        <Heart
          size="2rem"
          type={state.hearts >= 2 ? 'filled' : 'outline'}
          color="rose500"
        />
        <Heart
          size="2rem"
          type={state.hearts >= 3 ? 'filled' : 'outline'}
          color="rose500"
        />
      </Flexbox>

      <Text
        display="inline-block"
        color="onSurface"
        backgroundColor={(c) => c.surface.alpha(0.9)}
        p="xs s"
        borderRadius="s"
        size="xs"
        style={{ position: 'absolute', left: '10px', top: '570px', textShadow: 'none' }}
      >
        FPS {state?.fps}
      </Text>
    </Flexbox>
  )
}

export default GameUIOverlay
