import sys
libs="<script>/* qrcode-generator (c) Kazuhiko Arase, licenza MIT */\n"+open('/tmp/qrlib/qrgen.min.js').read()+"\n</script>\n<script>/* jsQR (c) Cosmo Wolfe, licenza Apache-2.0 */\n"+open('/tmp/qrlib/jsqr.min.js').read()+"\n</script>\n"
libs+="<script>/* three.js r158, licenza MIT */\n"+open('three.min.js').read()+"\n</script>\n"
html=open('a.html').read()+libs+"<script>\n{\n"+"\n".join(open(f).read() for f in ['maps.js','hall.js','b.js','c.js','d.js','r3.js','f.js','e.js'])+"\n}\n</script>\n</body>\n</html>\n"
html=html.replace("function resize(){const w=cv.clientWidth","function resize(){if(typeof ringHome==='function')try{ringHome()}catch(e){}const w=cv.clientWidth")
open('game.html','w').write(html)
open('/tmp/g.js','w').write(html.split('<script>')[1].split('</script>')[0])
open('/tmp/t3.html','w').write(html.replace('muteIcons();wIcons(false);refreshMenu();','window.__d={R3,RPATH,RN,leaveRace,USERf:()=>USER,attack,interact,updEnemy,get S(){return S},set S(v){S=v},tick,loadLevel,buy,IN,meP,AU,enterArea,gi,GR,vis,save,loadSave,hsLoad,get MYI(){return MYI},get PEERS(){return PEERS},get role(){return role}};muteIcons();wIcons(false);refreshMenu();'))
