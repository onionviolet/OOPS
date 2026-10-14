# Parallel systems, unlocks, clocks and reset boundaries

All **shown** locators refer to the pinned readable bundle described in [REPORT.md](REPORT.md). There is no single linear unlock order for every origin.

## Parallel progression architecture

The registry maintains a main path and an active path list. Each descriptor supplies its realms, stages, advancement predicates, stat contribution, lifespan contribution, effective-realm conversion, default state and reset behavior. Earned secondary flags activate a path; stat calculation folds active contributions into one accumulator. Secondary lifespan is summed separately. Peak realms are recorded before reset. L122975-123087, L123163-123237.

| Registered method | Main distinction or earned secondary flag | Locator |
|---|---|---|
| Qi | Nine stages; normal/active-energy route | L123163-123237 |
| Demonic | One stage and no normal qi gathering | L126738-126812 |
| Sword / spear | Custom names, requirements and major trial indices | L129290-129325, L274739-274832 |
| Body | `bodyRealm` | L130051-130120 |
| Inner arts | `neigongRealm` | L130501-130570 |
| War | `warCultivation` | L130963-130982 |
| Bulwark | `bulwarkCultivation` | L131425-131444 |
| Kingdom | `kingdomCultivation`; derives tier from sect karmic energy rather than a normal stage advance | L131764-131856 |
| Intent | `intentCultivation` | L132278-132297 |

This pass read the joining architecture and selected producers. It did not exhaustively validate each late method's balance or every possible combination.

## Useful unlock order, with branches

| Entry or milestone | What opens | Evidence |
|---|---|---|
| Origin selection | Different cultivation methods, weapons and quest lines. Catalogue includes ordinary, chosen, demonic, sword, spear, palm, beast, fist, berserker, guard, elementalist, sound and deity entries. | shown L123257-124590; existence is not immediate availability |
| Chosen origin, effective realm **2** | Meridian quest's actual predicate. Its prose says Golden Core, which is index 5 in the normal table. | shown L272143-272180; text/predicate mismatch |
| Effective realm **5**, normal route | Voluntary rebirth; alchemy unlock | shown L80008-80042, L81033-81035, L101404-101414 |
| Elementalist origin, effective realm **5** | Develop dantian, release innate slots and enter node setup | shown L272182-272215, L268165-268180 |
| Effective realm **6** | World map gate | shown L164507, L234149-234155 |
| Obtain a sect flag | Own-sect access, followed by institution/ownership-dependent progression | shown L59870-59895 |
| Ordinary origin, effective realm **12** | Dao Spirit quest | shown L272074-272112 |
| Ascend a weapon to **10** | First soul-weapon slot; later distinct milestones add more, capped at ten in this source | shown L155840-155974 |
| Effective realm **26** | Legends gate | shown L234235-234238, L234374 |
| Effective realm **49** | Legacy gate | shown L112739-112753, L112803-112813 |
| Grand Dao and further mastery/stat requirements | Ascension/global quest sequence rather than an ordinary rebirth upgrade | shown L272631-272705; late reset details remain a coverage gap |

The build's Heaven Chosen action description mentions Chaos realms, while its breakthrough guide mentions Dao Seeking and standard handling resets battle completion from effective realm index 9 onward. This is another text/rule discrepancy, not a reason to substitute the page's order for predicates. L15590, L16233, L140715-140718. Exact special battle eligibility is not fully audited here.

## Rebirth settlement

Pending SP sums active cultivation path contributions. Per mapped normal realm, rewards start at index 5, increase with distance and category, and are modified by the soul law. Trial bonus and Origin Power affect the multiplier at settlement. Quest completions and peak-deity achievements encourage crossing origin routes over several lives. L136641-136706, L81008-81035, L81193-81243; Origin Power description **stated** L17895.

| State family | Reset or carry | Evidence |
|---|---|---|
| Qi / celestial qi, age, base combat stats, current action and current realm/stage | Reset; stage returns to 1, realm to 0, action clears | L81051-81069, L81078-81095 |
| Active secondary path state | Descriptor reset, removed from active list; earned flags may restore access afterward | L81078-81091, L123006-123019 |
| Trial total bonus and vessel life values | Reset; vessel setup becomes pending | L81097-81108, L81170-81175, L93285-93291, L140777-140779 |
| Soul power, total soul power, rebirth count, peak records | Kept/updated before life reset | L81030-81032, L81049, L81177-81202 |
| Proficiency points | Converted into talent before life points reset; conditional sword modifier exists | L81108-81122 |
| Quests | Completed IDs retained; active/progress objects cleared; several crafting/quest unlocks survive rebirth | L81123-81129 |
| Spirit stones, generic inventory, cultivation/battle manuals | Conditional retention through legacy or explicit keep settings | L81054-81061, L81126-81137 |
| Ordinary weapon inventory | Rebuilt with disciple/clan, special-form and god-slot exceptions; heirloom copies have dedicated handling | L86850-86888 |
| Soul weapon slot unlocks | Completed milestone quests and max-slot state persist; ten-slot source cap | L155840-155974; page also states cross-life weapons |
| World map / institutions / bosses | Some subsidiary reset handlers run, pending invasion aborts, world bosses lose defeated status. A blanket everything-kept claim would be wrong. | L81039-81049, L81165-81175 |

A UI receipt is useful, but this static pass does not establish save/import behavior or complete alias safety for persistent item objects. The conditional retention branches above matter more than marketing's permanent-carry shorthand.

## Offline and parallel time

The clock accepts a speed, computes from a fixed 1,000 ms tick, scales simulated days, and separates game days from action days via a law time factor. It writes the current timestamp but does not subtract the previous one. The main timer runs at a 1,000 ms interval and routes action days to work. Load resets the timestamp after applying state. L81730-81767, L80918-80948, L337282, L337424-337438.

**Inferred:** the traced public browser path offers running idle work, not closed-document elapsed replay. Hidden-tab callbacks are browser-dependent and were not measured. Daily missions are **stated** online-only and do not establish offline simulation (L16402). No backend was queried and no account used.

For YAIRPG, keep ordinary action time, world time, absence policy and retry/choice boundaries distinct. Offline replay is an implementation option with its own proof, not something to infer from save timestamps.

## First ascension differs from rebirth

**Shown:** the ascension tab opens at Grand Dao or after a recorded prior ascension. Mastery checks every required origin's registered quests and the corresponding permanent weapon intent. The next gate requires that mastery plus the infinity-stat condition or its completed quest, followed by the saint-dialogue flag. `canAscend` also excludes a prior first ascension. The first-ascension handler sets count to one, unlocks the infinity boundary, clears the action and applies origin-specific form rewards. It does **not** invoke the ordinary rebirth reset in this handler. L65993-66111. The global quest descriptions enumerate ten required origin lines and eight permanent intents, L272631-272705.

Therefore first ascension is a mastery/cap transition with form-specific rewards, while normal rebirth is a repeated SP settlement and life reset. Later ascension progression and each transformation's nested effects remain separate gaps; do not infer a general repeated ascension reset from the count field.
