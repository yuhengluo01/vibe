import re
h=open('head.html').read(); s=open('scenes.js').read()
lits=''.join(re.findall(r"B\('([^']*)'",s))+'讦厉懦拘直刚和介夺救感变志质所由爱敬情机所短聪明观一二三八'
open('index.html','w').write(h+"const ALLTEXT="+repr(''.join(sorted(set(lits))))+";\n"+s)
