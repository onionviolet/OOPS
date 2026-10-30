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

Rules: for `COND` and `BLOCK` give a `slug`: lowercase snake_case, 2 to 40 characters, naming the state ("fire_at_hand", "heavy_rain"); the same state in different abilities should get the same slug. For `RANGE`, `DUR`, `COUNT`, `COST` leave the slug empty and give `number` only if the item states one, `unit` as a short word (m, cm, seconds, minutes, days, casts). Otherwise leave number and unit empty. Never invent a number. When unsure between COND and NOTE, choose NOTE.

Done: the output file has one line for every `(id, k)` in the input. Count lines before finishing.
