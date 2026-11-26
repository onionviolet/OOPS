import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../',import.meta.url));
// Registry directories can be read from a staged restore without changing the registry.
export function readerDirectory(book) {
    return book.dir.startsWith('file:') ? fileURLToPath(book.dir)
        : resolve(process.env.ATLAS_READER_ROOT || root,book.dir);
}
