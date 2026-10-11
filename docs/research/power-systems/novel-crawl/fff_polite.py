"""Task-local FanFicFare bridge to the existing polite fork transport.
No installed-library changes. Run with FanFicFare's pipx Python.
"""
import argparse
import sys
import re
from urllib.parse import urlsplit
from pathlib import Path

sys.path.extend(['/Users/weiwei/code/lncrawl-polite',
                 '/Users/weiwei/code/lncrawl-polite/.venv-polite/lib/python3.9/site-packages'])
from lncrawl.polite.transport import Client, StopHost
from fanficfare.fetchers.fetcher_requests import RequestsFetcher
from fanficfare.fetchers.base_fetcher import FetcherResponse
from fanficfare.cli import main

parser = argparse.ArgumentParser()
parser.add_argument('--data', required=True)
parser.add_argument('url')
parser.add_argument('--end', type=int, default=20)
args = parser.parse_args()
if not 1 <= args.end <= 300:
    parser.error('end must be 1..300')

with Client(Path(args.data), chapter_cap=300) as client:
    def guarded(self, method, url, headers=None, parameters=None, json=None):
        if method != 'GET' or parameters or json or re.search(r'/(?:account/)?(?:login|signin|sign-in)(?:/|$)', urlsplit(url).path):
            raise StopHost('Only public GETs allowed for this task')
        # Count every adapter page against the budget, conservatively.
        with client.chapter(url):
            body, meta = client.fetch(url)
        if re.search(rb'"isUnlocked"\s*:\s*false|"(?:needPay|isChapterLock|isPaidPublication|isPaidStory)"\s*:\s*(?:true|1|"1")', body):
            raise StopHost('Paid or locked flag found; book stopped before chapter parsing')
        return FetcherResponse(body, url, False)
    RequestsFetcher.request = guarded
    main(['--begin=1', '--end='+str(args.end), '--format=epub',
          '-o', 'include_images=false', '-o', 'max_request_retries=0',
          '-o', 'use_cloudscraper=false', '-o', 'use_browser_cache=false',
          '-o', 'use_flaresolverr_proxy=false', '-o', 'continue_on_chapter_error=false',
          '-o', 'slow_down_sleep_time=0', '--json-meta-file', args.url])
