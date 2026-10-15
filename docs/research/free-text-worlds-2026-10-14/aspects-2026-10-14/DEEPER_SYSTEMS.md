# Top three deeper systems

Ranked for payoff at the inspected source seams. PROPOSALS only. All paths, revisions and function locators are in ASPECTS.md; the private hash census pins source bytes. Other inventoried modules remain identified or prior-documented, not newly audited.

## DS1 URR inquiry, identity and social closure

The dialogue guide is a rendered instruction diagram, so its knowledge, sleep and politeness descriptions are STATED by the shipped build. first_talking_message actually reads NPC status, appearance and equipment fields; conversation_ending_class_statement branches by profession/status and selects closure text. These demonstrate fact-conditioned delivery without proving all inquiry predicates or topic state changes. Keep profession, perceived identity, knowledge source and conversation willingness separate. A later implementation packet should prove one learned title unlocks a useful question and an NPC cannot answer beyond its evidence.

## DS2 URR chunk persistence

new_save constructs a coordinate key, writes Outside and Buildings via shelve, closes the store, replaces maps with a saved sentinel when appropriate and clears transient building state. new_load reads the pair back. quit_save2 separately retains world/minimap metadata, schedule, time, player and unlocks. new_load_game rebuilds derived path maps and reenters gameplay. This suggests spatial retention plus derived rebuilds; it does not establish crash-atomic publication, migration or whole-world RNG continuation. shelve calls were read as instructions only; no shelf or user save was opened or unpickled. Adapt the separation of retained facts and derived caches, not the serialization format.

## DS3 Progress Quest task horizons and continuation

Dequeue chooses queued scene/fight/sell/buy work; Timer1Timer resolves task completion while quest/plot/XP bars advance on different horizons. SaveGame stores Alea state and game sheet; roster serializes JSON as UTF-8-safe base64 and offers download/file import. LoadGame contains targeted spell-name migration and resumes the timer without using the saved absence stamp for catch-up. This corrects the idea that an automatic web game necessarily simulates offline time. Nested progress can inform YAIRPG desktop panels, but queued outcomes must remain causal and useful rather than automatically substituting new flavor nouns for actual actor lives.
