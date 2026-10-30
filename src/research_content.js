// Study rows for the Study view (RPX proposal, docs/representations/RESEARCH.md). Data only: a row
// names an existing lesson's commands, knowledge keys and power, and says in plain words what each
// step is, what it needs and what finishing opens. The view reads live state through these ids;
// it never grants anything, and a later volume or world adds a row, not code (tests lint every id
// against the live registry so a row cannot drift from the lesson it describes).
//
// step  {id, label, kind: 'evidence'|'understanding'|'practice', command, after[], minutes, where, how, finding?}
//         evidence = something seen or tried; understanding = being able to say why; practice = usable.
//         finding = knowledge key the step writes (its words are the partial finding).
// level {id, label, needs[] (step ids), means}   the highest level whose needs are done is current.
// opens {power, label, command, how}              what the finished study makes possible.

export const RESEARCH_PROJECTS = Object.freeze([
    {
        id: 'frontier.lever', world: 'base.frontier', title: 'Why the long arm lifts', subject: 'Levers and pivots',
        summary: 'The Village craftsman can show you how to free wedged timber with a lever. Watching is not enough: you need it checked, explained, then practised under supervision.',
        panel: 'field_panel',
        steps: [
            {id: 'hand', label: 'Work a wedged log by hand', kind: 'evidence', command: 'field.lp1.hand', after: [], minutes: 6, where: 'Village', how: 'Free and sort a wedged log yourself. It costs a log and stamina.', repeat: true},
            {id: 'demonstrate', label: 'Watch the craftsman demonstrate', kind: 'evidence', command: 'field.lp1.demonstrate', after: [], minutes: 0, where: 'Village', how: 'Ask the craftsman to demonstrate, between 08:00 and 18:00.', finding: 'field.lp1.demonstration'},
            {id: 'return', label: 'Return both records to the craftsman', kind: 'evidence', command: 'field.lp1.return', after: ['hand', 'demonstrate'], minutes: 0, where: 'Village', how: 'Hand-work and demonstration, in either order, then report back.', finding: 'field.lp1.returned'},
            {id: 'explain', label: 'Explain the pivot rule', kind: 'understanding', command: 'field.lp1.explain', after: ['return'], minutes: 0, where: 'Village', how: 'Say it back: brace near the pivot, lift the far end.', finding: 'field.lp1.rule'},
            {id: 'practice', label: 'Practise with the craftsman', kind: 'practice', command: 'field.lp1.practice', after: ['explain'], minutes: 3, where: 'Village', how: 'One practice brace, one coin and one stamina, then three supervised minutes.', finding: 'field.lp1.method'},
        ],
        levels: [
            {id: 'curious', label: 'Curious', needs: [], means: 'You know timber can be freed with a lever. Nothing is yet usable.'},
            {id: 'seen', label: 'Seen', needs: ['demonstrate'], means: 'You have watched it done. Watching alone grants no method.'},
            {id: 'checked', label: 'Checked', needs: ['hand', 'demonstrate', 'return'], means: 'The craftsman accepts your evidence and will hear your explanation.'},
            {id: 'explained', label: 'Explained', needs: ['explain'], means: 'You can say why it works. Supervised practice is now open.'},
            {id: 'practised', label: 'Practised', needs: ['practice'], means: 'You can do it yourself, given hands, a spare log and a body that works.'},
        ],
        opens: {power: 'field.lp1.lever', label: 'Free wedged timber with lever-setting', command: 'field.lp1.lever_work', how: '2 minutes, one log and one stamina; a spare log is held as the lever and returns. It can repeat on its own.'},
    },
    {
        id: 'frontier.datum', world: 'base.frontier', title: 'Marking a true datum', subject: 'Measured fitting',
        summary: 'Eda will teach a paid datum procedure at her Village bench. Learning it lets you fit a measured drain strip yourself.',
        panel: 'world_completion_learning_panel',
        steps: [
            {id: 'terms', label: 'Hear Eda\'s lesson terms', kind: 'evidence', command: 'world.completion.learning.begin', after: [], minutes: 0, where: 'Village bench', how: 'Optional: hear the price and what you must bring.', finding: 'world.completion.learning.terms'},
            {id: 'learn', label: 'Learn datum marking', kind: 'practice', command: 'world.completion.learning.learn_player', after: ['terms'], minutes: 5, where: 'Village bench', how: 'Two coins, a held offcut and your effort for five minutes.', finding: 'world.completion.learning.procedure'},
            {id: 'make', label: 'Fit a measured drain strip', kind: 'practice', command: 'world.completion.learning.make_player', after: ['learn'], minutes: 2, where: 'Village bench', how: 'One offcut and stamina; repeatable once learned.', repeat: true, finding: 'world.completion.learning.made'},
        ],
        levels: [
            {id: 'curious', label: 'Curious', needs: [], means: 'You have heard Eda teaches a datum procedure.'},
            {id: 'agreed', label: 'Terms heard', needs: ['terms'], means: 'You know the price and what to bring.'},
            {id: 'taught', label: 'Taught', needs: ['learn'], means: 'You can mark a datum under your own hands.'},
            {id: 'applied', label: 'Applied', needs: ['make'], means: 'You have used it on real timber.'},
        ],
        opens: {power: 'world.completion.learning.datum', label: 'Measured drain strips', command: 'world.completion.learning.make_player', how: 'Two minutes per strip; each keeps the sample it was fitted against.'},
    },
]);
