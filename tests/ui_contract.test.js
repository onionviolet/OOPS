import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {uiViolations,scanUiText} from './helpers/ui_contract.mjs';
test('UI changes introduce no unreviewed colors, fonts, radii, cssText or foreign-host insertion',()=>{
    const root=fileURLToPath(new URL('../',import.meta.url));
    const ledger=JSON.parse(readFileSync(new URL('./ui_contract_allowlist.json',import.meta.url),'utf8'));
    const allowed=new Map(ledger.entries.map(v=>[v.key,v.count]));
    const newHits=uiViolations(root).filter(v=>v.count>(allowed.get(v.key)||0));
    assert.deepEqual(newHits,[], 'Use UI tokens and a declared panel home. Shrink existing exceptions instead of granting a file-wide exemption.');
});
test('UI contract catches new literal styling and aliased/direct foreign panel insertion',()=>{
    for(const text of ['x.style.cssText="padding:4px";', '.x {border-radius:4px;font-family:Arial;color:#abcdef;background:rgb(0,0,0)}', "const host=document.getElementById('message_box_div');\nhost.prepend(panel);", "document.getElementById('another-panel').append(panel);"])
        assert(scanUiText(text).length>0,text);
    assert.deepEqual(scanUiText('.x { color:var(--ui-text); }'),[]);
});
