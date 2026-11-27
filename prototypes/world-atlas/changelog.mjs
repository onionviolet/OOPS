// ROUTE CONTRACT (stable, agent-readable; the Changes page uses this same route).
//   GET /changes?since=<iso date or commit>
//     {since{kind:"commit"|"iso"|"previous-snapshot"|"none", ref, label}, head, builtAt, groups[{id,label}],
//      commits[{hash, date, subject, groups[], files[]}] (newest first, at most 200),
//      working[{path, status, groups[]}]            uncommitted changes in the same inputs (this checkout is shared),
//      deltas[{key, from, to, change}] | null        per-ledger and cheat count changes between the previous snapshot and the current one;
//                                                    null when `since` is not the previous snapshot's commit (no snapshot exists for it),
//      counts{...}, previous{commit, builtAt}|null, note}
//     Default since = the previous snapshot's commit. With no previous snapshot, since.kind is "none" and the last 25 commits are listed.
//     `since` must be an ISO date or 4-40 hex characters naming a commit; anything else is a 400.
// What counts as an atlas input (one group each, a path may be in several):
//   coverage    docs/coverage/**
//   cheat-docs  docs/CHEAT_*.md, docs/CHEATS_BY_WORLD.md, docs/worlds/SCENARIO_WORLDS_AND_CHEATS_*, docs/audits/CHEAT_*
//   cheat-src   src/cheat_*
//   idea-boards docs/IDEA_INDEX.md and any docs/**/*IDEABOARD*.md
//   atlas       prototypes/world-atlas/**, tests/atlas_*
// The build part stores {current, previous} counts in the snapshot. A rebuild at an unchanged commit and unchanged counts keeps the
// older `previous`, so a delta stays visible until something changes. Nothing here writes a doc or runs a command that changes the tree.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
export const GROUPS = [
    {id: 'coverage', label: 'Coverage ledgers', test: p => p.startsWith('docs/coverage/')},
    {id: 'cheat-docs', label: 'Cheat docs', test: p => /^docs\/(CHEAT_[^/]*\.md|CHEATS_BY_WORLD\.md|worlds\/SCENARIO_WORLDS_AND_CHEATS_[^/]*|audits\/CHEAT_[^/]*)$/.test(p)},
    {id: 'cheat-src', label: 'Cheat source', test: p => /^src\/cheat_[^/]*$/.test(p)},
    {id: 'idea-boards', label: 'Idea boards', test: p => p === 'docs/IDEA_INDEX.md' || /^docs\/(.*\/)?[^/]*IDEABOARD[^/]*\.md$/.test(p)},
    {id: 'atlas', label: 'Atlas', test: p => p.startsWith('prototypes/world-atlas/') || /^tests\/atlas_/.test(p)},
];
export const PATHSPECS = ['docs/coverage', ':(glob)docs/CHEAT_*.md', 'docs/CHEATS_BY_WORLD.md', ':(glob)docs/worlds/SCENARIO_WORLDS_AND_CHEATS_*', ':(glob)docs/audits/CHEAT_*',
    ':(glob)src/cheat_*', 'docs/IDEA_INDEX.md', ':(glob)docs/**/*IDEABOARD*.md', 'prototypes/world-atlas', ':(glob)tests/atlas_*'];
export const groupsOf = path => GROUPS.filter(g => g.test(path)).map(g => g.id);

const SEP = '\x1e', FIELD = '\x1f';
export const LOG_FORMAT = `--format=${SEP}%H${FIELD}%cI${FIELD}%s`;
/** Parse `git log --name-only` output made with LOG_FORMAT. */
export function parseLog(text) {
    return String(text).split(SEP).map(chunk => chunk.trim()).filter(Boolean).map(chunk => {
        const [head, ...rest] = chunk.split('\n');
        const [hash, date, ...subject] = head.split(FIELD);
        const files = rest.map(f => f.trim()).filter(Boolean);
        return {hash, date, subject: subject.join(FIELD), groups: [...new Set(files.flatMap(groupsOf))], files};
    });
}
/** `git status --porcelain` lines -> {path,status,groups}, input paths only. */
export function parseStatus(text) {
    return String(text).split('\n').filter(l => l.length > 3).map(l => ({status: l.slice(0, 2).trim() || '?', path: l.slice(3).replace(/^"|"$/g, '').replace(/^.* -> /, '')}))
        .map(r => ({...r, groups: groupsOf(r.path)})).filter(r => r.groups.length);
}

/** Flatten the counts a snapshot keeps: per ledger family counts and the cheat counts. */
export function collectCounts({codex, cheats} = {}) {
    const out = {};
    for (const l of codex?.ledgers ?? []) {
        out[`codex.${l.ledger}.rows`] = l.rows;
        for (const [f, n] of Object.entries(l.counts ?? {})) out[`codex.${l.ledger}.${f}`] = n;
    }
    if (cheats) {
        for (const k of ['cheats', 'variations', 'withDefinition', 'candidates']) out[`cheats.${k}`] = cheats.counts[k];
        for (const [k, n] of Object.entries(cheats.counts.byStatus)) out[`cheats.status.${k}`] = n;
    }
    return out;
}
/** Only keys that moved, with a key that is new or gone shown as such. Sorted by size of change. */
export function countDeltas(prev, cur) {
    const out = [];
    for (const key of new Set([...Object.keys(prev || {}), ...Object.keys(cur || {})])) {
        const from = prev?.[key] ?? null, to = cur?.[key] ?? null;
        if (from !== to) out.push({key, from, to, change: (to ?? 0) - (from ?? 0)});
    }
    return out.sort((a, b) => Math.abs(b.change) - Math.abs(a.change) || a.key.localeCompare(b.key));
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Build part. `existing` is the snapshot already on disk at the output path (or null). */
export function buildChanges({commit, builtAt = new Date().toISOString(), codex, cheats, existing = null}) {
    const current = {commit, builtAt, counts: collectCounts({codex, cheats})};
    const old = existing?.current;
    let previous = null;
    if (old) previous = old.commit === commit && same(old.counts, current.counts) ? existing.previous ?? null : {commit: old.commit, builtAt: old.builtAt, counts: old.counts};
    return {current, previous};
}

const REF = /^[0-9a-f]{4,40}$/i;
/** Decide what `since` means. Throws on anything that is neither a date nor a hex commit. */
export function resolveSince(since, previous) {
    const s = String(since ?? '').trim();
    if (!s) return previous?.commit ? {kind: 'previous-snapshot', ref: previous.commit, label: `previous snapshot ${previous.commit} (${previous.builtAt})`} : {kind: 'none', ref: null, label: 'no previous snapshot'};
    if (REF.test(s)) return {kind: 'commit', ref: s, label: `commit ${s}`};
    if (/^\d{4}-\d{2}-\d{2}/.test(s) && !Number.isNaN(Date.parse(s))) return {kind: 'iso', ref: new Date(s).toISOString(), label: `since ${new Date(s).toISOString()}`};
    throw Error('since must be an ISO date or a commit hash.');
}

const defaultGit = args => execFileSync('git', args, {cwd: root, encoding: 'utf8', maxBuffer: 64e6, stdio: ['ignore', 'pipe', 'pipe']});
/** The route's payload. `git` is injectable so tests run on fixtures. */
export function changesSince(changes, since, git = defaultGit) {
    const previous = changes?.previous ?? null, cur = changes?.current ?? null;
    let resolved = resolveSince(since, previous), note = null;
    if (resolved.ref && resolved.kind !== 'iso') {
        try {git(['rev-parse', '--verify', '--quiet', resolved.ref + '^{commit}']);} catch {
            note = `Commit ${resolved.ref} is not in this checkout.`; resolved = {kind: 'none', ref: null, label: 'unresolved commit'};
        }
    }
    const range = resolved.kind === 'iso' ? [`--since=${resolved.ref}`] : resolved.ref ? [`${resolved.ref}..HEAD`] : ['-n', '25'];
    if (resolved.kind === 'none' && !note) note = 'No previous snapshot: showing the last 25 commits. Run build.mjs again after the next change to get a baseline.';
    const commits = parseLog(git(['log', LOG_FORMAT, '--name-only', '-n', '200', ...range, '--', ...PATHSPECS]));
    const working = parseStatus(git(['status', '--porcelain', '--untracked-files=normal', '--', ...PATHSPECS]));
    const head = git(['rev-parse', '--short', 'HEAD']).trim();
    const useDeltas = Boolean(previous && cur && (resolved.kind === 'previous-snapshot' || (resolved.ref && previous.commit.startsWith(resolved.ref))));
    return {since: resolved, head, builtAt: cur?.builtAt ?? null, groups: GROUPS.map(({id, label}) => ({id, label})), commits, working,
        deltas: useDeltas ? countDeltas(previous.counts, cur.counts) : null, counts: cur?.counts ?? null,
        previous: previous ? {commit: previous.commit, builtAt: previous.builtAt} : null, note};
}
