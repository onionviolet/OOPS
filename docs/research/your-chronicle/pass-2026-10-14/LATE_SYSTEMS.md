# Late systems and ordinary work

Fresh shown data comes from the tables and IDs in [coverage](COVERAGE.json).
Installed Help statements below are authored explanations, not native or runtime
proof. Source caps and monetized shortcuts are observations, not YAIRPG proposals.

## Food remains connected to making things

Shown `fishing` has duration parameter 10, ongoing Action cost 0.4, yields one
Fish and permits Sloth. `makeGrilledFish` requires its recipe, costs two Fire,
one Fish, one Salt and four Firewood, produces one Grilled Fish, and declares
`CanWorkOffline=TRUE`. `eatGrilledFish` spends one dish, adds whole value 5,
and declares linear increments for physical/magical attack and magical defense.
Help says repeat eating raises category costs by one. The initial row cost is
not the full price function. No seconds-per-fish benchmark was measured.

Bread similarly joins wheat, fire, firewood and baking to defense. Late potion
food is explicitly gated by Potion Glutton. Elixir production requires MP,
Spirit Water, Dragon Claws, Mandragora, five Potions, five Holy Water and a
Goddess Blessing, has duration parameter 40 and an ongoing Action cost. Its
food use consumes the same crafted resource used in the previously traced
rescue. This is a concrete competition over a useful output, not two unrelated
menus. No exact optimal production strategy is claimed.

Gluttony Help states that food effects remain after Dark Ritual, while current
Satiety and category prices reset and 10% of current Satiety raises Max Satiety.
Its authored multiplier formula shows slower growth beyond capacity. The
printed formula includes a square root of current minus maximum even below
maximum; the piecewise/clamping native implementation is unread. Do not directly
copy that typography as executable code. YAIRPG's accepted comfortable unfed
ordinary play and no hunger death remain the authority.

## Research has multiple useful destinations

All 22 Greed rows were read. Regional rows consume a group of six monster
research types using `AnyResearch`. They target Inspiration, instant output,
offline factor, dungeon reward, drops, loop output, crystal conversion, main
routine speed, elemental capacity training, seeds, formation-point capacity,
Envy's EPoint3 output and Will training. Rare rows consume special research for
EXP, rare spawn chance and initial Talent. Five Guardian rows each target
Inspiration output. Effect method families include Log, Linear and Power;
parser constants are recorded in private selected rows, not treated as complete
validated formulas.

Help states examination prices increase by 1000 and effects generally diminish.
It says 20 categories, while the table has 22. This could be stale Help or a
runtime eligibility distinction; no speculative reconciliation is selected.
The prior summoning trace confirms research also buys ally Level/Luck. Therefore
examination competes with combat/collection investment over the same stock.

## Voluntary limits feed future ordinary play

Twenty selected Pride rows show basic and one-Habit/no-Gluttony challenges for
all or some ending targets. Availability combines prior ending counts and
purchased awakenings. The one-Habit rows declare stats, Habit efficiency and
Sacred Ritual rewards; no-Gluttony rows declare stats, Gluttony effect and Dark
Ritual rewards. Specific rewards include Habit capacity and resource drop amount.

The nine translated restrictions disable Gluttony, Greed, Envy, additional
effects, Dark Ritual, Alchemy or Wrath; cap usable Habit at one; or slow loop,
dungeon reset/floor change and attacks. These are different ways to force a
new plan. Help says reserve for the next reincarnation and cancel if infeasible.
The reservation consumer and `SpecificRewardNum` parser remain unread. Values
`55`, `555`, `5555` are not explained as literal clear counts here.

## Envy and Wrath split durable capacity from current benefits

Help states Envy unlocks three initial routines, later ones cost 10 Complaints,
and speed levels never disappear. Current routine levels reset on reincarnation
and slow in benefit growth after level 100. Three strategies each cover seven
routines. The current strategy doubles effects; unchosen strategies grow faster
with elapsed ritual time. Choosing the next strategy waits until a reset. This
is a capacity/progress/commitment split, not proof of three new prestige layers.

Wrath Help states both defeated enemies and the defeating ally contribute EXP;
1000 EXP becomes one point. All nine personalities share increasing investment
cost. Respec refunds half, or all using Wrath Point+. Quest speed/completion,
party damage/defense and passive effects compete for that pool. Passion improves
speed while reducing damage and defense. Stress sums square roots over each
personality's aggregate ally levels, favoring spread for this specific output.
The exact reset boundary, allocation algorithm and live gains were not read.

## Alchemy remembers work while renewing choices

Help states Mix Score survives reincarnation. Repeated identical ingredients
face diminishing contributions. Transmutation needs at least 5M score and a
20-hour interval, resets ingredients/score, and produces a random type/rank.
A five-slot tablet grants orb effects and combination arrays. Smashing an orb
creates typed Dust for Tarot, trading its slot benefit for a different use.

Tarot deals three random cards, allows one paid choice, returns picked cards to
the deck, and permits selecting the opposite orientation at twice the Dust.
There are 22 identities, two fixed orientations each. Pick count renews at
reincarnation while gained effects remain; growth slows after 100 enhancements.
Ruby-based extra transmutes/allowance recovery are stated separately. Exact
rank distributions, retention fields and duplicate/stale transaction behavior
remain native gaps. The transferable idea is a lasting workshop fed by the
current life, not an obligatory monetization design.
