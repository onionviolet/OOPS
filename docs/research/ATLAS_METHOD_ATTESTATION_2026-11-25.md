# Atlas output method attestation

| Preflight | Scope |
| --- | --- |
| Reading and authority | Add fixed public method metadata for a locally attested output. Bind the selected file by exact identity and byte hash. An absent receipt does not establish provider-batch reading. |
| Fit | The inventory's `selectCollectedOutput` preference and the private local manual-reading receipt. New server-side helper and focused tests; output routes and UI remain with the coordinator. |
| Player sentence | Verified: "Manual structured reading" with numeric-derived locator endpoints. Otherwise: "Reading method not attested". Provider provenance remains unknown. |
| Mechanism | Verify receipt format, book identity, exact key/prefix/pass/kind/selected basename, supported method code, valid declared locator scope, clean schema/locator verification and two matching per-output hashes, then hash the selected raw bytes and check output locators against the declared scope. Return a fixed projection. |
| Boundaries | No raw method prose, receipt fields, source paths or output rows are returned. Source-row admission remains the existing digest's responsibility. This helper attests the recorded method, not semantic completeness or truth. |
| Failure and checks | Missing/old/ambiguous receipt; wrong key, range, pass, kind or selected variant; stale hash including line-ending changes; unsupported method and invalid scope; malicious free text remains absent from the projection. |
| Screen and saved state | Metadata helper; no UI or game save change. The coordinator owns its read-only integration and desktop proof. |

## Integration

`readOutputMethodAttestation(book, {prefix, pass, kind}, options = {})` from `prototypes/world-atlas/output-method-attestation.mjs` returns method metadata for the same selected logical output as the inventory. `options.directory`, `options.names`, `options.selected`, `options.content` and `options.readFile` are server-owned dependencies for tests or mounted reader roots. Passing the already selected output and observed bytes avoids a second output read and attesting a later on-disk version. Supplied names validate the selection without another directory read. Public request values do not set them.

The verified projection contains `status`, fixed `method` and `label`, `provider: 'unknown'`, and locator endpoints in `locatorScope.from`/`through`. The unknown projection adds a fixed reason code and no receipt-derived values. Partial-file qualification and record disclosure remain with existing output admission.

## Receipt

| Check | Result |
| --- | --- |
| Focused tests | `node --test tests/atlas_method_attestation.test.js`: six passed. Exact key/prefix/pass/kind/selected-name binding; old/missing/malformed/ambiguous receipt; stale bytes including CRLF; mismatched hashes; unsupported method; invalid/cross-language/out-of-range scope; reuse of server-observed bytes without rereading the output. |
| Actual local reading | Both actual `lotm1` ch127 rules-pass outputs (`rules`, `other`) verified as Manual structured reading with scope `zh 第127章 p1` through `zh 第127章 p64`. The reading agent extended the private receipt after validating its actual files. Existing source/method fields were preserved. |
| Actual negative proof | Appending an in-memory newline to the actual observed output bytes returned unknown. A mismatched in-memory receipt hash also returned unknown. Source files and receipt were not modified by this proof. [Public-safe results](../representations/evidence/atlas-method-2026-11-25/result.json). |
| Privacy | The proof artifact and returned projection contain fixed labels, identity keys and locator endpoints. They omit private paths, receipt prose, hashes and rows. Absence does not establish provider-batch provenance. |
| Integration state | Helper and tests verified; the coordinator owns output route/view/server integration and its desktop proof. No integration-owned files edited by this lane. |

