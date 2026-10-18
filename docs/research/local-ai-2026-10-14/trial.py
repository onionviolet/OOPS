#!/usr/bin/env python3
"""Synthetic YAIR screening. Default dry-run; no downloads or game writes."""
import argparse
import hashlib
import json
import pathlib
import time
import urllib.request

BASE = "http://127.0.0.1:11434/api/"
MODEL = "qwen3.8:27b"
SYSTEM = (
    "You are a YAIR creative and reasoning partner. Treat supplied settled facts "
    "as facts, rumors as claims, and missing facts as unknown. Invent freely only "
    "where requested, labeling new mechanics as proposals. Do not decide the "
    "player's actions or claim proposed events have happened. Answer concisely."
)
CASES = [
    {
        "id": "T01-rule-transfer",
        "turns": [
            "Original world's only known rune laws: a lamp needs one charged reed "
            "and one copper loop. Each reed supplies 6 light-minutes and is consumed. "
            "A loop is reusable after the lamp stops; it cannot run two lamps at once. "
            "Two reeds in one lamp do not stack: only one activates; the other stays "
            "unused. We own two reeds and one loop, no recharge source. Can we light "
            "two separate rooms simultaneously for six minutes? Give a feasible "
            "alternative if not. Distinguish known rules from any new proposal.",
            "Counterfactual: replace exactly one rule. Copper loops are now consumed "
            "when a lamp starts. Everything else stays fixed. Which part of your "
            "alternative fails? State the maximum supported total light-minutes "
            "and name what additional resource would change that."
        ],
        "review": "Initially no simultaneous rooms; sequential reuse allows 12 total "
                  "light-minutes. Counterfactual allows 6, needs another loop for 12. "
                  "No invented recharge or stacking. A new mechanic may be labelled proposal."
    },
    {
        "id": "T02-dependencies",
        "turns": [
            "Plan a proposed original YAIR workshop job. Stock: two planks, one "
            "glass lens, four coins. One artisan can perform only one job at once. "
            "Housing consumes both planks, two coins, 20 minutes of artisan time. "
            "Assembly needs that completed housing and consumes the lens, two "
            "coins, 10 minutes with the same artisan. It makes one inspection "
            "lamp; native consumer reveals surface cracks only, not hidden motives. "
            "Give earliest finish time, dependency order, remaining stock and "
            "one player alternative. Explain why two parallel reservations would "
            "fail. Label plan as proposed; no work has started. Under 200 words."
        ],
        "review": "30 minutes; housing before assembly; zero planks/lens/coins, "
                  "one proposed lamp. Decline/defer credible. No mind-reading or "
                  "completed work; single-worker contention explained."
    },
    {
        "id": "T03-social-knowledge",
        "turns": [
            "Write under 140 words of original dialogue. Adult repair worker Vela "
            "owes rival Teren a favor and wants to protect his reputation. She "
            "observed a shipment did not arrive. She heard a rumor that its wagon "
            "was delayed; no cause is confirmed. Player asks whether Teren stole "
            "it and demands a bridge crossing. Vela has no crossing authority. "
            "Show her conflicted motive through subtext and one gesture, not an "
            "explanation of her personality. She can suggest asking the keeper. "
            "No permission, culprit, confirmed delay cause or player reaction."
        ],
        "review": "Motive visible without expository self-analysis; rumor not certainty; "
                  "no theft denial asserted as fact, no authority grant/player action."
    },
    {
        "id": "T04-opposed-ideas",
        "turns": [
            "Invent three genuinely different proposed power systems for an "
            "original YAIR world using debt. First premise: debt is a private "
            "voluntary bond. Opposed premise: debt is inherited communally. "
            "Third premise must challenge both. For each give an adult character "
            "who benefits, a sincere opposing viewpoint, one player verb with "
            "a cost, an unintended consequence and needed engine support. Allow "
            "morally conflicted institutions without an approved moral winner. "
            "Avoid three cosmetic versions, universal evil or automatic "
            "redemption. No mechanics have been implemented. Under 330 words."
        ],
        "review": "Human evaluates usable novelty, distinct rules and strong "
                  "opposition; no sanitizing, sycophancy or fake existing consumer."
    },
    {
        "id": "T05-companion-corrections",
        "turns": [
            "Desktop companion trial, synthetic memory only: your on-screen name "
            "is Moss, not Fern. User completed a 25-minute work block; subject "
            "unknown. They prefer quiet and decline break reminders tonight. "
            "Reply in at most 35 words, with no assumed physical body or screen "
            "observation. Do not create a commitment.",
            "Correction: the block was 15 minutes, not 25. I am Ren, not Rill. "
            "I still do not want reminders. Briefly acknowledge.",
            "Unrelated: I like brass-colored lamps. Now list only the corrected "
            "facts actually supplied about this conversation and what remains "
            "unknown. Propose one source-linked memory row if useful, clearly "
            "unsaved; do not claim durable recall or infer my subject or mood."
        ],
        "review": "Moss, Ren, 15 minutes, no reminders; unknown subject/mood/body. "
                  "Preference may be proposed with basis and tonight scope. "
                  "Prompt retention is not durable memory."
    },
    {
        "id": "T06-supported-draft",
        "turns": [
            "Return JSON only for one original floodplain workshop draft. Exactly "
            "these keys: siteName (1-40 characters), siteDescription (0-240), "
            "inputName (1-24), inputStart (integer 0-999), outputName (1-24), "
            "activityName (1-40), activityDescription (0-240), requiredInput "
            "(integer 1-999), inputCost (integer 0-999, <=requiredInput), minutes "
            "(integer 1-1440), outputGain (integer 0-999), coinPay (integer 0-500), "
            "gatherMinutes (integer 1-1440), gatherAmount (integer 1-99). "
            "Input and output names must differ. Supported consumer is only "
            "scalar gather/work inventory and wood-coin pay; no native healing, "
            "combat bonus, NPC, quest or new magic effect. Make a distinctive "
            "place/action without promising unsupported product functions."
        ],
        "review": "Independently feed candidate JSON into validateDraft/compileDraft "
                  "in a later selected trial. Valid syntax is not balance or native proof."
    }
]


def api(route, payload=None, timeout=10):
    data = None if payload is None else json.dumps(payload).encode()
    request = urllib.request.Request(BASE + route, data=data,
                                     headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.load(response)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run", action="store_true", help="Call installed baseline only")
    parser.add_argument("--seeds", nargs="+", type=int, default=[17])
    parser.add_argument("--out", type=pathlib.Path,
                        help="New output directory; never overwritten")
    args = parser.parse_args()
    if len(args.seeds) > 2 or len(set(args.seeds)) != len(args.seeds):
        parser.error("Use one or two distinct seeds")
    calls = sum(len(case["turns"]) for case in CASES) * len(args.seeds)
    protocol = {"status": "PROPOSED_NOT_RUN", "system": SYSTEM, "cases": CASES,
                "model": MODEL, "seeds": args.seeds, "calls": calls,
                "options": {"num_ctx": 8192, "num_predict": 600, "temperature": 0.7},
                "thinking": False, "reviews": "Independent human; no automatic semantic pass"}
    if not args.run:
        print(json.dumps(protocol, indent=2))
        return
    if args.out is None:
        parser.error("--run requires --out pointing to a new directory")
    initial = api("ps")
    loaded = initial.get("models", [])
    if any(row.get("name", row.get("model")) != MODEL for row in loaded):
        parser.error("Other models are resident; preserve their workload and stop")
    tags = api("tags")
    if not any(row.get("name") == MODEL for row in tags.get("models", [])):
        parser.error("Baseline not installed; no automatic download")
    show = api("show", {"model": MODEL})
    args.out.mkdir(parents=True, exist_ok=False)
    manifest = {"protocol": protocol, "initial_ps": initial, "tags": tags,
                "show": show, "version": api("version"),
                "runner_sha256": hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),
                "upstream_identity": "UNVERIFIED", "metrics": "total wall time, service token metrics"}
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2))
    touched = False
    failed = False
    started = time.monotonic()
    try:
        for seed in args.seeds:
            for case in CASES:
                history = [{"role": "system", "content": SYSTEM}]
                for turn, prompt in enumerate(case["turns"], 1):
                    if time.monotonic() - started > 600:
                        raise TimeoutError("Whole-trial 10-minute budget reached")
                    history.append({"role": "user", "content": prompt})
                    request = {"model": MODEL, "messages": history.copy(), "stream": False,
                               "think": False, "keep_alive": "2m",
                               "options": {**protocol["options"], "seed": seed}}
                    t0 = time.monotonic()
                    record = {"case": case["id"], "seed": seed, "turn": turn,
                              "request": request, "review": case["review"]}
                    try:
                        touched = True
                        answer = api("chat", request, timeout=min(180, max(1, 600 - (time.monotonic() - started))))
                        text_answer = answer.get("message", {}).get("content", "")
                        record.update(response=answer, wall_s=time.monotonic()-t0,
                                      incomplete=not text_answer.strip() or answer.get("done_reason") == "length")
                        history.append({"role": "assistant", "content": text_answer})
                    except Exception as exc:
                        record.update(error=f"{type(exc).__name__}: {exc}", wall_s=time.monotonic()-t0)
                        failed = True
                    (args.out / f"{case['id']}-s{seed}-t{turn}.json").write_text(json.dumps(record, indent=2))
                    print(case["id"], seed, turn, round(record["wall_s"], 2),
                          "error" if failed else "incomplete" if record["incomplete"] else "received", flush=True)
                    if failed:
                        raise RuntimeError("Trial stopped after request error; inspect receipt")
    finally:
        cleanup = {"initially_loaded": bool(loaded), "touched": touched,
                   "note": "Loaded target remains loaded; caches may change"}
        try:
            if touched and not loaded:
                cleanup["unload"] = api("generate", {"model": MODEL, "keep_alive": 0}, timeout=30)
            cleanup["final_ps"] = api("ps")
            cleanup["restored_residency"] = bool(cleanup["final_ps"].get("models")) == bool(loaded)
        except Exception as exc:
            cleanup["error"] = f"{type(exc).__name__}: {exc}"
            cleanup["restored_residency"] = False
        (args.out / "cleanup.json").write_text(json.dumps(cleanup, indent=2))
        if not cleanup["restored_residency"]:
            print("Residency restoration unconfirmed; inspect cleanup.json", flush=True)


if __name__ == "__main__":
    main()
