import {element as el} from '/canvas.mjs';
export async function worldRulesView({main,worldId='',focus=''}) {
    main.replaceChildren();const shell=el('section');shell.className='library-view';shell.style.cssText='max-width:1100px;margin:24px auto;padding:0 20px';main.append(shell);
    shell.append(el('h1','World rules'),el('p','Recorded source paraphrases and interpretations, kept separate from coverage claims and current playable proof. Editions stay distinct.'));
    const form=el('form'),world=el('select'),kind=el('select'),search=el('input'),submit=el('button','Search'),status=el('p'),results=el('div'),pages=el('nav');
    world.style.maxWidth='100%';kind.style.maxWidth='100%';
    world.setAttribute('aria-label','Rule world or edition');kind.setAttribute('aria-label','Rule evidence kind');search.setAttribute('aria-label','Search world rules');search.type='search';search.placeholder='Statement, source, locator, mechanism or ID';search.style.width='min(100%,430px)';submit.type='submit';
    for(const [value,label]of [['','All evidence kinds'],['source-paraphrase','Source paraphrases'],['interpretation','Interpretations and proposals']]){const o=el('option',label);o.value=value;kind.append(o);}
    status.setAttribute('role','status');pages.setAttribute('aria-label','Rule pages');form.append(world,kind,search,submit);shell.append(form,status,results,pages);
    let offset=0,selected=worldId,record=focus,serial=0;
    async function load(){const id=++serial;status.textContent='Loading recorded rules…';const query=new URLSearchParams({world:selected,q:search.value,kind:kind.value,offset:String(offset),limit:'40',record});
        try{const response=await fetch('/world-rules?'+query);if(!response.ok)throw Error('Rules unavailable.');const data=await response.json();if(id!==serial)return;
            if(!world.options.length){const all=el('option','All recorded worlds / editions');all.value='';world.append(all);for(const w of data.worlds){const o=el('option',`${w.label} · ${w.count}`);o.value=w.id;world.append(o);}world.value=selected;}
            status.textContent=`${data.total} matching records of ${data.totalRecords} public records · ${data.worlds.length} world/edition groups${data.issues.length?' · '+data.issues.length+' file/line parse issues':''}. ${data.coverage}`;
            results.replaceChildren();pages.replaceChildren();
            if(record){const all=el('a','Back to this world’s rules');all.style.color='#a8d8ff';all.href='#library/rules/'+encodeURIComponent(selected);results.append(all);}
            if(!data.records.length)results.append(el('p','No public rule records match this selection. Absence here does not establish absence in the source or game.'));
            for(const r of data.records){const card=el('article');card.dataset.ruleKey=r.key;card.style.cssText='border-top:1px solid var(--border,#666);padding:18px 0';
                const title=el('a',r.name);title.style.color='#a8d8ff';title.href='#library/rules/'+encodeURIComponent(r.world)+'/'+r.key;const h=el('h2');h.append(title);card.append(h,el('small',`${r.world} · ${r.id}`),el('p',r.statement));
                card.append(el('h3',r.sourceKind==='interpretation'?'Interpretation / proposal':'Source-grounded recorded paraphrase'),el('p',r.sources.speaker||'Speaker not recorded'));
                const sources=el('ul');for(const s of [...r.sources.books,...r.sources.locators])sources.append(el('li',s));card.append(sources);
                if(r.sources.note)card.append(el('p',r.sources.note));if(r.sources.licence.length)card.append(el('small','Recorded licence: '+r.sources.licence.join('; ')));
                const evidence=el('details'),summary=el('summary','Exact recorded evidence and interpretation');evidence.append(summary,el('p',`${r.sources.file}#${r.sources.pointer} · SHA-256 ${r.sources.sha256}`));
                if(r.sources.detail)evidence.append(el('p',`${r.sources.detail.file}#${r.sources.detail.pointer} · SHA-256 ${r.sources.detail.sha256}`));
                const download=el('a','Open this public evidence record');download.style.color='#a8d8ff';download.href='/world-rule-evidence?record='+encodeURIComponent(r.key);download.target='_blank';download.rel='noopener';evidence.append(download);
                for(const [key,value]of Object.entries({...r.interpretation,...r.particulars}))if(value&&(!Array.isArray(value)||value.length))evidence.append(el('p',`${key}: ${Array.isArray(value)?value.join('; '):value}`));card.append(evidence,el('h3','Implementation evidence'),el('p',r.implementation.state?'Ledger state: '+r.implementation.state:'No implementation state recorded'),el('p',r.implementation.test?'Recorded check reference: '+r.implementation.test:'No playable check reference recorded'),el('p',r.implementation.note));results.append(card);
            }
            const page=el('p',data.total?`Showing ${offset+1}–${offset+data.records.length} of ${data.total}`:'Showing 0 records');pages.append(page);
            for(const [label,next,disabled]of [['Previous',Math.max(0,offset-40),offset===0],['Next',offset+40,offset+40>=data.total]]){const b=el('button',label);b.disabled=disabled;b.onclick=()=>{offset=next;load();shell.scrollIntoView();};pages.append(b);}
        }catch(error){if(id===serial)status.textContent=error.message;}}
    form.onsubmit=event=>{event.preventDefault();offset=0;record='';selected=world.value;load();};world.onchange=kind.onchange=()=>{offset=0;record='';selected=world.value;load();};await load();
}
