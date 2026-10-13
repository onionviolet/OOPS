import {commands as foreman} from './foreman.js';
import {people,sites,situations,foundationCommands} from './foundation.js';
import {commands as capitalRooms} from './capital_rooms.js';
import {commands as shopsAuctions} from './shops_auctions.js';
import {commands as shippingFarming} from './shipping_farming.js';
import {commands as workshopAid} from './workshop_aid.js';
import {commands as eventsRestoration} from './events_restoration.js';
export const managementDefinitions={people,sites,situations,commands:[...foundationCommands,...foreman,...capitalRooms,...shopsAuctions,...shippingFarming,...workshopAid,...eventsRestoration]};
