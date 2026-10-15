# Blockers and competing stock

Shown source: `JobFailReason`, `FloatMenuOptionProvider_WorkGivers`, `WorkGiver_DoBill`, `BillStack`, `Bill_Production`, `RecipeWorkerCounter`, `Dialog_BillConfig`, `StoreUtility` in the reusable decompile.

## Failure construction

1. The work-menu provider clears static last reason/custom job/silent state for each giver. A scanner can suppress the row through ShouldSkip before requesting a job.
2. It calls HasJob and concrete JobOnThing. A null result with no last reason disappears. A reason yields disabled text; the custom bill label can replace the generic target description.
3. If a job exists, menu-specific checks name missing health capacity, disabled/unassigned work, already-running work, research policy, forbidden area and no path. These are ordered, first-matching checks rather than an exhaustive report.
4. Bill startup silently returns null for several table/fuel/reservation/burning cases. Per-bill checks can set skill, medical legality/reserver or waste-container reasons. Ingredient searches collect a missing list only during manual menu construction; autonomous failures back off the next scan.
5. The ingredient text identifies required ingredient categories/unique items. It is truthful as search failure, generic as root cause. Several bills share one last-reason slot; do not interpret it as a stable typed per-bill explanation history.

The medicine exception checks whether missing requirements could allow industrial medicine, then whether usable medicine exists under the patient's medical-care category. It is not a general diagnosis of every denied ingredient.

## Allocation

A bench scans its ordered bills, skipping suspended, satisfied, wrong-worker, low-skill or currently delayed entries. First successful job construction wins that scan. Another bench has its own list and actor scheduler; there is no global bill-priority allocator in this path.

Usable ingredients must satisfy recipe and bill filters. Candidate stacks are spawned, within radius, not forbidden and reservable, then found through traversable regions and local reach checks. No-mix groups counts by material definition and chooses one definition per requirement, subtracting already chosen units. Mixing sorts by ingredient value and distance, accumulating value across allowed stacks. Its overlap behavior across multiple requirements was source-read but not executed; it is not a safe universal allocation algorithm to transplant.

Reservations claim candidates for work; they are not consumption or a permanent bill ownership share. Storage priority changes where hauling puts goods and therefore distance/access, but the production predicate does not reject a material simply because its stockpile has high priority.

## Stock target and quote

Target mode counts existing eligible outputs, not lifetime completions. Optional hysteresis pauses at `targetCount`, resumes when count reaches `unpauseWhenYouHave`, and otherwise retains the pause. A batch can overshoot a target. Quantity meanings depend on the selected counter branch; see REPORT correction.

Bill UI displays current/target, include-equipped/tainted, count-from group, health/quality ranges, allowed stuff, ingredient filter and radius. Output storage destination and count-from group are separate selectors. It quotes recipe ingredient requirements, not all alternate consumption routes against shared stock.

YAIRPG proposal: retain free, held, consumed and completed stock separately; render a known blocker from the current owner. Quote two destinations together without importing spatial hauling or RimWorld's single mutable failure string. Recheck the displayed token before spend.
