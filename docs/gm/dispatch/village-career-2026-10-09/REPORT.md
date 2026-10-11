# Village career slice

Original proposal, awaiting Weibao's playable fiction and balance acceptance.

In Village, confirm your hero and finish the normal elder greeting if needed.
Open **Find work**, then **Take a loaned kit and patrol with Tessa**. A full
native two-hour round takes about two real minutes at normal speed and pays
50 coins. The career notes remain in the center menu while you work.

Return the lantern and baton after the round. Complete and return two rounds,
then click **Ask Tessa: Dependable worker**. Tessa remembers the last round;
the promotion adds a career entry under **Remembered years**. The next gate
shows your exact progress toward Mentor: five completed rounds and five kits
returned. Leaving early gives no career credit. Keeping a kit records a
50-coin debt; return it or pay before borrowing another. The kit is a custody
record, not an equippable item, so it cannot be sold or duplicated in inventory.

The optional `village_career` schema-1 save field defaults to an empty career
for older saves. No past work or debt is inferred. A pre-career saved native
patrol retains its old behavior; fresh patrols use the new shift contract.
Existing biography and NPC household owners are preserved. Promotions use
`life_record`; Tessa's last-shift memory belongs to the career ledger rather
than the unrelated annual household model.

Build passed. All five career tests passed. Full `npm test`: 254/257 passed;
the three existing schema-migration failures reproduce against the pre-edit
source snapshot. See [test output](TEST.log), [baseline failures](BASELINE_FAILURES.log),
[build output](BUILD.log) and [task-only integration diff](TASK_DIFF.patch).

Fresh-origin headless Chrome verification passed against rebuilt bundle
`8e8fde7f75bd`: native hero/elder opening, two real-time patrols, 50 native money
units per full shift, returns, Tessa's memory, one promotion/biography entry,
active-shift reload, post-promotion reload and actual UI export/import. An
early-ended round gave no career credit; recorded kit debt survived reload,
blocked another loan, and cleared on return. No browser page errors. See
[BROWSER.json](BROWSER.json) and [the promotion screenshot](promotion.png).

The generated pre-career v0.6 compatibility fixture also passed the real
loader: no career field, an active native patrol, retained timer, no inferred
loan/debt/history; its next fresh patrol creates one career loan. See
[COMPATIBILITY.json](COMPATIBILITY.json). This uses only this lane's generated
export, not a private save.

Play the rebuilt result at [the local preview](http://127.0.0.1:8139).
Mentor, debt-payment/insufficient-funds and failed-storage browser branches,
plus director review, remain in [the acceptance backlog](ACCEPTANCE_BACKLOG.md).
The full test suite is not green because of the reproduced pre-existing
failures. No commit or push was made; private saves and unrelated edits were
preserved.
