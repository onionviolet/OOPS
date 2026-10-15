# Dialogue, dating and permission

## F4 A preparation choice pays now and matters later

Shown chain in `game/week9.rpy`: `nov_2_bookstore` checks funds, offers a $16 anthology only with sufficient funds and a $4 magazine after the preceding minimum-funds branch. Both subtract real money and record `chose_week9_poem`. Below $4 the player writes instead, adds 3 stress and keeps a different flag. Library, parent and other authored preparation sources are also represented. The preparation branches occupy authored activities, not a universal numeric conversation-time debit.

At the later reading, own writing checks Smart 25. The stronger result adds 1 William point; lower Smart gives a weaker performance. The anthology and some other prepared routes add a point; the magazine can produce adequate performance without that gain. Missing preparation changes the negative relationship counter. `diary_entry_nov_2_poets` derives a corresponding recap. Smart is tested, not spent. Spell knowledge can add contextual understanding without necessarily charging a cast. This is an authored deterministic gate, not a social RNG roll.

## F5 Relationship, refusal and commitment

`week9.rpy:529-593` stores distinct decisions for accepting contact, postponing and ending the Damien route. `flags.rpy:on_damien_path` rejects the ended route, considers later feelings and reads the chosen later path; `week25.rpy:1227` also tests the earlier ending explicitly. Thus later scenes consume earlier facts rather than merely displaying a different line once.

`week16.rpy:dec_20_assembly_choice` offers relationship-dependent responses. Ellen can fail from an incompatible prior scene or nonpositive points-plus-antipoints; Barbara has additional history and numeric conditions; William requires at least 2 positive points and at least 2 net points. Failure sets a `week16_tried_*` flag and returns to the choice, removing that candidate for the current exchange. Success records `chose_week16_path`. These are mutually exclusive authored routes, not evidence for a reusable autonomous dating simulator. YAIRPG should borrow explicit refusal and changed continuation, keeping broader reasonable relationships reachable per world rules.

## F6 Rules can forbid an action that is physically possible

`week24.rpy:1465-1499` enters upper dungeon corridors at night despite uncertainty about permission. Narration says upper corridors have no physical security and official practice sections are locked by class level. The accessible scene is shown in control flow; a universal class-level lock system was not fully traced.

`week19.rpy:1084-1119` refuses a cooking club for supplies and supervision, retaining the response choice and diary consequence. Another proposed outing requires enough paying participants. Permission is an authored decision, not knowledge of cooking or ownership of every room ingredient.

`exam5.rpy:427-480` applies demerits/detention for a destructive failed outcome; `week22.rpy` later reads the detention flag, including cancellation. `week4.rpy:sep_28_detention` is an actual scheduled scene. `gain_merits` caps upward at 50, while failure scenes use cumulative negative thresholds for expulsion. Rules, enforcement and ability should stay distinct. This pass found no general property-title or custody model comparable to P04's ownership state.

## Limits

Not every route or consequence was read. Full reconstructed dialogue with stable labels and conditions is private; public docs paraphrase it. No route ending text is reproduced. No save, game or YAIRPG behavior was exercised.
