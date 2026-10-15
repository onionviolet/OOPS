# A03: Implementation architecture

Status: PARTIAL

Sources: S01; S02; S06; S12

SHOWN: Construct 3 NW.js export, six layouts and six event sheets; JSON content arrays and serialized events reference generated JS expressions. A static decoder joins the 296 reference entries and 10,832 expression entries while retaining bindings. Main runtime also contains standard engine/plugin code, so its size is not all authored gameplay. Full event ordering, hot-path cost and every subsystem reader are not audited.

PROPOSALS for YAIRPG:

P16/P22: distinguish definitions, mutable native instances and display text. Engine/content owners; K1/K18/K33/K34.

Reuse existing native consumers and validation. Do not import this event engine or numeric save layout.
