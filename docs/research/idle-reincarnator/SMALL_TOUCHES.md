# Small touches

All T entries are inferred YAIRPG PROPOSALS. The source column points to shown mechanisms or a stated intention, not observed layout. No rates, art or prose are copied. Desktop/laptop first; knowledge hints must respect discovery and sealed facts.

| Code | Proposed touch | Packet | Source locator under res://models or Scenes/assets |
|---|---|---|---|
| T1 | Carry categories on the reset preview | P1 | `player_lifecycle.gd; Technology.gd` |
| T2 | Explain the trigger separately from the reward | P1 | `ForceRegressConfirmWindow.gd` |
| T3 | Show essence sources as a sum | P1 | `manual_reset_popup.gd::update_description` |
| T4 | Show best learned level beside current practice | P4 | `action_popup.gd::update_descriptions` |
| T5 | Hide irrelevant multiplier fields for exceptional skills | P4 | `action_popup.gd; Skill.gd` |
| T6 | Separate life, campaign and lifetime encounter counts | P6 | `Exploration.gd::_completion_counts` |
| T7 | Keep fastest and first-completion timing distinct | P6 | `Exploration.gd::_timings` |
| T8 | Display why active work pauses during a trip | P3 | `player_progression.gd::is_occupied_by_exploration` |
| T9 | Show passive income while active work is suspended | P3 | `gold.gd::_total_income_per_day` |
| T10 | Show independent work and training capacities | P3 | `job_equip.gd; training_equip.gd` |
| T11 | Show each lane’s expense and the combined bill | P3 | `gold.gd::_get_daily_total_expenses` |
| T12 | Warn when a selected lifestyle makes net income negative | P3 | `gold.gd::get_gold_gain_per_day` |
| T13 | Explain fallback to affordable training | P3 | `training_equip.gd::_process_out_of_gold_event` |
| T14 | Use a clear stop reason when exploration cannot be funded | P3 | `exploration_automation.gd::_on_out_of_gold` |
| T15 | Keep a new-unlock mark until inspected | P8 | `Action.gd::show_cards_notification` |
| T16 | Offer readable alternative requirement groups | P8 | `requirement.gd::get_text` |
| T17 | Distinguish prerequisites already earned from live conditions | P8 | `requirement.gd::_check_requirement_group` |
| T18 | Turn civic demand into an optional known-knowledge hint | P2 | `technology_hint.gd` |
| T19 | Show town benefit separately from a personal reward | P2 | `Technology.gd; civilization_level_handler.gd` |
| T20 | Remember learned technology without granting current personal rank | P2 | `Technology.gd::rebirth` |
| T21 | Preview retaining or clearing purchased allocations | P1 | `Temporal.gd::regress` |
| T22 | Offer pause after reset and preserve its preference | P1 | `player_lifecycle.gd::_reset_common; Save.gd` |
| T23 | Offer speed reset independently of pause after reset | P5 | `game_speed_handler.gd; player_lifecycle.gd` |
| T24 | Show absence-bank origin and remaining spend time | P5 | `offline_time_manager.gd; offline_popup.gd, contradictory consumer` |
| T25 | Stop accelerated spending at an empty bank | P5 | `offline_time_manager.gd, missing clamp motivates original design` |
| T26 | Explain lifespan sources and life-cost training | P7 | `lifespan.gd; trainings/physical/content.json::limit_breaking` |
| T27 | Make lethal-route auto-accept a deliberate setting | P6 | `exploration_automation.gd::auto_accept_force_regress` |
| T28 | Keep named loadouts when equipment defaults reset | P3 | `Save.gd::get_save_dicts; player_lifecycle.gd::set_defaults` |
