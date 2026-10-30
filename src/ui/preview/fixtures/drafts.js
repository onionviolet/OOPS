// DRAFT screens (COV14): views the representation docs describe that no live view draws yet. Each is built from the
// shared figure forms only (table, card, band, chips, bars), with invented names (CLR3). Every title says "Draft" and every
// summary says what doc row it comes from, so none can be mistaken for a shipped screen. Gallery only; nothing here is read by the game.
const draft = (spec) => ({size: 760, ...spec, title: `Draft: ${spec.title}`, summary: `Draft, not built. ${spec.summary}`});

// KNOWLEDGE K2-6: a fourth Knows view marked Insight; every line says what showed it.
export const INSIGHT_DRAFT = draft({
    id: 'draft-insight-view', title: 'Insight view (Knows)', summary: 'KNOWLEDGE K2-6. Lines shown by a gift, each with its source and how sure it is.',
    tables: [{id: 'insight', label: 'Insight: what the Lantern Sight shows you', columns: [{label: 'Line', weight: 2.2}, {label: 'Shown by', weight: 1.3}, {label: 'How sure', weight: 1}],
        rows: [
            {id: 'i1', cells: ['The quay clerk keeps two ledgers', 'Lantern Sight', 'clear'], state: 'filled'},
            {id: 'i2', cells: ['The east gate is watched at dusk', 'Lantern Sight', 'clear'], state: 'filled'},
            {id: 'i3', cells: ['Someone owes the ferryman a favour', 'Lantern Sight', 'a feeling'], state: 'guessed'},
            {id: 'i4', cells: ['What lies behind the cellar door', 'not shown', 'unknown'], state: 'unknown'}]}],
    chips: [{id: 'insight-kinds', label: 'Source', items: [{label: 'Seen by insight', state: 'active'}, {label: 'Taught', state: 'done'}, {label: 'Rumour', state: 'guessed'}]}],
    notes: [{state: 'unknown', text: 'Insight shows what the gift can reach. A secret still opens only by its own route.'}]});

// MAPS MT-F2, MT3: walks as their own panel, with the minutes, what blocks a walk and who is usually there.
export const WALKS_DRAFT = draft({
    id: 'draft-walks-panel', title: 'Walks panel', summary: 'MAPS next slice. One bar per walk, minutes beside it, blocked walks in words, usual company as chips.',
    bars: [{id: 'walks', label: 'Walks from the workroom', rows: [
        {label: 'Lodging', value: 2, max: 30, words: '2 min', state: 'done'},
        {label: 'Docks', value: 20, max: 30, words: '20 min', state: 'current'},
        {label: 'Reading hall', value: 25, max: 30, words: '25 min, the bridge is closed', state: 'broken'},
        {label: 'Orchard road', value: 14, max: 30, words: '14 min, rain slows it', state: 'strained'}]}],
    chips: [{id: 'usual', label: 'Usually at the docks', items: [{label: 'Net-mender', state: 'filled'}, {label: 'A ferryman', state: 'guessed', note: 'seen once'}, {label: 'Someone you cannot place', state: 'unknown'}]}]});

// RESEARCH S2 and COV15: the Study ladder fed by what you have heard of (a learn view).
export const RESEARCH_FEED_DRAFT = draft({
    id: 'draft-research-feed', title: 'Study fed by what you have heard of', summary: 'RESEARCH COV15. Each project names where you heard of it, its next step and the work done.',
    tables: [{id: 'feed', label: 'Study queue', barLabel: 'Done', columns: [{label: 'Project', weight: 1.6}, {label: 'Heard of from', weight: 1.4}, {label: 'Next step', weight: 1.6}],
        rows: [
            {id: 'f1', cells: ['Tide reckoning', 'a ferry notice', 'Copy the tables'], state: 'current', bar: .6, barNote: '6 of 10'},
            {id: 'f2', cells: ['Knot lore', 'the net-mender', 'Practise a bowline'], state: 'strained', bar: .25, barNote: '2 of 8, short of cord'},
            {id: 'f3', cells: ['Salt curing', 'a rumour', 'Ask someone who knows'], state: 'guessed', bar: 0, barNote: 'not started'},
            {id: 'f4', cells: ['Lamp repair', 'your own bench', 'Collect it'], state: 'done', bar: 1, barNote: 'done'}]}]});

// ECONOMY O1: the Due and Orders tabs beside Owed; who comes knocking and when.
export const DUE_ORDERS_DRAFT = draft({
    id: 'draft-due-orders', title: 'Due and Orders tab', summary: 'ECONOMY O1, R2-7. What falls due soon and what others have asked of you, with time left as a bar.',
    tables: [{id: 'due', label: 'Due and Orders', barLabel: 'Time left', columns: [{label: 'What', weight: 1.7}, {label: 'Who', weight: 1.2}, {label: 'Due', weight: 1}],
        rows: [
            {id: 'd1', cells: ['Repay a loan of 12', 'Quay lender', 'in 2 days'], state: 'strained', bar: .1, barNote: '2 of 30 days'},
            {id: 'd2', cells: ['Deliver 3 lamp wicks', 'Chandler', 'in 6 days'], state: 'current', bar: .4, barNote: '6 of 15 days'},
            {id: 'd3', cells: ['Return a borrowed saw', 'Neighbour', 'late by 1 day'], state: 'broken', bar: 0, barNote: 'overdue'},
            {id: 'd4', cells: ['Rent for the loft', 'Landlord', 'in 20 days'], state: 'pending', bar: .85, barNote: '20 of 30 days'}]}]});

// MAPS MT5: day threads, who is where along the hours, with your reachable window.
export const DAY_THREADS_DRAFT = draft({
    id: 'draft-day-threads', title: 'Day threads', summary: 'MAPS MT5. Time across, one lane per person, so you can see where to catch someone before noon.',
    bands: [{id: 'threads', label: 'Where each person is, by hour', lanes: ['You', 'Net-mender', 'Chandler', 'Ferryman'],
        axis: {from: 6, to: 20, ticks: [6, 9, 12, 15, 18, 20].map(at => ({at, label: String(at)})), mark: {at: 11, label: 'now'}},
        spans: [
            {from: 6, to: 9, label: 'Lodging', state: 'done'}, {from: 9, to: 20, lane: 0, label: 'Free to walk', state: 'pending'},
            {from: 6, to: 10, lane: 1, label: 'Docks', state: 'done'}, {from: 10, to: 13, lane: 1, label: 'Docks', state: 'current'}, {from: 13, to: 18, lane: 1, label: 'Home', state: 'pending'},
            {from: 8, to: 17, lane: 2, label: 'Shop', state: 'filled'},
            {from: 12, to: 16, lane: 3, label: 'Ferry', state: 'guessed'}]}],
    legend: [{state: 'done', label: 'already happened'}, {state: 'current', label: 'there now'}, {state: 'pending', label: 'usual place'}, {state: 'guessed', label: 'a guess from what you saw'}]});

// MAPS MT3: one walk as a route strip, with who you passed at your witness level.
export const ROUTE_STRIP_DRAFT = draft({
    id: 'draft-route-strip', title: 'Route strip', summary: 'MAPS MT3. One walk as stretches along the minutes, with what you noticed on the way.',
    bands: [{id: 'route', label: 'Workroom to docks, 20 minutes', lanes: ['Stretch', 'Noticed'],
        axis: {from: 0, to: 20, ticks: [0, 5, 10, 15, 20].map(at => ({at, label: `${at}`})), mark: {at: 8, label: 'you are here'}},
        spans: [
            {from: 0, to: 6, label: 'Lantern row', state: 'done', level: .3, note: 'quiet'},
            {from: 6, to: 13, label: 'Market lane', state: 'current', level: .8, note: 'crowded'},
            {from: 13, to: 20, label: 'Stair to the docks', state: 'pending', level: .5, note: 'wet steps'},
            {from: 3, to: 5, lane: 1, label: 'A hawker', state: 'done'},
            {from: 9, to: 12, lane: 1, label: 'Someone', state: 'unknown'}]}]});

// ECONOMY R2-9: a collector at the door; the card before you answer.
export const DOORSTEP_DRAFT = draft({
    id: 'draft-doorstep-card', title: 'A collector at the door', summary: 'ECONOMY R2-9. A card before you answer: what each reply costs and what it leaves open.',
    cards: [{id: 'door', label: 'Before you answer the door', state: 'strained', summary: 'The quay lender sent a collector about the loan of 12.',
        groups: [
            {id: 'pay', label: 'Pay now', rows: [{label: 'Costs', text: '12 coin from your purse, leaving 3.'}, {label: 'Leaves', text: 'The debt is settled and the collector goes.'}]},
            {id: 'grace', label: 'Ask for grace', rows: [{label: 'Costs', text: 'A few days of their patience and some face.'}, {label: 'Leaves', text: 'The debt stays, with a new date you must keep.'}]},
            {id: 'refuse', label: 'Refuse', state: 'broken', rows: [{label: 'Costs', text: 'Standing with the lender, who will tell others.'}, {label: 'Leaves', text: 'The debt stays and the next visit may not be polite.'}]}]}]});

// BODY BC4: your own body and a borrowed face, who sees which and for how long.
export const BORROWED_FACE_DRAFT = draft({
    id: 'draft-borrowed-face', title: 'Own body and borrowed face', summary: 'BODY BC4. Two rows of the same person, who sees which, and how long the borrowed one holds.',
    tables: [{id: 'faces', label: 'How you appear', barLabel: 'Holds', columns: [{label: 'Appearing as', weight: 1.5}, {label: 'Seen by', weight: 1.6}, {label: 'Slips if', weight: 1.4}],
        rows: [
            {id: 'b1', cells: ['Yourself', 'Family, the net-mender', 'never'], state: 'filled'},
            {id: 'b2', cells: ['A grey-coated clerk', 'The quay, the chandler', 'you speak at length'], state: 'current', bar: .55, barNote: 'about 3 hours'},
            {id: 'b3', cells: ['A tall stranger', 'Not yet tried', 'unknown'], state: 'unknown'}]}],
    chips: [{id: 'faces-conds', label: 'While the face holds', items: [{label: 'Voice unchanged', state: 'strained'}, {label: 'Left hand scar hidden', state: 'done'}]}]});

export const DRAFT_FIXTURES = [INSIGHT_DRAFT, WALKS_DRAFT, RESEARCH_FEED_DRAFT, DUE_ORDERS_DRAFT, DAY_THREADS_DRAFT, ROUTE_STRIP_DRAFT, DOORSTEP_DRAFT, BORROWED_FACE_DRAFT];
