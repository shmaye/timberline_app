/* Orders (Incoming, Proposals, Orders, Pickups) and Customers (Accounts & plants, Contacts,
   Statements & payments), plus the import, PO-match and plant dialogs. */
(function () {
  const st = D.story;
  // room under a dialog so the dimmed page is at least as tall as the dialog
  const room = (f, px) => () => f() + `<div style="height:${px}px"></div>`;

  // ---------- shared bits ----------
  const truckTiles = (bf, lb, floor, note) => H.kpis([
    H.gauge('Board feet', `${n0(bf)} <small>/ 44,000</small>`, bf / 440, `${Math.round(bf / 440)}% of a truck`, bf > 44000 ? 'bad' : bf / 440 > 92 ? 'warn' : 'ok'),
    H.gauge('Weight', `${n0(lb)} <small>/ 45,000 lb</small>`, lb / 450, lb > 45000 ? `${n0(lb - 45000)} lb over` : `${n0(45000 - lb)} lb to spare`, lb > 45000 ? 'bad' : lb / 450 > 92 ? 'warn' : 'ok'),
    H.gauge('Floor', `${floor}%`, floor, '53\' dry van, 2 high', floor > 100 ? 'bad' : floor > 92 ? 'warn' : 'ok'),
    H.gauge('Fills', note, null, 'whichever runs out first (D13)'),
  ]);

  const needRows = [
    ['DN-3331', '3x3 × 31"', 'Major', 2400, 1.9375, 2.6],
    ['DN-33375', '3x3 × 37½"', 'Major', 1800, 2.3438, 3.1],
    ['DN-33385', '3x3 × 38½"', 'Major', 1400, 2.4063, 3.2],
    ['DN-2339G', '2x3 × 39" grooved', '', 2100, 1.625, 2.1],
    ['DN-4448', '4x4 × 48"', '', 480, 5.3333, 7.0],
  ];
  const needBf = needRows.reduce((a, r) => a + r[3] * r[4], 0);
  const needLb = needRows.reduce((a, r) => a + r[3] * r[5], 0);

  // ---------- Orders › Incoming ----------
  const incomingPage = () => H.head('Orders', 'Incoming', 'Customer spreadsheets and POs that came in. Nothing here is an order yet.',
    H.btn('Upload spreadsheet', '', 'upload') + H.go('Import needs sheet', 'dlg-import', 'primary', 'plus')) +
    H.kpis([
      H.gauge('New needs sheets', '3', null, 'from email and upload'),
      H.gauge('POs to match', '2', null, 'against sent proposals', 'warn'),
      H.gauge('Waiting on customer', '4', null, 'proposals not answered'),
      H.gauge('Pickup orders', '2', null, 'no load planning needed'),
    ]) +
    H.panel('In the inbox', H.filters(['*All 9', 'Needs sheets 3', 'POs 2', 'Pickup orders 2', 'Read by AI 1']) + H.table(
      ['', 'Received', 'From', 'Plant', 'What it is', { t: 'Lines', num: true }, { t: 'Truck %', num: true }, 'Status', ''],
      [
        [H.box(true), 'Today 8:14', 'Dana Ferreira', 'Caldari Road, Concord', 'Needs sheet · Nov-Dec.xlsx', '5', '96%', H.chip('New', 'now'), H.go('Import', 'dlg-import', 'sm primary')],
        [H.box(false), 'Today 7:52', 'Dana Ferreira', 'Jane Street, Vaughan', 'Needs sheet · JaneSt Q1.xlsx', '2', '41%', H.chip('New', 'now'), H.go('Import', 'dlg-import', 'sm')],
        [H.box(false), 'Yesterday', 'Mike Russo', 'Newark NJ', 'Needs sheet · scanned PDF', '6', '118%', H.chip('Read by AI, check it', 'warn'), H.go('Review', 'dlg-import', 'sm')],
        [H.box(false), 'Yesterday', 'Dana Ferreira', 'Caldari Road, Concord', 'PO 77815.pdf', '5', '100%', H.chip('PO to match', 'info'), H.go('Match', 'dlg-pomatch', 'sm')],
        [H.box(false), 'Mon', 'Mike Russo', 'Newark NJ', 'PO GSS-40412.pdf', '4', '98%', H.chip('PO to match', 'info'), H.go('Match', 'dlg-pomatch', 'sm')],
        [H.box(false), 'Mon', 'Raj Patel', 'Toronto (pickup)', 'Order email · 2 lines', '2', '—', H.chip('Pickup', 'brand'), H.go('Open', 'orders-pickups', 'sm')],
      ], { sel: 0 }), '', true) +
    H.callout('info', 'Messy files (scans, odd columns) are read by the Assistant and flagged so a person checks them before anything is built from them.') +
    `<div class="bottombar"><b>1 selected</b><span class="muted" style="color:var(--rail-dim)">Caldari Road · Nov-Dec.xlsx</span><span style="margin-left:auto" class="btns">${H.btn('Mark as not an order')}${H.btn('Forward')}${H.go('Import and build proposal', 'dlg-import', 'primary')}</span></div>`;

  S({
    id: 'orders-incoming', dept: 'orders', title: 'Incoming spreadsheets and POs', story: 1,
    intent: 'Where customer needs sheets and POs land, from email or upload. A needs sheet is not an order yet: it is what the customer thinks they will need. From here it is imported, reworked into BB Pallets\' own worksheet and turned into a proposal.',
    ref: 'Hand-off 4.1, D10',
    check: ['Do needs sheets always come by email, or also by phone or fax?', 'Is there one sheet per plant, or one sheet for all plants of a customer?', 'Can we pull these straight from the sales mailbox?'],
    assistant: ['Read a messy spreadsheet or scan into lines', 'Say which plant and customer a sheet belongs to', 'Draft the proposal from the sheet'],
    html: incomingPage,
    dock: H.assistant([
      ['me', 'What came in from Ardent this morning?'],
      ['ai', 'Two needs sheets from Dana: Caldari Road (5 lines, about 96% of a truck) and Jane Street (2 lines, 41%). Jane Street is 8 miles away; it could ride on the Caldari Road load as a second drop.'],
      ['propose', 'Build proposal P-24-0318 for Caldari Road from Nov-Dec.xlsx, topped up to a full truck with major sizes.'],
    ]),
  });

  // ---------- dialog: import needs sheet ----------
  S({
    id: 'dlg-import', kind: 'dialog', dept: 'orders', tab: 'orders-incoming', title: 'Import a needs spreadsheet', story: 1,
    intent: 'Turns the customer\'s spreadsheet into lines in BB Pallets\' own load worksheet. Columns are matched once per customer and remembered; each line is matched to a catalog item, and the truck % shows while it imports.',
    ref: 'Hand-off 4.1, D10',
    check: ['What columns do their customers\' sheets usually have (item, length, quantity, date)?', 'Do customers use their own part numbers that we should map to ours?', 'Are quantities in pieces or bundles?'],
    assistant: ['Match the columns and items automatically', 'Flag lines it is unsure of', 'Explain why a line was not matched'],
    under: room(incomingPage, 420),
    html: () => H.dialog('Import needs sheet · Ardent Metals, Caldari Road',
      H.drop('<b>Nov-Dec.xlsx</b> · 14 KB · sheet "Needs" · 7 rows read') +
      `<div class="grid2">${H.panel('1. Columns', H.table(['Their column', 'Means'], [
        ['Part #', H.chip('Their part number', 'brand')], ['Description', H.chip('Item', 'brand')], ['Qty', H.chip('Pieces', 'brand')], ['Need by', H.chip('Date', 'brand')], ['Notes', H.chip('Ignore', '')],
      ]), H.chip('Saved for Ardent', 'ok'), true)}
      ${H.panel('2. Truck while importing', `<div style="padding:4px 0 0">${H.kpis([H.gauge('Board feet', `${n0(needBf)}`, needBf / 440, `${Math.round(needBf / 440)}% of a truck`, 'ok'), H.gauge('Weight', `${n0(needLb)} lb`, needLb / 450, 'of 45,000 lb', 'ok')])}</div>`)}</div>` +
      H.panel('3. Lines matched to the catalog', H.table(['Their part', 'Their description', 'Our item', { t: 'Pieces', num: true }, { t: 'Bd ft', num: true }, 'Check'], [
        ['ARD-0331', 'Dunnage 3x3x31', 'DN-3331 · 3x3 × 31"', '2,400', n0(2400 * 1.9375), H.chip('Matched', 'ok')],
        ['ARD-0375', '3X3 37.5 IN', 'DN-33375 · 3x3 × 37½"', '1,800', n0(1800 * 2.3438), H.chip('Matched', 'ok')],
        ['ARD-0385', '3x3x38-1/2', 'DN-33385 · 3x3 × 38½"', '1,400', n0(1400 * 2.4063), H.chip('Matched', 'ok')],
        ['ARD-2339', '2x3 39" w/ groove', 'DN-2339G · 2x3 × 39" grooved', '2,100', n0(2100 * 1.625), H.chip('Matched', 'ok')],
        ['ARD-4448', '4x4 skid 4 ft', 'DN-4448 · 4x4 × 48"', '480', n0(480 * 5.3333), H.chip('Read by AI, check', 'warn')],
        ['—', 'Total row in their sheet', '—', '', '', H.chip('Skipped', '')],
      ], { cls: ['', '', '', '', 'diff', 'sub'] }), '', true),
      H.btn('Cancel') + H.btn('Save as draft') + H.go('Build proposal', 'orders-proposals', 'primary'), true),
  });

  // ---------- Orders › Proposals ----------
  const it = (code, name) => `<span class="nowrap"><b>${name}</b></span><div class="small muted">${code}</div>`;
  const propLines = [
    [it('DN-3331', '3x3 × 31"'), '2,400', '2,800', '+400', '20', '5,425', H.chip('Top-up', 'brand')],
    [it('DN-33375', '3x3 × 37½"'), '1,800', '2,100', '+300', '15', '4,922', H.chip('Top-up', 'brand')],
    [it('DN-33385', '3x3 × 38½"'), '1,400', '1,680', '+280', '12', '4,043', H.chip('Top-up', 'brand')],
    [it('DN-2339G', '2x3 × 39" grooved'), '2,100', '2,100', '', '10', '3,413', ''],
    [it('DN-4448', '4x4 × 48"'), '480', '480', '', '5', '2,560', ''],
    [it('DN-2440', '2x4 × 40"'), '—', 'as fit', '', '2+', '≈ 670', H.chip('Filler', 'warn')],
  ];
  S({
    id: 'orders-proposals', dept: 'orders', title: 'Load proposals', story: 2,
    intent: 'BB Pallets\' own worksheet: the customer\'s needs fitted to a full truck, with the internal order number on it. It shows % of a truck live, and offers the three moves from the notes: split into two loads, cut items, or top up with the plant\'s major sizes. The proposal is emailed back and waits for the customer\'s PO.',
    ref: 'Hand-off 4.1, 4.2, D13, D16',
    check: ['Is "% of a truck" worked out from board feet, or by eye from experience?', 'When topping up, is it always the major sizes, or what the customer asks for?', 'How long does a proposal usually wait for the PO?'],
    assistant: ['Top up to a full truck, weighted to major sizes', 'Split into two loads with the gap the customer picks', 'Draft the email with the proposal attached'],
    html: () => H.head(`Orders › Proposals · ${st.proposal}`, `${st.customer} · ${st.plant}`, 'From needs sheet Nov-Dec.xlsx, received today 8:14',
      H.btn('Split into 2 loads') + H.btn('Cut items') + H.go('Plan in 3D', 'loads-planner', '', 'loads') + H.go('Send proposal', 'doc-proposal', 'primary', 'mail')) +
      H.stages(D.stages, 1) +
      truckTiles(40990, 43350, 97, 'Weight first') +
      `<div class="split">${H.panel('Lines', H.table(['Item', { t: 'Asked', num: true }, { t: 'Proposed', num: true }, { t: 'Change', num: true }, { t: 'Bundles', num: true }, { t: 'Bd ft', num: true }, ''],
        propLines, { foot: ['Total', '7,780', '8,830', '+980', '62', '40,990', ''] }), H.btn('Add line', 'sm', 'plus'), true)}
      <div style="display:flex;flex-direction:column;gap:20px">
      ${H.panel('Suggestions', `<div class="list">
        <div class="li" style="border-top:0;padding-left:0">${H.dot('ok')}<div class="grow"><b>Topped up 980 pcs</b><div class="small muted">Spread over the 3 major sizes, in proportion.</div></div></div>
        <div class="li" style="padding-left:0">${H.dot('warn')}<div class="grow"><b>Fill the rest with 2x4 × 40"</b><div class="small muted">Packing slip leaves the quantity blank, filled in at loading.</div></div></div>
        <div class="li" style="padding-left:0">${H.dot('info')}<div class="grow"><b>Jane Street could be a 2nd drop</b><div class="small muted">Same buyer, 8 miles away, 41% of a truck.</div></div>${H.btn('Try it', 'sm')}</div></div>`)}
      ${H.panel('Proposal', H.form([H.field('Order no.', st.order, '', true), H.field('Ship', 'Week of Dec 1'), H.field('Trailer', '53\' dry van'), H.field('Price list', 'Ardent Caldari 2024-09', '', true), H.field('Value', '$32,310.40', 'CAD', true), H.field('Margin', '$3,050 / load', '', true)]))}
      </div></div>` +
      H.panel('All proposals', H.filters(['*Open 6', 'Waiting on PO 4', 'Sent > 5 days 1', 'Won 18', 'Lost 2']) + H.table(['Proposal', 'Plant', 'Sent', { t: 'Truck %', num: true }, { t: 'Value', num: true }, 'Status'], [
        [st.proposal, 'Caldari Road, Concord', 'Draft', '97%', '$32,310', H.chip('Draft', 'now')],
        ['P-24-0312', 'Newark NJ', 'Nov 12', '99%', 'US$29,880', H.chip('Waiting 7 days', 'warn')],
        ['P-24-0309', 'Caldari Road, Concord', 'Nov 8', '100%', '$31,940', H.chip('PO received', 'ok')],
        ['P-24-0305', 'Jane Street, Vaughan (split 2 of 2)', 'Nov 4', '52%', '$16,200', H.chip('Load 2 due Dec 2', 'info')],
      ], { sel: 0 }), '', true),
  });

  // ---------- Orders › Orders ----------
  const ordersPage = () => H.head('Orders', 'Orders', 'An order exists once the customer\'s PO matches the proposal.', H.go('Match a PO', 'dlg-pomatch', 'primary')) +
    H.kpis([
      H.gauge('Open orders', '9', null, '6 delivered, 3 pickup'),
      H.gauge('At subcontractor', '3', null, 'Kessler 2 · Pinegrove 1'),
      H.gauge('Loaded, not invoiced', '1', null, 'fillers to confirm', 'warn'),
      H.gauge('Split loads due', '1', null, 'Jane Street load 2 · Dec 2'),
    ]) +
    H.panel('Orders', H.filters(['*Open 9', 'Proposal', 'Customer PO', 'At subcontractor', 'Loaded', 'Invoiced', 'Split loads']) + H.table(
      ['Order', 'Customer PO', 'Plant', 'Ship', { t: 'Bd ft', num: true }, { t: 'Value', num: true }, 'Where it stands', 'Linked'],
      [
        [st.order, 'PO 77815', 'Caldari Road, Concord', 'Dec 1', '40,990', '$32,310', H.chip('PO received, matched', 'now'), ''],
        ['24-0314', 'GSS-40412', 'Newark NJ', 'Nov 28', '43,600', 'US$31,180', H.chip('At subcontractor', 'info'), 'Kessler'],
        ['24-0309', 'PO 77790', 'Caldari Road, Concord', 'Nov 21', '43,980', '$31,940', H.chip('Loaded · fillers?', 'warn'), 'L-2409'],
        ['24-0305A', 'PO 77751', 'Jane Street, Vaughan', 'Nov 6', '22,700', '$16,200', H.chip('Invoiced', 'ok'), 'Split 1 of 2'],
        ['24-0305B', 'PO 77751', 'Jane Street, Vaughan', 'Dec 2', '21,900', '$15,640', H.chip('Split load due', 'info'), '↔ 24-0305A (D16)'],
        ['24-0311', 'LTB-9921', 'Toronto (pickup)', 'Nov 25', '8,200', '$6,410', H.chip('Pickup ready', 'brand'), ''],
      ], { sel: 0 }), '', true) +
    `<div class="bottombar"><b>Order ${st.order}</b><span style="color:var(--rail-dim)">PO matched, 0 differences</span><span style="margin-left:auto" class="btns">${H.go('Order confirmation', 'dlg-email')}${H.go('Book the carrier', 'loads-bookings', 'primary')}${H.go('Send job to subcontractor', 'production-jobs')}</span></div>`;
  S({
    id: 'orders-orders', dept: 'orders', title: 'Orders', story: 5,
    intent: 'Every order and where it stands: proposal, customer PO, at subcontractor, loaded, invoiced. An order is only created when the official PO matches the proposal. A split load becomes two separate orders that point at each other (D16).',
    ref: 'Hand-off 4.1, 4.6, D16',
    check: ['Does every customer send a PO, or do some just say "go ahead"?', 'Do they send an order confirmation back today?', 'Who decides which subcontractor gets the job?'],
    assistant: ['Say where any order stands', 'Match a PO that just came in', 'Remind about split loads coming due'],
    html: ordersPage,
  });

  // ---------- dialog: PO match ----------
  S({
    id: 'dlg-pomatch', kind: 'dialog', dept: 'orders', tab: 'orders-orders', title: 'Match customer PO to proposal', story: 5,
    intent: 'The customer\'s official PO is read and laid next to the proposal it answers. Differences in items, quantities, prices or dates are flagged, then one click creates the order.',
    ref: 'Hand-off 4.1',
    check: ['How often does the PO differ from the proposal, and who wins: their PO or our proposal?', 'Do POs carry prices, or just quantities?'],
    assistant: ['Read the PO PDF into lines', 'Explain each difference', 'Draft a note to the buyer about a difference'],
    under: room(ordersPage, 120),
    html: () => H.dialog(`${st.po} ↔ ${st.proposal} · ${st.customer}, Caldari Road`,
      H.callout('ok', '<b>5 of 6 lines match.</b> One price differs: their PO has last year\'s price for 4x4 × 48".') +
      H.table(['Item', { t: 'Proposal qty', num: true }, { t: 'PO qty', num: true }, { t: 'Proposal price', num: true }, { t: 'PO price', num: true }, 'Result'], [
        ['3x3 × 31"', '2,800', '2,800', '$1.53', '$1.53', H.chip('Match', 'ok')],
        ['3x3 × 37½"', '2,100', '2,100', '$1.85', '$1.85', H.chip('Match', 'ok')],
        ['3x3 × 38½"', '1,680', '1,680', '$1.90', '$1.90', H.chip('Match', 'ok')],
        ['2x3 × 39" grooved', '2,100', '2,100', '$1.41', '$1.41', H.chip('Match', 'ok')],
        ['4x4 × 48"', '480', '480', '$4.25', '$4.10', H.chip('Price differs', 'warn')],
        ['2x4 × 40" filler', 'as fit', 'as fit', '$1.75', '$1.75', H.chip('Match', 'ok')],
      ], { cls: ['', '', '', '', 'diff', ''] }) +
      `<div class="form">${H.field('Use for 4x4 × 48"', H.seg(['Our price $4.25', 'Their PO $4.10'], 0))}${H.field('Ship date', 'Dec 1 (both)', '', true)}${H.field('Order no.', st.order, '', true)}</div>`,
      H.btn('Cancel') + H.btn('Ask buyer about price') + H.go(`Create order ${st.order}`, 'orders-orders', 'primary'), true),
  });

  // ---------- Orders › Pickups ----------
  S({
    id: 'orders-pickups', dept: 'orders', title: 'Pickup orders',
    intent: 'Customers who send their own truck order regular items in a plain order. No load planning: the order is picked, the customer\'s driver signs, and it is invoiced.',
    ref: 'Hand-off 4.1 (exception)',
    check: ['Which customers pick up, and do they book a time?', 'Is a pickup priced without freight (D15 still open)?', 'Who signs for it at the yard?'],
    assistant: ['Turn an emailed pickup order into lines', 'Tell the subcontractor what to have ready', 'List pickups booked this week'],
    html: () => H.head('Orders', 'Pickups', 'Plain orders from customers who send their own truck.', H.btn('New pickup order', 'primary', 'plus')) +
      H.panel('This week', H.table(['Pickup', 'Customer', 'Time', 'Yard', 'Lines', 'Status', ''], [
        ['24-0311', 'Lakeshore Tube & Bar · Toronto', 'Tue Nov 25, 9:00', 'Kessler, Concord', '2x3 × 39" grooved × 1,050 · 3x3 × 31" × 700', H.chip('Ready', 'ok'), H.go('Packing slip', 'doc-packing', 'sm')],
        ['24-0316', 'Lakeshore Tube & Bar · Toronto', 'Thu Nov 27, 13:00', 'Kessler, Concord', '2x3 × 39" grooved × 2,100', H.chip('At subcontractor', 'info'), H.btn('Open', 'sm')],
        ['24-0320', 'Ardent Metals · Jane Street', 'Fri Nov 28', 'BB yard', '3x3 × 31" × 280', H.chip('Booked', ''), H.btn('Open', 'sm')],
      ]), '', true) +
      `<div class="grid2">${H.panel('Pickup 24-0311', H.form([H.field('Driver', 'Lakeshore truck, plate TBD'), H.field('Signed by', '<span class="muted">at pickup</span>'), H.field('Bd ft', '3,060', '', true), H.field('Value', '$2,489.20', 'CAD', true)]) + `<div class="btns" style="margin-top:14px">${H.btn('Mark picked up')}${H.go('Invoice', 'doc-invoice', 'primary')}</div>`)}
      ${H.callout('info', 'Pickup orders skip the proposal and the 3D planner. They still get a packing slip, and the invoice uses what was signed for.')}</div>`,
  });

  // ---------- Customers › Accounts & plants ----------
  const plantRows = [];
  D.customers.forEach(c => c.plants.forEach(p => plantRows.push([`<b>${c.name}</b><div class="small muted">${p.name} · ${p.city}</div>`, p.loadsYr, p.cur, p.mode === 'Pickup' ? H.chip('Pickup', 'brand') : 'Delivered', p.freight ? money(p.freight, 0) : '—', p.other ? money(p.other, 0) : '—', p.major.join('<br>'), p.id === 'ARD-VAU' ? H.chip('Late', 'warn') : H.chip('On track', 'ok')])));
  const accountsPage = () => H.head('Customers', 'Accounts & plants', 'Each plant has its own prices, volume, freight and major sizes.', H.btn('Import customers', '', 'upload') + H.btn('New customer', 'primary', 'plus')) +
    H.kpis([H.gauge('Customers', '3', null, '4 plants'), H.gauge('Loads this year', '41', null, 'Caldari Road 22'), H.gauge('Follow-ups', '3', null, 'late plant, unanswered, split due', 'warn'), H.gauge('USD plants', '1', null, 'Newark NJ')]) +
    H.panel('Plants', H.filters(['*All', 'Delivered', 'Pickup', 'CAD', 'USD', 'Follow-ups 3']) + H.table(['Customer · plant', { t: 'Loads/yr', num: true }, 'Cur.', 'Ship', { t: 'Freight', num: true }, { t: 'Other', num: true }, 'Major sizes', 'Orders'], plantRows, { sel: 0 }), '', true) +
    `<div class="grid2">${H.panel('Follow-ups', `<div class="list">
      <div class="li" style="border-top:0">${H.dot('warn')}<div class="grow"><b>Jane Street, Vaughan is late</b><div class="small muted">Orders every 12 weeks; nothing in 15.</div></div>${H.btn('Draft email', 'sm')}</div>
      <div class="li">${H.dot('warn')}<div class="grow"><b>P-24-0312 Newark: no answer in 7 days</b><div class="small muted">Sent Nov 12 to Mike Russo.</div></div>${H.btn('Remind', 'sm')}</div>
      <div class="li">${H.dot('info')}<div class="grow"><b>Split load 24-0305B due Dec 2</b><div class="small muted">Second half of Jane Street order.</div></div>${H.go('Open', 'orders-orders', 'sm')}</div></div>`, '', true)}
    ${H.panel('Ardent Metals · Caldari Road plant', H.form([H.field('Buyer', 'Dana Ferreira'), H.field('Price list', 'Ardent Caldari 2024-09'), H.field('Filler', '2x4 × 40"'), H.field('Other costs', '$700 / load', 'D18'), H.field('Sales vs last year', '+8%', '', true), H.field('Average margin', '$2,940 / load', '', true)]) + `<div class="btns" style="margin-top:14px">${H.go('Edit plant', 'dlg-plant', 'primary')}${H.go('Price list', 'pricing-lists')}${H.go('Statement', 'customers-statements')}</div>`)}</div>`;
  S({
    id: 'customers-accounts', dept: 'customers', title: 'Accounts & plants',
    intent: 'Customers and their plants. Each plant carries its own price list, currency, volume, pickup or delivered, freight, major sizes, filler items and other costs per load, because "almost no standard": the same item has different prices at plants 8 miles apart. Follow-ups catch a plant that is late on its usual order (proposed).',
    ref: 'Hand-off 3, 6, D18, D26',
    check: ['Is the plant the right level for prices, or sometimes the customer?', 'What counts as "late" for a plant: a set number of weeks?', 'Do some plants share one buyer and one invoice?'],
    assistant: ['How is Concord doing vs last year?', 'Which plants are late on their usual order?', 'Draft a check-in email to a late plant'],
    html: accountsPage,
    dock: H.assistant([
      ['me', 'How\'s Concord doing vs last year?'],
      ['ai', 'Caldari Road: 22 loads so far vs 20 last year (+8%). Average margin $2,940 a load against the $3,000 planned. Jane Street is quiet: nothing in 15 weeks.'],
      ['propose', 'Email Dana Ferreira: "Anything coming up for Jane Street? We can put it on the Dec 1 Caldari Road truck."'],
    ]),
  });

  // ---------- dialog: edit plant ----------
  S({
    id: 'dlg-plant', kind: 'dialog', dept: 'customers', tab: 'customers-accounts', title: 'Edit a plant',
    intent: 'Everything that makes a plant different in one place: where it ships, who buys, which price list and currency, pickup or delivered, freight, the major sizes used for top-ups, filler items, other costs per load (D18), how often it orders, and the customs broker for US plants (D26).',
    ref: 'Hand-off 6, D18, D26',
    check: ['Are other costs one number per load, or several lines (e.g. waiting time, special packaging)?', 'Is freight set per plant, or per destination area?', 'For US plants, does each plant have its own broker?'],
    assistant: ['Fill the plant from an email signature or a PO', 'Suggest major sizes from past orders'],
    under: room(accountsPage, 120),
    html: () => H.dialog('Garden State Steel · Newark plant',
      H.form([H.field('Plant name', 'Newark plant'), H.field('Ship-to', '410 Example Ave, Newark NJ 07105'), H.field('Buyer', 'Mike Russo'), H.field('Buyer email', 'm.russo@example.com'), H.field('Price list', 'GSS Newark 2024-10'), H.field('Currency', 'USD'), H.field('Ships', H.seg(['Delivered', 'Pickup'], 0)), H.field('Freight per load', '$3,400', 'Liberty Line'), H.field('Orders about every', '5', 'weeks')]) +
      `<div class="grid2">${H.panel('Major sizes (for top-ups)', `<div class="btns">${H.chip('3x3 × 37½" ✕', 'brand')}${H.chip('4x4 × 48" ✕', 'brand')}${H.btn('Add', 'sm', 'plus')}</div>`)}
      ${H.panel('Filler items', `<div class="btns">${H.chip('2x4 × 40" ✕', 'warn')}${H.btn('Add', 'sm', 'plus')}</div>`)}</div>` +
      H.panel('Other costs per load (D18)', H.table(['What', { t: 'Per load', num: true }, ''], [['Border wait time, average', '$250', H.btn('Remove', 'sm ghost')], ['Customer pallet tags', '$150', H.btn('Remove', 'sm ghost')]], { foot: ['Counts in margin and profit per load', '$400', ''] }), H.btn('Add cost', 'sm', 'plus'), true) +
      H.panel('Cross-border (D26)', H.form([H.field('Customs broker', 'Example Customs Brokers Inc.'), H.field('Broker email', 'entries@example-broker.com'), H.field('Papers', 'Commercial invoice · BOL with broker')])),
      H.btn('Cancel') + H.btn('Save', 'primary'), true),
  });

  // ---------- Customers › Contacts ----------
  S({
    id: 'customers-contacts', dept: 'customers', title: 'Contacts',
    intent: 'Everyone BB Pallets emails: buyers, accounts payable, receivers at each plant. The Email dialog picks recipients from here, and every email sent from Timberline is logged on the contact and the order.',
    ref: 'Hand-off 6, 8 (Email)',
    check: ['Who gets which document: does AP get invoices and the buyer get proposals?', 'Any contacts who should be copied on everything?'],
    assistant: ['Add a contact from an email signature', 'Show the last emails with a contact'],
    html: () => H.head('Customers', 'Contacts', '', H.btn('Import', '', 'upload') + H.btn('New contact', 'primary', 'plus')) +
      `<div class="split">${H.panel('People', H.filters(['*All 9', 'Buyers', 'Accounts payable', 'Receiving', 'Brokers']) + H.table(['Name', 'Company · plant', 'Role', 'Email', 'Phone', 'Gets'], [
        ['Dana Ferreira', 'Ardent Metals · Caldari Rd, Jane St', 'Buyer', 'd.ferreira@example.com', '905-555-0142', 'Proposals, confirmations'],
        ['Ardent AP', 'Ardent Metals', 'Accounts payable', 'ap@example.com', '', 'Invoices, statements'],
        ['Luis Ortega', 'Ardent Metals · Caldari Rd', 'Receiving', 'receiving@example.com', '905-555-0155', 'Delivery times'],
        ['Raj Patel', 'Lakeshore Tube & Bar · Toronto', 'Buyer', 'raj.p@example.com', '416-555-0190', 'Pickup confirmations'],
        ['Mike Russo', 'Garden State Steel · Newark', 'Buyer', 'm.russo@example.com', '973-555-0123', 'Proposals'],
        ['Example Customs Brokers', 'Garden State Steel', 'Customs broker', 'entries@example-broker.com', '', 'Commercial invoice, BOL'],
      ], { sel: 0 }), '', true)}
      ${H.panel('Dana Ferreira', H.form([H.field('Company', 'Ardent Metals'), H.field('Plants', 'Caldari Road, Jane Street'), H.field('Role', 'Buyer'), H.field('Language', 'English')]) +
        `<h4 style="margin:16px 0 6px;font-size:13px">Email history</h4><div class="list">
        <div class="li" style="padding-left:0">${H.icon('mail')}<div class="grow"><b>PO 77815</b><div class="small muted">Received yesterday</div></div></div>
        <div class="li" style="padding-left:0">${H.icon('mail')}<div class="grow"><b>Needs sheet Nov-Dec.xlsx</b><div class="small muted">Received today 8:14</div></div></div>
        <div class="li" style="padding-left:0">${H.icon('mail')}<div class="grow"><b>Proposal P-24-0309 sent</b><div class="small muted">Nov 8 · from sales mailbox</div></div></div></div>` +
        `<div class="btns" style="margin-top:12px">${H.go('Email', 'dlg-email', 'primary', 'mail')}</div>`)}</div>`,
  });

  // ---------- Customers › Statements & payments ----------
  S({
    id: 'customers-statements', dept: 'customers', title: 'Statements & payments',
    intent: 'Who owes what (proposed): open invoices, aging, payments and credits, payment plans, and statements or overdue reminders emailed from the system. Terms and credit limits are still to be confirmed with BB Pallets.',
    ref: 'Hand-off 6 (AR, proposed), 8, F27',
    check: ['What payment terms do customers have, and any credit limits?', 'Who chases late payers today?', 'Do payments get entered here, or come from the accounting program?'],
    assistant: ['Who owes us over 60 days?', 'Draft an overdue reminder with the statement attached', 'Set up a payment plan'],
    html: () => H.head('Customers', 'Statements & payments', 'Amounts in each customer\'s currency.', H.btn('Record payment') + H.go('Statement', 'doc-statement', 'primary')) +
      H.kpis([H.gauge('Owed to us', '$94,620 <small>CAD</small>', null, '+ US$31,180'), H.gauge('Current', '$62,250', 66, '', 'ok'), H.gauge('31–60 days', '$16,200', 17, '', 'warn'), H.gauge('Over 60 days', '$16,170', 17, '1 customer', 'bad')]) +
      H.panel('By customer', H.table(['Customer', 'Terms', { t: 'Current', num: true }, { t: '31–60', num: true }, { t: '61–90', num: true }, { t: '90+', num: true }, { t: 'Total', num: true }, ''], [
        ['Ardent Metals', 'Net 30', '$48,150', '$16,200', '', '', '$64,350', H.go('Statement', 'doc-statement', 'sm')],
        ['Lakeshore Tube & Bar', 'Net 30', '$14,100', '', '$9,770', '$6,400', '$30,270', H.chip('Payment plan', 'info')],
        ['Garden State Steel', 'Net 45', 'US$31,180', '', '', '', 'US$31,180', H.go('Statement', 'doc-statement', 'sm')],
      ], { sel: 0 }), '', true) +
      `<div class="grid2">${H.panel('Open invoices · Ardent Metals', H.table(['Invoice', 'Plant', 'Date', 'Due', { t: 'Amount', num: true }, 'Status'], [
        ['INV-24-0598', 'Caldari Road', 'Oct 24', 'Nov 23', '$31,940.00', H.chip('Due', '')],
        ['INV-24-0577', 'Jane Street', 'Oct 8', 'Nov 7', '$16,200.00', H.chip('12 days late', 'warn')],
        ['INV-24-0611', 'Caldari Road', 'Nov 21', 'Dec 21', '$16,210.00', H.chip('New', 'info')],
      ]), H.btn('Overdue reminder', 'sm'), true)}
      ${H.panel('Payment plan · Lakeshore Tube & Bar', H.table(['Due', { t: 'Amount', num: true }, 'Status'], [['Nov 15', '$2,000', H.chip('Paid', 'ok')], ['Dec 15', '$2,000', H.chip('Due', '')], ['Jan 15', '$2,000', H.chip('Due', '')], ['Feb 15', '$2,400', H.chip('Due', '')]]), H.btn('Edit plan', 'sm'), true)}</div>` +
      H.panel('Recent payments', H.table(['Date', 'Customer', 'Method', 'Applied to', { t: 'Amount', num: true }], [
        ['Nov 18', 'Ardent Metals', 'EFT', 'INV-24-0561', '$32,880.00'], ['Nov 15', 'Lakeshore Tube & Bar', 'Cheque', 'Payment plan 1 of 4', '$2,000.00'], ['Nov 10', 'Garden State Steel', 'Wire', 'INV-24-0540', 'US$30,410.00'],
      ]), '', true),
  });
})();
