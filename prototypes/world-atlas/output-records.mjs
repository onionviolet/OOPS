// Exact selected-file joins. Private rows are identity inputs only; every returned word comes from the admitted digest.
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
import {readerDirectory} from './library-reading.mjs';
import {legacyReaderSlices, orphanReaderSlices} from './reader-slices.mjs';
import {OUTPUT_KINDS, selectCollectedOutput} from './batch-output-index.mjs';
import {lifeIdentity, projectLifeRow, publicLifeRow} from './texture-life.mjs';
import {projectReaderFill, proposalSafety} from './reader-proposals.mjs';
import {createOutputFieldCoverage} from './output-field-coverage.mjs';
import {readOutputMethodAttestation} from './output-method-attestation.mjs';
import {createUnindexedExplanation} from './output-unindexed.mjs';
import {readMentionRange} from './output-mention-range.mjs';

const array = value => Array.isArray(value) ? value : [];
const normalize = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLowerCase() : '';
const locator = value => typeof value === 'string' && parseLocator(value) ? value.trim() : null;
const safeText = value => typeof value === 'string' && value.trim() && !/(?:file:\/\/|[a-z]:[\\/]|(?:^|\s)\/(?:Users|home|tmp|private|var|mnt)\/|https?:\/\/|(?:^|[\\/])private[\\/])/i.test(value) ? value : null;
const fillIdentity = row => JSON.stringify(['id', 'kind', 'what', 'for', 'status', 'layer', 'confidence', 'basis', 'respects', 'replaceableBy'].map(key => row[key] ?? (['basis', 'respects'].includes(key) ? [] : null)));
const countsFor = () => ({fileRows: 0, matchedRows: 0, noPublicMatch: 0, ambiguous: 0, unindexed: 0, parseFailures: 0, readFailures: 0});
function indexed(rows, key) {
    const out = new Map();
    rows.forEach((row, index) => {if (!row || typeof row !== 'object') return; const value = key(row); if (!out.has(value)) out.set(value, []); out.get(value).push({row, index});});
    return out;
}
function sourcesMatch(publicRow, raw, prefix, pass) {
    const sources = array(publicRow.sources).length ? publicRow.sources : [{pass: publicRow.pass, label: publicRow.label, locator: publicRow.locator}];
    return sources.some(source => (!source.shard || source.shard === prefix) && (!source.pass || source.pass === pass)
        && (source.label || null) === (raw.label || null) && locator(source.locator) === locator(raw.locator));
}

// One inventory and one set of public-record indexes per book inspection. The
// caller owns the lifetime, so a later request observes changed files and hashes.
export function createBookOutputReader(book, options = {}) {
    const directory = options.directory ?? readerDirectory(book);
    const names = options.names ?? (existsSync(directory) ? readdirSync(directory) : []);
    const files = new Set(names), registry = options.registry || [book];
    const shards = options.shards ?? bookShards(book,names);
    const prepared = new Set(shards.map(row=>row.prefix));
    const legacy = new Map(legacyReaderSlices(book,registry,names).slices.map(row=>[row.prefix,row]));
    const orphan = new Set(orphanReaderSlices(book,registry,names,shards).map(row=>row.prefix));
    const indexes = new Map(), attestations = new Map();
    function index(family,key) {
        if (!indexes.has(family)) indexes.set(family,indexed(array(options.digest?.[family]),key));
        return indexes.get(family);
    }
    function attestation(family,prefix,pass,kind,source) {
        if (!attestations.has(family)) {
            const byOutput = new Map();
            for (const input of options.digest?.[family] || []) {
                if (input.key !== book.key) continue;
                const key = JSON.stringify([input.prefix,input.pass,input.kind,input.source]);
                if (!byOutput.has(key)) byOutput.set(key,input);
            }
            attestations.set(family,byOutput);
        }
        return attestations.get(family).get(JSON.stringify([prefix,pass,kind,source]));
    }
    const context = {directory,names,files,prepared,legacy,orphan,index,attestation,peopleSubjects:new Map(),censusRuleSubjects:new Map()};
    return {
        prefixes:[...new Set([...prepared,...legacy.keys(),...orphan])],
        selected:(prefix,pass,kind)=>selectCollectedOutput(files,prefix,pass,kind),
        read:(query,readFile=options.readFile)=>readOutputRecords(book,query,{...options,readFile},context),
    };
}

/** book + range + logical output only. Full digest supplied by the server is the disclosure boundary.
 * No inferred title matching. Pagination follows matching/deduplication so every safe distinct target is reachable. */
export function readOutputRecords(book, query, options = {}, context) {
    if (!context) return createBookOutputReader(book,options).read(query);
    const {prefix, pass, kind} = query;
    const size = Math.max(1, Math.min(100, Number.isInteger(query.size) ? query.size : 40));
    const requestedOffset = Math.max(0, Number.isInteger(query.offset) ? query.offset : 0);
    const counts = countsFor();
    const result = {key: book.key, world: book.world, prefix, pass, kind, scope: null, status: 'unindexed', source: null,
        total: 0, offset: 0, size, inspected: false, records: [], counts,
        coverage: {boundary: 'admitted-world-digest', note: 'Exact identity joins only. Unindexed rows have no attested direct match in this digest; withheld rows are not disclosed.'}};
    if (!OUTPUT_KINDS.some(def => def.pass === pass && def.kind === kind)) return result;
    const fieldCoverage = createOutputFieldCoverage(pass, kind);
    const {directory} = context;
    const historic = context.legacy.get(prefix);
    result.scope = context.prepared.has(prefix) ? 'registry' : historic ? 'legacy' : context.orphan.has(prefix) ? 'orphan' : null;
    if (!result.scope) return result;
    const selected = selectCollectedOutput(context.files,prefix,pass,kind);
    result.source = selected.source;
    if (!selected.name) {result.status = selected.partial ? 'partial' : 'missing'; return result;}
    const digest = options.digest;
    if (!digest || digest.world !== book.world) {result.coverage.note = 'No admitted digest for this world. Source rows are not disclosed.'; return result;}
    const needsAttestation = result.scope === 'orphan' || historic?.family === 'graded-stage';
    const family = result.scope === 'orphan' ? 'orphanInputs' : 'legacyInputs';
    const attestation = needsAttestation && context.attestation(family,prefix,pass,kind,selected.source);
    if (needsAttestation && (!attestation || selected.partial || historic?.admitted === false)) {
        result.coverage.note = result.scope === 'orphan' ?
            'This file has no prepared chapter range and was not admitted to this snapshot. Its records are unavailable.' :
            'The historical stage needs a qualifying grade and a matching file in the snapshot before its records can be shown.';
        return result;
    }
    // Only index the requested family; a texture page need not walk every entity and scene in a world.
    const byId = row => row.id;
    const entities = ['census','people','places'].includes(kind) && context.index('entities',byId);
    const rules = kind === 'rules' && context.index('rules',byId);
    const scenes = kind === 'scenes' && context.index('scenes',byId);
    const fills = kind === 'fills' && context.index('fills',byId);
    const notes = kind === 'other' && context.index('notes',row => normalize(row.what));
    const life = ['services','customs','news'].includes(kind) && context.index('life',
        row => publicLifeRow(row) && typeof row.what === 'string' ? lifeIdentity(row) : null);
    const fillGuard = proposalSafety([]), records = new Map();
    const explanation = query.explain === true ? createUnindexedExplanation(kind,id =>
        ['entities','rules','scenes','fills'].flatMap(family => (context.index(family,byId).get(id)||[])
            .filter(({row})=>publicLifeRow(row)).map(()=>family))) : null;
    const mentionRequest=query.mentions===true&&pass==='census'&&kind==='census';
    const mentionRecords=new Map();let mentionRange,mentionRows=0;
    function publicRecord(type, row, index, variantIndex) {
        const label = safeText(type === 'entity' ? row.label : type === 'rule' ? row.name : type === 'scene' ? row.locator || row.id : row.what);
        if (!publicLifeRow(row) || !label || (row.id && !safeText(row.id))) return null;
        const locators = [...new Set([row.locator, row.first, ...array(row.locators), ...array(row.basis), ...array(row.sources).map(source => source.locator)].map(locator).filter(Boolean))];
        const view = type === 'scene' ? 'reader-scenes' : type === 'rule' && ['craft', 'potion', 'rite', 'spell'].includes(row.kind) ? 'making' : 'things';
        const focus = type === 'note' || type === 'life' ? row.focusKey || `${type}:${index}` : view === 'making' ? 'working:' + row.id : row.id;
        if (!focus) return null;
        return {type, key: type + ':' + (row.id == null ? index : row.id + ':entry:' + index) + (variantIndex == null ? '' : ':variant:' + variantIndex), label,
            locator: locators[0] || null, locators, view, focus,
            href: '#world/' + encodeURIComponent(book.world) + '/' + view + '/' + encodeURIComponent(focus)};
    }
    function censusRule(raw) {
        if (!attestation || typeof raw.id !== 'string' || !raw.id.startsWith(book.world + '.') ||
            ['entities','scenes','fills'].some(family => context.index(family,byId).has(raw.id))) return [];
        const targets=context.index('rules',byId).get(raw.id)||[];
        if (targets.length!==1 || !publicLifeRow(targets[0].row)) return [];
        if (!context.censusRuleSubjects.has(prefix)) {
            let offset=0,page;const subjects=new Map();
            do {
                page=readOutputRecords(book,{prefix,pass:'rules',kind:'rules',size:100,offset},options,context);
                const origin=context.attestation(family,prefix,'rules','rules',page.source);
                if (!page.inspected || !origin || origin.contentHash!==page.contentHash) break;
                for (const record of page.records) {
                    const id=record.focus.replace(/^working:/,'');
                    if (!subjects.has(id)) subjects.set(id,[]);
                    subjects.get(id).push({record,contentHash:page.contentHash});
                }
                offset+=100;
            } while(offset<page.total);
            context.censusRuleSubjects.set(prefix,subjects);
        }
        const origins=context.censusRuleSubjects.get(prefix).get(raw.id)||[];
        if (origins.length!==1) return [];
        const record=publicRecord('rule',targets[0].row,targets[0].index);
        return record ? [{...record,sourceKind:'census',origin:{pass:'rules',kind:'rules',prefix,contentHash:origins[0].contentHash}}] : [];
    }
    function matches(raw) {
        if (kind==='census' && !entities.has(raw.id)) return censusRule(raw);
        if (kind === 'census' || kind === 'people' || kind === 'places') return (entities.get(raw.id) || [])
            .filter(({row}) => {
                if (kind === 'census' || row.col === kind) return true;
                // People collection includes groups. Link an existing cross-kind
                // subject only when this exact world/slice and one record family
                // attest its identity; this does not project person-only details.
                if (kind !== 'people' || typeof raw.id !== 'string' || !raw.id.startsWith(book.world + '.') ||
                    !publicLifeRow(row) || (entities.get(raw.id) || []).length !== 1) return false;
                if (!['rules','scenes','fills'].every(family => !context.index(family,byId).has(raw.id))) return false;
                if (!context.peopleSubjects.has(prefix)) {
                    // Public digests keep seen counts, not entity shard lists.
                    // Reuse the exact selected census join and its hash/privacy
                    // boundary rather than inventing provenance from a label.
                    const subjects=new Set();let offset=0,page;
                    do {
                        page=readOutputRecords(book,{prefix,pass:'census',kind:'census',size:100,offset},options,context);
                        if (!page.inspected) break;
                        for (const record of page.records) subjects.add(record.focus);
                        offset+=100;
                    } while(offset<page.total);
                    context.peopleSubjects.set(prefix,subjects);
                }
                return context.peopleSubjects.get(prefix).has(raw.id);
            })
            .map(({row, index}) => publicRecord('entity', row, index));
        if (kind === 'rules') return (rules.get(raw.id) || []).map(({row, index}) => publicRecord('rule', row, index));
        if (kind === 'scenes') return (scenes.get(raw.beat) || []).filter(({row}) => !row.shards?.length || row.shards.includes(prefix))
            .map(({row, index}) => publicRecord('scene', row, index));
        if (kind === 'fills') {
            const projected = projectReaderFill(raw, prefix, fillGuard);
            if (!projected) return [];
            return (fills.get(raw.id) || []).flatMap(({row, index}) => (row.variants?.length ? row.variants : [row])
                .flatMap((variant, variantIndex) => fillIdentity(variant) === fillIdentity(projected)
                    && (!variant.shards?.length || variant.shards.includes(prefix))
                    ? [publicRecord('fill', {...variant, id: row.id}, index, row.variants?.length ? variantIndex : null)] : []));
        }
        if (kind === 'other') return (notes.get(normalize(raw.what)) || [])
            .filter(({row}) => sourcesMatch(row, raw, prefix, pass) && array(raw.about).every(id => array(row.about).includes(id)))
            .map(({row, index}) => publicRecord('note', row, index));
        if (['services', 'customs', 'news'].includes(kind)) {
            const projected = projectLifeRow(kind, raw, prefix);
            if (!projected) return [];
            return (life.get(lifeIdentity(projected)) || []).filter(({row}) => sourcesMatch(row, raw, prefix, pass))
                .map(({row, index}) => publicRecord('life', row, index));
        }
        return [];
    }
    try {
        const readFile = options.readFile || (path => readFileSync(path));
        const content = readFile(join(directory, selected.name));
        const contentHash = 'sha256:' + createHash('sha256').update(content).digest('hex');
        if (attestation && contentHash !== attestation.contentHash) {
            result.coverage.note = 'This file changed since the snapshot was built. Rebuild the Atlas to inspect the current records.';
            return result;
        }
        result.inspected = true;
        result.contentHash = contentHash;
        result.readingMethod = readOutputMethodAttestation(book, query, {directory, names:context.files, selected, content});
        let lineNumber = 0;
        for (const line of String(content).split(/\r?\n/)) {
            lineNumber++;
            if (!line.trim()) continue;
            let raw;
            try {raw = JSON.parse(line); if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error();}
            catch {counts.parseFailures++; continue;}
            counts.fileRows++;
            if (!publicLifeRow(raw)) {counts.noPublicMatch++; continue;}
            const matched = matches(raw).filter(Boolean);
            if (!matched.length) {
                counts.unindexed++; explanation?.observe(raw);
                if(mentionRequest){
                    mentionRange??=attestation&&!selected.partial?readMentionRange(book,prefix,{directory,names:context.files,
                        ...(options.mentionManifestDirectory?{manifestDirectory:options.mentionManifestDirectory}:{})}):{status:'unavailable',reason:'This census has no exact selected-file attestation.'};
                    if(mentionRange.status==='verified'&&mentionRange.contains(raw.firstMention)&&typeof raw.id==='string'&&raw.id.startsWith(book.world+'.')&&
                        ['ability','spell','rite','craft','potion','law','custom','institution'].includes(raw.kind)&&
                        raw.id.startsWith(book.world+'.'+raw.kind+'.')&&
                        !['entities','scenes','fills'].some(family=>context.index(family,byId).has(raw.id))){
                        const targets=context.index('rules',byId).get(raw.id)||[];
                        const target=targets.length===1&&targets[0].row.kind===raw.kind&&
                            array(targets[0].row.sources).some(source=>publicLifeRow(source)&&locator(source.locator)&&!mentionRange.contains(source.locator))&&
                            publicRecord('rule',targets[0].row,targets[0].index);
                        if(target){
                            const ref=mentionRecords.get(target.key)||{label:target.label,href:target.href,focus:target.focus,kind:raw.kind,locators:[],fileLines:[]};
                            if(!ref.locators.includes(raw.firstMention))ref.locators.push(raw.firstMention);
                            ref.fileLines.push([lineNumber,lineNumber]);mentionRecords.set(target.key,ref);mentionRows++;
                        }
                    }
                }
                continue;
            }
            counts.matchedRows++;
            fieldCoverage.observe(raw, {admitted:true, matched:true});
            if (new Set(matched.map(record => record.key)).size > 1) counts.ambiguous++;
            for (const record of matched) {
                const target = records.get(record.key) || {...record, fileLines: [], fileLocators: []};
                const last = target.fileLines.at(-1);
                if (last && last[1] === lineNumber - 1) last[1] = lineNumber;
                else if (!last || last[1] !== lineNumber) target.fileLines.push([lineNumber, lineNumber]);
                // Only cite locators independently present in this file row and the admitted record.
                const candidates = [raw.locator, raw.firstMention, ...array(raw.basis), ...array(raw.evidence).map(e => e?.locator)];
                for (const value of candidates) {
                    const at = locator(value);
                    if (at && record.locators.includes(at) && !target.fileLocators.includes(at)) target.fileLocators.push(at);
                }
                records.set(record.key, target);
            }
        }
    } catch {counts.readFailures++;}
    if (result.inspected) result.fieldCoverage = fieldCoverage.snapshot();
    if (result.inspected && explanation) result.unindexedExplanation = explanation.snapshot();
    if(result.inspected&&mentionRequest){
        mentionRange??=attestation&&!selected.partial?readMentionRange(book,prefix,{directory,names:context.files,
            ...(options.mentionManifestDirectory?{manifestDirectory:options.mentionManifestDirectory}:{})}):{status:'unavailable',reason:'This census has no exact selected-file attestation.'};
        const references=[...mentionRecords.values()].sort((a,b)=>a.label.localeCompare(b.label,'en')||a.href.localeCompare(b.href,'en'));
        const size=15,requested=Number.isSafeInteger(query.mentionOffset)&&query.mentionOffset>=0?query.mentionOffset:0;
        const offset=Math.min(requested,Math.max(0,Math.ceil(references.length/size)-1)*size);
        result.mentionReferences={status:mentionRange.status==='verified'?'available':'unavailable',
            note:'Source mentions with an existing public record. Mentioned here; working documented elsewhere. These references do not count as matched rules from this file.',
            ...(mentionRange.status==='verified'?{indexSha256:mentionRange.indexSha256}:{reason:mentionRange.reason}),
            total:references.length,eligibleRows:mentionRows,offset,size,records:references.slice(offset,offset+size)};
    }
    result.total = records.size;
    result.offset = Math.min(requestedOffset, Math.max(0, Math.ceil(records.size / size) - 1) * size);
    result.records = [...records.values()].slice(result.offset, result.offset + size);
    result.status = selected.partial ? 'partial' : counts.parseFailures || counts.readFailures ? 'invalid'
        : counts.ambiguous ? 'ambiguous' : result.total ? 'collected' : counts.unindexed ? 'unindexed'
            : counts.noPublicMatch ? 'no-public-match' : 'empty';
    return result;
}
