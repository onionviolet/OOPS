import {element as el} from '/canvas.mjs';
import {attachBacklogChoices} from '/idea-owners-view.mjs';
import {CITED_REFERENCE_LIMIT} from '/cited-reference-contract.mjs';
import {compareHandoffSource} from '/reading-reference-bundle.mjs';
import {ideaEntryHref,compareIdeaHandoffSource} from '/idea-owner-references.mjs';
import {routeExportControl} from '/handoff-route-export.mjs';

export function handoffForm(page) {
    const panel = el('details', null, 'reading-handoff-form');
    panel.append(el('summary','Prepare a gameplay handoff'));
    const form = el('form');
    const select = el('select');
    for (const record of page.records) select.append(new Option(record.label,record.key));
    function field(title, control) {
        const label = el('label',title);
        control.setAttribute('aria-label',title);
        label.append(control);
        form.append(label);
        return control;
    }
    field('Reading record',select);
    const backlog = field('Backlog reference (optional)',el('input'));
    backlog.maxLength = CITED_REFERENCE_LIMIT;
    attachBacklogChoices(backlog);
    const change = field('What should the player be able to do?',el('textarea'));
    const check = field('How would a playthrough prove it?',el('textarea'));
    for (const control of [change,check]) {control.required = true; control.maxLength = 500; control.rows = 2;}
    const save = el('button','Save to Workbench');
    save.type = 'submit';
    const status = el('output');
    status.setAttribute('aria-live','polite');
    form.append(save,status);
    form.onsubmit = async event => {
        event.preventDefault();
        save.disabled = true;
        status.textContent = 'Saving…';
        try {
            const selected = page.records.find(record => record.key === select.value);
            const response = await fetch('/reading-handoffs',{method:'POST',headers:{'Content-Type':'application/json'},
                body:JSON.stringify({book:page.key,prefix:page.prefix,pass:page.pass,kind:page.kind,offset:page.offset,
                    recordKey:select.value,recordRoute:selected.href,fileLines:selected.fileLines,contentHash:page.contentHash,
                    backlog:backlog.value,change:change.value,check:check.value})});
            if (!response.ok) throw Error(await response.text());
            const link = el('a','Open implementation handoffs');
            link.href = '#workbench/handoffs';
            status.replaceChildren('Saved. ',link);
        } catch (error) {status.textContent = error.message || 'Could not save the handoff.';}
        finally {save.disabled = false;}
    };
    panel.append(form);
    return panel;
}

function qualificationLinks(entry, entries, reload) {
    const panel=el('section',null,'handoff-qualifications');
    for(const [field,title,other] of [['qualifiesEarlier','Qualifies an earlier proposal','earlierProposalId'],
        ['qualifiedByLater','Qualified by later evidence','laterProposalId']]) {
        if(!entry[field]?.length)continue;
        panel.append(el('h4',title));
        for(const relation of entry[field]) {
            const target=entries.find(row=>row.id===relation[other]);
            const link=el('a',target?.record.label||'Open saved proposal');link.href='#workbench/handoffs/'+relation[other];
            const article=el('article');article.append(link,el('p',relation.qualification),el('p','Evidence: '+relation.evidence.path+' · '+relation.files.evidence.status));
            panel.append(article);
        }
    }
    const details=el('details',null,'reading-handoff-form');details.append(el('summary','Link an earlier proposal'));
    const form=el('form'),target=el('select'),targetLabel=el('label','Earlier saved proposal');
    target.required=true;target.setAttribute('aria-label','Earlier saved proposal');target.append(new Option('Choose a saved proposal',''));
    for(const row of entries.filter(row=>row.id!==entry.id))target.append(new Option([row.source.book,row.source.prefix,row.record.label,row.id.slice(0,8)].filter(Boolean).join(' · '),row.id));
    targetLabel.append(target);
    const reason=el('textarea'),reasonLabel=el('label','How does this source qualify it?');reason.required=true;reason.maxLength=500;reason.rows=2;
    reason.setAttribute('aria-label','How does this source qualify it?');reasonLabel.append(reason);
    const evidence=el('input'),evidenceLabel=el('label','Public qualification evidence path');evidence.required=true;evidence.maxLength=500;evidence.placeholder='docs/.../RECEIPT.md';
    evidence.setAttribute('aria-label','Public qualification evidence path');evidenceLabel.append(evidence);
    const save=el('button','Save qualification link');save.type='submit';const status=el('output');status.setAttribute('aria-live','polite');
    form.append(el('p','Records a source qualification. Saved proposals and gameplay review states stay unchanged.'),targetLabel,reasonLabel,evidenceLabel,save,status);
    form.onsubmit=async event=>{
        event.preventDefault();save.disabled=true;status.textContent='Saving…';
        try {
            const response=await fetch('/reading-handoffs/'+entry.id+'/qualifications',{method:'POST',headers:{'Content-Type':'application/json'},
                body:JSON.stringify({earlierProposalId:target.value,qualification:reason.value,evidencePath:evidence.value})});
            if(!response.ok)throw Error(await response.text());
            if(panel.isConnected)await reload();
        }catch(error){status.textContent=error.message||'Could not save this qualification.';}
        finally{save.disabled=false;}
    };
    details.append(form);panel.append(details);return panel;
}

function implementationForm(entry, reload) {
    const panel = el('details', null, 'reading-implementation-form reading-handoff-form');
    panel.append(el('summary','Attach an implementation report'));
    const form = el('form');
    function field(title, tag, limit, placeholder) {
        const label = el('label', title), control = el(tag);
        control.setAttribute('aria-label', title);
        control.required = true;
        control.maxLength = limit;
        control.placeholder = placeholder;
        if (tag === 'textarea') control.rows = 2;
        label.append(control); form.append(label);
        return control;
    }
    const name = field('Runtime consumer name','input',160,'The feature or behavior implemented');
    const consumer = field('Runtime consumer path','input',500,'src/feature.js');
    const route = field('Player entry or route','textarea',500,'Where to start and what to do in the game');
    const receipt = field('Implementation receipt path','input',500,'docs/.../RECEIPT.md');
    const save = el('button','Attach report'); save.type = 'submit';
    const status = el('output'); status.setAttribute('aria-live','polite');
    form.append(el('p','Attaches a report and records the current file fingerprints. It does not verify gameplay or release the change.'),save,status);
    form.onsubmit = async event => {
        event.preventDefault(); save.disabled = true; status.textContent = 'Attaching…';
        try {
            const response = await fetch('/reading-handoffs/' + entry.id + '/implementation-reports', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body:JSON.stringify({consumerName:name.value,consumerPath:consumer.value,playerRoute:route.value,receiptPath:receipt.value})});
            if (!response.ok) throw Error(await response.text());
            if (panel.isConnected) await reload();
        } catch (error) {status.textContent = error.message || 'Could not attach this report.';}
        finally {save.disabled = false;}
    };
    panel.append(form);
    return panel;
}

function playtestAttachmentForm(entry, report, reload) {
    const details = el('details',null,'reading-handoff-form');details.append(el('summary','Attach native playtest receipt'));
    const form = el('form'),label = el('label','Public proof JSON path'),input = el('input');
    input.required = true;input.maxLength = 500;input.placeholder = 'docs/representations/evidence/.../proof.json';
    input.setAttribute('aria-label','Public proof JSON path');label.append(input);
    const save = el('button','Attach playtest');save.type = 'submit';
    const status = el('output');status.setAttribute('aria-live','polite');form.append(label,save,status);
    form.onsubmit = async event => {
        event.preventDefault();save.disabled = true;status.textContent = 'Attaching…';
        try {
            const response = await fetch(`/reading-handoffs/${entry.id}/implementation-reports/${report.id}/playtests`,{
                method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({proofPath:input.value})});
            if (!response.ok) throw Error(await response.text());
            if (details.isConnected) await reload();
        } catch(error) {status.textContent = error.message || 'Could not attach this playtest.';}
        finally {save.disabled = false;}
    };
    details.append(form);return details;
}

function playtestEvidence(entry, report, proof) {
    const box = el('section',null,'reading-playtest-evidence');
    box.dataset.playtestId = proof.id;
    box.append(el('h5','Native playtest receipt'),el('p',proof.proof.path),
        el('p','Tested route: ' + proof.entry.route));
    for (const key of ['setup','fixture']) if (proof.entry[key]) box.append(el('p',key + ': ' + proof.entry[key]));
    const identity = el('code',proof.testedBundleSha256.slice(0,12));identity.title = proof.testedBundleSha256;
    const receiptIdentity = el('code',proof.proof.sha256.slice(0,12));receiptIdentity.title = proof.proof.sha256;
    box.append(el('span','Receipt: '),receiptIdentity,el('span',' · Tested bundle: '),identity);
    const result = el('output');result.setAttribute('aria-live','polite');
    result.textContent = proof.files?.proof?.status === 'changed' ? 'Receipt changed since attachment.'
        : proof.files?.proof?.status === 'unavailable' ? 'Receipt unavailable.' : 'Checkout build not compared.';
    const check = el('button','Compare checkout build');check.type = 'button';
    check.onclick = async () => {
        check.disabled = true;result.textContent = 'Comparing…';
        try {
            const response = await fetch(`/reading-handoffs/${entry.id}/implementation-reports/${report.id}/playtests/${proof.id}/build-check`,{cache:'no-store'});
            if (!response.ok) throw Error();
            const comparison = await response.json();
            result.textContent = comparison.status === 'exact-match' ? 'Tested on this exact checkout build.'
                : comparison.status === 'different-build' ? 'Tested on another build.'
                : comparison.status === 'changed-proof' ? 'Receipt changed since attachment. Attach its new version to compare.'
                : comparison.unavailable === 'proof' ? 'Receipt unavailable.' : 'Checkout bundle unavailable.';
        } catch {result.textContent = 'Build comparison unavailable.';}
        finally {check.disabled = false;}
    };
    box.append(el('p',null),check,result);return box;
}

export function implementationReport(entry, report, reload, {attachments=true} = {}) {
    const section = el('section', null, 'reading-implementation-report');
    const states = [report.files?.consumer?.status,report.files?.receipt?.status];
    const state = states.includes('unavailable') ? 'A registered file is unavailable or no longer public.'
        : states.includes('changed') ? 'Files changed since attachment.'
        : states.includes('unchecked') ? 'File fingerprints have not been checked in this view.'
        : 'Registered file bytes match the attachment.';
    section.append(el('h4','Implementation report attached'));
    const fields = el('dl');
    fields.append(el('dt','In the game'),el('dd',report.consumer.name),
        el('dt','Player entry or route'),el('dd',report.playerRoute),
        el('dt','Consumer path'),el('dd',report.consumer.path),
        el('dt','Implementation receipt'),el('dd',report.receipt.path));
    section.append(fields,el('p',state));
    for (const proof of report.playtests || []) section.append(playtestEvidence(entry,report,proof));
    if(attachments)section.append(playtestAttachmentForm(entry,report,reload));
    return section;
}

function queueEntry(entry) {
    const {record,source,proposal}=entry,reports=entry.implementationReports||[];
    const section=el('section',null,'handoff-queue-entry');section.dataset.handoffId=entry.id;
    const heading=el('h3'),title=el('a',record.label);title.href='#workbench/handoffs/'+entry.id;heading.append(title);
    const states=reports.flatMap(report=>[report.files?.consumer?.status,report.files?.receipt?.status]);
    const status=states.includes('unavailable')?'Registered file missing':states.includes('changed')?'Registered files changed':reports.length?'Implementation report attached':'Awaiting implementation report';
    const top=el('div',null,'handoff-queue-top');top.append(heading,el('span',status,'handoff-queue-status'));section.append(top);
    const origin=source.kind==='idea-owner'?['Backlog idea',record.code,source.ownerReference].filter(Boolean).join(' · '):['Batch reading',source.book,source.prefix,source.pass+'/'+source.kind].join(' · ');
    const provenance=el('p',origin,'handoff-queue-origin');provenance.title=origin;
    const change=el('p',proposal.change,'handoff-queue-summary');
    const proofs=reports.flatMap(report=>report.playtests||[]),changed=proofs.some(proof=>['changed','unavailable'].includes(proof.files?.proof?.status));
    const evidence=reports.length?`${reports.length} implementation ${reports.length===1?'report':'reports'} · ${proofs.length?proofs.length+' native '+(proofs.length===1?'receipt':'receipts')+(changed?' (changed or unavailable)':''):'No native playtest receipt'}`:'Proposal saved · No implementation report or native playtest receipt';
    section.append(provenance,change,el('p',evidence,'handoff-queue-evidence'));
    return section;
}

function queueBuildCheck(sheet, loadedEntries) {
    const group = document.createDocumentFragment();
    const check = el('button','Compare playtests with this build');
    const summary = el('output');
    summary.setAttribute('aria-live','polite');
    check.onclick = async () => {
        routeExport.reset();
        check.disabled = true;
        summary.textContent = 'Checking saved receipts…';
        for (const old of sheet.querySelectorAll('.queue-build-result')) old.remove();
        try {
            const response = await fetch('/reading-handoffs/build-check',{cache:'no-store'});
            if (!response.ok) throw Error();
            const {bundleSha256,entries,unreadable} = await response.json();
            const byId = new Map(entries.map(entry => [entry.id,entry]));
            const rows = sheet.querySelectorAll('.handoff-queue-entry');
            let listed = 0;
            for (const row of rows) {
                const entry = byId.get(row.dataset.handoffId);
                if (entry) listed++;
                const parts = [];
                if (entry?.exact) parts.push(entry.exact+' on this build');
                if (entry?.other) parts.push(entry.other+' on another build');
                if (entry?.unverified) parts.push(entry.unverified+' could not be verified');
                const detail = parts.length ? 'Native receipts · '+parts.join(' · ') :
                    entry ? 'No readable native receipt' : 'Handoff unavailable';
                row.append(el('p',detail,'queue-build-result'));
            }
            const count = entries.filter(entry => entry.exact > 0).length;
            summary.textContent = bundleSha256 ?
                count+' of '+entries.length+' handoffs have a matching playtest for build '+bundleSha256.slice(0,12)+'.' :
                'The local game bundle could not be read.';
            if (unreadable) summary.textContent += ' Unreadable saved files: '+unreadable+'.';
            if (listed !== entries.length || listed !== rows.length) summary.textContent += ' Reload to see the updated handoff list.';
            routeExport.setComparison({bundleSha256,entries,unreadable});
        } catch { summary.textContent = 'Build comparison unavailable. Try again.'; }
        finally { check.disabled = false; }
    };
    group.append(check,summary);
    const routeExport = routeExportControl(group,loadedEntries,summary);
    return group;
}

export async function readingHandoffs({main,button,handoffId}) {
    const sheet = el('article',null,'sheet findings-sheet reading-handoffs');
    if(!handoffId)sheet.classList.add('reading-handoffs-queue');
    const heading = el('h2','Implementation handoffs');
    sheet.append(heading);
    sheet.append(el('p','Saved proposals can start from a reading record or an exact backlog entry. Attached implementation reports remain separate from the original proposal.'));
    if (handoffId) {
        const all = el('a','All implementation handoffs'); all.href = '#workbench/handoffs';
        sheet.append(all);
    }
    main.replaceChildren(sheet);
    try {
        const response = await fetch('/reading-handoffs');
        if (!response.ok) throw Error();
        const {entries:allEntries,unreadable,unreadableReports,unreadablePlaytests,unreadableQualifications} = await response.json();
        const entries = handoffId ? allEntries.filter(entry => entry.id === handoffId) : allEntries;
        if (!sheet.isConnected) return;
        if (unreadable) sheet.append(el('p',unreadable + ' saved handoff files could not be read.'));
        if (unreadableReports) sheet.append(el('p',unreadableReports + ' implementation reports could not be read.'));
        if (unreadablePlaytests) sheet.append(el('p',unreadablePlaytests + ' playtest attachments could not be read.'));
        if (unreadableQualifications) sheet.append(el('p',unreadableQualifications + ' proposal qualification links could not be read.'));
        if (!entries.length && handoffId) sheet.append(el('p','No saved implementation handoff matches this link.'));
        else if (!entries.length) {
            const link = el('a','Browse reading outputs'); link.href = '#library/outputs';
            const ideas=el('a','Browse idea owners');ideas.href='#workbench/ideas';
            sheet.append(el('p','Open a matched reading record or an exact backlog entry and save a gameplay handoff here.'),link,' · ',ideas);
        }
        if (!handoffId && entries.length) {
            const reports = entry => entry.implementationReports || [];
            const filters = [
                ['All handoffs', () => true],
                ['Awaiting a report', entry => reports(entry).length === 0],
                ['Report attached', entry => reports(entry).length > 0],
                ['Changed or missing files', entry => reports(entry).some(report =>
                    [report.files?.consumer,report.files?.receipt].some(file => ['changed','unavailable'].includes(file?.status)))],
            ];
            const label = el('label','Show ');
            const select = el('select');
            select.setAttribute('aria-label','Handoff status');
            for (const [index,[name,matches]] of filters.entries()) {
                select.append(new Option(name + ' (' + entries.filter(matches).length + ')',String(index)));
            }
            const visible = el('output');
            visible.setAttribute('aria-live','polite');
            const originLabel = el('label','Source ');
            const origin = el('select');
            origin.setAttribute('aria-label','Handoff source');
            origin.append(new Option('All sources','all'),new Option('Batch readings','reading'),new Option('Backlog ideas','backlog'));
            const filterEntries = () => {
                const matches = filters[Number(select.value)][1];
                const shown = new Set(entries.filter(entry => {
                    const source = entry.source.kind === 'idea-owner' ? 'backlog' : 'reading';
                    return matches(entry) && (origin.value === 'all' || origin.value === source);
                }).map(entry => entry.id));
                for (const section of sheet.querySelectorAll('[data-handoff-id]')) section.hidden = !shown.has(section.dataset.handoffId);
                visible.textContent = shown.size + (shown.size === 1 ? ' handoff' : ' handoffs');
            };
            select.onchange = origin.onchange = filterEntries;
            visible.textContent=entries.length+(entries.length===1?' handoff':' handoffs');
            const controls=el('div',null,'handoff-queue-filters');
            label.append(select); originLabel.append(origin); controls.append(originLabel,label,visible,queueBuildCheck(sheet,allEntries));sheet.append(controls);
        }
        for (const entry of entries) {
            if(!handoffId){sheet.append(queueEntry(entry));continue;}
            const {proposal,record,source} = entry;
            const fromIdea=source.kind==='idea-owner';
            const section = el('section');
            section.dataset.handoffId = entry.id;
            const reports = entry.implementationReports || [];
            const summary = reports.length ? reports.length + (reports.length === 1 ? ' implementation report' : ' implementation reports') : 'Awaiting an implementation report';
            section.append(el('h3',record.label),el('p',fromIdea?['Backlog-first proposal',record.code,summary].filter(Boolean).join(' · '):[source.book,source.prefix,source.pass,summary].join(' · '),'handoff-evidence-line'));
            section.append(qualificationLinks(entry,allEntries,() => readingHandoffs({main,button,handoffId})));
            if (handoffId) for (const report of reports) section.append(implementationReport(entry,report,() => readingHandoffs({main,button,handoffId})));
            if (handoffId && reports.length) section.append(el('h4',fromIdea?'Original backlog proposal':'Original reading proposal'));
            const plan = el('dl');
            if (proposal.backlog) plan.append(el('dt','Backlog reference'),el('dd',proposal.backlog));
            plan.append(el('dt','Gameplay change'),el('dd',proposal.change),el('dt','Playable check'),el('dd',proposal.check));
            if(fromIdea)plan.append(el('dt','Source owner'),el('dd',source.ownerReference),el('dt','Source entry kind'),el('dd',record.entryLabel||record.classification),
                el('dt','Source section'),el('dd',(source.section||[]).join(' › ')),el('dt','Source lines'),el('dd',source.sourceReference));
            if (source.locators?.length) plan.append(el('dt','Source locators'),el('dd',source.locators.join(' · ')));
            const file = el('a',fromIdea?'Open this backlog entry':'Open batch output');
            file.href = fromIdea?ideaEntryHref(source.ownerReference,source.ideaId):'#library/outputs/' + [source.book,source.prefix,source.pass,source.kind].map(encodeURIComponent).join('/') + (source.offset ? '?offset=' + source.offset : '');
            section.append(plan,file);
            if(fromIdea){const verify=el('a','Verify exact source entry');verify.href='/idea-owner-ideas?'+new URLSearchParams({owner:source.ownerReference,idea:source.ideaId});section.append(' · ',verify,el('p','This source is a backlog entry, not a book chapter or completed reading pass. Its proposal and any implementation report have separate evidence.'));}
            let sourceCheck;
            if (handoffId) {
                const result = el('output'); result.setAttribute('aria-live','polite');
                const check = button(fromIdea?'Check owner version':'Check source version',async () => {
                    check.disabled = true;
                    try {
                        if(fromIdea){
                            const response=await fetch('/idea-owner-ideas?'+new URLSearchParams({owner:source.ownerReference,idea:source.ideaId}));
                            const state=response.ok?compareIdeaHandoffSource(entry,await response.json()):'unavailable';
                            result.textContent={matched:'The current owner fingerprint and exact entry match this saved proposal.',
                                'owner-changed':'The exact entry still matches. Other owner text changed since this proposal was saved.',
                                changed:'This exact source entry has changed.',unavailable:'The exact entry is unavailable or its wording/section changed. No similar entry was substituted.'}[state];
                            return;
                        }
                        const response = await fetch('/reading-output-records/' + file.hash.slice('#library/outputs/'.length));
                        const status = response.ok ? compareHandoffSource(entry,await response.json()) : 'unavailable';
                        result.textContent = {
                            matched:'The current output matches the saved file and source lines.',
                            changed:'The output has changed since this proposal was saved.',
                            unmatched:'The file matches. This record and its lines could not be confirmed on the current page.',
                            unavailable:'The current output is unavailable for comparison.',
                        }[status];
                    } catch {result.textContent = 'Could not reach the current reading output.';}
                    finally {check.disabled = false;}
                });
                sourceCheck = el('div',null,'handoff-source-check'); sourceCheck.append(check,result);
            }
            if (record.route?.startsWith('#world/')) {
                const target = el('a','Open Atlas record'); target.href = record.route;
                section.append(' · ',target);
            }
            if (sourceCheck) section.append(sourceCheck);
            section.append(implementationForm(entry,() => readingHandoffs({main,button,handoffId})));
            sheet.append(section);
        }
    } catch {
        if (sheet.isConnected) sheet.append(el('p','Could not load implementation handoffs.'),button('Try again',() => readingHandoffs({main,button,handoffId})));
    }
}
