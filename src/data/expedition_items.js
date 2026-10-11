import {steamBOHItemSpecifications} from '../steam_boh_content.js';
import {registerGameAbsorptionAssayItems} from '../game_absorption_assay_content.js';
import {worldCompletionItemSpecifications} from '../world_completion_content.js';
import {registerAuditRemainderItems} from '../audit_remainder_content.js';
import {registerArtifactWorkshopItems} from '../artifact_workshop_content.js';
import {registerNethackFieldcraftItems} from '../nethack_fieldcraft_content.js';
import {registerParadiseItems} from '../book_world_paradise_content.js';
import {registerMolItems} from '../book_world_mol_content.js';
import {registerFactorioRetortItems} from '../factorio_retort_content.js';
import {registerProto23Items} from '../proto23_world_content.js';
import {registerRelayItems} from '../feature_expansion_subtlety_scene.js';
import {backlogItemDefinitions} from '../backlog_expansion_content.js';
import {repositoryAbsorptionItemSpecifications} from '../repository_absorption_content.js';
import {registerFeatureObjectItems} from '../feature_expansion_objects.js';
import {FEATURE_POWER_ITEMS} from '../feature_expansion_powers.js';
import {registerReferenceGameplayItems} from '../reference_gameplay_content.js';
import {item_templates, OtherItem} from "../items.js";

// Original provisional supplies, registered through the existing item model.
for(const [id, description, value] of [
    // The Village trader's starting margin is four. Base values 2/4 produce
    // opening shop prices 8/16, matching the journal's preparation service.
    ["Prepared survey kit", "Anchors and cord for one crossing survey. Spent when you commit the kit route in the Field journal.", 2],
    ["Survey rope", "A lightweight reusable line for the Village crossing. Carry it to open the slower anchor route in the Field journal; the heavier Coil of rope has separate uses.", 4],
    ["Wet seal blank", "A damp parcel blank. Dry it before fitting; pressure alone does not remove its moisture.", 1],
    ["Sound seal blank", "A seasoned blank ready for fitting a parcel seal.", 3],
    ["Fitted parcel seal", "A fitted seal made from one sound blank. Iona can inspect it for her accepted order.", 1],
    ["Parcel gauge", "Iona's reusable fitting gauge. A loan permits the named parcel work; return it before settling.", 4],
    ["Sealing template", "A reusable counted-fitting template. With its taught pattern, two logs and steady hands can produce two survey kits.", 5],
]) {
    if(item_templates[id]) throw new Error(`Duplicate expedition item ${id}.`);
    item_templates[id] = new OtherItem({id, name: id, description, value, tags: {expedition: true}});
}

registerFeatureObjectItems({itemTemplates:item_templates,OtherItem});
registerReferenceGameplayItems({itemTemplates:item_templates,OtherItem});
registerParadiseItems({itemTemplates:item_templates,OtherItem});
registerMolItems({itemTemplates:item_templates,OtherItem});
registerFactorioRetortItems({itemTemplates:item_templates,OtherItem});
registerProto23Items({itemTemplates:item_templates,OtherItem});
registerNethackFieldcraftItems({itemTemplates:item_templates,OtherItem});
for(const spec of FEATURE_POWER_ITEMS) {if(!item_templates[spec.id]) item_templates[spec.id]=new OtherItem(spec);}

for(const spec of [...backlogItemDefinitions,...repositoryAbsorptionItemSpecifications]){if(!item_templates[spec.id])item_templates[spec.id]=new OtherItem({...spec,tags:{expedition:true,...spec.tags}});}

registerRelayItems({itemTemplates:item_templates,OtherItem});

registerAuditRemainderItems({itemTemplates:item_templates,OtherItem});
registerArtifactWorkshopItems({itemTemplates:item_templates,OtherItem});

for(const spec of worldCompletionItemSpecifications){if(item_templates[spec.id])throw new Error(`Duplicate world-completion item ${spec.id}.`);item_templates[spec.id]=new OtherItem({...spec,name:spec.id,tags:{expedition:true}});}

registerGameAbsorptionAssayItems({itemTemplates:item_templates,OtherItem});

for(const spec of steamBOHItemSpecifications){if(item_templates[spec.id])throw new Error(`Duplicate workshop item ${spec.id}.`);item_templates[spec.id]=new OtherItem({...spec,name:spec.id,tags:{expedition:true}});}
