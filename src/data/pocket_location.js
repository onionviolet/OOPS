import {locations} from './locations.js';
import {SafeLocation} from '../models/location.js';
export const POCKET_LOCATION = 'Folded Glasshouse';
// One original contained site uses a real native location with no inherited
// village shops, actors, gathering jobs, housing, chest or quest rewards.
export function registerPocketLocation() {
 if(locations[POCKET_LOCATION]) return locations[POCKET_LOCATION];
 const room=new SafeLocation({id:POCKET_LOCATION,name:POCKET_LOCATION,
  description:'Warm panes fold around a small garden and a workbench. The brass frame behind you still opens on the Village doorway.',stations:[{id:'notebook',name:'Notebook',description:'Work, trade, practice and the way back.',module:'notebook'}],
  npcs:[],connected_locations:[],is_under_roof:true,light_level:'normal',tags:{pocket:true},entrance_rewards:{}});
 locations[POCKET_LOCATION]=room;return room;
}
