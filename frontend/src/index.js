'use strict'

import m from 'mithril'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchSuggestions (event, state) {
  console.log(event)

  const query = event.target.value
  if (query === '') {
    state.suggestions = []
    return
  }
  console.log([query])
  await sleep(500)
  if (query !== event.target.value) {
    return
  }
  const params = new URLSearchParams()
  params.append('query', query)
  const url = '/api/locations?' + params
  console.log(`Fetching: ${url}`)
  m.request({
    method: 'GET',
    url: url
  }).then(data => {
    console.log(data)
    if (query !== event.target.value) {
      console.log(`discarding results for ${query}`)
      return
    }
    state.suggestions = (data.result.length > 0) ? data.result : null
  })
}

export function searchBoxStateInit () {
  return {
    boxText: '',
    suggestions: [],
    showSuggestions: false
  }
}

export function searchBox (globalState, stateSubset, localState) {
  localState = localState || searchBoxStateInit()
  return {
    view: () => [
      m('input',
        {
          value: localState.boxText,
          type: 'text',
          oninput: (e) => {
            localState.boxText = e.target.value
            localState.suggestions = []
            stateSubset.selected = null
            fetchSuggestions(e, localState)
          },
          onfocus: () => (localState.showSuggestions = true),
          onfocusout: () => (localState.showSuggestions = false)
        }
      ),
      m('div.autocomplete.dropdown', { class: (localState.showSuggestions) ? null : 'hidden' },
        m('ul.suggestionbox',
          (localState.suggestions === null)
            ? m('li', 'Ingen forslag')
            : localState.suggestions.map(suggestion =>
              m('li.suggestion',
                m('a',
                  {
                    href: '#',
                    onmousedown: async () => {
                      stateSubset.selected = suggestion
                      localState.boxText = suggestion.address
                      await updateMap(globalState)
                    }
                  },
                  suggestion.address)
              )
            )
        )
      )
    ]
  }
}

function defineMap (elemId) {
  return L.map(elemId)
}

function getRoute (state) {
  const params = new URLSearchParams()
  const viapoints = state.viapoints.filter(point => point.selected !== null)
  const points = [state.from, ...viapoints, state.to]
  points.map(point => params.append('point', [point.selected.latitude, point.selected.longitude]))
  const url = '/api/route?' + params
  console.log(`Fetching: ${url}`)
  return m.request({
    method: 'GET',
    url: url
  })
}

function pointsReady (state) {
  return (state.from.selected && state.to.selected)
}

async function updateMap (state) {
  console.log(state)
  if (!pointsReady(state)) {
    return
  }
  state.map.eachLayer(function (layer) {
    state.map.removeLayer(layer)
  })
  const route = await getRoute(state)
  L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(state.map)
  const lineAdded = L.geoJSON(route.points).addTo(state.map)
  state.map.fitBounds(lineAdded.getBounds())
}

export function globalStateInit () {
  return {
    from: {
      selected: null
    },
    to: {
      selected: null
    },
    viapoints: [],
    viaboxes: [],
    route: null
  }
}

export function main (state) {
  state = state || globalStateInit()
  const mapId = 'leafletMap'
  const fromBox = searchBox(state, state.from)
  const toBox = searchBox(state, state.to)
  const render = {
    view: () => [
      m('h1', 'Hvor vil du dra?'),
      m('div', m(fromBox)),
      (state.from.selected)
        ? [
            state.viaboxes.map((box, i) => m('div', [
              m('button',
                {
                  onclick: () => {
                    state.viaboxes.splice(i, 1)
                    state.viapoints.splice(i, 1)
                    updateMap(state)
                  }
                },
                'X'),
              m(box)
            ])),
            m('div', [
              m('button', {
                onclick: () => {
                  const subset = { selected: null }
                  const box = searchBox(state, subset)
                  state.viapoints.push(subset)
                  state.viaboxes.push(box)
                }
              },
              'Via')
            ]),
            m('h1', '.. og hvor skal du dra fra?'),
            m('div', m(toBox))
          ]
        : null,
      m('div',
        {
          id: mapId,
          style: {
            height: '300px',
            'z-index': 1,
            visibility: pointsReady(state)
              ? 'visible'
              : 'hidden'
          },
          oncreate: () => (state.map = defineMap(mapId))
        })
    ]
  }
  m.mount(document.body, render)
}

window.addEventListener('load', () => main())
