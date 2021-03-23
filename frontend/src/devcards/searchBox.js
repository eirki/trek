'use strict'

import m from 'mithril'

import { searchBox, searchBoxStateInit, globalStateInit } from '../index.js'

function main () {
  const localState = searchBoxStateInit()
  localState.suggestions = [
    {
      address: '1073 Corbett Canyon Rd Arroyo Grande, California(CA), ',
      latitude: -27.47564805,
      longitude: 153.0203525377907,
      altitude: 0
    },
    {
      address: '93420 3334 Willow St Santa Ynez, California(CA), ',
      latitude: 38.94730495,
      longitude: -1.8643744965968874,
      altitude: 0
    },
    {
      address: '93460 4788 Polk Rd Boonville, Indiana(IN), ',
      latitude: 60.3086449,
      longitude: 22.304648,
      altitude: 0
    },
    {
      address: '47601 11100 Eagle Rd Davisburg, Michigan(MI), 48350 78 Lake ',
      latitude: -13.7476354,
      longitude: -73.9368133,
      altitude: 0
    },
    {
      address: 'St #APT 2 Spring Valley, New York(NY), ',
      latitude: 21.819399349999998,
      longitude: 80.19064248287572,
      altitude: 0
    },
    {
      address: '10977 386 Laurens Rd Rockmart, Georgia(GA), ',
      latitude: 22.6380645,
      longitude: 90.18014462386316,
      altitude: 0
    },
    {
      address: '30153 Po Box 541 Lodge Grass, Montana(MT), 59050 ',
      latitude: 32.488072599999995,
      longitude: 73.14488898866122,
      altitude: 0
    },
    {
      address: '1410 Whatley Mill Cir Lawrenceville, Georgia(GA), ',
      latitude: -1.16026265,
      longitude: 36.04719252521192,
      altitude: 0
    },
    {
      address: '30045 2931 Lauradale Ln Richmond, Virginia(VA), 23234',
      latitude: 25.67479795,
      longitude: -100.38950487007807,
      altitude: 0
    }
  ]
  localState.showSuggestions = true
  localState.boxText = 'abc'
  console.log(localState)
  const globalState = globalStateInit()
  console.log(globalState)
  const box = searchBox(globalState, localState)
  m.mount(document.body, box)
}

window.addEventListener('load', main)
