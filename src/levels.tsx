import { EngineResources } from './engine/Engine'

const mountains: EngineResources = {
  player: {
    class: 'Zeppelin',
  },
  backgrounds: [
    { class: 'Background', src: '/assets/hills_01.svg', height: 600, static: true },
    { class: 'Background', src: '/assets/hills_02.svg', height: 200 },
    { class: 'Background', src: '/assets/hills_03.svg', height: 150, speedMultiplexor: 1.5 },
    { class: 'Background', src: '/assets/hills_04.svg', height: 450, speedMultiplexor: 1.3, opacity: 0.2 },
    { class: 'Background', src: '/assets/hills_05.svg', height: 23 },
    { class: 'Background', src: '/assets/hills_05.svg', height: 23 }
  ],
  skyObjects: [
    { class: 'JetYellow', delay: 50 },
    { class: 'JetYellow', delay: 200 },
    { class: 'JetBlue', delay: 300 },
    { class: 'SkyObject', src:'/assets/star_01.svg', type: 'SPEED_BOOST', speed: 2, width: 32, height: 32, delay: 500, bouncing: true },
  ],
  groudObjects: [
    { class: 'GroudObject', src: '/assets/house_01.svg', width: 85, height: 55, speedMultiplexor: 1.3 },
    { class: 'GroudObject', src: '/assets/house_02.svg', width: 85, height: 55, speedMultiplexor: 1.3, delay: 100 },
  ]
}

const city: EngineResources = {
  player: {
    class: 'Zeppelin',
  },
  backgrounds: [
    { class: 'Background', src: '/assets/city_01.svg', height: 600 },
    { class: 'Background', src: '/assets/city_02.svg', height: 340 },
    { class: 'Background', src: '/assets/city_03.svg', height: 300, speedMultiplexor: 1.2 },
  ],
  skyObjects: [
    { class: 'JetYellow', delay: 50 },
    { class: 'JetYellow', delay: 200 },
    { class: 'JetBlue', delay: 300 },
    { class: 'SkyObject', src:'/assets/star_01.svg', type: 'SPEED_BOOST', speed: 1, width: 32, height: 32, delay: 500, bouncing: true },
  ],
  groudObjects: []
}

export default {
  mountains,
  city,
}