import test from 'node:test';
import assert from 'node:assert/strict';
import {validateFigureSpec, figureText} from '../src/ui/figure.js';
import {FIGURE_FIXTURES_BENEFITS} from '../src/ui/preview/fixtures/benefits.js';

const byId = Object.fromEntries(FIGURE_FIXTURES_BENEFITS.map(f => [f.id, f]));

test('benefits fixtures validate and carry unique ids', () => {
    assert.equal(FIGURE_FIXTURES_BENEFITS.length, 3);
    assert.equal(new Set(FIGURE_FIXTURES_BENEFITS.map(f => f.id)).size, 3);
    for (const f of FIGURE_FIXTURES_BENEFITS) { validateFigureSpec(f); assert.ok(figureText(f).includes(f.title)); }
});

test('statement reads as lines with a leaving case', () => {
    const text = figureText(byId['benefits-statement-company']);
    assert.match(text, /Base pay/); assert.match(text, /Advance against pay/); assert.match(text, /If you desert: arrears are forfeit/);
});

test('membership card marks revoked access and the skill that survives it', () => {
    const text = figureText(byId['benefits-card-academy']);
    assert.match(text, /Housing key[^\n]*broken/); assert.match(text, /Kept: the Fire Lens technique/);
});

test('counterparty ledger names both directions and the overdue account', () => {
    const text = figureText(byId['benefits-counterparties']);
    assert.match(text, /owes/); assert.match(text, /owed/); assert.match(text, /8 silver, overdue/);
});
