import {element as el} from './canvas.mjs';

// Status applies to the linked example. The gap describes the rest of the theme.
const themes = [
    ['design-principles', 'Design principles', 'Partial', 'Item identity and custody, reasonable choices, player-directed lives and continuous improvement.', 'Fang can choose how to recover and which stone to draw from. The two-seat Tingen comparison is still open.', 'Fang’s first night', '#workbench/play-evidence/fang-first-night'],
    ['worlds-and-priorities', 'Worlds and priorities', 'Partial', 'Distinct worlds, different kinds of progression, ordinary life and cross-world travel.', 'World cards distinguish native entries, registered locations and archive records. A registered place can still lack a way there.', 'Worlds', '#worlds'],
    ['starts-lives-and-continuation', 'Starts, lives and continuation', 'Playable', 'Beginnings, protagonist and local lives, continuation, inheritance and cheat advantages.', 'Alden’s hospital choice is playable. This example covers his own start and choice. Ordinary starts and cross-life inheritance need their own receipts.', 'Alden’s bedside choice', '#workbench/play-evidence/alden-bedside-choice'],
    ['book-worlds-and-the-leads-life', 'Book worlds and the lead’s life', 'Partial', 'Playable canon, ordinary days, protagonist capabilities and plausible alternatives.', 'The campaign ledger names exercised lead-life windows. A current-build uninterrupted journey and ordinary days across all lead lives remain open.', 'Campaign evidence', '#library/campaigns'],
    ['time-and-progression', 'Time and progression', 'Partial', 'Idle play, sleep, practice, time costs, repeatable work and consequences.', 'The paid inn sleep replay is checked separately. The combined first-night example needs matching breakfast and half-stone receipts. Long idle returns in other lives need their own checks.', 'Fang’s first night', '#workbench/play-evidence/fang-first-night'],
    ['making-and-crafting', 'Making and crafting', 'Partial', 'Procedural foundations, tools, materials, Gu, spells, compounds, recipes and technique.', 'Making links source records and individual game bindings. A recipe with no native evidence remains a gap even when the procedure runs in the engine.', 'Tingen making', '#world/lotm/making'],
    ['ui-and-look', 'UI and look', 'Partial', 'Desktop and laptop, Luminous Gothic, world-specific flavor, navigation and screen standards.', 'Desktop Atlas captures and game receipts each cover their own surface. The shared game UI is being standardized one screen at a time.', 'Native play evidence', '#workbench/play-evidence'],
    ['words-and-prose', 'Words and prose', 'Partial', 'Useful action text, restrained whimsy, distinct character voices and knowledge limits.', 'Native receipts include some wording and consequence checks. The Atlas has no comprehensive play evidence for voice across worlds.', 'Native play evidence', '#workbench/play-evidence'],
    ['platform-performance-and-saves', 'Platform, performance and saves', 'Partial', 'Tauri, older 8 GB computers, save compatibility and independent saved runs.', 'Four older saves passed the browser round trip. The installed build and 8 GB performance require separate evidence.', 'Ryan’s independent run', '#workbench/play-evidence/ryan-wyvern-visit'],
    ['scope-and-sequencing', 'Scope and sequencing', 'Partial', 'Foundations first, held-out canon, UI standardization, playability and release scope.', 'Progress records track partial implementations and open decisions. Held-out canon still needs a replay of the full activity from an existing game entry.', 'Where things stand', '#progress/overview'],
    ['research-and-sources', 'Research and sources', 'Reading-only', 'Real archive outputs, source observations, readings, world rules and adaptation.', 'Restored outputs can be browsed. Prepared text, coverage and native play each have separate evidence.', 'Reading outputs', '#library/outputs'],
    ['working-with-agents', 'Working with agents', 'Reading-only', 'Ownership, handoffs, reviewer evidence and playtest reports.', 'Handoffs track work and proof. They are a development tool.', 'Implementation handoffs', '#workbench/handoffs'],
    ['identity', 'Identity', 'Reading-only', 'OOPS, Optimistic Progression Simulator, a YAIR fork and progression RPG with idle play.', 'The source comparison names what came from YAIR. The scope and sequencing theme tracks OOPS development.', 'YAIR source comparison', '#world/yair/source'],
];

export const VISION_THEMES = themes.map(([id, label, status, terms, summary, evidenceLabel, evidenceHref]) =>
    ({id, label, status, terms, summary, evidenceLabel, evidenceHref, ...(status==='Partial'?{playGap:summary}:{})}));

const sections = [
    ['Worlds', '#worlds', ['worlds-and-priorities', 'book-worlds-and-the-leads-life', 'starts-lives-and-continuation', 'making-and-crafting', 'identity']],
    ['Find', '#find', ['design-principles', 'research-and-sources']],
    ['Systems', '#systems', ['time-and-progression', 'research-and-sources', 'words-and-prose']],
    ['Library', '#library', ['research-and-sources', 'book-worlds-and-the-leads-life', 'starts-lives-and-continuation', 'time-and-progression', 'making-and-crafting']],
    ['Creatures', '#creatures', ['worlds-and-priorities', 'making-and-crafting']],
    ['Progress', '#progress', ['scope-and-sequencing', 'platform-performance-and-saves', 'research-and-sources']],
    ['Workbench', '#workbench', ['design-principles', 'ui-and-look', 'words-and-prose', 'working-with-agents', 'time-and-progression']],
];

const labels = new Map(VISION_THEMES.map(theme => [theme.id, theme.label]));

function link(label, href) {
    const node = el('a', label);
    node.href = href;
    return node;
}

export function visionCoverageView({main, focus}) {
    const shell = el('section', null, 'atlas-find-page');
    shell.append(el('h1', 'Vision coverage'), el('p', 'Open a theme to see an example and the gap it leaves. Playable examples link to an exercised game route.'));
    const layout = el('div', null, 'vision-coverage-layout');
    const index = el('section', null, 'atlas-find-group');
    index.append(el('h2', 'Atlas sections'));
    const list = el('ul');
    for (const [label, href, ids] of sections) {
        const row = el('li');
        row.append(link(label, href), ` · ${ids.map(id => labels.get(id)).join(', ')}`);
        list.append(row);
    }
    index.append(list);
    const themeList = el('section', null, 'atlas-find-group');
    themeList.append(el('h2', 'Themes'));
    for (const theme of VISION_THEMES) {
        const detail = el('details', null, 'atlas-find-group');
        detail.id = `vision-${theme.id}`;
        detail.open = theme.id === focus;
        detail.append(el('summary', `${theme.label} · ${theme.status}`), el('p', theme.terms), el('p', theme.summary), link(theme.evidenceLabel, theme.evidenceHref));
        themeList.append(detail);
    }
    layout.append(index, themeList);
    shell.append(layout);
    main.replaceChildren(shell);
    if (focus) shell.querySelector(`#vision-${CSS.escape(focus)}`)?.scrollIntoView({block: 'nearest'});
}
