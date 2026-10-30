import test from 'node:test';
import assert from 'node:assert/strict';
import {LOTM_RITE_ROWS, LOTM_RITE_FACTS, LOTM_RITE_GAPS} from '../src/lotm_rite_rows.js';

const {rows} = LOTM_RITE_ROWS;
const locator = /^zh (b\d )?第\d+章 p\d+$/;
const families = new Set(['sacrifice', 'confession', 'purification', 'dream_entry', 'summons', 'questioning', 'search', 'entry', 'blessing', 'offering', 'contact', 'contract', 'concealment']);
const kinds = new Set(['prepare', 'rite', 'call', 'response', 'attempt', 'interpret', 'use', 'outcome']);
const branches = new Set(['success', 'failure', 'partial', 'unknown']);

test('rite rows have distinct namespaced identities and locators matching their volume', () => {
    assert.equal(LOTM_RITE_ROWS.schema, 1);
    assert.ok(rows.length > 0);
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
    for (const row of rows) {
        assert.match(row.id, /^lotm\.rite\.[a-z0-9-]+$/);
        assert.ok(Number.isInteger(row.volume) && row.volume >= 2);
        assert.ok(row.sourceIds.length);
        assert.ok(families.has(row.family));
        assert.ok(row.locators.length);
        for (const ref of row.locators) {
            assert.match(ref, locator);
            assert.ok(ref.startsWith(`zh b${row.volume} `), ref);
        }
    }
});

test('volume-3 groups retain source identities without duplicate procedure occurrences', () => {
    const later = rows.filter(row => row.volume === 3);
    assert.ok(later.length);
    const seen = new Set();
    for (const row of later) {
        assert.equal(new Set(row.locators).size, row.locators.length, row.id);
        for (const id of row.sourceIds) {
            assert.match(id, /^lotm\.[a-z]+\.[a-z0-9-]+$/);
            assert.ok(!seen.has(id), `source procedure occurs in multiple groups: ${id}`);
            seen.add(id);
        }
        assert.ok(row.steps.every(step => step.minutes === null));
    }
    const self = later.find(row => row.sourceIds.includes('lotm.rite.self-summon-grey-fog'));
    assert.ok(self.sourceIds.includes('lotm.rule.self-summon-ritual'));
    const messenger = later.find(row => row.sourceIds.includes('lotm.rite.summon-messenger'));
    assert.ok(messenger.sourceIds.includes('lotm.rite.harmonica-summon-messenger-lady'));
    assert.ok(!seen.has('lotm.rite.deep-red-star-link'));
    assert.ok(!seen.has('lotm.rule.harmonica-messenger-binding'));
});

test('reported instruction and partial cleansing do not become demonstrated grants', () => {
    for (const source of ['lotm.rule.messenger-contract', 'lotm.rite.purifying-cannon-recharge', 'lotm.rite.fertility-necklace-contamination']) {
        const row = rows.find(row => row.sourceIds.includes(source));
        assert.equal(row.evidence.outcomes, 'T');
        assert.ok(row.outcomes.every(result => result.when === 'unknown'));
    }
    const cleansing = rows.find(row => row.sourceIds.includes('lotm.rite.four-step-cleansing'));
    assert.ok(cleansing.outcomes.every(result => result.when === 'partial'));
    assert.match(cleansing.outcomes[0].stated, /physical.*remain/i);
    for (const id of ['volume-3-deep-red-star-link', 'volume-3-harmonica-manufacture']) {
        assert.ok(LOTM_RITE_GAPS.some(gap => gap.id === id));
    }
});

test('each rite has performers, ordered steps and explicit source outcome branches', () => {
    for (const row of rows) {
        assert.ok(row.performers.length, row.id);
        for (const performer of row.performers) {
            for (const field of ['role', 'ref', 'note']) assert.ok(performer[field]?.trim(), `${row.id}: ${field}`);
        }
        assert.ok(row.steps.length, row.id);
        assert.equal(new Set(row.steps.map(step => step.id)).size, row.steps.length);
        for (const step of row.steps) {
            assert.ok(kinds.has(step.kind), `${row.id}: ${step.kind}`);
            assert.ok(step.text.trim());
            assert.ok(step.minutes === null || (Number.isFinite(step.minutes) && step.minutes >= 0));
        }
        // Check every applicable pair, including late preparation accidentally placed after a response.
        const phase = {prepare: 0, rite: 1, call: 1, response: 2, outcome: 2};
        const ordered = row.steps.filter(step => step.kind in phase);
        for (let i = 1; i < ordered.length; i++) {
            assert.ok(phase[ordered[i - 1].kind] <= phase[ordered[i].kind], row.id);
        }
        assert.ok(row.outcomes.length, row.id);
        for (const result of row.outcomes) {
            assert.ok(branches.has(result.when));
            assert.ok(result.stated.trim());
            assert.ok(result.perceived.trim());
        }
    }
});

test('eligibility uses declared host facts rather than implicit grants', () => {
    assert.equal(new Set(LOTM_RITE_FACTS).size, LOTM_RITE_FACTS.length);
    const used = new Set();
    for (const row of rows) {
        assert.ok(Array.isArray(row.eligibility.all));
        for (const predicate of row.eligibility.all) {
            assert.match(predicate.fact, /^actor\.lotm\.rite\.[a-z0-9.-]+$/);
            assert.ok(LOTM_RITE_FACTS.includes(predicate.fact));
            assert.equal(predicate.op, 'eq');
            assert.equal(typeof predicate.value, 'boolean');
            assert.ok(predicate.reason.trim());
            used.add(predicate.fact);
        }
    }
    assert.deepEqual([...used].sort(), [...LOTM_RITE_FACTS].sort());
});

test('Chinese text appears inside literal locators and nowhere else in exported data', () => {
    const walk = value => {
        if (typeof value === 'string' && /\p{Script=Han}/u.test(value)) assert.match(value, locator);
        else if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === 'object') {
            for (const [key, child] of Object.entries(value)) {
                assert.doesNotMatch(key, /\p{Script=Han}/u);
                walk(child);
            }
        }
    };
    [LOTM_RITE_ROWS, LOTM_RITE_FACTS, LOTM_RITE_GAPS].forEach(walk);
});

test('rites declare owner-needed effects, field evidence and nonabsolute descriptions', () => {
    for (const row of rows) {
        assert.ok(row.effects.length);
        for (const effect of row.effects) {
            assert.equal(effect.type, 'owner-needed');
            assert.ok(effect.owner.trim());
            assert.ok(effect.value.trim());
        }
        for (const field of ['description', 'performers', 'eligibility', 'scale', 'steps', 'outcomes', 'costs', 'limits', 'consequences', 'effects', 'proposals']) {
            assert.ok(['S', 'T', 'I'].includes(row.evidence[field]), `${row.id}: ${field}`);
        }
        for (const tag of Object.values(row.evidence)) assert.ok(['S', 'T', 'I'].includes(tag));
        assert.doesNotMatch([row.description, ...row.limits].join(' '), /\b(never|always|only)\b/i);
        assert.ok(row.proposals.length);
    }
});

test('source corrections retain cost precision and keep reported readings apart from truth', () => {
    const contact = rows.find(row => row.id === 'lotm.rite.spirit-call');
    assert.match(contact.costs.join(' '), /more than two-thirds/i);
    const reported = rows.find(row => row.id === 'lotm.rite.remains-divination');
    assert.equal(reported.evidence.steps, 'T');
    assert.equal(reported.evidence.outcomes, 'T');
    assert.ok(reported.effects.some(effect => effect.owner === 'divination-belief'));
    const lesson = rows.find(row => row.id === 'lotm.rite.sacrifice-ritual');
    assert.equal(lesson.evidence.steps, 'T');
    assert.ok(lesson.outcomes.every(result => result.when === 'unknown'));
    const sun = rows.find(row => row.id === 'lotm.rite.sun-purification');
    assert.ok(sun.sourceIds.includes('lotm.rite.eternal-sun-purification'));
    assert.ok(sun.outcomes.every(result => result.when === 'partial'));
    assert.doesNotMatch(JSON.stringify(sun.steps), /two candles|sun emblem/i);
});

test('gaps disclose unread citation count without unread identities', () => {
    const unread = LOTM_RITE_GAPS.find(gap => gap.id === 'volume-2-unread');
    assert.ok(unread);
    assert.match(unread.reason, /\b3 citations\b/);
    assert.doesNotMatch(unread.reason, /lotm\.|第|ch\d|chapter-?\d|p\d/);
    for (const gap of LOTM_RITE_GAPS) {
        assert.ok(gap.id.trim());
        assert.ok(gap.reason.trim());
    }
});
