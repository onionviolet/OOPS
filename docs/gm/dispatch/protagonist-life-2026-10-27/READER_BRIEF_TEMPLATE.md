# Reader brief (protocol v2, public template)

You are a bounded source reader for YAIRPG. This file and your shard are all you read. Budget: **four turns**
(the first turn holds two parallel reads), then reply.

1. **First turn:** two **Read tool** calls in parallel in the same message (not `cat`; long shell output is
   cut off): this brief, `{{BRIEF}}`, and your shard, `{{SHARD}}`. Paths are absolute.
2. **One call:** write `{{PREFIX}}_scenes.jsonl`, `{{PREFIX}}_census.jsonl` and `{{PREFIX}}_fills.jsonl` in the
   shard's folder with ONE script that builds rows as data (a single python heredoc). Beat ids start at
   `lr.lotm.main.{{BASE}}`.
3. **One call (mandatory):** from `/Users/weiwei/code/yet-another-idle-rpg` run
   `node scripts/lead_run/lint_lead_run.mjs <scenes> <census> <shard>` and, in the same call,
   `python3 -c` to count rows. Do not skip this.
4. **Only if the lint fails:** one fix script, then lint again in that same call. Then reply with whatever
   codes remain. Never reread files you wrote.

**What to produce** (follow the schema card below exactly):

- Scenes: one per place and time span with a goal or a world change; routine actions are `steps` with a
  `class`. Thinking goes in `knowledge`, `motives` (vocabulary only) and `choices`. Mark `pov`.
- Options: the canon choice and the others the text names (S) or a person in his place plausibly could (I),
  each with `needs`.
- Census: **every** mention. Use the "Known names" table: reuse its ids and labels; `nameSource` is `repo` for a
  census id, `wiki` for a wiki label, else `pinyin-unconfirmed`. Copy `zh` exactly as printed.
- Candidates table: every money, time, duration, measure and dotted-name candidate must end up as a census row,
  an anchor, a step cost, a `timeOfDay`, or be skipped with a reason in your reply.
- Fills: for each place the lead uses and each `needs` the text leaves blank, with `layer`, `basis`, `respects`.

**One example row per file** (invented, shape only; copy the structure exactly):

```json
{"schema":"lead-run/1.3","beat":"lr.lotm.main.{{BASE}}","order":1,"pov":"lead","date":{"anchor":null,"offsetDays":null,"value":"date-unsettled","label":"U","note":"how it relates to earlier chapters"},"timeOfDay":{"value":"morning","precision":"band","evidence":"zh 第1章 p2"},"place":"lotm.place.example-shop","deps":[],"steps":[{"verb":"buy","class":"trade","label":"S","time":{"band":"short"},"inputs":["lotm.price.example"],"outputs":["lotm.item.example"]}],"touched":[{"kind":"place","id":"lotm.place.example-shop","status":"missing"}],"present":["lotm.person.example-keeper"],"knowledge":[],"motives":[{"tag":"thrift","locator":"zh 第1章 p3"}],"choices":[{"taken":"buy the cheaper one","options":["buy the cheaper one","buy the better one"],"label":"S","locator":"zh 第1章 p3"}],"options":[{"action":"buy the better one","class":"trade","needs":["lotm.item.example-better"],"taken":false,"label":"S","locator":"zh 第1章 p3"}],"outcomes":[{"fact":"lead.holds.example","value":true,"class":"carried"}],"anchors":[{"fact":"lead.purse","value":-2,"unit":"penny","scope":"lead","locator":"zh 第1章 p3"}],"weight":"routine","footprint":null,"sealed":[],"evidence":[{"label":"S","locator":"zh 第1章 p3","kind":"narration"}],"mechanism":null}
{"schema":"census/1.3","id":"lotm.person.example-keeper","label":"Example Keeper","zh":"<name exactly as printed>","nameSource":"pinyin-unconfirmed","kind":"person","rung":"M1","whereabouts":[{"place":"lotm.place.example-shop","era":"vol1","status":"stated","locator":"zh 第1章 p2"}],"firstMention":"zh 第1章 p2","firstVolume":null,"touchedByLead":true,"aliases":[],"claimant":"narration","note":"Keeps the shop."}
{"schema":"fill/1.3","id":"lotm.fill.example-shop-hours","for":"lotm.place.example-shop","kind":"clock","what":"Opens at dawn, closes at dusk.","status":"authored-proposal","layer":"period","basis":["zh 第1章 p2"],"respects":[],"replaceableBy":"later reading","confidence":"medium"}
```

Rules the last readers broke: `deps` are objects `{id, kind}` naming beat ids in your file; a date `anchor`
is a beat id in your file or `null`; every label is exactly `S`, `I` or `U`; a census row at `M1` needs a
`whereabouts` row (otherwise use `M0`). If the lint fails, its `rows` list names each failing row: fix those
rows only.

**Checklist before replying:** lint passed; every candidate handled; no `org.` ids; labels only S/I/U; motives
from the vocabulary; `zh` literal.

**Reply:** counts per file; lint result; candidates kept / skipped; options taken and not taken; scenes with
hour or minute precision; up to five friction points. No quotes from the source.
