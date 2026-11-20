/* Purchasing, Inventory and Pricing windows. Numbers are BB Pallets' own worked examples
   from voice notes 4–9 (price builder, batch offer, average cost, waste, counts). */
(function () {
  const P = D.price, B = D.batch;
  const sup = D.suppliers;
  const cur = (n, d = 0) => money(n, d);

  /* ================= PURCHASING ================= */
  const yieldRows = [
    ['10\'', '3 × 39"', '3" waste', H.chip('Best', 'ok') + ' 97.5%'],
    ['7\' trim (84")', '2 × 39"', '6" waste', H.chip('Good', 'ok') + ' 92.9%'],
    ['12\'', '3 × 39"', '27" offcut kept', H.chip('Leftover', 'warn') + ' 81.3%'],
    ['8\'', '2 × 39"', '18" waste', H.chip('Poor', 'bad') + ' 81.3%'],
  ];
  const offersPage = () => H.head('Purchasing › Offers', 'Offer from Muskoka Sawmill: 3 loads, paper-wrapped', 'Old stock the mill can\'t sell as premium. Asking $300 / MBF, not delivered.', H.btn('Save offer') + H.btn('Send counter-offer', '', 'mail') + H.go('Ask the office to approve', 'office-requests', 'primary')) +
    H.stages(['Offer', 'Agreed with supplier', 'Approval asked (office)', 'Approved: office PO', 'Received'], 1) +
    H.kpis([
      H.gauge('Our offer, delivered', `${cur(B.delivered)} <small>/ MBF</small>`, null, `${cur(B.offered)} + ${cur(B.freight)} freight to the yard`),
      H.gauge('On a 10-foot count', `${cur(B.tenFt)} <small>/ MBF</small>`, null, '12s cut back to 10s: × 12 ÷ 10'),
      H.gauge('With extra cutting', `≈ ${cur(B.cut)} <small>/ MBF</small>`, null, 'compare with first quality', 'ok'),
      H.gauge('First-quality 10s', `${cur(B.firstQuality)} <small>/ MBF</small>`, null, `prices falling · maybe ${cur(B.nextWeek)} next week`),
    ]) +
    H.panel('What can I offer for this batch?', H.form([
      H.field('Supplier price (not delivered)', '$225.00', '/ MBF'),
      H.field('Freight to the yard', '$20.00', '/ MBF'),
      `<div class="field"><label>Compare on a common count</label><div>${H.seg(['8\'', '10\'', '12\''], 1)}</div></div>`,
      H.field('Lengths offered', '12\' (3 loads ≈ 132 MBF)'),
      H.field('Extra cutting cost', '≈ $11.00', '/ MBF'),
      H.field('Value of leftovers (2\' off each 12)', '$0.00', '/ MBF · as in your example'),
      H.field('Today\'s first-quality 10s', '$345.00', '/ MBF'),
    ]) + `<div style="margin-top:16px">` + H.table(['Step', { t: 'Per MBF', num: true }, 'How'], [
      ['Supplier price, not delivered', cur(B.offered, 2), 'what we offer'],
      ['+ freight to the yard', cur(B.delivered, 2), `+ ${cur(B.freight, 2)}`],
      ['On a 10-foot count', cur(B.tenFt, 2), '× 12 ÷ 10 (12s cut back to 10s)'],
      ['+ extra cutting', '≈ ' + cur(B.cut, 2), 'more cuts per piece'],
      ['First-quality 10s this week', cur(B.firstQuality, 2), `maybe ${cur(B.nextWeek)} next week`],
    ], { foot: ['Saving vs first quality', '≈ $40.00', 'on usable feet: 3 loads ≈ 132 MBF bought → 110 MBF of 10s → ≈ $4,400'] }) + `</div>` +
    `<div style="margin:0 -18px">` + H.table(['', { t: 'Offer $225', num: true }, { t: 'Settled $235', num: true }], [
      ['Delivered (+ $20 freight)', '$245.00', '$255.00'], ['On a 10-foot count (× 12 ÷ 10)', '$294.00', '$306.00'], ['+ extra cutting', '≈ $305', '≈ $317'],
      ['Under first-quality 10s ($345)', '≈ $40', '≈ $28'], ['Gain on 110 MBF usable', '≈ $4,400', '≈ $3,080']]) + `</div>` +
    H.callout('info', 'History: we offered <b>$225</b>, they wanted <b>$300</b>, settled at <b>$235</b> a week later, still about $28 under first quality. Gains are counted on <b>usable</b> board feet (10/12 of a batch of 12s), not on what was bought. Leftovers are worth $0 unless you give them a value. Every <b>$25</b> under plan is <b>$1,100 more per 44,000 bd ft load</b>.'),
      H.go('Ask the office to approve', 'office-requests', 'sm primary')) +
    `<div class="grid2">` +
    H.panel('Yield into the sizes customers buy · 2x3 × 39"', H.table(['Stock', 'Cuts', 'Waste or leftover', 'Yield'], yieldRows) +
      `<div class="toolbar small muted" style="padding-top:10px">Ardent Metals takes about half a load of 2x3 × 39" a week. Leftover 27" pieces go into inventory as offcuts (D21).</div>`, H.seg(['2x3 × 39"', '3x3 × 31"', '3x3 × 37½"'], 0), true) +
    H.panel('Buying gains this quarter', H.table(['Load', { t: 'Paid', num: true }, { t: 'Plan', num: true }, { t: 'Gain / load', num: true }], [
      ['North Shore 10s · Oct 2', '$545', '$500', '<span style="color:var(--bad)">−$1,980</span>'],
      ['Algonquin trim · Oct 9', '$440', '$500', '<span style="color:var(--ok)">+$2,640</span>'],
      ['Muskoka 2x3 · Oct 20', '$475', '$500', '<span style="color:var(--ok)">+$1,100</span>'],
      ['Muskoka wrapped 12s · Nov 3', '$317 *', '$345 *', '<span style="color:var(--ok)">+$1,027</span>'],
    ], { foot: ['4 loads', '', '', '+$2,787'] }) + `<div class="toolbar small muted" style="padding-top:10px">Gain per load = (plan − paid) × MBF. * The wrapped 12s: delivered cost on a 10-foot count with cutting, against first-quality 10s that week, on usable feet (36.7 of 44 MBF a load).</div>`, '', true) +
    `</div>` +
    H.panel('Offers', H.filters(['*All', 'Open 3', 'Waiting on office 1', 'Turned down 2']) + H.table(['Supplier', 'What', { t: 'Asking', num: true }, { t: 'Our offer', num: true }, 'Status'], [
      ['Muskoka Sawmill', '3 loads paper-wrapped 12s', '$300', '$225', H.chip('Countered', 'warn')],
      ['North Shore Forest Products', '2x3 × 10\', 2 loads', '$545', '$525', H.chip('Agreed · office asked (R-1042)', 'info')],
      ['Algonquin Lumber', 'Trim 6–7\', 1 load', '$440', '$430', H.chip('Waiting', '')],
      ['North Shore Forest Products', '#3 12s, 1 load', '$410', '—', H.chip('Turned down: grade', '')],
      ['Muskoka Sawmill', '4x4 × 8\' green', '$520', '$480', H.chip('Turned down: they refused', '')],
    ]), H.btn('New offer', '', 'plus'), true);

  S({
    id: 'purchasing-offers', dept: 'purchasing', title: 'Offers & batch calculator',
    intent: '"You don\'t make money when you sell, you make money when you buy." He negotiates with suppliers himself; the office approves every purchase (D36). This screen works out what to offer for an odd batch: delivered cost, converted to a common count, plus extra cutting, against today\'s first-quality price, with the yield into the sizes customers buy. Leftovers can be given a value (zero by default, as in their example) and gains are counted on usable board feet. Turned-down offers are kept. Once a price is agreed, the next step is asking the office to approve.',
    ref: 'Hand-off 3, 4.4; D20, D21, D36, D39 · Review S6',
    check: ['Is the 10-foot count the standard, and when would you compare on another length?', 'How do you estimate the extra cutting cost for a batch like this?', 'Are leftovers like the 2\' off a 12 worth anything to you, or zero?', 'Can you agree a price before the office approves, or only "subject to approval"?'],
    assistant: ['"What can I offer for this batch?" from a supplier\'s email', 'Show the yield of 12s into this week\'s orders', 'Draft the counter-offer email (you click Send)'],
    html: offersPage,
    dock: H.assistant([
      ['me', 'Muskoka has 3 loads of old 12s, wrapped. What can I offer?'],
      ['ai', 'At $225 + $20 freight, on a 10-foot count that\'s $294, about $305 with the extra cutting. First-quality 10s are $345 this week, maybe $325 next. 12s give three 39s plus a 27" offcut.'],
      ['propose', 'Counter-offer to Muskoka Sawmill:<br><b>$225 / MBF</b>, 3 loads, FOB their yard, subject to office approval'],
    ]),
  });

  const posPage = () => H.head('Purchasing', 'Purchases', 'Every load he buys: agreed with the supplier, approved by the office, received with a tally. Received loads feed the average cost.', H.go('Ask the office to approve', 'doc-supplierpo', '', 'mail') + H.go('Record a received load', 'dlg-purchase', 'primary', 'plus')) +
    H.stages(['Offer agreed', 'Approval asked', 'Approved by office (PO no.)', 'Received (tally)'], 2) +
    H.kpis([
      H.gauge('Average cost, 2x3', `$509.89 <small>/ MBF</small>`, null, 'weighted by board feet received'),
      H.gauge('Plan in price lists', `$500 <small>/ MBF</small>`, null, 'planning number'),
      H.gauge('Waiting on the office', '1', null, 'R-1042 · 2 days, overdue', 'warn'),
      H.gauge('Approved, not received', '2 loads', null, 'Muskoka 2 of 3 · Algonquin'),
    ]) +
    H.panel('', H.filters(['*All', 'Waiting on office', 'Approved', 'Received', 'Tally differs']) + H.table(['Purchase', 'Supplier', 'What', { t: 'MBF ordered', num: true }, { t: '$ / MBF', num: true }, { t: 'Freight in', num: true }, 'Office', 'Received (tally)', 'Status'], [
      ['P-0412', 'North Shore Forest Products', '2x3 × 8\' & 10\'', '44.0', '$545', 'incl.', 'R-1021 · PO 5502', '43.6 · Concord yard (Mike)', H.chip('Received', 'ok')],
      ['P-0414', 'Algonquin Lumber', '2x3 trim 6–7\'', '44.0', '$440', 'incl.', 'R-1028 · PO 5510', '44.0 · Concord yard (Mike)', H.chip('Received', 'ok')],
      ['P-0415', 'Muskoka Sawmill', '3x3 × 12\' paper-wrapped', '132.0', '$235', '$20', 'R-1033 · PO 5521', '44.4 · Kessler (their tally)', H.chip('1 of 3 in', 'warn')],
      ['P-0417', 'Algonquin Lumber', '2x3 trim 6–7\'', '44.0', '$440', 'incl.', 'R-1043 · PO 5544', '—', H.chip('Approved', 'info')],
      ['P-0418', 'North Shore Forest Products', '2x3 × 10\', 2 loads', '88.0', '$525', 'incl.', 'R-1042 · asked Nov 17', '—', H.chip('Waiting on office', 'bad')],
    ], { sel: 4 }), '', true) +
    H.callout('info', '<b>How average cost works:</b> a moving average per size, weighted by board feet, on <b>delivered</b> cost (supplier price + freight in), updated when a load is received, using the <b>received</b> tally, not the PO. A USD price is converted at the rate on the day it is received. Wood found at a count comes in at $0 as its own line, so a drop like Sept 30 ($450) is explained.', H.go('Open R-1042', 'office-requests', 'sm'));

  S({
    id: 'purchasing-pos', dept: 'purchasing', title: 'Purchase orders',
    intent: 'Every load he buys, from agreed price to received tally. Every purchase is approved by the BB Pallets office (D36), so each one carries its approval request and, once approved, the office\'s PO number; the PO to the supplier is the office\'s document. Someone at the yard confirms the tally, which can differ from the order, and the received board feet set the average cost the price builder can use.',
    ref: 'Hand-off 4.4, 4.5; D17, D22, D36, D39 · Review S5, S13',
    check: ['Who at the yard checks a load in and sends you the tally?', 'Is freight usually included in the supplier\'s price, or billed separately?', 'Do any suppliers bill in USD?', 'Do loads go straight to a subcontractor\'s yard, or always to your yard first?'],
    assistant: ['Fill in a received load from a photo of the tally', 'Answer "what did we pay for 10s last month?"', 'Remind you of approved loads not received yet'],
    html: posPage,
  });

  S({
    id: 'doc-supplierpo', dept: 'purchasing', tab: 'purchasing-pos', kind: 'document', title: 'Purchase approval request',
    intent: 'His request to the BB Pallets office to approve a purchase he has agreed with a supplier: what, how much, at what price, where it goes, and why it is a good buy. The office answers and issues its own PO to the supplier; he records the office PO number here when it comes back. Sent from his mailbox with the reference [TL-R-1042] so the reply matches.',
    ref: 'D36, D37, D39 · Review section 5',
    check: ['What does the office need to approve a purchase: price, quantity, why, cash timing?', 'Who at the office approves, and up to what amount?', 'Does the office send the PO to the supplier, or tell you to go ahead?'],
    assistant: ['Fill it from the agreed offer and the batch calculator', 'Read the office\'s answer and record the approval and PO number'],
    under: posPage,
    html: () => H.doc('Purchase approval request · R-1042', H.letterhead('Purchase approval request', [['Ref', 'TL-R-1042'], ['To', 'BB Pallets office'], ['Date', 'Nov 17, 2026']]) +
      `<div class="cols"><div class="box2"><div class="k">Supplier</div>North Shore Forest Products<br>contact: sales desk (example)</div><div class="box2"><div class="k">Deliver to</div>Kessler Wood Works, Concord yard<br>week of Nov 30</div><div class="box2"><div class="k">Why now</div>$20 under the $545 plan · Caldari Road and Jane Street need 2x3 × 39" through January</div></div>` +
      `<table><thead><tr><th>What</th><th>Grade</th><th class="num">Loads</th><th class="num">MBF</th><th class="num">$ / MBF delivered</th><th class="num">Amount</th></tr></thead><tbody>
      <tr><td>2x3 × 10' kiln-dried</td><td>#2 & better</td><td class="num">2</td><td class="num">88.0</td><td class="num">$525.00</td><td class="num">$46,200.00</td></tr></tbody></table>
      <table class="tot"><tr><td>Amount before tax, CAD</td><td class="num">$46,200.00</td></tr><tr><td>Buying gain vs plan ($545)</td><td class="num">$1,760.00</td></tr></table>
      <div class="box2"><div class="k">Office answer (recorded when it comes back)</div>Approved · Approved with changes · Declined &nbsp; Office PO no. <span class="blank"></span> &nbsp; By <span class="blank"></span> &nbsp; Date <span class="blank"></span></div>
      <div class="fine">Please reply to this email keeping [TL-R-1042] in the subject. Tax and the supplier PO are the office's.</div><div class="sig"><div>Requested by: Sales, BB Pallets</div><div>Approved by (office)</div></div>`, false),
  });

  S({
    id: 'dlg-purchase', dept: 'purchasing', tab: 'purchasing-pos', kind: 'dialog', title: 'Record a received load',
    intent: 'When an approved load arrives, whoever is at the yard confirms the tally (he works remotely, so a photo or a phone call is enough). The tally can differ from the order; cost uses the board feet received. The preview shows how it moves the average cost of that size before saving.',
    ref: 'Hand-off 4.4, 4.5; D36 · Review S5, S13',
    check: ['Do you know the exact board-foot tally when a load arrives, or only later?', 'If the tally is short, who tells the supplier and the office?', 'Is average cost kept per size, or per size and yard?'],
    assistant: ['Fill this in from a photo of the tally sheet', 'Flag a tally that differs from the order by more than 1%'],
    under: posPage,
    html: () => H.dialog('Record a received load · P-0417', H.form([
      H.field('Supplier', 'Algonquin Lumber'), H.field('Office approval / PO', 'R-1043 · PO 5544', '', true), H.field('Date received', 'Nov 24, 2026'),
      H.field('Size', '2x3'), H.field('Lengths', '6\' & 7\' trim'), H.field('Grade', 'Trim'),
      H.field('Ordered', '44,000', 'bd ft', true), H.field('Received (tally)', '43,200', 'bd ft · −800'), H.field('Received by / tally from', 'Mike, Concord yard · photo'),
      H.field('Price', '$440.00', '/ MBF'), H.field('Freight in', 'Included'), H.field('Currency', 'CAD', '(USD: rate on the day received)'),
    ]) + H.callout('warn', '<b>Tally is 800 bd ft short of the order.</b> Cost uses 43,200. Tell the office and the supplier?', H.btn('Draft the note', 'sm')) +
      H.panel('Effect on average cost · 2x3, all yards', H.table(['', { t: 'Bd ft', num: true }, { t: '$ / MBF', num: true }, { t: 'Value', num: true }], [
        ['On hand before', '88,000', '$545.00', '$47,960'], ['This load, received', '43,200', '$440.00', '$19,008'],
      ], { foot: ['After', '131,200', '$510.43', '$66,968'] }) + `<div class="toolbar small muted" style="padding-top:10px">Weighted by board feet on delivered cost: (88,000 × $545 + 43,200 × $440) ÷ 131,200 = $510.43. Their rule of thumb (2 × $545 + $440) ÷ 3 = $510 is the same only when the loads are the same size.</div>`, '', true),
      H.btn('Cancel') + H.btn('Save received load', 'primary')),
  });

  const suppliersPage = () => H.head('Purchasing', 'Suppliers', 'Who carries what, typical prices, and the history of every offer and load.', H.btn('Add supplier', '', 'plus')) +
    `<div class="split">` + H.panel('All suppliers', H.table(['Supplier', 'Carries', { t: 'Last price', num: true }, 'Terms', 'Loads this year'], sup.map((s, i) => [`<b>${s.name}</b>`, s.carries, `$${s.last}`, s.terms, ['14', '6', '9'][i]]), { sel: 2 }), '', true) +
    H.panel('Muskoka Sawmill', `<div class="list" style="margin:0 -18px">
      <div class="li"><div class="grow"><b>Contact</b><div class="small muted">Gord (sales) · 705-555-0142 · orders@example.com</div></div></div>
      <div class="li"><div class="grow"><b>Carries</b><div class="small muted">2x3, 2x4, 4x4 · 8'–14' · sometimes old or odd stock</div></div></div>
      <div class="li"><div class="grow"><b>Price trend, 2x3 10s</b>${H.lines(['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], [{ values: [520, 505, 495, 480, 475, 470] }], { h: 140 })}</div></div>
      <div class="li"><div class="grow"><b>Deal history</b><div class="small muted">Nov 3: paper-wrapped 12s, offered $225, settled $235 · Oct 20: 2x3 mixed $475 · Aug 14: 4x4 × 8' $510</div></div></div>
      <div class="li"><div class="grow"><b>Emails</b><div class="small muted">4 logged this month</div></div>${H.go('Email', 'dlg-email', 'sm', 'mail')}</div></div>`) + `</div>`;
  S({
    id: 'purchasing-suppliers', dept: 'purchasing', title: 'Suppliers',
    intent: 'One place per supplier: lengths and grades they carry, typical prices and their trend, offers and deals, and every email. So when a supplier calls, you know what you paid last time.',
    ref: 'Hand-off 6',
    check: ['How many suppliers do you buy from in a year?', 'Do any suppliers bill in USD?', 'Is there a broker in between for some loads?'],
    assistant: ['"What did Muskoka charge for 10s the last three times?"', 'Compare this week\'s offers side by side'],
    html: suppliersPage,
  });

  /* ================= INVENTORY ================= */
  // Phase two (D44, review M6): his own work, built after the core. Official stock or his own figures is still open.
  const phase2 = H.callout('warn', '<b>Phase two.</b> Inventory is built after the core (orders, loads, requests, email). Whether these are BB Pallets\' official stock figures or his own working figures is still open (D44).');
  const onhandRows = [
    ['2x3 × 10\'', 'Concord yard', '38,400', '4,800', '33,600', '$545'],
    ['2x3 × 7\' trim', 'Concord yard', '30,800', '0', '30,800', '$440'],
    ['2x3 × 12\'', 'Kessler yard', '22,000', '8,800', '13,200', '$495'],
    ['3x3 × 12\'', 'Kessler yard', '41,200', '18,000', '23,200', '$245 *'],
    ['3x3 × 10\'', 'Concord yard', '12,600', '6,400', '6,200', '$520'],
    ['2x4 × 10\'', 'Pinegrove yard', '8,900', '2,200', '6,700', '$475'],
    ['Offcuts 2x3 × 27"', 'Kessler yard', '1,150', '0', '1,150', '$0'],
  ];
  const onhandPage = () => H.head('Inventory', 'On hand', 'Board feet by size, length and yard, valued at the average cost of loads bought. Worked out from movements; nobody types an on-hand number.', H.btn('Excel', '', 'xls') + H.btn('Valuation PDF', '', 'pdf')) + phase2 +
    H.kpis([
      H.gauge('On hand', '155,050 <small>bd ft</small>', null, 'BB Pallets\' wood only (D24)'),
      H.gauge('Committed to orders', '40,200 <small>bd ft</small>', 26, '6 open orders + 5% waste'),
      H.gauge('Average cost', '$458 <small>/ MBF</small>', null, 'all sizes, after Sept 30 count'),
      H.gauge('Value', '$71,000', null, 'at average cost'),
    ]) +
    H.panel('', H.filters(['*All yards', 'Concord yard', 'Kessler yard', 'Pinegrove yard', '*Raw lumber', 'Offcuts', 'Cut stock']) +
      H.table(['Size & length', 'Yard', { t: 'On hand', num: true }, { t: 'Committed', num: true }, { t: 'Available', num: true }, { t: 'Avg $ / MBF', num: true }], onhandRows, { foot: ['', '', '155,050', '40,200', '114,850', '$458'] }) +
      `<div class="toolbar small muted" style="padding-top:10px">* the paper-wrapped batch, delivered cost. Each subcontractor's own wood is not tracked here (D24).</div>`, '', true) +
    `<div class="grid2">` + H.panel('By yard', H.bars([{ label: 'Concord', value: 81.8 }, { label: 'Kessler', value: 64.35 }, { label: 'Pinegrove', value: 8.9 }], { h: 170 }) + '<div class="small muted">Thousand board feet</div>') +
    H.panel('Average cost, 2x3 (all yards)', H.lines(['May', 'Jun', 'Jul', 'Aug', 'Sep 30', 'Nov'], [{ values: [530, 540, 545, 548, 450, 510] }], { h: 170 }) + '<div class="small muted">Dropped to about $450 at the Sept 30 count (found wood at $0), then back up with new loads at $545.</div>') + `</div>` +
    H.panel('Movements · 3x3 × 12\', Kessler yard', H.table(['Date', 'Movement', 'Ref', { t: 'Bd ft', num: true }, { t: 'On hand after', num: true }], [
      ['Nov 3', 'Receipt (tally from Kessler)', 'P-0415', '+44,400', '50,800'],
      ['Nov 11', 'Issue: 3,048 shipped + 5% on top', 'L-2409', '−3,200', '47,600'],
      ['Nov 13', 'Issue: 3,048 shipped + 5% on top', 'L-2411', '−3,200', '44,400'],
      ['Nov 15', 'Issue: shipped since count', 'L-2412', '−3,200', '41,200'],
      ['Nov 18', 'Adjustment: recount confirmed', 'ADJ-118', '+2,050', '43,250'],
    ]) + `<div class="toolbar small muted" style="padding-top:10px">Receipts, issues (with 5% on top of shipped feet), transfers between yards and adjustments with a reason. On hand and average cost are worked out from these.</div>`, '', true);
  S({
    id: 'inventory-onhand', dept: 'inventory', title: 'On hand',
    intent: 'The wood he looks after, in board feet, at BB Pallets\' yard and each subcontractor\'s yard, valued at the running average cost of loads bought, not list price. On hand is worked out from movements (receipts, shipments with 5% on top, transfers, adjustments), never typed in. Committed shows what open orders will use. Phase two: built after the core, and whether it is BB Pallets\' official stock is still open.',
    ref: 'Hand-off 4.5; D21, D22, D23, D24, D44 · Review M6',
    check: ['Do you also want cut stock (finished bundles waiting) tracked here, or only raw lumber?', 'Is one average cost per size & length right, or one per yard?', 'Should offcuts carry zero cost, or a share of the load\'s cost?'],
    assistant: ['"How much 2x3 × 10\' do we have at Kessler?"', 'Warn when an order can\'t be covered by what\'s available'],
    html: onhandPage,
  });

  const countsPage = () => H.head('Inventory', 'Counts & recounts', 'A full count every two months. Book is adjusted for what shipped since the count date.', H.go('Print count sheet', 'doc-count', '', 'print') + H.btn('Start a count', 'primary', 'plus')) + phase2 +
    H.stages(['Count sheet out', 'Counted', 'Compared with book', 'Recount', 'Adjusted'], 2) +
    H.kpis([
      H.gauge('Count date', 'Nov 15', null, 'next one about Jan 15'),
      H.gauge('Book, adjusted', '157,300 <small>bd ft</small>', null, 'book at count date − 12,600 shipped since'),
      H.gauge('Counted', '160,450 <small>bd ft</small>', null, '+3,150 more than book', 'ok'),
      H.gauge('Lines off', '2 of 18', null, 'one is a bundle (~2,000 ft): recount', 'warn'),
      H.gauge('Counted by', '2 people', null, 'Mike (Concord, phone) · Kessler (paper)'),
    ]) +
    H.panel('Count of Nov 15 · compared with book', H.table(['Size & length', 'Yard', 'Counted by', { t: 'Book', num: true }, { t: 'Shipped since', num: true }, { t: 'Book now', num: true }, { t: 'Counted', num: true }, { t: 'Difference', num: true }, ''], [
      ['2x3 × 10\'', 'Concord yard', 'Mike · phone', '41,600', '−3,200', '38,400', '38,620', '+220', H.chip('Let go', '')],
      ['2x3 × 7\' trim', 'Concord yard', 'Mike · phone', '30,800', '0', '30,800', '30,950', '+150', H.chip('Let go', '')],
      ['3x3 × 12\'', 'Kessler yard', 'Kessler · paper', '47,600', '−6,400', '41,200', '43,250', '+2,050', H.chip('Recount', 'warn')],
      ['2x3 × 12\'', 'Kessler yard', 'Kessler · paper', '22,000', '0', '22,000', '21,900', '−100', H.chip('Let go', '')],
      ['2x4 × 10\'', 'Pinegrove yard', 'Pinegrove · phone', '11,900', '−3,000', '8,900', '7,100', '−1,800', H.chip('Recount', 'warn')],
    ], { cls: ['', '', 'diff', '', 'diff'] }) +
      `<div class="toolbar small muted" style="padding-top:10px">Counts usually come out higher than the books: real waste is less than the 5% booked. Small differences are adjusted and let go.</div>`,
      H.go('Recount sheet', 'doc-recount', 'sm', 'print') + H.go('Adjust to count', 'dlg-adjust', 'sm primary'), true) +
    H.callout('info', 'He works remotely, so whoever is at the yard counts: the same sheet opens on their phone or tablet, one line at a time, with big number buttons, and their name is kept on every line (D29).');
  S({
    id: 'inventory-counts', dept: 'inventory', title: 'Counts & recounts',
    intent: 'Replaces the 4–10 days (sometimes a whole Sunday) of balancing by hand. Whoever is at the yard counts, on a phone or on paper, and their name is kept. The count is compared with the book, adjusted automatically for everything shipped since the count date; small differences are let go, a big one (about a bundle) goes on a recount sheet. Phase two.',
    ref: 'Hand-off 4.5; D8, D23, D24, D29, D44 · Review M6',
    check: ['What difference is "small enough to let go": a percentage, or a number of board feet?', 'Who counts, and on paper or on a phone?', 'Do you count cut bundles too, or only raw lumber?', 'How do you handle loads that arrive or ship during the count day?'],
    assistant: ['Print the count sheet for the Kessler yard', 'Explain why 3x3 × 12\' is 2,050 ft over', 'Propose the adjustment after the recount (you approve)'],
    html: countsPage,
  });

  const countRows = ['2x3 × 7\' trim', '2x3 × 8\'', '2x3 × 10\'', '2x3 × 12\'', '3x3 × 10\'', '3x3 × 12\'', '2x4 × 10\'', '4x4 × 8\'', 'Offcuts 2x3 × 27"'];
  S({
    id: 'doc-count', dept: 'inventory', tab: 'inventory-counts', kind: 'document', title: 'Count sheet (blank)',
    intent: 'The blank sheet for whoever counts: one line per size and length at that yard, with space for pieces or bundles. It reminds the counter to leave the subcontractor\'s own pile out, because only BB Pallets\' wood is tracked.',
    ref: 'Hand-off 4.5, 8; D8, D23, D24',
    check: ['Do counters count pieces, bundles, or both?', 'Should the sheet show the book quantity, or stay blank so the count is honest?'],
    assistant: ['Print one sheet per yard', 'Email the sheet to the subcontractor who counts'],
    under: countsPage,
    html: () => H.doc('Count sheet · Kessler yard', H.letterhead('Count sheet', [['Yard', 'Kessler yard (Concord)'], ['Count date', 'Nov 15, 2026'], ['Counted by', '<span class="blank"></span>']]) +
      `<div class="box2" style="margin-bottom:12px"><b>Count only BB Pallets' wood.</b> Leave Kessler Wood Works' own pile out. If you are not sure whose a bundle is, write it in Notes.</div>` +
      `<table><thead><tr><th>Size & length</th><th class="num">Pcs / bundle</th><th class="num">Full bundles</th><th class="num">Loose pcs</th><th class="num">Bd ft (office)</th><th>Notes</th></tr></thead><tbody>` +
      countRows.map(r => `<tr><td>${r}</td><td class="num">${r.startsWith('Off') ? '—' : r.startsWith('3x3') ? '140' : r.startsWith('4x4') ? '96' : '210'}</td><td class="num"><span class="blank"></span></td><td class="num"><span class="blank"></span></td><td class="num"></td><td><span class="blank" style="min-width:120px"></span></td></tr>`).join('') +
      `</tbody></table><div class="sig"><div>Counted by</div><div>Checked by</div></div><div class="fine">Also opens on a phone or tablet for whoever counts; their name is kept. Shipments after the count date are taken off the book automatically.</div>`),
  });

  S({
    id: 'doc-recount', dept: 'inventory', tab: 'inventory-counts', kind: 'document', title: 'Recount sheet',
    intent: 'Only the lines that were off, with book and first count side by side, and the book already adjusted for what shipped since. So a recount takes an hour, not a Sunday.',
    ref: 'Hand-off 4.5, 8; D8',
    check: ['Should the recounter see the first count, or count blind?', 'Who signs off a recount?'],
    assistant: ['Make the recount sheet from the lines over your threshold', 'Email it to the person recounting'],
    under: countsPage,
    html: () => H.doc('Recount sheet · Nov 15 count', H.letterhead('Recount sheet', [['Count date', 'Nov 15, 2026'], ['Recount', 'Nov 18, 2026'], ['Lines', '2']]) +
      `<table><thead><tr><th>Size & length</th><th>Yard</th><th class="num">Book now</th><th class="num">First count</th><th class="num">Difference</th><th class="num">Recount (bd ft)</th></tr></thead><tbody>
      <tr><td>3x3 × 12'</td><td>Kessler yard</td><td class="num">41,200</td><td class="num">43,250</td><td class="num">+2,050</td><td class="num"><span class="blank"></span></td></tr>
      <tr><td>2x4 × 10'</td><td>Pinegrove yard</td><td class="num">8,900</td><td class="num">7,100</td><td class="num">−1,800</td><td class="num"><span class="blank"></span></td></tr></tbody></table>
      <div class="box2"><div class="k">Shipped since Nov 15, already taken off the book</div>3x3 × 12': L-2409 (3,200) and L-2411 (3,200) · 2x4 × 10': L-2410 (3,000). Includes 5% waste booked at shipping.</div>
      <div class="fine">Possible causes to check: a bundle of the subcontractor's own wood counted by mistake; a shipment loaded but not yet booked.</div><div class="sig"><div>Recounted by</div><div>Approved</div></div>`),
  });

  const adjustPage = () => H.head('Inventory', 'Adjustments', 'Every change to the book that isn\'t a purchase or a shipment, with a reason.', H.go('New adjustment', 'dlg-adjust', 'primary', 'plus')) + phase2 +
    H.panel('', H.filters(['*All', 'Count', 'Recount', 'Damaged', 'Subcontractor wood mixed in', 'Other']) + H.table(['Date', 'Size & length', 'Yard', { t: 'Bd ft', num: true }, 'Reason', { t: 'Avg cost after', num: true }, 'By'], [
      ['Nov 18', '3x3 × 12\'', 'Kessler yard', '+2,050', 'Recount confirmed: count was right', '$238', 'Sales desk'],
      ['Nov 15', '2x3 × 10\'', 'Concord yard', '+220', 'Count, small difference let go', '$542', 'Sales desk'],
      ['Nov 15', '2x3 × 7\' trim', 'Concord yard', '+150', 'Count, small difference let go', '$438', 'Sales desk'],
      ['Oct 2', '2x3 × 12\'', 'Kessler yard', '−1,900', 'Subcontractor\'s own wood had been counted in', '$495', 'Sales desk'],
      ['Sep 30', 'All 2x3', 'All yards', '+6,800', 'Count: real waste below 5% (found wood at $0)', '$450', 'Sales desk'],
    ]), '', true) +
    H.callout('info', 'After an adjustment, the average cost of what\'s left is recalculated. Adding found wood at no cost lowers the average, as on Sept 30 (about $450 against $545 recently paid).');
  S({
    id: 'inventory-adjustments', dept: 'inventory', title: 'Adjustments',
    intent: 'A trail of every correction to the book, each with a reason, and the average cost it left behind. That explains later why the cost dropped to $450 and jumped back.',
    ref: 'Hand-off 4.5; D24, D44',
    check: ['Which reasons do you want in the list?', 'Who is allowed to make an adjustment?', 'Should found wood come in at zero cost (lowering the average), or at the current average?'],
    assistant: ['"Why did 2x3 average cost drop in September?"', 'Propose adjustments from a finished count (you approve)'],
    html: adjustPage,
  });
  S({
    id: 'dlg-adjust', dept: 'inventory', tab: 'inventory-adjustments', kind: 'dialog', title: 'Adjust to count',
    intent: 'Make one adjustment, pick the reason, and see the new average cost before saving.',
    ref: 'Hand-off 4.5',
    check: ['Is a note required for every adjustment, or only big ones?'],
    assistant: ['Fill in the reason from the recount notes'],
    under: adjustPage,
    html: () => H.dialog('Adjust to count · 3x3 × 12\', Kessler yard', H.form([
      H.field('Book now', '41,200', 'bd ft', true), H.field('Counted (recount)', '43,250', 'bd ft'), H.field('Adjustment', '+2,050', 'bd ft', true),
      H.field('Reason', 'Recount confirmed: count was right'), H.field('Value the change at', 'Zero cost (found wood)'), H.field('Date', 'Nov 18, 2026'),
    ]) + H.table(['', { t: 'Bd ft', num: true }, { t: 'Avg $ / MBF', num: true }, { t: 'Value', num: true }], [['Before', '41,200', '$250.00', '$10,300'], ['Adjustment', '+2,050', '$0.00', '$0']], { foot: ['After', '43,250', '$238.15', '$10,300'] }) +
      `<div class="field"><label>Note</label><div class="input" style="min-height:60px">Second count by Kessler and office agree. Likely short-booked waste on L-2409.</div></div>`,
      H.btn('Cancel') + H.btn('Save adjustment', 'primary')),
  });

  const wastePage = () => H.head('Inventory', 'Waste', 'When a load ships, 5% on top of the shipped feet is taken out of stock. Real waste is checked at each count.', H.btn('Excel', '', 'xls')) + phase2 +
    H.kpis([
      H.gauge('Booked at shipping', '5.0%', null, '5% on top of shipped feet: 40,000 → 42,000 out'),
      H.gauge('Actual since Sept 30', '3.4%', 68, 'from the Nov 15 count', 'ok'),
      H.gauge('Over-booked', '+3,150 <small>bd ft</small>', null, 'came back at the count'),
      H.gauge('Offcuts kept', '1,150 <small>bd ft</small>', null, 'usable 27" pieces (D21)'),
    ]) +
    `<div class="grid2">` + H.panel('Waste by size cut', H.table(['Size cut', 'From', { t: 'Booked', num: true }, { t: 'Actual', num: true }, 'Why'], [
      ['3x3 × 31"', '10\'', '5%', '3.1%', 'Offcut usable: 2" thrown away instead of 3"'],
      ['2x3 × 39"', '7\' trim', '5%', '7.1%', '6" waste on each piece'],
      ['2x3 × 39"', '12\'', '5%', '2.0%', '27" leftovers kept as offcuts'],
      ['3x3 × 37½"', '10\'', '5%', '4.2%', ''],
      ['All sizes, good wood', '', '5%', '1–2%', 'quality of the wood'],
    ]), '', true) +
    H.panel('Booked vs actual, by count', H.bars([{ label: 'Mar', value: 3.9, value2: 5 }, { label: 'May', value: 4.4, value2: 5 }, { label: 'Jul', value: 3.1, value2: 5 }, { label: 'Sep', value: 2.6, value2: 5 }, { label: 'Nov', value: 3.4, value2: 5 }], { h: 190 }) + '<div class="small muted">Grey: 5% booked · Green: actual from the count</div>') + `</div>` +
    H.callout('info', '(proposed) Book waste per size and stock length instead of a flat 5%, once a few counts show the real figures. Then the count would come out closer to the book.');
  S({
    id: 'inventory-waste', dept: 'inventory', title: 'Waste',
    intent: 'Shows the waste booked at shipping (5% on top of the shipped feet: 40,000 shipped takes 42,000 out of stock) against the real waste found at each count, by size and stock length. Real waste depends on the sizes cut and the wood quality, which is why counts come out higher than the books. Phase two.',
    ref: 'Hand-off 4.5; D44 · Review arithmetic',
    check: ['Is 5% the right flat figure for every size?', 'Would you like waste booked per size and length once the numbers are known? (proposed)', 'Does the subcontractor charge on wood in, including the waste?'],
    assistant: ['"Which sizes waste more than 5%?"', 'Suggest a better waste % per size from the last counts'],
    html: wastePage,
  });

  /* ================= PRICING ================= */
  const builderPage = () => H.head('Pricing › Price builder', 'Ardent Metals · Caldari Road plant, Concord ON', 'Price list version 3 · effective Oct 1, 2026 · 20–24 loads a year · delivered · per piece, CAD', H.btn('Save as new version') + H.btn('Re-price list', 'primary')) +
    `<div class="split">` +
    H.panel('Cost per 1,000 board feet (MBF)', H.form([
      `<div class="field"><label>Lumber cost basis (chosen per price list)</label><div>${H.seg(['Planning number', 'Average on hand', 'Today\'s market'], 0)}</div></div>`,
      H.field('Lumber', '$500.00', '/ MBF'), H.field('Subcontractor labor', '$135.00', '/ MBF'), H.field('Waste (charged on wood in)', '5', '%'),
      H.field('Freight per load', '$2,300', 'cheapest $2,000 · backup $2,550'), H.field('Board feet per load', '44,000', 'to confirm (D43)'),
      H.field('Target margin per load', '$2,000'), H.field('Other costs per load (this plant)', '$700', 'D18'),
    ]) + `<div class="small muted" style="margin-top:10px">Beside the planning number: average on hand <b>$510</b> · market this week <b>$545</b></div>` +
      `<div style="margin:16px -18px 0">` + H.table(['Line (stored)', 'Kind', 'Basis', { t: 'Amount', num: true }, { t: 'Per MBF', num: true }, { t: 'Running', num: true }], [
        ['Lumber', H.chip('cost'), 'per MBF', '$500.00', '$500.00', '$500.00'],
        ['Subcontractor labor', H.chip('cost'), 'per MBF', '$135.00', '$135.00', '$635.00'],
        ['Waste, charged on wood in', H.chip('cost'), '% of lines above', '5%', '$31.75', '$666.75'],
        ['Freight', H.chip('cost'), 'per load', '$2,300', '$52.27', '<b>$719.02</b>'],
        ['Other costs (this plant, D18)', H.chip('cost'), 'per load', '$700', '$15.91', '$734.93'],
        ['Margin', H.chip('margin', 'ok'), 'per load', '$2,000', '$45.45', '$780.38'],
        ['Rounding: "call it $3,000"', H.chip('rounding', 'warn'), 'per load', '$300', '$6.82', '$787.20'],
      ], { foot: ['Selling price', '', '', '', '', '$787.20 → $787'] }) + `</div>` +
      `<div class="small muted" style="margin-top:10px">Per-load lines are divided by the <b>planned board feet per load: 44,000</b> (to confirm, D43). Delivered cost $719.02 (they call it $719); freight is $52.27 per MBF exactly (their figure $52.25). Other costs are costs, not margin.</div>`) +
    `<div style="display:flex;flex-direction:column;gap:20px">` +
    H.panel('Per piece', `<div class="g" style="border:0;padding:0"><div class="k">3x3 × 31"</div><div class="v">$1.53 <small>/ piece, quoted</small></div><div class="note">3 × 3 × 31 ÷ 144 = 1.9375 bd ft × $0.787 = $1.5248 → rounded up to $1.53</div></div>`) +
    H.panel('This plant\'s list, re-priced', H.table(['Item', { t: 'Bd ft / pc', num: true }, { t: 'At $787', num: true }, { t: 'Quoted', num: true }], [
      ['3x3 × 31"', '1.9375', '$1.5248', '$1.53'], ['3x3 × 37½"', '2.3438', '$1.8446', '$1.85'], ['3x3 × 38½"', '2.4063', '$1.8938', '$1.90'], ['2x4 × 40" (filler)', '2.2222', '$1.7489', '$1.75'],
    ]), H.seg(['Per piece', 'Per bundle', 'Per MBF'], 0), true) +
    H.panel('Margin per load', `<div class="small">$2,000 margin + $700 other costs = <b>$2,700</b> planned; $3,000 used in the price, so <b>$300 a load is rounding</b>, and rounding each piece up to the cent adds a little more. Both show as their own lines (D42). <b>To confirm (D43):</b> at about 1.9 lb per board foot, a 45,000 lb load carries about 23,000 bd ft, not 44,000. If so, the per-load costs come to about $130 per MBF instead of $120. The Money report compares this with what each load really made.</div>`) +
    `</div></div>`;
  S({
    id: 'pricing-builder', dept: 'pricing', title: 'Price builder',
    intent: 'Does BB Pallets\' own cost table for one customer or plant, stored as lines: each line has a kind (cost, margin or rounding) and a basis (per MBF, per load, or % of the lines above). Per-load lines are divided by the planned board feet per load, so it is clear what depends on a full truck, and their rounding ("call it $3,000") shows as its own line. Saving makes a new version with an effective date. The worked example is theirs: $719 delivered, $787 selling, $1.53 a piece.',
    ref: 'Hand-off 4.3; D17, D18, D19, D42, D43 · Review M7',
    check: ['Is the price always rounded up to the next cent?', 'Is $3,000 a rounding of $2,700, or is there another cost in it?', 'Does grooving add a fixed amount per MBF, or per piece?', 'Is the 44,000 bd ft per load the same for every trailer and customer?'],
    assistant: ['Build the price for a new plant from its volume and freight', 'Explain how $1.53 was worked out', '"What if lumber is $525?" for this plant'],
    html: builderPage,
  });

  const listsPage = () => H.head('Pricing', 'Price lists', 'One list per customer, and per plant where prices differ. Each list keeps the cost it was built on.', H.btn('New price list', '', 'plus') + H.btn('Re-price selected', 'primary')) +
    H.callout('warn', '<b>2 lists are stale.</b> They were built on lumber at $440 and $460; today\'s average is $510 and the market is $545.', H.btn('Show stale', 'sm')) +
    H.panel('', H.filters(['*All', 'Stale', 'CAD', 'USD', 'Pickup', 'Delivered']) + H.table(['Customer · plant', 'Cost basis', { t: 'Lumber used', num: true }, { t: 'Delivered', num: true }, { t: 'Sell / MBF', num: true }, 'Quote unit', 'Currency', 'Updated', ''], [
      ['Ardent Metals · Caldari Road', 'Planning number', '$500', '$719', '$787', 'Per piece', 'CAD', 'Oct 1', H.chip('OK', 'ok')],
      ['Ardent Metals · Jane Street', 'Planning number', '$500', '$714', '$812', 'Per piece', 'CAD', 'Oct 1', H.chip('OK', 'ok')],
      ['Lakeshore Tube & Bar · Toronto', 'Average on hand', '$440', '$613', '$680', 'Per bundle', 'CAD', 'Jun 12', H.chip('Stale', 'warn')],
      ['Garden State Steel · Newark', 'Today\'s market', '$460', '$718', '$795 → US$575', 'Per MBF', 'USD', 'Jul 3', H.chip('Stale', 'warn')],
    ], { cls: ['', '', 'diff', 'diff'] }), '', true) +
    `<div class="grid2">` + H.panel('Versions · Caldari Road', H.table(['Version', 'Effective', { t: 'Lumber', num: true }, { t: 'Sell / MBF', num: true }, 'Used by'], [
      ['v3', 'Oct 1, 2026', '$500', '$787', 'orders from Oct 1 ' + H.chip('Current', 'ok')],
      ['v2', 'Jun 1, 2026', '$480', '$765', 'orders 24-0261 to 24-0302'],
      ['v1', 'Jan 6, 2026', '$520', '$809', 'orders before June'],
    ]) + `<div class="toolbar small muted" style="padding-top:10px">Re-pricing makes a new version with an effective date. An order keeps the price it was taken at; the PO match uses the version in force on the PO date.</div>`, '', true) +
    H.panel('Garden State · Newark (USD)', H.table(['Line', 'Basis', { t: 'Amount', num: true }], [
      ['Selling price, CAD', 'per MBF', '$795.00'], ['Exchange to USD (proposed)', 'rate on the quote date', '× 0.723'],
      ['Brokerage (proposed, from the broker)', 'per load', 'US$185'], ['Duty on softwood (proposed, from the broker)', '% of value, if it applies', 'to confirm'],
    ], { foot: ['Price to Garden State', 'per MBF', 'US$575 + lines above'] }) + `<div class="toolbar small muted" style="padding-top:10px">Who pays duty and brokerage, and whether the product falls under the softwood duties, comes from the broker and BB Pallets (Review S8). Example figures.</div>`, '', true) + `</div>` +
    `<div class="grid2">` + H.panel('Caldari Road plant · 4 items', H.table(['Item', { t: 'Price', num: true }, 'Unit'], [['3x3 × 31"', '$1.53', 'piece'], ['3x3 × 37½"', '$1.85', 'piece'], ['3x3 × 38½"', '$1.90', 'piece'], ['2x4 × 40" (filler)', '$1.75', 'piece']]), H.docActions(), true) +
    H.panel('Why lists differ', '<p>Same item, different prices: "almost no standard". Margin depends on how often a plant orders and how good a customer it is. The Jane Street plant takes 4 loads a year against 20–24 at Caldari Road, so it carries more margin per MBF.</p>') + `</div>`;
  S({
    id: 'pricing-lists', dept: 'pricing', title: 'Price lists',
    intent: 'Every customer and plant has its own prices, set in advance, so an order arrives already priced. Each list remembers the lumber cost, cost basis and quote unit it was built on, and is flagged stale when that cost is far from today\'s. Lists are versioned with effective dates, so orders keep the price they were taken at. US lists carry their currency and (proposed) lines for exchange, brokerage and duty.',
    ref: 'Hand-off 4.3, 7, 8; D17, D19, D42 · Review S8, S14',
    check: ['How far from today\'s cost should a list be before it\'s "stale"? $25? $50?', 'Does a new price apply from the order date or the ship date?', 'For US customers, who pays duty and the broker\'s fee?', 'Do US plants have prices set in USD, or converted from CAD?'],
    assistant: ['"Which customers are priced on lumber over $520?"', 'Re-price stale lists and show the changes (you approve)', 'Email a price list to the buyer'],
    html: listsPage,
  });

  const whatifPage = () => H.head('Pricing', 'What-if', 'Change one cost and see every customer and plant at once. Nothing is saved until you re-price.', H.btn('Re-price all', 'primary')) +
    H.panel('If lumber goes to', H.form([
      H.field('Lumber', '$545.00', '/ MBF (from $500)'), H.field('Subcontractor labor', '$135.00', '/ MBF'), H.field('Freight per load', '$2,300'), H.field('Keep margin per load', 'Yes'),
    ])) +
    H.panel('Effect on every plant', H.table(['Customer · plant', { t: 'Loads / yr', num: true }, { t: 'Sell now', num: true }, { t: 'Sell at $545', num: true }, { t: '3x3 × 31" now', num: true }, { t: 'New', num: true }, { t: 'Margin / load if not re-priced', num: true }], [
      ['Ardent Metals · Caldari Road', '20–24', '$787', '$834.25', '$1.53', '$1.62', '<span style="color:var(--warn)">$921</span>'],
      ['Ardent Metals · Jane Street', '4', '$812', '$859.25', '$1.58', '$1.67', '$2,012'],
      ['Lakeshore Tube & Bar · Toronto', '12', '$680', '$727.25', '—', '—', '<span style="color:var(--bad)">−$1,496</span>'],
      ['Garden State Steel · Newark', '10', '$795', '$842.25', '—', '—', '<span style="color:var(--bad)">$164</span>'],
    ]) + `<div class="toolbar small muted" style="padding-top:10px">$45 more lumber, plus 5% waste: +$47.25 / MBF (45 × 1.05), or $2,079 per 44,000 bd ft load. Margin if not re-priced = today's margin per load minus $2,079 (Toronto is a pickup, so no freight in its cost).</div>`, '', true) +
    `<div class="grid2">` + H.panel('Margin per load vs lumber cost · Caldari Road', H.lines(['$450', '$475', '$500', '$525', '$550', '$575'], [{ values: [5310, 4155, 3000, 1845, 690, -465] }], { h: 170 }) + '<div class="small muted">Margin per load at today\'s prices, before re-pricing</div>') +
    H.callout('info', 'Also works the other way: "if we buy at $475 (every $25 under plan = $1,100 per load), what does each plant make?"') + `</div>`;
  S({
    id: 'pricing-whatif', dept: 'pricing', title: 'What-if',
    intent: '"What if lumber goes to $X" across every customer at once: new selling prices, new per-piece prices, and what each plant would make per load if prices aren\'t changed. (proposed)',
    ref: 'Hand-off 4.3, 9',
    check: ['When lumber jumps, do you re-price everyone, or only some customers?', 'Do you tell customers in advance of a price change?'],
    assistant: ['"What if lumber goes to $545?"', 'List the plants that would drop below $2,000 a load'],
    html: whatifPage,
  });
})();
