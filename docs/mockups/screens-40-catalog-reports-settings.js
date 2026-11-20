/* Catalog, Reports, Settings, plus shared documents (proposal, invoice, statement, commercial invoice)
   and the shared dialogs (item editor, email, Assistant). */
(function () {
  const P = D.price, ST = D.story;
  const it = code => D.items.find(i => i.code === code);
  const plant = D.customers[0].plants[0];

  // ---------- proposal / invoice lines (Ardent Metals, Caldari Road) ----------
  const LINES = [
    { code: 'DN-2339G', bundles: 33, price: 1.36 },
    { code: 'DN-3331', bundles: 55, price: P.piece.quoted },
    { code: 'DN-33375', bundles: 33, price: 1.85 },
    { code: 'DN-2440', bundles: 11, price: 1.75, filler: true, loaded: 13 },
  ].map(l => { const i = it(l.code); return Object.assign({}, l, { i, pcs: l.bundles * i.perBundle, bf: l.bundles * i.perBundle * i.bf }); });
  const totBf = LINES.reduce((a, l) => a + l.bf, 0);
  const totAmt = LINES.reduce((a, l) => a + l.pcs * l.price, 0);

  // ---------- simplified pages drawn under documents/dialogs ----------
  const underProposals = () => H.head('Orders › Proposals', 'Proposal ' + ST.proposal, ST.customer + ' · ' + ST.plant, H.btn('Edit') + H.btn('Email', 'primary', 'mail')) +
    H.kpis([H.gauge('Truck', Math.round(totBf / 230) + '%', totBf / 230, 'of the planned load (D43)', 'ok'), H.gauge('Board feet', n0(totBf), totBf / 230, 'of ≈ 23,000 planned', 'ok'), H.gauge('Value', money(totAmt, 0), null, 'CAD')]) +
    H.panel('Lines', H.table(['Item', { t: 'Bundles', num: 1 }, { t: 'Pieces', num: 1 }], LINES.map(l => [l.i.name, l.bundles, n0(l.pcs)])), '', true);
  const underOrders = () => H.head('Orders › Orders', 'Order ' + ST.order, ST.customer + ' · ' + ST.plant, H.btn('Invoice', 'primary')) + H.stages(D.stages, 5) +
    H.panel('Loaded quantities', H.table(['Item', { t: 'Ordered', num: 1 }, { t: 'Loaded', num: 1 }], LINES.map(l => [l.i.name, n0(l.pcs), n0(l.filler ? l.loaded * l.i.perBundle : l.pcs)])), '', true);
  const underCatalog = () => H.head('Catalog', 'Items', '', H.btn('New item', 'primary', 'plus')) + H.panel('', H.table(['Code', 'Name', 'Type'], D.items.map(i => [i.code, i.name, i.type])), '', true);
  const underStatements = () => H.head('Customers › Statements & payments', 'Statements', '', H.btn('Send all overdue', 'primary', 'mail')) + H.panel('', H.table(['Customer', { t: 'Balance', num: 1 }], [['Ardent Metals', money(48210.55)], ['Garden State Steel', 'US' + money(31420)]]), '', true);
  const underBol = () => H.head('Loads › Bills of lading', 'L-2422 · Garden State Steel, Newark NJ', 'US load · customs broker on file', H.btn('BOL') + H.btn('Customs papers', 'primary'));

  // =====================================================================
  // CATALOG
  // =====================================================================
  S({
    id: 'catalog-items', dept: 'catalog', title: 'Catalog items',
    intent: 'BB Pallets keeps its own catalog: add, edit and retire items in the app. Board feet per piece is worked out from the size, and the bundle size and weight feed the 3D load planner. Day one is loaded from their Excel list.',
    ref: 'Hand-off 5, D6, D10',
    check: ['Do item codes exist today, or do we make them up?', 'Is weight per piece known, or should we use weight per board foot by species?', 'How many pieces go in a bundle for each size, and is it always the same?'],
    assistant: ['Add an item from a sentence: "new 3x3 by 40 inch, grooved"', 'Find items nobody ordered in a year and offer to retire them', 'Import the catalog from their spreadsheet'],
    html: () => H.head('Catalog', 'Items', D.items.length + ' active · board feet per piece calculated from the size', H.btn('Import from Excel', '', 'upload') + H.go('New item', 'dlg-item', 'primary', 'plus')) +
      H.filters(['*All types', 'Cut dunnage', 'Grooved', 'Pallets', 'Retired']) +
      H.panel('', H.table(['Code', 'Name', 'Français', 'Type', { t: 'T × W × L', num: 1 }, { t: 'Bd ft / pc', num: 1 }, { t: 'Pcs / bundle', num: 1 }, { t: 'Lb / pc', num: 1 }, 'Cut from', 'Image'],
        D.items.map(i => [`<a href="#dlg-item">${i.code}</a>`, i.name + (i.grooved ? ' ' + H.chip('grooved', 'brand') : ''), i.type === 'Pallet' ? 'Palette 48×40' : i.name.replace('×', '×'), i.type, i.t ? `${i.t} × ${i.w} × ${i.l}"` : 'parts', i.bf.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''), i.perBundle, i.lbPc.toFixed(1), `<span class="small">${i.from}</span>`, '<span class="small muted">later</span>']), { sel: 1 }), '', true) +
      H.callout('info', 'Board feet per piece = thickness × width × length ÷ 144. For 3x3 × 31": 3 × 3 × 31 ÷ 144 = <b>1.9375</b>.'),
  });
  S({
    id: 'dlg-item', dept: 'catalog', tab: 'catalog-items', kind: 'dialog', title: 'Item editor',
    intent: 'One form holds everything about an item: size, board feet, grooving, which stock lengths it is cut from and how much is wasted, weight, and the bundle the 3D planner draws. The image slot is there from day one and gets used later.',
    ref: 'Hand-off 5, D6, D21',
    check: ['Which stock lengths give the best yield for each size (e.g. 2x3 × 39" from 10\', 7\' or 12\')?', 'Are offcuts like the 24" from a 12\' kept as their own item?', 'What does a bundle measure for each size?'],
    assistant: ['Fill in yield and waste for each stock length', 'Suggest the French name', 'Warn when the weight looks wrong for the size'],
    under: underCatalog,
    html: () => {
      const i = it('DN-2339G');
      return H.dialog('Edit item · ' + i.code + ' · ' + i.name,
        H.form([H.field('Name', i.name), H.field('Code', i.code), H.field('French name', '2x3 × 39 po rainuré'), H.field('Type', 'Grooved ▾')]) +
        H.form([H.field('Thickness', '2', 'in'), H.field('Width', '3', 'in'), H.field('Length', '39', 'in'), H.field('Board feet per piece', '1.625', '= 2 × 3 × 39 ÷ 144', true)]) +
        `<div class="btns">${H.box(true)} Grooved (costs more to make) &nbsp; ${H.toggle(true)} Active</div>` +
        `<div><div class="small muted" style="margin-bottom:6px">Stock lengths it can be cut from</div>` + H.table(['Stock length', { t: 'Pieces', num: 1 }, { t: 'Waste', num: 1 }, 'Leftover', 'Best'], [
          ['10\' (120")', 3, '3"', '—', H.chip('best', 'ok')], ['7\' trim (84")', 2, '6"', '—', ''], ['12\' (144")', 3, '—', '27" offcut → item DN-2427 (usable)', H.chip('offcut', 'warn')]]) + '</div>' +
        H.form([H.field('Pieces per bundle', '210', '14 across × 15 high'), H.field('Bundle size', '39 × 42 × 30', 'in (L × W × H)'), H.field('Species', 'SPF dry · 1.90 ± 0.20 lb / bd ft'), H.field('Weight per piece', '3.09', 'lb (2.76–3.41), from species', true), H.field('Weight per bundle', '648', 'lb (580–716)', true)]) +
        `<div class="grid2"><div class="drop" style="padding:16px">Image (later): drop a photo of the bundle</div>${H.callout('info', 'The 3D planner draws this bundle as a 39" × 42" × 30" box. It can go across the trailer or lengthwise.')}</div>`,
        H.btn('Retire item', 'danger') + '<span style="flex:1"></span>' + H.btn('Cancel') + H.btn('Save', 'primary'), true);
    },
  });
  S({
    id: 'catalog-pallets', dept: 'catalog', title: 'Pallets (parts lists)',
    intent: 'A pallet is built from cut pieces. Its parts list rolls up board feet, cost and weight, so a pallet is priced the same way as dunnage: from cost per MBF.',
    ref: 'Hand-off 5 (pallets)',
    check: ['Which pallets do they make, and who builds them (which subcontractor)?', 'Is assembly paid per pallet on top of the per-MBF rate?', 'Are pallets heat treated (ISPM-15) for any customer?'],
    assistant: ['Build a parts list from a description', 'Show what a pallet costs at today\'s lumber price'],
    html: () => H.head('Catalog › Pallets', 'Pallet 48×40 · PL-4840', 'Parts list → board feet, cost and weight roll up', H.btn('Duplicate') + H.btn('Save', 'primary')) +
      `<div class="split">` + H.panel('Parts list', H.table(['Part', 'Size', { t: 'Qty', num: 1 }, { t: 'Bd ft', num: 1 }, { t: 'Cost', num: 1 }], [
        ['Deck board', '1x6 × 48"', 7, '14.00', money(7.29)], ['Bottom board', '1x6 × 48"', 3, '6.00', money(3.12)], ['Stringer', '2x4 × 40"', 3, '6.67', money(3.47)], ['Nails, assembly', 'per pallet', 1, '—', money(4.50)]], { foot: ['Total', '', '', '26.67', money(18.38)] }), H.btn('Add part', 'sm', 'plus'), true) +
      H.panel('Roll-up', H.form([H.field('Board feet', '26.67', 'per pallet', true), H.field('Weight', '48', 'lb', true), H.field('Delivered cost', money(18.38), 'per pallet', true), H.field('Price (Pinegrove list)', money(23.50), '', false)]) +
        '<div style="margin-top:12px">' + H.callout('info', 'Pallets stack 12 high in the 3D planner (66" tall).') + '</div>') + `</div>`,
  });
  S({
    id: 'catalog-lengths', dept: 'catalog', title: 'Stock lengths',
    intent: 'The raw lumber they buy, by size and length, with the yield into the sizes customers buy. This is what the batch calculator and the count sheets use.',
    ref: 'Hand-off 4.4, D20, D23',
    check: ['Which lengths do they buy most?', 'Is 10\' always the comparison count, or does it change by size?'],
    assistant: ['Show which customer sizes each length is best for', 'Flag lengths with poor yield for this month\'s orders'],
    html: () => H.head('Catalog › Stock lengths', 'Stock lengths', 'Raw lumber by size and length · yield into the sizes customers buy', H.btn('Add length', 'primary', 'plus')) +
      H.panel('', H.table(['Stock', { t: 'Bd ft / pc', num: 1 }, '3x3 × 31"', '2x3 × 39"', '3x3 × 37½"', 'Leftover', { t: 'Last paid / MBF', num: 1 }], [
        ['2x3 × 7\' trim', '3.50', '—', '2 pcs · 6" waste', '—', '—', '$440'],
        ['2x3 × 8\'', '4.00', '—', '2 pcs · 18"', '—', '18"', '$545'],
        ['2x3 × 10\'', '5.00', '—', H.chip('3 pcs · 3"', 'ok'), '—', '—', '$545'],
        ['2x3 × 12\'', '6.00', '—', '3 pcs + 27"', '—', H.chip('27" offcut', 'warn'), '$475'],
        ['3x3 × 10\'', '7.50', H.chip('3 pcs · 27"', 'ok'), '—', '3 pcs · 7½"', '—', '$520'],
        ['3x3 × 12\'', '9.00', '4 pcs · 20"', '—', '3 pcs · 31½"', '31½" = one more 31"?', '$510'],
        ['4x4 × 8\'', '10.67', '—', '—', '—', '—', '$610']]), '', true),
  });

  // =====================================================================
  // REPORTS
  // =====================================================================
  S({
    id: 'reports-operations', dept: 'reports', title: 'Operations reports',
    intent: 'A weekly look back for him: open orders and where each stands, the load schedule with split loads coming due, stock on hand against what is committed, and lumber paid against the market. Most of what he needs each morning is on <a href="#today">Today</a> instead; this page is for the week as a whole. (proposed)',
    ref: 'Hand-off 9 · D46 · Review "What can wait"',
    check: ['Which of these does he look at every week, beyond Today?', 'Does the office want a copy of any of it?'],
    assistant: ['"What ships this week?"', '"Which proposals have had no PO for more than a week?"'],
    html: () => H.head('Reports › Operations', 'This week', 'Week of Nov 16, 2026', H.go('Today', 'today', '', 'today') + H.docActions()) +
      H.callout('info', 'Day to day, the same information is on <b>Today</b> as tasks and waiting-on items. This page is the weekly summary.', H.go('Open Today', 'today', 'sm')) +
      H.kpis([H.gauge('Open orders', '14', null, '3 waiting on a PO'), H.gauge('Loads this week', '6', null, '1 split load due Thu'), H.gauge('On hand', '412,600 <small>bd ft</small>', null, '186,000 committed'), H.gauge('Lumber vs market', '−$22 <small>/ MBF</small>', null, 'Bought below this week\'s price', 'ok')]) +
      `<div class="grid2">` + H.panel('Open orders by milestone', H.table(['Milestone', { t: 'Orders', num: 1 }, 'Oldest'], [['Needs sheet received', 2, '3 days'], ['Proposal sent, no PO', 3, H.chip('9 days', 'warn')], ['Truck not booked yet', 2, '1 day'], ['At subcontractor', 4, '2 days'], ['Loaded, invoice not requested', 1, '1 day'], ['Invoice requested from office', 2, '2 days']]), H.go('Open orders', 'orders-orders', 'sm'), true) +
      H.panel('Load schedule', H.table(['Day', 'Load', 'Plant', 'Carrier'], [['Mon', 'L-2417', 'Caldari Road, Concord', 'Trans-Ontario ' + H.chip('confirmed', 'ok')], ['Tue', 'L-2414', 'Toronto plant ' + H.chip('pickup'), '—'], ['Thu', 'L-2419', 'Newark NJ', 'Liberty Line ' + H.chip('changed', 'bad')], ['Thu', 'L-2421', 'Jane Street ' + H.chip('split 2 of 2', 'info'), H.chip('asked office', 'warn')], ['Fri', 'L-2420', 'Caldari Road, Concord', 'Trans-Ontario ' + H.chip('$2,450', 'warn')]]), '', true) + `</div>` +
      `<div class="grid2">` + H.panel('On hand vs committed (MBF)', H.bars([{ label: '2x3', value: 120, value2: 74 }, { label: '3x3', value: 168, value2: 88 }, { label: '2x4', value: 64, value2: 16 }, { label: '4x4', value: 41, value2: 8 }, { label: 'Offcuts', value: 19, value2: 0 }]) + '<div class="small muted">Inventory is phase two (D44).</div>') +
      H.panel('Lumber paid vs market ($/MBF)', H.lines(['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], [{ name: 'Market', values: [560, 555, 548, 545, 545, 540], color: 'var(--line-2)', dash: 1 }, { name: 'Paid', values: [540, 520, 530, 510, 500, 518] }])) + `</div>`,
  });
  S({
    id: 'reports-money', dept: 'reports', title: 'Money reports',
    intent: 'His own margin view, load by load and plant by plant, compared line by line with the price build-up each price was made from (D42): lumber planned vs what it really cost, freight planned vs the carrier\'s confirmed price (D35), board feet loaded vs the planned board feet per load (D43), and the rounding line. Then buying gains on usable board feet, and sales by plant against last year. Commission is shown only if he wants it. These are his figures for judging customers, not the company\'s books (D36).',
    ref: 'Hand-off 4.3, 4.4, 9 · D35, D36, D42, D43 · Review M7, S6',
    check: ['Is margin per load the number he judges a customer by?', 'Does he want his commission tracked here (section 12)?', 'Should "other costs" per load be split into named lines?'],
    assistant: ['"How\'s Concord doing vs last year?"', '"Why did L-2420 make less than planned?" (explains it line by line)', '"What did the last Toronto load make?"'],
    dock: H.assistant([['me', 'Why did L-2420 make less than planned?'], ['ai', 'Three lines: freight was $2,450 (carrier\'s confirmed price) instead of $2,300, −$150. The truck carried 20,950 bd ft against 23,000 planned, so the per-load costs were spread over fewer feet, −$260. Lumber went in at $510 instead of $500 planned, −$231. Margin $2,359 against $3,000.'], ['propose', 'Email this summary to you every month-end']]),
    html: () => H.head('Reports › Money', 'October 2026', 'His margin view · costs and margins visible only to people an admin allows (D28)', H.docActions()) +
      H.kpis([H.gauge('Margin per load', '$2,640', 88, 'avg of 23 loads · plan $3,000 (incl. $300 rounding)', 'ok'), H.gauge('Buying gains', '$9,350', null, 'on usable board feet · 8.5 loads', 'ok'), H.gauge('Freight vs plan', '+$1,050', null, '7 loads over the $2,300 planned', 'warn'), H.gauge('Board feet per load', '21,480', 93, 'avg loaded · 23,000 planned (D43)', 'warn')]) +
      H.panel('Load L-2420 · planned vs actual, line by line', H.table(['Line', 'Basis', { t: 'Planned', num: 1 }, { t: 'Actual', num: 1 }, { t: 'Effect on the load', num: 1 }], [
        ['Lumber', 'per MBF', '$500.00', '$510.00 avg cost', H.chip('−$231', 'warn')],
        ['Subcontractor labor', 'per MBF', '$135.00', '$135.00', '$0'],
        ['Waste 5%', '% of lines above', '$31.75', '$32.25', H.chip('−$12', 'warn')],
        ['Freight', 'per load', '$2,300', '$2,450 confirmed', H.chip('−$150', 'bad')],
        ['Board feet on the truck', 'per load', '23,000', '20,950 loaded', H.chip('−$260', 'warn')],
        ['Other costs (Caldari Road)', 'per load', '$700', '$700', '$0'],
        ['Rounding ($300 + per-piece cents)', 'rounding', '$412', '$412', '$0'],
      ], { foot: ['Margin', '', '$3,000', '$2,359', '−$641'] }), H.seg(['This load', 'Average, October'], 0), true) +
      `<div class="grid2">` + H.panel('Margin per load by plant (actual vs plan)', H.bars([{ label: 'Caldari', value: 2880, value2: 3000 }, { label: 'Jane St', value: 1950, value2: 2000 }, { label: 'Toronto', value: 2300, value2: 2000 }, { label: 'Newark', value: 3150, value2: 3000 }]) + '<div class="small muted">Grey: planned · green: actual</div>') +
      H.panel('Sales by plant vs last year', H.table(['Plant', { t: 'This year', num: 1 }, { t: 'Last year', num: 1 }, { t: 'Change', num: 1 }], [['Caldari Road, Concord', '$612,400', '$680,100', H.chip('−10%', 'warn')], ['Jane Street, Vaughan', '$118,200', '$102,900', H.chip('+15%', 'ok')], ['Toronto plant', '$371,000', '$355,500', H.chip('+4%', 'ok')], ['Newark NJ (USD)', 'US$298,000', 'US$240,700', H.chip('+24%', 'ok')]]), '', true) + `</div>` +
      `<div class="grid2">` + H.panel('Freight by carrier (confirmed prices)', H.table(['Carrier', 'Role', { t: 'Loads', num: 1 }, { t: 'Avg confirmed', num: 1 }, { t: 'vs plan $2,300', num: 1 }], [['Trans-Ontario Freight', 'Cheapest', 18, '$2,060', H.chip('−$240', 'ok')], ['Bluewater Carriers', 'Backup', 5, '$2,550', H.chip('+$250', 'warn')], ['Liberty Line (US)', 'US loads', 3, 'US$3,400', '—']]), '', true) +
      H.panel('Commission', `<div class="small muted">Off. Turn it on if he wants his commission worked out from these margins (a question for BB Pallets).</div><div class="btns" style="margin-top:8px">${H.toggle(false)}<span class="small">Show my commission</span></div>`) + `</div>`,
  });
  S({
    id: 'reports-scheduled', dept: 'reports', title: 'Scheduled reports',
    intent: 'Any report can be emailed on a schedule, as PDF and Excel, from his own mailbox. <b>This can wait for version 2</b>: for one salesperson most of it is the Today list. When it comes, sends go through a queue, and a failed send (for example a mailbox that needs reconnecting) shows on Today instead of being lost. (proposed)',
    ref: 'Hand-off 8, 9 · Review S10, "What can wait"',
    check: ['Which reports, if any, should arrive automatically, and to whom (him, the office)?'],
    assistant: ['Set up a schedule from a sentence: "send me margins every month-end" (version 2)'],
    html: () => H.head('Reports › Scheduled', 'Scheduled reports', 'Sent from your own mailbox, as PDF and Excel', H.chip('Version 2 · can wait', 'warn') + ' ' + H.btn('New schedule', 'primary', 'plus')) +
      H.callout('info', '<b>Not in the first version.</b> Day to day, Today already lists what is due, what you are waiting on and what to review. Shown here so the idea is not lost.', H.go('Open Today', 'today', 'sm')) +
      H.panel('', H.table(['Report', 'When', 'To', 'Format', 'Last sent', ''], [
        ['Weekly summary (operations)', 'Mondays 7:00', 'Me', 'PDF', '—', H.toggle(false)],
        ['Margin per load & plant', 'Last day of month', 'Me', 'PDF + Excel', '—', H.toggle(false)],
        ['Stock count summary (phase two)', 'After each count', 'BB Pallets office', 'Excel', '—', H.toggle(false)]]), '', true) +
      H.callout('warn', 'If a scheduled send fails (mailbox disconnected, sending limit reached), it waits in a queue and a "reconnect your mailbox" task appears on Today.'),
  });

  // =====================================================================
  // SETTINGS
  // =====================================================================
  const areas = ['Orders', 'Loads', 'Production', 'Purchasing', 'Inventory', 'Pricing', 'Customers', 'Catalog', 'Reports', 'Settings'];
  S({
    id: 'settings-users', dept: 'settings', title: 'Users & access',
    intent: 'One person uses Timberline today: the BB Pallets salesperson (D36). It is still built for more from day one, so the office can join later (D37): the roles <b>salesperson</b>, <b>office</b> and <b>admin</b> exist now, and every record keeps who did what, including "recorded by him on behalf of the office". Each person gets view, read or write per department. Costs and margins are hidden unless the admin turns them on for that person (D28).',
    ref: 'D27, D28, D36, D37 · Review section 5, section 6 (Organization, User, Role)',
    check: ['Who is the admin: the account owner (to confirm)?', 'When the office joins, who in the office should see costs and margins?', 'Will subcontractors ever log in, or only get emails?'],
    assistant: ['Explain what a person can and cannot see', 'Turn the Assistant on or off for a person'],
    html: () => H.head('Settings › Users & access', 'Users & access', 'One user today · roles ready for the office', H.btn('Testing mode: off') + H.btn('Invite person', 'primary', 'plus')) +
      `<div class="split">` + H.panel('People', H.table(['Name', 'Role', 'Costs & margins', 'Assistant', 'Last in'], [
        ['Salesperson (BB Pallets)', 'Salesperson', H.toggle(true), H.toggle(true), 'Today'],
        ['Account owner', 'Admin ' + H.chip('to confirm', 'warn'), H.toggle(true), H.toggle(false), 'Nov 18'],
        ['BB Pallets office', 'Office ' + H.chip('later', 'info'), H.toggle(false), H.toggle(false), '—']], { sel: 0 }), '', true) +
      H.panel('Roles', H.table(['Role', 'What it is for'], [
        [H.chip('Salesperson', 'brand'), 'His orders, loads, buying, inventory and requests to the office. Everything he does today.'],
        [H.chip('Office', 'info'), 'Answers requests in Timberline instead of by email: transport POs, approvals, invoices (D37). Not used yet.'],
        [H.chip('Admin'), 'Adds people, sets access, turns costs and margins on per person. One admin to start.']]) +
        '<div style="padding:12px 18px">' + H.callout('warn', '<b>Costs and margins are off by default</b> for every new person. The admin turns them on one person at a time.') + '</div>', '', true) + `</div>` +
      H.panel('Salesperson: access by department', H.table(['Area', 'None', 'View', 'Read', 'Write'], ['Today', 'Orders', 'Loads', 'Office requests', 'Production', 'Purchasing', 'Inventory', 'Pricing', 'Customers', 'Catalog', 'Reports', 'Settings'].map(a => { const lvl = a === 'Settings' ? 1 : 3; return [a, ...[0, 1, 2, 3].map(k => k === lvl ? '●' : '<span class="muted">○</span>')]; })), '', true),
  });
  S({
    id: 'settings-email', dept: 'settings', title: 'Email & calendar',
    intent: 'Timberline sends from his own mailbox and <b>reads his inbox</b> (D38), so every reply lands on the right order, request or booking and Today can say what it means (D46). Outlook.com (Hotmail) is connected first, together with its calendar; Gmail comes later because reading Gmail needs Google\'s review. Every sent and matched message is stored in Timberline, which is also what lets the office take over later (D37). Personal mailboxes have daily sending limits and sign-ins expire, so failures show on Today as "reconnect your mailbox" instead of being lost.',
    ref: 'Hand-off 8 · D30, D37, D38, D46 · Review M3, S10',
    check: ['Is his business email a personal Hotmail/Gmail address or a BB Pallets address?', 'Which office address handles each kind of request?', 'Does BB Pallets want a shared company address later?'],
    assistant: ['Write a template for a document type', 'Show emails exchanged with a customer this month', 'Tell you when the mailbox needs reconnecting'],
    html: () => H.head('Settings › Email & calendar', 'Email & calendar', 'Your own mailbox · read and send · replies matched to their thread', '') +
      `<div class="grid2">` + H.panel('Mailbox and calendar', `<div class="list">` +
        `<div class="li" style="border-top:0">${H.dot('ok')}<div class="grow"><b>sales.bbpallets@hotmail.com</b><div class="small muted">Outlook.com (Microsoft) · connected Nov 3 · reads and sends · last checked 2 min ago</div></div>${H.btn('Disconnect', 'sm')}</div>` +
        `<div class="li">${H.toggle(true)}<div class="grow"><b>Timberline reads your inbox</b><div class="small muted">Replies to anything Timberline sent, plus customer sheets and POs, are matched and read for you (D38)</div></div></div>` +
        `<div class="li">${H.dot('ok')}<div class="grow"><b>Outlook calendar</b><div class="small muted">Shown on Today with Timberline's dates; ship days can be added to it (D46)</div></div>${H.btn('Settings', 'sm')}</div>` +
        `<div class="li">${H.dot()}<div class="grow"><b>Gmail and Google Calendar</b><div class="small muted">Later: reading Gmail needs Google's security review first</div></div>${H.chip('Later', 'info')}</div></div>`, '', true) +
      H.panel('How replies are matched', `<div class="small">Every request carries a short reference in its subject, e.g. <b>[TL-R-1041] Transport PO · L-2421</b>. Mail is sent as "create a draft, then send", so the message and thread ids come back and every reply is matched to its record. A copy of each sent and matched message is kept in Timberline.</div>` +
        `<div style="margin-top:12px">${H.kpis([H.gauge('Sent today', '23', 8, 'of about 300 a day (Outlook.com limit)', 'ok'), H.gauge('Waiting to send', '0', null, 'queue')])}</div>` +
        H.callout('warn', 'If the mailbox signs out (password change, long inactivity), sending pauses and <b>"Reconnect your mailbox"</b> appears at the top of Today.')) + `</div>` +
      `<div class="grid2">` + H.panel('BB Pallets office: who gets which request', H.table(['Request type', 'Sent to', 'Done by'], [
        ['Transport PO', 'dispatch@bbpallets (example)', 'Office, by email'], ['Purchase approval', 'accounts@bbpallets (example)', 'Office, by email'], ['Invoice / credit note', 'accounts@bbpallets (example)', 'Office, by email'], ['New customer or supplier', 'office@bbpallets (example)', 'Office, by email']]), H.go('Office requests', 'office-requests', 'sm'), true) +
      H.panel('Signature', `<div class="input" style="min-height:110px;align-items:flex-start">Sales, BB Pallets<br>${D.company.phone}<br>${D.company.addr}</div>`) + `</div>` +
      H.panel('Templates', H.table(['Document', 'Subject', 'Attaches', 'Usually to'], [
        ['Load proposal', 'Load proposal {order} · {plant}', 'PDF + Excel', 'Customer buyer'], ['Transport PO request', '[{ref}] Transport PO · {load}', 'PDF', 'BB Pallets office'], ['Purchase approval', '[{ref}] Approval · {supplier}', 'Offer PDF', 'BB Pallets office'], ['Invoice request', '[{ref}] Invoice · order {order}', 'PDF', 'BB Pallets office'], ['Subcontractor job', 'Job {job} · {plant} · ship {date}', 'Job sheet, packing slip', 'Subcontractor'], ['Payment nudge', 'Open invoices · {customer}', 'PDF', 'Customer AP']]), H.btn('New template', 'sm', 'plus'), true),
  });
  S({
    id: 'settings-trailers', dept: 'settings', title: 'Trailer types',
    intent: 'The trailer catalog the 3D planner picks from. Each type has its size, axles, weight limit and board-foot limit; the planner warns on whichever runs out first. Includes a B-train with two decks.',
    ref: 'D13, D14, D31',
    check: ['Real inside sizes and weight limits for each trailer they use (open question B7)', 'Does the weight limit change by season or by province/state?'],
    assistant: ['Add a trailer type from its spec sheet', 'Explain why a load is over on one trailer and fine on another'],
    html: () => H.head('Settings › Trailer types', 'Trailer types', 'Used by the 3D planner · the first limit reached decides', H.btn('Add trailer', 'primary', 'plus')) +
      H.panel('', H.table(['Trailer', 'Length', 'Width', 'Height', 'Axles', { t: 'Weight limit (lb)', num: 1 }, { t: 'Bd ft plan', num: 1 }, ''], D.trailers.map(t => [t.name + (t.name.startsWith('B-train') ? ' ' + H.chip('2 decks', 'info') : ''), t.l, t.w, t.h, t.axles, t.lb, t.bf, H.btn('Edit', 'sm')])), '', true) +
      H.callout('warn', 'All sizes and limits are examples until BB Pallets confirms them.'),
  });
  S({
    id: 'settings-carriers', dept: 'settings', title: 'Carriers',
    intent: 'Carriers in order of preference, cheapest first, then the backup, with their usual rate per destination. He uses these to fill the transport PO request to the office (D35, D36); the carrier\'s confirmed price is what goes into each load\'s margin. Freight per load also feeds the price builder ($2,300 planned, between the $2,000 carrier and the $2,500–2,600 backup).',
    ref: 'Hand-off 4.3, 6 · D35, D36',
    check: ['Is freight per destination, and who pays it (open question C15)?', 'Does he pick the carrier and price, or does the office?'],
    assistant: ['Draft the transport PO request to the office with the usual carrier and rate', 'Show how often the backup was used and what it cost'],
    html: () => H.head('Settings › Carriers', 'Carriers', 'Preference order: first is tried first', H.btn('Add carrier', 'primary', 'plus')) +
      `<div class="split">` + H.panel('Preference', H.table(['#', 'Carrier', 'Role', { t: 'Concord', num: 1 }, { t: 'Vaughan', num: 1 }, { t: 'Newark NJ', num: 1 }, 'Used'], D.carriers.map((c, i) => [i + 1, c.name, c.role, i < 2 ? money(c.rate, 0) : '—', i < 2 ? money(c.rate - 200, 0) : '—', i === 2 ? 'US' + money(c.rate, 0) : '—', c.used])), '', true) +
      H.panel('Trans-Ontario Freight', H.form([H.field('Contact', 'Dispatch'), H.field('Email', 'dispatch@trans-ontario.example'), H.field('Phone', '905-555-0144'), H.field('Reliability', 'Good · 1 late in 18')]) +
        `<div style="margin-top:12px">${H.callout('info', 'Bookings go through the office: the transport PO request uses this carrier and rate.', H.go('Carrier bookings', 'loads-bookings', 'sm'))}</div>`) + `</div>`,
  });
  S({
    id: 'settings-taxes', dept: 'settings', title: 'Currency',
    intent: 'Prices in the customer\'s currency (CAD or USD), costs in CAD, and the exchange rate used to compare them. <b>Sales tax is not worked out here</b>: the office invoices (D36), so an invoice request carries amounts before tax and the office\'s total is recorded when the invoice comes back. A tax table comes in only when the office switches over (D37).',
    ref: 'Hand-off 7 · D9, D36, D37 · Review S9',
    check: ['Which customers are billed in USD (F28)?', 'Where should the exchange rate come from: the bank, or a rate he types in?'],
    assistant: ['Show a USD price in CAD at today\'s rate'],
    html: () => H.head('Settings › Currency', 'Currency', 'Tax is the office\'s, at invoicing', '') +
      `<div class="grid2">` + H.panel('Currency', H.form([H.field('Home currency', 'CAD'), H.field('Also price in', 'USD'), H.field('USD → CAD today', '1.3842', 'Bank of Canada, Nov 19'), H.field('Rate used', 'Per day ▾')])) +
      H.panel('Sales tax', `<div class="small">Not calculated in Timberline. Invoice requests to the office show amounts <b>before tax</b>; the office adds GST/HST (or none on US exports) and its total is recorded with its invoice number.</div>` +
        `<div style="margin-top:12px">${H.callout('info', 'When the office starts invoicing in Timberline, the tax table (province of delivery, rates, exports) is added here.')}</div>`) + `</div>`,
  });
  S({
    id: 'settings-imports', dept: 'settings', title: 'Imports',
    intent: 'Lots of existing data gets loaded in: catalog, customers and plants, price lists, opening stock. Drop an Excel or CSV file, match its columns, preview, then import. Messy files are read by the Assistant.',
    ref: 'D10',
    check: ['Which files exist today for each (open question A4)?', 'What date should opening stock be counted at?'],
    assistant: ['Read a messy spreadsheet and match its columns', 'Explain rows that could not be imported'],
    html: () => H.head('Settings › Imports', 'Imports', 'Excel or CSV · match columns · preview · import', '') +
      `<div class="grid2">` + H.drop('Drop a catalog, customer, price list or stock file here') +
      H.panel('Recent imports', H.table(['File', 'What', { t: 'Rows', num: 1 }, 'Result'], [['catalog 2026.xlsx', 'Catalog items', 48, H.chip('46 ok · 2 to fix', 'warn')], ['plants.csv', 'Customers & plants', 31, H.chip('ok', 'ok')], ['Ardent prices.xlsx', 'Price list', 19, H.chip('ok', 'ok')]]), '', true) + `</div>` +
      H.panel('Match columns · catalog 2026.xlsx', H.table(['Column in file', 'Example', 'Goes to'], [['ITEM', '3X3X31', 'Name ▾'], ['DESC', '3x3 31 inch', '(ignore) ▾'], ['THK / WID / LEN', '3 / 3 / 31', 'Thickness / Width / Length'], ['PCS/BDL', '140', 'Pieces per bundle ▾'], ['GROOVE', 'Y', 'Grooved ▾']]) +
        '<div style="padding:12px 18px">' + H.callout('warn', '2 rows have no length. ' + H.btn('Show them', 'sm')) + '</div>', H.btn('Preview 48 rows', 'sm') + H.btn('Import', 'sm primary'), true),
  });

  // =====================================================================
  // DOCUMENTS
  // =====================================================================
  const prLines = LINES.map(l => [l.i.code, l.i.name + (l.filler ? ' <i>(filler: as many as fit)</i>' : ''), l.bundles + (l.filler ? '+' : ''), n0(l.pcs) + (l.filler ? '+' : ''), n0(l.bf), money(l.price), money(l.pcs * l.price)]);
  S({
    id: 'doc-proposal', dept: 'orders', tab: 'orders-proposals', kind: 'document', story: 4, title: 'Load proposal (document)',
    intent: 'What goes back to the customer before their PO: the needs fitted to a full truck, with BB Pallets\' internal order number, prices per piece and the % of a truck. The customer\'s PO should match it line for line.',
    ref: 'Hand-off 4.1, D8, D16, D19',
    check: ['Does the proposal show prices, or only quantities?', 'Do they want the split option on the proposal, or a separate one?'],
    assistant: ['Draft the cover email in the buyer\'s usual tone', 'Make the Excel version match the customer\'s own sheet columns'],
    under: underProposals,
    html: () => H.doc('Load proposal ' + ST.proposal, H.letterhead('LOAD PROPOSAL', [['Proposal', ST.proposal], ['Our order no.', ST.order], ['Date', 'Nov 19, 2026'], ['Valid', '14 days']]) +
      `<div class="cols"><div class="box2"><div class="k">Customer</div>${ST.customer}<br>Attn: ${plant.buyer}</div><div class="box2"><div class="k">Ship to</div>${plant.name}<br>Caldari Road, ${plant.city}</div><div class="box2"><div class="k">Load</div>53' dry van · delivered<br><b>${Math.round(totBf / 230)}% of a truck</b> · ${n0(totBf)} bd ft</div></div>` +
      `<table><thead><tr><th>Code</th><th>Item</th><th class="num">Bundles</th><th class="num">Pieces</th><th class="num">Bd ft</th><th class="num">Price / pc</th><th class="num">Amount</th></tr></thead><tbody>${prLines.map(r => `<tr>${r.map((c, j) => `<td class="${j > 1 ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>` +
      `<table class="tot"><tr><td>Subtotal</td><td class="num">${money(totAmt)}</td></tr><tr><td>HST 13%</td><td class="num">${money(totAmt * .13)}</td></tr><tr><td>Total CAD</td><td class="num">${money(totAmt * 1.13)}</td></tr></table>` +
      `<p><b>Your needs sheet was 118% of a truck.</b> We fitted it to one full load. The rest (3x3 × 38½", 14 bundles) can ship as a second load in 3 weeks (around Dec 10) or 1 month (Dec 19). Please say which.</p>` +
      `<div class="fine">Please send your PO quoting our order no. ${ST.order}. Filler quantity is as many as fit and is invoiced as loaded. Prices per piece, CAD, delivered.</div>`),
  });
  S({
    id: 'doc-invoice', dept: 'orders', tab: 'orders-orders', kind: 'document', story: 10, title: 'Invoice request → office invoice',
    intent: 'The BB Pallets office invoices the customer (D36), so he does not issue the invoice himself. He sends an <b>invoice request</b> made from what was really loaded (the filler line shows the loaded quantity), with his prices, the customer\'s PO number and amounts <b>before tax</b>, plus a check that the load stays within what the PO allows. When the office\'s invoice comes back, its number, total with tax and PDF are recorded on the same request, and the order shows "invoiced". When the office switches over, it invoices from this request inside Timberline (D37).',
    ref: 'Hand-off 4.6, 8 · D36, D37, D39 · Review S4, S9, section 5',
    check: ['Who at the office does invoices, and how long do they usually take?', 'Does the customer accept an invoice above the PO (fillers), or must they change the PO first?', 'Should he see payment received, or only paid yes/no?'],
    assistant: ['Explain any difference between the PO and what was loaded', 'Send the request to the office and record their invoice when it comes back'],
    under: underOrders,
    html: () => {
      const inv = LINES.map(l => { const pcs = l.filler ? l.loaded * l.i.perBundle : l.pcs; return { l, pcs }; });
      const sub = inv.reduce((a, x) => a + x.pcs * x.l.price, 0);
      const fill = LINES.find(l => l.filler);
      return H.doc('Invoice request · order ' + ST.order, H.letterhead('INVOICE REQUEST', [['To', 'BB Pallets office'], ['Request', 'TL-R-1046'], ['Our order', ST.order], ['Customer PO', ST.po.replace('PO ', '')], ['Date', 'Nov 24, 2026']]) +
        `<p>Please invoice this load from the loaded quantities below.</p>` +
        `<div class="cols"><div class="box2"><div class="k">Bill to</div>${ST.customer}<br>Accounts payable</div><div class="box2"><div class="k">Shipped to</div>${plant.name}, ${plant.city}</div><div class="box2"><div class="k">Shipped</div>Nov 24 · ${ST.load} · ${ST.bol}<br>Trans-Ontario Freight</div></div>` +
        `<table><thead><tr><th>Item</th><th class="num">On PO</th><th class="num">Pieces loaded</th><th class="num">Price</th><th class="num">Amount before tax</th></tr></thead><tbody>${inv.map(x => `<tr><td>${x.l.i.name}${x.l.filler ? ' (filler, as loaded: ' + x.l.loaded + ' bundles)' : ''}</td><td class="num">${x.l.filler ? 'as fit' : n0(x.l.pcs)}</td><td class="num">${n0(x.pcs)}</td><td class="num">${money(x.l.price)}</td><td class="num">${money(x.pcs * x.l.price)}</td></tr>`).join('')}</tbody></table>` +
        `<table class="tot"><tr><td>Total before tax (CAD)</td><td class="num">${money(sub)}</td></tr><tr><td>Tax</td><td class="num">added by the office</td></tr></table>` +
        `<div class="box2" style="margin:10px 0"><div class="k">PO check</div>Filler loaded: ${fill.loaded} bundles against ${fill.bundles} expected. Within the +20% this plant allows on filler (proposed), so no PO change is needed.</div>` +
        `<div class="sig"><div>Requested by: Sales, BB Pallets</div><div>Office invoice no. · date</div></div>` +
        `<div style="margin-top:22px;border:2px solid var(--paper-fg);padding:12px 14px"><div style="font-weight:700;margin-bottom:6px">Office's invoice (recorded when it comes back)</div>` +
        `<table style="margin:0"><tbody><tr><td>Office invoice no.</td><td class="num"><b>${ST.inv}</b></td></tr><tr><td>Date</td><td class="num">Nov 25, 2026</td></tr><tr><td>Total with tax (office's figure)</td><td class="num"><b>${money(sub * 1.13)}</b></td></tr><tr><td>Due</td><td class="num">Dec 25, 2026 · Net 30</td></tr><tr><td>PDF</td><td class="num">${ST.inv}.pdf · from the office's email</td></tr><tr><td>Paid</td><td class="num">Not yet</td></tr></tbody></table>` +
        `<div class="fine" style="margin-top:6px">Recorded by Sales on behalf of the office, Nov 25 · read from their reply by the Assistant and checked.</div></div>`, false);
    },
  });
  S({
    id: 'doc-statement', dept: 'customers', tab: 'customers-statements', kind: 'document', title: 'Open invoices nudge',
    intent: 'The office invoices and keeps the books (D36), so this is not an accounting statement: no aging engine, no payment plans. It is a simple list of a customer\'s open invoices (the office\'s invoice number, amount, due date, paid yes or no) that he can send as a polite nudge when something is late. Paid is a status he records, not bookkeeping.',
    ref: 'Hand-off 6, 8 · D36 · Review section 5, "What can wait"',
    check: ['Who chases late payers today: him or the office (F27)?', 'Does the office tell him when an invoice is paid?'],
    assistant: ['Draft a polite nudge for what is past due', 'List every customer with an invoice past due'],
    under: underStatements,
    html: () => H.doc('Open invoices · Ardent Metals', H.letterhead('OPEN INVOICES', [['Customer', 'Ardent Metals'], ['As of', 'Nov 19, 2026'], ['Currency', 'CAD']]) +
      `<p>Hi, here is a short list of the invoices we still show as open. If any are already paid, please let us know and ignore this.</p>` +
      `<table><thead><tr><th>Office invoice no.</th><th>Plant</th><th>Due</th><th class="num">Amount</th><th>Paid</th></tr></thead><tbody>
      ${[['INV 60890', 'Caldari Road', 'Oct 12', 8420.10, 'No · past due'], ['INV 60957', 'Jane Street', 'Nov 5', 9120.45, 'No · past due'], ['INV 61004', 'Caldari Road', 'Nov 27', 20670.00, 'No · not due yet']].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${money(r[3])}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table>
      <table class="tot"><tr><td>Open</td><td class="num">${money(38210.55)}</td></tr></table>
      <div class="fine">Amounts as invoiced by BB Pallets. Thank you for your business.</div>`),
  });
  S({
    id: 'doc-commercial', dept: 'loads', tab: 'loads-bol', kind: 'document', title: 'US load: information for the office and broker',
    intent: 'Customs papers for a US load are official documents, made by the office or the customs broker, not by him (D36). What he sends is the <b>information they need</b>: what is on the truck and its value, the importer of record, the delivery terms, and the tariff code and duty rate as given by the broker. Canadian softwood lumber entering the US can carry anti-dumping and countervailing duties and a US tariff; whether cut dunnage falls under them is for the broker to confirm. Who pays duty and brokerage also belongs in the price (Review S8).',
    ref: 'Hand-off 7 · D26, D36 · Review S8',
    check: ['Which papers go with a US load today, and who makes them (F30)?', 'Who is the importer of record: you or the customer? Who pays duty and the broker\'s fee?', 'Has the broker said whether your dunnage falls under the softwood lumber duties?', 'Do any customers ask for heat-treated, stamped wood (ISPM-15)?'],
    assistant: ['Fill in the broker, importer and tariff code from the US plant\'s record', 'Email the information to the office and the broker before the truck leaves'],
    under: underBol,
    html: () => H.doc('US load information · L-2422', H.letterhead('US LOAD: INFORMATION FOR CUSTOMS', [['Load', 'L-2422'], ['To', 'BB Pallets office · broker'], ['Date', 'Nov 20, 2026'], ['Currency', 'USD']]) +
      `<p>Not a customs document. Please use this to prepare the commercial invoice and entry.</p>` +
      `<div class="cols"><div class="box2"><div class="k">Exporter</div>${D.company.name}<br>${D.company.addr}</div><div class="box2"><div class="k">Consignee</div>Garden State Steel<br>Newark plant, Newark NJ</div><div class="box2"><div class="k">Customs broker</div>Example Customs Brokers Inc.<br>Buffalo NY · broker@example.com</div></div>` +
      `<div class="cols"><div class="box2"><div class="k">Importer of record</div>Garden State Steel <i>(to confirm)</i></div><div class="box2"><div class="k">Delivery terms</div>DAP Newark NJ <i>(to confirm)</i></div><div class="box2"><div class="k">Duty and brokerage paid by</div>Customer <i>(to confirm)</i></div></div>` +
      `<table><thead><tr><th>Description</th><th>Tariff code</th><th>Duty rate</th><th>Origin</th><th class="num">Qty</th><th class="num">Unit USD</th><th class="num">Value USD</th></tr></thead><tbody>
      <tr><td>Wood dunnage 3x3 × 37½", softwood (SPF)</td><td>from broker</td><td>from broker</td><td>CA</td><td class="num">2,240 pcs</td><td class="num">1.38</td><td class="num">3,091.20</td></tr>
      <tr><td>Wood dunnage 4x4 × 48", softwood (SPF)</td><td>from broker</td><td>from broker</td><td>CA</td><td class="num">1,152 pcs</td><td class="num">3.10</td><td class="num">3,571.20</td></tr></tbody></table>
      <table class="tot"><tr><td>Value USD</td><td class="num">6,662.40</td></tr></table>
      <p>Carrier: Liberty Line · Port of entry: Peace Bridge, Buffalo NY</p>
      <div class="fine"><b>For the broker to confirm:</b> tariff code and duty rate; whether the softwood lumber anti-dumping and countervailing duties and the US softwood lumber tariff apply to this product; whether a CUSMA/USMCA certificate of origin helps; ISPM-15 between Canada and the US. Figures are examples.</div>`, false),
  });

  // =====================================================================
  // DIALOGS: email + assistant
  // =====================================================================
  S({
    id: 'dlg-email', dept: 'orders', tab: 'orders-proposals', kind: 'dialog', story: 4, title: 'Email dialog',
    intent: 'One email window for every document and request in the app. It sends from his own mailbox, picks recipients from the contacts, uses the template for that document, and attaches the PDF and Excel. It is sent as "create a draft, then send" so the message and thread ids come back, and requests carry a reference in the subject (e.g. [TL-R-1041]), so every reply is matched and read for him (D38, D46). The Assistant can draft the text; he clicks Send. Every email is stored on the customer and the order.',
    ref: 'Hand-off 8 · D4, D30, D38, D46 · Review M3, S10',
    check: ['Should the office or the owner be copied on proposals?', 'Is the buyer always the person who gets proposals, or does it vary?'],
    assistant: ['Draft the email in English or French', 'Mention the split-load choice in the text'],
    under: underProposals,
    html: () => H.dialog('Email · Load proposal ' + ST.proposal,
      H.form([H.field('From', 'sales.bbpallets@hotmail.com (Outlook.com) ▾'), H.field('Template', 'Load proposal ▾')]) +
      `<div class="field"><label>To</label><div class="input">${H.chip(plant.buyer + ' · buyer', 'brand')} <span class="muted small">Add from Ardent Metals contacts…</span></div></div>` +
      H.field('Subject', 'Load proposal ' + ST.order + ' · Caldari Road, Concord [TL-P-0318]') +
      `<div class="field"><label>Message ${H.btn('Draft with Assistant', 'sm ghost', 'spark')}</label><div class="input" style="min-height:150px;align-items:flex-start;line-height:1.6">Hi Dana,<br><br>Attached is our proposal ${ST.order} for the Caldari Road plant. Your list was more than one truck, so we fitted it to one full load (${Math.round(totBf / 230)}% of a truck). The 3x3 × 38½" can follow as a second load in 3 weeks or a month. Which do you prefer?<br><br>Please send your PO quoting ${ST.order}.<br><br>Sales, BB Pallets</div></div>` +
      `<div class="field"><label>Attachments</label><div class="btns">${H.chip(icon('pdf', 12) + ' ' + ST.proposal + '.pdf · 84 KB', 'info')} ${H.chip(icon('xls', 12) + ' ' + ST.proposal + '.xlsx · 22 KB', 'ok')} ${H.btn('Add file', 'sm', 'plus')}</div></div>` +
      H.callout('info', 'Sent from your mailbox as a draft, then sent, so the thread is kept. Stored on Ardent Metals and order ' + ST.order + '. When Dana replies, Today shows what she said.'),
      H.btn('Cancel') + H.btn('Send', 'primary', 'mail')),
  });
  S({
    id: 'dlg-assistant', dept: 'workflow', tab: 'workflow', kind: 'dialog', title: 'Assistant (open)',
    intent: 'The Assistant is on every page and understands mixed Yiddish and English, typed or spoken. It starts narrow (Review S11): first it <b>reads replies and documents</b> (customer sheets, POs, office answers, carrier confirmations) into fields for him to check, then <b>drafts requests and reminders</b>, then answers <b>"what am I waiting on"</b> and other look-ups. Anything it read from a document shows where it came from, and money or quantity fields it filled stay marked until he checks them. Nothing leaves the app or changes without his click: no autopilot.',
    ref: 'Hand-off 11 · D4, D5, D38, D46 · Review S11',
    check: ['Which jobs would he hand to the Assistant first?', 'Does he want to dictate notes and calls in Yiddish and have them turned into tasks?'],
    assistant: ['Read a reply or document into fields, with its source', '"What am I waiting on from the office?"', 'Draft a request, a follow-up or a reminder'],
    under: () => (WINDOWS.find(w => w.id === 'workflow') || { html: () => '' }).html(),
    html: () => H.dialog(icon('spark') + ' Assistant',
      `<div class="msgs" style="padding:0">` +
      `<div class="m me">Vos vart ich fun office? What am I waiting on?</div>` +
      `<div class="m ai">From the office: the transport PO for <b>L-2421</b> (asked yesterday) and approval <b>R-1042</b> for the North Shore loads (2 days, overdue). From customers: Garden State's PO for P-24-0322 (6 days). From Kessler: the ready date for J-1185.</div>` +
      `<div class="m me">Dana just answered, what did she say?</div>` +
      `<div class="m ai">She <b>confirmed</b> proposal 24-0318 and attached <b>PO 77815</b>. I read it into the PO match:</div>` +
      `<div class="propose"><div class="k">Read from a document · check before saving</div>` +
        H.table(['Field', 'Read', 'From'], [['PO no.', '77815', 'PO 77815.pdf, page 1'], ['3x3 × 31"', '<span style="background:var(--warn-bg);padding:1px 4px;border-radius:3px">2,800 pcs @ $1.53</span>', 'line 1'], ['3x3 × 37½"', '<span style="background:var(--warn-bg);padding:1px 4px;border-radius:3px">2,100 pcs @ $1.85</span>', 'line 2'], ['Ship', 'Week of Dec 1', 'her email, paragraph 2']]) +
        `<div class="small muted" style="margin-top:6px">Quantities and prices stay marked until you check them.</div><div class="btns" style="margin-top:8px">${H.go('Open the PO match', 'dlg-pomatch', 'primary sm')}${H.btn('Remind the office about R-1042', 'sm')}</div></div>` +
      `<div class="m ai small">I read and draft; nothing is sent or changed until you click. What I may do follows your own access.</div></div>` +
      `<div class="btns small">${H.chip('Try: "what am I waiting on from the office?"')} ${H.chip('"what did the last Toronto load make?"')} ${H.chip('"remind Kessler about the ready date"')}</div>`,
      `<div class="input muted" style="flex:1">Ask in English or Yiddish…</div>${H.btn('🎤 Speak')}${H.btn('Send', 'primary')}`, true),
  });
})();
