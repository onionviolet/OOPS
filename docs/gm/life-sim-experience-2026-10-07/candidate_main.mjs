// Review candidate only. Applied to an isolated preview, never to shared main.js.
export function heirCandidateMain(source) {
    const replace=(needle,value)=>{if(source.split(needle).length!==2)throw new Error(`Candidate host input drift: ${needle.slice(0,80)}`);source=source.replace(needle,value);};
    replace("import {lifeLearningMultiplier} from './life_experience.js';", "import {lifeLearningMultiplier} from './life_experience.js';\nimport {buildLifeHeirSave} from './life_experience_host.js';");
    replace('acquireSaveOwnership().then(owned => {','const heirOwnershipReady = acquireSaveOwnership().then(owned => {');
    replace('//check if there\'s an existing save file, otherwise just do some initial setup', `// Candidate transaction: preserve the ended envelope until a real fresh start is ready.
let pendingHeir = null;
if(!importProbeToken) {
    const key=is_on_dev() ? dev_save_key : save_key;
    const bytes=localStorage.getItem(key);
    if(bytes) {
        const raw=JSON.parse(bytes);
        if(raw.life_successor_requested === true) {
            const candidate=validateSaveEnvelope(raw,game_version);
            if(candidate.expansion?.chronicle?.life.endedAt==null)throw new Error('No ended life awaits an heir.');
            pendingHeir=candidate;
            play_button.inert=true;
        }
    }
}
//check if there's an existing save file, otherwise just do some initial setup`);
    replace('} else if(!is_on_dev() && save_key in localStorage || is_on_dev() && (dev_save_key in localStorage || !("skip_live_import" in localStorage) && save_key in localStorage )) {', '} else if(!pendingHeir && (!is_on_dev() && save_key in localStorage || is_on_dev() && (dev_save_key in localStorage || !("skip_live_import" in localStorage) && save_key in localStorage ))) {');
    replace('reset: hard_reset});', 'reset: hard_reset, beginHeir: requestLifeHeir});');
    source += `\n
// Candidate host, pending save-owner review. Existing guarded storage remains authoritative.
function requestLifeHeir() {
    if(!ownsSave || importProbeToken || foundationSaveBlocked || is_loading_error || importInProgress)throw new Error('The old papers must be kept safe before beginning anew.');
    const serialized=create_save();if(!serialized)throw new Error('The old life could not be written down.');
    const prior=JSON.parse(serialized);
    if(prior.expansion?.chronicle?.life.endedAt==null)throw new Error('This life is still being lived.');
    prior.life_successor_requested=true;
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(prior));
    foundationSaveBlocked=true;
    window.location.reload();
}
if(pendingHeir) {
    document.getElementById('main_content').inert=true;
    await heirOwnershipReady;
    try {
        if(!ownsSave)throw new Error('Another traveler is holding these papers.');
        const serialized=create_save();if(!serialized)throw new Error('A fresh beginning could not be prepared.');
        const next=buildLifeHeirSave(pendingHeir,JSON.parse(serialized));
        validateSaveEnvelope(next,game_version);
        lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(next));
        foundationSaveBlocked=true;
        window.location.reload();
    } catch(error) {
        // The full staged predecessor remains intact. Never autosave the temporary fresh body.
        foundationSaveBlocked=true;
        document.getElementById('main_content').inert=true;
        play_button.hidden=true;
        const recovery=document.createElement('section');recovery.id='life_heir_recovery';
        const text=document.createElement('p');text.textContent='The old papers are safe. A new life could not begin yet.';
        const retry=document.createElement('button');retry.textContent='Try again';retry.onclick=()=>window.location.reload();
        const cancel=document.createElement('button');cancel.textContent='Return to the old life';cancel.onclick=()=>{if(!ownsSave){text.textContent='Another traveler is holding these papers. Close that page before returning to the old life.';return;}try{const prior=structuredClone(pendingHeir);delete prior.life_successor_requested;lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(prior));window.location.reload();}catch(e){text.textContent='The old papers are still here. There is no room to put them away.';}};
        const download=document.createElement('button');download.textContent='Export the old life';download.onclick=()=>{const prior=structuredClone(pendingHeir);delete prior.life_successor_requested;const a=document.createElement('a'),url=URL.createObjectURL(new Blob([encodeSaveFile(JSON.stringify(prior))],{type:'text/plain'}));a.href=url;a.download='YAIRPG-preserved-life.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
        recovery.append(text,retry,cancel,download);document.getElementById('loading_screen').append(recovery);
        console.error('Heir candidate could not commit:',error);
    }
}
`;
    return source;
}
