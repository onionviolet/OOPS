# Lane N sources and evidence

Selection and metadata: ../broad-scout/CANDIDATES.json and SERIES.json, frozen by SELECTION.json. No chapter claims derive from a search snippet. Each chapter claim is paraphrased, with member/hash/locator, narrator or character mode, and caveat.

## Direct chapter sources

- pale-lights:37216265a44a: [pale-lights:37216265a44a](https://palelights.com/2022/08/17/chapter-1/) | SHA-256 8aac3e7a6a2431970b203fe8caf1eb9e3bf3200c79810d8c52d8d82dc857e7a0 | all narrative text read.
- pale-lights:549a46e155b8: [pale-lights:549a46e155b8](https://palelights.com/2022/08/17/chapter-2/) | SHA-256 cda6f106a902fa4604de7fecd0d1085cc8a99c13399d7fb4a8e697860310081d | all narrative text read.
- pale-lights:f1c0492950d8: [pale-lights:f1c0492950d8](https://palelights.com/2022/08/26/chapter-3/) | SHA-256 ae8c34a35936c3f5d02b819a26dce833281f826340e04a61d6e5eb670febc921 | all narrative text read.
- book-eater:946c36c60447: [book-eater:946c36c60447](https://www.wuxiaworld.com/novel/book-eater/be-chapter-1) | SHA-256 8c205c7afb3bc7697e7bfcc8e0dc2b9ced1889ed719dda5de19257ae8d282832 | all narrative text read.
- land-mines-web:cf0463350dff: [land-mines-web:cf0463350dff](https://ncode.syosetu.com/n0350em/2/) | SHA-256 801cf9d21d7a88daaf574ffa24f0037a9b37ed03b8325811e91d0e807dc7dad2 | all narrative text read.
- book-eater:8ec271b8c25a: [book-eater:8ec271b8c25a](https://www.wuxiaworld.com/novel/book-eater/be-chapter-2) | SHA-256 7fea3675612dedbd3120d75135f7b6caf9387bcaa29a1ef4e1131986a672bc3f | all narrative text read.
- book-eater:0941bda679f9: [book-eater:0941bda679f9](https://www.wuxiaworld.com/novel/book-eater/be-chapter-3) | SHA-256 6b9c62fc5c900ee753e7e646de833e29da2be5106b536e8ddc1654abcad7b115 | all narrative text read.
- making-magic-web:f887d34cc24d: [making-magic-web:f887d34cc24d](https://ncode.syosetu.com/n4154fl/2/) | SHA-256 20085a169e3e3bd68a537b9b501e66a0fdf62cad290890d9fc41cc8a854308f8 | all narrative text read.
- making-magic-web:cae62499d701: [making-magic-web:cae62499d701](https://ncode.syosetu.com/n4154fl/3/) | SHA-256 ea083c6f016435fcaefd67960807235173b25304a50f3186d15b65a87155c59c | all narrative text read.
- d-genesis-web:ac133690ec97: [d-genesis-web:ac133690ec97](https://kakuyomu.jp/works/1177354054894181631/episodes/1177354054894181655) | SHA-256 b52e037c2963a3288699d112f30dab0d8dedb8c2e61da294719fd98f7475014d | all narrative text read.
- d-genesis-web:7e3a4117805e: [d-genesis-web:7e3a4117805e](https://kakuyomu.jp/works/1177354054894181631/episodes/1177354054894381387) | SHA-256 ae800143b0cb18b5365b9ddf54abc5a77ae80571a9c4f358d1c086d7ca994a4d | all narrative text read.

## Acquisition receipts

ROUTES.json records official landing qualification. ACQUISITION.json records normal chapter requests and extraction. EPUBS.json records five offline FanFicFare packages, 11 chapters total. Private transport/requests.jsonl stores UTC, status, bytes, hashes and host refusal receipts. No source-library rewrite, login or purchase.

Royal Road and Qidian disallow GPTBot. Webnovel and Wuxiaworld each served a challenge; Wuxiaworld chapters 1-3 were already acquired before chapter 4 stopped the host. J-Novel returned 308 and was not followed. Tappytoon free-page bodies were not rendered; no guest/API credential used. All other same-host candidates reuse the refusal instead of retrying.

## Tool scope

The supplied polite CLI supports Fanqie only; no selected title had a verified legitimate Fanqie edition. The Royal Road FanFicFare attempt used fff_polite.py and stopped at robots. For normal publisher/author HTML, the existing lncrawl-polite Client provided the same policy transport; package_epubs.py used FanFicFare offline for EPUBs. This is not a claim that the stock CLI supports these publishers. Source texts/cache and reading notes stay gitignored.

## Edition and evidence limits

Japanese sources are original web editions, not verification of English light-novel editions. Pale Lights is original Book 1 (2022), not the similarly numbered 2023 Book 2 pages. Book Eater is Wuxiaworld licensed English text. Five bounded samples are not five completed books. Metadata-only series retain null exact rules. No remembered source claims were promoted.
