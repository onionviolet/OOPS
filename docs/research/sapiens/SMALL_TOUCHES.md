# Small touches, all PROPOSALS

No implementation claims. Reuse the existing owner, stock and disclosure routes.

| Code | Touch | Donor evidence | Packet |
|---|---|---|---|
| T01 | Show required and available input count together | `hubUIUtilities missingResources` | P01 |
| T02 | Name missing tool category with one known example | `hubUIUtilities missingTools` | P01 |
| T03 | Say no allowed worker rather than no learned skill | `planManager getIsMissingRequiredSkill` | P01/P04 |
| T04 | Name the missing kiln or campfire | `hubUIUtilities missingCraftArea` | CH |
| T05 | Explain an intentional stock-target hold | `maintainQuantityThresholdMet` | P01 |
| T06 | Show distance separately from role assignment | `hubUIUtilities tooDistant` | P01 |
| T07 | Expose a known missing light condition | `planManager tooDark/needsLit` | P04 |
| T08 | Separate path failure from missing means | `planManager inaccessible` | P01 |
| T09 | Keep learned state when role is turned off | `skillState versus skillPriorities` | P03 |
| T10 | Keep tribe method and actor mastery distinct | `serverWorld versus serverSapienSkills` | P03 |
| T11 | Show earned investigation progress on resume | `serverWorld cancelDiscoveryPlanForTribe` | RT |
| T12 | List the useful newly unlocked actions | `discoveryUI getUnlockedConstructablesForDiscovery` | RT |
| T13 | Offer investigation on stored evidence too | `planHelper availablePlansForStorageAreas` | RT |
| T14 | Name which stage needs a worker | `craftable versus evolvingObject` | CH |
| T15 | Show wet, dry and fired as useful intermediates | `evolvingObject and craftable vessels` | CH |
| T16 | Keep drying progress through inventory movement | `serverGOM conversion fields` | CH |
| T17 | Show coverage changing the declared stage rate | `evolvingObject coveredDurationMultiplier` | CH |
| T18 | Prefer uncovered drying and covered spoilage storage | `evolvingObject categories` | CH |
| T19 | Return empty containers visibly | `craftable breadDough` | CH/P02 |
| T20 | Retain the input container variant in filled outputs | `craftable hulledWheat/flour` | CH |
| T21 | Put active actor action beside plan blockers | `orderStatus plus hubUIUtilities` | P01 |
| T22 | Use time/distance conditions for small social barks | `social greeting functions` | A01 |
| T23 | Tie tutorial steps to actual completed counts | `serverTutorialState` | A10 |
| T24 | Do not duplicate the same blocker text | `hubUIUtilities repeated shallow-water branch` | P01 |
| T25 | Queue breakthrough notices instead of dropping simultaneous ones | `discoveryUI showNextDiscoveryInQueue` | A06 |
| T26 | Keep text labels separate from stable content IDs | `typeMaps and locale` | A07 |
