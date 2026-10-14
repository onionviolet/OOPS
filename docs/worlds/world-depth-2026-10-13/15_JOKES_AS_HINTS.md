# Jokes as hints: throwaways that turn out to be real pointers (2026-10-13, proposal)

Weibao (2026-10-13): "One off jokes and stuff could be hints towards real worlds and stuff? more to consider?" and "Expanding each possibility and more?"

Reading: "real worlds" means worlds that exist in the game's multiverse (other playable worlds, unreached worlds, sealed truths). A throwaway joke, odd line, misprinted title, stray item or meta gag can later turn out to be a genuine pointer. Harmless real-life nods are included too. Everything here is a proposal.

What already exists and is not repeated: the omen ladder (`docs/COSMIC_EVENTS.md`), false secrets, clues and knowledge stages (`docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md`), the fourth-wall tiers M1 to M7, loading tips by a meta character, console notes, text-selection reveals and "bottom of the log" lines (`docs/PRESENTATION_AND_FOURTH_WALL.md`), rumor carriers (OF4, OF31, EV6), and "foreshadow up the ladder" (`docs/FITTING_CHARACTERS_AND_TIMES.md`). This pass adds the joke-shaped clue as its own content type: how it reads twice, how it is stored safely, and how it links across worlds.

Sealed secrets: none read for content. IDs touched below by ID and route only.

## 1. Hint forms (HF)

| Code | Consideration | Why it matters |
|---|---|---|
| HF1 | **NPC joke.** A punchline that names something the speaker should not know about ("my cousin swears the moon's a lantern someone forgot to blow out"). Default: one-line flavor in look or chatter text, tagged with a hint ID. | The cheapest carrier. Jokes are already expected to be nonsense, so they hide a pointer better than a rumor does. |
| HF2 | **Rumor with a wrong detail.** The rumor is false overall, but one detail is exactly right about another world. | Fits rule 6 and false secrets. The player learns to keep the odd detail, not the whole story. |
| HF3 | **Bad poetry or a drinking song.** A rhyme scheme forces an odd word in; that word is the pointer. Dial: the song shifts a verse each time a related world changes. | Songs repeat, so the hint gets heard many times without feeling pushed. |
| HF4 | **Graffiti and carved benches.** A doodle or name in a place the player passes (builds on SL27-style carvings). | A visual-text hint that sits in the world. A name carved in two different worlds is a strong second-read moment. |
| HF5 | **Book titles on a shelf.** Library and bookshop lists include a title that reads as a joke or a misprint here, and is a real book or record in another world. | Shelves are already T1 named texture (DT1). Literacy can open the book later; until then the title alone is the hint. |
| HF6 | **Menu items and recipes.** A tavern dish named after a place or creature nobody local has seen. | Food is daily texture, so the player meets it often. A recipe can also be a working cross-world craft. |
| HF7 | **Misnamed or foreign coin.** A coin in change with a strange face or a wrong metal, valued as junk. | Haggling and appraisal routes already exist. The coin is a physical, carryable pointer to its home world. |
| HF8 | **Dream fragment.** A sleep log line that sounds like a nonsense dream. Default: only on Sleep or rest actions. | Sleep is idle-native. A dream that later matches a real place is a satisfying click with zero new UI. |
| HF9 | **Pet and animal names.** A dog, horse or cat is named after something from another world ("the farmer swears he named her after a dream"). | Proto23 already lets players name the cat and blocks one prefix with a joke line (shown in R5 reader notes). Names are small, repeatable and safe. |
| HF10 | **Typo in a notice.** A posted notice misspells a word into another world's term. Dial: notices reprinted later fix or keep the typo. | A misprint is deniable on first read. Reprints give a natural timing beat. |
| HF11 | **Sales pitch.** A peddler oversells an item with a claim that is absurd here and true elsewhere (builds on OF5, the wandering peddler). | Pitches are expected lies, so the one true claim hides well. The item can actually work in the right world. |
| HF12 | **Glitch-looking line.** A log line that looks like a rendering bug: a stray glyph, a word in another script, a line that ends early. | Stays inside the existing fourth-wall safety lines (it recovers, nothing real breaks). Fans hunt glitches. |
| HF13 | **Fourth-wall gag.** A meta character's joke about "the other game you're playing" names a real world in this save. | Pairs with M1 knowing nods and the reach ladder. Funny if wrong, chilling if right. |
| HF14 | **Loading tip that is wrong here.** A tip that is false in this world and true in another ("Tip: the dead do not stay down on Tuesdays"). | Loading tips already exist as a meta-authored, sometimes-wrong line. Tagging some as cross-world turns them into a scavenger hunt. |
| HF15 | **Achievement or title name.** A title name that is a pun here and a literal description elsewhere. Proto23's Glass Bones and Hikikomori-to-Hermit titles show the joke tone (shown in R1 reader notes). | Titles are seen once and kept forever, so a title that clicks years later is a long-horizon payoff. |
| HF16 | **Log line that rhymes with another world.** The same sentence shape appears in two worlds' logs, with one word swapped. | The rhyme is the hint. It costs nothing to author once both worlds have templates. |
| HF17 | **Child's game or counting rhyme.** Children copy the player's skills (OF30); they also chant a rhyme with numbers that match a real count somewhere. | Children are believable carriers of nonsense, and the count can be checked later. |
| HF18 | **Wrong-world object in the junk pile.** Proto23's child trader sells joke junk (pebbles, milk caps, spoiled food, shown in R4 notes). One junk item is from another world. | Junk is ignored by default, so the pointer waits for a curious player. |
| HF19 | **Harmless real-life nod.** A constellation, a historical name that is real in both canon and history, an old cheat-code shape, the real date (M3). Default: decorative only. Reasonably: nothing needs a web search to progress. | Fun for the player as a person. Kept off personal data and off any progress gate. |
| HF20 | **Overheard half-sentence.** Two NPCs stop talking when the player arrives; the fragment left in the log is a pointer. | Uses the observation rule: you only get what you were close enough to hear. |

## 2. Hint grammar (HG)

| Code | Consideration | Why it matters |
|---|---|---|
| HG1 | **Deniability first.** Default: every joke-hint reads as a complete joke on its own, with a normal in-world reason for the speaker to say it. Lint: a hint line without a stated local joke reason fails review. | If the joke only works as a hint, it reads as a nudge. The joke has to be a real joke first. |
| HG2 | **Two reads.** First read: flavor. Second read, after the player meets the target: the same line now means something. Default: the line stays as written; the player's knowledge changes. | The click comes from the player, not from new text. That keeps it honest and cheap. |
| HG3 | **Repetition across worlds.** The same odd phrase, name or object turns up in two or more worlds. Default: two sightings before the Notebook groups them. Dial: one to four. | One odd line is noise; two is a pattern. The threshold is a dial so the player tunes how quickly it surfaces. |
| HG4 | **Convergence.** Three unrelated jokes from different speakers point the same way. Default: convergence raises the Notebook entry from "sensed" to "suspected" (existing knowledge stages). | Ties joke-hints into the stage ladder without a new system. |
| HG5 | **Timing: seen before the world exists for you.** A hint can show before the target world is unlocked. Default: early hints for worlds the player has not reached, so the payoff lands on first arrival. | Makes the multiverse feel older than the player's route. First arrival gets an "oh, that's what the song meant" beat. |
| HG6 | **The payoff moment.** When a target is met, the Notebook links earlier hint sightings to it retroactively and shows where and when each was heard. | The retroactive link is the reward. It costs one lookup over stored sighting IDs. |
| HG7 | **Honest red herrings.** Some jokes are only jokes. Default: a share of hint-shaped lines with no target. Lint: a red herring has no target ID, so it cannot link. | Keeps hunting fun and keeps the player from treating every line as a clue. Disproving one is a small discovery (false secrets). |
| HG8 | **Misattribution.** A hint is real but points at the wrong world on first guess, because two worlds share a look (look-alike pairs). | Rewards cross-checking and fits the "subtle look-alike pairs" theme. |
| HG9 | **Speaker reliability.** The hint carries its speaker; a known liar's true joke and an honest person's wrong joke both exist. | Uses existing rumor speaker and evidence status (CHARACTERS_AND_WORLD_EVENTS line 53). |
| HG10 | **Decay and drift.** A hint retold by many people blurs (OF31's growing rumor). Default: a retold hint loses or bends one detail per hop. Dial: drift size. | The closer the player gets to the source, the sharper the hint. Gives travel a reason. |
| HG11 | **Density Default + Dial per world.** Default: low density in grounded worlds (book world 1, D&D town), medium in joke-native worlds (HP, LOTM), high in meta-native places (Proving ground, the hub). Reasonably: a world's tone sets how many throwaways it has. | Each world keeps its voice. A dour military camp should not sound like a joke shop. |
| HG12 | **Player preference dial.** Settings: hints off (lines show, never link), quiet (link only on payoff), normal, eager (Notebook flags "this seems odd" on first sighting). | Some players want the hunt, some want the surprise. Off still keeps the jokes. |
| HG13 | **Skill-gated second read.** A hint can need Literacy, Perception or a world skill before it reads as odd. Default: the line shows to everyone; only the "huh" entry is gated. | Fits "discovered using relevant skill" (Weibao, 2026-10-10). Same line, deeper read with skill. |
| HG14 | **Callback jokes.** A payoff can itself become a joke later: NPCs who heard the player explain a hint start repeating it wrongly. | The world reacts to the click, and the joke loop continues. |

## 3. Sealed-secret safety (SS)

| Code | Consideration | Why it matters |
|---|---|---|
| SS1 | **Hints point, they do not state.** Default: a hint line can mention a surface (a symptom, a name, an odd count) and by default not the truth field of a sealed secret. Lint: string compare against the sealed truth text and its key terms fails the build. | The hint can be fair without spoiling. Clues and truths stay separate fields, as the secret anatomy already does. |
| SS2 | **Storage split.** Public hint record: ID, line text, speaker, places, tags, target pointer ID. Agent-only sealed owner: what the pointer resolves to. Default: the pointer is an opaque ID such as `hint-target:HP-SEAL-1:clue-2`. | Authoring surfaces (IDEA_INDEX, reports, commits) can list hints without exposing what they reveal. |
| SS3 | **Reports by ID and route.** Agents report "HF line H-HP-07 points at HP-SEAL-1 via the wandmaker route, status unlinked", not the content. | Follows the sealed-secret rule in AGENTS.md. |
| SS4 | **Rerolled truths get per-copy hints.** Where a truth is rerolled (DND-SEAL-1, MOL-SEAL-1, QLM-R1, QSS-R1), each candidate truth has its own hint pool; the run draws hints from the live candidate only. | A replay with a different truth hears different jokes, so memory of old jokes misleads in a fair way. |
| SS5 | **Shared surface jokes across candidates.** Some hints are true for every candidate truth (a symptom all versions share). Default: about half of a rerolled secret's hints are candidate-neutral. | Prevents the player from identifying the candidate from which jokes exist. |
| SS6 | **Lint: no hint names its target world's sealed ID in UI.** IDs live in data and tests only. The Notebook shows the place and speaker, not the ID. | Stops an ID like "HP-SEAL-1" from leaking as a tell. |
| SS7 | **Lint: red herrings stay target-free.** A red herring with a target pointer, or a real hint without one, fails. | Keeps HG7 honest in data. |
| SS8 | **Test output by ID.** Tests assert the link appears only after the target route fires, and print hint IDs and target IDs, not text. | Same pattern as the existing sealed tests. |
| SS9 | **Payoff does not unseal.** Linking a joke to a sealed secret raises its knowledge stage at most to "suspected". "Known" still needs the secret's own route. | Jokes add evidence; they do not replace the investigation. |
| SS10 | **Book world 1 and private packs.** Hints about private-pack content live in the private pack, with public-safe generic text in the repo. | Keeps names and places from private book world 1 out of public files. |

## 4. Per world (PW2)

Franchise facts are labelled (general knowledge) where they are not from repo notes. Pointers to sealed truths name only ID and route.

### Harry Potter (`docs/worlds/harry-potter/`)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-1 | **The tabloid is sometimes right.** The Quibbler prints absurd creature stories (general knowledge). Default: one column per issue is a joke-hint about a creature or place in another world; most columns are honest nonsense. | A canon in-world joke paper is a perfect HF2 carrier. Its readers already expect nonsense. |
| PW2-2 | **Joke-shop product names.** A Weasleys' Wizard Wheezes-style joke product (general knowledge for the shop) is named after a power from another world, sold as a prank. | A prank item that echoes a real cross-world power is funny either way. It can point at JJK or LOTM mechanics as a pun. |
| PW2-3 | **Chocolate frog card footnote.** A collectible card's bio has a line about "travels beyond any map" with a place name the player later meets. | Cards are collected and reread. A second read after first arrival is HG2 in its purest form. |
| PW2-4 | **Wand lore aside.** A shop assistant's joke about wands "with opinions" points at HP-SEAL-1 via the wandmaker or research route. No content. | A joke is a soft first clue for a rerolled truth, and its pool changes per copy (SS4). |
| PW2-5 | **Real-life nod.** Nicolas Flamel is a real historical name in both canon and history (general knowledge). Default: a library title about him is plain flavor. | A harmless real-life wink that needs no lookup. |

### D&D / Forgotten Realms (`docs/worlds/dnd/`)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-6 | **The unreliable guidebook.** A Volo-style travel writer known for embellishment (general knowledge) has a chapter on a "hamlet where days repeat". The chapter is a joke here and describes a real looping place elsewhere (COI1 hamlet, MOL loop). | A canon in-world unreliable author is the right speaker for a true joke. |
| PW2-7 | **Bard's tavern song.** The town bard's comic verse rhymes a stranger's name into a chorus (HF3); that name belongs to a person in another world. | Bards repeat. The song carries across visits without forcing it. |
| PW2-8 | **Electrum jokes.** Nobody wants electrum (DDC27). A merchant jokes that an electrum coin "came from a land where they pay in light"; a coin like it turns up in another world. | Turns an existing fan joke into HF7. |
| PW2-9 | **Inn rumor board.** One posted rumor is a scenario joke that points at DND-SEAL-1 via the rumor and investigation route. No content. | Uses the already planned rumor route; joke pools differ per copy. |
| PW2-10 | **A miniature space hamster.** A Boo-style tiny companion (general knowledge) is mentioned as a bar joke; a comparable odd pet exists in the home Village. | A fan-noticeable wink that also links home. |

### A Soldier's Life, book world 1 (private pack)

Public-safe: generic texture only; names and places stay in the private pack.

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-11 | **Marching song verse.** Soldiers sing a crude verse about "the quartermaster's bottomless bag". Default: a joke about supply. Second read: it rhymes with a storage-type power in another world. | Low density fits the world (HG11). One song, sung often, is enough. |
| PW2-12 | **Mess-bench carving.** A carved name on a bench (SL27) matches a name heard in another world's log. | A quiet, lived-in hint that fits a grounded military place. |
| PW2-13 | **Barracks nickname.** A comrade's mocking nickname for the player matches an epithet the player earns later elsewhere. | Shows a world talking about you, and the nickname pays off as foreshadowing. |
| PW2-14 | **Joke about where the stores go.** A clerk's gag points at W1-SRC-13's discovery route. A veteran's tall tale points at W1-SRC-26's route. No content. | Sealed routes get soft early clues without breaking their sealing. |

### TTKS, five books

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-15 | **B1: the parrot that says the wrong name.** The parrot detector is shown in the book. Default: a pet bird squawks a name from another world as a joke. | Animals are deniable speakers (HF9). The same name can show up in B2's simulated friend list. |
| PW2-16 | **B2: joke trait names.** Infinite porridge is shown. Default: some drawn traits have joke names that describe a real mechanic in another world in plain words. | The draw already shows names; a name that clicks later is HF15. |
| PW2-17 | **B3: the stolen notebook margin.** A stolen dossier (TT9) has a scribbled joke from an earlier attempt that points at another book's world. | Cross-book join in a world that already treats notes as objects. |
| PW2-18 | **B5: the power bill line item.** A meter reading lists a charge from "the other plant". Second read: TT16's cross-world power link. | A boring document as a hint carrier is funny on its own. |
| PW2-19 | **Sealed hooks.** A B1 street joke points at TT28's B1 volume-two hook route; a B4 estate AI quip points at TT28's deleted-record route. No content. | Open book hooks stay sealed; jokes add evidence only (SS9). |

### Mother of Learning (`docs/worlds/mother-of-learning/`)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-20 | **"Have we done this before?"** A classmate jokes that the first day "feels like a rerun". Default: one line, early. Second read: the loop is real (public canon, general knowledge). | Canon twist is public, but the joke still lands differently on the second loop. |
| PW2-21 | **Xvim's basic exercise.** The running joke (MOL26) repeats each loop. Dial: on a late loop he repeats a phrase that matches a teacher in another world. | A repeated joke inside a loop world is the natural carrier for repetition across worlds. |
| PW2-22 | **Annoying little sister.** A Kirielle-style sibling's made-up word (general knowledge for the character) turns out to be a real term in another world. | Children as carriers (HF17), with family warmth. |
| PW2-23 | **Investigation joke.** A gossip line points at MOL-SEAL-1 via its investigation route. Per-copy hint pool (SS4). No content. | The rerolled answer changes which jokes the player hears. |

### Lord of the Mysteries (QLM, owners in `WORLD_CARDS.md` §4)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-24 | **Roselle's diary as a canon meta layer.** The book has an emperor whose diaries and inventions carry another world's culture into this one (general knowledge). Default: a diary page has a joke that points at another YAIRPG world, written as the emperor's aside. | Canon already does "a joke from elsewhere is a real pointer". Using it is faithful, not added. |
| PW2-25 | **The narrator's inner voice.** Klein's dry, self-mocking inner commentary is a canon tone (general knowledge). Default: the log voice in this world allows one quip per session; some quips are HF13 gags about other worlds. | Matches the source's humor and keeps density medium (HG11). |
| PW2-26 | **Newspaper ad.** An odd classified (LM8's typesetter start) reads as a prank and is a real summons from another world's faction. | Uses an existing start position as the hint's first reader. |
| PW2-27 | **Changed clipping.** A comic headline points at QLM-R1 via the clippings-versus-archive route. No content. | Stays within the reserved slot. |
| PW2-28 | **Fan-known "praise the sun" gesture.** A gesture and phrase that fans read as a nod to a real game (general knowledge, labelled as fan reading). Default: decorative real-life wink. | Harmless real-life nod that fans enjoy. |

### Circle of Inevitability (QCI, owner private CoI WORLD_BRIEF)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-29 | **Village joke about tomorrow.** In the looping hamlet (COI1), a villager jokes "see you yesterday". Default: flavor. Second read: the local clock. | A one-line joke that teaches the world's rule after the fact. |
| PW2-30 | **The writer sister's odd phrases.** The sequel has a novelist whose writing carries phrases from elsewhere (general knowledge, check against the private brief). Default: one phrase points at LOTM's era or another YAIRPG world. | Canon meta layer continues from LOTM, so cross-world jokes are native here. |
| PW2-31 | **Theater script.** A comedy at the night theater (COI2) has a scene that mirrors a real event in another world. | The night economy gets a hint carrier that also pays tips. |
| PW2-32 | **Pact ledger margin.** A witness's joke in the ledger points at QCI-R1 via the pact ledger witness route. No content. | Reserved slot gets a soft clue. |

### Shadow Slave (QSS, owners in `WORLD_CARDS.md` §5)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-33 | **The Spell's dry descriptions.** The Spell's notices read with dry wit in canon (general knowledge). Default: one rune descriptor per region is a pun that names another world's power family. | The world's system voice is the hint carrier, so it fits the log voice (SS6 presentation). |
| PW2-34 | **Sarcasm from someone who cannot lie.** Sunny's Flaw of being unable to lie is public (general knowledge). Default: a character with a no-lie Flaw jokes, and the joke is literally true. | A canon rule makes a joke into a guaranteed hint. Great HG9 contrast with liars. |
| PW2-35 | **Night-hall graffiti.** Sleepers scratch jokes on guarded hall walls (SS1). One points at a dream place in COI10's dream-festival copy. | Two dream worlds linked by graffiti. |
| PW2-36 | **Enclave sounds.** A guard's joke about "the night chorus" points at QSS-R1 via the two SS-S04 clue routes. No content. | Per-copy hint pools, matching QSS7's changed nights. |

### Home Village (`docs/worlds/original-frontier/`)

| Code | Consideration | Why it matters |
|---|---|---|
| PW2-37 | **The elder's tea joke.** The proposed tea joke (CHARACTERS_AND_WORLD_EVENTS line 399) gets one variant that names a tea from another world. | Home is where the player starts, so home jokes are the earliest HG5 hints for every world. |
| PW2-38 | **The peddler's pitch.** The peddler (OF5) sells "a coin from a land of five metals" (D&D) or "a book that makes you sad to read" (LOTM's contagious reading, LM5). | One NPC seeds many worlds without spoiling any. |
| PW2-39 | **The cat's name.** Proto23 blocks one name prefix with a joke line (shown). Default: some names get a quiet reaction from the elder ("odd name; a traveler used it once"), pointing at a real world. | Turns a player-chosen name into a soft link. Purely cosmetic. |
| PW2-40 | **Children's counting rhyme.** The rhyme counts to a number that matches a real count in another world (veins, pathways, Spell ranks). | HF17 at home. A count is checkable later. |
| PW2-41 | **A reserved home slot.** If home ever gets a sealed truth, its hint pool starts with the elder and the peddler. Proposed slot HOME-H1, no truth authored. | Keeps the pattern ready without inventing a secret. |

## 5. Systems (SY)

| Code | Consideration | Why it matters |
|---|---|---|
| SY1 | **Hint registry data card.** Shape: `{ id, world, carrier: 'joke'|'song'|..., text_key, speaker, places, stage_gate (skill or none), target: pointer-id | null, candidate: id | 'any', drift, density_weight, tags }`. Default: static data in the world package, no save fields. | One card type for every form in HF. Lints read it directly. |
| SY2 | **Sighting log.** Save: per life, a small set of hint IDs seen, with world and day. Default: optional field, migration fills empty. | The only save cost of the whole feature. Small and append-only. |
| SY3 | **Notebook "huh" entries.** A sighted hint that passes its skill gate appears as an unnamed entry: "Odd: a song about a bottomless bag." Stage: sensed. | Uses the existing Notebook and knowledge stages; no new window (rule 8). |
| SY4 | **Retroactive link moment.** On meeting a target, the engine finds sighted hints with that pointer and links them: the entry fills in with "heard in X on day N, from Y". | The payoff in HG6. One lookup on target events. |
| SY5 | **Click treatment.** Log: the original line is re-quoted in its old world's tint (V6), with a thin thread glyph to the new line (fate's thread style from the presentation doc). VFX: a short underline sweep. Reduced motion: underline only. | Makes the click feel earned without being loud. Reuses existing effect families. |
| SY6 | **Offline surfacing.** While away, letters, peddler visits and rumor carriers can deliver hints (EV6, OF4). Default: at most one hint per offline report. Dial: none to several. | Idle return gets a small mystery to read. Keeps hints paced across real time. |
| SY7 | **Offline narrator jokes.** The "while you were away" narrator (existing proposal) can tell a joke that is a hint. | One carrier already planned gets a second job. |
| SY8 | **Convergence counter.** When three sightings share a pointer from different speakers, the entry moves to suspected (HG4) and the Notebook groups them. | Rewards breadth of play across worlds. |
| SY9 | **Red-herring closure.** When the player disproves a herring (visits the place, asks the speaker), the entry closes as "just a joke", with its own small log line. | A closed joke is a small win, not a dead end. |
| SY10 | **Hint gallery in the Proving ground.** Dev face lists all hint cards for a world, fires sightings and links on a fresh test origin, prints IDs only. | Makes authoring and sealed testing cheap. |

## 6. Expanding each possibility (EP)

Applying "one idea, many forms" (E8 axes: object, mechanism, trigger, certainty, scope, price, limit, visibility, persistence, growth) to the joke-hint itself.

| Code | Consideration | Why it matters |
|---|---|---|
| EP1 | **Hint as currency.** An odd joke can be traded to a collector, a scholar or an info broker (secrets as goods). Price rises with convergence. | Turns hint-hunting into a small economy and a reason to talk to people. |
| EP2 | **A hint that lies.** A trickster or rival plants a joke-hint with a false pointer. Default: planted hints carry the planter as speaker, so Haggling or Perception can catch them. | Uses bluff rules (you can only be fooled by what you have heard of). |
| EP3 | **Hint from a future self.** A past or future version (loop worlds, simulator, echoes) leaves a joke only you would get. Certainty: likely, not exact. | Fits MOL, B2's simulator and the SELVES doc. The joke is personal. |
| EP4 | **Hint only one body can hear.** A species, bloodline or Flaw hears a line others don't (high pitch, dream channel, rune sight). Visibility: body-gated. | Gives body choice a reason in mystery play. |
| EP5 | **Hint as a living rumor.** The hint spreads and mutates on its own; a later version is closer to the truth or further away (HG10 as a growth axis). | The world keeps working on the hint while you are away. |
| EP6 | **Hint you write yourself.** The player can tell a joke to an NPC; if it is true elsewhere, NPCs in other worlds may repeat it back later. | The player becomes a carrier, and the multiverse echoes them. |
| EP7 | **Hint inherited.** An heir finds the parent's joke in a letter or journal (ST5 inheritance letter). Persistence: the line carries, the understanding does not. | A succession texture: you laugh at your dead parent's joke and then get it. |
| EP8 | **Hint with a price.** Some jokes are dangerous to understand: in LOTM, getting the joke can draw attention. Price: sanity or notice. | Makes certain hints risky in worlds where knowledge bites. |
| EP9 | **Hint that only works once read aloud.** A rhyme recited at the right place opens a small thing (a hidden door, a merchant's back room). Trigger: spoken in place. | A joke becomes a key without becoming a puzzle box. |
| EP10 | **Hint that expires.** A joke about a coming event stops being a hint after the event passes (secrets that move). Default: the Notebook marks it stale. | Rewards acting early and fits natural course. |
| EP11 | **Shard hints.** Each world holds one word of a longer joke; the whole line only reads after visiting several. Scope: multi-world. | A long-horizon collection goal with no stat bonus, like Proto23's long-tail titles. |
| EP12 | **Meta hint about the save.** A meta character jokes about something the player did in another world on this save. Reach: R3. Safety: reads only game state, not real data. | A fourth-wall form that proves the multiverse remembers. |
| EP13 | **Hint as a cheat aspect.** A daily-intelligence cheat (CHEAT_COSMOLOGY) delivers its intel as a joke the player decodes. Certainty: riddle. | One existing cheat gets a distinct flavor. |

## 7. Suggestions (ranked cheapest builds, with save impact)

| Code | Consideration | Why it matters |
|---|---|---|
| OA1 | **Hint registry cards plus three home Village hints (PW2-37, 38, 40) and two red herrings.** Static data only. Save impact: none. | Proves the authoring shape and the lints (SS1, SS7) with zero save risk. |
| OA2 | **Sighting log and Notebook "huh" entries (SY2, SY3).** Save impact: one optional per-life set of seen hint IDs; migration defaults to empty; old saves start with nothing seen. | The only save change the feature needs. Verify with save, reload and import. |
| OA3 | **Retroactive link on first arrival (SY4, SY5) for one cross-world pair**, such as the peddler's five-metal coin linking on first D&D arrival. Save impact: link state derived from sightings plus visited worlds, no new field. | The full payoff loop in one example. |
| OA4 | **Cross-world loading tips (HF14).** Tag five existing-style tips with target pointers. Save impact: none beyond OA2. | Reuses a planned carrier; fast to author. |
| OA5 | **One offline letter hint (SY6).** The offline report can include one hint line. Save impact: none beyond OA2 (the sighting is recorded like any other). | Idle-native surfacing with no new system. |

Sealed IDs touched (ID and route only): HP-SEAL-1, DND-SEAL-1, MOL-SEAL-1, W1-SRC-13, W1-SRC-26, TT28, QLM-R1, QCI-R1, QSS-R1 (with SS-S04 routes). HOME-H1 is a proposed empty slot.
