# Feature queue O1, O2, O4, O5 and the weakling/description round, 2026-10-23

Weibao, 2026-10-23: implement O1 (chemistry, energy and powers), O2 (conditional
salvage, spatial situations, natural pacing), O4 (party and cargo stock redesign) and
O5 (family trees, wider habit and social catalogs). "O3 is skippable, we want to focus
on features." Also asked: "skills, traits, starts and more? our description can change
overtime and more? starting from weakling or something? More to consider?"

Status: direction recorded, nothing built by this file. Values and acts are proposals.
Target viewport desktop 1920x1080 (laptop 1366x768 checked); mobile deferred. Rules:
AD5, AD38, AR1-AR16, MR, UR, WPR where a world is touched. One playable slice at a
time; each slice names its seam, owner and done check before code. Skipped for now:
O3 Glasshouse follow-ups (lender consent, companion inventories, alternate-body
passage, broader local-clock policy). Nothing here selects a commit, push or save
migration (old-save compatibility deferred 2026-10-17).

## Build queue (thinnest playable step first)

| Q | Slice | Existing owner to extend | Done check |
|---|---|---|---|
| F1 | Weakling start: a low-baseline body start (frail, underfed, untrained) with its own early loop, growth and a first small win | `start_records.js`, `foundation_start_content.js`, body sources (`kind:'trait'`, `origin:'inherited'`), GHS5/GHS6, GHS48 onset | Fresh origin start, one real improvement from play, save, reload, import |
| F2 | Self-description that changes over time: one derived line per fact (build, bearing, marks, reputation epithet) recomputed from state, never stored as a second history | `character_bio.js` (already derived, "never invents"), `product_appearance_*`, title direction (USER_VISION title as power, office or epithet) | Description differs after training, injury, scar, title; reload reproduces it |
| F3 | Traits as earned and lost, not only inherited: acquired, faded, replaced (a trait with onset, expiry and a cause shown in the bio) | `character_bio.js` origin labels, GHS48, `capabilities.js` | A trait appears from play, fades, and the bio states why |
| F4 | Skill layers made visible: why a skill is where it is, with a read-only inspector | SLC37-SLC42 in the skills considerations, `skill_discovery.js`, `skill_expansion_*` | Inspector lists layers and sources for three skills; no mutation |
| O5a | Family tree view over frozen parent references and the Chronicle | GHS8, `heir_inheritance.js`, `chronicle.js`, `companion_roster.js` | Heir and a relative appear on one tree; reload keeps it |
| O5b | One habit catalog slice and one social catalog slice as data rows on existing owners | Everyday learning and mood owners | A habit forms from repetition and shapes a mood or preference |
| O4 | Party and cargo stock redesign: one stock owner view across party, companions and cargo | `party_*`, `realm_cargo.js`, inventory I2-I5 | Reference-parity list for one flow; transfer, save, reload |
| O2a | Conditional salvage: an eligibility rule on an existing salvage consumer (CRL44) | `material_lineage.js`, salvage consumers | One eligible and one ineligible salvage, both with records |
| O2b | One spatial situation (position, cover, reach) and natural pacing for one loop | Combat/encounter owners, `simulation_contracts.js` | Situation changes an outcome; pacing check at natural clock |
| O1 | Chemistry, energy, powers: one mechanism chain (reagent, reaction, energy cost, effect) through typed effects | `energy_resources.js`, `power_models.js`, gear depth report | One reaction and one energy-gated power play end to end |

## More to consider (round 1)

**ACT NOW**
- Record this direction in USER_VISION and PROJECT.md as a hunk-only edit with the zero-loss check. Not done by this file; the shared docs have uncommitted edits from other sessions, so it waits for a clean hunk.
- Treat "weakling" as a start profile with a dial, not a debuff pile: low baseline plus a stated route to grow (AD5, AD38). Weakness needs an in-world reason (illness, hunger, age, a sealed body) and a cost story.

**ACCOUNT FOR NOW**
- **Description is derived.** `character_bio.js` already refuses to invent a past or apply bonuses. Keep that: the changing description is a view over state (body, conditions, titles, marks), so it can never drift from the truth and needs no migration.
- **Sealed secrets.** A description must not leak a sealed truth (a hidden bloodline or identity); it shows what an observer would see. Deceptive appearance is a viewer-relative claim, not one string.
- **Observer-relative description.** The same body reads differently to a friend, a rival and a stranger (identity as a stack of claims, RIVALS_IDENTITIES_AND_FATE). Start with the self view; add observers when a consumer needs them.
- **Weakness must stay playable (idle cadence).** A weakling's first hour needs a small win and visible growth, or the idle loop stalls. Check the first-hour curve before tuning numbers.
- **Skills and traits share one carrier story.** Native skills and simulation powers are two stores (SLC37). A trait that grants skill speed must go through the capability pipeline, not a second path.
- **O4 before O5a.** A family and companion view reads the party/stock owner; settle the stock view first so the tree does not build on a surface about to change.
- **Cross-feature link.** Chemistry (O1) gives the weakling a non-body route to strength (tools, preparations, leverage); conditional salvage (O2a) gives a poor start income. Slices should connect, not add parallel features.

**LATER / DELEGATE**
- Observer-relative descriptions and disguise (needs a recognition consumer; Sol medium, one world).
- Life-stage onset traits (late talent, puberty awakening, aging weakness) beyond the first.
- Habit and social catalogs beyond one slice each (Luna low for content on the established adapter).
- A "possible combinations" report from the lint to surface synergies (ideaboard S8).

## Gates every slice carries

1. Ownership: `git status` on the slice's source files before editing; several sessions share this checkout.
2. Focused test file only while editing; one full `npm test` at commit (AD36, lean tests).
3. Rebuild, then exercise in a browser from a fresh origin; for persistence, save, reload, import. Anything unexercised is labelled implemented-unverified.
4. Report each check as command, result, gap.

## Round 2, 2026-10-23: super powers and abilities across book worlds

Weibao: "Also consider super powers, other stuff and more? start wiring abilities
accordingly, like the ones for various book worlds and more? or at least expanding the
engine to be able to handle it?" Status: proposal; nothing built by this section.

### What exists (read from source and W15, not run)

- `structured_ability_runtime.js` (158 lines): ability descriptors with function families (physical, craft, storage, perception, support), acquisition (innate, learned, borrowed, acquired), kinds (body-faculty, permanent-imprint, device-construct, temporary-construct, ordinary-technique), control, target, counters, carriers and conditions.
- `power_models.js` (practice, design, investment, authority, hybrid), `energy_resources.js` (policy, reserve, strain), faculties (grant, awaken, suppress), advancement tracks, and `ascension_paths.js` (`definePath`: ladder, tree, web, wheel, stack, field).
- [W15](../../worlds/world-core-kit-2026-10-14/W15_POWER_CORE_SCHEMA.md) already proposes one schema (S1-S12: access, resource, growth, expression, limit, techniques, learn routes, rank, personal form, shortcuts, idle).
- Only three book worlds have native runtime (Mother of Learning, LOTM Tingen, Paradise). No super-power world (quirk, stand, nen, devil-fruit or chakra style) is wired.

### Queue additions

| Q | Slice | Why | Done check |
|---|---|---|---|
| A1 | **Gap probe, read-only.** Take 4 contrasting abilities from owned sources (a body-faculty gift, a borrowed or contract power, a resource-metered technique, a personal-form power) and express each as a `structured_ability_runtime` descriptor plus W15 fields. List what the descriptor cannot say. | Finds the real engine gap before building (AR11 second-consumer proof) | A table: ability, descriptor, missing field, existing owner that could carry it |
| A2 | **Close the first gap the probe finds**, in the descriptor or `definePath` only if a typed crossing is lacking. Likely candidates: personal-form (player-designed power within allowed functions, W15.S10), typed-charge or stock resources (W15.S3), and a drawback or bargain as a first-class limit (W15.S6). | "Expand the engine to handle it" | Both old consumers (Reedbank pegs, Seer ladder) still pass; one new ability plays |
| A3 | **One super-power start as data.** A start profile whose power is innate, small and limited, with a growth route (pairs with F1 weakling: weak body, odd power). | "Start wiring" with a playable result | Fresh-origin start, use the power, grow it once, save, reload, import |
| A4 | **Power display in the changing description (F2).** The self-description names what you can visibly do, scaled by what observers can see (hidden powers do not show). | Links powers to appearance and sealed secrets | Description changes when a power awakens and not when it is hidden |
| A5 | **Second power style to prove generality** (a different acquisition and resource shape than A3). | Rule: data not code per world (WA1, S1) | Second ability needs no new core file, only data rows |

### More to consider

**ACCOUNT FOR NOW**
- **Reasonable-mechanism rule (AD38).** An ability works by the mechanisms in play. Model carrier, resource, limit and counter, not an allowed-outcome list. A power's label ("fire", "time") grants nothing by itself.
- **Limits are adjectives (AD5).** Cooldown, uses, strain and backlash are dials per world with an in-world reason, never fixed "once".
- **Power versus rank.** Mechanical threshold and public credential are separate (W15.S9); a strong hidden power should not read as a rank.
- **Sealed secrets.** A power's true nature or origin stays sealed until its discovery route. The ability record and its description must be separable.
- **Counters and enemies.** Enemies hold the same cards (cheat library, "same cards, other side"); the descriptor must work for non-player holders from the start.
- **Idle cadence.** An ability needs a growth rule that runs while away (W15.S12) or it does not suit this game; check each new ability for one.
- **Canon honesty.** A direct adaptation needs chapter-level source qualification (S in the BF evidence classes); an original power on the same engine does not. Default to original powers on the shared engine, canon ones when the source pass exists.

**LATER / DELEGATE**
- Super-power world pack through the pack loader (needs the P2 loader; Sol medium for the schema, Luna for content rows).
- Ability synergy and combination report from tag rules (ideaboard S8), where "busted synergies" are found by search.
- Power fusion, copy and transfer paths already exist in `simulation_effects.js`; surface them in the inspector (F4) only when a consumer needs them.
