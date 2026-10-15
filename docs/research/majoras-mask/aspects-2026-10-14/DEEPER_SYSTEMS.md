# Majora's Mask (N64 US): deeper systems

Ranked by payoff for original YAIR work. Prior-documentation status is local to the previous game dossier; no exhaustive search of all other live lanes is claimed. Source inspection does not establish behavior in a running build.

## D1 Message event interpreter

Coverage: New depth beyond the prior exchange example. Locator: `z_msgevent.c:110-141, 368-468, 957-972, 1050-1212; Anju:231-266`. [Source](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_msgevent.c).

A script resumes from an actor-owned position. Commands run until one asks the interpreter to stop; endpoints reset the position. A branch may depend on form, money, quest item, mask, day, switch or callback. Text advancement and speaker focus are explicit operations, and notebook writes are commands rather than string matching. The invalid-command branch assigns a bad length but still indexes the handler table, noted as a bug in this reconstruction. This is a reason to validate original YAIR content, not reproduce unchecked dispatch. Trace a chosen option through the effect and wait boundary, then test refusal and interruption separately.

PROPOSAL owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D2 Flash recovery and reset policy

Coverage: New depth beyond prior carry ledger. Locator: `z_sram_NES.c:425-653, 1430-1475`. [Source](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c).

Cycle reset and flash recovery answer different questions. The reset masks current scene and week state, then clears selected transient fields. Flash validation checks signature/checksum, reads a backup on primary failure and clears data when both are unusable. Neither proves that a corrupt live save can safely be rewritten. For YAIR, keep raw failed bytes, choose a validated compatible backup, and report which epoch was restored. A reset fixture must distinguish successful rewind, disaster rollback, ordinary load and corrupt import.

PROPOSAL owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D3 Notebook event settlement

Coverage: Extends prior two-flag result. Locator: `notebook_table.h; z_message.c:3489-3514; z_play.c:1063-1088`. [Source](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h).

There are 55 actual table rows: 20 people and 35 events. Current-color flags and recorded-history flags are different columns. Queue processing records an event once and only opens the corresponding message when the notebook exists. That prevents UI ownership from becoming the source of truth. YAIR can show previous fulfillment beside current obligations, but its observer projection must not list undiscovered people. Repeated attempts remain possible under world rules; one recorded fact is not a global once-only quest limit.

PROPOSAL owner: `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.
