# World secrets and discovery

*Direction from Weibao, 2026-10-10: "consider aspects as in implementing
worlds and then I wont know whats so special about them myself until its
discovered or uncovered using relevant skill". Everything below that
direction is a proposal. Applies to every world; comic targets are the
first examples ([playthrough targets](../research/comics/PLAYTHROUGH_TARGETS.md)).*

## The idea

A world's signature rule is not printed on its card. You arrive knowing
what an ordinary visitor would know. What makes the world special (its
hidden law, its clock, its counters, its lie) is found in play, through
skills that fit the secret. This follows rule 6 of the
[rulebook](../RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10)
(what anyone sees can be wrong) and the candidate "information when it
comes up". The mysterious awakening premise already works this way for
the player character
([direction](../DIRECTION_SYNTHESIS.md#vague-awakening-opening-proposed-2026-10-02)).

## Secret anatomy (proposal)

Each world package holds its secrets as data. A secret has:

| Field | Holds |
|---|---|
| Truth | What is actually so, in the world's own terms |
| Surface | What a newcomer sees or is told (can be false) |
| Clues | Things in play that point at it: events, objects, people, odd numbers |
| Routes | Two or more skills or acts that can reveal it, with thresholds |
| Readings | Partial or wrong conclusions a low or unlucky check gives |
| Payoff | What knowing it lets you do; a secret that changes nothing is not worth hiding |
| Carry | What can take the knowledge to another life or world (rule 5) |
| Natural course | Whether the world reveals it anyway at some point, and when |

## Knowledge stages

1. **Unnoticed.** Nothing shown. The rule still acts on you.
2. **Sensed.** "Something is off." The Notebook gets an unnamed entry.
3. **Suspected.** One or more readings, possibly wrong, stated as guesses.
4. **Known.** The truth, with the evidence that proved it.
5. **Usable.** You can act on it: exploit, counter, teach or hide it.

Stages are per secret and per life. A wrong reading can sit at stage 3
and get acted on, with consequences.

## Skills as routes (existing YAIR skills first)

Vanilla `src/data/skills.js` already has skills that fit:

| Skill | Reveals |
|---|---|
| Perception | Physical clues, things that do not match, impostors |
| Presence sensing | Hidden beings, possession, a body that is not what it seems |
| Literacy | Records, archives, contradictions between documents and memory |
| Medicine | Body secrets: species, infection, enhancement, what a body can survive |
| Strength of mind | Mind control, false realities, rewritten memories |
| Meditation | Your own hidden traits and the world's ambient energy |
| Spatial awareness | Odd geometry, dimensional seams, wrong distances |
| Herbalism, Alchemy | Substances: power drugs, mists, counters |
| Haggling | What people want hidden in trade; who profits from a lie |

New worlds can add their own (investigation, science, magic sense,
psychic reading). Non-skill routes also count: being told by a native who
trusts you, dying and returning (loop worlds), outside reading from
another world, or blunt experiment.

## Comic examples (proposals, spoilers by design)

These comics' twists are public, but in play they start hidden.

| Target | Hidden truth | Clues | Routes | Payoff |
|---|---|---|---|---|
| T1 Invincible | The friendly hero's people are an empire's scouts; a list of things can hurt them | Missing heroes, odd injuries, an agency hoarding gadgets | Medicine (body scan), Literacy (agency files), Perception (fight footage) | Prepare before the reveal; collect counters |
| T5 House of M | The world is a wish | Déjà vu, records that disagree with memories, one person who remembers | Strength of mind, Literacy, a native's trust | Wake others, or keep the kind lie |
| T9 New Ultimate | Changing the past here overwrites rather than branches | An experiment with time leaves no branch | Experiment, Spatial awareness, outside comparison with another world | Time travel is final here; plan for it |
| T18 Tangent | Same names, different people | A famous name with the wrong powers | Perception, Haggling (people lie about who they are) | Stop trusting labels |
| T19 Worm | Powers come from trigger events, and something is behind them | Every powered person has a worst day | Medicine (brain differences), Literacy (case files), Presence sensing | Know why powers exist and who benefits |
| Green Lantern-style ring | Recharge rule and the yellow weakness, which training can outgrow | The ring dies on a cycle; one colour fails | Experiment, Meditation (willpower) | Recharge on your terms; beat the weakness |

## Implementation aspects

- **Data, not code.** Secrets live in the world package as records with
  the fields above. The engine evaluates clues and routes generically. A
  direct franchise world keeps its secrets in the private pack.
- **UI.** Unknown rules show as unnamed Notebook entries or "???" in the
  existing panels, never as a separate window (rule 8). Readings show who
  read them and how sure they are.
- **Randomized per run, where a world allows it.** Some secrets are fixed
  by the source (book worlds follow their book); original worlds can roll
  which secret is true, so a replay is not solved by memory alone.
- **Knowledge versus memory.** You may remember a secret from a past life;
  your new character only knows it if a carrier brought it (rule 5). The
  game should let a remembered secret be acted on through an in-world
  route, not grant it for free.
- **Save.** Discovery stage per secret, per life, per world. New optional
  save data needs a migration or an explicit compatibility decision; old
  saves start every secret at "unnoticed".
- **Verification.** A browser test from a fresh origin must show the
  secret absent before discovery and present after the route fires, and
  survive save, reload and import.

## Sealed secrets: standard rule (2026-10-10)

Weibao, 2026-10-10: "make sealing the standard rule for agents, but of
course we stll need to consider implementation and more". The rule lives
in [AGENTS.md](../../AGENTS.md#sealed-secrets). Below it, everything is a
proposal.

**The rule.** Agents see everything they need to design, build and test.
Weibao sees a secret's truth only by discovering it in play, or by asking
to unseal it. Reports name secrets by ID, route and status. Public
franchise twists are not sealed; a changed, divergent or randomized truth
is. Secrets about the player character count too.

### Implementing sealing (proposals)

- **Where sealed records live.** Original worlds: `docs/worlds/<world>/sealed/`
  for design notes and a sealed data file beside the world's content in
  `src/`. Franchise worlds: the private pack. Files are named `sealed` so
  nobody opens one by accident. Sealing is a convention, not encryption:
  the repo is public and the bundle is readable. That is fine for a solo
  game; the aim is to protect the surprise, not stop a determined reader.
- **Agent output.** Chat, reports, checkpoints, IDEA_INDEX and PROJECT.md
  use IDs ("World 3 has secrets S1 to S4; S2's Medicine route verified").
  Commit sealed files in their own commits with neutral messages. Do not
  open diff panes or file previews of sealed files for Weibao.
- **Engine.** The UI renders only the text for the current knowledge
  stage. Truth strings never go to the console, event log or error
  messages. A debug "unseal" switch exists for fresh test origins only and
  never touches private saves.
- **Tests.** Automated checks assert that no truth text appears in the
  page before its route fires, then that it does after, through save,
  reload and import. Test output prints IDs, not truths.
- **Randomized truths.** Where a world allows several possible truths, the
  run picks one at creation and stores only its ID in the save. Agents
  never read Weibao's private saves (already a safety rule), so nobody but
  the game knows which truth is live for him.
- **Fairness review.** A sealed reviewer (a separate agent pass) checks
  each secret: at least two routes, clues reachable in normal play, a
  payoff worth having, and no basic progress hard-locked behind it unless
  the world says so.
- **Asking Weibao without spoiling.** When a choice depends on the truth,
  ask in the abstract ("S3 can take two routes or three; three is easier
  to find") or offer to unseal just that secret. Per "anything is
  possible", prefer building the options over asking.
- **Acceptance.** Rule 10 still holds: a sealed truth stays a proposal
  until Weibao accepts it. He can accept the experience ("finding it felt
  earned") without reading the text, and unseal later to accept or change
  the truth itself.

### More to consider

- **Hidden counts.** Even "this world has 4 secrets" is a hint. Worlds can
  show the count, a vague "more remains", or nothing.
- **False secrets.** Some rumors have no truth behind them. Chasing one
  costs time; disproving one is its own small discovery.
- **Secrets that move.** A truth can change with the natural course (a
  clock advances, a ruler dies) so old knowledge goes stale.
- **Secrets as goods.** Knowledge can be sold, traded, taught or used as
  leverage (Haggling, reputation). Rivals can discover your secrets too.
- **Cross-world secrets.** A truth found in one world can be a clue in
  another, such as a counter that works on a related species elsewhere.
- **Lives and carriers.** A secret you know as a player but not as this
  character can be re-found faster (you know where to look), but still
  needs an in-world route.
- **Your own secrets.** The player character's hidden traits use the same
  stages and sealing; Meditation, Medicine and outside readers are routes.
- **Codex.** A per-world record of what you have found, with stage and
  evidence, inside the existing Notebook rather than a new window.
- **Natural reveal.** If nobody finds a secret, the world's natural course
  may reveal it anyway, often too late to use well.

The comic examples above stay unsealed because their twists are public
canon. Any divergent or randomized version of them would be sealed.

## Next connected considerations (2026-10-10, proposals)

These are agent proposals from the next-parts review, not accepted rules or
implemented gameplay. They extend the existing discovery design without
selecting a new content wave or revealing any sealed truth.

| Code | Part to consider | Concrete playable consequence |
|---|---|---|
| P1 | Investigation as action | A player can compare accounts, examine an object, commission a specialist or try a controlled experiment. Each uses actual time, access and means; higher skill can improve the evidence or open another method. Avoid reducing every mystery to an automatic level threshold. |
| P2 | Acting before certainty | Let a supported counter or experiment be attempted while a reading remains suspected. Show known costs and observed results without announcing whether the hidden theory is correct. Failure can provide evidence where the world's mechanism permits it. |
| P3 | Other people's knowledge | Track what each relevant person observed, believes and communicated. A rival can investigate, conceal, sell or misunderstand information through actual routes. Learning the truth does not automatically inform the town, and testimony need not prove it. |
| P4 | Discovery changes the future | Connect disclosure and interventions to the world's natural course. Finding a fact, telling someone and changing its cause are distinct events. Record affected dependencies so a later outcome can respond without silently rewriting earlier receipts. |
| P5 | Endings and carried legacies | At a supported departure, death, rebirth or succession, settle records, objects, taught knowledge and unfinished obligations by their actual carriers and local rules. An heir may receive a journal or changed institution without inheriting the previous person's mental knowledge. |

Further design checks belong inside those parts: experiments should not
reroll truth through reload; randomized variants need reachable clues and
compatible consequences; discarded objects and unavailable witnesses need
world-appropriate alternate routes or an explicit lasting loss; temporary
conditions need dated readings; and clues, action labels, locked choices,
logs and exports should reveal only what their observer can know.

**Suggested next proof, after the current playable acceptance gate:** one
original mystery in an existing location, two fitting investigation routes,
one possible mistaken reading and one useful action available before full
certainty. Exercise undisturbed and intervened outcomes from fresh test
origins, then save/reload/import with stable truth and no duplicate rewards.
Report IDs and route results only. This is a proposed proof, not an assignment.


## Base-cheat discovery direction, 2026-10-15

[Weibao requests discovering the base cheat's powers in play](../USER_VISION.md#overarching-direction-discussion-od13-2026-10-15),
within direct narration and world/mode/means-dependent voices. Talking cheats and
unreliable narrators are possible. Their exact identities, powers and reliability
are not selected by this answer. No hidden truth is introduced or unsealed here.

Proposed implication: distinguish an observable usable starter capability from
its unexplained origin, hidden scope and later functions. Research, experiments,
insight, other people and actual revealing powers can establish evidence. Preserve
how a claim was learned, who knows it and whether it is an account, inference or
supported fact. Discovery need not be a one-time exposition dump or a mandatory
riddle blocking the already granted starter continuation. Actual functions/routes
belong to cheat/world owners; author-only sealed detail remains outside chat and
public-facing summaries. See [voice considerations](../YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md#od13-narration-voices-and-discovery-2026-10-15).
