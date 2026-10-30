import {knownPeopleView} from "./people_knowledge.js";
import {characterSheetView} from "./character_sheet.js";
import {subjectFromKnownPerson, MET_READ} from "./character_sheet_people.js";
import {renderCharacterSheet} from "./ui/character_sheet_view.js";
import {observerView} from "./observer_view.js";
import {domainRegistry} from "./domain_registry.js";
import {relationshipWebForState} from "./relationship_web_view.js";
import {renderFigure} from "./ui/figure.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createPeopleOverview() {
    const panel = node("section"); panel.id = "known_people_panel"; panel.className = "expedition_panel known_people_panel";
    panel.append(node("h3", "People you know"), node("p", "What you have learned and what happened between you. Locations are last known or agreed, rather than live reports."));
    // RPX11 web: a sibling of the cards, never inside one; redrawn only when its spec changes.
    const web = node("details"); web.id = "relationship_web"; web.className = "relationship_web"; web.open = true;
    const figure = node("div"), textForm = node("details"), text = node("pre");
    textForm.append(node("summary", "Read as text"), text); text.className = "fig-text";
    web.append(node("summary", "Web of who knows what"), figure, textForm);
    const list = node("div"); panel.append(web, list);
    let webSignature = "";
    const cards = new Map();
    function render(state, facts) {
        const rows = knownPeopleView(state, facts);
        // View-only: two distinct known people never share one heading.
        const shared = name => rows.filter(row => row.name === name).length > 1;
        const title = row => shared(row.name) ? `${row.name} (${row.location.replace(/^[^:]*:\s*/, "")})` : row.name;
        panel.hidden = !rows.length;
        // The web is an extra view: if its reads fail on an unusual save, hide it and keep the cards.
        try {
            const spec = rows.length ? relationshipWebForState(state, facts, {rows, memory: domainRegistry.command("memory", "read")?.()}) : null, signature = JSON.stringify(spec);
            if(signature !== webSignature) {webSignature = signature; if(spec) text.textContent = renderFigure(figure, spec, {idPrefix: "relationship-web"}).text;}
            web.hidden = !spec;
        } catch(error) {
            web.hidden = true;
            if(!webSignature.startsWith("error:")) {webSignature = `error:${error.message}`; console.warn("[relationship web]", error);}
        }
        for(const row of rows) {
            let card = cards.get(row.id);
            if(!card) {
                const root = node("details"), heading = node("summary", title(row)), location = node("p"), details = node("div"), history = node("ul");
                // The same character sheet as the You panel, read from what you learned (CHARACTER_SHEET.md).
                const sheet = node("details"), sheetHost = node("div"); sheet.dataset.personSheet = row.id; sheet.append(node("summary", "Character sheet"), sheetHost);
                root.dataset.knownPerson = row.id; root.append(heading, location, details, history, sheet); list.append(root);
                card = {root, heading, location, details, history, sheetHost, signature:""}; cards.set(row.id, card);
            }
            const signature = JSON.stringify([title(row), row]);
            if(signature !== card.signature) {
                card.signature = signature; card.heading.textContent = title(row); card.location.textContent = row.location;
                if(row.accounts?.length){
                    card.details.replaceChildren(node('h4','Known capabilities and services'),node('p','These are your learned accounts. Current condition, private possessions and unoffered services are not assessed here. Use the person’s local service for current terms.'));
                    for(const account of row.accounts){const entry=node('div');entry.dataset.personAccount=account.id;entry.append(node('p',account.text),node('small',`${account.basis}${Number.isFinite(account.at)?` · played minute ${account.at}`:''}`));card.details.append(entry);}
                }else card.details.replaceChildren(...row.details.map(text => node("p", text)));
                card.history.replaceChildren(...row.memories.map(m => node("li", m.text))); card.history.hidden = !!row.accounts?.length || !row.memories.length;
                renderCharacterSheet(card.sheetHost, characterSheetView(subjectFromKnownPerson(row), observerView(state), [MET_READ]), {layout: "narrow"});
            }
        }
        for(const [id,card] of cards) if(!rows.some(row => row.id === id)) {card.root.remove(); cards.delete(id);}
        return rows.length;
    }
    return {panel, render};
}
