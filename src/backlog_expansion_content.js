import {bodyDefinitions,bodySources,bodyCapabilities,bodyItemDefinitions} from './backlog_expansion_body.js';
import {timePeople,timeSites} from './backlog_expansion_time.js';
import {opportunityDefinitions} from './backlog_expansion_opportunities.js';
import {replacementDefinitions,replacementSources} from './backlog_expansion_replacement.js';

// Existing simulation registry provisions no proof people automatically.
// Native proof actions are dispatched by backlogActions/commitBacklogAction.
export const backlogSimulationDefinitions = Object.freeze({
    people:Object.freeze([...bodyDefinitions.people,...timePeople,...opportunityDefinitions.people,...replacementDefinitions.people]),
    sites:Object.freeze([...timeSites,...opportunityDefinitions.sites,...replacementDefinitions.sites]),
    powers:replacementDefinitions.powers,
});
export const backlogSources = Object.freeze([...bodySources,...replacementSources]);
export const backlogCapabilities = bodyCapabilities;
export const backlogItemDefinitions = bodyItemDefinitions;
