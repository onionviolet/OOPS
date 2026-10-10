# Reading Fanqie's scrambled web text (method note)

Saved 2026-10-10 by Claude Code at Weibao's request ("save how the scramble
was decoded"), from the ttks lane's private TOOLING notes
(`docs/research/novels/ttks-novels-2026-10-10/TOOLING.md`, gitignored).
Method only; no novel text, mapping table or raw page here.

## What the scramble is

Fanqie's normal web reader (`/reader/<itemId>`) sends chapter text where
many common Chinese characters are replaced by code points in Unicode's
**private-use area** (from U+E3E8, decimal 58344, upward). The page also
links a small custom web font (a `.woff2`, in this run
`dc027189e0ba4cd.woff2`, a subset of Source Han Sans SC Normal). That font
draws the right character shape at each private-use code point, so the page
looks normal to a reader but the raw text is garbled. It changes
representation only; it is not encryption and does not hide paid text.

## How it was read (2026-10-10)

1. **Only free chapters, normal pages.** Catalogue data gives each
   chapter's `itemId`, order and payment flags. Any chapter flagged
   `needPay`, `isChapterLock`, `isPaidPublication` or `isPaidStory` stops
   that book. No app API, device identity, login, script execution or
   purchase.
2. **Download the font once** from its normal asset URL, after a robots
   check.
3. **Build the code point to character map.** This run used a static table
   from the public repo `techoc/fanqie-novel-api` (`conver.go`), read as
   data; none of that project's code ran.
4. **Verify the map against the font.** FontTools 4.66.1 read the font;
   12 representative glyphs were rendered locally next to their mapped
   characters and checked by eye (a review image kept privately). All
   matched.
5. **Decode** each downloaded page by replacing private-use characters
   through the map. Check: zero private-use characters left in the output.
6. Raw HTML and decoded text stay in the gitignored per-book `sources/`
   folders.

## For our own scraper fork

- Prefer **deriving the map from the font itself** over a copied table:
  render each private-use glyph and match it against the same glyphs in
  the open Source Han Sans font (both are outlines from one family), or
  compare glyph outline hashes. That survives font rotation and avoids
  depending on a third-party table (check `techoc/fanqie-novel-api`'s
  license before reusing its table).
- Detect a font change (new font file name or hash) and rebuild the map,
  then re-verify a sample.
- A generic "captcha" substring check gave a false positive on Fanqie's
  bundled CAPTCHA SDK script; detect real challenge pages by their page
  content and Cloudflare challenge markers (`challenge-platform`,
  `__CF$cv$params`), not by asset names.
- Honor robots rules for named agents too (Qidian's `book.qidian.com`
  robots names OpenAI agents and was respected).
