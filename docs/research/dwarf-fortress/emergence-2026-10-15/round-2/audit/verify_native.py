"""Independent static PE/.pdata check. Does not execute target code."""
import struct,json,hashlib
from pathlib import Path
out=Path(__file__).resolve().parent
exe=Path('/Users/weiwei/.codex/research/bf-dwarf-fortress/extract/payload/Dwarf Fortress.exe');b=exe.read_bytes();pe=struct.unpack_from('<I',b,0x3c)[0];n=struct.unpack_from('<H',b,pe+6)[0];optsize=struct.unpack_from('<H',b,pe+20)[0];opt=pe+24;base=struct.unpack_from('<Q',b,opt+24)[0];sections=[]
for i in range(n):
 off=opt+optsize+i*40; name=b[off:off+8].split(b'\0')[0].decode();vsize,rva,size,ptr=struct.unpack_from('<IIII',b,off+8);sections.append(dict(name=name,rva=rva,vsize=vsize,size=size,ptr=ptr))
def raw(va):
 r=va-base
 for s in sections:
  if s['rva']<=r<s['rva']+s['size']:return s['ptr']+r-s['rva']
 raise ValueError(hex(va))
pdata=next(s for s in sections if s['name']=='.pdata');ranges=[]
for off in range(pdata['ptr'],pdata['ptr']+pdata['size']-11,12):
 a,z,u=struct.unpack_from('<III',b,off)
 if a and z:ranges.append((base+a,base+z,base+u))
targets=json.loads(Path('/Users/weiwei/.codex/research/bf-dwarf-fortress/notes/native-targets.json').read_text())['targets'];results=[]
for t in targets:
 va=int(t['xref'],16);off=raw(va);ins=b[off:off+7];islea=(ins[0]&0xf0==0x40 and ins[1]==0x8d and ins[2]&0xc7==5);dest=va+7+struct.unpack_from('<i',ins,3)[0] if islea else None;bound=[x for x in ranges if x[0]<=va<x[1]]
 a=int(t['function'],16);z=int(t['end'],16);blob=b[raw(a):raw(a)+(z-a)];sv=int(t['string_va'],16);so=raw(sv);sz=b.find(b'\0',so);literal=b[so:sz].decode('ascii');results.append(dict(label=t['string'][:64],xref=t['xref'],xref_bytes=ins.hex(),rip_relative_lea=islea,destination=hex(dest) if dest else None,destination_matches=dest==sv,literal_matches=literal==t['string'],pdata_ranges=[[hex(y) for y in x] for x in bound],declared_range_matches=any(x[0]==a and x[1]==z for x in bound),function_start=hex(a),function_end_exclusive=hex(z),function_bytes_sha256=hashlib.sha256(blob).hexdigest(),size=z-a))
res=dict(executable=str(exe),sha256=hashlib.sha256(b).hexdigest(),imagebase=hex(base),method='PE header section mapping; x86-64 seven-byte RIP-relative LEA decode; independent .pdata entry decoding. No disassembler/decompiler or game execution.',checks=results,all_checks_pass=all(x['destination_matches'] and x['literal_matches'] and x['declared_range_matches'] for x in results))
(out/'NATIVE_CHECKS.json').write_text(json.dumps(res,indent=2)+'\n');print(json.dumps(res,indent=2))
