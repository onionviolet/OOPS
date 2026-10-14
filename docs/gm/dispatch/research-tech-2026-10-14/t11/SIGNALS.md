# T11 signal contracts

2026-10-14. Original proposals only; no selected implementation. Extends SW1-SW7,
SE1-SE5 and SS3 in the [round 8 owner](../../../../TECHNOLOGY_AND_PROGRESSION.md#subtle-layers-round-8-2026-10-14).
[HOOKS](HOOKS.md) owns the source evidence; [EXAMPLES](EXAMPLES.md) shows
three bounded applications. H1/H2/H3/H6 in [T4 diffusion](../t4/DIFFUSION.md)
distinguish a recipient using a product, awareness, public credit and enough
means to copy it. No era upgrade, global S-curve or guaranteed inferior copy.

## N11. The fact and the observation

Smallest proposed driver: one primitive world fact such as
`ambient.soap.village.washpoint.use = true`, set by a real supplied recipient
using the product. It means that wash point uses soap, not that every home does.
Keep a causal command/receipt and observed time where the selected owner can
validate them. For later reversible states, use explicit values such as
`active`, `interrupted`, `retired` plus a transition revision. Do not infer
lasting adoption from crafting once, possessing a recipe or merely selling stock.

World truth, player observation and NPC belief are separate. Locally visible
signs can read qualified truth at the current place through held senses; remote
reports and attribution read actor evidence. Existing primitive facts and
observation/knowledge effects are N6, not a general belief or diffusion model.
“I heard…” preserves uncertainty. A witnessed installation does not establish
who invented it. Sealed truth never becomes a signal outside its discovery route.

## Signal matrix

Save impact below describes proposed runtime work: **none** means a pure view
of an existing saved cause, **new world fact** means additive keyed state plus
any explicitly received evidence, **migration** means a new identity/record
reader or changed meaning requiring a compatibility decision. All are unrun.

| Owner code | Where it attaches | Fact or evidence driving the text | Save impact | Reload and feed policy |
|---|---|---|---|---|
| SW1 | Village/Town square `getDescription`, or N8 atmosphere | Actual local supplied/operating consumer, current local time and senses | New world fact for new adoption; none if an existing supported consumer already owns it | Pure fixed text from fact/time; no render rolls or feed write. One bounded sentence. |
| SW2 | N7 repeatable NPC answer; optional stable overheard sentence near description | Witnessed use or an NPC's actually received report; miscredit needs a saved belief/evidence, not truth leakage | None for existing evidence; otherwise new world fact/evidence | Fixed speaker and claim for that revision. Avoid N2 random caller for required clues. Re-reading has no rewards/news. |
| SW3 | Real trader row's authored item description/tooltip, N5/N9 | Observable exposure plus capable maker, completed copy and actual vendor custody | New world fact for copy state; new stock/identity reader is migration when instance metadata is introduced | No copy spawned on render or shop open; freeze result at completion. No automatic quality penalty. No feed by default. |
| SW4 | Village description or Town farms local line | Named local children actually encountered the toy/song/word through a delivery/contact route | New world fact; none if the delivery owner already saves that local use | One stable play-scene variant, not a roster simulation. No claiming spread to unseen families. No feed. |
| SW5 | Town farms daytime text, Village wash point or night lane | Continued supported use and a specific changed habit, not merely installed equipment | New world fact for actual habit; none for cosmetic rendering of an existing supported routine | Fixed relevant time window. If work hours actually change, implement its consumer separately; text cannot silently change schedules. No feed. |
| SW6 | N3 actual quote explanation and local stock line | Existing effective saturation, actual stock/quality/margin; regional “ordinary” needs local supply/use evidence | None for current-quote explanation; new world fact for sustained local availability | Same inputs produce same explanation. Historic “cheaper than last visit” needs a retained comparable quote; avoid it in first slice. No price-tick news. |
| SW7 | Shop/market description and repeatable reminiscence | Actual closure/repurposing of one supported local service and continuing alternatives | New world fact; migration if existing access/service semantics change | Saved status selects a stable line. No claim that every old method disappeared. Service access changes belong to their own owner. No feed unless player receives a dated consequence. |
| SE1 | N3 price tooltip or vendor explanation | Actual quote plus an observed comparable baseline; project cause only if there is separate testimony/evidence | None for explaining current saturation/margin; new world fact for explicit authored demand, migration for new pricing semantics | Native modifier cannot create above-base surges. A demand premium must join both quote calculation and acceptance fingerprint. Never add random markups or infer a secret plan from price alone. No feed. |
| SE2 | N9 post-publication observer receipt and N7 answer | Committed bought item keys/count/vendor/place/time, with an observer's actual access | New world fact/evidence; migration for a general durable purchase-observer record | Basket edits/cancel/failed save cause nothing. Record one attributed observation per committed trade cause; its interpretation can be wrong. No routine trade news. |
| SE3 | N7 explicit conversation response | Who asked, what purchases they could see, actor's chosen story and supported knowledge | New world fact/evidence; migration if a general belief/session shape is added | Freeze the chosen response/result at command completion. Do not reroll credibility by opening dialogue. No forced watcher or punishment for ordinary purchases. Feed only an actual actionable response, if wanted. |
| SE4 | Local vendor explanation, NPC answer or received dated report | Real unavailable/reserved lot, or an attributed rumor based on a witnessed shortage | None for current stock; new world fact/evidence for a rumor before a later shipment/price transition | Empty random stock alone does not prove regional shortage. Persist report wording/time; replacing a report uses a newer cause. No repeating it on every stock refresh. |
| SE5 | N5 item tooltip and explicit inspection/received report | Exact marked item/lot, maker receipt and actual distant transfer route; fitting means recognize it | None for inspecting an existing supported stamp; migration for arbitrary item stamps; new world fact for distant sighting | Preserve exact key through custody/save/import. Similar style or a forged mark gives resemblance/claim, not certified attribution. No automatic far-away news. |
| SS3 | Shack/mill exterior description or a neighbor's N7 answer | Observed light/smell/noise from actual operating work, during a supported visit/time window | None for immediate observable work; new world fact/evidence for later remembered suspicion | Show “light under the door,” not hidden project identity. No new knock/event on render or reload. A consequential visit needs an existing event owner and saved occurrence; default is passive text without feed. |

## N12. Deterministic selection

First slice uses one authored variant per relevant fact state. If several qualify,
use a fixed authored order: current local operation, actual changed habit, received
local report, weather fallback. A display budget is not a lifetime anti-abuse cap.
Select from saved revision and place, never `Math.random`, wall-clock time or a
moving RNG cursor during rendering. Same save, place, actor means, settings and
game-time window gives the same text. Different day/night text is an intentional
context change. Random authoring can later freeze `variantId` at a real transition;
pack upgrades need retained text/version or an explicit compatibility decision.

For N8, avoid a bright-lamp line accidentally replacing every rain/roof sentence;
append one clause or establish an authored fallback order. Only current local
operations get “still lit”; when support ends, use the saved interrupted state
or omit the line. No separate atmosphere clock, offline diffusion or NPC ticker.

## N13. Save decisions

Pure text on already saved native outcomes adds no field. New adoption uses
absent-is-unknown defaults, with legacy descriptions until a qualifying cause is
earned. That is an additive compatibility proposal, not a tested migration.
If a selected contract mandates structured rows, revokes old access, changes
prices or stamps ordinary inventory keys, specify a migration/version policy.
Do not backfill player achievement, maker, regional adoption or price history.

The generic domain supports only primitives, so several small scoped keys can
cover one slice; broader adoption/evidence belongs to T8's selected future owner.
Keep causal evidence outside bounded generic history if it must remain valid
after 100 further actions. World facts do not alone prove payment, custody,
recipient use, or publication. Publish cause, facts, inventory consequences and
received evidence together through the existing save owner. A display getter
must not repair, initialize, observe or mutate a save.

## N14. Quiet feed behavior

Default: descriptions, local atmosphere, repeatable dialogue and item/price
tooltips produce zero feed writes. Keep consequential clues reachable after
their initial display. No unread badge, lead or animation for passive texture.
Effects off keeps N8 hidden; a chosen meaningful clue remains in explicit
description/dialogue rather than depending on that cosmetic setting.

If a selected transition deserves news, render from a received saved record
with `id = ambient:<world>:<place>:<product>:<revision>` and its observed time,
not `state.clock` at each repaint. Aggregate related local signs into one authored
record per transition. Stable IDs stop duplicate rows, not repeated publication;
the command owner must be idempotent. Restoring a save projects the same row
without a fresh log, reward or unread notification. Keep it in collapsed news,
not available leads, unless there is a real response. A later interruption or
new adoption is a new cause, not blocked by a fixed once-ever limit.

N4's signature caching and eight-row view are useful rendering behavior. They
are not a priority/folding engine. Avoid a new feed scheduler for the first slice.

## N15. Market wording must describe its evidence

Use “The buyer offers less for this lot” from a current saturated quote, or
“The trader says a workshop ordered the remaining stock” from a received
account. Use “Several causes could explain the price” if causality is unknown.
Do not assert “a rival is building a lamp” from a markup caused by reputation.
Remote prices stay rumor until the character has a fitting record/contact means.
News is dated; a old quote is not live remote price access. Product price,
current abundance and regional adoption remain distinct.
