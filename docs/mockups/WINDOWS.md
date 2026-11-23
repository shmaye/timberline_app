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
- Do you count a van in 48" × 48" slots (52 a truck) for every customer?

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

### Slot plan: two pickups `#loads-slots` (screen)

How he plans a van in his own terms (notes 14–16). Bundles sit on a 48" × 48" footprint, so a 53' van holds 13 rows along, 2 across, 2 high: 52 bundles. Bundles that are only 40" long give back 8" each row; 20 of them make room for 4 more. This customer is trained to order 52 (D66); one variable item takes whatever room is left, so the truck can leave with 56. The load is picked up at two places (D67): the first loader puts on its items and the variable item, and has to leave exactly enough room at the doors for the second place's bundles, so the variable count is decided here, before the truck leaves, not at loading. Every bundle is the customer's own count for that item (D62).

To check with BB Pallets:
- Are all your bundles on a 48" × 48" footprint, or only this customer's?
- Is it always 2 across and 2 high in a van? Do you ever stack 3 high?
- Where are the two pickup places for this customer, and which one loads first?
- Who decides how many of the variable item go on: you, or the first loader on the day?
- Are the 52 bundles a rule of yours for every customer, or only one you taught this customer?

Assistant here:
- "How many of the variable item fit?" from the order
- Tell the first loader how much room to leave for the second stop
- Warn when the second stop's bundles would not fit after a change

Ref: Voice notes 14–16 (2026-11-23) · D62–D67 · D13, D15, D33, D43, D45

### Loading list per pickup stop `#doc-loadlist-stops` (document)

When a truck loads at two places, each place gets its own part of the list from the same plan revision. The first stop sees its rows from the nose, the variable item with its count already decided, and in large print how much room it must leave at the doors. The second stop sees what is already on the truck and where its bundles go. Both show the customer's pieces per bundle, which must be exact.

To check with BB Pallets:
- Does the second place need the first stop's list too, or only its own part?
- If the first stop runs out of room, who calls whom?

Assistant here:
- Email each stop its own part of the list
- After the first stop reports, tell the second stop what is on the truck

Ref: Voice note 16 · D62, D66, D67 · D8, D41

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
- Do the subcontractors keep each customer's bundle count, or do you have to tell them each time?

Assistant here:
- Email the job sheet with the packing slip and loading list attached
- Translate the notes for the subcontractor if needed

Ref: Hand-off 4.6, 8 · D7, D8, D34, D41 · Review S1, M5

### Packing slip `#doc-packing` (document)

Goes with the load. It lists what was ordered, with the filler line quantity left blank, to be filled in at loading ("add as many as fit"). The filled-in slip is where the real quantities come from. On a load picked up at two places, the variable item is decided on the plan instead, because the first loader has to leave room for the second (D67).

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

Everything that makes a plant different in one place: where it ships, who buys, price list and currency, pickup or delivered, freight, major sizes for top-ups, filler items and how far the filler may go over the PO, other costs per load (D18), how often it orders, and what a carrier needs: receiving hours, appointment, how it unloads (forklift from the side or a dock), which trailers it takes, shutdown weeks. For US plants: delivery terms, who is the importer of record, and the customs broker (D26). The unloading side sets the planner's "Unloads from" (D34). Each item has this customer's own pieces per bundle, which never changes for a cut-to-size item, a bundles-per-load target and a variable item that fills the rest, and the places the load is picked up from (D62–D67).

To check with BB Pallets:
- Do customers tell you their receiving hours and which trucks they can unload?
- For US plants: who is the importer of record, and who pays duty and the broker?
- How far over the PO will each plant accept on the filler line?
- Does every customer have its own pieces per bundle for each item, or only some?
- Which items do you resell as bought from the supplier, without cutting?

Assistant here:
- Fill the plant from an email signature or a PO
- Suggest major sizes from past orders
- Set "Unloads from" on the planner from this plant

Ref: Hand-off 6 · D18, D26, D34, D62–D67 · Review S4, S8, S15

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
- Is the bundle footprint always 48" × 48" (or 40" for short items)?

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
