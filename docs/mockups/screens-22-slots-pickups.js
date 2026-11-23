/* Loads › Slot plan: how he plans a 53' van in his own terms (voice notes 14–16, 2026-11-23).
   Bundles sit on a 48" × 48" footprint: 13 rows along a 53' van, 2 across, 2 high = 52 bundles.
   Shorter (40") bundles give back inches; enough of them make room for another row of 4.
   The customer is trained to order 52; one variable item takes whatever room is left (52 → 56).
   The truck loads at two places, so the first loader must leave exact room for the second.
   Plus the loading list per pickup stop. Names are made up; the counts are his. */
(function () {
  const TL = 636, TW = 102, PER_ROW = 4; // 53' van; 2 across × 2 high
  const SPF = D.species[0], LO = SPF.avg - SPF.var, HI = SPF.avg + SPF.var;
  // items on the example load; L = bundle length along the truck; pcs = the customer's bundle count (D62)
  const IT = {
    A: { name: '4x4 × 48"', L: 48, pcs: 80, bfPc: 5.3333, fill: 'var(--wood-1)', stop: 1 },
    B: { name: '3x4 × 48"', L: 48, pcs: 96, bfPc: 4, fill: 'var(--wood-2)', stop: 1 },
    C: { name: '4x6 × 40"', L: 40, pcs: 48, bfPc: 6.6667, fill: 'var(--wood-3)', stop: 1 },
    E: { name: '3x3 × 40"', L: 40, pcs: 120, bfPc: 2.5, fill: 'var(--wood-2)', stop: 1 },
    V: { name: '2x4 × 48" (variable)', L: 48, pcs: 168, bfPc: 2.6667, fill: 'var(--wood-4)', stop: 1, variable: true },
    S: { name: '6x6 × 48"', L: 48, pcs: 32, bfPc: 12, fill: 'var(--wood-3)', stop: 2 },
  };
  // loading order, nose to doors: [item, bundles ordered, bundles planned]
  const LINES = [['A', 12, 12], ['B', 8, 8], ['C', 12, 12], ['E', 8, 8], ['V', 4, 8], ['S', 8, 8]];
  const bfB = k => IT[k].pcs * IT[k].bfPc;
  const rows = LINES.map(([k, , n]) => ({ k, n, rows: Math.ceil(n / PER_ROW), len: Math.ceil(n / PER_ROW) * IT[k].L }));
  const ORDERED = LINES.reduce((a, l) => a + l[1], 0), PLANNED = LINES.reduce((a, l) => a + l[2], 0);
  const USED = rows.reduce((a, r) => a + r.len, 0);
  const STOP1 = rows.filter(r => IT[r.k].stop === 1).reduce((a, r) => a + r.len, 0);
  const STOP2 = USED - STOP1, LEAVE = TL - STOP1;
  const BF = LINES.reduce((a, [k, , n]) => a + n * bfB(k), 0), LB = BF * SPF.avg;
  const short = LINES.filter(([k]) => IT[k].L === 40).reduce((a, l) => a + l[2], 0);
  const ftin = inch => `${Math.floor(inch / 12)}' ${inch % 12 ? (inch % 12) + '"' : ''}`.trim();

  // top view, to scale: each row is 2 bundles across (2 high), labelled with its bundle count
  function slotView(s = 0.95) {
    const w = TL * s, h = TW * s; let x = 0; const out = [];
    rows.forEach(r => {
      const it = IT[r.k];
      for (let i = 0; i < r.rows; i++) {
        const inRow = Math.min(PER_ROW, r.n - i * PER_ROW);
        [0, 1].forEach(side => out.push(`<rect x="${(x * s).toFixed(1)}" y="${((3 + side * 48) * s).toFixed(1)}" width="${(it.L * s).toFixed(1)}" height="${(48 * s).toFixed(1)}" fill="${it.fill}" stroke="${it.stop === 2 ? 'var(--info)' : 'rgba(50,30,10,.55)'}" stroke-width="${it.stop === 2 ? 2 : 1}" ${it.variable ? 'stroke-dasharray="4 3"' : ''}/>`));
        out.push(`<text x="${((x + it.L / 2) * s).toFixed(1)}" y="${(h / 2 + 4).toFixed(1)}" text-anchor="middle" style="font:700 11px var(--f-num);fill:var(--wood-ink)">${inRow}</text>`);
        x += it.L;
      }
    });
    const st1 = STOP1 * s;
    return `<div style="overflow-x:auto"><svg viewBox="-6 -40 ${w + 12} ${h + 66}" style="min-width:560px;width:100%;height:auto;display:block" role="img" aria-label="Top view of the 53 foot van in 48 inch slots, two pickup stops">
      <rect x="0" y="0" width="${w}" height="${h}" rx="3" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="2"/>
      ${out.join('')}
      <line x1="${st1}" x2="${st1}" y1="-16" y2="${h + 4}" stroke="var(--info)" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="${st1 / 2}" y="-22" text-anchor="middle" style="font:700 11px var(--f-body);fill:var(--fg)">Stop 1 · Kessler, Concord · ${STOP1}" (${ftin(STOP1)})</text>
      <text x="${st1 + (TL * s - st1) / 2}" y="-22" text-anchor="middle" style="font:700 11px var(--f-body);fill:var(--info)">Stop 2 · leave ${ftin(LEAVE)}</text>
      <text x="0" y="${h + 18}" style="font:11px var(--f-body);fill:var(--muted)">Nose (first on)</text>
      <text x="${w}" y="${h + 18}" text-anchor="end" style="font:11px var(--f-body);fill:var(--muted)">Doors (last on) · 53' × 102" to scale · numbers = bundles in the row (2 across × 2 high)</text>
    </svg></div>`;
  }

  const head = () => H.head('Load L-2421 · Proposal P-24-0322 · Mohawk Valley Steel · ' + H.chip('Rev 1', 'brand'), 'Rome, NY: mixed load, two pickups',
    'All cut to size. The customer orders 52 bundles; the variable item fills what is left. Loaded at Kessler (Concord), then Pinegrove (Bolton).',
    H.seg(['Mixed load', 'Straight load'], 0) + H.go('Loading list per stop', 'doc-loadlist-stops', '', 'print') + H.go('Open in 3D', 'loads-planner', '', 'loads') + H.btn('Confirm load', 'primary', 'check'));

  const gauges = () => H.kpis([
    H.gauge('Slots (48" × 48")', `${PLANNED} <small>/ 52 standard</small>`, PLANNED / 56 * 100, `13 rows × 2 across × 2 high = 52. ${short} bundles are 40": they give back ${short / PER_ROW * 8}", room for one more row of 4.`, 'ok'),
    H.gauge('Floor', `${ftin(USED)} <small>/ 53'</small>`, USED / TL * 100, `${TL - USED}" spare · packed tight (D33)`, 'ok'),
    H.gauge('Weight · planned on average', `${n0(LB)} <small>/ 45,000 lb</small>`, LB / 450, `light ${n0(BF * LO)} · heavy ${n0(BF * HI)}${BF * HI > 45000 ? ' · over if the wood is heavy' : ' · under even on the heavy side'}`, BF * HI > 45000 ? 'warn' : 'ok'),
    H.gauge('Board feet', n0(BF), null, 'A planning figure, not a limit (D43)'),
  ]);

  const lineTable = () => H.table(['#', 'Item', 'Pickup', { t: 'Bundle', num: true }, { t: 'Pcs / bundle', num: true }, { t: 'Ordered', num: true }, { t: 'Planned', num: true }, { t: 'Rows', num: true }, { t: 'Along the truck', num: true }],
    rows.map((r, i) => {
      const it = IT[r.k], l = LINES[i];
      return [`<span class="chip">${i + 1}</span>`, `${it.name}${it.variable ? ' ' + H.chip('Variable', 'warn') : ''}`,
        H.chip(it.stop === 1 ? '1 · Kessler' : '2 · Pinegrove', it.stop === 1 ? 'now' : 'info'),
        `${it.L}" × 48"`, `${it.pcs} <span class="small muted">exact</span>`, l[1], it.variable ? `<b>${l[2]}</b> <span class="small muted">+${l[2] - l[1]}</span>` : l[2], r.rows, `${r.len}"`];
    }), { foot: ['', 'Total', '', '', '', ORDERED, PLANNED, rows.reduce((a, r) => a + r.rows, 0), `${USED}" of ${TL}"`] });

  S({
    id: 'loads-slots', dept: 'loads', title: 'Slot plan: two pickups',
    intent: 'How he plans a van in his own terms (notes 14–16). Bundles sit on a 48" × 48" footprint, so a 53\' van holds 13 rows along, 2 across, 2 high: <b>52 bundles</b>. Bundles that are only 40" long give back 8" each row; 20 of them make room for 4 more. This customer is trained to order 52 (D66); one <b>variable item</b> takes whatever room is left, so the truck can leave with 56. The load is picked up at <b>two places</b> (D67): the first loader puts on its items and the variable item, and has to leave exactly enough room at the doors for the second place\'s bundles, so the variable count is decided here, before the truck leaves, not at loading. Every bundle is the customer\'s own count for that item (D62).',
    ref: 'Voice notes 14–16 (2026-11-23) · D62–D67 · D13, D15, D33, D43, D45',
    check: ['Are all your bundles on a 48" × 48" footprint, or only this customer\'s?', 'Is it always 2 across and 2 high in a van? Do you ever stack 3 high?', 'Where are the two pickup places for this customer, and which one loads first?', 'Who decides how many of the variable item go on: you, or the first loader on the day?', 'Are the 52 bundles a rule of yours for every customer, or only one you taught this customer?'],
    assistant: ['"How many of the variable item fit?" from the order', 'Tell the first loader how much room to leave for the second stop', 'Warn when the second stop\'s bundles would not fit after a change'],
    dock: H.assistant([
      ['me', 'How many of the 2x4 × 48 can go on for Rome?'],
      ['ai', `${short} of the bundles are 40", so the 52 bundles use ${ftin(USED - 48)} of 53'. One more row of 4 fits: 8 of the variable item instead of 4, 56 bundles in all. Kessler has to stay within ${ftin(STOP1)} and leave ${ftin(LEAVE)} at the doors for Pinegrove's 8 bundles.`],
      ['propose', `Variable item 2x4 × 48": 4 → <b>8</b> bundles<br><span class="small">56 bundles · ${n0(LB)} lb on average · heavy side ${n0(BF * HI)} lb, still under 45,000</span>`],
    ]),
    html: () => head() + H.stages(D.stages, 1) + gauges() +
      H.panel('Slots · top view · Rev 1', slotView(), H.chip('2 pickups · 1 drop', 'info')) +
      H.panel('Lines · loading order, nose to doors', lineTable(), H.btn('Add item', 'sm', 'plus'), true) +
      `<div class="grid2" style="gap:12px">` +
      H.callout('ok', `<b>Room for 4 more of the variable item.</b> 52 bundles at 48" would use 13 rows (624"). ${short} bundles here are 40", which gives back ${short / PER_ROW * 8}": one more row of 4 fits, with ${TL - USED}" to spare. The truck goes out with <b>${PLANNED}</b> instead of 52.`, H.btn('Applied', 'sm')) +
      H.callout('info', `<b>Two pickups: stop 1 must leave ${ftin(LEAVE)} at the doors.</b> Kessler loads ${rows.filter(r => IT[r.k].stop === 1).reduce((a, r) => a + r.n, 0)} bundles, the variable item included, within the first ${ftin(STOP1)}. Pinegrove then loads its 8 bundles of 6x6 × 48" at the doors (${STOP2}"). Each stop gets its own loading list.`) +
      H.callout('', '<b>The customer\'s bundles.</b> Every item goes in the customer\'s own count (4x4 × 48": 80 pieces, every time). A short bundle from the supplier is not sent as it is: it is made up or flagged first, because he counts his yard by bundles (D62).', H.go('Plant settings', 'dlg-plant', 'sm')) +
      H.callout('warn', '<b>Straight load of one item:</b> 52 bundles of 4x4 × 48" fit the slots, but weigh 42,200 lb on average and 46,600 lb on the heavy side. On the heavy side only 50 fit: weight runs out before slots (D13).') +
      `</div>`,
  });

  // ---------- document: loading list per pickup stop ----------
  const stopTable = stop => `<table><thead><tr><th>Step</th><th>Where</th><th>Item</th><th class="num">Bundles</th><th class="num">Pcs / bundle</th><th>How</th><th>Done</th></tr></thead><tbody>${
    (() => { let x = 0; return rows.map((r, i) => { const from = x; x += r.len; return { r, i, from, to: x }; }); })()
      .filter(o => IT[o.r.k].stop === stop)
      .map(o => `<tr><td><b>${o.i + 1}</b></td><td>${ftin(o.from) || "0'"} to ${ftin(o.to)}</td><td>${IT[o.r.k].name}</td><td class="num">${o.r.n}</td><td class="num">${IT[o.r.k].pcs}</td><td>${o.r.rows} row${o.r.rows > 1 ? 's' : ''}, 2 across, 2 high</td><td>☐</td></tr>`).join('')}</tbody></table>`;
  S({
    id: 'doc-loadlist-stops', dept: 'loads', tab: 'loads-slots', kind: 'document', title: 'Loading list per pickup stop',
    intent: 'When a truck loads at two places, each place gets its own part of the list from the same plan revision. The first stop sees its rows from the nose, the variable item with its count already decided, and in large print how much room it must leave at the doors. The second stop sees what is already on the truck and where its bundles go. Both show the customer\'s pieces per bundle, which must be exact.',
    ref: 'Voice note 16 · D62, D66, D67 · D8, D41',
    check: ['Does the second place need the first stop\'s list too, or only its own part?', 'If the first stop runs out of room, who calls whom?'],
    assistant: ['Email each stop its own part of the list', 'After the first stop reports, tell the second stop what is on the truck'],
    under: () => head(),
    html: () => H.doc('Loading list · L-2421 · two pickups', H.letterhead('LOADING LIST', [['Load', 'L-2421'], ['Revision', 'Rev 1'], ['Order', '24-0322'], ['Ship date', 'Dec 1, 2026'], ['Trailer', '53\' dry van']]) +
      `<div class="cols"><div class="box2"><div class="k">Stop 1 (loads first, from the nose)</div>Kessler Wood Works, Concord yard</div><div class="box2"><div class="k">Stop 2 (loads last, at the doors)</div>Pinegrove Pallet, Bolton yard</div><div class="box2"><div class="k">Deliver to</div>Mohawk Valley Steel, Rome plant, Rome NY</div></div>` +
      `<h3 style="margin:14px 0 6px">Stop 1 · Kessler Wood Works</h3>` + stopTable(1) +
      `<div class="box2" style="margin-top:8px;border-color:var(--info)"><div class="k">Leave room for stop 2</div><b style="font-size:16px">Stay within the first ${ftin(STOP1)}. Leave ${ftin(LEAVE)} clear at the doors</b> for 8 bundles of 6x6 × 48" (2 rows). The variable item is <b>8 bundles</b>, decided on the plan: do not add more.</div>` +
      `<h3 style="margin:14px 0 6px">Stop 2 · Pinegrove Pallet</h3>` + stopTable(2) +
      `<div class="box2" style="margin-top:8px"><div class="k">Already on the truck</div>${PLANNED - 8} bundles from Kessler, up to ${ftin(STOP1)} from the nose.</div>` +
      `<div style="border:1px solid var(--paper-line);padding:8px;margin-top:10px">${slotView(1.2)}</div>` +
      `<div class="fine">Every bundle in the customer's count (pieces per bundle above). A short bundle is made up or reported before loading, never sent short. Risers under every bundle; fork openings to the back doors.</div><div class="sig"><div>Stop 1 loaded by</div><div>Stop 2 loaded by</div><div>Bundles on the truck</div></div>`),
  });
})();
