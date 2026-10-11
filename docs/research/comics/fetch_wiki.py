# Minimal MediaWiki API helpers used for the 2026-10-10 comics pilot.
# Usage: PYTHONPATH=docs/research/comics python3, then: from fetch_wiki import catinfo, members, wikitext
# Raw pulls go to docs/research/comics/raw/ (gitignored).
import json, sys, time, urllib.request, urllib.parse
UA = "YAIRPG-research-pilot/0.1 (personal, low-rate)"
def api(wiki, **p):
    p.setdefault("format", "json")
    url = f"https://{wiki}.fandom.com/api.php?" + urllib.parse.urlencode(p)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    time.sleep(0.4)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)
def members(wiki, cat, typ="page|subcat", limit=500):
    out, cont = [], {}
    while True:
        d = api(wiki, action="query", list="categorymembers", cmtitle=cat, cmlimit=limit, cmtype=typ, **cont)
        out += d["query"]["categorymembers"]
        if "continue" not in d: return out
        cont = {"cmcontinue": d["continue"]["cmcontinue"]}
def wikitext(wiki, page):
    d = api(wiki, action="parse", page=page, prop="wikitext", redirects=1)
    return d["parse"]["wikitext"]["*"] if "parse" in d else None
def catinfo(wiki, titles):
    d = api(wiki, action="query", prop="categoryinfo", titles="|".join(titles))
    return {v["title"]: v.get("categoryinfo", {}) for v in d["query"]["pages"].values()}
