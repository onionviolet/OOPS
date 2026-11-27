import {createHash, randomUUID} from 'node:crypto';
import {link, mkdir, readFile, readdir, realpath, stat, unlink, writeFile} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';
import {CITED_REFERENCE_LIMIT} from './cited-reference-contract.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const packetId = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const proposalSchemas=['atlas-reading-handoff/1','atlas-idea-handoff/1'];

function briefText(value, limit, message = 'Enter a brief gameplay change and a playable check.') {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > limit) throw Error(message);
    return value.trim();
}

export function prepareHandoff(request, page) {
    const record = page?.records.find(row => row.key === request.recordKey);
    if (!record || !page.inspected || !page.contentHash || request.contentHash !== page.contentHash ||
        request.recordRoute !== record.href || JSON.stringify(request.fileLines) !== JSON.stringify(record.fileLines)) {
        throw Error('This record or file version changed. Reopen the reading output before saving.');
    }
    const proposal = {
        backlog: request.backlog?.trim() ? briefText(request.backlog, CITED_REFERENCE_LIMIT) : null,
        change: briefText(request.change, 500),
        check: briefText(request.check, 500),
    };
    return {schema:'atlas-reading-handoff/1', stage:'proposed', proposal,
        source:{book:page.key, world:page.world, prefix:page.prefix, pass:page.pass, kind:page.kind,
            contentHash:page.contentHash, method:page.readingMethod?.method || 'unknown',
            fileLines:record.fileLines, locators:record.fileLocators, offset:page.offset},
        record:{label:record.label, type:record.type, route:record.href}};
}

// Publish a complete, immutable packet. Two identical submissions share one entry.
export async function saveHandoff(directory, packet) {
    const data = JSON.stringify(packet, null, 2) + '\n';
    const id = createHash('sha256').update(data).digest('hex');
    await mkdir(directory, {recursive:true});
    const temporary = join(directory, randomUUID() + '.tmp');
    await writeFile(temporary, data, {flag:'wx'});
    try {
        await link(temporary, join(directory, id + '.json'));
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    } finally {
        await unlink(temporary);
    }
    return id;
}

export async function readHandoffs(directory, {root} = {}) {
    let names;
    try { names = await readdir(directory); }
    catch (error) { if (error.code === 'ENOENT') return {entries:[], unreadable:0}; throw error; }
    const result = {entries:[], unreadable:0};
    for (const name of names.filter(name => /^[a-f0-9]{64}\.json$/.test(name)).sort()) {
        try {
            const bytes = await readFile(join(directory, name));
            const id = createHash('sha256').update(bytes).digest('hex');
            if (id + '.json' !== name) throw Error('File version differs');
            const packet = JSON.parse(bytes);
            if (!proposalSchemas.includes(packet.schema)) throw Error('Unsupported packet');
            result.entries.push({id, ...packet});
        } catch { result.unreadable++; }
    }
    const reports = await readImplementationReports(directory, root);
    const proposals = new Map(result.entries.map(entry => [entry.id, entry]));
    for (const report of reports.entries) {
        const proposal = proposals.get(report.proposalId);
        if (!proposal) {reports.unreadable++; continue;}
        (proposal.implementationReports ||= []).push(report);
    }
    if (reports.unreadable) result.unreadableReports = reports.unreadable;
    if (reports.unreadablePlaytests) result.unreadablePlaytests = reports.unreadablePlaytests;
    const qualifications = await readProposalQualifications(directory,root,proposals);
    for (const relation of qualifications.entries) {
        (proposals.get(relation.laterProposalId).qualifiesEarlier ||= []).push(relation);
        (proposals.get(relation.earlierProposalId).qualifiedByLater ||= []).push(relation);
    }
    if (qualifications.unreadable) result.unreadableQualifications = qualifications.unreadable;
    return result;
}

function publicRepoPath(value, area) {
    if (typeof value !== 'string') throw Error(`Choose an existing public ${area}/ file.`);
    const path = value.trim().replace(/\\/g, '/');
    const parts = path.split('/');
    const restricted = part => part.startsWith('.') || part.toLowerCase().split(/[._\s-]+/).some(word => ['private', 'sealed', 'secret', 'secrets'].includes(word));
    if (path.length > 500 || /[\u0000-\u001f\u007f?#:]/.test(path) || parts[0] !== area || parts.length < 2 ||
        parts.some(part => !part || part === '..' || restricted(part))) throw Error(`Choose an existing public ${area}/ file; private and sealed paths are excluded.`);
    return path;
}

async function fingerprintFile(root, requested, area, {includeBytes = false, maxBytes = Infinity} = {}) {
    const path = publicRepoPath(requested, area);
    const base = await realpath(root);
    const target = await realpath(resolve(base, path));
    const resolvedPath = publicRepoPath(relative(base, target).replace(/\\/g, '/'), area);
    const info = await stat(target);
    if (!info.isFile()) throw Error(`Choose an existing public ${area}/ file.`);
    if (info.size > maxBytes) throw Error('The playtest receipt is too large.');
    const bytes = await readFile(target);
    if (bytes.length > maxBytes) throw Error('The playtest receipt is too large.');
    // Bind the checked bytes to the admitted target even if a workspace link was
    // replaced while this file was being read.
    if (await realpath(resolve(base, path)) !== target || await realpath(target) !== target) throw Error('The file target changed. Review the path and attach again.');
    return {path, resolvedPath, sha256: digest(bytes), ...(includeBytes ? {bytes} : {})};
}

async function readImmutable(directory, id, schema) {
    if (!packetId(id)) throw Error('Choose a saved reading proposal.');
    const bytes = await readFile(join(directory, id + '.json'));
    if (digest(bytes) !== id) throw Error('The saved packet changed.');
    const packet = JSON.parse(bytes);
    if (!(Array.isArray(schema)?schema:[schema]).includes(packet.schema)) throw Error('Unsupported saved packet.');
    return packet;
}

// An explicit, directional source qualification leaves both saved proposals intact.
export async function attachProposalQualification(directory, root, laterProposalId, request) {
    if (!request || typeof request !== 'object' || Array.isArray(request) ||
        Object.keys(request).some(key=>!['earlierProposalId','qualification','evidencePath'].includes(key)))
        throw Error('Choose an earlier saved proposal, explain the qualification and cite its public evidence.');
    if (laterProposalId === request.earlierProposalId) throw Error('Choose a different saved proposal.');
    await readImmutable(directory,laterProposalId,proposalSchemas);
    await readImmutable(directory,request.earlierProposalId,proposalSchemas);
    const qualification = briefText(request.qualification,500,'Explain the source qualification in 500 characters or fewer.');
    const evidence = await fingerprintFile(root,request.evidencePath,'docs');
    const relation = {schema:'atlas-proposal-qualification/1',laterProposalId,earlierProposalId:request.earlierProposalId,qualification,evidence};
    const id = await saveHandoff(join(directory,'proposal-qualifications'),relation);
    return {id,laterProposalId,earlierProposalId:request.earlierProposalId,status:'proposal-qualification-attached'};
}

async function readProposalQualifications(directory,root,proposals) {
    const folder=join(directory,'proposal-qualifications');let names;
    try {names=await readdir(folder);} catch(error){if(error.code==='ENOENT')return {entries:[],unreadable:0};throw error;}
    const result={entries:[],unreadable:0};
    for(const name of names.filter(name=>/^[a-f0-9]{64}\.json$/.test(name)).sort()) {
        try {
            const id=name.slice(0,-5),raw=await readImmutable(folder,id,'atlas-proposal-qualification/1');
            if (!packetId(raw.laterProposalId)||!packetId(raw.earlierProposalId)||raw.laterProposalId===raw.earlierProposalId ||
                !proposals.has(raw.laterProposalId)||!proposals.has(raw.earlierProposalId)) throw Error('Invalid proposal relation.');
            const qualification=briefText(raw.qualification,500);
            const evidence={path:raw.evidence.path,resolvedPath:raw.evidence.resolvedPath,sha256:raw.evidence.sha256};
            const current=await fileState(root,evidence,'docs');
            result.entries.push({id,schema:'atlas-proposal-qualification/1',laterProposalId:raw.laterProposalId,
                earlierProposalId:raw.earlierProposalId,qualification,evidence,files:{evidence:current}});
        } catch {result.unreadable++;}
    }
    return result;
}

// A report is a separate immutable statement by an implementer. Attaching one
// does not alter the proposal, verify gameplay, mark work accepted or release it.
export async function attachImplementationReport(directory, root, proposalId, request) {
    await readImmutable(directory, proposalId, proposalSchemas);
    if (!request || typeof request !== 'object' || Array.isArray(request)) throw Error('Enter the runtime consumer, player route and implementation receipt.');
    const consumerName = briefText(request.consumerName, 160, 'Name the runtime consumer in 160 characters or fewer.');
    const playerRoute = briefText(request.playerRoute, 500, 'Describe the player entry or route in 500 characters or fewer.');
    let consumer, receipt;
    try {
        consumer = await fingerprintFile(root, request.consumerPath, 'src');
        receipt = await fingerprintFile(root, request.receiptPath, 'docs');
    } catch (error) {
        if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) throw Error('The runtime consumer and receipt must be existing public files in src/ and docs/.');
        throw error;
    }
    const report = {schema:'atlas-reading-implementation/1', proposalId,
        consumer:{name:consumerName, ...consumer}, playerRoute, receipt};
    const id = await saveHandoff(join(directory, 'implementation-reports'), report);
    return {id, proposalId, status:'implementation-report-attached'};
}

async function fileState(root, fingerprint, area) {
    publicRepoPath(fingerprint.path, area);
    publicRepoPath(fingerprint.resolvedPath, area);
    if (!packetId(fingerprint.sha256)) throw Error('Invalid file fingerprint.');
    if (!root) return {status:'unchecked'};
    try {
        const current = await fingerprintFile(root, fingerprint.path, area);
        return {status:current.sha256 === fingerprint.sha256 && current.resolvedPath === fingerprint.resolvedPath ? 'unchanged' : 'changed'};
    } catch {return {status:'unavailable'};}
}

async function readImplementationReports(directory, root) {
    const folder = join(directory, 'implementation-reports');
    let names;
    try {names = await readdir(folder);}
    catch (error) {if (error.code === 'ENOENT') return {entries:[], unreadable:0}; throw error;}
    const result = {entries:[], unreadable:0};
    for (const name of names.filter(name => /^[a-f0-9]{64}\.json$/.test(name)).sort()) {
        try {
            const id = name.slice(0, -5);
            const report = await readImmutable(folder, id, 'atlas-reading-implementation/1');
            if (!packetId(report.proposalId)) throw Error('Invalid proposal binding.');
            briefText(report.consumer.name, 160);
            briefText(report.playerRoute, 500);
            const consumer = await fileState(root, report.consumer, 'src');
            const receipt = await fileState(root, report.receipt, 'docs');
            result.entries.push({id, ...report, status:'implementation-report-attached', files:{consumer, receipt}});
        } catch {result.unreadable++;}
    }
    const playtests = await readPlaytestAttachments(directory, root);
    const reports = new Map(result.entries.map(report => [report.id, report]));
    for (const playtest of playtests.entries) {
        const report = reports.get(playtest.reportId);
        if (!report || report.proposalId !== playtest.proposalId) {playtests.unreadable++; continue;}
        (report.playtests ||= []).push(playtest);
    }
    if (playtests.unreadable) result.unreadablePlaytests = playtests.unreadable;
    return result;
}

function nativeProofFields(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Choose a native playtest JSON receipt.');
    const fields = ['bundleSha256','bundleHash'].filter(key => Object.hasOwn(value,key));
    if (!fields.length || fields.some(key => !packetId(value[key])) || new Set(fields.map(key=>value[key])).size !== 1)
        throw Error('The receipt needs one unambiguous bundleSha256 or bundleHash SHA-256.');
    const route = briefText(value.route, 1000, 'The native receipt must name its tested route.');
    let width, height;
    if (typeof value.viewport === 'string') {
        const match = /^([1-9]\d{0,4})x([1-9]\d{0,4})$/.exec(value.viewport);
        if (match) [width,height] = match.slice(1).map(Number);
    } else if (value.viewport && typeof value.viewport === 'object') ({width,height} = value.viewport);
    if (![width,height].every(n => Number.isInteger(n) && n > 0 && n <= 16384)) throw Error('The native receipt must name its tested viewport.');
    const entry = {route, viewport:{width,height}};
    for (const key of ['setup','fixture']) if (Object.hasOwn(value,key)) entry[key] = briefText(value[key],1000,'The receipt entry description must be brief text.');
    return {testedBundleSha256:value[fields[0]], bundleField:fields[0], entry};
}

async function boundReport(directory, proposalId, reportId) {
    await readImmutable(directory,proposalId,proposalSchemas);
    const report = await readImmutable(join(directory,'implementation-reports'),reportId,'atlas-reading-implementation/1');
    if (report.proposalId !== proposalId) throw Error('Choose an implementation report on this handoff.');
    return report;
}

// A separate content-addressed attachment leaves both earlier statements immutable.
export async function attachNativePlaytest(directory, root, proposalId, reportId, request) {
    await boundReport(directory,proposalId,reportId);
    if (!request || typeof request !== 'object' || Array.isArray(request) || Object.keys(request).some(key=>key!=='proofPath'))
        throw Error('Supply the public native playtest proofPath.');
    const path = publicRepoPath(request.proofPath,'docs');
    if (!path.endsWith('.json')) throw Error('Choose a public native playtest JSON receipt.');
    const {bytes,...proof} = await fingerprintFile(root,path,'docs',{includeBytes:true,maxBytes:262144});
    let parsed;
    try {parsed = JSON.parse(bytes);} catch {throw Error('The native playtest receipt is not valid JSON.');}
    if (Object.hasOwn(parsed,'proposalId') && parsed.proposalId !== proposalId) throw Error('The receipt names another reading proposal.');
    const attachment = {schema:'atlas-reading-playtest/1',proposalId,reportId,proof,...nativeProofFields(parsed)};
    const id = await saveHandoff(join(directory,'playtest-attachments'),attachment);
    return {id,proposalId,reportId,status:'native-playtest-attached'};
}

function playtestFields(raw) {
    if (!packetId(raw.proposalId) || !packetId(raw.reportId) || !packetId(raw.testedBundleSha256) ||
        !['bundleSha256','bundleHash'].includes(raw.bundleField)) throw Error('Invalid playtest attachment.');
    // Project recognized fields, including when reading a hand-authored sidecar.
    const entry = raw.entry || {};
    const fields = nativeProofFields({[raw.bundleField]:raw.testedBundleSha256,route:entry.route,viewport:entry.viewport,
        ...(Object.hasOwn(entry,'setup')?{setup:entry.setup}:{}),...(Object.hasOwn(entry,'fixture')?{fixture:entry.fixture}:{})});
    return {schema:'atlas-reading-playtest/1',proposalId:raw.proposalId,reportId:raw.reportId,
        proof:{path:raw.proof.path,resolvedPath:raw.proof.resolvedPath,sha256:raw.proof.sha256},...fields};
}

async function readPlaytestAttachments(directory, root) {
    const folder = join(directory,'playtest-attachments');
    let names;
    try {names = await readdir(folder);} catch(error) {if(error.code==='ENOENT')return {entries:[],unreadable:0};throw error;}
    const result = {entries:[],unreadable:0};
    for (const name of names.filter(name=>/^[a-f0-9]{64}\.json$/.test(name)).sort()) {
        try {
            const id = name.slice(0,-5), fields = playtestFields(await readImmutable(folder,id,'atlas-reading-playtest/1'));
            result.entries.push({id,...fields,files:{proof:await fileState(root,fields.proof,'docs')}});
        } catch {result.unreadable++;}
    }
    return result;
}

export async function compareNativePlaytest(directory, root, proposalId, reportId, attachmentId) {
    await boundReport(directory,proposalId,reportId);
    const saved = playtestFields(await readImmutable(join(directory,'playtest-attachments'),attachmentId,'atlas-reading-playtest/1'));
    if (saved.proposalId !== proposalId || saved.reportId !== reportId) throw Error('Choose a playtest attached to this report.');
    const proof = await fileState(root,saved.proof,'docs');
    const result = {id:attachmentId,testedBundleSha256:saved.testedBundleSha256,entry:saved.entry,proof};
    if (proof.status === 'changed') return {...result,status:'changed-proof'};
    if (proof.status !== 'unchanged') return {...result,status:'unavailable',unavailable:'proof'};
    try {
        const current = await fingerprintFile(root,'dist/bundle.js','dist');
        return {...result,status:current.sha256===saved.testedBundleSha256?'exact-match':'different-build',currentBundleSha256:current.sha256};
    } catch {return {...result,status:'unavailable',unavailable:'bundle'};}
}

export async function compareQueuePlaytests(directory, root) {
    const queue = await readHandoffs(directory,{root});
    let bundle;
    try { bundle = await fingerprintFile(root,'dist/bundle.js','dist'); }
    catch { /* Each receipt still has an independently checkable proof file. */ }
    const entries = queue.entries.map(entry => {
        const counts = {exact:0,other:0,unverified:0};
        for (const report of entry.implementationReports || []) {
            for (const test of report.playtests || []) {
                if (!bundle || test.files?.proof?.status !== 'unchanged') counts.unverified++;
                else if (test.testedBundleSha256 === bundle.sha256) counts.exact++;
                else counts.other++;
            }
        }
        return {id:entry.id,...counts};
    });
    return {bundleSha256:bundle?.sha256 || null,entries,
        unreadable:queue.unreadable + (queue.unreadableReports || 0) + (queue.unreadablePlaytests || 0)};
}
