// Git's canonical text form uses LF; Windows checkout CRLF must not change source identities.
import {readFileSync} from 'node:fs';
export const canonicalText = text => text.replace(/\r\n/g, '\n');
export const readCanonicalText = path => canonicalText(readFileSync(path, 'utf8'));
