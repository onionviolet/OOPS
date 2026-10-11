# Minimal Fanlore (MediaWiki) API helpers for the 2026-10-10 fan fiction pilot.
# Raw pulls go to docs/research/fanfic/raw/ (gitignored).
import json, time, urllib.request, urllib.parse
UA = "YAIRPG-research-pilot/0.1 (personal, low-rate)"
def api(**p):
    p.setdefault("format", "json")
    url = "https://fanlore.org/w/api.php?" + urllib.parse.urlencode(p)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    time.sleep(1.0)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)
