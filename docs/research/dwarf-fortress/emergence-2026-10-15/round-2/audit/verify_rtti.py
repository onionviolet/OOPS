"""Independent static MSVC x64 RTTI/slot/address verification, no target execution."""
import json,struct,hashlib
from pathlib import Path
scope=Path(__file__).resolve().parent
# Load the tiny PE mapping helper without executing any game or native function.
b=Path('/Users/weiwei/.codex/research/bf-dwarf-fortress/extract/payload/Dwarf Fortress.exe').read_bytes();base=0x140000000;pe=struct.unpack_from('<I',b,60)[0];opt=pe+24;sections=[]
for i in range(struct.unpack_from('<H',b,pe+6)[0]):
 q=opt+struct.unpack_from('<H',b,pe+20)[0]+40*i;vsize,rva,size,ptr=struct.unpack_from('<IIII',b,q+8);sections.append((b[q:q+8].rstrip(b'\0').decode(),rva,size,ptr))
def raw(va):
 return next(ptr+va-base-rva for _,rva,size,ptr in sections if rva<=va-base<rva+size)
def readz(va):
 q=raw(va);return b[q:b.index(0,q)].decode()
pd=next(x for x in sections if x[0]=='.pdata');ranges=[struct.unpack_from('<III',b,i) for i in range(pd[3],pd[3]+pd[2]-11,12)]
d=json.loads(Path('/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/notes/native-map.json').read_text());checks=[]
for t in d['rtti']:
 td=int(t['type_descriptor_va'],16);name=readz(td+16)
 for col in t['complete_object_locators']:
  cv=int(col['va'],16);sig,off,cd,typ,ch,slf=struct.unpack_from('<IIIIII',b,raw(cv));header_ok=sig==1 and typ+base==td and slf+base==cv
  for vt in col['vtables']:
   vv=int(vt['vtable_va'],16);back=struct.unpack_from('<Q',b,raw(vv)-8)[0];slots=[]
   for s in vt['slots']:
    val=struct.unpack_from('<Q',b,raw(vv)+8*s['slot'])[0];bounds=[(a+base,z+base,u+base) for a,z,u in ranges if a+base<=val<z+base];decl=s['enclosing'];match=any(hex(a)==decl['start'] and hex(z)==decl['end_exclusive'] for a,z,_ in bounds) if decl else None
    slots.append(dict(slot=s['slot'],entry=hex(val),pointer_matches=hex(val)==s['entry'],pdata_matches=match))
   checks.append(dict(class_name=name,name_matches=name==t['class_name'],col=hex(cv),col_signature=sig,col_header_matches=header_ok,vtable=hex(vv),vtable_backpointer_matches=back==cv,slots=slots,limits='24 pointer slots checked as supplied; exact virtual-table terminal boundary and ABI method meanings not proven by address mapping.'))
r=dict(binary_sha256=hashlib.sha256(b).hexdigest(),checks=checks,all_checks_pass=all(x['name_matches'] and x['col_header_matches'] and x['vtable_backpointer_matches'] and all(s['pointer_matches'] and s['pdata_matches'] is not False for s in x['slots']) for x in checks),scope='RTTI naming and pointer evidence only, not proof of effect tick/expiry/actor mutation.')
(scope/'RTTI_CHECKS.json').write_text(json.dumps(r,indent=2)+'\n');print('RTTI checked',len(checks),'PASS',r['all_checks_pass'])
