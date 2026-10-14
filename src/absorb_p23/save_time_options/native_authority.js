// Original P00 draft. One optional authoritative value; no slots or offline time.
import {validateSaveEnvelope, checkSaveSize, writeGuardedSave} from '../../save_files.js';

export function nativeAuthorityKey(release) {
    if(!['live', 'dev'].includes(release)) throw new Error('Unsupported save release.');
    return `yairpg:p23:native-authority:1:${release}`;
}

// ownsSave must use the EXISTING lifetime yairpg-save:<legacy release key> lock.
// The host also pauses all native mutations across async work and reload. This
// module cannot stop gameplay timers or acquire a different writer namespace.
// writeRoot is a synchronous, quota-guarded, one-setItem durable-only publisher.
// Publish native owners/observers AFTER this helper returns successfully.
export function createNativeAuthority({storage, release, currentVersion, ownsSave, preflight,
    writeRoot = (key, bytes) => writeGuardedSave(storage, key, bytes)}) {
    if(typeof ownsSave !== 'function' || typeof preflight !== 'function' || typeof writeRoot !== 'function') {
        throw new Error('Native authority needs ownership, native preflight and durable publication.');
    }
    const key = nativeAuthorityKey(release);
    let busy = false;
    let validatedAuthorityBytes = null;
    const failure = (code, message, cause) => Object.assign(new Error(message, {cause}), {code});
    const owner = () => {
        if(ownsSave() !== true) throw failure('SAVE_READ_ONLY', 'Use the writable game tab.');
    };
    const snapshot = bytes => {
        if(typeof bytes !== 'string' || !bytes) throw new Error('Missing native snapshot.');
        const save = JSON.parse(bytes);
        // Authority metadata is stored outside snapshots. Refuse recursive
        // captures instead of silently rewriting exact native snapshot bytes.
        const visit = value => {
            if(!value || typeof value !== 'object') return;
            for(const [name, child] of Object.entries(value)) {
                if(name === 'p23_save_authority' || name === 'p23_backup_undo') {
                    throw new Error('Native snapshots cannot contain authority or backup metadata.');
                }
                visit(child);
            }
        };
        visit(save);
        return validateSaveEnvelope(save, currentVersion);
    };
    const parse = raw => {
        if(raw === null) return null;
        try {
            const root = JSON.parse(raw);
            if(!root || Object.keys(root).sort().join(',') !== 'current,previous,release,revision,schema' ||
                root.schema !== 1 || root.release !== release ||
                !Number.isSafeInteger(root.revision) || root.revision < 1 || root.revision >= Number.MAX_SAFE_INTEGER) {
                throw new Error('Unsupported authority envelope.');
            }
            snapshot(root.current);
            if(root.previous !== null) snapshot(root.previous);
            return root;
        } catch(cause) {
            throw failure('SAVE_AUTHORITY_INVALID',
                'The enrolled save is invalid or needs a compatible build. Saving is blocked; its original bytes and legacy saves are preserved. Export preserved data or explicitly recover a legacy file with a compatible build.', cause);
        }
    };
    const unchanged = before => {
        if(storage.getItem(key) !== before) throw failure('SAVE_AUTHORITY_CHANGED', 'The active save changed during validation; no save was published.');
    };
    const available = () => {
        if(busy) throw failure('SAVE_AUTHORITY_BUSY', 'A save recovery operation is still running.');
    };
    const make = (old, current, previous) => {
        const revision = (old?.revision ?? 0) + 1;
        if(revision >= Number.MAX_SAFE_INTEGER) throw new Error('Save authority revision is exhausted.');
        return {schema: 1, release, revision, current, previous};
    };
    const publish = (before, next) => {
        const bytes = JSON.stringify(next);
        // Account for the complete new root AND all other origin data, including
        // untouched legacy saves and immutable ended-life archives.
        checkSaveSize(bytes, {storage, key});
        owner();
        unchanged(before);
        writeRoot(key, bytes); // Exactly one durable publication, never rollback.
        validatedAuthorityBytes = bytes;
        return next;
    };
    const preflightRoot = async root => {
        await preflight(snapshot(root.current));
        if(root.previous !== null) await preflight(snapshot(root.previous));
    };
    async function operation(kind, bytes) {
        available(); owner(); busy = true;
        try {
            const before = storage.getItem(key), old = parse(before);
            if(kind === 'enroll' && old) throw new Error('This release is already enrolled.');
            if(kind !== 'enroll' && !old) throw new Error('Explicit backup enrollment is required.');
            if(kind === 'undo' && old.previous === null) throw new Error('Keep a backup before undo.');
            if(old && before !== validatedAuthorityBytes) {
                try {await preflightRoot(old);}
                catch(cause) {throw failure('SAVE_AUTHORITY_INVALID', 'The current enrolled save cannot load completely. Original authority and legacy bytes are preserved; use a compatible build or explicit legacy-file recovery.', cause);}
                owner(); unchanged(before);
            }
            // Normal saves are caller-prepared. Capture keeps the exact current
            // native snapshot as the recovery point. Undo bypasses normal-save
            // observations entirely and swaps the two exact snapshots.
            const next = kind === 'enroll' ? make(null, bytes, null)
                : kind === 'capture' ? make(old, bytes, bytes)
                : kind === 'importAuthority' ? make(old, bytes.current, bytes.previous)
                : kind === 'import' ? make(old, bytes, old.previous)
                : kind === 'reset' ? make(old, bytes, null)
                : make(old, old.previous, old.current);
            await preflightRoot(next);
            return publish(before, next);
        } finally {busy = false;}
    }
    return Object.freeze({key,
        read: () => parse(storage.getItem(key)),
        // Absence is a no-op. A present invalid root throws; the host MUST NOT
        // enter legacy fallback or initialize a fresh character after rejection.
        async boot() {
            available(); busy = true;
            try {
                const before = storage.getItem(key), root = parse(before);
                if(root === null) return null;
                try {await preflightRoot(root);}
                catch(cause) {throw failure('SAVE_AUTHORITY_INVALID', 'The enrolled save cannot load completely in this build. Original authority and legacy bytes are preserved; use a compatible build or explicit legacy-file recovery.', cause);}
                unchanged(before);
                validatedAuthorityBytes = before;
                return root;
            } finally {busy = false;}
        },
        enroll: bytes => operation('enroll', bytes),
        capture: bytes => operation('capture', bytes),
        importSnapshot: bytes => operation('import', bytes),
        importAuthority: value => {
            if(value.release!==release||typeof value.current!=='string'||(value.previous!==null&&typeof value.previous!=='string'))throw new Error('Unsupported enrolled save export.');
            return operation('importAuthority',value);
        },
        // Only the host's existing explicit Hard Reset action uses this. Keep
        // authority selected so legacy boot fallback cannot resurrect progress.
        resetSnapshot: bytes => operation('reset', bytes),
        undo: () => operation('undo'),
        // The synchronous native transaction owner already prepares/validates
        // normal candidates. No async iframe is inserted into its commit phase.
        // Optional expected bytes let a caller refuse a stale staged candidate.
        commitPreparedSave(bytes, {expected} = {}) {
            available(); owner();
            const before = storage.getItem(key), old = parse(before);
            if(old === null) throw new Error('Explicit backup enrollment is required.');
            if(before !== validatedAuthorityBytes) throw failure('SAVE_AUTHORITY_CHANGED', 'The enrolled save changed or has not passed boot preflight. Reload before publishing native progress.');
            if(expected !== undefined && expected !== before) throw failure('SAVE_AUTHORITY_CHANGED', 'The active save changed before publication.');
            snapshot(bytes);
            return publish(before, make(old, bytes, old.previous));
        },
        get busy() {return busy;}
    });
}
