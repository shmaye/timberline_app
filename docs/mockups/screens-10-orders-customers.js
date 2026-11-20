/* Orders (Incoming, Proposals, Orders, Pickups) and Customers (Accounts & plants, Contacts,
   Statements & payments), plus the import, PO-match and plant dialogs. */
(function () {
  const st = D.story;
  // room under a dialog so the dimmed page is at least as tall as the dialog
  const room = (f, px) => () => f() + `<div style="height:${px}px"></div>`;

  // ---------- shared bits ----------
  const truckTiles = (bf, lb, floor, note) => H.kpis([
    H.gauge('Board feet', `${n0(bf)} <small>/ ≈ 23,000 planned</small>`, bf / 230, `${Math.round(bf / 230)}% of this plant\'s planned load (D43)`, bf / 230 > 100 ? 'warn' : 'ok'),
    H.gauge('Weight, average', `${n0(lb)} <small>/ 45,000 lb</small>`, lb / 450, `could be ${n0(lb * 1.7 / 1.9)} to ${n0(lb * 2.1 / 1.9)} lb (species ± variance)`, lb > 45000 ? 'bad' : lb * 2.1 / 1.9 > 45000 ? 'warn' : 'ok'),
    H.gauge('Floor', `${floor}%`, floor, '53\' dry van, 2 high', floor > 100 ? 'bad' : floor > 92 ? 'warn' : 'ok'),
    H.gauge('Fills', note, null, 'whichever runs out first (D13)'),
  ]);

  const needRows = [
    ['DN-3331', '3x3 × 31"', 'Major', 2400, 1.9375, 3.7],
    ['DN-33375', '3x3 × 37½"', 'Major', 1800, 2.3438, 4.5],
    ['DN-33385', '3x3 × 38½"', 'Major', 1400, 2.4063, 4.6],
    ['DN-2339G', '2x3 × 39" grooved', '', 2100, 1.625, 3.1],
    ['DN-4448', '4x4 × 48"', '', 480, 5.3333, 10.1],
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
      ['ai', 'Two needs sheets from Dana: Caldari Road (5 lines, about 78% of a truck by weight) and Jane Street (2 lines, 41%). Jane Street is 8 miles away; it could ride on the Caldari Road load as a second drop.'],
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
      ${H.panel('2. Truck while importing', `<div style="padding:4px 0 0">${H.kpis([H.gauge('Board feet', `${n0(needBf)}`, needBf / 230, `${Math.round(needBf / 230)}% of the ≈ 23,000 planned (D43)`, 'ok'), H.gauge('Weight', `${n0(needLb)} lb`, needLb / 450, 'of 45,000 lb', 'ok')])}</div>`)}</div>` +
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
    intent: 'His own worksheet, as he works today: the customer\'s needs fitted to a full truck, with the internal order number on it. It shows % of a truck live (weight as light side, average and heavy side, D45), and offers the three moves from the notes: split into two loads, cut items, or top up with the plant\'s major sizes. It is the fast way in and works on a phone; the 3D planner is for confirming the load, not for getting started. The proposal is emailed back and waits for the customer\'s PO.',
    ref: 'Hand-off 4.1, 4.2 · D13, D16, D43, D45 · Review S7',
    check: ['Is "% of a truck" worked out from board feet, or by eye from experience?', 'When topping up, is it always the major sizes, or what the customer asks for?', 'How long does a proposal usually wait for the PO?'],
    assistant: ['Top up to a full truck, weighted to major sizes', 'Split into two loads with the gap the customer picks', 'Draft the email with the proposal attached'],
    html: () => H.head(`Orders › Proposals · ${st.proposal}`, `${st.customer} · ${st.plant}`, 'From needs sheet Nov-Dec.xlsx, received today 8:14',
      H.btn('Split into 2 loads') + H.btn('Cut items') + H.go('Plan in 3D', 'loads-planner', '', 'loads') + H.go('Send proposal', 'doc-proposal', 'primary', 'mail')) +
      H.stages(D.stages, 1) +
      truckTiles(21030, 39960, 61, 'Weight first') +
      `<div class="split">${H.panel('Lines', H.table(['Item', { t: 'Asked', num: true }, { t: 'Proposed', num: true }, { t: 'Change', num: true }, { t: 'Bundles', num: true }, { t: 'Bd ft', num: true }, ''],
        propLines, { foot: ['Total', '8,180', '9,160', '+980', '64+', '≈ 21,030', ''] }), H.btn('Add line', 'sm', 'plus'), true)}
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
  // Short order state (S3) + milestones derived from the job, the booking and the office requests.
  const MS = ['Job sent', 'Ready date', 'Truck booked', 'Loaded', 'Invoice requested', 'Invoice recorded', 'Delivered', 'Paid'];
  const msStrip = done => `<div class="btns" style="gap:4px">${MS.map((m, i) => `<span class="chip ${i < done ? 'ok' : i === done ? 'now' : ''}" title="${m}">${i < done ? '✓ ' : ''}${m}</span>`).join('')}</div>`;
  const msDots = done => `<span class="nowrap" title="${done} of ${MS.length} milestones">${MS.map((m, i) => `<span class="dot ${i < done ? 'ok' : i === done ? 'warn' : ''}" style="margin-right:3px"></span>`).join('')}</span> <span class="small muted">${done < MS.length ? MS[done] : 'Done'}</span>`;
  const state = { open: H.chip('Open', 'brand'), hold: H.chip('On hold', 'warn'), shipped: H.chip('Shipped', 'info'), deliv: H.chip('Delivered', 'ok'), closed: H.chip('Closed'), cancel: H.chip('Cancelled', 'bad') };
  const ordersPage = () => H.head('Orders', 'Orders', 'An order exists once the customer\'s PO matches the proposal. One order = one plant = one load (D40).', H.btn('Change order', '', 'plus') + H.go('Match a PO', 'dlg-pomatch', 'primary')) +
    H.kpis([
      H.gauge('Open orders', '7', null, '1 on hold'),
      H.gauge('Waiting on the office', '2', null, 'transport PO · invoice request', 'warn'),
      H.gauge('Re-tell after a change', '2', null, 'Rev 2 of 24-0318', 'warn'),
      H.gauge('Delivered, not paid', '3', null, '1 past due'),
    ]) +
    H.panel('Orders', H.filters(['*Open 7', 'On hold 1', 'Shipped', 'Delivered', 'Closed', 'Cancelled', 'Split loads']) + H.table(
      ['Order', 'Customer PO', 'Plant', 'Ship', { t: 'Bd ft', num: true }, { t: 'Value', num: true }, 'State', 'Milestones', 'Linked'],
      [
        [`${st.order} <span class="chip warn">Rev 2</span>`, 'PO 77815', 'Caldari Road, Concord', 'Dec 1', '21,030', '$32,310', state.open, msDots(1), 'L-2417'],
        ['24-0314', 'GSS-40412', 'Newark NJ', 'Nov 28', '20,950', 'US$31,180', state.open, msDots(2), 'Kessler'],
        ['24-0309', 'PO 77790', 'Caldari Road, Concord', 'Nov 21', '21,480', '$31,940', state.shipped, msDots(4), 'L-2409'],
        ['24-0305A', 'PO 77751', 'Jane Street, Vaughan', 'Nov 6', '11,200', '$16,200', state.deliv, msDots(7), 'Split 1 of 2'],
        ['24-0305B', 'PO 77751', 'Jane Street, Vaughan', 'Dec 2', '10,900', '$15,640', state.hold, msDots(0), '↔ 24-0305A (D16)'],
        ['24-0311', 'LTB-9921', 'Toronto (pickup)', 'Nov 25', '3,060', '$6,410', state.open, msDots(3), 'Pickup'],
        ['24-0298', 'PO 77702', 'Caldari Road, Concord', 'Oct 30', '21,900', '$32,880', state.closed, msDots(8), ''],
      ], { sel: 0 }), '', true) +
    `<div class="grid2">` +
    H.panel(`Order ${st.order} · milestones`, msStrip(1) + `<div class="small muted" style="margin-top:10px">Worked out from the job (J-1182), the booking (L-2417) and the requests to the office. Nothing here is typed by hand.</div>`) +
    H.panel(`Rev 2 · what changed`, H.table(['', 'Rev 1', 'Rev 2'], [
      ['Ship date', 'Tue Nov 24', 'Tue Dec 1'], ['3x3 × 37½"', '2,100 pcs', '2,520 pcs (+3 bundles)'], ['Reason', '', 'Dana asked for more 37½", Nov 19']]) +
      `<h4 style="font-size:13px;margin:14px 0 4px">Who must be re-told</h4><div class="list">
        <div class="li" style="padding-left:0;border-top:0">${H.box(true)}<div class="grow">Customer: order confirmation Rev 2 <span class="small muted">sent Nov 19</span></div></div>
        <div class="li" style="padding-left:0">${H.box(false)}<div class="grow">Subcontractor (Kessler): job sheet Rev 2</div>${H.go('Send', 'doc-jobsheet', 'sm')}</div>
        <div class="li" style="padding-left:0">${H.box(false)}<div class="grow">Office / carrier: new transport PO request (R-1041 superseded)</div>${H.go('Ask the office', 'office-requests', 'sm')}</div></div>`, H.btn('Change order', 'sm'), false) +
    `</div>` +
    `<div class="bottombar"><b>Order ${st.order}</b><span style="color:var(--rail-dim)">Rev 2 · 2 parties still to re-tell</span><span style="margin-left:auto" class="btns">${H.go('Order confirmation', 'dlg-email')}${H.go('Book the carrier', 'loads-bookings', 'primary')}${H.go('Send job to subcontractor', 'production-jobs')}</span></div>`;
  S({
    id: 'orders-orders', dept: 'orders', title: 'Orders', story: 5,
    intent: 'Every order with a short state (open, on hold, shipped, delivered, closed, cancelled) and its milestones: job sent, ready date, truck booked, loaded, invoice requested, invoice recorded, delivered, paid. The milestones are worked out from the job, the booking and his requests to the office, so an order can be at the subcontractor and waiting on the office at the same time. A change after the PO makes a new revision ("Rev 2"), shows what changed, and lists who must be re-told as tasks. One order = one plant = one load; a split load is two linked orders (D16, D40). (Proposed layout.)',
    ref: 'Hand-off 4.1, 4.6 · D16, D36, D40, D41 · Review S3, M5',
    check: ['Does every customer send a PO, or do some just say "go ahead"?', 'How often does an order change after the PO, and who do you call first?', 'Who decides which subcontractor gets the job: you or the office?'],
    assistant: ['Say where any order stands and what it is waiting on', 'After a change, draft the Rev 2 messages to the subcontractor, the office and the customer', 'Remind about split loads coming due'],
    html: ordersPage,
  });

  // ---------- dialog: PO match ----------
  S({
    id: 'dlg-pomatch', kind: 'dialog', dept: 'orders', tab: 'orders-orders', title: 'Match customer PO to proposal', story: 5,
    intent: 'The customer\'s PO is kept as its own record and laid next to the proposal it answers (one PO can feed several orders, D40). Prices are checked against the price list version in force on the PO date, not today\'s. The filler line is checked against the plant\'s over/under allowance, so the invoice will not come out above the PO. One click creates the order and its first tasks: the order confirmation to the customer and the transport PO request to the office.',
    ref: 'Hand-off 4.1 · D35, D40, D42 · Review S4, S14',
    check: ['How often does the PO differ from the proposal, and who wins: their PO or our proposal?', 'If the load comes out bigger than the PO (fillers), will their accounts payable pay it, or must they change the PO first?', 'Do customers send one PO per load, or one big PO you draw loads from?'],
    assistant: ['Read the PO PDF into lines', 'Explain each difference', 'Draft a note to the buyer about a difference'],
    under: ordersPage,
    html: () => H.dialog(`${st.po} ↔ ${st.proposal} · ${st.customer}, Caldari Road`,
      `<div class="form">${H.field('Customer PO', `${st.po} · Nov 19, 2026`, '', true)}${H.field('PO total', '$32,310.40', 'CAD', true)}${H.field('Price list in force on PO date', 'Ardent Caldari 2024-09 (v3)', '', true)}${H.field('Orders from this PO', `${st.order} (this one)`, '', true)}</div>` +
      H.callout('ok', '<b>5 of 6 lines match.</b> One price differs: their PO has last year\'s price for 4x4 × 48". Version v3 (in force Nov 19) says $4.25.') +
      H.table(['Item', { t: 'Proposal qty', num: true }, { t: 'PO qty', num: true }, { t: 'List v3 price', num: true }, { t: 'PO price', num: true }, 'Result'], [
        ['3x3 × 31"', '2,800', '2,800', '$1.53', '$1.53', H.chip('Match', 'ok')],
        ['3x3 × 37½"', '2,100', '2,100', '$1.85', '$1.85', H.chip('Match', 'ok')],
        ['3x3 × 38½"', '1,680', '1,680', '$1.90', '$1.90', H.chip('Match', 'ok')],
        ['2x3 × 39" grooved', '2,100', '2,100', '$1.36', '$1.36', H.chip('Match', 'ok')],
        ['4x4 × 48"', '480', '480', '$4.25', '$4.10', H.chip('Price differs', 'warn')],
        ['2x4 × 40" filler', 'as fit (2+)', '300 pcs', '$1.75', '$1.75', H.chip('Allowance ± 2 bundles', 'info')],
      ], { cls: ['', '', '', '', 'diff', ''] }) +
      H.callout('warn', '<b>Filler could push the invoice over the PO.</b> Their PO allows 300 pcs (2 bundles). This plant\'s allowance is ± 2 bundles, so up to 4 bundles (600 pcs, +$525) can be invoiced without a new PO. More than that needs Dana\'s OK first.') +
      `<div class="form">${H.field('Use for 4x4 × 48"', H.seg(['Our price $4.25', 'Their PO $4.10'], 0))}${H.field('Ship date', 'Dec 1 (both)', '', true)}${H.field('Order no.', st.order, '', true)}</div>` +
      `<h4 style="font-size:13px;margin:4px 0 0">Creating the order also creates</h4><div class="list">
        <div class="li" style="padding-left:0;border-top:0">${H.box(true)}<div class="grow">Order confirmation to Dana Ferreira <span class="small muted">draft, you send it</span></div></div>
        <div class="li" style="padding-left:0">${H.box(true)}<div class="grow">Transport PO request to the office for L-2417 <span class="small muted">draft (D35, D39)</span></div></div>
        <div class="li" style="padding-left:0">${H.box(true)}<div class="grow">Job for the subcontractor <span class="small muted">draft, asks for a ready date</span></div></div></div>`,
      H.btn('Cancel') + H.btn('Ask buyer about price') + H.go(`Create order ${st.order}`, 'orders-orders', 'primary'), true),
  });

  // ---------- Orders › Pickups ----------
  S({
    id: 'orders-pickups', dept: 'orders', title: 'Pickup orders',
    intent: 'Customers who send their own truck order regular items in a plain order. No load planning and no truck to book, but the subcontractor still gets a job and a release slip, the customer\'s driver signs, and the invoice is a request to the BB Pallets office using what was signed for (D36).',
    ref: 'Hand-off 4.1 (exception) · D36, D39',
    check: ['Which customers pick up, and do they book a time?', 'Is a pickup priced without freight?', 'Who signs for it at the yard, and how does the signed slip reach you?'],
    assistant: ['Turn an emailed pickup order into lines', 'Send the subcontractor the job and the release slip', 'Ask the office to invoice what was picked up'],
    html: () => H.head('Orders', 'Pickups', 'Plain orders from customers who send their own truck.', H.btn('New pickup order', 'primary', 'plus')) +
      H.panel('This week', H.table(['Pickup', 'Customer', 'Time', 'Yard', 'Lines', 'Status', ''], [
        ['24-0311', 'Lakeshore Tube & Bar · Toronto', 'Tue Nov 25, 9:00', 'Kessler, Concord', '2x3 × 39" grooved × 1,050 · 3x3 × 31" × 700', H.chip('Ready', 'ok'), H.go('Release slip', 'doc-packing', 'sm')],
        ['24-0316', 'Lakeshore Tube & Bar · Toronto', 'Thu Nov 27, 13:00', 'Kessler, Concord', '2x3 × 39" grooved × 2,100', H.chip('Job sent', 'info'), H.go('Job', 'production-jobs', 'sm')],
        ['24-0320', 'Ardent Metals · Jane Street', 'Fri Nov 28', 'BB yard', '3x3 × 31" × 280', H.chip('Job not sent', ''), H.btn('Send job', 'sm')],
      ]), '', true) +
      `<div class="grid2">${H.panel('Pickup 24-0311', H.form([H.field('Job', 'J-1186 · Kessler Wood Works', '', true), H.field('Driver', 'Lakeshore truck, plate TBD'), H.field('Signed by', '<span class="muted">at pickup</span>'), H.field('Bd ft', '3,060', '', true), H.field('Value', '$2,489.20', 'CAD', true), H.field('Invoice', '<span class="muted">not requested yet</span>', '', true)]) + `<div class="btns" style="margin-top:14px">${H.btn('Mark picked up')}${H.go('Ask the office to invoice', 'office-requests', 'primary')}</div>`)}
      ${H.callout('info', 'Pickup orders skip the proposal, the 3D planner and the truck booking. They still get a job for the subcontractor and a release slip; after pickup, the invoice is a request to the office, and you record its number.')}</div>`,
  });

  // ---------- Customers › Accounts & plants ----------
  const plantRows = [];
  D.customers.forEach(c => c.plants.forEach(p => plantRows.push([`<b>${c.name}</b><div class="small muted">${p.name} · ${p.city}</div>`, p.loadsYr, p.cur, p.mode === 'Pickup' ? H.chip('Pickup', 'brand') : 'Delivered', p.freight ? money(p.freight, 0) : '—', p.other ? money(p.other, 0) : '—', p.major.join('<br>'), p.id === 'ARD-VAU' ? H.chip('Late', 'warn') : H.chip('On track', 'ok')])));
  plantRows.push(['<b>Midland Bar & Tube</b><div class="small muted">Main plant · Midland ON</div>', '—', 'CAD', 'Delivered', '—', '—', '—', H.chip('Setup asked R-1035', 'warn')]);
  const accountsPage = () => H.head('Customers', 'Accounts & plants', 'Each plant has its own prices, volume, freight, receiving details and major sizes.', H.btn('Import customers', '', 'upload') + H.go('Ask the office to set up a customer', 'office-requests', 'primary', 'plus')) +
    H.kpis([H.gauge('Customers', '4', null, '5 plants · 1 being set up'), H.gauge('Loads this year', '41', null, 'Caldari Road 22'), H.gauge('Follow-ups', '3', null, 'late plant, unanswered, split due', 'warn'), H.gauge('USD plants', '1', null, 'Newark NJ')]) +
    H.panel('Plants', H.filters(['*All', 'Delivered', 'Pickup', 'CAD', 'USD', 'Follow-ups 3', 'Being set up 1']) + H.table(['Customer · plant', { t: 'Loads/yr', num: true }, 'Cur.', 'Ship', { t: 'Freight', num: true }, { t: 'Other', num: true }, 'Major sizes', 'Orders'], plantRows, { sel: 0 }), '', true) +
    `<div class="grid2">${H.panel('Follow-ups', `<div class="list">
      <div class="li" style="border-top:0">${H.dot('warn')}<div class="grow"><b>Jane Street, Vaughan is late</b><div class="small muted">Orders every 12 weeks; nothing in 15.</div></div>${H.btn('Draft email', 'sm')}</div>
      <div class="li">${H.dot('warn')}<div class="grow"><b>P-24-0312 Newark: no answer in 7 days</b><div class="small muted">Sent Nov 12 to Mike Russo.</div></div>${H.btn('Remind', 'sm')}</div>
      <div class="li">${H.dot('info')}<div class="grow"><b>Split load 24-0305B due Dec 2</b><div class="small muted">Second half of Jane Street order.</div></div>${H.go('Open', 'orders-orders', 'sm')}</div>
      <div class="li">${H.dot('warn')}<div class="grow"><b>Midland Bar & Tube: office setup asked Nov 12</b><div class="small muted">Request R-1035, no answer yet.</div></div>${H.go('Open', 'office-requests', 'sm')}</div></div>`, '', true)}
    ${H.panel('Ardent Metals · Caldari Road plant', H.form([H.field('Buyer', 'Dana Ferreira'), H.field('Price list', 'Ardent Caldari 2024-09 (v3)'), H.field('Receiving', 'Mon–Fri 7:00–15:00, no appointment'), H.field('Unloads', 'Side, forklift (flatbed or van)'), H.field('Filler allowance', '± 2 bundles'), H.field('Other costs', '$700 / load', 'D18'), H.field('Sales vs last year', '+8%', '', true), H.field('Average margin', '$2,940 / load', '', true)]) + `<div class="btns" style="margin-top:14px">${H.go('Edit plant', 'dlg-plant', 'primary')}${H.go('Price list', 'pricing-lists')}${H.go('Invoices & payments', 'customers-statements')}</div>`)}</div>`;
  S({
    id: 'customers-accounts', dept: 'customers', title: 'Accounts & plants',
    intent: 'Customers and their plants. Each plant carries its own price list, currency, volume, pickup or delivered, freight, major sizes, filler items, other costs per load, and the receiving details a carrier needs, because "almost no standard": the same item has different prices at plants 8 miles apart. A new customer or plant is set up by the BB Pallets office: here it is a request to the office (D36, D39), shown as "being set up" until they answer. Follow-ups catch a plant that is late on its usual order (proposed).',
    ref: 'Hand-off 3, 6 · D18, D26, D36, D39 · Review S15',
    check: ['Is the plant the right level for prices, or sometimes the customer?', 'What counts as "late" for a plant: a set number of weeks?', 'What does the office need from you to set up a new customer?'],
    assistant: ['How is Concord doing vs last year?', 'Which plants are late on their usual order?', 'Fill a new-customer request to the office from the buyer\'s email'],
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
    intent: 'Everything that makes a plant different in one place: where it ships, who buys, price list and currency, pickup or delivered, freight, major sizes for top-ups, filler items and how far the filler may go over the PO, other costs per load (D18), how often it orders, and what a carrier needs: receiving hours, appointment, how it unloads (forklift from the side or a dock), which trailers it takes, shutdown weeks. For US plants: delivery terms, who is the importer of record, and the customs broker (D26). The unloading side sets the planner\'s "Unloads from" (D34).',
    ref: 'Hand-off 6 · D18, D26, D34 · Review S4, S8, S15',
    check: ['Do customers tell you their receiving hours and which trucks they can unload?', 'For US plants: who is the importer of record, and who pays duty and the broker?', 'How far over the PO will each plant accept on the filler line?'],
    assistant: ['Fill the plant from an email signature or a PO', 'Suggest major sizes from past orders', 'Set "Unloads from" on the planner from this plant'],
    under: accountsPage,
    html: () => H.dialog('Garden State Steel · Newark plant',
      H.form([H.field('Plant name', 'Newark plant'), H.field('Ship-to', '410 Example Ave, Newark NJ 07105'), H.field('Buyer', 'Mike Russo'), H.field('Buyer email', 'm.russo@example.com'), H.field('Price list', 'GSS Newark 2024-10'), H.field('Currency', 'USD'), H.field('Ships', H.seg(['Delivered', 'Pickup'], 0)), H.field('Freight per load', '$3,400', 'Liberty Line'), H.field('Orders about every', '5', 'weeks'), H.field('Filler over/under', '± 2', 'bundles (D41, S4)')]) +
      H.panel('Receiving (for the carrier and the planner)', H.form([H.field('Receiving hours', 'Mon–Thu 6:00–14:00'), H.field('Appointment', 'Needed, 24 h ahead'), H.field('Unloads', H.seg(['Side, forklift', 'Dock (back)'], 1)), H.field('Accepts', '53\' dry van only'), H.field('Shutdown weeks', 'Dec 22 – Jan 2 · July 4 week')])) +
      `<div class="grid2">${H.panel('Major sizes (for top-ups)', `<div class="btns">${H.chip('3x3 × 37½" ✕', 'brand')}${H.chip('4x4 × 48" ✕', 'brand')}${H.btn('Add', 'sm', 'plus')}</div>`)}
      ${H.panel('Filler items', `<div class="btns">${H.chip('2x4 × 40" ✕', 'warn')}${H.btn('Add', 'sm', 'plus')}</div>`)}</div>` +
      H.panel('Other costs per load (D18)', H.table(['What', { t: 'Per load', num: true }, ''], [['Border wait time, average', '$250', H.btn('Remove', 'sm ghost')], ['Customer pallet tags', '$150', H.btn('Remove', 'sm ghost')]], { foot: ['Counts in margin and profit per load', '$400', ''] }), H.btn('Add cost', 'sm', 'plus'), true) +
      H.panel('Cross-border (D26, S8)', H.form([H.field('Delivery terms', 'Delivered, duty unpaid (to confirm)'), H.field('Importer of record', 'Garden State Steel (to confirm)'), H.field('Customs broker', 'Example Customs Brokers Inc.'), H.field('Broker email', 'entries@example-broker.com'), H.field('Duty and brokerage', 'Ask the broker · goes in the price build-up (D42)')])),
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

  // ---------- Customers › Invoices & payments (his tracker, D36) ----------
  const inv = [
    ['INV-24-0598', 'Ardent Metals · Caldari Road', '24-0309', '$31,940.00', 'Nov 23', H.chip('Not paid', ''), ''],
    ['INV-24-0577', 'Ardent Metals · Jane Street', '24-0305A', '$16,200.00', 'Nov 7', H.chip('Not paid · 12 days past due', 'warn'), H.btn('Nudge', 'sm')],
    ['INV 61022', 'Garden State Steel · Newark', '24-0314', 'US$31,180.00', 'Jan 2', H.chip('Not paid', ''), ''],
    ['INV-24-0561', 'Ardent Metals · Caldari Road', '24-0298', '$32,880.00', 'Nov 18', H.chip('Paid Nov 18', 'ok'), ''],
    ['—', 'Lakeshore Tube & Bar · Toronto', '24-0311', '$2,489.20', '', H.chip('Invoice asked of the office', 'info'), H.go('Request', 'office-requests', 'sm')],
  ];
  S({
    id: 'customers-statements', dept: 'customers', title: 'Invoices & payments', story: 12,
    intent: 'The last step of the order story: is it paid? The BB Pallets office invoices and keeps the books (D36), so this is only his tracker: the office\'s invoice number, the amount, the due date, and paid yes or no. When an invoice is past due he can send the buyer a friendly nudge from his own mailbox. No aging engine, no payment plans, no accounting.',
    ref: 'D36, D39 · Review S9, section 5 · Hand-off 6',
    check: ['Do you need to see payments, or only whether an invoice is paid?', 'How do you hear that a customer paid: from the office, or not at all today?', 'Do you chase late payers yourself, or does the office?'],
    assistant: ['Which of my invoices are past due?', 'Draft a friendly nudge to the buyer', 'Mark paid when the office\'s email says so'],
    html: () => H.head('Customers', 'Invoices & payments', 'Your tracker. The office invoices and keeps the books; you record their invoice number and whether it is paid.', H.btn('Excel', '', 'xls') + H.go('Statement for a customer', 'doc-statement')) +
      H.kpis([H.gauge('Not paid', '3', null, '$48,140 CAD + US$31,180'), H.gauge('Past due', '1', null, 'Jane Street, 12 days', 'warn'), H.gauge('Invoice not yet recorded', '1', null, 'Lakeshore pickup 24-0311', 'info'), H.gauge('Paid this month', '2', null, 'last Nov 18', 'ok')]) +
      H.panel('Invoices', H.filters(['*All', 'Not paid 3', 'Past due 1', 'Asked of the office 1', 'Paid']) + H.table(['Office invoice no.', 'Customer · plant', 'Order', { t: 'Amount', num: true }, 'Due', 'Paid?', ''], inv, { sel: 1 }), '', true) +
      `<div class="grid2">${H.panel('Mark as paid', H.form([H.field('Invoice', 'INV-24-0598'), H.field('Paid', H.seg(['No', 'Yes'], 1)), H.field('Date', 'Nov 20, 2026'), H.field('How you heard', 'Office email, Nov 20')]) + `<div class="small muted" style="margin-top:10px">A status only. Payments are entered in the office\'s accounting, not here.</div>`)}
      ${H.panel('Nudge · INV-24-0577', `<div class="small">"Hi Dana, a quick note that invoice INV-24-0577 for the Jane Street load ($16,200, due Nov 7) is still open on our side. Could you check where it stands? Thanks."</div><div class="btns" style="margin-top:12px">${H.go('Open in email', 'dlg-email', 'primary', 'mail')}${H.btn('Not now')}</div>`)}</div>`,
  });
})();
