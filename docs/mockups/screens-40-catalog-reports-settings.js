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
    H.kpis([H.gauge('Truck', Math.round(totBf / 440) + '%', totBf / 440, 'of a 53\' dry van', 'ok'), H.gauge('Board feet', n0(totBf), totBf / 440, 'of 44,000', 'ok'), H.gauge('Value', money(totAmt, 0), null, 'CAD')]) +
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
    intent: 'The daily and weekly picture: every open order and where it stands, the load schedule with split loads coming due, inventory on hand against what is committed, and purchases against the market. (proposed)',
    ref: 'Hand-off 9',
    check: ['Which of these do they look at every day?', 'Who should get them by email, and when?'],
    assistant: ['"What ships this week?"', 'Email this report to the office every Monday'],
    html: () => H.head('Reports › Operations', 'This week', 'Week of Nov 16, 2026', H.docActions()) +
      H.kpis([H.gauge('Open orders', '14', null, '3 waiting on a PO'), H.gauge('Loads this week', '6', null, '1 split load due Thu'), H.gauge('On hand', '412,600 <small>bd ft</small>', null, '186,000 committed'), H.gauge('Lumber vs market', '−$22 <small>/ MBF</small>', null, 'Bought below this week\'s price', 'ok')]) +
      `<div class="grid2">` + H.panel('Open orders by stage', H.table(['Stage', { t: 'Orders', num: 1 }, 'Oldest'], [['Needs sheet received', 2, '3 days'], ['Proposal sent', 3, H.chip('9 days', 'warn')], ['Customer PO', 2, '1 day'], ['At subcontractor', 4, '2 days'], ['Loaded, not invoiced', 3, '1 day']]), H.btn('Open orders', 'sm'), true) +
      H.panel('Load schedule', H.table(['Day', 'Load', 'Plant', 'Carrier'], [['Mon', 'L-2417', 'Caldari Road, Concord', 'Trans-Ontario'], ['Tue', 'L-2419', 'Toronto plant ' + H.chip('pickup'), '—'], ['Wed', 'L-2420', 'Newark NJ', 'Liberty Line'], ['Thu', 'L-2421', 'Caldari Road ' + H.chip('split 2 of 2', 'info'), 'Bluewater ' + H.chip('backup', 'warn')], ['Fri', 'L-2422', 'Jane Street, Vaughan', 'Trans-Ontario']]), '', true) + `</div>` +
      `<div class="grid2">` + H.panel('On hand vs committed (MBF)', H.bars([{ label: '2x3', value: 120, value2: 74 }, { label: '3x3', value: 168, value2: 88 }, { label: '2x4', value: 64, value2: 16 }, { label: '4x4', value: 41, value2: 8 }, { label: 'Offcuts', value: 19, value2: 0 }])) +
      H.panel('Lumber paid vs market ($/MBF)', H.lines(['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], [{ name: 'Market', values: [560, 555, 548, 545, 545, 540], color: 'var(--line-2)', dash: 1 }, { name: 'Paid', values: [540, 520, 530, 510, 500, 518] }])) + `</div>`,
  });
  S({
    id: 'reports-money', dept: 'reports', title: 'Money reports',
    intent: 'The month in money: margin per load and per plant against the planned $2,000 to $3,000, buying gains (every $25 under plan is $1,100 a load), waste booked against actual, freight by carrier and how often the backup was used, and sales by plant against last year.',
    ref: 'Hand-off 4.3, 4.4, 9, D18',
    check: ['Is margin per load the number they judge a customer by?', 'Should "other costs" per load be split into named lines?', 'Who may see this page (D28: off by default)?'],
    assistant: ['"How\'s Concord doing vs last year?"', '"What did the last Toronto load make?"', 'Explain why a load made less than planned'],
    dock: H.assistant([['me', 'How\'s Concord doing vs last year?'], ['ai', 'Caldari Road: 19 loads so far vs 21 by this time last year (−10%). Margin per load is up: $2,880 vs $2,410, mostly from lumber bought at $510 average vs $545 planned.'], ['propose', 'Email this summary to you every month-end']]),
    html: () => H.head('Reports › Money', 'October 2026', 'Costs and margins: visible to people an admin allows', H.docActions()) +
      H.kpis([H.gauge('Margin per load', '$2,640', 88, 'avg of 23 loads · plan $2,000–3,000', 'ok'), H.gauge('Buying gains', '$9,350', null, '8.5 loads × $1,100 ($25 under plan)', 'ok'), H.gauge('Waste', '3.1% <small>actual</small>', 62, '5% booked · +84,000 bd ft found', 'ok'), H.gauge('Backup carrier', '22%', 22, '5 of 23 loads', 'warn')]) +
      `<div class="grid2">` + H.panel('Margin per load by plant (actual vs plan)', H.bars([{ label: 'Caldari', value: 2880, value2: 3000 }, { label: 'Jane St', value: 1950, value2: 2000 }, { label: 'Toronto', value: 2300, value2: 2000 }, { label: 'Newark', value: 3150, value2: 3000 }]) + '<div class="small muted">Grey: planned · green: actual</div>') +
      H.panel('Sales by plant vs last year', H.table(['Plant', { t: 'This year', num: 1 }, { t: 'Last year', num: 1 }, { t: 'Change', num: 1 }], [['Caldari Road, Concord', '$612,400', '$680,100', H.chip('−10%', 'warn')], ['Jane Street, Vaughan', '$118,200', '$102,900', H.chip('+15%', 'ok')], ['Toronto plant', '$371,000', '$355,500', H.chip('+4%', 'ok')], ['Newark NJ (USD)', 'US$298,000', 'US$240,700', H.chip('+24%', 'ok')]]), '', true) + `</div>` +
      H.panel('Freight by carrier', H.table(['Carrier', 'Role', { t: 'Loads', num: 1 }, { t: 'Avg per load', num: 1 }, { t: 'vs plan $2,300', num: 1 }], [['Trans-Ontario Freight', 'Cheapest', 18, '$2,000', H.chip('−$300', 'ok')], ['Bluewater Carriers', 'Backup', 5, '$2,550', H.chip('+$250', 'warn')], ['Liberty Line (US)', 'US loads', 3, 'US$3,400', '—']]), '', true),
  });
  S({
    id: 'reports-scheduled', dept: 'reports', title: 'Scheduled reports',
    intent: 'Any report can be emailed on a schedule, as PDF and Excel, from their own mailbox. (proposed)',
    ref: 'Hand-off 8, 9',
    check: ['Which reports should arrive automatically, and to whom (owner, accountant)?'],
    assistant: ['Set up a schedule from a sentence: "send me margins every month-end"'],
    html: () => H.head('Reports › Scheduled', 'Scheduled reports', 'Sent from your own mailbox, as PDF and Excel', H.btn('New schedule', 'primary', 'plus')) +
      H.panel('', H.table(['Report', 'When', 'To', 'Format', 'Last sent', ''], [
        ['Open orders & load schedule', 'Mondays 7:00', 'Sales desk', 'PDF', 'Nov 16', H.toggle(true)],
        ['Margin per load & plant', 'Last day of month', 'Owner', 'PDF + Excel', 'Oct 31', H.toggle(true)],
        ['Inventory valuation', 'Last day of month', 'Owner, accountant', 'Excel', 'Oct 31', H.toggle(true)],
        ['Overdue statements', 'Fridays 9:00', 'Sales desk', 'PDF', 'Nov 13', H.toggle(false)]]), '', true),
  });

  // =====================================================================
  // SETTINGS
  // =====================================================================
  const areas = ['Orders', 'Loads', 'Production', 'Purchasing', 'Inventory', 'Pricing', 'Customers', 'Catalog', 'Reports', 'Settings'];
  S({
    id: 'settings-users', dept: 'settings', title: 'Users & access',
    intent: 'For now one salesperson from BB Pallets uses it, but it is built for more. Each person gets view, read or write per department. Costs and margins are hidden unless an admin turns them on for that person.',
    ref: 'D27, D28, Hand-off 14 (testing mode)',
    check: ['Who is the admin?', 'Should the buyer see margins, or only costs?', 'Will subcontractors ever log in, or only get emails?'],
    assistant: ['Explain what a person can and cannot see', 'Turn the Assistant on or off for a person'],
    html: () => H.head('Settings › Users & access', 'Users & access', '', H.btn('Testing mode: off') + H.btn('Invite person', 'primary', 'plus')) +
      `<div class="split">` + H.panel('People', H.table(['Name', 'Role', 'Costs & margins', 'Assistant', 'Last in'], [
        ['Owner', 'Admin', H.toggle(true), H.toggle(true), 'Today'], ['Sales desk (BB)', 'Sales', H.toggle(false), H.toggle(true), 'Today'], ['Buyer', 'Purchasing ' + H.chip('later'), H.toggle(false), H.toggle(true), '—'], ['Office', 'Office ' + H.chip('later'), H.toggle(false), H.toggle(false), '—']], { sel: 1 }), '', true) +
      H.panel('Sales desk (BB): access by department', H.table(['Area', 'None', 'View', 'Read', 'Write'], areas.map(a => { const lvl = a === 'Settings' ? 0 : a === 'Reports' || a === 'Purchasing' ? 2 : 3; return [a, ...[0, 1, 2, 3].map(k => k === lvl ? '●' : '<span class="muted">○</span>')]; })) +
        '<div style="padding:12px 18px">' + H.callout('warn', '<b>Costs and margins are off</b> for this person. Delivered cost, margin per load and buying gains are hidden everywhere.') + '</div>', '', true) + `</div>`,
  });
  S({
    id: 'settings-email', dept: 'settings', title: 'Email',
    intent: 'Email goes out from their own mailbox, so replies come back to them and thread properly. Hotmail (Outlook.com) and Gmail are both confirmed. Each document type has its own template and signature.',
    ref: 'Hand-off 8, D30',
    check: ['Which address sends what (sales vs office)?', 'Should every sent email be copied to someone?'],
    assistant: ['Write a template for a document type', 'Show emails sent to a customer this month'],
    html: () => H.head('Settings › Email', 'Email', 'Sent from your own mailbox · replies thread with the original', '') +
      `<div class="grid2">` + H.panel('Connected mailboxes', `<div class="list">` +
        `<div class="li">${H.dot('ok')}<div class="grow"><b>sales.bbpallets@hotmail.com</b><div class="small muted">Outlook.com (Microsoft) · connected Nov 3 · sends as Sales desk</div></div>${H.btn('Disconnect', 'sm')}</div>` +
        `<div class="li">${H.dot()}<div class="grow"><b>Gmail</b><div class="small muted">Not connected</div></div>${H.btn('Connect Gmail', 'sm primary')}</div></div>`, '', true) +
      H.panel('Signature', `<div class="input" style="min-height:110px;align-items:flex-start">Sales desk<br>BB Pallets · ${D.company.phone}<br>${D.company.addr}</div>`) + `</div>` +
      H.panel('Templates', H.table(['Document', 'Subject', 'Attaches', 'Usually to'], [
        ['Load proposal', 'Load proposal {order} · {plant}', 'PDF + Excel', 'Customer buyer'], ['Subcontractor job', 'Job {job} · {plant} · ship {date}', 'Job sheet, packing slip', 'Subcontractor'], ['Bill of lading', 'BOL {load}', 'PDF', 'Carrier'], ['Invoice', 'Invoice {invoice} from BB Pallets', 'PDF', 'Customer AP'], ['Statement / overdue', 'Statement as of {date}', 'PDF + Excel', 'Customer AP'], ['Offer to supplier', 'Offer on {batch}', 'PDF', 'Supplier']]), H.btn('New template', 'sm', 'plus'), true),
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
    intent: 'Carriers in order of preference, cheapest first, then the backup, with their rate per destination. Freight per load feeds the price builder ($2,300 planned between the $2,000 carrier and the $2,500–2,600 backup).',
    ref: 'Hand-off 4.3, 6',
    check: ['Is freight per destination, and who pays it (open question C15)?', 'How do they book a carrier today: phone, email, portal?'],
    assistant: ['Pick the carrier for a load and draft the booking email', 'Show how often the backup was used and what it cost'],
    html: () => H.head('Settings › Carriers', 'Carriers', 'Preference order: first is tried first', H.btn('Add carrier', 'primary', 'plus')) +
      `<div class="split">` + H.panel('Preference', H.table(['#', 'Carrier', 'Role', { t: 'Concord', num: 1 }, { t: 'Vaughan', num: 1 }, { t: 'Newark NJ', num: 1 }, 'Used'], D.carriers.map((c, i) => [i + 1, c.name, c.role, i < 2 ? money(c.rate, 0) : '—', i < 2 ? money(c.rate - 200, 0) : '—', i === 2 ? 'US' + money(c.rate, 0) : '—', c.used])), '', true) +
      H.panel('Trans-Ontario Freight', H.form([H.field('Contact', 'Dispatch'), H.field('Email', 'dispatch@trans-ontario.example'), H.field('Phone', '905-555-0144'), H.field('Reliability', 'Good · 1 late in 18')])) + `</div>`,
  });
  S({
    id: 'settings-taxes', dept: 'settings', title: 'Taxes & currency',
    intent: 'Prices and invoices in the customer\'s currency, costs in CAD, with an exchange rate per day or per document. Sales tax by province on Canadian sales, none on exports to the US. (proposed, ask BB Pallets)',
    ref: 'Hand-off 7, D9',
    check: ['Which customers are billed in USD (F28)?', 'Any Quebec customers needing QST and French documents (F29)?', 'Where should the exchange rate come from?'],
    assistant: ['Explain which tax applies to a plant and why'],
    html: () => H.head('Settings › Taxes & currency', 'Taxes & currency', 'Proposed: confirm with BB Pallets', '') +
      `<div class="grid2">` + H.panel('Currency', H.form([H.field('Home currency', 'CAD'), H.field('Also bill in', 'USD'), H.field('USD → CAD today', '1.3842', 'Bank of Canada, Nov 19'), H.field('Rate on documents', 'Per day ▾')])) +
      H.panel('Sales tax by ship-to', H.table(['Ship-to', 'Tax', { t: 'Rate', num: 1 }], [['Ontario', 'HST', '13%'], ['Quebec', 'GST + QST', '5% + 9.975%'], ['Other provinces', 'GST/HST by province', 'varies'], ['United States', 'Export, no Canadian tax', '0%']]), '', true) + `</div>` +
      H.callout('info', 'GST/HST number on documents: ' + D.company.gst + ' (example).'),
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
      `<div class="cols"><div class="box2"><div class="k">Customer</div>${ST.customer}<br>Attn: ${plant.buyer}</div><div class="box2"><div class="k">Ship to</div>${plant.name}<br>Caldari Road, ${plant.city}</div><div class="box2"><div class="k">Load</div>53' dry van · delivered<br><b>${Math.round(totBf / 440)}% of a truck</b> · ${n0(totBf)} bd ft</div></div>` +
      `<table><thead><tr><th>Code</th><th>Item</th><th class="num">Bundles</th><th class="num">Pieces</th><th class="num">Bd ft</th><th class="num">Price / pc</th><th class="num">Amount</th></tr></thead><tbody>${prLines.map(r => `<tr>${r.map((c, j) => `<td class="${j > 1 ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>` +
      `<table class="tot"><tr><td>Subtotal</td><td class="num">${money(totAmt)}</td></tr><tr><td>HST 13%</td><td class="num">${money(totAmt * .13)}</td></tr><tr><td>Total CAD</td><td class="num">${money(totAmt * 1.13)}</td></tr></table>` +
      `<p><b>Your needs sheet was 118% of a truck.</b> We fitted it to one full load. The rest (3x3 × 38½", 14 bundles) can ship as a second load in 3 weeks (around Dec 10) or 1 month (Dec 19). Please say which.</p>` +
      `<div class="fine">Please send your PO quoting our order no. ${ST.order}. Filler quantity is as many as fit and is invoiced as loaded. Prices per piece, CAD, delivered.</div>`),
  });
  S({
    id: 'doc-invoice', dept: 'orders', tab: 'orders-orders', kind: 'document', story: 10, title: 'Invoice (document)',
    intent: 'The invoice is made from what was really loaded, so the filler line shows the loaded quantity, not the estimate. Canadian sales carry GST/HST.',
    ref: 'Hand-off 4.6, 8, D9',
    check: ['Payment terms per customer (open question F27)?', 'Does the invoice go to an accounting program (F26)?'],
    assistant: ['Explain any difference between the PO and the invoice', 'Send it to the customer\'s AP email with the BOL attached'],
    under: underOrders,
    html: () => {
      const inv = LINES.map(l => { const pcs = l.filler ? l.loaded * l.i.perBundle : l.pcs; return { l, pcs }; });
      const sub = inv.reduce((a, x) => a + x.pcs * x.l.price, 0);
      return H.doc('Invoice ' + ST.inv, H.letterhead('INVOICE', [['Invoice', ST.inv], ['Date', 'Nov 24, 2026'], ['Our order', ST.order], ['Your PO', ST.po.replace('PO ', '')], ['Terms', 'Net 30 · due Dec 24']]) +
        `<div class="cols"><div class="box2"><div class="k">Bill to</div>${ST.customer}<br>Accounts payable</div><div class="box2"><div class="k">Shipped to</div>${plant.name}, ${plant.city}</div><div class="box2"><div class="k">Shipped</div>Nov 23 · ${ST.load} · ${ST.bol}<br>Trans-Ontario Freight</div></div>` +
        `<table><thead><tr><th>Item</th><th class="num">Pieces loaded</th><th class="num">Price</th><th class="num">Amount</th></tr></thead><tbody>${inv.map(x => `<tr><td>${x.l.i.name}${x.l.filler ? ' (filler, as loaded: ' + x.l.loaded + ' bundles)' : ''}</td><td class="num">${n0(x.pcs)}</td><td class="num">${money(x.l.price)}</td><td class="num">${money(x.pcs * x.l.price)}</td></tr>`).join('')}</tbody></table>` +
        `<table class="tot"><tr><td>Subtotal</td><td class="num">${money(sub)}</td></tr><tr><td>HST 13% (ON)</td><td class="num">${money(sub * .13)}</td></tr><tr><td>Total CAD</td><td class="num">${money(sub * 1.13)}</td></tr></table>` +
        `<div class="fine">${D.company.gst} · Please pay by Dec 24, 2026 quoting ${ST.inv}.</div>`, false);
    },
  });
  S({
    id: 'doc-statement', dept: 'customers', tab: 'customers-statements', kind: 'document', title: 'Statement (document)',
    intent: 'A customer statement with aging, to send to their accounts payable as a reminder. Same file to print, download or email. (proposed)',
    ref: 'Hand-off 6 (accounts receivable), 8',
    check: ['Who chases late payers today (F27)?', 'Do they send statements monthly, or only when overdue?'],
    assistant: ['Draft a polite overdue reminder', 'List every customer more than 45 days overdue'],
    under: underStatements,
    html: () => H.doc('Statement · Ardent Metals', H.letterhead('STATEMENT', [['Customer', 'Ardent Metals'], ['As of', 'Nov 19, 2026'], ['Currency', 'CAD']]) +
      `<table><thead><tr><th>Date</th><th>Document</th><th>Plant</th><th class="num">Amount</th><th class="num">Paid</th><th class="num">Open</th></tr></thead><tbody>
      ${[['Sep 12', 'INV-24-0521', 'Caldari Road', 18420.10, 10000], ['Oct 6', 'INV-24-0558', 'Jane Street', 9120.45, 0], ['Oct 28', 'INV-24-0590', 'Caldari Road', 20670.00, 0]].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${money(r[3])}</td><td class="num">${r[4] ? money(r[4]) : ''}</td><td class="num">${money(r[3] - r[4])}</td></tr>`).join('')}</tbody></table>
      <table><thead><tr><th class="num">Current</th><th class="num">1–30</th><th class="num">31–60</th><th class="num">61–90</th><th class="num">Over 90</th><th class="num">Total due</th></tr></thead><tbody><tr><td class="num">$20,670.00</td><td class="num">$9,120.45</td><td class="num">$8,420.10</td><td class="num">$0.00</td><td class="num">$0.00</td><td class="num"><b>$38,210.55</b></td></tr></tbody></table>
      <div class="fine">Thank you for your business. Please pay the 31–60 day amount ($8,420.10) at your earliest convenience.</div>`),
  });
  S({
    id: 'doc-commercial', dept: 'loads', tab: 'loads-bol', kind: 'document', title: 'Commercial invoice (US load)',
    intent: 'A US load goes through a customs broker. The commercial invoice and broker details go with the truck and are emailed to the broker. Which papers exactly is still to confirm. (proposed)',
    ref: 'Hand-off 7, D26',
    check: ['Which papers go with a US load today (F30)?', 'Is a CUSMA certificate of origin needed?', 'Is the wood heat treated or stamped (ISPM-15)?'],
    assistant: ['Fill in the broker and HS code from the plant', 'Email the papers to the broker before the truck leaves'],
    under: underBol,
    html: () => H.doc('Commercial invoice · L-2422', H.letterhead('COMMERCIAL INVOICE', [['Invoice', 'CI-2422'], ['Date', 'Nov 20, 2026'], ['Load', 'L-2422'], ['Currency', 'USD']]) +
      `<div class="cols"><div class="box2"><div class="k">Exporter</div>${D.company.name}<br>${D.company.addr}</div><div class="box2"><div class="k">Consignee</div>Garden State Steel<br>Newark plant, Newark NJ</div><div class="box2"><div class="k">Customs broker</div>Example Customs Brokers Inc.<br>Buffalo NY · broker@example.com</div></div>` +
      `<table><thead><tr><th>Description</th><th>HS code</th><th>Origin</th><th class="num">Qty</th><th class="num">Unit USD</th><th class="num">Value USD</th></tr></thead><tbody>
      <tr><td>Wood dunnage 3x3 × 37½", softwood</td><td>4415.20</td><td>CA</td><td class="num">2,240 pcs</td><td class="num">1.38</td><td class="num">3,091.20</td></tr>
      <tr><td>Wood dunnage 4x4 × 48", softwood</td><td>4415.20</td><td>CA</td><td class="num">1,152 pcs</td><td class="num">3.10</td><td class="num">3,571.20</td></tr></tbody></table>
      <table class="tot"><tr><td>Total USD</td><td class="num">6,662.40</td></tr></table>
      <p>Carrier: Liberty Line · Port of entry: Peace Bridge, Buffalo NY · Terms: DAP Newark NJ</p>
      <div class="fine">CUSMA/USMCA certificate of origin attached if needed (proposed). ISPM-15: to confirm. HS codes are examples.</div>
      <div class="sig"><div>Exporter signature</div><div>Date</div></div>`, false),
  });

  // =====================================================================
  // DIALOGS: email + assistant
  // =====================================================================
  S({
    id: 'dlg-email', dept: 'orders', tab: 'orders-proposals', kind: 'dialog', story: 4, title: 'Email dialog',
    intent: 'One email window for every document in the app. It sends from their own mailbox, picks recipients from the customer\'s contacts, uses the template for that document, and attaches the PDF and Excel. The Assistant can draft the text; a person clicks Send. Every email is logged on the customer and the order.',
    ref: 'Hand-off 8, D4, D30',
    check: ['Should the subcontractor or the owner be copied on proposals?', 'Is the buyer always the person who gets proposals, or does it vary?'],
    assistant: ['Draft the email in English or French', 'Mention the split-load choice in the text'],
    under: underProposals,
    html: () => H.dialog('Email · Load proposal ' + ST.proposal,
      H.form([H.field('From', 'sales.bbpallets@hotmail.com (Outlook.com) ▾'), H.field('Template', 'Load proposal ▾')]) +
      `<div class="field"><label>To</label><div class="input">${H.chip(plant.buyer + ' · buyer', 'brand')} <span class="muted small">Add from Ardent Metals contacts…</span></div></div>` +
      `<div class="field"><label>Cc</label><div class="input">${H.chip('Owner', '')}</div></div>` +
      H.field('Subject', 'Load proposal ' + ST.order + ' · Caldari Road, Concord') +
      `<div class="field"><label>Message ${H.btn('Draft with Assistant', 'sm ghost', 'spark')}</label><div class="input" style="min-height:150px;align-items:flex-start;line-height:1.6">Hi Dana,<br><br>Attached is our proposal ${ST.order} for the Caldari Road plant. Your list was more than one truck, so we fitted it to one full load (92% of a truck). The 3x3 × 38½" can follow as a second load in 3 weeks or a month. Which do you prefer?<br><br>Please send your PO quoting ${ST.order}.<br><br>Sales desk, BB Pallets</div></div>` +
      `<div class="field"><label>Attachments</label><div class="btns">${H.chip(icon('pdf', 12) + ' ' + ST.proposal + '.pdf · 84 KB', 'info')} ${H.chip(icon('xls', 12) + ' ' + ST.proposal + '.xlsx · 22 KB', 'ok')} ${H.btn('Add file', 'sm', 'plus')}</div></div>` +
      H.callout('info', 'Will be logged on Ardent Metals and order ' + ST.order + '. Replies come back to your inbox, in the same thread.'),
      H.btn('Cancel') + H.btn('Send', 'primary', 'mail')),
  });
  S({
    id: 'dlg-assistant', dept: 'workflow', tab: 'workflow', kind: 'dialog', title: 'Assistant (open)',
    intent: 'The Assistant is on every page and understands mixed Yiddish and English, typed or spoken. It looks things up and proposes actions, but nothing is sent or changed until a person clicks Approve. What it may do follows the person\'s own access.',
    ref: 'Hand-off 11, D4, D5',
    check: ['Which jobs would they hand to the Assistant first?', 'Should the Assistant ever act without a click for small things (autopilot limits)?'],
    assistant: ['Lookups: sales, margins, stock, loads', 'Draft proposals, plan loads, email jobs', '"What can I offer for this batch?"'],
    under: () => (WINDOWS.find(w => w.id === 'workflow') || { html: () => '' }).html(),
    html: () => H.dialog(icon('spark') + ' Assistant',
      `<div class="msgs" style="padding:0">` +
      `<div class="m me">Vos macht Concord? How's Concord doing vs last year?</div>` +
      `<div class="m ai">Caldari Road (Concord): <b>19 loads</b> this year vs 21 by this date last year. Margin per load is higher, <b>$2,880</b> vs $2,410, because lumber went in at $510 average instead of $545. They usually order every 2½ weeks; the last order was 23 days ago.</div>` +
      `<div class="m me">Shik zey a proposal, same as last time but fill the truck</div>` +
      `<div class="propose"><div class="k">Proposed · needs your OK</div>New proposal for Caldari Road from their last order (24-0301), topped up to <b>98% of a truck</b> with their major sizes (+2 bundles 3x3 × 37½"). Email to Dana Ferreira with PDF + Excel.<div class="btns" style="margin-top:8px">${H.btn('Approve', 'primary sm')}${H.btn('Open the draft', 'sm')}${H.btn('Change', 'sm')}</div></div>` +
      `<div class="m ai small">Nothing is sent or changed until you click Approve. You can ask me to do what your own access allows: Orders, Loads, Customers (write) · Reports (view).</div></div>` +
      `<div class="btns small">${H.chip('Try: "what did the last Toronto load make?"')} ${H.chip('"which customers are priced on lumber over $520?"')} ${H.chip('"what can I offer for this batch?"')}</div>`,
      `<div class="input muted" style="flex:1">Ask in English or Yiddish…</div>${H.btn('🎤 Speak')}${H.btn('Send', 'primary')}`, true),
  });
})();
