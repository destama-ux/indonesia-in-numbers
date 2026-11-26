// HTML for each page, built from the site's own data. Every value is
// escaped before it goes into the page. Charts are drawn by charts.js.

import { YEARS, SERIES, SECTORS_2024, SOURCE_NOTE, latest, valueIn } from './data.js';
import { lineChart, barChart, donut, shareBars, fmtInt, fmtUsdBn, fmtPct, fmtOne } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Years shown for a range choice: 'all' = 2015-2024, 'recent' = 2019-2024.
function pointsFor(series, range) {
  const years = range === 'recent' ? YEARS.slice(4) : YEARS;
  return years
    .map((y) => ({ year: y, value: valueIn(series, y) }))
    .filter((p) => p.value !== null);
}

function rangeButtons(range) {
  return `<div class="controls" role="group" aria-label="Years shown">
  <span class="controls-label">Years:</span>
  <button type="button" data-range="all" aria-pressed="${range === 'all'}">2015–2024</button>
  <button type="button" data-range="recent" aria-pressed="${range === 'recent'}">2019–2024</button>
</div>`;
}

function kpi(label, big, sub, href) {
  return `<a class="kpi" href="${href}"><span class="kpi-label">${esc(label)}</span><span class="kpi-big">${big}</span><span class="kpi-sub">${esc(sub)}</span></a>`;
}

function changeSince(series, format) {
  const first = series.values.find((v) => v !== null);
  const last = latest(series).value;
  const pct = ((last - first) / Math.abs(first)) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}% since 2015 (${format(first)} → ${format(last)})`;
}

export function overview(state) {
  const pop = latest(SERIES.population);
  const gdp = latest(SERIES.gdp);
  const cap = latest(SERIES.gdpPerCapita);
  const growth = latest(SERIES.growth);
  return `<section class="hero">
  <p class="eyebrow">Indonesia · National statistics · 2015–2024</p>
  <h1>Indonesia in Numbers</h1>
  <p class="lede">The country's people, economy and environment in one place — every
  figure from the World Bank's World Development Indicators, shown with its
  ten-year trend, and nothing estimated.</p>
</section>
<section class="kpis" aria-label="Headline figures, 2024">
  ${kpi('Population', `${(pop.value / 1e6).toFixed(1)} million`, changeSince(SERIES.population, (v) => `${(v / 1e6).toFixed(1)}m`), '#/people')}
  ${kpi('GDP', fmtUsdBn(gdp.value), changeSince(SERIES.gdp, fmtUsdBn), '#/economy')}
  ${kpi('GDP per capita', `$${fmtInt(cap.value)}`, changeSince(SERIES.gdpPerCapita, (v) => `$${fmtInt(v)}`), '#/economy')}
  ${kpi('GDP growth', fmtPct(growth.value), `2020 low −2.07% · 2022 high 5.31%`, '#/economy')}
</section>
<section class="panel">
  <div class="panel-head"><h2>Population, 2015–2024</h2>${rangeButtons(state.range)}</div>
  ${lineChart(pointsFor(SERIES.population, state.range), { format: (v) => `${(v / 1e6).toFixed(0)}m`, color: '#0b6e5d' })}
  <p class="note">Indonesia passed 280 million people in 2023. Population growth has
  slowed every year of the decade, from 1.12% in 2015 to 0.81% in 2024.</p>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>GDP, current US$</h2></div>
    ${lineChart(pointsFor(SERIES.gdp, state.range), { format: fmtUsdBn, color: '#3d6fb4' })}
    <p class="note">GDP dipped in 2020 — the only fall of the decade — then rose for
    four straight years to $1,396 billion.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>People online</h2></div>
    ${lineChart(pointsFor(SERIES.internet, state.range), { format: (v) => `${v.toFixed(0)}%`, color: '#c98a1b' })}
    <p class="note">Internet use more than tripled: 22.1% of Indonesians were online
    in 2015; 72.8% were in 2024.</p>
  </div>
</section>
<section class="panel">
  <h2>Explore the data</h2>
  <ul class="explore">
    <li><a href="#/economy"><strong>Economy</strong> — growth, sectors, trade, investment and prices</a></li>
    <li><a href="#/people"><strong>People</strong> — age structure, health, work and learning</a></li>
    <li><a href="#/society"><strong>Society &amp; environment</strong> — cities, forests and the digital decade</a></li>
    <li><a href="#/sources"><strong>Sources &amp; methods</strong> — every indicator, its code and its latest value</a></li>
  </ul>
  <p class="note">${esc(SOURCE_NOTE)}</p>
</section>`;
}

export function economy(state) {
  const gdpSeries = state.gdpUnit === 'capita' ? SERIES.gdpPerCapita : SERIES.gdp;
  // Trillions keep the axis labels short enough for the chart's left gutter.
  const gdpFormat = state.gdpUnit === 'capita' ? (v) => `$${fmtInt(v)}` : (v) => `$${(v / 1e12).toFixed(2)}tn`;
  const sectorTotal = SECTORS_2024.reduce((s, p) => s + p.value, 0);
  return `<p class="crumb"><a href="#/">&larr; Overview</a></p>
<h1>Economy</h1>
<p class="lede">Growth near 5% a year, a $1.4 trillion economy, and a services sector
that now produces more than agriculture and industry combined.</p>
<section class="panel">
  <div class="panel-head"><h2>GDP, ${state.gdpUnit === 'capita' ? 'per capita' : 'total'}</h2>
  <div class="controls" role="group" aria-label="GDP measure">
    <button type="button" data-gdp="total" aria-pressed="${state.gdpUnit === 'total'}">Total</button>
    <button type="button" data-gdp="capita" aria-pressed="${state.gdpUnit === 'capita'}">Per capita</button>
  </div></div>
  ${lineChart(pointsFor(gdpSeries, state.range), { format: gdpFormat, color: '#3d6fb4' })}
  ${rangeButtons(state.range)}
  <p class="note">GDP per capita rose from $3,288 in 2015 to $4,925 in 2024 — up
  just under 50% in nine years.</p>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Annual GDP growth</h2></div>
    ${barChart(pointsFor(SERIES.growth, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#0b6e5d', negColor: '#b3402e' })}
    <p class="note">The 2020 contraction (−2.07%) is the decade's only negative year;
    growth returned to 5.03% by 2024.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>What the economy makes, 2024</h2></div>
    <div class="donut-wrap">
      ${donut(SECTORS_2024)}
      <ul class="legend">
        ${SECTORS_2024.map((s, i) => `<li><span class="swatch" style="background:${['#0b6e5d', '#c98a1b', '#3d6fb4'][i]}"></span>${esc(s.label)} — <strong>${s.value.toFixed(1)}%</strong></li>`).join('')}
        <li><span class="swatch" style="background:#8a8d93"></span>Net taxes on products — <strong>${(100 - sectorTotal).toFixed(1)}%</strong></li>
      </ul>
    </div>
    <p class="note">Shares of GDP by value added. The three sectors sum to
    ${sectorTotal.toFixed(1)}%; the rest is net taxes on products.</p>
  </div>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Exports, % of GDP</h2></div>
    ${lineChart(pointsFor(SERIES.exports, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#0b6e5d' })}
    <p class="note">Exports peaked at 24.5% of GDP in 2022 and stood at 22.3% in 2024.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Imports, % of GDP</h2></div>
    ${lineChart(pointsFor(SERIES.imports, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#3d6fb4' })}
    <p class="note">Imports were 20.5% of GDP in 2024, below exports — a goods and
    services surplus of 1.8 points of GDP.</p>
  </div>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Foreign investment inflows</h2></div>
    ${barChart(pointsFor(SERIES.fdi, state.range), { format: (v) => `$${(v / 1e9).toFixed(0)}bn`, color: '#c98a1b' })}
    <p class="note">Net FDI inflows reached $24.3 billion in 2024. The 2016 dip to
    $4.5 billion is the decade's outlier.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Inflation, consumer prices</h2></div>
    ${lineChart(pointsFor(SERIES.inflation, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#b3402e' })}
    <p class="note">Inflation fell from 6.36% in 2015 to 2.18% in 2024, with a
    2022 spike to 4.21% in between.</p>
  </div>
</section>
<p class="note">${esc(SOURCE_NOTE)}</p>`;
}

export function people(state) {
  const young = latest(SERIES.ageYoung);
  const old = latest(SERIES.ageOld);
  const working = 100 - young.value - old.value;
  const mort = latest(SERIES.underFiveMortality);
  const lit = latest(SERIES.literacy);
  return `<p class="crumb"><a href="#/">&larr; Overview</a></p>
<h1>People</h1>
<p class="lede">283.5 million people, living longer and having fewer children: life
expectancy is 71.3 years and fertility has fallen to 2.1 births per woman.</p>
<section class="panel">
  <div class="panel-head"><h2>Who Indonesians are, 2024</h2></div>
  ${shareBars([
    { label: 'Ages 0–14', value: young.value, display: `${young.value.toFixed(1)}%`, color: '#3d6fb4' },
    { label: 'Ages 15–64', value: working, display: `${working.toFixed(1)}%`, color: '#0b6e5d' },
    { label: 'Ages 65 and over', value: old.value, display: `${old.value.toFixed(1)}%`, color: '#c98a1b' },
  ])}
  <p class="note">The working-age share (15–64) is derived from the two published
  age shares: 100% − 24.6% − 7.3% = 68.1%. The share over 65 has risen every
  year of the decade, from 6.1% in 2015.</p>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Life expectancy at birth</h2></div>
    ${lineChart(pointsFor(SERIES.lifeExpectancy, state.range), { format: (v) => `${v.toFixed(1)} yrs`, color: '#0b6e5d' })}
    ${rangeButtons(state.range)}
    <p class="note">Life expectancy fell sharply in 2020–2021 (to 67.5 years) and
    recovered to 71.3 by 2024 — above its 2019 level.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Fertility, births per woman</h2></div>
    ${lineChart(pointsFor(SERIES.fertility, state.range), { format: (v) => v.toFixed(2), color: '#3d6fb4' })}
    <p class="note">Fertility fell from 2.35 in 2015 to 2.12 in 2024, close to the
    replacement level of about 2.1.</p>
  </div>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Labour force</h2></div>
    ${lineChart(pointsFor(SERIES.labourForce, state.range), { format: (v) => `${(v / 1e6).toFixed(0)}m`, color: '#0b6e5d' })}
    <p class="note">The labour force reached 145.2 million people in 2024, up from
    127.3 million in 2015.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Unemployment, % of labour force</h2></div>
    ${lineChart(pointsFor(SERIES.unemployment, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#b3402e' })}
    <p class="note">Unemployment was 3.30% in 2024 — the lowest of the decade —
    after a pandemic peak of 4.26% in 2020.</p>
  </div>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Under-5 mortality, per 1,000 live births</h2></div>
    ${lineChart(pointsFor(SERIES.underFiveMortality, state.range), { format: (v) => v.toFixed(1), color: '#0b6e5d' })}
    <p class="note">Child mortality fell every year of the decade, from 26.1 in
    2015 to ${mort.value.toFixed(1)} in 2024.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Learning</h2></div>
    <p class="big-stat">${lit.value.toFixed(0)}<span>%</span></p>
    <p class="note">Adult literacy (ages 15 and above) was ${lit.value.toFixed(0)}% in
    ${lit.year}, the latest year the World Bank publishes for Indonesia. It was
    95.2% in 2015.</p>
    <p class="note">Fertility, mortality and literacy together tell the story of
    this page: fewer children, longer lives, and near-universal adult literacy.</p>
  </div>
</section>
<p class="note">${esc(SOURCE_NOTE)}</p>`;
}

export function society(state) {
  const net = latest(SERIES.internet);
  const urb = latest(SERIES.urban);
  const forest = latest(SERIES.forest);
  return `<p class="crumb"><a href="#/">&larr; Overview</a></p>
<h1>Society &amp; environment</h1>
<p class="lede">A country moving to the cities and online, while keeping half its
land under forest.</p>
<section class="kpis" aria-label="Headline figures, 2024">
  ${kpi('People online', fmtPct(net.value, 1), '22.1% in 2015 — more than tripled', '#/society')}
  ${kpi('Urban population', fmtPct(urb.value, 1), '53.2% in 2015', '#/society')}
  ${kpi('Forest area', fmtPct(forest.value, 1), 'of land area, steady all decade', '#/society')}
</section>
<section class="panel">
  <div class="panel-head"><h2>The digital decade</h2>${rangeButtons(state.range)}</div>
  ${lineChart(pointsFor(SERIES.internet, state.range), { format: (v) => `${v.toFixed(0)}%`, color: '#c98a1b' })}
  <p class="note">Internet use grew in every year of the decade, fastest in
  2017–2020. By 2024, ${fmtPct(net.value, 1)} of Indonesians were online — about
  206 million people.</p>
</section>
<section class="grid2">
  <div class="panel">
    <div class="panel-head"><h2>Urban share of population</h2></div>
    ${lineChart(pointsFor(SERIES.urban, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#3d6fb4' })}
    <p class="note">The urban share rose from 53.2% in 2015 to ${fmtPct(urb.value, 1)}
    in 2024 — roughly 167 million people living in towns and cities.</p>
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Forest area, % of land</h2></div>
    ${lineChart(pointsFor(SERIES.forest, state.range), { format: (v) => `${v.toFixed(1)}%`, color: '#0b6e5d' })}
    <p class="note">Forest covered ${fmtPct(forest.value, 1)} of Indonesia's land in
    2024, barely changed across the decade (50.6% in 2015).</p>
  </div>
</section>
<section class="panel">
  <h2>Reading the three trends together</h2>
  <p>Urbanisation and internet use climb together — the city share and the
  online share each gained about six points in the last five years — while the
  forest share holds steady. Indonesia is urbanising and connecting without
  losing forest cover, on the World Bank's figures.</p>
  <p class="note">${esc(SOURCE_NOTE)}</p>
</section>`;
}

export function sources(state) {
  const rows = Object.values(SERIES).map((s) => {
    const l = latest(s);
    return { label: s.label, code: s.code, value: l.value, year: l.year, display: fmtValue(s, l.value) };
  });
  const key = state.sortKey;
  const dir = state.sortDir;
  rows.sort((a, b) => {
    let r = 0;
    if (key === 'value') r = a.value - b.value;
    else if (key === 'year') r = a.year - b.year;
    else if (key === 'code') r = a.code < b.code ? -1 : 1;
    else r = a.label < b.label ? -1 : 1;
    return r * dir;
  });
  const arrow = (k) => (key === k ? (dir === 1 ? ' ▲' : ' ▼') : '');
  const body = rows
    .map(
      (r) => `<tr><td>${esc(r.label)}</td><td><code>${esc(r.code)}</code></td><td class="num">${esc(r.display)}</td><td class="num">${r.year}</td></tr>`,
    )
    .join('');
  return `<p class="crumb"><a href="#/">&larr; Overview</a></p>
<h1>Sources &amp; methods</h1>
<p class="lede">Every figure on this site comes from one source — the World Bank's
World Development Indicators — and is reproduced as published. Click a column
heading to sort the table; download the whole dataset as a CSV.</p>
<section class="panel">
  <div class="panel-head"><h2>All indicators</h2>
  <button type="button" id="csv-btn">Download CSV</button></div>
  <div class="table-wrap"><table>
    <thead><tr>
      <th><button type="button" data-sort="label">Indicator${arrow('label')}</button></th>
      <th><button type="button" data-sort="code">WDI code${arrow('code')}</button></th>
      <th><button type="button" data-sort="value">Latest value${arrow('value')}</button></th>
      <th><button type="button" data-sort="year">Year${arrow('year')}</button></th>
    </tr></thead>
    <tbody>${body}</tbody>
  </table></div>
  <p class="note">Values are the latest published year for each indicator
  (2024 for most; adult literacy ends in 2020). "Latest value" for money
  figures is in current US dollars; for the population it is people.</p>
</section>
<section class="panel">
  <h2>Methods &amp; notes</h2>
  <ul class="notes">
    <li>Figures were retrieved from the World Bank API on 26 November 2026 and copied into this site's data file unchanged.</li>
    <li>Charts show 2015–2024, or 2019–2024 with the range control. Missing years (adult literacy) are left out of its chart, not filled in.</li>
    <li>The working-age population share (15–64) is derived: 100% minus the published 0–14 and 65+ shares.</li>
    <li>Sector shares of GDP are value added; they sum to 95.7% in 2024, and the remainder is net taxes on products.</li>
    <li>The trade balance in points of GDP is exports minus imports as published (22.31 − 20.50 = 1.81 in 2024).</li>
    <li>Two WDI series returned no values for Indonesia in 2015–2024 (CO₂ emissions per capita; central government debt) and are not shown rather than guessed.</li>
    <li>This is an independent showcase, not an official publication. For official Indonesian statistics, see Statistics Indonesia (BPS).</li>
  </ul>
</section>
<p class="note">${esc(SOURCE_NOTE)}</p>`;
}

function fmtValue(series, value) {
  if (value === null || value === undefined) return '—';
  if (series.code === 'SP.POP.TOTL' || series.code === 'SL.TLF.TOTL.IN') return fmtInt(value);
  if (series.code === 'NY.GDP.MKTP.CD' || series.code === 'BX.KLT.DINV.CD.WD') return fmtUsdBn(value);
  if (series.code === 'NY.GDP.PCAP.CD') return `$${fmtInt(value)}`;
  if (series.unit === '%') return fmtPct(value);
  if (series.unit === '% of GDP') return `${value.toFixed(2)}% of GDP`;
  if (series.unit === 'years') return `${value.toFixed(1)} years`;
  if (series.unit === 'per 1,000') return `${value.toFixed(1)} per 1,000`;
  if (series.unit === 'births') return value.toFixed(2);
  return fmtOne(value);
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
