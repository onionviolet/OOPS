#!/usr/bin/env node
// Offline compiler only. The browser imports the runtime and this compiled asset.
import { createHash } from 'node:crypto';
import { readFile, mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

export const INK_COMPILER_PIN = Object.freeze({
    name: 'inkjs',
    version: '2.4.0',
    storyFormat: 21,
    saveFormat: 10,
    storyId: 'feature-wave-negotiation',
    storyRevision: 3,
    sceneIds: ['tidemark.negotiation', 'relay.office', 'nested.hub', 'nested.offer', 'nested.mission', 'nested.return'],
    metadataVersion: 1,
    integrity: 'sha512-EoPCYESIbMtfI8SqEDZCJwn+A5is0QozMLw250iic1ReJCgZpRKIezWj0VqgRUzAx0f3MmEbsUjY/ILe2815JQ==',
});

// npm's lock integrity pins the whole tarball; these checks catch local drift
// in the compiler and format owners before emitting a changed story identity.
const pinnedFiles = Object.freeze({
    'compiler/Compiler.js': '3c6a6db4f87c5c3ce46b723e75f94bd418353e2861cdf97a99cbb5eddb435953',
    'engine/Story.js': 'c85bf7665705f11bb2add0b983cfd2012834285952886ea17d061e47c42b0ad4',
    'engine/StoryState.js': '0e3e7577aa524788ed57d1d8d90d522f1cc5e1223e1f3ffbaffac6153e5abdb2',
    'dist/ink.mjs': 'e5f3579deb59aa2958660c334f900f8e7fe8939551fe8488fae8d77c00274d69',
});

function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    }
    return value;
}

function canonicalJson(value) {
    return JSON.stringify(canonical(value));
}

async function findPackageRoot(requestedRoot) {
    if (requestedRoot) {
        const candidate = resolve(requestedRoot);
        try {
            const manifest = JSON.parse(await readFile(join(candidate, 'package.json'), 'utf8'));
            if (manifest.name === INK_COMPILER_PIN.name) return candidate;
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        return join(candidate, 'node_modules', INK_COMPILER_PIN.name);
    }
    let candidate;
    try {
        candidate = dirname(require.resolve('inkjs'));
    } catch {
        throw new Error('Install exact inkjs@2.4.0 in the project, or pass --package-root /path/to/inkjs.');
    }
    for (;;) {
        try {
            const manifest = JSON.parse(await readFile(join(candidate, 'package.json'), 'utf8'));
            if (manifest.name === INK_COMPILER_PIN.name) return candidate;
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        const parent = dirname(candidate);
        if (parent === candidate) throw new Error('Cannot locate the resolved inkjs package manifest.');
        candidate = parent;
    }
}

export async function verifyInkCompilerPackage(requestedRoot) {
    const packageRoot = await findPackageRoot(requestedRoot);
    const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
    if (manifest.name !== INK_COMPILER_PIN.name || manifest.version !== INK_COMPILER_PIN.version) {
        throw new Error(`Expected inkjs@${INK_COMPILER_PIN.version}; found ${manifest.name}@${manifest.version}.`);
    }
    for (const [path, expectedHash] of Object.entries(pinnedFiles)) {
        const actualHash = sha256(await readFile(join(packageRoot, path)));
        if (actualHash !== expectedHash) {
            throw new Error(`Pinned inkjs@${INK_COMPILER_PIN.version} file changed: ${path}. Reinstall from the pinned lock.`);
        }
    }
    const compiler = await import(pathToFileURL(join(packageRoot, 'compiler', 'Compiler.js')).href);
    if (compiler.Story.inkVersionCurrent !== INK_COMPILER_PIN.storyFormat) {
        throw new Error('The compiler story format differs from the host format pin.');
    }
    return { packageRoot, compiler };
}

// Returns a candidate artifact without writing or continuing the story.
// The caller owns any write window for stories/feature_wave.json.
export async function compileFeatureInk({
    packageRoot = process.env.INKJS_PACKAGE_ROOT,
    sourcePath = join(projectRoot, 'stories', 'feature_wave.ink'),
} = {}) {
    const { compiler } = await verifyInkCompilerPackage(packageRoot);
    const source = (await readFile(resolve(sourcePath), 'utf8'))
        .replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    if (/^\s*EXTERNAL\s+|\b(?:RANDOM|SEED_RANDOM|LIST_RANDOM)\s*\(/m.test(source)) {
        throw new Error('Feature-wave Ink has no host callbacks or independent random operations.');
    }
    if (/^\s*INCLUDE\s+/m.test(source)) {
        throw new Error('Feature-wave compilation uses one source file. INCLUDE requires a new deterministic input recipe.');
    }
    const diagnostics = [];
    const sourceFilename = 'stories/feature_wave.ink';
    const options = new compiler.CompilerOptions(
        sourceFilename, [], false,
        (message, severity) => diagnostics.push({ message, severity }),
        new compiler.JsonFileHandler({ [sourceFilename]: source }),
    );
    const instance = new compiler.Compiler(source, options);
    let story;
    try {
        story = instance.Compile();
    } catch (error) {
        const detail = diagnostics.map(item => item.message).join('\n');
        throw new Error(detail || error.message);
    }
    if (diagnostics.length || instance.errors.length || instance.warnings.length || instance.authorMessages.length) {
        throw new Error(`Ink compilation requires zero diagnostics:\n${diagnostics.map(item => item.message).join('\n')}`);
    }
    const compiled = JSON.parse(story.ToJson());
    if (compiled.inkVersion !== INK_COMPILER_PIN.storyFormat || !Array.isArray(compiled.root)) {
        throw new Error('Compiler output does not match the required standard Ink JSON format.');
    }
    // Inspect generated choice evaluation strings, without Continue/selection.
    // A tag on chosen output cannot bind an offered choice to a host command.
    const responseIds = new Set();
    const allowedResponses = new Set(['ask_terms', 'material', 'coin', 'borrow_tool', 'return_tool', 'use_tool', 'teach', 'refuse', 'leave', 'relay_terms', 'relay_honest', 'relay_alias', 'relay_credential', 'relay_registry', 'relay_personal', 'relay_office', 'relay_work', 'relay_correction', 'relay_refuse', 'relay_leave', 'nested_hub_terms', 'nested_hub_work', 'nested_hub_train', 'nested_hub_refit', 'nested_hub_role', 'nested_hub_leave', 'nested_offer_terms', 'nested_offer_accept', 'nested_offer_cooperate', 'nested_offer_decline', 'nested_offer_leave', 'nested_local_report', 'nested_local_objective', 'nested_local_support', 'nested_local_extend', 'nested_local_withdraw', 'nested_local_extract', 'nested_local_recover', 'nested_local_refuse', 'nested_local_leave', 'nested_return_report', 'nested_return_settle', 'nested_return_dispute', 'nested_return_refit', 'nested_return_revisit', 'nested_return_stay', 'nested_return_leave']);
    function checkChoiceTags(value) {
        if (Array.isArray(value)) {
            let segment = [];
            for (const instruction of value) {
                if (instruction && typeof instruction === 'object' && !Array.isArray(instruction) && Object.hasOwn(instruction, '*')) {
                    const tags = segment.filter(item => typeof item === 'string' && item.startsWith('^response:'));
                    const id = tags[0]?.slice('^response:'.length).trim();
                    if (tags.length !== 1 || !segment.includes('#') || !segment.includes('/#') || !allowedResponses.has(id) || responseIds.has(id)) {
                        throw new Error('Each offered Ink choice needs its unique stable response tag inside the choice-only string.');
                    }
                    responseIds.add(id);
                    segment = [];
                } else segment.push(instruction);
                checkChoiceTags(instruction);
            }
        } else if (value && typeof value === 'object') {
            Object.values(value).forEach(checkChoiceTags);
        }
    }
    checkChoiceTags(compiled.root);
    if (responseIds.size !== allowedResponses.size) throw new Error('Compiled scene is missing one of its admitted host responses.');
    const sourceSha256 = sha256(source);
    const compiledSha256 = sha256(canonicalJson(compiled));
    const identity = {
        schemaVersion: INK_COMPILER_PIN.metadataVersion,
        storyId: INK_COMPILER_PIN.storyId,
        storyRevision: INK_COMPILER_PIN.storyRevision,
        sceneIds: [...INK_COMPILER_PIN.sceneIds],
        compilerPackage: INK_COMPILER_PIN.name,
        compilerVersion: INK_COMPILER_PIN.version,
        sourceSha256,
        compiledSha256,
    };
    const metadata = { ...identity, contentHash: `sha256:${sha256(canonicalJson(identity))}` };
    const artifact = { ...canonical(compiled), yairpgInk: metadata };
    const bytes = `${JSON.stringify(artifact, null, 2)}\n`;
    return { artifact, metadata, bytes, outputSha256: sha256(bytes), diagnostics };
}

function parseArguments(argv) {
    const options = { check: false };
    const values = { '--package-root': 'packageRoot', '--source': 'sourcePath', '--output': 'outputPath' };
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--check') options.check = true;
        else if (argument === '--help' || argument === '-h') options.help = true;
        else if (Object.hasOwn(values, argument)) {
            const value = argv[++index];
            if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}.`);
            options[values[argument]] = value;
        } else throw new Error(`Unknown argument: ${argument}.`);
    }
    return options;
}

async function main() {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
        console.log('Usage: node scripts/compile_feature_ink.mjs [--check] [--package-root PATH] [--source PATH] [--output PATH]');
        console.log('--check recompiles in memory and requires exact output bytes; it never writes.');
        return;
    }
    const result = await compileFeatureInk(options);
    const outputPath = resolve(options.outputPath ?? join(projectRoot, 'stories', 'feature_wave.json'));
    if (options.check) {
        let current;
        try {
            current = await readFile(outputPath, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') throw new Error(`Missing compiled Ink output: ${outputPath}. Compile before --check.`);
            throw error;
        }
        if (current !== result.bytes) throw new Error('Compiled Ink output is stale. Compile with the pinned recipe before building.');
    } else {
        await mkdir(dirname(outputPath), { recursive: true });
        const temporaryPath = `${outputPath}.${process.pid}.tmp`;
        try {
            await writeFile(temporaryPath, result.bytes, { flag: 'wx' });
            await rename(temporaryPath, outputPath);
        } finally {
            await unlink(temporaryPath).catch(error => {
                if (error.code !== 'ENOENT') throw error;
            });
        }
    }
    console.log(JSON.stringify({
        mode: options.check ? 'checked' : 'compiled',
        compiler: `${INK_COMPILER_PIN.name}@${INK_COMPILER_PIN.version}`,
        storyFormat: INK_COMPILER_PIN.storyFormat,
        ...result.metadata,
        outputSha256: result.outputSha256,
        diagnostics: result.diagnostics.length,
    }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
