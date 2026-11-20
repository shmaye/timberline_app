/* Loads › Carrier bookings: the transport PO (booking note) sent to the carrier, and the carrier's
   confirmation, which means two things: the date is booked, and the price is accepted.
   Learned from BB Pallets (Nov 2026): when an order is entered, the office creates a purchase order
   for transport with a price and a date and sends it to the carrier; the carrier confirms. */
(function () {
  const st = D.story;
  const status = {
    sent: H.chip('Sent · waiting', 'warn'), conf: H.chip('Confirmed', 'ok'), draft: H.chip('Draft'),
    changed: H.chip('Carrier changed it', 'bad'), pickup: H.chip('Pickup · no booking', 'info'),
  };
  const rows = [
    ['TPO-2417', 'L-2417', `Ardent · Caldari Road + Jane St`, 'Trans-Ontario Freight', 'Tue Nov 24', '$2,300', '$2,300', status.conf, H.go('Open', 'doc-carrierpo', 'sm')],
    ['TPO-2419', 'L-2419', 'Garden State · Newark NJ', 'Liberty Line (US)', 'Thu Nov 26', 'US$3,400', '—', status.sent, H.go('Record reply', 'dlg-carrierconfirm', 'sm')],
    ['TPO-2420', 'L-2420', 'Ardent · Caldari Road', 'Trans-Ontario Freight', 'Fri Nov 27', '$2,300', '$2,450', status.changed, H.btn('Decide', 'sm')],
    ['TPO-2421', 'L-2421', 'Ardent · Jane Street', 'Trans-Ontario Freight', 'Tue Dec 1', '$2,100', '', status.draft, H.btn('Send', 'sm primary')],
    ['—', 'L-2414', 'Lakeshore · Toronto', 'Customer picks up', 'Mon Nov 23', '—', '—', status.pickup, ''],
  ];
  const page = () =>
    H.head('Loads', 'Carrier bookings', 'A transport PO goes to the carrier with a price and a date. Their confirmation books the date and accepts the price.',
      H.btn('Excel', '', 'xls') + H.go('New transport PO', 'doc-carrierpo', 'primary', 'plus')) +
    H.kpis([
      H.gauge('Waiting for a reply', '1', null, 'TPO-2419 · sent 3 h ago', 'warn'),
      H.gauge('Carrier changed price or date', '1', null, 'TPO-2420 · +$150', 'bad'),
      H.gauge('Confirmed this week', '3', null, 'All at the booked price', 'ok'),
      H.gauge('Freight vs plan, November', '+$150', null, '1 load over the $2,300 used in pricing'),
    ]) +
    H.panel('', H.filters(['*All', 'Draft', 'Sent · waiting', 'Confirmed', 'Changed', 'Pickups']) +
      H.table(['Transport PO', 'Load', 'Deliver to', 'Carrier', 'Pickup date', { t: 'Booked price', num: true }, { t: 'Confirmed', num: true }, 'Status', ''], rows, { sel: 0 }), '', '', true) +
    H.callout('bad', '<b>TPO-2420: Trans-Ontario confirmed Friday, but at $2,450 instead of $2,300.</b> Accept the new price (the load\'s margin drops by $150), or book the backup carrier, Bluewater, at $2,550.',
      H.btn('Accept $2,450', 'sm') + ' ' + H.btn('Book Bluewater', 'sm')) +
    H.callout('info', 'Customer pickups need no booking. A load cannot be confirmed for loading until its booking is confirmed (proposed).');
  S({
    id: 'loads-bookings', dept: 'loads', title: 'Carrier bookings', story: 6, html: page,
    intent: 'When an order is entered, the office books the truck: a transport purchase order to the carrier with the price and the pickup date. The carrier\'s confirmation means two things: the date is booked, and the price is accepted. This screen shows every booking and its state (draft, sent and waiting, confirmed, or changed by the carrier), so nothing ships on an unconfirmed truck, and the confirmed price becomes the load\'s real freight cost for its margin.',
    ref: 'Learned from BB Pallets, Nov 2026 · D35 · Hand-off 4.6, 6 (carriers)',
    check: ['Is the transport PO sent as soon as the order is entered, or after the load is confirmed?', 'How does the carrier confirm: email reply, phone, or their own booking form? Is there a confirmation number?', 'What is on the transport PO besides price and date: pickup and delivery windows, equipment type, number of drops, extra-stop charges?', 'If the carrier changes the price or date, who decides: accept it, or go to the backup carrier?'],
    assistant: ['Draft the transport PO from the order and the carrier\'s usual rate', 'Read the carrier\'s reply email and fill in the confirmation, flagging a different price or date', 'Remind you when a booking has no reply after a few hours'],
  });

  const under = () => page();
  S({
    id: 'doc-carrierpo', dept: 'loads', tab: 'loads-bookings', kind: 'document', title: 'Transport PO (booking note)', story: 6, under,
    intent: 'The booking note sent to the carrier: which load, where to pick up and deliver, the date, the equipment, and the price BB Pallets will pay. Sending it asks the carrier to book the truck; their confirmation accepts both the date and the price. It goes out from your own mailbox and is logged on the order and the carrier.',
    ref: 'D35 · D8 (print, PDF, email)',
    check: ['Can we see a real transport PO you send today, to copy its layout?', 'Is the price always per load, or sometimes per mile or with fuel surcharge added?', 'Should the carrier sign and return it, or is an email reply enough?'],
    assistant: ['Fill it from the order, the load plan and the carrier\'s rate', 'Email it to the carrier\'s dispatch'],
    html: () => H.doc('Transport PO · TPO-2417', `
      ${H.letterhead('TRANSPORT PURCHASE ORDER', [['PO', 'TPO-2417'], ['Load', st.load], ['Order', st.order], ['Date', 'Nov 19, 2026']])}
      <div class="cols">
        <div class="box2"><div class="k">Carrier</div>Trans-Ontario Freight<br>Dispatch · dispatch@example-carrier.ca</div>
        <div class="box2"><div class="k">Pick up</div>Kessler Wood Works, Concord yard<br>Tue Nov 24, 2026 · 7:00–9:00</div>
        <div class="box2"><div class="k">Deliver</div>1. Ardent Metals, Caldari Road plant, Concord ON<br>2. Ardent Metals, Jane Street plant, Vaughan ON<br>Tue Nov 24 · by 15:00</div>
      </div>
      <table><thead><tr><th>Equipment</th><th>Load</th><th class="num">Bundles</th><th class="num">Weight lb</th><th class="num">Drops</th></tr></thead>
      <tbody><tr><td>53' dry van, tandem</td><td>Wood dunnage, untreated softwood</td><td class="num">88+</td><td class="num">43,100</td><td class="num">2</td></tr></tbody></table>
      <table class="tot"><tbody><tr><td>Line haul, per load</td><td class="num">$2,150.00</td></tr><tr><td>Second drop</td><td class="num">$150.00</td></tr><tr><td>Total agreed price (CAD)</td><td class="num">$2,300.00</td></tr></tbody></table>
      <p><b>Please confirm this booking by reply.</b> Your confirmation books the pickup date above and accepts the total price. If you cannot take it at this date or price, reply with what you can do; nothing is booked until we agree.</p>
      <div class="sig"><div>Issued by: Sales desk, BB Pallets</div><div>Carrier confirmation no. · name · date</div></div>
      <div class="fine">Example layout. The real one will follow BB Pallets' current transport PO.</div>
      <div class="btns" style="justify-content:center;margin-top:18px">${H.go('Email to the carrier', 'dlg-email', 'primary', 'mail')}${H.go('Record the confirmation', 'dlg-carrierconfirm')}</div>`, false),
  });

  S({
    id: 'dlg-carrierconfirm', dept: 'loads', tab: 'loads-bookings', kind: 'dialog', title: 'Record the carrier\'s confirmation', story: 6, under,
    intent: 'When the carrier replies, the booking is marked confirmed with their confirmation number, the confirmed date and the confirmed price. If either differs from what was sent, it is flagged and someone decides: accept it, or book the backup carrier. The confirmed price is what the load\'s margin uses.',
    ref: 'D35 · Hand-off 4.3 (freight $2,300, backup $2,500–2,600), 9 (freight by carrier)',
    check: ['Do carriers ever confirm part of it (the date but not the price)?', 'Who is allowed to accept a higher price?'],
    assistant: ['Fill this in from the carrier\'s email', 'Explain the margin effect of a price change'],
    html: () => H.dialog('Carrier confirmation · TPO-2417', `
      ${H.callout('ok', 'Reply from Trans-Ontario Freight dispatch, Nov 19 at 2:14 pm, read by the Assistant. Check and save.')}
      ${H.form([H.field('Confirmation no.', 'TOF-88213'), H.field('Confirmed by', 'Dispatch, Trans-Ontario'), H.field('Pickup date', 'Tue Nov 24, 7:00–9:00'), H.field('Confirmed price', '$2,300.00', 'CAD')])}
      ${H.table(['', 'Sent', 'Confirmed', ''], [
        ['Date', 'Tue Nov 24', 'Tue Nov 24', H.chip('Same', 'ok')],
        ['Price', '$2,300.00', '$2,300.00', H.chip('Same', 'ok')],
        ['Equipment', '53\' dry van', '53\' dry van', H.chip('Same', 'ok')]])}
      ${H.callout('info', 'Freight on this load: <b>$2,300</b>, the same as the price list was built on ($2,300 ÷ 44 MBF = $52.25 per MBF). Margin unchanged.')}
      <div class="small muted">Attached: carrier email (saved on order ${st.order} and on Trans-Ontario Freight).</div>`,
      H.btn('Cancel') + H.btn('Mark as confirmed', 'primary')),
  });
})();
