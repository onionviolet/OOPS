# Potion crosswalk: book rows vs fan-wiki table (PZ-L6, 2026-10-24)

Scope: 69 joined pairs from the private crosswalk scan. Book rows were extracted by Haiku, so
small errors are possible. Judgments are paraphrased. Per-pair detail is in the private
`crosswalk_judged.jsonl` (census-2026-10-19/formula-scan-2026-10-24). Findings here are not
accepted decisions.

## Counts

| Verdict | Pairs |
|---|---|
| AGREE | 25 |
| BOOK_PARTIAL | 21 |
| NOT_COMPARABLE | 12 |
| WIKI_PARTIAL | 8 |
| CONFLICT | 2 |
| BAD_JOIN | 1 |

The 12 NOT_COMPARABLE rows are brewing steps, substitutes or guesses. No pair contradicts an
ingredient identity; both conflicts are single quantities.

## Conflicts and bad joins

| ID | Potion | Seq | What differs | Likely right side | Book locator |
|---|---|---|---|---|---|
| X1 | Priest of Light | 5 | Rock water: 10 ml in the book row, 7 drops in the wiki. | Book. The wiki repeats the 7-drops figure from the citron juice line directly above, and the other liquid aux use ml. An early partial copy (0142p39) gives no figure, so it cannot decide. | [0706p67]-[0706p72] |
| X2 | Unshadowed | 4 | Sun divine bird blood: 60 ml in the book row, 100 ml in the wiki. | Unclear, slight lean to the book. The book row is a direct recital and the wiki cites the same chapter, so one side misread a number. Recheck the source page before using either. | [1064p33]-[1064p36] |
| X3 | Spectator (joined) | 9 | Book row is the Manipulator Seq 4 formula (elder mind dragon brain, tree mentor heart, 10,000-person gathering), not Spectator Seq 9. | Wiki. The same book content joins correctly to wiki Manipulator (pair 56, AGREE). Drop this join. | [1085p69]-[1085p73] |

Sequence flag (not a conflict): book rows for Clown carry Sequence 7 against the wiki's 8
([0105p29]-[0105p31], [0170p24]-[0170p25]). Mains, aux and quantities match the wiki exactly, and
the rest of the Fool pathway (Seer 9, Magician 7, Faceless 6) places Clown at 8. Treat the book row's
label as an extraction error from 0219p15 and check that line.

Low-confidence joins that still look fine: Pleasure (0202p50, name inferred from a later recital)
and Secrets Sorcerer (1333p5, pathway label inferred from a character's own path). Ingredient and
ritual matches support both.

## Book-only facts the wiki lacks

Brewing procedure:
- Clown order: distill water, black iron pot, aux in order, rose, then horn crystal [0170p27]-[0170p38].
- Faceless order: blood, aux, hairs on the surface, pituitary dropped in without touching [0461p9]-[0461p23].
- Miracle Invoker: iron cauldron, blood first, then the two worms; mixture darkens and glows [1306p65]-[1306p72].
- Miracle Invoker alternative: dissolve an Attendant trait in an iron pot for 3-4 days first [1284p45]-[1284p46].
- Scholar of Yore: blood, frost crystals, fog-wolf heart, then feed in records until a dark red mass forms [1170p6]-[1170p15].
- Sage: forehead ornament crushed with a pale item; aux partly from a wind-bodied creature [1349p11]-[1349p13].
- Ocean Songster: aux mixed in a wide-mouthed metal bottle with a jellyfish-like item [0740p46]-[0806p47].

Ritual details beyond the wiki text:
- Scarlet Scholar: vampire higher-ups can hold the ceremony free [1039p16].
- Silver Knight: remains are placed, brewed and chanted in the giant tongue [1209p73]-[1209p74].
- Dreamwalker and Manipulator: venue choices and drinking context [1045p15]-[1045p21], [1221p59]-[1221p70].
- Priest of Light: a living Sun user may vanish in pure darkness, so the ritual needs a workaround [0706p67]-[1020p11].
- Mysticologist: Fate-path blood eases the later Seq 3 promotion [1041p58].

Substitutes and alternatives:
- Hunter: a jelly from a dead user may replace the main [0243p31].
- Gatekeeper: swap to a Warrior path Seq 4 as a cover story [0222p33]-[0222p34].
- Traveler: a leftover trait can replace gathering the main [1108p1].
- Fool: a digested puppet made from a split-off body as the main [1398p24]-[1398p27].
- Judge: a crushed and regathered artifact as the main [1067p17]-[1067p24].
- Miracle Invoker: another Miracle Invoker's trait as an alternative main [1204p91]-[1204p94].
- Unmatched book rows: general dead-Beyonder remains [0209p14], [0214p51], [0221p48], [0403p53]-[0403p54]; two unnamed rituals [1168p29]-[1168p35], [1252p28]-[1252p34].

Seq 0 and 1 mains (Klein's inference or narration; wiki main empty): Black Emperor
[0412p76]-[0412p80], [0758p17]; Red Priest [0758p22]-[0758p25]; Attendant of Mysteries
[1205p29]-[1205p31], [1330p9]-[1330p13]; Fool [1330p14]-[1330p24].

## Trust verdict

The wiki table is a sound catalog layer for ingredient identity and rituals: no pair showed a
wrong ingredient, order or ritual, and the 25 full agreements include many quantity-level matches.
The only mismatches are two quantities (X1 probably a wiki slip, X2 undecided), so treat exact
amounts as a draft until both are rechecked against the source text. Weak spots are structural: the
wiki has choose-one groups that the book extraction flattens, empty main fields at Sequence 0 and 1
where the book gives only inference, and one book row (Spectator) that was joined to the wrong
potion. The 21 rows the book only partly shows are unrefuted but unconfirmed. Brewing steps and
substitutes have no wiki home, so the catalog needs a separate procedure layer for them.
