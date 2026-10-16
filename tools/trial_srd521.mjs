#!/usr/bin/env node
// Reproduce the bounded 20-block import trial without touching accepted data.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {draftSpell} from './import_srd521.mjs';
export async function runTrial(blockDirectory,canonicalTextFile) {
    const [canonical,spellsText]=await Promise.all([readFile(canonicalTextFile),readFile(new URL('../src/data/srd521/spells.json',import.meta.url),'utf8')]);
    const textSha256=createHash('sha256').update(canonical).digest('hex');
    const spells=JSON.parse(spellsText), rows=[];
    for(const reviewed of spells) {
        if(reviewed.source.textSha256!==textSha256)throw Error('Canonical source hash differs from pilot source.');
        const file=reviewed.id.split('.').at(-1)+'.txt';
        const {draft,validation}=draftSpell(await readFile(join(blockDirectory,file),'utf8'),{page:reviewed.source.page,textSha256});
        const correctedFields=['spell','effects','function'].filter(k=>JSON.stringify(draft[k])!==JSON.stringify(reviewed[k]));
        rows.push({id:reviewed.id,validDraft:validation.valid,errors:validation.errors,correctedFields,requiresReviewLaneFix:!validation.valid||correctedFields.length>0});
    }
    return {canonicalTextSha256:textSha256,total:rows.length,schemaValid:rows.filter(r=>r.validDraft).length,
        schemaInvalid:rows.filter(r=>!r.validDraft).length,requiresReviewLaneFix:rows.filter(r=>r.requiresReviewLaneFix).length,
        humanFixesObserved:0,humanApprovalObserved:false,rows};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
    if(process.argv.length!==4) { process.stderr.write('Usage: node tools/trial_srd521.mjs BLOCK_DIRECTORY CANONICAL_TEXT_FILE\n');process.exitCode=1; }
    else runTrial(...process.argv.slice(2)).then(r=>process.stdout.write(JSON.stringify(r,null,2)+'\n')).catch(e=>{process.stderr.write(e.message+'\n');process.exitCode=1;});
}
