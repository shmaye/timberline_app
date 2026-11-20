/* Today (D46): his day in one place. Three parts:
   1. Replies: the Assistant reads every reply in the threads Timberline started (D38) and says what it
      means: confirmed, asks for more information, changed something, or declined. One click to act.
   2. Calendar: his Outlook calendar together with Timberline's own dates (ship days, pickups, deliveries,
      split loads coming due), so it is one calendar, not two.
   3. Tasks: to do, waiting on (by party: office, carriers, customers, suppliers, subcontractors), to review.
   A task list, not a dashboard of tiles (D3). */
(function () {
  const party = { customer: ['Customer', 'brand'], office: ['BB office', 'warn'], carrier: ['Carrier', 'info'], supplier: ['Supplier', ''], sub: ['Subcontractor', ''] };
  const pchip = k => H.chip(party[k][0], party[k][1]);
  const meaning = { ok: ['Confirmed', 'ok'], ask: ['Asks for more', 'info'], chg: ['Changed it', 'bad'], no: ['Declined', 'bad'] };
  const replies = [
    ['customer', 'Dana Ferreira · Ardent Metals', 'Re: Load proposal 24-0318 · Caldari Road', 'ok', 'Confirmed the proposal and attached <b>PO 77815</b> for one load. Asks for the second half (3x3 × 38½") in 3 weeks.', H.go('Match the PO', 'dlg-pomatch', 'primary sm'), '8:14'],
    ['carrier', 'Liberty Line dispatch (via the office)', 'Re: Transport PO 5540 · L-2419 Newark', 'chg', 'Can take it <b>Friday, not Thursday</b>. Price stays US$3,400.', H.go('Decide', 'loads-bookings', 'sm'), '9:02'],
    ['office', 'BB Pallets office · Accounts', 'Re: [TL-R-1043] Purchase approval · Algonquin trim', 'ok', '<b>Approved</b>, office PO 5544. Delivery to Kessler yard next Tuesday.', H.go('Record it', 'office-requests', 'sm'), '9:40'],
    ['supplier', 'Muskoka Sawmill', 'Re: 2x4 × 10\' price for December', 'ask', 'Asks how many loads you want before they quote ($475 last time).', H.btn('Draft answer', 'sm'), '10:15'],
    ['sub', 'Kessler Wood Works', 'Re: Job J-1182 loaded', 'chg', 'Loaded <b>26 bundles</b> of 3x3 × 31" for Caldari Road, not 27; filler 5 bundles.', H.go('Enter quantities', 'dlg-loaded', 'sm'), '11:20'],
  ];
  const replyList = () => `<div class="list">${replies.map(([p, who, subj, m, sum, act, t], i) => `<div class="li" style="${i ? '' : 'border-top:0'};align-items:flex-start">
      <div class="grow"><div class="btns" style="gap:6px">${pchip(p)}${H.chip(meaning[m][0], meaning[m][1])}<span class="small muted">${t}</span></div>
      <div style="margin-top:4px"><b>${who}</b><div class="small muted">${subj}</div></div>
      <div class="small" style="margin-top:4px">${H.icon('spark', 13)} ${sum}</div></div>
      <div style="flex:none">${act}</div></div>`).join('')}</div>`;

  // calendar: Outlook events (outline) and Timberline dates (filled), one week
  const days = [
    ['Thu 19', [['9:00', 'Call Dana: January prices', 'o'], ['14:00', 'North Shore visit (yard)', 'o'], ['', 'Count sheet reminder: Kessler yard', 't']]],
    ['Fri 20', [['', 'L-2419 ships (moved?)', 't'], ['11:00', 'Weekly call, BB office', 'o']]],
    ['Mon 23', [['', 'L-2414 pickup · Lakeshore', 't']]],
    ['Tue 24', [['7:00', 'L-2417 loads at Kessler', 't'], ['', 'L-2417 delivers · 2 drops', 't']]],
    ['Wed 25', [['10:00', 'Dentist', 'o']]],
  ];
  const ev = ([t, label, k]) => `<div style="border-radius:5px;padding:5px 7px;font-size:12px;margin-top:5px;${k === 't' ? 'background:var(--brand-soft);color:var(--fg)' : 'border:1px solid var(--line-2)'}">${t ? `<b class="num">${t}</b> ` : ''}${label}</div>`;
  const calendar = () => `<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px">${days.map(([d, es], i) => `<div style="min-width:0"><div class="small" style="font-weight:600;${i === 0 ? 'color:var(--brand)' : ''}">${d}</div>${es.map(ev).join('')}</div>`).join('')}</div>
    <div class="btns small muted" style="margin-top:12px"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--brand-soft)"></span> from Timberline (ships, pickups, deliveries, split loads due)<span style="display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid var(--line-2);margin-left:10px"></span> from your Outlook calendar</div>`;

  const waiting = [
    ['office', 'Transport PO for L-2421 · Jane Street', 'asked yesterday 4:10 pm', 'warn', 'Remind'],
    ['office', '[TL-R-1042] Purchase approval · North Shore 2 loads', 'asked 2 days ago · overdue', 'bad', 'Remind'],
    ['carrier', 'Confirmation of L-2419 (Liberty Line)', 'PO sent 3 h ago', '', 'Open'],
    ['customer', 'PO for proposal P-24-0322 · Garden State', 'sent 6 days ago', 'bad', 'Nudge'],
    ['supplier', 'Algonquin: trim load price for January', 'asked Monday', '', 'Open'],
    ['sub', 'Kessler: ready date for J-1185', 'asked this morning', '', 'Open'],
  ];
  const todo = [
    ['Send the Jane Street proposal (2 lines, 41% of a truck)', 'today', 'orders-proposals'],
    ['Book the truck for L-2422 · ask the office', 'today', 'loads-bookings'],
    ['Re-price Lakeshore: list is stale (built on $440)', 'this week', 'pricing-lists'],
    ['Count sheet for Kessler yard due Nov 30', 'Nov 30', 'inventory-counts'],
  ];
  const review = [
    ['Loaded quantities from Kessler (read by the Assistant)', 'dlg-loaded'],
    ['Customer PO 77815 vs proposal (1 line differs)', 'dlg-pomatch'],
    ['Carrier changed L-2420 to $2,450', 'loads-bookings'],
  ];
  const tasks = () =>
    `<div class="btns" style="margin-bottom:10px">${H.seg(['Waiting on 6', 'To do 4', 'To review 3'], 0)}</div>` +
    `<div class="list">${waiting.map(([p, what, since, st, act], i) => `<div class="li" style="${i ? '' : 'border-top:0'};padding-left:0;padding-right:0">${H.dot(st || 'info')}<div class="grow"><div>${what}</div><div class="small muted">${pchip(p)} ${since}</div></div>${H.btn(act, 'sm')}</div>`).join('')}</div>` +
    `<h4 style="font-size:13px;margin:16px 0 4px">To do</h4><div class="list">${todo.map(([t, when, id]) => `<div class="li" style="padding-left:0;padding-right:0">${H.box(false)}<div class="grow"><a href="#${id}" style="color:var(--fg);text-decoration:none">${t}</a></div><span class="small muted nowrap">${when}</span></div>`).join('')}</div>` +
    `<h4 style="font-size:13px;margin:16px 0 4px">To review</h4><div class="list">${review.map(([t, id]) => `<div class="li" style="padding-left:0;padding-right:0">${H.dot('warn')}<div class="grow"><a href="#${id}" style="color:var(--fg);text-decoration:none">${t}</a></div>${H.go('Review', id, 'sm')}</div>`).join('')}</div>`;

  S({
    id: 'today', dept: 'today', title: 'Today',
    intent: 'His day in one place, the first thing he opens. <b>Replies:</b> because Timberline reads his inbox and keeps each thread (D38), the Assistant reads every answer and says what it means (confirmed, asks for more, changed something, declined) with one click to act. <b>Calendar:</b> his Outlook calendar together with Timberline\'s own dates (ships, pickups, deliveries, split loads due). <b>Tasks:</b> what to do, what he is waiting on from each party, and what to review, with reminders when nobody answers. (Proposed layout.)',
    ref: 'D46 · D38 · Hand-off 1a · Review "Worth adding"',
    check: ['What do you look at first thing in the morning today: email, calendar, a list on paper?', 'Do you keep your appointments in Outlook (Hotmail) or somewhere else?', 'How long before a missing answer should turn into a reminder: a few hours, a day?'],
    assistant: ['Read each reply and say what it means, with the next step ready', '"What am I waiting on from the office?"', 'Put a ship date or a call on your Outlook calendar'],
    dock: H.assistant([
      ['me', 'What am I waiting on from the office?'],
      ['ai', 'Two things: the transport PO for L-2421 (asked yesterday) and approval R-1042 for the North Shore loads (2 days, overdue).'],
      ['propose', 'Send one reminder to the office for both, with the details again.'],
    ]),
    html: () => H.head('Thursday, November 19', 'Good morning', '5 new replies · 6 waiting on others · 4 to do · 3 to review', H.btn('New task', '', 'plus') + H.go('Office requests', 'office-requests', 'primary')) +
      `<div class="split">` +
      H.panel('New replies, read for you', replyList(), `<span class="small muted">from your inbox</span>`, true).replace('class="bd flush"', 'class="bd" style="padding-top:0"') +
      H.panel('Tasks', tasks()) +
      `</div>` +
      H.panel('This week', calendar(), `<span class="small muted">Outlook calendar + Timberline</span>${H.btn('Month', 'sm', 'cal')}`),
  });
})();
