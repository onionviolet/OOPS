# Ranked implementation proposals

All P entries are **inferred**, original YAIR options derived from the cited
findings. Rank orders the proposed proofs within this dossier, not games.
None is an accepted decision or permission to build. Each world chooses its
own rules. Native defeat remains unconsciousness/recovery under PROJECT.md;
any true-death or revival prototype needs explicit selection for an opt-in
world. Do not carry Planescape names, dialogue or rewards into public content.

## Current YAIR connection, source-read only

**Seen in data or code:** `src/life_record.js` supplies bounded biography
milestones, including memory, rumor and legacy, and explicitly disclaims
reward/quest authority. `src/chronicle.js::relationshipChange` stores axes,
ties and bounded relationship memories; createChronicle has separate
knowledge and life state. `src/causal_story_host.js::commitCausalStoryCommand`
checks sequence/token/current eligibility and records caused outcomes;
its presentation path can show observer-specific accounts.
`src/npc_lives.js` provides a bounded Village life schedule, not arbitrary
incarnation minds. These are current working-tree reads, not runtime tests.
The map below proposes extensions through those owners rather than a second
quest, inventory, reward or timing engine. Current hashes are in INTAKE.json.

| Rank / ID | Proposed proof | Evidence | Existing system / north-star connection |
|---|---|---|---|
| 1 / P1 | One former-life record, two interpretations | F3a/F3d/F3e/F13 | Notebook, chronicle knowledge, life_record; Same player, related character; Fragments, legends, enemies and obscure routes |
| 2 / P2 | One witness remembers an obligation | F3g/F3h/F6a | chronicle relationships and causal-story receipts; Same player, related character |
| 3 / P3 | One memory changes a real choice | F3h/F5 | inventory, Notebook, causal story; Fragments, legends, enemies and obscure routes |
| 4 / P4 | Identity changes through authored acts | F7a/F7b/F7c | relationship axes, event history, dialogue; Same player, related character |
| 5 / P5 | A return that preserves consequences | F1/F2/F6 | world-local life handling, native action/command path, event feed; Who or what you start as |
| 6 / P6 | A hostile prior self offers a bargain | F4 | actor/knowledge/source state and center dialogue; Same player, related character; Fragments |
| 7 / P7 | A body property has ordinary work uses | F1c/F1d/F6a | jobs, custody, NPC accounts, body/source constraints; Who or what you start as |
| 8 / P8 | An enemy switches from killing to containment | F2c/F6d | causal-story capture/severance and observer knowledge; Fragments, legends, enemies and obscure routes |

### P1 Record with provenance

Opening: a character finds an old notebook, initially unreadable. One teacher
or an actual decoder item grants access; the author had an agenda. Show
“written by”, “interpreted by” and “confirmed by” in existing Notebook
entries. Reading costs a disclosed study action; asking the teacher can cost
time, a favor or nothing where that NPC allows it. No knowledge is fabricated
on load. Loss of the record leaves learned facts intact under that world's
chosen carrier rule, while unrecovered facts remain inaccessible.

Proof: obtain, read, interpret, compare with a witness, then save/reload/import.
Check that removing the object changes only object-dependent choices and
that correcting an interpretation preserves the older attributed account.
Do not grant power by scraping the lossy biography.

### P2 Witness and inherited promise

Opening: an old craftsperson recognizes a distinctive scar or token and
claims the earlier self promised a delivery. Keep recognition, trust and
obligation separate. The player can fulfil, renegotiate, contest or refuse;
the witness's testimony alone is not an automatic debt transfer. Costs come
from an actual supported delivery, favor or contract. Failure records what
this person witnessed; it does not make the entire world know the secret.

Proof: show recognition with and without evidence; accept one disclosed
contract, fulfil it through native items, and verify the same NPC's reaction
before/after reload. An heir and a continuing immortal can use different
local recognition rules. No change to the existing heir model is implied.

### P3 Memory with a downstream consumer

Opening: an old keepsake reveals a forgotten route, password or counter.
Choose one carrier and one encounter, not an entire memory economy. Recovery
has a one-time receipt ID. Spending the keepsake or study time grants a
specific knowledge fact; an existing dialogue command then opens a concrete
alternative to paying or fighting. Refusal keeps the unrecovered route closed.

Proof: demonstrate the closed choice, the real carrier/spend, the opened
choice and its consequence. Repeat reading, reload and import must neither
regrant the reward nor erase the earned fact. Keep source claims distinct
from validated route knowledge. Do not copy the sphere's two-million-XP reward.

### P4 Local identity axes

Opening: a Village NPC reacts to whether the player truly promised aid,
bluffed or repaired earlier harm. Use authored axes meaningful to this person
or world, such as candor and reliability; D&D Good/Law is optional in a world
that explicitly wants it. Show the intention when choosing. Score one caused
act once, with an observable later wording or available action. Regret may
change a view without refunding the original harm.

Proof: truth and bluff take distinguishable state paths; repeat conversation
has no extra score; a later account refers to the exact recorded act. Test
that unrelated observers retain their own knowledge. No global morality rule.

### P5 Optional world-local revival

Opening: in a selected original world, one explicitly supplied source lets
one body return at a named place. The return contract defines body, knowledge,
items, elapsed time and companion routing independently. Preserve fulfilled
contracts, spent goods and enemy knowledge across return. Keep home-world
unconsciousness intact. Offline death behavior is chosen by this world, not
inherited from this source game's active combat.

Proof: a controlled defeat triggers the configured return; show what stayed
spent and remembered. Check inventory accounting, save/reload/import and old
saves lacking this optional mode. Test source loss and one terminal exception.
This packet is larger and depends on explicit mortality-policy selection;
static source evidence cannot supply acceptance of those consequences.

### P6 Prior self as a negotiator

Opening: a kept fragment has one motive and one piece of knowledge, and
wants something before sharing it. Offer cooperation, persuasion or contest
only where the world supplies them. A relevant record can substitute for a
stat gate. Merging, reading and destroying are separate actions with distinct
consequences. Costs are a disclosed item, time, concession or risk, not a
hidden automatic personality overwrite.

Proof: play two routes to one fragment's actual knowledge; refusal leaves
its state intact; absorption removes only that fragment and awards once.
Check observer identity and save history. Do not turn every death into a
spawned mind or treat all fragments as the same currency.

### P7 Body-specific employment and reactions

Opening: an employer offers a controlled hazardous job because the player
has a demonstrated regeneration source. Use a real job duration, disclosed
pay and current body/source eligibility. A scholar may doubt the source;
an employer may value it; a collector may exploit it. The body property does
not automatically confer faction hatred or a corpse identity.

Proof: preview eligibility and terms, complete one native job, record one
witness account and one payout. Source suppression blocks a new unsafe job;
interruption follows the disclosed cancellation terms. Model any displaced
victim only if the selected world actually defines that cost, rather than
smuggling Planescape's curse into every immortal body.

### P8 Containment as an enemy response

Opening: an enemy learns that this character returns with their knowledge
intact. The enemy changes to restraint, hiding a route or seizing an anchor.
Use actual observer knowledge and supported custody/capture commands. Supply
at least one escape or negotiated-release route for the proof. Do not invent
unavoidable imprisonment as a global punishment for immortality.

Proof: the enemy lacks this tactic before learning; after witnessed return,
it changes its plan. Restraint affects travel and actions without erasing
inventory, contracts or identity. Play release/escape, save/reload/import and
source removal. This depends on P5 or another selected continuity rule and
on enough enemy planning support; existing capture receipts alone do not
prove a complete adaptive enemy system.
