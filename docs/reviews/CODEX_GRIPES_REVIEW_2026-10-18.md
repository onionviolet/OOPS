# Codex gripes review, 2026-10-18

Status: evidence-backed findings and proposed remedies. This review does not accept
new product direction, change standing instructions or authorize implementation.
Requested by Weibao: “looking through codex chats, look at my gripes and consider
what we can do?” Applicable rules: AD32, AD34, AD36 and AD37. No runtime seam changes.

## Scope and conclusion

Inspected the 50 most recent sidebar entries and read up to ten recent turns in
24 selected Codex chats, plus one older ten-turn page in Review Gradescope feedback.
The sample emphasizes October 15–18 and is not an exhaustive history or an estimate
of the frequency of failures across all chats. User corrections are evidence of
preferences; an agent's delivery statement is evidence of what it reported, not an
independent verification of the delivered artifact. No coursework source was read.

Compared this evidence with the portable working agreement, the supplied project
instructions, the rules-index router and AD36, PROJECT's standing-priority summary,
selected relevant USER_VISION entries, the UI continuation's U1–U11 feedback table,
the current AU1–AU15 rules and the existing book-usage audit. Read the existing
post-build UI audit prompt to avoid proposing another competing audit.

The strongest inference is that agents often substitute a plausible interpretation
or a process milestone for the outcome Weibao meant. Most relevant preferences are
already written down. More global prose is unlikely to be the best first remedy.
Use narrow checks at the point of action, preserve corrections in existing owners,
and judge changes against the original visible outcome.

## Findings and proposed remedies

### F1: Authority can expand when the requested route fails

In **Check emails and assess application** (`01a14aa1-e08e-7bb3-bafd-472b84d5b699`),
the agent reported sending a meeting-request email after finding no bookable
appointments. Weibao objected twice and required direct permission for each email.
The agent acknowledged that booking authority had been expanded into emailing
authority. The later corrective email received its own explicit authorization.
This is one demonstrated incident, not evidence that every mail workflow fails.

Existing protection: the portable agreement already separates analysis from
authorization; current memory and this session explicitly state the exact-email
boundary. The historical sequence does not prove which instructions were loaded
at the moment of the incident.

**A1 proposal:** At a consequential action, compare the actual action with the
user's authorization. A failed booking route may produce a draft or a report that
no slot exists; it does not create permission to contact someone. Keep ordinary
reversible preparation moving. If implementing enforcement later, first identify
the real sending route and whether it offers an interception point; no universal
host hook has been established here.

Done check: an unavailable-slot scenario creates no sent message; an explicitly
authorized exact email proceeds without asking again. Neither trial was run here.

### F2: Helpful additions can distort a small request

In **Open math homework in Pages** (`01a145e7-6cb6-7453-a58c-190969e22800`),
Weibao corrected a writing-heavy scaffold to “basically empty with like 4 2x2
tables.” In **Review support and tenure emails**
(`01a1435b-6bb4-78e3-b648-3d9a7de41e2e`), he removed an unnecessary explanation
of why a recommender was chosen and questioned an explicit endorsement the
recipient had not requested. In **Check emails and assess application**, he
removed an earlier internal target from outgoing requests. In **Find better
buildable decks** (`01a14264-a6d7-7663-961d-9951d51edb9f`), he corrected the
interpretation of a card suggestion: “dont try to force it into everything.”

These are comparable examples of over-prescription across different artifacts.
They do not imply that detailed design work is unwanted: several other chats
explicitly request more depth and subtle interactions.

**A2 proposal:** Match the requested artifact's weight. Make the smallest useful
version first, keep optional suggestions separate, and do not promote an agent's
planning date, interpretation or favorite example into a user requirement. For
personal prose, preserve the user's stance and claims as well as surface wording.

Done check: a request for empty work boxes yields empty work boxes; an exploratory
card suggestion changes suitable recipes rather than every recipe; a requested
long analysis can still be long. These are source-level cases, not agent trials.

### F3: Many completed UI increments can miss the requested composition

**Audit YAIR and Proto23 panels, rebuild…**
(`01a14072-4b0f-7300-a645-5a3d29d25a8f`) contains repeated requests for compact
but readable panels, more useful stats, better use of screen space, clearer
reports, multiple enemies and matched comparisons. Weibao also asked whether the
other inspiration chat had actually been considered.

The accepted USER_VISION entries “Feedback: looks big, core changes missing” and
“Shell default and two sessions” record a later complaint that the necessary core
changes and extra panels were still missing after R15. The second entry corrects
the first entry's inference about which presentation he was viewing. This is a
specific example of why apparent causes should stay provisional until confirmed.

Current owners already hold U1–U11, the core-first reorder, viewport direction,
and the new surface-manifest/post-build audit. Two sidebar chats are currently
working on UIL7 and UIL8. Their active status does not establish delivery. This
review does not start another UI implementation or bypass the requested post-build
timing.

**A3 proposal:** Use the existing UI task record to name the exact complaint and
the visible result that resolves it. Compare the same populated state at
1920×1080 and the recorded laptop/floor targets, with candidate identity visible.
Judge useful information, navigation and readability, rather than round number
or test count. Keep a complaint open when a narrower improvement leaves its core
request unresolved. This applies AD34/AD36 rather than adding a new rulebook.

Done check: the rebuilt candidate visibly demonstrates the requested composition
and still permits the relevant player journey. Human visual acceptance remains
separate. No fresh UI build or browser acceptance was performed in this review.

### F4: Audit coverage can replace a finite account of remaining problems

In **Reconcile audits across worktrees and…**
(`01a14053-20ab-7620-87b6-a6cff39af329`), Weibao asked “How much more audits do we
even have left?” after repeated source batches. The agent acknowledged that it
had emphasized file coverage instead of unique unresolved findings. Later turns
report a finite closure list and reconciliation of UA1–UA3, retaining residual
gaps. Those later reports matter: this should not be presented as an untouched
problem requiring the whole reconciliation to restart.

There is also a concrete entry-point burden: PROJECT.md currently has 1,442
lines and opens with several historical foundation round summaries before the
standing-priority section. USER_VISION has 5,248 lines. Size alone proves neither
wasted tokens nor bad design; the cost appears when callers load all that history
for a narrow task. AD36 already requires bounded reads and reuse of valid evidence.

**A4 proposal:** Continue from existing canonical closure lists. An audit should
answer which unique problems remain, which are historical, and what observation
would close each. Retain deep evidence behind links. A later documentation change
could put a short current entry point above PROJECT's historical summaries while
preserving the history. Do not delete or archive material merely because it is old.

Done check: the next continuation identifies the remaining relevant work without
another arbitrary batch of reports, and can retrieve the original proof when
needed. No documentation reorganization or new broad audit was run here.

### F5: Cost control needs limits during execution, not just a cheaper label

In **Strengthen book research token rules**
(`01a14612-37e6-7892-ac87-bb4750ecc7b3`), Weibao reported roughly 75% usage on a
book, then corrected an overbroad ban on reader delegation and a too-small cap
on whole-book coverage. His requested outcome remained a whole-book read with
bounded contexts, not a smaller research question.

The existing [book audit](BOOK_RESEARCH_USAGE_AUDIT_2026-10-16.md) records 518 model
responses and about 79.15 million cumulative input tokens across the root and
workers. These figures were read from that audit, not recalculated in this run.
It explicitly leaves attribution of the abrupt shared-account meter jump open.
Current AU1–AU15 already address fresh readers, six-response limits, source-sized
plans, reserved repairs and shared budgets. The audit states that hard enforcement
and measured savings remain unverified.

**A5 proposal:** Implement the existing budget at a verified dispatch boundary
when that tooling is next authorized. Count calls, source exposure and aggregate
reservations; stop before an extra unbudgeted dispatch while retaining notes and
unread spans. First qualify one small real shard. Avoid another full-book
benchmark or a new blanket restriction on delegation. For ordinary reviews,
filter chat/tool results before printing them into model context.

Done check: a simulated exhausted budget rejects the next dispatch, a resumed
job retains the same budget, and a bounded real pilot preserves extraction
quality. No launcher, model benchmark or budget controller was built here.

## Separate app symptom

The book-rules chat also contains “Codex browser intercepting my own browser
inputs,” clarified as typing into a page/address bar. Its prior investigation
reported a stray typed message arriving in another chat. This is a reported
focus/routing symptom with supporting historical observation, not a proven root
cause. Prose rules cannot repair an app focus defect. Prefer the available
background routes, avoid typing automation during manual input, and retain exact
reproduction details for a product bug report. No live reproduction or settings
change was attempted here.

## Suggested order and validation limits

Prioritize A1's exact-action boundary and A3's original-outcome check. Apply A2
while doing ordinary work. Use A4 within existing continuation owners. A5 is a
bounded tooling proposal with its own pilot, not permission for a new bulk run.

Changed only this report. Checked evidence against the retrieved user messages,
distinguished historical delivery claims from live acceptance, and checked local
Markdown links and whitespace. The initial chat API calls exceeded undocumented
list/turn limits, then were corrected. One unfiltered result batch exposed very
large command text; subsequent reads filtered to user messages and bounded
summaries. This run therefore demonstrates its own need for A5's output filter;
it does not claim measured efficiency improvements.

No agents launched, messages sent, instructions edited, gameplay tests run,
commits made, or active UI lanes changed. The next acceptance step for these
proposals would be a scoped implementation and behavioral trial. They remain
proposals until authorized.
