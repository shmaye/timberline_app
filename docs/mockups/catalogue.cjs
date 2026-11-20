// Writes docs/mockups/WINDOWS.md: every mockup window with its intent, questions and Assistant abilities,
// so the plan can be reviewed as text. usage: node catalogue.cjs (after node build.mjs)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const tmp = path.join(__dirname, 'shots', '_cat.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  fs.writeFileSync(tmp, '<!doctype html><meta charset=utf-8><body>' + fs.readFileSync(path.join(__dirname, '..', 'mockups.html'), 'utf8'));
  const b = await chromium.launch(); const p = await b.newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + tmp);
  const md = await p.evaluate(() => {
    const strip = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.replace(/\s+/g, ' ').trim(); };
    const out = ['# Timberline: every window in the mockups', '', 'Generated from `docs/mockups/` (the same text as the notes under each window). Open `docs/mockups.html` to see them.', ''];
    for (const d of DEPTS) {
      out.push(`## ${d.label}`, '');
      const ws = []; d.tabs.forEach(([id]) => { const w = WINDOWS.find(x => x.id === id); if (w) ws.push(w); WINDOWS.filter(x => x.kind !== 'screen' && x.tab === id).forEach(x => ws.push(x)); });
      for (const w of ws) {
        out.push(`### ${w.title} \`#${w.id}\` (${w.kind}${w.story ? `, order story step ${w.story}` : ''})`, '', strip(w.intent), '');
        if (w.check.length) { out.push('To check with BB Pallets:'); w.check.forEach(c => out.push(`- ${strip(c)}`)); out.push(''); }
        if (w.assistant.length) { out.push('Assistant here:'); w.assistant.forEach(c => out.push(`- ${strip(c)}`)); out.push(''); }
        if (w.ref) out.push(`Ref: ${strip(w.ref)}`, '');
      }
    }
    return out.join('\n');
  });
  fs.writeFileSync(path.join(__dirname, 'WINDOWS.md'), md); console.log('wrote WINDOWS.md', md.length, 'chars'); await b.close();
})();
