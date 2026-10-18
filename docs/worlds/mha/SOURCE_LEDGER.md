# My Hero Academia source ledger

Status: Research evidence r1, 2026-10-14. These are secondary WikiTeam-snapshot claims, not primary canon authentication. See [synthesis method](SYNTHESIS.md).

## Source and read coverage

The dated source is the My Hero Academia Wiki in the WikiTeam Internet Archive snapshot of 2023-11-28. Shard A read 689/689 retained selected inputs (4,849,153 characters, 1,466 chunks). Shard B read 945/945 selected inputs (4,832,109 characters, 1,661 chunks), plus 23 named audit payloads (50,214 characters, 24 chunks). Each chunk is bounded to 4,500 characters and receipt hashes/counts were audited. Shard B corrections are append-only and must be applied. See each shard's `SUMMARY.md`, `ERRATA.jsonl`, `NOTE_CORRECTIONS.jsonl` and `AUDIT_ADJUDICATION.json` in `docs/research/power-systems/wiki-digests/full-dumps/workers/mha-full/`.

The local digest `DIGEST_my-hero-academia.md` is explicitly `blocked_no_revision`; it does not verify lore. The 2024 manga ending is outside the snapshot. Wiki-reported citations identify leads, not independent primary verification.

## Bounded claims used by the pack

Every adaptation row below is proposal `O`; evidence cells record the supporting secondary claim. Revision IDs refer to page revisions in the snapshot.

| Claim ID | Bounded source assertion | Source title and revision | Medium / conditions retained | Proposal implication |
|---|---|---|---|---|
| `MHA-C01` | Quirks are bodily functions that may be trained, exhausted and carry distinct drawbacks; protective adaptation can mismatch the function | `Quirk`, rev. 409871 | Mixed manga/anime examples, claim-level labels in note; not a single cost law | `O`: model function-specific body and cost |
| `MHA-C02` | Erasure suppresses expression temporarily; factor damage and different drug outcomes are distinct | `Quirk`, rev. 409871; `Quirk-Destroying Drug`, rev. 409738 | Manga/anime; Rewind treatment and recovery are event-specific | `O`: suppression, injury, loss and restoration have separate conditions |
| `MHA-C03` | One For All merges transfer with accumulated power; transfer involves holder intent and recipient DNA intake; copied access does not include stored strength | `One For All`, rev. 409338; `Copy`, rev. 407112 | Manga/anime-supported examples; exact rules retain stated conditions | `O`: identity, factor access and stored resource are separate |
| `MHA-C04` | One For All output and use can strain the body; existing Quirk-bearing inheritor lifespan cost is described, while rate is unknown | `One For All`, rev. 409338 | Manga chapters cited by wiki; no universal numeric cost | `O`: actor-specific compatibility and reserve, no global multiplier |
| `MHA-C05` | All For One acquisition and use have touch/body/proficiency constraints; damage to a stolen factor can persist | `All For One (Quirk)`, rev. 409862 | Manga/anime and movie evidence individually labeled; Nine is movie 2 | `O`: theft/transfer is a distinct procedure, not ordinary learning |
| `MHA-C06` | Copy duration is described as five then up to ten minutes; accumulated resources and bodily conditioning do not copy automatically; some created effects may outlast copied access | `Copy`, rev. 407112 | Manga/anime; page's own wording marks improved duration as appearance | `O`: copied access, stored stock, donor residue and effect persistence use separate owners and clocks |
| `MHA-C07` | New Order requires touch and spoken target name; living identity must align; two active rules and enhancement ceiling are stated | `New Order`, rev. 409119 | Manga chapters 331–334; preserve air-target and identity limits | `O`: conditional rule effects need declared target, scope and replacement |
| `MHA-C08` | Brainwashing activation requires a verbal response; later resistance/break rules are page-specific | `Brainwashing`, rev. 399826 | Manga/anime paired citations | `O`: trigger and break conditions must be explicit |
| `MHA-C09` | Danger Sense detects threats under the source's conditions; it is not generic omniscience | `Danger Sense`, rev. 405555; `One For All`, rev. 409338 | Manga/anime; stated trigger is hostile intent in relevant descriptions | `O`: perception is a scoped signal with false negatives outside its envelope |
| `MHA-C10` | Trigger entries describe differing formulations, routes, durations and cognitive effects; permanence of one Vigilantes case is explicitly unresolved | `Trigger`, rev. 402966 | Main manga/anime, Vigilantes and film 3 are separate; do not flatten | `O`: intervention records source, dose, route, time and observed outcome |
| `MHA-C11` | Quirk inheritance, combination, awakening and modification are reported with examples and theories; causes are not uniformly established | `Quirk`, rev. 409871 | Mixed citations; Quirk Singularity is presented with changing attributed status | `O`: distinguish biological history from public theory and actor belief |
| `MHA-C12` | Licensed hero work, school training, public regulation and occupational use are described; public Quirk use without a license is generally illegal, with described exceptions | `Heroes` rev. 407817; `U.A. High School` rev. 401755; `Quirk` rev. 409871 | Specific law/episode/extra claims vary; the Pro Hero temporary privilege is an inference, not an explicit general rule | `O`: jurisdiction is local and claim-specific; civilian help does not itself authorize public Quirk use |
| `MHA-C13` | Citizens register Quirk details and may revise them as they learn more; major or frequent revisions are usually constrained | `Quirk`, rev. 409871 | Secondary snapshot assertion; verify against selected primary era before canon use | `O`: Quirk registration/profile history is independent from hero license and capability |
| `MHA-C14` | U.A. admissions include written and practical examinations with rescue credit; observation internship and provisional-license work-study are distinct routes | `U.A. High School`, rev. 401755; `Heroes`, rev. 407817 | Secondary snapshot; verify criteria for chosen era and institution | `O`: applicant and trainee starts have explicit, era-checked eligibility states |

## Visible disagreements and limits

1. The blocked digest has no acquired revision and says prior mappings are unverified. The new frozen snapshot supports more detail but does not convert digest claims into verified canon.
2. `Quirk` rev. 409871 presents Quirk Singularity first as popular theory and later as fringe/cult rationale, then treats Tomura's body as proof. Preserve the page's shifts and attributed framing rather than silently harmonizing them.
3. `One For All` rev. 409338 says it cannot be stolen, then describes vestige resistance and a theoretical override route. Keep statement and exception/interpretation visible.
4. `New Order` rev. 409119 uses the living target's identity conflict to explain failure; its general description is locally uncited while later conditions cite manga chapters. Keep that evidence difference.
5. `Trigger` rev. 402966 describes effects across manga/anime, Vigilantes and movie 3. Teruo's permanence is expressly uncertain; don't infer that all exposures are temporary or permanent.
6. Shard A marks some claims as unclear-continuity. Shard B corrections remove unsupported cross-page comparisons, including the `Final War Arc` rev. 409538 note; apply corrections before reuse.
7. Contradictory event pages and inconsistent labels remain secondary assertions. Do not choose one based only on chronology or memory.

## Spot-check record

Directly opened private retained payloads for `Quirk` rev. 409871, `One For All` rev. 409338, `Copy` rev. 407112, `New Order` rev. 409119, `Brainwashing` rev. 399826, `All For One (Quirk)` rev. 409862 and `Trigger` rev. 402966. Checked the body/exhaustion text, DNA and intent transfer language, stored-resource copying limit, Copy time window, New Order identity/two-rule conditions, Brainwashing response trigger, All For One palm-touch delivery and Trigger variation. These checks confirm what the snapshot text says; they do not independently validate the underlying manga/anime scenes.

No original manga volume was read. No full primary source chapter check was completed. The reader files contain selected article inputs read in full; character manifests are mechanic-bearing spans, not complete biographies. Templates/galleries and referenced images were not fully inspected. No fan premise survey ran.
