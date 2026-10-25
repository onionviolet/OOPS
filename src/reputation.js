import { character } from "./data/character.js";
import { rankChange } from "./faction_rank.js";

const ReputationManager = {

    add_reputation: ({reputation, region}) => {
        if(Number.isInteger(reputation)) {
            if(region in character.reputation) {
                const before = character.reputation[region];
                character.reputation[region] += reputation;
                return rankChange(region, before, character.reputation[region]);
            } else {
                throw new Error(`Tried to add reputation to "${region}", which is not a valid reputation region!`);
            }
        } else {
            throw new Error(`Tried to add "${reputation}", which is not a valid integer!`);
        }
    },


    //for future: some unlocks for reaching certain values?
    //they could be handled via unmarked quests, but doing that here should be cleaner
}


export {ReputationManager}