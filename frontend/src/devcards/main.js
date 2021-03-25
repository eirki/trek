'use strict'

import { main as indexMain, globalStateInit } from '../index.js'

function main () {
  const state = globalStateInit()
  state.from.selected = {
    address: '4B, Nordre Skogveien, Gyldenpris, Årstad, Bergen, Vestland, 5057, Norge',
    latitude: 60.376958,
    longitude: 5.327514,
    altitude: 0
  }
  state.to.selected = {
    address: '10, Nordre Skogveien, Solheim, Årstad, Bergen, Vestland, 5057, Norge',
    latitude: 60.3772332,
    longitude: 5.3267566,
    altitude: 0
  }
  state.route = {
    distance: 60.029,
    bbox: [5.327009, 60.377041, 5.327668, 60.377279],
    points: {
      type: 'LineString',
      coordinates: [[5.327668, 60.377041, 48.05], [5.327178, 60.377279, 46.65], [5.327009, 60.377161, 59.75]]
    }
    // weight: 14.406938,
    // time: 13505,
    // transfers: 0,
    // points_encoded: false,
    // legs: [],
    // details: {},
    // ascend: 13.10400,
    // descend: 1.40399
  }
  indexMain(state)
}

window.addEventListener('load', main)
