/* Loads › Carrier bookings. The salesperson does not issue the transport PO himself: he asks the
   BB Pallets office to issue it (price + date), the office sends it to the carrier, and the
   carrier's confirmation means two things: the date is booked and the price is accepted.
   Timberline tracks each step and keeps the emails (D35, D36). */
(function () {
  const st = D.story;
  const status = {
    req: H.chip('Asked the office', 'warn'), sent: H.chip('Office sent PO · waiting', 'warn'), conf: H.chip('Confirmed', 'ok'),
    draft: H.chip('Not requested yet'), changed: H.chip('Carrier changed it', 'bad'), pickup: H.chip('Pickup · no truck', 'info'),
    declined: H.chip('Declined', 'bad'), noshow: H.chip('No-show', 'bad'), rebooked: H.chip('Rebooked · backup', 'info'), cancelled: H.chip('Cancelled'),
  };
  const ref = r => `<a href="#office-requests" class="nowrap">${r}</a>`;
  const late = d => `<span class="nowrap" style="color:var(--bad)">${d}</span>`;
  // load, request, deliver to, carrier, ready date (sub), truck date, asked price, confirmed price, office PO, state, action
  const rows = [
    ['L-2417', ref('R-1038'), 'Ardent · Caldari Rd + Jane St', 'Trans-Ontario Freight', 'Mon Nov 23', 'Tue Nov 24', '$2,300', '$2,300', 'TPO 5531', status.conf, H.go('Open', 'doc-carrierpo', 'sm')],
    ['L-2419', ref('R-1037'), 'Garden State · Newark NJ', 'Liberty Line (US)', late('Fri Nov 27'), 'Thu Nov 26', 'US$3,400', '—', 'TPO 5540', status.sent, H.go('Record reply', 'dlg-carrierconfirm', 'sm')],
    ['L-2420', ref('R-1039'), 'Ardent · Caldari Road', 'Trans-Ontario Freight', 'Thu Nov 26', 'Fri Nov 27', '$2,300', '$2,450', 'TPO 5542', status.changed, H.btn('Decide', 'sm')],
    ['L-2421', ref('R-1041'), 'Ardent · Jane Street', 'Trans-Ontario Freight', '<span class="muted">asked</span>', 'Tue Dec 1', '$2,100', '', '—', status.req, H.btn('Remind office', 'sm')],
    ['L-2422', '—', 'Ardent · Caldari Road', 'Trans-Ontario Freight', 'Wed Dec 2', 'Thu Dec 3', '$2,300', '', '—', status.draft, H.go('Ask the office', 'doc-carrierpo', 'sm primary')],
    ['L-2415', ref('R-1034'), 'Ardent · Caldari Road', 'Bluewater (backup)', 'Wed Nov 18', 'Thu Nov 19', '$2,300', '$2,550', 'TPO 5536', status.rebooked, H.btn('Open', 'sm')],
    ['L-2413', ref('R-1033'), 'Garden State · Newark NJ', 'Trans-Ontario Freight', 'Mon Nov 16', 'Tue Nov 17', '$3,100', '—', 'TPO 5533', status.noshow, H.btn('Rebook', 'sm')],
    ['L-2414', '—', 'Lakeshore · Toronto', 'Customer picks up', 'Fri Nov 20', 'Mon Nov 23', '—', '—', '—', status.pickup, ''],
  ];
  const page = () =>
    H.head('Loads', 'Carrier bookings', 'Each booking is a request to the BB Pallets office (Office › Requests). The office sends the transport PO; the carrier\'s confirmation books the date and accepts the price.',
      H.btn('Excel', '', 'xls') + H.go('Ask the office for a transport PO', 'doc-carrierpo', 'primary', 'mail')) +
    H.stages(['Ask the office', 'Office sends PO to carrier', 'Carrier confirms date + price', 'Ready date known', 'Truck booked'], 2) +
    H.kpis([
      H.gauge('Waiting on the office', '1', null, 'L-2421 · asked yesterday', 'warn'),
      H.gauge('Waiting on the carrier', '1', null, 'L-2419 · PO sent 3 h ago', 'warn'),
      H.gauge('Truck before the wood is ready', '1', null, 'L-2419 · ready Fri, truck Thu', 'bad'),
      H.gauge('Freight vs plan, November', '+$150', null, '1 load over the $2,300 used in pricing'),
    ]) +
    H.panel('', H.filters(['*All', 'Not requested', 'Waiting on office', 'Waiting on carrier', 'Confirmed', 'Changed', 'Declined · no-show', 'Pickups']) +
      H.table(['Load', 'Request', 'Deliver to', 'Carrier', 'Wood ready', 'Truck date', { t: 'Price asked', num: true }, { t: 'Confirmed', num: true }, 'Office PO no.', 'Status', ''], rows, { sel: 0 }), '', '', true) +
    H.callout('bad', '<b>L-2419: the truck is booked for Thursday, but Pinegrove says the wood is ready Friday.</b> The transport PO is made when the order is entered, but a booking is not final until the subcontractor\'s ready date is known. Ask the office to move it (a new request that replaces R-1037).', H.go('Open the request', 'office-requests', 'sm')) +
    H.callout('bad', '<b>L-2420: Trans-Ontario confirmed Friday, but at $2,450 instead of $2,300.</b> Tell the office to accept it (the load\'s margin drops by $150), or ask them to book the backup carrier, Bluewater, at $2,550.',
      H.btn('Email the office', 'sm')) +
    H.callout('info', 'Customer pickups need no truck. A no-show or a carrier that declines is rebooked with the backup carrier as a new request; the old one stays in the history. Today the office issues the transport PO outside Timberline and you record its number. Office › Requests › "Who does each step" can switch this to <b>the office, in Timberline</b>: the same request then lands in the office\'s queue.');
  S({
    id: 'loads-bookings', dept: 'loads', title: 'Carrier bookings', story: 6, html: page,
    intent: 'Once an order is in, the truck has to be booked. He does not issue the transport PO himself: each booking is a request to the BB Pallets office (the same request record as every office step, with a reference like [TL-R-1041] in the email subject so replies match). The carrier\'s confirmation means two things: the date is booked, and the price is accepted. The asked price stays beside the confirmed one. A booking also shows the subcontractor\'s ready date and warns when the truck comes before the wood is ready; it is not final until that date is known. Declined, no-show, rebooked with the backup carrier and cancelled are states too. The confirmed price becomes the load\'s real freight cost for its margin.',
    ref: 'Learned from BB Pallets, Nov 2026 · D35, D36, D39, D41 · Review M2, S1',
    check: ['Does the subcontractor give you a ready date before the truck is booked, or is the truck booked first?', 'Does the salesperson choose the carrier and price, or does the office?', 'Does the carrier\'s confirmation go to the office, to the salesperson, or both? Is there a confirmation number?', 'What does the office need in the request: pickup and delivery windows, equipment type, drops, extra-stop charges?', 'If the carrier changes the price or date, who decides?'],
    assistant: ['Write the request to the office from the order and the load plan', 'Read the confirmation email and fill it in, flagging a different price or date', 'Remind you when the office or the carrier has not answered'],
  });

  const under = () => page();
  S({
    id: 'doc-carrierpo', dept: 'loads', tab: 'loads-bookings', kind: 'document', title: 'Transport PO request to the office', story: 6, under,
    intent: 'The salesperson\'s request to the BB Pallets office to book the truck: which load (and its revision), carrier, pickup and delivery, the date the wood is ready, equipment and the price agreed. The office turns it into its official transport PO to the carrier. It is request R-1038; the reference [TL-R-1038] in the subject lets Timberline match the replies. What he asked is kept frozen, so a later change is a new request, not an edit.',
    ref: 'D35, D36, D39 · D8 (print, PDF, email) · Review M2, S1',
    check: ['Can we see a real transport PO the office sends today, so the request carries everything they need?', 'Is the price always per load, or sometimes with fuel surcharge or extra-stop charges?', 'Would the office ever want to use Timberline to issue the PO directly (later)?'],
    assistant: ['Fill it from the order, the load plan and the carrier\'s usual rate', 'Send it to the office and remind them if there is no PO by the end of the day'],
    html: () => H.doc('Transport PO request · L-2417', `
      ${H.letterhead('TRANSPORT PO REQUEST', [['Request', 'R-1038'], ['To', 'BB Pallets office'], ['Load', st.load + ' · Rev 1'], ['Order', st.order], ['Date', 'Nov 19, 2026']])}
      <p><b>Subject:</b> Transport PO request · L-2417 · Tue Nov 24 [TL-R-1038]</p>
      <p>Please issue a transport PO for this load and send it to the carrier:</p>
      <div class="cols">
        <div class="box2"><div class="k">Carrier</div>Trans-Ontario Freight<br>(backup: Bluewater Carriers, $2,550)</div>
        <div class="box2"><div class="k">Pick up</div>Kessler Wood Works, Concord yard<br>Tue Nov 24, 2026 · 7:00–9:00<br><span style="color:#555">Wood ready Mon Nov 23 (Kessler)</span></div>
        <div class="box2"><div class="k">Deliver</div>1. Ardent Metals, Caldari Road plant, Concord ON<br>2. Ardent Metals, Jane Street plant, Vaughan ON<br>Tue Nov 24 · by 15:00</div>
      </div>
      <table><thead><tr><th>Equipment</th><th>Load</th><th class="num">Bundles</th><th class="num">Weight lb</th><th class="num">Drops</th></tr></thead>
      <tbody><tr><td>53' dry van, tandem</td><td>Wood dunnage, untreated softwood</td><td class="num">70+</td><td class="num">40,200</td><td class="num">2</td></tr></tbody></table>
      <table class="tot"><tbody><tr><td>Line haul, per load</td><td class="num">$2,150.00</td></tr><tr><td>Second drop</td><td class="num">$150.00</td></tr><tr><td>Price to put on the PO (CAD)</td><td class="num">$2,300.00</td></tr></tbody></table>
      <p>The carrier's confirmation books the date and accepts this price. Please forward it to me, or ask them to copy me.</p>
      <div class="sig"><div>Requested by: Sales, BB Pallets</div><div>Office PO no. · issued by · date</div></div>
      <div class="fine">Example layout, sent as an email with this PDF attached.</div>
      <div class="btns" style="justify-content:center;margin-top:18px">${H.go('Email to the office', 'dlg-email', 'primary', 'mail')}${H.go('Record the confirmation', 'dlg-carrierconfirm')}</div>`, false),
  });

  S({
    id: 'dlg-carrierconfirm', dept: 'loads', tab: 'loads-bookings', kind: 'dialog', title: 'Record the carrier\'s confirmation', story: 6, under,
    intent: 'When the confirmation comes back (from the carrier, or forwarded by the office), request R-1038 is answered: office PO number, the carrier\'s confirmation number, the date and the price, kept beside what was asked. A different date or price is flagged for a decision; a refusal or no-show is rebooked with the backup carrier as a new request. Once confirmed, the bill of lading is drafted from the load plan and the carrier (it is made here now, not when the load is confirmed). The confirmed price is what the load\'s margin uses.',
    ref: 'D35, D36, D39, D41 · Hand-off 4.3 (freight $2,300, backup $2,500–2,600), 9 · Review M2, M5',
    check: ['Do carriers ever confirm part of it (the date but not the price)?', 'Who is allowed to accept a higher price: the salesperson or the office?'],
    assistant: ['Fill this in from the forwarded email', 'Explain the margin effect of a price change'],
    html: () => H.dialog('Carrier confirmation · L-2417 · request R-1038', `
      ${H.callout('ok', 'Confirmation from Trans-Ontario Freight, forwarded by the office on Nov 19 at 2:14 pm, read by the Assistant. Check and save.')}
      ${H.form([H.field('Office PO no.', 'TPO 5531'), H.field('Carrier confirmation no.', 'TOF-88213'), H.field('Pickup date', 'Tue Nov 24, 7:00–9:00'), H.field('Confirmed price', '$2,300.00', 'CAD')])}
      ${H.table(['', 'Asked', 'Confirmed', ''], [
        ['Date', 'Tue Nov 24', 'Tue Nov 24', H.chip('Same', 'ok')],
        ['Wood ready (Kessler)', 'Mon Nov 23', '—', H.chip('Before the truck', 'ok')],
        ['Price', '$2,300.00', '$2,300.00', H.chip('Same', 'ok')],
        ['Equipment', '53\' dry van', '53\' dry van', H.chip('Same', 'ok')]])}
      ${H.callout('info', 'Freight on this load: <b>$2,300</b>, the same as the price list was built on ($2,300 ÷ 44 MBF = $52.27 per MBF). Margin unchanged.')}
      <div class="small muted">Attached: the forwarded email (saved on order ${st.order} and on Trans-Ontario Freight).</div>`,
      H.btn('Cancel') + H.btn('Declined or no-show: rebook') + H.go('Confirm and make the bill of lading', 'doc-bol', 'primary', 'check')),
  });
})();
