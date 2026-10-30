# Luna brief: type ability items (L10, GM26)

You classify existing extracted rule items. You do not read any book. Files you may touch: write exactly one output file. No commits, no web, no edits elsewhere, do not print the data to stdout.

Input: `{IN}` is a JSON array of `{id, name, items:[{k, t, l, src}]}`. Each item `t` is a short extracted statement about one ability (`src` says whether it came from conditions, limits, costs or consequences; `l` is its locator).

Output: `{OUT}`, plain text, one line per item, tab-separated, no header, no blank lines, one line for EVERY item of EVERY id:
`id<TAB>k<TAB>ROLE<TAB>slug<TAB>number<TAB>unit`

ROLE is exactly one of:
- `COND`: a state of the world or user that must hold for the ability to work (a fire at hand, a target within reach, a prepared item, a held potion).
- `BLOCK`: a named state or thing that stops, cancels or defeats the ability (rain, a stunned user, a stated aura, a resistant enemy type).
- `RANGE`: a stated distance or size limit with a number. `DUR`: a stated time with a number. `COUNT`: a stated count or cap with a number.
- `COST`: something spent or paid (spirituality, an item, a price), with a number when one is stated.
- `NOTE`: a story event or description with no usable mechanism.
- `DUP:<k>`: says the same thing as an earlier item `<k>` of the same id (use the lower-numbered one).

Rules: for `COND` and `BLOCK` give a `slug`: lowercase snake_case, one to four short words (at most 28 characters), naming a general, reusable state ("fire_at_hand", "heavy_rain", "target_within_reach", "user_stunned"). Strip names of people, places and one-off details: "Dark Night Goddess holds mist world with multiple doors" is not a slug, it is a NOTE. The same state in different abilities must get the same slug.

`COND` only if the item names a state a game could check as true or false right before the ability is used (something held, near, prepared, known, a body or mind state, a required rank). A statement that only tells who did what, what happened, or how it looked is `NOTE`. Examples: "Works only if the target treats the illusion as real" is COND (`target_believes_it`); "Faster and handier than grafting in small fights" is NOTE; "Offered only; she need not answer immediately" is NOTE; "Effect on high-position beings lasts limited time" is NOTE (no state, no number). For `RANGE`, `DUR`, `COUNT`, `COST` leave the slug empty and give `number` only if the item states one, `unit` as a short word (m, cm, seconds, minutes, days, casts). Otherwise leave number and unit empty. Never invent a number. Balance: an item that says something is needed, required, must hold, works only if, needs, uses, comes from, or starts the ability (a trigger such as a finger snap, a held item, a prior rank or a linked target) is `COND`. Pure narration (what happened, who said what, how it looked) is `NOTE`. A slug must name the specific state in its own words ("finger_snap", "linked_target", "same_tier_target"); never a generic slug such as `required_state`, `condition` or `state`. If you cannot name the state specifically, the item is a NOTE.

Done: the output file has one line for every `(id, k)` in the input. Count lines before finishing.
