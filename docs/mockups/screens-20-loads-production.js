/* Loads (3D Planner, Schedule, Bills of lading) and Production (Jobs, Subcontractors),
   plus the loading list, BOL, packing slip, job sheet, and the confirm-load and loaded-quantities dialogs. */
(function () {
  const st = D.story;

  // ---------- the example load (53' dry van, two drops) ----------
  // rows from the nose to the doors. dir: 'across' | 'length'. per = bundles side by side, high = layers.
  const IT = {
    a: { name: '3x3 × 31"', L: 31, cls: 'w1', fill: 'var(--wood-1)', bf: 271 },
    g: { name: '2x3 × 39" grooved', L: 39, cls: 'w3', fill: 'var(--wood-3)', bf: 341 },
    b: { name: '3x3 × 37½"', L: 37.5, cls: '', fill: 'var(--wood-2)', bf: 328 },
    f: { name: '2x4 × 40" filler', L: 40, cls: 'fill', fill: 'var(--wood-4)', bf: 333, filler: true },
  };
  const BW = 42, BH = 28, GAP = 3, TL = 636, TW = 102;
  const ROWS = [
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 2, step: 1 },
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 2, step: 1 },
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 2, step: 1 },
    { k: 'g', dir: 'length', per: 2, high: 3, drop: 1, step: 2 },
    { k: 'g', dir: 'length', per: 2, high: 3, drop: 1, step: 2 },
    { k: 'g', dir: 'length', per: 2, high: 3, drop: 1, step: 2 },
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 1, step: 3 },
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 1, step: 3 },
    { k: 'a', dir: 'across', per: 3, high: 3, drop: 1, step: 3 },
    { k: 'b', dir: 'length', per: 2, high: 3, drop: 1, step: 4 },
    { k: 'b', dir: 'length', per: 2, high: 3, drop: 1, step: 4 },
    { k: 'f', dir: 'length', per: 2, high: 2, drop: 1, step: 5 },
  ];
  // place every bundle: x along the trailer (nose = 0), z across (0 = driver side), y up
  const BOXES = []; let cx = 0;
  ROWS.forEach(r => {
    const it = IT[r.k];
    const depth = r.dir === 'across' ? BW : it.L, zs = r.dir === 'across' ? it.L : BW;
    const used = r.per * zs + (r.per - 1) * 2; let z = (TW - used) / 2;
    for (let j = 0; j < r.per; j++) { for (let h = 0; h < r.high; h++) BOXES.push({ x0: cx, x1: cx + depth, z0: z, z1: z + zs, y0: h * (BH + 3.5) + 3.5, y1: h * (BH + 3.5) + 3.5 + BH, it, dir: r.dir, step: r.step }); z += zs + 2; }
    cx += depth + GAP;
  });
  const USED = cx - GAP;

  // ---------- isometric-style drawing ----------
  const AX = [0.92, 0.29], AZ = [-0.6, 0.4];
  const P = (x, y, z) => [x * AX[0] + z * AZ[0], x * AX[1] + z * AZ[1] - y];
  const pts = a => a.map(p => P(...p).map(v => v.toFixed(1)).join(',')).join(' ');
  const L3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const seg = (a, b) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; };
  function face(corners, fill, shade, lines) {
    return `<polygon points="${pts(corners)}" fill="${fill}"/>${shade ? `<polygon points="${pts(corners)}" fill="#000" opacity="${shade}"/>` : ''}<g stroke="rgba(60,35,10,.32)" stroke-width=".7">${lines.join('')}</g><polygon points="${pts(corners)}" fill="none" stroke="rgba(50,30,10,.55)" stroke-width=".8"/>`;
  }
  // lines parallel to edge a→b, spread between a→c
  const along = (a, b, c, n) => { const o = []; for (let i = 1; i < n; i++) { const t = i / n; o.push(seg(L3(a, c, t), L3(b, c.map((v, k) => v + b[k] - a[k]), t))); } return o; };
  function boxSvg(b) {
    const { x0, x1, y0, y1, z0, z1 } = b; const ax = b.dir === 'length' ? 'x' : 'z';
    const top = [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
    const front = [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    const end = [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]];
    // top: grain along the piece length
    const topL = ax === 'x' ? along([x0, y1, z0], [x1, y1, z0], [x0, y1, z1], 5) : along([x0, y1, z0], [x0, y1, z1], [x1, y1, z0], 5);
    // front (+z): layers along x if lengthwise, end grain grid if across
    const frL = ax === 'x' ? along([x0, y0, z1], [x1, y0, z1], [x0, y1, z1], 5) : [...along([x0, y0, z1], [x1, y0, z1], [x0, y1, z1], 5), ...along([x0, y0, z1], [x0, y1, z1], [x1, y0, z1], 6)];
    // end (+x): end grain grid if lengthwise, layers along z if across
    const enL = ax === 'z' ? along([x1, y0, z0], [x1, y0, z1], [x1, y1, z0], 5) : [...along([x1, y0, z0], [x1, y0, z1], [x1, y1, z0], 5), ...along([x1, y0, z0], [x1, y1, z0], [x1, y0, z1], 6)];
    const f = b.it.fill;
    // two steel straps
    const straps = [0.3, 0.7].map(t => ax === 'x'
      ? `<polyline points="${pts([[x0 + (x1 - x0) * t, y0, z1], [x0 + (x1 - x0) * t, y1, z1], [x0 + (x1 - x0) * t, y1, z0]])}" fill="none" stroke="#24364a" stroke-width="1.6"/>`
      : `<polyline points="${pts([[x1, y0, z0 + (z1 - z0) * t], [x1, y1, z0 + (z1 - z0) * t], [x0, y1, z0 + (z1 - z0) * t]])}" fill="none" stroke="#24364a" stroke-width="1.6"/>`).join('');
    const dash = b.it.filler ? `<polygon points="${pts(top)}" fill="none" stroke="var(--warn)" stroke-width="1.4" stroke-dasharray="4 3"/>` : '';
    // riser under the bundle
    const riser = `<polygon points="${pts([[x0 + 4, y0 - 3.5, z1], [x1 - 4, y0 - 3.5, z1], [x1 - 4, y0, z1], [x0 + 4, y0, z1]])}" fill="#8a6a45" opacity=".85"/>`;
    return riser + face(end, f, 0.24, enL) + face(front, f, 0.12, frL) + face(top, f, 0, topL) + straps + dash;
  }
  function iso3d() {
    const sorted = BOXES.slice().sort((a, b) => a.x0 - b.x0 || a.z0 - b.z0 || a.y0 - b.y0);
    const deckTop = [[0, 0, 0], [TL, 0, 0], [TL, 0, TW], [0, 0, TW]];
    const deckFront = [[0, -7, TW], [TL, -7, TW], [TL, 0, TW], [0, 0, TW]];
    const deckEnd = [[TL, -7, 0], [TL, -7, TW], [TL, 0, TW], [TL, 0, 0]];
    const nose = [[0, 0, 0], [0, 110, 0], [0, 110, TW], [0, 0, TW]];
    const far = [[0, 0, 0], [TL, 0, 0], [TL, 110, 0], [0, 110, 0]];
    const wheel = (x, z) => { const [px, py] = P(x, -24, z); return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="13" ry="17" fill="#2a2d31"/><ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="6" ry="8" fill="#9aa1a8"/>`; };
    const [nx, ny] = P(0, 128, 0), [dx, dy] = P(TL, 125, TW);
    const [d2x, d2y] = P(60, 118, 0), [d1x, d1y] = P(420, 118, 0);
    return `<svg viewBox="-110 -170 760 450" class="chart" role="img" aria-label="3D view of load L-2417 on a 53 foot dry van">
      <polygon points="${pts(far)}" fill="var(--surface-2)" stroke="var(--line-2)" stroke-dasharray="4 4" opacity=".7"/>
      <polygon points="${pts(nose)}" fill="var(--surface-2)" stroke="var(--line-2)" opacity=".8"/>
      <polygon points="${pts([[0, -7, TW - 30], [TL, -7, TW - 30], [TL, -16, TW - 30], [0, -16, TW - 30]])}" fill="#33383d"/>
      <polygon points="${pts([[100, -16, TW - 30], [118, -16, TW - 30], [118, -40, TW - 30], [100, -40, TW - 30]])}" fill="#33383d"/>
      ${wheel(520, TW - 10)}${wheel(565, TW - 10)}
      <polygon points="${pts(deckFront)}" fill="#4b5157"/><polygon points="${pts(deckEnd)}" fill="#3a3f44"/>
      <polygon points="${pts(deckTop)}" fill="#7a6a55" stroke="#4b4033"/>
      ${sorted.map(boxSvg).join('')}
      <text x="${nx - 10}" y="${ny}" style="font:600 12px var(--f-body);fill:var(--muted)">Nose · first on</text>
      <text x="${dx - 70}" y="${dy + 160}" style="font:600 12px var(--f-body);fill:var(--muted)">Doors · last on</text>
      <g style="font:700 11px var(--f-body)"><rect x="${d2x - 8}" y="${d2y - 15}" width="122" height="22" rx="11" fill="var(--info-bg)"/><text x="${d2x + 4}" y="${d2y}" fill="var(--info)">Drop 2 · Jane Street</text>
      <rect x="${d1x - 8}" y="${d1y - 15}" width="190" height="22" rx="11" fill="var(--crayon-soft)"/><text x="${d1x + 4}" y="${d1y}" fill="var(--fg)">Drop 1 · Caldari Road (doors)</text></g>
    </svg>`;
  }
  // top view to scale, numbered by loading step
  function topView(opts = {}) {
    const s = opts.s || 0.95, w = TL * s, h = TW * s;
    const rects = BOXES.filter(b => b.y0 < 5).map(b => `<rect x="${(b.x0 * s).toFixed(1)}" y="${(b.z0 * s).toFixed(1)}" width="${((b.x1 - b.x0) * s).toFixed(1)}" height="${((b.z1 - b.z0) * s).toFixed(1)}" fill="${b.it.fill}" stroke="rgba(50,30,10,.55)" ${b.it.filler ? 'stroke-dasharray="4 3"' : ''}/>` +
      `<g stroke="rgba(60,35,10,.3)">${b.dir === 'length' ? [0.25, 0.5, 0.75].map(t => `<line x1="${(b.x0 * s + 2).toFixed(1)}" x2="${(b.x1 * s - 2).toFixed(1)}" y1="${((b.z0 + (b.z1 - b.z0) * t) * s).toFixed(1)}" y2="${((b.z0 + (b.z1 - b.z0) * t) * s).toFixed(1)}"/>`).join('') : [0.25, 0.5, 0.75].map(t => `<line y1="${(b.z0 * s + 2).toFixed(1)}" y2="${(b.z1 * s - 2).toFixed(1)}" x1="${((b.x0 + (b.x1 - b.x0) * t) * s).toFixed(1)}" x2="${((b.x0 + (b.x1 - b.x0) * t) * s).toFixed(1)}"/>`).join('')}</g>` +
      `<text x="${((b.x0 + b.x1) / 2 * s).toFixed(1)}" y="${((b.z0 + b.z1) / 2 * s + 4).toFixed(1)}" text-anchor="middle" style="font:700 11px var(--f-num);fill:${b.it.cls === 'w3' ? '#fff6ea' : 'var(--wood-ink)'}">${b.step}</text>`).join('');
    return `<div style="overflow-x:auto"><svg viewBox="-6 -22 ${w + 12} ${h + 46}" style="min-width:560px;width:100%;height:auto;display:block" role="img" aria-label="Top view of the trailer floor">
      <rect x="0" y="0" width="${w}" height="${h}" rx="3" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
      <rect x="${(USED * s).toFixed(1)}" y="2" width="${((TL - USED) * s - 2).toFixed(1)}" height="${h - 4}" fill="none" stroke="var(--line-2)" stroke-dasharray="5 4"/>
      <text x="${((USED + (TL - USED) / 2) * s).toFixed(1)}" y="${h / 2 + 4}" text-anchor="middle" style="font:11px var(--f-body);fill:var(--muted)">${Math.round((TL - USED) / 12)}' free</text>
      ${rects}
      <text x="0" y="-8" style="font:11px var(--f-body);fill:var(--muted)">Nose (first on)</text>
      <text x="${w}" y="-8" text-anchor="end" style="font:11px var(--f-body);fill:var(--muted)">Doors (last on)</text>
      <text x="0" y="${h + 18}" style="font:11px var(--f-body);fill:var(--muted)">53' × 102" · to scale · bottom layer shown</text>
    </svg></div>`;
  }

  const gauges = () => H.kpis([
    H.gauge('Board feet', `38,750 <small>/ 44,000</small>`, 88, '88% · room for 13 more bundles of 3x3 × 31"'),
    H.gauge('Weight', `43,100 <small>/ 45,000 lb</small>`, 96, '96% · weight runs out first', 'warn'),
    H.gauge('Floor', `82%`, 82, `${Math.round(USED / 12)}' of 53' used · 3 high`),
    H.gauge('Weight over axles', `47% <small>/ 53%</small>`, null, 'Front / rear · balanced', 'ok'),
  ]);
  const trailerPick = () => `<div class="btns">${D.trailers.map((t, i) => `<span class="filter ${i === 0 ? 'on' : ''}">${t.name}</span>`).join('')}${H.go('Trailer types', 'settings-trailers', 'ghost sm')}</div>`;
  const plannerHead = () => H.head(`Load ${st.load} · Proposal ${st.proposal} · ${st.customer}`, 'Two drops: Caldari Road and Jane Street',
    'Ardent Metals, one buyer, two plants 8 miles apart. Drop 1 goes last on, nearest the doors.',
    H.btn('Split into 2 loads') + H.go('Loading list', 'doc-loadlist', '', 'print') + H.go('Confirm load', 'dlg-confirmload', 'primary', 'check'));

  const orderRows = [
    ['a', 2, 27, 'across', 'Jane Street', 1],
    ['g', 1, 18, 'length', 'Caldari Road', 2],
    ['a', 1, 27, 'across', 'Caldari Road', 3],
    ['b', 1, 12, 'length', 'Caldari Road', 4],
    ['f', 1, '4+', 'length', 'Caldari Road', 5],
  ];
  const loadTable = () => H.table(['', '#', 'Item', 'Drop', 'Direction', { t: 'Bundles', num: true }, { t: 'Bd ft', num: true }],
    orderRows.map(([k, drop, n, dir, plant, step]) => [
      `<span class="muted" title="Drag to reorder">⋮⋮</span>`,
      `<span class="chip">${step}</span>`,
      `${IT[k].name}${IT[k].filler ? ' ' + H.chip('Filler', 'warn') : ''}`,
      H.chip(`${drop} · ${plant}`, drop === 1 ? 'now' : 'info'),
      H.seg(['Across', 'Lengthwise'], dir === 'across' ? 0 : 1),
      n, n === '4+' ? '1,332+' : n0(n * IT[k].bf)]),
    { foot: ['', '', 'Total', '', '', '88+', '38,750'] });

  // ---------- Loads › 3D Planner ----------
  S({
    id: 'loads-planner', dept: 'loads', title: '3D load planner', story: 3,
    intent: 'Fit the order to a truckload before it goes out. Bundles appear at their real size as they are added, the gauges show board feet, weight and floor live, and you drag bundles to set what goes on first. Each item can go across the trailer or lengthwise, whichever uses less floor. It suggests splitting, cutting or topping up with the plant\'s major sizes, then "Confirm load" locks the plan.',
    ref: 'Hand-off 4.2 · D11, D13, D14, D15, D16, D31',
    check: ['How do you stack bundles today: how many high, heavy at the bottom, sizes kept together?', 'Real trailer sizes and weight limits for each trailer type you use.', 'On a two-drop load, does the second plant always get the nose?', 'Who confirms a load: the office, the owner, or the subcontractor?'],
    assistant: ['Plan the load from the proposal ("fill this up for Concord, mostly major sizes")', 'Suggest a split or a top-up and show the result before you approve', 'Turn every item to its best direction'],
    dock: H.assistant([
      ['me', 'Fill this truck up for Concord, mostly their major sizes.'],
      ['ai', 'Weight runs out before board feet. 3 bundles of 3x3 × 37½" fit, then filler for the rest.'],
      ['propose', '+3 bundles 3x3 × 37½" (major size)<br>2x4 × 40" filler: as many as fit<br><span class="num">Weight → 44,850 lb (99.7%)</span>'],
    ]),
    html: () => plannerHead() +
      H.stages(D.stages, 1) +
      gauges() +
      `<div class="panel"><div class="hd"><h3>3D view</h3>${trailerPick()}</div><div class="bd">${iso3d()}
        <div class="btns small" style="justify-content:space-between"><span class="muted">Drag to turn, pinch or scroll to zoom. The live version works like the <a href="https://claude.ai/artifact/B8tH5FtyJjvUaC5yp4ws7R" target="_blank" rel="noopener">3D flatbed demo</a>.</span>
        <span class="btns">${H.btn('Angle', 'sm')}${H.btn('Side', 'sm')}${H.btn('Top', 'sm')}${H.btn('Doors end', 'sm')}</span></div></div></div>` +
      H.panel('Loading order · nose to doors', loadTable(), H.btn('Best direction for each', 'sm') + H.btn('Add item', 'sm', 'plus'), true) +
      `<div class="grid2" style="gap:12px">` +
      H.callout('warn', '<b>1,900 lb left before the weight limit.</b> Add 3 bundles of 3x3 × 37½" (a major size for Caldari Road), then fill the rest with 2x4 × 40" filler.', H.btn('Apply', 'sm')) +
      H.callout('info', '<b>Too much for one truck?</b> Split into 2 loads: the second becomes its own order (24-0318-B) shipping in 3 weeks or 1 month. Or cut items.', H.btn('Split', 'sm')) +
      H.callout('info', '<b>2x3 × 39" grooved goes lengthwise.</b> Across, it would use 9" more floor for the same 18 bundles.') +
      H.callout('', '<b>Filler: as many as fit.</b> The packing slip leaves the filler quantity blank, to be filled in at loading.') +
      `</div>` +
      H.panel('Top view', topView(), H.chip('Drop 1 nearest the doors', 'now')),
  });

  // ---------- dialog: confirm load ----------
  S({
    id: 'dlg-confirmload', dept: 'loads', tab: 'loads-planner', kind: 'dialog', title: 'Confirm load',
    intent: 'The "yes, this is the load" step. Confirming locks the plan and makes the packing slip, the bill of lading and the subcontractor job in one go, and records who confirmed it and when. (Proposed: it is used once the customer\'s PO is in; before that, the plan goes out as the proposal.)',
    ref: 'Hand-off 4.2 (Confirm) · D11',
    check: ['Is a load confirmed before or after the customer\'s PO arrives?', 'After confirming, who may still change it, and does the subcontractor get told automatically?'],
    assistant: ['List what will be created before you confirm', 'Warn if a gauge is over its limit'],
    under: () => plannerHead() + gauges(),
    html: () => H.dialog(`Confirm load ${st.load}`,
      H.callout('ok', `<b>All gauges are inside their limits.</b> Board feet 88%, weight 96%, floor 82%, axles balanced.`) +
      H.table(['', 'What happens', 'Result'], [
        [H.box(true), 'Lock the 3D plan and the loading order', 'Plan v3, locked'],
        [H.box(true), 'Make the packing slip (filler quantity left blank)', 'Packing slip for 24-0318'],
        [H.box(true), 'Make the bill of lading for the carrier', `${st.bol} · Trans-Ontario Freight`],
        [H.box(true), 'Make the job for the subcontractor', `${st.job} · Kessler Wood Works`],
        [H.box(false), 'Email the job to Kessler now', 'You can also send it from Production › Jobs'],
      ]) +
      `<div class="form">${H.field('Confirmed by', 'Sales desk', '', true)}${H.field('Date and time', 'Nov 19, 2026 · 3:42 pm', '', true)}${H.field('Ship date', 'Tue Nov 24, 2026')}</div>`,
      H.go('Back to the plan', 'loads-planner') + H.go('Send the proposal first', 'doc-proposal') + H.go('Confirm load', 'production-jobs', 'primary', 'check')),
  });

  // ---------- document: loading list ----------
  const llRows = [
    [1, 'Nose', '3x3 × 31"', 27, 'Across, 3 per row, 3 high', '2 · Jane Street'],
    [2, 'Rows 4–6', '2x3 × 39" grooved', 18, 'Lengthwise, 2 per row, 3 high', '1 · Caldari Road'],
    [3, 'Rows 7–9', '3x3 × 31"', 27, 'Across, 3 per row, 3 high', '1 · Caldari Road'],
    [4, 'Rows 10–11', '3x3 × 37½"', 12, 'Lengthwise, 2 per row, 3 high', '1 · Caldari Road'],
    [5, 'Doors', '2x4 × 40" filler', '<span class="blank"></span>', 'Lengthwise, as many as fit', '1 · Caldari Road'],
  ];
  S({
    id: 'doc-loadlist', dept: 'loads', tab: 'loads-planner', kind: 'document', title: 'Loading list', story: 8,
    intent: 'The step-by-step list for whoever loads the truck, printed from the same 3D plan: what goes on first (the nose) to last (the doors), which way each bundle faces, and which drop it belongs to. On a two-drop load the first drop is loaded last, nearest the doors.',
    ref: 'Hand-off 4.2, 8 · D8, D15, D31',
    check: ['Does the loader need a drawing on the list, or only the steps?', 'Should the list show bundle tags or counts per row?'],
    assistant: ['Email it to the subcontractor or the driver', 'Reprint it after a change to the plan'],
    under: () => plannerHead(),
    html: () => H.doc('Loading list · ' + st.load, H.letterhead('LOADING LIST', [['Load', st.load], ['Order', st.order], ['Ship date', 'Nov 24, 2026'], ['Trailer', '53\' dry van']]) +
      `<div class="cols"><div class="box2"><div class="k">Load at</div>Kessler Wood Works, Concord yard</div><div class="box2"><div class="k">Drop 1 (load last, at the doors)</div>Ardent Metals, Caldari Road plant, Concord ON</div><div class="box2"><div class="k">Drop 2 (load first, at the nose)</div>Ardent Metals, Jane Street plant, Vaughan ON</div></div>` +
      `<table><thead><tr><th>Step</th><th>Where</th><th>Item</th><th class="num">Bundles</th><th>How</th><th>Drop</th><th>Done</th></tr></thead><tbody>${llRows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>☐</td></tr>`).join('')}</tbody></table>` +
      `<div style="border:1px solid var(--paper-line);padding:8px">${topView({ s: 1.2 })}</div>` +
      `<div class="fine">Risers (4x4) under every bundle and every layer. Filler: load as many as fit and write the count on the packing slip.</div><div class="sig"><div>Loaded by</div><div>Bundles counted</div><div>Date and time</div></div>`),
  });

  // ---------- Loads › Schedule ----------
  const day = (d, items) => `<div class="panel" style="min-width:0"><div class="hd"><h3>${d}</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:8px">${items.map(([t, s, chip, kind]) => `<div style="border:1px solid var(--line);border-left:3px solid var(--${kind === 'now' ? 'crayon' : kind || 'line-2'});border-radius:var(--r);padding:8px 10px;font-size:12px"><b style="font-size:13px">${t}</b><div class="muted">${s}</div><div style="margin-top:4px">${chip}</div></div>`).join('') || '<div class="muted small">No loads</div>'}</div></div>`;
  S({
    id: 'loads-schedule', dept: 'loads', title: 'Load schedule',
    intent: 'Every load by ship date: delivered loads with their carrier, customer pickups, and the second half of split loads coming due (now + 3 weeks, or now + 1 month). It answers "what goes out this week, and what is coming". (Proposed layout.)',
    ref: 'Hand-off 4.1, 4.2, 9 · D16',
    check: ['How far ahead do you plan loads: one week, two?', 'Should pickups and delivered loads sit on the same calendar?', 'Do you want Jewish holidays and Shabbos marked when scheduling?'],
    assistant: ['"What ships next week?"', 'Remind you when a split load is coming due', 'Move a load to another day and tell the subcontractor and carrier'],
    html: () => H.head('Loads', 'Schedule', 'Week of Nov 23, 2026', H.seg(['Week', 'Month', 'List'], 0) + H.btn('‹') + H.btn('Today') + H.btn('›') + H.btn('Excel', '', 'xls')) +
      H.kpis([H.gauge('This week', '5 <small>loads</small>', null, '4 delivered · 1 pickup'), H.gauge('Board feet out', '186,400', null, 'Across 5 loads'), H.gauge('Split loads due', '2', null, 'In the next 30 days', 'warn'), H.gauge('Backup carrier', '1 of 4', null, 'Bluewater on Thursday')]) +
      `<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))">` +
      day('Mon Nov 23', [['L-2414 · Lakeshore', 'Toronto plant · pickup', H.chip('Pickup', 'info'), 'info']]) +
      day('Tue Nov 24', [[`${st.load} · Ardent`, 'Caldari Road + Jane Street', H.chip('Confirmed', 'ok') + ' ' + H.chip('2 drops'), 'now'], ['L-2416 · Ardent', 'Caldari Road · Trans-Ontario', H.chip('At subcontractor', 'info'), '']]) +
      day('Wed Nov 25', []) +
      day('Thu Nov 26', [['L-2419 · Garden State', 'Newark NJ · Bluewater (backup)', H.chip('US · broker', 'warn'), 'warn']]) +
      day('Fri Nov 27', [['L-2420 · Ardent', 'Caldari Road', H.chip('Proposal sent'), '']]) +
      `</div>` +
      H.panel('Coming up', H.table(['Ship date', 'Load', 'Customer · plant', 'Type', 'Status', ''], [
        ['Dec 14, 2026', 'L-2431', 'Ardent · Caldari Road', H.chip('Split from 24-0318', 'warn'), 'Order 24-0318-B · 3 weeks after', H.btn('Plan', 'sm')],
        ['Dec 21, 2026', 'L-2433', 'Garden State · Newark NJ', H.chip('Split from 24-0309', 'warn'), 'Order 24-0309-B · 1 month after', H.btn('Plan', 'sm')],
        ['Dec 3, 2026', 'L-2425', 'Lakeshore · Toronto', H.chip('Pickup', 'info'), 'Regular order, no load planning', H.btn('Open', 'sm')],
      ]), '', true),
  });

  // ---------- Loads › Bills of lading ----------
  const bolUnder = () => H.head('Loads', 'Bills of lading', '', '');
  S({
    id: 'loads-bol', dept: 'loads', title: 'Bills of lading',
    intent: 'One bill of lading per load, for the carrier. It is made when the load is confirmed, printed or emailed to the carrier, and the signed copy is attached when it comes back. US loads also carry the customs broker\'s details.',
    ref: 'Hand-off 4.6, 7, 8 · D8, D26',
    check: ['Do you use your own BOL form or the carrier\'s?', 'Which papers go with a US load besides the BOL?', 'Who keeps the signed copy today?'],
    assistant: ['Email the BOL to the carrier', 'Find loads still missing a signed BOL'],
    html: () => H.head('Loads', 'Bills of lading', '', H.btn('Excel', '', 'xls')) +
      H.panel('', H.filters(['*All', 'Draft', 'Sent to carrier', 'Signed', 'US loads']) + H.table(['BOL', 'Load', 'Ship date', 'Consignee', 'Carrier', { t: 'Bundles', num: true }, { t: 'Weight lb', num: true }, 'Status', ''], [
        [`<a href="#doc-bol">${st.bol}</a>`, st.load, 'Nov 24', 'Ardent · Caldari Road + Jane Street', 'Trans-Ontario Freight', '88+', '43,100', H.chip('Ready', 'info'), H.go('Open', 'doc-bol', 'sm')],
        ['BOL-2419', 'L-2419', 'Nov 26', 'Garden State · Newark NJ', 'Bluewater Carriers', 96, '44,200', H.chip('Needs broker', 'warn'), H.btn('Open', 'sm')],
        ['BOL-2416', 'L-2416', 'Nov 24', 'Ardent · Caldari Road', 'Trans-Ontario Freight', 92, '42,700', H.chip('Sent to carrier'), H.btn('Open', 'sm')],
        ['BOL-2411', 'L-2411', 'Nov 17', 'Ardent · Caldari Road', 'Trans-Ontario Freight', 90, '43,900', H.chip('Signed', 'ok'), H.btn('Open', 'sm')],
        ['BOL-2408', 'L-2408', 'Nov 12', 'Garden State · Newark NJ', 'Liberty Line (US)', 94, '44,800', H.chip('Signed', 'ok'), H.btn('Open', 'sm')],
      ], { sel: 0 }), '', true),
  });

  // ---------- document: BOL ----------
  S({
    id: 'doc-bol', dept: 'loads', tab: 'loads-bol', kind: 'document', title: 'Bill of lading', story: 8,
    intent: 'The carrier\'s paper for the load: shipper, consignees in drop order, what is on the truck and its weight, and signatures at pickup and delivery. It is made from the confirmed plan, so the bundle counts and weight match. On US loads the customs broker block is filled in.',
    ref: 'Hand-off 4.6, 7 · D8, D26',
    check: ['Which freight description do you use for dunnage (e.g. "wood dunnage, untreated")?', 'Does a two-drop load get one BOL with two stops, or one BOL per stop?', 'Which customs broker do you use for US loads?'],
    assistant: ['Email it to the carrier from your mailbox', 'Fill the broker block from the US plant\'s record'],
    under: bolUnder,
    html: () => H.doc('Bill of lading · ' + st.bol, H.letterhead('STRAIGHT BILL OF LADING', [['BOL', st.bol], ['Load', st.load], ['Order', st.order], ['Date', 'Nov 24, 2026'], ['Not negotiable', '']]) +
      `<div class="cols"><div class="box2"><div class="k">Shipper · pick up at</div>BB Pallets c/o Kessler Wood Works<br>Concord yard, Concord ON</div><div class="box2"><div class="k">Carrier</div>Trans-Ontario Freight<br>Trailer 53' dry van · # ________ · Seal # ________</div><div class="box2"><div class="k">Freight terms</div>Prepaid · bill to BB Pallets</div></div>` +
      `<div class="cols"><div class="box2"><div class="k">Stop 1 · consignee</div>Ardent Metals, Caldari Road plant<br>Concord ON · Receiving: Dana Ferreira</div><div class="box2"><div class="k">Stop 2 · consignee</div>Ardent Metals, Jane Street plant<br>Vaughan ON · same buyer</div></div>` +
      `<table><thead><tr><th>Stop</th><th class="num">Bundles</th><th>Description</th><th class="num">Weight lb</th></tr></thead><tbody>
        <tr><td>1</td><td class="num">61+</td><td>Wood dunnage, untreated softwood (3x3, 2x3 grooved, 2x4 filler)</td><td class="num">30,200</td></tr>
        <tr><td>2</td><td class="num">27</td><td>Wood dunnage, untreated softwood (3x3)</td><td class="num">12,900</td></tr>
        <tr><td></td><td class="num"><b>88+</b></td><td><b>Total</b></td><td class="num"><b>43,100</b></td></tr></tbody></table>` +
      `<div class="box2" style="opacity:.55"><div class="k">US loads only · customs broker</div>Broker: ______________ · PARS / entry #: ______________ · Commercial invoice attached ☐</div>` +
      `<div class="fine">Received, subject to the classifications and tariffs in effect on the date of issue, the property described above in apparent good order.</div>` +
      `<div class="sig"><div>Shipper signature · date</div><div>Driver signature · date</div><div>Consignee stop 1 · date</div><div>Consignee stop 2 · date</div></div>`, false),
  });

  // ---------- Production › Jobs ----------
  const jobsUnder = () => H.head('Production', 'Jobs', '', '');
  S({
    id: 'production-jobs', dept: 'production', title: 'Subcontractor jobs', story: 7,
    intent: 'Each order becomes a job for the chosen subcontractor: the items, quantities, fillers and packing slip, emailed from here. After loading, the real quantities come back (by phone or email today) and the office types them in, which updates the order before invoicing.',
    ref: 'Hand-off 4.6 · D7, D25',
    check: ['How many subcontractors do you use, and which does what?', 'What does the subcontractor need on the job: cut list, stock lengths to use, loading order?', 'How soon after loading do you get the real quantities?'],
    assistant: ['Draft and email the job to the subcontractor', '"Which jobs are loaded but have no quantities back?"', 'Type in quantities from a phone call you dictate'],
    html: () => H.head('Production', 'Jobs', 'By subcontractor', H.btn('New job', '', 'plus') + H.btn('Excel', '', 'xls')) +
      H.stages(D.stages, 3) +
      `<div class="split">` +
      H.panel('', H.filters(['*Open', 'Emailed', 'Cutting', 'Loaded, no quantities', 'Done']) + H.table(['Job', 'Order · plant', 'Subcontractor', 'Ship', 'Status', ''], [
        [`<b class="nowrap">${st.job}</b>`, `${st.order} · Caldari Rd + Jane St`, 'Kessler Wood Works', '<span class=\"nowrap\">Nov 24</span>', H.chip('Ready to email', 'now'), H.go('Job sheet', 'doc-jobsheet', 'sm')],
        ['<span class=\"nowrap\">J-1181</span>', '24-0316 · Caldari Road', 'Kessler Wood Works', '<span class=\"nowrap\">Nov 24</span>', H.chip('Cutting', 'info'), H.btn('Open', 'sm')],
        ['<span class=\"nowrap\">J-1179</span>', '24-0311 · Caldari Road', 'Kessler Wood Works', '<span class=\"nowrap\">Nov 17</span>', H.chip('Loaded, no quantities', 'warn'), H.go('Enter quantities', 'dlg-loaded', 'sm')],
        ['<span class=\"nowrap\">J-1180</span>', '24-0314 · Newark NJ', 'Pinegrove Pallet', '<span class=\"nowrap\">Nov 26</span>', H.chip('Emailed', 'info'), H.btn('Open', 'sm')],
        ['<span class=\"nowrap\">J-1175</span>', '24-0305 · Toronto (pickup)', 'Kessler Wood Works', '<span class=\"nowrap\">Nov 12</span>', H.chip('Done', 'ok'), H.btn('Open', 'sm')],
      ], { sel: 0 }), '', true) +
      H.panel(`${st.job} · ${st.order}`, H.form([H.field('Subcontractor', 'Kessler Wood Works ▾'), H.field('Ship date', 'Tue Nov 24, 2026'), H.field('Load', `${st.load} · 53' dry van`, '', true), H.field('Packing slip', 'Filler line blank', '', true)]) +
        `<div style="margin-top:14px">${H.table(['Item', { t: 'Bundles', num: true }, 'From stock'], [['3x3 × 31"', 54, '3x3 × 10\' (3 pcs)'], ['2x3 × 39" grooved', 18, '2x3 × 10\' (3 pcs) · groove'], ['3x3 × 37½"', 12, '3x3 × 12\' (3 pcs)'], ['2x4 × 40" filler', 'Fill', '2x4 × 10\' (3 pcs)']])}</div>` +
        `<div class="btns" style="margin-top:14px">${H.go('Job sheet', 'doc-jobsheet', '', 'pdf')}${H.go('Packing slip', 'doc-packing', '', 'pdf')}${H.go('Email to Kessler', 'dlg-email', 'primary', 'mail')}</div>` +
        `<div class="small muted" style="margin-top:12px">Emails are logged here and on the order.</div>`) +
      `</div>`,
  });

  // ---------- document: job sheet ----------
  S({
    id: 'doc-jobsheet', dept: 'production', tab: 'production-jobs', kind: 'document', title: 'Subcontractor job sheet', story: 7,
    intent: 'What the subcontractor needs to cut, groove and load: the items and bundles, which stock lengths to cut them from, the fillers, the ship date and the loading order. It replaces the order the office used to type up and send. (Layout proposed until we see theirs.)',
    ref: 'Hand-off 4.6, 8 · D7, D8',
    check: ['Can we see a job sheet as you send it today?', 'Should the sheet say which stock lengths to cut from, or leave it to the subcontractor?'],
    assistant: ['Email the job sheet with the packing slip and loading list attached', 'Translate the notes for the subcontractor if needed'],
    under: jobsUnder,
    html: () => H.doc('Job sheet · ' + st.job, H.letterhead('JOB SHEET', [['Job', st.job], ['Order', st.order], ['Load', st.load], ['Ship date', 'Nov 24, 2026']]) +
      `<div class="cols"><div class="box2"><div class="k">To</div>Kessler Wood Works<br>Concord yard</div><div class="box2"><div class="k">Ship to</div>Ardent Metals · Caldari Road plant (drop 1)<br>Ardent Metals · Jane Street plant (drop 2)</div><div class="box2"><div class="k">Trailer · carrier</div>53' dry van · Trans-Ontario Freight<br>Pickup Nov 24, 7:00 am</div></div>` +
      `<table><thead><tr><th>Item</th><th class="num">Pieces / bundle</th><th class="num">Bundles</th><th>Cut from</th><th>Extra work</th></tr></thead><tbody>
        <tr><td>3x3 × 31"</td><td class="num">140</td><td class="num">54</td><td>3x3 × 10' (3 pcs, 7" waste)</td><td></td></tr>
        <tr><td>2x3 × 39" grooved</td><td class="num">210</td><td class="num">18</td><td>2x3 × 10' (3 pcs, 3" waste)</td><td>Groove</td></tr>
        <tr><td>3x3 × 37½"</td><td class="num">140</td><td class="num">12</td><td>3x3 × 12' (3 pcs, 31½" left)</td><td></td></tr>
        <tr><td>2x4 × 40" filler</td><td class="num">150</td><td class="num">As many as fit</td><td>2x4 × 10' (3 pcs)</td><td>Count at loading</td></tr></tbody></table>` +
      `<div class="fine">Load in the order on the attached loading list: Jane Street bundles at the nose, Caldari Road at the doors. Call or email the loaded quantities (fillers especially) to the office the same day.</div><div class="sig"><div>Received by</div><div>Date</div></div>`, false),
  });

  // ---------- document: packing slip ----------
  S({
    id: 'doc-packing', dept: 'production', tab: 'production-jobs', kind: 'document', title: 'Packing slip',
    intent: 'Goes with the load. It lists what was ordered, with the filler line quantity left blank, to be filled in at loading ("add as many as fit"). The filled-in slip is where the real quantities come from.',
    ref: 'Hand-off 4.2, 4.6, 8 · D8',
    check: ['Is the blank filler line how you do it today, or is it written on the BOL?', 'One packing slip per drop, or one per load?'],
    assistant: ['Email it to the subcontractor or the driver', 'Read a photo of the filled-in slip and enter the quantities (proposed)'],
    under: jobsUnder,
    html: () => H.doc('Packing slip · ' + st.order, H.letterhead('PACKING SLIP', [['Order', st.order], ['Customer PO', st.po], ['Load', st.load], ['Ship date', 'Nov 24, 2026']]) +
      `<div class="cols"><div class="box2"><div class="k">Ship to (drop 1)</div>Ardent Metals, Caldari Road plant<br>Concord ON</div><div class="box2"><div class="k">Ship to (drop 2)</div>Ardent Metals, Jane Street plant<br>Vaughan ON</div></div>` +
      `<table><thead><tr><th>Item</th><th>Drop</th><th class="num">Bundles ordered</th><th class="num">Pieces</th><th class="num">Bundles loaded</th></tr></thead><tbody>
        <tr><td>3x3 × 31"</td><td>2</td><td class="num">27</td><td class="num">3,780</td><td class="num"><span class="blank"></span></td></tr>
        <tr><td>2x3 × 39" grooved</td><td>1</td><td class="num">18</td><td class="num">3,780</td><td class="num"><span class="blank"></span></td></tr>
        <tr><td>3x3 × 31"</td><td>1</td><td class="num">27</td><td class="num">3,780</td><td class="num"><span class="blank"></span></td></tr>
        <tr><td>3x3 × 37½"</td><td>1</td><td class="num">12</td><td class="num">1,680</td><td class="num"><span class="blank"></span></td></tr>
        <tr><td><b>2x4 × 40" filler · as many as fit</b></td><td>1</td><td class="num">Fill</td><td class="num"><span class="blank"></span></td><td class="num"><span class="blank"></span></td></tr></tbody></table>` +
      `<div class="sig"><div>Loaded by</div><div>Driver</div><div>Received by</div></div>`, false),
  });

  // ---------- dialog: loaded quantities back ----------
  S({
    id: 'dlg-loaded', dept: 'production', tab: 'production-jobs', kind: 'dialog', title: 'Loaded quantities back', story: 9,
    intent: 'After loading, the subcontractor phones or emails what actually went on the truck, and the office types it in here. Differences from the order show at once, the filler count is filled in, and "Update order" makes the invoice from the real quantities. Inventory books the shipped board feet with 5% waste.',
    ref: 'Hand-off 4.5, 4.6 · D25',
    check: ['Do quantities come back per bundle or per piece?', 'If the load differs from the PO, does the customer need to approve before invoicing?'],
    assistant: ['Read the subcontractor\'s email and fill in the quantities for you to check', 'Flag a difference bigger than one bundle'],
    under: jobsUnder,
    html: () => H.dialog(`Loaded quantities · ${st.job} · ${st.order}`,
      `<div class="btns"><span class="muted small">Reported by</span>${H.seg(['Phone', 'Email', 'Packing slip'], 0)}<span class="muted small">Nov 24, 2026 · 11:20 am · Kessler Wood Works</span></div>` +
      H.table(['Item', 'Drop', { t: 'Ordered', num: true }, { t: 'Loaded', num: true }, { t: 'Difference', num: true }, { t: 'Bd ft', num: true }], [
        ['3x3 × 31"', '2', 27, '<span class="input" style="display:inline-flex;min-width:60px;justify-content:flex-end">27</span>', H.chip('0', 'ok'), '7,317'],
        ['2x3 × 39" grooved', '1', 18, '<span class="input" style="display:inline-flex;min-width:60px;justify-content:flex-end">18</span>', H.chip('0', 'ok'), '6,138'],
        ['3x3 × 31"', '1', 27, '<span class="input" style="display:inline-flex;min-width:60px;justify-content:flex-end">26</span>', H.chip('−1', 'warn'), '7,046'],
        ['3x3 × 37½"', '1', 12, '<span class="input" style="display:inline-flex;min-width:60px;justify-content:flex-end">12</span>', H.chip('0', 'ok'), '3,936'],
        ['2x4 × 40" filler', '1', 'Fill', '<span class="input" style="display:inline-flex;min-width:60px;justify-content:flex-end;border-color:var(--brand)">5</span>', H.chip('Filled in', 'info'), '1,665'],
      ], { cls: ['', '', 'diff', '', ''], foot: ['Total', '', '84+', '88', '', '26,102'] }) +
      H.callout('warn', '<b>One bundle of 3x3 × 31" short for Caldari Road.</b> The order and invoice use the loaded quantity. Add a note for the customer?') +
      H.callout('info', 'Inventory: 26,102 bd ft shipped is booked as 27,407 bd ft out (5% waste added at shipping).'),
      H.btn('Cancel') + H.btn('Save draft') + H.go('Update order for invoicing', 'doc-invoice', 'primary', 'check'), true),
  });

  // ---------- Production › Subcontractors ----------
  const subCard = (s, i) => H.panel(s.name, `<div class="btns" style="margin-bottom:10px">${s.does.split(' · ').map(x => H.chip(x, 'brand')).join('')}${H.chip(s.yard)}</div>` +
    H.table(['Rate card', { t: 'Rate', num: true }], i === 0
      ? [['Wood coming in', '$135.00 / MBF'], ['Grooving', '$18.00 / MBF'], ['Extra cutting (short lengths)', '$9.00 / MBF'], ['Loading', 'Included']]
      : [['Wood coming in', '$135.00 / MBF'], ['Pallet assembly', '$4.50 / pallet'], ['Heat treatment', 'Not offered']]) +
    `<div class="form" style="margin-top:12px">${H.field('Contact', i === 0 ? 'Joe Kessler · 905-555-0144' : 'Anna Pinegrove · 905-555-0178', '', true)}${H.field('Email', i === 0 ? 'jobs@kessler-example.ca' : 'office@pinegrove-example.ca', '', true)}</div>` +
    `<div class="kpis" style="margin-top:12px">${H.gauge('Open jobs', String(s.jobs))}${H.gauge('Processed Nov', i === 0 ? '612 <small>MBF</small>' : '88 <small>MBF</small>')}${H.gauge('To pay Nov', i === 0 ? '$86,940' : '$13,300')}</div>`,
    H.btn('Edit', 'sm') + H.go('Email', 'dlg-email', 'sm'));
  S({
    id: 'production-subs', dept: 'production', title: 'Subcontractors',
    intent: 'Each subcontractor with what they do (cut, groove, pallets), their yard, contacts and rate card, their open jobs, and what BB Pallets owes them for wood processed. Their pay is per MBF of wood coming in plus extras. Their own wood is not tracked in Timberline.',
    ref: 'Hand-off 4.6, 6 · D7, D24, D25',
    check: ['How is each subcontractor paid: per MBF in, per piece, per load, plus which extras?', 'Do you pay per job or once a month?', 'Should a subcontractor ever log in, or is email enough?'],
    assistant: ['"How much do we owe Kessler for November?"', 'Compare cost per MBF between subcontractors'],
    html: () => H.head('Production', 'Subcontractors', '', H.btn('Add subcontractor', '', 'plus')) +
      H.callout('info', '<b>Their own wood is not tracked.</b> Only BB Pallets\' wood in their yard is counted (D24). Count sheets remind counters to leave the subcontractor\'s pile out.') +
      `<div class="grid2">${D.subs.map(subCard).join('')}</div>` +
      H.panel('Payments due', H.table(['Subcontractor', 'Period', { t: 'MBF in', num: true }, { t: 'Base', num: true }, { t: 'Extras', num: true }, { t: 'Total', num: true }, ''], [
        ['Kessler Wood Works', 'Nov 1–30', '612.0', '$82,620', '$4,320', '$86,940', H.btn('Statement', 'sm', 'pdf')],
        ['Pinegrove Pallet', 'Nov 1–30', '88.0', '$11,880', '$1,420', '$13,300', H.btn('Statement', 'sm', 'pdf')],
      ]), '', true),
  });
})();
