# Three deeper systems

Selected by potential use in existing YAIR people, knowledge, objects and growth owners. D1–D3 lacked a dedicated mechanism digest in the prior passes, although hooks were already mentioned. Shown means managed bodies directly read; all takeaways are original PROPOSALS. No runtime behavior, economy tuning, visual acceptance or save compatibility was tested.

## D1: Information has a life and a transmission route

Sources: `deep:InformationDomain.cs:ProcessSecretInformationAdvanceMonth`, PlanDisseminateSecretInformation, ReceiveSecretInformation, MetabolismSecretInformation; `new:GameData.Domains.Information.SecretInformationProcessor.cs`. Transfer alone was documented before; circulation and consequence were not.

The system distinguishes an occurrence, a sourced information instance, an actor's known secrets and its holder cache. Monthly processing makes settlement information, plans dissemination for known-secret actors excluding Taiwu, clears specialist collection caches and metabolizes information. A source character is not necessarily the event's actor or the current holder.

Planning rejects missing/invalid-location actors, non-diffusible information and rows without AutoDissemination. It calculates an actor/personality-dependent threshold, grades the information's spread likelihood, shuffles and ranks by likelihood, configured sort and diffusion speed, then evaluates nearby receivers. Telling about oneself uses different behavior/personality modifiers from telling about another person. Friendship, enmity and relation to actor/reactor alter rates. Reception depends on source institution/rank, receiver personality and directed relation. UsedCounts and completed speaker/receiver/information indices bound a particular month's processing. These source limits are not recommended global once-only rules.

ReceiveSecretInformation rejects broadcast occurrences, nonexistent/infant recipients, an already-known exact instance and another known instance of the same occurrence. A changed source route can create a new sourced information instance while retaining occurrence identity. Accepted reception resets use count, records knowledge and registers the holder; the source can receive authority. This is a causal attributed-knowledge system, not global player omniscience.

When holders reach a configured MaxPersonAmount, MetabolismSecretInformation calls MakeSecretBroadcast. Broadcast or expired information is discarded from private holders; an in-broadcast occurrence gets separate retention treatment. SecretInformationProcessor maps actors and relation indices to effects including favor, happiness, enmity, alertness, fame and institution punishment. Full effect-row semantics and all private/public revelation exceptions remain unread. A class/method named TuringTest here is not evidence of a language model.

PROPOSAL: attach a person's belief to an occurrence, source, route and received date; spread or public disclosure then affects only the actors who learned it. Owner: CHARACTERS_AND_WORLD_EVENTS.md and ENGINE_EXPANSION.md knowledge/observation channels. First proof: one witnessed act reaches two people by different means, changes one justified relationship and survives reload/import without making uninformed actors know it. Keep YAIR altered truths sealed through their discovery routes.

## D2: Book exchange is a custody transaction

Sources: `new:GameData.Domains.Merchant.MerchantDomain.cs:SettleTrade`, CreateSkillBookTradeInfo, ExchangeBook, FinishBookTrade, ChangeMerchantCumulativeMoney; `deep:EventHelper.StartExchangeBooksByFavor/ByApprove`. This extends the former unread trade-settlement gap at backend level. Frontend valuation and every guard remain partial.

SkillBookTradeInfo holds actor ID, private/sect library lists, books bought from Taiwu and books sold to Taiwu. GetTradeBookDisplayData selects the private or sect pool according to the isFavor route; this is distinct from the main conversation's directed-favor/permission predicate. The selected dialogue routes wait for ExchangeBookComplete rather than silently treating the display as settlement.

ExchangeBook removes library ownership from purchased books, adds them to the player's chosen item source, adjusts staged library lists and grants category-specific profession seniority. Sold books leave the player's custody without deleting the item and gain NPC library ownership. It writes both actors' authority totals from provided arguments. FinishBookTrade removes temporary library ownership from newly bought NPC books, puts them into NPC inventory, reconciles the remaining library and clears the session object. A finished display, an exchanged item and a reconciled library are separate boundaries. Atomic/crash-safe settlement is not established, and authority arithmetic supplied by frontend/caller still needs its own trace.

General SettleTrade processes item-source changes, buyback data, merchant/source-type money and trade completion flags. Dealer progression uses cumulative traded money and a conversion curve; the current ChangeMerchantCumulativeMoney clamps progress to a configured full-favor total, can apply an equipped profession multiplier and emits achievement stats at the cap. The obsolete direct-favor helper should not be mistaken for the current transaction path. Caravans and seasonal refresh exist, but full stock generation and price behavior were not semantically read.

PROPOSAL: separate access to an institution's library from actual ownership, knowledge and exchange settlement. Owner: ENGINE_EXPANSION.md item/custody/action transactions and SKILLS_AND_TALENTS.md manuals. First proof: trade a physical copy, retain learned pages, expose the correct owner/library stock after close and restore the exact result through reload/import. Provide alternate acquisition routes rather than requiring one trader.

## D3: Careers reward lived practice and unlock functions

Sources: `deep:ExtraDomain.cs:InitializeProfessions`, ChangeProfessionSeniority, ConfirmExecuteSkill, OnProfessionSkillUnlocked; `new:GameData.Domains.Taiwu.Profession.ProfessionData.cs`; Config.Profession and ProfessionSkill. Numeric-constructor counts19 professions/76 skills are structural; they include source-specific special content and do not establish19 ordinary available jobs.

ProfessionData persists TemplateId, Type, Seniority, ExtraSeniority, skill cooldown dates, HadBeenUnlocked, LearnedSkills and typed SkillsData. Present threshold unlock, learned skill, historical reveal and cooldown availability are separate checks. IsSkillUnlocked uses a skill's seniority requirement; IsSkillLearned reads a separate bit; cooldown uses world date unless an explicit context bypass is active.

Extra.InitializeProfessions creates missing career records and their skill data; ComplementProfessions adds records/slots introduced later. ChangeProfessionSeniority requires world function27 and a registered profession, computes positive gain modifiers from seniority factor, world setting and facilities, ignores negative deltas in this path and normalizes seniority. It grants information/use-count changes on progression, tracks newly unlocked skills, emits notifications/display events, records historical unlock state and updates achievement checks. A special extra-unlock check occurs at3000000 seniority; this is Taiwu tuning, not a proposed YAIR ceiling.

ExecuteActiveProfessionSkill asserts unlock, eligibility and active trigger before dispatch. ConfirmExecuteSkill invokes executed/active hooks only if finished, then resumes a named event/animation listener with the finished result. Availability, user choice, execution and completed effect are not interchangeable. The complete76 skill implementations, consumed costs and all career acquisition/reset routes remain unread.

PROPOSAL: let ordinary world-fitting practice open a useful function while retaining separate competence, permission and learned use. Owner: SKILLS_AND_TALENTS.md, TECHNOLOGY_AND_PROGRESSION.md and engine skill/action contracts. First proof: a mundane activity earns attributed progress, an unlocked function changes one real action and repeat improvement remains possible through appropriate routes. Do not impose every career or an extra prestige layer on the first milestone.

## Remaining deeper candidates

Combat interaction/effect breadth, legendary-book rules, making/repair/poison, full heredity/population, prison/treasury policy and cricket/chicken mechanics are found in metadata but not deeply traced here. The inventory keeps exact identifiers so a future selected question can reach the source without repeating a whole-build search.
