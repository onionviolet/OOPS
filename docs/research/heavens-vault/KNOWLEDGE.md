# Knowledge, guesses and correction

Evidence labels: SHOWN means static code/data inspected in build 4220136, not gameplay exercised. All extract paths below are relative to `~/.codex/research/heavens-vault/`. No game was launched.

## F1: A word is structured, and learning is separate from guessing

SHOWN: `extract/csharp/Translation/LexDictionary.cs::BuildLanguage` reads word names, components and equivalences from a data asset. `PrototypeWordModel` stores atoms and computes nested subword distances. This supports structural comparison between related glyph words, rather than treating every inscription as an unrelated password.

SHOWN: `EntityLexDictionary` maps the actual word to `EntityLexDictionaryWordTranslation`. The latter stores the suggested word, a `known` flag, candidate synonyms, rejected synonyms and a set of inscription IDs used as translation evidence. `correct` compares actual and suggested prototypes. Correctness exists before the player knows it. Seen, guessed, correct and confirmed are separate states. The UI helper appends a question mark to a guessed word.

SHOWN: `GetSimilarTranslatedWords` ranks prior words by common roots, diversifies overlap, includes rare shared atoms, and limits the comparison list (default three). It can include previously seen words, not just confirmed ones. Some ranking depends on tutorial state. This is a useful notebook retrieval mechanism, not proof that a similar word has the same meaning.

## F2: Confirmation uses clues and distinct contexts

SHOWN: `EntityLexDictionary::ReadyToConfirmOrBlacklistWord` rejects spaced phrases, known words, words without a guess, and inscriptions already in `artefactsTranslatedFrom`. It then adds clue points for most roots known, overlap with a learned word, and short length, and subtracts one for very long words. It allows assessment when word usages plus clue points reach four. `MostRootsKnown` uses an unknown-root fraction below 0.3; this is a heuristic, not a Bayesian confidence percentage.

SHOWN: `SubstitutingStateView::CheckForConfirmedWords` records the new inscription, learns a correct word, or blacklists a wrong suggestion and clears it. Both outcomes cue ink commentary. `TranslationGameTranslationModelWord::PlayWord` records the inscription used for a guess, and can immediately learn a correct answer when only one valid synonym remains. So the four-point rule is not the sole learning path. Story instructions can also teach words.

SHOWN: usage counters increase in `TranslationPhraseModelData`, while inscription provenance uses a set. Do not simplify this into a claim that opening the same object four times always confirms a word, or that all usage counts themselves are deduplicated. No runtime farm test was run.

## F3: Phrase completion and story interpretation differ

SHOWN: `TranslationModel` has spacing, substitution, impossible and complete states. `Translated()` requires segmentation plus knowledge of all word prototypes. `HasTranslationForAllWords()` only requires guesses. `PassPhraseToInk(false)` passes the player's reading to `most_recent_translation` and its capitalised variant. The story can therefore respond to an uncertain reading before every word is confirmed.

SHOWN: `StoryScript` binds `KNOW_WORD`, `ARTEFACT_TRANSLATION_PLAYED`, `ARTEFACT_TRANSLATION_SOLVED`, and separate queries for wrong, correct-but-unconfirmed and unseen words. This proves authored dialogue can distinguish these states. Exhaustive branch outcomes are outside this bounded read.

## F4: Translation is not a universal plot lock

STATED: Inkle explains that artefact origin clues locate sites and that players can finish while skipping or deliberately mistranslating inscriptions. Translation changes understanding rather than being a universal door key. [Developer explanation, 2025-11-18](https://medium.com/@inklestudios/why-does-translation-unlock-sites-in-heavens-vault-e05c4ccadf62).

SHOWN: this installed build nevertheless applies a 0.85 multiplier to the remaining uncertainty for each translated clue in `Game::KnowledgeScoreForLocationWithClues`. It starts with remaining uncertainty one, multiplies clue contributions, then returns one minus that product. This is a search bonus, not proof of a mandatory translation gate. `KnowledgeStateFromKnowledgeScore` uses thresholds 0.3, 0.6, 0.75 and exact one. Map state also depends on authored scene visibility/playability.

INFERRED: the later developer statement describes completion-level design, while the shipped code exposes a smaller search benefit. Preserve both pieces of evidence; do not turn the statement into “translation never affects any numeric progress.”

## YAIRPG comparison

The incumbent already has `src/adventure_notebook.js` with Here, Practice, People and Journal, active-work attention and keyboard tabs. `src/people_knowledge.js::knownPeopleView` projects witnessed facts and memories. `docs/emergent/E7_OBSERVATION_AND_MYSTERY.md` already proposes source, confidence and corrections. `docs/GRANULAR_SYSTEMS_AND_INTERACTIONS.md` G2 separates truth, usable rule facts and player knowledge.

PROPOSAL: deepen those owners with evidence identities, competing interpretations and one changed downstream action. Do not build a second codex, replace all boolean facts, or import this game's exact clue constants. A repeated specimen may still yield useful practice under a selected learning rule without pretending to be independent confirmation.
