// Prints society-sheet coverage per world (FD14, K34): authored, palette, missing, with each field's owner locator.
// Usage: node scripts/world_society_sheet_report.mjs   (exit 1 when a locator does not resolve)
import {readFileSync, existsSync} from 'node:fs';
import {SHEETS, sheetCoverage} from '../src/world_society_sheet.js';

const slug = h => h.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');
// Returns null when the locator resolves, else the reason it does not.
export function locatorProblem(locator) {
    if(typeof locator !== 'string' || !locator) return 'empty locator';
    const [file, anchor] = locator.split('#');
    if(!/^(src|docs)\//.test(file) || !existsSync(file)) return `file not found: ${file}`;
    const text = readFileSync(file, 'utf8');
    if(!anchor) return null;
    if(file.endsWith('.js')) return new RegExp(`export\\s+(?:async\\s+)?(?:const|let|function|class)\\s+${anchor}\\b|export\\s*\\{[^}]*\\b${anchor}\\b`).test(text) ? null : `no export ${anchor} in ${file}`;
    if(file.endsWith('.md')) {
        const heads = text.split('\n').filter(l => /^#{1,6}\s/.test(l)).map(l => slug(l.replace(/^#+\s+/, '')));
        return heads.some(h => h === anchor || h.startsWith(anchor + '-') || /^k\d+$/.test(anchor) && h.startsWith(anchor)) || new RegExp(`\\|\\s*${anchor.toUpperCase()}\\s*\\|`).test(text) ? null : `no heading ${anchor} in ${file}`;
    }
    return `unsupported locator: ${locator}`;
}

if(import.meta.url === `file://${process.argv[1]}`) {
    let bad = 0;
    for(const sheet of SHEETS) {
        const c = sheetCoverage(sheet);
        console.log(`${sheet.label}: ${c.authored} authored, ${c.palette} palette, ${c.missing} missing of ${c.total}`);
        for(const l of c.lines) {
            const problem = l.locator ? locatorProblem(l.locator) : 'no locator';
            if(problem) bad++;
            console.log(`  ${l.field.padEnd(13)}${l.status.padEnd(9)}${(l.palette ?? '').padEnd(17)}${l.locator ?? '-'}${problem ? `  !! ${problem}` : ''}`);
        }
    }
    process.exit(bad ? 1 : 0);
}
