/* Workflow: the whole process as one clickable diagram. Each box opens its window.
   Lanes follow D36: the salesperson in the middle, the BB Pallets office in its own lane
   (what he asks for and the office does), and the other parties around him. */
(function () {
  const W = 168, Hh = 54;
  const lanes = [
    ['Customer', 20, 100], ['Salesperson', 130, 190], ['BB Pallets office', 330, 100],
    ['Buying & stock', 440, 100], ['Subcontractor', 550, 100], ['Carrier', 660, 100],
  ];
  // id, label, sub, x, y, link, story?, kind ('office' = done by the office)
  const N = [
    ['need', 'Needs sheet', 'what they will need', 40, 42, 'orders-incoming', 1],
    ['cpo', 'Official PO', 'matches the proposal', 592, 42, 'dlg-pomatch', 5],
    ['pay', 'Pays the invoice', '', 1328, 42, 'customers-statements'],
    ['imp', 'Import & rework', 'into his load worksheet', 40, 152, 'orders-incoming', 1],
    ['prop', 'Proposal', '% of a truck, order no.', 224, 152, 'orders-proposals', 2],
    ['plan', '3D load plan', 'confirm the fit', 408, 152, 'loads-planner', 3],
    ['ord', 'Match PO → order', 'and send confirmation', 592, 152, 'orders-orders', 5],
    ['job', 'Job to sub', 'items, risers, ready date', 776, 152, 'production-jobs', 7],
    ['back', 'Quantities back', 'he types or Assistant reads', 960, 152, 'dlg-loaded', 9],
    ['invr', 'Invoice request', 'loaded quantities, pre-tax', 1144, 152, 'doc-invoice', 10],
    ['paid', 'Marks it paid', 'a status, no bookkeeping', 1328, 152, 'customers-statements', 12],
    ['pb', 'Price builder', 'cost per MBF → price', 40, 232, 'pricing-builder'],
    ['pl', 'Price lists', 'versions by date', 224, 232, 'pricing-lists'],
    ['send', 'Email proposal', 'PDF + Excel', 408, 232, 'doc-proposal', 4],
    ['book', 'Ask for transport PO', 'carrier, price, date', 592, 232, 'loads-bookings', 6],
    ['dlv', 'Delivered', 'signed BOL, any problem', 1328, 232, 'dlg-delivery', 11],
    ['oappr', 'Approves purchase', 'and issues the PO', 408, 352, 'office-requests', 0, 'office'],
    ['otpo', 'Issues transport PO', 'to the carrier', 592, 352, 'office-requests', 0, 'office'],
    ['oinv', 'Invoices customer', 'with tax, its number', 1144, 352, 'office-requests', 0, 'office'],
    ['off', 'Supplier offers', 'by the load', 40, 462, 'purchasing-offers'],
    ['calc', 'Batch calculator', 'what can I offer?', 224, 462, 'purchasing-offers'],
    ['po', 'Ask to approve', 'every purchase', 408, 462, 'purchasing-pos'],
    ['oh', 'Inventory', 'phase two', 592, 462, 'inventory-onhand'],
    ['cnt', 'Count & recount', 'every two months', 1144, 462, 'inventory-counts'],
    ['adj', 'Adjust & waste', '5% on top, true-up', 1328, 462, 'inventory-adjustments'],
    ['cut', 'Cut, groove, load', 'at the sub\'s yard', 776, 572, 'production-jobs', 7],
    ['ll', 'Loading list & slip', 'filler line blank', 960, 572, 'doc-loadlist', 8],
    ['conf', 'Confirms date & price', 'booking confirmed', 408, 682, 'dlg-carrierconfirm', 6],
    ['bol', 'Bill of lading', 'made when booked', 960, 682, 'doc-bol', 8],
    ['del', 'Delivers', 'one or two drops', 1144, 682, 'loads-schedule'],
  ];
  const E = [['need', 'imp'], ['imp', 'prop'], ['prop', 'plan'], ['plan', 'send'], ['send', 'cpo', 1], ['cpo', 'ord'],
    ['ord', 'book'], ['book', 'otpo'], ['otpo', 'conf'], ['conf', 'bol'], ['ord', 'job'], ['job', 'cut'], ['cut', 'll'],
    ['ll', 'bol'], ['ll', 'back'], ['back', 'invr'], ['invr', 'oinv'], ['oinv', 'pay'], ['pay', 'paid', 1], ['bol', 'del'], ['del', 'dlv'],
    ['pb', 'pl'], ['pl', 'prop', 1], ['off', 'calc'], ['calc', 'po'], ['po', 'oappr'], ['po', 'oh', 1], ['oh', 'cnt'], ['cnt', 'adj']];
  const pos = Object.fromEntries(N.map(n => [n[0], n]));
  const edge = ([a, b, alt]) => {
    const A = pos[a], B = pos[b];
    let x1, y1, x2, y2;
    if (Math.abs(A[3] - B[3]) < 5) { x1 = A[3] + W / 2; x2 = x1; const down = A[4] < B[4]; y1 = down ? A[4] + Hh : A[4]; y2 = down ? B[4] - 6 : B[4] + Hh + 6; return `<path class="edge ${alt ? 'alt' : ''}" d="M${x1} ${y1} L${x2} ${y2}" marker-end="url(#ah)"/>`; }
    if (Math.abs(A[4] - B[4]) < 5) { const r = B[3] > A[3]; x1 = r ? A[3] + W : A[3]; x2 = r ? B[3] - 6 : B[3] + W + 6; y1 = A[4] + Hh / 2; return `<path class="edge ${alt ? 'alt' : ''}" d="M${x1} ${y1} H${x2}" marker-end="url(#ah)"/>`; }
    if (B[3] > A[3]) { x1 = A[3] + W; y1 = A[4] + Hh / 2; x2 = B[3]; y2 = B[4] + Hh / 2; }
    else { x1 = A[3]; y1 = A[4] + Hh / 2; x2 = B[3] + W; y2 = B[4] + Hh / 2; }
    const mx = (x1 + x2) / 2;
    return `<path class="edge ${alt ? 'alt' : ''}" d="M${x1} ${y1} H${mx} V${y2} H${x2 + (B[3] > A[3] ? -6 : 6)}" marker-end="url(#ah)"/>`;
  };
  const node = ([id, l, s, x, y, link, st, kind]) => `<a href="#${link}" class="node ${st ? 'story' : ''}"><rect x="${x}" y="${y}" width="${W}" height="${Hh}" rx="7" ${kind === 'office' ? 'style="fill:var(--warn-bg);stroke:var(--warn);stroke-dasharray:5 3"' : ''}/><text x="${x + 12}" y="${y + (s ? 22 : 32)}">${l}</text>${s ? `<text class="s" x="${x + 12}" y="${y + 40}">${s}</text>` : ''}${st ? `<circle cx="${x + W - 14}" cy="${y + 14}" r="9" fill="var(--crayon)"/><text x="${x + W - 14}" y="${y + 18}" text-anchor="middle" style="font:700 11px var(--f-num);fill:var(--crayon-ink)">${st}</text>` : ''}</a>`;
  const svg = `<svg viewBox="0 0 1520 780" role="img" aria-label="Timberline workflow">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0 0 L10 5 L0 10 z"/></marker></defs>
    ${lanes.map(([t, y, h]) => `<rect class="lane" x="0" y="${y}" width="1520" height="${h}" rx="8"/><text class="lane-t" x="1510" y="${y + 16}" text-anchor="end">${t}</text>`).join('')}
    ${E.map(edge).join('')}
    ${N.map(node).join('')}
  </svg>`;
  S({
    id: 'workflow', dept: 'workflow', title: 'Workflow diagram',
    intent: 'The whole job on one page, from the salesperson\'s side (D36): the order going from the customer\'s spreadsheet to delivered and paid, with buying and stock underneath, because "you make money when you buy". The BB Pallets office has its own lane: the dashed boxes are what the office does when he asks (transport PO, purchase approval, invoice). Green boxes with a yellow number are the order story. Every box opens its window, so BB Pallets can say "yes, that\'s how we work" or "no, it\'s like this".',
    ref: 'Hand-off 1a, 4.1–4.6 · D35–D46 · Review S1, S2',
    check: ['Is anything missing between the customer\'s PO and the subcontractor job?', 'Does the transport PO really go out when the order is entered, or only once the subcontractor gives a ready date?', 'Who does each office box today, and how long does each usually take?'],
    assistant: ['Answer "where is order 24-0318?" by pointing at its box', 'Explain any step in English or Yiddish'],
    html: () => H.head('Workflow', 'How an order moves, and where the money is made', 'Click any box to open that window. Dashed arrows are information that flows back, not work.', H.go('Start the order story', 'story', 'primary')) + `<div class="wf">${svg}</div>` +
      `<div class="btns small muted">${H.chip('1–12', 'now')} order story <span class="chip" style="background:var(--warn-bg);border:1px dashed var(--warn);color:var(--warn)">Office</span> done by the BB Pallets office when he asks ${H.chip('Box', '')} other windows</div>`,
  });
})();
