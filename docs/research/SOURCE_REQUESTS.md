# Source requests for Weibao

Started 2026-10-10. Weibao: "send out broad research, but then make a point
to make me find source material if need be". Research lanes add a row here
when they need text they can't get politely by script (Cloudflare checks,
login walls, paid chapters, robots refusals). Weibao fetches it in his own
browser and drops the file in the inbox. Agents don't pass bot checks or log
in for him.

## Start here (triage, 2026-10-10)

You don't need to do most rows. In order of value:

1. ~~S1–S5~~ done 2026-10-10 (all five ttks books; see
   `docs/research/novels/ttks-novels-2026-10-10/B*/DEEP_DIVE_2026-10-10.md`).
   Formerly: **S3, then S2** (from chapter 11): the JJK-world book and the
   one-trait-a-year book. Ten free chapters each are already read; the rest
   feeds vows, domains and the law path.
2. **S1, S4, S5**: the other three ttks books, full text.
3. **Wait on the wiki rows (S16 onward).** The wiki lane is retrying them
   through Fandom's public database dumps (no Cloudflare). Rows it covers
   get marked "covered by dump". Only the leftovers will need you.
4. **Lane D's books (S6 to S15)** last. Several are on paid platforms
   (J-Novel Club, Webnovel, Tappytoon, Wuxiaworld); only do those if you
   already have access. The Royal Road ones (S6, S10, S15) may just need a
   normal visit.

## How to fetch (WebToEpub in your Chrome)

1. Install **WebToEpub** (free, open source, by dteviot) from the Chrome Web
   Store, once.
2. Open the book's index page in Chrome. If a "checking your browser" or
   "verify you are human" page appears, pass it yourself as normal.
3. Click the WebToEpub icon. It lists the chapters. If the site isn't
   recognized, its default parser usually still works; pick the chapter
   content element if asked.
4. **Be polite:** in WebToEpub's advanced options set pages fetched at once
   to **1**, and add a per-page delay of about **5000 ms** if the option is
   shown. Grab what you want to read now, not the whole site.
5. Save the EPUB into
   `~/code/yet-another-idle-rpg/docs/research/novels/inbox/` (gitignored),
   then tell Claude; the reading lane picks it up.

## Open requests

| ID | Book | Where | Why | Status |
|---|---|---|---|---|
| S1 | 巫师你好，我是伪人 (B1) | https://ttks.tw/novel/chapters/wushinihaowoshiweiren/index.html | Power types; Qidian blocks AI agents, no free mirror | Done 2026-10-10: all 111 ch. via in-page browser fetch, read in full |
| S2 | 一年抽取一词条，模拟的也可以？ (B2) | https://ttks.tw/novel/chapters/yinianchouquyicitiaomonideyekeyi/index.html | Fanqie gave chapters 1 to 10 free; rest locked | Done 2026-10-10: ch. 11–665 fetched, read in full |
| S3 | 咒回：特级的我去死灭打宿傩了！ (B3, JJK world) | https://ttks.tw/novel/chapters/zhouhuitejidewoqusimiedasunuole/index.html | Same; vows, domains and Culling Game | Done 2026-10-10: ch. 11–429 fetched, read in full |
| S4 | 全人类的继承者 (B4) | https://ttks.tw/novel/chapters/quanrenleidejichengzhe/index.html | Inheritance idea; Qidian blocks AI agents | Done 2026-10-10: all 206 ch., read in full |
| S5 | feitubianjingjianchaguan (B5, title to confirm) | https://ttks.tw/novel/chapters/feitubianjingjianchaguan/index.html | Added by Weibao 2026-10-10; resolved to 废土边境检查官 by 斤斤斤 | Done 2026-10-10: all 668 members, read in full |

69shu (69shuba and its other domains) also works as a source in your
browser if a book is there.

## Done

(none yet)

## Lane D: prioritized additional open requests (2026-10-10)

These ten need selected text to confirm exact rules. This scout read only public metadata, so these are not all blocked-download reports. Use a browser-accessible author or publisher edition, or a copy already available to you. The target is the specified rule passages, not every chapter. Keep supplied prose in the existing private inbox. [Scout report](power-systems/broad-scout/REPORT.md).

| ID | Book | Where | Why | Status |
|---|---|---|---|---|
| S6 | The Game at Carousel: A Horror Movie LitRPG (D033) | https://www.royalroad.com/fiction/65629/the-game-at-carousel-a-horror-movie-litrpg | Read the first bystander protection test and one failure or exception. Who judges convincing unawareness? | Open; exact rules need text |
| S7 | Dungeon Reset (D017) | https://www.tappytoon.com/en/book/dungeon-reset-novel | Read the glitch/reset event and first post-reset crafting. What survives: body, objects, skills or construction? | Open; exact rules need text |
| S8 | To Another World... with Land Mines! (D027) | https://j-novel.club/series/to-another-world-with-land-mines/ | Read the initial gift selection and a revealed trap. Establish hidden terms, guide access and actual harm triggers. | Open; exact rules need text |
| S9 | Fine Structure (D048) | https://qntm.gumroad.com/l/ELFop | Use an accessible author edition or a copy you have. Read a discovery and its closure; establish trigger order and law-edit authority. | Open; exact rules need text |
| S10 | Godclads (D034) | https://www.royalroad.com/fiction/59663/godclads | Read the first clear divine-law operation and a contested use. Establish fuel, authority scope and failure costs. | Open; exact rules need text |
| S11 | The Book Eating Magician (D018) | https://www.wuxiaworld.com/novel/book-eater | Publisher title is Book Eater. Read the first consumption and a rejected or constrained transfer; distinguish understanding, author memory and spell execution. | Open; exact rules need text |
| S12 | Trafford's Trading Club (D014) | https://www.webnovel.com/book/trafford%27s-trading-club_6831849802000805 | Read one negotiated trade and its aftermath. Establish valuation, consent, delivered result and what extends the proprietor life. | Open; exact rules need text |
| S13 | Making Magic: The Sweet Life of a Witch Who Knows an Infinite MP Loophole (D026) | https://j-novel.club/series/making-magic/ | Read the actual MP-growth loop and a mana-gated creation. Establish consumed inputs, daily cadence and which limits really apply. | Open; exact rules need text |
| S14 | Astral Apostle (D005) | https://www.webnovel.com/book/astral-apostle_21638395405875905 | Read first vessel creation, departure and return. What memory, ability and local history stays with each carrier? | Open; exact rules need text |
| S15 | Return of the Runebound Professor (D039) | https://www.royalroad.com/fiction/68679/return-of-the-runebound-professor | Read a death/reformation and soul-wound recovery. Establish which injury persists and whether healing has a separate price. | Open; exact rules need text |


## Lane W wiki access requests, 2026-10-10

Raw pages go under `~/.codex/research/wikis/<wiki>/`, outside git. These are access requests, not verified source claims. Do not retry refused hosts during this session.

| ID | Book or wiki | Where | Why | Status |
|---|---|---|---|---|
| S16 | Lane W wiki: chainsaw-man.fandom.com | https://chainsaw-man.fandom.com/wiki/Devil | chainsaw-man.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S17 | Lane W wiki: jujutsu-kaisen.fandom.com | https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow | jujutsu-kaisen.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-02-20 (downloaded 2026-10-10; selected sections reviewed) |
| S18 | Lane W wiki: hunterxhunter.fandom.com | https://hunterxhunter.fandom.com/wiki/Nen?file=Nen_Types_Diagram.svg | hunterxhunter.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-07-01 (downloaded 2026-10-10; selected sections reviewed) |
| S19 | Lane W wiki: undead-unluck.fandom.com | https://undead-unluck.fandom.com/wiki/Negators | undead-unluck.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S20 | Lane W wiki: bleach.fandom.com | https://bleach.fandom.com/wiki/Zanpakut%C5%8D | bleach.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S21 | Lane W wiki: naruto.fandom.com | https://naruto.fandom.com/wiki/Chakra | naruto.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S22 | Lane W wiki: onepiece.fandom.com | https://onepiece.fandom.com/wiki/Devil_Fruit | onepiece.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-08-29 (downloaded 2026-10-10; selected sections reviewed) |
| S23 | Lane W wiki: myheroacademia.fandom.com | https://myheroacademia.fandom.com/wiki/Quirk | myheroacademia.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S24 | Lane W wiki: jojowiki.com | https://jojowiki.com/Stand | jojowiki.com: robots disallow (YAIRPG-wiki-research/1.0 (personal research; AI-assisted; no login)). Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S25 | Lane W wiki: fma.fandom.com | https://fma.fandom.com/wiki/Alchemy | fma.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-07-22 (downloaded 2026-10-10; selected sections reviewed) |
| S26 | Lane W wiki: frieren.fandom.com | https://frieren.fandom.com/wiki/Episode_3 | frieren.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S27 | Lane W wiki: mob-psycho-100.fandom.com | https://mob-psycho-100.fandom.com/wiki/Shigeo_Kageyama | mob-psycho-100.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S28 | Lane W wiki: kimetsu-no-yaiba.fandom.com | https://kimetsu-no-yaiba.fandom.com/wiki/Breathing_Style | kimetsu-no-yaiba.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S29 | Lane W wiki: blackclover.fandom.com | https://blackclover.fandom.com/wiki/Grimoire | blackclover.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S30 | Lane W wiki: en.wikipedia.org | https://en.wikipedia.org/wiki/Denji_%28Chainsaw_Man%29 | en.wikipedia.org: robots disallow (YAIRPG-wiki-research/1.0 (personal research; AI-assisted; no login)). Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S31 | Lane W wiki: dandadan.fandom.com | https://dandadan.fandom.com/wiki/Okarun | dandadan.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S32 | Lane W wiki: kagurabachi.fandom.com | https://kagurabachi.fandom.com/wiki/Enchanted_Blade | kagurabachi.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S33 | Lane W wiki: fire-force.fandom.com | https://fire-force.fandom.com/wiki/Adolla_Link | fire-force.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S34 | Lane W wiki: worldtrigger.fandom.com | https://worldtrigger.fandom.com/wiki/Trigger | worldtrigger.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S35 | Lane W wiki: kaiju-no-8.fandom.com | https://kaiju-no-8.fandom.com/wiki/Defense_Force | kaiju-no-8.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S36 | Lane W wiki: typemoon.fandom.com | https://typemoon.fandom.com/wiki/Command_Spell | typemoon.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-07-21 (downloaded 2026-10-10; selected sections reviewed) |
| S37 | Lane W wiki: reverend-insanity.fandom.com | https://reverend-insanity.fandom.com/wiki/Gu | reverend-insanity.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-08-27 (downloaded 2026-10-10; selected sections reviewed) |
| S38 | Lane W wiki: lordofthemysteries.fandom.com | https://lordofthemysteries.fandom.com/wiki/Acting_Method | lordofthemysteries.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S39 | Lane W wiki: omniscient-readers-viewpoint.fandom.com | https://omniscient-readers-viewpoint.fandom.com/wiki/Star_Stream | omniscient-readers-viewpoint.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S40 | Lane W wiki: towerofgod.fandom.com | https://towerofgod.fandom.com/wiki/Administrator | towerofgod.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S41 | Lane W wiki: solo-leveling.fandom.com | https://solo-leveling.fandom.com/wiki/System | solo-leveling.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S42 | Lane W wiki: the-second-coming-of-gluttony.fandom.com | https://the-second-coming-of-gluttony.fandom.com/wiki/Gluttony | the-second-coming-of-gluttony.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S43 | Lane W wiki: lout-of-counts-family.fandom.com | https://lout-of-counts-family.fandom.com/wiki/Ancient_Power | lout-of-counts-family.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S44 | Lane W wiki: coiling-dragon.fandom.com | https://coiling-dragon.fandom.com/wiki/Power_Hierarchy | coiling-dragon.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S45 | Lane W wiki: i-shall-seal-the-heavens.fandom.com | https://i-shall-seal-the-heavens.fandom.com/wiki/Cultivation | i-shall-seal-the-heavens.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S46 | Lane W wiki: renegade-immortal.fandom.com | https://renegade-immortal.fandom.com/wiki/Cultivation | renegade-immortal.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S47 | Lane W wiki: martial-peak-mp.fandom.com | https://martial-peak-mp.fandom.com/wiki/Cultivation | martial-peak-mp.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S48 | Lane W wiki: releasethatwitch.fandom.com | https://releasethatwitch.fandom.com/wiki/Magic | releasethatwitch.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S49 | Lane W wiki: tbate.fandom.com | https://tbate.fandom.com/wiki/Arthur_Leywin/Abilities | tbate.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S50 | Lane W wiki: overgeared.fandom.com | https://overgeared.fandom.com/wiki/Legendary_Blacksmith%27s_Breath | overgeared.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S51 | Lane W wiki: shadowslave.fandom.com | https://shadowslave.fandom.com/wiki/Spell | shadowslave.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S52 | Lane W wiki: mother-of-learning.fandom.com | https://mother-of-learning.fandom.com/wiki/Magic | mother-of-learning.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S53 | Lane W wiki: wiki.abidanarchive.com | https://wiki.abidanarchive.com/index.php/Path_of_the_Endless_Sword | wiki.abidanarchive.com: redirect HTTP 301; not followed. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S54 | Lane W wiki: worm.fandom.com | https://worm.fandom.com/wiki/Power_Classifications | worm.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S55 | Lane W wiki: coppermind.net | https://coppermind.net/wiki/Allomancy | coppermind.net: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S56 | Lane W wiki: es.wikipedia.org | https://es.wikipedia.org/wiki/El_nombre_del_viento | es.wikipedia.org: robots disallow (YAIRPG-wiki-research/1.0 (personal research; AI-assisted; no login)). Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S57 | Lane W wiki: dresdenfiles.fandom.com | https://dresdenfiles.fandom.com/wiki/Magic | dresdenfiles.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S58 | Lane W wiki: abridged-guide-to-evil.fandom.com | https://abridged-guide-to-evil.fandom.com/wiki/Aspects | abridged-guide-to-evil.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S59 | Lane W wiki: dungeon-crawler-carl.fandom.com | https://dungeon-crawler-carl.fandom.com/wiki/System_AI | dungeon-crawler-carl.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-08-21 (downloaded 2026-10-10; selected sections reviewed) |
| S60 | Lane W wiki: he-who-fights-with-monsters.fandom.com | https://he-who-fights-with-monsters.fandom.com/wiki/Essences | he-who-fights-with-monsters.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S61 | Lane W wiki: marvel.fandom.com | https://marvel.fandom.com/wiki/Category:Power_Systems | marvel.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S62 | Lane W wiki: dc.fandom.com | https://dc.fandom.com/wiki/Emotional_Spectrum | dc.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S63 | Lane W wiki: mtg.fandom.com | https://mtg.fandom.com/wiki/Color | mtg.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S64 | Lane W wiki: darksouls.fandom.com | https://darksouls.fandom.com/wiki/Covenant_(Dark_Souls) | darksouls.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-09-06 (downloaded 2026-10-10; selected sections reviewed) |
| S65 | Lane W wiki: eldenring.fandom.com | https://eldenring.fandom.com/wiki/Incantations | eldenring.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | covered by dump 2026-02-20 (downloaded 2026-10-10; selected sections reviewed) |
| S66 | Lane W wiki: hades.fandom.com | https://hades.fandom.com/wiki/Duo_Boons | hades.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S67 | Lane W wiki: slay-the-spire.fandom.com | https://slay-the-spire.fandom.com/wiki/Dead_Branch | slay-the-spire.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S68 | Lane W wiki: isekai.fandom.com | https://isekai.fandom.com/wiki/Monster_Tamer | isekai.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S69 | Lane W wiki: my-cell-prison.fandom.com | https://my-cell-prison.fandom.com/wiki/My_Cell_Prison_Wiki | my-cell-prison.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S70 | Lane W wiki: soul-of-negary-novel.fandom.com | https://soul-of-negary-novel.fandom.com/wiki/Origin | soul-of-negary-novel.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S71 | Lane W wiki: fantasy-simulator.fandom.com | https://fantasy-simulator.fandom.com/wiki/Chen_Heng/Simulations | fantasy-simulator.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S72 | Lane W wiki: carefree-path-of-dreams.fandom.com | https://carefree-path-of-dreams.fandom.com/wiki/Dream_Master | carefree-path-of-dreams.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S73 | Lane W wiki: vsbattles.fandom.com | https://vsbattles.fandom.com/wiki/Low_Dimensional_Game | vsbattles.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S74 | Lane W wiki: doomsday-wonderland.fandom.com | https://doomsday-wonderland.fandom.com/wiki/Temporary_Right_Of_Abode | doomsday-wonderland.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S75 | Lane W wiki: thebookeatingmagician.fandom.com | https://thebookeatingmagician.fandom.com/wiki/Umbra | thebookeatingmagician.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S76 | Lane W wiki: the-book-eating-magician.fandom.com | https://the-book-eating-magician.fandom.com/wiki/Theodore_Miller | the-book-eating-magician.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S77 | Lane W wiki: the-main-heroines-are-trying-to-kill-me.fandom.com | https://the-main-heroines-are-trying-to-kill-me.fandom.com/wiki/The_Main_Heroines_Are_Trying_To_Kill_Me_Wiki | the-main-heroines-are-trying-to-kill-me.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S78 | Lane W wiki: kidnappeddragons.fandom.com | https://kidnappeddragons.fandom.com/wiki/Kidnapped_Dragons_Wiki | kidnappeddragons.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S79 | Lane W wiki: mysranks.fandom.com | https://mysranks.fandom.com/wiki/The_S-Ranks_That_I_Raised | mysranks.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S80 | Lane W wiki: to-another-world-with-land-mines.fandom.com | https://to-another-world-with-land-mines.fandom.com/wiki/%22Landmines%22_Skills | to-another-world-with-land-mines.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S81 | Lane W wiki: lazydungeonmaster.fandom.com | https://lazydungeonmaster.fandom.com/wiki/Dungeon_Master | lazydungeonmaster.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S82 | Lane W wiki: monster-tamer.fandom.com | https://monster-tamer.fandom.com/wiki/Majima_Takahiro | monster-tamer.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S83 | Lane W wiki: the-magician-who-rose-from-failure.fandom.com | https://the-magician-who-rose-from-failure.fandom.com/wiki/Spells | the-magician-who-rose-from-failure.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S84 | Lane W wiki: the-daily-grind.fandom.com | https://the-daily-grind.fandom.com/wiki/The_Daily_Grind_Wiki | the-daily-grind.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S85 | Lane W wiki: runebound-professor.fandom.com | https://runebound-professor.fandom.com/wiki/Runes | runebound-professor.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S86 | Lane W wiki: the-stubborn-skillgrinder-in-a-time-loop.fandom.com | https://the-stubborn-skillgrinder-in-a-time-loop.fandom.com/wiki/Skills | the-stubborn-skillgrinder-in-a-time-loop.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S87 | Lane W wiki: pale-lights.fandom.com | https://pale-lights.fandom.com/wiki/The_Trials | pale-lights.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |
| S88 | Lane W wiki: oracle-paths.fandom.com | https://oracle-paths.fandom.com/wiki/Dream_Aether | oracle-paths.fandom.com: HTTP 403. Please supply a permitted revision export or saved mechanics page with its URL and revision ID. Titles and desired pages are in wiki-digests/SOURCE_REQUEST_INDEX.json. | Open; no revision acquired |


## Lane N: remaining selected novel text (2026-10-10)

The [crawl report](power-systems/novel-crawl/REPORT.md) records five bounded samples and actual access stops. Existing S6-S15 stay open for their unverified passages. Lane W concurrently used S16-S88 for wiki requests, so novel-text requests continue with unused IDs. EPUBs supplied later go in the private inbox; no watcher continues after delivery.

| ID | Book | Where | Why | Status |
|---|---|---|---|---|
| S89 | Let Me Game in Peace (D003) | https://www.webnovel.com/book/let-me-game-in-peace_15117994305858505 | First phone entry, blood-funded retry and reward export; verify real bodily cost, fidelity and export exclusions. | Open; Webnovel challenge, no chapter read |
| S90 | Losing Money to Be a Tycoon (D004) | https://www.webnovel.com/book/15705498105694305 | First settlement and rejected spending; distinguish company funds, personal funds and qualifying loss. | Open; Webnovel challenge, no chapter read |
| S91 | Information Omniscient / 信息全知者 (D016) | https://book.qidian.com/booklist/detail/644453/ | Publisher-hosted title pointer; open its book entry and obtain first perception/interpretation failure. Verify concept learning, overload and range. | Open; Qidian robots refusal, no chapter read |
| S92 | D-Genesis: Three Years after the Dungeons Appeared (D025) | https://kakuyomu.jp/works/1177354054894181631 | Author Japanese web prologue and chapter 1 read. Need first orb use, analysis function and expiration/storage exception; English LN needs separate source. | Open; Two web chapters read, later exact rules unverified |
| S93 | Markets and Multiverses (D036) | https://www.royalroad.com/fiction/61244/markets-and-multiverses | First return to market and final-death risk; establish rebirth permission, trade currency and retained carriers. | Open; Royal Road robots refusal, no chapter read |
| S94 | Pale Lights (D044) | https://palelights.com/table-of-contents/ | Original Book 1 chapters 1-3 read. Need contract formation, Fisher cost and explicit breach/release case; keep Book 2 numbering separate. | Open; Three author-web chapters read, later exact rules unverified |


## Lane W additional dump-source requests, 2026-10-10

| ID | Book or wiki | Where | Why | Status |
|---|---|---|---|---|
| S95 | Lane W wiki: reincarnation-paradise.fandom.com | https://reincarnation-paradise.fandom.com/ | Public S3 dump route: unavailable_name_guesses. Supply a permitted mechanics-page export with URL and revision metadata. | Open; no dump content acquired |
| S96 | Lane W wiki: stormlightarchive.fandom.com | https://stormlightarchive.fandom.com/ | Public S3 dump route: dump_unavailable_storage. Supply a permitted mechanics-page export with URL and revision metadata. | Open; no dump content acquired |
| S97 | Lane W wiki: mistborn.fandom.com | https://mistborn.fandom.com/ | Public S3 dump route: dump_unavailable_storage. Supply a permitted mechanics-page export with URL and revision metadata. | Open; no dump content acquired |

## Anime and web-novel wave, 2026-10-10

| ID | Book | Where | Why | Status |
|---|---|---|---|---|
| S98 | A Certain Magical Index light novels (Toaru), Kazuma Kamachi | Yen Press English edition, or a copy you own | The Toaru audit is wiki-only. Text would verify the Level system, Personal Reality, AIM, vector-control limits and the magic-side rules. Only if you already own it. | Open; low priority |
| S99 | Re:Zero Arcs 1–4 | Yen Press light novels, or a copy you own | Witch Cult's copies were taken down, so Arcs 1–4 rest on the wiki. Matters for the taboo, early checkpoints, Sanctuary and the Witches' tea party. | Open; low priority |
