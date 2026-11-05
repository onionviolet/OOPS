// Bundled with main once, exclusively in this isolated workbench build.
import '../../../../src/main.js';
import {expandWorkspaceModule} from '../../../../src/workspace_layout.js';
import {domainRegistry} from '../../../../src/domain_registry.js';
import {quoteRepair,executeRepair,cancelRepair} from '../../../../src/tools_domain.js';
import {quoteWorkshop,executeWorkshop} from '../../../../src/gear_workshop_domain.js';
import {getItemFromKey} from '../../../../src/items.js';
if(new URL(location).searchParams.has('test_hooks'))window.equipmentComparisonPorts=Object.freeze({
 tools:()=>structuredClone(domainRegistry.project('tools')),gear:()=>structuredClone(domainRegistry.project('gear_workshop')),
 quoteRepair,executeRepair,cancelRepair,quoteWorkshop,executeWorkshop,openPanel:expandWorkspaceModule,
 describe:key=>{const i=getItemFromKey(key);return {name:i.getName(),quality:i.quality,attack:i.calculateAttackPower?.(i.quality),defense:i.calculateDefense?.(i.quality),components:i.components,stats:i.getStats?.(),wear:i.getWearProfile?.()};}
});
