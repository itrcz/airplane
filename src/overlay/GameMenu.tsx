import React, { useState } from 'react'

import { Block, Button, Divider, Flexbox, Paragraph, Spinner, Text } from '@stage-ui/core'


import { Engine, EngineState } from '../engine/Engine'
import { gameMaps, gamePlayers } from '../resources'

type GameMenuType = {
  engine: Engine
  state: EngineState | null
}

export const GameMenu: React.FC<GameMenuType> = (props) => {
  const { state, engine } = props

  const [player, setPlayer] = useState(gamePlayers[0])
  const [map, setMap] = useState(gameMaps[0])
  if (state?.ready) {
    return null
  }

  return (
    <Flexbox column p="m" borderRadius="m" flex={1} w="100%" backgroundColor="surface">
      <Text color="gray400">Select airplane</Text>
      <Flexbox>
        {gamePlayers.map((item) => {
          return (
            <Block
              key={item.id}
              onClick={() => setPlayer(item)}
              shadow={item.id === player.id ? 'm' : 'xs'}
              borderRadius="m"
              mt="s"
              mr="s"
              p="m"
              borderWidth="0.25rem"
              borderStyle="solid"
              borderColor={item.id === player.id ? 'primary' : 'transparent'}
              overflow="hidden"
            >
              <Block
                style={{
                  background: `url(${item.src || 'assets/sprite.svg'})`,
                  backgroundSize: 'cover',
                }}
                w={`${item.width || 220}px`}
                h={`${item.height || 120}px`}
              />
            </Block>
          )
        })}
      </Flexbox>
      <Divider my="m" />
      <Text color="gray400">Select world</Text>
      <Flexbox>
        {gameMaps.map((item, index) => {
          return (
            <Block
              key={item.id}
              onClick={() => setMap(item)}
              shadow={item.id === map.id ? 'm' : 'xs'}
              borderRadius="m"
              mt="s"
              mr="s"
              borderWidth="0.25rem"
              borderStyle="solid"
              borderColor={item.id === map.id ? 'primary' : 'transparent'}
              overflow="hidden"
            >
              <Block
                style={{
                  background: `url(assets/map_${item.id}.jpg)`,
                  backgroundSize: 'cover',
                }}
                w={`200px`}
                h={`150px`}
              />
              <Paragraph size="s" m="s" mb="0">
                {item.name}
              </Paragraph>
              <Paragraph color="gray500" size="xs" m="s" mt="0">
                Level {index + 1}
              </Paragraph>
            </Block>
          )
        })}
      </Flexbox>
      <Button
        label="Go!"
        px="l"
        mt="xl"
        rightChild={state?.loading[0] !== state?.loading[1] && <Spinner />}
        onClick={() => engine.init({ map, player })}
      />
    </Flexbox>
  )
}

export default GameMenu
