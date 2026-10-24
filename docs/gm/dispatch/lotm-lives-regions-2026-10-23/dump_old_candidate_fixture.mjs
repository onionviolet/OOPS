// Dumps an OLD-candidate engine save (university place id 'Tingen university quarter') by running with that id temporarily set in
// src/book_world_lotm_ids.js (the dump is run by hand with the id swapped, then the file is restored). Output: fixtures/candidate_old_quarter_*.json.
import fs from 'node:fs';
import {fresh,run,at,save,wait} from '../../../../tests/lotm_helpers.js';
import {LOTM_LOCATIONS as L} from '../../../../src/book_world_lotm_ids.js';
if(L.university!=='Tingen university quarter')throw Error('swap the id first');
let p=at(run(fresh(500,'machinery'),'report_in_machinery'),L.university);
fs.writeFileSync(new URL('./fixtures/candidate_old_quarter_machinery_reported.json',import.meta.url),JSON.stringify(save(p)));
p=run(run(p,'accept_allocation_sv'),'ingest_sv');p=run(p,'act_study'); // a study act in flight (job)
fs.writeFileSync(new URL('./fixtures/candidate_old_quarter_machinery_midjob.json',import.meta.url),JSON.stringify(save(p)));
console.log('ok',p.state.simulation.jobs.length);
