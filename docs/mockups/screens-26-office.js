/* Office › Requests (D37, D39): every request to the BB Pallets office in one place (transport POs,
   purchase approvals, invoices, credit notes, new customer setup, price changes), with its state,
   a frozen copy of what was asked, the answer, and the email thread. Today he records the office's
   answers; when the office switches over, this becomes their work queue, with nothing else changing. */
(function () {
  const ST = {
    asked: H.chip('Asked', 'warn'), over: H.chip('Overdue', 'bad'), ok: H.chip('Approved', 'ok'), chg: H.chip('Approved with changes', 'info'),
    no: H.chip('Declined', 'bad'), closed: H.chip('Closed'), sup: H.chip('Superseded'), draft: H.chip('Draft'),
  };
  const rows = [
    ['R-1043', 'Purchase approval', 'Algonquin · trim 6–7\', 1 load at $440', 'Nov 17', ST.ok, 'PO 5544', 'He recorded'],
    ['R-1042', 'Purchase approval', 'North Shore · 2 loads 10s at $525', 'Nov 17', ST.over, '—', ''],
    ['R-1041', 'Transport PO', 'L-2421 · Jane Street · Trans-Ontario $2,100', 'Nov 18', ST.asked, '—', ''],
    ['R-1040', 'Invoice', 'Order 24-0309 · Garden State · loaded quantities', 'Nov 16', ST.closed, 'INV 61022', 'He recorded'],
    ['R-1039', 'Transport PO', 'L-2420 · Caldari Road · $2,300', 'Nov 15', ST.chg, 'TPO 5542 at $2,450', 'He recorded'],
    ['R-1036', 'Transport PO', 'L-2420 · Caldari Road · $2,300, Thu', 'Nov 14', ST.sup, '—', 'Replaced by R-1039'],
    ['R-1035', 'New customer setup', 'Midland Bar & Tube · 1 plant, CAD', 'Nov 12', ST.asked, '—', ''],
    ['R-1031', 'Credit note', 'Order 24-0297 · 1 bundle short', 'Nov 9', ST.closed, 'CN 2210', 'He recorded'],
  ];
  const steps = [
    ['Transport PO to the carrier', 0], ['Approve a purchase', 0], ['Purchase order to the supplier', 0],
    ['Invoice to the customer', 0], ['Credit note', 0], ['New customer or supplier setup', 0], ['Payment received', 0],
  ];
  const page = () =>
    H.head('Office', 'Requests to the BB Pallets office', 'Everything you have asked the office for, and what they answered. Replies are matched by the reference in the subject, e.g. [TL-R-1042].',
      H.btn('Excel', '', 'xls') + H.btn('New request', 'primary', 'plus')) +
    H.kpis([
      H.gauge('Waiting on the office', '3', null, '1 overdue (R-1042, 2 days)', 'warn'),
      H.gauge('Answered, to record', '1', null, 'R-1043 approval read from your inbox'),
      H.gauge('Usual answer time', '5 h', null, 'transport PO · 1 day for approvals'),
      H.gauge('Office works', 'By email', null, 'see "Who does each step" below'),
    ]) +
    `<div class="split">` +
    H.panel('', H.filters(['*All', 'Waiting 3', 'Overdue 1', 'To record 1', 'Transport PO', 'Approval', 'Invoice', 'Closed']) +
      H.table(['Ref', 'Type', 'About', 'Asked', 'State', 'Office no.', ''], rows.map(r => [`<b>${r[0]}</b>`, r[1], r[2], r[3], r[4], r[5], `<span class="small muted">${r[6]}</span>`]), { sel: 1 }), '', '', true) +
    H.panel('R-1042 · Purchase approval', `
      ${H.stages(['Draft', 'Asked', 'Answered', 'Accepted by you', 'Closed'], 1)}
      <div style="margin-top:12px">${H.table(['', 'What you asked (frozen)'], [
        ['Supplier', 'North Shore Forest Products'], ['What', '2 loads, 2x3 × 10\', #2 & better'], ['Price', '$525 / MBF delivered (plan $545)'],
        ['Why', 'Buying gain ≈ $1,100 a load (D42)'], ['Asked', 'Nov 17, 4:02 pm · by email to accounts@bbpallets (example)'], ['Due by', 'Nov 18 · reminder sent Nov 19, 9:00']])}</div>
      <div class="small muted" style="margin:10px 0 6px">Thread</div>
      <div class="list" style="font-size:13px">
        <div class="li" style="padding-left:0;border-top:0">${H.icon('mail', 15)}<div class="grow"><b>You → office</b> · Purchase approval [TL-R-1042]<div class="small muted">Nov 17, 4:02 pm</div></div></div>
        <div class="li" style="padding-left:0">${H.icon('mail', 15)}<div class="grow"><b>You → office</b> · Reminder [TL-R-1042]<div class="small muted">Nov 19, 9:00 am · sent after your OK</div></div></div>
      </div>
      <div class="btns" style="margin-top:12px">${H.btn('Record the answer', 'primary')}${H.btn('Remind again')}${H.btn('Change the request')}${H.btn('Cancel', 'danger')}</div>
      <div class="small muted" style="margin-top:8px">Changing it makes a new request (R-1044) and marks this one superseded, so the history stays.</div>`) +
    `</div>` +
    H.panel('Who does each step', H.table(['Step', 'Done by', 'Today'], steps.map(([s, on]) => [s, H.seg(['The office, by email', 'The office, in Timberline'], on), '<span class="small muted">You send the request and record their answer</span>'])) +
      `<div class="toolbar" style="padding-top:12px">${H.callout('info', 'When the office starts using Timberline, switch a step to <b>in Timberline</b> and give them a login: the same requests then land in their queue and they answer here. The records, states and history stay the same; their screens for issuing POs and invoices are switched on (D37, D39).')}</div>`, '', true);
  S({
    id: 'office-requests', dept: 'office', title: 'Requests to the office', html: page,
    intent: 'He works for BB Pallets but runs his own day; the office does the official work. Every time he needs the office (a transport PO, approval of a purchase, an invoice, a credit, a new customer set up) it is a request here, with a frozen copy of what he asked, its state (asked, answered, approved with changes, declined, overdue, superseded), the office\'s answer and number, and the email thread. Today he records the answers; later the office can work this list itself, with a switch per step.',
    ref: 'D36, D37, D39 · Review M2',
    check: ['Who at the office handles each kind of request? One email address, or a person per type?', 'How long is too long to wait for each kind (transport PO, approval, invoice)?', 'When the office changes something (a smaller purchase, another carrier), how do they tell you?'],
    assistant: ['Read the office\'s reply and fill in the answer for you to check', 'Remind the office when a request is overdue, after your OK', '"What has the office not answered this week?"'],
  });
})();
