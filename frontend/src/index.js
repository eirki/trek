'use strict'

import m from 'mithril'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function autocomplete (event, state) {
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
    url: url,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(data => {
    console.log(data)
    if (query !== event.target.value) {
      console.log(`discarding results for ${query}`)
      return
    }
    state.suggestions = data.result
  })
}

function selectSuggestion (state, location) {
  console.log(location)
  state.selected = location
}

function main () {
  const state = {
    suggestions: [],
    selected: null,
    showSuggestions: false
  }
  const render = {
    view: () => [
      m('h1', 'Hvor vil du dra?'),
      m('div', [
        m('input', {
          type: 'text',
          oninput: (e) => autocomplete(e, state),
          onfocus: () => {
            state.showSuggestions = true
            console.log(state.showSuggestions)
          },
          onfocusout: () => {
            state.showSuggestions = false
            console.log(state.showSuggestions)
          }
        }),
        m('div.autocomplete.dropdown', { class: (state.showSuggestions) ? null : 'hidden' },
          m('ul.suggestionbox',
            state.suggestions.map(suggestion =>
              m('li.suggestion', m('a', { href: '#', onmousedown: () => selectSuggestion(state, suggestion) }, suggestion.address)))
          )
        )
      ]),
      (state.selected) ? m('h2', state.selected.address) : null
    ]
  }
  m.mount(document.body, render)
}

window.addEventListener('load', main)
