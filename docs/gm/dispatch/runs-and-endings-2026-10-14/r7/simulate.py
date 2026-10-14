#!/usr/bin/env python3
"""R7 proposal model. Standard library only; reads/writes only this lane.

Time units are illustrative productive-play units, not native calendar hours.
Each outcome has its own family. Arc milestones share a repeat multiplier and
a total budget; neither resets nor splitting an arc refresh that multiplier.
"""
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
import csv
import json
import math
import random

ROOT = Path(__file__).resolve().parent
ALPHA = 0.65


def curve(deeds, alpha=ALPHA):
    return 10 * ((1 + deeds / 20) ** alpha - 1)


def repeat(n, mode="diminishing"):
    assert n >= 1
    if mode == "diminishing":
        return 0.35 + 0.65 / math.sqrt(n)
    if mode == "steady":
        return 1.0
    if mode == "rising":
        return min(1.5, 1 + 0.15 * math.log2(n))
    raise ValueError(mode)


@dataclass(frozen=True)
class Life:
    duration: float
    # (completion time, repeat family, base deed credit)
    events: tuple


SHORT = Life(2, ((0.5, "help", 2), (1, "discovery", 4), (2, "arc1", 4)))
TINY = Life(0.5, ((0.15, "help", 2), (0.5, "discovery", 4)))
LONG = Life(10, ((0.5, "help", 2), (1, "discovery", 4),
    (2, "arc1", 4), (3, "arc1", 6), (4, "arc1", 10),
    (4.5, "discovery2", 4), (5, "arc2", 4), (6, "arc2", 6),
    (7, "arc2", 10), (7.5, "ambition", 12), (8, "arc3", 4),
    (9, "arc3", 6), (9.5, "arc3", 10), (10, "ending", 40),
    (10, "help2", 2)))
GRIND = Life(6, ((1, "help", 2), (2, "arc1", 4), (3, "arc1", 6),
    (4, "arc1", 10), (6, "ending", 40)))
STRATEGIES = {"short-life": (SHORT,), "long-life": (LONG,),
    "many-short-lives": (TINY,) * 4, "grind-one-world": (GRIND,)}


def simulate(name, cycles=None, budget=None, mode="diminishing", alpha=ALPHA,
             grind_duration=6):
    assert (cycles is None) != (budget is None)
    group = STRATEGIES[name]
    if name == "grind-one-world":
        group = (Life(grind_duration, tuple((t * grind_duration / 6, f, d)
                    for t, f, d in GRIND.events)),)
    elapsed = deeds = settled_deeds = base = 0.0
    counts = defaultdict(int)
    rows = []
    lives = completed = 0
    while cycles is None or completed < cycles:
        if budget is not None and elapsed >= budget - 1e-9:
            break
        cycle_start = settled_deeds
        full_cycle = True
        for life in group:
            available = life.duration if budget is None else min(life.duration, budget - elapsed)
            if available <= 1e-9:
                full_cycle = False
                break
            multipliers = {}
            for t, family, credit in life.events:
                if t > available + 1e-9:
                    continue
                if family not in multipliers:
                    counts[family] += 1
                    multipliers[family] = repeat(counts[family], mode)
                deeds += credit * multipliers[family]
                base += credit
            elapsed += available
            if available < life.duration - 1e-9:
                full_cycle = False
                break
            lives += 1
        if not full_cycle:
            break
        completed += 1
        settled_deeds = deeds
        rows.append({"strategy": name, "cycle": completed, "lives": lives,
            "time": elapsed, "base_deeds": base, "effective_deeds": deeds,
            "new_currency": curve(deeds, alpha) - curve(cycle_start, alpha),
            "total_currency": curve(deeds, alpha)})
    return rows, {"strategy": name, "cycles": completed, "lives": lives,
        "time": elapsed, "base_deeds": base, "effective_deeds": deeds,
        "banked_currency": curve(settled_deeds, alpha),
        "entitled_currency": curve(deeds, alpha),
        "pending_currency": curve(deeds, alpha) - curve(settled_deeds, alpha),
        "early_world_power_pct": 100 * min(0.1,
            0.2 * (1 - math.exp(-curve(deeds, alpha) / 100)))}


def bounty(danger, urgency, adventurers, jobs, treasury, base=100):
    scarcity = min(2, max(0.5, ((jobs + 4) / (adventurers + 4)) ** 0.25))
    requested = base * (1 + 2 * danger) * (1 + urgency) * scarcity
    budget_cap = treasury / max(1, jobs)
    # Round down after the cap, so quoting never exceeds reserved funds.
    return {"requested": requested, "budget_cap": budget_cap,
            "quoted": math.floor(min(requested, budget_cap))}


def table(headers, rows):
    return "| " + " | ".join(headers) + " |\n|" + "|".join(["---"] * len(headers)) + "|\n" + "\n".join(
        "| " + " | ".join(map(str, row)) + " |" for row in rows) + "\n"


def write_csv(name, rows):
    with (ROOT / name).open("w", newline="") as out:
        writer = csv.DictWriter(out, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def verify():
    checks = 0
    for alpha in (0.5, 0.65, 0.8):
        # Telescoping includes zero-deed resets. Per-reset square roots do not.
        chunks = (0, 2, 4, 20, 0, 40)
        total = paid = 0
        for chunk in chunks:
            paid += curve(total + chunk, alpha) - curve(total, alpha)
            total += chunk
        assert math.isclose(paid, curve(sum(chunks), alpha), abs_tol=1e-10)
        checks += 1
    assert sum(d for _, _, d in LONG.events) == 124
    assert sum(d for _, _, d in GRIND.events) == 62
    checks += 2
    assert sum((4, 6, 10)) == 20  # No extra completion award on top of installments.
    checks += 1
    for n in (1, 2, 10, 100, 1000000):
        assert 0.35 <= repeat(n) <= 1
        assert repeat(n, "steady") == 1
        assert 1 <= repeat(n, "rising") <= 1.5
        checks += 3
    assert bounty(0.25, 0.25, 10, 40, 2000)["quoted"] == 50
    checks += 1
    # Explicitly verify the rejected per-life curve creates a split advantage.
    assert 5 * curve(10) > curve(50)
    checks += 1
    return checks


def main():
    checks = verify()
    cycle_rows, ten, equal, sensitivities = [], [], [], []
    for name in STRATEGIES:
        rows, summary = simulate(name, cycles=10)
        cycle_rows.extend(rows)
        ten.append(summary)
        equal.append(simulate(name, budget=100)[1])
    for mode in ("diminishing", "steady", "rising"):
        for alpha in (0.5, 0.65, 0.8):
            result = {name: simulate(name, budget=100, mode=mode, alpha=alpha)[1]
                      for name in STRATEGIES}
            for name, summary in result.items():
                sensitivities.append({"mode": mode, "alpha": alpha, **summary})
    speed = []
    for duration in (1, 2, 3, 4, 5, 6, 8, 10):
        summary = simulate("grind-one-world", budget=100, grind_duration=duration)[1]
        speed.append({"ending_time": duration, **summary})
    # First-attempt expected rates only. This does not apply repeat counts or
    # make a ten-cycle stochastic survival claim. Death retains reached deeds.
    hazard = []
    for rate in (0, 0.05, 0.1, 0.2, 0.4):
        values = []
        for life in (LONG, TINY):
            expected = sum(d * math.exp(-rate * t) for t, _, d in life.events)
            time = life.duration if rate == 0 else -math.expm1(-rate * life.duration) / rate
            values.extend((expected, time, expected / time))
        hazard.append({"hazard_per_time": rate, "long_deeds": values[0],
            "long_time": values[1], "long_rate": values[2], "tiny_deeds": values[3],
            "tiny_time": values[4], "tiny_rate": values[5]})
    markets = []
    cases = (("baseline", .25, .25, 10, 10, 10000),
        ("more danger", .75, .25, 10, 10, 10000),
        ("urgent", .25, 1, 10, 10, 10000),
        ("many hunters", .25, .25, 40, 10, 10000),
        ("few hunters", .25, .25, 2, 10, 10000),
        ("monster boom, fixed treasury", .25, .25, 10, 40, 2000),
        ("monster boom, funded response", .25, .25, 10, 40, 20000))
    for name, d, u, a, j, b in cases:
        markets.append({"case": name, "danger": d, "urgency": u,
            "adventurers": a, "jobs": j, "treasury": b, **bounty(d, u, a, j, b)})
    density = []
    for i, (adjective, daily) in enumerate((("sparse", 2/90), ("settled", .25),
                                          ("busy", 2), ("saturated", 8))):
        rng = random.Random(700 + i)
        t, arrivals, intervals = 0.0, 0, []
        while True:
            gap = rng.uniform(.5, 1.5) / daily
            if t + gap > 900:
                break
            t += gap
            intervals.append(gap)
            arrivals += 1
        assert intervals and min(intervals) >= .5 / daily and max(intervals) <= 1.5 / daily
        checks += 1
        density.append({"adjective": adjective, "daily_rate": daily,
            "expected_per_season": daily * 90, "offers_10_seasons": arrivals,
            "quiet_days": .5 / daily, "pity_days": 1.5 / daily})
    all_data = {"parameters": {"alpha": ALPHA, "time_budget": 100,
        "cycles": 10, "density_seed": "700 + adjective index"},
        "ten_cycles": ten, "equal_time": equal, "cycles": cycle_rows,
        "sensitivity": sensitivities, "ending_speed": speed, "hazard": hazard,
        "market": markets, "density": density, "checks_passed": checks}
    (ROOT / "simulation.json").write_text(json.dumps(all_data, indent=2) + "\n")
    write_csv("cycles.csv", cycle_rows)
    write_csv("sensitivity.csv", sensitivities)
    sections = ["# R7 generated simulation tables\n\nOriginal proposal model, not observed gameplay. Run `python3 "
        "docs/gm/dispatch/runs-and-endings-2026-10-14/r7/simulate.py`.\n",
        "## N10: ten prestige cycles\n\n" + table(
            ["Strategy", "Lives", "Time", "Effective deeds", "Currency", "Early world power", "Why it matters"],
            [[r["strategy"], r["lives"], r["time"], f'{r["effective_deeds"]:.2f}',
              f'{r["banked_currency"]:.2f}', f'{r["early_world_power_pct"]:.2f}%',
              "Cycle count does not equal time spent"] for r in ten]),
        "## N11: equal 100-unit budget\n\n" + table(
            ["Strategy", "Prestiges", "Completed lives", "Effective deeds incl. pending", "Banked currency", "Pending currency", "Why it matters"],
            [[r["strategy"], r["cycles"], r["lives"], f'{r["effective_deeds"]:.2f}',
              f'{r["banked_currency"]:.2f}', f'{r["pending_currency"]:.2f}',
              "Compares equal time, preserves unfinished credit"] for r in equal]),
        "## N12: cumulative currency by cycle\n\n" + table(
            ["Cycle", *STRATEGIES, "Why it matters"],
            [[i, *[f'{next(r for r in cycle_rows if r["strategy"] == s and r["cycle"] == i)["total_currency"]:.2f}'
                    for s in STRATEGIES], "Shows slower marginal growth"] for i in range(1, 11)]),
        "## N13: repeat-mode sensitivity at equal time (alpha 0.65)\n\n" + table(
            ["Mode", *STRATEGIES, "Why it matters"],
            [[mode, *[f'{next(r for r in sensitivities if r["mode"] == mode and r["alpha"] == ALPHA and r["strategy"] == s)["entitled_currency"]:.2f}'
                       for s in STRATEGIES], "Includes earned but unsettled credit"]
             for mode in ("diminishing", "steady", "rising")]),
        "## N14: same-ending speed sensitivity\n\n" + table(
            ["Ending time", "Completed prestiges", "Entitled currency", "Why it matters"],
            [[r["ending_time"], r["cycles"], f'{r["entitled_currency"]:.2f}',
              "Fast easy endings can dominate despite diminishing payout"] for r in speed]),
        "## N15: first-attempt survival stress\n\n" + table(
            ["Hazard/unit", "Long expected deeds", "Long expected time", "Long deeds/time", "Tiny deeds/time", "Why it matters"],
            [[r["hazard_per_time"], f'{r["long_deeds"]:.2f}', f'{r["long_time"]:.2f}',
              f'{r["long_rate"]:.2f}', f'{r["tiny_rate"]:.2f}',
              "Mortality can reverse the fresh-life rate"] for r in hazard]),
        "## N16: bounty market examples\n\n" + table(
            ["Case", "Requested", "Budget/job", "Quoted", "Why it matters"],
            [[r["case"], f'{r["requested"]:.2f}', f'{r["budget_cap"]:.2f}', r["quoted"],
              "Danger, labor scarcity and funds have separate effects"] for r in markets]),
        "## N17: offer density, 900 in-world days\n\n" + table(
            ["Adjective", "Expected/90-day season", "Offers in 10 seasons", "Quiet days", "Pity days", "Why it matters"],
            [[r["adjective"], r["expected_per_season"], r["offers_10_seasons"],
              r["quiet_days"], r["pity_days"], "Density changes by world, display count does not"] for r in density]),
        f"\nVerification: {checks} mathematical/accounting checks passed. No native gameplay checks.\n"]
    (ROOT / "TABLES.md").write_text("\n".join(sections))
    print(json.dumps({"checks_passed": checks,
        "ten_cycle_currency": {r["strategy"]: round(r["banked_currency"], 5) for r in ten},
        "equal_time_entitlement": {r["strategy"]: round(r["entitled_currency"], 5) for r in equal}}, indent=2))


if __name__ == "__main__":
    main()
