// M1: union schema 1.4 people fields with pre-1.4 backups and first/second census reads.
// Input is copied to --out; source folders are never modified.
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const readJsonl = path => existsSync(path) ? readFileSync(path, 'utf8').split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line)) : [];
const writeJsonl = (path, rows) => writeFileSync(path, rows.map(row => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
function copyInputTree(input, out, relativePath = '') {
    const sourceDir = join(input, relativePath), outputDir = join(out, relativePath);
    mkdirSync(outputDir, {recursive: true});
    for (const entry of readdirSync(sourceDir, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))) {
        const child = join(relativePath, entry.name), source = join(input, child), target = join(out, child);
        if (source === out || out.startsWith(`${source}/`)) continue;
        if (entry.isDirectory()) copyInputTree(input, out, child);
        else if (entry.isFile()) copyFileSync(source, target);
    }
}

function normalizeName(value) {
    return String(value || '').normalize('NFKC').toLowerCase().trim()
        .replace(/^(?:mr|mrs|ms|miss|dr|prof|sir|madam|lord|lady|reverend|rev)\.?\s+/i, '')
        .replace(/[\p{P}\p{S}\s]+/gu, '');
}

function unionPeople(currentRows, previousRows) {
    const ids = [...new Set([...currentRows, ...previousRows].map(row => String(row.id || '')).filter(Boolean))].sort();
    const output = [];
    for (const id of ids) {
        const current = currentRows.filter(row => String(row.id || '') === id);
        const previous = previousRows.filter(row => String(row.id || '') === id);
        if (!current.length) {
            const row = {...previous[0], _from: {}};
            for (const old of previous.slice(1)) for (const [field, value] of Object.entries(old)) {
                if (field === 'id' || field === 'label' || field === 'locator') continue;
                if (Array.isArray(value)) row[field] = [...(row[field] || []), ...value];
                else if (row[field] === undefined) row[field] = value;
            }
            for (const field of Object.keys(row)) if (!['id', 'label', 'locator', '_from'].includes(field)) row._from[field] = '1.3';
            output.push(row);
            continue;
        }
        const row = {...current[0], _from: {}};
        const fields = [...new Set([...current, ...previous].flatMap(source => Object.keys(source).filter(key => !['id', 'label', 'locator', '_from'].includes(key))))].sort();
        for (const field of fields) {
            const newerValues = current.flatMap(source => Array.isArray(source[field]) ? source[field] : []);
            const olderValues = previous.flatMap(source => Array.isArray(source[field]) ? source[field] : []);
            if (newerValues.length || olderValues.length) {
                const merged = [];
                const grouped = values => {
                    const map = new Map();
                    for (const value of values) {
                        const key = value?.locator ? `loc:${value.locator}` : `value:${JSON.stringify(value)}`;
                        if (!map.has(key)) map.set(key, []);
                        map.get(key).push(value);
                    }
                    return map;
                };
                const currentByKey = grouped(newerValues), previousByKey = grouped(olderValues);
                for (const [key, newValues] of currentByKey) {
                    const oldValues = previousByKey.get(key) || [];
                    for (let index = 0; index < newValues.length; index++) {
                        const newer = newValues[index], older = oldValues[index];
                        const slot = newer.locator || key;
                        if (!older) {
                            merged.push(newer);
                            for (const nested of Object.keys(newer)) row._from[`${field}[${slot}].${nested}`] = '1.4';
                            continue;
                        }
                        const combined = {...older, ...newer};
                        for (const nested of Object.keys(newer)) row._from[`${field}[${slot}].${nested}`] = '1.4';
                        for (const nested of Object.keys(older)) if (newer[nested] === undefined || newer[nested] === null || newer[nested] === '') {
                            combined[nested] = older[nested];
                            row._from[`${field}[${slot}].${nested}`] = '1.3';
                        }
                        merged.push(combined);
                    }
                }
                for (const [key, oldValues] of previousByKey) {
                    const newCount = currentByKey.get(key)?.length || 0;
                    const remaining = newCount ? oldValues.slice(newCount) : oldValues;
                    merged.push(...remaining);
                    for (const value of remaining) for (const nested of Object.keys(value)) row._from[`${field}[${value.locator || key}].${nested}`] = '1.3';
                }
                row[field] = merged;
                row._from[field] = newerValues.length && olderValues.length ? 'mixed' : newerValues.length ? '1.4' : '1.3';
            } else {
                const newer = current.find(source => source[field] !== undefined && source[field] !== null && source[field] !== '');
                const older = previous.find(source => source[field] !== undefined && source[field] !== null && source[field] !== '');
                const chosen = newer || older;
                if (chosen) { row[field] = chosen[field]; row._from[field] = newer ? '1.4' : '1.3'; }
            }
        }
        output.push(row);
    }
    return {rows: output};
}

function mergeCensus(first, second) {
    const namesOf = row => [...new Set([row.zh, ...(Array.isArray(row.aliases) ? row.aliases : [])].map(normalizeName).filter(Boolean))];
    const asEntity = (row, version) => ({...row, aliases: [...new Set([...(row.aliases || []), row.zh, row.label].filter(Boolean))], _sources: [{version, locator: row.firstMention || null}], _names: new Set(namesOf(row)), _version: version});
    const entities = first.map(row => asEntity(row, 'x1'));
    let ambiguous = 0;
    for (const row of second) {
        const names = namesOf(row);
        const exact = entities.filter(entity => entity._version === 'x1' && normalizeName(entity.zh) === normalizeName(row.zh));
        let matches = exact.length ? exact : entities.filter(entity => entity._version === 'x1' && names.some(name => entity._names.has(name)));
        if (matches.length > 1) {
            const idMatch = matches.filter(entity => entity.id === row.id);
            matches = idMatch.length === 1 ? idMatch : [];
            if (!matches.length) ambiguous++;
        }
        let entity = matches[0];
        if (!entity) { entities.push(asEntity(row, 'x2')); continue; }
        for (const alias of [...(row.aliases || []), row.zh, row.label].filter(Boolean)) if (!entity.aliases.includes(alias)) entity.aliases.push(alias);
        for (const name of names) entity._names.add(name);
        if (!entity._sources.some(source => source.version === 'x2' && source.locator === (row.firstMention || null))) entity._sources.push({version: 'x2', locator: row.firstMention || null});
        for (const [field, value] of Object.entries(row)) if ((entity[field] === undefined || entity[field] === null || entity[field] === '') && value !== undefined && value !== null && value !== '' && !['aliases', '_sources'].includes(field)) entity[field] = value;
    }
    const rows = entities.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')) || String(a.zh || '').localeCompare(String(b.zh || '')))
        .map(({_names, _version, ...row}) => ({...row, aliases: row.aliases.sort((a, b) => String(a).localeCompare(String(b))), _sources: row._sources.sort((a, b) => a.version.localeCompare(b.version) || String(a.locator).localeCompare(String(b.locator)))}));
    return {rows, ambiguous};
}

export function run(inputArg, outArg, matchText = null) {
    const input = resolve(inputArg), out = resolve(outArg);
    const match = matchText ? new RegExp(matchText) : null;
    if (!existsSync(input)) throw new Error(`Source directory does not exist: ${input}`);
    if (out === input) throw new Error('--out must not be the source directory');
    mkdirSync(out, {recursive: true});
    copyInputTree(input, out);
    const peopleReport = [], missingBackups = [];
    const rootFiles = readdirSync(input).filter(file => /_people\.jsonl$/.test(file) && (!match || match.test(`${file.replace(/_people\.jsonl$/, '')}m`))).sort();
    for (const file of rootFiles) {
        const backupPath = ['pre-sv14', 'pre-sv8'].map(dir => join(input, dir, file)).find(existsSync);
        if (!backupPath) { missingBackups.push(file); continue; }
        const current = readJsonl(join(input, file)), previous = readJsonl(backupPath);
        const merged = unionPeople(current, previous);
        writeJsonl(join(out, file), merged.rows);
        peopleReport.push({file, backup: relative(input, backupPath), rows14: current.length, rows13: previous.length, rowsUnion: merged.rows.length});
    }
    const censusPairs = [];
    for (const file of readdirSync(input).filter(name => /x2m_census\.jsonl$/.test(name)).sort()) {
        const prefix = file.replace(/x2m_census\.jsonl$/, 'm');
        const firstFile = `${prefix}_census.jsonl`;
        const first = readJsonl(join(input, firstFile)), second = readJsonl(join(input, file));
        const merged = mergeCensus(first, second);
        writeJsonl(join(out, firstFile), merged.rows);
        censusPairs.push({firstFile, secondFile: file, x1: first.length, x2: second.length, union: merged.rows.length, ambiguous: merged.ambiguous});
    }
    const report = {schema: 'schema-union/1.0', input, output: out, people: peopleReport, missingBackups, census: censusPairs};
    writeFileSync(join(out, 'schema_union_report.json'), `${JSON.stringify(report, null, 2)}\n`);
    return report;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        const args = process.argv.slice(2), input = args[0], out = args[args.indexOf('--out') + 1], matchAt = args.indexOf('--match');
        if (!input || !out) throw new Error('usage: schema_union.mjs <privateInputDir> --out <separateDir>');
        const report = run(input, out, matchAt < 0 ? null : args[matchAt + 1]);
        console.log(`schema union complete: peopleFiles=${report.people.length}; missingBackups=${report.missingBackups.length}; censusPairs=${report.census.length}`);
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}
