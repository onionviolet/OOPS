export function appendCensusDetails(parent,subject,{el,section,entityLink}) {
    const rows=[];
    for(const name of subject.names||[]) rows.push([name.name,el('small',[
        name.zh,({repo:'Repository name',wiki:'Wiki name','pinyin-unconfirmed':'Pinyin name · unconfirmed'}[name.source]||'Name origin unstated'),name.locator].filter(Boolean).join(' · '))]);
    if(subject.aliases?.length)rows.push(['Aliases',el('small',subject.aliases.join(', '))]);
    const locationRows=(subject.whereabouts||[]).map(w=>[entityLink(w.place),el('small',[
        ({stated:'Stated whereabouts',claimed:'Claimed whereabouts',inferred:'Inferred whereabouts'}[w.status]||'Whereabouts status unstated'),w.era,w.locator].filter(Boolean).join(' · '))]);
    for(const a of subject.amountRecords||[]) rows.push([[a.value,a.unit,a.per?`per ${a.per}`:null,a.cap===null?null:`cap ${a.cap}`].filter(v=>v!==null&&v!=='').join(' '),
        el('small',[a.claimant?`Claimant: ${a.claimant}`:null,a.locator].filter(Boolean).join(' · '))]);
    if(rows.length||locationRows.length) {
        const details=el('details');details.dataset.censusDetails='';details.append(el('summary','Names and whereabouts'));
        if(rows.length)details.append(section('Name and quantity records',rows));
        if(locationRows.length)details.append(section('Whereabouts in source records',locationRows));
        parent.append(details);
    }
}
