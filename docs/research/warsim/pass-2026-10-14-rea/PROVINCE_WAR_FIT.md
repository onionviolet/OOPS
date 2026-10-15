# Province War fit after exact native reads

PROPOSALS only. This pass extends [the prior fit](../PROVINCE_WAR_FIT.md)
within its own directory. No Province War implementation, live owners or packet
register was edited. Coordinator/intake can link this file directly. Local PW
owners still decide how proposals enter its queue.

| Prior ID | Updated fit | Exact source result / limit | Proposed gate |
|---|---|---|---|
| PW-W1 | Strengthened: mobilization should compete with labor, and survivors should return to the same population owner | TurnReport starts harvest from YourPeasants+Aslave, with explicit weather and modifiers; BattleTroopReturn restores surviving deployed peasants. Full deployment/annual order remains open | Show productive, deployed, dead and returned residents separately; one death removes one worker; one return restores one worker; no duplicate return |
| PW-W2 | Retain policy-gated negotiation, but keep law distinct from preferences | Petition slot 44 requires NoBegging=0, NoRabble=0 and SlaveKingdom=0; a policy changes eligibility, not just reputation | Explain known refusal and an available alternative; re-evaluate after policy change |
| PW-W3 | Still a concept fit, not an exact tributary formula | Tribute resolver was not reconstructed in this pass | Transfer receipt separates payer cost, receiver gain and political result; no guessed Warsim coefficient |
| PW-W4 | Strengthened identity reuse, with a caution on generated names | Faction resolver qualifies forms by role/civilization, creates ruler title outputs, may call typed or generated personal names; visible epithets can also carry stats | Existing faction facts drive identity and two consumers; names never manufacture unearned history |
| PW-W5 | Refine: power, head count, damage budget and casualty selection need separate state | Damage selects a living unit by cumulative counts; ordinary peasant kill requires budget>=51 and spends 50; a mercenary score branch combines count*quality with noise and fixed additions | Fixture checks a casualty at the exact boundary, carry injury, no negative count, survivor return and an understandable receipt; PW coefficients remain its own proposal |
| PW-W6 | Strengthened delegation proposal; acknowledgment is not a downstream consequence | Livestock aid removes 100 gold and consumes one visitor, with reaction wording; a reconstructed herd is not shown | Delegate a funded repeatable request with real recipient transfer and changed local fact, retaining manual refusal and reason |
| PW-W7 | Add: forecast affordability before bulk upkeep and keep wage cohorts explicit | Soldier wages pay the full group if affordable; insufficient funds at S>9 deserts rand()%floor(S/10), which can be zero | Paid and unpaid outcomes share the actual treasury; show full cohort cost, ordinary shortage and recovery route |
| PW-W8 | Add: quiet candidate slots and eligible-pool scheduling are separate design choices | Turn dispatch has at least 62/120 quiet slots; explore redraws rejected candidates; ProcGen's 24 slots map to 19 family targets | One scheduler owns cadence, weighted selection and known eligibility; a quiet result spends the correct clock budget without inventing rewards |

First choice remains PW-W1 where an existing population/mobilization owner is
ready. PW-W7 is a small companion, not a second playable wave. A wages warning
must help an actual spending decision. Warsim's race hierarchy, slavery policy,
fixed unit thresholds and arena payout are source facts, not PW requirements.

Desktop proposal target: 1366x768, with selected province, labor/deployment
ledger and known next-turn affordability visible together at comfortable text
size. Mobile optimization remains deferred. No UI or gameplay was built.
A changed runtime slice needs rebuilt target-viewport browser proof, and save,
reload and literal import for changed persistence, before a gameplay claim.
