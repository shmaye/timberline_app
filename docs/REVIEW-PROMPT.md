Paste everything below the line into the review session, and attach
`docs/REVIEW-PACKET.md` (or give it the repository).

---

You are an independent reviewer for **Timberline**, a planned web app. Nothing
is built yet except clickable mockups; we want the plan checked before we
start the data model, while changes are still cheap.

**Read the attached `REVIEW-PACKET.md` in full before writing anything.** It
has three parts: a review brief, the full plan (`HANDOFF.md`, with decisions
D1–D37) and a list of every mockup window (`WINDOWS.md`). If you have the
repository instead (`shmaye/timberline_app`, branch
`claude/dazzling-cerf-i8tpqe`), the same files are in `docs/`
(`REVIEW-BRIEF.md`, `HANDOFF.md`, `mockups/WINDOWS.md`), and you can also open
`docs/mockups.html`, `docs/flatbed-3d.html` and `docs/ui-direction.html` in a
browser.

The short version: Timberline is the personal workspace of **one BB Pallets
salesperson** (wood dunnage and pallets, Canada and the US). He works
remotely and sits between five parties: customers, the BB Pallets office,
suppliers, carriers and subcontractors. The office keeps doing the official
work (transport POs, approving purchases, invoicing, accounting); in
Timberline he requests it and records the answers. It must be easy to switch
the whole office into Timberline later (D37).

Your job: find what is wrong, missing, risky, overbuilt or could be better,
and say exactly what to change. Follow the "What to review", "Ground rules"
and "What to hand back" sections of the brief. In particular:

- Review against the latest decisions (D35–D37, section 1a). Some windows
  were drawn before them; do not treat those as the intended design.
- Keep what BB Pallets said separate from your own suggestions (mark yours as
  proposed).
- Point at sections, D-numbers and window ids (`#loads-bookings`).
- Check the arithmetic in the worked examples ($719 → $787 → $1.53 a piece;
  the $225 → ~$305 batch offer; the $510 average cost; 5% waste at shipping).
- Put questions only BB Pallets can answer in a separate plain-language list,
  leaving out the ones already in section 12 of the plan.

Hand back **one markdown file, `REVIEW-FINDINGS.md`**, in the format the
brief asks for (verdict; must fix; should change; worth adding; windows to
change for D36/D37; data model notes; questions for BB Pallets; what is good).
If you can write to the repository, commit it as `docs/REVIEW-FINDINGS.md` on
a new branch named `review/plan-review` and push it; do not change any other
file. If you cannot, give me the file's full contents in your reply.

Before you finish, re-read your must-fix list and drop anything you are not
confident about, or move it to "should change" with your doubt stated.
