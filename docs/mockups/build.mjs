// Builds docs/mockups.html: one self-contained page (CSS + all screen files inlined).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, 'base.css'), 'utf8');
const files = ['base.js', ...readdirSync(here).filter(f => /^screens-.*\.js$/.test(f)).sort()];
const js = files.map(f => `/* ---- ${f} ---- */\n` + readFileSync(join(here, f), 'utf8')).join('\n');
const html = `<title>Timberline Mockups</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
`;
writeFileSync(join(here, '..', 'mockups.html'), html);
console.log('wrote docs/mockups.html', (html.length / 1024).toFixed(0) + ' KB', files.length + ' files');
