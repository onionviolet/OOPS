# OOPS

**Optimistic Progression Simulator**. OOPS is the stylized name, with an extra O because we like it.

A personal text-based RPG by Weibao, exploring discovery, experimentation and progression across distinct worlds. Based on Miktaew's **Yet Another Idle RPG** v0.6 development source, itself inspired by Proto23.

See [PROJECT.md](PROJECT.md) for scope, setup and current work, and [AGENTS.md](AGENTS.md) for agent instructions.

## Credits and upstream

- [OOPS repository](https://github.com/onionviolet/OOPS)
- [Yet Another Idle RPG by Miktaew](https://github.com/miktaew/yet-another-idle-rpg) · [original release](https://miktaew.github.io/yet-another-idle-rpg/)
- [Upstream development repository](https://github.com/miktaew/yet-another-idle-rpg-dev) · [development release](https://miktaew.github.io/yet-another-idle-rpg-dev/)

OOPS is a fork, with original upstream attribution and LICENSE retained. The new name does not change existing saves, internal identifiers or repository URLs.

---
Be warned, the game balance remains a WIP
Using the "export" feature every now and then is highly recommended, even on main release, since there's always a risk of some gamebreaking bugs having made it through the testing undetected

---
##### Running
To run the project locally, you will need a server - even a most basic static server will be enough, as it's only about CORS policy. Npm module 'live-server' works perfectly for this purpose https://www.npmjs.com/package/live-server

##### Modifying/Modding and making standalone projects using this as an engine
Making actual changes in code will require either running the build script (`npm run build`) after installing esbuild, or simply changing script source in `index.html` from `dist/bundle.js` to `src/main.js`

When creating content or changing code logic, it's recommended to at the very least take a look at the dev repository, as there's always a possibility it already contains things you wanted to add, or has code changes that will make your work easier, or at least has a fix to a bug you found

Please keep in mind that the default branch you will see here is the `master` branch, while the one that's hosted is the `gh-pages` branch; on dev, the former might often have code that does yet not correspond to what you will see while playing

Consider also calling `Verify_Game_Objects()` in the console, which is a custom built-in tool that will go through most of the content, checking things like properties having acceptable values, or references to other objects being correct. While neither infallible nor covering *everything*, it might save you a lot of time and annoyance.

###### If you make an actual mod, it will be highly appreciated if you mention that it is a mod and not a completely original creation, as well as provide a link to the original. If you can, please also make make it as a fork of either repository, or at least let me know about its existence.