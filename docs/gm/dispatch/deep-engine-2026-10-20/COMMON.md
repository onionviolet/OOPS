# Deep engine implementation: common handoff

Current continuation,2026-10-21: Weibao explicitly renewed the stopped P4 scope
with "Finish P4, verify it in game, and reconcile the stale coverage records
with what's actually done." [Current P4 status](P4_STATUS.md) and
[report](P4_REPORT.md) supersede the original dispatch's stopped implementation
state and31% allowance boundary for this new bounded solo run. No extra agent,
commit/push, personal-save access or unrelated runtime scope is selected.
The original dispatch contract below remains historical provenance.

## Authority and outcome

Weibao, 2026-10-20, after the five ranked engine proposals: "Connect accordingly, send new chats to address each, maybe one for each". This selects five bounded implementation tasks corresponding to P1–P5, with the connected source owners and proof cases below. The earlier ENGINE_EXPANSION planning-only paragraphs retain their historical status; this later instruction selects these pilots, not every future engine proposal. Implementation and checks are authorized. Commit/push/publish, unrelated cleanup, personal saves and a whole-engine rewrite are outside this dispatch. Earlier gear-chat push permission is specific to that chat's work and is not standing permission here.

Start at docs/RULES_INDEX.md, PROJECT.md's summary, relevant docs/USER_VISION.md direction and AGENTS.md. Apply AR1–AR16, AD1/5–7/15–18/22/32–38 and your domain's rules. Runtime seam owner: docs/research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md. Proposal owner: docs/ENGINE_EXPANSION.md#deep-engine-support-for-future-design-2026-10-20. Read your Pn.md and relevant source/tests, not every unrelated palette or audit. Preserve sealed truths in chat and reports; use synthetic content for explanations.

## Finite execution and dependency order

One coordinating chat (the sender) creates exactly five visible project chats, no helper/reader/reviewer/successor spawns from these chats. Each chat uses its configured default model; no model override was requested. Five chat invocations are explicitly budgeted for the user's five outcomes. At most two lanes execute implementation concurrently: wave A P1 and P3; wave B P2 and P5 after both A chats complete/release; wave C P4 after both B chats complete/release. Waiting chats may perform one bounded relevant read/preparation pass and write their own status, then use wait_threads for dependency completion, rather than repeatedly scanning code or doing speculative work. Resolve exact chat IDs from CHECKPOINT.md/INPUT_STATE.json after dispatch is populated. A dependency completion with failed gates is a handoff to inspect, not permission to copy broken inputs. Proceed with unaffected work and name any narrow unresolved prerequisite.

AU1–AU15: shared starting included-use meter 26%; conservative stop boundary 31% of the reported weekly window, including shared-account movement. No API billing, paid-credit fallback or allowance expansion. Check before expensive broad gates and before expanding scope; at the ceiling checkpoint artifacts and remaining gates. No replacements/repair agents beyond these five. No external source acquisition. Existing palette chat has a separate, lower local ceiling and remains authoritative for its own work. Do not keep an unchanged wait state generating progress prose. Use compact wait_threads snapshots and bounded event waits of at most 60 seconds; avoid repeated read_thread history loads.

## Ownership and integration

All chats use the saved local yet-another-idle-rpg project, shared checkout/branch. No managed worktree was requested. Preserve all dirty/concurrent work. INPUT_STATE.json records a dispatch snapshot, not authority to overwrite later versions. Each lane owns its Pn.md execution receipt, Pn_STATUS.md and Pn_EVIDENCE/ directory, plus its named source/test area. The coordinator alone edits CHECKPOINT.md, COMMON.md, INPUT_STATE.json and the shared routing docs during dispatch. Re-read files from disk before hunks. A status receipt names exact source reservations, touched hashes, check states and explicit release=true/false. Release=true means another lane may edit those source paths; it does not mean acceptance passed.

P2 owns any necessary main.js/save_files.js/display.js composition hunk for this group, after the active palette owner's reservations are released. Other lanes avoid these hot files; if unavoidable, record a concrete narrow patch and evidence in their own packet for P2 to integrate. P2 checks P1/P3 handoffs and integrates any such required composition hunks, then owns the combined wave-A/B integration receipt. P4 verifies its final native journey against those integrated inputs. Keep each lane's original functional owner up to date when it finishes, with hunk-only append and preservation check; never replace a shared file from an old buffer. Implementation progress lives in lane receipts, not competing product specs.

Existing live owner boundaries to recover before editing:

- Palette chat 01a15bf9-877b-7d81-b04e-663943450a98 is active at dispatch. docs/gm/dispatch/palette-completion-2026-10-20/CHECKPOINT.md owns its source writes and generated-output handling. A 2026-10-20 snapshot reports sound/scene/crafting integration repairs in progress. Do not infer idle from an old checkpoint.
- Interaction chat 01a15bd7-90cd-7c93-9b53-65bc5796206a has a completed technical receipt in docs/gm/dispatch/upstream-interaction-system-2026-10-20/CHECKPOINT.md, with browser gaps retained. Recover actual current reservations before overlapping main/display/crafting/combat UI sources.
- Light/time chat 01a15be7-2e00-7a13-a826-7eb4f9ad4771 explicitly releases its files in docs/gm/dispatch/reference-engine-boundaries-2026-10-20/CHECKPOINT.md. Preserve its interval-reader fixes and passing candidate evidence; do not revive the old expiry bug as an unverified claim.
- Gear chat 01a15af8-4b14-75a2-8f94-4c550c13710a reports committed/pushed codex/gear-shared-example at 2ddfdbc26 with shared person/enemy equipment stats, tests and browser evidence. Root checkout does not thereby contain those commits. Its Direwolf browser gate and alternate battle readers remained open. Reconcile local branch/source evidence before carrying changes. Do not whole-merge generated outputs or unrelated hunks.
- Specimen chat 01a15be8-8d0a-7e92-8e20-3bd31eeca426 and docs/gm/dispatch/specimen-processing-2026-10-20/CHECKPOINT.md own harvest/native-resources state. This group does not take those paths.

This dispatch does not authorize messaging older chats. Read their state/checkpoints when needed. The new five chats coordinate through linked on-disk receipts and dependency waits; no messaging is required. If a necessary writer is still active, prepare the exact integration hunk and continue disjoint work, then wait for actual release rather than overwrite it. Do not end with a vague approval request for already authorized reversible work.

## Verification and evidence

Choose existing focused checks and meaningful failure scenarios before editing (AD36). Record current HEAD plus relevant dirty hashes; a parent HEAD alone is insufficient. Structural refactors preserve behavior separately from selected fixes (AR9). Reuse unchanged input-qualified evidence, especially current light/time and gear receipts. No duplicate equivalent suite while another authoritative run is in progress.

Build/test in an isolated copied candidate containing relevant dirty source, docs imported at runtime and complete fixtures, with independent generated outputs. Do not rebuild shared dist/index while palette or another lane owns them. Each runtime lane retains npm run build, npm test, npm run check:arch, npm run check:rules and its changed native journey; add rule-behavior only for rule changes. Focused regressions must protect meaningful invariants. Native claims require fresh rebuilt browser at 1920×1080, current laptop and 14/21px checks where presentation changes; mobile stays deferred. Persistence changes require actual Save/reload/Export/literal Import. Use disposable fixture origins, never personal saves. Keep source/test/build/browser/persistence/human acceptance separate. No technical check closes Weibao's play/visual judgment.

Return changed paths, input/check evidence, remaining native/human gates, exact source release state, and the next lane's usable API/fixture/receipt. Keep the initial outcome finite; do not design a universal engine in the name of future flexibility.


## Reported adjacent FF3 household boundary, 2026-10-20

Coordination notice received from chat 01a15b46-9a1e-7381-9de8-c2b55dadcbce: light/time chat 01a15be7-2e00-7a13-a826-7eb4f9ad4771 has reportedly received a separate user-authorized FF3 household continuation, for optional finite stocked firewood and chosen auto-supply through existing household/native transactions. This notice is an external ownership report, not additional P1–P5 authority or evidence that FF3 is implemented. At receipt inspection, `docs/gm/dispatch/reference-engine-boundaries-2026-10-20/FF3_STATUS.md` was not yet present; recover its actual reservations/release before overlapping work.

P1–P5 do not take household-model/state/helper paths or add an FF3 dependency. FF3 is reported to avoid lamp/tools/reveal sources, so P2/P4 retain their existing scopes and release sequence. Palette chat 01a15bf9-877b-7d81-b04e-663943450a98 remains the owner of its scene/styles/household-UI work. Any FF3 main/host composition proposal waits for the existing palette/P2 writer's actual release; the notice grants no parallel main.js writer. No message to another chat is required or authorized by this notice alone.
