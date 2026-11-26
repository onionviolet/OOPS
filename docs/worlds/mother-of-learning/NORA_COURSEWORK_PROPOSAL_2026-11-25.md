# Nora's reading assignment and a requested worked-example review

Status: compact pending design proposal under AD32. The coordinator's later instruction prioritizes source arc depth; this proposal will not be implemented in this wave. Any future runtime work requires fresh authorization. No gameplay, source pack, test or build changed.

## Evidence and existing gap

The [S0/G4 owner](ZORIAN_S0_S1_STAGE_RECORD_2026-11-03.md#s0-content-g4-g5-2026-11-03) already binds `book.mol.zorian.s0.placement_test` to scene 00206, English book1 chapter2 p175. It identifies this command's downstream consumer as absent. Current code records the placement, recommended books and assigned reading as a carried knowledge entry and current-run fact. The [teacher-window owner](ZORIAN_S2_S6_STAGE_RECORD_2026-11-03.md) is H3; this proposal adds no recurring teacher calendar.

**S1 · Direct held-English check.** The registered Calibre21 EPUB was read through the existing named `mac` SSH route, without remote writes or a new acquisition. SHA-256 is `e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf`. Chapter member `OEBPS/Text/0002_2_Lifes_Little_Problems.xhtml` has 195 paragraphs under the existing English paragraph algorithm. Paragraphs169–177 matched the authentic prepared shard exactly. Bounded verification, paragraph hashes and paraphrased findings remain in the ignored private owner `docs/research/novels/mother-of-learning/private/nora-feedback-prep-2026-11-25/source-check.json`. No raw passage was retained in the new audit artifact or copied here; the original held source stays on its source host.

**S2 · What p175 establishes.** Nora Boole teaches Spell Formulas, the branch used to construct the focusing aids from the preceding combat class. She recommends twelve books, announces weekly bonus lectures for interested students, diagnoses their prior two years with sixty questions, and assigns the first three chapters of one listed book for the next class, which is tomorrow. This does not establish a private feedback appointment, a corrected-Torch prerequisite, a paid fee, exact study durations, a mastery reward or a conditional right to attend those bonus lectures.

**S3 · Existing useful output.** The [light-correction owner](LIGHT_FORMULA_CORRECTION_2026-11-25.md) produces carried understood knowledge `book.mol.zorian.light.formula_correction` through an earned Torch exercise. It is a remembered worked example, not a physical notebook item. Its existing later use is the oblique-light/incision route. This proposal gives it a different recipient and school task, without another light-direction unlock or shaping grant.

## Recommended bounded slice

Nora's placement opens her actual three-chapter assignment. Zorian can prepare independently in the existing academy library, or first explain the corrected example to Nora and ask for a targeted reading prompt. The explanation is an explicit local exchange with a present, supported teacher. She receives knowledge of what he demonstrated; she does not infer his carried memory remotely. Her authored response makes a shorter guided-reading action available. Both routes still cover the assigned three chapters and return to Nora for review. The original independent route stays available.

| Route / action | Proposed authored time and means | Consequence |
|---|---|---|
| Independent reading | 90 minutes, one stamina, academy library access | Prepare the three assigned chapters without needing the Torch correction or extra teacher attention. |
| Explain the corrected example and ask for guidance | 10 minutes, one stamina, one Nora attention; placement and remembered correction; Nora present at the existing formula workshop | Nora records the received demonstration and offers a focused reading prompt for this assignment. It does not complete the reading. |
| Guided reading | 60 minutes, one stamina, same library and same three chapters; current Nora feedback | Prepare the same assignment with prior worked-example support. The thirty-minute saving and extra teacher interaction are authored dials, not source numbers. |
| Return for review | 10 minutes and one Nora attention, with the prepared assignment and supported teacher | Settle this assignment once, record her actual review, and connect completed study to one existing Formulas revision session when the existing exam consumer can still use it. |

These numbers are a proposed first-slice budget. They are adjustable independently of the source's question/book/chapter counts. Nora's source-stated weekly bonus lectures remain an interested student's option with either route; the correction does not become an admission test. The source's next-class-tomorrow due date is recorded as source context. A functional deadline or precise weekly lecture time needs its own located schedule or explicitly authored calendar choice; this slice does not invent one implicitly.

The library course copy and Nora's targeted prompt/availability are authored local means. No textbook ownership, sale value or lending stock is inferred from the source's reading recommendation. The existing library location/student access is reused, without adding a magical book, new NPC or currency subsidy. The description must call the action explaining a remembered example, rather than handing over an unowned physical note.

## Native seam and ownership

| Area | Proposed change after authorization |
|---|---|
| New MoL leaf | `src/mol_nora_coursework.js`: bounded command data, derived assignment/feedback facts and IDs. Existing simulation jobs, cancellation/refund, participants and actor knowledge remain the mechanism. |
| Pack composition | Add the leaf's command rows at the existing `src/world_packs/book_mol_pack.js` seam. Preserve original placement and visitor lamp-brief definitions. |
| Native facts | A scoped import/merge in `src/book_world_mol_actions.js`; derive offered guidance from Nora's actual received-demonstration entry and current-run source, alongside the player's remembered example. |
| Existing consumer | `MOL_EXAM_IDS.sessions('formulas')`, with the existing cap/returned-paper semantics. Review remains a conversation if another revision credit cannot help; use separate native outcome rows sharing the same assignment settlement, rather than blocking teacher contact for an exam-stat reason. No second reward for merely showing the old correction. |
| Focused proof | MoL-specific tests and a fresh earned browser route at1920×1080. Shared generic UI, game engine, other protagonists and a new teacher/quest framework are outside the proposed ownership. |

Nora's received-demonstration knowledge follows the existing Taiven received-survey pattern: explicit player delivery, attributed instruction and current local encounter, with real attention/presence. Student learning can survive the normal MoL restart carrier; Nora's receipt of this run's explanation and current assignment acceptance must not survive as automatic teacher knowledge. The two reading routes converge on one prepared assignment and one review settlement. They do not pay separate rewards for the same submitted work.

The candidate should keep authoring local and inspectable: one producer/recipient/assignment/consumer leaf using established conditions and effects. A generic feedback or school framework is not justified by this single case. A second independent lesson can later show whether a shared helper is needed.

## Earned route and acceptance gate

Use an ordinary fresh native life: Village doorway/chart → begin Zorian → court Torch study/cast/correction → Nora's existing placement → choose the independent or guided preparation → return to the real Nora for review. Neither a reset/late-story fixture nor Xvim's later sensing lesson is needed. The unassisted route does not require the correction. The guided branch must earn it through the existing exercise, not inject its knowledge key.

The acceptance gate is the same assignment being completed by two materially different preparations, with visible time/stamina/teacher costs and a later teacher action/real Formulas consumer. Native checks must include no assignment before placement; no guidance from a player-only memory; absent/busy Nora; interrupted reading/review without acceptance or credit; shared settlement/duplicate suppression; cap/returned-paper review; pending-job restore; and restart separation of personal memory from teacher awareness. Then prove the earned desktop route, Save/reload/Export/Import and the actual consumer against an isolated rebuilt bundle, coordinating the build/browser slot. Existing exact pack pins are not rewritten to make a fixture load.

## Alternatives weighed

**O1 · Ibery's library job.** Chapter14 preparation currently establishes applying for work, not the actual assigned duties or wage. Making an early catalogue job with those details would need another bounded source check. It is a useful later independent case, but less directly grounded than the existing Nora assignment.

**O2 · Xvim critique changes Taiven's practice offer.** This could connect two teachers with a more unusual response to uncertainty, but it starts after an earned reset/Friday lesson and risks duplicating the existing Taiven mana-cloud path. It is a weaker fit for the requested fresh-start slice.

**O3 · Lamp reconstruction with Nora.** The visitor already has a functional lamp brief and a genuine device chain. Reusing it for the protagonist requires checking learner/operator rights, owned materials and teacher mana rather than assuming a corrected example grants device operation. That wider mechanism is separate from this first school feedback task.

Proposal prepared from the named owners, current native command definitions and the direct bounded source check. No runtime writes, browser/build run or new private-source restoration occurred. Implementation remains unauthorized pending the coordinator's gate and scope decision.
