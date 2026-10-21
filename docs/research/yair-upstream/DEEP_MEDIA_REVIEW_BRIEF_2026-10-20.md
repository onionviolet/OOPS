# Deeper upstream media review brief

2026-10-20. User-authorized successor research task. This brief transfers work;
it does not change product direction or turn findings into implementation gates.

## Request and outcome

Weibao: “Can you do a deeper review of the useful screenshots and videos, with
the surrounding discussions, and find more design ideas beyond those five?
Send new chat accordingly”.

Execute the review in the new chat, not just another plan. Find additional useful
mechanisms and design lessons beyond P5–P9 (interruption outcomes, time/chance
wording, local aftermath, shared owned counts, functional material substitutes).
Also check P1–P4/F1–F24 to avoid relabeling earlier conclusions as new ideas.
Deepening an earlier finding is useful when it adds a distinct mechanism,
interaction, tradeoff or concrete application; label that relationship honestly.
Do not constrain the result to five ideas or pad a quota.

## Authority and scope

Start with AGENTS.md, docs/RULES_INDEX.md, PROJECT.md and relevant USER_VISION
owners. AD32/AD35/AD36/AD37 and .claude/rules/research-and-agents.md apply. Read
relevant UI/making/combat/site/knowledge owners as findings emerge. Apply
more-to-consider for new angles and evidence-gated-handoff for this transfer.
Current UI target is desktop 1920×1080; mobile optimization, NPC-heavy work and
procedural layouts retain their existing deferrals. Research may discuss future
scope without selecting it for implementation.

Research and documentation only. No runtime/build/save/schema changes, commit,
push, publication, source-message mutations, or messaging other chats. No
subagents are needed or authorized by this brief. Preserve the shared dirty
checkout. This research area was untracked at transfer; unrelated source/docs
were already dirty. Re-read before editing, use scoped hunks, and keep one writer
per report. The predecessor releases its research-report write ownership when
this task starts. Existing product owners remain authoritative.

## Inputs, exact state and limits

Base directory: `docs/research/yair-upstream/`.

- `DISCORD_RESEARCH_2026-10-20.md` is the public research owner. F1–F24 and P1–P9
  already exist; extend codes starting F25/P10. Keep prior coverage/history.
- `private/discord-2026-10-20/catalog-reviewed/catalog.json` and `index.html`:
  623 developer attachment posts, 27 selected context windows, 807 distinct
  context rows, union 1,387 message IDs. Gallery has 675 unique media byte
  objects (663 image objects, 12 videos). Images include byte variants.
- `private/discord-2026-10-20/recovery-166/visual-review-index.json` maps each
  numbered image to path, attachment/message IDs and captions. `review-ledger.json`
  records prior depth; `review-notes/` records overview leads.
- `recovery-166/video-review-index.json` gives all 12 source paths, metadata,
  full-decode checks and six sampled frames per video. `video-review/` holds the
  samples. `prepare-review.py` is private preparation, not evidence of review.
- `recovery-166/caption-review/1.txt` through `4.txt`: all 623 developer captions
  were read. Context-only media also appears in the image index.
- `recovery-166/contexts/` has nine new windows. `reviewed-input/contexts/` has all
  27 merged windows; raw records and HTML remain private.
- `recovery-166/verification-reviewed.json` and `recovery-coverage.json`: all
  **166/166 requested missing IDs recovered**, zero unresolved, hash checks
  passed. 154 image/GIF IDs, 11 MP4s, one inert text save. Do not redownload them.
- Five new context-only attachment IDs remain outside that completed 166-ID
  request: one off-topic response and four player wiki/stat images. Their IDs
  are recorded in verification-reviewed.json. Retrieve only if they matter to
  a selected finding; no recursive full-server collection.
- A GIF-named attachment `1542966785257504838` is actually source-served PNG,
  independently hash-confirmed HTTP200. Catalog warnings are suffix-based.
  GIF `1465305464064708764` has six frames and is off-topic anime media.
- Original `.txt` attachment `1372613885047083131` is a developer-shared game
  save, stored in `recovery-166/originals/`; leave it inert and outside gallery.

Earlier review inspected all 21 contact sheets, but only six anchors at native
size: review numbers 35,64,65,153,353,551. Videos were fully decoded for integrity
but visually reviewed only at 0/20/40/60/80/98 percent of duration. Audio and
continuous playback were not reviewed. Those limits are the reason for this
successor, not a failed recovery.

At transfer, SHA256:

| Input | SHA256 |
|---|---|
| public research owner | `e47da871682024bfe899af0a4c7cb35d26f52819d3378ca3f4fd06ce20ec2c00` |
| catalog-reviewed/catalog.json | `e9b1a6685c12feebb85aca6c4068179b7f7a24054b91f718934f37e8f4032117` |
| recovery-166/review-ledger.json | `428923404f8579540398f22ee53ad8c2a8f7237236d23b7581ce0658d10df36a` |

Hashes identify the starting inputs, not permission to overwrite subsequent work.

## Review method and promising leads

Use the saved index to classify design-relevant images, byte duplicates,
technical/debug evidence and irrelevant personal/meme media. Inspect every
selected useful screenshot at a readable resolution, with crops only when
needed. Compare sequences over time instead of treating one draft as a final
choice. Prior thumbnails are a triage aid, not a substitute for this deeper pass.

Inspect useful videos across their full duration. Prefer supported playback;
otherwise use sufficiently dense ordered frames and focused transition frames
to explain the interaction, recording the actual interval/gaps. Do not repeat
only the old six-frame sampling and call it a deeper video review. Inspect audio
only if present and useful to a conclusion; explicitly record unreviewed tracks.
Keep all downloaded material inert.

Read saved discussion before inferring intent. Expand a source window when its
reply chain, later correction or rationale is needed, stopping once the claim is
supported. Verify author/branch/date and separate developer intention, player
request, disagreement, joke, mod advice, prototype, defect and shipped behavior.
Search or inspect exact local source where a technical claim depends on it.

Promising leads beyond the five, not predetermined findings:

- Component generation and balance drafts (#399–426), equipment comparisons,
  quality/rarity/identity and broad-attack tradeoffs. Trace how parts produce
  usable outcomes, rather than copying numbers or treating “strong” as proof.
- Action grouping, favorites, status/effect scaling, nested component selection,
  unknown/disabled/empty categories, navigation stability, scientific notation,
  scrollbar and readable-stat iterations. Seek interaction lessons beyond skin.
- Skill disclosure and training incentives, tool/environment penalties, quest
  presentation and content-end pacing. Separate hidden discovery from missing
  explanation, and reference-specific balance from OOPS's accepted laws.
- Recovered crafting video `1512870099802001508`, combat sequences
  `1441349938872320030`, `1544701442781356052`, `1549105886847574129`,
  `1549358452445290597`, inventory clip `1367532073958637699`, tooltip and
  day/night examples. Identify transitions, grouping, information loss and what
  the discussion says was unfinished. Console-triggered special combat is not
  an ordinary player journey; developer explicitly names omitted enemy systems.

These leads are a starting shortlist. Follow other useful evidence discovered in
the catalog. Do not force every screenshot into a feature proposal.

## Acquisition route

**Do not use Discrub**, including its extension UI. The user explicitly rejected
it. Existing `/Users/weiwei/code/discord-reference-workbench` owns the offline
catalog, extraction, rendered-DOM browser helper and scoped media transport.
Reuse those capabilities; do not build a second exporter/downloader. Read its
README/capture contract when needed. No workbench repository edits are selected.

For additional private Discord context, use signed-in Chrome through cua_repl;
new chat must initialize its own browser handles/documentation. Guild
`622495527485046805`; channels current `1458887440398942300`, historical locked
thread `1212455523325050900`, plus YAFEIRPG mod thread `1464834877475000456` and
Development/contributions `1492621609918398585`. Developer @miktaew account ID
`1110590008584310805`. The last research tab was ephemeral; discover current tabs
rather than assuming it survives. Hand back any password/CAPTCHA prompt. No
credentials, cookies, tokens or hidden account state extraction. Collect serially,
respect actual retry/reset signals, and preserve progress. Direct browser MP4
navigation was blocked; the existing credential-free scoped media transport
worked. All 166 bytes are already local, so no video network retry is needed.

## Deliverables and completion evidence

Save detailed review evidence privately in a new dated/deep-review subdirectory;
do not overwrite baseline raw captures or the prior review ledger. Record image
IDs, readable-size inspections, video frame/time coverage, discussion anchors,
source/interpretation boundaries and excluded categories. Store useful full
context privately; public prose paraphrases and links.

Extend the existing public research owner with a substantive deeper-review round:
new F/P codes, exact source links and media timestamps/IDs, mechanism and player
value, tradeoffs/contradictions, existing-fork status, affected owners/rule codes,
and a concrete example. Classify ACCOUNT FOR NOW versus LATER with suggested
level/effort/done check where useful. ACT NOW is only a correction needed for
this research's accuracy, completed within research authority. Nothing becomes
accepted or implemented merely because it is useful.

Before finishing, verify every material finding traces to inspected media and
read discussion, compare against F1–F24/P1–P9 and live owners/source, check local
links and private ignore boundaries, and report actual review coverage and gaps.
Reuse existing hash/decode evidence for unchanged inputs; no blanket game suite
for a research-only change. Finish with the most useful additional ideas and a
link to the saved round. A new chat or saved plan alone is not review completion.
