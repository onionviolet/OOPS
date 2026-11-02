#!/usr/bin/env node
// Private English overlays for the Chinese paragraph locator authority.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {shardIndex} from './cite_paragraphs.mjs';

export const DEFAULTS = Object.freeze({median: 3.47, low: 3.12, high: 3.87, gapPenalty: 4, maxGapShare: 0.01});
const charLength = s => Array.from(String(s ?? '')).length;
const sumLength = rows => rows.reduce((n, r) => n + charLength(r.text), 0);
const logRatioCost = (en, zh, median) => Math.abs(Math.log((en / zh) / median));

// Long paragraphs in an edition can contain many paragraphs from another.
// Consider endpoints near the expected cumulative length, without inventing
// paragraph boundaries or scanning every possible group at every DP cell.
function nearEnds(prefix, start, targetLength) {
    const minimum = start + 3, maximum = prefix.length - 1;
    if (minimum > maximum) return [];
    const target = prefix[start] + targetLength;
    let lo = minimum, hi = maximum + 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (prefix[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    const ends = new Set();
    for (let end = lo - 2; end <= lo + 1; end++) {
        if (end >= minimum && end <= maximum) ends.add(end);
    }
    // The measured book-wide ratio is a guide, not a cutoff. Include the end
    // and its neighbor so an unusually short or long chapter can still map all
    // of a long paragraph rather than leaving a small artificial tail.
    ends.add(maximum);
    if (maximum - 1 >= minimum) ends.add(maximum - 1);
    return [...ends].sort((a,b) => a-b);
}

export function alignChapter(chinese, english, options = {}) {
    const {median, low, high, gapPenalty, maxGapShare} = {...DEFAULTS, ...options};
    const n = chinese.length, m = english.length;
    const dp = Array.from({length: n + 1}, () => new Float64Array(m + 1).fill(Infinity));
    const prev = Array.from({length: n + 1}, () => Array(m + 1).fill(null));
    const prefix = rows => rows.reduce((a, r) => { a.push(a[a.length - 1] + charLength(r.text)); return a; }, [0]);
    const zhPrefix = prefix(chinese), enPrefix = prefix(english);
    dp[0][0] = 0;
    const moves = [[1,1,0],[1,2,.22],[2,1,.22],[1,0,gapPenalty],[0,1,gapPenalty]];
    for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
        if (!Number.isFinite(dp[i][j])) continue;
        const candidates = [...moves];
        if (i < n && j < m) {
            const zhLen = zhPrefix[i + 1] - zhPrefix[i], enLen = enPrefix[j + 1] - enPrefix[j];
            for (const end of nearEnds(enPrefix, j, zhLen * median)) candidates.push([1, end - j, .22 * (end - j - 1)]);
            for (const end of nearEnds(zhPrefix, i, enLen / median)) candidates.push([end - i, 1, .22 * (end - i - 1)]);
        }
        for (const [di,dj,penalty] of candidates) {
            if (i + di > n || j + dj > m) continue;
            const zhLen = zhPrefix[i + di] - zhPrefix[i];
            const enLen = enPrefix[j + dj] - enPrefix[j];
            const cost = penalty + (di && dj ? logRatioCost(enLen, zhLen, median) : 0);
            if (dp[i + di][j + dj] > dp[i][j] + cost) {
                dp[i + di][j + dj] = dp[i][j] + cost;
                prev[i + di][j + dj] = {i, j, di, dj};
            }
        }
    }
    const path = [];
    let i = n, j = m;
    while (i || j) {
        const p = prev[i][j];
        if (!p) throw new Error(`alignment path unavailable at ${i},${j}`);
        path.push({zh: chinese.slice(p.i, p.i + p.di), en: english.slice(p.j, p.j + p.dj)});
        i = p.i; j = p.j;
    }
    path.reverse();
    const pairs = path.filter(x => x.zh.length && x.en.length);
    const oneToOne = pairs.filter(x => x.zh.length === 1 && x.en.length === 1).length;
    const outliers = pairs.filter(x => {
        const ratio = sumLength(x.en) / sumLength(x.zh);
        return ratio < low || ratio > high;
    }).length;
    const totalZh = sumLength(chinese), totalEn = sumLength(english);
    const chapterRatio = totalZh ? totalEn / totalZh : null;
    const outlierShare = pairs.length ? outliers / pairs.length : 0;
    const gaps = path.filter(x => !x.zh.length || !x.en.length).reduce((n,x) => n + x.zh.length + x.en.length, 0);
    const gapShare = Math.max(n, m) ? gaps / Math.max(n, m) : 0;
    const lowScore = chapterRatio === null || chapterRatio < low || chapterRatio > high || gapShare > maxGapShare;
    return {path, score: {oneToOneShare: path.length ? oneToOne / path.length : 0,
        lengthBandOutliers: outliers, mappedGroups: pairs.length, outlierShare, gapParagraphs: gaps, gapShare,
        englishPerChineseChar: chapterRatio, floor: {englishPerChineseChar: [low, high], maxGapShare}, lowScore}, lowScore};
}

export function chooseEdition(chapters, preference = ['official','oldtl','original']) {
    for (const edition of preference) if (chapters[edition]) return {edition, chapter: chapters[edition]};
    return {edition: null, chapter: null};
}

export function overlayChapter(chapter, aligned) {
    const paragraphs = {};
    const unanchored = [];
    if (aligned.lowScore) {
        for (const row of chapter.chinese) paragraphs[row.id] = {status: 'chapter-only', english: []};
        return {paragraphs, unanchored, status: 'chapter-only'};
    }
    for (const group of aligned.path) {
        const g = {zh: group.zh.map(x => x.id), en: group.en.map(x => ({edition: chapter.edition, p: x.p}))};
        if (!group.zh.length) unanchored.push(g);
        else for (const zh of group.zh) paragraphs[zh.id] = {status: 'aligned', group: g};
    }
    return {paragraphs, unanchored, status: 'aligned'};
}

function readEdition(path) {
    const lines = readFileSync(path, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
    const header = lines.shift();
    const chapters = new Map();
    for (const row of lines) {
        const key = `${row.volume}:${row.chapter}`;
        if (!chapters.has(key)) chapters.set(key, []);
        chapters.get(key).push(row);
    }
    return {header, chapters};
}

function main() {
    const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
    const privateDir = join(root, 'docs/research/novels/lord-of-mysteries/private');
    const inputDir = join(privateDir, 'editions-2026-10-30');
    const outDir = inputDir;
    const official = readEdition(join(inputDir, 'lotm-official.jsonl'));
    const oldtl = readEdition(join(inputDir, 'lotm-oldtl.jsonl'));
    const original = new Map();
    const shards = shardIndex(join(privateDir, 'lead-run-2026-10-27'));
    for (const [key, text] of shards) {
        const [book, ch, p] = key.split(':').map(Number);
        const volume = book === 0 ? 1 : book;
        const k = `${volume}:${ch}`;
        if (!original.has(k)) original.set(k, []);
        original.get(k).push({id: `${volume}:${ch}:${p}`, p, text});
    }
    for (const rows of original.values()) rows.sort((a,b) => a.p-b.p);
    const chapters = [], overlay = {schema: 'edition-overlay/1', authority: 'Chinese shard paragraph ids', preference: ['official','oldtl','original'], chapters: []};
    const volCounts = {};
    const officialMainKeys = [...official.chapters.keys()].filter(k => /^[1-8]:\d+$/.test(k));
    const expectedKeys = new Set([...original.keys(), ...officialMainKeys]);
    for (const key of [...expectedKeys].sort((a,b) => {
        const [av,ac] = a.split(':').map(Number), [bv,bc] = b.split(':').map(Number);
        return av-bv || ac-bc;
    })) {
        const [volume, chapter] = key.split(':').map(Number);
        const chinese = original.get(key) || [];
        const candidates = {
            official: official.chapters.get(key),
            oldtl: oldtl.chapters.get(key),
            original: chinese.map(x => ({...x, edition: 'original'})),
        };
        const selected = chooseEdition(candidates);
        const english = selected.edition === 'original' ? [] : selected.chapter;
        const aligned = alignChapter(chinese, english);
        const chapterOverlay = overlayChapter({chinese, edition: selected.edition}, aligned);
        const chapterRecord = {volume, chapter, edition: selected.edition, chineseParagraphs: chinese.length,
            englishParagraphs: english.length, score: aligned.score};
        chapters.push(chapterRecord);
        overlay.chapters.push({volume, chapter, edition: selected.edition, paragraphs: chapterOverlay.paragraphs,
            unanchored: chapterOverlay.unanchored, status: !chinese.length ? 'chinese-missing' : chapterOverlay.status});
        const counts = volCounts[volume] ||= {aligned: 0, lowScore: 0, missing: 0};
        if (!chinese.length) counts.missing++;
        else if (aligned.lowScore) counts.lowScore++;
        else counts.aligned++;
    }
    const scoreDoc = {schema: 'edition-alignment-scores/1', parameters: DEFAULTS,
        measuredEnglishChapterCounts: [1,2,3,4,5,6,7,8].map(v => ({volume:v, chapters: [...official.chapters.keys()].filter(k => k.startsWith(`${v}:`)).length})),
        chineseShardChapterCounts: Object.fromEntries(Object.entries(volCounts).map(([v,c])=>[v,c.aligned+c.lowScore+c.missing])),
        byVolume: volCounts, chapters};
    writeFileSync(join(outDir, 'lotm-overlay.json'), JSON.stringify(overlay));
    writeFileSync(join(outDir, 'chapter_scores.json'), JSON.stringify(scoreDoc, null, 2) + '\n');
    console.log(JSON.stringify({chapters: chapters.length, byVolume: volCounts, missing: chapters.filter(c=>c.edition === null).length,
        lowScore: chapters.filter(c=>c.score.lowScore).length}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
