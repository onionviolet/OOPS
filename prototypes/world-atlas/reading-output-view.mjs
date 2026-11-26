import {readingReferenceBundle} from '/reading-reference-bundle.mjs';
import {element as el} from '/canvas.mjs';
import {worldTitle} from '/library-views.mjs';
import {handoffForm} from '/reading-handoffs-view.mjs';

const states = {collected: 'Collected', empty: 'Examined empty', partial: 'Partial',
    invalid: 'Invalid', missing: 'Missing', unindexed:'Unindexed', ambiguous:'Ambiguous', 'no-public-match':'Withheld'};

function lineReferences(record) {
    return (record.fileLines || []).map(([first, last]) => first === last ? String(first) : first + '–' + last).join(', ');
}

function listQuery() {
    return new URLSearchParams(location.hash.split('?')[1] || '');
}

function querySuffix(params) {
    return params.size ? '?' + params : '';
}

function mentionReferences(parent,page,path) {
    if(page.pass!=='census'||page.kind!=='census'||!page.inspected||!page.counts.unindexed)return;
    const detail=el('details'),body=el('div');detail.dataset.mentionReferences='';
    detail.append(el('summary','Source mentions with an existing public record'),body);parent.append(detail);
    let loaded=false,busy=false,offset=0;
    const load=async(start,moveFocus=false)=>{
        if(busy)return;busy=true;body.textContent='Checking exact identities and verified mention ranges…';
        try{
            const response=await fetch('/reading-output-records/'+path.join('/')+'?offset='+page.offset+'&mentions=1&mentionOffset='+start);
            if(!response.ok)throw Error();const result=await response.json();if(!detail.isConnected)return;
            if(!result.inspected||result.contentHash!==page.contentHash||result.counts.unindexed!==page.counts.unindexed){body.textContent='This file changed or is unavailable. Reopen the output before following its mentions.';return;}
            const references=result.mentionReferences;if(!references)throw Error();body.replaceChildren(el('p',references.note));
            if(references.status!=='available'){body.append(el('p',references.reason||'Verified mention ranges are unavailable.'));return;}
            offset=references.offset;const status=el('p',references.total?
                `References ${offset+1}–${offset+references.records.length} of ${references.total} · ${references.eligibleRows} source rows.`:'No mention-only references meet these checks.');
            status.setAttribute('role','status');status.tabIndex=-1;body.append(status);
            if(!references.total)return;
            const table=el('table',null,'findings-matrix');table.setAttribute('aria-label','Mention-only public record references');
            const head=table.createTHead().insertRow();for(const title of ['Existing record','Kind','Mention locator','Batch lines']){const cell=el('th',title);cell.scope='col';head.append(cell);}
            const rows=table.createTBody();for(const ref of references.records){const row=rows.insertRow(),subject=el('th');subject.scope='row';const link=el('a',ref.label);link.href=ref.href;subject.append(link);row.append(subject,el('td',ref.kind),el('td',ref.locators.join(' · ')),el('td',lineReferences(ref)));}
            const previous=el('button','Previous mention references'),next=el('button','Next mention references');
            previous.type=next.type='button';previous.disabled=offset===0;next.disabled=offset+references.records.length>=references.total;
            previous.addEventListener('click',()=>load(Math.max(0,offset-references.size),true));next.addEventListener('click',()=>load(offset+references.size,true));
            body.append(table,previous,next);
            if(moveFocus)status.focus();
        }catch{body.textContent='The mention references could not be loaded. Close and reopen to retry.';loaded=false;}
        finally{busy=false;}
    };
    detail.addEventListener('toggle',()=>{if(detail.open&&!loaded){loaded=true;load(0);}});
}

async function showExistingHandoffs(page, rows) {
    let entries;
    try {
        const response = await fetch('/reading-handoff-links/' + [page.key,page.prefix,page.pass,page.kind].map(encodeURIComponent).join('/'));
        if (!response.ok) return;
        entries = await response.json();
    } catch {return;}
    for (const entry of entries) {
        const subject = rows.get(JSON.stringify([entry.route,entry.fileLines]));
        if (!subject?.isConnected) continue;
        const currentFile = entry.contentHash === page.contentHash;
        const label = currentFile ? (entry.reported ? 'Implementation report' : 'Proposed gameplay handoff') : 'Handoff from an earlier file version';
        const link = el('a',label); link.href = '#workbench/handoffs/' + encodeURIComponent(entry.id);
        const note = el('small'); note.append(link); subject.append(note);
    }
}

function saveReferences(page, snapshot, format) {
    const rows = [
        'World Atlas reading references', '',
        'World: ' + page.world, 'Book: ' + page.key, 'Batch prefix: ' + page.prefix,
        'Reading pass: ' + page.pass, 'Output: ' + page.kind,
        'File version: ' + (page.contentHash || 'Unknown'),
        'Reading method: ' + (page.readingMethod?.label || 'Unknown'),
        'Matched source rows: ' + page.counts.matchedRows + ' of ' + page.counts.fileRows,
        'Snapshot: ' + [snapshot?.commit, snapshot?.builtAt].filter(Boolean).join(' · '),
        'Linked records ' + (page.offset + 1) + '–' + (page.offset + page.records.length) + ' of ' + page.total, '',
    ];
    for (const r of page.records) {
        rows.push(r.label, '  ' + (r.type === 'fill' ? 'Authored proposal' : r.type),
            '  Snapshot record: ' + r.key,
            '  Batch file lines: ' + (lineReferences(r) || 'Unknown'),
            '  Source locators confirmed for these lines: ' + (r.fileLocators?.join(' · ') || 'None recorded'),
            '  Record locators across the snapshot: ' + (r.locators?.join(' · ') || 'None recorded'),
            '  Atlas route: ' + r.href, '');
    }
    const json = format === 'json';
    const content = json ? JSON.stringify(readingReferenceBundle(page, snapshot), null, 2) + '\n' : rows.join('\n');
    const url = URL.createObjectURL(new Blob([content], {type:json ? 'application/json' : 'text/plain;charset=utf-8'}));
    const link = el('a');
    link.href = url;
    link.download = ['atlas',page.key,page.prefix,page.pass,page.kind,page.offset+1].join('-').replace(/[^\w.-]/g,'_') + (json ? '.json' : '.txt');
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readingOutputRecords({main, button, data}, path) {
    const [book, prefix, pass, kind] = path.map(decodeURIComponent);
    const sheet = el('article', null, 'sheet reading-outputs output-record-list');
    main.replaceChildren(sheet);
    const back = el('a', 'Back to reading outputs');
    const params = listQuery();
    const savedOffset = Number(params.get('offset'));
    params.delete('offset');
    back.href = '#library/outputs/' + encodeURIComponent(book) + querySuffix(params);
    sheet.append(back, el('h2', kind === 'other' ? 'Other observations' : kind[0].toUpperCase() + kind.slice(1)),
        el('p', [book, prefix, pass + ' pass'].join(' · ')));
    const results = el('div'), status = el('p');
    status.setAttribute('role', 'status');
    sheet.append(status, results);
    async function open(offset) {
        status.textContent = 'Finding linked records…';
        results.replaceChildren();
        try {
            const response = await fetch('/reading-output-records/' + path.join('/') + '?offset=' + offset);
            if (!response.ok) throw Error();
            const page = await response.json();
            if (!sheet.isConnected) return;
            const currentParams = new URLSearchParams(params);
            if (page.offset > 0) currentParams.set('offset', String(page.offset));
            history.replaceState(history.state, '', '#library/outputs/' + path.join('/') + querySuffix(currentParams));
            const counts = page.counts;
            status.textContent = page.inspected === false ? 'File records unavailable' :
                counts.fileRows + ' source rows · ' + page.total + ' linked records';
            if (!page.total && page.coverage?.note) results.append(el('p', page.coverage.note));
            if (page.readingMethod?.status === 'verified') {
                const method = page.readingMethod;
                results.append(el('p', method.label + ' · ' + method.locatorScope.from + ' through ' + method.locatorScope.through));
            }
            if (counts.noPublicMatch) results.append(el('p', counts.noPublicMatch + ' rows have no public record match in this snapshot.'));
            if (counts.unindexed) {
                results.append(el('p', counts.unindexed + ' rows could not be joined to a record by exact identity.'));
                const detail=el('details'),summary=el('summary','Explain unindexed rows'),body=el('div');
                detail.dataset.unindexedExplanation='';detail.append(summary,body);results.append(detail);
                let loaded=false;
                detail.addEventListener('toggle',async()=>{
                    if(!detail.open||loaded)return;loaded=true;body.textContent='Checking counts by reason and supplied kind…';
                    try {
                        const response=await fetch('/reading-output-records/'+path.join('/')+'?offset='+page.offset+'&explain=1');
                        if(!response.ok)throw Error();const explained=await response.json();if(!detail.isConnected)return;
                        if(!explained.inspected||explained.contentHash!==page.contentHash||explained.counts.unindexed!==counts.unindexed){body.textContent='This file changed or is unavailable. Reopen the output before inspecting its counts.';return;}
                        const explanation=explained.unindexedExplanation;if(!explanation||explanation.total!==counts.unindexed)throw Error();
                        body.replaceChildren(el('p',explanation.total+' unindexed rows. '+explanation.note));
                        const table=el('table',null,'findings-matrix');table.setAttribute('aria-label','Unindexed rows by reason and supplied kind');
                        const head=table.createTHead().insertRow();for(const label of ['Reason','Supplied kind','Rows']){const cell=el('th',label);cell.scope='col';head.append(cell);}
                        const rows=table.createTBody();for(const group of explanation.groups){const row=rows.insertRow();row.append(el('td',group.reasonLabel),el('td',group.kindLabel),el('td',String(group.rows)));}body.append(table);
                    }catch{body.textContent='The explanation could not be loaded. Close and reopen to retry.';loaded=false;}
                });
            }
            if (counts.ambiguous) results.append(el('p', counts.ambiguous + ' rows have more than one possible match.'));
            mentionReferences(results,page,path);
            if (counts.parseFailures || counts.readFailures) results.append(el('p', counts.parseFailures + ' unreadable rows · ' + counts.readFailures + ' file read failures'));
            if (page.fieldCoverage?.rows) {
                const coverage = page.fieldCoverage;
                const detail = el('details', null, 'output-fields');
                const present = coverage.fields.filter(field => field.rows);
                detail.append(el('summary', 'Fields supplied by matched rows'),
                    el('p', 'Counts show which details occur in the ' + coverage.rows + ' matched source ' +
                        (coverage.rows === 1 ? 'row' : 'rows') + ' of this file. One row can supply several fields.'));
                const fields = el('dl');
                for (const field of present) fields.append(el('dt', field.label), el('dd', field.rows + ' / ' + coverage.rows));
                if (present.length) detail.append(fields);
                const absent = coverage.fields.filter(field => !field.rows);
                if (absent.length) detail.append(el('p', 'Absent from matched rows: ' + absent.map(field => field.label).join(', ')));
                results.append(detail);
            }
            if (page.records.length) {
                const table = el('table', null, 'findings-matrix source-records');
                table.setAttribute('aria-label', 'Matched records and their source lines');
                const head = table.createTHead().insertRow();
                for (const label of ['Record', 'Batch lines', 'Source locators']) {
                    const cell = el('th', label); cell.scope = 'col'; head.append(cell);
                }
                const body = table.createTBody();
                const subjects = new Map();
                for (const record of page.records) {
                    const row = body.insertRow();
                    const subject = el('th'); subject.scope = 'row';
                    const link = el('a', record.label); link.href = record.href;
                    subject.append(link);
                    subjects.set(JSON.stringify([record.href,record.fileLines]),subject);
                    row.append(subject, el('td', lineReferences(record) || 'Unknown'),
                        el('td', record.fileLocators?.join(' · ') || 'No confirmed locator'));
                }
                const scroll = el('div', null, 'findings-scroll');
                scroll.append(table);
                const format = chooser('Reference format', [['text', 'Plain text'], ['json', 'JSON']]);
                const actions = el('div', null, 'reading-output-filters');
                actions.append(format.label, button('Save references on this page', () => saveReferences(page, data.snapshot, format.select.value)));
                results.append(scroll, actions, handoffForm(page));
                void showExistingHandoffs(page, subjects);
            }
            if (page.total > page.size) {
                const nav = el('nav', null, 'reader-scenes-pager');
                const prev = button('Previous', () => open(page.offset - page.size));
                const next = button('Next', () => open(page.offset + page.size));
                prev.disabled = page.offset === 0; next.disabled = page.offset + page.size >= page.total;
                nav.append(prev, el('output', (page.offset + 1) + '–' + (page.offset + page.records.length) + ' of ' + page.total), next);
                results.append(nav);
            }
        } catch {
            if (!sheet.isConnected) return;
            status.textContent = 'Could not load this output’s records.';
            results.append(button('Try again', () => open(offset)));
        }
    }
    open(Number.isSafeInteger(savedOffset) && savedOffset > 0 ? savedOffset : 0);
}

function chooser(caption, options) {
    const label = el('label', caption + ' ');
    const select = el('select');
    select.setAttribute('aria-label', caption);
    for (const [value, text] of options) select.append(new Option(text, value));
    label.append(select);
    return {label, select};
}

export async function readingOutputs({main, data, bookKey, button}, refresh=false) {
    const books = data.reading?.keys || [];
    const sheet = el('article', null, 'sheet reading-outputs');
    main.replaceChildren(sheet);
    sheet.append(el('h2', 'Reading outputs'));
    if (!books.length) {sheet.append(el('p', 'No books in this reading registry.')); return;}
    const book = books.find(b => encodeURIComponent(b.key) === bookKey) ||
        books.find(b => b.shards) || books[0];
    const picker = chooser('Book', books.map(b => [b.key, worldTitle(b.world) + ' · ' + b.key]));
    picker.select.value = book.key;
    picker.select.onchange = () => {location.hash = 'library/outputs/' + encodeURIComponent(picker.select.value);};
    sheet.append(picker.label, button('Refresh output files',() => readingOutputs({main,data,bookKey:encodeURIComponent(book.key),button},true)));
    const status = el('p', 'Checking reading outputs…');
    status.setAttribute('role', 'status');
    sheet.append(status);
    let inventory;
    try {
        const response = await fetch('/reading-outputs/' + encodeURIComponent(book.key) + (refresh ? '?refresh=1' : ''));
        if (!response.ok) throw Error();
        inventory = await response.json();
    } catch {
        if (sheet.isConnected) {
            status.textContent = 'Could not load this book’s output index.';
            sheet.append(button('Try again', () => readingOutputs({main, data, bookKey, button})));
        }
        return;
    }
    if (!sheet.isConnected) return;
    const {shards, totals, outputKinds} = inventory;
    const historic = inventory.legacy || {shards: [], totals: {files: 0, rows: 0}};
    const orphans = inventory.orphans || {shards: [], totals: {files: 0, rows: 0}};
    if (historic.residuals?.length) {
        const history = el('details');
        history.append(el('summary', 'Historical outputs awaiting assignment (' + historic.residuals.length + ')'));
        const list = el('ul');
        for (const entry of historic.residuals) list.append(el('li',
            [entry.prefix, entry.family, entry.grade && 'grade ' + entry.grade].filter(Boolean).join(' · ')));
        history.append(list);
        sheet.append(history);
    }
    if (inventory.coverage.ambiguousWorlds?.length) sheet.append(el('p',
        'Legacy ownership is ambiguous across worlds ' + inventory.coverage.ambiguousWorlds.join(', ') +
        '. Existing digest ownership is preserved under ' + inventory.coverage.legacyOwnerKey + '.'));
    if (inventory.coverage.legacyOwnerKey && inventory.coverage.legacyOwnerKey !== book.key) {
        const owner = el('a', 'Inspect shared legacy slices under ' + inventory.coverage.legacyOwnerKey);
        owner.href = '#library/outputs/' + encodeURIComponent(inventory.coverage.legacyOwnerKey); sheet.append(owner);
    }
    if (inventory.coverage.unindexedFiles) sheet.append(el('p', inventory.coverage.unindexedFiles +
        ' files found outside the prepared chapter ranges. Their rows are excluded from these counts.'));
    if (!shards.length && !historic.shards.length && !orphans.shards.length) {
        status.textContent = 'No prepared chapter ranges found for this book.';
        const help = el('details');
        help.append(el('summary', 'Where the Atlas looks for readings'),
            el('p', 'The Atlas reads the batch directory registered for this book. To use a mounted collection, set ATLAS_READER_ROOT to the folder containing the registered directory tree, rebuild the snapshot, and restart the Atlas with the same setting.'));
        sheet.append(help);
        return;
    }
    status.textContent = shards.length + ' registry chapter ranges · ' + totals.files + ' registry output files · ' + totals.rows + ' valid registry rows' +
        (historic.shards.length ? ' · ' + historic.shards.length + ' legacy slices · ' + historic.totals.files + ' legacy output files · ' + historic.totals.rows + ' valid legacy rows' : '') +
        (orphans.shards.length ? ' · ' + orphans.totals.files + ' output files without a prepared chapter range' : '');
    const explanation = el('details');
    explanation.append(el('summary', 'How these counts work'), el('p', inventory.coverage.note));
    sheet.append(explanation);
    const issues = totals.parseFailures + totals.readFailures;
    if (issues) sheet.append(el('p', totals.parseFailures + ' unreadable rows · ' + totals.readFailures + ' file read failures'));
    const passFilter = chooser('Pass', [['', 'All passes'], ...inventory.standardPasses.map(p => [p, p])]);
    const stateFilter = chooser('Status', [['', 'All statuses'], ...Object.entries(states)]);
    const coverageFilter = chooser('Coverage', [['registry', 'Registry chapter ranges'], ...(historic.shards.length ? [['legacy', 'Legacy slices']] : []),
        ...(orphans.shards.length ? [['orphan', 'Outputs without prepared ranges']] : [])]);
    const defaultScope = shards.length ? 'registry' : historic.shards.length ? 'legacy' : 'orphan';
    coverageFilter.select.value = defaultScope;
    const query = listQuery();
    for (const [key, select] of [['scope', coverageFilter.select], ['pass', passFilter.select], ['status', stateFilter.select]]) {
        if (Array.from(select.options).some(option => option.value === query.get(key))) select.value = query.get(key);
    }
    const chapter = el('input');
    chapter.type = 'number'; chapter.min = '1'; chapter.placeholder = 'Any';
    const chapterLabel = el('label', 'Chapter ');
    chapterLabel.append(chapter);
    if (/^[1-9]\d*$/.test(query.get('chapter') || '')) chapter.value = query.get('chapter');
    const filters = el('div', null, 'reading-output-filters');
    filters.append(coverageFilter.label, passFilter.label, stateFilter.label, chapterLabel);
    sheet.append(filters);
    let coveragePrefix = '';
    let completeCoverage = false;
    const chapterCoverage = el('section', null, 'chapter-coverage');
    chapterCoverage.append(el('h3', 'Chapter absorption coverage'),
        el('p', 'Check all expected outputs for one prepared range against this Atlas snapshot. Reading coverage does not mean gameplay is implemented.'));
    const rangePicker = chooser('Chapter range', shards.map(s=>[s.prefix,s.chapters + ' · ' + s.prefix]));
    const matchingRange = shards.find(s=>{const [first,last]=String(s.chapters).split('-').map(Number);return first<=Number(chapter.value)&&Number(chapter.value)<=last;});
    if(matchingRange)rangePicker.select.value=matchingRange.prefix;
    if(shards.some(s=>s.prefix===query.get('coverage')))rangePicker.select.value=query.get('coverage');
    const coverageResult = el('div'), coverageStatus = el('p');
    coverageStatus.setAttribute('role','status');
    let coverageRequest=0;
    async function inspectCoverage(complete=false) {
        const prefix=rangePicker.select.value, request=++coverageRequest;
        coveragePrefix=prefix;
        completeCoverage=complete===true;
        const params=listQuery();params.set('coverage',prefix);
        if(completeCoverage)params.set('measurement','complete');else params.delete('measurement');
        history.replaceState(history.state,'','#library/outputs/'+encodeURIComponent(book.key)+querySuffix(params));
        coverageStatus.textContent='Checking this chapter range…';coverageResult.replaceChildren();
        try {
            const response=await fetch('/reading-chapter-coverage/'+[book.key,prefix].map(encodeURIComponent).join('/')+(complete===true?'?complete=1':''));
            if(!response.ok)throw Error();
            const result=await response.json();
            if(!sheet.isConnected||request!==coverageRequest)return;
            if(result.status==='limit'){
                coverageStatus.textContent='This range exceeds the quick summary size. A complete check reads each output in turn and may take longer.';
                coverageResult.append(button('Check all outputs completely',()=>inspectCoverage(true)));return;
            }
            coverageStatus.textContent=result.examined+' of '+result.expected+' expected outputs examined · '+result.empty+' examined empty · '+
                result.counts.matchedRows+' of '+result.counts.fileRows+' source rows matched · '+result.counts.noPublicMatch+' withheld';
            const table=el('table',null,'findings-matrix');table.setAttribute('aria-label','Chapter absorption coverage');
            const head=table.createTHead().insertRow();
            for(const label of ['Output','State','Source rows','Matched','Withheld','Unindexed']){const th=el('th',label);th.scope='col';head.append(th);}
            const body=table.createTBody();
            for(const output of result.outputs){
                const row=body.insertRow(),subject=el('th');subject.scope='row';
                const link=el('a',output.pass+' · '+output.label);
                link.href='#library/outputs/'+[book.key,prefix,output.pass,output.kind].map(encodeURIComponent).join('/')+querySuffix(listQuery());
                subject.append(link);
                row.append(subject,el('td',states[output.status]||output.status),...['fileRows','matchedRows','noPublicMatch','unindexed'].map(key=>el('td',String(output.counts[key]))));
            }
            const scroll=el('div',null,'chapter-coverage-table');scroll.append(table);
            coverageResult.append(el('p',result.note),scroll);
        }catch{if(sheet.isConnected&&request===coverageRequest)coverageStatus.textContent='Could not check this chapter range. Try again.';}
    }
    if(shards.length){
        chapterCoverage.append(rangePicker.label,button('Check chapter coverage',inspectCoverage),coverageStatus,coverageResult);
        sheet.append(chapterCoverage);
        rangePicker.select.onchange=()=>{coverageRequest++;coveragePrefix='';coverageStatus.textContent='';coverageResult.replaceChildren();render();};
    }
    const table = el('table', null, 'findings-matrix'), head = table.createTHead().insertRow(), body = table.createTBody();
    for (const title of ['Range / slice', 'Pass', 'Output', 'Status', 'Rows']) {
        const th = el('th', title); th.scope = 'col'; head.append(th);
    }
    const scroll = el('div', null, 'findings-scroll'); scroll.append(table);
    const labels = new Map(outputKinds.map(k => [k.pass + '/' + k.kind, k.label]));
    const rows = [...shards, ...historic.shards, ...orphans.shards].flatMap(s => s.passes.flatMap(p => p.outputs.map(o => ({s, p, o}))));
    const world = data.findings?.worlds?.find(w => w.world === book.world);
    const sceneRanges = new Set(world?.sceneRanges || []);
    const pos = el('output'), pager = el('nav', null, 'reader-scenes-pager');
    const size = 40;
    const pageNumber = Number(query.get('page'));
    let offset = Number.isSafeInteger(pageNumber) && pageNumber > 1 ? (pageNumber - 1) * size : 0;
    const prev = button('Previous', () => {offset -= size; render();});
    const next = button('Next', () => {offset += size; render();});
    pager.setAttribute('aria-label', 'Output pages');
    pager.append(prev, pos, next);
    function render() {
        chapter.disabled = coverageFilter.select.value !== 'registry';
        const chapterNumber = chapter.disabled ? 0 : Number(chapter.value);
        const selected = rows.filter(({s, p, o}) => {
            if (chapterNumber) {
                const [first, last] = String(s.chapters || '').split('-').map(Number);
                if (!(first <= chapterNumber && chapterNumber <= last)) return false;
            }
            return (s.scope || 'registry') === coverageFilter.select.value && (!passFilter.select.value || p.pass === passFilter.select.value) &&
                (!stateFilter.select.value || o.status === stateFilter.select.value);
        });
        offset = Math.min(offset, Math.max(0, Math.floor((selected.length - 1) / size) * size));
        const state = new URLSearchParams();
        if (coverageFilter.select.value !== defaultScope) state.set('scope', coverageFilter.select.value);
        if (passFilter.select.value) state.set('pass', passFilter.select.value);
        if (stateFilter.select.value) state.set('status', stateFilter.select.value);
        if (chapterNumber) state.set('chapter', String(chapterNumber));
        if (coveragePrefix) state.set('coverage',coveragePrefix);
        if (coveragePrefix&&completeCoverage) state.set('measurement','complete');
        if (offset) state.set('page', String(1 + offset / size));
        const suffix = querySuffix(state);
        history.replaceState(history.state, '', '#library/outputs/' + encodeURIComponent(book.key) + suffix);
        body.replaceChildren();
        for (const {s, p, o} of selected.slice(offset, offset + size)) {
            const row = body.insertRow(), range = el('th', s.scope === 'legacy' ? 'Legacy slice · ' + s.prefix :
                s.scope === 'orphan' ? 'Unprepared · ' + s.prefix : s.chapters); range.scope = 'row';
            if (s.scope === 'legacy' && (s.grade || s.family === 'graded-stage')) {
                range.append(el('small', [s.chapters && 'Chapters ' + s.chapters, s.grade ? 'Grade ' + s.grade : 'Grade unverified',
                    s.admitted === false && 'Awaiting admission'].filter(Boolean).join(' · ')));
            }
            const output = el('td', labels.get(p.pass + '/' + o.kind) || o.kind);
            if (o.kind === 'scenes' && s.scope !== 'orphan' && sceneRanges.has(s.prefix)) {
                const link = el('a', output.textContent);
                link.href = '#world/' + book.world + '/reader-scenes/' + encodeURIComponent('shard:' + s.prefix);
                output.replaceChildren(link);
                if (o.rows > 0) {
                    const file = el('a', 'Inspect file');
                    file.href = '#library/outputs/' + [book.key, s.prefix, p.pass, o.kind].map(encodeURIComponent).join('/') + suffix;
                    output.append(' · ', file);
                }
            } else if (o.rows > 0) {
                const link = el('a', output.textContent);
                link.href = '#library/outputs/' + [book.key, s.prefix, p.pass, o.kind].map(encodeURIComponent).join('/') + suffix;
                output.replaceChildren(link);
            }
            const state = el('td', states[o.status] || o.status);
            state.dataset.state = o.status;
            if (o.parseFailures) state.append(el('small', ' · ' + o.parseFailures + ' unreadable rows'));
            row.append(range, el('td', p.pass), output, state, el('td', String(o.rows)));
        }
        pos.textContent = selected.length ? (offset + 1) + '–' + Math.min(offset + size, selected.length) + ' of ' + selected.length : 'No matching outputs';
        prev.disabled = offset === 0;
        next.disabled = offset + size >= selected.length;
    }
    coverageFilter.select.onchange = passFilter.select.onchange = stateFilter.select.onchange = () => {offset = 0; render();};
    chapter.oninput = () => {
        offset=0;
        const matching=shards.find(s=>{const [first,last]=String(s.chapters).split('-').map(Number);return first<=Number(chapter.value)&&Number(chapter.value)<=last;});
        if(matching&&rangePicker.select.value!==matching.prefix){rangePicker.select.value=matching.prefix;coverageRequest++;coveragePrefix='';coverageStatus.textContent='';coverageResult.replaceChildren();}
        render();
    };
    render();
    sheet.append(scroll, pager);
    if(query.get('coverage')===rangePicker.select.value)void inspectCoverage(query.get('measurement')==='complete');
}
