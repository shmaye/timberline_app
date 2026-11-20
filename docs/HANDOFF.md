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
- Independent plan review done: `docs/REVIEW-FINDINGS.md`. Its must-fixes are now D38–D44; its should-change items, mockup corrections and the new screens (Today, Office requests) are not applied yet.
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

**Proposed new screens (not yet drawn):**
- **Today**: his day in one list: what to do, and what he is **waiting on** from each of the five parties (office, carriers, customers, suppliers, subs), with reminders. A task list, not a tile dashboard (D3).
- **Office requests**: every request to the office and its state, in one place; becomes the office's work queue once they switch over (D37).

**Windows drawn before D36 that need changing:**
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
   5. PO matched → order,
   6. job emailed to a subcontractor,
   7. loading list + BOL,
   8. loaded quantities back,
   9. invoice.
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
