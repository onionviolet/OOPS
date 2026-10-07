import {characterBioView} from "./character_bio.js";

export function createCharacterBio({registry, read, readTraining, practice, showSkill}) {
    const node = (tag, text = "") => {const element=document.createElement(tag); element.textContent=text; return element;};
    const root=node("section"); root.className="bio_history"; root.id="character_history_bio";
    const identity=node("p"), life=node("p"), empty=node("p", "Your lasting discoveries will be recorded here.");
    root.append(identity, life, empty);
    const sections=new Map();
    for(const [key,label] of [["conditions","Current condition"],["influences","Training influences"],["heritage","Inherited traits"],["learned","Lasting discoveries"],["techniques","Learned movements"]]) {
        const details=node("details"), summary=node("summary",label), list=node("ul"); details.dataset.bioSection=key;
        details.append(summary,list); root.append(details); sections.set(key,{details,list,rows:new Map()});
    }
    const practiceButton=node("button","Open practice notes"); practiceButton.type="button"; practiceButton.addEventListener("click",practice); root.append(practiceButton);
    function render() {
        const host=document.getElementById("character_bio_div"); if(root.parentElement !== host && host) host.append(root);
        const view=characterBioView({...read(),registry,training:readTraining()});
        identity.textContent=view.identity; identity.hidden=!view.identity;
        life.textContent=view.life; life.hidden=!view.life;
        empty.hidden=!!(view.influences.length || view.learned.length || view.heritage.length || view.conditions.length || view.techniques.length || view.life);
        practiceButton.hidden=!view.techniques.length;
        for(const [key,{details,list,rows}] of sections) {
            details.hidden=!view[key].length;
            const current=new Set(view[key].map(row=>row.id));
            for(const [id,row] of rows) if(!current.has(id)) {row.root.remove(); rows.delete(id);}
            for(const item of view[key]) {
                let row=rows.get(item.id);
                if(!row) {
                    const li=node("li"), label=node(key === "influences" ? "button" : "strong"), text=node("span"), cause=node("span");
                    li.dataset.bioEntry=item.id; text.className=cause.className="bio_cause"; li.append(label,text,cause);
                    if(key === "influences") {label.type="button"; label.dataset.bioSkill=item.id; label.addEventListener("click",()=>showSkill(item.id));}
                    list.append(li); row={root:li,label,text,cause}; rows.set(item.id,row);
                }
                row.label.textContent=item.label;
                row.text.textContent=[item.detail,item.effect].filter(Boolean).join(". ");
                row.cause.textContent=item.cause;
            }
        }
    }
    render(); return {render};
}
