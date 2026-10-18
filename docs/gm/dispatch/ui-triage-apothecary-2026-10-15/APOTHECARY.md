# Lane APOTHECARY: the Village apothecary

Read `COMMON.md` in this folder first and check its precondition (foundation S3 complete and TRIAGE finished).

Goal (AP1–AP5 in the owner doc): the Village mixing counter becomes the **Village apothecary**, a place with a keeper, entered from Local actions as a place service (ST2).

1. **Keeper.** One original named keeper (not a franchise character) with role, a few traits, opening hours tied to the existing calendar, and a relationship that grows from buying, selling and good vials. The keeper shows in the focus panel while you are at the apothecary, with memory lines drawn from actual receipts only.
2. **Same mechanics, new frame.** Mixing, ingredients, methods, queue, exposure and products work exactly as now. Internal ids (`village.mixtures@1`, `MIXTURE_ID`, save field `mixtures`) and product ids stay unchanged. Labels, headings and text change to the apothecary framing. Ingredient purchases become the keeper's stock.
3. **Access.** Outside opening hours the bench is closed with a clear reason and next opening time. Already queued work keeps its existing rules; do not cancel it because the shop closed. Decide and document whether working the bench costs a fee or needs permission; default to a small bench fee or free with a friendly relationship, stated in the UI.
4. **Bottom back bar** ("← Village") from the foundation lane, plus Esc.
5. **Scope limits:** no home bench (AP2), no other-world versions (AP3); record them as follow-ups in the report.
6. Checks: `node build.js`; `npm test`; browser driver on a fresh origin: open, closed hours, buy ingredients, mix, queue, cancel, focus panel shows keeper, back bar and Esc, an **existing save with mixtures and learned methods** loads and keeps them, save/reload, Export and literal-file Import. Screenshots at 1366×768.
7. Report: `APOTHECARY_REPORT.md` with changes, save-compatibility statement, evidence and open items. Then add a short dated line to `PROJECT.md` and the owner doc (re-read from disk, hunk only).
