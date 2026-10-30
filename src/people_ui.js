import {knownPeopleView} from "./people_knowledge.js";
import {characterSheetView} from "./character_sheet.js";
import {subjectFromKnownPerson, MET_READ} from "./character_sheet_people.js";
import {renderCharacterSheet} from "./ui/character_sheet_view.js";
import {observerView} from "./observer_view.js";
import {domainRegistry} from "./domain_registry.js";
import {relationshipWebPeople} from "./relationship_web_view.js";
import {relationshipWebSpec, relationshipGlance, relationshipStageMeter} from "./ui/relationship_web.js";
import {figureText} from "./ui/figure.js";
import {mountFormSwitch} from "./ui/figure_forms.js";
const webForms = new Map(); // form chosen per figure id, kept across redraws (bk-forms)
import {createMeterBar} from "./meter_bar.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createPeopleOverview() {
    const panel = node("section"); panel.id = "known_people_panel"; panel.className = "expedition_panel known_people_panel";
    panel.append(node("h3", "People you know"), node("p", "What you have learned and what happened between you. Locations are last known or agreed, rather than live reports."));
    // RPX11 web: a sibling of the cards, never inside one; redrawn only when its spec changes. It opens once,
    // the first time two or more people are known (COV4: the best figure is not hidden); after that the player's
    // own open or close stays. The text form stays closed, so the panel adds few visible words.
    const web = node("details"); web.id = "relationship_web"; web.className = "relationship_web";
    const webSummary = node("summary", "Web of who knows what"), figure = node("div"), textForm = node("details"), text = node("pre");
    textForm.append(node("summary", "Read as text"), text); text.className = "fig-text";
    web.append(webSummary, figure, textForm);
    const list = node("div"); panel.append(web, list);
    let webSignature = "", webSeen = false;
    const cards = new Map();
    function render(state, facts) {
        const rows = knownPeopleView(state, facts);
        // View-only: two distinct known people never share one heading.
        const shared = name => rows.filter(row => row.name === name).length > 1;
        const title = row => shared(row.name) ? `${row.name} (${row.location.replace(/^[^:]*:\s*/, "")})` : row.name;
        panel.hidden = !rows.length;
        // The web, glance lines and bond bars are extra views: if their reads fail on an unusual save,
        // hide them and keep the cards.
        let bonds = new Map();
        try {
            const people = rows.length ? relationshipWebPeople(state, facts, {rows, memory: domainRegistry.command("memory", "read")?.()}) : [];
            bonds = new Map(people.map(person => [person.id, person]));
            const spec = people.length ? relationshipWebSpec(people) : null, signature = JSON.stringify(spec);
            if(signature !== webSignature) {
                webSignature = signature;
                if(spec) {mountFormSwitch(figure, spec, {idPrefix: "relationship-web", memory: webForms, forms: ["web", "table", "matrix"]}); text.textContent = figureText(spec); webSummary.textContent = `Web of who knows what · ${people.length} ${people.length === 1 ? "person" : "people"}`;}
            }
            web.hidden = !spec;
            if(people.length > 1 && !webSeen) {webSeen = true; web.open = true;}
        } catch(error) {
            web.hidden = true;
            if(!webSignature.startsWith("error:")) {webSignature = `error:${error.message}`; console.warn("[relationship web]", error);}
        }
        for(const row of rows) {
            let card = cards.get(row.id);
            if(!card) {
                const root = node("details"), heading = node("summary"), name = node("span", title(row)), glance = node("span"), bond = createMeterBar(document);
                glance.className = "known_person_glance"; heading.append(name, glance); bond.node.hidden = true;
                // The sheet owns where you last saw them, what you know and what you remember (UR73, CHARACTER_SHEET.md);
                // the card keeps the name, the bond and the way in. Open by default so those lines stay one look away.
                const sheet = node("details"), sheetHost = node("div"); sheet.dataset.personSheet = row.id; sheet.open = true;
                sheet.append(node("summary", "Character sheet · where, what you know, what you remember"), sheetHost);
                root.dataset.knownPerson = row.id; root.append(heading, bond.node, sheet); list.append(root);
                card = {root, heading, name, glance, bond, sheetHost, signature:""}; cards.set(row.id, card);
            }
            const person = bonds.get(row.id), signature = JSON.stringify([title(row), row, person || null]);
            if(signature !== card.signature) {
                card.signature = signature; card.name.textContent = title(row);
                // Glance first (stage and what needs attention), the bond bar one click away inside the card.
                card.glance.textContent = person ? ` · ${relationshipGlance(person)}` : "";
                card.bond.node.hidden = !person; if(person) card.bond.update(relationshipStageMeter(person));
                renderCharacterSheet(card.sheetHost, characterSheetView(subjectFromKnownPerson(row), observerView(state), [MET_READ]), {layout: "narrow"});
            }
        }
        for(const [id,card] of cards) if(!rows.some(row => row.id === id)) {card.root.remove(); cards.delete(id);}
        return rows.length;
    }
    return {panel, render};
}
