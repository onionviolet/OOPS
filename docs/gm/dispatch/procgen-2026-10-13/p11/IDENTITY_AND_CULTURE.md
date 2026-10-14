# Titles, symbols and cultural expression

Status: PROPOSALS, 2026-10-14. Original text/designs only. Source-world variants later inherit P7/P9/P10 claim locators, languages, era and cultural constraints. [CONTEXT](CONTEXT.md) and [REPORT gates](REPORT.md#future-gates) apply.

## N11: titles, epithets and reputation text

**Value:** the world describes actual deeds differently by audience, place and time. Players can become known for service, research, craft, rescue, rivalry or an odd mistake without a generic achievement ladder.

**Cost:** low/medium for text and one recognition consumer; higher for privileges/authority. Dependencies: D8 verified deed/account refs, P4 issuer/audience identities, reputation and title owners, P7 name/honorific policies. Shown/SOURCE: `src/simulation_effects.js:129,358-360` exposes title presence and saves issuer/world/cause; `src/gameplay_publication.js:10` retains regional reputation. Neither means every town knows every title.

**Contract:** distinguish earned office, legal title, public nickname, private pet name, self-styling and hostile epithet. `label = {id, subjectRef, issuerRef, audienceScope, causeRefs, kind, language, resolvedText, recognizedAt, validUntil?, revokedBy?}`. A generated phrase doesn't grant the office it resembles. Revocation does not erase a past deed. An epithet is an account of reputation, with belief/accuracy separate from fact.

**First slice:** after a real original repair, two known audiences use saved fitting descriptions, such as a respectful repair nickname and a playful local variant. One audience's later commission recognizes the same receipt; a stranger does not. Hero can accept an address style, conceal it or ask for a preferred name without losing the underlying earned fact.

**Gates:** same person/deed/audience refs; no secret route in title text, source alias or recognition count; repeats don't grant duplicate authority/rewards. Newly earned titles can coexist under world-local naming conventions. Save/import retains spelling and recognition; changed grammar never renames earned titles. Prove any access consumer with actual issuer authority and readable desktop text.

**Further options:** translated names, rival claims, stolen credit, inherited office distinct from personal merit, misleading fame, temporary festival titles and creature epithets. Public-facing creative names can be player-adjustable while record IDs remain stable.

## N12: heraldry and symbols

**Value:** objects, groups and places become recognizable through visible marks that can be learned, copied, disputed or appraised. A mark can support a meaningful recognition action rather than decorative noise.

**Cost:** low/medium for a bounded description/SVG-style primitive grammar, higher for authenticity, uniform or faction effects. Dependencies: P7 culture/identity reservations, P6 dyes/textiles/creative fabrication, N11 issuer/title recognition, actual faction/jurisdiction and knowledge means. P11 proposes the symbolic record; P6 owns making the physical object. No asset generation is performed here.

[P6 MORE M11](../p6/MORE.md) already separates manufacturing symbolic carriers from legitimate issuing/recognition. N12 adds contextual motif selection and observer association over those same records; it creates no second credential store.

**Contract:** stable design ID, owner/issuer, era/culture, motif/color/form grammar, legal permissions, public interpretation, copy provenance and observer-learned association. Do not randomly generate a sourced reserved emblem, reveal a secret affiliation through a known symbol or give a counterfeit the original credential's authority. A visually identical copy can have different provenance. Color is not the sole recognition cue; text/shape remain available.

**First slice:** one original workshop commissions a saved stamp using a few compatible primitives. Hero sees its mark on actual owned tools, learns the association and can identify one supported tagged delivery. Buying/copying the shape does not grant guild membership. UI can initially use a short description and plain geometry rather than an image asset pipeline.

**Gates:** stable motif under reload/import and palette changes, no canon reservation collisions, observer-limited recognition, correct copy/issuer distinction, accessible non-color clue. Any credential consumer validates actual issuer/permission separately. Changed affiliation can issue a new dated symbol without overwriting old objects or history.

**Further options:** maker marks, seals, flags, tattoos, ritual diagrams, sigils, heraldic disputes, trade signs and multilingual icons. Rule-rich formal heraldry can be world-local; not all cultures need it.

## N13: music, art and visual descriptions

**Value:** context produces fitting cultural texture and creations with provenance. An event or person can be remembered through an original song summary, mural description or craft style without a large media pipeline.

**Cost:** low for safe description projection, medium for functional commissions/performances, high for actual audio/asset generation. Dependencies: [P6](../P6.md) owns creative work production, D8 historical subjects, P4 artist identity, P7 cultural language, N8 occasions, existing presentation/effects/accessibility owners. P11 specifies contextual subject/style selection, not a second creative recipe system.

[P6 CREATIVE_WORKS](../p6/CREATIVE_WORKS.md) owns the product graph, editions, copies, performance and teaching consumers. N13 only supplies known-subject/style inputs and safe contextual description/audience projection. Its first slice reuses P6's work receipt.

**Contract:** work ID, original maker, subject/known claim refs, medium, style grammar, commission terms, audience, credit, resolved description, sensory alternatives and copy/performance occurrences. Musical tradition, genre, instruments and sensory metaphors must fit local means and body. A person who never saw a deed can depict an attributed story, not an accurate hidden scene. Describe original content; don't interpolate canon prose, lyrics, signatures or private notes.

**First slice:** an original local artist makes a short stored description of one known deed with an actual P6 work/fee receipt. Display it at a supported authored venue; one fitting audience response references the work and artist. Text is enough for this slice. Audio/images can remain later options with their own production/license and runtime delivery gates.

**Gates:** subject knowledge and credit are correct, deterministic saved wording survives grammar edits/import, no hidden truth in alt text/captions, no fabricated authored cultural claim. Prove any reputation/payment/teaching effect through an actual consumer. Respect sound-off, reduced-motion, text size and readable desktop layout if media is later added. A description is not evidence of generated audio or rendered art.

**Further options:** regional aesthetics, propaganda, satire, collaborative works, ritual performances, restorations, competing critics, improvised stories and works crossing worlds with partial translation. Sensory modes can differ by species; optional texture need not always award stats.
