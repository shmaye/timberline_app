# Timberline: brief for an independent plan review

You are reviewing the **plan** for Timberline before any of it is built. Nothing
is coded yet except clickable mockups. Your job is to find what is wrong,
missing, risky or could be better, while it is still cheap to change.

## What Timberline is (read this first)

- A web app for **one salesperson at BB Pallets**, a Canadian wood-packaging
  company (dunnage and pallets for metal-stock manufacturers; ships to Canada
  and the US). He often works remotely and has his own way of working.
- It is **his** tool to run his orders, loads, buying, inventory and daily
  tasks, and to talk to five parties from one place: **customers, the BB
  Pallets office, suppliers, carriers, subcontractors.**
- The BB Pallets **office still does the official work**: transport POs,
  approving every purchase, invoicing, accounting. In Timberline he
  *requests* those and *records* the answers. Payments can be marked paid;
  there is no bookkeeping.
- It must be easy to **switch the whole office over later** (D37): every office
  step is the same record whether the office works by email (today) or inside
  Timberline (later).
- Everything the business told us came from 13 voice notes (Yiddish and
  English) and follow-up conversations with the account owner, who is building
  this for the salesperson. Their decisions are D1–D37 in the hand-off.

## What is in this packet

1. **This brief.**
2. **`HANDOFF.md`**: the full plan: business, workflow stage by stage, worked
   pricing and buying examples with their real numbers, decisions D1–D37,
   open questions (and which ones are waiting on BB Pallets), the first
   milestone, and what to reuse from an earlier app.
3. **`WINDOWS.md`**: every window in the mockups (36 screens, 12 documents,
   11 dialogs) with what it is for, what to confirm with BB Pallets, and what
   the Assistant does there.

If you have the repository (`shmaye/timberline_app`, branch
`claude/dazzling-cerf-i8tpqe`), you can also open the mockups themselves:
`docs/mockups.html` (all windows, clickable), `docs/flatbed-3d.html`
(interactive 3D load planner demo) and `docs/ui-direction.html` (look and
layout). The mockup source is `docs/mockups/*.js`.

## Important: some windows are older than the latest decisions

D35 (booking the truck), D36 (who it's for) and D37 (office can switch over)
came **after** most windows were drawn. Section 1a of the hand-off lists the
windows that still assume BB Pallets runs the app company-wide (purchasing
without office approval, invoicing done in the app, inventory as official
books, settings). Review against D36/D37, not against how those windows look
today, and tell us what else needs to change.

## What to review

Go through all of it, but weigh these most:

1. **Fit to the real user (D36).** Does each department and window make sense
   for one remote salesperson acting as the hub between five parties? What
   is overbuilt for him (company-wide features he does not need yet)? What is
   missing for his day: a "Today" list, what he is waiting on from whom,
   reminders, phone use on the road (D29)?
2. **Office switch-over (D37).** Is the request → record pattern enough to
   switch the office into Timberline later without rework? What has to be in
   the data model from day one (users, roles, request records, audit, who did
   what)? Where would it break?
3. **The workflow (section 4 and the order story, 10 steps).** Missing steps,
   wrong order, missing hand-offs, things that happen in real life that the
   plan ignores (changes after the PO, short shipments, returns, credits,
   cancelled or delayed loads, split loads as separate orders D16, pickups).
4. **Load planning (D11, D13–D16, D31–D34).** Packing tight, partial bundles
   (extra layers), bundles across vs lengthwise, fork openings facing the
   unloading side, multi-drop, weight vs volume vs board feet, trailer catalog
   incl. B-train. Is anything physically or legally wrong (axle weights,
   height limits, securement)? What would a real load planner need?
5. **Money (sections 4.3–4.5).** The pricing build-up, average cost, 5% waste
   at shipping, buying gains, freight vs plan (now from the carrier's
   confirmed price, D35). Are the formulas right? What would mislead him?
6. **Data and imports (D10).** What entities and relations are implied? What
   is ambiguous enough to cause trouble when building the data model?
7. **Documents and email (D8, D30).** Sending from his own Hotmail/Outlook.com
   or Gmail, logging, templates. Any risks (personal Microsoft accounts,
   sending limits, deliverability, threading replies back)?
8. **The Assistant (D4, section 11).** Mixed Yiddish/English. Proposes, a
   person approves. Is the scope sensible? What should it do first?
9. **Canada/US, French, units (D5, D9, section 7).** Anything wrong or
   missing (CAD/USD, GST/HST, cross-border papers, ISPM-15)?
10. **Build order.** Is "visuals first, then data model" (D12) still right?
    What should the first working version include, and what can wait?

## Ground rules

- Respect the decisions (D1–D37). If you think one is wrong, say so and why,
  but do not quietly design around it.
- Separate **what BB Pallets said** from **your suggestions**. Mark
  suggestions as proposed.
- Be concrete: point at the section, decision number, or window id
  (`#loads-planner`), and say what to change.
- Do not redesign the look (colour set A is chosen) unless something is
  unusable.
- Questions only BB Pallets can answer go in a list for them, in plain words.

## What to hand back

One markdown file, `REVIEW-FINDINGS.md`, with these sections:

1. **Verdict**: three to five sentences. Is the plan sound enough to start the
   data model?
2. **Must fix before building**: ranked, most important first. For each: what
   is wrong, where (section / D-number / window id), why it matters, and the
   fix.
3. **Should change**: same format.
4. **Worth adding**: new features or screens, each marked proposed, with the
   reason and roughly how big it is (small / medium / large).
5. **Windows to change for D36/D37**: confirm or extend the list in section 1a.
6. **Data model notes**: the entities and relations you would start with, and
   the traps.
7. **Questions for BB Pallets**: plain words, grouped by topic, only ones not
   already in section 12 of the hand-off.
8. **What is good and should stay**: briefly, so it is not lost in changes.

Keep it tight: findings, not essays.
