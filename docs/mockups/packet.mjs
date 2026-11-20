// Builds docs/REVIEW-PACKET.md: the review brief + the full hand-off + the window catalogue, in one file.
// usage: node build.mjs && node catalogue.cjs && node packet.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), docs = join(here, '..');
const part = (title, file) => `\n\n---\n\n<!-- ${title} -->\n\n` + readFileSync(file, 'utf8').replace(/^# /m, '# ');
const out = `# Timberline review packet\n\nThree parts: **1. Review brief** · **2. HANDOFF.md** (the plan) · **3. WINDOWS.md** (every mockup window).\nGenerated ${new Date().toISOString().slice(0, 10)} from the repository.`
  + part('PART 1: REVIEW BRIEF', join(docs, 'REVIEW-BRIEF.md'))
  + part('PART 2: HANDOFF.md', join(docs, 'HANDOFF.md'))
  + part('PART 3: WINDOWS.md', join(here, 'WINDOWS.md'));
writeFileSync(join(docs, 'REVIEW-PACKET.md'), out);
console.log('wrote docs/REVIEW-PACKET.md', Math.round(out.length / 1024) + ' KB');
