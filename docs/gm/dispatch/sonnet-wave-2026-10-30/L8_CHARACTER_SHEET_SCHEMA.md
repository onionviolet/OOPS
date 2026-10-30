# L8 character sheet schema (WA50, proposed 2026-10-30)

Ids and field names only. Sheets live in gitignored
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets/<person-slug>.json`,
keyed by registry person id (`lotm.person.*`). Owners consumed, never copied:
cast records (`private_packs/lotm-cast/cast.json`, `knows`/`relations`/`wants`/`tier`) and
`src/cast_schedule.js` routines belong to `sw-absorb`; rite, potion, craft and divination rule
data belong to `sw-rites`; mechanism families belong to L7 `sw-gaps`. A sheet points at them by id.

## WA48 sample (volumes 2-8)

Merged extras counted by volume for the pilot principals (rows that cite the person):
every pilot principal has rows in volumes 2-8, from 86 to 4,847 per volume. The row kinds that
carry person facts are `about` rows (texture, 80k), person rows (`knows`, `relations`, `reveals`,
`routine`, `wants`, `reacts`, `speech`, 11k) and `ability`/`rite`/`potion`/`craft`/`custom` rows with
a `who` list (9.5k). Sampled about 20 rows across volumes 2-8; what volume 1 alone would miss:

| Seen later | Shape consequence |
| --- | --- |
| Titles and personas that exist only from a later volume | `identities` is a list with its own `from`; a persona has its own reputation and `believed` values |
| Power path and level change, and a person can hold a title that is not a rung | `power` entries are dated; `path` and `level` are separate from `title` |
| Abilities gated by conditions, costs and artifacts | `abilities` hold rule ids plus `conditions`, `costs`, `limits`; no rule content copied |
| Money as debts, shares, bounties, wages in pounds | `money` entries carry `kind` (purse, debt, share, bounty, wage) and an amount |
| Observers guess wrong about strength or path | every value has `view`: `actual`, `shown`, `believed` (with `by`) |
| Reveal rows that change what a person knows about another | `identities` and `power` entries can carry a `gate` (discovery route id) |

## Entry shape (every list field)

`{v, from, to?, view, by?, ev, loc, rule?, gate?, note?}`

| Key | Meaning |
| --- | --- |
| `v` | the value (string, number, id or small object per field) |
| `from`, `to` | chapter refs `bN:CH` (volume 1 is `b1`); `to` open means still true |
| `view` | `actual` (default) / `shown` (what the person displays) / `believed` (observer `by`) |
| `ev` | evidence label `S` stated / `T` text-implied / `I` inferred / `U` unknown |
| `loc` | locator string as in the rows (`zh b5 第1章 p47`) |
| `rule` | rule id from the owner (`lotm.rule.*`, `lotm.ability.*`, formula id) |
| `gate` | discovery route id; entries with a gate are hidden unless the route is open |

Sealed truths are referenced by id only (`gate.seal`), never described in tracked files.

## Conventions every lane follows

- **Chapter refs:** `bN:CH`. A locator `zh 第N章 pP` with no book number is `b1:N`; `zh b5 第3章 pP` is `b5:3`. Chapters restart in each volume. (`cite_paragraphs.mjs` calls volume 1 book 0; the loader uses `b1`.)
- **Gate ids:** `gate: "reveal@bN:CH"` built from the chapter of the bundle's `reveals` row. Gate only truths about other people or sealed facts; never gate a persona the person created or knows is theirs. A gate is open when its id is in `openGates`.
- **Outcomes:** choose outcomes the test can check alone. Put the opponent's band inline (`{vs: {might: 6}}`), or use a money threshold. `expect` is `{kind:'beats'|'loses_to', vs:{axis:band}}` or `{price_at_least:N}` (some `money` entry in force reaches N). No `beats` against someone without a sheet.
- **Locators:** every `loc` must appear in the person's bundle; never invent one. Unknown stays `ev: "U"`.
- **Bands:** 0-9 on each axis; 0 ordinary person, 9 the strongest of any named person in the source.

## Sheet fields

| Field | Entry `v` |
| --- | --- |
| `id`, `tier` (`principal` / `recurring`), `slug` | header |
| `identities` | `{name, kind: legal / alias / persona / title / body, persona?: id}` |
| `affiliation` | `{org: id, rank, role}` |
| `power` | `{path, level, title?}` (the world's own scale) |
| `abilities` | `{rule: id, conditions[], costs[], limits[]}` |
| `stats` | `{axis, band, reproduces}` axes: `might`, `speed`, `resilience`, `mind`, `perception`, `lore`, `influence`, `wealth`; band 0-9 in the world's scale, `reproduces` names the stated outcome id it calibrates against |
| `skills` | `{skill, band}` |
| `held` | `{item: id, kind: carried / worn / owned / lent, where?}` |
| `money` | `{kind: purse / debt / share / bounty / wage, amount, currency, with?}` |
| `condition` | `{state: id, severity?}` (injury, curse, loss of control, mask worn) |
| `links` | pointers only: `cast` (cast.json key), `routine` (cast_schedule anchor ids), `relations` (not duplicated) |
| `outcomes` | calibration targets: `{id, what, expect, from, loc}`; `expect` is a comparable (`beats`/`loses_to`/`survives`/`price_at_least`) |

## Read model

`sheetAsOf(personId, 'bN:CH', {openGates})` returns, per field, the latest entry with `from <= ref`
and (no `to` or `to > ref`), actual and shown separated from believed, gated entries dropped unless
their route is in `openGates`. Tiers: principals get every field; recurring get `identities`,
`affiliation`, `power`, `stats`, `money`; crowd people derive on demand (O3) and have no sheet.

## Mapping from L7 person-touching families (codes in `WB_TAXONOMY.md`)

| L7 code (GM row) | Sheet field |
| --- | --- |
| ADV, MAK, ACT (GM25) | `power` (path, level), `abilities` |
| ABL (GM26) | `abilities` |
| IDN (GM24) | `identities` |
| ORG (GM22, GM34) | `affiliation` |
| ART (GM33) | `held` |
| ECO | `money` |
| COR (GM32), MND (GM29) | `condition` |
| KNW (GM35), GTH (GM30) | `links.cast` (owned by `sw-absorb`), not copied |

L7 classifies rule ids only; ADV and MAK potion ids drift across volumes, so `power` entries cite the person's own rows, not the family code.

## Ability ids (from L10, `L10_ADVANCEMENT_DESIGN.md`)

L10 ability records use `P.ability.k` (`P = book.lotm.adv`). Pilot sheets cite the merged rule ids (`rule`); a later join maps them to `book.lotm.adv.ability.*` ids and never copies conditions or costs. `abilityView` in `src/ability_records.js` is the read model.

## Persona ids (L11, schema bump 2026-10-30)

`personaIds: []` on the sheet lists `persona.<slug>` ids; each persona `identities` entry carries `v.persona` with the same id. `sheetAsOf` returns `personaIds` held at the ref (persona entry in force and not gated shut). Standing stays keyed by persona in `standingOf` (`src/persona_standing.js`); the sheet stores no standing.
