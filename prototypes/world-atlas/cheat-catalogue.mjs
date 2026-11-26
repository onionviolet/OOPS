import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

// The design catalogue owns both the IDs and the implementation-status wording.
export function parseCheatCatalogue(markdown) {
    const sections = [];
    const seen = new Set();
    let section;
    let examples = false;
    for (const line of markdown.split(/\r?\n/)) {
        if (line.startsWith('## ')) {
            const heading = /^## ([A-J])\. (.+)$/.exec(line);
            section = heading ? {id:heading[1], name:heading[2].trim(), cheats:[], examples:[]} : null;
            if (section) sections.push(section);
            examples = false;
            continue;
        }
        if (!section || !line.startsWith('|')) {
            examples = false;
            continue;
        }
        const cells = line.trim().slice(1,-1).split(/(?<!\\)\|/).map(cell=>cell.trim().replaceAll('\\|','|'));
        const [id, name, effect, backing, worlds, hooks, limits, status, source] = cells;
        if (id === 'Ordinary decision') {
            examples = true;
        } else if (/^CTC\d+$/.test(id)) {
            if (cells.length !== 9 || !source || seen.has(id)) throw Error('Invalid cheat catalogue row '+id);
            seen.add(id);
            section.cheats.push({id,name,effect,backing,worlds,hooks,limits,status,source});
        } else if (examples && cells.length === 3 && !/^:?-{3,}/.test(id)) {
            section.examples.push({ordinary:id, advantage:name, evidence:effect});
        }
    }
    return sections;
}

export async function loadCheatCatalogue(root) {
    return parseCheatCatalogue(await readFile(join(root,'docs/CHEAT_CATALOGUE.md'),'utf8'));
}
