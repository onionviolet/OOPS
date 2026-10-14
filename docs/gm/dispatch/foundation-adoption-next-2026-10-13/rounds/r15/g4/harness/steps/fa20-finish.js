await h.record('fa20-A-occupied-control');await h.click('Cancel work · return reserved inputs');await h.record('fa20-A-cancelled');
await h.click('Fit two dry offcuts with your drafted stops');await h.record('fa20-B-stave-pending');await h.persist('fa20-B-stave-pending');await h.advance(4);await h.record('fa20-B-stave-completed');
await h.click('Cut one drafted survey kit');await h.record('fa20-B-kit-pending');await h.advance(4);await h.record('fa20-B-kit-completed');
await h.click('Accept the association supply commission');await h.click('Read the ordinary-craft supply attempt terms');await h.click('Accept an ordinary-craft supply attempt');await h.record('fa15-ordinary-supply-accepted');
await h.click('Deliver 3 kits');await h.record('fa20-kit-downstream-fa15-supply-completed');
return await h.persist('fa20-final-fa15-supply');
