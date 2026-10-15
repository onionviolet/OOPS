# School and spell flow

Evidence paths below are relative to work `extract/`, mirrored privately under `private/fs-magical-diary/decoded/`. All findings are shown in reconstructed code unless marked stated or inferred.

## F1 Plan and learning

`game/wolfhall.rpy:standard_scheduler` resets a five-entry weekday dictionary and applies authored locks. `classes.rpy:pop_next_activity` consumes entries in index order. The scheduler cannot continue until five entries exist. First-week introduction requires all five color classes (`week1.rpy:575`); that is an authored onboarding constraint, not a generic curriculum requirement for every week.

`classes.rpy:classroll`: below 10 stress returns a uniform integer 1..2. Otherwise draws inclusive 0..100; failure is `roll < stress - white/4`, using the shipped Python 2 arithmetic. Surviving that gate returns 1..2. Matching class charm adds one only to a nonzero result. Successful red/blue class gains equal color skill and stress; failed sessions gain no color and +2 stress. Other class branches are present but individual special scenes can override their flow.

`study_roll` gives 2 below stress 10; otherwise success requires inclusive 0..100 draw strictly greater than stress. `do_study_roll` calls this helper and then repeats the draw, overwriting the first result. The second result is the effective decision while the first still consumes RNG. Do not multiply probabilities or mistake the helper for the only roll. Success adds 1 Smart and 2 stress, failure adds only 2 stress. `gain_smart` clamps base Smart 0..100. `MagicalDiaryCharacter.RecalcStats` rebuilds effective Smart from base plus equipped item Smart. `dungeon.rpy:2442` refills MP to effective Smart. Study is thus useful combat/exploration capacity, not a separate exam-preparation meter.

Homework search found narrative mentions, including a refusal excuse in `week5.rpy:1086`, not a dedicated submission ledger. This is a bounded negative finding, not proof that every authored school task is absent.

## F2 Learning reaches a consumer

`classes.rpy:learnt_cutscene` scans class spell lists in order. All five effective color stats must meet a spell's thresholds; already-known spells are skipped; a nonempty `limit_class_learnability` restricts the class source. It returns the first eligible unknown spell. `magic_class_after_roll` requires a successful class roll, plays the named learning scene, displays a spell card and appends the spell class to `player.known_spells`. Merely having enough stats does not append every eligible spell automatically.

Concrete trace: `modules/wolfhall.py:Breeze` requires Red 1, costs 1 MP and targets the current cell. Its handler determines airflow and emits sensed wind information; it is a real environmental query, not merely a learned label. The spellbook renders known spells (`game/spells.rpy:spellbook_core`), sorts by color/cost/name and supplies quick slots. `cast_spell` first checks dungeon action availability, then MP and spell-specific `CanTryCast`; target modes schedule delayed operations. `zapped` advances the action presentation/tick; delayed handlers call `spell_fizzles`, which rechecks MP and deducts the cost before checking anti-magic. An environmental fizzle can therefore consume MP. Matching color charms halve MP cost rounded upward (`wolfhall.Spell.Cost`). Event scripts also test known-spell membership, e.g. Communication in the poetry scene and Spark in `week24.rpy:472`. Those script tests are not proof every event deducts MP.

No equal-outcome teacher-versus-manual acquisition route was established in this pass. The source contributes the acquisition-to-application join, not the whole P03 contract.

## F3 Exams assess performed acts

`week4.rpy` enters a real dungeon, retains `exam_result`, then awards 5 merits for success and distinguishes escape methods. It can warn on destructive behavior based on damage evidence. `exam1_give_up` can refuse surrender while `exam1_winnable()` still reports options; one intervention is remembered by `exam1_quit_prevented`.

`exam5.rpy` separates retrieving the objective from earning magic credit: a physical solution can finish but receive no merits; magic success earns 5. Destruction of a key portal can yield -10 merits and detention. `exam7.rpy` separates retrieving/escorting a character from injuries, including a further 5 merits for an uninjured outcome. Failures can check accumulated merit before expulsion. These are sampled authored outcome policies, not a single statistical exam roll. Dungeon combat and spell effects may have their own RNG; every formula was not audited.

YAIRPG proposal: retain objective result, demonstrated method, side effects and institution response as separate facts. Do not force every world to punish a valid physical method or deny a player's reasonable surrender.
