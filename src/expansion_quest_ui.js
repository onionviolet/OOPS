import {localLifeQuestView} from './absorb_c2/local_life.js';
import {originalFrontierCareerQuestView} from './original_frontier_campaign_host.js';
import {originalFrontierQuestView} from './original_frontier_campaign_content.js';
import {townQuestView} from "./town_content.js";
import {fieldQuestView} from "./field_workshop.js";
import {fieldSupplyQuestView} from "./frontier_campaign.js";
import {exchangeQuestView} from "./exchange.js";

// Read-only sibling cards share the native completed filter. No reward owner here.
export function createExpansionQuests({read,readLocalLife=()=>undefined}) {
    const list=document.createElement("div");list.id="expansion_quest_list";
    const cards=[["original_frontier.return_charter","original_frontier_charter_details",originalFrontierCareerQuestView],["original_frontier.short_measure","original_frontier_quest_details",originalFrontierQuestView],["town.survey","town_quest_details",townQuestView],["field.workshop","field_quest_details",fieldQuestView],["field.supplies","field_supply_details",fieldSupplyQuestView],["exchange.parcel","exchange_quest_details",exchangeQuestView],...["village.watch","village.parcel"].map(id=>[id,`${id.replace('.','_')}_details`,()=>localLifeQuestView(readLocalLife()).find(q=>q.id===id)])].map(([id,detailsId,view])=>{
        const card=document.createElement("div");card.className="quest_div";card.dataset.expansionQuest=id;
        const title=document.createElement("button");title.type="button";title.className="quest_name_div expansion_quest_name";
        const details=document.createElement("div");details.id=detailsId;title.setAttribute("aria-controls",detailsId);title.setAttribute("aria-expanded","false");
        const description=document.createElement("div"),objective=document.createElement("div");description.className="quest_description_div";objective.className="quest_task_div";
        details.append(description,objective);card.append(title,details);list.append(card);
        title.addEventListener("click",()=>title.setAttribute("aria-expanded",String(card.classList.toggle("quest_div_expanded"))));
        return {card,title,description,objective,view};
    });
    function render() {
        const host=document.getElementById("quests_box_div");if(!list.isConnected && host)host.insertBefore(list,document.getElementById("quest_hiding_div"));
        const state=read().state;let visible=false;
        for(const entry of cards) {
            const quest=entry.view(state);entry.card.hidden=!quest;if(!quest)continue;visible=true;
            entry.card.classList.toggle("quest_finished",quest.completed);
            for(const [key,value] of [["title",quest.name],["description",quest.description],["objective",quest.objective]])if(entry[key].textContent !== value)entry[key].textContent=value;
        }
        list.hidden=!visible;
    }
    render();return {render};
}
