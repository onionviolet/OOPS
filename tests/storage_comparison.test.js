import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {mountStorageComparison} from '../src/storage_comparison.js';

test('paired stock commands follow exact keys through same-name variants and removed stock',()=>{
    const dom=createDom();dom.loadHTML('<html><body><section id="view"></section><div id="held"></div><div id="chest"></div></body></html>');
    const doc=dom.document, held=doc.getElementById('held'), chest=doc.getElementById('chest'), calls=[];
    const add=(parent,key,attribute)=>{const row=doc.createElement('div');row.setAttribute(attribute,key);row.dataset.item_count='2';row.innerHTML='<span class="inventory_item_name"><span class="item_name">Same name</span></span>';row.onclick=()=>calls.push(key);parent.append(row);return row;};
    add(held,'variant-A','data-character_item');const b=add(held,'variant-B','data-character_item');add(chest,'variant-B','data-storage_item');
    const host=doc.getElementById('view'),view=mountStorageComparison({host,carried:held,chest});
    const picker=host.querySelector('select');picker.value='variant-B';picker.dispatchEvent(new dom.classes.Event('change'));
    host.querySelector('[data-storage-compare="deposit"]').click();assert.deepEqual(calls,['variant-B']);
    b.remove();view.render();assert.equal(host.querySelector('[data-storage-compare="deposit"]').disabled,true);
    host.querySelector('[data-storage-compare="withdraw"]').click();assert.deepEqual(calls,['variant-B','variant-B']);
    assert.match(host.querySelector('[data-storage-comparison]').textContent,/Carried: 0 · In this chest: 2/);
});
