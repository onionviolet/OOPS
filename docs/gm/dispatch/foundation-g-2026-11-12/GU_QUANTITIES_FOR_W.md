# What Gu reads and writes in the world substrate, draft for chat W, 2026-11-12

From chat G. Proposal under AD56 for W's quantities, law fields and contact layer ([plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#the-overarching-system-one-world-the-parts-embed-into), O2, O3, O5, PFP10-PFP14). Codes GQ1 onward. W decides names and units; these are the Gu needs found in the [inventory](KEEPER_COMPRESSION_INVENTORY.md) and the catalogue. Locators are chapters of the held English edition.

## Quantities (O2)

| Code | Quantity | Held by | Gu reads | Gu writes | Evidence today |
| --- | --- | --- | --- | --- | --- |
| GQ1 | **Primeval essence by rank and stage** (rank 1 to 5; stages initial, middle, upper, peak) | aperture (body) | activation fuel, stage factors (`stageFuel`) | conversion moves amount between stages (Liquor Worm line) | catalogue `conversion` rows; stock from counters in seven, nine, red_steel |
| GQ2 | **Immortal essence by grade** (green grape, red date named in the evidence; others open) | aperture, stores, market lots | Immortal activation (Fixed Immortal Travel, Fight, Years Flow) | spent per activation; bought in scenes | ch378, 1394-1396, 1452; keeper green grape item |
| GQ3 | **Mental energy** | body (mind) | Attitude activation | spent | ch974-1083 |
| GQ4 | **Gu feeding state** (fed through, diet by kind: wine, light and sound, star fragment grass) | the Gu as a body (chat L) | readiness to refine or activate | feeding resets it | 1440-minute windows in six modules; Photo-audio ch16 |
| GQ5 | **Ambient light, starlight, moonlight, sunlight** | place, by time and sky | Stargate fuel, Starlight Firefly colony, Vitality Grass growth, Photo-audio feed | Starlight Firefly and Rainbow Light publish light (GQ12) | stargate_sky; ch102, 466-616 |
| GQ6 | **Sound** | place | Photo-audio feed; Ear Grass hearing range | Thunderclap noise (GQ12) | ch16, 129, 169 |
| GQ7 | **Water and soil fertility** | place (bed, field) | Vitality Grass, Charred Thunder Potato growth | consumed by growth | ch102, 213 |
| GQ8 | **Materials and additives** (wines, spices, beast-king eyes, immortal materials) | holder | refinement stage inputs | consumed | catalogue `recipe` rows |
| GQ9 | **Concealment and sense channels** (ordinary sight, smell, hearing, lightning sight; cover, smoke) | place and body | detection checks | concealment masks a channel; smoke lowers range | ch121-169 (existing `gu_concealment`, `gu_senses`) |

## Law fields (O5, PFP14: only where the source works this way)

| Code | Field | Scoped to | Gu reads | Gu writes | Evidence and status |
| --- | --- | --- | --- | --- | --- |
| GQ10 | **Dao marks by path** (count, plus a destructive flag where a refinement left one) | body, aperture, Gu, place | carrying capacity of travel (ch1769); a wild Gu's choice of carrier (ch2280); stability of a removed Gu (ch1795); a place's tribulation mix (ch1051, GKM240) | consumed by refinement (Self Reliance ch1570); gained on annexation (ch1769) | thin: four chapter pointers, no amounts. Proposal only |
| GQ11 | **Unique Immortal kind** (at most one living specimen of an Immortal kind per world, with its claimant) | world | refinement start and settle (rival fails when one lives) | claimed on emergence; released on death or, open, on falling below Immortal rank (Year Gu) | `gu_world_claims` today; ch1129 open field |
| GQ13 | **Formation and area fields** (a travel block, Air Lock's shortened jump) | place, timed | travel quote and completion distance | a formation Gu (Formation Plate, Fight) sets one | ch1003, 1089, 1386-1387 (GKM238) |

## Effects Gu publishes (contact, O3)

- **GQ12 · Effects.** thunderball hit and noise (Thunderclap); flames along a route (Moving Fire ch2226) and flames at a target (Red Fire set); light (Starlight Firefly, Rainbow Light, Moonblade glow); concealment start and end; a sense reading taken (who saw or heard what); a vibration trigger fired (Charred Thunder Potato); a Gu left or arrived (loan return, wild Worm roaming, a Gu leaving its keeper partway through a working, PFP7's first case); backlash on the operator (Plunder short of essence ch132, Fight's failed activation ch1394-1396); a Gu's aura that draws beasts (Years Flow Like Water, Year Beasts ch1129).

## Joins this enables without join code

- A farmed firefly colony raises a hill's light (GQ5); a light-fed wild Gu or a rival keeper reacts (the plan's third chain).
- A Gu regulating a brew leaves with its keeper (GQ12 "Gu left"); the brew reads the heat it already stored (chat B).
- Thunderclap's noise (GQ6) reaches an Ear Grass listener or a wolf pack (chat C, chat L).

## Requests to W

- Essence as one typed account per holder with kind, rank and stage (GQ1-GQ3), settled the same in one jump or many. R and C ask for the same account.
- Light, sound and fertility as place quantities that Gu, L and B all read (GQ5-GQ7). L and B ask for light and moisture too.
- A law-field slot that a domain can attach to a body, Gu or place with a path key and count (GQ10), and a timed place field (GQ13).
- The claims ledger (GQ11) stays in G (`gu_world_claims`) unless a second domain needs world-unique things.
