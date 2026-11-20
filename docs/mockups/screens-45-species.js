/* Catalog › Species & weights (D45). Wood weight is kept per species and condition (dry / green) as an
   average pounds per board foot plus a variance up or down. Every load's weight is then shown as a
   range (light side · average · heavy side), and the planner lets him choose which one to plan on. */
(function () {
  const SP = D.species;
  const f2 = n => n.toFixed(2);
  const rows = SP.map((s, i) => [
    `<b>${s.name}</b>`, H.chip(s.cond, s.cond === 'Dry' ? 'brand' : 'info'),
    f2(s.avg), '± ' + f2(s.var), `${f2(s.avg - s.var)} – ${f2(s.avg + s.var)}`,
    Math.round(s.var / s.avg * 100) + '%', s.basis, s.items ? String(s.items) : '—', H.btn('Edit', 'sm')]);
  const ex = { bf: 21162 }; const spf = SP[0];
  const lo = ex.bf * (spf.avg - spf.var), av = ex.bf * spf.avg, hi = ex.bf * (spf.avg + spf.var);
  const scale = [
    ['L-2398', 'Oct 28', 'Ardent · Caldari Road', '21,480', '41,300', '1.92'],
    ['L-2402', 'Nov 2', 'Garden State · Newark', '20,950', '38,700', '1.85'],
    ['L-2405', 'Nov 6', 'Ardent · Caldari Road', '22,100', '43,600', '1.97'],
    ['L-2409', 'Nov 11', 'Lakeshore · Toronto (pickup)', '18,300', '33,500', '1.83'],
    ['L-2404', 'Nov 4', 'Ardent · Jane Street', '9,800', '18,900', '1.93'],
    ['L-2414', 'Nov 17', 'Ardent · Caldari Road', '21,900', '41,000', '1.87'],
  ];
  const page = () =>
    H.head('Catalog', 'Species & weights', 'How much the wood weighs: an average per board foot, and how far it can be off, up or down. Every item belongs to one species.',
      H.btn('Excel', '', 'xls') + H.btn('New species', 'primary', 'plus')) +
    H.panel('', H.table(['Species', 'Condition', { t: 'Average lb / bd ft', num: true }, { t: 'Variance', num: true }, { t: 'Range', num: true }, { t: '±', num: true }, 'Based on', { t: 'Items', num: true }, ''], rows, { sel: 0 }), '', '', true) +
    `<div class="grid2">` +
    H.panel('Edit · SPF dry', H.form([
      H.field('Species', 'SPF (spruce-pine-fir)'), H.field('Condition', 'Dry (kiln or air dried)'),
      H.field('Average weight', '1.90', 'lb per bd ft'), H.field('Can vary by', '± 0.20', 'lb per bd ft (± 11%)'),
    ]) + `<div class="small muted" style="margin-top:10px">Light side 1.70 · average 1.90 · heavy side 2.10 lb per board foot. Wetter wood after rain, or a different supplier, moves it toward the heavy side.</div>`) +
    H.panel('What it means for a load', H.kpis([
      H.gauge('Light side', `${n0(lo)} <small>lb</small>`, lo / 450, 'at 1.70 lb / bd ft', 'ok'),
      H.gauge('Average', `${n0(av)} <small>lb</small>`, av / 450, 'at 1.90 lb / bd ft', 'ok'),
      H.gauge('Heavy side', `${n0(hi)} <small>lb</small>`, hi / 450, 'at 2.10 lb / bd ft', hi > 45000 ? 'bad' : hi / 450 > 95 ? 'warn' : 'ok'),
    ]) + `<div class="small muted" style="margin-top:10px">Example: load L-2417, ${n0(ex.bf)} bd ft of SPF on a 53' dry van (45,000 lb). The planner shows all three and lets you choose what to plan on.</div>`) +
    `</div>` +
    H.panel('Scale weights recorded · SPF dry', H.table(['Load', 'Date', 'Deliver to', { t: 'Bd ft', num: true }, { t: 'Scale lb', num: true }, { t: 'lb / bd ft', num: true }], scale) +
      `<div class="toolbar" style="padding-top:12px">${H.callout('info', 'Six loads weighed: average <b>1.90</b>, lowest 1.83, highest 1.97 lb per board foot. Your variance of ± 0.20 covers all of them.', H.btn('Use these figures', 'sm'))}</div>`,
      H.btn('Add a scale weight', 'sm', 'plus'), true);
  S({
    id: 'catalog-species', dept: 'catalog', title: 'Species & weights', html: page,
    intent: 'Wood weight drives the load (weight usually runs out before space), and it changes with species and moisture. So, like the products, he keeps a list of species, each with an average weight per board foot and how far it can be off, up or down. Every load then shows its weight as light side, average and heavy side, and he decides how much risk to take. Scale weights from real loads, when he has them, show whether the figures are right.',
    ref: 'D45 · D43 · Review M1, S7',
    check: ['Which species do you buy, and is the wood dry or green when it ships?', 'Does weight differ enough between suppliers to keep them apart?', 'Do you ever get a scale ticket for a load?'],
    assistant: ['Work out the average and variance from the scale weights you have', 'Warn when a load is only legal on the light side'],
  });
})();
