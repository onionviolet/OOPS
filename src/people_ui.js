import {knownPeopleView} from "./people_knowledge.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createPeopleOverview() {
    const panel = node("section"); panel.id = "known_people_panel"; panel.className = "expedition_panel known_people_panel";
    panel.append(node("h3", "People you know"), node("p", "What you have learned and what happened between you. Locations are last known or agreed, rather than live reports."));
    const list = node("div"); panel.append(list);
    const cards = new Map();
    function render(state, facts) {
        const rows = knownPeopleView(state, facts);
        // View-only: two distinct known people never share one heading.
        const shared = name => rows.filter(row => row.name === name).length > 1;
        const title = row => shared(row.name) ? `${row.name} (${row.location.replace(/^[^:]*:\s*/, "")})` : row.name;
        panel.hidden = !rows.length;
        for(const row of rows) {
            let card = cards.get(row.id);
            if(!card) {
                const root = node("details"), heading = node("summary", title(row)), location = node("p"), details = node("div"), history = node("ul");
                root.dataset.knownPerson = row.id; root.append(heading, location, details, history); list.append(root);
                card = {root, heading, location, details, history, signature:""}; cards.set(row.id, card);
            }
            const signature = JSON.stringify([title(row), row]);
            if(signature !== card.signature) {
                card.signature = signature; card.heading.textContent = title(row); card.location.textContent = row.location;
                if(row.accounts?.length){
                    card.details.replaceChildren(node('h4','Known capabilities and services'),node('p','These are your learned accounts. Current condition, private possessions and unoffered services are not assessed here. Use the person’s local service for current terms.'));
                    for(const account of row.accounts){const entry=node('div');entry.dataset.personAccount=account.id;entry.append(node('p',account.text),node('small',`${account.basis}${Number.isFinite(account.at)?` · played minute ${account.at}`:''}`));card.details.append(entry);}
                }else card.details.replaceChildren(...row.details.map(text => node("p", text)));
                card.history.replaceChildren(...row.memories.map(m => node("li", m.text))); card.history.hidden = !!row.accounts?.length || !row.memories.length;
            }
        }
        for(const [id,card] of cards) if(!rows.some(row => row.id === id)) {card.root.remove(); cards.delete(id);}
        return rows.length;
    }
    return {panel, render};
}
