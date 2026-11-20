# Timberline: every window in the mockups

Generated from `docs/mockups/` (the same text as the notes under each window). Open `docs/mockups.html` to see them.

## Workflow

### Workflow diagram `#workflow` (screen)

The whole business on one page: the order going from the customer's spreadsheet to the invoice, with buying and inventory underneath, because "you make money when you buy". Green boxes with a yellow number are the order story. Every box opens its window, so BB Pallets can say "yes, that's how we work" or "no, it's like this".

To check with BB Pallets:
- Is anything missing between the customer's PO and the subcontractor job?
- Does buying really feed pricing like this (average cost into the price builder)?
- Who does each box today: the owner, the office, or the subcontractor?

Assistant here:
- Answer "where is order 24-0318?" by pointing at its box
- Explain any step in English or Yiddish

Ref: Hand-off 4.1–4.6, 13 (item 4)

### Assistant (open) `#dlg-assistant` (dialog)

The Assistant is on every page and understands mixed Yiddish and English, typed or spoken. It looks things up and proposes actions, but nothing is sent or changed until a person clicks Approve. What it may do follows the person's own access.

To check with BB Pallets:
- Which jobs would they hand to the Assistant first?
- Should the Assistant ever act without a click for small things (autopilot limits)?

Assistant here:
- Lookups: sales, margins, stock, loads
- Draft proposals, plan loads, email jobs
- "What can I offer for this batch?"

Ref: Hand-off 11, D4, D5

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

BB Pallets' own worksheet: the customer's needs fitted to a full truck, with the internal order number on it. It shows % of a truck live, and offers the three moves from the notes: split into two loads, cut items, or top up with the plant's major sizes. The proposal is emailed back and waits for the customer's PO.

To check with BB Pallets:
- Is "% of a truck" worked out from board feet, or by eye from experience?
- When topping up, is it always the major sizes, or what the customer asks for?
- How long does a proposal usually wait for the PO?

Assistant here:
- Top up to a full truck, weighted to major sizes
- Split into two loads with the gap the customer picks
- Draft the email with the proposal attached

Ref: Hand-off 4.1, 4.2, D13, D16

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

One email window for every document in the app. It sends from their own mailbox, picks recipients from the customer's contacts, uses the template for that document, and attaches the PDF and Excel. The Assistant can draft the text; a person clicks Send. Every email is logged on the customer and the order.

To check with BB Pallets:
- Should the subcontractor or the owner be copied on proposals?
- Is the buyer always the person who gets proposals, or does it vary?

Assistant here:
- Draft the email in English or French
- Mention the split-load choice in the text

Ref: Hand-off 8, D4, D30

### Orders `#orders-orders` (screen, order story step 5)

Every order and where it stands: proposal, customer PO, at subcontractor, loaded, invoiced. An order is only created when the official PO matches the proposal. A split load becomes two separate orders that point at each other (D16).

To check with BB Pallets:
- Does every customer send a PO, or do some just say "go ahead"?
- Do they send an order confirmation back today?
- Who decides which subcontractor gets the job?

Assistant here:
- Say where any order stands
- Match a PO that just came in
- Remind about split loads coming due

Ref: Hand-off 4.1, 4.6, D16

### Match customer PO to proposal `#dlg-pomatch` (dialog, order story step 5)

The customer's official PO is read and laid next to the proposal it answers. Differences in items, quantities, prices or dates are flagged, then one click creates the order.

To check with BB Pallets:
- How often does the PO differ from the proposal, and who wins: their PO or our proposal?
- Do POs carry prices, or just quantities?

Assistant here:
- Read the PO PDF into lines
- Explain each difference
- Draft a note to the buyer about a difference

Ref: Hand-off 4.1

### Invoice (document) `#doc-invoice` (document, order story step 10)

The invoice is made from what was really loaded, so the filler line shows the loaded quantity, not the estimate. Canadian sales carry GST/HST.

To check with BB Pallets:
- Payment terms per customer (open question F27)?
- Does the invoice go to an accounting program (F26)?

Assistant here:
- Explain any difference between the PO and the invoice
- Send it to the customer's AP email with the BOL attached

Ref: Hand-off 4.6, 8, D9

### Pickup orders `#orders-pickups` (screen)

Customers who send their own truck order regular items in a plain order. No load planning: the order is picked, the customer's driver signs, and it is invoiced.

To check with BB Pallets:
- Which customers pick up, and do they book a time?
- Is a pickup priced without freight (D15 still open)?
- Who signs for it at the yard?

Assistant here:
- Turn an emailed pickup order into lines
- Tell the subcontractor what to have ready
- List pickups booked this week

Ref: Hand-off 4.1 (exception)

## Loads

### 3D load planner `#loads-planner` (screen, order story step 3)

Fit the order to a truckload before it goes out. Bundles appear at their real size as they are added, the gauges show board feet, weight and floor live, and you drag bundles to set what goes on first. Each item can go across the trailer or lengthwise, whichever uses less floor. It suggests splitting, cutting or topping up with the plant's major sizes, then "Confirm load" locks the plan.

To check with BB Pallets:
- How do you stack bundles today: how many high, heavy at the bottom, sizes kept together?
- Real trailer sizes and weight limits for each trailer type you use.
- On a two-drop load, does the second plant always get the nose?
- Who confirms a load: the office, the owner, or the subcontractor?

Assistant here:
- Plan the load from the proposal ("fill this up for Concord, mostly major sizes")
- Suggest a split or a top-up and show the result before you approve
- Turn every item to its best direction

Ref: Hand-off 4.2 · D11, D13, D14, D15, D16, D31

### Confirm load `#dlg-confirmload` (dialog)

The "yes, this is the load" step. Confirming locks the plan and makes the packing slip, the bill of lading and the subcontractor job in one go, and records who confirmed it and when. (Proposed: it is used once the customer's PO is in; before that, the plan goes out as the proposal.)

To check with BB Pallets:
- Is a load confirmed before or after the customer's PO arrives?
- After confirming, who may still change it, and does the subcontractor get told automatically?

Assistant here:
- List what will be created before you confirm
- Warn if a gauge is over its limit

Ref: Hand-off 4.2 (Confirm) · D11

### Loading list `#doc-loadlist` (document, order story step 8)

The step-by-step list for whoever loads the truck, printed from the same 3D plan: what goes on first (the nose) to last (the doors), which way each bundle faces, and which drop it belongs to. On a two-drop load the first drop is loaded last, nearest the doors.

To check with BB Pallets:
- Does the loader need a drawing on the list, or only the steps?
- Should the list show bundle tags or counts per row?

Assistant here:
- Email it to the subcontractor or the driver
- Reprint it after a change to the plan

Ref: Hand-off 4.2, 8 · D8, D15, D31

### Carrier bookings `#loads-bookings` (screen, order story step 6)

Once an order is in, the truck has to be booked. The salesperson does not issue the transport PO himself: he asks the BB Pallets office to send one to the carrier with the price and the pickup date. The carrier's confirmation means two things: the date is booked, and the price is accepted. This screen tracks every load through those steps (asked, sent, confirmed, or changed by the carrier), so nothing ships on an unconfirmed truck, and the confirmed price becomes the load's real freight cost for its margin.

To check with BB Pallets:
- Does the salesperson choose the carrier and price, or does the office?
- Does the carrier's confirmation go to the office, to the salesperson, or both? Is there a confirmation number?
- What does the office need in the request: pickup and delivery windows, equipment type, drops, extra-stop charges?
- If the carrier changes the price or date, who decides?

Assistant here:
- Write the request to the office from the order and the load plan
- Read the confirmation email and fill it in, flagging a different price or date
- Remind you when the office or the carrier has not answered

Ref: Learned from BB Pallets, Nov 2026 · D35, D36 · Hand-off 4.6, 6 (carriers)

### Transport PO request to the office `#doc-carrierpo` (document, order story step 6)

The salesperson's request to the BB Pallets office to book the truck: which load, carrier, pickup and delivery, date, equipment and the price agreed. The office turns it into its official transport PO to the carrier. It goes from his own mailbox and is logged on the order, so he can see when he asked and what he asked for.

To check with BB Pallets:
- Can we see a real transport PO the office sends today, so the request carries everything they need?
- Is the price always per load, or sometimes with fuel surcharge or extra-stop charges?
- Would the office ever want to use Timberline to issue the PO directly (later)?

Assistant here:
- Fill it from the order, the load plan and the carrier's usual rate
- Send it to the office and remind them if there is no PO by the end of the day

Ref: D35, D36 · D8 (print, PDF, email)

### Record the carrier's confirmation `#dlg-carrierconfirm` (dialog, order story step 6)

When the confirmation comes back (from the carrier, or forwarded by the office), the booking is marked confirmed with the office PO number, the carrier's confirmation number, the date and the price. If the date or price differs from what was asked, it is flagged so the salesperson can tell the office what to do. The confirmed price is what the load's margin uses.

To check with BB Pallets:
- Do carriers ever confirm part of it (the date but not the price)?
- Who is allowed to accept a higher price: the salesperson or the office?

Assistant here:
- Fill this in from the forwarded email
- Explain the margin effect of a price change

Ref: D35, D36 · Hand-off 4.3 (freight $2,300, backup $2,500–2,600), 9 (freight by carrier)

### Load schedule `#loads-schedule` (screen)

Every load by ship date: delivered loads with their carrier, customer pickups, and the second half of split loads coming due (now + 3 weeks, or now + 1 month). It answers "what goes out this week, and what is coming". (Proposed layout.)

To check with BB Pallets:
- How far ahead do you plan loads: one week, two?
- Should pickups and delivered loads sit on the same calendar?
- Do you want Jewish holidays and Shabbos marked when scheduling?

Assistant here:
- "What ships next week?"
- Remind you when a split load is coming due
- Move a load to another day and tell the subcontractor and carrier

Ref: Hand-off 4.1, 4.2, 9 · D16

### Bills of lading `#loads-bol` (screen)

One bill of lading per load, for the carrier. It is made when the load is confirmed, printed or emailed to the carrier, and the signed copy is attached when it comes back. US loads also carry the customs broker's details.

To check with BB Pallets:
- Do you use your own BOL form or the carrier's?
- Which papers go with a US load besides the BOL?
- Who keeps the signed copy today?

Assistant here:
- Email the BOL to the carrier
- Find loads still missing a signed BOL

Ref: Hand-off 4.6, 7, 8 · D8, D26

### Bill of lading `#doc-bol` (document, order story step 8)

The carrier's paper for the load: shipper, consignees in drop order, what is on the truck and its weight, and signatures at pickup and delivery. It is made from the confirmed plan, so the bundle counts and weight match. On US loads the customs broker block is filled in.

To check with BB Pallets:
- Which freight description do you use for dunnage (e.g. "wood dunnage, untreated")?
- Does a two-drop load get one BOL with two stops, or one BOL per stop?
- Which customs broker do you use for US loads?

Assistant here:
- Email it to the carrier from your mailbox
- Fill the broker block from the US plant's record

Ref: Hand-off 4.6, 7 · D8, D26

### Commercial invoice (US load) `#doc-commercial` (document)

A US load goes through a customs broker. The commercial invoice and broker details go with the truck and are emailed to the broker. Which papers exactly is still to confirm. (proposed)

To check with BB Pallets:
- Which papers go with a US load today (F30)?
- Is a CUSMA certificate of origin needed?
- Is the wood heat treated or stamped (ISPM-15)?

Assistant here:
- Fill in the broker and HS code from the plant
- Email the papers to the broker before the truck leaves

Ref: Hand-off 7, D26

## Production

### Subcontractor jobs `#production-jobs` (screen, order story step 7)

Each order becomes a job for the chosen subcontractor: the items, quantities, fillers and packing slip, emailed from here. After loading, the real quantities come back (by phone or email today) and the office types them in, which updates the order before invoicing.

To check with BB Pallets:
- How many subcontractors do you use, and which does what?
- What does the subcontractor need on the job: cut list, stock lengths to use, loading order?
- How soon after loading do you get the real quantities?

Assistant here:
- Draft and email the job to the subcontractor
- "Which jobs are loaded but have no quantities back?"
- Type in quantities from a phone call you dictate

Ref: Hand-off 4.6 · D7, D25

### Subcontractor job sheet `#doc-jobsheet` (document, order story step 7)

What the subcontractor needs to cut, groove and load: the items and bundles, which stock lengths to cut them from, the fillers, the ship date and the loading order. It replaces the order the office used to type up and send. (Layout proposed until we see theirs.)

To check with BB Pallets:
- Can we see a job sheet as you send it today?
- Should the sheet say which stock lengths to cut from, or leave it to the subcontractor?

Assistant here:
- Email the job sheet with the packing slip and loading list attached
- Translate the notes for the subcontractor if needed

Ref: Hand-off 4.6, 8 · D7, D8

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

After loading, the subcontractor phones or emails what actually went on the truck, and the office types it in here. Differences from the order show at once, the filler count is filled in, and "Update order" makes the invoice from the real quantities. Inventory books the shipped board feet with 5% waste.

To check with BB Pallets:
- Do quantities come back per bundle or per piece?
- If the load differs from the PO, does the customer need to approve before invoicing?

Assistant here:
- Read the subcontractor's email and fill in the quantities for you to check
- Flag a difference bigger than one bundle

Ref: Hand-off 4.5, 4.6 · D25

### Subcontractors `#production-subs` (screen)

Each subcontractor with what they do (cut, groove, pallets), their yard, contacts and rate card, their open jobs, and what BB Pallets owes them for wood processed. Their pay is per MBF of wood coming in plus extras. Their own wood is not tracked in Timberline.

To check with BB Pallets:
- How is each subcontractor paid: per MBF in, per piece, per load, plus which extras?
- Do you pay per job or once a month?
- Should a subcontractor ever log in, or is email enough?

Assistant here:
- "How much do we owe Kessler for November?"
- Compare cost per MBF between subcontractors

Ref: Hand-off 4.6, 6 · D7, D24, D25

## Purchasing

### Offers & batch calculator `#purchasing-offers` (screen)

"You don't make money when you sell, you make money when you buy." This screen works out what to offer for an odd batch: delivered cost, converted to a common count, plus extra cutting, against today's first-quality price, with the yield into the sizes customers actually buy and the leftovers it leaves.

To check with BB Pallets:
- Is the 10-foot count the standard, and when would you compare on another length?
- How do you estimate the extra cutting cost for a batch like this?
- Which customer sizes should the yield table use by default?
- Do you want a record of offers that were turned down?

Assistant here:
- "What can I offer for this batch?" from a supplier's email
- Show the yield of 12s into this week's orders
- Draft the counter-offer email (you click Send)

Ref: Hand-off 3, 4.4; D20, D21

### Purchase orders `#purchasing-pos` (screen)

A log of every load bought: supplier, length, grade, price and freight. Received loads feed the average cost that inventory is valued at, so the price builder can use what lumber really cost.

To check with BB Pallets:
- Do you send suppliers a written PO today, or just agree on the phone?
- Is freight usually included in the supplier's price, or billed separately?
- Do loads go straight to a subcontractor's yard, or always to your yard first?

Assistant here:
- Log a load from the supplier's invoice or email
- Answer "what did we pay for 10s last month?"
- Remind you of loads not received yet

Ref: Hand-off 4.4, 4.5; D17, D22

### Purchase order to a supplier `#doc-supplierpo` (document)

The purchase order (or written offer) sent to a supplier. Same file for print, PDF and email, and it's logged on the supplier.

To check with BB Pallets:
- What do suppliers need on a PO: grade, lengths, tally, delivery window?
- Do you send offers (like the $225) in writing, or only firm orders?

Assistant here:
- Draft the PO from the agreed offer
- Email it to the supplier from your mailbox (you click Send)

Ref: Hand-off 8; D8

### Log a purchased load `#dlg-purchase` (dialog)

Record a load the moment it's bought or arrives: supplier, lengths, grade, board feet, price and freight. The preview shows how it moves the average cost before you save.

To check with BB Pallets:
- Do you know the exact board-foot tally when a load arrives, or only later?
- Should a load be split across two yards on one PO?

Assistant here:
- Fill this in from a photo of the supplier's tally sheet
- Warn when the price is far from the plan in the price lists

Ref: Hand-off 4.4, 4.5

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

What BB Pallets owns, in board feet, at their own yard and each subcontractor's yard, valued at the running average cost of loads bought, not list price. Committed shows what open orders will use, with the 5% waste added.

To check with BB Pallets:
- Do you also want cut stock (finished bundles waiting) tracked here, or only raw lumber?
- Is one average cost per size & length right, or one per yard?
- Should offcuts carry zero cost, or a share of the load's cost?

Assistant here:
- "How much 2x3 × 10' do we have at Kessler?"
- Warn when an order can't be covered by what's available

Ref: Hand-off 4.5; D21, D22, D23, D24

### Counts & recounts `#inventory-counts` (screen)

Replaces the 4–10 days (sometimes a whole Sunday) of balancing by hand. The count is compared with the book, adjusted automatically for everything shipped since the count date; small differences are let go, a big one (about a bundle) goes on a recount sheet.

To check with BB Pallets:
- What difference is "small enough to let go": a percentage, or a number of board feet?
- Who counts, and on paper or on a phone?
- Do you count cut bundles too, or only raw lumber?
- How do you handle loads that arrive or ship during the count day?

Assistant here:
- Print the count sheet for the Kessler yard
- Explain why 3x3 × 12' is 2,050 ft over
- Propose the adjustment after the recount (you approve)

Ref: Hand-off 4.5; D8, D23, D24, D29

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

Ref: Hand-off 4.5; D24

### Adjust to count `#dlg-adjust` (dialog)

Make one adjustment, pick the reason, and see the new average cost before saving.

To check with BB Pallets:
- Is a note required for every adjustment, or only big ones?

Assistant here:
- Fill in the reason from the recount notes

Ref: Hand-off 4.5

### Waste `#inventory-waste` (screen)

Shows the 5% booked at shipping against the real waste found at each count, by size and stock length. Real waste depends on the sizes cut and the wood quality, which is why counts come out higher than the books.

To check with BB Pallets:
- Is 5% the right flat figure for every size?
- Would you like waste booked per size and length once the numbers are known? (proposed)
- Does the subcontractor charge on wood in, including the waste?

Assistant here:
- "Which sizes waste more than 5%?"
- Suggest a better waste % per size from the last counts

Ref: Hand-off 4.5

## Pricing

### Price builder `#pricing-builder` (screen)

Does BB Pallets' own cost table for one customer or plant: lumber plus labor plus waste plus freight per MBF gives delivered cost, then margin and other costs give the selling price, then per piece from each item's board feet. The worked example is theirs: $719 delivered, $787 selling, $1.53 a piece.

To check with BB Pallets:
- Is the price always rounded up to the next cent?
- Is $3,000 a rounding of $2,700, or is there another cost in it?
- Does grooving add a fixed amount per MBF, or per piece?
- Is the 44,000 bd ft per load the same for every trailer and customer?

Assistant here:
- Build the price for a new plant from its volume and freight
- Explain how $1.53 was worked out
- "What if lumber is $525?" for this plant

Ref: Hand-off 4.3; D17, D18, D19

### Price lists `#pricing-lists` (screen)

Every customer and plant has its own prices, set in advance, so an order arrives already priced. Each list remembers the lumber cost, cost basis and quote unit it was built on, and is flagged stale when that cost is far from today's.

To check with BB Pallets:
- How far from today's cost should a list be before it's "stale"? $25? $50?
- Do customers get a printed or emailed price list, or only quotes?
- Do US plants have prices set in USD, or converted from CAD?

Assistant here:
- "Which customers are priced on lumber over $520?"
- Re-price stale lists and show the changes (you approve)
- Email a price list to the buyer

Ref: Hand-off 4.3, 8; D17, D19

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

Customers and their plants. Each plant carries its own price list, currency, volume, pickup or delivered, freight, major sizes, filler items and other costs per load, because "almost no standard": the same item has different prices at plants 8 miles apart. Follow-ups catch a plant that is late on its usual order (proposed).

To check with BB Pallets:
- Is the plant the right level for prices, or sometimes the customer?
- What counts as "late" for a plant: a set number of weeks?
- Do some plants share one buyer and one invoice?

Assistant here:
- How is Concord doing vs last year?
- Which plants are late on their usual order?
- Draft a check-in email to a late plant

Ref: Hand-off 3, 6, D18, D26

### Edit a plant `#dlg-plant` (dialog)

Everything that makes a plant different in one place: where it ships, who buys, which price list and currency, pickup or delivered, freight, the major sizes used for top-ups, filler items, other costs per load (D18), how often it orders, and the customs broker for US plants (D26).

To check with BB Pallets:
- Are other costs one number per load, or several lines (e.g. waiting time, special packaging)?
- Is freight set per plant, or per destination area?
- For US plants, does each plant have its own broker?

Assistant here:
- Fill the plant from an email signature or a PO
- Suggest major sizes from past orders

Ref: Hand-off 6, D18, D26

### Contacts `#customers-contacts` (screen)

Everyone BB Pallets emails: buyers, accounts payable, receivers at each plant. The Email dialog picks recipients from here, and every email sent from Timberline is logged on the contact and the order.

To check with BB Pallets:
- Who gets which document: does AP get invoices and the buyer get proposals?
- Any contacts who should be copied on everything?

Assistant here:
- Add a contact from an email signature
- Show the last emails with a contact

Ref: Hand-off 6, 8 (Email)

### Statements & payments `#customers-statements` (screen)

Who owes what (proposed): open invoices, aging, payments and credits, payment plans, and statements or overdue reminders emailed from the system. Terms and credit limits are still to be confirmed with BB Pallets.

To check with BB Pallets:
- What payment terms do customers have, and any credit limits?
- Who chases late payers today?
- Do payments get entered here, or come from the accounting program?

Assistant here:
- Who owes us over 60 days?
- Draft an overdue reminder with the statement attached
- Set up a payment plan

Ref: Hand-off 6 (AR, proposed), 8, F27

### Statement (document) `#doc-statement` (document)

A customer statement with aging, to send to their accounts payable as a reminder. Same file to print, download or email. (proposed)

To check with BB Pallets:
- Who chases late payers today (F27)?
- Do they send statements monthly, or only when overdue?

Assistant here:
- Draft a polite overdue reminder
- List every customer more than 45 days overdue

Ref: Hand-off 6 (accounts receivable), 8

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

The daily and weekly picture: every open order and where it stands, the load schedule with split loads coming due, inventory on hand against what is committed, and purchases against the market. (proposed)

To check with BB Pallets:
- Which of these do they look at every day?
- Who should get them by email, and when?

Assistant here:
- "What ships this week?"
- Email this report to the office every Monday

Ref: Hand-off 9

### Money reports `#reports-money` (screen)

The month in money: margin per load and per plant against the planned $2,000 to $3,000, buying gains (every $25 under plan is $1,100 a load), waste booked against actual, freight by carrier and how often the backup was used, and sales by plant against last year.

To check with BB Pallets:
- Is margin per load the number they judge a customer by?
- Should "other costs" per load be split into named lines?
- Who may see this page (D28: off by default)?

Assistant here:
- "How's Concord doing vs last year?"
- "What did the last Toronto load make?"
- Explain why a load made less than planned

Ref: Hand-off 4.3, 4.4, 9, D18

### Scheduled reports `#reports-scheduled` (screen)

Any report can be emailed on a schedule, as PDF and Excel, from their own mailbox. (proposed)

To check with BB Pallets:
- Which reports should arrive automatically, and to whom (owner, accountant)?

Assistant here:
- Set up a schedule from a sentence: "send me margins every month-end"

Ref: Hand-off 8, 9

## Settings

### Users & access `#settings-users` (screen)

For now one salesperson from BB Pallets uses it, but it is built for more. Each person gets view, read or write per department. Costs and margins are hidden unless an admin turns them on for that person.

To check with BB Pallets:
- Who is the admin?
- Should the buyer see margins, or only costs?
- Will subcontractors ever log in, or only get emails?

Assistant here:
- Explain what a person can and cannot see
- Turn the Assistant on or off for a person

Ref: D27, D28, Hand-off 14 (testing mode)

### Email `#settings-email` (screen)

Email goes out from their own mailbox, so replies come back to them and thread properly. Hotmail (Outlook.com) and Gmail are both confirmed. Each document type has its own template and signature.

To check with BB Pallets:
- Which address sends what (sales vs office)?
- Should every sent email be copied to someone?

Assistant here:
- Write a template for a document type
- Show emails sent to a customer this month

Ref: Hand-off 8, D30

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

Carriers in order of preference, cheapest first, then the backup, with their rate per destination. Freight per load feeds the price builder ($2,300 planned between the $2,000 carrier and the $2,500–2,600 backup).

To check with BB Pallets:
- Is freight per destination, and who pays it (open question C15)?
- How do they book a carrier today: phone, email, portal?

Assistant here:
- Pick the carrier for a load and draft the booking email
- Show how often the backup was used and what it cost

Ref: Hand-off 4.3, 6

### Taxes & currency `#settings-taxes` (screen)

Prices and invoices in the customer's currency, costs in CAD, with an exchange rate per day or per document. Sales tax by province on Canadian sales, none on exports to the US. (proposed, ask BB Pallets)

To check with BB Pallets:
- Which customers are billed in USD (F28)?
- Any Quebec customers needing QST and French documents (F29)?
- Where should the exchange rate come from?

Assistant here:
- Explain which tax applies to a plant and why

Ref: Hand-off 7, D9

### Imports `#settings-imports` (screen)

Lots of existing data gets loaded in: catalog, customers and plants, price lists, opening stock. Drop an Excel or CSV file, match its columns, preview, then import. Messy files are read by the Assistant.

To check with BB Pallets:
- Which files exist today for each (open question A4)?
- What date should opening stock be counted at?

Assistant here:
- Read a messy spreadsheet and match its columns
- Explain rows that could not be imported

Ref: D10
