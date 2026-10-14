await h.click('Survey and register two workshop fixtures');await h.advance(4);
await h.click('Frame your workshop drying rack');await h.advance(5);
await h.click('Finish the ventilated drying rack');await h.advance(4);
return {state:h.digest(await h.save()),buttons:await h.buttons('offcut'),errors:h.errors};
