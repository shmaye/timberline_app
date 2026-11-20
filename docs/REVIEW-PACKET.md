# Timberline review packet

Three parts: **1. Review brief** · **2. HANDOFF.md** (the plan) · **3. WINDOWS.md** (every mockup window).
Generated 2026-11-20 from the repository.

---

<!-- PART 1: REVIEW BRIEF -->

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


---

<!-- PART 2: HANDOFF.md -->

# Timberline: project hand-off

Timberline is a standalone web app for **BB Pallets**, a Canadian
manufacturer of wood packaging. This file is everything learned so far: 13
voice-note conversations with BB Pallets (mixed Yiddish and English,
translated), the account owner's decisions, and the open questions.

Put this file in the new repository as `docs/HANDOFF.md`.

---

## Status (2026-11-20)

- Open questions gone through with the account owner (section 12); what is left waits on BB Pallets.
- First milestone drawn: static mockups of every window (`docs/mockups.html`, built from `docs/mockups/`), the UI direction (`docs/ui-direction.html`, colour set A chosen) and an interactive 3D flatbed (`docs/flatbed-3d.html`).
- D36/D37 (who it's for; office can switch over later) came after most windows were drawn: section 1a lists the windows to change.
- Independent plan review done: `docs/REVIEW-FINDINGS.md`. Its must-fixes are D38–D44. Mockup numbers corrected (real wood weight, prices, what-if, 27\" offcut). New screens drawn: Today (D46), Office › Requests (D39), Catalog › Species & weights (D45). Its should-change items are D47–D61 and its window-by-window changes for D36/D37 are applied to the mockups (2026-11-20).
- Next: BB Pallets answers (especially the 44,000 bd ft question, D43) and reviews the mockups; then the core data model (review section 6).

## 0. Instructions for Claude (read first)

You are starting the Timberline repository. Before writing any code:

1. **Read this whole file.**
2. **Go through section 12 (open questions) with the user, one group at a
   time.**
   - Use the question tool, a few questions per round, not all at once.
   - Many answers have to come from BB Pallets. When the user doesn't know,
     mark it **"ask BB Pallets"** and move on; don't block on it.
3. **Record every answer** in section 2 (decisions) or in the section it
   belongs to, and strike it from section 12. Commit this file after each
   round, so nothing is lost if the session ends.
4. **Then build the first milestone (section 13): visuals and a clickable
   workflow**, before any database or backend. It's for showing BB Pallets,
   so they can click through and say "yes, that's how we work" or "no,
   it's like this."

Where this file says **(proposed)**, it's a suggestion, not something BB
Pallets said. Confirm it before treating it as a requirement.

---

## 1. One-paragraph summary

BB Pallets buys lumber by the truckload, has **subcontractors** cut it into
packaging (mainly the wood that metal-stock manufacturers ship their bundles
on, plus pallets), and sells it **by the trailer load** to customers that
often have several plants, in Canada and the US. Their week is taken up by:
- turning customer spreadsheets into full truckloads,
- pricing from cost per 1,000 board feet,
- buying lumber cleverly ("you make money when you buy"),
- sending jobs to subcontractors,
- balancing board-foot inventory by hand at month-end.

Timberline replaces the spreadsheets and the Sunday afternoons, and adds an
Assistant that understands them in English (and Yiddish).

---

## 1a. Who it's for and how work flows (D36, D37)

**The user:** one BB Pallets salesperson, often remote. Timberline is his workspace.
Everything he does, asks for, or waits on, in one place, with email going out
from his own mailbox (D30).

**The five parties he deals with**

| Party | What he does with them in Timberline |
|---|---|
| Customers (buyers, plants) | Needs sheets in, proposals out, POs in, order confirmations, delivery updates, invoice and payment follow-up |
| BB Pallets office | **Requests**: transport POs (D35), purchase approval, invoices, new customer/supplier setup. **Records** their answers (PO numbers, approvals, invoice numbers, payments received) |
| Suppliers | Offers, the batch calculator, negotiating; the purchase is final only once the office approves |
| Carriers | Rates and availability; bookings go through the office's transport PO; confirmations recorded |
| Subcontractors | Jobs, packing slips, loaded quantities back (by phone/email today, D25) |

**Does / requests / records**

| He does himself | He requests from the office | He only records |
|---|---|---|
| Proposals, load plans, prices, follow-ups | Transport PO to the carrier | Carrier confirmation (date + price) |
| Offers and negotiation with suppliers | Approval of every purchase, then the supplier PO | Office approval and PO number |
| Jobs to subcontractors (to confirm: directly or via the office) | Invoice to the customer | Invoice number; payment received (status only, no accounting) |
| Inventory tracking of his loads (to confirm: is this BB Pallets' official stock?) | | |

**Switching the office over later (D37):** each "request to the office" is a
record with a status (asked → done by office → confirmed) and a setting for who
acts on it. Today: email out, reply recorded by hand or read by the Assistant.
Later: an office user acts on it in the app. The data and history stay the same; the office's own screens are added at switch-over (D39).

**New screens (drawn 2026-11-20: Today, Office › Requests):**
- **Today**: his day in one list: what to do, and what he is **waiting on** from each of the five parties (office, carriers, customers, suppliers, subs), with reminders. A task list, not a tile dashboard (D3).
- **Office requests**: every request to the office and its state, in one place; becomes the office's work queue once they switch over (D37).

**Windows drawn before D36 that needed changing (changed 2026-11-20, with the review's section 5 list):**
- Purchasing (purchase orders, log a purchase, supplier PO): add "approval requested → approved by office → office PO no."
- Invoice and Statements & payments: the office invoices; he requests it and records the number; payments are a status, not bookkeeping.
- Inventory (on hand, counts, adjustments, waste): his tracking view; whether it is BB Pallets' official stock is open.
- Reports › Money: his margin view (and commission, if he wants it).
- Settings: one user today but office roles ready; a new "Office" page with the per-step switch (D37); drop accounting-style tax setup unless needed.
- Production jobs: confirm whether jobs go to subcontractors directly or through the office.

## 2. Decisions so far (from the account owner)

| # | Decision |
|---|---|
| D1 | **Name:** Timberline. Repository `timberline`. |
| D2 | **Standalone** app with its own repository. Not connected to ApparelMagic or the Gemsli app. |
| D3 | **Layout:** no dashboard of tool tiles. Each department fills the page; a switcher (departments that expand into tabs), on the side or across the top. **Proposed: side, collapsible to icons.** |
| D4 | **Assistant** on every page, like the Gemsli app's: looks things up, proposes actions, a person approves. |
| D5 | **Screens in English; French as a second language** (build translatable from day one). The Assistant understands mixed Yiddish/English. |
| D6 | **Catalog maintained by BB Pallets themselves**: add, edit and retire items in the app. **Images later**: leave room for them. |
| D7 | **Multiple subcontractors.** Jobs are emailed to a subcontractor from the order/PO. |
| D8 | **Every document can be printed, downloaded (PDF, and Excel where it's a table) and emailed from the system.** That includes bills of lading, count and recount sheets. |
| D9 | **BB Pallets is in Canada and ships to Canada and the US.** |
| D10 | **Lots of existing data will be loaded in.** Imports from Excel/CSV are a first-class feature. |
| D11 | **Load planning is interactive 3D** (like the Gemsli warehouse map): the truck fills as items are added, weight updates live, and loading order (first on / last on) is visible and adjustable, so they can see and confirm the load before it goes. |
| D12 | **First milestone is visuals and a clickable workflow** for BB Pallets to click through. |
| D13 | **Load limit is whichever runs out first**: weight, floor space/volume, or height (board feet is a planning figure, not a limit: see D43). The planner tracks all three and warns on the first to run out; the limits come from the trailer type. |
| D14 | **Trailer catalog** (Settings → Trailer types), maintained in the app, to choose from when planning. Starting set: **53' dry van, 48' flatbed, tri-axle** (lower weight limit) and a **B-train** (two trailers, each with its own deck and weight limit). Real dimensions and limits to be confirmed by BB Pallets. |
| D15 | **Multi-drop loads happen sometimes** (more than one plant on one truck). The planner supports drops, with the first drop nearest the doors. |
| D16 | **A split load becomes two separate orders**, each with its own order number (linked to each other). |
| D17 | **Lumber cost basis is chosen per price list**: today's market, the running average of loads bought, or a typed planning number. The price builder shows the other two beside it. |
| D18 | **"Other costs" per load**: the $700 in the example is an other cost. Each customer/plant can carry other costs per load (a field, possibly several lines), and they count in the **margin and profit per load**. |
| D19 | **Quote unit varies by customer**: each price list chooses per piece, per bundle, per MBF or per load. The app can still show the others for reference. |
| D20 | **Common count is selectable**: price comparisons (batch calculator, purchase log) convert to a common length, **10' by default**, changeable per comparison. |
| D21 | **Usable offcuts are tracked** as inventory items (e.g. 24" leftovers); scrap counts as waste. |
| D22 | **Inventory locations: BB Pallets' own yard plus each subcontractor's yard.** |
| D23 | **Counted by size and length** (e.g. 2x3 × 10'); count sheets total to board feet. |
| D24 | **Subcontractors' own stock is not tracked.** Only BB Pallets' wood is in the app (in their own yard and in each subcontractor's yard). Counters count only BB Pallets' wood; the count sheet carries a reminder to leave the subcontractor's pile out. (Replaces an earlier answer that gave stock lines an owner.) |
| D25 | **Subcontractors report by phone or email today**; the office types the cut/loaded quantities into the job. |
| D26 | **US loads go through a customs broker.** Each US plant (or customer) records its broker; broker details print on the BOL and the customs papers are emailed to the broker. Which papers go with the truck: ask BB Pallets. |
| D27 | **Users, for now: one salesperson from BB Pallets.** Built multi-user anyway (owner, office, buyer later). |
| D28 | **Costs and margins are hidden by default**; an admin turns them on per person. |
| D29 | **Phone and tablet use**: counts and recounts at the yard, and the owner on the road (look-ups, approvals, Assistant). Every screen must work at phone width. |
| D30 | **Email: Hotmail (Outlook.com) and Gmail** are confirmed. Send from their own mailbox through Microsoft Graph (personal Microsoft accounts included) and Gmail. |
| D31 | **Bundles can go across the trailer or lengthwise** (along the length of the truck). The planner lets the user turn each item, offers "best direction for each" (the one that uses less deck), and locks long stock (longer than the trailer is wide) to lengthwise. Loads mix short dunnage, long dunnage, stock lumber and pallets, and on a flatbed the load height above the deck is a fourth gauge. A 3D flatbed example is in `docs/flatbed-3d.html`. |
| D32 | **Quantities can be less than a full bundle.** A load line is counted in pieces, not only bundles. Besides whole bundles, the planner can add **extra layers** (rows of pieces) on top of a bundle, e.g. a third more, which makes that bundle taller; it can also take single pieces. Board feet, weight and height count them; the loading list and packing slip show "18 bundles + 3 layers (42 pcs)". The limit on how much taller a bundle may get is to be confirmed (demo: up to half a bundle). |
| D33 | **Bundles are packed tight; every inch counts.** No space between bundles in the plan, along or across the truck. A "gap between rows" setting exists but starts at 0. (The first 3D demo left 4" between rows, which cost about 2 feet of deck; fixed.) Risers (3½" 4x4 dunnage) under each bundle are real and count in the height. |
| D34 | **Fork openings always face where the forklift unloads**: the sides on a flatbed, the back doors in a van. The openings are the gaps between the risers, so when a bundle is turned across the truck its risers must be turned too. That is decided when the subcontractor builds the bundle, so the **job sheet and loading list say, per bundle, which way the risers go**, from the confirmed load plan. Pallets have their own openings and need no risers. The planner has an "Unloads from: sides / back" setting per trailer type. |
| D35 | **Booking the truck is a step of its own.** Once an order is entered, a **transport PO** goes to the carrier with a **price and a date**; it works as a booking note. The carrier's **confirmation means two things: the date is booked and the price is accepted.** A changed price or date is flagged for a decision (accept, or use the backup carrier), and the confirmed price is the load's real freight in its margin. Order story step 6 (later steps moved up by one). |
| D36 | **Who Timberline is for: one BB Pallets salesperson** (works remotely, has his own way of working). It is *his* tool to run his orders, inventory and daily tasks, not BB Pallets' company system. The BB Pallets office keeps doing the official work (transport POs, purchase approval, invoicing, accounting). In Timberline he **requests** those from the office and **records** the answer. Payments can be marked paid, but there is **no accounting or bookkeeping**. **Every purchase is approved by the main office.** He deals from one place with five parties: **customers, the BB Pallets office, suppliers, carriers, subcontractors.** See section 1a. |
| D37 | **Built so the whole BB Pallets office can switch over later.** Every step the office does is the same record whether the office works outside Timberline (today: the salesperson emails a request and records the reply) or inside it (later: the request lands in an office user's queue and they act in the app). A setting per step ("office works by email / in Timberline") switches it; data, statuses and history stay the same. The office's own screens (issue a transport PO, approve, invoice, numbering, tax) are built at switch-over; their designs are kept, switched off (D39). Users, roles and permissions (D27, D28) are multi-user from day one. |
| D38 | **Timberline reads his inbox (review M3).** Not only sending (D30): incoming needs sheets, customer POs, office replies, carrier confirmations and subcontractor quantities are read and linked to records. **Outlook.com (Hotmail) first**, through Microsoft Graph with personal accounts allowed. **Gmail later**: reading Gmail is a restricted Google permission that needs Google's verification and a yearly security assessment (an unverified test app loses its sign-in every 7 days). Every message is stored with its message id and thread id; each request carries a short reference in the subject (e.g. `[TL-R-1042]`) so replies match; email is sent as "create draft, then send" so the ids come back. A copy of every matched message is kept in Timberline, which is also what makes the office switch-over (D37) possible. |
| D39 | **One Request record for every office step, from day one (review M2).** Types: transport PO, purchase approval, supplier PO, invoice, credit note, new customer/supplier setup, price change approval. Each keeps: what it is about (order, load, purchase), a **frozen copy of what was asked**, state (draft → asked → answered: approved / approved with changes / declined → accepted by him → closed; also cancelled, superseded by a newer request, overdue), the answer as fields (office document number, amount, date, attachment), who asked, who answered, **who typed the answer in** ("recorded by him on behalf of the office"), channel (email / in app), linked messages, due-by and reminder dates. Bookings (D35) are built on it. |
| D40 | **How proposals, POs, orders and loads connect (review M4).** The customer's PO is its own record; PO lines link to order lines (one PO can feed several orders). **One order = one plant = one load. One load = one or more orders** (drops, D15). A proposal can produce one or two linked orders (split, D16). Freight on a multi-drop load is shared between its orders by a stated rule (by board feet, plus any extra-stop charge to the plant that caused it). Never put a load id on a PO or a PO id on a load. |
| D41 | **Changes after the PO are normal (review M5).** Orders and load plans carry a **revision number**; job sheet, loading list and transport PO request print "Rev 2" and what changed. A change to a confirmed order lists who must be re-told (subcontractor, office/carrier, customer) and creates those tasks; an open office request is superseded, not edited. Order states include on hold and cancelled; bookings include cancelled, no-show, and rebooked with the backup carrier. Nothing is deleted: cancel, supersede or retire. |
| D42 | **The price build-up is stored as lines (review M7).** A price list version keeps an ordered list of lines: name, kind (cost / margin / rounding), basis (per MBF, per load, % of the lines above), amount, plus the planned board feet per load it used. Per-load and per-MBF costs stay separate; "other costs" are costs, not margin; BB Pallets' own rounding ("call it $3,000", rounding each piece up to the cent) is kept but shown as its own line. Price lists are versioned with an effective date; orders keep the price they were taken at. Margin reports compare line by line: planned vs actual lumber, freight (carrier's confirmed price, D35) and board feet loaded. |
| D43 | **Board feet per load is a planning figure, not a limit (review M1; amends D13).** The real limits are weight, deck/volume and height. "Planned board feet per load" is worked out per plant from trailer type, route and wood weight, and stored on the price list that used it. Wood weight per board foot is a setting per species and dry/green, corrected over time by recorded scale weights. **Waiting on BB Pallets:** the 44,000 bd ft figure (at about 1.5–2.3 lb per board foot dry it would weigh 66,000 lb or more, over a 45,000–48,000 lb payload; maybe it was pounds), and two real loads with board feet and scale weight. |
| D44 | **The salesperson is the person in the voice notes** (almost 40 years at BB Pallets: sales, pricing, buying, and the stock balancing; account owner, 2026-11-20). So inventory (counts, recounts, average cost, waste) is his own work and stays, **built as a second phase after the core**, as a movement ledger (receipts, issues with waste, transfers, adjustments with reasons; on-hand and average cost worked out, never typed). The purchase log comes first, because pricing and buying gains need it. **Waiting on BB Pallets:** is his stock BB Pallets' official stock, or does the office keep its own? Who counts the yard and checks lumber in when he is remote? |
| D45 | **Wood weight is kept per species, with a variance (account owner, 2026-11-20).** Like the product catalog, he keeps a list of species (and dry/green): an **average weight per board foot** and **how far it can vary, up or down**. Every item belongs to a species. Every load and proposal shows its weight as **light side · average · heavy side**, and he chooses which to plan on ("Plan the weight on: light / average / heavy"), so he decides how much risk to take. Recorded scale weights show whether the figures are right and can update them. Screen: Catalog › Species & weights. |
| D46 | **Today: replies, calendar and tasks in one place (account owner, 2026-11-20).** Because Timberline reads the inbox and stores each thread (D38), the **Assistant reads every reply and says what it means** (confirmed, asks for more information, changed something, declined) and notifies him with the next step ready. A **calendar** joins his **Outlook calendar** with Timberline's own dates (ship days, pickups, deliveries, split loads due). A **task list** holds what is not on the calendar: to do, **waiting on** (by party: office, carriers, customers, suppliers, subcontractors) and **to review**, with reminders when nobody answers. Screen: Today (first in the menu). Gmail/Google Calendar later, with Gmail reading (D38). |
| D47 | **The order story is 12 steps (review S1, S2).** Adds the order confirmation to the customer (step 5), the subcontractor's **ready date** with the job (step 7), and ends at **delivered** (signed BOL back, any problem on delivery, step 11) and **paid** (step 12). The truck is still requested when the order is entered (as BB Pallets described), but a booking shows the ready date and warns when the truck date is before it. **To confirm with BB Pallets:** is the truck booked before or after the ready date? |
| D48 | **An order has a short state plus milestones (review S3).** State: open, on hold, shipped, delivered, closed, cancelled. Milestones are worked out from the job, the booking and the office requests (job sent, ready date, truck booked, loaded, invoice requested, invoice recorded, delivered, paid). Today reads the same data. |
| D49 | **Over/under allowance per plant (review S4).** The filler line is open-ended, and customers' accounts payable reject an invoice above the PO. Each plant has an allowed over/under (bundles or %); the PO match checks there is room; a load outside it asks the buyer's OK before the invoice request goes to the office. **Values to confirm with BB Pallets.** |
| D50 | **Average cost rule (review S5).** Moving average **weighted by board feet**, on **delivered** cost (supplier price + freight in), updated when a load is **received**, kept per size. Wood found at a count goes in at $0 as its own line (their practice, so the drop to ~$450 is explained). USD supplier prices take the exchange rate at receipt. Until inventory (phase two, D44) is built, "average of loads bought" for pricing comes from the purchase log over a chosen period. |
| D51 | **Batch calculator: leftovers can have a value, gains on usable feet (review S6).** Leftovers (e.g. the 27" from a 12') get a value, $0 by default as in their example. Buying gains are counted on usable board feet (10/12 of a 12' batch), not on what was bought. The settled price is shown beside the offer ($235 → about $317 vs $345). Turned-down offers are kept. |
| D52 | **Load planning rules (review S7).** The drop rule depends on how the trailer unloads (D34): van, first drop nearest the doors; flatbed from the sides, nothing for a later drop on top of an earlier drop's bundles. Weight limits are kept per trailer type **and** region/season (Ontario, Quebec, Michigan, New Jersey, spring thaw; a route takes the strictest). The axle display is an estimate and says so; recorded scale weights correct the species weights (D45). Deck height and legal overall height per trailer type. The loading list prints a minimum strap count (to confirm with carriers); extra layers (D32) are limited to what can still be strapped. Long stock in a van is flagged. A B-train is two decks, each with a limit, plus a combined total. The truck-% worksheet on the proposal is the fast way in (phone-friendly, no 3D); the 3D planner confirms the load. |
| D53 | **US loads: duty, brokerage, importer (review S8).** Per US plant: importer of record, delivery terms, tariff code and duty rate (from the broker), brokerage fee per load. These are lines in the price build-up (D42). Canadian softwood lumber entering the US carries anti-dumping/countervailing duties and (the reviewer reports) a further US tariff since late 2025; **whether dunnage and pallets fall under them must come from BB Pallets' customs broker.** ISPM-15 matters only if customers ship their metal overseas on this wood. Every money field has a currency. |
| D54 | **No tax engine (review S9).** The office invoices (D36). An invoice request carries amounts before tax; the recorded office invoice stores the office's total. Settings keep currency and exchange rate only; a tax table comes at switch-over (D37). |
| D55 | **Email in practice (review S10).** Personal Outlook.com/Gmail accounts have daily sending limits: scheduled reports and reminders queue and show failures. Large attachments use upload sessions; PDFs kept small. When a mailbox token expires, a red "reconnect your mailbox" item appears on Today. Every sent and matched message is stored in Timberline (needed for D37), and a shared company address is planned for later. |
| D56 | **The Assistant starts narrow (review S11).** First abilities, in order: read an incoming sheet, PO or reply into fields for him to check; draft requests, follow-ups and reminders; look-ups ("what am I waiting on from the office?"); dictated notes in Yiddish/English turned into tasks and call logs. Anything read from a document shows its source; money and quantity fields it filled stay marked until he checks them. No autopilot for anything that leaves the app. The house rule "every screen ships with its Assistant abilities" applies from version 2. |
| D57 | **Subcontractor and supplier money are estimates (review S12).** "Expected charge" for checking, not payables; no payables ledger. |
| D58 | **Receiving a purchased load (review S13).** Someone at the yard or the subcontractor confirms the tally; the purchase records "received by / tally from", the tally may differ from the PO, and cost uses the received board feet. |
| D59 | **Price lists have versions with effective dates (review S14).** Re-pricing makes a new version; orders keep the price they were taken at; the PO match compares with the version in force on the PO date. |
| D60 | **Plant receiving details (review S15).** Receiving hours, appointment needed, unloading side and equipment (forklift from the side or a dock), accepted trailer types, shutdown weeks. They drive the planner's "Unloads from" (D34) and the transport PO request. |
| D61 | **Scope of the first working version (review section 4).** Today, Office requests, the proposal worksheet, bookings, email (send + read), orders and price lists first. Second phase: inventory (D44). Can wait: statements and aging, tax setup, scheduled reports, pallets parts lists (unless weekly), what-if across all customers, translating the screens into French (stay translatable, D5), 3D axle estimates, Assistant autopilot. |

---

## 3. The business

- **Who:** BB Pallets. The person in the notes has been there almost 40
  years and does sales, pricing and buying.
- **Where:** Canada. Ships within Canada and to the US.
  - Concord: probably Concord, Ontario, where Caldari Road is.
  - Toronto.
  - New Jersey.
- **Customers:** mostly **metal-stock manufacturers**. Every bundle of metal
  stock ships on wood (top and bottom, grooved for straps).
  - Customers have **several plants**, each with its own volume and its own
    prices.
  - Example: a Caldari Road plant, Concord, uses 20–24 loads a year; a
    sister plant 8 miles away, same buyer, uses 4.
- **Supply:** lumber bought **by the load** from several suppliers.
  - Common sizes: 2x3, 3x3; lengths 6'–14'.
  - Prices per **1,000 board feet (MBF)**.
- **Production:** **subcontractors** cut, groove and load. The subcontractor
  also buys wood for himself and keeps it in the same yard.
- **People named** (names unsure, from audio):
  - Yisroel Mordechai: seems to buy for BB Pallets, or brokers.
  - an office person who used to enter orders and send them to the
    subcontractor.
- **Guiding principle:** *"You don't make money when you sell. You make money
  when you buy."* Buying must be as visible in the app as selling.

---

## 4. Workflow, stage by stage

### 4.1 Orders coming in

1. The customer sends a **spreadsheet of what they'll need**. It's not an
   order yet.
2. BB Pallets reworks it in **their own worksheet**, which shows what **% of a
   truck** it fills.
3. They fit it to a load (4.2), put their **internal order number** on it,
   and send it back: the **load proposal**.
4. The customer sends an **official PO** matching the proposal.
5. Only then is the **order created**.
6. **The truck is booked (D35):** a transport PO with a price and a date goes
   to the carrier (today the salesperson asks the BB Pallets office to send it,
   D36); the carrier's confirmation books the date and accepts the price.

Exception: customers who **pick up their own orders** send a plain order of
regular items, and no load planning is needed.

**Timberline:**
- Import the customer's spreadsheet (Excel/CSV, AI for messy ones).
- Show truck % live, and produce the proposal (PDF + Excel) to email back.
- When the PO arrives, match it to the proposal, flag differences, and turn
  it into the order in one step.

### 4.2 Load planning (3D, interactive; D11)

What they do today:
- **Too much for one truck:**
  - **split into two loads**, with a gap the customer picks (now + 3 weeks,
    or now + 1 month), or
  - **cut items**.
- **Too little:** **add bundles**, mostly in proportion, with more to the
  customer's **major sizes** (e.g. 31", 37½", 38½").
- **Filler items:** "add as many as fit." The packing slip leaves the filler
  quantity blank, to be filled in at loading.
- A load is limited by **weight** as well as space:
  - trailer type changes the limit (tri-axle and others carry less),
  - drivers read the air-suspension gauges.
- A truck holds about **44,000 board feet** (the planning number in pricing).

What Timberline does:
- **A 3D trailer** (pick the trailer type: length, width, height, weight limit,
  axles). Bundles appear as they're added, at their real size.
- **Live gauges:** % of floor or volume, total weight vs the limit, board feet,
  and roughly where the weight sits over the axles.
- **Loading order:** first on goes to the nose, last on to the doors.
  - Drag bundles to reorder.
  - A loading list (step 1, 2, 3...) prints from the same plan.
  - With **several drops**, the first drop's bundles go nearest the doors.
- **Suggestions:**
  - over: "split into 2 loads" or "cut these";
  - under: "add these, weighted to their major sizes";
  - "fill the rest with [filler item]".
- **Confirm:** a "Load confirmed" step that locks the plan, produces the
  packing slip, BOL and subcontractor job, and records who confirmed it.
- Starting point: the Gemsli app's 3D warehouse view
  (`src/components/pick-nav/Warehouse3D.tsx`, three.js loaded on first use,
  drag to turn, pinch to zoom).

### 4.3 Pricing

- Prices are **set in advance for each customer, and even each plant**. An
  order arrives already priced.
- The same item can carry different prices for different plants; "almost no
  standard." Margin depends on **how often they order and how good a customer
  they are**.

Worked example (their numbers), per MBF:

| Step | Amount |
|---|---|
| Lumber | $500 |
| + subcontractor labor | $135 → $635 |
| + 5% waste, applied to labor too (the subcontractor charges on wood coming in) | × 1.05 = $666.75 |
| + freight: $2,300 per load (set between the cheapest carrier, $2,000, and the backup, $2,500–2,600) ÷ 44,000 bd ft | + $52.25 (exactly $52.27; their figure) |
| **Delivered cost** | **$719** |
| + margin: target $2,000 per load + $700 of "other costs" for this customer (D18), call it $3,000 ÷ 44,000 | + $68 |
| **Selling price** | **$787** |

Per piece: **3 × 3 × 31 ÷ 144 = 1.9375 board feet** × $0.787 = $1.5248 →
**rounded up to $1.53**, the quoted price.

**Timberline:**
- A **price builder** that does this table per customer or plant.
- Board feet calculated from each catalog item's size.
- Re-prices a whole list when lumber, labor or freight changes.
- A **"stale prices"** warning when a list was built on a cost far from today's.

### 4.4 Buying material (where the money is made)

- Lumber is bought by the load from several suppliers.
  - 8s and 10s were about $545;
  - "trim" 6–7' loads $440;
  - another supplier often $475.
- Every $25 under the cost the prices were built on is **$1,100 more per
  trailer load** (× 44 MBF).
- **Opportunistic batches** (real example): 3 loads of old, paper-wrapped
  stock the supplier couldn't sell as premium. They offered **$225**, the
  supplier wanted $300, and it settled at **$235** a week later, while
  first-quality 10s were ~$345. How the offer was worked out:

| Step | Per MBF |
|---|---|
| Supplier price, not delivered | $225 |
| + freight to the yard | $20 → $245 |
| Convert to a **10-foot count** (12s cut back to 10s): × 12 ÷ 10 | $294 |
| + extra cutting cost | ≈ $305 |
| vs first-quality 10s this week (prices falling) | $345 (maybe $325 next week) |

- **Cutting yield drives value.** For 2x3 × 39" (one customer takes ~half a
  load a week):
  - 10' is the best stock;
  - 7' (84") gives two 39s with 6" waste;
  - 12' gives three 39s plus leftovers (e.g. 24") that must go somewhere.
- **Grooved** sizes cost more to make.

**Timberline:**
- A purchase log per load (supplier, length, grade, price) feeding the
  average cost.
- A **"What can I offer for this batch?" calculator:**
  - lengths offered → yield into the sizes customers actually buy (using
    their volumes),
  - delivered cost on a common count,
  - compared with today's first-quality price,
  - leftovers shown.
- A buying-gains report.

### 4.5 Inventory and costing

- Inventory is in **board feet**, valued at the **average cost of loads
  bought** (e.g. 2 × $545 + $440 ÷ 3 = $510), not list price.
- A shipped load is booked **with 5% waste added at once** (40,000 ft → 42,000
  ft out).
- Real waste varies:
  - by the **sizes cut** (some let offcuts be used: 2" thrown away instead
    of 3"),
  - by **wood quality** (sometimes 1–2%).

  So the physical count usually comes out **higher** than the books.
- **A physical count every two months.** Adjust to the count, then
  recalculate the average cost of what's left (e.g. ~$450 on Sept 30 vs $545
  recently paid).
- The **subcontractor's own wood** sits in the same yard and sometimes gets
  mixed in. That makes the cost drop artificially, then jump back. The owner
  counts in and out; the subcontractor doesn't.
- Small differences get adjusted and let go. A big one (a bundle, ~2,000 ft)
  means a recount, adjusted for everything shipped since. Balancing takes
  **4–10 days**, sometimes **a whole Sunday**.

**Timberline:**
- Board-foot inventory per location (and per subcontractor yard), with a
  running average cost.
- Waste booked at shipping, and a month-end true-up.
- **Count sheets and recount sheets** (D8), with shipments since the count
  date handled automatically.
- Adjustments with reasons.
- The subcontractor's own wood is **not tracked** (D24); count sheets remind counters to leave it out.

### 4.6 Subcontractors and fulfilment (D7)

- Several subcontractors. Each order/PO becomes a **job** emailed to the
  chosen subcontractor: items, quantities, filler items, and the packing
  slip.
- After loading, the real quantities (especially fillers) come back and
  update the order before invoicing.
- **Bill of lading** per load, for the carrier.
- Pay subcontractors per MBF processed. (Their rate is $135/MBF on wood
  coming in, plus extras for cutting and grooving.)

---

## 5. Catalog (D6)

BB Pallets maintains it themselves. Each item has:

- **Name, code**, and French name (D5);
- **type**: cut dunnage, grooved, pallet (built from parts), other;
- **dimensions** (thickness × width × length, in inches), from which
  **board feet per piece** is calculated automatically (T × W × L ÷ 144);
- **grooved** yes/no;
- **stock lengths it can be cut from**, with pieces per stock length and
  waste (feeds the batch calculator and the waste figures);
- **weight per piece / per bundle** (feeds the 3D load weight);
- **bundle size** (pieces per bundle) and **bundle dimensions** (the box the
  3D planner draws);
- **pallets:** parts list (which cut pieces, how many) → cost rolls up;
- **images**: later, but the field and the upload slot exist from day one;
- active / retired.

Imported from Excel on day one (D10), then edited in the app.

---

## 6. Customers, suppliers, carriers, subcontractors

- **Customer → plants:**
  - each plant has its ship-to, buyer contact, price list, currency,
    volume, and pickup vs delivered;
  - **major sizes** (for load top-ups);
  - **filler items**;
  - order frequency;
  - the per-load **"additional cost"** where one applies.
- **Suppliers:** lengths and grades carried, typical prices, offers and deal
  history.
- **Carriers:** rate per destination, reliability, and preference order
  (cheapest first, then backup).
- **Subcontractors:** rates, contacts, the wood they hold, and jobs.
- **Accounts receivable** (proposed): open invoices, aging, payments and
  credits, payment plans.
- **Follow-ups** (proposed):
  - a plant that's late on its usual order (e.g. every 3 weeks, none in 5),
  - an unanswered proposal,
  - a split load coming due.

---

## 7. Canada and the US (D9)

**(proposed, confirm each)**
- **Currency:** CAD and USD. Price lists and invoices in the customer's
  currency; costs probably in CAD; an exchange rate per day or per document.
- **Sales tax:** GST/HST (and QST if Quebec) on Canadian sales; none on
  exports to the US.
- **Cross-border shipments:** a commercial invoice, a CUSMA/USMCA certificate
  of origin if needed, customs broker details on the BOL.
- **ISPM-15** (heat treatment / stamp): needed for wood packaging going
  overseas. Check whether any of theirs does, and what applies between Canada
  and the US.
- **Units:** they work in inches, feet and board feet; keep that. Weight in
  lb (and kg if needed).
- **French** for screens, and possibly documents for Quebec customers.

---

## 8. Documents: print, download, email (D8)

Every document: **Print**, **Download PDF**, **Download Excel** (where
tabular), **Email**. The same file every way.

| Document | Excel | Usually emailed to |
|---|---|---|
| Load proposal | ✓ | Customer buyer |
| Quote / price list | ✓ | Customer buyer |
| Order confirmation | | Customer buyer |
| Subcontractor job sheet | | Subcontractor |
| Packing slip (filler line blank) | | Subcontractor / driver |
| Loading list (from the 3D plan) | ✓ | Subcontractor / driver |
| Transport PO request (to the office, D35–D37) | | BB Pallets office |
| Bill of lading | | Carrier |
| Commercial invoice / customs papers (US loads) | | Customs broker |
| Invoice | | Customer AP |
| Statement / overdue reminder | ✓ | Customer AP |
| Purchase order / offer to a supplier | | Supplier |
| **Count sheet** (blank, by item/size/length/location) | ✓ | Whoever counts |
| **Recount sheet** (only lines that were off: book vs counted) | ✓ | Whoever recounts |
| Inventory on hand / valuation | ✓ | Owner, accountant |
| Every report | ✓ | Anyone, or on a schedule |

Email:
- **Sent from his own mailbox** (Hotmail/Outlook.com first, then Gmail; D30, D38), so replies thread, and replies are read back in (D38).
- One Email dialog everywhere: recipients from the account's contacts, a
  template per document, attachments, edit, send.
- **Logged** on the customer, supplier, subcontractor or order.
- Scheduled reports.
- The Assistant can draft any of them; a person clicks Send.

---

## 9. Reports (proposed)

- **Daily/weekly:**
  - open orders and where each stands (proposal → PO → at subcontractor →
    loaded → invoiced),
  - the load schedule, including split loads coming due,
  - inventory on hand vs committed,
  - purchases vs market.
- **Monthly:**
  - **margin per load and per customer plant** (actual vs the $2,000–3,000
    planned),
  - **buying gains**,
  - waste booked vs actual,
  - the inventory reconciliation,
  - freight by carrier and how often the backup carrier was used,
  - sales by plant vs last year.
- **Pricing:**
  - stale price lists,
  - "what if lumber goes to $X" across every customer.

---

## 10. Departments and navigation (D3, proposed)

Side switcher, departments expand into tabs. Top bar: search, Assistant,
notifications, user menu.

| Department | Tabs |
|---|---|
| **Orders** | Incoming (spreadsheets & POs) · Proposals · Orders · Pickups |
| **Loads** | 3D Planner · Schedule · Bills of lading |
| **Production** | Jobs · Subcontractors |
| **Purchasing** | Offers & batch calculator · Purchase orders · Suppliers |
| **Inventory** | On hand · Counts & recounts · Adjustments · Waste |
| **Pricing** | Price builder · Price lists · What-if |
| **Customers** | Accounts & plants · Contacts · Statements & payments |
| **Catalog** | Items · Pallets (parts lists) · Stock lengths |
| **Reports** | Operations · Money · Scheduled |
| **Settings** | Users & access · Email · Trailer types (catalog, incl. B-train) · Carriers · Taxes & currency · Imports |

---

## 11. Assistant (D4)

- On every page; text, or voice in mixed Yiddish/English.
- **Looks up**, for example:
  - "how's Concord doing vs last year?",
  - "what did the last Toronto load make?",
  - "which customers are priced on lumber over $520?".
- **Does**, for example:
  - draft a load proposal from this spreadsheet,
  - plan this load,
  - email the job to the subcontractor,
  - "what can I offer for this batch?".
- **Proposes, a person approves.** Nothing is sent or changed without a click.
- Permissions follow the person; admins choose who gets which abilities.
- **House rule:** every new screen ships with its Assistant abilities.

---

## 12. Open questions

All groups (A–G) were gone through with the account owner on 2026-11-19.
Answers are in section 2 (D13–D30). What's left is waiting on BB Pallets.

### Waiting on BB Pallets

Questions the account owner couldn't answer; they go to BB Pallets. The
first milestone is built on the numbers in this file meanwhile.

- **A1–A5 (round 1, 2026-11-19):** none of these documents are in hand yet.
  Collect from BB Pallets, most useful first:
  1. a real **customer needs spreadsheet** and the **load worksheet** it goes
     through;
  2. a recent **inventory/count sheet** and the month-end calculation;
  3. a **price list** for one customer and the cost sheet behind it;
  4. their **catalog** in whatever form exists (for the day-one import);
  5. a **bill of lading**, **packing slip**, **invoice** and **subcontractor
     job sheet** as they look today.

- **Raised 2026-11-20 (from D35–D37):**
  - Does the salesperson pick the carrier and price, or does the office? Does the carrier's confirmation go to him, the office, or both?
  - Do jobs go to subcontractors from him directly, or through the office?
  - Who invoices the customer, and does he need to see payments, or only whether an invoice is paid?
  - Is the inventory he tracks BB Pallets' official stock, or his own view of what is available for his customers?
  - Does he want his commission or margin tracked?
  - What does the office use today (for a future connection when they switch over)?

- **Raised 2026-11-20 (from D32/D33):**
  - Are there risers (4x4 dunnage) between stacked bundles, or only under the bottom one? How thick are they?
  - How much taller than standard may a bundle be built (a third more? half?), and is that set per item?
  - Do partial quantities go on top of a bundle, as a short bundle of their own, or both?
  - (D34) Does the subcontractor build bundles with risers either way on request, or are some sizes only built one way? Do any loads unload from the back?

- **B (round 2):**
  - B7: real dimensions, axles and weight limits of each trailer type they
    use (the catalog's starting set is in D14).
  - B8: how bundles are placed: rows across, how high they stack, rules
    (heavy at the bottom, sizes together). Demo: rows across, heaviest at the
    bottom, drag to change.
  - B10: how filler items are chosen, and how the real loaded quantity comes
    back. Demo: fillers set per plant; the subcontractor enters the loaded
    count on the job, which updates the order.

- **C (round 3):**
  - C14: how often prices are updated, and what triggers it. Demo: a
    "stale prices" warning and a re-price-all button.
  - C15: is freight per destination, and who pays it (delivered vs pickup)?
    Demo: freight per plant, zero for pickup plants.

- **E (round 5):**
  - E22: how many subcontractors, and what each does (cutting, grooving,
    pallets). Demo: 2–3 subcontractors, each tagged with what it can do.
  - E23: how each is paid (per MBF in, per piece, per load, extras). Demo: a
    rate card per subcontractor.

- **F (round 6):**
  - F25–26: what program orders, invoices and inventory are in today, and
    which accounting software (QuickBooks? Sage?) invoices and payments must
    flow into. Demo: invoices in Timberline with a "send to accounting" button.
  - F27: payment terms, credit limits, and who chases late payers.
  - F28–29: which customers are billed in USD vs CAD; any Quebec customers
    (QST, French documents). Demo: currency per plant, tax per province.
  - F30: which papers go with a US load (the broker is confirmed, D26).

---

## 13. First milestone: visuals and a clickable workflow (D12)

The goal is something BB Pallets can **click through** to confirm the
workflow, **before** any backend.

1. **App shell:**
   - the side switcher with the departments in section 10,
   - the top bar,
   - the Assistant dock,
   - English/French toggle.
2. **One end-to-end story with realistic fake data** (their own numbers from
   this file), click by click:
   1. customer spreadsheet arrives,
   2. proposal with truck %,
   3. 3D load planner (add bundles, watch weight, reorder first/last,
      split/top-up suggestions),
   4. proposal PDF/Excel + Email dialog,
   5. PO matched → order, and the order confirmation to the customer,
   6. truck booked: transport PO requested from the office, carrier confirms date and price (D35),
   7. job to the subcontractor, with its ready date (S1),
   8. loading list; bill of lading once the booking is confirmed,
   9. loaded quantities back (he types them, or the Assistant reads the email),
   10. invoice request to the office; the office's invoice number recorded,
   11. delivered: signed BOL back, any problem on delivery (S2),
   12. paid (a status, no bookkeeping).
3. **Side screens:**
   - price builder (the $719 → $787 → $1.53 example),
   - batch calculator (the $225 → $305 vs $345 example),
   - inventory count/recount,
   - catalog item editor.
4. **A workflow diagram** of the whole process, clickable: each box jumps to
   its screen.
5. Share it as a link they can open on a computer and a phone.

Then collect their feedback, update this file, and start the real data model.

---

## 14. What to carry over from the Gemsli app

From the `gemsli-inventory-app` repository. Copy the pattern and code; strip
anything about ApparelMagic, Shopify or Gemsli. Keep each file's header
comments: they explain why it's built that way.

### Must-haves

| What | Where |
|---|---|
| **Assistant** (chat on every page, lookups, proposed actions with Approve, per-user switch, admin-chosen abilities, autopilot limits) | `src/lib/assistant/`, `src/components/assistant/` |
| **Sign-in, sessions, users, access levels** (view/read/write per area) | `src/lib/auth.ts`, `session.ts`, `password.ts`, `user-access.ts`, `tools.ts` |
| **3D view** (three.js, loaded on first use; drag/zoom) for the load planner | `src/components/pick-nav/Warehouse3D.tsx` |
| **Email from their own mailbox** (Microsoft Graph, encrypted tokens, send-as, threading) | `src/lib/mail/` (`send.ts`, `graph.ts`, `connection.ts`, `credentials.ts`) |
| **Email dialog, templates, recipients, signature** | `src/lib/customer-email/`, `src/components/email/`, `src/lib/email-signature.ts` |
| **Print page → PDF** (headless Chromium prints the page the user prints, so print = download = attachment) | `src/lib/customer-email/print-pdf.ts`, `doc-pdf.ts`, `src/app/print-doc` |
| **PDF and Excel export of any table** | `src/lib/reports/table-export.ts` (jsPDF + ExcelJS), `src/lib/download.ts` |
| **Statement PDF with aging** | `src/lib/statements/` |
| **Reading customer spreadsheets** (Excel/CSV → rows, AI for messy ones) | `src/lib/order-matcher/excel-extract.ts`, `csv-extract.ts`, `ai-extract.ts` |
| **Side switcher** (collapses to icons, per-person pins) | `src/lib/quick-switcher.ts`, `src/components/QuickSwitcher.tsx` |
| **Top bar** (one bar on every page) | `src/components/ToolHeader.tsx` + the house rules in its `CLAUDE.md` |

### Worth taking

| What | Where |
|---|---|
| Date picker that understands typed dates ("3/5", "tomorrow", "+2w") | `src/components/DatePicker.tsx`, `src/lib/date-input.ts` |
| Drag-and-drop file upload | `src/components/FileDrop.tsx` |
| Bottom action bar for acting on many rows | `src/components/BottomActionBar.tsx` |
| Confirm dialog, toasts | `src/components/ConfirmDialog.tsx`, `Toast.tsx` |
| Notification bell | `src/components/NotificationBell.tsx`, `src/lib/notifications.ts` |
| Built-in help articles (also feed the Assistant) | `src/lib/kb/`, `src/components/HelpButton.tsx` |
| Debugging mode (admins see and copy failed requests) | `src/lib/debug*.ts`, `src/components/debug/` |
| Testing mode / test-mode users (try on live data, then undo) | `src/lib/testing-mode.ts`, `src/lib/test-mode/` |
| Translations scaffold (for French) | `src/lib/i18n/` |
| QuickBooks connection (read-only) | `src/lib/quickbooks/` |
| Text messages | `src/lib/textbelt/` |
| Live updates between users | `src/lib/realtime.ts` |
| Voice input | `src/components/DictateButton.tsx` |
| Jewish calendar (holidays/Shabbos when scheduling loads) | `src/lib/hebrew-calendar/` |
| Voice-note → English test (section 15) | `scripts/voice-note-test/` |

### House rules worth copying into Timberline's `CLAUDE.md`

From the Gemsli `CLAUDE.md`, minus ApparelMagic:
- one top bar, with pages below it;
- bottom action bars frozen to the screen;
- every upload takes drag and drop;
- dates through the date picker;
- new features that record anything get an admin **testing mode** (a Delete
  on test records);
- every bug fix ships with a test that fails without it;
- every screen brings its Assistant abilities;
- every screen has a help article;
- idempotent database migrations.

### Leave behind

ApparelMagic sync, Shopify, Amazon, QVC, card processing, the warehouse
picking tools, and anything Gemsli-specific.

---

## 15. Voice notes: how this was gathered, and the engine findings

- 13 voice notes (mostly Yiddish with English, conversations between the
  account owner and BB Pallets) were transcribed and translated.
- **Engine finding:** a free **Whisper model fine-tuned for Yiddish**
  (`ivrit-ai/yi-whisper-large-v3-turbo-ct2`, Apache-2.0, runs on CPU via
  faster-whisper) handled the mixed speech well.
  - Standard Whisper turned the Yiddish into fake English.
  - Paid engines (Gladia, OpenAI) were set up but not yet tested; they need
    keys.
- The harness lives in the Gemsli repo at `scripts/voice-note-test/` (run
  with `VOICE_TEST_BRIEFS=session` so the Claude session writes the English
  briefs). Bring it over if voice notes keep coming, or if the Assistant
  should take voice.
- **Not requirements** (left out on purpose):
  - in note 2, the account owner's demo of AI email alerts and the
    office-assistant story;
  - an off-topic side discussion in note 7;
  - personal stories in notes 10–13.

### Note summaries

| Note | Content |
|---|---|
| 1 | Fitting an order to a truckload: split it, cut it, or top it up with major sizes. |
| 2 | Order intake: needs spreadsheet → load worksheet (truck %) → proposal → customer PO → order. Pickup customers skip load planning. |
| 3 | Trailer weight limits and gauges; office sends the order to the subcontractor, with filler items and a blank-quantity packing slip; per-customer/per-plant prices; metal-stock customers. |
| 4 | Cost per MBF: lumber $500 + labor $135 + 5% waste = $666.75; freight $2,300/load ÷ 44,000 = $52.25. |
| 5 | Delivered cost $719/MBF; board feet per item; target margin per load depends on frequency and customer quality. |
| 6 | Margin $2,000 + $700 "additional cost" → $3,000 per load → $68/MBF → $787; 3x3x31 = 1.9375 bd ft → $1.53. Real lumber cost is the average of loads bought; 5% waste booked at shipping. |
| 7 | Month-end: counts come out higher (real waste < 5%); average cost recalculated (~$450 on Sept 30); the subcontractor's wood mixed in; counting errors. |
| 8 | Balancing inventory takes 4–10 days; margin comes from buying below plan ($25 under = $1,100/load); the $225 → $235 batch deal; cutting yield by length. |
| 9 | The batch offer math ($225 + $20 freight → 10-foot count $294 → ~$305 vs $345); leftovers; the deal closed at $235. |
| 10 | Almost 40 years at BB Pallets; "you make money when you buy"; company history. |
| 11–13 | Personal stories, no workflow content. |


---

<!-- PART 3: WINDOWS.md -->

# Timberline: every window in the mockups

Generated from `docs/mockups/` (the same text as the notes under each window). Open `docs/mockups.html` to see them.

## Today

### Today `#today` (screen)

His day in one place, the first thing he opens. Replies: because Timberline reads his inbox and keeps each thread (D38), the Assistant reads every answer and says what it means (confirmed, asks for more, changed something, declined) with one click to act. Calendar: his Outlook calendar together with Timberline's own dates (ships, pickups, deliveries, split loads due). Tasks: what to do, what he is waiting on from each party, and what to review, with reminders when nobody answers. (Proposed layout.)

To check with BB Pallets:
- What do you look at first thing in the morning today: email, calendar, a list on paper?
- Do you keep your appointments in Outlook (Hotmail) or somewhere else?
- How long before a missing answer should turn into a reminder: a few hours, a day?

Assistant here:
- Read each reply and say what it means, with the next step ready
- "What am I waiting on from the office?"
- Put a ship date or a call on your Outlook calendar

Ref: D46 · D38 · Hand-off 1a · Review "Worth adding"

## Workflow

### Workflow diagram `#workflow` (screen)

The whole job on one page, from the salesperson's side (D36): the order going from the customer's spreadsheet to delivered and paid, with buying and stock underneath, because "you make money when you buy". The BB Pallets office has its own lane: the dashed boxes are what the office does when he asks (transport PO, purchase approval, invoice). Green boxes with a yellow number are the order story. Every box opens its window, so BB Pallets can say "yes, that's how we work" or "no, it's like this".

To check with BB Pallets:
- Is anything missing between the customer's PO and the subcontractor job?
- Does the transport PO really go out when the order is entered, or only once the subcontractor gives a ready date?
- Who does each office box today, and how long does each usually take?

Assistant here:
- Answer "where is order 24-0318?" by pointing at its box
- Explain any step in English or Yiddish

Ref: Hand-off 1a, 4.1–4.6 · D35–D46 · Review S1, S2

### Assistant (open) `#dlg-assistant` (dialog)

The Assistant is on every page and understands mixed Yiddish and English, typed or spoken. It starts narrow (Review S11): first it reads replies and documents (customer sheets, POs, office answers, carrier confirmations) into fields for him to check, then drafts requests and reminders, then answers "what am I waiting on" and other look-ups. Anything it read from a document shows where it came from, and money or quantity fields it filled stay marked until he checks them. Nothing leaves the app or changes without his click: no autopilot.

To check with BB Pallets:
- Which jobs would he hand to the Assistant first?
- Does he want to dictate notes and calls in Yiddish and have them turned into tasks?

Assistant here:
- Read a reply or document into fields, with its source
- "What am I waiting on from the office?"
- Draft a request, a follow-up or a reminder

Ref: Hand-off 11 · D4, D5, D38, D46 · Review S11

## Orders

### Incoming spreadsheets and POs `#orders-incoming` (screen, order story step 1)

Where customer needs sheets and POs land, from email or upload. A needs sheet is not an order yet: it is what the customer thinks they will need. From here it is imported, reworked into BB Pallets' own worksheet and turned into a proposal.

To check with BB Pallets:
- Do needs sheets always come by email, or also by phone or fax?
- Is there one sheet per plant, or one sheet for all plants of a customer?
- Can we pull these straight from the sales mailbox?

Assistant here:
- Read a messy spreadsheet or scan into lines
- Say which plant and customer a sheet belongs to
- Draft the proposal from the sheet

Ref: Hand-off 4.1, D10

### Import a needs spreadsheet `#dlg-import` (dialog, order story step 1)

Turns the customer's spreadsheet into lines in BB Pallets' own load worksheet. Columns are matched once per customer and remembered; each line is matched to a catalog item, and the truck % shows while it imports.

To check with BB Pallets:
- What columns do their customers' sheets usually have (item, length, quantity, date)?
- Do customers use their own part numbers that we should map to ours?
- Are quantities in pieces or bundles?

Assistant here:
- Match the columns and items automatically
- Flag lines it is unsure of
- Explain why a line was not matched

Ref: Hand-off 4.1, D10

### Load proposals `#orders-proposals` (screen, order story step 2)

His own worksheet, as he works today: the customer's needs fitted to a full truck, with the internal order number on it. It shows % of a truck live (weight as light side, average and heavy side, D45), and offers the three moves from the notes: split into two loads, cut items, or top up with the plant's major sizes. It is the fast way in and works on a phone; the 3D planner is for confirming the load, not for getting started. The proposal is emailed back and waits for the customer's PO.

To check with BB Pallets:
- Is "% of a truck" worked out from board feet, or by eye from experience?
- When topping up, is it always the major sizes, or what the customer asks for?
- How long does a proposal usually wait for the PO?

Assistant here:
- Top up to a full truck, weighted to major sizes
- Split into two loads with the gap the customer picks
- Draft the email with the proposal attached

Ref: Hand-off 4.1, 4.2 · D13, D16, D43, D45 · Review S7

### Load proposal (document) `#doc-proposal` (document, order story step 4)

What goes back to the customer before their PO: the needs fitted to a full truck, with BB Pallets' internal order number, prices per piece and the % of a truck. The customer's PO should match it line for line.

To check with BB Pallets:
- Does the proposal show prices, or only quantities?
- Do they want the split option on the proposal, or a separate one?

Assistant here:
- Draft the cover email in the buyer's usual tone
- Make the Excel version match the customer's own sheet columns

Ref: Hand-off 4.1, D8, D16, D19

### Email dialog `#dlg-email` (dialog, order story step 4)

One email window for every document and request in the app. It sends from his own mailbox, picks recipients from the contacts, uses the template for that document, and attaches the PDF and Excel. It is sent as "create a draft, then send" so the message and thread ids come back, and requests carry a reference in the subject (e.g. [TL-R-1041]), so every reply is matched and read for him (D38, D46). The Assistant can draft the text; he clicks Send. Every email is stored on the customer and the order.

To check with BB Pallets:
- Should the office or the owner be copied on proposals?
- Is the buyer always the person who gets proposals, or does it vary?

Assistant here:
- Draft the email in English or French
- Mention the split-load choice in the text

Ref: Hand-off 8 · D4, D30, D38, D46 · Review M3, S10

### Orders `#orders-orders` (screen, order story step 5)

Every order with a short state (open, on hold, shipped, delivered, closed, cancelled) and its milestones: job sent, ready date, truck booked, loaded, invoice requested, invoice recorded, delivered, paid. The milestones are worked out from the job, the booking and his requests to the office, so an order can be at the subcontractor and waiting on the office at the same time. A change after the PO makes a new revision ("Rev 2"), shows what changed, and lists who must be re-told as tasks. One order = one plant = one load; a split load is two linked orders (D16, D40). (Proposed layout.)

To check with BB Pallets:
- Does every customer send a PO, or do some just say "go ahead"?
- How often does an order change after the PO, and who do you call first?
- Who decides which subcontractor gets the job: you or the office?

Assistant here:
- Say where any order stands and what it is waiting on
- After a change, draft the Rev 2 messages to the subcontractor, the office and the customer
- Remind about split loads coming due

Ref: Hand-off 4.1, 4.6 · D16, D36, D40, D41 · Review S3, M5

### Match customer PO to proposal `#dlg-pomatch` (dialog, order story step 5)

The customer's PO is kept as its own record and laid next to the proposal it answers (one PO can feed several orders, D40). Prices are checked against the price list version in force on the PO date, not today's. The filler line is checked against the plant's over/under allowance, so the invoice will not come out above the PO. One click creates the order and its first tasks: the order confirmation to the customer and the transport PO request to the office.

To check with BB Pallets:
- How often does the PO differ from the proposal, and who wins: their PO or our proposal?
- If the load comes out bigger than the PO (fillers), will their accounts payable pay it, or must they change the PO first?
- Do customers send one PO per load, or one big PO you draw loads from?

Assistant here:
- Read the PO PDF into lines
- Explain each difference
- Draft a note to the buyer about a difference

Ref: Hand-off 4.1 · D35, D40, D42 · Review S4, S14

### Invoice request → office invoice `#doc-invoice` (document, order story step 10)

The BB Pallets office invoices the customer (D36), so he does not issue the invoice himself. He sends an invoice request made from what was really loaded (the filler line shows the loaded quantity), with his prices, the customer's PO number and amounts before tax, plus a check that the load stays within what the PO allows. When the office's invoice comes back, its number, total with tax and PDF are recorded on the same request, and the order shows "invoiced". When the office switches over, it invoices from this request inside Timberline (D37).

To check with BB Pallets:
- Who at the office does invoices, and how long do they usually take?
- Does the customer accept an invoice above the PO (fillers), or must they change the PO first?
- Should he see payment received, or only paid yes/no?

Assistant here:
- Explain any difference between the PO and what was loaded
- Send the request to the office and record their invoice when it comes back

Ref: Hand-off 4.6, 8 · D36, D37, D39 · Review S4, S9, section 5

### Pickup orders `#orders-pickups` (screen)

Customers who send their own truck order regular items in a plain order. No load planning and no truck to book, but the subcontractor still gets a job and a release slip, the customer's driver signs, and the invoice is a request to the BB Pallets office using what was signed for (D36).

To check with BB Pallets:
- Which customers pick up, and do they book a time?
- Is a pickup priced without freight?
- Who signs for it at the yard, and how does the signed slip reach you?

Assistant here:
- Turn an emailed pickup order into lines
- Send the subcontractor the job and the release slip
- Ask the office to invoice what was picked up

Ref: Hand-off 4.1 (exception) · D36, D39

## Loads

### 3D load planner `#loads-planner` (screen, order story step 3)

Fit the order to a truckload before it goes out. Bundles appear at their real size, packed tight, and the gauges show weight (light, average and heavy side), board feet against the plant's planned load, floor and an axle estimate. Each item goes across or lengthwise, whichever uses less floor. The drop rule follows how the truck is unloaded: from the back of a van, the first drop sits nearest the doors; from the sides of a flatbed, nothing for a later drop may sit on top of an earlier one. Weight limits come from the trailer type and the region and season of the route (strictest place wins). It suggests splitting, cutting or topping up, and "Confirm load" locks the plan as a revision (Rev 1, Rev 2 after a change).

To check with BB Pallets:
- How do you stack bundles today: how many high, heavy at the bottom, sizes kept together?
- Real weight limits per trailer type, for Ontario, Quebec and the US states you ship to, and in spring thaw.
- On a flatbed with two stops, does it matter where each plant's bundles sit, or only that nothing is on top of the first stop's wood?
- Do you ever ship long stock in a van?

Assistant here:
- Plan the load from the proposal ("fill this up for Concord, mostly major sizes")
- Suggest a split or a top-up and show the result before you approve
- Turn every item to its best direction

Ref: Hand-off 4.2 · D11, D13–D16, D31–D34, D41, D43, D45 · Review S7, M5

### Confirm load `#dlg-confirmload` (dialog)

The "yes, this is the load" step. Confirming locks the plan as a revision (Rev 1) and makes the subcontractor job, the packing slip and the loading list, and records who confirmed it and when. The bill of lading is not made here: it needs the carrier, so it is made when the booking is confirmed. A later change makes Rev 2 and lists who must be told again (subcontractor, office and carrier, customer). (Proposed: used once the customer's PO is in.)

To check with BB Pallets:
- Is a load confirmed before or after the customer's PO arrives?
- When a confirmed load changes, who do you have to call: the subcontractor, the office, the customer?

Assistant here:
- List what will be created before you confirm
- Warn if a gauge is over its limit

Ref: Hand-off 4.2 (Confirm) · D11, D41 · Review M5

### Loading list `#doc-loadlist` (document, order story step 8)

The step-by-step list for whoever loads the truck, printed from the same plan revision: what goes on first (the nose) to last (the doors), which way each bundle faces, which way its risers run so the fork openings face where it will be unloaded, and which drop it belongs to. It also prints the minimum number of straps. On a two-drop van load the first drop is loaded last, nearest the doors.

To check with BB Pallets:
- Does the loader need a drawing on the list, or only the steps?
- How many straps does a load like this get today, and who decides?

Assistant here:
- Email it to the subcontractor or the driver
- Reprint it after a change to the plan

Ref: Hand-off 4.2, 8 · D8, D15, D31, D34, D41 · Review S7

### Carrier bookings `#loads-bookings` (screen, order story step 6)

Once an order is in, the truck has to be booked. He does not issue the transport PO himself: each booking is a request to the BB Pallets office (the same request record as every office step, with a reference like [TL-R-1041] in the email subject so replies match). The carrier's confirmation means two things: the date is booked, and the price is accepted. The asked price stays beside the confirmed one. A booking also shows the subcontractor's ready date and warns when the truck comes before the wood is ready; it is not final until that date is known. Declined, no-show, rebooked with the backup carrier and cancelled are states too. The confirmed price becomes the load's real freight cost for its margin.

To check with BB Pallets:
- Does the subcontractor give you a ready date before the truck is booked, or is the truck booked first?
- Does the salesperson choose the carrier and price, or does the office?
- Does the carrier's confirmation go to the office, to the salesperson, or both? Is there a confirmation number?
- What does the office need in the request: pickup and delivery windows, equipment type, drops, extra-stop charges?
- If the carrier changes the price or date, who decides?

Assistant here:
- Write the request to the office from the order and the load plan
- Read the confirmation email and fill it in, flagging a different price or date
- Remind you when the office or the carrier has not answered

Ref: Learned from BB Pallets, Nov 2026 · D35, D36, D39, D41 · Review M2, S1

### Transport PO request to the office `#doc-carrierpo` (document, order story step 6)

The salesperson's request to the BB Pallets office to book the truck: which load (and its revision), carrier, pickup and delivery, the date the wood is ready, equipment and the price agreed. The office turns it into its official transport PO to the carrier. It is request R-1038; the reference [TL-R-1038] in the subject lets Timberline match the replies. What he asked is kept frozen, so a later change is a new request, not an edit.

To check with BB Pallets:
- Can we see a real transport PO the office sends today, so the request carries everything they need?
- Is the price always per load, or sometimes with fuel surcharge or extra-stop charges?
- Would the office ever want to use Timberline to issue the PO directly (later)?

Assistant here:
- Fill it from the order, the load plan and the carrier's usual rate
- Send it to the office and remind them if there is no PO by the end of the day

Ref: D35, D36, D39 · D8 (print, PDF, email) · Review M2, S1

### Record the carrier's confirmation `#dlg-carrierconfirm` (dialog, order story step 6)

When the confirmation comes back (from the carrier, or forwarded by the office), request R-1038 is answered: office PO number, the carrier's confirmation number, the date and the price, kept beside what was asked. A different date or price is flagged for a decision; a refusal or no-show is rebooked with the backup carrier as a new request. Once confirmed, the bill of lading is drafted from the load plan and the carrier (it is made here now, not when the load is confirmed). The confirmed price is what the load's margin uses.

To check with BB Pallets:
- Do carriers ever confirm part of it (the date but not the price)?
- Who is allowed to accept a higher price: the salesperson or the office?

Assistant here:
- Fill this in from the forwarded email
- Explain the margin effect of a price change

Ref: D35, D36, D39, D41 · Hand-off 4.3 (freight $2,300, backup $2,500–2,600), 9 · Review M2, M5

### Load schedule `#loads-schedule` (screen)

Every load by ship date: delivered loads with their carrier, customer pickups, and the second half of split loads coming due (now + 3 weeks, or now + 1 month). It answers "what goes out this week, and what is coming". (Proposed layout.)

To check with BB Pallets:
- How far ahead do you plan loads: one week, two?
- Should pickups and delivered loads sit on the same calendar?
- Do you want Jewish holidays and Shabbos marked when scheduling?

Assistant here:
- "What ships next week?"
- Remind you when a split load is coming due
- Move a load to another day: tell the subcontractor, and ask the office to change the transport PO (a new request)

Ref: Hand-off 4.1, 4.2, 9 · D16

### Bills of lading `#loads-bol` (screen)

One bill of lading per load. It is drafted when the carrier confirms the booking (it needs the carrier), as a draft for whoever issues it (the office, the subcontractor at loading, or him; to confirm). The signed copy comes back as a photo from his phone and closes the delivery, or records a problem. US loads also carry the customs broker's details.

To check with BB Pallets:
- Who makes the bill of lading today: the office, the subcontractor, or you?
- Do you use your own BOL form or the carrier's?
- Who gets the signed copy back, and how?

Assistant here:
- Email the BOL to the carrier
- Find loads still missing a signed BOL

Ref: Hand-off 4.6, 7, 8 · D8, D26, D35, D36 · Review section 5

### Bill of lading `#doc-bol` (document, order story step 8)

The carrier's paper for the load: shipper, consignees in drop order, what is on the truck and its weight, and signatures at pickup and delivery. It is drafted from the confirmed plan revision once the carrier has confirmed, so bundle counts, weight and carrier match. It is a draft for whoever issues it (office, subcontractor at loading, or him; to confirm). On US loads the customs broker block is filled in.

To check with BB Pallets:
- Which freight description do you use for dunnage (e.g. "wood dunnage, untreated")?
- Does a two-drop load get one BOL with two stops, or one BOL per stop?
- Which customs broker do you use for US loads?

Assistant here:
- Send the draft to whoever issues it
- Fill the broker block from the US plant's record
- Read the photo of the signed copy and record the delivery

Ref: Hand-off 4.6, 7 · D8, D26, D35, D41 · Review section 5

### Delivered, or a problem on delivery `#dlg-delivery` (dialog, order story step 11)

The real end of the order is delivered and paid, not the invoice. When the signed bill of lading comes back (a photo from his phone at the yard or from the driver), the load is marked delivered. If the customer reports a problem (short, damaged, wrong size, refused), it is recorded here, and it can raise a credit-note request to the office and a claim note for the carrier.

To check with BB Pallets:
- What happens today when a load arrives short, damaged or wrong? Who gives the credit?
- Who gets the signed BOL back, and how quickly?
- Do you ever claim against a carrier for damage?

Assistant here:
- Read the photo of the signed BOL and fill in the delivery
- Draft the credit-note request to the office and the note to the carrier

Ref: Review S2 · D29, D36, D39, D41

### US load: information for the office and broker `#doc-commercial` (document)

Customs papers for a US load are official documents, made by the office or the customs broker, not by him (D36). What he sends is the information they need: what is on the truck and its value, the importer of record, the delivery terms, and the tariff code and duty rate as given by the broker. Canadian softwood lumber entering the US can carry anti-dumping and countervailing duties and a US tariff; whether cut dunnage falls under them is for the broker to confirm. Who pays duty and brokerage also belongs in the price (Review S8).

To check with BB Pallets:
- Which papers go with a US load today, and who makes them (F30)?
- Who is the importer of record: you or the customer? Who pays duty and the broker's fee?
- Has the broker said whether your dunnage falls under the softwood lumber duties?
- Do any customers ask for heat-treated, stamped wood (ISPM-15)?

Assistant here:
- Fill in the broker, importer and tariff code from the US plant's record
- Email the information to the office and the broker before the truck leaves

Ref: Hand-off 7 · D26, D36 · Review S8

## Office

### Requests to the office `#office-requests` (screen)

He works for BB Pallets but runs his own day; the office does the official work. Every time he needs the office (a transport PO, approval of a purchase, an invoice, a credit, a new customer set up) it is a request here, with a frozen copy of what he asked, its state (asked, answered, approved with changes, declined, overdue, superseded), the office's answer and number, and the email thread. Today he records the answers; later the office can work this list itself, with a switch per step.

To check with BB Pallets:
- Who at the office handles each kind of request? One email address, or a person per type?
- How long is too long to wait for each kind (transport PO, approval, invoice)?
- When the office changes something (a smaller purchase, another carrier), how do they tell you?

Assistant here:
- Read the office's reply and fill in the answer for you to check
- Remind the office when a request is overdue, after your OK
- "What has the office not answered this week?"

Ref: D36, D37, D39 · Review M2

## Production

### Subcontractor jobs `#production-jobs` (screen, order story step 7)

Each order becomes a job for the chosen subcontractor: the items, quantities, fillers, which way each bundle's risers run (D34) and the packing slip, emailed from here as a revision (Rev 1; a change sends Rev 2 with what changed). The subcontractor acknowledges it and gives a ready date; the truck booking is not final until that date is known. After loading, the real quantities come back (by phone or email today) and he types them in, then sends the invoice request to the office.

To check with BB Pallets:
- Do jobs go to the subcontractor from you directly, or through the office?
- Does the subcontractor tell you when the wood will be ready before the truck is booked?
- How soon after loading do you get the real quantities?

Assistant here:
- Draft and email the job (or Rev 2 after a change) to the subcontractor
- "Which jobs have no ready date yet?"
- Type in quantities from a phone call you dictate

Ref: Hand-off 4.6 · D7, D25, D34, D36, D41 · Review S1, M5

### Subcontractor job sheet `#doc-jobsheet` (document, order story step 7)

What the subcontractor needs to cut, groove and load: the items and bundles, which stock lengths to cut them from, which way each bundle's risers run (so the fork openings face where it will be unloaded), the fillers, the ship date and the loading order. It carries a revision number; Rev 2 says what changed. The subcontractor acknowledges it and writes the ready date. (Layout proposed until we see theirs.)

To check with BB Pallets:
- Can we see a job sheet as you send it today?
- Can the subcontractor build bundles with the risers turned either way on request?
- Does the subcontractor reply with a ready date, or only call when it is done?

Assistant here:
- Email the job sheet with the packing slip and loading list attached
- Translate the notes for the subcontractor if needed

Ref: Hand-off 4.6, 8 · D7, D8, D34, D41 · Review S1, M5

### Packing slip `#doc-packing` (document)

Goes with the load. It lists what was ordered, with the filler line quantity left blank, to be filled in at loading ("add as many as fit"). The filled-in slip is where the real quantities come from.

To check with BB Pallets:
- Is the blank filler line how you do it today, or is it written on the BOL?
- One packing slip per drop, or one per load?

Assistant here:
- Email it to the subcontractor or the driver
- Read a photo of the filled-in slip and enter the quantities (proposed)

Ref: Hand-off 4.2, 4.6, 8 · D8

### Loaded quantities back `#dlg-loaded` (dialog, order story step 9)

After loading, the subcontractor phones or emails what actually went on the truck, and he types it in here (or the Assistant reads the email for him to check). Differences from the order show at once, the filler count is filled in, and he sends the invoice request to the office with the real quantities; the office invoices (D36). When inventory (phase two) is on, the shipped board feet are booked with 5% waste.

To check with BB Pallets:
- Do quantities come back per bundle or per piece?
- If the load differs from the PO, does the customer need to approve before invoicing?

Assistant here:
- Read the subcontractor's email and fill in the quantities for you to check
- Flag a difference bigger than one bundle

Ref: Hand-off 4.5, 4.6 · D25, D36, D39, D44 · Review section 5

### Subcontractors `#production-subs` (screen)

Each subcontractor with what they do (cut, groove, pallets), their yard, contacts and rate card, and their open jobs. From the rate card it shows the expected charge for wood processed, an estimate for checking their bill, not a payable: the office pays them (D36). Their own wood is not tracked in Timberline.

To check with BB Pallets:
- How is each subcontractor paid: per MBF in, per piece, per load, plus which extras?
- Do you pay per job or once a month?
- Should a subcontractor ever log in, or is email enough?

Assistant here:
- "What should Kessler's November bill come to?"
- Compare cost per MBF between subcontractors

Ref: Hand-off 4.6, 6 · D7, D24, D25, D36 · Review S12

## Purchasing

### Offers & batch calculator `#purchasing-offers` (screen)

"You don't make money when you sell, you make money when you buy." He negotiates with suppliers himself; the office approves every purchase (D36). This screen works out what to offer for an odd batch: delivered cost, converted to a common count, plus extra cutting, against today's first-quality price, with the yield into the sizes customers buy. Leftovers can be given a value (zero by default, as in their example) and gains are counted on usable board feet. Turned-down offers are kept. Once a price is agreed, the next step is asking the office to approve.

To check with BB Pallets:
- Is the 10-foot count the standard, and when would you compare on another length?
- How do you estimate the extra cutting cost for a batch like this?
- Are leftovers like the 2' off a 12 worth anything to you, or zero?
- Can you agree a price before the office approves, or only "subject to approval"?

Assistant here:
- "What can I offer for this batch?" from a supplier's email
- Show the yield of 12s into this week's orders
- Draft the counter-offer email (you click Send)

Ref: Hand-off 3, 4.4; D20, D21, D36, D39 · Review S6

### Purchase orders `#purchasing-pos` (screen)

Every load he buys, from agreed price to received tally. Every purchase is approved by the BB Pallets office (D36), so each one carries its approval request and, once approved, the office's PO number; the PO to the supplier is the office's document. Someone at the yard confirms the tally, which can differ from the order, and the received board feet set the average cost the price builder can use.

To check with BB Pallets:
- Who at the yard checks a load in and sends you the tally?
- Is freight usually included in the supplier's price, or billed separately?
- Do any suppliers bill in USD?
- Do loads go straight to a subcontractor's yard, or always to your yard first?

Assistant here:
- Fill in a received load from a photo of the tally
- Answer "what did we pay for 10s last month?"
- Remind you of approved loads not received yet

Ref: Hand-off 4.4, 4.5; D17, D22, D36, D39 · Review S5, S13

### Purchase approval request `#doc-supplierpo` (document)

His request to the BB Pallets office to approve a purchase he has agreed with a supplier: what, how much, at what price, where it goes, and why it is a good buy. The office answers and issues its own PO to the supplier; he records the office PO number here when it comes back. Sent from his mailbox with the reference [TL-R-1042] so the reply matches.

To check with BB Pallets:
- What does the office need to approve a purchase: price, quantity, why, cash timing?
- Who at the office approves, and up to what amount?
- Does the office send the PO to the supplier, or tell you to go ahead?

Assistant here:
- Fill it from the agreed offer and the batch calculator
- Read the office's answer and record the approval and PO number

Ref: D36, D37, D39 · Review section 5

### Record a received load `#dlg-purchase` (dialog)

When an approved load arrives, whoever is at the yard confirms the tally (he works remotely, so a photo or a phone call is enough). The tally can differ from the order; cost uses the board feet received. The preview shows how it moves the average cost of that size before saving.

To check with BB Pallets:
- Do you know the exact board-foot tally when a load arrives, or only later?
- If the tally is short, who tells the supplier and the office?
- Is average cost kept per size, or per size and yard?

Assistant here:
- Fill this in from a photo of the tally sheet
- Flag a tally that differs from the order by more than 1%

Ref: Hand-off 4.4, 4.5; D36 · Review S5, S13

### Suppliers `#purchasing-suppliers` (screen)

One place per supplier: lengths and grades they carry, typical prices and their trend, offers and deals, and every email. So when a supplier calls, you know what you paid last time.

To check with BB Pallets:
- How many suppliers do you buy from in a year?
- Do any suppliers bill in USD?
- Is there a broker in between for some loads?

Assistant here:
- "What did Muskoka charge for 10s the last three times?"
- Compare this week's offers side by side

Ref: Hand-off 6

## Inventory

### On hand `#inventory-onhand` (screen)

The wood he looks after, in board feet, at BB Pallets' yard and each subcontractor's yard, valued at the running average cost of loads bought, not list price. On hand is worked out from movements (receipts, shipments with 5% on top, transfers, adjustments), never typed in. Committed shows what open orders will use. Phase two: built after the core, and whether it is BB Pallets' official stock is still open.

To check with BB Pallets:
- Do you also want cut stock (finished bundles waiting) tracked here, or only raw lumber?
- Is one average cost per size & length right, or one per yard?
- Should offcuts carry zero cost, or a share of the load's cost?

Assistant here:
- "How much 2x3 × 10' do we have at Kessler?"
- Warn when an order can't be covered by what's available

Ref: Hand-off 4.5; D21, D22, D23, D24, D44 · Review M6

### Counts & recounts `#inventory-counts` (screen)

Replaces the 4–10 days (sometimes a whole Sunday) of balancing by hand. Whoever is at the yard counts, on a phone or on paper, and their name is kept. The count is compared with the book, adjusted automatically for everything shipped since the count date; small differences are let go, a big one (about a bundle) goes on a recount sheet. Phase two.

To check with BB Pallets:
- What difference is "small enough to let go": a percentage, or a number of board feet?
- Who counts, and on paper or on a phone?
- Do you count cut bundles too, or only raw lumber?
- How do you handle loads that arrive or ship during the count day?

Assistant here:
- Print the count sheet for the Kessler yard
- Explain why 3x3 × 12' is 2,050 ft over
- Propose the adjustment after the recount (you approve)

Ref: Hand-off 4.5; D8, D23, D24, D29, D44 · Review M6

### Count sheet (blank) `#doc-count` (document)

The blank sheet for whoever counts: one line per size and length at that yard, with space for pieces or bundles. It reminds the counter to leave the subcontractor's own pile out, because only BB Pallets' wood is tracked.

To check with BB Pallets:
- Do counters count pieces, bundles, or both?
- Should the sheet show the book quantity, or stay blank so the count is honest?

Assistant here:
- Print one sheet per yard
- Email the sheet to the subcontractor who counts

Ref: Hand-off 4.5, 8; D8, D23, D24

### Recount sheet `#doc-recount` (document)

Only the lines that were off, with book and first count side by side, and the book already adjusted for what shipped since. So a recount takes an hour, not a Sunday.

To check with BB Pallets:
- Should the recounter see the first count, or count blind?
- Who signs off a recount?

Assistant here:
- Make the recount sheet from the lines over your threshold
- Email it to the person recounting

Ref: Hand-off 4.5, 8; D8

### Adjustments `#inventory-adjustments` (screen)

A trail of every correction to the book, each with a reason, and the average cost it left behind. That explains later why the cost dropped to $450 and jumped back.

To check with BB Pallets:
- Which reasons do you want in the list?
- Who is allowed to make an adjustment?
- Should found wood come in at zero cost (lowering the average), or at the current average?

Assistant here:
- "Why did 2x3 average cost drop in September?"
- Propose adjustments from a finished count (you approve)

Ref: Hand-off 4.5; D24, D44

### Adjust to count `#dlg-adjust` (dialog)

Make one adjustment, pick the reason, and see the new average cost before saving.

To check with BB Pallets:
- Is a note required for every adjustment, or only big ones?

Assistant here:
- Fill in the reason from the recount notes

Ref: Hand-off 4.5

### Waste `#inventory-waste` (screen)

Shows the waste booked at shipping (5% on top of the shipped feet: 40,000 shipped takes 42,000 out of stock) against the real waste found at each count, by size and stock length. Real waste depends on the sizes cut and the wood quality, which is why counts come out higher than the books. Phase two.

To check with BB Pallets:
- Is 5% the right flat figure for every size?
- Would you like waste booked per size and length once the numbers are known? (proposed)
- Does the subcontractor charge on wood in, including the waste?

Assistant here:
- "Which sizes waste more than 5%?"
- Suggest a better waste % per size from the last counts

Ref: Hand-off 4.5; D44 · Review arithmetic

## Pricing

### Price builder `#pricing-builder` (screen)

Does BB Pallets' own cost table for one customer or plant, stored as lines: each line has a kind (cost, margin or rounding) and a basis (per MBF, per load, or % of the lines above). Per-load lines are divided by the planned board feet per load, so it is clear what depends on a full truck, and their rounding ("call it $3,000") shows as its own line. Saving makes a new version with an effective date. The worked example is theirs: $719 delivered, $787 selling, $1.53 a piece.

To check with BB Pallets:
- Is the price always rounded up to the next cent?
- Is $3,000 a rounding of $2,700, or is there another cost in it?
- Does grooving add a fixed amount per MBF, or per piece?
- Is the 44,000 bd ft per load the same for every trailer and customer?

Assistant here:
- Build the price for a new plant from its volume and freight
- Explain how $1.53 was worked out
- "What if lumber is $525?" for this plant

Ref: Hand-off 4.3; D17, D18, D19, D42, D43 · Review M7

### Price lists `#pricing-lists` (screen)

Every customer and plant has its own prices, set in advance, so an order arrives already priced. Each list remembers the lumber cost, cost basis and quote unit it was built on, and is flagged stale when that cost is far from today's. Lists are versioned with effective dates, so orders keep the price they were taken at. US lists carry their currency and (proposed) lines for exchange, brokerage and duty.

To check with BB Pallets:
- How far from today's cost should a list be before it's "stale"? $25? $50?
- Does a new price apply from the order date or the ship date?
- For US customers, who pays duty and the broker's fee?
- Do US plants have prices set in USD, or converted from CAD?

Assistant here:
- "Which customers are priced on lumber over $520?"
- Re-price stale lists and show the changes (you approve)
- Email a price list to the buyer

Ref: Hand-off 4.3, 7, 8; D17, D19, D42 · Review S8, S14

### What-if `#pricing-whatif` (screen)

"What if lumber goes to $X" across every customer at once: new selling prices, new per-piece prices, and what each plant would make per load if prices aren't changed. (proposed)

To check with BB Pallets:
- When lumber jumps, do you re-price everyone, or only some customers?
- Do you tell customers in advance of a price change?

Assistant here:
- "What if lumber goes to $545?"
- List the plants that would drop below $2,000 a load

Ref: Hand-off 4.3, 9

## Customers

### Accounts & plants `#customers-accounts` (screen)

Customers and their plants. Each plant carries its own price list, currency, volume, pickup or delivered, freight, major sizes, filler items, other costs per load, and the receiving details a carrier needs, because "almost no standard": the same item has different prices at plants 8 miles apart. A new customer or plant is set up by the BB Pallets office: here it is a request to the office (D36, D39), shown as "being set up" until they answer. Follow-ups catch a plant that is late on its usual order (proposed).

To check with BB Pallets:
- Is the plant the right level for prices, or sometimes the customer?
- What counts as "late" for a plant: a set number of weeks?
- What does the office need from you to set up a new customer?

Assistant here:
- How is Concord doing vs last year?
- Which plants are late on their usual order?
- Fill a new-customer request to the office from the buyer's email

Ref: Hand-off 3, 6 · D18, D26, D36, D39 · Review S15

### Edit a plant `#dlg-plant` (dialog)

Everything that makes a plant different in one place: where it ships, who buys, price list and currency, pickup or delivered, freight, major sizes for top-ups, filler items and how far the filler may go over the PO, other costs per load (D18), how often it orders, and what a carrier needs: receiving hours, appointment, how it unloads (forklift from the side or a dock), which trailers it takes, shutdown weeks. For US plants: delivery terms, who is the importer of record, and the customs broker (D26). The unloading side sets the planner's "Unloads from" (D34).

To check with BB Pallets:
- Do customers tell you their receiving hours and which trucks they can unload?
- For US plants: who is the importer of record, and who pays duty and the broker?
- How far over the PO will each plant accept on the filler line?

Assistant here:
- Fill the plant from an email signature or a PO
- Suggest major sizes from past orders
- Set "Unloads from" on the planner from this plant

Ref: Hand-off 6 · D18, D26, D34 · Review S4, S8, S15

### Contacts `#customers-contacts` (screen)

Everyone BB Pallets emails: buyers, accounts payable, receivers at each plant. The Email dialog picks recipients from here, and every email sent from Timberline is logged on the contact and the order.

To check with BB Pallets:
- Who gets which document: does AP get invoices and the buyer get proposals?
- Any contacts who should be copied on everything?

Assistant here:
- Add a contact from an email signature
- Show the last emails with a contact

Ref: Hand-off 6, 8 (Email)

### Invoices & payments `#customers-statements` (screen, order story step 12)

The last step of the order story: is it paid? The BB Pallets office invoices and keeps the books (D36), so this is only his tracker: the office's invoice number, the amount, the due date, and paid yes or no. When an invoice is past due he can send the buyer a friendly nudge from his own mailbox. No aging engine, no payment plans, no accounting.

To check with BB Pallets:
- Do you need to see payments, or only whether an invoice is paid?
- How do you hear that a customer paid: from the office, or not at all today?
- Do you chase late payers yourself, or does the office?

Assistant here:
- Which of my invoices are past due?
- Draft a friendly nudge to the buyer
- Mark paid when the office's email says so

Ref: D36, D39 · Review S9, section 5 · Hand-off 6

### Open invoices nudge `#doc-statement` (document)

The office invoices and keeps the books (D36), so this is not an accounting statement: no aging engine, no payment plans. It is a simple list of a customer's open invoices (the office's invoice number, amount, due date, paid yes or no) that he can send as a polite nudge when something is late. Paid is a status he records, not bookkeeping.

To check with BB Pallets:
- Who chases late payers today: him or the office (F27)?
- Does the office tell him when an invoice is paid?

Assistant here:
- Draft a polite nudge for what is past due
- List every customer with an invoice past due

Ref: Hand-off 6, 8 · D36 · Review section 5, "What can wait"

## Catalog

### Catalog items `#catalog-items` (screen)

BB Pallets keeps its own catalog: add, edit and retire items in the app. Board feet per piece is worked out from the size, and the bundle size and weight feed the 3D load planner. Day one is loaded from their Excel list.

To check with BB Pallets:
- Do item codes exist today, or do we make them up?
- Is weight per piece known, or should we use weight per board foot by species?
- How many pieces go in a bundle for each size, and is it always the same?

Assistant here:
- Add an item from a sentence: "new 3x3 by 40 inch, grooved"
- Find items nobody ordered in a year and offer to retire them
- Import the catalog from their spreadsheet

Ref: Hand-off 5, D6, D10

### Item editor `#dlg-item` (dialog)

One form holds everything about an item: size, board feet, grooving, which stock lengths it is cut from and how much is wasted, weight, and the bundle the 3D planner draws. The image slot is there from day one and gets used later.

To check with BB Pallets:
- Which stock lengths give the best yield for each size (e.g. 2x3 × 39" from 10', 7' or 12')?
- Are offcuts like the 24" from a 12' kept as their own item?
- What does a bundle measure for each size?

Assistant here:
- Fill in yield and waste for each stock length
- Suggest the French name
- Warn when the weight looks wrong for the size

Ref: Hand-off 5, D6, D21

### Species & weights `#catalog-species` (screen)

Wood weight drives the load (weight usually runs out before space), and it changes with species and moisture. So, like the products, he keeps a list of species, each with an average weight per board foot and how far it can be off, up or down. Every load then shows its weight as light side, average and heavy side, and he decides how much risk to take. Scale weights from real loads, when he has them, show whether the figures are right.

To check with BB Pallets:
- Which species do you buy, and is the wood dry or green when it ships?
- Does weight differ enough between suppliers to keep them apart?
- Do you ever get a scale ticket for a load?

Assistant here:
- Work out the average and variance from the scale weights you have
- Warn when a load is only legal on the light side

Ref: D45 · D43 · Review M1, S7

### Pallets (parts lists) `#catalog-pallets` (screen)

A pallet is built from cut pieces. Its parts list rolls up board feet, cost and weight, so a pallet is priced the same way as dunnage: from cost per MBF.

To check with BB Pallets:
- Which pallets do they make, and who builds them (which subcontractor)?
- Is assembly paid per pallet on top of the per-MBF rate?
- Are pallets heat treated (ISPM-15) for any customer?

Assistant here:
- Build a parts list from a description
- Show what a pallet costs at today's lumber price

Ref: Hand-off 5 (pallets)

### Stock lengths `#catalog-lengths` (screen)

The raw lumber they buy, by size and length, with the yield into the sizes customers buy. This is what the batch calculator and the count sheets use.

To check with BB Pallets:
- Which lengths do they buy most?
- Is 10' always the comparison count, or does it change by size?

Assistant here:
- Show which customer sizes each length is best for
- Flag lengths with poor yield for this month's orders

Ref: Hand-off 4.4, D20, D23

## Reports

### Operations reports `#reports-operations` (screen)

A weekly look back for him: open orders and where each stands, the load schedule with split loads coming due, stock on hand against what is committed, and lumber paid against the market. Most of what he needs each morning is on Today instead; this page is for the week as a whole. (proposed)

To check with BB Pallets:
- Which of these does he look at every week, beyond Today?
- Does the office want a copy of any of it?

Assistant here:
- "What ships this week?"
- "Which proposals have had no PO for more than a week?"

Ref: Hand-off 9 · D46 · Review "What can wait"

### Money reports `#reports-money` (screen)

His own margin view, load by load and plant by plant, compared line by line with the price build-up each price was made from (D42): lumber planned vs what it really cost, freight planned vs the carrier's confirmed price (D35), board feet loaded vs the planned board feet per load (D43), and the rounding line. Then buying gains on usable board feet, and sales by plant against last year. Commission is shown only if he wants it. These are his figures for judging customers, not the company's books (D36).

To check with BB Pallets:
- Is margin per load the number he judges a customer by?
- Does he want his commission tracked here (section 12)?
- Should "other costs" per load be split into named lines?

Assistant here:
- "How's Concord doing vs last year?"
- "Why did L-2420 make less than planned?" (explains it line by line)
- "What did the last Toronto load make?"

Ref: Hand-off 4.3, 4.4, 9 · D35, D36, D42, D43 · Review M7, S6

### Scheduled reports `#reports-scheduled` (screen)

Any report can be emailed on a schedule, as PDF and Excel, from his own mailbox. This can wait for version 2: for one salesperson most of it is the Today list. When it comes, sends go through a queue, and a failed send (for example a mailbox that needs reconnecting) shows on Today instead of being lost. (proposed)

To check with BB Pallets:
- Which reports, if any, should arrive automatically, and to whom (him, the office)?

Assistant here:
- Set up a schedule from a sentence: "send me margins every month-end" (version 2)

Ref: Hand-off 8, 9 · Review S10, "What can wait"

## Settings

### Users & access `#settings-users` (screen)

One person uses Timberline today: the BB Pallets salesperson (D36). It is still built for more from day one, so the office can join later (D37): the roles salesperson, office and admin exist now, and every record keeps who did what, including "recorded by him on behalf of the office". Each person gets view, read or write per department. Costs and margins are hidden unless the admin turns them on for that person (D28).

To check with BB Pallets:
- Who is the admin: the account owner (to confirm)?
- When the office joins, who in the office should see costs and margins?
- Will subcontractors ever log in, or only get emails?

Assistant here:
- Explain what a person can and cannot see
- Turn the Assistant on or off for a person

Ref: D27, D28, D36, D37 · Review section 5, section 6 (Organization, User, Role)

### Email & calendar `#settings-email` (screen)

Timberline sends from his own mailbox and reads his inbox (D38), so every reply lands on the right order, request or booking and Today can say what it means (D46). Outlook.com (Hotmail) is connected first, together with its calendar; Gmail comes later because reading Gmail needs Google's review. Every sent and matched message is stored in Timberline, which is also what lets the office take over later (D37). Personal mailboxes have daily sending limits and sign-ins expire, so failures show on Today as "reconnect your mailbox" instead of being lost.

To check with BB Pallets:
- Is his business email a personal Hotmail/Gmail address or a BB Pallets address?
- Which office address handles each kind of request?
- Does BB Pallets want a shared company address later?

Assistant here:
- Write a template for a document type
- Show emails exchanged with a customer this month
- Tell you when the mailbox needs reconnecting

Ref: Hand-off 8 · D30, D37, D38, D46 · Review M3, S10

### Trailer types `#settings-trailers` (screen)

The trailer catalog the 3D planner picks from. Each type has its size, axles, weight limit and board-foot limit; the planner warns on whichever runs out first. Includes a B-train with two decks.

To check with BB Pallets:
- Real inside sizes and weight limits for each trailer they use (open question B7)
- Does the weight limit change by season or by province/state?

Assistant here:
- Add a trailer type from its spec sheet
- Explain why a load is over on one trailer and fine on another

Ref: D13, D14, D31

### Carriers `#settings-carriers` (screen)

Carriers in order of preference, cheapest first, then the backup, with their usual rate per destination. He uses these to fill the transport PO request to the office (D35, D36); the carrier's confirmed price is what goes into each load's margin. Freight per load also feeds the price builder ($2,300 planned, between the $2,000 carrier and the $2,500–2,600 backup).

To check with BB Pallets:
- Is freight per destination, and who pays it (open question C15)?
- Does he pick the carrier and price, or does the office?

Assistant here:
- Draft the transport PO request to the office with the usual carrier and rate
- Show how often the backup was used and what it cost

Ref: Hand-off 4.3, 6 · D35, D36

### Currency `#settings-taxes` (screen)

Prices in the customer's currency (CAD or USD), costs in CAD, and the exchange rate used to compare them. Sales tax is not worked out here: the office invoices (D36), so an invoice request carries amounts before tax and the office's total is recorded when the invoice comes back. A tax table comes in only when the office switches over (D37).

To check with BB Pallets:
- Which customers are billed in USD (F28)?
- Where should the exchange rate come from: the bank, or a rate he types in?

Assistant here:
- Show a USD price in CAD at today's rate

Ref: Hand-off 7 · D9, D36, D37 · Review S9

### Imports `#settings-imports` (screen)

Lots of existing data gets loaded in: catalog, customers and plants, price lists, opening stock. Drop an Excel or CSV file, match its columns, preview, then import. Messy files are read by the Assistant.

To check with BB Pallets:
- Which files exist today for each (open question A4)?
- What date should opening stock be counted at?

Assistant here:
- Read a messy spreadsheet and match its columns
- Explain rows that could not be imported

Ref: D10
