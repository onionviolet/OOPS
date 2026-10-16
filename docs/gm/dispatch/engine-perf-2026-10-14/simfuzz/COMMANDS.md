# Simfuzz command reach status

Every registered command row from `buildCatalog` (1648), from the run in [REPORT.md](REPORT.md).
Status: **committed** = a policy committed it; **eligible, never committed** = a preview said eligible but no commit landed;
**attempted, rejected** = sampled and committed but the engine or host refused (first reason shown); **preview threw** = the preview itself threw;
**never eligible** = never passed a preview from these fixtures. Start columns: eligible in the full sweep at step 1 of that fixture.

| Command | Kind | Group | Route | Status | fresh | mid | crowded | First rejection or preview error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sim:book.paradise.campaign.hub.begin` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.begin` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.bench` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.learn_paid` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.learn_self` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.practice` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.practice` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.pause_method` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.resume_method` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.make_ordinary` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.make_controlled` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.commission_1` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.commission_2` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.wrap` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.recon` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.observe_gate` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.rescue` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.recover` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.rest` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.hank_care` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.hank_order` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.salvage` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.rebuild_ordinary` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.rebuild_controlled` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.shelter_work` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.rin_order` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.account_rescued` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.account_retreated` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.account_late` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.account_earlier_shelter` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.goa.account_earlier_loss` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.hub.return_account` | sim | book_paradise_campaign | host:book_paradise_campaign | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.npc.hank_gate` | sim | book_paradise_campaign_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.npc.krieg_gate` | sim | book_paradise_campaign_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.campaign.npc.hank_late` | sim | book_paradise_campaign_npc | engine | never eligible |  |  |  |  |
| `sim:book.mol.chart` | sim | book_mol | host:book_mol | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:book.mol.arrival` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.house_meet` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.house_shift` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.guest_room` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.meal` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.ilsa_meet` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.guest_pass` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.mana_assessment` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.library_meet` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.catalog_shift` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.study_invocation` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.study_formula` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.assemble_lamp` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.charge_1` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.charge_2` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.charge_3` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.control_drill` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.lamp_test` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.paper` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.extra_paper` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.notebook_paper` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.ink` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.cube` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.oil` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.bread` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.rope` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.kael_meet` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.kael_shift` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.zorian_talk` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.taiven_offer` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.survey_ordinary` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.survey_lamp` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.tether` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.report_to_taiven` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.decline` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.handover` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.report_late` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.kael_treatment_1` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.kael_treatment_2` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.sample_research` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.temporal_study` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.deposit_research` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.close_service_arc` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.compile_notebook` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.mature_commission` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.return_visit_life` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.use_lamp_house` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.sponsor_paper` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.nora_recovery` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.ongoing_reading` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.mastered_reading` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.ongoing_research` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.aftermath_route` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.aftermath_closed` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.hatch_encounter` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.pickup_watch` | sim | book_mol | host:book_mol | never eligible |  |  |  |  |
| `sim:book.mol.npc.taiven_review` | sim | book_mol_npc | engine | never eligible |  |  |  |  |
| `sim:book.mol.npc.scavenger_guard` | sim | book_mol_npc | engine | never eligible |  |  |  |  |
| `sim:field.care.begin` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.study` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.wipe` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.venom` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.dress` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.arm` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:field.care.disarm` | sim | field_care | host:field_care | never eligible |  |  |  |  |
| `sim:status.care.begin` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.read_weather` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.dry_off` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.stoke_warmth` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.prepare_lining` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.prepare_grip` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.slow_pack` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.precise_pack` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.sheltered_pack` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.rest_hands` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:status.care.focused_break` | sim | status_care | host:status_care | never eligible |  |  |  |  |
| `sim:book.paradise.chart` | sim | book_paradise | host:book_paradise | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:book.paradise.hub_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hub_shift` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.lesson` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hub_kit` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hub_rope` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hub_ration` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hub_rest` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.goa_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.porter_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.porter_shift` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.goa_logs` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.goa_rope` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.goa_spare_rope` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.goa_ration` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.eat` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hank_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.hank_copy` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.su_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.su_cooperate` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.su_refuse` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.krieg_meet` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.cache_ordinary` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.cache_braced` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.warn_civilians` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_route_to_hank` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.divert_fuel` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.guard_access` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.palace_warning` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.abstain` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_fire_burned` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_fire_contained` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_hank_sheltered` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_hank_dead` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_king_killed` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_king_escaped` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.report_king_alive` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.close_account` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.continued_life` | sim | book_paradise | host:book_paradise | never eligible |  |  |  |  |
| `sim:book.paradise.npc.mia_account` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.krieg_ignite` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.krieg_contained` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.krieg_breach` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.hank_shelter_route` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.hank_shelter_contained` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.hank_afterfire_death` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.king_evacuate` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_prepare` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_supplied_meal` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_move` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_attempt` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_search` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:book.paradise.npc.su_end_search` | sim | book_paradise_npc | engine | never eligible |  |  |  |  |
| `sim:original_frontier.begin` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.audit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.underwrite` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.decline` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.delay` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.correct_declined` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.correct_deferred` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.correct_unanswered` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_out_forest` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_out_gate` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_out_town` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_back_gate` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_back_forest` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.travel_returned` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.deliver_2` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.deliver_3` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.depot_accept` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.meet_audit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.meet_underwritten` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.meet_declined` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.meet_deferred` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.meet_unanswered` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.learn_tally` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_reserve` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_receiving` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_receiving_full` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.return_report` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_hear_wen` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_hear_mira` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_sign` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_decline` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.order_corrected_log` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.order_prepared_kit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.order_qualified_report` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.order_supported_check` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_settle_orders` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.charter_terminate` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_meet` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_sheltered_test` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_prepared_ordinary` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_prepared_timber` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_limit_test` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_allow_iven` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.iven_examine` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_iven_report` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_decline` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_downgrade` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_compare_wood` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_compare_ash` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.material_frame_ash` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.dispatch_reconcile` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.inquiry_reconcile_ordinary` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.inquiry_reconcile_joint` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.fund_next_local_need` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.routine_ordinary_check` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.routine_frame_check` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.specialist_quote` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.specialist_compare` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.buyer_meet` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.buyer_supply_lot` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_small` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_prepare_buffer` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_resilient` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_resilient_check` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_private` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.counter_withdraw` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.specialist_settle` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_meet` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_teach` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_fund` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_supply_reserve` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_work` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_report` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_handoff` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.successor_decline` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.departure_prepare` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.departure_arrive_town` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.home_return` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.home_review_shack` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.question_village` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.question_town` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.inspect_crossing` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.consult_notice` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_rope` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_rat` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_loaded` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_step` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.prepare_trail` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_rope` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_rat` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_loaded` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_step` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_forest_trail` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_rope` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_rat` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_loaded` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_step` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compare_cave_trail` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.compile_dossier` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.offer_dossier_trial` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.resident_dossier_trial` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.dossier_trial_report` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.keep_dossier` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.withdraw_recommendation` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.practice_local_comparison` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.hear_forest_work` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.hear_cave_work` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.accept_forest` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.accept_cave` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_forest_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_forest_protected` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_forest_controlled` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_forest_shared` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_cave_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_cave_protected` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_cave_controlled` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.work_cave_shared` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.reschedule_forest` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.rest_forest_observer` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.retry_forest_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.close_forest_protection` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.reschedule_cave` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.rest_cave_observer` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.retry_cave_safe` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.close_cave_protection` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.assess_forest_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.assess_cave_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.withdraw_encounter` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.ask_mastery_trial` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.review_rat_source` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.review_step_source` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.learn_ordinary_stance` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.practice_ordinary_stance` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.check_rat_readiness` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.check_step_readiness` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.check_ordinary_readiness` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.footing_rat` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.footing_rope` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.frame_ordinary` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.frame_focus` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.feat_mastered_footing` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.feat_ordinary_footing` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.feat_drive_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.feat_ordinary_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.test_loaded_limit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.test_precision_limit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.test_single_support_limit` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.keep_mastery_practice` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.practice_bounded_retreat` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:original_frontier.practice_divided_frame` | sim | original_frontier | host:original_frontier | never eligible |  |  |  |  |
| `sim:skills.brace.observe` | sim | skills | engine | committed |  |  |  |  |
| `sim:skills.trail.observe` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.timber.observe` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.observe` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.brace.learn` | sim | skills | engine | committed |  |  |  |  |
| `sim:skills.trail.learn` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.timber.learn` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.learn` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.brace.practice` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.trail.practice` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.timber.practice` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.practice` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.brace.contest` | sim | skills | engine | committed |  |  |  |  |
| `sim:skills.trail.route` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.timber.pack` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.timber.precise_pack` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.compare` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.road_report` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:skills.inquiry.recover_attention` | sim | skills | engine | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.lead` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.meet` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.repair_ordinary` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.repair_step` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.decline` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.caretaker_repair` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.hear_repair` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.study` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.export_template` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.pack_kits` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.rest` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.shut_bench` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.reopen_bench` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.return_greeting` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.welcome` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.paid_work` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.damp_trial` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.sound_trial` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.cooperative_trial` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.shelf` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.private_research` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.offer_research` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.hear_research` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.return` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.refuse` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:glasshouse.main.glasshouse.scenes.leave_terms` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.open_payment` | sim | glasshouse | host:glasshouse | eligible, never committed |  | y | y | Unsupported doorway action. |
| `sim:pocket.enter_receipt` | sim | glasshouse | host:glasshouse | eligible, never committed |  | y | y | Unsupported doorway action. |
| `sim:pocket.exit_receipt` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.close_receipt` | sim | glasshouse | host:glasshouse | eligible, never committed |  | y | y | Unsupported doorway action. |
| `sim:pocket.fund_bench` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.frontier_pack` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.earn_listener` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.craft_device` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.activate` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.sample` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.detect` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.notice` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.shutter` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.claim` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:pocket.observation.cooperate` | sim | glasshouse | host:glasshouse | never eligible |  |  |  |  |
| `sim:observation.prepare` | sim | observation | host:observation | eligible, never committed |  |  |  | Unsupported viewing action. |
| `sim:observation.open` | sim | observation | host:observation | never eligible |  |  |  |  |
| `sim:observation.notice` | sim | observation | host:observation | never eligible |  |  |  |  |
| `sim:observation.shutter` | sim | observation | host:observation | never eligible |  |  |  |  |
| `sim:observation.cooperate` | sim | observation | host:observation | committed |  |  |  |  |
| `sim:observation.inspect_shuttered` | sim | observation | host:observation | never eligible |  |  |  |  |
| `sim:observation.inspect_cooperated` | sim | observation | host:observation | committed |  |  |  |  |
| `sim:observation.inspect_unanswered` | sim | observation | host:observation | committed |  |  |  |  |
| `sim:observation.replay` | sim | observation | host:observation | never eligible |  |  |  |  |
| `sim:exchange.begin` | sim | exchange | host:exchange | committed |  | y | y |  |
| `sim:exchange.accept` | sim | exchange | host:exchange | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:exchange.decline` | sim | exchange | host:exchange | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:exchange.buy_wet` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.buy_sound` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.dry` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.fit_kit` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.borrow` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.return_gauge` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.fit_taught` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.deliver` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.withdraw` | sim | exchange | host:exchange | committed |  |  |  |  |
| `sim:exchange.npc_test` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:exchange.return` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.npc_fit_declined` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:exchange.npc_fit_withdrawn` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:exchange.npc_fit_unanswered` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:exchange.npc_dry` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:exchange.hear_declined` | sim | exchange | host:exchange | committed |  |  |  |  |
| `sim:exchange.hear_withdrawn` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:exchange.hear_unanswered` | sim | exchange | host:exchange | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:exchange.buy_template` | sim | exchange | host:exchange | committed |  |  |  |  |
| `sim:exchange.pack_pair` | sim | exchange | host:exchange | never eligible |  |  |  |  |
| `sim:party.meet` | sim | party | engine | committed |  |  |  |  |
| `sim:party.prepare` | sim | party | engine | committed |  |  |  |  |
| `sim:party.rest` | sim | party | engine | never eligible |  |  |  |  |
| `sim:promise.begin` | sim | promise | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:promise.investigate` | sim | promise | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:promise.help` | sim | promise | engine | committed |  |  |  |  |
| `sim:promise.decline` | sim | promise | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:promise.check_name` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.test_cart` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.repair_declined` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.repair_unanswered` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.meet_evidence` | sim | promise | engine | committed |  |  |  |  |
| `sim:promise.meet_help` | sim | promise | engine | committed |  |  |  |  |
| `sim:promise.hear_bracing` | sim | promise | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:promise.lesson` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.pack_brace` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:promise.meet_declined` | sim | promise | engine | committed |  |  |  |  |
| `sim:promise.meet_unanswered` | sim | promise | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:rival.begin` | sim | rival | engine | committed |  |  |  |  |
| `sim:rival.confront` | sim | rival | engine | never eligible |  |  |  |  |
| `sim:rival.settle` | sim | rival | engine | committed |  |  |  |  |
| `sim:rival.hide` | sim | rival | engine | never eligible |  |  |  |  |
| `sim:rival.decline` | sim | rival | engine | committed |  |  |  |  |
| `sim:rival.report` | sim | rival | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:rival.recover` | sim | rival | engine | committed |  |  |  |  |
| `sim:rival.rematch` | sim | rival | engine | never eligible |  |  |  |  |
| `sim:field.study_rope` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.make_rope` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.dry_rack` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.rack_batch` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.accept_supply` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.deliver_kits` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.deliver_rope` | sim | field | engine | never eligible |  |  |  |  |
| `sim:pursuit.begin` | sim | pursuit | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:pursuit.conceal` | sim | pursuit | engine | eligible, never committed |  |  |  |  |
| `sim:pursuit.decline` | sim | pursuit | engine | eligible, never committed |  |  |  |  |
| `sim:pursuit.report` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:pursuit.tea` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:pursuit.spar` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:marked.begin` | sim | pursuit | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:marked.decline` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:marked.settle` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:marked.accept` | sim | pursuit | engine | eligible, never committed |  |  |  | This interception request is stale. |
| `sim:marked.report` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:marked.remove` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:marked.conceal` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:writ.begin` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:writ.decline` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:writ.settle` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:writ.accept` | sim | pursuit | engine | eligible, never committed |  |  |  | This interception request is stale. |
| `sim:writ.report` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:review.begin` | sim | pursuit | engine | committed |  |  |  |  |
| `sim:review.decline` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:review.settle` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:review.accept` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:review.report` | sim | pursuit | engine | never eligible |  |  |  |  |
| `sim:field.begin` | sim | field | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:field.join_survey` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.join_craft` | sim | field | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:field.learn_focus` | sim | field | engine | committed |  |  |  |  |
| `sim:field.recover_focus` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.learn_drive` | sim | field | engine | committed |  |  |  |  |
| `sim:field.recover_drive` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.teach_step` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.discover_imprint` | sim | field | engine | committed |  |  |  |  |
| `sim:field.copy_step` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.practice_step` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.project_start` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.inspect` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.workshop.parts` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.workshop.survey` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.workshop.assembly` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.pack_focus` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.pack_drive` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.repair_later` | sim | field | engine | never eligible |  |  |  |  |
| `sim:field.assess` | sim | field | engine | never eligible |  |  |  |  |
| `sim:village.hire_helper` | sim | (none) | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:village.helper_survey` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:village.helper_return` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:village.collect_helper` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:village.working_habits` | sim | social | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:village.interrupt_work` | sim | social | engine | never eligible |  |  |  |  |
| `sim:village.give_space` | sim | social | engine | never eligible |  |  |  |  |
| `sim:village.practical_apology` | sim | social | engine | never eligible |  |  |  |  |
| `sim:village.quiet_break` | sim | social | engine | never eligible |  |  |  |  |
| `sim:body.begin` | sim | body | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:body.study_balance` | sim | body | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:body.grip_drill` | sim | body | engine | never eligible |  |  |  |  |
| `sim:body.condition_grip` | sim | body | engine | never eligible |  |  |  |  |
| `sim:body.rough_kit` | sim | body | engine | committed |  |  |  |  |
| `sim:body.recover` | sim | body | engine | committed |  |  |  |  |
| `sim:body.show_soreness` | sim | social | engine | eligible, never committed |  |  |  |  |
| `sim:body.show_calluses` | sim | social | engine | never eligible |  |  |  |  |
| `sim:body.show_mark` | sim | social | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:body.show_footing` | sim | social | engine | committed |  |  |  |  |
| `sim:village.commission` | sim | (none) | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:village.craftsman_work` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:village.collect` | sim | (none) | engine | committed |  |  |  |  |
| `sim:village.measured_pack` | sim | (none) | engine | never eligible |  |  |  |  |
| `sim:village.study_method` | sim | (none) | engine | committed |  |  | y |  |
| `sim:home_furnishings.survey` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.drying_rack.frame` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.drying_rack.finish` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.drafting_bench.frame` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.drafting_bench.finish` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.first_drying` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.dry_offcuts` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.adapt_notebook` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.draft_stave` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:home_furnishings.draft_kit` | sim | home_furnishings | host:home_furnishings | never eligible |  |  |  |  |
| `sim:crush_social.outing_offer` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.outing_patient` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.outing_quick` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.outing_decline` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.report_patient` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.report_quick` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.shared_pack_patient` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:crush_social.shared_pack_quick` | sim | promise | engine | never eligible |  |  |  |  |
| `sim:factorio_retort.install` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:factorio_retort.batch` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:factorio_retort.collect_resin` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:factorio_retort.collect_residue` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:factorio_retort.dispose_filled_residue` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:factorio_retort.dispose_residue` | sim | factorio_retort | host:factorio_retort | never eligible |  |  |  |  |
| `sim:proto23.chart` | sim | proto23 | host:proto23 | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:proto23.arrival` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.sorting_work` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.cottage_agreement` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.decline` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_bed` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_hearth` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_bookstand` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_log` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_sap` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_knife` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_paper` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.buy_ink` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.read_handling` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.instruction_handling` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.instruction_study_conditioning` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.practice_handling` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.install_bed` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.install_hearth` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.install_bookstand` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.bed_rest` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.shape_ordinary` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.shape_practiced` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.sharpen` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.hearth_dry_stave` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.hearth_dry_offcuts` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.bookstand_compare` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.compile_notebook` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.received_review` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:proto23.home_kit` | sim | proto23 | host:proto23 | never eligible |  |  |  |  |
| `sim:mg.begin` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.supply.log` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.supply.cloth` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.supply.seed` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.foreman.commission` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.foreman.execute` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.foreman.retrieve_inputs` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.personal_rest` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.inspect` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.share` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.advance` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.pass` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.make_batch` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.sell_batch` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.sell_advance_batch` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.settle_share` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.orin.repay_advance` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.mira.buy_room` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.mira.repair_room` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.use_personal` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.use_rental` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.use_inn` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.use_workshop` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.sela_stay` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.sela_request` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.answer_sela_repair` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.end_sela_rental` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.room.workshop_batch` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.inspect` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_mira_crate_full` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_mira_crate_friendly` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_sela_greens_full` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_sela_greens_friendly` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_bram_fine_crate_full` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.shop.sell_bram_fine_crate_friendly` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.inn.sela_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.inn.bram_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.auction.inspect` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.auction.bid_low` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.auction.bid_high` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.auction.pass` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.ship.hear_order` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.ship.crate.local` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.ship.crate.escorted` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.ship.fine.local` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.ship.fine.escorted` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.rent_plot` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.plant_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.plant_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.tend_crop` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.grow_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.grow_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.harvest_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.farm.harvest_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.workshop.bram_ordinary` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.workshop.bram_careful` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.workshop.deliver_bram_ordinary` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.workshop.deliver_bram_careful` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.sela_request` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.lend_sela` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.gift_sela` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.refuse_sela` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.extend_sela_loan` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.mira_funded_work` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.deliver_mira_work` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.aid.repay_sela_loan` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.inspect` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.conserve` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.sale_grade` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.display_conserved` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.withdraw_conserved` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.display_restored` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.withdraw_restored` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.restoration.sell_restored` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.book` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.prepare_meal_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.prepare_meal_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.prepare_exhibition_conserved` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.prepare_exhibition_restored` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.host_greens` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.host_grain` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.host_exhibition_conserved` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.host_exhibition_restored` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:mg.event.cancel_booking` | sim | management | host:management | never eligible |  |  |  |  |
| `sim:audit_remainder.enroll` | sim | audit_remainder | host:audit_remainder | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:remainder_livelihood.resident_terms` | sim | remainder_livelihood | host:remainder_livelihood | eligible, never committed |  |  |  | Unsupported livelihood action. |
| `sim:remainder_livelihood.lio_terms` | sim | remainder_livelihood | host:remainder_livelihood | eligible, never committed |  |  |  | Unsupported livelihood action. |
| `sim:remainder_livelihood.allocation_terms` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.fund_shift1` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.work_shift1` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.withdraw_shift1` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.collect_shift1` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.fund_shift2` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.work_shift2` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.withdraw_shift2` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.collect_shift2` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.fund_lio` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.work_lio` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.withdraw_lio` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.collect_lio` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.fund_allocation_orr` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.work_allocation_orr` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.withdraw_allocation_orr` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.collect_allocation_orr` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.fund_allocation_vale` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.work_allocation_vale` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.withdraw_allocation_vale` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.report_allocation_vale` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.decline_shift1` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.decline_shift2` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.keep_lio` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.keep_toolkit` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_livelihood.lio_refuse` | sim | remainder_livelihood | host:remainder_livelihood | never eligible |  |  |  |  |
| `sim:remainder_home.terms` | sim | remainder_home | host:remainder_home | committed |  |  |  |  |
| `sim:remainder_home.cover` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.trim_uncovered` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.trim_covered` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.dry_offcuts` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.research` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.build_jig` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.ordinary_trial` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.salvage_ordinary` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.salvage_delicate` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.choose_loaded` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.choose_fine` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.survey_ordinary` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.survey_loaded` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.room_terms` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.room.frame` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.room.finish` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.meet_resident` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.invite` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.decline` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.resident_accept` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.resident_bind` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.hear_resident` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.collect_resident` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_home.departure` | sim | remainder_home | host:remainder_home | never eligible |  |  |  |  |
| `sim:remainder_offers.solicit` | sim | remainder_offers | host:remainder_offers | eligible, never committed |  |  |  | The local offer request has unsupported options or another participant. |
| `sim:remainder_offers.decline_all` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.hire_sable` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.route_sable` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.pack_sable` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.collect_sable` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.use_sable` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.hire_tovan` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.route_tovan` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.pack_tovan` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.collect_tovan` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.use_tovan` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.hire_fen` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.route_fen` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.pack_fen` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.collect_fen` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.use_fen` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.hear_supply` | sim | remainder_offers | host:remainder_offers | eligible, never committed |  |  |  | The local offer request has unsupported options or another participant. |
| `sim:remainder_offers.accept_supply` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.deliver_supply` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.decline_supply_posted` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.decline_supply_accepted` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.expire_supply_posted` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.expire_supply_accepted` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.detour` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_offers.supply_account` | sim | remainder_offers | host:remainder_offers | never eligible |  |  |  |  |
| `sim:remainder_consequences.iona_interrupt` | sim | remainder_consequences | host:remainder_consequences | eligible, never committed |  |  |  | Choose the explicitly enrolled local consequence action. |
| `sim:remainder_consequences.iona_considerate` | sim | remainder_consequences | host:remainder_consequences | eligible, never committed |  |  |  | Choose the explicitly enrolled local consequence action. |
| `sim:remainder_consequences.iona_repair` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.iona_later` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.iona_concession` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.plot_terms` | sim | remainder_consequences | host:remainder_consequences | eligible, never committed |  |  |  | Choose the explicitly enrolled local consequence action. |
| `sim:remainder_consequences.plot_buy_seed` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.plot_plant` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.plot_cover` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.plot_early` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.plot_neglect` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_commission` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_walk` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_fee` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_refuse` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_restore` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_cancel_before_route` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_consequences.collection_return` | sim | remainder_consequences | host:remainder_consequences | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.terms` | sim | remainder_combat_fit | host:remainder_combat_fit | committed |  |  |  |  |
| `sim:remainder_combat_fit.craft_rigid` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.craft_flexible` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.give_original` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.give_rigid` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.give_flexible` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.wear_original` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.wear_rigid` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.wear_flexible` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_fit.grip_practice` | sim | remainder_combat_fit | host:remainder_combat_fit | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.hear_practice` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.supplied_practice_watch` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.craft_guard` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.craft_traversal` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.hear_recovery` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.accept_recovery` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.handoff_fitting` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.craft_wrap` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.hear_supply` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:remainder_combat_objectives.accept_supply` | sim | remainder_combat_objectives | host:remainder_combat_objectives | never eligible |  |  |  |  |
| `sim:feature_objects.begin` | sim | feature_objects | host:feature_objects | eligible, never committed |  | y | y | Unsupported fitting action. |
| `sim:feature_objects.inspect` | sim | feature_objects | host:feature_objects | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_objects.borrow` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.buy` | sim | feature_objects | host:feature_objects | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_objects.borrow_fine` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.buy_sound` | sim | feature_objects | host:feature_objects | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_objects.return_sharp` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.return_dull` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.return_fine` | sim | feature_objects | host:feature_objects | eligible, never committed |  |  |  |  |
| `sim:feature_objects.return_fineDull` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.repair_dull_own` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.repair_dull_loan` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.repair_fineDull_own` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.repair_fineDull_loan` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.refit_sharp` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.refit_dull` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.cut_sharp_own` | sim | feature_objects | host:feature_objects | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_objects.cut_sharp_loan` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.cut_fine_own` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.cut_fine_loan` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.match_fine_own` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.match_fine_loan` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.kit_sharp_own` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.kit_sharp_loan` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.kit_fine_own` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.kit_fine_loan` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.dry_shade` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.dry_braced` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.dry_shelf` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.observe_alignment` | sim | feature_objects | host:feature_objects | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_objects.learn` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.install_brace` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.install_seal` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_objects.buy_matched` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.deliver_kits` | sim | feature_objects | host:feature_objects | committed |  |  |  |  |
| `sim:feature_objects.revisit` | sim | feature_objects | host:feature_objects | never eligible |  |  |  |  |
| `sim:feature_powers.brace.interpose` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.brace.redirect` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.trail.opening` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.trail.exit` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.timber.frame` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.timber.wedge` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.inquiry.read` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.inquiry.signal` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.brace.sustained` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.trail.sustained` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.timber.sustained` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.inquiry.sustained` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.map_exit` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.harness_ordinary` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.harness_matched` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.equip_lio` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_powers.lio_release_drill` | sim | feature_powers | host:feature_powers | never eligible |  |  |  |  |
| `sim:feature_battle.inspect` | sim | feature_battle | engine | never eligible |  |  |  |  |
| `sim:feature_battle.start` | sim | feature_battle | engine | never eligible |  |  |  |  |
| `sim:feature_battle.bypass` | sim | feature_battle | engine | never eligible |  |  |  |  |
| `sim:feature_battle.next_watch` | sim | feature_battle | engine | never eligible |  |  |  |  |
| `sim:feature_society.begin` | sim | feature_society | host:feature_society | eligible, never committed |  | y | y | Meet the household work circle first. |
| `sim:feature_society.terms` | sim | feature_society | host:feature_society | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_society.supply` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.authorize_home` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.decline_home` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.orr_repair` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.hear_home` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.request_apprentice` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.request_exclusive` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.vale_answer_bounded` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.vale_refuse_exclusive` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.hear_acceptance` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.hear_refusal` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.fund_lesson` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.orr_teach` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.hear_lesson` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.fund_apprentice` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.vale_shelf` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.hear_shelf` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.offer_handoff` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.vale_accept_handoff` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.handoff` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.stop_future` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.personal_lesson` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.personal_pack` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.revisit` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:tidemark.chart` | sim | tidemark | host:tidemark | committed |  | y | y |  |
| `sim:tidemark.open_receipt` | sim | tidemark | host:tidemark | eligible, never committed |  | y | y | Unsupported local command. |
| `sim:tidemark.enter_receipt` | sim | tidemark | host:tidemark | eligible, never committed |  | y | y | Unsupported local command. |
| `sim:tidemark.exit_receipt` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.meet` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.accept` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.decline` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.timber` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.lesson` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.balance` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.collect` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.buy_log` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.buy_kit` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.salvage` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.supply` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.borrow_kit` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.inspect_floats` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:tidemark.return_kit` | sim | tidemark | host:tidemark | never eligible |  |  |  |  |
| `sim:reference_gameplay.open` | sim | reference_gameplay | host:reference_gameplay | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:reference_gameplay.buy_sleeve` | sim | reference_gameplay | host:reference_gameplay | committed |  |  |  |  |
| `sim:reference_gameplay.buy_salt` | sim | reference_gameplay | host:reference_gameplay | committed |  |  |  |  |
| `sim:reference_gameplay.set_resin` | sim | reference_gameplay | host:reference_gameplay | never eligible |  |  |  |  |
| `sim:reference_gameplay.resin_kits` | sim | reference_gameplay | host:reference_gameplay | never eligible |  |  |  |  |
| `sim:reference_gameplay.recharge` | sim | reference_gameplay | host:reference_gameplay | never eligible |  |  |  |  |
| `sim:reference_gameplay.learn` | sim | reference_gameplay | host:reference_gameplay | eligible, never committed |  |  |  |  |
| `sim:reference_gameplay.practice` | sim | reference_gameplay | host:reference_gameplay | never eligible |  |  |  |  |
| `sim:reference_gameplay.cool_hook` | sim | reference_gameplay | host:reference_gameplay | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.open` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.buy_vial` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.buy_ration` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.assay` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.trial_dull` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.trial_fineDull` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.scent` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.feed` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.train` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.recover_manual` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.recover_dog` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.pin_kit` | sim | nethack_fieldcraft | host:nethack_fieldcraft | never eligible |  |  |  |  |
| `sim:nethack_fieldcraft.handoff` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:nethack_fieldcraft.resume` | sim | nethack_fieldcraft | host:nethack_fieldcraft | committed |  |  |  |  |
| `sim:audit_fixture.enroll` | sim | audit_fixture | host:audit_workshop | committed |  |  |  |  |
| `sim:audit_fixture.build` | sim | audit_fixture | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_fixture.bind_kits` | sim | audit_fixture | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_lesson.ask` | sim | audit_lesson | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_lesson.choose_sleeve` | sim | audit_lesson | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_lesson.choose_lesson` | sim | audit_lesson | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_lesson.defer` | sim | audit_lesson | host:audit_workshop | never eligible |  |  |  |  |
| `sim:audit_lesson.set_resin` | sim | audit_lesson | host:audit_workshop | never eligible |  |  |  |  |
| `sim:artifact_collection.open` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.buy_frame` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.buy_amber` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.earn_blue` | sim | artifact_collection | host:artifact_collection | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:artifact_collection.manual_pin` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.assemble.single` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.disassemble.single` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.assemble.paired` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.disassemble.paired` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.use.measure` | sim | artifact_collection | host:artifact_collection | committed |  |  |  |  |
| `sim:artifact_collection.use.blue_kit` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.use.single_kit` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.use.paired_kit` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.use.pin_kit` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:artifact_collection.inspect_projection` | sim | artifact_collection | host:artifact_collection | never eligible |  |  |  |  |
| `sim:causal.story.mortal.keep_watch` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.talk_afterward` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.cooperate` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.refuse_cooperation` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.deliver` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.request_care` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.prepare_guard` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.copy_warning` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.notice_interruption` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.deliver_warning` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.hear_source_evidence` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.request_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.research` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.hear_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.learn_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.adapt_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.care` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.hear_delivery` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.ordinary_followup` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.mortal.witness_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.mortal.keeper_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.keep_watch` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.talk_afterward` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.cooperate` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.refuse_cooperation` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.deliver` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.request_care` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.prepare_guard` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.copy_warning` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.notice_interruption` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.deliver_warning` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.hear_source_evidence` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.request_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.research` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.hear_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.learn_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.adapt_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.authorize_release` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.request_source_release` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.sever_job` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.care` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.hear_delivery` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.ordinary_followup` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.covenant.witness_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.covenant.keeper_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.keep_watch` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.talk_afterward` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.cooperate` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.refuse_cooperation` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.deliver` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.request_care` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.prepare_guard` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.copy_warning` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.notice_interruption` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.deliver_warning` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.hear_source_evidence` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.request_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.research` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.hear_research` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.learn_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.adapt_method` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.authorize_release` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.request_source_release` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.sever_job` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.care` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.hear_delivery` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.ordinary_followup` | sim | causal_story | host:causal_story | never eligible |  |  |  |  |
| `sim:causal.story.anchor.witness_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:causal.story.anchor.keeper_followup` | sim | causal_story_npc | engine | never eligible |  |  |  |  |
| `sim:world.completion.begin` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.life.public_account` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.life.private_account` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.life.changed_return` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.life.loaded_drain` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.life.measured_line` | sim | world_completion_life | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.open` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.borrow` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.return_village` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.return_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.invite_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.accompany_home` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.late_terms_village` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.late_terms_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_owned_outside` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_owned_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_loan_outside` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_loan_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_service_outside` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.lens.measure_service_room` | sim | world_completion_lens | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.begin` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.learn_player` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.sponsor` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.accept` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.refuse` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.walk_to_bench` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.learn_neri` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.make_player` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.make_neri` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.collect` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.release_neri` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.withdraw_village` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.withdraw_shack` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.return_home` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.account_village` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.account_shack` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.ordinary` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.learning.release_neri_shack` | sim | world_completion_learning | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.materials.cover_offcuts` | sim | world_completion_materials | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.materials.cover_measured` | sim | world_completion_materials | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.materials.keep_scraps` | sim | world_completion_materials | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.materials.discard` | sim | world_completion_materials | host:world_completion | never eligible |  |  |  |  |
| `sim:world.completion.materials.account` | sim | world_completion_materials | host:world_completion | never eligible |  |  |  |  |
| `sim:lore.work.begin` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.repair_player` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.repair_steady` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.ask_orr` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.orr_accept` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.orr_refuse` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.orr_repair` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.orr_return` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.withdraw_orr` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.fund_neri` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.neri_accept` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.neri_refuse` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.neri_bind` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.collect_kit` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.withdraw_neri` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.decline` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.account` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.work.orr_account` | sim | lore_work | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.begin` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.inspect_outside` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.inspect_room` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.inspect_focused_outside` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.inspect_focused_room` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.signed` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ask_relay` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.orr_relay_accept` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.orr_relay_refuse` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.orr_relay` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.withdraw_relay` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.fund_check` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ressa_check` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ressa_small_check` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ressa_refuse` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ressa_trial_accept` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.ressa_trial_refuse` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.withdraw_check` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.clear_notch` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.entrust_stave` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.exposure_job` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.buy_wet` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.account` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:lore.warning.leave` | sim | lore_warning | host:lore_practice | never eligible |  |  |  |  |
| `sim:book.care.hub.begin` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.read_terms` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.prepare` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.pack_hurried` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.pack_precise` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.recover` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.rest` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.request_inspection` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.aid_worker` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.receive_account` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.npc.inspect` | sim | book_care_npc | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.hub.npc.cargo` | sim | book_care_npc | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.begin` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.read_terms` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.prepare` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.pack_hurried` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.pack_precise` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.recover` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.rest` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.request_inspection` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.aid_worker` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.receive_account` | sim | book_care | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.npc.inspect` | sim | book_care_npc | host:book_care | never eligible |  |  |  |  |
| `sim:book.care.goa.npc.cargo` | sim | book_care_npc | host:book_care | never eligible |  |  |  |  |
| `sim:repositories.ask_wick_sketch` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.inspect_substitute` | sim | repositories | host:repositories | eligible, never committed |  |  |  |  |
| `sim:repositories.deliver_substitute` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.hear_substitution` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.test_rough_seam` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.show_matched_method` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.begin` | sim | repositories | host:repositories | eligible, never committed |  | y | y | Unsupported courier action. |
| `sim:repositories.inspect_lantern` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.watch_repair` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.paid_repair` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.decline` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.self_repair` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.hear_lantern` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.buy_pellet` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.lesson` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.seal_kit` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.seal_pair` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.dry_kit` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.open_seal` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.inspect_pump` | sim | repositories | host:repositories | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:repositories.exposed_work` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.protected_work` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.surface_bypass` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.resident_bypass` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.hear_pump_restored` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:repositories.hear_pump_bypassed` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.hear_pump_resident_bypass` | sim | repositories | host:repositories | committed |  |  |  |  |
| `sim:repositories.draw_water` | sim | repositories | host:repositories | never eligible |  |  |  |  |
| `sim:ink.tidemark.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.tidemark.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.tidemark.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.relay.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.relay.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.relay.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.relay.refuse` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_street.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_street.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_street.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_workroom.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_workroom.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.hub_workroom.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.offer.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.offer.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.offer.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_landing.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_landing.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_landing.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_enginehouse.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_enginehouse.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.salt_enginehouse.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_reception.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_reception.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_reception.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_records.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_records.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.archive_records.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.return.begin` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.return.terms` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:ink.nested.return.leave` | sim | ink | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_begin` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_refuse` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_public_pack` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_borrow_badge` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_badge_use` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_make_fastening` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_repair_badge` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_return_badge` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_return_worn` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_pack_dispatch` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_deliver_dispatch` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_unpack_parcel` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_credit_honest` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_credit_claim` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_invitation_player` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_expose_credit_unused` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_expose_credit_spent` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_compensate_credit` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_invitation_witness` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_buy_witness_kit` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_later_honest` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_later_office` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_later_corrected` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.relay_later_unsettled` | sim | subtlety_relay | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_begin` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_registry` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_registry_returned` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_personal` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_texture` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_refuse` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:subtlety.reference_return` | sim | subtlety_reference | engine | never eligible |  |  |  |  |
| `sim:nested.chart` | sim | nested_campaign | host:nested_campaign | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:nested.enroll_receipt` | sim | nested_campaign | host:nested_campaign | eligible, never committed |  | y | y | Unsupported nested campaign command. |
| `sim:nested.meet` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.role_employee` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.role_contractor` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.shift` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.staff_supply` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.rest` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.staff_rest` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.repair` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.refit` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.fragment` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.support_lesson` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.talk_lin` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.inspect` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.paid_haul` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.ordinary_brace` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.pulse` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.deliver` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.saltworks.withhold` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.archive.inspect` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.archive.register` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.archive.refuse` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.archive.preserve` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.hub.shop.kit` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.hub.shop.rope` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.hub.shop.log` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.saltworks.shop.kit` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.saltworks.shop.rope` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.saltworks.shop.log` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.archive.shop.kit` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.archive.shop.rope` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.buy.nested.archive.shop.log` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.recover.nested.saltworks.stock.log` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.recover.nested.saltworks.stock.rope` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.recover.nested.archive.stock.rope` | sim | nested_campaign | host:nested_campaign | never eligible |  |  |  |  |
| `sim:nested.chain.roles.begin` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.appearance` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.witness` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.minutes` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.registrar_audit` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.claimant_folio` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.witness_preserve` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.lawful` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.partial` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.refuse` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.hostile` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.report` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.abstain_return` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.hub_review` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.account` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.restitute` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.revisit_corrected` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.revisit_shared` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.revisit_refused` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.roles.revisit_coerced` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.begin` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.inspect` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.keeper_ration` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.foreman_notice` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.cooperate` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.early_solution` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.issuer_first` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.partial` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.refuse` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.hostile` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.prior_cooperated` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.prior_issuer_first` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.prior_refused` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.abstain_return` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.report` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.issuer_audit` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.account` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.restitute` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_cooperated` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_issuer_first` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_partial` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_refused` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_seized` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.welfare.revisit_abstained` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.begin` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.prepare` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.acknowledge` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.use` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.counter` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.hear_counter` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.refine` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.partial` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.ordinary` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.hostile` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.restitute` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.teach` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.foreman_use` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.hear_use` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.later_refined` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.later_retained` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.later_ordinary` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.chain.method.later_appropriated` | sim | nested_chains | host:nested_chains | never eligible |  |  |  |  |
| `sim:nested.life.lin.open` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.lin.work` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.lin.refuse` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.lin.texture` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.lin.account` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.open` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.work` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.refuse` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.texture` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.account` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.open` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.work` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.refuse` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.texture` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.account` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.brin.buy_spare` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:nested.life.ivo.shelf_exchange` | sim | nested_life | host:nested_life | never eligible |  |  |  |  |
| `sim:game_absorption_assay.open` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.buy_full` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.buy_dirty` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.trial_dull` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.trial_fineDull` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.compare` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.examine` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.rinse` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.scrape_dull` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:game_absorption_assay.scrape_fineDull` | sim | game_absorption_assay | host:game_absorption_assay | never eligible |  |  |  |  |
| `sim:contextual_balm.dress_scraped_palms` | sim | contextual_balm | host:contextual_balm | never eligible |  |  |  |  |
| `sim:reference_gameplay.refine_first` | sim | cooling_refinement | host:cooling_refinement | never eligible |  |  |  |  |
| `sim:reference_gameplay.refine_second` | sim | cooling_refinement | host:cooling_refinement | never eligible |  |  |  |  |
| `sim:reference_gameplay.refine_third` | sim | cooling_refinement | host:cooling_refinement | never eligible |  |  |  |  |
| `sim:reference_gameplay.refine_later` | sim | cooling_refinement | host:cooling_refinement | never eligible |  |  |  |  |
| `sim:reference_gameplay.steady_hook` | sim | cooling_refinement | host:cooling_refinement | never eligible |  |  |  |  |
| `sim:feature_society.duty.repair_first` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.duty.lesson_first` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.duty.ordinary_order` | sim | feature_society | host:feature_society | committed |  |  |  |  |
| `sim:feature_society.duty.continuation_sponsored` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.duty.continuation_paid` | sim | feature_society | host:feature_society | never eligible |  |  |  |  |
| `sim:feature_society.duty.continuation_decline` | sim | feature_society | host:feature_society | eligible, never committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_society.duty.followup_repair` | sim | feature_society | host:feature_society | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:feature_society.duty.followup_lesson` | sim | feature_society | host:feature_society | eligible, never committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:steam.df.begin` | sim | steam_df | host:steam | never eligible |  |  |  |  |
| `sim:steam.df.estimate` | sim | steam_df | host:steam | never eligible |  |  |  |  |
| `sim:steam.df.count` | sim | steam_df | host:steam | never eligible |  |  |  |  |
| `sim:steam.df.buy_reported_pair` | sim | steam_df | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.begin` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.copy_manual` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.trial` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.rest` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.compare` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.guided` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.read` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.kits_sharp` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.boh.kits_fine` | sim | steam_boh | host:steam | never eligible |  |  |  |  |
| `sim:steam.oni.begin` | sim | steam_oni | host:steam | never eligible |  |  |  |  |
| `sim:steam.oni.build_tray` | sim | steam_oni | host:steam | never eligible |  |  |  |  |
| `sim:steam.oni.tend_cycle` | sim | steam_oni | host:steam | never eligible |  |  |  |  |
| `sim:steam.lamb.appoint` | sim | steam_lamb | host:steam | never eligible |  |  |  |  |
| `sim:steam.lamb.inspect_fine` | sim | steam_lamb | host:steam | never eligible |  |  |  |  |
| `sim:steam.lamb.inspect_fineDull` | sim | steam_lamb | host:steam | never eligible |  |  |  |  |
| `sim:steam.lamb.deliver` | sim | steam_lamb | host:steam | never eligible |  |  |  |  |
| `sim:steam.lamb.end` | sim | steam_lamb | host:steam | never eligible |  |  |  |  |
| `sim:foundation.probe.enroll` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.barrier.p-a` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.barrier.p-b` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.attack` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.aid` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.self_aid` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.construct` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.launch` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.flight` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.s1` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.s1.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.s2` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.s2.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.activation` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.activation.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.delivery` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.delivery.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.remove.p-a` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.remove.p-b` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.a.encounter` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.barrier.p-a` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.barrier.p-b` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.attack` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.aid` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.self_aid` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.construct` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.launch` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.flight` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.s1` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.s1.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.s2` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.s2.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.activation` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.activation.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.delivery` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.delivery.remove` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.remove.p-a` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.remove.p-b` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.b.encounter` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.c.strip.a` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:foundation.probe.c.strip.b` | sim | foundation_interaction | engine | never eligible |  |  |  |  |
| `sim:village.storylets.begin` | sim | storylet | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.join` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.refuse` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.accept` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.work` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.buy_log` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.buy_food` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.buy_glass` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.commission_craft` | sim | systems_workshop | engine | eligible, never committed |  |  |  |  |
| `sim:systems_workshop.claim` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.learn` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.lease` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.assist_pack` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.upgrade` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.upgrade_use` | sim | systems_workshop | engine | committed |  | y | y |  |
| `sim:systems_workshop.disconnect` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.reconnect` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.renew` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.ordinary_pack` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.lens` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.inspect` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.repair` | sim | systems_workshop | engine | eligible, never committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.deliver_aligned` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.seal` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.ration` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.parcel` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.ordinary_ration` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.ordinary_parcel` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.deliver_ration` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.deliver_parcel` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.deliver_ordinary_ration` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.deliver_ordinary_parcel` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.cache_buy` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.cache_appraise` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.cache_open` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.sell_glass` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.sell_pin` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.buy_pin` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.wager` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.fold` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.settle_win` | sim | systems_workshop | engine | committed |  |  |  |  |
| `sim:systems_workshop.settle_loss` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_straight_1` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_straight_2` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_straight_3` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_branched_1` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_branched_2` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.model_branched_3` | sim | systems_workshop | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.apply_model_trial` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.apply_model_recommended` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.sell_parts` | sim | systems_workshop | engine | committed |  |  |  | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.irrigation_use` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.teach` | sim | systems_workshop | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.ask_ren` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:systems_workshop.ren_make` | sim | systems_workshop_npc | engine | never eligible |  |  |  |  |
| `sim:systems_workshop.collect_ren` | sim | systems_workshop | engine | committed |  |  | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `sim:p23.leisure.introduce` | sim | p23_leisure | engine | committed |  | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `action:p23.reading.pack_rest` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.rat_step.observe` | action | engine_action | engine | eligible, never committed | y | y | y | Skill Perception cannot receive expedition XP. |
| `action:frontier.rat_step.study` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.rat_step.internalize` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.rat_step.idle` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.rat_step.active` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.rat_step.route` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:chronicle.archive_duty` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.waypost` | action | engine_action | engine | eligible, never committed | y | y | y | Skill Perception cannot receive expedition XP. |
| `action:village.return_token` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.route_lesson` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.route_deduction` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.dry_bank` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.route_board` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.board_pack` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.morning_circle` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:village.chalk_copy` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.begin` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.brief` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.scout` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.timber` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.settle` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:town.return` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.inspect` | action | engine_action | engine | eligible, never committed | y | y | y | Skill Perception cannot receive expedition XP. |
| `action:frontier.kit` | action | engine_action | engine | committed | y |  |  |  |
| `action:frontier.rope` | action | engine_action | engine | committed | y | y | y | publication guard assertBacklogPublication: Close the bell-yard seal before another action, reward, transfer, body change or journey. |
| `action:frontier.pack` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.secure` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.anchor_route` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.extract` | action | engine_action | engine | never eligible |  |  |  |  |
| `action:frontier.depart` | action | engine_action | engine | never eligible |  |  |  |  |
| `transition:frontier.field_renewal` | transition | campaign_transition | engine | preview threw |  |  |  | Transition prerequisites are missing. |
| `advancement:frontier.measurement` | advancement | power_advancement | engine | committed |  |  |  | Power already owned. |
| `advancement:remainder_home.advance_loaded` | advancement | power_advancement | engine | attempted, rejected |  |  |  | Advancement prerequisites are missing. |
| `advancement:remainder_home.advance_fine` | advancement | power_advancement | engine | attempted, rejected |  |  |  | Advancement prerequisites are missing. |
| `response:book.paradise.campaign.gate_rescue:rigged_gap` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:timber_gap` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:paid_gap` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:exposed_gap` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:retreat_first` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:protected_lift` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:ordinary_lift` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:exposed_lift` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:retreat_second` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:leave_first` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:supply_hank` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:record_wounds` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.paradise.campaign.gate_rescue:conclude_retreat` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:inspect` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:retrieve_prepared` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:retrieve_social` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:retrieve_ordinary` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:rush_failure` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:withdraw` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:book.mol.hatch_encounter:negotiate` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:original_frontier.observation_frame:release` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:original_frontier.observation_frame:ordinary` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:original_frontier.observation_frame:focus` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:original_frontier.observation_frame:drive` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:original_frontier.observation_frame:brace` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:skills.brace.press:yield` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:skills.brace.press:hold` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:skills.brace.press:brace` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:skills.brace.press:counterpressure` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:rival.native_duel:withdraw` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:village.helper_crossing:check` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:village.helper_crossing:cross` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:field.assessment:ordinary` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:field.assessment:focus` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:field.assessment:drive` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:pursuit.footwork:ordinary` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:pursuit.footwork:focus` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:marked.encounter:steady` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:marked.encounter:explain` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:writ.encounter:steady` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:writ.encounter:explain` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:review.encounter:steady` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:review.encounter:explain` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:feature_battle.sluice:withdraw` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:artifact_collection.tray:aligned` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:artifact_collection.tray:ordinary` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:foundation.probe.a.encounter:attempt` | response | encounter_response | engine | never eligible |  |  |  |  |
| `response:foundation.probe.b.encounter:attempt` | response | encounter_response | engine | never eligible |  |  |  |  |
| `event:village.shower:cover` | event | event_response | engine | committed |  |  |  |  |
| `event:village.shower:wait` | event | event_response | engine | committed |  |  |  |  |
| `event:village.helper_report:note` | event | event_response | engine | never eligible |  |  |  |  |
| `event:field.road.window:kit` | event | event_response | engine | never eligible |  |  |  |  |
| `event:field.road.window:focus` | event | event_response | engine | never eligible |  |  |  |  |
| `event:field.road.window:drive` | event | event_response | engine | never eligible |  |  |  |  |
| `event:field.road.window:defer` | event | event_response | engine | never eligible |  |  |  |  |
| `event:village.shower_bench:cover` | event | event_response | engine | committed |  |  |  |  |
| `event:village.shower_bench:wait` | event | event_response | engine | committed |  |  |  |  |
| `event:village.rats_nearly_ate_cat:coin` | event | event_response | engine | committed |  |  |  |  |
| `event:village.rats_nearly_ate_cat:hunt` | event | event_response | engine | committed |  |  |  |  |
| `event:village.rats_nearly_ate_cat:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.stray_dog:feed` | event | event_response | engine | committed |  |  |  |  |
| `event:village.stray_dog:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.debt_collector_visits:pay` | event | event_response | engine | committed |  |  |  |  |
| `event:village.debt_collector_visits:stand` | event | event_response | engine | never eligible |  |  |  |  |
| `event:village.debt_collector_visits:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.roof_gives_way:repair` | event | event_response | engine | eligible, never committed |  |  |  | Insufficient, stale or unavailable item quantity. Refresh the trade. |
| `event:village.roof_gives_way:lend` | event | event_response | engine | committed |  |  |  |  |
| `event:village.roof_gives_way:borrow` | event | event_response | engine | committed |  |  |  |  |
| `event:village.roof_gives_way:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.fence_feud:mediate` | event | event_response | engine | eligible, never committed |  |  |  | Skill Perception cannot receive expedition XP. |
| `event:village.fence_feud:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.child_has_fever:healer` | event | event_response | engine | committed |  |  |  |  |
| `event:village.child_has_fever:help` | event | event_response | engine | committed |  |  |  |  |
| `event:village.child_has_fever:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.teacher_passes_through:learn` | event | event_response | engine | eligible, never committed |  |  |  | Skill Perception cannot receive expedition XP. |
| `event:village.teacher_passes_through:trade` | event | event_response | engine | eligible, never committed |  |  |  | Skill Perception cannot receive expedition XP. |
| `event:village.teacher_passes_through:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.peddler_with_rope:buy` | event | event_response | engine | committed |  |  |  |  |
| `event:village.peddler_with_rope:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.rats_in_the_granary:clear` | event | event_response | engine | eligible, never committed |  |  |  | Skill Pest killing cannot receive expedition XP. |
| `event:village.rats_in_the_granary:trap` | event | event_response | engine | committed |  |  |  | Response prerequisites are missing. |
| `event:village.rats_in_the_granary:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.scouts_on_forest_road:warn` | event | event_response | engine | eligible, never committed |  |  |  | Skill Perception cannot receive expedition XP. |
| `event:village.scouts_on_forest_road:dog` | event | event_response | engine | committed |  |  |  | Response prerequisites are missing. |
| `event:village.scouts_on_forest_road:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.fever_spreads:help` | event | event_response | engine | committed |  |  |  |  |
| `event:village.fever_spreads:pass` | event | event_response | engine | committed |  |  |  |  |
| `event:village.remembered_supply:listen` | event | event_response | engine | never eligible |  |  |  |  |
| `event:village.remembered_supply:pass` | event | event_response | engine | never eligible |  |  |  |  |
| `backlog:backlog.body.origin_reedling` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.weave_reed_rope` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.meet_brasswright` | backlog | backlog | host:backlog | committed | y |  | y |  |
| `backlog:backlog.body.buy_brass_lung` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.install_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.train_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.fuel_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.press_brass_seal` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.suppress_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.activate_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.remove_brass_lung` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.meet_clay_vessel` | backlog | backlog | host:backlog | committed | y |  | y |  |
| `backlog:backlog.body.ask_clay_vessel` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.possess_clay_vessel` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.press_clay_seal` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.return_from_clay` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.body.meet_family` | backlog | backlog | host:backlog | committed | y |  | y |  |
| `backlog:backlog.body.offer_family_succession` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.revoke_family_succession` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.accept_family_succession` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.return_family_succession` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.prepare_family_kit` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.body.receive_family_kit` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.loop.open` | backlog | backlog | host:backlog | committed |  |  | y |  |
| `backlog:backlog.loop.practice` | backlog | backlog | host:backlog | eligible, never committed |  |  |  | The bell-yard bag, equipment or money seal changed. No rewind or partial publication is allowed. |
| `backlog:backlog.loop.rewind` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.loop.finish` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.offline.arm` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.offline.request` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.offline.pause` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.offline.resume` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.offline.cancel` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.fate_offer` | backlog | backlog | host:backlog | committed | y |  | y |  |
| `backlog:backlog.fate_transfer` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.fate_settle` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.fate_return` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.ecology_join` | backlog | backlog | host:backlog | committed | y |  | y |  |
| `backlog:backlog.ecology_plant` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.ecology_harvest` | backlog | backlog | host:backlog | committed |  |  |  |  |
| `backlog:backlog.ecology_supply` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.ecology_close` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.meet` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.honest_entry` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.public_delivery` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.ask_eda_press` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.accept_office` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.present_honest` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.claim_eda` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.personal_test` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.registry_test` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.correct_clerk` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.borrow_template` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.learn_press` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.press` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.deliver_duty` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.return_template` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.return_office` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `backlog:backlog.replacement.revisit` | backlog | backlog | host:backlog | never eligible |  |  |  |  |
| `workplan:feature_society.household_itinerary` | workplan | work_plan | engine | committed |  |  |  | Hear and accept this itinerary’s known origin first. |
| `workplan:feature_society.apprentice_itinerary` | workplan | work_plan | engine | attempted, rejected |  |  |  | Hear and accept this itinerary’s known origin first. |
| `workplan:reference_gameplay.cooling_plan` | workplan | work_plan | engine | attempted, rejected |  |  |  | Pause, finish or cancel your existing itinerary first. |
| `workplan:audited_kit_reserve.resin_plan` | workplan | work_plan | engine | committed |  |  |  | Hear and accept this itinerary’s known origin first. |
| `workplan:crush_social.household_preparation` | workplan | work_plan | engine | committed |  |  |  | Hear and accept this itinerary’s known origin first. |
| `workplan:crush_social.household_known_use` | workplan | work_plan | engine | attempted, rejected |  |  |  | Hear and accept this itinerary’s known origin first. |
| `workplan:factorio_retort.three_batches` | workplan | work_plan | engine | attempted, rejected |  |  |  | Hear and accept this itinerary’s known origin first. |
| `open:simulation.enroll` | opener | opener | host:opener | committed |  |  |  | Living-world services are already enrolled or this command is stale. |
| `open:feature_objects` | opener | opener | host:opener | committed |  |  |  | The required knowledge, means or circumstances are missing. Finish your current activity first. This action has already been completed. This |
| `open:feature_society` | opener | opener | host:opener | committed |  |  |  | This household meeting is stale or already recorded. |
| `open:tidemark` | opener | opener | host:opener | committed |  |  |  | Finish your current activity first. This action has already been completed. |
| `open:observation` | opener | opener | host:opener | committed |  |  |  | The required knowledge, means or circumstances are missing. |
| `open:exchange` | opener | opener | host:opener | committed |  |  |  | This action has already been completed. |
| `open:promise` | opener | opener | host:opener | committed |  |  |  | This action has already been completed. |
| `open:body` | opener | opener | host:opener | committed |  |  |  | This action has already been completed. |
| `open:field` | opener | opener | host:opener | committed |  |  |  | This action has already been completed. |
| `open:original_frontier` | opener | opener | host:opener | attempted, rejected |  |  |  | The required knowledge, means or circumstances are missing. |
| `open:repositories` | opener | opener | host:opener | committed |  |  |  | This action has already been completed. |
| `open:reference_gameplay` | opener | opener | host:opener | committed |  |  |  | This catalogue enrollment is stale or unavailable. |
| `open:audited_kit_reserve` | opener | opener | host:opener | committed |  |  |  | Hear and accept this itinerary’s known origin first. |
| `open:factorio_retort_plan` | opener | opener | host:opener | attempted, rejected |  |  |  | Install and register the finite retort plan first. |
| `control:cancel` | control | control | engine | committed |  |  |  | This job cannot be cancelled. |
| `control:program` | control | control | engine | eligible, never committed |  | y | y | The required knowledge, means or circumstances are missing. |
| `control:pause` | control | control | engine | never eligible |  |  |  |  |
| `control:resume` | control | control | engine | never eligible |  |  |  |  |
| `control:withdraw` | control | control | engine | committed |  |  |  |  |
