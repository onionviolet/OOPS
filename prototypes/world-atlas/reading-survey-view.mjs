import {element as el} from '/canvas.mjs';
import {worldTitle} from '/library-views.mjs';
import {appendReadingReadiness} from '/reading-readiness-view.mjs';

const metrics = [
    ['unindexedRows','Unindexed rows'],['missing','Missing outputs'],['unattested','Unattested outputs'],
    ['matchedRows','Matched rows'],['parsedRows','Parsed rows'],['withheldRows','Withheld rows'],
];
const number = n => n.toLocaleString('en-US');

export async function readingSurvey({main}) {
    const sheet = el('article',null,'sheet reading-outputs');
    sheet.append(el('h2','Reading coverage by world'),el('p','Missing outputs are counted for observed reading slices. Unindexed rows have no exact public match. Open a world to check its current files.'));
    main.replaceChildren(sheet);
    const status = el('p','Loading saved measurements…');
    status.setAttribute('aria-live','polite');
    sheet.append(status);
    try {
        const response = await fetch('/reading-survey',{cache:'no-store'});
        if (!response.ok) throw Error();
        const worlds = await response.json();
        if (!sheet.isConnected) return;
        const measured = worlds.filter(row => row.totals);
        const sum = key => measured.reduce((n,row) => n+row.totals[key],0);
        const observed = measured.filter(row => row.prefixes>0).length;
        status.textContent = measured.length+' of '+worlds.length+' worlds measured · '+observed+' with observed slices · '+number(sum('parsedRows'))+' parsed rows · '+number(sum('matchedRows'))+' exact public matches';
        const label = el('label','Rank worlds by '),sort = el('select');
        for (const [key,name] of metrics) sort.append(new Option(name,key));
        label.append(sort);
        const body = el('tbody'),table = el('table'),head = el('tr');
        for (const title of ['World',...metrics.map(([,name]) => name),'Measured (UTC)']) {
            const th = el('th',title); th.scope='col'; head.append(th);
        }
        const thead = el('thead'); thead.append(head); table.append(thead,body);
        const details = el('section');
        const show = row => {
            details.replaceChildren(el('h3',worldTitle(row.world)));
            appendReadingReadiness(details,row.world,el);
            details.scrollIntoView({block:'start'});
            details.querySelector('button').focus({preventScroll:true});
        };
        const render = () => {
            const rows = [...worlds].sort((a,b) => (b.totals?.[sort.value] ?? -1) - (a.totals?.[sort.value] ?? -1) || worldTitle(a.world).localeCompare(worldTitle(b.world)));
            body.replaceChildren();
            for (const row of rows) {
                const tr = el('tr'),name = el('th'),open = el('button',worldTitle(row.world));
                name.scope='row'; open.onclick=() => show(row); name.append(open); tr.append(name);
                for (const [key] of metrics) tr.append(el('td',row.totals ? number(row.totals[key]) : '—'));
                tr.append(el('td',row.totals ? row.measuredAt.slice(0,10) : row.status === 'missing' ? 'No report' : 'Unavailable'));
                body.append(tr);
            }
        };
        sort.onchange=render;
        const scroll=el('div',null,'reading-survey-table');
        scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','World reading measurements');scroll.append(table);
        sheet.append(label,details,scroll);
        render();
    } catch { status.textContent='Saved reading measurements could not be loaded.'; }
}
