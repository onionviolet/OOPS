# OOPS branding

## Beta logo, preserved 2026-10-26

Weibao requested retaining the current logo as a beta logo for future use.
`oops-beta.svg` and `oops-beta.png` preserve the green overlapping OOPS rings
used by the desktop app. The SVG is the editable source; the PNG is its
1024×1024 desktop rendition. The active desktop asset remains at
`../oops-icon.png`.

Future logo concepts are proposals and should be saved separately from this
beta identity. The blue ribbon BatteryCare/WattNook icon is a reference for
finish and visual quality, not OOPS artwork.

## Portal concept v1, 2026-10-26

`oops-portal-concept-v1.png` was generated with the built-in imagegen tool.
Weibao selected it as the app logo on 2026-10-26: "Make the new one as the logo".
It now also supplies `../oops-icon.png`, used by the desktop host and browser
favicon. The beta SVG remains historical artwork.

Prompt brief: a premium macOS rounded charcoal tile with a sculpted jade portal,
subtle gold edges, a simple ivory-gold path passing through it toward a star,
and a deep indigo opening. Strong silhouette, restrained glow, no text. The
BatteryCare/WattNook image supplied the finish reference only; its W ribbon
and blue identity were explicitly excluded. Transparent outside the tile.

Visual review: the concept conveys world travel more clearly than the beta
rings. Its surface texture and star field are more detailed than the prompt's
small-size goal. The beta copies were byte-compared with the original SVG and
PNG before replacement and matched.

## Future item: adjust the logo to fit the game

Weibao, 2026-10-26: "we can adjust accordingly to fit the game ... in the
future, note for future item". Keep the selected portal for now. Revisit its
symbolism, detail level and small Dock-size readability when the game's
identity develops further. This is a later branding item, not a current
gameplay gate or an instruction for another design pass now.

Adoption check, 2026-10-26: the active PNG byte-matches the selected concept.
The running player app's native Dock setter accepted the nonempty 1254×1254
image, with the existing Dock visible, without restart or page reload.
`git diff --check` passed. Only artwork, favicon reference and documentation
changed; the previously verified desktop icon startup code is unchanged.
The normal frozen page retains its existing page assets until a later build
adoption, while its live Dock now uses the selected portal. Windows/Linux and
human OS appearance acceptance remain unverified.

BatteryCare provenance: the local `batt-weibao` repository introduced its
custom icon in commit `0bd6f97badd9a9e30f830f8c1d6342b084f1e4f8`, titled
"Use generated WattNook app icon". That establishes a generated project asset;
the original generation tool and prompt were not established by this check.
