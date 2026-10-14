// Original implementation; mod reader mechanisms are inspiration only.
import {validateSaveEnvelope, writeGuardedSave} from '../../save_files.js';

export function backupJournalKey(release) {
    if(!['live', 'dev'].includes(release)) throw new Error('Unsupported save release.');
    return `yairpg:p23:backup-undo:1:${release}`;
}

export function createBackupUndo({storage, release, currentVersion, ownsSave, preflight}) {
    const key = backupJournalKey(release);
    if(typeof ownsSave !== 'function' || typeof preflight !== 'function') {
        throw new Error('Backup needs native ownership and real-loader preflight.');
    }
    const owner = () => {
        if(ownsSave() !== true) throw new Error('Backup needs the writable game tab.');
    };
    const snapshot = serialized => {
        if(typeof serialized !== 'string' || !serialized) throw new Error('Missing backup snapshot.');
        // Preserve exact bytes. Validation may return a migration candidate, but
        // the host real-loader preflights it without modifying the original.
        return validateSaveEnvelope(JSON.parse(serialized), currentVersion);
    };
    const parse = raw => {
        if(raw === null) return null;
        const journal = JSON.parse(raw);
        if(!journal || journal.schema !== 1 ||
            Object.keys(journal).sort().join(',') !== 'current,previous,revision,schema' ||
            !Number.isSafeInteger(journal.revision) || journal.revision < 1 ||
            journal.revision >= Number.MAX_SAFE_INTEGER) throw new Error('Unsupported backup journal.');
        snapshot(journal.current);
        if(journal.previous !== null) snapshot(journal.previous);
        return journal;
    };
    async function write(kind, serialized) {
        owner();
        const before = storage.getItem(key), journal = parse(before);
        if(kind === 'undo' && !journal?.previous) throw new Error('No previous backup to undo.');
        const next = {schema: 1, revision: (journal?.revision ?? 0) + 1,
            current: kind === 'undo' ? journal.previous : serialized,
            previous: journal?.current ?? null};
        const saves = [snapshot(next.current)];
        if(next.previous !== null) saves.push(snapshot(next.previous));
        for(const save of saves) await preflight(save);
        owner();
        if(storage.getItem(key) !== before) throw new Error('Backup changed during preflight; retry from the current journal.');
        writeGuardedSave(storage, key, JSON.stringify(next));
        return {...next};
    }
    return Object.freeze({key,
        read: () => parse(storage.getItem(key)),
        capture: serialized => write('capture', serialized),
        undo: () => write('undo')});
}
