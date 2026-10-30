// Enrich existing scene steps with schema 1.5 fields using a subscription lane (Luna), keeping scene ids and beats untouched.
//   node scripts/lead_run/luna_enrich.mjs prompts --dir <private dir> --out <enrich dir> --lead <id> --tags <tags.jsonl> --shards w1s16:w1s16m,w2s20:w2s20m
//   node scripts/lead_run/luna_enrich.mjs check   --dir <private dir> --out <enrich dir> --shards ... [--sample 15]
// A shard spec is <shard id>:<scenes/census prefix>. Reply files: <out>/replies/<shard id>.json = {"steps":[{id, locator?, actor?, target?, using?, habit?, results?, witnesses?}]}.
// Prompts and replies hold book text: keep <out> under the gitignored private folder.
import {readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const jl = f => readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const arg = (a, k, d = null) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const shardFile = (dir, id) => join(dir, readdirSync(dir).find(f => f.startsWith(`shard_${id}_ch`)));
const paras = text => { const m = new Map(); let ch = null; for (const l of text.split('\n')) { const h = l.match(/^=== 第(\d+)章/); if (h) ch = +h[1]; const p = l.match(/^p(\d+): (.*)/); if (p && ch) m.set(`zh 第${ch}章 p${p[1]}`, p[2]); } return m; };
const INSTR = `You are a bounded source reader. Below are the known-names table, a list of already-fixed scenes with numbered steps, and the shard text (paragraphs \`pN\` under chapter headers). Do NOT add, remove, merge or reorder scenes or steps. For each step id listed, return only the schema 1.5 fields the shard supports, omitting any field the text is silent on:
- locator: the paragraph where the step happens, exactly as "zh 第N章 pM" (one paragraph).
- actor: id of who does it (use the known-names table; keep the script guess only if the text agrees, otherwise correct it; omit if the text does not say).
- target: ids acted on or spoken to. using: item ids used. witnesses: ids present who see or hear it, only when the text shows it.
- habit: once, repeated (several times in the shard) or routine (the text says habitual).
- results: the fact keys from the scene's outcomes this step causes, when listed.
Use only ids from the known-names table; if someone is not there, omit rather than invent. Record only what the shard states; no outside knowledge of the book.
Reply with one JSON object only: {"steps":[{"id":"<step id>", ...fields}]}. No commentary, no fences.`;
const [cmd, ...a] = process.argv.slice(2), dir = arg(a, '--dir'), out = arg(a, '--out'), specs = (arg(a, '--shards') || '').split(',').filter(Boolean).map(s => s.split(':'));
mkdirSync(join(out, 'prompts'), {recursive: true}); mkdirSync(join(out, 'replies'), {recursive: true});
if (cmd === 'prompts') {
    const tags = new Map(jl(arg(a, '--tags')).map(t => [t.id, t]));
    for (const [id, pre] of specs) {
        const scenes = jl(join(dir, `${pre}_scenes.jsonl`)), census = jl(join(dir, `${pre.replace(/m$/, '')}m_census.jsonl`));
        const names = census.filter(r => r.id).map(r => `${r.id} | ${r.label || ''} | ${r.zh || ''} | ${r.kind || ''}`).join('\n');
        const sc = scenes.map(s => `## ${s.beat} (pov ${s.pov}; place ${s.place})\n` + (s.outcomes || []).map(o => `outcome fact: ${o.fact}`).join('\n') + '\n' + s.steps.map((st, i) => { const t = tags.get(`${s.beat}#${i + 1}`) || {}; return `- ${s.beat}#${i + 1} [${st.class}] ${st.verb} (script actor: ${t.actor || '?'}, kind: ${t.kind || '?'})`; }).join('\n')).join('\n\n');
        writeFileSync(join(out, 'prompts', `${id}.md`), `${INSTR}\n\n=====\nKNOWN NAMES (id | label | zh | kind)\n${names}\n\n=====\nSCENES AND STEPS\n${sc}\n\n=====\nSHARD TEXT\n${readFileSync(shardFile(dir, id), 'utf8')}\n`);
    }
    console.log(specs.map(s => s[0]).join('\n'));
} else if (cmd === 'check') {
    const sample = +(arg(a, '--sample', 15)), rows = [], rep = {};
    for (const [id, pre] of specs) {
        const f = join(out, 'replies', `${id}.json`); if (!existsSync(f)) { rep[id] = 'no reply'; continue; }
        const steps = JSON.parse(readFileSync(f, 'utf8')).steps || [], P = paras(readFileSync(shardFile(dir, id), 'utf8'));
        const known = new Set(jl(join(dir, `${pre}_census.jsonl`)).map(r => r.id)), expected = new Set(jl(join(dir, `${pre}_scenes.jsonl`)).flatMap(s => s.steps.map((_, i) => `${s.beat}#${i + 1}`)));
        const c = {steps: steps.length, expected: expected.size, unknownStepIds: 0, badLocator: 0, unknownIds: 0, withLocator: 0, withActor: 0, withTarget: 0, withUsing: 0, withWitnesses: 0};
        for (const s of steps) {
            if (!expected.has(s.id)) c.unknownStepIds++;
            if (s.locator) { c.withLocator++; if (!P.has(s.locator)) c.badLocator++; }
            if (s.actor) c.withActor++; if (s.target?.length) c.withTarget++; if (s.using?.length) c.withUsing++; if (s.witnesses?.length) c.withWitnesses++;
            for (const x of [s.actor, ...(s.target || []), ...(s.using || []), ...(s.witnesses || [])]) if (x && !known.has(x)) c.unknownIds++;
            rows.push({shard: id, ...s, text: P.get(s.locator) || ''});
        }
        rep[id] = c;
    }
    const pick = rows.filter(r => r.locator && (r.target?.length || r.using?.length)).sort((x, y) => (x.id > y.id ? 1 : -1)); const step = Math.max(1, Math.floor(pick.length / sample));
    writeFileSync(join(out, 'spot_check.json'), JSON.stringify(pick.filter((_, i) => i % step === 0).slice(0, sample), null, 1));
    console.log(JSON.stringify(rep, null, 1));
}
