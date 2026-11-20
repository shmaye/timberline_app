/* Workflow: the whole process as one clickable diagram. Each box opens its window. */
(function () {
  const W = 168, Hh = 54;
  const lanes = [
    ['Customer', 20, 100], ['Sales & office', 130, 190], ['Buying & stock', 330, 110], ['Subcontractor', 450, 100], ['Carrier', 560, 100],
  ];
  // id, label, sub, x, y, link, story?
  const N = [
    ['need', 'Needs sheet', 'what they will need', 40, 42, 'orders-incoming', 1],
    ['cpo', 'Official PO', 'matches the proposal', 592, 42, 'orders-orders', 5],
    ['recv', 'Receives the load', '', 1144, 42, 'loads-schedule'],
    ['pay', 'Pays the invoice', 'statements, reminders', 1328, 42, 'customers-statements'],
    ['imp', 'Import & rework', 'into our load worksheet', 40, 152, 'orders-incoming', 1],
    ['prop', 'Proposal', '% of a truck, order no.', 224, 152, 'orders-proposals', 2],
    ['plan', '3D load plan', 'split, cut or top up', 408, 152, 'loads-planner', 3],
    ['send', 'Email proposal', 'PDF + Excel', 408, 232, 'doc-proposal', 4],
    ['ord', 'Match PO → order', 'flag differences', 592, 152, 'orders-orders', 5],
    ['book', 'Book the carrier', 'transport PO: price + date', 592, 232, 'loads-bookings', 6],
    ['conf', 'Confirms date & price', 'booking confirmed', 776, 582, 'dlg-carrierconfirm', 6],
    ['job', 'Job to sub', 'items, fillers, slip', 776, 152, 'production-jobs', 7],
    ['back', 'Quantities back', 'fillers filled in', 960, 152, 'production-jobs', 9],
    ['inv', 'Invoice', 'from loaded quantities', 1144, 152, 'doc-invoice', 10],
    ['pb', 'Price builder', 'cost per MBF → price', 40, 232, 'pricing-builder'],
    ['pl', 'Price lists', 'per customer & plant', 224, 232, 'pricing-lists'],
    ['off', 'Supplier offers', 'by the load', 40, 352, 'purchasing-offers'],
    ['calc', 'Batch calculator', 'what can I offer?', 224, 352, 'purchasing-offers'],
    ['po', 'Purchase order', 'to the supplier', 408, 352, 'purchasing-pos'],
    ['oh', 'Inventory', 'board feet, average cost', 592, 352, 'inventory-onhand'],
    ['cnt', 'Count & recount', 'every two months', 776, 352, 'inventory-counts'],
    ['adj', 'Adjust & waste', '5% booked, true-up', 960, 352, 'inventory-adjustments'],
    ['cut', 'Cut, groove, load', 'at the sub\'s yard', 776, 472, 'production-jobs', 7],
    ['ll', 'Loading list & slip', 'filler line blank', 960, 472, 'doc-loadlist', 8],
    ['bol', 'Bill of lading', 'carrier signs', 960, 582, 'doc-bol', 8],
    ['del', 'Delivery', 'schedule, split loads', 1144, 582, 'loads-schedule'],
  ];
  const E = [['need', 'imp'], ['imp', 'prop'], ['prop', 'plan'], ['plan', 'send'], ['send', 'cpo', 1], ['cpo', 'ord'], ['ord', 'job'], ['ord', 'book'], ['book', 'conf'], ['conf', 'bol'], ['job', 'cut'], ['cut', 'll'], ['ll', 'bol'], ['ll', 'back'], ['back', 'inv'], ['bol', 'del'], ['del', 'recv'], ['inv', 'pay'],
    ['pb', 'pl'], ['pl', 'prop', 1], ['off', 'calc'], ['calc', 'po'], ['po', 'oh'], ['oh', 'cnt'], ['cnt', 'adj'], ['oh', 'pb', 1], ['back', 'adj', 1]];
  const pos = Object.fromEntries(N.map(n => [n[0], n]));
  const edge = ([a, b, alt]) => {
    const A = pos[a], B = pos[b];
    let x1, y1, x2, y2;
    if (Math.abs(A[3] - B[3]) < 5) { x1 = A[3] + W / 2; x2 = B[3] + W / 2; y1 = A[4] < B[4] ? A[4] + Hh : A[4]; y2 = A[4] < B[4] ? B[4] : B[4] + Hh; return `<path class="edge ${alt ? 'alt' : ''}" d="M${x1} ${y1} L${x2} ${y2 - (A[4] < B[4] ? 6 : -6)}" marker-end="url(#ah)"/>`; }
    if (B[3] > A[3]) { x1 = A[3] + W; y1 = A[4] + Hh / 2; x2 = B[3]; y2 = B[4] + Hh / 2; }
    else { x1 = A[3]; y1 = A[4] + Hh / 2; x2 = B[3] + W; y2 = B[4] + Hh / 2; }
    const mx = (x1 + x2) / 2;
    return `<path class="edge ${alt ? 'alt' : ''}" d="M${x1} ${y1} H${mx} V${y2} H${x2 + (B[3] > A[3] ? -6 : 6)}" marker-end="url(#ah)"/>`;
  };
  const svg = `<svg viewBox="0 0 1520 660" role="img" aria-label="Timberline workflow">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0 0 L10 5 L0 10 z"/></marker></defs>
    ${lanes.map(([t, y, h]) => `<rect class="lane" x="0" y="${y}" width="1520" height="${h}" rx="8"/><text class="lane-t" x="1510" y="${y + 16}" text-anchor="end">${t}</text>`).join('')}
    ${E.map(edge).join('')}
    ${N.map(([id, l, s, x, y, link, st]) => `<a href="#${link}" class="node ${st ? 'story' : ''}"><rect x="${x}" y="${y}" width="${W}" height="${Hh}" rx="7"/><text x="${x + 12}" y="${y + (s ? 22 : 32)}">${l}</text>${s ? `<text class="s" x="${x + 12}" y="${y + 40}">${s}</text>` : ''}${st ? `<circle cx="${x + W - 14}" cy="${y + 14}" r="9" fill="var(--crayon)"/><text x="${x + W - 14}" y="${y + 18}" text-anchor="middle" style="font:700 11px var(--f-num);fill:var(--crayon-ink)">${st}</text>` : ''}</a>`).join('')}
  </svg>`;
  S({
    id: 'workflow', dept: 'workflow', title: 'Workflow diagram',
    intent: 'The whole business on one page: the order going from the customer\'s spreadsheet to the invoice, with buying and inventory underneath, because "you make money when you buy". Green boxes with a yellow number are the order story. Every box opens its window, so BB Pallets can say "yes, that\'s how we work" or "no, it\'s like this".',
    ref: 'Hand-off 4.1–4.6, 13 (item 4)',
    check: ['Is anything missing between the customer\'s PO and the subcontractor job?', 'Does buying really feed pricing like this (average cost into the price builder)?', 'Who does each box today: the owner, the office, or the subcontractor?'],
    assistant: ['Answer "where is order 24-0318?" by pointing at its box', 'Explain any step in English or Yiddish'],
    html: () => H.head('Workflow', 'How an order moves, and where the money is made', 'Click any box to open that window. Dashed arrows are information that flows back, not work.', H.go('Start the order story', 'story', 'primary')) + `<div class="wf">${svg}</div>` +
      `<div class="btns small muted">${H.chip('1–10', 'now')} order story ${H.chip('Box', '')} other windows</div>`,
  });
})();
