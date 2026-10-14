# B6 validity: law, cause and usable function

Status: PROPOSAL, 2026-10-14. [GRAMMAR](GRAMMAR.md) supplies parts. [SAVE_SHAPE](SAVE_SHAPE.md) supplies persistence. Hard legality precedes rarity weighting; inability to qualify a canon rule is unknown evidence, not proof that the source forbids it.

## B6-V1: ordered admission gates

| Gate | Pass condition | Rejection / useful alternative |
|---|---|---|
| V01 world and continuity | World instance, era, original/source profile and law revisions exist; chosen AU explicitly lists changed laws. P9 canon reservation and source labels retained. | No canon-exclusive faculty from a generic genre table. Qualify source, use an original profile, or offer ordinary work. |
| V02 substrate and input | Actual body/organ/soul/device/pact can support the named function; medium and fuel are locally available or carried in a specified reserve. | No mana hearing through ordinary ears in a no-magic world. Actual instrument/help remains possible. |
| V03 trigger | Separate possession, awakening, activation and suppression; known clock/condition; sustained transitions and interruption specified. | Missing lunar calendar is unsupported, not a new moon. Continuous faculty need not acquire an artificial cooldown. |
| V04 executable function | Registered handler and actual action/target/output owner; applicable units and body/fuel/control prerequisites; positive case and ordinary comparison. | A `grants: []` label with no dedicated consumer fails playable admission. Keep as a proposal or purely descriptive trait, not an implemented advantage. |
| V05 costs and ownership | Exact input owner and acquisition/use timing; none is valid. Storage/conversion conserves actual inputs unless the world really supplies an exception. | Never hide negative values in positive capability grants or mint fuel from rarity. |
| V06 evidence | Discovery supplies only reachable observed/testimony/test information with basis and uncertainty; diagnostic knowledge is separate from true card. | A failed or narrow test cannot delete the card or reveal all ancestry. |
| V07 transmission | Eligible real parent/donor/template/pact, transfer timing, retained domains and donor consequences. Biological carrier, clan membership and office are distinct. | Somatic implant does not inherit itself. An adoption can transmit property/instruction while a specific authorized rite grants its own keyed access. |
| V08 combinations | Local composition/precedence is explicit; exact source instance links; body and procedure compatibility; a fusion is an actual operation. | No duplicate body-source rewards, or universal conflict tax. Unsupported pairing remains inert until qualified. |
| V09 identity and naming | Unique stable card/body references; semantic names from local grammar; qualified authored reservations and collision handling. | A reserved name may block naming/admission, never secretly rewrite lineage truth. |
| V10 durability and projection | Cause/outcome/revisions/knowledge stored atomically; legacy absence preserved; existing card restored without draws; all views project observer knowledge. | Failed write leaves prior state; no fallback reroll, exposed hidden IDs, counts or raw diagnostic dump. |

## B6-V2: EV6 world crossing

Generation is checked against its origin law. Execution is independently checked against the destination's actual laws. An ancestry record survives suppression; learned method and tissue are not silently erased.

| Case | Default + Dial | In-world reason / cost and saved consequence |
|---|---|---|
| Ordinary structure crosses | Retain anatomy and learned coordination; gravity/gear fit can change its utility. Dial: local acclimation or genuine transformation. | New loads affect an actual climb/lift consumer; record changed conditions, not a rerolled physique. |
| Qi/mana faculty lacks ambient input | Preserve card dormant for unsupported operations. Dial: use carried compatible reserve, a real converter, patron support or an explicit law exception. | Deplete actual reserve if usable; ambient qi prohibition need not forbid contained fuel, so the law must distinguish them. |
| World rejects that energy or soul operation | Suppress affected function; retain source/knowledge. Dial: authored adapter or exceptional source alters compatibility. | If law forbids even contained qi, carried reserves cannot bypass it without that exception. No free energy translation. |
| Pact has limited jurisdiction | Record access unavailable outside scope. Dial: renegotiate, establish a supported relay or inherit a genuinely portable pact. | Actual issuer/connection and terms determine continuation; ancestry alone does not widen reach. |
| Implant loses support | Passive anatomy can remain; powered operation waits for compatible charge/calibration. Dial: retrofit/service. | Saved device ID, installed body and charge retained. Removal moves the same item; no new implant appears in heirs. |
| World changes body | Use explicit destination transformation policy, informed commitment where applicable and compatibility migration. Dial: preserve, adapt, replace or return. | Freeze before/after body/source links and retained knowledge. Never use a failed validity check as permission to destroy a body. |

Changing law support may pause a pending action under its declared terms. It does not replace its result with a newly rolled card. Reentry restores support only if actual conditions permit it; it cannot refill spent fuel. Destination law truth can operate before its cause is known, while text and NPC responses still need evidence.

## B6-V3: three sample world manifests

These are synthetic original test profiles, not selected destinations or modifications to the real frontier.

| Manifest | Authored fixture laws | Available proposed action handlers | Excluded examples |
|---|---|---|---|
| C: Reed Valley school (`b6.fixture.valley`) | Local qi exists. Channels store/convert only their qualified aspect. Tempered tissue is bodily. Line-bound seals recognize the actual inherited mark. Ritual adoption grants a distinct explicit key. No inherent skill-memory transfer. | refining heat, wet-site flow inspection, physical bracing, deliberate qi wound repair, key trial | Copper resonance is not an ordinary mana faculty; an archive spell or unrestricted ancestor memory is not generated. |
| W: Lantern Archive (`b6.fixture.archive`) | Local mana couples to authored enchantment carriers. Learned procedure is separate. A particular inherited mark can authenticate a keyed lock. A voluntary house rite can designate a non-biological keeper. Ordinary smell remains ordinary smell. | enchantment inspection, ingredient comparison, mana buffering for a learned ward, keyed archive access, remote ink cue through an actual tether | No cultivation realm grant, arbitrary spell knowledge, famous canon family, perfect ancestry test or untethered world-wide kin sense. |
| H: home-frontier overlay (`b6.fixture.home`) | Ordinary human structures and learned practice; no qi/mana/soul faculty, magical hereditary keys or installed cybernetics in this fixture. Family-associated variation is not reliable single-gene prediction. | existing frontier preparation/carry/hand-control seams plus proposed knot, fitting and sensory work consumers | Supernatural BP functions; magical bloodline names; inherited calluses; healing by qi. |

C/W handlers are specified functions, not existing playable APIs. H uses live seams where noted, but no generated H card is registered or exercised. Generic tech/superpower parts in GRAMMAR require their own qualified manifest and consumer selection before generation. Canon packs bind source snapshots and reservations from P9/P7; original sample laws cannot be applied to Harry Potter, Cradle or Mother of Learning without an explicit original/AU contract.

## B6-V4: hook contract and concrete consumer audit

Every function handler must supply `eligible(actualContext)`, pure `preview(KnownContext)`, `commit(frozenInputs)`, `resolve(orderedEffects)`, `project(observer)`, `interrupt(policy)`, and an action-level stacking rule. These are semantic requirements, not claimed exports.

| Hook | Existing source seam or missing adapter | Required change in an actual action |
|---|---|---|
| `preparation` | `src/body_progression.js:16`; `src/expedition_content.js:64-70` supplies fixed traits. | A qualifying preparation task reads the card's supported contribution, not the generated name. Reaudit the exact target task before binding. |
| `hand_control` | `src/body_progression.js:17,46-49`; `src/expedition_content.js:89-96` already subtracts one packing minute for supported hand control and adds time for tender hands. | Preview/commit use the same supported value and freeze duration. A generated card must not accelerate an already committed job. |
| `carry` | `src/body_progression.js:17` grants `frontier.carry`. | A selected carry/lift consumer must explicitly query it; the grant alone is not changed native weightlifting or combat. |
| `assay`, `sense`, `key` | `src/simulation_effects.js:281-284` owns knowledge; capability sources permit conditional grants but provide no universal sensory/lock resolver. | Selected inspect/lock task creates bounded evidence or transfers actual access using specific means. No name-based permission. |
| `fuel/refine/repair` | Existing source and condition effects at `src/simulation_effects.js:302-333`; no generic G47 reservoir physiology shown. | Add qualified resource conversion, located repair and interruption consumers before admitting these tuples. Condition removal alone is not regrowing an organ. |
| `transmit` | Current sources store acquisition, not meiosis or a body-template inheritance graph. | A selected birth/graft/designation transaction creates the recipient's true card once, distinguishes potential from expression, and retains donor/parent references. B3 owns prestige joining. |

Existing capability `max`/`sum` does not define whole-body physics. Costs and located injuries need real separate handlers. Use stable archetype definitions for a first slice. Arbitrary generated executable code, eval and unvalidated effect trees are excluded; new functions require named reviewed code.

## B6-V5: static fixture checks and future tests

The SAMPLES check is a documentation-level review: all 20 tuples have the seven required parts, law-fit explanation, real-action target and a valid local name; reproduction checks hash/order/spelling. This proves fixture consistency under proposed manifests, not source truth or gameplay.

Future selected runtime gates: same root/cause/revision yields identical cards; different cause does not alter earlier cards; previews and failed admission/publication leave draws and inputs untouched; non-body streams unaffected; duplicate settlement returns same source instance; world suppression/restoration preserves source but never fuel refill; incomplete diagnosis produces incomplete knowledge; graft injury affects the correct function; inheritance does not grant mastery; revised definitions preserve committed results; old absent save unchanged. Then rebuild and fresh-origin play at 1366x768 and one wider desktop, obtain and use the function naturally, save/reload, Export and literal-file Import. All runtime gates remain NOT RUN. Mobile, arbitrary cross-world physics and full population genetics remain deferred.
