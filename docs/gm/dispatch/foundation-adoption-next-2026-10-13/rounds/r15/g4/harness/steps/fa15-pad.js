await h.click('Work one kit into a guard pad');await h.advance(3);await h.record('fa15-pad-crafted');
await h.persist('fa15-pad-held');await h.click('Challenge: Reserve one actual kit brace pad');
await h.record('fa15-pad-admitted');return {buttons:await h.buttons('guard'),all:await h.buttons('brace'),withdraw:await h.buttons('Withdraw'),errors:h.errors};
