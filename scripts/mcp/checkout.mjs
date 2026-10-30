// game_new({checkout}): play a git worktree of this repository instead of the primary checkout.
// Private and untracked inputs (fonts, cast packs, node_modules) are symlinked from the primary
// checkout, or from YAIRPG_PRIVATE_ROOT when set; nothing private is copied or committed.
import {existsSync, lstatSync, mkdirSync, realpathSync, symlinkSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const PRIMARY = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const SHARED_INPUTS = ['private_packs', 'resources/fonts/private', 'node_modules'];
const git = (cwd, ...args) => execFileSync('git', args, {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim();

/** Validate `path` as a worktree of this repo and link the shared inputs; returns the real checkout root. */
export function resolveCheckout(path, {primary = PRIMARY, source = process.env.YAIRPG_PRIVATE_ROOT || primary} = {}) {
    if(typeof path !== 'string' || !path) throw Error('checkout must be a path.');
    const root = realpathSync(resolve(path));
    let common, mine;
    try {
        common = realpathSync(resolve(root, git(root, 'rev-parse', '--git-common-dir')));
        mine = realpathSync(resolve(primary, git(primary, 'rev-parse', '--git-common-dir')));
    } catch {throw Error(`${root} is not a git checkout.`);}
    if(common !== mine) throw Error(`${root} is not a worktree of this repository.`);
    if(!existsSync(join(root, 'scripts/mcp/game_worker.mjs'))) throw Error(`${root} has no scripts/mcp/game_worker.mjs; update that branch from master first.`);
    const linked = [];
    if(root !== realpathSync(source)) for(const rel of SHARED_INPUTS) {
        const from = join(source, rel), to = join(root, rel);
        if(!existsSync(from)) continue;
        try {lstatSync(to); continue;} catch {/* absent: link it */}
        mkdirSync(dirname(to), {recursive: true});
        symlinkSync(from, to);
        linked.push(rel);
    }
    return {root, linked};
}
