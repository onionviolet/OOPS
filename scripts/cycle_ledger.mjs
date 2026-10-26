import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export function stronglyConnectedComponents(edges) {
  const graph = new Map();
  for (const edge of edges) {
    const [from, to] = edge.split(' -> ');
    if (!graph.has(from)) graph.set(from, new Set());
    if (!graph.has(to)) graph.set(to, new Set());
    graph.get(from).add(to);
  }
  let nextIndex = 0;
  const indices = new Map(), low = new Map(), stack = [], onStack = new Set(), components = [];
  function visit(node) {
    indices.set(node, nextIndex); low.set(node, nextIndex++); stack.push(node); onStack.add(node);
    for (const target of graph.get(node) || []) {
      if (!indices.has(target)) { visit(target); low.set(node, Math.min(low.get(node), low.get(target))); }
      else if (onStack.has(target)) low.set(node, Math.min(low.get(node), indices.get(target)));
    }
    if (low.get(node) === indices.get(node)) {
      const component = []; let member;
      do { member = stack.pop(); onStack.delete(member); component.push(member); } while (member !== node);
      components.push(component.sort());
    }
  }
  for (const node of graph.keys()) if (!indices.has(node)) visit(node);

  // An edge is cyclic when both endpoints belong to the same nontrivial SCC,
  // or it is a self-loop. Every baseline cycle edge therefore lands once.
  const byNode = new Map();
  components.forEach((members, id) => members.forEach(member => byNode.set(member, {id, members})));
  const groups = new Map();
  for (const edge of edges) {
    const [from, to] = edge.split(' -> '), component = byNode.get(from);
    if (component && component.id === byNode.get(to)?.id && (component.members.length > 1 || from === to)) {
      if (!groups.has(component.id)) groups.set(component.id, {members: component.members, edges: []});
      groups.get(component.id).edges.push(edge);
    }
  }
  return [...groups.values()].sort((a, b) => a.members[0].localeCompare(b.members[0])).map((group, index) => {
    const degree = new Map(group.members.map(member => [member, 0]));
    for (const edge of group.edges) { const [from] = edge.split(' -> '); degree.set(from, degree.get(from) + 1); }
    const hub = [...degree].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
    return {id: `C${String(index + 1).padStart(2, '0')}`, size: group.edges.length, hub, members: group.members, edges: group.edges};
  });
}

const d2Owners = [
  {match: members => members.some(file => /^(src\/(?:items|item|actor|person|enemy|native_).*\.js)$/.test(file)), owner: 'D2-1: native UI/bootstrap callbacks from item/actor modules'},
  {match: members => members.some(file => /^(src\/(?:backlog_expansion|expansion_engine|feature_expansion).*\.js)$/.test(file)), owner: 'D2-2: backlog validation vs engine orchestration'},
  {match: members => members.some(file => /^(src\/(?:simulation|simulation_effects|.*_host)\.js)$/.test(file)), owner: 'D2-3: simulation/effect host operations'},
];

export function makeLedger(groups) {
  const rows = groups.map(group => {
    const owner = d2Owners.find(candidate => candidate.match(group.members))?.owner ?? 'Unmatched';
    return `| ${group.id} | ${group.size} | \`${group.hub}\` | ${group.members.map(file => `\`${file.replace(/^src\//, '')}\``).join(', ')} | ${owner} |  |`;
  });
  return `# Cycle burn-down ledger, 2026-10-26\n\nGenerated from \`scripts/architecture_baseline.json\`. Each baseline cycle edge belongs to exactly one strongly connected component group. Group size counts edges; the hub is the member with the most outgoing group edges (ties use file order).\n\n| Group | Size (edges) | Hub | Members | Suggested owner | Round / result |\n|---|---:|---|---|---|---|\n${rows.join('\n')}\n\nBaseline cycle edges: ${groups.reduce((sum, group) => sum + group.size, 0)}.\n`;
}

export async function loadLedger(baselinePath = 'scripts/architecture_baseline.json') {
  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
  const groups = stronglyConnectedComponents(baseline.cycleEdges);
  const groupedCount = groups.reduce((sum, group) => sum + group.edges.length, 0);
  if (groupedCount !== baseline.cycleEdges.length) throw new Error(`Ledger grouped ${groupedCount} of ${baseline.cycleEdges.length} cycle edges`);
  return {baseline, groups, markdown: makeLedger(groups)};
}

async function main() {
  const {baseline, groups, markdown} = await loadLedger();
  await writeFile('docs/reviews/CYCLE_LEDGER_2026-10-26.md', markdown);
  for (const group of groups) console.log(`${group.id} (${group.size} edges) hub=${group.hub} members=${group.members.join(', ')}`);
  console.log(`Wrote ${groups.length} groups covering ${baseline.cycleEdges.length} cycle edges.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
