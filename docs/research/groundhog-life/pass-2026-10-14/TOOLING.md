# Tooling and source identity

Static only. No browser launch, game execution, account access, save access or runtime test. No code or assets reused.

The prior later-build bytes were recovered from `/private/tmp/claude-501/groundhog-life-src/v2-mirror/` and copied to `/Users/weiwei/.codex/research/idle-depth/extract/`. `app.v2.js` SHA-256 is `d167076ecdafa7f4c0272a66a3cf193a3f465b6f7a3af60c478bf1d8ee214f3c`, matching the prior checkpoint exactly. The preserved formatted copy supplies every app line locator. No new formatting changed those locators.

Mirror: [tcztzy/groundhog-life](https://github.com/tcztzy/groundhog-life). Original mirror filename: `app.8454c4a8acef88257f33.js`. Mirror commit was not recovered for the old extract; hash pins the read. Do not treat its GPL file as confirmed author permission.

Fetched the matching named vendor file to resolve the one imported math transform:

```sh
curl -fL --max-time 25 https://raw.githubusercontent.com/tcztzy/groundhog-life/master/vendor.699bcf00ff00a5c12274.js -o /Users/weiwei/.codex/research/idle-depth/extract/groundhog-vendor.js
npm install --prefix /Users/weiwei/.codex/research/idle-depth/tools/static-parser acorn --ignore-scripts --no-audit --no-fund
```

Install: Acorn 8.19.0, one package, under this lane's work area only. Node parsed the app and vendor text as syntax; it did not evaluate the bundles. Vendor module 210 exports 226, 226 selects Math.log10, 264 provides the implementation. App LevelAddModifier was read to verify the research input scale. Hashes for all extracts are in `extract/HASHES.txt`. The vendor is fetched from mirror master under its matching filename, not assigned an invented commit.

Working reads: `rg -n` for system symbols, `sed -n` for complete function sections, Python `-I` for counts and output validation. The achievement count was mechanically checked: 31 constructors, seven group constructors.

Dead ends: a first check found Acorn absent from the checkout; installed it in the work area. No fetch failures. No decompile was needed. Third-party framework/vendor modules beyond this exact transform were not audited.
