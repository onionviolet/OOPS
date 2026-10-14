await h.click('Use the admitted physical self guard');await h.record('fa15-pad-used');await h.advance(2);await h.record('fa15-pad-incoming');
await h.click('Withdraw with spent inputs retained');await h.record('fa15-pad-withdrawn');
await h.advance(2);await h.record('fa15-pad-withdrawn-plus2');
return await h.persist('fa15-pad-final');
