#!/usr/bin/env python3
"""Write a child Python fixture with exact stdout/stderr bytes and exit status."""
import argparse
from pathlib import Path

def output_program(stdout=b'', stderr=b'', exit_code=0):
    """Build ASCII Python source without embedding decoded payload bytes."""
    if not isinstance(stdout, bytes) or not isinstance(stderr, bytes):
        raise TypeError('stdout and stderr must be bytes')
    if isinstance(exit_code, bool) or not isinstance(exit_code, int) or not 0 <= exit_code <= 255:
        raise ValueError('exit_code must be an integer from 0 to 255')
    return '\n'.join([
        'import os, sys',
        'os.write(1, bytes.fromhex(' + repr(stdout.hex()) + '))',
        'os.write(2, bytes.fromhex(' + repr(stderr.hex()) + '))',
        'sys.exit(' + str(exit_code) + ')',
        '',
    ])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--stdout-hex', default='')
    parser.add_argument('--stderr-hex', default='')
    parser.add_argument('--exit-code', type=int, default=0)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    try:
        source = output_program(bytes.fromhex(args.stdout_hex), bytes.fromhex(args.stderr_hex), args.exit_code)
    except (TypeError, ValueError) as error:
        parser.error(str(error))
    args.out.write_text(source, encoding='utf-8')

if __name__ == '__main__':
    main()
