import fs from 'node:fs';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';
import {validateMolCast} from '../src/book_world_mol_cast.js';
for(const [kind,validate] of [['lotm',validateLotmCast],['mol',validateMolCast]]){
 const path=`private_packs/${kind}-cast/cast.json`;
 if(!fs.existsSync(path)){console.log(`${kind}: skipped: private pack absent`);continue;}
 const errors=validate(JSON.parse(fs.readFileSync(path,'utf8')));
 if(errors.length){console.error(kind,errors);process.exitCode=1;}
 else{console.log(`${kind}: private cast valid`);}
}
