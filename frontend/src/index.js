'use strict'

import m from 'mithril'

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
    state.suggestions = data.result
  })
}

export function searchBoxStateInit () {
  return {
    boxText: '',
    suggestions: [],
    showSuggestions: false
  }
}

export function searchBox (globalState, localState) {
  localState = localState || searchBoxStateInit()
  return {
    view: () => m('div', [
      m('input',
        {
          value: localState.boxText,
          type: 'text',
          oninput: (e) => {
            localState.boxText = e.target.value
            globalState.selected = null
            fetchSuggestions(e, localState)
          },
          onfocus: () => (localState.showSuggestions = true),
          onfocusout: () => (localState.showSuggestions = false)
        }
      ),
      m('div.autocomplete.dropdown', { class: (localState.showSuggestions) ? null : 'hidden' },
        m('ul.suggestionbox',
          localState.suggestions.map(suggestion =>
            m('li.suggestion',
              m('a',
                {
                  href: '#',
                  onmousedown: () => {
                    console.log(suggestion.loccation)
                    globalState.selected = suggestion
                    localState.boxText = suggestion.address
                  }
                },
                suggestion.address)
            )
          )
        )
      )
    ])
  }
}

export function globalStateInit () {
  return {
    from: {
      selected: null
    },
    to: {
      selected: null
    }
  }
}

function main () {
  const state = globalStateInit()
  const fromBox = searchBox(state.from)
  const toBox = searchBox(state.to)
  const render = {
    view: () => [
      m('h1', 'Hvor vil du dra?'),
      m(fromBox),
      (state.from.selected)
        ? [
            m('h1', '.. og hvor skal du dra fra?'),
            m(toBox)
          ]
        : null,
      (state.from.selected && state.to.selected)
        ? m('div', 'Laster rute..')
        : null
    ]
  }
  m.mount(document.body, render)
}

window.addEventListener('load', main)
