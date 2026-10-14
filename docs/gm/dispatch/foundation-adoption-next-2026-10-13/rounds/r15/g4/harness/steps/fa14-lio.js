await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-residents.txt'));await h.play();
return {buttons:await h.buttons('Lio'),s:h.digest(await h.save()),errors:h.errors};
