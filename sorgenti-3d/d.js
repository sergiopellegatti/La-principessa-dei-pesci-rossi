/* ---------- rendering ---------- */
const cv=$("game"),cx=cv.getContext("2d");const dpr=Math.min(2,window.devicePixelRatio||1);
let VWt=11,VHt=13,scale=1;
function resize(){const w=cv.clientWidth||400,h=cv.clientHeight||700;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);const tp=Math.max(30,Math.min(64,w/11,h/8));VWt=w/tp;VHt=h/tp;scale=tp*dpr/TS}
const ro=new ResizeObserver(resize);ro.observe(cv);
let role=null,SC=null,scKey="";const VIEW={camX:0,camY:0};const SS=2;
const RP={},FX={pt:[],fl:[],dead:[],sw:{},flash:{},booms:[],warn:[],myFlash:-1e4};
let toastT=0;
function playFx(e){const now=performance.now(),m=meP();fxSound(e,m);
 if(e.k==="float")FX.fl.push({x:e.x,y:e.y,t:e.t,c:e.c,b:now});
 else if(e.k==="burst")for(let i=0;i<e.n;i++){const a=rnd(0,PI*2),v=rnd(1,4);FX.pt.push({x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:0,ml:rnd(.4,.9),c:e.col,s:rnd(1.5,3.5)})}
 else if(e.k==="hurt"){FX.flash[e.id]=now;if(m&&e.id===m.id){FX.myFlash=now;const s=$("stage");s.classList.remove("shake");void s.offsetWidth;s.classList.add("shake")}}
 else if(e.k==="hitE")FX.flash[e.id]=now;
 else if(e.k==="death")FX.dead.push({...e,b:now});
 else if(e.k==="swing")FX.sw[e.id]={b:now,ax:e.ax,ay:e.ay,wet:e.wet};
 else if(e.k==="boom"){FX.booms.push({...e,b:now});for(let i=0;i<26;i++){const a=rnd(0,PI*2),v=rnd(2,6);FX.pt.push({x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,ml:rnd(.4,.8),c:Math.random()<.5?"#ff6fae":"#ffd23c",s:rnd(2,4.5)})}}
 else if(e.k==="coin"){for(let i=0;i<5;i++){const a=rnd(0,PI*2);FX.pt.push({x:e.x,y:e.y,vx:Math.cos(a)*2,vy:Math.sin(a)*2-2,l:0,ml:.5,c:"#ffd23c",s:2})}}
 else if(e.k==="toast")showToast(e.t,e.d);
 else if(e.k==="warn")FX.warn.push({...e,b:now});
 else if(e.k==="buy"&&!$("ovShop").hidden)renderShop();
}
function showToast(t,d){const el=$("toast");el.textContent=t;el.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove("on"),(d||2.3)*1000)}
function meP(){if(!S)return null;if(S.mode==="hot")return S.players[S.active];return S.players[MYI]||S.players[0]}
const myG=()=>{const p=meP();return p?GR(p):S.grp[0]};

function buildStatic(){if(S.lvl===7){buildRaceBG();return}if(S.lvl===8){buildPuzzleBG();return}const L=LV[S.lvl];SC=document.createElement("canvas");SC.width=S.W*TS*SS;SC.height=S.H*TS*SS;const c=SC.getContext("2d");c.scale(SS,SS);
 const W=S.W,H=S.H,G=S.G,isW=(x,y)=>x<0||y<0||x>=W||y>=H||G[y][x]==="#";
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*TS,py=y*TS,ch=G[y][x];
  if(ch==="#"){const open=!isW(x,y+1);c.fillStyle=L.top;c.fillRect(px,py,TS,TS);
   if(open){c.fillStyle=lg(c,0,py+14,0,py+TS,L.wall,shade(L.wall,-.25));c.fillRect(px,py+14,TS,TS-14);c.fillStyle="rgba(255,255,255,.12)";c.fillRect(px,py+14,TS,2);
    c.fillStyle="rgba(0,0,0,.12)";c.fillRect(px+TS/2-1,py+16,2,TS-20);c.fillStyle=shade(L.wall,-.35);c.fillRect(px,py+TS-5,TS,5)}
   else{c.fillStyle="rgba(255,255,255,.06)";if(!isW(x-1,y))c.fillRect(px,py,3,TS);if(!isW(x+1,y))c.fillRect(px+TS-3,py,3,TS);if(!isW(x,y-1))c.fillRect(px,py,TS,3)}
   continue}
  floor(c,px,py,x,y,L);
  if(isW(x,y-1)){c.fillStyle=lg(c,0,py,0,py+14,"rgba(0,0,0,.25)","rgba(0,0,0,0)");c.fillRect(px,py,TS,14)}
  if(isW(x-1,y)){c.fillStyle=lg(c,px,0,px+8,0,"rgba(0,0,0,.15)","rgba(0,0,0,0)");c.fillRect(px,py,8,TS)}
  decor(c,ch,px,py,x,y,L)}
 const sign=(sx,sy,sw,col,txt)=>{c.fillStyle=col;rr(c,sx-sw/2,sy-12,sw,24,10);c.fill();c.fillStyle="rgba(255,255,255,.25)";rr(c,sx-sw/2+3,sy-10,sw-6,8,6);c.fill();
  c.font="700 16px Fredoka,system-ui,sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillStyle="#fff";c.fillText(txt,sx,sy+1)};
 if(S.lvl===0)for(const d of S.hallDoors)if(d.to!==7)sign(d.x*TS,d.y<H/2?18:(H-.55)*TS,Math.min(250,6.2*TS),LV[d.to].acc,LV[d.to].name);
 else sign(Math.floor(W/2)*TS,18,Math.min(300,W*TS*.4),L.acc,L.name);
 scKey=S.lvl+":"+S.gv}
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.round(k<0?v*(1+k):v+(255-v)*k);return`rgb(${f(r)},${f(g)},${f(b)})`}
function floor(c,px,py,x,y,L){
 if(S.lvl===0){c.fillStyle=L.floor[((x>>1)+(y>>1))%2];c.fillRect(px,py,TS,TS);c.strokeStyle="rgba(120,100,80,.12)";c.lineWidth=1;if(x%2===0)c.strokeRect(px+.5,py+.5,TS*2-1,y%2===0?TS*2-1:0);
  if(hash(x>>1,y>>1)>.6){c.fillStyle="rgba(255,255,255,.35)";c.beginPath();c.moveTo(px+4,py+TS-4);c.lineTo(px+12,py+TS-4);c.lineTo(px+TS-4,py+4);c.lineTo(px+TS-12,py+4);c.fill()}return}
 c.fillStyle=L.floor[(x+y)%2];c.fillRect(px,py,TS,TS);
 if(S.lvl===5){c.fillStyle="rgba(0,0,0,.18)";c.fillRect(px,py+((x%2)?13:27),TS,1.5);c.fillStyle="rgba(255,255,255,.03)";c.fillRect(px,py,TS,6)}
 else{c.strokeStyle="rgba(0,0,0,.06)";c.lineWidth=1;c.strokeRect(px+.5,py+.5,TS-1,TS-1);if(hash(x,y)>.9){c.fillStyle="rgba(255,255,255,.35)";c.fillRect(px+8,py+8,10,2)}}}
function decor(c,ch,px,py,x,y,L){const cx=px+TS/2,cy=py+TS/2,h=hash(x*3,y*7);
 if("1234S".includes(ch)){const col=ch==="S"?["#ff9a2e","#5ab8ff","#ff6fae","#4fe3b5"][Math.floor(h*4)]:["","#ff4f6d","#4f8bff","#ffc93c","#3fcf7a"][+ch];
  c.fillStyle="#b98454";rr(c,px+1,py+2,TS-2,TS-4,3);c.fill();c.fillStyle="#8a5a2b";c.fillRect(px+3,py+14,TS-6,3);c.fillRect(px+3,py+27,TS-6,3);
  for(let r=0;r<2;r++)for(let i=0;i<3;i++){c.fillStyle=col;rr(c,px+5+i*11,py+5+r*13,9,9,2);c.fill();c.fillStyle="rgba(255,255,255,.3)";c.fillRect(px+5+i*11,py+8+r*13,9,1.5)}
  if(ch!=="S"){c.fillStyle=col;c.fillRect(px+2,py+TS-6,TS-4,4)}}
 else if(ch==="R"){c.fillStyle="#9aa5b8";c.fillRect(px+4,py+6,TS-8,3);c.fillRect(px+5,py+6,2,TS-10);c.fillRect(px+TS-7,py+6,2,TS-10);
  for(let i=0;i<4;i++){c.fillStyle=["#ff6fae","#5ab8ff","#ffc93c","#4fe3b5","#c77dff"][(i+Math.floor(h*5))%5];c.beginPath();c.moveTo(px+8+i*7,py+9);c.lineTo(px+4+i*7,py+30);c.lineTo(px+14+i*7,py+30);c.closePath();c.fill()}}
 else if(ch==="P"){el(c,cx,py+TS-5,12,3.5,"rgba(0,0,0,.18)");c.fillStyle="#c96b3a";c.beginPath();c.moveTo(px+11,py+24);c.lineTo(px+29,py+24);c.lineTo(px+26,py+TS-4);c.lineTo(px+14,py+TS-4);c.fill();
  for(let i=0;i<7;i++){const a=-PI/2+(i-3)*.42;el(c,cx+Math.cos(a)*9,py+16+Math.sin(a)*8,5.5,9,i%2?"#3fae5a":"#2f8f48")}}
 else if(ch==="C"){const top=S.lvl===3?"rgba(210,240,255,.85)":S.lvl===5?"#6b4434":"#e9e2d6",front=S.lvl===3?"#f6c7dc":S.lvl===5?"#3e271e":"#9a6a42";
  c.fillStyle=front;c.fillRect(px,py+12,TS,TS-12);c.fillStyle=top;c.fillRect(px,py+2,TS,12);c.fillStyle="rgba(0,0,0,.15)";c.fillRect(px,py+12,TS,2);
  if(S.lvl===3){for(let i=0;i<2;i++)el(c,px+11+i*18,py+8,5,3.5,["#ff8cc0","#c98a4a"][(x+i)%2])}
  if(S.lvl===5&&h>.4){el(c,cx,py+8,7,3.5,"#fff");el(c,cx,py+7,4,2,"#ff7a4a")}}
 else if(ch==="O"){c.fillStyle="#9a4a2a";rr(c,px,py+2,TS,TS-2,[16,16,3,3]);c.fill();c.fillStyle="rgba(0,0,0,.25)";for(let r=0;r<3;r++)for(let i=0;i<3;i++)c.fillRect(px+3+i*13+(r%2)*6,py+12+r*8,10,1.4);
  c.fillStyle="#2a120a";c.beginPath();c.arc(cx,py+TS-4,11,PI,0);c.fill();c.fillStyle=rg(c,cx,py+TS-6,1,12,"#ffd36b","#ff5a1a");c.beginPath();c.arc(cx,py+TS-4,8,PI,0);c.fill()}
 else if(ch==="T"){if(S.lvl===2){c.fillStyle="#fff";c.fillRect(px,py,TS,TS);c.fillStyle="#e63946";for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2)c.fillRect(px+i*10,py+j*10,10,10)}
  else{c.fillStyle="#5a3a2c";c.fillRect(px,py,TS,TS);c.fillStyle="rgba(255,255,255,.06)";c.fillRect(px,py+4,TS,2)}
  el(c,cx,cy,9,7,"rgba(255,255,255,.9)");el(c,cx,cy,6,4.5,"rgba(0,0,0,.08)")}
 else if(ch==="A"){c.fillStyle="#2f5d73";c.fillRect(px+1,py+2,TS-2,TS-3);c.fillStyle=lg(c,0,py+4,0,py+TS,"#7fd3ff","#2f8fbf");c.fillRect(px+4,py+5,TS-8,TS-10);
  el(c,px+10,py+TS-8,3,7,"#3fae5a");el(c,px+28,py+TS-9,3,8,"#2f8f48");c.save();c.translate(px+18+h*6,py+16);drawFishBody(c,h*999,null,.7);c.restore();c.fillStyle="rgba(255,255,255,.35)";c.fillRect(px+6,py+7,3,TS-16)}
 else if(ch==="L"){c.fillStyle="#3a2a1a";c.fillRect(cx-1,py+24,2,14);el(c,cx,py+16,10,12,"#e63946");c.fillStyle="#2a1208";c.fillRect(cx-7,py+4,14,3);c.fillRect(cx-7,py+26,14,3);c.fillStyle="rgba(255,220,150,.35)";el(c,cx-3,py+13,3,6,"rgba(255,220,150,.35)")}
 else if(ch==="="){c.fillStyle="#4a4f5c";c.fillRect(px,py+6,TS,TS-12);c.fillStyle="#2f333d";c.fillRect(px,py+6,TS,3);c.fillRect(px,py+TS-9,TS,3);
  el(c,cx,cy,11,8,"#fff");el(c,cx,cy,8,5.5,(x%3===0)?"#ff7a4a":(x%3===1)?"#2f2f2f":"#ffd23c");if(x%3===1){c.fillStyle="#fff";c.beginPath();c.arc(cx,cy,3,0,7);c.fill();el(c,cx,cy,1.6,1.6,"#ff7a4a")}}
 else if(ch==="K"){c.fillStyle="#d9dde6";rr(c,px+1,py+10,TS-2,TS-11,4);c.fill();c.fillStyle="#9aa3b8";c.fillRect(px+1,py+TS-10,TS-2,9);
  c.fillStyle="#3a3f52";rr(c,px+8,py+2,24,16,3);c.fill();c.fillStyle="#7dffb0";c.fillRect(px+11,py+5,18,6);c.fillStyle="#2a2f3c";for(let i=0;i<3;i++)c.fillRect(px+11+i*6,py+13,4,3);
  c.fillStyle="#ff4f9a";rr(c,px+4,py+TS-9,TS-8,7,3);c.fill();c.fillStyle="#fff";c.font="700 6.5px Fredoka,system-ui,sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText("CASSA",cx,py+TS-5.3)}
 else if(ch==="V"){const top=y<S.H/2,d=S.hallDoors.filter(d=>d.to!==7&&(d.y<S.H/2)===top).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0],Lt=d?d.to:1,acc=LV[Lt].acc;
  c.fillStyle="#3a3f55";c.fillRect(px,py,TS,TS);c.fillStyle=lg(c,0,py,0,py+TS,"#dff4ff","#9fd2ee");c.fillRect(px+2,py+3,TS-4,TS-6);
  c.fillStyle=acc;c.fillRect(px,top?py+TS-5:py,TS,5);c.save();c.translate(cx,cy+(top?-2:3));
  if(Lt===1)drawItem(c,{k:"merch",c:1+((x+y)%4),x:0},0);else if(Lt===2){drawPizzaShape(c,9)}else if(Lt===3)drawItem(c,{k:"pastry",v:x%3,x:0},0);else if(Lt===4){c.scale(1.2,1.2);drawFishBody(c,x*300,null,1)}else{el(c,0,0,11,7,"#fff");el(c,0,-1,6,3.5,"#ff7a4a")}
  c.restore();c.fillStyle="rgba(255,255,255,.4)";c.fillRect(px+5,py+5,3,TS-12)}
 else if(ch==="h"){el(c,cx,py+TS-6,16,4,"rgba(0,0,0,.18)");c.fillStyle="#8a5a2b";for(let i=0;i<3;i++)rr(c,px+3,py+10+i*7,TS-6,5,2),c.fill();c.fillStyle="#4a4f5c";c.fillRect(px+5,py+30,3,8);c.fillRect(px+TS-8,py+30,3,8)}
 else if(ch==="E"||ch==="F"){}
}
function objective(m){const p=m;if(!p||!S)return null;const M=S.mission,near=(arr)=>{let b=null,bd=1e9;for(const a of arr){const d=dist(p.x,p.y,a[0],a[1]);if(d<bd){bd=d;b=a}}return b};
 const G=GR(p);if(M.kind==="hall"){const L=G.frags>=4?5:[1,2,3,4].find(l=>!G.done[l]);const d=S.hallDoors.find(d=>d.to===L);return d?[d.x,d.y]:null}
 const frag=S.items.find(i=>i.k==="frag");if(frag&&!G.done[S.lvl])return[frag.x,frag.y];if(S.done[S.lvl])return S.exit;
 if(M.kind==="shelves")return p.carry?near(S.shelves.filter(s=>s.c===p.carry.c).map(s=>[s.x,s.y])):near(S.items.filter(i=>i.k==="merch").map(i=>[i.x,i.y]));
 if(M.kind==="pizza")return p.carry?near(S.tables.filter(t=>t.want).map(t=>[t.cx,t.cy])):near(S.ovens);
 if(M.kind==="pastry")return near(S.items.filter(i=>i.k==="pastry").map(i=>[i.x,i.y]));
 if(M.kind==="ark"){if(p.carry&&p.carry.k==="key")return near(S.cages.filter(c=>!c.open&&c.sp===p.carry.sp).map(c=>[c.x,c.y]));const k=S.items.filter(i=>i.k==="key");if(k.length)return near(k.map(i=>[i.x,i.y]));return near(S.enemies.filter(e=>e.t==="w").map(e=>[e.x,e.y]))}
 if(M.kind==="boss")return M.boss?S.cage:near(S.enemies.filter(e=>e.t==="B").map(e=>[e.x,e.y]));return null}
const DRAW={g:drawGuard,v:drawGranny,b:drawCart,c:drawClerk,z:drawPizzaiolo,t:drawBaker,k:drawCat,n:drawNinja,B:drawChef};
let last=0,acc=0,netAcc=0;
function frame(t){requestAnimationFrame(frame);const dt=Math.min(.1,(t-last)/1000||0);last=t;
 if(S&&role!=="guest"){acc+=dt;while(acc>=1/30){tick(1/30);acc-=1/30}
  if(EVQ.length){const q=EVQ;EVQ=[];q.forEach(playFx);if(role==="host")OUTEV.push(...q)}
  if(role==="host"){netAcc+=dt;if(netAcc>=.066){netAcc=0;sendSnap()}}}
 syncUI();drawPosterLoop(t);
 if(!S)return;
 if(S.lvl===6){drawScene(t,dt);return}
 if(typeof r3Frame==='function'&&r3Frame(t,dt))return;
 if(scKey!==S.lvl+":"+S.gv)buildStatic();
 const now=performance.now(),m=meP(),k=Math.min(1,dt*(role==="guest"?14:22));
 const rp=o=>{let r=RP[o.id];if(!r||dist(r.x,r.y,o.x,o.y)>3)r=RP[o.id]={x:o.x,y:o.y};r.x+=(o.x-r.x)*k;r.y+=(o.y-r.y)*k;return r};
 const c=cx;c.setTransform(1,0,0,1,0,0);c.fillStyle=LV[S.lvl].top||"#120c2a";c.fillRect(0,0,cv.width,cv.height);
 let mr=m?rp(m):{x:S.spawn[0],y:S.spawn[1]};if(S.lvl===7&&m&&m.kh!=null){const tx=Math.cos(m.kh)*Math.min(3.2,(m.ks||0)*.45),ty=Math.sin(m.kh)*Math.min(3.2,(m.ks||0)*.45);VIEW.lx=(VIEW.lx||0)+(tx-(VIEW.lx||0))*Math.min(1,dt*3);VIEW.ly=(VIEW.ly||0)+(ty-(VIEW.ly||0))*Math.min(1,dt*3);mr={x:mr.x+VIEW.lx,y:mr.y+VIEW.ly}}
 const padT=1.2,padB=2.6,padR=2;let camX=S.W<=VWt?(S.W-VWt)/2:cl(mr.x-VWt/2,-.2,S.W-VWt+padR),camY=S.H+padT+padB<=VHt?(S.H-VHt)/2+ (padB-padT)/2:cl(mr.y-VHt/2,-padT,S.H-VHt+padB);
 VIEW.camX=camX;VIEW.camY=camY;c.setTransform(scale,0,0,scale,-camX*TS*scale,-camY*TS*scale);
 c.drawImage(SC,0,0,S.W*TS,S.H*TS);
 const x0=Math.max(0,Math.floor(camX)-1),x1=Math.min(S.W,Math.ceil(camX+VWt)+1),y0=Math.max(0,Math.floor(camY)-1),y1=Math.min(S.H,Math.ceil(camY+VHt)+1);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const ch=S.G[y][x],px=x*TS+TS/2,py=y*TS+TS/2;
  if(ch==="N")drawParkDoor(c,px,py,t);
  else if(ch==="E")drawDoor(c,px,py,LV[S.lvl].acc,"HALL","",t,y>S.H/2);
  else if(DOORS[ch]){const L=DOORS[ch];drawDoor(c,px,py,LV[L].acc,"",L===5&&!sushiOpen()?"lock":(m?GR(m):S.grp[0]).done[L]?"done":"",t,y>S.H/2)}
  else if(ch==="F"){c.save();c.translate(px,py);drawPrincess(c,t,S.mission.freed);c.restore()}
  else if(ch==="O"){const f=.5+.5*Math.sin(t/120+x);c.fillStyle=`rgba(255,140,40,${.18+.12*f})`;c.beginPath();c.arc(px,py+14,14+f*3,0,7);c.fill()}
  else if(ch==="K"){const b=Math.sin(t/300)*2;c.fillStyle="rgba(79,227,181,.25)";c.beginPath();c.arc(px,py,24+b,0,7);c.fill()}
  else if(S.hidden[x+","+y]&&hash(x,y+Math.floor(t/2600))>.72){const p=(t%2600)/2600;if(p<.3)star(c,px+8,py-10,3*Math.sin(p/.3*PI),"rgba(255,240,180,.95)")}}
 if(m&&m.carry&&m.carry.k==="merch")for(const s of S.shelves)if(s.c===m.carry.c){c.strokeStyle=`rgba(255,255,255,${.5+.4*Math.sin(t/160)})`;c.lineWidth=3;rr(c,s.x*TS-TS/2+1,s.y*TS-TS/2+1,TS-2,TS-2,5);c.stroke()}
 for(const tb of S.tables)if(tb.want){const bx=tb.cx*TS,by=tb.cy*TS-TS*.9+Math.sin(t/250+tb.cx)*3;c.fillStyle="#fff";rr(c,bx-16,by-14,32,26,10);c.fill();c.beginPath();c.moveTo(bx-4,by+11);c.lineTo(bx,by+18);c.lineTo(bx+4,by+11);c.fill();c.save();c.translate(bx,by-1);drawPizzaShape(c,9);c.restore()}
 for(const it of S.items){if(it.x<x0-1||it.x>x1+1||it.y<y0-1||it.y>y1+1)continue;c.save();c.translate(it.x*TS,it.y*TS);drawItem(c,it,t);c.restore()}
 if(S.lvl===7&&false);
 for(const q of S.poops||[]){if(q.land){c.save();c.translate(q.x*TS,q.y*TS+6);el(c,0,0,8,4.5,"#f4f1e4");el(c,3,1,4,2.4,"#e8e2c8");el(c,-2,-1,1.6,1.2,"#6b5a3a");c.restore()}else{el(c,q.x*TS,q.y*TS+6,4*(1-q.h/1.5)+1,1.6,"rgba(0,0,0,.25)");el(c,q.x*TS,(q.y-q.h)*TS,3.2,4,"#f4f1e4")}}
 for(const w of FX.warn){const p=(now-w.b)/650;if(p>1)continue;c.strokeStyle=`rgba(255,60,60,${.5*(1-p)+.2})`;c.lineWidth=10;c.lineCap="round";ln(c,w.x*TS,w.y*TS,(w.x+w.wx*4.7)*TS,(w.y+w.wy*4.7)*TS)}
 FX.warn=FX.warn.filter(w=>now-w.b<700);
 for(const b of FX.booms){const p=(now-b.b)/450;if(p>1)continue;c.strokeStyle=`rgba(255,111,174,${1-p})`;c.lineWidth=6*(1-p)+1;c.beginPath();c.arc(b.x*TS,b.y*TS,b.r*TS*(.3+.7*p),0,7);c.stroke();c.fillStyle=`rgba(255,210,60,${.35*(1-p)})`;c.beginPath();c.arc(b.x*TS,b.y*TS,b.r*TS*p*.8,0,7);c.fill()}
 FX.booms=FX.booms.filter(b=>now-b.b<500);
 const list=[];if(S.lvl===7)drawRaceObjs(c,t,list);if(S.lvl===8)drawPuzzleObjs(c,t,list);
 for(const e of S.enemies){const r=rp(e);if(r.x<x0-2||r.x>x1+2||r.y<y0-2||r.y>y1+2)continue;list.push({y:r.y,f:()=>{
  const fl=now-(FX.flash[e.id]||-1e4)<150;c.save();c.translate(r.x*TS,r.y*TS-4);if(!e.kart)c.scale(e.face<0?-1:1,1);if(e.kart&&e.shield>0){c.fillStyle="rgba(120,220,255,.2)";c.strokeStyle="rgba(180,240,255,.9)";c.lineWidth=2;c.beginPath();c.arc(0,-4,27,0,7);c.fill();c.stroke()}
  if(e.flee&&e.t==="k")c.globalAlpha=Math.max(0,1-(e.fleeT||0)/2.2);
  if(e.kart){kart3D(c,t,{h:(e.kh||0)+spinAng(e.spin),look:e.look||"kid",boost:e.boost>0})}else if(e.t==="w")drawZooClerk(c,t+e.x*200,{walk:e.walk,sp:e.sp,flee:e.scared,hasKey:true});else DRAW[e.t](c,t+e.x*200,{walk:e.walk,atk:e.atk>0?e.atk/.3:0,stun:e.stun>0,flee:e.flee,charge:e.charge});
  if(fl){c.globalCompositeOperation="lighter";c.fillStyle="rgba(255,90,90,.5)";c.beginPath();c.arc(0,-6,e.t==="B"?28:17,0,7);c.fill()}c.restore();
  if(e.stun>0||e.spin>0){c.save();c.translate(r.x*TS,r.y*TS-(e.t==="B"?62:46));stars(c,t,0);c.restore()}
  if(e.wind>0||(e.t==="b"&&e.wind>0)){c.font="700 20px Fredoka,system-ui";c.textAlign="center";c.fillStyle="#ff3b3b";c.fillText("!",r.x*TS,r.y*TS-(e.t==="B"?66:38))}
  if(e.slow>0){c.fillStyle="rgba(90,184,255,.35)";el(c,r.x*TS,r.y*TS+12,14,5,"rgba(90,184,255,.35)")}
  if(e.poison>0)for(let i=0;i<2;i++)el(c,r.x*TS-6+i*12,r.y*TS-26-((t/8+i*20)%20),2.4,2.4,"rgba(110,224,90,.8)");
  if(!EN[e.t].stunOnly&&e.t!=="k"&&e.hp<e.max){const bw=e.t==="B"?60:30,oy=e.t==="B"?58:32;c.fillStyle="rgba(0,0,0,.55)";rr(c,r.x*TS-bw/2,r.y*TS-oy,bw,5,2.5);c.fill();c.fillStyle="#ff5d6c";rr(c,r.x*TS-bw/2+1,r.y*TS-oy+1,(bw-2)*Math.max(0,e.hp)/e.max,3,1.5);c.fill()}}})}
 FX.dead=FX.dead.filter(d=>now-d.b<450);
 for(const d of FX.dead)list.push({y:d.y,f:()=>{const p=(now-d.b)/450;c.save();c.globalAlpha=1-p;c.translate(d.x*TS,d.y*TS-4-p*10);c.rotate(p*.8*(d.face||1));c.scale(1-p*.4,1-p*.4);DRAW[d.t](c,t,{stun:true});c.restore()}});
 if(S.lvl===0&&S.shelter){const sh=S.shelter;list.push({y:sh.y1-.1,f:()=>drawShelter(c,t,sh)})}
 if(S.lvl===0&&S.mom){const m=S.mom,d=m.dir||m.face||1,KID={walk:0,shirt:"#ff6b6b",pants:"#24476b",hair:"#6b3f1f",skin:m.skin,bag:null,old:false,cap:"#e63946"};
  const put=(x,y,fn)=>list.push({y,f:()=>{c.save();c.translate(x*TS,y*TS-4);fn();c.restore()}});
  put(m.x,m.y,()=>{c.save();c.scale(d<0?-1:1,1);drawShopper(c,t,{walk:m.st==="load"?0:m.walk,shirt:m.shirt,pants:"#5a4636",hair:m.hair,skin:m.skin,long:true,bag:null,old:false,cap:null});
    if(m.st==="go"){const kx=.62*TS;c.strokeStyle=m.skin;c.lineWidth=2.2;c.beginPath();c.moveTo(11.5,8.5);c.lineTo(kx-6,8.5);c.stroke();
      c.save();c.translate(kx,5);c.scale(.62,.62);drawShopper(c,t,Object.assign({},KID,{walk:m.walk}));c.restore()}
    else if(m.st==="load"){const p=1-m.t/(m.T||2.2),cx=.95*TS;
      if(p<.4){const k=p/.4;c.save();c.translate(cx,-(1-k)*1.2*TS);drawCartEmpty(c,t,{s:.95});c.restore();
        c.save();c.translate(.62*TS,5);c.scale(.62,.62);drawShopper(c,t,KID);c.restore()}
      else if(p<.72){const k=(p-.4)/.32,kx=(.62+(.95-.62)*k)*TS,ky=5-Math.sin(k*Math.PI)*24;c.save();c.translate(cx,0);drawCartEmpty(c,t,{s:.95});c.restore();
        c.save();c.translate(kx,ky);c.scale(.62,.62);drawShopper(c,t,KID);c.restore()}
      else{c.save();c.translate(cx,-1+Math.sin(t/90)*1.2);drawCart(c,t,{calm:true});c.restore()}}
    c.restore()});
  if(m.st==="dash")put(m.cx,m.y,()=>{c.save();c.scale(d<0?-1:1,1);c.strokeStyle="rgba(255,255,255,.75)";c.lineWidth=2;c.lineCap="round";
    for(let i=0;i<4;i++){const y=-8+i*7,l=22+((t/25+i*9)%14);c.beginPath();c.moveTo(-18,y);c.lineTo(-18-l,y);c.stroke()}
    c.rotate(-.06);c.translate(0,Math.sin(t/35)*1.2);drawCart(c,t,{calm:false,charge:true});c.restore()})}
 for(const p of S.players){if(p.hidden||p.away)continue;const r=rp(p);if(S.lvl===8)continue;if(S.lvl===7){if(!p.watch)list.push({y:r.y,f:()=>drawKartP(c,p,r,t,now)});continue}cartChain(c,p,r,list,t);list.push({y:r.y,f:()=>drawPlayer(c,p,r,t,now)});const F=p.fish;if(!F)continue;
  const fr=rp({id:"fish"+p.id,x:F.x,y:F.y});list.push({y:fr.y+.3,f:()=>{c.save();c.translate(fr.x*TS,fr.y*TS+Math.sin(t/400)*3);drawBowl(c,t,F.water,F.pot,F.food<=0||F.water<=0);c.restore();
  const bw=30,by=fr.y*TS-24+Math.sin(t/400)*3;c.fillStyle="rgba(0,0,0,.55)";rr(c,fr.x*TS-bw/2,by,bw,5,2.5);c.fill();c.fillStyle=F.food<25?"#ff5d6c":"#ffb347";rr(c,fr.x*TS-bw/2+1,by+1,(bw-2)*cl(F.food,0,100)/100,3,1.5);c.fill();
  c.fillStyle="rgba(0,0,0,.55)";rr(c,fr.x*TS-bw/2,by+7,bw,5,2.5);c.fill();c.fillStyle=F.water<WCOST+2?"#ff5d6c":"#5ab8ff";rr(c,fr.x*TS-bw/2+1,by+8,(bw-2)*cl(F.water,0,100)/100,3,1.5);c.fill()}})}
 for(const q of S.people||[]){const r=rp(q);if(r.x<x0-2||r.x>x1+2||r.y<y0-2||r.y>y1+2)continue;list.push({y:r.y,f:()=>{c.save();c.translate(r.x*TS,r.y*TS-4);c.scale(q.face<0?-1:1,1);if(q.zoo!=null)drawZooClerk(c,t+r.x*150,{sp:q.zoo,walk:q.walk});else drawShopper(c,t+r.x*150,q);c.restore()}})}
 if(S.fount){const f=S.fount;list.push({y:f[1]+(f[3]-f[1])*.6,f:()=>drawFountain(c,t,f)})}
 for(const cg of S.cages||[])list.push({y:cg.y+.45,f:()=>drawCage(c,cg,t)});
 for(const a of S.critters||[]){const r=rp(a);list.push({y:r.y,f:()=>{c.save();c.translate(r.x*TS,r.y*TS);c.scale(a.face<0?-1:1,1);drawAnimal(c,a.sp,t+r.x*90,true);c.restore()}})}
 list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 for(const q of S.proj){const r=rp(q);c.save();c.translate(r.x*TS,r.y*TS-6);const ro=(q.rot||0)+t/80;
  if(q.k==="cart"){c.rotate(ro*.12);drawCartEmpty(c,t,{s:.85})}
  else if(q.k==="soap"){c.rotate(ro*.5);c.fillStyle=lg(c,0,-5,0,5,"#f1d9ff","#b583e6");rr(c,-8,-5,16,10,4);c.fill();el(c,-3,-2,2.6,1.2,"rgba(255,255,255,.7)")}
  else if(q.k==="gum"){if(q.st==="fly"){const f=Math.min(1,q.t/q.ft);c.translate(0,-Math.sin(f*PI)*26)}else{const bl=Math.sin(q.t*30)>0;c.strokeStyle="rgba(255,79,154,.5)";c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.arc(0,6,(q.mega?2.6:1.8)*TS,0,7);c.stroke();c.setLineDash([]);if(bl)el(c,0,0,10,10,"rgba(255,255,255,.4)")}
   c.beginPath();c.arc(0,0,7,0,7);c.fillStyle=rg(c,-2,-2,1,8,"#ffc2e0","#ff4f9a");c.fill()}
  else if(q.k==="water"){const col=q.pot?POT[q.pot].col:"#8fe0ff";c.rotate(Math.atan2(q.vy,q.vx));el(c,0,0,7,4,col);el(c,-8,0,4,2.5,col+"99")}
  else if(q.k==="pizza"){c.rotate(ro);drawPizzaShape(c,10)}
  else if(q.k==="cake"){c.rotate(Math.sin(ro)*.3);drawCakeShape(c,9)}
  else if(q.k==="knife"){c.rotate(Math.atan2(q.vy,q.vx)+ro*.6);c.fillStyle="#e6ebf2";c.beginPath();c.moveTo(10,0);c.lineTo(-4,-3);c.lineTo(-4,3);c.fill();c.fillStyle="#3a2a1a";c.fillRect(-10,-2,6,4)}
  else if(q.k==="chop"){c.rotate(Math.atan2(q.vy,q.vx));c.fillStyle="#c9a26b";c.fillRect(-9,-2.5,18,1.8);c.fillRect(-9,.7,18,1.8)}
  c.restore()}
 for(const r0 of S.parrots||[]){const r=rp(r0);el(c,r.x*TS,r.y*TS+8,9,3,"rgba(0,0,0,.18)");c.save();c.translate(r.x*TS,(r.y-1.5)*TS+Math.sin(t/300+r0.ph)*4);c.scale(r0.vx<0?-1:1,1);drawParrotFly(c,t,r0.ph);c.restore()}
 FX.pt=FX.pt.filter(p=>(p.l+=dt)<p.ml);for(const p of FX.pt){p.vy+=6*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=1-p.l/p.ml;el(c,p.x*TS,p.y*TS,p.s,p.s,p.c)}c.globalAlpha=1;
 FX.fl=FX.fl.filter(f=>now-f.b<1100);c.textAlign="center";c.font="700 15px Fredoka,system-ui,sans-serif";c.lineJoin="round";
 for(const f of FX.fl){const p=(now-f.b)/1100,y=f.y*TS-30-p*24;c.globalAlpha=p<.75?1:(1-p)*4;c.lineWidth=4;c.strokeStyle="rgba(20,10,40,.85)";c.strokeText(f.t,f.x*TS,y);c.fillStyle=f.c;c.fillText(f.t,f.x*TS,y)}c.globalAlpha=1;
 const ob=objective(m);
 if(ob&&m&&S.phase==="play"){const sx=(ob[0]-camX)/VWt,sy=(ob[1]-camY)/VHt;
  if(sx>.04&&sx<.96&&sy>.08&&sy<.92){const b=Math.sin(t/200)*4;c.fillStyle="#ffc93c";c.strokeStyle="rgba(40,20,0,.6)";c.lineWidth=2;c.beginPath();c.moveTo(ob[0]*TS-8,ob[1]*TS-40+b);c.lineTo(ob[0]*TS+8,ob[1]*TS-40+b);c.lineTo(ob[0]*TS,ob[1]*TS-30+b);c.closePath();c.fill();c.stroke()}
  else{const a=Math.atan2(ob[1]-mr.y,ob[0]-mr.x),ex=cl(.5+Math.cos(a)*.5,.06,.94),ey=cl(.5+Math.sin(a)*.5,.12,.88);c.save();c.translate((camX+ex*VWt)*TS,(camY+ey*VHt)*TS);c.rotate(a);c.fillStyle="#ffc93c";c.strokeStyle="rgba(40,20,0,.6)";c.lineWidth=2;c.beginPath();c.moveTo(14,0);c.lineTo(-8,-10);c.lineTo(-3,0);c.lineTo(-8,10);c.closePath();c.fill();c.stroke();c.restore()}}
 c.setTransform(1,0,0,1,0,0);
 const fp=(now-FX.myFlash)/350;if(fp<1){c.fillStyle=rg(c,cv.width/2,cv.height/2,cv.height*.2,cv.height*.8,"rgba(255,40,60,0)",`rgba(255,40,60,${.4*(1-fp)})`);c.fillRect(0,0,cv.width,cv.height)}
 if(m&&m.fish&&(m.fish.food<=0||m.fish.water<=0)){c.fillStyle=`rgba(255,154,46,${.12+.08*Math.sin(t/200)})`;c.fillRect(0,0,cv.width,cv.height)}
}
const TRAIL={};
function cartChain(c,p,r,list,t){const n=p.carts|0,T=TRAIL[p.id]||(TRAIL[p.id]=[]);T.length=n;
 for(let i=0;i<n;i++){const lead=i?T[i-1]:r;if(!T[i])T[i]={x:lead.x-p.face*.9,y:lead.y+.05,f:p.face};const q=T[i],dx=lead.x-q.x,dy=lead.y-q.y,d=Math.hypot(dx,dy)||1,gap=.95;
  if(d>gap){q.x=lead.x-dx/d*gap;q.y=lead.y-dy/d*gap;if(Math.abs(dx)>.05)q.f=Math.sign(dx)}
  list.push({y:q.y-.02,f:()=>{c.save();c.translate(q.x*TS,q.y*TS-4);c.scale(q.f<0?-1:1,1);drawCartEmpty(c,t,{s:.9});c.restore()}})}}
function drawShelter(c,t,sh){const x0=sh.x0*TS,w=(sh.x1-sh.x0)*TS,y0=sh.y0*TS,y1=sh.y1*TS,n=S.cartN|0,cap=S.cartCap|0,full=n>=cap;
 c.fillStyle="rgba(0,0,0,.16)";rr(c,x0-4,y0+6,w+8,y1-y0+2,5);c.fill();
 c.fillStyle="#cfd6e0";rr(c,x0,y0+10,w,y1-y0-10,3);c.fill();c.fillStyle="#9aa5b8";c.fillRect(x0,y1-5,w,5);
 for(let i=0;i<cap;i++){const cx=x0+(i+.5)*(w/cap),cy=y0+TS*.72;c.strokeStyle="rgba(60,70,90,.35)";c.lineWidth=1.4;c.setLineDash([3,3]);rr(c,cx-w/cap*.42,cy-12,w/cap*.84,26,3);c.stroke();c.setLineDash([]);
  if(i<n){c.save();c.translate(cx,cy+2);drawCartEmpty(c,t,{s:.78});c.restore()}}
 c.fillStyle="#2b3a5c";rr(c,x0-6,y0-4,w+12,16,4);c.fill();c.fillStyle=full?"#ff5d6c":"#4fb8ff";c.fillRect(x0-6,y0+8,w+12,3);
 c.fillStyle="#2b3a5c";c.fillRect(x0+2,y0+8,3,TS*.6);c.fillRect(x0+w-5,y0+8,3,TS*.6);
 c.font="700 10px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillStyle="#fff";c.fillText(full?"CARRELLI · PIENA":`CARRELLI ${n}/${cap}`,x0+w/2,y0+4)}
function drawPlayer(c,p,r,t,now){
 const sw=FX.sw[p.id],swing=sw&&now-sw.b<230;
 c.save();c.translate(r.x*TS,r.y*TS-4);
 if(p.down){c.globalAlpha=.6;c.translate(0,10);c.rotate(PI/2);drawKid(c,t,{hero:p.hero,look:p.look,walk:0});c.restore();
  if(p.rev>0){c.strokeStyle="#4fe3b5";c.lineWidth=4;c.beginPath();c.arc(r.x*TS,r.y*TS-6,22,-PI/2,-PI/2+PI*2*p.rev/2);c.stroke()}
  c.font="700 12px Fredoka,system-ui";c.textAlign="center";c.fillStyle="#fff";c.fillText(p.respawn>0?"…":"Aiuto!",r.x*TS,r.y*TS-30);return}
 if(p.inv>0&&Math.floor(t/90)%2)c.globalAlpha=.45;
 c.scale(p.face<0?-1:1,1);drawKid(c,t,{hero:p.hero,look:p.look,walk:p.walk});
 c.save();c.translate(12,8);const w=p.w;
 if(w===0&&!swing){c.fillStyle=GR(p).up.towel?"#2f8fd8":"#4fb8ff";rr(c,-2,-2,5,12,2);c.fill();c.fillStyle="#fff";c.fillRect(-2,3,5,1.6)}
 else if(w===1){c.fillStyle="#c9a0f0";rr(c,-3,-3,8,6,3);c.fill()}
 else if(w===2){el(c,1,0,4,4,"#ff6fae")}
 c.restore();c.restore();
 if(swing){const p2=(now-sw.b)/230,a=Math.atan2(sw.ay,sw.ax);c.save();c.translate(r.x*TS,r.y*TS-6);c.rotate(a);
  c.strokeStyle=sw.wet?"rgba(80,170,255,.9)":"rgba(120,200,255,.85)";c.lineWidth=10*(1-p2)+3;c.lineCap="round";c.beginPath();c.arc(0,0,34,-1.1+p2*1.4,-.2+p2*1.4);c.stroke();
  c.strokeStyle="rgba(255,255,255,.8)";c.lineWidth=2;c.beginPath();c.arc(0,0,34,-1.1+p2*1.4,-.2+p2*1.4);c.stroke();
  if(sw.wet)for(let i=0;i<3;i++)el(c,30+i*4,-10+i*8,2,2,"#8fe0ff");c.restore()}
 if(p.carry){c.save();c.translate(r.x*TS,r.y*TS-54+Math.sin(t/200)*2);if(p.carry.k==="pizza")drawPizzaShape(c,11);else if(p.carry.k==="key"){drawKey(c,p.carry.sp);c.translate(0,-11);c.scale(.5,.5);drawAnimal(c,p.carry.sp,t,false)}else drawItem(c,{k:"merch",c:p.carry.c,x:0},0);c.restore()}
 if(p.stun>0){c.save();c.translate(r.x*TS,r.y*TS-48);stars(c,t,0);c.restore()}
 {const bw=30,by=r.y*TS-40;c.fillStyle="rgba(0,0,0,.55)";rr(c,r.x*TS-bw/2,by,bw,5,2.5);c.fill();const hp=cl(p.hp/p.max,0,1);c.fillStyle=hp<.3?"#ff5d6c":hp<.6?"#ffc93c":"#4fe3b5";rr(c,r.x*TS-bw/2+1,by+1,(bw-2)*hp,3,1.5);c.fill()}
 {const f=Math.max((p.kT||0)/1,(p.fT||0)/1.2,(p.dT||0)/.8);dwellRing(c,r.x*TS,r.y*TS-66,f)}
 if(S.mode!=="solo")nameTag(c,p,r.x*TS,r.y*TS+28)
}
const HEROC=["#9ff58a","#c9a5ff","#ffe58a","#ff9f6b"];
function nameTag(c,p,x,y){c.font="700 11px Fredoka,system-ui";c.textAlign="center";c.lineWidth=3;c.strokeStyle="rgba(20,10,40,.8)";const t=S.rule==="squadre"?(p.team?"🐧 ":"🦭 ")+p.name:p.name;c.strokeText(t,x,y);c.fillStyle=S.rule==="squadre"?TEAMC[p.team|0]:HEROC[p.hero]||"#fff";c.fillText(t,x,y)}
/* poster del menu */
function drawPoster(el,t){const w=el.clientWidth;if(!w)return;const h=el.clientHeight,px=Math.round(w*dpr);if(el.width!==px||el.height!==Math.round(h*dpr)){el.width=px;el.height=Math.round(h*dpr)}
 const c=el.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 c.fillStyle=rg(c,w/2,h*.6,10,w*.6,"rgba(255,111,174,.35)","rgba(255,111,174,0)");c.fillRect(0,0,w,h);
 const s=Math.min(2.2,h/80);
 for(let i=0;i<4;i++){c.save();c.translate(w/2+(-100+i*34)*s/1.6,h*.64-(i>1?6:0));c.scale(s*(i%2?-.9:.9),s*.9);drawKid(c,t+i*300,{hero:[2,0,1,3][i],look:"boy",walk:t/150+i});c.restore()}
 c.save();c.translate(w/2+70*s/1.6,h*.55);c.scale(s*.9,s*.9);drawPrincess(c,t,true);c.restore();
 c.save();c.translate(w/2+20*s/1.6,h*.32+Math.sin(t/400)*4);c.scale(s*.8,s*.8);drawBowl(c,t,90,null,false);c.restore()}
function drawPosterLoop(t){if(!$("ovEnd").hidden)drawPoster($("poster2"),t)}

function drawDoor(c,px,py,acc,label,state,t,bottom){const near=S.players.some(p=>!p.hidden&&dist(p.x,p.y,px/TS,py/TS)<1.8),sl=near&&state!=="lock"?11:1;
 c.save();c.translate(px,py);c.fillStyle="#2b2f3c";rr(c,-20,-20,40,40,4);c.fill();c.fillStyle=acc;c.fillRect(-20,bottom?16:-20,40,4);
 c.fillStyle="rgba(190,235,255,.85)";c.fillRect(-18,-16,17-sl,32);c.fillRect(1+sl,-16,17-sl,32);c.fillStyle="rgba(255,255,255,.5)";c.fillRect(-15,-14,2,26);c.fillRect(4+sl,-14,2,26);
 if(near&&state!=="lock"){c.fillStyle="rgba(255,240,170,.25)";c.fillRect(-7,-16,14,32)}
 if(label){c.font="700 9px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillStyle="#fff";c.fillText(label,0,bottom?-11:11)}
 if(state==="done"){el(c,12,-12,8,8,"#2fcf98");c.strokeStyle="#fff";c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(8,-12);c.lineTo(11,-9);c.lineTo(16,-15);c.stroke()}
 if(state==="lock"){c.fillStyle="#ffc93c";rr(c,-7,-3,14,11,2);c.fill();c.strokeStyle="#ffc93c";c.lineWidth=2.6;c.beginPath();c.arc(0,-3,4.5,PI,0);c.stroke();el(c,0,2,1.6,1.6,"#3a2300")}
 c.restore()}
function drawFountain(c,t,f){const cx=(f[0]+f[2])/2*TS,cy=(f[1]+f[3])/2*TS,rx=(f[2]-f[0])/2*TS,ry=(f[3]-f[1])/2*TS;
 el(c,cx,cy+ry*.2,rx+6,ry+4,"rgba(0,0,0,.18)");
 c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,7);c.fillStyle=lg(c,0,cy-ry,0,cy+ry,"#e2dccf","#a39b8d");c.fill();
 c.beginPath();c.ellipse(cx,cy+3,rx-12,ry-11,0,0,7);c.fillStyle=lg(c,0,cy-ry,0,cy+ry,"#8fe0ff","#2f86d0");c.fill();
 c.save();c.beginPath();c.ellipse(cx,cy+3,rx-12,ry-11,0,0,7);c.clip();
 c.strokeStyle="rgba(230,248,255,.65)";c.lineWidth=1.4;for(let i=0;i<4;i++){const p=((t/2200)+i/4)%1;c.globalAlpha=1-p;c.beginPath();c.ellipse(cx,cy+8,20+p*(rx-30),8+p*(ry-24),0,0,7);c.stroke()}c.globalAlpha=1;
 for(let i=0;i<9;i++){const a=hash(i,3)*PI*2,r=.3+hash(i,7)*.55;el(c,cx+Math.cos(a)*(rx-20)*r,cy+12+Math.sin(a)*(ry-18)*r,2.6,1.6,"rgba(255,215,90,.85)")}c.restore();
 c.fillStyle=lg(c,cx-10,0,cx+10,0,"#e8e2d6","#b5ad9f");rr(c,cx-9,cy-14,18,26,4);c.fill();el(c,cx,cy-14,16,6,"#d6cfc2");
 const b=Math.sin(t/500)*2,mx=cx+22,my=cy-40+b;
 c.save();c.translate(cx,cy-36+b);c.scale(3.6,3.6);c.rotate(-.25);drawFishBody(c,t,"#ff5a2a");c.restore();
 c.save();c.translate(cx,cy-60+b);c.fillStyle=lg(c,0,-6,0,2,"#ffe58a","#d99a1e");c.beginPath();c.moveTo(-8,2);c.lineTo(-9,-6);c.lineTo(-4,-1);c.lineTo(0,-8);c.lineTo(4,-1);c.lineTo(9,-6);c.lineTo(8,2);c.closePath();c.fill();c.restore();
 for(let i=0;i<18;i++){const ph=((t/1300)+i/18)%1,s=i%2?1:-1,sp=.6+hash(i,1)*.5;const x=mx-4+s*ph*rx*.7*sp,y=my-Math.sin(ph*PI)*55*sp+ph*ph*40;c.globalAlpha=1-ph*.8;el(c,x,y,2.6,3.4,"#bfeaff");}
 for(let i=0;i<8;i++){const ph=((t/700)+i/8)%1;c.globalAlpha=1-ph;el(c,mx+Math.sin(i)*3,my-ph*46,2,3,"#e6f7ff")}c.globalAlpha=1;
 c.fillStyle="#6b6457";rr(c,cx-46,cy+ry-20,92,18,6);c.fill();c.font="700 10.5px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillStyle="#ffe58a";c.fillText("Fontana · salva qui",cx,cy+ry-11)}

function drawCage(c,cg,t){const x=cg.x*TS,y=cg.y*TS,col=SP[cg.sp].c;c.save();c.translate(x,y);
 el(c,0,17,18,4,"rgba(0,0,0,.2)");c.fillStyle="#6b5a3a";rr(c,-19,10,38,8,2);c.fill();
 if(!cg.open){c.save();c.translate(-6,4);c.scale(.7,.7);drawAnimal(c,cg.sp,t,false);c.restore();c.save();c.translate(7,6);c.scale(-.7,.7);drawAnimal(c,cg.sp,t+300,false);c.restore();
  c.strokeStyle="#4a4f5c";c.lineWidth=2;for(let i=-16;i<=16;i+=5.3)ln(c,i,-16,i,11);c.fillStyle="#4a4f5c";rr(c,-19,-19,38,5,2);c.fill();
  c.fillStyle=col;rr(c,-5,-3,10,9,2);c.fill();c.strokeStyle=col;c.lineWidth=2.2;c.beginPath();c.arc(0,-3,3.6,PI,0);c.stroke();el(c,0,1.5,1.3,1.3,"#fff")}
 else{c.strokeStyle="#4a4f5c";c.lineWidth=2;c.fillStyle="#4a4f5c";rr(c,-19,-19,38,5,2);c.fill();for(const i of[-16,16])ln(c,i,-16,i,11);c.save();c.translate(-16,-14);c.rotate(-1.2);for(let i=0;i<5;i++)ln(c,i*5.3,0,i*5.3,26);c.restore();
  el(c,12,-10,7,7,"#2fcf98");c.strokeStyle="#fff";c.lineWidth=2.2;c.beginPath();c.moveTo(8,-10);c.lineTo(11,-7);c.lineTo(16,-13);c.stroke()}
 c.restore()}

/* ---------- scena del negozio di pesca ---------- */
function drawScene(t,dt){const c=cx,now=performance.now(),W=12,H=18.6;c.setTransform(1,0,0,1,0,0);
 c.fillStyle=lg(c,0,0,0,cv.height,"#1f5a7a","#0d2c44");c.fillRect(0,0,cv.width,cv.height);
 const k=Math.min(cv.width/(W*TS),cv.height/(H*TS)),ox=(cv.width-W*TS*k)/2,oy=(cv.height-H*TS*k)/2+Math.min(20*dpr,(cv.height-H*TS*k)/2);
 c.setTransform(k,0,0,k,ox,oy);VIEW.scene={k,ox,oy};
 for(let i=0;i<6;i++){const x=i*2*TS+TS*.2;c.fillStyle="rgba(255,255,255,.06)";rr(c,x,TS*.2,TS*1.6,TS*1.2,6);c.fill();c.save();c.translate(x+TS*.8,TS*.8);drawFishBody(c,t+i*500,FCOL[i],.8);c.restore()}
 c.fillStyle="#3fa9f5";rr(c,W*TS/2-120,TS*.15,240,26,10);c.fill();c.font="700 17px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillStyle="#fff";c.fillText("Il Mondo dei Pesci",W*TS/2,TS*.15+14);
 c.fillStyle="#9a6a42";c.fillRect(-TS*2,TS*1.9,W*TS+TS*4,TS*2.2);c.fillStyle="#7a4f2c";for(let x=-2;x<W+2;x+=1.2)c.fillRect(x*TS,TS*1.9,2,TS*2.2);c.fillStyle="rgba(0,0,0,.25)";c.fillRect(-TS*2,TS*4.05,W*TS+TS*4,6);
 const bx0=BOWL.x0*TS,bx1=BOWL.x1*TS,by0=(BOWL.y0-.6)*TS,by1=(BOWL.y1+.4)*TS;
 c.save();c.beginPath();c.moveTo(bx0,by0);c.lineTo(bx1,by0);c.lineTo(bx1,by1-90);c.quadraticCurveTo(bx1,by1,bx1-90,by1);c.lineTo(bx0+90,by1);c.quadraticCurveTo(bx0,by1,bx0,by1-90);c.closePath();
 c.fillStyle="rgba(200,235,255,.12)";c.fill();c.clip();
 c.fillStyle=lg(c,0,BOWL.y0*TS,0,by1,"#7fd3ff","#1d6fb0");c.fillRect(bx0,BOWL.y0*TS+Math.sin(t/500)*3,bx1-bx0,by1);
 c.fillStyle="#e8d29a";c.beginPath();c.moveTo(bx0,by1-26);for(let x=bx0;x<=bx1;x+=20)c.lineTo(x,by1-26-Math.sin(x/40)*6);c.lineTo(bx1,by1);c.lineTo(bx0,by1);c.fill();
 for(let i=0;i<7;i++){const x=bx0+40+i*62;c.strokeStyle=i%2?"#2f8f48":"#3fae5a";c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(x,by1-24);c.quadraticCurveTo(x+Math.sin(t/700+i)*14,by1-80,x+Math.sin(t/600+i)*8,by1-120-i%3*30);c.stroke()}
 for(let i=0;i<10;i++){const p=((t/2600)+i/10)%1;el(c,bx0+30+i*44+Math.sin(t/400+i)*6,by1-30-p*(by1-BOWL.y0*TS-40),3+i%3,3+i%3,"rgba(255,255,255,.35)")}
 for(const o of S.fobj){c.save();c.translate(o.x*TS,o.y*TS);if(o.vx<0)c.scale(-1,1);
  if(o.k==="fish")drawFishBody(c,t+o.ph*300,o.col,1.6*o.s);else if(o.k==="eel")drawEel(c,t+o.ph*200);else if(o.k==="mouse")drawMouseSwim(c,t);else if(o.k==="boot"){c.rotate(Math.sin(t/900+o.ph)*.1);drawBoot(c)}else{c.rotate(.2+Math.sin(t/800+o.ph)*.1);drawCan(c)}c.restore()}
 c.restore();
 c.strokeStyle="rgba(230,245,255,.85)";c.lineWidth=4;c.beginPath();c.moveTo(bx0,by0);c.lineTo(bx0,by1-90);c.quadraticCurveTo(bx0,by1,bx0+90,by1);c.lineTo(bx1-90,by1);c.quadraticCurveTo(bx1,by1,bx1,by1-90);c.lineTo(bx1,by0);c.stroke();
 c.fillStyle="rgba(255,255,255,.25)";rr(c,bx0+14,by0+20,8,(by1-by0)*.6,4);c.fill();c.fillStyle="rgba(230,245,255,.6)";rr(c,bx0-8,by0-8,bx1-bx0+16,12,6);c.fill();
 S.players.forEach((p,i)=>{if(p.hidden||p.away)return;const r=p.rod||{ang:0,st:"idle",len:0},px=p.x*TS,py=p.y*TS,tip=rodTip(p);
  c.save();c.translate((p.x+.95)*TS,3.25*TS);drawBasket(c,bk(p).length,t,bk(p).map(f=>f.col));c.restore();
  c.save();c.translate(px,py);if(p.inv>0&&Math.floor(t/90)%2)c.globalAlpha=.5;if(p.down)c.globalAlpha=.4;c.scale(p.face<0?-1.3:1.3,1.3);drawKid(c,t,{hero:p.hero,look:"boy",walk:0});c.restore();
  c.strokeStyle="#6b4423";c.lineWidth=4;c.lineCap="round";ln(c,(p.x+.3)*TS,2.55*TS,tip[0]*TS,tip[1]*TS);
  const dx=Math.sin(r.ang),dy=Math.cos(r.ang),L=r.st==="idle"?.5:r.len,hx=tip[0]+dx*L,hy=tip[1]+dy*L+(r.st==="idle"?Math.sin(t/300)*.05:0);
  c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=1.3;ln(c,tip[0]*TS,tip[1]*TS,hx*TS,hy*TS);
  if(r.obj){const o=r.obj;c.save();c.translate(hx*TS,hy*TS+8);c.rotate(PI/2);if(o.k==="fish")drawFishBody(c,t,o.col,1.6*o.s);else if(o.k==="eel"){c.scale(.8,.8);drawEel(c,t)}else if(o.k==="mouse")drawMouseSwim(c,t);else if(o.k==="boot")drawBoot(c);else drawCan(c);c.restore()}
  else{c.strokeStyle="#e6ebf2";c.lineWidth=2;c.beginPath();c.arc(hx*TS-3,hy*TS+4,4,0,PI);c.stroke();el(c,hx*TS,hy*TS-3,3.4,2.6,"#ff4f6d")}
  if(r.st==="idle"){c.strokeStyle="rgba(255,255,255,.25)";c.setLineDash([4,6]);c.lineWidth=1.5;ln(c,tip[0]*TS,tip[1]*TS,(tip[0]+dx*6)*TS,(tip[1]+dy*6)*TS);c.setLineDash([])}
  {const bw=34,by=py-50;c.fillStyle="rgba(0,0,0,.55)";rr(c,px-bw/2,by,bw,5,2.5);c.fill();const hp=cl(p.hp/p.max,0,1);c.fillStyle=hp<.3?"#ff5d6c":hp<.6?"#ffc93c":"#4fe3b5";rr(c,px-bw/2+1,by+1,(bw-2)*hp,3,1.5);c.fill()}
  if(S.mode!=="solo")nameTag(c,p,px,py+28)});
 for(const ct of S.scats){c.save();c.translate(ct.x*TS,ct.y*TS);c.scale(ct.st==="go"?(ct.x<S.players[0].x?1:-1):ct.side,1);drawCat(c,t,{walk:ct.walk,flee:ct.st!=="go"});if(ct.fish){c.translate(14,-2);c.rotate(.4);drawFishBody(c,t,ct.fish.col,.7)}c.restore()}
 FX.pt=FX.pt.filter(p=>(p.l+=dt)<p.ml);for(const p of FX.pt){p.vy+=6*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=1-p.l/p.ml;el(c,p.x*TS,p.y*TS,p.s,p.s,p.c)}c.globalAlpha=1;
 FX.fl=FX.fl.filter(f=>now-f.b<1400);c.textAlign="center";c.font="700 15px Fredoka,system-ui,sans-serif";c.lineJoin="round";
 for(const f of FX.fl){const p=(now-f.b)/1400,y=f.y*TS-30-p*24;c.globalAlpha=p<.75?1:(1-p)*4;c.lineWidth=4;c.strokeStyle="rgba(20,10,40,.85)";c.strokeText(f.t,cl(f.x*TS,90,W*TS-90),y);c.fillStyle=f.c;c.fillText(f.t,cl(f.x*TS,90,W*TS-90),y)}c.globalAlpha=1;
 c.setTransform(1,0,0,1,0,0);const fp=(now-FX.myFlash)/350;if(fp<1){c.fillStyle=`rgba(255,230,80,${.35*(1-fp)})`;c.fillRect(0,0,cv.width,cv.height)}}

/* ---------- parcheggio: pista, carrelli, gadget ---------- */
function buildRaceBG(){SC=document.createElement("canvas");SC.width=S.W*TS*SS;SC.height=S.H*TS*SS;const c=SC.getContext("2d");c.scale(SS,SS);const W=S.W,H=S.H;
 c.fillStyle="#3f8f55";c.fillRect(0,0,W*TS,H*TS);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*TS,py=y*TS,road=S.G[y][x]==="."&&rRoad(x+.5,y+.5),isl=rIn(x+.5,y+.5,6,6,38,24,3);
  if(road){c.fillStyle=(x+y)%2?"#4a4d57":"#474a54";c.fillRect(px,py,TS,TS);if(hash(x,y)>.8){c.fillStyle="rgba(255,255,255,.05)";c.fillRect(px+hash(y,x)*30,py+hash(x*3,y)*30,5,3)}}
  else if(isl){c.fillStyle=(x+y)%2?"#aeb2be":"#a8acb8";c.fillRect(px,py,TS,TS)}
  else{c.fillStyle=(x+y)%2?"#3f8f55":"#3a8851";c.fillRect(px,py,TS,TS);if(hash(x+9,y)>.86){c.fillStyle="rgba(255,255,255,.35)";c.fillRect(px+hash(y,x)*30,py+hash(x,y*2)*30,3,3)}}}
 // cordoli rosso/bianchi sul bordo della strada
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!(S.G[y][x]==="."))continue;const px=x*TS,py=y*TS;
  for(const[dx,dy,rx,ry,rw,rh]of[[0,-1,0,0,TS,5],[0,1,0,TS-5,TS,5],[-1,0,0,0,5,TS],[1,0,TS-5,0,5,TS]]){const nx=x+dx,ny=y+dy;if(S.G[ny]&&S.G[ny][nx]==="#"){c.fillStyle=((x+y)&1)?"#e63946":"#fff";c.fillRect(px+rx,py+ry,rw,rh)}}}
 // isola: parcheggio con auto
 const cols=["#e63946","#4fb8ff","#ffd23c","#2fcf98","#c9a5ff","#ff9a2e","#eceff4","#2b3a5c"];
 for(let gy=7.2;gy<23.5;gy+=3){for(let gx=7.5;gx<37;gx+=3.1){if(!rIn(gx+1,gy+.6,6.6,6.6,37.4,23.4,3))continue;c.strokeStyle="rgba(255,255,255,.55)";c.lineWidth=2;c.strokeRect(gx*TS-2,gy*TS-2,2.9*TS,1.8*TS);
   if(hash(gx*5,gy*7)<.28)continue;const col=cols[Math.floor(hash(gx,gy)*cols.length)];c.save();c.translate((gx+1.4)*TS,(gy+.9)*TS);
   c.fillStyle="rgba(0,0,0,.25)";rr(c,-44,-17,88,40,10);c.fill();c.fillStyle=col;rr(c,-46,-24,92,44,12);c.fill();c.fillStyle="rgba(255,255,255,.28)";rr(c,-44,-22,88,12,8);c.fill();
   c.fillStyle="#1d2433";rr(c,-26,-18,50,28,8);c.fill();c.fillStyle=col;rr(c,-22,-15,42,21,6);c.fill();c.fillStyle="#bfe6f2";rr(c,-18,-12,15,14,3);c.fill();rr(c,3,-12,15,14,3);c.fill();
   c.fillStyle="#ffe58a";c.fillRect(40,-16,4,7);c.fillRect(40,6,4,7);c.restore()}}
 // alberelli nelle aiuole agli angoli dell'isola
 for(const[tx,ty]of[[7.5,7.5],[36.5,7.5],[7.5,22.5],[36.5,22.5],[22,15]]){c.fillStyle="rgba(0,0,0,.2)";c.beginPath();c.ellipse(tx*TS,ty*TS+14,26,9,0,0,7);c.fill();c.fillStyle="#6b4a2b";c.fillRect(tx*TS-4,ty*TS-6,8,22);c.fillStyle="#2f9a55";c.beginPath();c.arc(tx*TS,ty*TS-14,24,0,7);c.fill();c.fillStyle="#3fb86a";c.beginPath();c.arc(tx*TS-6,ty*TS-20,14,0,7);c.fill()}
 // linee tratteggiate al centro della pista
 c.strokeStyle="rgba(255,255,255,.55)";c.lineWidth=3;c.setLineDash([14,16]);c.beginPath();RPATH.forEach((q,i)=>i?c.lineTo(q[0]*TS,q[1]*TS):c.moveTo(q[0]*TS,q[1]*TS));c.closePath();c.stroke();c.setLineDash([]);
 // traguardo a scacchi (x=26) e arco
 for(let y=24;y<29;y++)for(let k=0;k<2;k++){c.fillStyle=((y+k)&1)?"#fff":"#1b1b22";c.fillRect(26*TS-8+k*8,y*TS,8,TS)}
 c.fillStyle="#2b3a5c";c.fillRect(26*TS-14,24*TS-22,28,24);c.fillStyle="#ffc93c";c.font="700 9px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("VIA",26*TS,24*TS-10);
 c.fillStyle="rgba(255,255,255,.08)";c.font="700 30px Fredoka,system-ui";c.fillText("PARCHEGGIO",22*TS,15*TS+54);
 scKey="7:"+S.gv}
function spinAng(s){if(!(s>0))return 0;const q=1-Math.min(1,s/1.4);return(q*q*(3-2*q))*PI*4}
function drawKartP(c,p,r,t,now){c.save();c.translate(r.x*TS,r.y*TS-4);
 if(p.shield>0){c.fillStyle="rgba(120,220,255,.2)";c.strokeStyle="rgba(180,240,255,.9)";c.lineWidth=2;c.beginPath();c.arc(0,-10,32+Math.sin(t/120)*1.5,0,7);c.fill();c.stroke()}
 if(p.inv>0&&Math.floor(t/90)%2)c.globalAlpha=.6;
 const me=meP();kart3D(c,t,{h:(p.kh||0)+spinAng(p.spin),hero:p.hero,plook:p.look,look:"hero",boost:p.boost>0,inside:!!me&&me.i===p.i});c.globalAlpha=1;
 if(p.swing>0&&p.w===0){const q=1-Math.min(1,p.swing/.22),a0=(p.kh||0)-1.9,R=2.1*TS;c.save();c.translate(0,2);c.scale(1,.72);c.lineCap="round";
  for(let i=0;i<3;i++){c.strokeStyle=`rgba(${i?255:170},${i?255:225},255,${.75-i*.22})`;c.lineWidth=16-i*5;c.beginPath();c.arc(0,0,R*(1-i*.05),a0,a0+q*3.8);c.stroke()}
  const ea=a0+q*3.8;c.translate(Math.cos(ea)*R,Math.sin(ea)*R);c.rotate(ea+PI/2);c.fillStyle="#fff";rr(c,-20,-8,40,16,6);c.fill();c.fillStyle="#7fd3ff";c.fillRect(-20,-3,40,6);c.restore()}
 if(p.spin>0){c.save();c.translate(0,-50);stars(c,t,0);c.restore()}
 c.restore();if(S.mode!=="solo")nameTag(c,p,r.x*TS,r.y*TS+30)}
/* carrello in pseudo-3D: modello a rete ruotato col verso di marcia, visto in prospettiva */
function kidBust(c,t){const hy=-10;c.fillStyle="#e63946";rr(c,-8,hy+6,16,14,5);c.fill();c.beginPath();c.arc(0,hy,8.5,0,7);c.fillStyle=rg(c,-3,hy-3,2,10,"#ffe0c2","#f0b98e");c.fill();
 c.fillStyle="#e63946";c.beginPath();c.ellipse(0,hy-4,9,5.5,0,PI,0);c.fill();rr(c,-1,hy-6,12,2.6,1.3);c.fill();eyes(c,hy+1,3.4,null,false);c.strokeStyle="#7a2f22";c.lineWidth=1.3;c.beginPath();c.arc(0,hy+3.6,2.4,.2,PI-.2);c.stroke()}
function kart3D(c,t,o){const ch=Math.cos(o.h),sh=Math.sin(o.h),K=.7;
 const P=(lx,ly,z)=>{const X=lx*ch-ly*sh,Y=lx*sh+ly*ch;return[X,Y*K-z,Y]};
 const quad=(pts,fill)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fillStyle=fill;c.fill()};
 const lerp=(a,b,f)=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
 const BZ=7,TZ=25,LB=13,WB=9,LT=17,WT=13;
 const walls=[[[LB,-WB,BZ],[LB,WB,BZ],[LT,WT,TZ],[LT,-WT,TZ]],[[-LB,-WB,BZ],[-LB,WB,BZ],[-LT,WT,TZ],[-LT,-WT,TZ]],[[-LB,-WB,BZ],[LB,-WB,BZ],[LT,-WT,TZ],[-LT,-WT,TZ]],[[-LB,WB,BZ],[LB,WB,BZ],[LT,WT,TZ],[-LT,WT,TZ]]].map(w=>{const q=w.map(v=>P(...v));return{q,d:(q[0][2]+q[1][2]+q[2][2]+q[3][2])/4}}).sort((a,b)=>a.d-b.d);
 // ombra
 el(c,0,3,25,11*K+4,"rgba(0,0,0,.28)");
 const wheel=(lx,ly)=>{const q=P(lx,ly,3);el(c,q[0],q[1],3.6,3.6,"#22232b");el(c,q[0],q[1]-.6,1.6,1.6,"#8a8f9c")};
 const ws=[[11,-8],[11,8],[-11,-8],[-11,8]].sort((a,b)=>(a[0]*sh+a[1]*ch)-(b[0]*sh+b[1]*ch));
 for(const w of ws)if(w[0]*sh+w[1]*ch<0)wheel(w[0],w[1]);
 // pavimento
 quad([P(-LB,-WB,BZ),P(LB,-WB,BZ),P(LB,WB,BZ),P(-LB,WB,BZ)],"rgba(150,160,178,.9)");
 const wall=(w,rim,fade)=>{const[a,b,cc,dd]=w.q;quad(w.q,fade?"rgba(210,220,235,.10)":"rgba(205,216,232,.30)");
  c.strokeStyle=fade?"rgba(175,186,205,.35)":"rgba(165,176,196,.9)";c.lineWidth=1;c.beginPath();
  for(let i=1;i<6;i++){const f=i/6,p0=lerp(a,b,f),p1=lerp(dd,cc,f);c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1])}
  for(let i=1;i<3;i++){const f=i/3,p0=lerp(a,dd,f),p1=lerp(b,cc,f);c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1])}c.stroke();
  c.strokeStyle=rim;c.lineWidth=fade?2:2.6;c.lineCap="round";c.beginPath();c.moveTo(dd[0],dd[1]);c.lineTo(cc[0],cc[1]);c.stroke()};
 const handle=()=>{const l=P(-LT,-WT+2,TZ),r2=P(-LT,WT-2,TZ),l2=P(-LT-5,-WT+3,TZ+6),r3=P(-LT-5,WT-3,TZ+6);c.strokeStyle="#e63946";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(l[0],l[1]);c.lineTo(l2[0],l2[1]);c.lineTo(r3[0],r3[1]);c.lineTo(r2[0],r2[1]);c.stroke();c.strokeStyle="#7a8190";c.lineWidth=1.2;c.stroke()};
 const hDepth=-(LT+5)*sh;
 for(const w of walls)if(w.d<0)wall(w,"#e63946",false);
 if(hDepth<0)handle();
 // personaggio (visto dal carrello: sempre in primo piano dentro la rete)
 c.save();c.translate(0,-15);const sc=o.inside?.98:.84;c.scale(ch<0?-sc:sc,sc);
 if(o.look==="cop")drawGuard(c,t,{walk:0,atk:0});else if(o.look==="nonna")drawGranny(c,t,{walk:0,atk:0});else if(o.look==="hero")drawKid(c,t,{hero:o.hero,look:o.plook,walk:0});else kidBust(c,t);
 c.restore();
 for(const w of walls)if(w.d>=0){if(o.inside)wall(w,"#e63946",true);else wall(w,"#e63946",false)}
 if(hDepth>=0)handle();
 for(const w of ws)if(w[0]*sh+w[1]*ch>=0)wheel(w[0],w[1]);
 if(o.boost){const q=P(-LT-8,0,12);for(let i=0;i<3;i++){const e=P(-LT-20-Math.random()*10,(i-1)*5,10+i*2);c.fillStyle=i%2?"#ffd23c":"#ff7a2e";c.beginPath();c.moveTo(q[0],q[1]-3+i*3);c.lineTo(e[0],e[1]);c.lineTo(q[0],q[1]+3+i*3);c.fill()}}}
function drawRaceObjs(c,t,list){const R=S.race;if(!R)return;
 for(const b of R.boxes){if(b.t>0)continue;list.push({y:b.y,f:()=>{c.save();c.translate(b.x*TS,b.y*TS-8+Math.sin(t/260+b.x)*3);c.fillStyle="rgba(0,0,0,.25)";el(c,0,18,12,4,"rgba(0,0,0,.25)");c.rotate(Math.sin(t/500+b.y)*.25);
  const g=lg(c,-12,-12,12,12,"#ffe36b","#ff9a2e");c.fillStyle=g;rr(c,-13,-13,26,26,6);c.fill();c.strokeStyle="#fff";c.lineWidth=2;rr(c,-13,-13,26,26,6);c.stroke();c.fillStyle="#fff";c.font="700 20px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("?",0,1);c.restore()}})}
 for(const g of R.gums)list.push({y:g.y-.3,f:()=>{c.save();c.translate(g.x*TS,g.y*TS+4);const s=g.big?1.9:1;el(c,0,0,15*s,8*s,"rgba(255,111,174,.85)");el(c,-3*s,-1,8*s,4*s,"#ff9fd0");for(let i=0;i<4;i++)el(c,Math.cos(i*1.6+g.id)*8*s,Math.sin(i*1.6+g.id)*3*s,2.2,1.6,"#fff");c.restore()}});
 for(const q of R.rp)list.push({y:q.y,f:()=>{c.save();c.translate(q.x*TS,q.y*TS-10);c.rotate(Math.atan2(q.vy,q.vx));if(q.hm){c.fillStyle="rgba(255,120,200,.5)";c.beginPath();c.moveTo(-8,-5);c.lineTo(-26,0);c.lineTo(-8,5);c.fill()}
  c.fillStyle=q.hm?"#ff6fae":"#c9a0f0";rr(c,-8,-5,16,10,5);c.fill();c.fillStyle="rgba(255,255,255,.6)";rr(c,-5,-3,8,3,1.5);c.fill();c.restore()}})}
function drawParkDoor(c,px,py,t){const closed=(S.raceCool||0)>0,open=!closed;
 c.fillStyle="#2f333d";c.fillRect(px-TS/2,py-TS/2-6,TS,TS+12);
 c.fillStyle=lg(c,px,py-20,px,py+20,"#dff4ff","#9fd2ee");c.fillRect(px-TS/2+2,py-TS/2,TS-8,TS);
 c.fillStyle="#2f333d";c.fillRect(px-TS/2+2,py-1,TS-8,2);
 if(closed){c.fillStyle="#ff9a2e";for(let i=-1;i<4;i++){c.beginPath();c.moveTo(px-TS/2+2,py-TS/2+i*14);c.lineTo(px+TS/2-6,py-TS/2+i*14+7);c.lineTo(px+TS/2-6,py-TS/2+i*14+14);c.lineTo(px-TS/2+2,py-TS/2+i*14+7);c.fill()}
  const bx=px-92,by=py+TS*.9;c.fillStyle="rgba(0,0,0,.25)";rr(c,bx-70,by-26,142,52,10);c.fill();c.fillStyle="#ffd23c";rr(c,bx-72,by-30,142,52,10);c.fill();c.strokeStyle="#1d2433";c.lineWidth=2;rr(c,bx-72,by-30,142,52,10);c.stroke();
  c.fillStyle="#1d2433";c.font="700 13px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("🧹 PULIZIE IN CORSO",bx-1,by-16);c.font="600 11px Fredoka,system-ui";c.fillText("Torna più tardi · "+Math.ceil(S.raceCool)+" s",bx-1,by+4)}
 else{const a=.5+.5*Math.sin(t/200);c.fillStyle=`rgba(255,154,46,${.5+.4*a})`;c.beginPath();c.moveTo(px-TS/2+4,py-9);c.lineTo(px-TS/2+4,py+9);c.lineTo(px-TS/2-8,py);c.fill();
  c.fillStyle="#ff9a2e";rr(c,px-86,py-TS*1.08,100,24,10);c.fill();c.fillStyle="#fff";c.font="700 15px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("Parcheggio",px-36,py-TS*1.08+13)}}
function dwellRing(c,x,y,f){if(f<.12)return;c.save();c.lineWidth=5;c.strokeStyle="rgba(0,0,0,.4)";c.beginPath();c.arc(x,y,10,0,7);c.stroke();c.strokeStyle=f>=1?"#4fe3b5":"#ffd23c";c.lineCap="round";c.beginPath();c.arc(x,y,10,-PI/2,-PI/2+PI*2*Math.min(1,f));c.stroke();c.restore()}

/* ---------- puzzle: sfondo e auto ---------- */
function pzCell(x,y){return[(PGX+x*PCS)*TS,(PGY+y*PCS)*TS]}
function drawCarTop(c,w,h,col,red,vert){c.save();if(vert)c.rotate(PI/2);
 c.fillStyle="rgba(0,0,0,.28)";rr(c,-w/2+3,-h/2+5,w,h,12);c.fill();c.fillStyle=col;rr(c,-w/2,-h/2,w,h,12);c.fill();
 c.fillStyle="rgba(255,255,255,.25)";rr(c,-w/2+3,-h/2+3,w-6,h*.22,8);c.fill();
 if(red){c.fillStyle="#fff";c.fillRect(-w*.3,-3,w*.55,6)}
 c.fillStyle="#1d2433";rr(c,-w*.3,-h*.34,w*.52,h*.68,8);c.fill();c.fillStyle=col;rr(c,-w*.26,-h*.28,w*.44,h*.56,6);c.fill();
 c.fillStyle="#bfe6f2";rr(c,-w*.22,-h*.24,w*.14,h*.48,3);c.fill();rr(c,w*.04,-h*.24,w*.12,h*.48,3);c.fill();
 c.fillStyle="#ffe58a";c.fillRect(w/2-6,-h/2+5,5,8);c.fillRect(w/2-6,h/2-13,5,8);c.fillStyle="#c33";c.fillRect(-w/2+1,-h/2+5,4,7);c.fillRect(-w/2+1,h/2-12,4,7);c.restore()}
function buildPuzzleBG(){SC=document.createElement("canvas");SC.width=S.W*TS*SS;SC.height=S.H*TS*SS;const c=SC.getContext("2d");c.scale(SS,SS);const W=S.W*TS,H=S.H*TS;
 c.fillStyle="#3f8f55";c.fillRect(0,0,W,H);for(let i=0;i<60;i++){c.fillStyle="rgba(255,255,255,.18)";c.fillRect(hash(i,3)*W,hash(i,9)*H,3,3)}
 const[x0,y0]=pzCell(0,0),sz=PN*PCS*TS;
 c.fillStyle="#2f333d";rr(c,x0-14,y0-14,sz+28,sz+28,14);c.fill();
 for(let y=0;y<PN;y++)for(let x=0;x<PN;x++){const[px,py]=pzCell(x,y);c.fillStyle=(x+y)%2?"#4a4d57":"#474a54";c.fillRect(px,py,PCS*TS,PCS*TS);c.strokeStyle="rgba(255,255,255,.18)";c.lineWidth=1.5;c.strokeRect(px+1,py+1,PCS*TS-2,PCS*TS-2)}
 // strada a destra
 const rx=x0+sz+14;c.fillStyle="#3a3d46";c.fillRect(rx,0,W-rx,H);c.fillStyle="rgba(255,255,255,.6)";for(let y=10;y<H;y+=44)c.fillRect(W-22,y,5,24);
 const[,ey]=pzCell(0,2);c.fillStyle="#ffd23c";c.beginPath();c.moveTo(rx+6,ey+PCS*TS/2-14);c.lineTo(rx+26,ey+PCS*TS/2);c.lineTo(rx+6,ey+PCS*TS/2+14);c.fill();
 c.fillStyle="#fff";c.font="700 13px Fredoka,system-ui";c.textAlign="center";c.fillText("STRADA",(rx+W)/2,H-10);
 c.fillStyle="rgba(255,255,255,.12)";c.font="700 15px Fredoka,system-ui";c.fillText("PARCHEGGIO",x0+sz/2,y0-24);
 scKey="8:"+S.gv}
function drawPuzzleObjs(c,t,list){const Z=S.pz;if(!Z)return;const me=meP(),sel=me?me.sel|0:-1;
 Z.cars.forEach((o,i)=>list.push({y:o.py+(o.ho?0:o.len)*.5+1,f:()=>{const w=o.len*PCS*TS-10,h=PCS*TS-14,[px,py]=pzCell(o.px,o.py);c.save();
  c.translate(px+(o.ho?o.len*PCS*TS/2:PCS*TS/2),py+(o.ho?PCS*TS/2:o.len*PCS*TS/2));
  if(i===sel){const a=.55+.35*Math.sin(t/160);c.strokeStyle=`rgba(255,235,120,${a})`;c.lineWidth=5;rr(c,o.ho?-w/2-5:-h/2-5,o.ho?-h/2-5:-w/2-5,(o.ho?w:h)+10,(o.ho?h:w)+10,16);c.stroke()}
  drawCarTop(c,w,h,o.col,o.red,!o.ho);c.restore()}}))}
