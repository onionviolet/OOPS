import {element as el} from '/canvas.mjs';
import {handoffsForOwner,handoffsForIdea,ideaEntryHref} from '/idea-owner-references.mjs';
import {CITED_REFERENCE_LIMIT} from '/cited-reference-contract.mjs';

let request;
function owners(refresh=false) {
    if(refresh)request=undefined;
    return request ||= fetch('/idea-owners').then(response => {
        if (!response.ok) throw Error('Backlog directory unavailable');
        return response.json();
    }).catch(error => { request = undefined; throw error; });
}

export function attachBacklogChoices(input) {
    try { input.value ||= sessionStorage.getItem('atlas-handoff-backlog') || ''; } catch {}
    input.addEventListener('focus',async () => {
        if (input.list) return;
        try {
            const rows = await owners();
            if (!input.isConnected || input.list) return;
            const list = el('datalist');
            list.id = 'reading-idea-references';
            for (const row of rows) list.append(new Option(row.title,row.reference));
            input.parentElement.append(list);
            input.setAttribute('list',list.id);
        } catch { /* Typed backlog references remain usable offline. */ }
    });
}

function ideaHandoffForm(row,page) {
    const panel=el('details',null,'reading-handoff-form idea-handoff-form');panel.append(el('summary','Prepare a handoff from this entry'));
    const form=el('form');form.append(el('p','This proposal starts from the exact owner entry. It does not require a book or reading record, and saving it does not implement or approve the work.'));
    function field(title){const label=el('label',title),input=el('textarea');input.setAttribute('aria-label',title);input.maxLength=500;input.rows=2;input.required=true;label.append(input);form.append(label);return input;}
    const change=field('What should the player be able to do?'),check=field('How would a playthrough prove it?');
    const save=el('button','Save backlog-first handoff');save.type='submit';const status=el('output');status.setAttribute('aria-live','polite');form.append(save,status);
    form.onsubmit=async event=>{
        event.preventDefault();save.disabled=true;status.textContent='Saving…';
        try{
            const response=await fetch('/idea-handoffs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownerReference:row.ownerReference,ideaId:row.id,documentHash:page.documentHash,change:change.value,check:check.value})});
            if(!response.ok)throw Error(await response.text());const result=await response.json();
            const link=el('a','Open this backlog-first handoff');link.href='#workbench/handoffs/'+result.id;status.replaceChildren('Saved as a proposal. ',link);
        }catch(error){status.textContent=error.message||'Could not save this proposal.';}finally{save.disabled=false;}
    };panel.append(form);return panel;
}

function browseOwnerIdeas(owner,button,queue,focusId) {
    const panel=el('details',null,'idea-owner-ideas');panel.append(el('summary','Browse ideas and checks in this owner'));
    let loaded=false;
    panel.addEventListener('toggle',async()=>{
        if(!panel.open||loaded)return;loaded=true;
        const host=el('div');host.append(el('p','Loading this owner…'));panel.append(host);
        try{
            const response=await fetch('/idea-owner-ideas?'+new URLSearchParams({owner:owner.reference}));
            if(!response.ok)throw Error(await response.text());
            const page=await response.json();if(!panel.isConnected)return;
            host.replaceChildren(el('p',page.boundary));
            const label=el('label','Search entries in this owner '),search=el('input');search.type='search';search.setAttribute('aria-label','Search entries in this owner');label.append(search);
            const status=el('p'),list=el('ul'),more=button('Show more ideas',()=>{limit+=30;render();});let limit=30,selectedId=focusId;
            status.setAttribute('role','status');
            function render(){
                const words=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
                const exactCode=/^[a-z]{1,8}\d+[a-z]?$/i.test(search.value.trim())?search.value.trim().toLocaleLowerCase():null;
                const found=page.rows.filter(row=>selectedId?row.id===selectedId:exactCode?row.code?.toLocaleLowerCase()===exactCode:words.every(word=>[row.code,row.title,row.excerpt,...row.section].join(' ').toLocaleLowerCase().includes(word)));
                list.replaceChildren();
                for(const row of found.slice(0,limit)){
                    const item=el('li');item.dataset.ideaId=row.id;if(row.code)item.dataset.ideaCode=row.code;
                    item.append(el('strong',(row.code?row.code+' · ':'')+row.title),el('small',row.entryLabel||'Coded source entry'),el('small',row.section.join(' › ')),el('p',row.excerpt),
                        el('code',row.reference),el('small','Source: '+row.sourceReference+' · lines '+row.lineStart+'–'+row.lineEnd));
                    const use=button('Cite this exact entry in a handoff',()=>{
                        try{sessionStorage.setItem('atlas-handoff-backlog',row.reference);}
                        catch{status.textContent='This browser cannot keep a selection. Copy the exact reference into the handoff form.';return;}
                        location.hash='library/outputs';
                    });use.disabled=!row.citable;
                    const verify=el('a','Verify this exact entry in its owner');verify.href='/idea-owner-ideas?'+new URLSearchParams({owner:row.ownerReference,idea:row.id});
                    const links=el('p');links.append(verify);item.append(ideaHandoffForm(row,page),use,links);
                    if(queue){
                        const matches=handoffsForIdea(row,queue.entries),evidence=el('div',null,'idea-entry-evidence');
                        const reports=matches.flatMap(entry=>(entry.implementationReports||[]).map(report=>({entry,report}))),playtests=reports.reduce((count,{report})=>count+(report.playtests||[]).length,0);
                        evidence.append(el('p',matches.length+' saved handoff'+(matches.length===1?'':'s')+(matches.length===1?' cites':' cite')+' this exact entry. '+reports.length+' implementation report'+(reports.length===1?'':'s')+' linked; '+playtests+' native playtest receipt'+(playtests===1?'':'s')+' attached.'));
                        if(reports.length){
                            const links=el('ul');
                            for(const {entry,report}of reports){const line=el('li'),link=el('a','Implementation report: '+report.consumer.name),count=(report.playtests||[]).length;link.href='#workbench/handoffs/'+entry.id;link.dataset.implementationReport=report.id;line.append(link,el('small',count+' native playtest receipt'+(count===1?'':'s')+' attached'));links.append(line);}
                            evidence.append(links,el('p','Open report details to check file versions and compare tested and current builds. Attachment counts do not verify a playthrough or approve a proposal.'));
                        }else{
                            evidence.append(el('p','No linked implementation evidence here. This does not establish whether the game implements the idea.'));
                        }
                        for(const entry of matches){const link=el('a','Cited proposal: '+entry.record.label);link.href='#workbench/handoffs/'+entry.id;evidence.append(link,el('small','A citation records proposed work; implementation evidence is listed separately above.'));}
                        item.append(evidence);
                    }
                    if(!row.citable)item.append(el('small','This exact reference exceeds the shared '+CITED_REFERENCE_LIMIT+'-character citation limit.'));
                    list.append(item);
                }
                status.textContent=Math.min(limit,found.length)+' of '+found.length+' structured entries in this owner';more.hidden=found.length<=limit;more.style.display=more.hidden?'none':'';
                if(!found.length)list.append(el('li',selectedId?'This exact saved entry is absent or changed. Search the current owner to inspect its entries; no similar entry is substituted.':'No matching structured entries. This view recognizes documented code, list and finding formats; it does not classify every sentence as an idea.'));
            }
            search.oninput=()=>{limit=30;selectedId=null;render();};host.append(label,status,list,more);render();
            if(focusId)host.scrollIntoView({block:'start'});
        }catch(error){host.replaceChildren(el('p',error.message||'Could not read this owner.'),button('Try again',()=>{loaded=false;host.remove();panel.open=false;panel.open=true;}));}
    });if(focusId)panel.open=true;return panel;
}

export async function ideaOwners({main,button}) {
    const sheet = el('article',null,'sheet findings-sheet reading-outputs');
    main.replaceChildren(sheet);
    sheet.append(el('h2','Ideas and backlogs'),el('p','Search by idea, method or code. Open an exact entry to propose gameplay or see linked work.'));
    const crossPrefix='#workbench/ideas/search',cross=location.hash.startsWith(crossPrefix+'?')?new URLSearchParams(location.hash.slice(crossPrefix.length+1)):null;
    const across=el('form',null,'reading-output-filters'),acrossLabel=el('label','Search across owners '),query=el('input');query.type='search';query.maxLength=120;query.required=true;query.setAttribute('aria-label','Search across idea owners');query.value=cross?.get('q')||'';
    const kindLabels={'feature-proposal':'Proposals (source context)','acceptance-check':'Acceptance checks (not execution)',finding:'Reported findings','historical-note':'Historical/report notes','backlog-entry':'Backlog entries (unclassified)'},kindLabel=el('label','Source kind '),kind=el('select');kind.setAttribute('aria-label','Idea source kind');kind.append(new Option('All source kinds',''));for(const [value,title]of Object.entries(kindLabels))kind.append(new Option(title,value));kind.value=cross?.get('kind')||'';kindLabel.append(kind);
    const submit=el('button','Search all idea owners');submit.type='submit';const queryStatus=el('output');queryStatus.setAttribute('aria-live','polite');acrossLabel.append(query);across.append(acrossLabel,kindLabel,submit,queryStatus);sheet.append(across);
    across.onsubmit=event=>{event.preventDefault();if(!query.value.trim()){queryStatus.textContent='Enter a word, phrase or idea code.';return;}const params=new URLSearchParams({q:query.value.trim(),offset:'0'});if(kind.value)params.set('kind',kind.value);if(cross?.get('limit'))params.set('limit',cross.get('limit'));const target='#workbench/ideas/search?'+params;if(location.hash===target)ideaOwners({main,button});else location.hash=target;};
    if(cross){
        const result=el('section',null,'cross-owner-results');result.setAttribute('aria-label','Cross-owner search results');sheet.append(result);
        const back=el('a','Browse owner directory');back.href='#workbench/ideas';result.append(back,el('p','Searching the named public backlogs and indexed idea owners…'));
        try{
            const response=await fetch('/idea-owner-search?'+new URLSearchParams({q:cross.get('q')||'',offset:cross.get('offset')||'0',limit:cross.get('limit')||'25',...(cross.get('kind')?{kind:cross.get('kind')}:{})}));
            if(!response.ok)throw Error(await response.text());const found=await response.json();if(!result.isConnected)return;
            const summary=el('div',null,'idea-search-summary');
            summary.append(el('p',`${found.total} matching entries · ${found.ownerFilesRead} files searched${found.exactCode?' · exact code match':''}${found.kind?' · '+kindLabels[found.kind]:''}`),back,el('p','Source kinds follow the owner context. A proposal is not acceptance; an acceptance-check entry does not establish that the check ran.'));
            result.replaceChildren(summary);
            if(found.unreadableOwners)result.append(el('p',found.unreadableOwners+' canonical owner files could not be read; results cover the readable files.'));
            const list=el('ul',null,'idea-owner-list idea-search-matches');
            for(const row of found.rows){
                const item=el('li');item.dataset.searchIdeaId=row.id;
                const open=el('a','Open exact entry');open.href=ideaEntryHref(row.ownerReference,row.id);
                const heading=el('strong',row.title),meta=el('small',[row.code,row.entryLabel,row.ownerTitle].filter(Boolean).join(' · '));
                const excerpt=el('details');
                excerpt.append(el('summary','Source excerpt'),el('p',row.excerpt),el('small',row.section.join(' › ')),el('code',row.sourceReference));
                item.append(heading,open,meta,excerpt);list.append(item);
            }
            if(!found.rows.length)list.append(el('li','No matching structured entries on this page. Metadata, measured totals and ordinary prose are not added as ideas.'));
            const pages=el('nav');pages.setAttribute('aria-label','Cross-owner result pages');
            const pageHref=offset=>'#workbench/ideas/search?'+new URLSearchParams({q:found.query,offset:String(offset),limit:String(found.limit),...(found.kind?{kind:found.kind}:{})});
            if(found.offset>0){const previous=el('a','Previous results');previous.href=pageHref(Math.max(0,found.offset-found.limit));pages.append(previous,' · ');}
            pages.append(el('span',found.rows.length?`${found.offset+1}–${found.offset+found.rows.length} of ${found.total}`:'0 of '+found.total));
            if(found.offset+found.limit<found.total){const next=el('a','Next results');next.href=pageHref(found.offset+found.limit);pages.append(' · ',next);}
            result.append(list,pages);
        }catch(error){result.replaceChildren(back,el('p',error.message||'Could not search idea owners.'));}
        return;
    }
    try {
        const [rows,queue] = await Promise.all([owners(true),fetch('/reading-handoffs').then(response=>{
            if(!response.ok)throw Error();return response.json();
        }).catch(()=>null)]);
        if (!sheet.isConnected) return;
        const label = el('label','Search owners ','idea-owner-search');
        const search = el('input'); search.type = 'search'; label.append(search);
        const parts=location.hash.slice(1).split('/');let focusOwner='',focusId='';
        try{if(parts[0]==='workbench'&&parts[1]==='ideas'&&/^[a-f0-9]{64}$/.test(parts[3]||'')){focusOwner=decodeURIComponent(parts[2]);focusId=parts[3];search.value=focusOwner;}}catch{}
        if(focusOwner&&!rows.some(row=>row.reference===focusOwner)){
            const indexed=rows.find(row=>row.reference.split('#')[0]===focusOwner);
            if(indexed)rows.unshift({...indexed,reference:focusOwner,title:indexed.title+' · document view'});
        }
        const groupLabel=el('label','Directory section '),group=el('select');group.setAttribute('aria-label','Directory section');
        group.append(new Option('All sections',''));
        for(const name of [...new Set(rows.map(row=>row.group))].sort())group.append(new Option(name,name));
        groupLabel.append(group);
        const linkedLabel=el('label',null,'idea-owner-linked'),linked=el('input');linked.type='checkbox';linkedLabel.append(linked,' With saved handoffs');
        linked.disabled=!queue;
        const citations=new Map(rows.map(row=>[row.reference,queue?handoffsForOwner(row,queue.entries,rows):[]]));
        if(!queue)sheet.append(el('p','The Workbench queue is unavailable. Linked proposals could not be checked.'));
        else if(queue.unreadable)sheet.append(el('p',queue.unreadable+' saved handoff files could not be read; citation counts cover readable proposals.'));
        const status = el('p'); status.setAttribute('role','status');
        const list = el('ul'), next = button('Show more',() => {limit += 30; render();});
        let limit = 30;
        function render() {
            const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
            const found = rows.filter(row => {
                const target = [row.title,row.group,row.reference].join(' ').toLowerCase();
                return (!group.value||row.group===group.value)&&(!linked.checked||citations.get(row.reference).length)&&words.every(word => target.includes(word));
            });
            list.replaceChildren();
            for (const row of found.slice(0,limit)) {
                const item = el('li');item.dataset.ownerReference=row.reference;
                const use = button('Use in a reading handoff',() => {
                    try {sessionStorage.setItem('atlas-handoff-backlog',row.reference);}
                    catch {status.textContent = 'This browser cannot keep a selection. Copy the owner reference into the handoff form.';return;}
                    location.hash = 'library/outputs';
                });
                item.append(el('strong',row.title),el('small',row.group),el('code',row.reference),use);
                item.append(browseOwnerIdeas(row,button,queue,row.reference===focusOwner?focusId:null));
                const matches=citations.get(row.reference);
                if(queue&&matches.length){
                    const taken=el('details',null,'idea-owner-handoffs');
                    taken.append(el('summary',matches.length+' handoff'+(matches.length===1?'':'s')+' citing this owner'));
                    const entries=el('ul');
                    for(const entry of matches){
                        const link=el('a',entry.record.label);link.href='#workbench/handoffs/'+entry.id;
                        const origin=entry.schema==='atlas-idea-handoff/1'?['Backlog idea',entry.record.code]:['Reading',entry.source.book,entry.source.prefix];
                        const row=el('li');row.append(link,el('small',[...origin.filter(Boolean),'Proposed',
                            ...(entry.implementationReports?.length?[entry.implementationReports.length+' implementation report'+(entry.implementationReports.length===1?'':'s')+' attached']:[])].join(' · ')));
                        entries.append(row);
                    }
                    taken.append(entries,el('p','A citation records a proposal, not acceptance or completion. Open its handoff for the proposed change and any implementation report.'));item.append(taken);
                }
                list.append(item);
            }
            status.textContent = Math.min(limit,found.length) + ' of ' + found.length + ' directory references';
            next.hidden = found.length <= limit;
        }
        search.oninput = () => {limit = 30; render();};
        group.onchange=linked.onchange=()=>{limit=30;render();};
        list.className = 'idea-owner-list';
        sheet.append(label,groupLabel,linkedLabel,status,list,next); render();
    } catch {sheet.append(el('p','Could not read the backlog directory.'),button('Try again',() => ideaOwners({main,button})));}
}
