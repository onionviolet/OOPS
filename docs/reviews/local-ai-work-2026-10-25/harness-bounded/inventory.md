# Tool Registry Inventory

- Total tools: **41**
- Launch rows with a non-empty probe: **20**
- Launch rows without a probe: **11**
- Rows missing an owner: **27**
- Duplicate IDs: **0**
- Required path references (launch rows): **40**
- Unique required path strings (launch rows): **38**

## Counts by kind

- launch: 31
- reference: 10

## IDs by kind

- launch: calibre, cpp2il, discord, discord-desktop, discord-web, dotnet, epub-prepare, ffmpeg, game-mcp, ghidra, headless-bench, il2cpp-dumper, ilspy, lncrawl, manga-text, pdf2md, pdftotext, perf, playtest, rea, rea-pinned, replay, simfuzz, source-library, source-library-bootstrap, source-library-services, tesseract, test-queue, unitypy, zlibrary, zlibrary-mcp
- reference: assets, browser, connectors, discord-exporters, gearscope, mockups, rea-source, saved-sources, signal-quarry, vimeo-transcript

## Notable IDs

### Launch with non-empty probe: 20

calibre, cpp2il, discord, dotnet, epub-prepare, ffmpeg, game-mcp, ilspy, lncrawl, manga-text, pdf2md, pdftotext, rea, rea-pinned, source-library, source-library-bootstrap, source-library-services, tesseract, unitypy, zlibrary

### Launch without a probe: 11

discord-desktop, discord-web, ghidra, headless-bench, il2cpp-dumper, perf, playtest, replay, simfuzz, test-queue, zlibrary-mcp

### Missing owner: 27

calibre, cpp2il, discord, discord-desktop, discord-web, dotnet, epub-prepare, ffmpeg, ghidra, headless-bench, il2cpp-dumper, ilspy, lncrawl, pdf2md, pdftotext, perf, playtest, replay, simfuzz, source-library, source-library-bootstrap, source-library-services, tesseract, test-queue, unitypy, zlibrary, zlibrary-mcp

> Note: This inventory describes the registry metadata only. The presence or absence of a `probe` field, a non-empty `probe` list, an `owner`, or `required` paths is configuration, not proof that any tool is installed, resolvable, or has executed successfully. Probe configuration is not installation or successful-execution evidence. No tool was probed, launched, installed or its placeholders resolved.
