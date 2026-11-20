# Timberline: plan review findings

Reviewed 2026-11-20: `REVIEW-BRIEF.md`, `HANDOFF.md` (D1–D37), `mockups/WINDOWS.md`,
and the figures in `docs/mockups/*.js` and `docs/flatbed-3d.html`.

Everything marked **(proposed)** is my suggestion, not something BB Pallets said.
"He" is the salesperson (D36).

---

## 1. Verdict

The plan is sound in its core: the order story, the request → record idea (D37),
the price build-up and the buying calculator are clear and match the notes.
It is ready for a data model of the **core** (parties, proposals, orders, loads,
office requests, email log, price lists). Inventory and costing are his own
work and stay in the plan, but should be modelled after the core, once it is
known whether his stock figures are BB Pallets' official ones.
Three things must be settled first because they change tables, not just screens:
the **44,000 board feet per load** figure does not agree with the weight limits
the mockups show, the **office request** record is too thin to carry D37, and
D30 covers **sending** email while half the plan depends on **reading** it.
The first working version should be much smaller than the 59 windows: Today,
office requests, the proposal worksheet, bookings and email.

---

## 2. Must fix before building

Ranked. Each one changes the data model or a worked example the rest is built on.

### M1. 44,000 board feet and a 45,000 lb limit cannot both be true

- **Where:** 4.2, 4.3, D13, D14, `#loads-planner`, `#settings-trailers`,
  `#pricing-builder`, `flatbed-3d.html`.
- **What is wrong:** `#loads-planner` shows 38,750 bd ft weighing 43,100 lb, which
  is 1.1 lb per board foot. Wood does not weigh that little. Dry spruce-pine-fir
  runs about 1.5–2.3 lb per nominal board foot (the 3D demo itself uses 2.3;
  green wood and hardwood are 3–4). At those weights 44,000 bd ft is roughly
  66,000–100,000 lb or more. A US five-axle truck (80,000 lb gross) carries about
  44,000–48,000 lb, which is 20,000–30,000 bd ft, not 44,000.
- **Why it matters:** freight ($2,300), margin ($2,000) and other costs ($700) are
  all divided by 44 MBF. If a New Jersey load really carries 25 MBF, those
  per-load costs are $120/MBF, not $68 + $52, and every US price built this way
  loses money. 44 MBF is believable only on heavy Ontario/Quebec equipment
  (tri-axle, B-train). It may also be that "44,000" in the notes was pounds.
- **Fix:**
  1. Ask BB Pallets (question Q1) for two real loads: board feet and scale weight.
  2. Board feet per load is **not a limit of its own** (D13 lists it as one). The
     real limits are weight, deck/volume and height. Make "planned board feet per
     load" a number worked out per plant from trailer type, lane and wood weight,
     stored on the price list it was used for.
  3. Wood weight per board foot becomes a setting per species and dry/green,
     not only a fixed weight per piece (section 5).
  4. Redo the planner mock numbers so the gauges agree with each other.

### M2. The office request record is too thin for D37, and "no screen or data changes" is not true

- **Where:** 1a, D37, `#loads-bookings`, `#doc-carrierpo`, `#dlg-carrierconfirm`.
- **What is wrong:** a request is described as "asked → done by office →
  confirmed" plus a switch. Real life needs more: declined, answered with a
  change (price, date, quantity), cancelled, replaced by a newer request after
  the order changed, overdue. And when the office moves in, they need screens to
  *do* the work (issue the transport PO, approve a purchase, invoice with tax,
  number documents). Those are the very screens 1a is removing now.
- **Why it matters:** D37 is the promise the whole design rests on. If requests
  are stored as booking fields today and as something else later, the switch is
  a rebuild.
- **Fix (proposed):** one `Request` table from day one, used by every office step:
  - type (transport PO, purchase approval, supplier PO, invoice, credit note,
    new customer/supplier setup, price change approval);
  - what it is about (order, load, purchase), and a **frozen copy of what was
    asked** (carrier, price, date, quantities) so a later change is visible;
  - state: draft → asked → answered (approved / approved with changes /
    declined) → accepted by him → closed; plus cancelled and superseded-by;
  - the answer as fields: office document number, amount, date, attachment;
  - who asked, who answered, **who typed the answer in** (today he records the
    office's answer; that is "recorded by him on behalf of the office", not
    "done by office"), and when;
  - channel (email / in app), linked email messages, due-by and reminder dates.
  - Reword D37: data, statuses and history stay the same; the office's own
    screens (issue PO, invoice, numbering, tax) are built at switch-over.
    Keep those windows as designs, switched off, rather than deleting them.

### M3. Reading the mailbox is assumed everywhere but never decided

- **Where:** D30, section 8, 1a ("reply recorded by hand or read by the
  Assistant"), `#orders-incoming` ("pull these straight from the sales mailbox"),
  `#loads-bookings`, `#dlg-loaded`.
- **What is wrong:** D30 confirms *sending* from Hotmail/Gmail. Incoming needs
  sheets, customer POs, office replies, carrier confirmations and subcontractor
  quantities all need *reading*. That is a different permission with different
  costs:
  - Gmail: read access is a "restricted" Google scope. A public app needs
    Google's verification and a yearly security assessment; an unverified app in
    testing mode loses its sign-in every 7 days.
  - Outlook.com personal accounts: reading works through Microsoft Graph, but
    the app registration must allow personal accounts, and the user must
    re-consent to the wider permission.
  - Section 8 says "Microsoft 365", D30 says "Hotmail (Outlook.com)". These are
    different account types. Fix the wording.
- **Fix (proposed):** decide one of these before the data model, since it sets
  how emails link to records:
  1. full mailbox read (best experience, heaviest approval), or
  2. **a Timberline inbox address** he forwards to, or auto-forwards a folder
     to (no mailbox permission, works with any provider, works for the office
     later), or
  3. send only, answers typed or pasted by hand.
  I would start with 2, and add 1 for Outlook.com first.
  Either way: store every message with its internet message id and thread id,
  put a short reference in the subject of each request (`[TL-R-1042]`) so
  replies can be matched, and send through "create draft, then send" so the ids
  come back (Graph's plain send returns nothing to thread on).

### M4. Proposal, customer PO, order, load: the relations are not pinned down

- **Where:** 4.1, D15, D16, `#dlg-pomatch`, `#orders-orders`, `#loads-planner`.
- **What is wrong:** the plan reads as one sheet → one proposal → one PO → one
  order → one load. The decisions already break that:
  - D16: a split makes two orders. From one PO or two? Unknown.
  - D15: a two-drop load carries two plants with different price lists, so it
    must be two orders on one load.
  - Customers like these often use one standing (blanket) PO with releases.
  - A needs sheet may cover several plants (`#orders-incoming` asks this).
- **Fix (proposed):** state these rules in the hand-off and build to them:
  - `CustomerPO` is its own record; PO lines link to order lines (one PO can
    feed several orders, one order can cite one PO).
  - **One order = one plant = one load.** One load = one or more orders (drops).
  - A proposal can produce one or two orders (split), linked.
  - Freight on a multi-drop load is shared between its orders by a stated rule
    (board feet, plus the extra-stop charge to the plant that caused it).

### M5. Nothing can change after the customer's PO

- **Where:** 4.1, 4.2 ("Load confirmed" locks the plan), `#dlg-confirmload`,
  order story steps 5–10.
- **What is wrong:** there is no path for a changed PO, a moved date, a cancelled
  order, a truck that does not show, or a load that ships short. By then a job
  is at the subcontractor, a transport PO is at the carrier, and a request is at
  the office: three parties to re-tell.
- **Fix (proposed):**
  - Orders and load plans carry a **revision number**; job sheet, loading list
    and transport PO request print "Rev 2" and say what changed.
  - A change to a confirmed order lists who must be re-told (subcontractor,
    office/carrier, customer) and creates those tasks; an open office request
    is superseded (M2), not edited.
  - Order states include on hold and cancelled; bookings include cancelled,
    no-show and rebooked with the backup carrier.
  - `#dlg-confirmload` makes the job and packing slip. The bill of lading is made
    when the booking is confirmed, since it needs the carrier.

### M6. Inventory is his own work, but whether it is the official stock is still open

- **Where:** section 3, D25, D28, D29, D36, 4.5, all `#inventory-*` windows.
- **Answered by the account owner (2026-11-20):** the salesperson in D36 **is**
  the person in the voice notes (almost 40 years there; sales, pricing, buying,
  and the stock balancing that takes 4–10 days or a Sunday). So the inventory
  department is not overbuilt for him: counts, recounts, average cost and waste
  are his own job today, and one of the biggest time savings in the plan.
- **What is still wrong:**
  - The hand-off never says this. Section 3 describes "the person in the notes"
    and D36 "one salesperson" as if they could be two people, and D25 ("the
    office types the quantities"), D29 ("the owner on the road") and 4.5 ("the
    owner counts in and out") leave it unclear who does what.
  - Still open (section 12): is the stock he balances BB Pallets' **official**
    stock? If the office keeps its own figures too, there are two sets of books
    and one must be named the master. If his are the only ones, then inventory
    is the one area where he is the source and the office is the reader, which
    is the reverse of "he requests, the office does".
  - He works remotely, so someone else counts the yard and checks a lumber load
    in. The plan has no record of who that is or how their figures reach him.
- **Fix (proposed):**
  - Record the answer as a decision (D38) and go through the hand-off once,
    replacing "owner", "the office types" and "BB Pallets does" with who really
    does it.
  - Keep inventory in the plan, built as a movement ledger (section 6), **after**
    the core. The purchase log comes first, because pricing and buying gains
    need it.
  - Get the official-stock answer before modelling the ledger. If the office
    also keeps stock figures, add a "report stock to the office" step at each
    count (a request record, M2).
  - Counts and receipts carry "counted by / tally from" (see S13), and count
    sheets work on a phone for whoever is at the yard (D29).

### M7. The price build-up must be stored as lines, with per-load and per-MBF costs kept apart

- **Where:** 4.3, D17–D19, `#pricing-builder`, `#pricing-whatif`, `#reports-money`.
- **What is wrong:**
  - The example mixes costs per MBF (lumber, labor, waste) with costs per load
    (freight, margin, other). The per-load ones are only recovered if the truck
    really carries the planned board feet. A 40 MBF load on a 44 MBF price is
    about $480 short ((44 − 40) × $120), and nothing in the plan shows it.
  - "$2,000 + $700, call it $3,000" hides $300 a load. Rounding each piece up to
    the cent adds about another $118 a load on the example item. Both are real
    money that the margin report will not be able to explain.
  - "Other costs" are costs, yet sit inside the "margin" line.
  - There is no place for duty, brokerage, fuel surcharge or exchange on US
    loads (see S8).
- **Fix (proposed):** a price list version stores an ordered list of lines, each
  with: name, kind (cost / margin / rounding), basis (per MBF, per load, % of
  lines above), amount, and the planned board feet per load used. Rounding is
  its own visible line. Margin reports then compare line by line: planned
  lumber vs average cost, planned freight vs the carrier's confirmed price
  (D35), planned board feet vs loaded board feet.

---

## 3. Should change

### Arithmetic check (as asked)

| Example | Result | Note |
|---|---|---|
| $500 + $135 = $635; × 1.05 = $666.75 | Correct | |
| Freight $2,300 ÷ 44 MBF = $52.25 | **$52.27** | 2,300 ÷ 44 = 52.2727. Total still rounds to $719 (719.02). |
| Margin $3,000 ÷ 44 = $68 | Correct (68.18) | But $2,000 + $700 is $2,700, which is $61.36. The extra $300 a load is unexplained (the window already asks). |
| $719 + $68 = $787 | Correct | Unrounded: $787.20. |
| 3 × 3 × 31 ÷ 144 = 1.9375 bd ft | Correct | |
| 1.9375 × $0.787 = $1.5248 → $1.53 | Correct | With $2,700 instead of $3,000 it would be $1.52. |
| `#pricing-builder` list: 37½" $1.82, 38½" $1.87, filler $1.72 ("Now") | **Do not follow from $787** | At $787 they are $1.85, $1.90, $1.75 (the "New" column). `#pricing-lists` shows the lower figures as the current list beside "$787". Pick one. |
| `#pricing-whatif`: $45 more lumber = "about +$50/MBF, $2,200 a load" | **$47.25 and $2,079** | 45 × 1.05 = 47.25; × 44 = 2,079. The table's $837 and $1.63 should be $834.25 and $1.62. |
| Batch: $225 + $20 = $245; × 12 ÷ 10 = $294; ≈ $305 | Correct | Assumes the 2' cut off each 12 is worth nothing, which contradicts D21 (usable offcuts are stock). See S6. |
| At the settled $235 | $255 → $306 → about $317 | Still $28 under $345. Worth showing in the window. |
| Average cost (2 × $545 + $440) ÷ 3 = $510 | Correct | 4.5 prints it without brackets. Only right when the three loads have the same board feet. See S5. |
| 40,000 ft shipped → 42,000 ft out | Correct (× 1.05) | Their rule is "5% on top of shipped feet". Write it down that way: it is not "5% of the wood coming in" (that would be 42,105). |
| $25 under plan × 44 = $1,100 a load | Correct | With waste, a 44 MBF load uses 46.2 MBF, so the gain is $1,155. Small; say which one the report uses. |
| 2x3 × 39" yields: 10' 97.5%, 7' 92.9%, 8' 81.3% | Correct | A 12' leaves 27" (144 − 117), not 24", before saw cuts. |
| `#doc-supplierpo`: $31,020 + 13% = $35,052.60 | Correct | |
| `#dlg-adjust`: 41,200 ft at $250 + 2,050 at $0 → $238.15 | Correct | |
| Lumber prices in 4.4 | **Inconsistent** | "8s and 10s about $545" and "first-quality 10s ~$345" cannot both be this week's price. Different dates, or misheard? (Q4) |

### S1. Section 13's story has 9 steps; the plan has 10, and some are in a risky order
- **Where:** section 13, 4.1, `#workflow`.
- Section 13 still lacks the booking step. More important: the truck is booked
  (step 6) before the subcontractor has the job (step 7). The ship date depends
  on when the wood is cut and ready.
- **Fix (proposed):** job goes out and the subcontractor gives a **ready date**
  before (or together with) the transport PO request. Add an "order
  confirmation to the customer" step after step 5 (it is in the documents table
  but not in the story).

### S2. The story stops at the invoice; the real end is "delivered and paid"
- **Where:** order story, `#orders-orders`, `#loads-bol`.
- Missing: shipped, delivered (signed BOL back), customer reports short or
  damaged, credit note requested from the office, paid.
- **Fix (proposed):** add delivered and paid as milestones; a "problem on
  delivery" record (short, damaged, wrong size, refused) that can raise a
  credit-note request (M2) and a carrier claim note.

### S3. One line of status cannot describe an order
- **Where:** section 9, `#orders-orders` ("proposal → PO → at subcontractor →
  loaded → invoiced").
- An order can be at the subcontractor, waiting on the office for the transport
  PO, and waiting on the carrier, all at once.
- **Fix (proposed):** keep a short order state (open, on hold, shipped,
  delivered, closed, cancelled) and show the rest as milestones derived from
  the job, the booking and the requests. The Today list reads the same data.

### S4. Invoice quantities above the PO
- **Where:** 4.2 (fillers "as many as fit"), `#dlg-loaded`, `#doc-invoice`.
- Customers' accounts payable usually reject an invoice that exceeds the PO.
  The filler line is open-ended by design.
- **Fix (proposed):** an allowed over/under per plant (percent or bundles); the
  PO match checks the filler line has room; a load outside the allowance asks
  for the buyer's OK before the invoice request goes to the office.

### S5. Average cost needs an exact rule
- **Where:** 4.5, D17, `#purchasing-pos`, `#dlg-purchase`, `#inventory-adjustments`.
- State (proposed): moving average **weighted by board feet**, on **delivered**
  cost (supplier price + freight in), updated when a load is received, kept per
  size (the windows ask per size and length, or per yard: decide one). Found
  wood at $0 lowers it (their practice, keep it, but show it as its own line so
  the drop to $450 is explained). Supplier prices in USD need a rate at receipt.
- Until the inventory ledger is built (M6), the "average of loads bought" for
  pricing can come from the purchase log alone over a chosen period.

### S6. Batch calculator: leftovers have value, and gains must be on usable feet
- **Where:** 4.4, D20, D21, `#purchasing-offers`.
- The × 12 ÷ 10 step treats the cut-off as worthless. Let the user give leftovers
  a value (zero by default, as in their example).
- Buying gains for a batch must be counted on usable board feet (10/12 of what
  was bought), or the report overstates the gain by 20%.
- Keep turned-down offers; the window asks, and the answer is cheap: yes.

### S7. Load planning: what is physically or legally off

All **(proposed)**; none needs to be perfect in version one, but the model
should leave room.

- **Drop rule is a van rule.** "First drop nearest the doors" (D15) is right for
  a van. On a flatbed unloaded from the sides, position along the deck barely
  matters; the rule is "nothing for a later drop sits on top of an earlier
  drop's bundles". Make the rule depend on "Unloads from" (D34).
- **Weight after the first drop.** A multi-drop load that was legal when full can
  be badly balanced after half comes off the back. Show the axle estimate per
  leg.
- **Limits are per route, not per trailer.** The same trailer has different legal
  weights in Ontario, Quebec, Michigan and New Jersey, and spring thaw rules
  lower them in Canada. A cross-border load is held to the strictest place on
  the route. Store limits per trailer type **and** region/season; the plant's
  region picks the set. (`#settings-trailers` asks this; the answer is yes.)
- **Axle display is an estimate.** Label it so. Drivers still go by the gauges
  and the scale (4.2). Record the scale weight per load when known; it is the
  best way to correct the wood weights.
- **Wood weight changes with moisture.** One fixed weight per piece (section 5)
  will be wrong by 30% or more between dry and green stock. See M1.
- **Height.** The demo's 8'6" above a 5' deck is the usual 13'6" overall. Store
  deck height and legal overall height per trailer type, not load height alone.
- **Securement.** Stacked lumber bundles need straps by count and by weight
  under the Canadian and US cargo securement rules, with extra requirements for
  tall stacks. The planner need not design strapping, but the loading list
  should print the minimum strap count, and "extra layers" (D32) should be
  limited to what can still be banded and strapped.
- **Vans and long stock.** Long lumber in a dry van has to be loaded lengthwise
  from the back; some lengths and forklifts cannot do it. Flag long stock on a
  van rather than only locking its direction (D31).
- **B-train.** Two decks, each with its own limit (D14), plus a combined gross
  limit. Model a trailer type as one or more decks with a shared total.
- **Do not make 3D the only way in.** Today he works from a worksheet that shows
  % of a truck. The proposal step needs that fast, on a phone, with no 3D. Use
  3D to confirm the load. (D11 stands; this is about which comes first.)

### S8. US loads: duty, brokerage, importer and currency are missing from pricing
- **Where:** section 7, 4.3, D26, `#doc-commercial`, `#settings-taxes`.
- Canadian softwood lumber entering the US is subject to anti-dumping and
  countervailing duties, and since late 2025 to an extra US tariff on softwood
  lumber and timber. Whether cut dunnage or pallets fall under these depends on
  the species and how the broker classifies them. It can be a large share of
  the invoice value, and someone pays it: the customer if they are the importer,
  BB Pallets if prices are quoted delivered duty paid.
- **ISPM-15:** wood packaging made from Canadian or US wood moving between the
  two countries has been exempt. The real question is whether BB Pallets'
  customers export their metal bundles overseas on this dunnage; if so they will
  want heat-treated, stamped wood, and the subcontractor must be a certified
  facility. Have the broker confirm both points.
- **Fix (proposed):** per US plant: who is the importer of record, the delivery
  terms, the tariff code and duty rate from the broker, brokerage fee per load.
  These become lines in the price build-up (M7). Which currency the example
  numbers are in is not stated anywhere; add currency to every money field.

### S9. Taxes: show, do not calculate
- **Where:** section 7, `#settings-taxes`, `#doc-invoice`.
- The office invoices (D36), so Timberline needs no tax engine now. GST/HST
  depends on the province the goods are delivered to, and a US customer picking
  up in Canada is not automatically an export. Leave that to the office.
- **Fix (proposed):** the invoice request carries amounts before tax; the
  recorded invoice stores the office's total. Keep a tax table out of version
  one, and bring it in at switch-over (M2).

### S10. Email details
- **Where:** D30, section 8, `#dlg-email`, `#reports-scheduled`.
- Personal Outlook.com and Gmail accounts have daily sending limits (a few
  hundred recipients; lower for new accounts). Fine for his volume, but
  scheduled reports and reminders must queue and show failures, not drop.
- Large attachments need the upload-session route in Graph; keep PDFs small.
- Tokens expire (password change, long inactivity). A scheduled send must fail
  loudly into Today: "reconnect your mailbox".
- Company business is going out from a personal mailbox. When the office
  switches over (D37) the history lives in his account. Storing a copy of every
  sent and matched message in Timberline (already planned as "logged") is what
  makes the switch possible; say so explicitly, and plan for a shared company
  address later.

### S11. Assistant scope: start narrow
- **Where:** D4, section 11, house rule "every new screen ships with its
  Assistant abilities".
- That house rule doubles the work of every screen in a first version.
- **Fix (proposed), first abilities in this order:**
  1. read an incoming sheet, PO or confirmation into fields for him to check;
  2. draft requests, follow-ups and reminders;
  3. look-ups ("where is order X", "what am I waiting on from the office");
  4. dictated notes in Yiddish/English turned into tasks and call logs.
  Planning loads and re-pricing lists by Assistant can wait.
- Anything the Assistant reads from a document shows the source beside the
  field, and money or quantity fields it filled are marked until he checks
  them. No autopilot for anything that leaves the app.

### S12. Subcontractor and supplier money is the office's too
- **Where:** `#production-subs` ("what BB Pallets owes them"), `#purchasing-pos`.
- Under D36 these are estimates for checking, not payables. Label them "expected
  charge" and drop anything that looks like a payables ledger.

### S13. Receiving a purchased load
- **Where:** 4.4, `#dlg-purchase`.
- A remote salesperson does not see the truck arrive. Someone at the yard or
  the subcontractor confirms the tally. Add "received by / tally from" and
  allow the tally to differ from the PO; cost uses the received board feet.

### S14. Price lists need dates and history
- **Where:** 4.3, `#pricing-lists`, `#dlg-pomatch`.
- "Re-price a whole list" must create a new version with an effective date, not
  overwrite. Orders keep the price they were taken at. The PO match compares
  the PO's price with the version in force on the PO date.

### S15. Plant record is missing what a carrier needs
- **Where:** section 6, `#dlg-plant`, `#doc-carrierpo`.
- Add (proposed): receiving hours, appointment needed or not, unloading side
  and equipment (forklift from the side or dock), accepted trailer types,
  shutdown weeks. These drive the planner's "Unloads from" (D34) and the
  transport PO request.

---

## 4. Worth adding

All **(proposed)**.

| Addition | Why | Size |
|---|---|---|
| **Today** (already proposed in 1a): to do, waiting on (by party), overdue, coming up | It is the product for a one-person hub. Build it first, fed by requests, bookings, jobs and proposals. | Medium |
| **Office requests** list (already proposed in 1a) | The D37 work queue. Same table as M2. | Small once M2 exists |
| **Tasks and reminders** on any record, with snooze and "remind me if no answer by" | "Waiting on" only works if silence turns into a reminder. | Small |
| **Call and note log** per customer, supplier, carrier, subcontractor (dictated) | Much of his day is on the phone; D25 says so for subcontractors. Email log alone misses it. | Small |
| **Quick capture on the phone**: photo of a tally, packing slip or BOL, attached to a record | D29; he is on the road, the paper is at the yard. | Small |
| **Truck % worksheet without 3D** | See S7. Matches what he does today; works on a phone. | Medium |
| **Change log on orders and loads** ("Rev 2: date moved, 3 bundles added") with who was re-told | M5. | Medium |
| **Delivery problems and credit requests** | S2. | Small |
| **Freight quotes**: asked two carriers, their answers, which was chosen | D35's "cheapest, then backup" becomes a record; feeds freight vs plan. | Small |
| **Load fill and margin preview** on the proposal: "this load makes $X at this fill" | M7; shows why topping up matters. Costs hidden unless turned on (D28). | Small |
| **Split-load and late-plant follow-ups** as Today items | Already proposed in section 6; put them in Today, not a separate report. | Small |
| **Export everything** (Excel/CSV per table, all documents) | A personal tool holding company data must be able to hand it over; also the bridge to whatever the office uses. | Small |
| **Commission view** | Only if he says yes (section 12). | Small |
| **Scale weight per load** | Corrects wood weights over time (M1, S7). | Small |

**Second phase** (his own work, but after the core, M6): inventory counts,
recounts, adjustments and waste.

**What can wait** (overbuilt for one salesperson today): statements, aging and payment plans; tax
setup; scheduled reports; pallets parts lists (unless he sells pallets weekly);
what-if across all customers; French screens (keep the text translatable, D5,
but do not translate yet); 3D axle estimates; Assistant autopilot.

---

## 5. Windows to change for D36/D37

Section 1a's list is right. Additions:

| Window | Change |
|---|---|
| `#workflow` | Add the office as a lane; show the 10 steps; mark each box "he does / he requests / he records". |
| `#orders-orders` | Status chain is missing booked, shipped, delivered, invoice requested, paid, cancelled (S3). "Who decides which subcontractor" becomes a field, not only a question. |
| `#dlg-pomatch` | Creates the order **and** the first requests (order confirmation to send, transport PO request to draft). |
| `#dlg-confirmload` | Makes job + packing slip + loading list. BOL moves to the booking confirmation (M5). Records a revision. |
| `#loads-bookings`, `#doc-carrierpo`, `#dlg-carrierconfirm` | Already D36-shaped. Rebuild on the general request record (M2); add declined, cancelled, no-show, rebooked; keep the asked price beside the confirmed price. |
| `#loads-bol`, `#doc-bol` | Who issues the BOL: he, the subcontractor at loading, or the office? Until known, treat as "draft for whoever issues it". |
| `#doc-commercial` | Customs papers are official documents. Make it "information for the office/broker", unless BB Pallets says he prepares them. |
| `#loads-schedule` | Assistant line "move a load and tell the subcontractor and carrier": telling the carrier goes through the office (new request). |
| `#dlg-loaded` | Text says "the office types it in": he does. "Update order makes the invoice" becomes "sends the invoice request to the office". The inventory booking stays (M6), switched on when the ledger is built. |
| `#doc-invoice` | Split in two: **invoice request** (his document, to the office, amounts before tax) and the **office's invoice** attached when its number is recorded. |
| `#orders-pickups` | "It is invoiced" becomes an invoice request; pickup still needs a job and a release slip. |
| `#production-jobs`, `#doc-jobsheet` | Add the subcontractor's ready date and acknowledgement; revision number; riser direction per bundle (D34) is in the decision but not in the window text. |
| `#production-subs` | "What BB Pallets owes them" becomes "expected charge" (S12). |
| `#purchasing-offers` | Add "ask office to approve" as the step after an agreed offer. |
| `#purchasing-pos`, `#dlg-purchase`, `#doc-supplierpo` | As 1a. Also: the supplier PO is the office's document; his is the offer and the approval request. Add received-by and tally (S13). |
| `#customers-accounts`, `#dlg-plant` | New customer or plant setup is a request to the office (1a table); add the fields in S15. |
| `#customers-statements`, `#doc-statement` | As 1a. Reduce to: invoice number, amount, due date, paid yes/no, and a "nudge" email. No aging engine, no payment plans. |
| `#settings-carriers` | Assistant line "pick the carrier and draft the booking email" becomes "draft the transport PO request". |
| `#settings-users` | Add the roles that exist from day one even with one user: salesperson, office, admin. Say who the admin is. |
| `#settings-email` | Add: mailbox connection state, the inbound address (M3), the office's address per request type. |
| `#settings-taxes` | Reduce to currency and exchange rate (S9). |
| `#reports-operations`, `#reports-scheduled` | "Email this report to the office every Monday": fine, but most of this is the Today list. Scheduled can wait. |
| `#reports-money` | As 1a. Compare line by line with the price build-up (M7). |
| `#dlg-assistant` | Example abilities should lead with reading replies and "what am I waiting on" (S11). |
| New: `#today`, `#office-requests`, `#office-settings` (per-step switch) | As 1a. Draw these before changing the rest; BB Pallets should see them in the next review. |

---

## 6. Data model notes

All **(proposed)**.

### Start with these

- **Organization**, **User**, **Role**, per-area access, cost visibility flag
  (D27, D28). Every record has `created_by`, an owner (the salesperson), and
  timestamps. One organization today; do not hard-code it.
- **Party** with a kind (customer, supplier, carrier, subcontractor, office,
  customs broker), **Contact**, and **Site** (plant, yard, supplier yard).
  A plant is a Site of a customer with its own settings (price list, currency,
  major sizes, fillers, other costs, receiving details, broker).
- **Item** (catalog), **StockLength**, **CutYield** (item × stock length →
  pieces, leftover), **BundleSpec** (pieces, dimensions, riser direction).
- **PriceList** → **PriceListVersion** (effective date, cost basis D17, quote
  unit D19, planned board feet per load) → **BuildUpLine** (M7) and
  **ItemPrice**.
- **NeedsSheet** (the file and its read lines) → **Proposal** (lines, truck %)
  → **Order** (lines; ordered, planned and loaded quantities kept separately).
  **CustomerPO** and its lines separate from Order (M4).
- **Load** (trailer type, date, revision) with **LoadDrop** (order, sequence)
  and **LoadPlacement** (bundle, position, direction, layer count). Loading
  list, packing slip and BOL are views of a load revision.
- **Booking** (carrier, asked price and date, confirmed price and date, state)
  linked to its Request.
- **Job** (subcontractor, load revision, ready date, reported quantities).
- **Request** (M2), the centre of D37.
- **Purchase**: Offer → approval Request → Purchase (lines by size and length,
  price, freight in, currency) → Receipt (tally).
- **Message** (email in or out: ids, thread, parties, linked records,
  attachments), **Document** (stored PDF with the revision it was made from),
  **Note/Call**, **Task/Reminder**.
- **Event log**: append-only, who did what to which record, including "recorded
  on behalf of the office". Today, reports and the Assistant all read it.

### Traps

- **Board feet are nominal.** 3 × 3 × 31 ÷ 144 uses the name of the size, not its
  measured size. Weight, bundle dimensions and deck space need real sizes. Keep
  both on the item.
- **Units.** Store quantities in pieces; work out bundles, layers and board feet.
  D32 means "bundle" is not a whole number.
- **Money.** Every amount has a currency. Per-MBF and per-load amounts are
  different fields. Keep unrounded values and round only for display and quotes.
- **External numbers.** The office's PO, invoice and approval numbers are text
  from outside. Timberline's own numbers are separate. At switch-over someone
  must decide who issues numbers; do not reuse one field for both.
- **Snapshots.** An order keeps the price it was taken at; a request keeps what
  was asked; a document keeps the revision it was printed from.
- **Splits and drops** (M4): do not put `load_id` on the PO or `po_id` on the
  load.
- **Do not delete.** Cancel, supersede or retire. D37 needs the history.
- **Inventory** (second phase, M6): a movement ledger (receipt, issue with waste,
  transfer between yards, adjustment with reason), with on-hand and average
  cost worked out from it. Never store on-hand as a number someone edits.
- **Imports (D10).** Keep each import as a batch that can be undone, and keep
  the customer's own part numbers and column mapping per customer.
- **Time.** Store dates with the plant's or yard's time zone in mind; ship and
  delivery dates are local dates, not timestamps.

---

## 7. Questions for BB Pallets

Plain words. None of these is in section 12 of the hand-off.

**Loads and weight**
- Q1. Take two recent loads, one to Ontario and one to the US. For each: how
  many board feet, how much did it weigh, and what kind of truck was it?
- Q2. Is "44,000" board feet, or pounds? Is it the same for US loads?
- Q3. Is your wood dry or green, and which species? Does that change by supplier?
- On a flatbed with two stops, does it matter where each plant's bundles sit,
  or only that nothing is on top of the first stop's wood?
- Do you ever write down the scale weight of a load?
- Do customers tell you which kind of truck they can unload (van at a dock,
  flatbed from the side), and their receiving hours?

**Prices and money**
- Q4. Lumber is "$545" in one note and "first quality $345" in another. Were
  those different times, or did we mishear one?
- The example prices: are they Canadian or US dollars?
- When the truck leaves with less than a full load, who carries the cost of the
  empty space: you, or does the customer pay per load?
- For US customers: who pays duty and the broker's fee, you or the customer?
  Has your broker told you whether your product falls under the softwood lumber
  duties?
- Do any of your customers ship their metal overseas on your wood, and ask for
  heat-treated stamped wood?
- When you raise prices, do you give customers notice, and from what date does
  the new price apply: order date or ship date?

**Orders and changes**
- Do customers send one PO per load, or one big PO that you draw loads from?
- When a load is split in two, is there one PO or two?
- How often does a customer change an order after the PO? What do you do then,
  and who do you have to call?
- If the load comes out bigger or smaller than the PO (fillers), does the
  customer accept the invoice, or do they need to change the PO first?
- What happens when a customer says a load arrived short, damaged or wrong?
  Who gives the credit?
- Does the subcontractor tell you when the wood will be ready before the truck
  is booked, or is the truck booked first?

**The office**
- When you ask the office for something and they say no or change it (a
  different carrier, a lower purchase quantity), how do they tell you?
- How long does the office usually take for a transport PO, a purchase
  approval, an invoice? When is it "late"?
- Does BB Pallets' management know this app will hold customer prices, costs
  and margins, and agree to it? Who keeps the data if he stops using it?
- Do you count the yard yourself, or does someone count for you? How do their
  numbers get to you?
- Does the office keep its own stock figures, or are yours the only ones?
- When a lumber load arrives at a yard, who checks the tally, and how does he
  hear about it?
- Who makes the bill of lading today: the office, the subcontractor, or him?

**Email and phone**
- Is his business email a personal Hotmail/Gmail address or a BB Pallets
  address? Would BB Pallets rather it went from a company address?
- Is he willing to let Timberline read his inbox, or would he rather forward
  the emails that matter?
- How much of his day is phone calls and text messages rather than email? Do
  carriers and subcontractors text him?
- Which language does he want reminders and drafts in? Do any subcontractors
  need Yiddish or French?

---

## 8. What is good and should stay

- **Request → record (D37).** The right idea, and cheap to do properly now (M2).
- **D35's reading of a confirmation** as "date booked and price accepted", with
  a changed price flagged and the confirmed price feeding the margin.
- **"Proposes, a person approves"** for the Assistant, and email that goes out
  only on a click.
- **Buying as visible as selling**: the batch calculator and the buying-gains
  idea are the most distinctive part of the plan and use their real method.
- **The price builder mirrors their own table**, with the cost basis chosen per
  list and the other two shown beside it (D17), and stale-price warnings.
- **Plant-level settings** (prices, major sizes, fillers, other costs): matches
  "almost no standard".
- **D16** (a split is two linked orders) and **D24** (subcontractor's own wood
  is not tracked): both remove whole classes of trouble.
- **D31–D34**: tight packing, partial bundles, direction and riser orientation
  on the job sheet are real loading knowledge; keep them.
- **One document, four ways out** (print, PDF, Excel, email) and every email
  logged on the record.
- **Every window lists what to confirm with BB Pallets**, and (proposed) is
  kept apart from what they said. Keep that habit.
- **Visuals first (D12)** was right and has done its job. Next (proposed): draw
  Today, Office requests and the office settings page, get Q1–Q4 and the first
  two real documents (A1), then model the core.
