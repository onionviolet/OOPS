# TA2 documentation checks

2026-10-14. DOC/SOURCE inspection only, no gameplay proof. Python structural/link check ran against all lane Markdown files and current profile-owner inventories.

```json
{
  "profiles": 120,
  "example_table_rows": 720,
  "profile_counts": {
    "BOOK_PROFILES.md": 37,
    "PLAYABLE_PROFILES.md": 11,
    "ANIME_AND_GAME_PROFILES.md": 15,
    "COMIC_PROFILES.md": 39,
    "ORIGINAL_AND_OTHER_PROFILES.md": 18
  },
  "local_links": 759,
  "anchors": 122,
  "coverage": {
    "p9": {
      "profile_owner_files": 39,
      "unmapped": []
    },
    "p10": {
      "profile_owner_files": 17,
      "unmapped": []
    },
    "gx1": {
      "profile_owner_files": 13,
      "unmapped": []
    }
  },
  "reviewed_ta1": "d79a99d1ec152b60e98329bf7e0f72765105ae4f",
  "ta1_table_sha256": "f523e3c9a395ab8e270f03aaa2c130ba5d3663e5aab318fa2cbef3c0195f336f",
  "errors": []
}
```

The check artifact had no links at validation; all 759 lane links resolved. Shared source files were read only. Six table rows per profile plus Frontier.A7 and the Cyoria bread packet example yield 722 unique asks. Source presence and document consistency do not prove acquisition, settlement, browser behavior or save compatibility.
