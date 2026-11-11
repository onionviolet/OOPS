# Gifts, tastes and daily talk as thought rows (2026-11-10)


```receipt
build: 4429cb3d3ce74ba1e1a2ed5f910e674994d9c0a2cc2f490cf7a813a96c8d467e
route: fixture(household-end save on this build, then term, train and arrival acts by their buttons)
state: browser-verified
viewport: 1920x1080 headless, fresh origin
persistence: checked
tests: tests/social_contact.test.js 6/6; check:arch; check:rules; scripts/playtest/hp-gifts-contact.mjs
review: none
surface: Friends at school panel (book_world_hp_contact_panel.js); HP Inventory label
```

Requested by Weibao on 2026-11-10 through the decompile-bank relationships round: "Feel free to also adapt and adjust things to fit our purpose better too." Everything below is a proposal (AD32) at an adjustable working default (AD56).

Codes applied: AD38, AD43, AD51, AD56, AR3, TIE1, TIE13, TIE15, TIE24, MND5, SKR21, CX1, UR70–UR75, PRS. The seam is `social_contact_domain.js` (plan/commit ports, the `inquiry.js` route) writing `mood_thoughts_domain.addMoodThought`.

## What was built

- `src/social_contact.js`: a pure, world-neutral layer. It has the taste resolver (an item row first, then a tag rule, then neutral) and gift and talk row builders using Stardew's five tiers.
- `src/social_contact_domain.js`: the `socialContact` domain, with commands `give`, `talk`, `take` and `view`. The thing changes hands through native inventories and time passes through the plan. The row is written only after the commit succeeds. It has no save key of its own.
- `src/book_world_hp_contact.js`: the first caller, Harry and Ron at Hogwarts. It holds Ron's tastes with their book locators, his birthday, and the food on the house table.
- `src/hp_table_food_items.js`: an optional item catalogue registered in `items.js`. It holds a slice of treacle tart, a jam doughnut and a peppermint humbug, all on the feast table in book 1, chapter 7.
- `src/book_world_hp_contact_panel.js`: its own panel, "Friends at school". It shows what Ron has on his mind about you as words, never numbers. A shut act says why.

## What changed from the donors, and why

| Donor shape | Here | Reason |
| --- | --- | --- |
| Stardew friendship points, which decay without talk | No number. Each gift or talk is a dated row attributed to the giver that runs out by itself | Brief: "don't keep a separate friendship number". Fading is real absence: no contact, no new rows (AD38). |
| Stardew one gift a day, two a week | No gift cap. The core keeps the newest three rows per person and cause, so a fourth gift only replaces the oldest | A cap would be a limiting line (AD56). RF5's per-channel caps arrive through the core's stack limit instead. |
| Stardew talk +20 a day | Talk counts once a day (the key names the day). A second talk that day still runs and says it changes nothing | No chores (TIE15). Missing a day costs only rows running out on schedule. |
| Stardew 80/45/20/−20/−40 | 8/4/2/−2/−4 (borrowed, divided by 10); talk 2 | Fits the mood scale Dunn's rows use (±6, ±8). |
| Stardew birthday ×8 | ×3, with the run doubled (assumed) | ×8 on a loved gift passes the core's cap of 50 and drowns every other row. |
| Stardew refused and accepted-bad gifts | Refusal writes nothing and gives a reason (not carrying it, Ron elsewhere, a failed save). A disliked gift is accepted and sours | SD-T18, RF5 refusal state. |
| Crush Crush stage counters | Not used | No stage gates in this life. A wrong gift is just a weaker or sour row. |
| Gifts raising the tie | Not done. Ron's affection axis stays with the canon moments | TIE13: trust does not fade by days. The rows are the short-run part. |

## Tastes (SKR21 labels)

Ron, book 1 (Philosopher's Stone):
- **Chocolate Frog:** love. Shown, ch. 6.
- **Famous Wizard card:** like. Shown, ch. 6.
- **Sweets and cakes:** like. Shown, ch. 6.
- **Corned beef:** dislike. Stated, ch. 6. No source of it in this life yet.

Original rows:
- **Peppermint humbug:** neutral.
- **Stewed horned slugs:** dislike.
- **Flask of green sludge:** hate.

His birthday, 1 March, is from the author's website, not the books. It is lead day 213 of each year.

## Checks

| Check | Result | Gaps |
| --- | --- | --- |
| `npm run build` | pass | |
| `node --test tests/social_contact.test.js` | 6/6 pass | Synthetic fixture world, not the pack |
| `npm run check:arch` | pass (main.js −2, no new cycle) | |
| `npm run check:rules` | pass (0 new engine-vocabulary strings) | |
| `npm test` (full) | not run | FRC63: the full suite runs once on the merged result |
| `scripts/playtest/hp-gifts-contact.mjs`, headless 1920×1080, fresh origin, rebuilt bundle `4429cb3d…` | pass, 0 page errors. Route: a household-end save on this build, then the wait to term, the train and the arrival acts by their own buttons (the script writes `hp-gifts-sorted.save.json` and reruns from it). Saved a tart from the house table (listed in Inventory), gave it to Ron, and the row showed under "On Ron's mind lately"; talked twice and got one row, the second saying it changes nothing. Save, reload, Export and Import keep both rows and the tart in Ron's keeping | Route kind: native buttons from a named save. Agent-verified, not human-reviewed. The existing `cross-world-ties.mjs` HP walk now fails at the train (drift in the household arc, not this change) |

## Open (proposals for Weibao, not built)

- **Display gap, fixed in this change.** The HP holdings reader in `book_world_hp_lead_domain.js` now labels the table food too, so a saved tart is listed in Inventory (ITM22). The walk checks it.

- **A "missed you" row after a long absence.** It would add a cost to absence, which is a limiting line (TIE15, AD56).
- **Hermione, Neville and the other school friends.** Their tastes join when they have person records in this life (CX1).
- **Corned beef and the Chocolate Frog trolley.** These need a source in this life.
- **The HP mood reader.** `registerTieMood` for `book.hp.lead.world` belongs to the Mood in Harry Potter session. Until it lands, the household panel's Friends line does not quote these rows; the new panel does.
