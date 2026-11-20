/* Timberline mockups: shared data, helpers, window registry, app frame and router.
   Screen files call S({...}) to register a window. Everything is static HTML: no real logic,
   only enough links to move between windows. Example data uses BB Pallets' own numbers from
   the voice notes; names of companies and people are made up. */

// ---------------- shared example data ----------------
const D = {
  company: { name: 'BB Pallets', addr: '120 Example Industrial Rd, Concord ON  L4K 0A0', phone: '905-555-0100', gst: 'GST/HST 81234 5678 RT0001' },
  user: 'Sales desk',
  // pricing example (notes 4–6)
  price: { lumber: 500, labor: 135, wastePct: 5, afterWaste: 666.75, freightLoad: 2300, mbfPerLoad: 44, freightMbf: 52.25, delivered: 719,
           margin: 2000, other: 700, marginTotal: 3000, marginMbf: 68, sell: 787, piece: { name: '3x3 × 31"', bf: 1.9375, raw: 1.5248, quoted: 1.53 } },
  // batch offer example (notes 8–9)
  batch: { offered: 225, asked: 300, settled: 235, freight: 20, delivered: 245, tenFt: 294, cut: 305, firstQuality: 345, nextWeek: 325 },
  customers: [
    { id: 'ARD', name: 'Ardent Metals', plants: [
      { id: 'ARD-CON', name: 'Caldari Road plant', city: 'Concord ON', loadsYr: '20–24', cur: 'CAD', mode: 'Delivered', freight: 2300, buyer: 'Dana Ferreira', major: ['3x3 × 31"','3x3 × 37½"','3x3 × 38½"'], filler: '2x4 × 40"', other: 700 },
      { id: 'ARD-VAU', name: 'Jane Street plant', city: 'Vaughan ON', loadsYr: '4', cur: 'CAD', mode: 'Delivered', freight: 2100, buyer: 'Dana Ferreira', major: ['3x3 × 31"'], filler: '2x4 × 40"', other: 0 } ] },
    { id: 'LTB', name: 'Lakeshore Tube & Bar', plants: [
      { id: 'LTB-TOR', name: 'Toronto plant', city: 'Toronto ON', loadsYr: '12', cur: 'CAD', mode: 'Pickup', freight: 0, buyer: 'Raj Patel', major: ['2x3 × 39" grooved'], filler: '—', other: 0 } ] },
    { id: 'GSS', name: 'Garden State Steel', plants: [
      { id: 'GSS-NWK', name: 'Newark plant', city: 'Newark NJ', loadsYr: '10', cur: 'USD', mode: 'Delivered', freight: 3400, buyer: 'Mike Russo', major: ['3x3 × 37½"','4x4 × 48"'], filler: '2x4 × 40"', other: 400 } ] },
  ],
  items: [
    { code: 'DN-3331', name: '3x3 × 31"', type: 'Cut dunnage', t: 3, w: 3, l: 31, grooved: false, bf: 1.9375, perBundle: 140, lbPc: 2.6, from: '10\' (3 pcs) · 12\' (4 pcs) · 7\' (2 pcs)' },
    { code: 'DN-33375', name: '3x3 × 37½"', type: 'Cut dunnage', t: 3, w: 3, l: 37.5, grooved: false, bf: 2.3438, perBundle: 140, lbPc: 3.1, from: '10\' (3 pcs) · 12\' (3 pcs)' },
    { code: 'DN-33385', name: '3x3 × 38½"', type: 'Cut dunnage', t: 3, w: 3, l: 38.5, grooved: false, bf: 2.4063, perBundle: 140, lbPc: 3.2, from: '10\' (3 pcs) · 12\' (3 pcs)' },
    { code: 'DN-2339G', name: '2x3 × 39" grooved', type: 'Grooved', t: 2, w: 3, l: 39, grooved: true, bf: 1.625, perBundle: 210, lbPc: 2.1, from: '10\' (3 pcs) · 7\' (2 pcs) · 12\' (3 pcs + 24")' },
    { code: 'DN-2440', name: '2x4 × 40"', type: 'Cut dunnage (filler)', t: 2, w: 4, l: 40, grooved: false, bf: 2.2222, perBundle: 150, lbPc: 2.9, from: '10\' (3 pcs)' },
    { code: 'DN-4448', name: '4x4 × 48"', type: 'Cut dunnage', t: 4, w: 4, l: 48, grooved: false, bf: 5.3333, perBundle: 96, lbPc: 7.0, from: '8\' (2 pcs) · 12\' (3 pcs)' },
    { code: 'PL-4840', name: 'Pallet 48×40', type: 'Pallet', t: 0, w: 0, l: 48, grooved: false, bf: 24, perBundle: 12, lbPc: 48, from: 'Parts list' },
  ],
  stock: ['2x3 × 7\' trim','2x3 × 8\'','2x3 × 10\'','2x3 × 12\'','3x3 × 10\'','3x3 × 12\'','2x4 × 10\'','4x4 × 8\''],
  suppliers: [
    { name: 'North Shore Forest Products', carries: '2x3, 3x3 · 8\'–12\'', last: 545, terms: 'Net 30' },
    { name: 'Algonquin Lumber', carries: 'Trim 6\'–7\', 2x3', last: 440, terms: 'Net 15' },
    { name: 'Muskoka Sawmill', carries: '2x3, 2x4, 4x4 · 8\'–14\'', last: 475, terms: 'Net 30' },
  ],
  carriers: [
    { name: 'Trans-Ontario Freight', role: 'Cheapest', rate: 2000, used: '78%' },
    { name: 'Bluewater Carriers', role: 'Backup', rate: 2550, used: '22%' },
    { name: 'Liberty Line (US)', role: 'US loads', rate: 3400, used: '—' },
  ],
  subs: [
    { name: 'Kessler Wood Works', yard: 'Concord yard', does: 'Cut · groove · load', rate: '$135 / MBF in + groove $18 / MBF', jobs: 3 },
    { name: 'Pinegrove Pallet', yard: 'Bolton yard', does: 'Cut · pallets', rate: '$135 / MBF in + $4.50 / pallet', jobs: 1 },
  ],
  trailers: [
    { name: '53\' dry van', l: '53\'', w: '102"', h: '110"', axles: 'Tandem', lb: '45,000', bf: '44,000' },
    { name: '48\' flatbed', l: '48\'', w: '102"', h: '8\' 6" load', axles: 'Tandem', lb: '48,000', bf: '44,000' },
    { name: '53\' flatbed', l: '53\'', w: '102"', h: '8\' 6" load', axles: 'Tandem', lb: '48,000', bf: '44,000' },
    { name: 'Tri-axle 53\'', l: '53\'', w: '102"', h: '110"', axles: 'Tri-axle', lb: '41,000', bf: '44,000' },
    { name: 'B-train (28\' + 32\')', l: '28\' + 32\'', w: '102"', h: '8\' 6" load', axles: '8 axles', lb: '86,000', bf: '60,000' },
  ],
  // the story order used across the walk-through
  story: { order: '24-0318', proposal: 'P-24-0318', load: 'L-2417', po: 'PO 77815', job: 'J-1182', bol: 'BOL-2417', inv: 'INV-24-0611', plant: 'Caldari Road plant, Concord ON', customer: 'Ardent Metals' },
  stages: ['Needs sheet','Proposal','Customer PO','At subcontractor','Loaded','Invoiced'],
};

// ---------------- helpers (return HTML strings) ----------------
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const money = (n, d = 2) => '$' + Number(n).toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d });
const n0 = n => Number(n).toLocaleString('en-CA', { maximumFractionDigits: 0 });
const ICON = {
  workflow:'<path d="M4 6h6v4H4zM14 14h6v4h-6zM7 10v4h10"/>',
  orders:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h4"/>',
  loads:'<rect x="2" y="7" width="13" height="9"/><path d="M15 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  production:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  purchasing:'<path d="M3 4h2l2 12h11l2-8H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
  inventory:'<rect x="3" y="14" width="18" height="4"/><rect x="5" y="9" width="14" height="4"/><rect x="7" y="4" width="10" height="4"/>',
  pricing:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  customers:'<path d="M3 21V9l6-4v4l6-4v4l6-4v16z"/>',
  catalog:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  reports:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  spark:'<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  print:'<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>',
  pdf:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 14h6M12 11v6"/>',
  xls:'<rect x="4" y="4" width="16" height="16"/><path d="M4 10h16M4 15h16M10 4v16"/>',
  mail:'<rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  warn:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
};
const icon = (k, s = 16, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${ICON[k] || ''}</svg>`;

const H = {
  icon,
  /** Page header. crumb, title, sub (optional), right-side HTML (buttons) */
  head: (crumb, title, sub = '', right = '') => `<div class="ph"><div>${crumb ? `<div class="crumb">${crumb}</div>` : ''}<h2>${title}</h2>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right ? `<div class="btns">${right}</div>` : ''}</div>`,
  btn: (t, kind = '', ic = '') => `<button class="btn ${kind}">${ic ? icon(ic, 15) : ''}${t}</button>`,
  /** link button that jumps to another window by id */
  go: (t, id, kind = '', ic = '') => `<a class="btn ${kind}" href="#${id}" style="text-decoration:none">${ic ? icon(ic, 15) : ''}${t}</a>`,
  chip: (t, kind = '') => `<span class="chip ${kind}">${t}</span>`,
  dot: (kind = '') => `<span class="dot ${kind}"></span>`,
  /** Status strip; nowIndex = current stage, earlier ones show done */
  stages: (list, now) => `<div class="stages">${list.map((s, i) => `${i ? '<span class="arrow">›</span>' : ''}<span class="chip ${i < now ? 'ok' : i === now ? 'now' : ''}">${s}</span>`).join('')}</div>`,
  /** Gauge tile: label, value html, pct (0-100+, or null for no bar), note, state ok|warn|bad|'' */
  gauge: (k, v, pct = null, note = '', state = '') => `<div class="g ${state}"><div class="k">${k}</div><div class="v">${v}</div>${pct == null ? '' : `<div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div>`}${note ? `<div class="note">${note}</div>` : ''}</div>`,
  kpis: tiles => `<div class="kpis">${tiles.join('')}</div>`,
  /** Panel with title, optional right-side HTML, body; flush=true removes body padding (tables) */
  panel: (title, body, right = '', flush = false) => `<section class="panel">${title || right ? `<div class="hd"><h3>${title}</h3>${right ? `<div class="btns">${right}</div>` : ''}</div>` : ''}<div class="bd ${flush ? 'flush' : ''}">${body}</div></section>`,
  /** Table. cols: [{t:'Header', num:true}] or strings; rows: arrays of cell HTML; opts: {sel:rowIndex, foot:[cells], cls:[rowclass...]} */
  table: (cols, rows, opts = {}) => {
    const C = cols.map(c => typeof c === 'string' ? { t: c } : c);
    const th = C.map(c => `<th class="${c.num ? 'num' : ''}">${c.t}</th>`).join('');
    const tr = rows.map((r, i) => `<tr class="${opts.sel === i ? 'sel' : ''} ${(opts.cls && opts.cls[i]) || ''}">${r.map((cell, j) => `<td class="${C[j] && C[j].num ? 'num' : ''}">${cell}</td>`).join('')}</tr>`).join('');
    const tf = opts.foot ? `<tfoot><tr>${opts.foot.map((cell, j) => `<td class="${C[j] && C[j].num ? 'num' : ''}">${cell}</td>`).join('')}</tr></tfoot>` : '';
    return `<div class="tw"><table class="t"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody>${tf}</table></div>`;
  },
  /** Form field: label, value, unit, readonly */
  field: (label, value, unit = '', ro = false) => `<div class="field"><label>${label}</label><div class="input ${ro ? 'ro' : ''}"><span>${value}</span>${unit ? `<span class="unit">${unit}</span>` : ''}</div></div>`,
  form: fields => `<div class="form">${fields.join('')}</div>`,
  callout: (kind, html, btn = '') => `<div class="callout ${kind}">${icon(kind === 'warn' || kind === 'bad' ? 'warn' : kind === 'ok' ? 'check' : 'info', 18)}<div>${html}</div>${btn}</div>`,
  filters: list => `<div class="toolbar">${list.map(f => `<span class="filter ${f.startsWith('*') ? 'on' : ''}">${f.replace(/^\*/, '')}</span>`).join('')}</div>`,
  seg: (opts, on) => `<span class="seg">${opts.map((o, i) => `<span class="${i === on ? 'on' : ''}">${o}</span>`).join('')}</span>`,
  toggle: on => `<span class="toggle ${on ? 'on' : ''}"></span>`,
  box: on => `<span class="box ${on ? 'on' : ''}">${on ? '✓' : ''}</span>`,
  drop: text => `<div class="drop">${icon('upload', 22)}<div style="margin-top:6px">${text}</div><div class="small">or click to choose a file</div></div>`,
  /** The four document actions every document has (D8) */
  docActions: (excel = true) => `${H.btn('Print', '', 'print')}${H.btn('PDF', '', 'pdf')}${excel ? H.btn('Excel', '', 'xls') : ''}${H.btn('Email', 'primary', 'mail')}`,
  /** Simple bar chart (SVG). data: [{label, value, value2?}] */
  bars: (data, opts = {}) => {
    const w = 640, h = opts.h || 200, pad = 28, max = Math.max(...data.map(d => Math.max(d.value, d.value2 || 0))) * 1.1;
    const bw = (w - pad * 2) / data.length;
    const y = v => h - pad - (v / max) * (h - pad * 2);
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><line class="ax" x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}"/>${data.map((d, i) => {
      const x = pad + i * bw; const two = d.value2 != null;
      const bwi = two ? bw * .34 : bw * .56;
      return `${two ? `<rect x="${x + bw * .14}" y="${y(d.value2)}" width="${bwi}" height="${h - pad - y(d.value2)}" fill="var(--line-2)" rx="2"/>` : ''}<rect x="${x + (two ? bw * .5 : bw * .22)}" y="${y(d.value)}" width="${bwi}" height="${h - pad - y(d.value)}" fill="var(--brand)" rx="2"/><text x="${x + bw / 2}" y="${h - 10}" text-anchor="middle">${d.label}</text>`;
    }).join('')}</svg>`;
  },
  /** Line chart (SVG). series: [{name, values:[...], color}] labels: [...] */
  lines: (labels, series, opts = {}) => {
    const w = 640, h = opts.h || 200, pad = 30; const all = series.flatMap(s => s.values); const min = Math.min(...all) * .95, max = Math.max(...all) * 1.05;
    const x = i => pad + i * (w - pad * 2) / (labels.length - 1), y = v => h - pad - (v - min) / (max - min) * (h - pad * 2);
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img"><line class="ax" x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}"/>${labels.map((l, i) => `<text x="${x(i)}" y="${h - 10}" text-anchor="middle">${l}</text>`).join('')}${series.map(s => `<polyline fill="none" stroke="${s.color || 'var(--brand)'}" stroke-width="2.5" ${s.dash ? 'stroke-dasharray="6 5"' : ''} points="${s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}"/><circle cx="${x(s.values.length - 1)}" cy="${y(s.values[s.values.length - 1])}" r="4" fill="${s.color || 'var(--brand)'}"/>`).join('')}</svg>`;
  },
  /** Assistant dock content: list of [who, html] where who = 'me' | 'ai' | 'propose' */
  assistant: msgs => `<aside class="dock" aria-label="Assistant"><header>${icon('spark')}<span>Assistant</span><span class="muted small" style="margin-left:auto">✕</span></header><div class="msgs">${msgs.map(([who, h]) => who === 'propose' ? `<div class="propose"><div class="k">Proposed · needs your OK</div>${h}<div class="btns" style="margin-top:8px">${H.btn('Approve', 'primary sm')}${H.btn('Change', 'sm')}</div></div>` : `<div class="m ${who}">${h}</div>`).join('')}</div><div class="compose"><div class="input muted">Ask in English or Yiddish…</div>${H.btn('↑', 'primary')}</div></aside>`,
  /** Dialog overlay drawn on top of a dimmed page. wide=true for big dialogs */
  dialog: (title, body, footer, wide = false) => `<div class="scrim"><div class="dialog ${wide ? 'wide' : ''}"><header><h3>${title}</h3><span class="x">✕</span></header><div class="bd">${body}</div><footer>${footer}</footer></div></div>`,
  /** Document preview: title + paper HTML; excel=false hides the Excel button */
  doc: (title, paper, excel = true) => `<div class="scrim"><div style="width:100%"><div class="docbar"><b style="color:#fff">${title}</b><div class="btns">${H.docActions(excel)}${H.btn('Close')}</div></div><div class="paper">${paper}</div></div></div>`,
  /** Letterhead for documents */
  letterhead: (docName, metaPairs) => `<div class="lh"><div><div class="co">${D.company.name}</div><div>${D.company.addr}</div><div>${D.company.phone}</div></div><div style="text-align:right"><h1>${docName}</h1><div class="meta" style="justify-content:end">${metaPairs.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('')}</div></div></div>`,
  /** Top view of a trailer with bundles. cells: array of strings 'w1:1' (wood class : label), '' = empty, 'fill:4' filler. cols x rows grid. */
  trailer: (cells, cols = 13, rows = 2, opts = {}) => `<div style="overflow-x:auto"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},${opts.rowH || 46}px);gap:4px;padding:10px;border:2px solid var(--muted);border-radius:4px 14px 14px 4px;min-width:${opts.minW || 560}px;background:var(--surface-2)">${cells.map(c => { if (!c) return '<div class="b empty">+</div>'; const [cls, lab] = c.split(':'); return `<div class="b ${cls === 'fill' ? 'w4 fill' : cls}">${lab || ''}</div>`; }).join('')}</div><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px;min-width:${opts.minW || 560}px"><span>Nose (first on)</span><span>Doors (last on)</span></div></div>`,
};

// ---------------- window registry ----------------
const DEPTS = [
  { id: 'workflow', label: 'Workflow', tabs: [['workflow', 'Whole process']] },
  { id: 'orders', label: 'Orders', tabs: [['orders-incoming', 'Incoming'], ['orders-proposals', 'Proposals'], ['orders-orders', 'Orders'], ['orders-pickups', 'Pickups']] },
  { id: 'loads', label: 'Loads', tabs: [['loads-planner', '3D Planner'], ['loads-bookings', 'Carrier bookings'], ['loads-schedule', 'Schedule'], ['loads-bol', 'Bills of lading']] },
  { id: 'production', label: 'Production', tabs: [['production-jobs', 'Jobs'], ['production-subs', 'Subcontractors']] },
  { id: 'purchasing', label: 'Purchasing', tabs: [['purchasing-offers', 'Offers & batch calculator'], ['purchasing-pos', 'Purchase orders'], ['purchasing-suppliers', 'Suppliers']] },
  { id: 'inventory', label: 'Inventory', tabs: [['inventory-onhand', 'On hand'], ['inventory-counts', 'Counts & recounts'], ['inventory-adjustments', 'Adjustments'], ['inventory-waste', 'Waste']] },
  { id: 'pricing', label: 'Pricing', tabs: [['pricing-builder', 'Price builder'], ['pricing-lists', 'Price lists'], ['pricing-whatif', 'What-if']] },
  { id: 'customers', label: 'Customers', tabs: [['customers-accounts', 'Accounts & plants'], ['customers-contacts', 'Contacts'], ['customers-statements', 'Statements & payments']] },
  { id: 'catalog', label: 'Catalog', tabs: [['catalog-items', 'Items'], ['catalog-pallets', 'Pallets'], ['catalog-lengths', 'Stock lengths']] },
  { id: 'reports', label: 'Reports', tabs: [['reports-operations', 'Operations'], ['reports-money', 'Money'], ['reports-scheduled', 'Scheduled']] },
  { id: 'settings', label: 'Settings', tabs: [['settings-users', 'Users & access'], ['settings-email', 'Email'], ['settings-trailers', 'Trailer types'], ['settings-carriers', 'Carriers'], ['settings-taxes', 'Taxes & currency'], ['settings-imports', 'Imports']] },
];
const WINDOWS = [];
/**
 * Register a window.
 * id: unique, used in the link (#id). For tab screens use the tab id from DEPTS.
 * dept: department id (rail highlight). tab: tab id to highlight (defaults to id).
 * kind: 'screen' | 'document' | 'dialog' (documents and dialogs are drawn over a dimmed page)
 * title: name shown in lists. intent: what it's for (1–3 sentences, plain words).
 * check: questions to confirm with BB Pallets. assistant: things the Assistant can do here.
 * ref: hand-off references, e.g. 'Hand-off 4.2, D11'. story: step number in the order story if part of it.
 * html(): page content. dock: optional H.assistant(...) HTML to show the Assistant open.
 * under: for documents/dialogs, a function returning the page drawn underneath (optional).
 */
function S(w) { WINDOWS.push(Object.assign({ kind: 'screen', check: [], assistant: [], tab: w.id }, w)); }

// ---------------- frame + router ----------------
function frame(w) {
  const dept = DEPTS.find(d => d.id === w.dept) || DEPTS[0];
  const rail = DEPTS.map(d => `<a class="dept" href="#${d.tabs[0][0]}" aria-current="${d.id === dept.id}">${icon(d.id, 18)}<span>${d.label}</span></a>`).join('');
  const tabs = dept.tabs.map(([id, label]) => `<a href="#${id}" aria-selected="${id === w.tab}">${label}</a>`).join('');
  const under = w.kind !== 'screen' && w.under ? w.under() : '';
  const content = w.kind === 'screen' ? w.html() : '';
  return `<div class="app">
  <nav class="rail" aria-label="Departments"><div class="logo"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="15" width="22" height="4" rx="1" fill="var(--crayon)"/><rect x="2" y="20.5" width="22" height="3.5" rx="1" fill="var(--crayon)" opacity=".6"/><path d="M13 2 6 13h14z" fill="var(--rail-fg)"/></svg>Timberline</div>${rail}<div class="sep"></div><div class="foot">‹ Collapse</div></nav>
  <div class="main">
    <div class="top"><div class="search">${icon('search')}<span>Search orders, plants, items, loads…</span></div><div class="tb"><div class="lang"><span class="on">EN</span><span>FR</span></div><span class="bell">${icon('bell', 18)}</span><a class="ask" href="#dlg-assistant" style="text-decoration:none">${icon('spark')}<span>Assistant</span></a><div class="avatar">BB</div></div></div>
    <div class="tabs">${tabs}</div>
    <div class="body ${w.dock ? 'with-dock' : ''}">${w.kind === 'screen' ? `<div class="work">${content}</div>` : `<div class="work overlay"><div class="under">${under}</div>${w.html()}</div>`}${w.dock || ''}</div>
  </div></div>`;
}
function notes(w) {
  const list = a => a.length ? `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>` : '<p class="muted">Nothing open.</p>';
  return `<div class="notes">
    <div class="note-c"><h3><i></i>What this ${w.kind === 'screen' ? 'screen' : w.kind} is for</h3><p>${w.intent}</p>${w.story ? `<p class="small muted">Step ${w.story} of ${Math.max(...WINDOWS.map(x => x.story || 0))} in the order story.</p>` : ''}${w.ref ? `<div class="ref">${w.ref}</div>` : ''}</div>
    <div class="note-c q"><h3><i></i>To check with BB Pallets</h3>${list(w.check)}</div>
    <div class="note-c a"><h3><i></i>The Assistant here can</h3>${list(w.assistant)}</div>
  </div>`;
}
const order = () => {
  const o = []; DEPTS.forEach(d => d.tabs.forEach(([id]) => { const w = WINDOWS.find(x => x.id === id); if (w) o.push(w); WINDOWS.filter(x => x.kind !== 'screen' && x.tab === id).forEach(x => o.push(x)); }));
  WINDOWS.forEach(x => { if (!o.includes(x)) o.push(x); }); return o;
};
function mbar(cur) {
  const seq = order(); const i = seq.findIndex(x => x.id === cur);
  const pn = i >= 0 ? `<div class="pn"><span class="muted">${i + 1} of ${seq.length}</span>${i > 0 ? `<a href="#${seq[i - 1].id}">‹ Back</a>` : ''}${i < seq.length - 1 ? `<a href="#${seq[i + 1].id}">Next ›</a>` : ''}</div>` : '';
  return `<div class="mbar"><div class="ttl">Timberline <span>· mockups for BB Pallets</span></div><nav><a href="#index" ${cur === 'index' ? 'aria-current="page"' : ''}>All windows</a><a href="#story" ${cur === 'story' ? 'aria-current="page"' : ''}>Order story</a><a href="#guide" ${cur === 'guide' ? 'aria-current="page"' : ''}>Explanation sheet</a></nav>${pn}</div>`;
}
function pageIndex() {
  const groups = DEPTS.map(d => {
    const items = [];
    d.tabs.forEach(([id, label]) => { const w = WINDOWS.find(x => x.id === id); items.push(`<a href="#${id}">${label}<span>${w ? 'screen' : 'missing'}</span></a>`); WINDOWS.filter(x => x.kind !== 'screen' && x.tab === id).forEach(x => items.push(`<a href="#${x.id}">↳ ${x.title}<span>${x.kind}</span></a>`)); });
    return `<div class="grp"><h3>${icon(d.id, 18)}${d.label}</h3>${items.join('')}</div>`;
  }).join('');
  const others = WINDOWS.filter(x => x.kind !== 'screen' && !DEPTS.some(d => d.tabs.some(t => t[0] === x.tab)));
  return `<div class="page"><div class="hero"><h1>Every window in Timberline</h1><p>These are pictures of the screens, documents and dialogs, before anything is built. Click any window to see it inside the app, with notes underneath: what it's for, what we need BB Pallets to confirm, and what the Assistant can do there. Use Back and Next at the top to go through all of them in order. Leave a comment on anything to change.</p></div><div class="idx">${groups}${others.length ? `<div class="grp"><h3>Other</h3>${others.map(x => `<a href="#${x.id}">${x.title}<span>${x.kind}</span></a>`).join('')}</div>` : ''}</div></div>`;
}
function pageStory() {
  const steps = WINDOWS.filter(w => w.story).sort((a, b) => a.story - b.story || a.id.localeCompare(b.id));
  return `<div class="page"><div class="hero"><h1>The order story, click by click</h1><p>One order for Ardent Metals' Caldari Road plant in Concord, from the customer's spreadsheet to the invoice. Each step opens the window where it happens.</p></div><div class="guide-sec">${steps.map(w => `<div class="gi"><div class="nm"><span class="chip now">Step ${w.story}</span> <a href="#${w.id}">${w.title}</a></div><div><p>${w.intent}</p></div></div>`).join('')}</div></div>`;
}
function pageGuide() {
  const secs = DEPTS.map(d => {
    const ws = []; d.tabs.forEach(([id]) => { const w = WINDOWS.find(x => x.id === id); if (w) ws.push(w); WINDOWS.filter(x => x.kind !== 'screen' && x.tab === id).forEach(x => ws.push(x)); });
    return `<section class="guide-sec"><h2>${d.label}</h2>${ws.map(w => `<div class="gi"><div class="nm"><a href="#${w.id}">${w.title}</a><span class="small muted">${w.kind}${w.story ? ` · story step ${w.story}` : ''}</span></div><div><p>${w.intent}</p>${w.check.length ? `<ul>${w.check.map(c => `<li>Check: ${c}</li>`).join('')}</ul>` : ''}</div></div>`).join('')}</section>`;
  }).join('');
  return `<div class="page"><div class="hero"><h1>Explanation sheet</h1><p>What each window is for and the questions behind it, in one list. The intent comes from the 13 voice notes and the decisions made so far (D1–D31 in the hand-off). Nothing here is final: mark what's wrong and it changes before anything is built.</p></div>
  <section class="guide-sec"><h2>How the app is laid out</h2><div class="gi"><div class="nm">Departments</div><div><p>Down the left. Each one fills the page; its tabs run across the top. No dashboard of tiles. The rail collapses to icons, and on a phone it opens from a menu button.</p></div></div><div class="gi"><div class="nm">Top bar</div><div><p>The same on every page: search, English/French, notifications, the Assistant, and you.</p></div></div><div class="gi"><div class="nm">Assistant</div><div><p>On every page. It looks things up and proposes actions; a person clicks Approve before anything is sent or changed. Every screen comes with its own Assistant abilities.</p></div></div><div class="gi"><div class="nm">Documents</div><div><p>Every document has Print, PDF, Excel (where it's a table) and Email. Email goes from your own mailbox and is logged on the customer, supplier or order.</p></div></div><div class="gi"><div class="nm">Colours</div><div><p>Spruce green for actions and links. Yellow only for "you are here" and the Assistant. Green, amber and red only mean OK, close to a limit, and over.</p></div></div></section>${secs}</div>`;
}
function pageWorkflow() { return (window.WORKFLOW_HTML || ''); }

function route() {
  const id = (location.hash || '#index').slice(1);
  const root = document.getElementById('root');
  let html;
  if (id === 'index') html = mbar('index') + pageIndex();
  else if (id === 'story') html = mbar('story') + pageStory();
  else if (id === 'guide') html = mbar('guide') + pageGuide();
  else {
    const w = WINDOWS.find(x => x.id === id);
    html = w ? mbar(id) + frame(w) + notes(w) : mbar('') + `<div class="page"><div class="hero"><h1>Not drawn yet</h1><p>No window called “${esc(id)}”. <a href="#index">See all windows</a>.</p></div></div>`;
  }
  root.innerHTML = html;
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
