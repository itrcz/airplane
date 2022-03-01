import { EngineResources } from './engine/Engine'

export const gamePlayers: EngineResources['player'][] = [{
  id: '1',
  name: 'Zeppelin',
  class: 'Zeppelin',
  src: '/assets/zeppelin_base.svg'
}]

export const gameMaps: EngineResources['map'][] = [
  {
    id: '1',
    name: 'Mountains',
    backgrounds: [
      { class: 'BackgroundLayer', src: '/assets/hills_01.svg', height: 600 },
      { class: 'BackgroundLayer', src: '/assets/hills_02.svg', height: 200, speed: 1, },
      { class: 'BackgroundLayer', src: '/assets/hills_03.svg', height: 150, speed: 2 },
      { class: 'BackgroundLayer', src: '/assets/hills_04.svg', height: 450, speed: 3, opacity: 0.2, blur: 5 },
      { class: 'BackgroundLayer', src: '/assets/hills_05.svg', height: 23 },
    ],
    skyObjects: [
      { class: 'JetYellow', delay: 50 },
      { class: 'JetYellow', delay: 200 },
      { class: 'JetBlue', delay: 300 },
      { class: 'SkyObject', src: '/assets/star_01.svg', type: 'SPEED_BOOST', speed: 2, width: 32, height: 32, delay: 500, bouncing: true },
    ],
    groudObjects: [
      { class: 'GroudObject', src: '/assets/house_01.svg', width: 85, height: 55, speedMultiplexor: 1.3 },
      { class: 'GroudObject', src: '/assets/house_02.svg', width: 85, height: 55, speedMultiplexor: 1.3, delay: 100 },
    ]
  },
  {
    id: '2',
    name: 'City',
    backgrounds: [
      { class: 'BackgroundLayer', src: '/assets/city_01.svg', height: 600 },
      { class: 'BackgroundLayer', src: '/assets/city_02.svg', height: 340, speed: 1 },
      { class: 'BackgroundLayer', src: '/assets/city_03.svg', height: 300, speed: 2 },
    ],
    skyObjects: [
      { class: 'JetYellow', delay: 50 },
      { class: 'JetYellow', delay: 200 },
      { class: 'JetBlue', delay: 300 },
      { class: 'SkyObject', src: '/assets/star_01.svg', type: 'SPEED_BOOST', speed: 1, width: 32, height: 32, delay: 500, bouncing: true },
    ],
    groudObjects: []
  }
]