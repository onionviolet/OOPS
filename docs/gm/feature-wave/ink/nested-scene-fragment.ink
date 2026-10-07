// Original Paradise-derived branch. No copied novel prose or canon claim.
// BEGIN NESTED VARIABLE DECLARATIONS
VAR nested_hub_present = false
VAR nested_local_present = false
VAR nested_return_arrived = false
VAR nested_offer_visible = false
VAR nested_destination_kind = ""
VAR nested_contact_name = "the person across from you"
VAR nested_hub_name = ""
VAR nested_destination_name = ""
VAR nested_issuer_name = ""
VAR nested_entry_context = ""
VAR nested_purpose = ""
VAR nested_role_terms = ""
VAR nested_mission_terms = ""
VAR nested_cost_terms = ""
VAR nested_welfare_terms = ""
VAR nested_portability_terms = ""
VAR nested_extraction_terms = ""
VAR nested_terms_known = false
VAR nested_work_offered = false
VAR nested_training_offered = false
VAR nested_refit_offered = false
VAR nested_role_offered = false
VAR nested_cooperation_offered = false
VAR nested_objective_offered = false
VAR nested_support_offered = false
VAR nested_extension_offered = false
VAR nested_withdrawal_offered = false
VAR nested_extraction_offered = false
VAR nested_recovery_offered = false
VAR nested_settlement_offered = false
VAR nested_dispute_offered = false
VAR nested_revisit_offered = false
VAR nested_residence_offered = false
VAR nested_issuer_outcome = ""
VAR nested_local_outcome = ""
VAR nested_recognition_report = ""
VAR nested_method_report = ""
VAR nested_welfare_report = ""
VAR nested_extraction_report = ""
VAR nested_request_report = ""
VAR nested_prior_exchange = ""
// END NESTED VARIABLE DECLARATIONS

// BEGIN NESTED KNOTS
=== nested_hub ===
{ nested_hub_present == false:
    No current conversation at the hub has been confirmed.
    -> END
}
{nested_hub_name != "": You are at {nested_hub_name}.}
A spoon rests across a cooling cup. {nested_contact_name} turns the cup's chipped edge away from their hand.
"Some days I finish the tea," they say. "What did you come for?"
{nested_prior_exchange != "": Your earlier exchange here: {nested_prior_exchange}}
{nested_role_terms != "": Your currently disclosed role terms: {nested_role_terms}}
-> nested_hub_options

=== nested_hub_options ===
* [Ask about the services, roles and their current terms. # response:nested_hub_terms ]
    -> nested_hub_terms
* {nested_terms_known && nested_work_offered} [Request the offered paid work. # response:nested_hub_work ]
    -> nested_hub_work
* {nested_terms_known && nested_training_offered} [Request the offered practical training. # response:nested_hub_train ]
    -> nested_hub_train
* {nested_terms_known && nested_refit_offered} [Request the offered repair or refit. # response:nested_hub_refit ]
    -> nested_hub_refit
* {nested_terms_known && nested_role_offered} [Request the offered role assessment. # response:nested_hub_role ]
    -> nested_hub_role
* [Leave this discussion without taking another service. # response:nested_hub_leave ]
    -> nested_hub_leave

=== nested_hub_terms ===
"Work, instruction and a place to sleep are different arrangements," {nested_contact_name} says. "Tell me which you want."
{nested_role_terms != "": Offered roles and their rights: {nested_role_terms}}
{nested_cost_terms != "": Current service costs: {nested_cost_terms}}
{nested_portability_terms != "": Disclosed passage conditions: {nested_portability_terms}}
The offer beside each response states its means and conditions.
-> nested_hub_options

=== nested_hub_work ===
Your request for the offered work is accepted for its stated next step.
"I'll need the work as well as your name," {nested_contact_name} says.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_hub_train ===
Your instruction request is accepted for its stated next step. Requesting a lesson does not supply a teacher's practiced skill.
{nested_request_report != "": {nested_request_report}}
{nested_method_report != "": Your disclosed method record: {nested_method_report}}
-> END

=== nested_hub_refit ===
Your refit request is accepted under the displayed terms. The actual item's current condition remains in its repair record.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_hub_role ===
Your role request is accepted for assessment under the offered rights and duties.
"An appointment has work attached," {nested_contact_name} says. "A borrowed name won't carry it for you."
{nested_request_report != "": {nested_request_report}}
{nested_recognition_report != "": Your disclosed recognition record: {nested_recognition_report}}
-> END

=== nested_hub_leave ===
You end the discussion. The spoon is still balanced across the cup.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_offer ===
{ nested_hub_present == false || nested_offer_visible == false:
    No current mission offer has been disclosed here.
    -> END
}
{nested_issuer_name != "": The disclosed issuer is {nested_issuer_name}.}
{nested_destination_name != "": The offered destination is {nested_destination_name}.}
{nested_purpose != "": The stated purpose: {nested_purpose}}
{nested_prior_exchange != "": Your earlier exchange about this offer: {nested_prior_exchange}}
{nested_contact_name} straightens a corner of the offer sheet, then gives up on it.
"Read it crooked, then. The terms are the same."
-> nested_offer_options

=== nested_offer_options ===
* [Read the actual offer, entry and return conditions. # response:nested_offer_terms ]
    -> nested_offer_terms
* {nested_terms_known} [Accept this offered mission under its current terms. # response:nested_offer_accept ]
    -> nested_offer_accept
* {nested_terms_known && nested_cooperation_offered} [Request the offered cooperative approach. # response:nested_offer_cooperate ]
    -> nested_offer_cooperate
* [Decline this mission offer. # response:nested_offer_decline ]
    -> nested_offer_decline
* [Leave the offer discussion open for now. # response:nested_offer_leave ]
    -> nested_offer_leave

=== nested_offer_terms ===
{nested_mission_terms != "": Mission obligations and issuer authority: {nested_mission_terms}}
{nested_entry_context != "": Disclosed entry context: {nested_entry_context}}
{nested_cost_terms != "": Current costs and reservations: {nested_cost_terms}}
{nested_welfare_terms != "": The separately disclosed local concern: {nested_welfare_terms}}
{nested_portability_terms != "": Body, belongings and method passage: {nested_portability_terms}}
{nested_extraction_terms != "": Return, extension and recovery terms: {nested_extraction_terms}}
"I can issue this offer," {nested_contact_name} says. "That doesn't let me speak for everyone you'll meet."
-> nested_offer_options

=== nested_offer_accept ===
Your acceptance is recorded under the offered commitment and entry terms. Acceptance and arrival have separate records.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_offer_cooperate ===
Your request for the offered cooperative approach is accepted for its stated next step.
Local assent, shared means and the issuer's obligation still have their own terms.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_offer_decline ===
You decline the offer. {nested_contact_name} draws the sheet back without an argument.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_offer_leave ===
You end the offer discussion without selecting another response.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_mission ===
{ nested_local_present == false || nested_entry_context == "":
    A current local meeting and its entry context have not been confirmed.
    -> END
}
{ nested_destination_kind != "saltworks" && nested_destination_kind != "archive":
    This conversation has no confirmed local setting.
    -> END
}
{nested_destination_name != "": You are at {nested_destination_name}.}
Your known entry context: {nested_entry_context}
{ nested_destination_kind == "saltworks":
    Salt dust outlines the hooks by the door. {nested_contact_name} rubs a stiff cloth between two fingers.
    "I used to get that clean," they say. "Before lunch, usually. Tell me what you've agreed to do."
- else:
    A blotter covers one corner of the desk. {nested_contact_name} returns a bookmark to its place before looking up.
    "You may disagree with the entry," they say. "Let me find the right page first."
}
{nested_prior_exchange != "": Your earlier exchange in this local mission: {nested_prior_exchange}}
{nested_purpose != "": Your disclosed mission purpose: {nested_purpose}}
{nested_welfare_terms != "": The disclosed local concern: {nested_welfare_terms}}
-> nested_mission_options

=== nested_mission_options ===
* [Ask for the currently disclosed local and mission account. # response:nested_local_report ]
    -> nested_local_report
* {nested_terms_known && nested_objective_offered} [Request the offered objective work. # response:nested_local_objective ]
    -> nested_local_objective
* {nested_terms_known && nested_support_offered} [Request the offered help for the local concern. # response:nested_local_support ]
    -> nested_local_support
* {nested_terms_known && nested_extension_offered} [Request the stated mission extension. # response:nested_local_extend ]
    -> nested_local_extend
* {nested_terms_known && nested_withdrawal_offered} [Request withdrawal under the known terms. # response:nested_local_withdraw ]
    -> nested_local_withdraw
* {nested_terms_known && nested_extraction_offered} [Request the offered extraction stage. # response:nested_local_extract ]
    -> nested_local_extract
* {nested_terms_known && nested_recovery_offered} [Request the disclosed extraction recovery. # response:nested_local_recover ]
    -> nested_local_recover
* [Refuse the currently proposed local arrangement. # response:nested_local_refuse ]
    -> nested_local_refuse
* [End this local discussion. # response:nested_local_leave ]
    -> nested_local_leave

=== nested_local_report ===
{nested_mission_terms != "": Current mission obligations: {nested_mission_terms}}
{nested_cost_terms != "": Current costs and reservations: {nested_cost_terms}}
{nested_extraction_terms != "": Known withdrawal, extraction and recovery terms: {nested_extraction_terms}}
-> nested_known_reports ->
-> nested_mission_options

=== nested_local_objective ===
Your request for the offered objective work is accepted for its stated next step.
{ nested_destination_kind == "saltworks":
    "The machinery has its own needs," {nested_contact_name} says. "Tell me which work you've taken."
- else:
    "The commission names its question," {nested_contact_name} says. "That isn't every question in this room."
}
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_local_support ===
Your local-support request is accepted under the offered means and assent.
{ nested_destination_kind == "saltworks":
    "We have to work with the supplies on hand," {nested_contact_name} says. "We can discuss whose work comes first."
- else:
    "A claim needs its evidence heard," {nested_contact_name} says. "The issuer's seal doesn't answer for the witness."
}
{nested_request_report != "": {nested_request_report}}
{nested_welfare_report != "": Your disclosed welfare record: {nested_welfare_report}}
-> END

=== nested_local_extend ===
Your extension request is accepted for the stage permitted by the current contract. A request is not an unstated extra period.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_local_withdraw ===
Your withdrawal request is accepted under the disclosed terms. The actual mission outcome and return stage remain separate.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_local_extract ===
Your request for the offered extraction stage is accepted. Initiating extraction does not confirm hub arrival.
{nested_request_report != "": {nested_request_report}}
{nested_extraction_report != "": Your disclosed extraction record: {nested_extraction_report}}
-> END

=== nested_local_recover ===
Your request for the currently offered recovery is accepted for its stated step. Its result applies to this extraction.
{nested_request_report != "": {nested_request_report}}
{nested_extraction_report != "": Your disclosed extraction record: {nested_extraction_report}}
-> END

=== nested_local_refuse ===
You refuse the proposed local arrangement. An existing mission or accepted duty still has its recorded terms.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_local_leave ===
You end the local discussion. The existing mission and local records remain as they were accepted.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_return ===
{ nested_hub_present == false || nested_return_arrived == false:
    Actual arrival at the hub has not been confirmed for this return.
    -> END
}
{nested_hub_name != "": You have arrived at {nested_hub_name}.}
{nested_contact_name} has a fresh cup and the same chipped saucer.
"You can sit," they say. "I'll read while you drink."
{nested_prior_exchange != "": Your earlier exchange about this return: {nested_prior_exchange}}
{nested_extraction_report != "": Your disclosed return record: {nested_extraction_report}}
-> nested_known_reports ->
-> nested_return_options

=== nested_return_options ===
* [Review the issuer result and separate local aftermath. # response:nested_return_report ]
    -> nested_return_report
* {nested_terms_known && nested_settlement_offered} [Request the offered mission settlement. # response:nested_return_settle ]
    -> nested_return_settle
* {nested_terms_known && nested_dispute_offered} [Request review of the disclosed disputed account. # response:nested_return_dispute ]
    -> nested_return_dispute
* {nested_terms_known && nested_refit_offered} [Request the offered refit between journeys. # response:nested_return_refit ]
    -> nested_return_refit
* {nested_terms_known && nested_revisit_offered} [Request the offered revisit to the retained destination. # response:nested_return_revisit ]
    -> nested_return_revisit
* {nested_terms_known && nested_residence_offered} [Request the offered continued hub residence. # response:nested_return_stay ]
    -> nested_return_stay
* [End the return discussion. # response:nested_return_leave ]
    -> nested_return_leave

=== nested_return_report ===
{nested_mission_terms != "": Disclosed settlement and review terms: {nested_mission_terms}}
{nested_cost_terms != "": Current settlement, residence or service costs: {nested_cost_terms}}
{nested_portability_terms != "": Known retained-carrier conditions: {nested_portability_terms}}
-> nested_known_reports ->
"The issuer's account and the local account can differ," {nested_contact_name} says. "I'll keep their names on their own pages."
-> nested_return_options

=== nested_return_settle ===
Your settlement request is accepted for the offered stage. Any delivered award belongs to its actual settlement record.
{nested_request_report != "": {nested_request_report}}
-> nested_known_reports ->
-> END

=== nested_return_dispute ===
Your review request is accepted with the available account and evidence. A requested review is not a favorable ruling.
{nested_request_report != "": {nested_request_report}}
{nested_recognition_report != "": Your disclosed recognition record: {nested_recognition_report}}
{nested_welfare_report != "": Your disclosed welfare record: {nested_welfare_report}}
-> END

=== nested_return_refit ===
Your between-journey refit request is accepted under the displayed means and costs.
{nested_request_report != "": {nested_request_report}}
{nested_method_report != "": Your disclosed method record: {nested_method_report}}
-> END

=== nested_return_revisit ===
Your revisit request is accepted under the currently offered passage terms. That request does not establish another arrival.
{nested_request_report != "": {nested_request_report}}
{nested_welfare_report != "": Your disclosed retained local record: {nested_welfare_report}}
-> END

=== nested_return_stay ===
Your request to remain at the hub is accepted under the offered residence terms.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_return_leave ===
You end the report discussion. {nested_contact_name} moves the cup out of the way of the papers.
{nested_request_report != "": {nested_request_report}}
-> END

=== nested_known_reports ===
{ nested_issuer_outcome != "":
    The issuer's disclosed outcome: {nested_issuer_outcome}
- else:
    No issuer outcome has been disclosed here.
}
{ nested_local_outcome != "":
    The separately disclosed local outcome: {nested_local_outcome}
- else:
    No local welfare outcome has been disclosed here.
}
{nested_recognition_report != "": Your disclosed recognition record: {nested_recognition_report}}
{nested_method_report != "": Your disclosed method record: {nested_method_report}}
{nested_welfare_report != "": Your disclosed welfare record: {nested_welfare_report}}
->->
// END NESTED KNOTS
