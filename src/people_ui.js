import {knownPeopleView} from "./people_knowledge.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createPeopleOverview() {
    const panel = node("section"); panel.id = "known_people_panel"; panel.className = "expedition_panel known_people_panel";
    panel.append(node("h3", "People you know"), node("p", "What you have learned and what happened between you. Locations are last known or agreed, rather than live reports."));
    const list = node("div"); panel.append(list);
    const cards = new Map();
    function render(state, facts) {
        const rows = knownPeopleView(state, facts);
        panel.hidden = !rows.length;
        for(const row of rows) {
            let card = cards.get(row.id);
            if(!card) {
                const root = node("details"), heading = node("summary", row.name), location = node("p"), details = node("div"), history = node("ul");
                root.dataset.knownPerson = row.id; root.append(heading, location, details, history); list.append(root);
                card = {root, heading, location, details, history, signature:""}; cards.set(row.id, card);
            }
            const signature = JSON.stringify(row);
            if(signature !== card.signature) {
                card.signature = signature; card.heading.textContent = row.name; card.location.textContent = row.location;
                card.details.replaceChildren(...row.details.map(text => node("p", text)));
                card.history.replaceChildren(...row.memories.map(m => node("li", m.text))); card.history.hidden = !row.memories.length;
            }
        }
        for(const [id,card] of cards) if(!rows.some(row => row.id === id)) {card.root.remove(); cards.delete(id);}
        return rows.length;
    }
    return {panel, render};
}
