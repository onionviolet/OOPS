import {CAUSAL_STORY_PROFILES, CAUSAL_STORY_PROOFS, causalStoryId} from './causal_story_ids.js';

// Original presentation proposals. These lines describe the request, not a
// courier's current body, inventory, private plan, source or unseen result.
const openings = Object.freeze({
    mortal: Object.freeze({
        before: 'Tarin has a practical question for you: will you hear the work before deciding whether to lend a hand?',
        begun: 'Tarin asked for help getting a useful kit to Nell. Your help stays optional; a later account must confirm what reached her.'
    }),
    covenant: Object.freeze({
        before: 'Asha asks you to hear her terms first. You can decide what, if anything, you want to contribute.',
        begun: 'Asha made a delivery request on her own terms. You can help, ask questions, or decline; the current offers show what each choice takes.'
    }),
    anchor: Object.freeze({
        before: 'Orin offers you a choice about a piece of Village work. Hear the request before committing your time or supplies.',
        begun: 'Orin asked for help with a delivery to Nell. Lending a hand and learning what happened are separate steps; his request does not make the outcome certain.'
    })
});

const approaches = Object.freeze([
    Object.freeze({id: 'help', label: 'Help and hear',
        description: 'Hear the request, choose your contribution, or wait for an account.'}),
    Object.freeze({id: 'study', label: 'Study and practice',
        description: 'Ask about the accounts you have received and the instruction currently offered.'}),
    Object.freeze({id: 'intervene', label: 'Intervene',
        description: 'Choose a direct intervention. Its listed requirements and costs still apply.'}),
    Object.freeze({id: 'afterward', label: 'Afterward',
        description: 'Speak or do useful work after hearing the delivery account.'})
]);

const studyActions = new Set(['hear_source_evidence', 'request_research', 'hear_research',
    'learn_method', 'adapt_method', 'authorize_release', 'request_source_release']);
const interventionActions = new Set(['strike', 'subdue', 'capture', 'release', 'release_source', 'sever', 'sever_job']);
const afterwardActions = new Set(['ordinary_followup', 'talk_afterward']);
const conversationRecords = new Set(['aftermath', 'afterward', 'talk_afterward']);
const suffix = value => typeof value === 'string' ? value.split('.').at(-1) : '';
const rows = value => Array.isArray(value) ? value : [];
const accountRows = value => rows(value).filter(row => row && row.known !== false
    && typeof row.text === 'string' && row.text.trim().length > 0);
const recordTime = row => Number.isFinite(row.at) && row.at >= 0 ? row.at : -1;

function latestReceived(records) {
    let latest = null;
    for(const row of records) {
        // Input insertion order settles equal-time records. Return the exact
        // admitted record, including its unshortened text and attribution.
        if(!latest || recordTime(row) >= recordTime(latest)) latest = row;
    }
    return latest;
}

function approachFor(row) {
    const action = suffix(row?.id || row?.command?.id);
    if(studyActions.has(action)) return 'study';
    if(interventionActions.has(action)) return 'intervene';
    if(afterwardActions.has(action)) return 'afterward';
    // New admitted offers still appear exactly once. keep_watch, care,
    // cooperation, refusal, withdrawal and received reports belong here.
    return 'help';
}

/** Read-only scene projection from player-admitted rows and a heard deadline. */
export function projectVillageScene({id, began = false, records = [], actions = [], work = [], deadlineRemaining = null, overview = null} = {}) {
    if(overview) {
        const targets=[...rows(overview.people),...rows(overview.things)];
        return {title:overview.title,phaseLabel:'Here',paragraphs:[],clockText:overview.clockText,latestAccount:null,
            groups:targets.map(target=>({id:target.id,label:target.name,actions:rows(overview.actions).filter(action=>action.target===target.id)})).filter(group=>group.actions.length)};
    }
    if(!CAUSAL_STORY_PROOFS.includes(id)) throw new TypeError('Unknown Village delivery scene.');
    const accounts = accountRows(records);
    const heardOutcome = accounts.some(row => row.id === causalStoryId(id, 'closure'));
    const heardConversation = accounts.some(row => row.id?.startsWith(`causal.story.${id}.`)
        && conversationRecords.has(suffix(row.id)));
    const doingWork = began === true && rows(work).length > 0;
    let phaseLabel = 'Hear the delivery terms';
    const paragraphs = [openings[id][began === true ? 'begun' : 'before']];
    if(began === true) {
        phaseLabel = 'Choose your approach';
        if(doingWork) {
            phaseLabel = 'Doing accepted work';
            paragraphs.push('Your accepted work is under way. Its listed time and cancellation terms apply.');
        } else if(heardConversation) {
            phaseLabel = 'Conversation after the account';
            paragraphs.push('You have heard a later conversation. The earlier delivery account remains part of this case.');
        } else if(heardOutcome) {
            phaseLabel = 'Heard the delivery account';
            paragraphs.push('Nell\'s account records what you were told. The current offers show what you can do next.');
        }
    }

    let clockText = '';
    if(began === true && Number.isFinite(deadlineRemaining) && deadlineRemaining >= 0) {
        const remaining = String(Number(deadlineRemaining.toFixed(2)));
        clockText = deadlineRemaining > 0
            ? `Heard delivery deadline: ${remaining} played minutes remaining. The clock alone does not tell you whether the kit arrived.`
            : 'The heard delivery window has elapsed. Its outcome comes from received accounts, not the clock alone.';
    }

    const groups = approaches.map(approach => ({...approach, actions: []}));
    for(const row of rows(actions)) groups.find(group => group.id === approachFor(row)).actions.push(row);
    return {
        title: `${CAUSAL_STORY_PROFILES[id].name}'s delivery`,
        phaseLabel,
        paragraphs,
        clockText,
        latestAccount: latestReceived(accounts),
        groups: groups.filter(group => group.actions.length > 0)
    };
}
