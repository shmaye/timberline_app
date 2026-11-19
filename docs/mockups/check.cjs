// Opens every window, reports script errors and empty windows, and saves screenshots.
// usage: node check.cjs [filter]   (screens saved to $OUT or ./shots)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const filter = process.argv[2] || '';
  const out = process.env.OUT || path.join(__dirname, 'shots'); fs.mkdirSync(out, { recursive: true });
  const page0 = fs.readFileSync(path.join(__dirname, '..', 'mockups.html'), 'utf8');
  const tmp = path.join(out, '_page.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,viewport-fit=cover"></head><body>' + page0 + '</body></html>');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + tmp); await p.waitForTimeout(300);
  const ids = await p.evaluate(() => WINDOWS.map(w => w.id));
  const missing = await p.evaluate(() => DEPTS.flatMap(d => d.tabs.map(t => t[0])).filter(id => !WINDOWS.find(w => w.id === id)));
  console.log('windows:', ids.length, 'missing tabs:', missing.join(', ') || 'none');
  for (const id of ids.filter(i => i.includes(filter))) {
    errs.length = 0;
    await p.evaluate(i => { location.hash = i; }, id); await p.waitForTimeout(60);
    const ok = await p.evaluate(() => document.querySelector('.work') && document.querySelector('.work').innerText.trim().length > 20);
    const wide = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (errs.length || !ok || wide) console.log('PROBLEM', id, errs.join(' | '), ok ? '' : 'EMPTY', wide ? 'PAGE-SCROLLS-SIDEWAYS' : '');
    if (process.env.SHOTS) await p.screenshot({ path: path.join(out, id + '.png'), fullPage: true });
  }
  await b.close();
})();
