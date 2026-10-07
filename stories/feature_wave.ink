// Original YAIRPG scene. Host transactions own every material, right and lesson.
VAR keeper_name = "the bench keeper"
VAR place_name = "the terrace"
VAR terms_known = false
VAR material_known = false
VAR tool_known = false
VAR lesson_known = false
VAR prior_agreement = ""
VAR lesson_done = false
VAR tool_held = false
VAR host_scene = "tidemark.negotiation"
VAR relay_keeper_name = "the rightful keeper"
VAR relay_clerk_name = "the registry clerk"
VAR relay_witness_name = "the familiar local"
VAR relay_terms_known = false
VAR credential_result = "unknown"
VAR registry_result = "unknown"
VAR personal_result = "unknown"
VAR office_held = false
VAR duty_done = false
VAR prior_relay_choice = ""
VAR voice_greeting = "The desk is open; the work still has to be done."
VAR voice_detail = "A cup cools beside the ledger. A used cloth keeps the seal clean."
VAR voice_aside = "The stamp is quicker than the paperwork. Most things are."


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

{ host_scene:
    - "relay.office": -> relay_meeting
    - "nested.hub": -> nested_hub
    - "nested.offer": -> nested_offer
    - "nested.mission": -> nested_mission
    - "nested.return": -> nested_return
    - else: -> meeting
}

=== meeting ===
The pump bench stands above the wet steps at {place_name}. {keeper_name} keeps one hand on the stock book and the other on the unfinished repair.
{ prior_agreement != "":
    { prior_agreement:
        - "material": "I remember the timber," {keeper_name} says. "It went into our working stock. It wasn't a gift back to you."
        - "coin": "Venn sold you a real log last time," {keeper_name} says. "A new purchase needs new stock and payment."
        - "loan": "That tool still has an owner," {keeper_name} says. "Bring it back before arranging another loan."
        - "returned": "You brought the inspection kit back," {keeper_name} says. "I remember that too."
        - "lesson":
            { lesson_done:
                "You've put the method to work since we spoke," {keeper_name} says. "Knowing it and having a sound pump are still different things."
            - else:
                "We agreed to instruction," {keeper_name} says. "The actual lesson still has to fit our time and means."
            }
        - "refused": "You declined last time," {keeper_name} says. "I remember. It didn't turn the whole town against you."
    }
- else:
    "The tide won't argue," {keeper_name} says. "We still can. Before you offer anything, ask what it is meant to do."
}
-> options

=== options ===
* [Ask what is being offered, and on whose terms. # response:ask_terms ]
    -> terms
* {terms_known && material_known} [Offer timber for the agreed local repair. # response:material ]
    -> material_acceptance
* {terms_known} [Buy one actual local log from Venn. # response:coin ]
    -> coin_acceptance
* {terms_known && tool_known} [Ask for a purpose-bound tool loan. # response:borrow_tool ]
    -> loan_acceptance
* {terms_known && tool_held} [Return the borrowed tool to its owner. # response:return_tool ]
    -> returned
* {terms_known && tool_held} [Use the reusable kit to inspect the linked floats. # response:use_tool ]
    -> inspection
* {terms_known && lesson_known} [Ask for the agreed instruction. # response:teach ]
    -> lesson_acceptance
* [Decline the proposed arrangement. # response:refuse ]
    -> refusal
* [Leave the discussion open for another visit. # response:leave ]
    -> leaving

=== terms ===
{keeper_name} turns the stock book so you can read the offered terms.
"A repair uses real supplies. A loan leaves the tool mine. Instruction needs my assent and a funded work period. You can take an ordinary work route, or leave us to it."
{material_known: A suitable timber contribution is an offered alternative to payment.}
{tool_known: The available loan states its purpose, owner and return duty.}
{lesson_known: The offered method has a separate teaching commitment; conversation alone does not teach it.}
The offered costs and conditions sit beside your responses. A promise is only accepted when those conditions still hold.
-> options

=== material_acceptance ===
The agreed timber is reserved for the accepted repair. {keeper_name} enters the commitment in the stock book.
"That's material set aside for this work now," they say. "We can do the job we actually have supplies and time for."
The repair and any later result remain in the local work record.
-> END

=== coin_acceptance ===
Venn records the agreed payment and hands over one real log from the local shop stock.
"That one is yours," {keeper_name} says. "Buying timber and agreeing to repair the sluice are separate things."
The log joins your actual bag. Another purchase needs another payment and available stock.
-> END

=== loan_acceptance ===
{keeper_name} checks the agreed purpose before handing over the available tool.
"Use it to inspect the floats and return it. It's reusable, and it's still mine between visits."
The tool and its return duty remain in your actual belongings and loan record.
-> options

=== inspection ===
You reserve a supported work period to inspect the linked floats with the actual reusable kit.
The finding arrives after that inspection finishes. The kit still has its owner and return duty.
-> END

=== returned ===
The borrowed tool passes back to its owner with its current condition intact.
{keeper_name} checks the record and closes this return. "Good. Any next loan is a new agreement."
-> END

=== lesson_acceptance ===
{keeper_name} agrees to the funded instruction and records the commitment.
"We'll work through it with the right tool and time," they say. "An agreement to teach isn't the completed lesson."
The actual teaching and learned result stay in the local work record.
-> END

=== refusal ===
"All right," {keeper_name} says. "I'll use the means we have."
The refusal stays a remembered exchange. It spends no repair payment and creates no loan or taught method.
-> END

=== leaving ===
You step away from the pump bench without accepting an arrangement.
{keeper_name} returns to the stock book. The local work goes on under its own supported clock; this conversation makes no new reservation.
-> END

// Original relay-office scene; host recognition records are observer-specific.
=== relay_meeting ===
{voice_detail}
{relay_keeper_name} sits beside the counter with their own bundle and tools. They leave space in the ledger for another hand.
"{voice_greeting}"
{ prior_relay_choice != "":
    { prior_relay_choice:
        - "honest": "You gave your own name last time," {relay_keeper_name} says. "That was enough to discuss ordinary work."
        - "alias": "You claimed another person's name," {relay_witness_name} says. "What I believed then and what the register said were separate things."
        - "credential": "You showed a credential," {relay_clerk_name} says. "Possessing it didn't settle the appointment."
        - "office": "We agreed to the office transfer," {relay_keeper_name} says. "My private possessions and learned methods stayed mine."
        - "corrected": "You corrected the earlier account," {relay_witness_name} says. "I remember the correction as well as the claim."
        - "work":
            {duty_done:
                "The accepted duty is now done," {relay_clerk_name} says. "That performance has its own record."
            - else:
                "You accepted work here," {relay_clerk_name} says. "Check the actual work record before calling it finished."
            }
        - "refused": "You declined the office," {relay_keeper_name} says. "We can still talk as ourselves."
    }
}
-> relay_options

=== relay_options ===
* [Ask which arrangements are actually offered. # response:relay_terms ]
    -> relay_terms
* {relay_terms_known} [Enter as yourself and use the ordinary work route. # response:relay_honest ]
    -> relay_honest
* {relay_terms_known} [Make the declared alias claim to this observer. # response:relay_alias ]
    -> relay_alias
* {relay_terms_known} [Ask this observer to check your actual credential. # response:relay_credential ]
    -> relay_credential
* {relay_terms_known} [Ask the clerk to check the office register. # response:relay_registry ]
    -> relay_registry
* {relay_terms_known} [Ask the familiar local to compare personal memory. # response:relay_personal ]
    -> relay_personal
* {relay_terms_known} [Accept the offered office and its stated duty. # response:relay_office ]
    -> relay_office
* {relay_terms_known} [Perform the offered physical seal work. # response:relay_work ]
    -> relay_work
* {relay_terms_known} [Correct the earlier claim with the available evidence. # response:relay_correction ]
    -> relay_correction
* [Refuse the proposed office arrangement. # response:relay_refuse ]
    -> relay_refuse
* [Leave this conversation open for later. # response:relay_leave ]
    -> relay_leave

=== relay_terms ===
"The office, a carried credential, and a person's name answer different questions," {relay_clerk_name} says. "We check them separately."
{relay_keeper_name} states the offered work and duties. Their own possessions, personal debt and learned methods remain with them.
The actual current costs, required consent and consequences accompany each offered response. Ordinary honest entry remains available.
"{voice_aside}"
-> relay_options

=== relay_honest ===
Your own identity is recorded for the ordinary route. Nobody's old affection, personal methods or completed work becomes yours.
"Then let's discuss what you can actually do," {relay_keeper_name} says.
-> END

=== relay_alias ===
You make the declared claim to its actual listener. The listener's recorded response is an attributed belief; your real identity remains separate.
{personal_result == "mismatch": "That doesn't match the person I remember," {relay_witness_name} says.}
{credential_result == "accepted": The credential observer accepted the presented credential. That is not the registry's appointment test.}
{registry_result == "not_holder": The clerk's current record does not appoint you.}
-> relay_options

=== relay_credential ===
The credential observer checks the actual presented evidence.
{ credential_result:
    - "accepted": "This evidence passes the credential check," the observer says. "I haven't checked your office appointment or personal history."
    - "rejected": "This evidence does not pass my check," the observer says.
    - else: The reported check remains limited to what this observer has actually disclosed.
}
-> relay_options

=== relay_registry ===
{relay_clerk_name} checks the authoritative local office record.
{ registry_result:
    - "holder": "The office is registered to you," the clerk says. "The stated duty comes with it."
    - "not_holder": "The office is not registered to you," the clerk says. "A face or carried badge doesn't appoint its holder."
    - else: No confirmed appointment has been disclosed by this check.
}
-> relay_options

=== relay_personal ===
{relay_witness_name} compares the claim with their own remembered contact.
{ personal_result:
    - "match": "That fits the person I remember," they say. "My memory is not an institutional appointment."
    - "mismatch": "The name doesn't make this the person I knew," they say.
    - else: Their disclosed account does not establish a personal match.
}
-> relay_options

=== relay_office ===
The willing appointment and its stated duty are entered in the register.
{relay_keeper_name} keeps their own tools and work. "The counter key will not teach you my grip," they say.
"Do the duty you accepted," they say. "Wearing the title won't do it for you."
-> END

=== relay_work ===
You deliver the two fitted seals to the counter. The accepted office duty is settled, and its funded payment is recorded once.
"Those seals count because they were made and handed over," {relay_clerk_name} says. "The badge alone would not have done it."
-> END

=== relay_correction ===
The earlier claim and the accepted evidence correction remain separately recorded for the actual listener.
"I'll keep both entries," {relay_clerk_name} says. "A correction changes the account; it doesn't erase what happened."
-> relay_options

=== relay_refuse ===
You refuse the office arrangement. Its rightful holder and possessions remain with their actual owners.
"All right," {relay_keeper_name} says. "You can still come back as yourself."
-> END

=== relay_leave ===
You leave the conversation without making another commitment. The living people, their own work and earlier actual history remain.
-> END


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
* {nested_terms_known && nested_refit_offered} [Go to the offered workroom to arrange a refit. # response:nested_return_refit ]
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
Your visit to the workroom is accepted. Arrange the actual refit there under its own stated means and costs.
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
