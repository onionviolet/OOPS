# P15 optional language-model text

2026-10-14. **PROPOSAL ONLY.** This is an option comparison and admission design, not an installed model, service selection, permission to transmit saves, or a runtime implementation. The full game should remain playable offline with authored/grammar text. Models can also be used at dev time, where review happens before content reaches play.

## L1: options remain composable

| Option | Value | Costs and limitations | Proposed admission |
|---|---|---|---|
| Authored + deterministic grammar | Fast, offline, locally reproducible; exact reviewed terms | Finite expressive coverage and authoring effort | Baseline in [RUNTIME_TEXT](RUNTIME_TEXT.md). No model dependency. |
| Dev-time agent batches | Many draft cards, people briefs and expression variants, followed by human and tool review | Review time, source drift, correlated errors, repetitive prose; generation spend occurs during development | [AUTHORING_PIPELINE](AUTHORING_PIPELINE.md). Ship only reviewed static artifacts. |
| Optional local runtime model | Private local processing and flexible wording without per-request service billing | Model download, RAM/storage, CPU/GPU/battery use, latency, device-dependent behavior; local logs and visible output can still leak | Explicit optional local adapter. Confirm supported model/runtime/device and licence in a later measured experiment. |
| Optional hosted runtime model | Flexible wording without running model weights on the player's device | Network and service dependence, usage charges, latency, rate limits, changing models and data handling | Explicit external-text choice plus pack permission; minimized safe frames only. No personal save upload. |
| Prefetched/cached optional prose | Read ahead for already admitted safe content and reuse identical results | Extra storage and possible wasted requests; stale context must not attach to another occurrence | Only after the underlying occurrence exists. Save exact accepted text and input identity. No speculative secret future. |
| Runtime model as constrained intent proposer | Free-text questions can suggest an existing topic/action | Misclassification and prompt injection can select a wrong intent | Present supported matches/terms for player selection. Deterministic host decides execution. |
| Experimental generative scene author | Broader, novel conversations or scene drafts during play | Much larger semantic, canon, consistency and disclosure risk than paraphrase | Optional quarantined draft mode with explicit review/admission. Not required for ordinary play or promoted as reliable canon. |

The first recommendation is dev-time generation plus offline runtime text. It delivers created content without adding a service to every play session. Local/hosted models and free-text interaction remain reachable experiments; this recommendation is not a forced either/or or a permanent ban on richer generation.

## L2: measurable operating tradeoffs

Do not attach invented dollar amounts or promises about a particular model's quality. For a later hosted trial, record the exact provider/model revision, dated official rates, retention policy and actual usage. Proposed estimate:

**spend = input tokens × input rate + output tokens × output rate + any service-specific extras**, using consistent token units. Multiply by expected turns and cache-miss/retry rate; log measured totals. Review time and latency are separate costs. A local trial measures load time, peak memory, warm/cold turn latency, energy impact and fallback rate on the target laptop. A download being free does not mean operation is costless.

Use player-chosen spend/request limits, timeout, context/output limits and off/local/hosted controls. Hitting an operating budget switches to complete reviewed baseline prose while play continues. It does not close the NPC or consume a fictional “once” allowance. Prefer one bounded request per admitted turn, no retry spiral, and no request at all during rendering/hover/previews. A retry, if deliberately supported, retains the same request ID/input snapshot and must never replace already displayed accepted speech silently.

Server-side keys, a local proxy, or a personal bring-your-own-key setup need a later concrete deployment choice. A distributed browser bundle cannot hide an embedded provider secret. Do not add keys to saves, exports, repo, URLs, screenshots or diagnostic logs. This docs task made no model request and inspected no credentials. Model/vendor choice and billing implementation remain open, with live official documentation required when selected.

## L3: a model is an untrusted expression candidate

Input is a minimal safe semantic frame from RUNTIME_TEXT T2, not the expansion state, raw dossier, private pack or secret file. Include approved display names/aliases, allowed speech act, necessary known claims, language/register, length target and a baseline line. Withhold seeds, hidden traits, private actor plans, reservation reasons, raw notes, future canon and undiscovered choices. Player notes, imported content and NPC utterances remain untrusted data even if they contain instructions addressed to the model.

Proposed response: candidate text plus the existing frame ID. Optional claimed support refs are diagnostics, not proof. The adapter accepts no effects, commands, tools, file paths, URLs, new facts or names, altered costs, rewards, choices, timing, source claims or relationship writes. Render plain text through the existing safe text-node pattern, never HTML or generated executable markup. No model tool access is needed for paraphrase.

Validation has two distinct layers. Mechanical checks can bound length, reject unknown IDs/markup, protect exact structured terms and ensure the response matches the request. A semantic check must ask whether the candidate changes certainty, negation, speaker, tense, cause, consent, obligation or outcome. Keeping all names/numbers is insufficient: “the kit did not arrive” and “the kit arrived” use the same named facts. Another model's endorsement is an uncertain review signal, not a guarantee.

For high-consequence content, prefer approved phrase alternatives or a tightly controlled grammar. Critical clue/discovery wording, binding promises, irreversible choices and source-sensitive revelations remain authored/reviewed. Allow freer optional wording for low-stakes texture with a known complete fallback, and disclose the optional prose mode in settings. A rejected candidate is never shown as NPC speech. Runtime fallback uses the baseline without requiring the player to resolve a technical error; a local diagnostic may record an opaque rejection code, with no hidden text.

Fictional threats, conflict, dark worlds and unreliable narrators remain possible through the selected world's rules. The operational safety concern here is uncontrolled execution, disclosure, deception about what happened and unwanted data transmission. A model's moderation/refusal or outage must not make the game unplayable; route to authored text with the same supported choices. Player comfort controls can select intensity and accessibility without rewriting world outcomes.

## L4: sealed secrets and canon prose

The strongest protection is excluding secret truth from the model's input and excluding model text from sensitive discovery scenes. Prompt instructions and keyword scans alone cannot guarantee secrecy. A model may already know a public franchise twist, infer an undisclosed truth, produce an alias, or invent a clue without being given the answer. A local model removes external transmission but can still spoil the UI. A hosted model adds a transmission boundary. Neither solves in-world knowledge on its own.

Use synthetic sealed-ID fixtures for public tests, and private ID-only review results for real secret routes. Candidate logs, debug overlays, alternate-text, errors, captions and cached requests need the same visibility boundary. If a turn touches a sealed route or inference-sensitive private identity, default to reviewed text/grammar. A future qualified revelation may use a deterministic authored line after the owning discovery action succeeds. Reports say only ID, route and status.

Canon-first does not mean pasting a book into a model. Direct adaptation packs follow [PROJECT Book worlds](../../../../../PROJECT.md): private, outside git and the public bundle, original public runtime names. An external-text flag on a pack is necessary but insufficient on its own: the player's selected external processing mode, minimal permitted content and applicable data terms must also be explicit. Do not send private reading notes, raw chapter prose or undiscovered canon simply to obtain “better voice.” Development agents summarize selected claims with locators and evidence labels; emitted prose is original.

Retain creator/work/source edition and pack provenance in author records. Do not present generated dialogue as a quotation, lost chapter, author-approved continuation or newly authenticated canon. Named-character briefs should describe supported behavior and scene purpose in our words. Contradictory canon/adaptation evidence remains with P13/P9/P10, not resolved by whichever completion sounds convincing. No new canon fact is certified by this document.

## L5: persistence, async races and offline behavior

Do not assume a model seed or low-temperature setting reproduces output across requests, machines or model revisions. Proposed replay authority is the accepted frozen text plus input/content identity. Save baseline and optional accepted rendition, semantic-frame hash, exact adapter/model revision if known, locale, request ID, target turn revision and acceptance policy revision. Save only necessary metadata; no prompt dump or raw private context in public artifacts.

Baseline text commits with the actual turn first. An optional asynchronous rendition may attach as a cosmetic update only if the same world/instance/session/turn and content revision are still current, the player has not already received a conflicting rendition, and the adapter's durable write succeeds. Otherwise discard the stale response. A response arriving after branch switch, reset, cancellation or reload cannot attach to the next speaker. The deterministic core never waits for a network result to settle stock, knowledge or time.

For simplest first behavior, freeze whichever reviewed rendition is present at first presentation and retain it. Later enrichment can be an explicit separate “alternate prose” view, clearly labelled, without rewriting the remembered utterance. Save/reload/import retain the chosen line; no automatic regeneration after cache loss. A pending optional request in an imported/offline save falls back to baseline and does not call a service automatically. Missing model/pack availability follows the owning save policy; no paid commitment is silently deleted to make prose load.

A new game with the same seed can reproduce baseline grammar under pinned content. It need not reproduce hosted paraphrases unless those accepted renditions are included in the replay artifact. These are two different promises. A fictional loop reset can follow its selected retention law; loader restoration is never that reset.

## L6: bounded evaluation before runtime adoption

| Code | Future trial | Pass evidence / limit |
|---|---|---|
| G1 | Same semantic frames through baseline/local/hosted candidates, with source-neutral fixtures | Blind rating of clarity, voice fit and contradiction; report changed terms, hallucinations and rejection counts, not only attractive examples. |
| G2 | Adversarial player note, fake command tag, hidden alias and synthetic sealed-ID prompts | No execution or prohibited context transmission; sensitive turns use baseline. Leakage scan is evidence for the corpus, not universal proof. |
| G3 | Timeout, offline, malformed reply, budget limit and unavailable model | Every route retains complete text, exact choices and normal play. Track cold/warm latency and actual operating cost. |
| G4 | Late result after leave/reset/branch switch; failed optional write; reload/import | Same received speech/terms and next gameplay draw; stale output discarded; no automatic new request on restore. |
| G5 | Rebuilt target laptop surfaces plus human review | 1366x768 and 1600x1000 retain readable terms/actions; Weibao accepts the expressive improvement and optional data/cost choice. Mobile deferred. |

All trials are NOT RUN. A runtime service or model dependency is unnecessary to complete the first four ranked P15 slices. Dev-time draft generation can be selected independently.
