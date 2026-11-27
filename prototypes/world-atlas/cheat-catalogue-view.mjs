import {element as el} from '/canvas.mjs';

function plain(value) {
    return value.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1 ($2)')
        .replaceAll('**N**','native playtest').replaceAll('**S**','source inspection')
        .replaceAll('**P**','proposal').replace(/\*\*|`/g,'');
}

function field(label,value) {
    const p = el('p');
    p.append(el('strong',label+' '),document.createTextNode(plain(value)));
    return p;
}

function appendComparison(node,example) {
    const ordinary=example.ordinary.replace(/^(?:\*\*)?CTC\d+\b(?:\*\*)?\s*[·:–-]?\s*/,'');
    node.append(field('Ordinary decision',ordinary),field('With the advantage',example.advantage),field('Evidence',example.evidence));
}

function cheatDetails(cheat,examples) {
    const details = el('details');
    details.id = 'atlas-cheat-'+cheat.id;
    details.append(el('summary',cheat.id+' · '+plain(cheat.name)),el('p',plain(cheat.effect)),field('Play status',cheat.playStatus));
    const link=el('a','Open '+plain(cheat.name));link.href='#library/cheats/'+cheat.id;
    details.append(link);
    for (const example of examples) appendComparison(details,example);
    details.append(field('Backing',cheat.backing),
        field('Worlds and references',cheat.worlds),field('Implementation hooks',cheat.hooks),
        field('Optional limits',cheat.limits),field('Design source',cheat.source));
    return details;
}

function detailRecord(sheet,section,cheat) {
    const back=el('a','All cheat families');back.href='#library/cheats';
    const identity=el('p',section.name+'  /  '+cheat.id,'cheat-identity');
    const title=el('h2',plain(cheat.name));title.tabIndex=-1;
    const content=el('div',null,'cheat-record-body'),decisions=el('div'),reference=el('aside');
    const example=section.examples.find(e=>e.ordinary.split(' · ')[0]===cheat.id);
    if (example) {
        const comparison=el('div',null,'cheat-comparison');
        for (const [label,copy] of [
            ['Ordinary decision',example.ordinary.substring(example.ordinary.indexOf(' · ')+3)],
            ['With the advantage',example.advantage],
        ]) {
            const panel=el('section');panel.append(el('h3',label),el('p',plain(copy)));comparison.append(panel);
        }
        const evidence=el('section',null,'cheat-evidence');
        const levels={N:'Native playtest',S:'Source inspection',P:'Proposed comparison'};
        const mark=example.evidence.match(/^\*\*([NSP])\*\*\s*/);
        const citation=mark ? example.evidence.slice(mark[0].length) : example.evidence;
        evidence.append(el('h3','Evidence'));
        if (mark) evidence.append(el('strong',levels[mark[1]]));
        evidence.append(el('p',plain(citation.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1'))));
        if (cheat.evidenceHref) {
            const guide=el('a','Where to play');
            guide.href=cheat.evidenceHref;
            const proof=el('a','Open native playtest results');
            proof.href='/cheat-proof/'+cheat.id;proof.target='_blank';proof.rel='noopener';
            const actions=el('p');actions.append(guide,document.createTextNode(' · '),proof);
            evidence.append(actions);
        }
        const sources=el('details');sources.append(el('summary','Source references'));
        const paths=el('ul');
        for (const match of (example.evidence+' '+cheat.source).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
            const item=el('li');item.append(el('strong',match[1]),el('code',match[2]));paths.append(item);
        }
        const owner=el('a','Open the catalogue source');owner.href='/cheat-catalogue-source';owner.target='_blank';owner.rel='noopener';
        sources.append(paths,owner);evidence.append(sources);decisions.append(comparison,evidence);
    }
    reference.append(el('h3','In OOPS'),field('Play status',cheat.playStatus),field('Catalogue design status',cheat.status),
        field('Backing',cheat.backing),field('Implementation hooks',cheat.hooks),
        field('Worlds and references',cheat.worlds),field('Optional limits',cheat.limits));
    if (cheat.playGap) reference.append(el('p',cheat.playGap));
    content.append(decisions,reference);
    sheet.replaceChildren(back,identity,title,el('p',plain(cheat.effect),'cheat-effect'),content);
    title.focus({preventScroll:true});
}

export async function renderCheatCatalogue(main,focus='') {
    const sheet = el('article',null,'sheet reading-outputs atlas-cheats');
    const source = el('a','Open catalogue source');
    source.href='/cheat-catalogue-source';source.target='_blank';source.rel='noopener';
    const rules = el('a','Browse world rules');rules.href='#library/rules';
    const references=el('p');references.append(source,document.createTextNode(' · '),rules);
    for (const link of [source,rules]) link.style.color='inherit';
    const intro = el('p','Compare the ordinary choice with the advantage. Expand a type to read its status and design source.');
    sheet.append(el('h2','Cheat catalogue'),intro,references);
    main.replaceChildren(sheet);
    const feedback = el('p','Loading catalogue…');
    feedback.setAttribute('aria-live','polite');
    sheet.append(feedback);
    try {
        const response = await fetch('/cheat-catalogue',{cache:'no-store'});
        if (!response.ok) throw Error();
        const sections = await response.json();
        if (!sheet.isConnected) return;
        if (focus) {
            for (const section of sections) {
                const selected=section.cheats.find(row=>row.id===focus.toUpperCase());
                if (selected) {detailRecord(sheet,section,selected);return;}
            }
            const back=el('a','Browse cheat families');back.href='#library/cheats';
            sheet.replaceChildren(el('h2','Cheat entry not found'),back);
            return;
        }
        const controls = el('p');
        const family = el('select'), selectLabel = el('label','Family ');
        family.setAttribute('aria-label','Family');
        family.append(new Option('All families',''));
        for (const section of sections) family.append(new Option(section.name,section.id));
        selectLabel.append(family);
        const searchLabel = el('label',' Search cheats '), search = el('input');
        search.type='search';search.placeholder='Name, effect, or catalogue ID';searchLabel.append(search);
        const previous=history.state?.cheatFilters;
        if(previous) {family.value=previous.family||'';search.value=previous.term||'';}
        controls.append(selectLabel,searchLabel);
        sheet.insertBefore(controls,feedback);
        const results = el('div');sheet.append(results);
        function refresh() {
            history.replaceState({...history.state,cheatFilters:{family:family.value,term:search.value}},'');
            const term = search.value.trim().toLowerCase();
            const groups = document.createDocumentFragment();
            let count = 0;
            for (const section of sections) {
                if (family.value && family.value!==section.id) continue;
                const byId = new Map(), general = [];
                for (const example of section.examples) {
                    const id = example.ordinary.match(/^\s*(?:\*\*)?(CTC\d+)\b/)?.[1];
                    if (id) {
                        if (!byId.has(id)) byId.set(id,[]);
                        byId.get(id).push(example);
                    } else general.push(example);
                }
                const hits = section.cheats.filter(row=>{
                    if (/^ctc\d+$/.test(term)) return row.id.toLowerCase()===term;
                    const examples=byId.get(row.id)||[];
                    return !term || [section.name,...Object.values(row),...examples.flatMap(Object.values)]
                        .some(v=>v.toLowerCase().includes(term));
                });
                if (!hits.length) continue;
                count += hits.length;
                const group = el('details');
                group.open = Boolean(family.value || term);
                group.append(el('summary',section.name+' · '+hits.length));
                for (const example of general) appendComparison(group,example);
                group.append(...hits.map(row=>cheatDetails(row,byId.get(row.id)||[])));groups.append(group);
            }
            feedback.textContent = count ? count+' cheat '+(count===1?'type':'types') : 'No matching cheats. Change the family or search.';
            results.replaceChildren(groups);
        }
        search.addEventListener('input',refresh);family.addEventListener('change',refresh);
        refresh();
    } catch {
        feedback.textContent='Could not read the cheat catalogue. Reopen this page to try again.';
    }
}
