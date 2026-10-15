# A04: Save and persistence

Status: PARTIAL

Sources: S07; S08; S13; scripts/c3runtime.js Arr.GetAsJsonString/JSONLoad

SHOWN: custom gameplay array plus metadata are serialized into normal/backup slots via LocalStorage or NW.js text files; settings use a separate dictionary. Plane location and progress are positional saved fields. Packaged save.json is only a zero template. All actual player saves and record files remained unread. No atomic publication, corruption recovery, compatibility migration, offline timestamp settlement or Cloud behavior is proved.

PROPOSALS for YAIRPG:

P24/P16 and IR4: restore complete native state coherently and pin saved meaning. Persistence/world-state owners; K18/K33.

Backups need a validated recovery path. Multiple writes do not prove atomic durability.
