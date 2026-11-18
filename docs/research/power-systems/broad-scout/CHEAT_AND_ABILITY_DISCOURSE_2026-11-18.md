# Cheat and ability discourse: what communities say (2026-11-18)

Status: proposals under AD32 and AD56. Every finding below is community opinion, tagged `community` (below wiki and chapter tiers), and none changes a rule until Weibao says so. Rows are in [community_tier_cheats.json](../../coverage/community_tier_cheats.json) (54 rows, 5 wishes, same shape as the Worm, RI and LOTM sidecars plus `topic`, `cht`, `engineGap`, `proposal`, `impact`). Raw posts and comment trees are gitignored in `private/` with their URLs. All claims are paraphrased; one short quote at most.

Context read first: the 2026-11-17 discourse lane (PWC39 to PWC41) found most free routes blocked and produced 10 thin rows. This pass reached real thread text, so its rows are the first with scores, dates and top-comment evidence. Rules it maps to: [CHEAT_RULES](../../CHEAT_RULES.md) CHT1 to CHT20, with the no-forced-weakness line (CHT12, Rulebook 11) and "everything can become OP" (CHT13) as the frame.

## Route access table

| Route | Result | Use |
| --- | --- | --- |
| Arctic Shift (Reddit archive) | Works for post lists by subreddit and date, and comment trees by post id. Text search and title search time out. About 3 s a call, one subreddit per 5 min. | Main source: 14 subreddits sampled, about 60 threads read with comments |
| old.reddit.com, reddit.com JSON | 302 and 403 over curl | Not retried |
| Chrome extension on Reddit | Refused by the extension's site policy | Not worked around |
| SpaceBattles, Sufficient Velocity | Index pages load; thread pages and search 403 or Cloudflare | Excerpts via WebSearch (the default here) |
| VS Battles | Thread pages 403 | Excerpts via WebSearch (the default here) |
| NovelUpdates forum | Cloudflare challenge | Not attempted past it |
| Reddit mirrors (redlib) | One tested mirror unreachable | Seen as search excerpts, which is the default |
| WebSearch | Works; good for discovery and excerpts, thin on thread bodies | Supporting |

Sampling caveat: each subreddit was sampled by four dated windows (100 posts a page), filtered by keyword and score of 15 or more, then the highest-scoring relevant threads were read. That skews to popular, English, Reddit-visible opinion and to top comments. NovelUpdates, SpaceBattles and Sufficient Velocity munchkinry threads, r/WritingPrompts, r/noveltranslations, Re:Zero and The Perfect Run communities were not reached.

## Top ten findings, ranked by how much they would change a design decision

Codes follow the working agreement: F for finding. "Maps to" names a CHT rule, an effect-engine gap (EG), or a new proposal (NP). Inference is labelled; the community claim is what the rows record.

**F1. Conditions that strengthen a technique are loved, but only when the cost is visible and proportionate.** Nen conditions top a thread on favourite system features (r/magicbuilding, 489 points) and are praised because strictness tracks resolve. Jujutsu Kaisen binding vows draw the main critique: payoffs look larger than the shown condition, break consequences are never shown, and a vow that bails out a villain reads as rules lawyering (r/CharacterRant, 113 points, contested). Rows `limits.c1`, `limits.c2`, `limits.c7`.
Maps to: CHT12 (limits as adjectives, not compulsory); EG: a voluntary-condition primitive (condition, gain, break consequence typed and visible); NP: a vow proportionality lint that compares gain to the written cost and requires a visible break effect. This gives Weibao's "wish and vow" powers a shape without forcing weakness on anyone.

**F2. The community treats being hunted as a real limit, ahead of stat drawbacks.** On a character whose ability looks broken, the top reply (1,254 points) names the bounty on his family's eyes as the limitation; a second names a lifespan cost. Reverend Insanity fans answer "too broken" with cost chains and describe the strongest holder as beatable by rivals pooling resources. A cards-against-pathways thread's top-scoring joke is the table rule that bans divination and mind reading, so fans expect venues to ban a cheat's channel. Rows `limits.c4`, `limits.c5`, `limits.c6`, `lore.c7`.
Maps to: CHT12, CHT18; NP: a pushback ladder (bounty or hunter, rival coalition, institutional ban, then any mechanical cost), which delivers "the world pushes back through people" as a reusable pattern.

**F3. Effects split into delivery and payload, and counters often stop only one half.** Jujutsu Kaisen fan analyses say anti-domain techniques stop a domain's sure-hit effect but not the technique or its other uses, with named gaps against incomplete domains (excerpt sources, contested on one detail). Rows `inter.c8`.
Maps to: EG: split an effect into delivery (sure-hit, range, area) and payload so a counter can be partial. This is the most reusable engine gap in the evidence for conceptual and domain powers.

**F4. Absorb and copy powers are judged by their intake loop.** The top replies to "maximise a monster-absorbing technique" (1,646 points) are all about intake: hunt top-grade targets daily, or kill good-technique users by non-cursed means so they become absorbable. The cheat's weight sits in the acquisition route. Row `inter.c14`; related `wish.c2` (devour-and-gain picked).
Maps to: CHT4, CHT8; EG: absorb/copy needs an intake source, capacity and a stored-kit list. Inference: capacity and intake route are the dials, since the community never asks about the effect itself.

**F5. A loop must declare what carries, and whose memory counts.** Design write-ups treat "what carries across a reset" as the central choice, with protagonist memory fixed and others' recall optional; critics argue memory wipes erase the memory of harm without undoing it. A JoJo thread on an infinite death loop settles by asking what the rules say about souls. Rows `loop.c1`, `inter.c15`, `loop.c2`.
Maps to: CHT14, CHT16 (entry warning); EG: loop card fields (carried state, others' recall, harm persistence, other persons in the loop); NP: loop moral weight as a stated property.

**F6. Players pick self-editing, retry and absorb abilities first.** Given one Stand for twenty minutes, top replies choose to remove and reinsert the Stand disc, write traits into oneself, or loop to drink again. Given one power from a book, readers choose inventory, learn-any-skill, healing and devour-and-gain. In a seven-point cheat shopping thread, return by death is "the no-brainer". Rows `wish.c1` to `wish.c3`.
Maps to: CHT8; stress-test list for the parallel effect-grammar lane: self-rewrite, retry or rewind, absorb, utility storage. Inference from 3 threads, so treat as a priority hint, not a census.

**F7. Conceptual vs conceptual resolves by stated reach and defaults to "not bypassed".** VS Battles posters hold that conceptual power cannot be ranked numerically against conceptual resistance, that an ability bypasses resistance only as far as its source says, and that unshown extra layers are assumed not to work (excerpts only, contested). JoJo fans resolve rules from demonstrated action; the top reply to "what do JoJo fans refuse to learn" says a time-skipping Stand "just works" and cannot be diagrammed. Rows `inter.c9`, `inter.c10`, `inter.c11`, `inter.c12`, `inter.c13`.
Maps to: CHT7, AD38 ("things work by how they work"); EG: resistance and immunity tags with stated scope and a default of not bypassed when unshown; NP: a rule-strength label on each card (law, trend, exception). Inference: this matches Weibao's "mechanisms, not allowed-outcome lists" direction.

**F8. Peer cheats beat a lone cheat.** The 96-point request for stories where the protagonist is not the only one with a cheat gets answers where everyone past a level has an unfair edge; a Lord of the Mysteries reply praises a big protagonist advantage that still feels earned because nearly everyone powerful has one. Rows `cheats.c2`, `cheats.c3`, `cheats.c8`.
Maps to: CHT18; NP: a peer-cheat density dial per world (default: rivals and mentors above a tier hold cheats under the same terms).

**F9. Holders can be wrong about their own power.** Worm fans argue the strongest hero misunderstood his own power for decades because it gave options, not insight, and the decline was slow (top reply 454 points). SpaceBattles posters hold the Manton limit is a trend that varies by cape, settled only by author statements or in-story evidence (excerpts). Rows `inter.c2`, `inter.c3`, `inter.c6`.
Maps to: CHT10, CHT19; EG: an owner knowledge model separate from the true rule; NP: power opacity default (holders learn by use and evidence, a wrong belief may stand) and world caps stored as default with named exceptions.

**F10. Fans reconstruct hidden rules by separating stated from inferred, and reject theories the text contradicts.** Lord of the Mysteries threads repeatedly ask "was that actually stated?"; a character-merge theory is rejected by commenters pointing at the text; early Worm serial theories came from comment-section guessing. Rows `lore.c1` to `lore.c6`.
Maps to: sealed-secret and KNW rules; NP: clue evidence grades (stated, implied, fan-inferred) and a contradiction check so a wrong theory is visibly wrong; secrets should leave guessable evidence, since the community treats guessing as a pleasure.

## Other findings, not ranked above

- **Cheat reception (13 rows).** Readers like a cheat that is small, grows from the premise and keeps its limits (`cheats.c1`). Disliked: wins that depend on repeated "luck" and out-of-tier fights (`cheats.c4`), the treadmill where every region is the weakest (`cheats.c5`, `cheats.c6`). Some readers want a no-cheat life (`cheats.c12`), so the optional start is a real request. Maps to CHT8, CHT11, CHT13, PAC.
- **Interesting OP.** The pattern that stays interesting is a strong holder with something to spend: logistics, a pursuer, an institution, rivals with their own cheats (F2, F8). Readers who want pure destination power (`cheats.c7`) are a separate audience that CHT13 already serves.
- **Systems with agendas** (`cheats.c11`): many replies name worlds where the system serves its own goal. Maps to CHT20 (a talking cheat can be wrong); proposal: a system cheat may hold a hidden agenda property.
- **Experimentation** (`cheats.c10`): readers want time to test a power. Maps to CHT10; proposal: the base-cheat panel shows what the player has tried.
- **Systems with stated losers** (`limits.c9`): weakness reads well as a consequence of the system (a twin pair sharing a restriction), not as an add-on nerf.
- **Disclosure as a resource** (`limits.c3`): lying about one's ability is allowed unless a condition forces disclosure; "explaining adds power" is stated. EG: disclosure condition.
- **Independent projections** (`inter.c4`): fans ask whether any power creates an independent will. EG: a flag for independent will versus puppet on summoned or projected agents.
- **Predictors** (`inter.c1`, `inter.c7`): a guaranteed-win power still needs the outcome to be possible; precognition is said not to read other precognition. EG: feasibility precondition on "wins" effects and an unreadable-by tag.
- **Sanderson and tropes** (`theory.c1`, `theory.c2`): second law (limits over powers) is the frame communities cite; replies complain that the common limit is a moral "I could kill but won't". Summaries, by default.

## What did not turn up

- Toaru and Re:Zero: fan wiki excerpts on Accelerator's reflection limits (scalar quantities pass) and no thread evidence. Not in the rows.
- Reverend Insanity: threads found on cost, pooling and cheat picks; no thread on cheat-versus-world balance beyond F2.
- SpaceBattles and Sufficient Velocity munchkinry threads, NovelUpdates, r/WritingPrompts, r/noveltranslations and Perfect Run communities: not reached (see route table). A signed-in or headless-browser pass is the way in; the Chrome extension refuses Reddit, and NovelUpdates and SpaceBattles search sit behind Cloudflare challenges.
- A second reader on claim wording was not run; claims are one pass from comment text.

## Suggested next steps (proposals only)

1. Feed F1, F3, F4, F5, F6, F7 to the effect-grammar stress lane as the extreme-ability checklist: voluntary condition with break effect, delivery/payload counters, absorb intake, loop carried state, self-edit and rewind, scoped resistance.
2. Draft cheat-rule lines for Weibao's review: pushback ladder (F2), peer-cheat density (F8), power opacity (F9), clue evidence grades (F10). Each as default, dial and reason, listed for his answer per AD56 where it narrows options.
3. If more evidence is wanted, widen the Arctic Shift sample to r/WritingPrompts and r/noveltranslations and add a Luna fields pass over the saved threads (`label_runner`) to extract claim, cost and verdict; no web access is needed for that.
