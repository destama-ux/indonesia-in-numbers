// Indonesia in Numbers: hash routes, controls and the CSV download.
//
//   #/           overview
//   #/economy    economy
//   #/people     people
//   #/society    society & environment
//   #/sources    sources & methods
//
// Controls are plain buttons that re-render the page, so every control
// does what it says: the year-range buttons redraw the charts on the page,
// the GDP buttons switch the GDP chart between total and per capita, the
// table headings sort, and the CSV button downloads the dataset the site
// ships. window.__shotReady is false while a page renders and true once it
// is on screen, so a screenshot script knows when to capture.

import { YEARS, SERIES, latest } from './data.js';
import { overview, economy, people, society, sources, missing } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const state = {
  range: 'all', // 'all' (2015-2024) or 'recent' (2019-2024)
  gdpUnit: 'total', // 'total' or 'capita'
  sortKey: 'label',
  sortDir: 1,
};

const TITLES = {
  '': 'Indonesia in Numbers',
  economy: 'Economy | Indonesia in Numbers',
  people: 'People | Indonesia in Numbers',
  society: 'Society & environment | Indonesia in Numbers',
  sources: 'Sources & methods | Indonesia in Numbers',
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  return TITLES[hash] === undefined ? null : hash;
}

function render() {
  window.__shotReady = false;
  const page = route();
  const view =
    page === 'economy'
      ? economy(state)
      : page === 'people'
        ? people(state)
        : page === 'society'
          ? society(state)
          : page === 'sources'
            ? sources(state)
            : page === ''
              ? overview(state)
              : missing();
  app.innerHTML = view;
  document.title = page === null ? 'Not found | Indonesia in Numbers' : TITLES[page];
  for (const link of nav.querySelectorAll('a')) {
    const target = link.getAttribute('href').replace(/^#\/?/, '');
    link.setAttribute('aria-current', target === (page ?? '') ? 'page' : 'false');
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function csv() {
  const lines = ['indicator,wdi_code,year,value'];
  for (const s of Object.values(SERIES)) {
    for (let i = 0; i < YEARS.length; i++) {
      const v = s.values[i];
      if (v === null || v === undefined) continue;
      lines.push(`"${s.label.replace(/"/g, '""')}",${s.code},${YEARS[i]},${v}`);
    }
  }
  return lines.join('\n') + '\n';
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.range) {
    state.range = button.dataset.range;
    render();
  } else if (button.dataset.gdp) {
    state.gdpUnit = button.dataset.gdp;
    render();
  } else if (button.dataset.sort) {
    const key = button.dataset.sort;
    if (state.sortKey === key) state.sortDir = -state.sortDir;
    else {
      state.sortKey = key;
      state.sortDir = 1;
    }
    render();
  } else if (button.id === 'csv-btn') {
    const blob = new Blob([csv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indonesia-in-numbers-2015-2024.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
});

window.addEventListener('hashchange', render);
render();
