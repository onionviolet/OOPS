# T11 worked home-world examples

2026-10-14. All before/after wording below is original proposed copy, including
the before states. None is a quotation of shipped text or implemented gameplay.
World: `base.frontier`; locations reuse native IDs. Example product IDs are
unregistered T11 proposals. [HOOKS](HOOKS.md) provides file:line evidence and
[SIGNALS](SIGNALS.md) the save, deterministic and feed contracts. No new named
NPCs or secret truths are introduced.

## N16. Soap reaches one Village wash point

**Cause:** a capable maker completes a usable soap batch; an actual recipient
receives it and uses it at a Village wash point. Production, distribution and
use are separate receipts. Optional later use at Town farms needs its own
delivery, supplies and recipient cause. Selling a bar in Village does not
automatically spread a method or certify public-health outcomes.

| Surface | Before | After qualified local use |
|---|---|---|
| Village description, SW1/SW5 | “At the wash basin, someone scrubs a work apron against the stone.” | “A pale bar rests beside the wash basin. Someone rubs a greasy work apron against it, then rinses the cloth clear.” |
| Repeatable local answer, SW2 | “I rinse mine twice. The grease usually stays.” | “That bar takes the grease out. I keep it here so the next person can use it.” |
| Town farms daytime variant, only after separate use there | “Workers rinse their hands before opening the lunch cloth.” | “A shared soap bar sits by the water jug. Workers pass it along before opening the lunch cloth.” |

Driver proposal: `ambient.soap.village.washpoint.use = true`, plus an observed
cause; Town farms has a separate place key. Save impact: **new world fact**,
additive absent-is-unknown with no old-save adoption backfill. One authored
variant per place/use state; same saved state reloads the same scene, with the
farm habit gated to daytime. Missing supplies does not create new soap from
text. Whether continued use consumes stock is for the selected consumer owner,
not a compulsory hygiene chore introduced by this example.

Attach through N1 (`src/data/locations.js:331`, `:1105`), or the small N8 line
for Village. A Town farms getter needs a read-only adapter. Zero event-feed
entries. Soap removal of dirt or any health benefit remains a separate functional
consumer; this packet specifies only visible evidence of actual use. T4 H1/H2
keeps one recipient from becoming “the village has modern hygiene.”

## N17. A better lamp lights the lane

**Cause:** an actually built improved lamp is supplied, installed and operating
at one Village lane with whatever fuel/support this local method needs. A home
lamp is not a street network. A prototype, an installed light and changed evening
working hours are different states.

| Surface | Before | After, at the same night window |
|---|---|---|
| Small local atmosphere, SW1 | “At night, the bend in the lane disappears beyond the nearest doorway.” | “A steady lamp picks out the bend in the lane. You can see the stones between two doorways.” |
| Nearby workshop exterior, SS3 | “The workshop door is shut. A thin line of light flickers underneath.” | “The workshop door is shut. A steady line of light lies beneath it.” |
| Habit line, SW5, only after actual later work is supported | “The repair bench is covered before dusk.” | “The repair bench stays open into the evening beneath a steady lamp.” |

Driver proposal: `ambient.lamp.village.lane.state = 'active'`; the separate
workshop/habit needs its own saved consumer. Save impact: **new world fact** for
installation/use; **none** for text projection after that consumer exists. Day
shows the ordinary location/weather text. A saved interruption omits active-light
copy or shows “The lamp at the bend is dark.” Reload uses saved operation status
and native time; it never refuels, relights or rerolls the lamp.

N8 (`src/quiet_place_detail.js:3-14`) is the smallest cosmetic host; preserve
Effects off and keep known operation inspectable in N1/N7. N1 descriptions
cannot imply changed native darkness penalties, NPC schedules or travel safety
unless those consumers actually change. Zero feed entries, no “innovation spread”
toast. T4 H5's complementary-use distinction keeps the evening-work line off
until that particular operation exists.

## N18. A rival copies an observable tool

**Cause:** another capable local maker sees a demonstrated tool, obtains the
necessary materials/means and completes a copy. A specific omitted fitting
detail can explain a looser specimen; do not force every copy to be inferior.
The vendor receives that actual item under a real sale/transfer. No secret
notebook access, NPC omniscience or stock spawned by shop opening.

| Surface | Before | After completed copy and actual shop custody |
|---|---|---|
| Village market description, SW3 | “Small tools hang in a row above the stall.” | “Among the small tools hangs a gauge with the same hooked profile as your demonstrated design. Its stop sits a little loose.” |
| Vendor account, SW2 | “These came from a local maker.” | “A local maker brought that one after seeing the demonstration. The stop needs a little fitting, but it holds.” |
| Explicit inspected provenance, SE5, only with a real distinguishable mark | “A shallow stamp lies near the handle. You do not recognize it.” | “The shallow stamp matches the maker's mark on your earlier receipt. This is their piece, not the one you made.” |

Before proof of exposure, use resemblance rather than “they copied you.” Before
inspection, do not expose maker identity. If the rival makes a fully functioning
or improved copy, replace the flaw with its actually established property. T4
H3 keeps similar independent invention possible; H6 requires a specific missing
detail before claiming poorer function. Appearance alone proves neither theft
nor reduced performance.

Driver proposal: `ambient.tool.village.copy.state = 'stocked'`, backed by
exposure/production/custody causes and player-received account. A fixed authored
tool variant plus real stock is the smaller route. Save impact: **new world
fact** and actual stock; **migration** if arbitrary per-instance maker marks
are chosen. N5's measured-strip stamp is not directly reusable for tools:
`src/world_completion_strip.js:5-17`, `src/world_completion_native.js:41-56`.
An exact new item identity needs a compatible reader and transfer/import policy.

Attach the shop copy to N5 tooltip (`src/display.js:509-520`) and N9 trader
inventory, not a fake purchase row. Ordinary refresh replacement
(`src/components/trader_component.js:69-87`) requires a selected stock policy.
Freeze specimen and wording at completion; shop reopen/reload cannot create a
new variant or copy. Zero feed entries by default. A received distant sighting
could later be one dated record under N14, but this local example claims no
regional diffusion, legal infringement or universal mark recognition.
