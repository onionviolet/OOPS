# B6 + R9 implementation receipt: paid client sessions and referral standing, 2026-11-03

Status: implemented, floor met except `check:rules` (fails at HEAD on an unrelated register line, below). Rules: AR1-AR16, AD36, AD38, AD43, AD48, AD49, ECC25, ECX6, WPR5.

## Before coding (written down)
- Seam: new leaf `src/book_world_lotm_be_clients.js` (pure effect builders, facts, derived view, assertions), one registration line each in `lotmFacts` (`book_world_lotm_actions.js`) and `validateLotmState` (`book_world_lotm_state.js`). Same shape as B1/B3 (`book_world_lotm_be_seer.js`). No new save slice, no `main.js` change.
- Consumers: B6 ch54 P068-P079 (Anna, Divination Club, `kj3z.booking`/`topaz`/`story`); R9 ch55 P067, ch56 P044 (referral by Angelica). Shown in the existing Reports log through the act's `report` field.
- Failure scenarios: no stated fee must not invent a figure; a refused client must not pay or gain favor/referral; money must not appear in two ledgers; a non-pence fee must not be paid without its exchange quote.
- Focused test: `tests/lotm_be_clients.test.js`.

## What changed
- One money authority (ECC25): the fee is one native `money` effect in pence (the purse). Status, net-fee receipt and favor are player facts per client (`book.lotm.be.client.<id>`, `.fee`, `.favor`). Services sold, referral standing and income are DERIVED by `beClientView`; there is no second counter. A validator refuses any `book.lotm.be.(client|fee|income)*` resource.
- Fee is a quote with a basis: stated, listed, assumed or unknown. Unknown or absent pays nothing and prints no figure (`served_unpaid`, favor still earned: dial `BE_FAVOR`). Non-pence currency throws and needs the exchange quote (ECX6, R2's lane). Optional `houseCut` fraction (Anna: the club's eighth).
- Refusal: `clientRefuseEffects` sets `refused`, favor 0, no money; `clientSessionRequires` blocks a second dealing.
- Assumed (WPR5, AD49): Anna's 8 pence fee (listed 2 then 8, ch48 P025-P077) and the club's eighth (net 7). No paragraph through ch54 P079 shows a fee agreed, so content that follows the text should pass `{basis:'unknown'}` until a volume that does.
- Content use: a place-act row takes `clientSessionEffects(id)` as its effects, `clientSessionReport(id)` as its `report`, and `clientSessionRequires(id)` in `requires`. Effects are plain JSON a pack can embed. Knowledge entries go to the notebook, not the log, which is why the report line is separate.
- Not built: referral standing as a spendable thing, per-world exchange of fees, further clients (add rows to `BE_CLIENTS`), the club's own purse (AD49 institution purses).

## Checks (one line each)
- `node --test tests/lotm_be_clients.test.js tests/lotm_be_seat.test.js tests/lotm_abilities.test.js tests/lotm_primary_compat.test.js tests/lotm_seer_slice.test.js`: 40 pass, 0 fail (3 new: paid session moves purse once by 7 and derives sold/referral/income; unknown or null fee invents no figure, refused client pays nothing and cannot be served again; bad currency/figures throw, a stray money counter and a receipt-less paid client are refused by `validateLotmState`).
- `npm run build`: ok (dist and index.html restored after).
- `npm run check:arch`: pass, no main.js growth.
- `npm run check:rules`: FAIL, 1 problem: "register says WA1-WA53, highest in docs/WORLD_ABSORPTION_RULES.md is WA68". Not from this change (no docs touched; HEAD is where it fails). Needs its owner.
- Native, headless Chrome 1920x1080, fresh origin, `b6_r9_native_run.mjs`: bundle sha256 `52712489473e...c298a8` (this worktree's build over the b10 static files), KJ3Z completed checkpoint loaded, one added act `book.lotm.b6r9.session` (test-only, in a scratch copy of the pack, not shipped). Result: next task was that act; purse 787 -> 794; facts `paid`, fee 7, favor 1; no second money counter; message log shows "Anna paid 8 pence for the divination; the club kept 1 pence and you took 7 pence (assumed)..."; export/reload round trip kept purse and status. 0 page errors from the runner's own listener (the session's error list holds only 404 resource loads that also occur on the stock bundle).
- Not run: full `npm test` (committer's gate), unknown-fee and refusal paths in the browser (unit-tested only), mobile (deferred).

## Incident to know about
`private_packs` in a proof-bundle copy is a symlink to the live `/Users/weiwei/code/yet-another-idle-rpg/private_packs`. My first overlay wrote the test act and stages into the LIVE `private_packs/lotm-cast/cast.json` (also reformatted it). I removed them (965 acts restored, no `b6r9` string, 0 sequences hold it) and rewrote it as `json.dumps(indent=2)` plus newline, the format of every older copy (byte-verified on a /tmp copy). Content is unchanged, but the file hash differs from before, so a runner that pins the pack hash from an earlier receipt will see a new one. Native runs must `cp -R` the packs, never overlay through the bundle's symlink.

## For builders (kjw)
When a window finally shows a fee agreed (ch55+), use `clientSessionEffects(id,{quote:{pence,currency:'pence',basis:'stated'}})`; add the client to `BE_CLIENTS` first. Stale figure checks: the `share.collected` 2,400-pence commission is still unsigned on screen, so the purse stays a ceiling.
