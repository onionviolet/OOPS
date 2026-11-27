import {element as el} from '/canvas.mjs';

function link(text,href){
    const node=el('a',text);
    node.href=href;
    return node;
}

const readerKinds=new Set(['stated','implied','reader locator']);
const confidence={stated:'Reader record',implied:'Reader inference',secondary:'Secondary source',bg:'Background only',
    chapter:'Chapter reference','reader locator':'Reader locator'};

function coverage(cases){
    const names=Map.groupBy(cases,row=>row.book);
    const groups={Readings:[],'Chapter references':[],'Secondary only':[],'Background only':[]};
    for(const [book,rows] of names){
        const kinds=new Set(rows.map(row=>row.confidence));
        const group=[...kinds].some(kind=>readerKinds.has(kind))?'Readings':
            kinds.has('chapter')?'Chapter references':kinds.has('secondary')?'Secondary only':'Background only';
        groups[group].push(book);
    }
    const list=el('dl');
    for(const [kind,books] of Object.entries(groups))list.append(el('dt',kind),el('dd',books.join(', ')||'None indexed'));
    return list;
}

export async function systemsView({main,systemId}){
    const shell=el('section',null,'atlas-systems canvas-inspector');
    main.append(shell);
    const loading=el('p','Loading Systems');
    loading.setAttribute('role','status');
    shell.append(loading);
    try{
        const response=await fetch('/systems-data');
        if(!response.ok)throw Error('Systems could not load.');
        const {articles}=await response.json();
        if(!shell.isConnected)return;
        const params=new URLSearchParams(location.hash.split('?')[1]);
        const world=params.get('world');
        const article=articles.find(item=>item.id===systemId);
        const path=el('nav');
        path.setAttribute('aria-label','Systems navigation');
        path.append(link('All systems','#systems'), link('Find system records','#find?type=systems'));
        shell.replaceChildren(path);
        if(!article){
            shell.append(el('h2','Systems'));
            if(!articles.length){shell.append(el('p','Build and adopt an Atlas snapshot to read Systems.'));return;}
            const shown=world?articles.filter(item=>item.cases.some(row=>row.world===world)):articles;
            if(!shown.length){shell.append(el('p','This world has no indexed Systems comparisons yet.'));return;}
            const list=el('ul',null,'system-index');
            for(const item of shown){
                const row=el('li');
                row.append(link(item.id+' · '+item.label,'#systems/'+item.id),el('small',item.playStatus));
                list.append(row);
            }
            shell.append(list);
            return;
        }
        shell.append(el('h2',article.id+' · '+article.label),el('p',article.definition));
        const state=el('p');
        state.append(el('strong','OOPS: '+article.playStatus),document.createTextNode(' · '),
            link(article.playReceipt?'Open played evidence':'Open the recorded scope',article.evidence));
        shell.append(state);
        if(article.playReceipt)shell.append(el('p',article.playReceipt.life+' · '+article.playReceipt.action));
        if(article.playGap)shell.append(el('p',article.playGap));
        shell.append(el('h3','Coverage'),coverage(article.cases),el('h3','Compare readings'));
        if(!article.cases.length)shell.append(el('p','No comparative records have been indexed for this mechanism.'));
        else {
            const table=el('table'),head=el('thead'),headRow=el('tr'),body=el('tbody');
            for(const label of ['Book','Variation','Citation']){const th=el('th',label);th.scope='col';headRow.append(th);}
            head.append(headRow);table.append(head,body);
            for(const record of article.cases){
                const row=el('tr'),book=el('th',record.book),citation=el('td');
                book.scope='row';
                row.dataset.systemCell=record.id;
                if(params.get('cell')===record.id){row.tabIndex=-1;row.dataset.selected='true';}
                citation.append(link(record.source,record.cite),el('small',record.qualification??confidence[record.confidence]??record.confidence));
                row.append(book,el('td',record.statement),citation);
                body.append(row);
            }
            shell.append(table);
        }
        shell.append(el('h3','Variations and edge cases'));
        const list=el('ul');
        for(const row of article.variations)list.append(el('li',row));
        shell.append(list);
        const related=el('nav');
        related.setAttribute('aria-label','Related mechanisms');
        for(const id of article.related){
            const item=articles.find(candidate=>candidate.id===id);
            if(item)related.append(link(item.id+' · '+item.label,'#systems/'+item.id));
        }
        shell.append(el('h3','Related mechanisms'),related);
        shell.querySelector('[data-selected]')?.focus();
    }catch(error){
        if(shell.isConnected){
            loading.textContent=error.message;
            loading.append(document.createTextNode(' '),link('Back to Worlds','#worlds'));
            shell.replaceChildren(loading);
        }
    }
}
