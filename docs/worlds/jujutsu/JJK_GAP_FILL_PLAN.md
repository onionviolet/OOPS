# JJK gap fill plan, AU2 budget and pilot checkpoint (2026-11-03)

*Task checkpoint for the JJK gap session. Plans and measurements are proposals and evidence, not accepted decisions. Gap locators: [OCR gap register](JJK_OCR_GAP_REGISTER.md). Rules: [WA61-WA68 proposal](../../WORLD_ABSORPTION_RULES.md#source-gap-rules-wa61-wa68-proposal-2026-11-03).*

## 1. What the novels can and cannot fill

Two held VIZ English novels (LIBRARY_INDEX BC7, Z-Library EPUBs, library hashes `288e615869`, `9f91aea0c4`; 29.9k and 32.1k words by a tag-stripped count; text-extraction check only, not read). Both are official side stories by Ballad Kitaguni with Gege Akutami's supervision, set in the first-year summer and autumn. Medium label for every fact: **novel (official side story)**, never the manga's.

| Novel | Chapters (titles from the contents page) | Words | Gap it can reasonably fill |
|---|---|---|---|
| Summer of Ashes, Autumn of Dust | 1 Kyujitsu Kaisen, 2 Resurrection Doll, 3 Allegory in Darkness, 4 Ijichi at Work, 5 Illusory Trek to the Guardian Demon | 29.9k | Daily life, Nanami and Ijichi routines, Itadori and Nobara off-duty, ordinary cursed-spirit and city mechanics in prose. |
| Thorny Road at Dawn | 1 Nobara and Toge, 2 Even if I'm Not Here (Muta), 3 Asakusabashi Elegy, 4 Advancing in the Face of Fear, 5 At the End of the Sidewalk | 32.1k | Interior states, Nobara and Toge, Muta, school life, how techniques feel in use. |

They are **new stories, not retellings of manga pages**. They do not fill any register page A to C. They fill the other missing layer: choreography-free prose about cursed-energy use, daily life and thought, which the dialogue-only OCR lacks. A fact in them applies where the manga states the same mechanism, and a conflict is kept as two labelled facts (WA32), not resolved by medium rank. Reading plan if dispatched: 62k words is N = 6 shards of about 10,400 words cut at chapter boundaries (each novel chapter is 4.7k to 7.8k words, so a shard is one or two chapters; pair 4+5 of the second novel), plus 1 repair, at AU10 size. Not dispatched; the pilot is manga only.

## 2. AU2 budget (recorded before the pilot dispatch)

`AU1-AU15 | edition/hash + W: JJK OCR stage1-0.3, ch35-50 (16 chapters, 10,729 speech+caption words, 1,488 items), private shard file docs/research/manga-text/private/audits/jjk_pilot_shard_ch35-50.txt | goal: ledger-ready claim rows with locators, medium label, flagged-page handling; evidence-quality and cost per chapter and per row | prior read spans: none | coordinator chats planned: 1 | shard manifest + N: 1 (the pilot), whole-OCR plan is 15 shards of ~12k (178,137 words) not dispatched | reader model/effort: haiku, default effort, no lesser children | invocations: 1 + 0 repair reserved (1 repair allowed only for an omitted span) + 0 helpers | concurrent max: 1 | source exposure ceiling: 10,729 words (about 17k tokens) | reader responses max: 6 | context target/stop: <60k / 80k | usage start/ceiling: no live meter available to this session; per-response usage taken from the agent result | continuity index + artifact home: docs/research/manga-text/private/audits/jjk_pilot_ch35-50_notes.md (private, git-ignored) | next: pilot result below; no dispatch beyond the pilot without Weibao's word`

Chosen because it is the cleanest 16-chapter window under 12,000 words: 1 unread or doubtful page in 16 chapters (ch46 p16), high-risk item share 9.4% against 12.0% overall.

## 3. Pilot result

Haiku reader, one shard, ch35-50 (16 chapters, 10,729 words, 1,488 items). Output is private (`docs/research/manga-text/private/audits/jjk_pilot_ch35-50_notes.md`, git-ignored); this section holds measurements only.

| Measure | Result |
|---|---|
| Invocations | 1 reader (budget 1), no repair, no children |
| Reader usage (agent result, sum of responses, not quota) | 172,435 tokens, 8 tool calls, 235 s |
| Cost per chapter | about 10,800 tokens, 15 s |
| Cost per row | 70 rows, about 2,460 tokens per row |
| Cost per 1,000 source words | about 16,100 tokens |
| Rows by label | W-manga 68, I 0, U 2 |
| Rows resting on a doubtful OCR line | 11 of 70 (15.7%) |
| Unidentified speaker | about 50 of 70 rows (71%): the OCR has no speaker data |
| Garble or gap locators the reader named | 5 |
| Flagged page in range (ch46 p16) | no row touched it; reader named 5 other garble spots not in the register |
| Payload as loaded | about 45,000 tokens for 68 KB (OCR text tokenizes at about 4.2 tokens per word, not the 1.6 assumed), read in 4 chunks |

**Evidence quality.** Rows are source-faithful paraphrases with locators, but thin: rule coverage of the Goodwill Event (scoring, win and loss conditions, roster) is partial because dialogue states rules only in passing; domains, Black Flash and heavenly restriction have no visual shape. My check was limited to the two rows the reader flagged: R42 labelled an inferred speaker as W-manga (should be I) and R51 rests on a garbled clause without an `ocr?` flag. That is 2 label slips in 2 rows examined; the other 68 rows were not checked against the source, so no error rate is claimed. Output stays at its review state: read by a haiku agent, not checked against pages, not human-reviewed.

**Deviations and what to change (WA44, AU10).** The shard needed 4 loads against AU10's three. A word count underestimates tokens for OCR text: size shards by measured tokens, about 9,000 words or 40,000 tokens. Projecting the whole 178,137-word OCR layer at this rate gives about 20 shards and about 2.9 million reader tokens, a linear extrapolation from one shard and unverified. Not dispatched: dispatch beyond the pilot waits for Weibao. A cheaper first use is targeted: run `manga_text.py query` for the ledger's named mechanisms and read only the matching pages, since the older [claims pilot](../../research/manga-text/AUDIT_USES_2026-10-23.md) already ties ledger claims to locators.

**Reader needs the flagged list to carry speaker data.** Most row value is lost without a speaker; a vision pass on selected pages (not run, see section 4) or the novels' prose are the only routes to it.

## 4. Optional local vision pass: not run

Swap was 15.5 of 16 GB used at the check (`vm.swapusage`) and the vision model (`gemma4:31b-mlx`, 19 GB) would load into it. The local-model-lanes limits say not to push swap, so no `read-page` call was made. Reopen when swap is low (a quiet machine), on four pages: Register A ch60 p6, ch71 p12, ch75 p10 and Register C ch8 p15; the model-read output goes to the separate cache (`private/cache/llm.sqlite`), never over OCR rows (WA63).


## Content reconciliation B345: source layers, pilot limits and internal counts

All48 original lines were reviewed, including the two novel contents tables, budget, pilot measurements, source-quality limits and deferred local vision. Preserve extracted/held versus read: the62k-word novels were text-extraction checked, not read by that task. They are separate official-side-story media in the report, not retellings that reconstruct any exact missing manga page. Particular routines/mechanisms named as possible uses remain leads until the actual passage is read and its source/era reconciled; medium identity alone does not prove agreement.

The pilot's70 rows are agent returns, not70 checked source claims. Its own review examined two selected rows and found two label problems; that cannot establish an overall error rate, source fidelity of the other68 or factual completeness. Most rows lack speaker identity, and the one preflagged page did not account for the other five garble spots the reader found. Thus low register risk in the cleanest chosen window is not a representative accuracy sample, complete dialogue coverage or a reliable proxy for book-wide qualification. Unknown speakers and doubtful clauses remain explicit rather than defaulting to narrator truth.

Measured172435 reader tokens,8 tool calls,235seconds and four payload loads describe that invocation's reported usage, not current allowance or a new spend. The40k-token/9k-word shard suggestion and20-shard/2.9million extrapolation are unverified linear planning estimates, sensitive to OCR tokenization, repeated context and output. A future targeted query may be cheaper but still needs semantic passage review. The two novels' proposed six shards were not dispatched; this reconciliation authorizes none of that work.

The vision model/swap readings and not-run checkpoint are dated observations, not live memory pressure or installed model state. Vision and prose are useful routes to speaker context, but not the only possible routes: actual page inspection or another held primary edition can also supply evidence. A separate model-read cache preserves original OCR; it does not automatically qualify a claim. WA61–WA68 remain proposed under AD32, while existing WA8/WPR evidence discipline already applies. The rulebook backlink is repaired to its actual parent path with the exact old target retained. No corpus read, source qualification, local inference, acquisition, worker or runtime was performed here.
