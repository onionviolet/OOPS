// First-hour guidance (proposal, docs/representations/FIRST_HOUR.md). One derived line saying what
// to do next and where to click. It reads quest progress and never stores anything, so saves,
// saved layouts and the opening quest are untouched. Rows are data: a later opening adds rows.
// `state.tasks` is the opening quest's per-task finished flags; `armed` and `fought` are plain facts.
export const FIRST_HOUR_QUEST = 'Lost memory';

// First row whose `when` is true wins. `where` names a workspace module for the Show me button.
export const FIRST_HOUR_STEPS = [
    {id: 'ask-elder', when: s => !s.tasks[0], where: 'local-actions',
        line: 'Talk to the village elder.',
        how: 'In Local actions: Talk to someone, then Talk to village elder.'},
    {id: 'ask-to-leave', when: s => !s.tasks[1], where: 'local-actions',
        line: 'Keep talking: say you want to leave.',
        how: 'In the conversation, pick the line about leaving, then "But I want to leave".'},
    {id: 'get-weapon', when: s => !s.tasks[2] && !s.armed && !s.fought, where: 'local-actions',
        line: 'Ask the elder about the spare weapon and pick one.',
        how: 'Talk to the elder, then "About the spare weapon...". Your choice goes in your inventory.'},
    {id: 'fight-rats', when: s => !s.tasks[2] && !s.fought, where: 'local-actions',
        line: 'Clear the wolf rats in the Infested field.',
        how: 'Local actions, then Move somewhere else, then Infested field. Fights run on their own; watch your health.'},
    {id: 'report-back', when: s => !s.tasks[2], where: 'local-actions',
        line: 'Tell the elder how the rats went.',
        how: 'Back in the village: Local actions, Talk to someone, Talk to village elder.'},
    {id: 'journal', when: s => !s.tasks[3], where: 'records',
        line: 'Your next lead is in the Journal.',
        how: 'Open Journal at the top, then read the quest "Lost memory".'},
];

export function nextStep(state) {
    if (!state || !Array.isArray(state.tasks)) return null;
    return FIRST_HOUR_STEPS.find(row => row.when(state)) || null;
}

// Renders into the node it is given (MDL13), and rewrites the DOM only when the step changes.
export function createNextStepCard({host, read, show, enabled = () => true}) {
    const card = host.ownerDocument.createElement('section');
    card.id = 'next_step'; card.setAttribute('aria-label', 'Next step');
    const label = host.ownerDocument.createElement('strong');
    const line = host.ownerDocument.createElement('span');
    const how = host.ownerDocument.createElement('small');
    const button = host.ownerDocument.createElement('button');
    label.textContent = 'Next step'; button.type = 'button'; button.textContent = 'Show me';
    card.append(label, line, how, button);
    let shown = null; card.hidden = true;
    button.onclick = () => { if (shown?.where) show(shown.where); };
    function render() {
        // Sit directly under the top strip; the workspace may mount its strip after this card.
        const bar = host.querySelector(':scope > .workspace-context-bar');
        if (bar && card.previousElementSibling !== bar) bar.after(card);
        const step = enabled() ? nextStep(read()) : null;
        if ((step?.id ?? null) === (shown?.id ?? null)) return;
        shown = step; card.hidden = !step;
        line.textContent = step ? step.line : ''; how.textContent = step ? step.how : '';
    }
    host.prepend(card); render();
    return {card, render};
}

// The one wiring call main.js makes. Reads quest state; refreshes on a slow tick and on setting change.
export function mountFirstHour({host, quests, active, killcounts, armed, show, setting, subscribe}) {
    const read = () => {
        const quest = quests[FIRST_HOUR_QUEST];
        if (!quest || !(FIRST_HOUR_QUEST in active) || quest.isFinished()) return null;
        return {tasks: quest.quest_tasks.map(task => task.isFinished()), armed: !!armed(),
            fought: Object.values(killcounts).some(n => n > 0)};
    };
    const view = createNextStepCard({host, read, show, enabled: () => setting() !== 'off'});
    subscribe(view.render);
    const timer = setInterval(view.render, 1000);
    return {...view, stop: () => clearInterval(timer)};
}
