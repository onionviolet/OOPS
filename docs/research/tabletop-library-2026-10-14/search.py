"""Search the private prepared library with SQLite FTS5 query syntax."""
import argparse
import sqlite3
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('query')
p.add_argument('--limit',type=int,default=12)
a=p.parse_args()
c=sqlite3.connect(Path(__file__).resolve().parent/'private'/'search.sqlite')
for title,locator,excerpt in c.execute("SELECT title,locator,snippet(texts,3,'[',']',' … ',28) FROM texts WHERE texts MATCH ? ORDER BY rank LIMIT ?",(a.query,a.limit)):
 print(f'{title} | {locator}\n{excerpt}\n')
