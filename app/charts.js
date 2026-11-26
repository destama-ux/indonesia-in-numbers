// Small deterministic SVG charts, drawn from the site's own data.
// No library, no network, no randomness: the same data always draws the
// same picture. All numbers are escaped into text nodes, never into HTML.

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function fmtInt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function fmtUsdBn(n) {
  return `$${(n / 1e9).toLocaleString('en-US', { maximumFractionDigits: 1 })}bn`;
}

export function fmtPct(n, digits = 2) {
  return `${n.toFixed(digits)}%`;
}

export function fmtOne(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 1 });
}

// A line chart. points: [{year, value}] with no nulls. width/height in px.
export function lineChart(points, opts = {}) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 260;
  const padL = 58;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const color = opts.color ?? '#0b6e5d';
  const fill = opts.fill ?? 'rgba(11,110,93,0.10)';
  const format = opts.format ?? fmtOne;
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  min -= span * 0.08;
  max += span * 0.08;
  const x = (i) => padL + ((w - padL - padR) * i) / (points.length - 1);
  const y = (v) => padT + ((max - v) / (max - min)) * (h - padT - padB);
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(h - padB).toFixed(1)} L${x(0).toFixed(1)},${(h - padB).toFixed(1)} Z`;
  const dots = points
    .map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.2" fill="#ffffff" stroke="${color}" stroke-width="2"/>`)
    .join('');
  const labels = points
    .map((p, i) => `<text x="${x(i).toFixed(1)}" y="${(h - 10).toFixed(1)}" class="axis">${esc(p.year)}</text>`)
    .join('');
  const grid = [0.25, 0.5, 0.75]
    .map((f) => {
      const v = min + (max - min) * f;
      return `<line x1="${padL}" x2="${w - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="grid"/><text x="${padL - 8}" y="${(y(v) + 4).toFixed(1)}" class="axis num">${esc(format(v))}</text>`;
    })
    .join('');
  const last = points[points.length - 1];
  const first = points[0];
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart, ${esc(format(first.value))} in ${first.year} to ${esc(format(last.value))} in ${last.year}">
${grid}<path d="${area}" fill="${fill}"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}
<text x="${x(points.length - 1).toFixed(1)}" y="${(y(last.value) - 10).toFixed(1)}" class="callout" text-anchor="end">${esc(format(last.value))}</text>
</svg>`;
}

// A bar chart. points: [{year, value}] with no nulls. Negative values draw
// below the zero line.
export function barChart(points, opts = {}) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 260;
  const padL = 58;
  const padR = 14;
  const padT = 22;
  const padB = 30;
  const color = opts.color ?? '#0b6e5d';
  const negColor = opts.negColor ?? '#b3402e';
  const format = opts.format ?? fmtOne;
  const values = points.map((p) => p.value);
  let min = Math.min(0, ...values);
  let max = Math.max(0, ...values);
  if (min === max) max = min + 1;
  const span = max - min;
  min -= span * 0.06;
  max += span * 0.06;
  const slot = (w - padL - padR) / points.length;
  const barW = Math.min(46, slot * 0.62);
  const x = (i) => padL + slot * i + (slot - barW) / 2;
  const y = (v) => padT + ((max - v) / (max - min)) * (h - padT - padB);
  const zeroY = y(0);
  const bars = points
    .map((p, i) => {
      const top = Math.min(y(p.value), zeroY);
      const height = Math.abs(y(p.value) - zeroY);
      const c = p.value < 0 ? negColor : color;
      return `<rect x="${x(i).toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(height, 1).toFixed(1)}" rx="2" fill="${c}"><title>${esc(p.year)}: ${esc(format(p.value))}</title></rect>`;
    })
    .join('');
  const labels = points
    .map((p, i) => `<text x="${(x(i) + barW / 2).toFixed(1)}" y="${(h - 10).toFixed(1)}" class="axis">${esc(p.year)}</text>`)
    .join('');
  const grid = [0.25, 0.5, 0.75]
    .map((f) => {
      const v = min + (max - min) * f;
      return `<line x1="${padL}" x2="${w - padR}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="grid"/><text x="${padL - 8}" y="${(y(v) + 4).toFixed(1)}" class="axis num">${esc(format(v))}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart, ${points.length} years from ${points[0].year} to ${points[points.length - 1].year}">
${grid}<line x1="${padL}" x2="${w - padR}" y1="${zeroY.toFixed(1)}" y2="${zeroY.toFixed(1)}" class="zero"/>${bars}${labels}
</svg>`;
}

// A donut chart for shares that sum to (at most) 100.
export function donut(parts, opts = {}) {
  const size = opts.size ?? 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  const colors = opts.colors ?? ['#0b6e5d', '#c98a1b', '#3d6fb4', '#8a8d93'];
  let acc = 0;
  const arcs = parts
    .map((p, i) => {
      const a0 = (acc / 100) * Math.PI * 2 - Math.PI / 2;
      acc += p.value;
      const a1 = (acc / 100) * Math.PI * 2 - Math.PI / 2;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + inner * Math.cos(a1);
      const yi1 = cy + inner * Math.sin(a1);
      const xi0 = cx + inner * Math.cos(a0);
      const yi0 = cy + inner * Math.sin(a0);
      return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}"><title>${esc(p.label)}: ${esc(p.value.toFixed(1))}%</title></path>`;
    })
    .join('');
  const total = parts.reduce((s, p) => s + p.value, 0);
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Shares totalling ${esc(total.toFixed(1))} percent">
${arcs}<text x="${cx}" y="${cy - 4}" class="donut-num" text-anchor="middle">${esc(total.toFixed(1))}%</text><text x="${cx}" y="${cy + 16}" class="donut-cap" text-anchor="middle">of GDP</text>
</svg>`;
}

// Horizontal share bars (0-100%) for age structure and similar.
export function shareBars(rows, opts = {}) {
  const color = opts.color ?? '#0b6e5d';
  return rows
    .map(
      (row) => `<div class="share-row">
  <div class="share-label">${esc(row.label)} <span class="share-val">${esc(row.display)}</span></div>
  <div class="share-track"><div class="share-fill" style="width:${Math.max(row.value, 0.4).toFixed(1)}%;background:${row.color ?? color}"></div></div>
</div>`,
    )
    .join('');
}
