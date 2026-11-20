// MW9 (docs/MOCKUP_SYSTEM.md): UI mocks are real-code branches, not standalone pages.
// Fails when prototypes/ gains an HTML page that was not in the tree when the rule landed
// (commit 4564b9c13), or when a labelled mock stub (MOCK_STUB) reaches tracked source.
// Pages already in that tree stay as history; the workbench host is exempt.
import {execFileSync} from 'node:child_process';

const BASELINE = '4564b9c13';
const git = args => execFileSync('git', args, {encoding: 'utf8'}).split('\n').filter(Boolean);
const files = [...new Set([...git(['ls-files', 'prototypes']), ...git(['ls-files', '--others', '--exclude-standard', 'prototypes'])])];
const history = new Set(git(['ls-tree', '-r', '--name-only', BASELINE, 'prototypes']));
// Folders dated before the rule also stay as history, tracked or not.
const before = f => f.split('/').some(part => (part.match(/(\d{4}-\d{2}-\d{2})$/)?.[1] || '9999') < '2026-11-19');
const pages = files.filter(f => f.endsWith('.html') && !history.has(f) && !before(f) && !f.startsWith('prototypes/workbench/'));
let stubs = [];
try { stubs = git(['grep', '-l', 'MOCK_STUB', '--', 'src', 'styles']); } catch { /* git grep exits 1 when nothing matches */ }
const problems = [
    ...pages.map(f => `${f}: standalone mock page; build the mock as a mock/<topic>-<date> branch (MW9)`),
    ...stubs.map(f => `${f}: MOCK_STUB marker in source; replace the stub before merging (MW9)`),
];
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`check_mock_pages: ok (${files.length} prototype files, no new pages, no stubs)`);
