/* ---------- simulazione ---------- */
let S=null;
const IN=[0,1,2,3].map(()=>({mx:0,my:0,atk:false,wsel:0})),NOIN={mx:0,my:0,atk:false,wsel:-1};
let EVQ=[];
const BLOCKP="#S1234RAOKLPF";
function ev(e){EVQ.push(e)}
function toast(t,d){ev({k:"toast",t,d})}
function float(x,y,t,c){ev({k:"float",x,y,t,c})}
function solidAt(x,y){if(x<0||y<0||x>=S.W||y>=S.H)return true;const c=S.G[y][x];if(c==="E")return!S.exitOpen;return SOLID.includes(c)}
function hitsSolid(x,y,r){const x0=Math.floor(x-r),x1=Math.floor(x+r),y0=Math.floor(y-r),y1=Math.floor(y+r);
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(solidAt(tx,ty)){const qx=cl(x,tx,tx+1),qy=cl(y,ty,ty+1);if((x-qx)**2+(y-qy)**2<r*r)return true}return false}
function moveCircle(o,dx,dy,r){o.bx=o.by=false;const st=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/.25));
 for(let i=0;i<st;i++){const nx=o.x+dx/st;if(!hitsSolid(nx,o.y,r))o.x=nx;else o.bx=true;const ny=o.y+dy/st;if(!hitsSolid(o.x,ny,r))o.y=ny;else o.by=true}}
function los(ax,ay,bx,by){const d=dist(ax,ay,bx,by),n=Math.ceil(d/.3);for(let i=1;i<n;i++){const x=Math.floor(ax+(bx-ax)*i/n),y=Math.floor(ay+(by-ay)*i/n);if(S.G[y]&&S.G[y][x]==="#")return false}return true}
function freeSpot(minD){for(let k=0;k<200;k++){const x=ri(1,S.W-2),y=ri(1,S.H-2);if(S.G[y][x]==="."&&!solidAt(x,y)&&!S.players.some(p=>dist(p.x,p.y,x+.5,y+.5)<(minD||3)))return[x+.5,y+.5]}return[S.spawn[0],S.spawn[1]]}

const TEAMS=["Foche","Pinguini"],TEAMC=["#5ab8ff","#ffc93c"];
function newGrp(){return{coins:12,lives:3,frags:0,done:{},ammo:{soap:20,gum:3},up:{},score:0}}
function newFish(){return{food:100,water:100,pot:null,potT:0,x:0,y:0,cd:1,sick:0,warn:0}}
const gi=p=>!S||!p?0:S.rule==="sfida"?p.i:S.rule==="squadre"?(p.team|0):0;
function GR(p){const i=gi(p);return S.grp[i]||(S.grp[i]=newGrp())}
const inPlay=()=>S.players.filter(p=>!p.away);
function groupsInPlay(){const seen={},out=[];for(const p of inPlay()){const i=gi(p);if(!seen[i]){seen[i]=1;GR(p);out.push(i)}}return out}
function grpName(i){if(S.rule==="squadre")return TEAMS[i];if(S.rule==="sfida"){const p=S.players[i];return p?p.name:"?"}return"Squadra"}
function grpScore(i){return S.players.filter(p=>gi(p)===i).reduce((s,p)=>s+(p.score|0),0)}
function mkPlayer(i,h,name,team){return{id:"p"+i,i,hero:h,name,team:team==null?i%2:team,look:"boy",max:100,hp:100,x:0,y:0,fx:1,fy:0,face:1,w:0,cd:0,inv:0,stun:0,slowT:0,slip:0,swing:0,walk:0,kx:0,ky:0,carry:null,down:false,respawn:0,rev:0,hidden:false,away:false,shop:false,ax:1,ay:0,doorLock:false,fish:newFish(),score:0,carts:0}}
function newRun(cfg){
 S={cartN:2,cartCap:5,abn:2,abT:30,momT:10,mode:cfg.mode,rule:cfg.mode==="solo"?"insieme":(cfg.rule||"insieme"),cfg,lvl:0,phase:"play",grp:[],done:{},shops:{},seen:{},
  time:0,nid:1,kills:0,active:0,turnT:75,paused:false,gv:0,players:[],proj:[]};
 S.players=cfg.list.map((o,i)=>mkPlayer(i,o.hero,String(o.name||"Eroe").slice(0,14),o.team));
 if(S.mode==="hot")S.players.forEach((p,i)=>p.hidden=i>0);
 S.players.forEach(p=>GR(p));
 loadLevel(0);placeTeam(S.spawn);
 toast(S.rule==="sfida"?"Sfida! Ognuno per sé: chi fa più punti vince":S.rule==="squadre"?"Foche contro Pinguini: vince la squadra con più punti":"Benvenuti nella hall! Entrate in un negozio dalla sua porta",4.5);
}
const vis=()=>S.players.filter(p=>!p.hidden&&!p.away);
const AREA_KEYS=["fobj","scats","baskets","catT","cages","parrots","poops","critters","G","W","H","enemies","items","tables","ovens","kiosks","shelves","hidden","respawn","fragSpot","cage","exit","spawn","catSpawns","spawnT","mission","people","hallDoors","fount"];
const MARK="@mpx$f";
function baseGrid(L){if(L===7){const g=[];for(let y=0;y<RH;y++){const r=[];for(let x=0;x<RW;x++)r.push(rRoad(x+.5,y+.5)?".":"#");g.push(r)}return g}if(L===8)return Array.from({length:PH},()=>Array(PW).fill("."));return(L?MAPS[L-1]:HALL).map(r=>[...r].map(ch=>MARK.includes(ch)||EN[ch]?".":ch))}
function addEnemy(t,x,y){const d=EN[t],L=Math.max(1,S.lvl),co=S.mode==="coop"?1+.3*Math.max(0,vis().length-1):1;let hp=d.hp;
 if(t==="B")hp=Math.round(d.hp*co);else if(!d.stunOnly&&t!=="k")hp=Math.round(d.hp*(1+.22*(L-1))*co);
 const e={id:"e"+(S.nid++),t,x,y,hx:x,hy:y,hp,max:hp,dmg:Math.round(d.dmg*(1+.15*(L-1))),cd:rnd(.6,d.cd+.6),stun:0,slow:0,poison:0,hit:0,atk:0,wind:0,walk:0,face:1,kx:0,ky:0,wt:0,wx:0,wy:0,unst:0,ux:0,uy:0,flee:false,fleeT:0,charge:false,dash:0,dcd:2,sum:0};
 S.enemies.push(e);return e}
function newParrot(x,y){return{id:"r"+(S.nid++),x,y,vx:1,vy:1,t:rnd(2,4),ct:0,ph:rnd(0,6)}}
function newPerson(x,y){const o={id:"q"+(S.nid++),x,y,kx:0,ky:0,walk:0,face:Math.random()<.5?1:-1,mode:"walk",t:rnd(0,3),tx:x,ty:y,spd:rnd(.8,1.4),
 shirt:SHIRTS[ri(0,SHIRTS.length-1)],pants:["#3b3f6b","#2f3443","#5a4636","#6b6b7a","#24476b"][ri(0,4)],hair:HAIRS[ri(0,HAIRS.length-1)],skin:SKINS[ri(0,SKINS.length-1)],old:Math.random()<.18,long:Math.random()<.45,cap:Math.random()<.15?SHIRTS[ri(0,8)]:null,bag:Math.random()<.6?SHIRTS[ri(0,8)]:null};
 S.people.push(o);return o}
function loadLevel(L){
 if(L===6){loadFishShop();return}
 if(L===7){loadRace();return}
 if(L===8){loadPuzzle();return}
 S.lvl=L;const rows=L?MAPS[L-1]:HALL;S.H=rows.length;S.W=rows[0].length;S.G=rows.map(r=>[...r]);S.gv++;
 Object.assign(S,{enemies:[],proj:[],items:[],tables:[],ovens:[],kiosks:[],shelves:[],hidden:{},respawn:[],exitOpen:true,fragSpot:null,cage:null,exit:null,spawn:[1.5,1.5],catSpawns:[],spawnT:0,people:[],hallDoors:[],fount:null,shelter:null,mom:null,cages:[],parrots:[],poops:[],critters:[],fobj:[],scats:[],baskets:[[],[],[],[]],catT:0});
 S.mission={kind:LV[L].kind,n:0,need:0,cats:0,catNeed:8,kit:false,done:false,boss:false,freed:false,sp:0};S.nclerk=0;
 let mc=0,hid=0,fx0=99,fy0=99,fx1=-1,fy1=-1;
 for(let y=0;y<S.H;y++)for(let x=0;x<S.W;x++){const ch=S.G[y][x],cx=x+.5,cy=y+.5;
  if(ch==="@"){S.spawn=[cx,cy];S.G[y][x]="."}
  else if(EN[ch]){const e=addEnemy(ch,cx,cy);if(ch==="k")S.catSpawns.push([cx,cy]);if(ch==="w")e.sp=CLERK_SP[(S.nclerk=(S.nclerk||0)+1)-1];S.G[y][x]="."}
  else if(ch==="G")S.cages.push({x:cx,y:cy,sp:S.cages.length,open:false});
  else if(ch==="m"){S.items.push({id:S.nid++,k:"merch",c:(mc++%4)+1,x:cx,y:cy});S.G[y][x]="."}
  else if(ch==="p"){S.items.push({id:S.nid++,k:"pastry",v:ri(0,2),x:cx,y:cy});S.G[y][x]="."}
  else if(ch==="x"){S.items.push({id:S.nid++,k:"banana",x:cx,y:cy});S.G[y][x]="."}
  else if(ch==="$"){S.items.push({id:S.nid++,k:"coin",x:cx,y:cy});S.G[y][x]="."}
  else if(ch==="f"){S.fragSpot=[cx,cy];S.G[y][x]="."}
  else if("1234".includes(ch))S.shelves.push({x:cx,y:cy,c:+ch});
  else if(ch==="O")S.ovens.push([cx,cy]);
  else if(ch==="K")S.kiosks.push([cx,cy]);
  else if(ch==="E")S.exit=[cx,cy];
  else if(ch==="F")S.cage=[cx,cy];
  else if(DOORS[ch])S.hallDoors.push({x:cx,y:cy,to:DOORS[ch],front:ch==="N"?[cx-1,cy]:[cx,y<S.H/2?cy+1:cy-1]});
  else if(ch==="J"){S.shelter=S.shelter||{x0:x,y0:y,x1:x+1,y1:y+1};S.shelter.x0=Math.min(S.shelter.x0,x);S.shelter.x1=Math.max(S.shelter.x1,x+1);S.shelter.y0=Math.min(S.shelter.y0,y);S.shelter.y1=Math.max(S.shelter.y1,y+1)}
  else if(ch==="W"){fx0=Math.min(fx0,x);fy0=Math.min(fy0,y);fx1=Math.max(fx1,x+1);fy1=Math.max(fy1,y+1)}
  if("PRAL=S1234V".includes(ch)&&hash(x+L*7,y*3+L)<.42&&hid<9){S.hidden[x+","+y]=1;hid++}}
 if(fx1>0)S.fount=[fx0,fy0,fx1,fy1];
 if(S.exit){const[ex,ey]=[Math.floor(S.exit[0]),Math.floor(S.exit[1])];for(const[dx,dy]of[[-1,0],[0,-1],[1,0],[0,1]])if(!solidAt(ex+dx,ey+dy)){S.spawn=[ex+dx+.5,ey+dy+.5];break}}
 const seen={};
 for(let y=0;y<S.H;y++)for(let x=0;x<S.W;x++)if(S.G[y][x]==="T"&&!seen[x+","+y]){const cells=[],q=[[x,y]];seen[x+","+y]=1;
  while(q.length){const[a,b]=q.pop();cells.push([a,b]);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(a+dx)+","+(b+dy);if(!seen[k]&&S.G[b+dy]&&S.G[b+dy][a+dx]==="T"){seen[k]=1;q.push([a+dx,b+dy])}}}
  const cx=cells.reduce((s,c)=>s+c[0],0)/cells.length+.5,cy=cells.reduce((s,c)=>s+c[1],0)/cells.length+.5;S.tables.push({cells,cx,cy,want:false,t:rnd(0,6)})}
 const m=S.mission;m.need={hall:0,shelves:S.items.filter(i=>i.k==="merch").length,pizza:10,pastry:20,ark:10,boss:1}[m.kind];
 if(m.kind==="ark")S.parrots.push(newParrot(S.W/2,S.H/2));
 if(L===0){S.momT=Math.min(S.momT,8);for(let i=0;i<(S.abn|0);i++){const[x,y]=freeSpot(3);S.items.push({id:S.nid++,k:"cart",ab:true,x,y})}}
 const np=L===0?14:L===5?2:3;for(let i=0;i<np;i++){const[x,y]=freeSpot(3);newPerson(x,y)}
}
const OFFS=[[-.55,0],[.55,0],[-.55,.65],[.55,.65],[-.55,-.65],[.55,-.65],[-1.1,0],[1.1,0],[0,.7],[0,-.7],[-1.1,.7],[1.1,.7],[0,0]];
function freeNear(pos,p,k){const others=vis().filter(q=>q!==p&&!q.placing);for(let j=0;j<OFFS.length;j++){const o=OFFS[(k+j)%OFFS.length],x=pos[0]+o[0],y=pos[1]+o[1];
  if(!hitsSolid(x,y,.3)&&!others.some(q=>dist(q.x,q.y,x,y)<.5))return[x,y]}return[pos[0],pos[1]]}
function placeTeam(pos){const v=vis();v.forEach(p=>p.placing=true);S.players.forEach(p=>{const k=Math.max(0,v.indexOf(p));p.placing=false;const[x,y]=v.length>1?freeNear(pos,p,k):[pos[0],pos[1]];
  Object.assign(p,{x,y,kx:0,ky:0,stun:0,slip:0,inv:1.2,doorLock:true,shop:false});if(p.down){p.down=false;p.hp=Math.max(40,p.hp);p.respawn=0;p.rev=0}
  const f=p.fish||(p.fish=newFish());f.x=p.x-.6;f.y=p.y-.7});S.players.forEach(p=>delete p.placing)}
const SLOTS=[[6],[3.4,8.6],[2.4,6,9.6],[1.7,4.4,7.1,9.8]];
function sceneSlot(p){const v=vis(),k=Math.max(0,v.indexOf(p)),n=Math.max(1,v.length);return SLOTS[Math.min(4,n)-1][Math.min(k,3)]}
const bk=p=>S.baskets[p.i]||(S.baskets[p.i]=[]);
function enterArea(L){const from=S.lvl;
 S.players.forEach(p=>dropCarry(p));
 if(from>0&&from!==7&&from!==8){const o={};for(const k of AREA_KEYS)o[k]=S[k];S.shops[from]=o}
 S.proj=[];
 if(L>0&&L!==7&&L!==8&&S.shops[L]){const o=S.shops[L];if(!o.G)o.G=baseGrid(L);Object.assign(S,o);S.lvl=L;S.gv++}else loadLevel(L);
 let pos=S.spawn;if(L===0&&from>0){const d=S.hallDoors.find(d=>d.to===(from===8?7:from));if(d)pos=d.front}
 if(L>0){S.shelter=null;S.mom=null}
 placeTeam(pos);if(L===7)startRace();if(L===8)startPuzzle();if(L===6)S.players.forEach(p=>{p.x=sceneSlot(p);p.y=2.7;p.rod={ang:0,st:"idle",len:0,obj:null,cd:.4};p.face=1});ev({k:"sfx",s:"door"});
 if(L>0){if(!S.seen[L]){S.seen[L]=1;toast(LV[L].intro,7)}else toast(S.done[L]?`${LV[L].name}: missione già completata`:`Bentornati da ${LV[L].name}`,2.5)}
 else toast(sushiOpen()&&!S.done[5]?"Tutti hanno il volantino completo: correte al Sushi Samurai!":"Hall del centro commerciale",2.5);
}
/* ---------- Il Mondo dei Pesci: pesca nella grande boccia ---------- */
const FCOL=["#ff9a2e","#5ab8ff","#ffd23c","#ff6fae","#7bd389","#c77dff","#ff5a2a"],BOWL={x0:.7,x1:11.3,y0:5,y1:17.2},MAXJ={eel:2,mouse:1,boot:1,can:1};
function loadFishShop(){S.lvl=6;S.W=12;S.H=19;S.G=Array.from({length:S.H},()=>Array(S.W).fill("."));S.gv++;
 Object.assign(S,{enemies:[],proj:[],items:[],tables:[],ovens:[],kiosks:[],shelves:[],hidden:{},respawn:[],exitOpen:true,fragSpot:null,cage:null,exit:null,spawn:[6,2.7],catSpawns:[],spawnT:0,people:[],hallDoors:[],fount:null,cages:[],parrots:[],poops:[],critters:[],
  fobj:[],scats:[],baskets:[[],[],[],[]],catT:6});
 S.mission={kind:"fishing",n:0,need:0,done:false,boss:false,freed:false};
 for(let i=0;i<8;i++)spawnFObj("fish");for(const k in MAXJ)for(let i=0;i<MAXJ[k];i++)spawnFObj(k)}
function spawnFObj(k){const o={id:"f"+(S.nid++),k,x:rnd(1.5,10.5),vx:(Math.random()<.5?-1:1)*rnd(.6,1.4),ph:rnd(0,6)};
 if(k==="fish"){o.s=rnd(.75,1.35);o.y=o.by=rnd(6.5,15.5);o.col=FCOL[ri(0,FCOL.length-1)];o.v=Math.round(1+o.s*3);o.r=.35*o.s}
 else if(k==="eel"){o.y=o.by=rnd(8,15);o.vx*=.7;o.r=.55}
 else if(k==="mouse"){o.y=o.by=5.7;o.vx*=.6;o.r=.45}
 else{o.y=o.by=16.4;o.vx*=.12;o.r=.45}
 S.fobj.push(o);return o}
function sceneTick(dt){const t=S.time;
 for(const o of S.fobj){o.x+=o.vx*dt;if(o.x<BOWL.x0+.6||o.x>BOWL.x1-.6){o.vx=-o.vx;o.x=cl(o.x,BOWL.x0+.6,BOWL.x1-.6)}
  o.y=o.by+Math.sin(t*(o.k==="eel"?1.6:1.1)+o.ph)*(o.k==="eel"?.8:o.k==="fish"?.35:o.k==="mouse"?.08:.05)}
 for(let i=S.respawn.length-1;i>=0;i--)if(S.time>=S.respawn[i].at){spawnFObj(S.respawn[i].k);S.respawn.splice(i,1)}
 S.players.forEach((p,i)=>{if(p.hidden||p.away||S.lvl!==6)return;const inp=inputFor(i),r=p.rod||(p.rod={ang:0,st:"idle",len:0,obj:null,cd:0});r.cd-=dt;p.inv-=dt;
  if(p.down)return;if(r.st==="idle"){r.ang=cl(r.ang+(inp.mx||0)*1.5*dt,-1.05,1.05);if(Math.abs(inp.mx||0)>.2)p.face=Math.sign(inp.mx)}
  p.scd=(p.scd||0)-dt;
  if(inp.atk){const w=inp.wsel|0;
   if(w===2){sellAndExit();return}
   if(w===1&&p.scd<=0){p.scd=.5;shooCats(p)}
   else if(w===0&&r.st==="idle"&&r.cd<=0){r.st="out";r.len=0;r.cd=.3;ev({k:"sfx",s:"cast",x:p.x,y:p.y})}}
  const tip=rodTip(p),dx=Math.sin(r.ang),dy=Math.cos(r.ang);
  if(r.st==="out"){r.len+=9*dt;const hx=tip[0]+dx*r.len,hy=tip[1]+dy*r.len;
   if(hy>BOWL.y0){for(let j=0;j<S.fobj.length;j++){const o=S.fobj[j];if(dist(hx,hy,o.x,o.y)<o.r+.28){r.obj=o;S.fobj.splice(j,1);r.st="back";ev({k:"sfx",s:o.k==="fish"?"bite":"clunk",x:o.x,y:o.y});break}}}
   if(r.st==="out"&&(r.len>15||hy>BOWL.y1-.2||hx<BOWL.x0+.2||hx>BOWL.x1-.2))r.st="back"}
  else if(r.st==="back"){r.len-=10*dt;if(r.obj){r.obj.x=tip[0]+dx*Math.max(0,r.len);r.obj.y=tip[1]+dy*Math.max(0,r.len)}
   if(r.len<=0){r.len=0;r.st="idle";r.cd=.25;if(r.obj)landCatch(p,r.obj);r.obj=null}}});
 if(S.lvl!==6)return;
 S.catT-=dt;if(S.catT<=0){S.catT=rnd(7,11);const side=Math.random()<.5?-1:1;S.scats.push({id:"c"+(S.nid++),x:side<0?-.8:S.W+.8,y:3.55,side,st:"go",fish:null,walk:0,tgt:ri(0,S.players.length-1)});toast("Arriva un gatto: vuole i pesci del cesto!",2)}
 for(let i=S.scats.length-1;i>=0;i--){const c=S.scats[i];c.walk+=dt*16;
  if(c.st==="go"){const p=S.players[c.tgt]&&!S.players[c.tgt].hidden&&!S.players[c.tgt].away?S.players[c.tgt]:vis()[0],bx=p.x+.95,d=bx-c.x;c.x+=Math.sign(d)*Math.min(Math.abs(d),2.2*dt);
   if(Math.abs(d)<.15){const b=bk(p);if(b.length){c.fish=b.pop();float(c.x,c.y-.5,"Il gatto ruba un pesce!","#ff9a2e");ev({k:"sfx",s:"meow",x:c.x,y:c.y})}c.st="run"}}
  else{c.x+=c.side*4.5*dt;if(c.x<-1.5||c.x>S.W+1.5)S.scats.splice(i,1)}}}
function rodTip(p){const r=p.rod||{ang:0};return[p.x+.35+Math.sin(r.ang)*1.3,2.45+Math.cos(r.ang)*1.3]}
function shooCats(p){let n=0;for(const c of S.scats){if(Math.abs(c.x-p.x)<4.2&&c.st!=="flee"){if(c.fish){bk(p).push(c.fish);c.fish=null;float(c.x,c.y-.6,"Pesce recuperato!","#4fe3b5")}c.st="run";c.side=c.x<p.x?-1:1;n++}}
 ev({k:"sfx",s:"soap",x:p.x,y:p.y});float(p.x,p.y-.8,n?"Sciò!":"Nessun gatto vicino","#ffc93c")}
function sceneDmg(p,n,msg){p.hp-=n;float(p.x,p.y-.9,msg+" -"+n,"#ff5d6c");ev({k:"hurt",id:p.id});
 if(p.hp<=0){p.hp=p.max;if(S.rule!=="insieme"){koPenalty(p);return}const g=S.grp[0];g.lives--;ev({k:"sfx",s:"life"});if(g.lives<=0){S.phase="over";return}toast(`Vita persa! Ne restano ${g.lives}`)}}
function koPenalty(p){const g=GR(p),lost=Math.min(5,g.coins);g.coins-=lost;p.score=Math.max(0,(p.score|0)-100);ev({k:"sfx",s:"life"});toast(`${p.name} è KO: −${lost} monete e −100 punti`,2.5)}
function landCatch(p,o){const back=k=>S.respawn.push({k,at:S.time+(k==="fish"?2.5:rnd(5,9))});back(o.k);
 if(o.k==="fish"){bk(p).push({col:o.col,v:o.v});float(p.x+.9,2.6,`Pesce! vale ${o.v}`,o.col);ev({k:"sfx",s:"pick"});ev({k:"burst",x:p.x+.9,y:3.2,col:o.col,n:12})}
 else if(o.k==="eel"){sceneDmg(p,15,"Zzzt! La murena dà la scossa");ev({k:"sfx",s:"shock"});FXshock(p)}
 else if(o.k==="mouse"){p.fish.food=Math.max(0,p.fish.food-15);float(p.x,p.y-.9,"Il topo mangia la pappa del pesce rosso!","#ff9a2e");ev({k:"sfx",s:"squeak"})}
 else if(o.k==="boot")sceneDmg(p,5,"Uno scarpone vecchio!");
 else if(o.k==="can")sceneDmg(p,10,"Una lattina di pelati!")}
function FXshock(p){ev({k:"burst",x:p.x,y:p.y-.3,col:"#ffe36b",n:24})}
function sellAndExit(){let n=0,v=0;for(const p of S.players){const b=bk(p),pv=b.reduce((s,f)=>s+f.v,0);n+=b.length;v+=pv;GR(p).coins+=pv;p.score=(p.score|0)+pv*10;S.baskets[p.i]=[]}
 S.players.forEach(p=>{if(p.rod){p.rod.st="idle";p.rod.len=0;p.rod.obj=null}});
 enterArea(0);if(n){toast(`Venduti ${n} pesci: +${v} monete!`,3);ev({k:"sfx",s:"sell"})}}
function retryArea(){S.grp[0].lives=3;S.phase="play";S.players.forEach(p=>{if(!p.hidden&&!p.away)respawnP(p)})}
const actives=()=>S.players.filter(p=>!p.hidden&&!p.away&&!p.down&&!p.shop);
function inputFor(i){if(S.mode==="hot")return i===S.active?IN[0]:NOIN;if(S.mode==="solo")return IN[0];return IN[i]}

function tick(dt){
 if(!S||S.phase!=="play"||S.paused)return;
 S.time+=dt;if(S.raceCool>0)S.raceCool=Math.max(0,S.raceCool-dt);
 if(S.mode==="hot"&&S.lvl!==7&&S.lvl!==8){S.turnT-=dt;if(S.turnT<=0){S.phase="turn";return}}
 if(S.lvl===7){raceTick(dt);return}
 if(S.lvl===8){puzzleTick(dt);return}
 if(S.lvl===6){for(const p of vis()){const f=p.fish;f.food=Math.max(0,f.food-dt/3.4);f.water=Math.max(0,f.water-dt/4.4);if(f.pot){f.potT-=dt;if(f.potT<=0)f.pot=null}if(p.down&&p.respawn>0){p.respawn-=dt;if(p.respawn<=0)respawnP(p)}}sceneTick(dt);return}
 fishTick(dt);
 S.players.forEach((p,i)=>updPlayer(p,inputFor(i),dt));
 if(S.mode==="coop"&&S.rule==="insieme")reviveTick(dt);
 updPeople(dt);updZoo(dt);hallTick(dt);
 for(const e of S.enemies)if(!e.dead)updEnemy(e,dt);
 S.enemies=S.enemies.filter(e=>!e.dead);
 updProj(dt);
 missionTick(dt);
 for(let i=S.respawn.length-1;i>=0;i--){const r=S.respawn[i];if(S.time>=r.at&&!S.players.some(p=>dist(p.x,p.y,r.x,r.y)<5)){addEnemy(r.t,r.x,r.y);S.respawn.splice(i,1)}}
}
/* ---------- carrelli e pensilina (hall) ---------- */
const CARTMAX=3,cartReward=k=>5*k+2*k*(k-1);
function hallTick(dt){
 S.abT-=dt;if(S.abT<=0){S.abT=45;if((S.abn|0)<3){S.abn=(S.abn|0)+1;if(S.lvl===0){const[x,y]=freeSpot(3);S.items.push({id:S.nid++,k:"cart",ab:true,x,y})}}}
 if(S.lvl!==0||!S.shelter)return;
 const sh=S.shelter,W=S.W;
 if(!S.mom){S.momT-=dt;if(S.momT<=0){S.momT=rnd(14,22);
   if(S.cartN<S.cartCap&&Math.random()<.35){S.cartN++;float((sh.x0+sh.x1)/2,sh.y1+.4,"Un cliente riporta un carrello","#9fd2ee")}
   else if(S.cartN>0){const side=Math.random()<.5?-1:1;S.mom={x:side<0?1.4:W-1.4,y:sh.y1+.5,st:"go",t:0,side,dir:-side,walk:0,face:-side,cx:0,skin:SKINS[ri(0,SKINS.length-1)],hair:HAIRS[ri(0,HAIRS.length-1)],shirt:SHIRTS[ri(0,SHIRTS.length-1)]}}}}
 else{const m=S.mom,d=m.dir;
  if(m.st==="go"){m.walk+=dt*9;const tx=(sh.x0+sh.x1)/2,dx=tx-m.x;m.face=d;m.x+=Math.sign(dx)*Math.min(Math.abs(dx),1.5*dt);if(Math.abs(dx)<.1){m.st="load";m.t=m.T=2.2;m.walk=0;if(S.cartN>0)S.cartN--;ev({k:"sfx",s:"pick"});float(m.x,m.y-1.1,"Un carrello per il piccolo!","#fff")}}
  else if(m.st==="load"){m.t-=dt;if(m.t<=0){m.st="dash";m.t=1.4;m.cx=m.x+d*.95;m.walk=0;ev({k:"sfx",s:"empty"});ev({k:"burst",x:m.cx,y:m.y+.3,col:"#ffffff",n:12});float(m.x,m.y-1.1,"Fermo! Torna qui!","#ff9a2e");float(m.cx,m.y-1.1,"Si parte a razzo!","#ffd23c")}}
  else{m.walk+=dt*16;m.t-=dt;const lo=3,hi=S.W-3;m.cx=Math.max(lo,Math.min(hi,m.cx+d*7.2*dt));m.x=Math.max(lo,Math.min(hi,m.x+d*5.4*dt));m.face=d;
   if(Math.random()<dt*14)ev({k:"burst",x:m.cx-d*.6,y:m.y+.4,col:"#d8dce6",n:2});
   if(m.t<=0||m.cx<=lo||m.cx>=hi){
    if(S.enemies.filter(e=>e.t==="b"&&!e.dead).length<7){const e=addEnemy("b",m.cx,m.y);e.face=d;float(m.cx,m.y-1,"Il bambino sul carrello è in giro!","#ff9a2e")}
    else float(m.cx,m.y-1,"Il bambino se ne va col carrello","#9fd2ee");
    const q=newPerson(m.x,m.y);Object.assign(q,{skin:m.skin,hair:m.hair,shirt:m.shirt,pants:"#5a4636",long:true,bag:null,old:false,cap:null,face:d,mode:"walk",t:rnd(3,6),spd:1.1});[q.tx,q.ty]=freeSpot(0);
    const mine=S.people.filter(p=>p.zoo==null);if(mine.length>16){const i=S.people.indexOf(mine[0]);if(i>=0&&mine[0]!==q)S.people.splice(i,1)}
    S.mom=null;S.momT=rnd(14,22)}}}
}
function dropCarts(p){const n=p.carts|0;for(let i=0;i<n;i++)S.items.push({id:S.nid++,k:"cart",x:p.x+rnd(-.5,.5),y:p.y+rnd(-.5,.5)});if(n)float(p.x,p.y-.6,"Carrelli persi!","#ff6fae");p.carts=0}
function cartLogic(p,G){
 for(let i=S.items.length-1;i>=0;i--){const it=S.items[i];if(it.k!=="cart"||(p.carts|0)>=CARTMAX||dist(p.x,p.y,it.x,it.y)>.85)continue;
  if(it.ab&&!(p.carts>0)){if(S.time-(p.cartHint||-9)>5){p.cartHint=S.time;float(p.x,p.y-.7,"Per agganciarlo serve già un carrello","#9fd2ee")}continue}
  S.items.splice(i,1);if(it.ab)S.abn=Math.max(0,(S.abn|0)-1);p.carts=(p.carts|0)+1;ev({k:"sfx",s:"pick"});float(p.x,p.y-.7,`Carrello agganciato! ${p.carts}/${CARTMAX}`,"#9fd2ee");
  if(S.lvl===0&&p.carts===1)toast("Riporta i carrelli alla pensilina in basso: più ne porti, più ricompense (massimo 3)",3.5)}
 if(S.lvl!==0||!S.shelter||!(p.carts>0))return;
 const sh=S.shelter,dx=Math.max(sh.x0-p.x,0,p.x-sh.x1),dy=Math.max(sh.y0-p.y,0,p.y-sh.y1);if(Math.hypot(dx,dy)>1.2)return;
 const free=S.cartCap-S.cartN,have=p.carts,k=Math.min(have,free);
 if(k<=0){if(S.time-(p.cartHint||-9)>4){p.cartHint=S.time;float(p.x,p.y-.8,"Pensilina piena! Aspetta la mamma che porta via un carrello","#ffc93c");ev({k:"sfx",s:"empty"});S.momT=Math.min(S.momT,4)}return}
 const coins=cartReward(k);S.cartN+=k;p.carts=have-k;G.coins+=coins;p.score=(p.score|0)+100*k;const f=p.fish;if(f){f.food=Math.min(100,f.food+15*k);f.water=Math.min(100,f.water+20*k)}
 ev({k:"sfx",s:"deliver"});ev({k:"burst",x:(sh.x0+sh.x1)/2,y:sh.y1,col:"#ffd23c",n:14+6*k});float(p.x,p.y-.8,`${k} carrell${k>1?"i":"o"} riagganciat${k>1?"i":"o"}: +${coins} monete, pappa e acqua per il pesce!`,"#ffd23c");
 if(p.carts>0){S.momT=Math.min(S.momT,4);float(p.x,p.y-1.5,`Posti finiti: te ne restano ${p.carts}`,"#ffc93c")}}
function fishTick(dt){for(const p of vis())fishStep(p,dt)}
function fishMsg(p,t){if(vis().length>1)float(p.x,p.y-1,p.name+": "+t,"#ffb347");else toast(t)}
const WCOST=1.5;
function fishStep(p,dt){const f=p.fish||(p.fish=newFish()),ok=!p.down&&!p.shop;
 f.food=Math.max(0,f.food-dt/3.4);f.water=Math.max(0,f.water-dt/4.4);
 if(f.pot){f.potT-=dt;if(f.potT<=0){f.pot=null;fishMsg(p,"L'effetto della pozione è finito")}}
 {const tx=p.x-.75*(p.face<0?-1:1),ty=p.y-.8,k=Math.min(1,dt*4);if(dist(f.x,f.y,tx,ty)>4){f.x=tx;f.y=ty}else{f.x+=(tx-f.x)*k;f.y+=(ty-f.y)*k}}
 const sick=f.food<=0||f.water<=0;
 if(sick){f.sick+=dt;if(f.sick>=5){f.sick=0;if(ok){p.hp-=3;float(p.x,p.y,"-3","#ff9a2e");if(p.hp<=0)downP(p)}fishMsg(p,"Il pesce sta male! Sconfiggi i nemici per trovare pappa e acqua")}}
 else f.sick=0;
 if((f.food<25||f.water<25)&&S.time-f.warn>25&&!sick){f.warn=S.time;fishMsg(p,f.food<25?"Il pesce ha fame! Cerca la pappa dai nemici sconfitti":"L'acqua è sporca! Cerca bottiglie d'acqua dai nemici")}
 f.cd-=dt;if(sick||f.cd>0||!ok)return;
 let best=null,bd=5.5;for(const e of S.enemies){if(e.dead||e.flee)continue;const d=dist(f.x,f.y,e.x,e.y);if(d<bd&&los(f.x,f.y,e.x,e.y)){bd=d;best=e}}
 if(!best)return;
 if(f.water<WCOST+2){if(S.time-(f.dryT||-9)>6){f.dryT=S.time;float(f.x,f.y-.6,"Boccia quasi vuota! Serve acqua","#8fe0ff");ev({k:"sfx",s:"empty"})}return}
 f.water=Math.max(0,f.water-WCOST*(f.pot==="po"?.6:1));
 f.cd=(f.pot==="po"?.65:1.4)*(f.food<25||f.water<25?1.6:1);
 const dx=best.x-f.x,dy=best.y-f.y,d=Math.hypot(dx,dy)||1;
 ev({k:"sfx",s:"spray"});S.proj.push({id:S.nid++,k:"water",x:f.x,y:f.y,vx:dx/d*9,vy:dy/d*9,own:"p",by:p.i,dmg:f.pot==="pr"?16:8,pot:f.pot,life:.8,r:.18,hit:[]});
}
function updPlayer(p,inp,dt){
 if(p.hidden||p.away)return;
 if(p.down){if(p.respawn>0){p.respawn-=dt;if(p.respawn<=0)respawnP(p)}return}
 p.inv-=dt;p.cd-=dt;p.stun-=dt;p.slowT-=dt;p.swing-=dt;
 if(inp.wsel>=0&&inp.wsel<3&&inp.wsel!==p.w){p.w=inp.wsel|0;ev({k:"wsw",id:p.id})}
 if(p.shop)return;
 if(p.kx||p.ky){moveCircle(p,p.kx*dt,p.ky*dt,.3);const f=Math.pow(.01,dt);p.kx*=f;p.ky*=f;if(Math.abs(p.kx)+Math.abs(p.ky)<.1)p.kx=p.ky=0}
 if(p.slip>0){p.slip-=dt;moveCircle(p,p.svx*dt,p.svy*dt,.3);p.walk+=dt*20;interact(p);return}
 let mx=inp.mx||0,my=inp.my||0;const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
 if(p.stun>0){mx=my=0}
 const spd=4.2*(GR(p).up.shoes?1.22:1)*(p.slowT>0?.55:1)*(1-.07*(p.carts|0));
 if(m>.15&&p.stun<=0){moveCircle(p,mx*spd*dt,my*spd*dt,.3);const n=Math.hypot(mx,my);p.fx=mx/n;p.fy=my/n;p.walk+=dt*13*Math.min(1,m);if(Math.abs(mx)>.2)p.face=Math.sign(mx)}
 if(inp.atk&&p.cd<=0&&p.stun<=0)attack(p);
 bumpPeople(p);interact(p);p.kT=p.nearK?(p.kT||0)+dt:0;p.fT=S.lvl===0&&fountDist(p)<.95?(p.fT||0)+dt:0;
}
function nearestTarget(x,y,r,needLos){let best=null,bd=r;for(const e of S.enemies){if(e.dead||e.flee)continue;const d=dist(x,y,e.x,e.y);if(d<bd&&(!needLos||los(x,y,e.x,e.y))){bd=d;best=e}}return best}
function throwCart(p){const tg=nearestTarget(p.x,p.y,7,true);let ax=p.fx,ay=p.fy;
 if(tg){const dx=tg.x-p.x,dy=tg.y-p.y,d=Math.hypot(dx,dy)||1;ax=dx/d;ay=dy/d}
 p.ax=ax;p.ay=ay;if(Math.abs(ax)>.2)p.face=Math.sign(ax);p.carts--;p.cd=.6;p.swing=.15;ev({k:"sfx",s:"throw",x:p.x,y:p.y});
 S.proj.push({id:S.nid++,k:"cart",x:p.x+ax*.5,y:p.y+ay*.5,vx:ax*8.5,vy:ay*8.5,own:"p",by:p.i,dmg:GR(p).up.lav?27.5:21,life:.9,r:.4,pierce:false,hit:[]})}
function landCart(q,dt){let x=q.x-q.vx*dt*1.5,y=q.y-q.vy*dt*1.5;for(let k=0;k<8&&hitsSolid(x,y,.2);k++){x-=q.vx*dt;y-=q.vy*dt}S.items.push({id:S.nid++,k:"cart",x,y});ev({k:"burst",x,y,col:"#aeb8c8",n:8})}
function attack(p){const G=GR(p);
 if(p.w===1&&(p.carts|0)>0){throwCart(p);return}
 if(p.w===1&&G.ammo.soap<=0||p.w===2&&G.ammo.gum<=0){p.cd=.7;if(S.time-(p.emptyT||-9)<2.5)return;p.emptyT=S.time;float(p.x,p.y,p.w===1?"Saponette finite! Comprale alla cassa":"Chewing-gum finiti! Comprali alla cassa","#ffc93c");ev({k:"sfx",s:"empty"});return}
 ev({k:"sfx",s:["towel","soap","gum"][p.w]});
 const tg=nearestTarget(p.x,p.y,[1.8,7,5.2][p.w],p.w>0);let ax=p.fx,ay=p.fy;
 if(tg){const dx=tg.x-p.x,dy=tg.y-p.y,d=Math.hypot(dx,dy)||1;ax=dx/d;ay=dy/d}
 p.ax=ax;p.ay=ay;if(Math.abs(ax)>.2)p.face=Math.sign(ax);
 if(p.w===0){p.cd=.38;p.swing=.22;ev({k:"swing",id:p.id,ax,ay,wet:!!G.up.towel});const dmg=G.up.towel?32:18;
  for(const e of S.enemies){if(e.dead)continue;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d<1.65&&(d<.9||(dx*ax+dy*ay)/d>.1))hitE(e,dmg,ax,ay,null,p)}
  revealNear(p.x+ax*.9,p.y+ay*.9,1.1);
  for(const q of S.people){const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);if(d<1.65&&(d<.9||(dx*ax+dy*ay)/d>.1)){const n=d||1;q.kx=dx/n*7;q.ky=dy/n*7;q.mode="walk";q.t=rnd(2,5);[q.tx,q.ty]=freeSpot(0);
   float(q.x,q.y-.2,["Ehi!","Scusi!","Che modi!","Ops!","Faccio strada!"][ri(0,4)],"#fff");ev({k:"sfx",s:"bump",x:q.x,y:q.y})}}}
 else if(p.w===1){G.ammo.soap--;p.cd=.42;p.swing=.12;S.proj.push({id:S.nid++,k:"soap",x:p.x+ax*.4,y:p.y+ay*.4,vx:ax*9.5,vy:ay*9.5,own:"p",by:p.i,dmg:G.up.lav?22:14,life:.85,r:.2,pierce:!!G.up.lav,hit:[]})}
 else{G.ammo.gum--;p.cd=.7;p.swing=.15;const d=tg?Math.min(dist(p.x,p.y,tg.x,tg.y),5):3;let tx=p.x+ax*d,ty=p.y+ay*d;
  for(let k=0;k<12&&hitsSolid(tx,ty,.15);k++){tx-=ax*.3;ty-=ay*.3}
  S.proj.push({id:S.nid++,k:"gum",x:p.x,y:p.y,sx:p.x,sy:p.y,tx,ty,t:0,ft:.45,st:"fly",own:"p",by:p.i,mega:!!G.up.mega})}
}
function hitE(e,dmg,kx,ky,pot,by){const d=EN[e.t];if(e.kart){spinKart(e,by);return}
 if(e.t==="k"){if(!e.flee){e.flee=true;e.fleeT=0;S.mission.cats++;float(e.x,e.y,"Sciò!","#ffc93c");ev({k:"burst",x:e.x,y:e.y,col:"#ffb15a",n:10});if(Math.random()<.7)dropLoot(e.x,e.y,1)}return}
 if(d.stunOnly){if(e.stun<=0){float(e.x,e.y,e.t==="z"?"Stordito!":"Stordita!","#ffe36b");ev({k:"sfx",s:"stun"})}e.stun=pot?2.2:d.stunOnly;e.hit=.15;return}
 e.hp-=dmg;e.hit=.15;const kb=e.t==="B"?.6:3.5;e.kx=kx*kb;e.ky=ky*kb;
 if(pot==="pb")e.slow=2.5;if(pot==="pg")e.poison=3;
 float(e.x,e.y-.2,"-"+dmg,"#fff");ev({k:"hitE",id:e.id});
 if(e.hp<=0)killE(e,by)}
function killE(e,by){e.dead=true;S.kills++;const d=EN[e.t];if(by)by.score=(by.score|0)+(e.t==="B"?1500:e.t==="w"?120:50);
 if(e.t==="w"){S.items.push({id:S.nid++,k:"key",sp:e.sp,x:e.x,y:e.y});const q=newPerson(e.x,e.y);q.zoo=e.sp;q.mode="look";q.t=3;spawnCoins(e.x+.4,e.y,2);
  float(e.x,e.y-.3,`Va bene, ecco la chiave dei ${SP[e.sp].n}!`,"#fff");ev({k:"sfx",s:"pick"});ev({k:"burst",x:e.x,y:e.y,col:SP[e.sp].c,n:16});return}
 ev({k:"death",t:e.t,x:e.x,y:e.y,face:e.face});ev({k:"burst",x:e.x,y:e.y,col:e.t==="B"?"#ffc93c":"#ffffff",n:e.t==="B"?50:18});
 if(e.t==="b"&&S.lvl===0){S.items.push({id:S.nid++,k:"cart",x:e.x,y:e.y});toast("Il bambino scappa dalla mamma! Aggancia il suo carrello e riportalo alla pensilina per la ricompensa",4)}
 else if(d.coins&&e.t!=="B")dropLoot(e.x,e.y,ri(d.coins[0],d.coins[1])+Math.floor(S.lvl/2));
 if("gvb".includes(e.t))S.respawn.push({t:e.t,x:e.hx,y:e.hy,at:S.time+40});
 if(e.t==="B"){S.mission.boss=true;spawnCoins(e.x,e.y,15);dropItem("food",e.x-.6,e.y);dropItem("water",e.x+.6,e.y);ev({k:"sfx",s:"mission"});toast("Il Cuoco del Sushi è sconfitto! Libera la principessa!")}}
function dropItem(k,x,y){let cx=x+rnd(-.35,.35),cy=y+rnd(-.35,.35);if(hitsSolid(cx,cy,.2)){cx=x;cy=y}S.items.push({id:S.nid++,k,x:cx,y:cy})}
function dropLoot(x,y,n){const r=Math.random();if(r<.32)dropItem("food",x,y);else if(r<.64)dropItem("water",x,y);else spawnCoins(x,y,n)}
function spawnCoins(x,y,n){for(let i=0;i<n;i++){let cx=x+rnd(-.7,.7),cy=y+rnd(-.7,.7);if(hitsSolid(cx,cy,.2)){cx=x;cy=y}S.items.push({id:S.nid++,k:"coin",x:cx,y:cy})}}
function revealNear(x,y,r){for(const k in S.hidden){const[a,b]=k.split(",").map(Number);if(dist(x,y,a+.5,b+.5)<r+.6){delete S.hidden[k];
 let sx=a+.5,sy=b+.5;for(const[dx,dy]of[[0,1],[1,0],[-1,0],[0,-1]])if(!solidAt(a+dx,b+dy)){sx=a+dx+.5;sy=b+dy+.5;break}
 spawnCoins(sx,sy,ri(2,4));if(S.time-(S.hidT||-9)>.5){S.hidT=S.time;float(a+.5,b+.2,"Monete nascoste!","#ffc93c")}ev({k:"burst",x:a+.5,y:b+.5,col:"#ffd23c",n:14})}}}
function hurtP(p,dmg,kx,ky){if(p.down||p.hidden||p.away||p.shop||p.inv>0)return false;p.hp-=dmg;p.inv=.8;p.kx=(kx||0)*5;p.ky=(ky||0)*5;
 ev({k:"hurt",id:p.id});float(p.x,p.y-.2,"-"+dmg,"#ff5d6c");if(p.hp<=0)downP(p);return true}
function dropCarry(p){if(!p.carry)return;if(p.carry.k==="key"){S.items.push({id:S.nid++,k:"key",sp:p.carry.sp,x:p.x,y:p.y});p.carry=null;return}if(p.carry.k==="merch"){const[x,y]=freeSpot(4);S.items.push({id:S.nid++,k:"merch",c:p.carry.c,x,y});float(p.x,p.y,"Vestito perso!","#ff6fae")}p.carry=null}
function downP(p){p.hp=0;p.down=true;dropCarry(p);dropCarts(p);ev({k:"burst",x:p.x,y:p.y,col:"#ff5d6c",n:20});
 if(S.rule!=="insieme"){koPenalty(p);p.respawn=3;return}
 const v=vis();if(S.mode==="coop"&&v.length>1){if(v.every(q=>q.down))teamLife();else{p.respawn=-1;toast(`${p.name} è a terra! Restagli accanto per rialzarlo`)}}
 else teamLife()}
function teamLife(){const g=S.grp[0];g.lives--;ev({k:"sfx",s:"life"});if(g.lives<=0){S.phase="over";return}toast(`Vita persa! Ne restano ${g.lives}`);for(const p of S.players)if(p.down)p.respawn=1.6}
function respawnP(p){let x=S.spawn[0],y=S.spawn[1];
 if(S.lvl===6){x=sceneSlot(p);y=2.7;if(p.rod){p.rod.st="idle";p.rod.len=0;p.rod.obj=null}}
 else[x,y]=freeNear(S.spawn,p,p.i%4);
 Object.assign(p,{down:false,hp:p.max,x,y,inv:2,stun:0,slip:0,rev:0,kx:0,ky:0,respawn:0});if(p.fish&&S.lvl!==6){p.fish.x=x-.6;p.fish.y=y-.7}}
function reviveTick(dt){for(const p of S.players){if(!p.down||p.respawn>=0)continue;const h=S.players.some(q=>q!==p&&!q.down&&dist(p.x,p.y,q.x,q.y)<1.2);
 if(h){p.rev+=dt;if(p.rev>=2){p.down=false;p.hp=50;p.inv=1.5;p.rev=0;float(p.x,p.y,"In piedi!","#4fe3b5");ev({k:"sfx",s:"revive"});ev({k:"burst",x:p.x,y:p.y,col:"#4fe3b5",n:20})}}else p.rev=Math.max(0,p.rev-dt)}}
function interact(p){
 const m=S.mission,G=GR(p);cartLogic(p,G);
 for(let i=S.items.length-1;i>=0;i--){const it=S.items[i],d=dist(p.x,p.y,it.x,it.y);
  if(it.k==="coin"&&d<.62){G.coins++;p.score=(p.score|0)+10;S.items.splice(i,1);ev({k:"coin",x:it.x,y:it.y})}
  else if(it.k==="merch"&&!p.carry&&d<.62){p.carry={k:"merch",c:it.c};S.items.splice(i,1);float(p.x,p.y,"Preso!","#fff");ev({k:"sfx",s:"pick"})}
  else if((it.k==="food"||it.k==="water")&&d<.62){const f=p.fish,key=it.k;S.items.splice(i,1);const old=f[key];f[key]=Math.min(100,f[key]+(key==="food"?25:30));
   float(it.x,it.y,key==="food"?(old>=100?"Il pesce è già sazio":"Pappa per il pesce! +"+Math.round(f.food-old)):(old>=100?"L'acqua è già pulita":"Acqua pulita! +"+Math.round(f.water-old)),key==="food"?"#ffb347":"#8fe0ff");ev({k:"sfx",s:"pick"})}
  else if(it.k==="key"&&!p.carry&&d<.62){p.carry={k:"key",sp:it.sp};S.items.splice(i,1);float(p.x,p.y,`Chiave dei ${SP[it.sp].n}!`,SP[it.sp].c);ev({k:"sfx",s:"pick"})}
  else if(it.k==="pastry"&&d<.62){m.n++;p.score=(p.score|0)+25;S.items.splice(i,1);ev({k:"sfx",s:"pick"});if(Math.random()<.35)G.coins++;ev({k:"burst",x:it.x,y:it.y,col:"#ff9cc6",n:10});float(it.x,it.y,`${Math.min(m.n,m.need)}/${m.need}`,"#ff9cc6")}
  else if(it.k==="banana"&&d<.42&&p.slip<=0&&p.inv<1.5){p.slip=.6;p.svx=p.fx*6.5;p.svy=p.fy*6.5;p.stun=1;p.inv=Math.max(p.inv,.5);float(p.x,p.y,"Scivolone!","#ffd23c");ev({k:"sfx",s:"slip"});const[x,y]=freeSpot(5);it.x=x;it.y=y}
  else if(it.k==="frag"&&d<.75&&!G.done[S.lvl]){const first=!it.got;it.got=(it.got||0)+1;G.done[S.lvl]=true;G.frags++;G.coins+=first?20:10;p.score=(p.score|0)+(first?500:250);
   if(groupsInPlay().every(g=>S.grp[g].done[S.lvl]))S.items.splice(i,1);
   ev({k:"burst",x:it.x,y:it.y,col:"#ffc93c",n:30});ev({k:"sfx",s:"frag"});
   const who=S.rule==="insieme"?"":`${grpName(gi(p))}: `;
   toast(G.frags<4?`${who}pezzo ${G.frags} di 4 del volantino!${first&&S.rule!=="insieme"?" (primi! +500)":""} Uscite dalla porta HALL e cercate gli altri`:sushiOpen()?"Volantino completo per tutti: il Sushi Samurai è aperto!":`${who}volantino completo! Il Sushi apre quando tutti avranno i 4 pezzi`,5)}}
 if(m.kind==="shelves"&&p.carry&&p.carry.k==="merch"){for(const s of S.shelves)if(s.c===p.carry.c&&dist(p.x,p.y,s.x,s.y)<1.2){m.n++;G.coins+=2;p.score=(p.score|0)+100;p.carry=null;ev({k:"sfx",s:"deliver"});ev({k:"burst",x:s.x,y:s.y,col:["","#ff4f6d","#4f8bff","#ffc93c","#3fcf7a"][s.c],n:14});float(s.x,s.y,`Riordinato! ${m.n}/${m.need}`,"#fff");break}}
 if(m.kind==="ark"&&p.carry&&p.carry.k==="key"){for(const cg of S.cages)if(!cg.open&&cg.sp===p.carry.sp&&dist(p.x,p.y,cg.x,cg.y)<1.3){cg.open=true;p.carry=null;m.n++;G.coins+=3;p.score=(p.score|0)+150;
   ev({k:"sfx",s:"free"});ev({k:"burst",x:cg.x,y:cg.y,col:SP[cg.sp].c,n:24});float(cg.x,cg.y,`Liberi i ${SP[cg.sp].n}! ${m.n}/${m.need}`,"#fff");
   const dy=cg.y<S.H/2?1:-1;if(cg.sp===8){S.parrots.push(newParrot(cg.x-.3,cg.y+dy),newParrot(cg.x+.3,cg.y+dy));toast("I pappagalli volano via... attenti alla cacca!",3)}
   else for(const k of[-1,1])S.critters.push({id:"a"+(S.nid++),sp:cg.sp,x:cg.x+k*.35,y:cg.y+dy*.9,t:6,walk:0,face:1});break}}
 if(m.kind==="pizza"){
  if(!p.carry){for(const o of S.ovens)if(dist(p.x,p.y,o[0],o[1])<1.25){p.carry={k:"pizza"};float(p.x,p.y,"Pizza calda!","#ffc93c");ev({k:"sfx",s:"pick"});break}}
  else if(p.carry.k==="pizza"){for(const tb of S.tables)if(tb.want&&tb.cells.some(c=>dist(p.x,p.y,c[0]+.5,c[1]+.5)<1.2)){tb.want=false;tb.t=rnd(14,22);p.carry=null;m.n++;G.coins+=3;p.score=(p.score|0)+100;ev({k:"sfx",s:"deliver"});ev({k:"burst",x:tb.cx,y:tb.cy,col:"#ffc93c",n:16});float(tb.cx,tb.cy,`Buon appetito! ${m.n}/${m.need}`,"#fff");break}}}
 p.nearK=S.kiosks.some(k=>dist(p.x,p.y,k[0],k[1])<1.35);
 const doors=S.lvl===0?S.hallDoors:S.exit?[{x:S.exit[0],y:S.exit[1],to:0}]:[];let nearD=false;
 let inD=null;for(const d of doors){const dd=dist(p.x,p.y,d.x,d.y);if(dd<1.15)nearD=true;if(dd<.78&&!p.doorLock)inD=d}
 if(inD){p.dT=(p.dT||0)+1/30;if(p.dT>=.8){p.dT=0;useDoor(p,inD);return}}else p.dT=0;
 if(!nearD)p.doorLock=false;
 if(m.boss&&!m.freed&&S.cage&&dist(p.x,p.y,S.cage[0],S.cage[1])<1.5){m.freed=true;S.freer=p.i;p.score=(p.score|0)+3000;if(S.rule==="insieme")S.players.forEach(q=>{if(q!==p)q.score=(q.score|0)+1000});S.phase="win";ev({k:"burst",x:S.cage[0],y:S.cage[1],col:"#ffc93c",n:60})}
}
function sushiOpen(){return groupsInPlay().every(g=>S.grp[g].frags>=4)}
function useDoor(p,d){
 if(d.to===7&&S.done[5])d={...d,to:8};
 if(d.to===7&&S.mode==="hot"&&S.raceTimes&&S.raceTimes[p.i]!==undefined){p.doorLock=true;toast("Hai già fatto la tua corsa: aspetta il turno degli altri",3);ev({k:"sfx",s:"empty"});p.kx=-4;return}
 if((d.to===7||d.to===8)&&(S.raceCool||0)>0){p.doorLock=true;toast(`🧹 Pulizie in corso nel parcheggio: torna più tardi (${Math.ceil(S.raceCool)} s)`,3);ev({k:"sfx",s:"empty"});p.kx=-4;return}
 if(d.to===5&&!sushiOpen()){p.doorLock=true;const miss=groupsInPlay().filter(g=>S.grp[g].frags<4);
  toast(S.rule==="insieme"?`Il Sushi Samurai è chiuso: servono i 4 pezzi del volantino (${S.grp[0].frags}/4)`:`Il Sushi Samurai apre quando tutti hanno i 4 pezzi. Mancano: ${miss.map(g=>grpName(g)+" "+S.grp[g].frags+"/4").join(", ")}`,3.5);ev({k:"sfx",s:"empty"});p.ky=d.y>S.H/2?-3.5:3.5;return}
 enterArea(d.to)}
function fountDist(p){const f=S.fount;if(!f)return 99;const dx=Math.max(f[0]-p.x,0,p.x-f[2]),dy=Math.max(f[1]-p.y,0,p.y-f[3]);return Math.hypot(dx,dy)}
function updZoo(dt){if(!S.parrots)return;
 for(const r of S.parrots){r.ct-=dt;if(r.ct<=0){r.ct=rnd(1.5,3.5);let a=rnd(0,PI*2);const tg=S.players.find(p=>!p.hidden&&!p.away&&!p.down&&dist(p.x,p.y,r.x,r.y)<6);if(tg&&Math.random()<.5)a=Math.atan2(tg.y-r.y,tg.x-r.x)+rnd(-.5,.5);r.vx=Math.cos(a)*2.4;r.vy=Math.sin(a)*2.4}
  r.x+=r.vx*dt;r.y+=r.vy*dt;if(r.x<1.5||r.x>S.W-1.5)r.vx=-r.vx;if(r.y<2||r.y>S.H-1.5)r.vy=-r.vy;r.x=cl(r.x,1.5,S.W-1.5);r.y=cl(r.y,2,S.H-1.5);
  r.t-=dt;if(r.t<=0){r.t=rnd(2.6,4.6);S.poops.push({id:"o"+(S.nid++),x:r.x,y:r.y,h:1.5,land:false,life:9});ev({k:"sfx",s:"plop",x:r.x,y:r.y})}}
 for(let i=S.poops.length-1;i>=0;i--){const q=S.poops[i];
  if(!q.land){q.h-=dt*2.4;if(q.h>0)continue;q.land=true;q.h=0;
   const hp=vis().find(p=>dist(q.x,q.y,p.fish.x,p.fish.y)<.6||!p.down&&!p.shop&&dist(p.x,p.y,q.x,q.y)<.5);
   if(hp){hp.fish.water=Math.max(0,hp.fish.water-12);float(q.x,q.y-.4,"Splat! Acqua del pesce sporca","#e8d9a0");ev({k:"sfx",s:"splat",x:q.x,y:q.y});S.poops.splice(i,1)}continue}
  q.life-=dt;if(q.life<=0){S.poops.splice(i,1);continue}
  for(const p of vis())if(!p.down&&!p.shop&&dist(p.x,p.y,q.x,q.y)<.4){p.fish.water=Math.max(0,p.fish.water-5);float(p.x,p.y-.4,"Bleah! Acqua sporca","#e8d9a0");ev({k:"sfx",s:"splat",x:p.x,y:p.y});S.poops.splice(i,1);break}}
 for(let i=S.critters.length-1;i>=0;i--){const a=S.critters[i];a.t-=dt;const tx=S.exit?S.exit[0]:a.x,ty=S.exit?S.exit[1]:a.y,dd=dist(a.x,a.y,tx,ty);
  if(dd>.3){moveCircle(a,(tx-a.x)/dd*3.4*dt,(ty-a.y)/dd*3.4*dt,.25);a.walk+=dt*16;if(Math.abs(tx-a.x)>.1)a.face=Math.sign(tx-a.x)}
  if(a.t<=0||dd<1){ev({k:"burst",x:a.x,y:a.y,col:"#ffe36b",n:10});S.critters.splice(i,1)}}}
function updPeople(dt){for(const q of S.people){
 if(q.kx||q.ky){moveCircle(q,q.kx*dt,q.ky*dt,.3);const f=Math.pow(.02,dt);q.kx*=f;q.ky*=f;if(Math.abs(q.kx)+Math.abs(q.ky)<.1)q.kx=q.ky=0;q.walk+=dt*14;continue}
 q.t-=dt;
 if(q.mode==="look"){if(q.t<=0){q.mode="walk";q.t=rnd(4,9);[q.tx,q.ty]=freeSpot(0)}continue}
 const dx=q.tx-q.x,dy=q.ty-q.y,d=Math.hypot(dx,dy);
 if(d<.3||q.t<=0){if(Math.random()<.55){q.mode="look";q.t=rnd(3,8)}else{q.t=rnd(4,9);[q.tx,q.ty]=freeSpot(0)}continue}
 for(const p of vis())if(dist(p.x,p.y,q.x,q.y)<.75){q.t=Math.min(q.t,.6)}
 const ox=q.x,oy=q.y;moveCircle(q,dx/d*q.spd*dt,dy/d*q.spd*dt,.3);q.walk+=dt*9;if(Math.abs(dx)>.15)q.face=Math.sign(dx);if(dist(ox,oy,q.x,q.y)<q.spd*dt*.3)q.t-=dt*3}}
function bumpPeople(p){for(const q of S.people){const d=dist(p.x,p.y,q.x,q.y),m=.6;if(d<m&&d>.001){const k=(m-d)/d;moveCircle(p,(p.x-q.x)*k,(p.y-q.y)*k,.3)}}}
function missionTick(dt){const m=S.mission;S.spawnT-=dt;if(m.kind==="hall"||m.kind==="fishing"||S.lvl===6)return;
 if(m.kind==="pizza"){let w=S.tables.filter(t=>t.want).length;for(const t of S.tables)if(!t.want){t.t-=dt;if(t.t<=0&&w<4){t.want=true;w++}}}
 if(m.kind==="pastry"&&S.spawnT<=0){S.spawnT=2;const on=S.items.filter(i=>i.k==="pastry").length;if(on<6&&m.n+on<m.need+4){const[x,y]=freeSpot(4);S.items.push({id:S.nid++,k:"pastry",v:ri(0,2),x,y})}}
 if(m.kind==="ark"&&S.spawnT<=0){S.spawnT=6;const on=S.enemies.filter(e=>e.t==="k"&&!e.flee).length;if(on<2&&S.catSpawns.length){const s=S.catSpawns[ri(0,S.catSpawns.length-1)];if(!S.players.some(p=>dist(p.x,p.y,s[0],s[1])<3))addEnemy("k",s[0],s[1])}}
 if(!m.done){const ok=m.kind!=="boss"&&m.kind!=="hall"&&!!S.fragSpot&&m.need>0&&m.n>=m.need;
  if(ok){m.done=true;S.done[S.lvl]=true;S.items.push({id:S.nid++,k:"frag",x:S.fragSpot[0],y:S.fragSpot[1]});toast("Missione compiuta! Prendi il pezzo del volantino");ev({k:"sfx",s:"mission"});ev({k:"burst",x:S.fragSpot[0],y:S.fragSpot[1],col:"#ffc93c",n:30})}}
}
/* nemici */
function targetFor(e){let best=null,bd=1e9;for(const p of S.players){if(p.hidden||p.away||p.down||p.shop)continue;const d=dist(e.x,e.y,p.x,p.y);if(d<bd){bd=d;best=p}}return[best,bd]}
function steer(e,tx,ty,spd,dt,r){let dx=tx-e.x,dy=ty-e.y;const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
 if(e.unst>0){e.unst-=dt;dx=e.ux;dy=e.uy}
 const ox=e.x,oy=e.y;moveCircle(e,dx*spd*dt,dy*spd*dt,r);e.walk+=dt*11;if(Math.abs(dx)>.2)e.face=Math.sign(dx);
 if(e.unst<=0&&dist(ox,oy,e.x,e.y)<spd*dt*.3){e.unst=.6;const s=Math.random()<.5?1:-1;e.ux=-dy*s;e.uy=dx*s}}
function wander(e,spd,dt,r){e.wt-=dt;if(e.wt<=0){e.wt=rnd(1,2.5);const a=rnd(0,PI*2);[e.wx,e.wy]=Math.random()<.3?[0,0]:[Math.cos(a),Math.sin(a)];if(dist(e.x,e.y,e.hx,e.hy)>4){const d=dist(e.x,e.y,e.hx,e.hy);e.wx=(e.hx-e.x)/d;e.wy=(e.hy-e.y)/d}}
 if(e.wx||e.wy){moveCircle(e,e.wx*spd*dt,e.wy*spd*dt,r);e.walk+=dt*8;if(Math.abs(e.wx)>.2)e.face=Math.sign(e.wx);if(e.bx||e.by)e.wt=0}}
function shoot(e,k,tx,ty,spd,dmg,spread){if(!spread||spread<0)ev({k:"sfx",s:"throw",x:e.x,y:e.y});const a=Math.atan2(ty-e.y,tx-e.x)+(spread||0);S.proj.push({id:S.nid++,k,x:e.x,y:e.y-.1,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,own:"e",dmg,life:2.4,r:k==="knife"?.15:.25,rot:0})}
function updEnemy(e,dt){const d=EN[e.t],r=d.r;
 if(d.type==="cart"&&!e.dead){e.sk=(e.sk||0)+dt;if(e.sk>=2.5){e.sk=0;const[tp0,td0]=targetFor(e);if(e.px!==undefined&&dist(e.x,e.y,e.px,e.py)<.3&&e.stun<=0&&!e.charge&&tp0&&td0<d.aggro){
   for(let rad=1.2;rad<=4;rad+=.8){let ok=false;for(let a=0;a<12;a++){const x=e.x+Math.cos(a*.52)*rad,y=e.y+Math.sin(a*.52)*rad;if(!hitsSolid(x,y,r+.35)&&!S.enemies.some(o=>o!==e&&!o.dead&&dist(o.x,o.y,x,y)<.8)){e.x=x;e.y=y;e.hx=x;e.hy=y;ok=true;break}}if(ok)break}e.unst=0}
  e.px=e.x;e.py=e.y}}
 e.cd-=dt;e.stun-=dt;e.slow-=dt;e.hit-=dt;e.atk-=dt;e.dcd-=dt;
 if(e.poison>0){e.poison-=dt;e.pa=(e.pa||0)+dt;if(e.pa>=.5){e.pa=0;if(!d.stunOnly&&e.t!=="k"){e.hp-=2;if(e.hp<=0){killE(e);return}}}}
 if(e.kx||e.ky){moveCircle(e,e.kx*dt,e.ky*dt,r);const f=Math.pow(.01,dt);e.kx*=f;e.ky*=f;if(Math.abs(e.kx)+Math.abs(e.ky)<.1)e.kx=e.ky=0}
 if(e.stun>0){e.wind=0;e.charge=false;return}
 const spd=d.spd*(e.slow>0?.5:1),[tp,td]=targetFor(e),see=tp&&td<d.aggro&&los(e.x,e.y,tp.x,tp.y);
 if(tp&&Math.abs(tp.x-e.x)>.2&&d.type!=="cart"&&d.type!=="cat")e.face=Math.sign(tp.x-e.x);
 switch(d.type){
 case"melee":
  if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.atk=.3;if(tp&&td<1.3){const k=1/(td||1);hurtP(tp,e.dmg,(tp.x-e.x)*k,(tp.y-e.y)*k)}}}
  else if(see){if(td>.95)steer(e,tp.x,tp.y,spd,dt,r);else if(e.cd<=0){e.wind=.42;e.cd=d.cd}}
  else wander(e,spd*.5,dt,r);break;
 case"cart":
  if(e.charge){e.ct-=dt;moveCircle(e,e.cvx*dt,e.cvy*dt,r);e.walk+=dt*20;
   for(const p of S.players)if(!p.hidden&&!p.away&&!p.down&&dist(p.x,p.y,e.x,e.y)<r+.35&&hurtP(p,e.dmg,e.cvx/7.5,e.cvy/7.5)){e.charge=false;e.cd=1.5}
   if(e.bx||e.by||e.ct<=0){e.charge=false;e.stun=1.3;e.cd=2;float(e.x,e.y,"Crash!","#ffc93c");ev({k:"sfx",s:"crash",x:e.x,y:e.y});ev({k:"burst",x:e.x,y:e.y,col:"#aeb8c8",n:10})}}
  else if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.charge=true;e.ct=2.2;e.cvx=e.wx*7.5;e.cvy=e.wy*7.5}}
  else{if(see&&e.cd<=0&&td<8&&(Math.abs(tp.x-e.x)<.5||Math.abs(tp.y-e.y)<.5)){const ax=Math.abs(tp.x-e.x)>Math.abs(tp.y-e.y);e.wx=ax?Math.sign(tp.x-e.x):0;e.wy=ax?0:Math.sign(tp.y-e.y);e.wind=.45;if(e.wx)e.face=e.wx}
   else if(see&&td<6)steer(e,tp.x+(Math.abs(tp.x-e.x)<Math.abs(tp.y-e.y)?0:0),e.y+(tp.y-e.y)*.6,spd,dt,r);else wander(e,spd*.6,dt,r)}break;
 case"chaser":
  if(e.flee>0){e.flee-=dt;wander(e,spd*.6,dt,r);break}
  {let tg=tp,tdd=td;for(const p of S.players)if(p.carry&&!p.hidden&&!p.away&&!p.away&&!p.down&&!p.shop&&dist(p.x,p.y,e.x,e.y)<d.aggro){tg=p;tdd=dist(p.x,p.y,e.x,e.y)}
   if(tg&&tdd<d.aggro){steer(e,tg.x,tg.y,spd*(tg.carry?1:.75),dt,r);if(tdd<.7&&e.cd<=0&&tg.inv<=0){hurtP(tg,e.dmg,0,0);tg.stun=2;dropCarry(tg);float(tg.x,tg.y-.4,"Presa!","#ff6fae");e.cd=2.5;e.flee=1.6}}
   else wander(e,spd*.5,dt,r)}break;
 case"thrower":
  if(see){if(d.chase){if(td>3)steer(e,tp.x,tp.y,spd,dt,r);if(td<.65&&e.atk<=0){e.atk=1;hurtP(tp,6,(tp.x-e.x),(tp.y-e.y))}}else wander(e,spd*.5,dt,r);
   if(e.cd<=0){e.cd=d.cd*rnd(.8,1.2)*(1-.06*(S.lvl-1));const lead=.25;shoot(e,d.proj,tp.x+(tp.fx||0)*lead,tp.y+(tp.fy||0)*lead,d.proj==="pizza"?5.2:4.6,e.dmg)}}
  else wander(e,spd*.5,dt,r);break;
 case"cat":
  if(e.flee){e.fleeT+=dt;const[pp]=targetFor(e);if(pp){const dx=e.x-pp.x,dy=e.y-pp.y,dd=Math.hypot(dx,dy)||1;e.unst=0;moveCircle(e,dx/dd*5*dt,dy/dd*5*dt,r);e.face=Math.sign(dx)||1}e.walk+=dt*20;if(e.fleeT>2.2)e.dead=true;break}
  {let f=null,fd=1e9;for(const q of vis()){const dd=dist(e.x,e.y,q.fish.x,q.fish.y);if(dd<fd){fd=dd;f=q.fish}}if(!f){wander(e,spd*.6,dt,r);break}
   if(e.run>0){e.run-=dt;wander(e,spd,dt,r);break}
   if(fd<7){steer(e,f.x,f.y+.4,spd,dt,r);e.face=Math.sign(f.x-e.x)||1;if(fd<.8&&e.cd<=0){f.food=Math.max(0,f.food-10);e.cd=1.6;e.run=1.2;float(f.x,f.y,"Il gatto ruba la pappa!","#ff9a2e");ev({k:"sfx",s:"meow"})}}
   else if(see){steer(e,tp.x,tp.y,spd,dt,r);e.face=Math.sign(tp.x-e.x)||1}else wander(e,spd*.6,dt,r);
   }break;
 case"clerk":
  if(tp&&td<d.aggro){e.scared=true;steer(e,e.x*2-tp.x,e.y*2-tp.y,spd,dt,r);e.face=Math.sign(e.x-tp.x)||1}else{e.scared=false;wander(e,spd*.45,dt,r)}break;
 case"ninja":
  if(e.dash>0){e.dash-=dt;moveCircle(e,e.dvx*dt,e.dvy*dt,r);if(tp&&td<.7)hurtP(tp,e.dmg,e.dvx/8,e.dvy/8);break}
  if(see){if(td>3.6)steer(e,tp.x,tp.y,spd,dt,r);else if(td<2.4)steer(e,e.x*2-tp.x,e.y*2-tp.y,spd,dt,r);else steer(e,e.x-(tp.y-e.y),e.y+(tp.x-e.x),spd*.6,dt,r);
   if(e.cd<=0){e.cd=d.cd;shoot(e,"chop",tp.x,tp.y,7,e.dmg,-.12);shoot(e,"chop",tp.x,tp.y,7,e.dmg,.12)}
   if(e.dcd<=0&&td<4.5){e.dcd=rnd(3,5);e.dash=.32;const k=8/(td||1);e.dvx=(tp.x-e.x)*k;e.dvy=(tp.y-e.y)*k}}
  else wander(e,spd*.5,dt,r);break;
 case"boss":{
  const ph2=e.hp<e.max*.5;
  if(e.hp<e.max*.6&&e.sum<1||e.hp<e.max*.3&&e.sum<2){e.sum++;for(let i=0;i<2;i++){const n=addEnemy("n",e.x+(i?1.2:-1.2),e.y+.5);if(hitsSolid(n.x,n.y,.3)){n.x=e.x;n.y=e.y}}toast("Il cuoco chiama i camerieri ninja!");ev({k:"sfx",s:"alarm"})}
  if(e.dash>0){e.dash-=dt;moveCircle(e,e.dvx*dt,e.dvy*dt,r);e.walk+=dt*20;e.atk=.2;for(const p of S.players)if(!p.hidden&&!p.away&&!p.down&&dist(p.x,p.y,e.x,e.y)<r+.4)hurtP(p,e.dmg+5,e.dvx/9,e.dvy/9);break}
  if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.dash=.5;e.dvx=e.wx*9.5;e.dvy=e.wy*9.5}break}
  if(!tp){wander(e,spd*.4,dt,r);break}
  if(td>4.2)steer(e,tp.x,tp.y,spd,dt,r);else if(td<2.6)steer(e,e.x*2-tp.x,e.y*2-tp.y,spd*.7,dt,r);else steer(e,e.x-(tp.y-e.y),e.y+(tp.x-e.x),spd*.5,dt,r);
  if(e.cd<=0){if(Math.random()<.58){const n=ph2?7:5;for(let i=0;i<n;i++)shoot(e,"knife",tp.x,tp.y,6.5,e.dmg,(i-(n-1)/2)*.22);e.atk=.3;e.cd=d.cd*(ph2?.75:1)}
   else{const dd=td||1;e.wx=(tp.x-e.x)/dd;e.wy=(tp.y-e.y)/dd;e.wind=.65;e.cd=d.cd*1.3;ev({k:"warn",id:e.id,x:e.x,y:e.y,wx:e.wx,wy:e.wy})}}}break;
 }}
function updProj(dt){
 for(let i=S.proj.length-1;i>=0;i--){const q=S.proj[i];
  if(q.k==="gum"){q.t+=dt;if(q.st==="fly"){const f=Math.min(1,q.t/q.ft);q.x=q.sx+(q.tx-q.sx)*f;q.y=q.sy+(q.ty-q.sy)*f;if(f>=1){q.st="armed";q.t=0}}
   else if(q.t>=.8){explode(q);S.proj.splice(i,1)}continue}
  q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;q.rot=(q.rot||0)+dt*14;
  const tc=S.G[Math.floor(q.y)]&&S.G[Math.floor(q.y)][Math.floor(q.x)];
  if(q.life<=0||tc===undefined||BLOCKP.includes(tc)){if(q.k==="cart")landCart(q,dt);else if(q.k==="soap"||q.k==="water")ev({k:"burst",x:q.x-q.vx*.02,y:q.y-q.vy*.02,col:q.k==="soap"?"#e8c6ff":"#8fe0ff",n:5});S.proj.splice(i,1);continue}
  if(q.own==="p"){let gone=false;for(const e of S.enemies){if(e.dead||q.hit.includes(e.id))continue;if(dist(q.x,q.y,e.x,e.y)<q.r+EN[e.t].r){const n=Math.hypot(q.vx,q.vy)||1;hitE(e,q.dmg,q.vx/n,q.vy/n,q.k==="water"?(q.pot||"w"):null,S.players[q.by]);q.hit.push(e.id);
    ev({k:"burst",x:q.x,y:q.y,col:q.k==="water"?(q.pot?POT[q.pot].col:"#8fe0ff"):"#e8c6ff",n:7});if(!q.pierce){gone=true;break}}}if(gone){if(q.k==="cart")landCart(q,dt);S.proj.splice(i,1)}}
  else{for(const p of S.players){if(p.hidden||p.away||p.down||p.shop)continue;if(dist(q.x,q.y,p.x,p.y)<q.r+.3){const n=Math.hypot(q.vx,q.vy)||1;if(hurtP(p,q.dmg,q.vx/n*.6,q.vy/n*.6)&&q.k==="cake"){p.slowT=2.2;float(p.x,p.y-.5,"Che torta!","#ff8cc0")}
    ev({k:"burst",x:q.x,y:q.y,col:q.k==="cake"?"#fff1f6":q.k==="pizza"?"#e63946":"#cfd6e0",n:8});S.proj.splice(i,1);break}}}}}
function explode(q){const R=q.mega?2.6:1.8,dmg=q.mega?60:45,by=S.players[q.by];ev({k:"boom",x:q.x,y:q.y,r:R});
 for(const e of S.enemies){if(e.dead)continue;const d=dist(q.x,q.y,e.x,e.y);if(d<R+EN[e.t].r){const n=d||1;hitE(e,dmg,(e.x-q.x)/n,(e.y-q.y)/n,null,by)}}revealNear(q.x,q.y,R)}

/* acquisti (eseguiti da chi simula) */
function buy(id,pi){const it=SHOP.find(s=>s.id===id),p=S.players[pi]||S.players[0],G=GR(p);if(!it||G.coins<it.price)return false;
 if(it.up&&G.up[id])return false;if(it.only&&S.lvl!==it.only)return false;if(id==="heart"&&S.rule!=="insieme")return false;
 G.coins-=it.price;const f=p.fish;
 if(id==="food")f.food=Math.min(100,f.food+40);else if(id==="water")f.water=Math.min(100,f.water+50);
 else if(POT[id]){f.pot=id;f.potT=60}else if(id==="soap")G.ammo.soap+=15;else if(id==="gum")G.ammo.gum+=3;
 else if(id==="snack")p.hp=Math.min(p.max,p.hp+40);
 else if(id==="heart")G.lives++;else G.up[id]=1;
 ev({k:"buy",id,pi});return true}
function nextTurnIdx(){const n=S.players.length;for(let k=1;k<=n;k++){const j=(S.active+k)%n;if(!S.players[j].away)return j}return S.active}
function switchTurn(){const a=S.players[S.active],b=S.players[nextTurnIdx()];if(a!==b){b.hidden=false;b.x=a.x;b.y=a.y;b.carry=a.carry;a.carry=null;a.hidden=true;
 if(b.fish){b.fish.x=a.fish.x;b.fish.y=a.fish.y}if(S.lvl===6){b.x=6;b.y=2.7;b.rod={ang:0,st:"idle",len:0,obj:null,cd:.4}}}
 b.inv=1;b.down=false;b.respawn=0;if(b.hp<=0)b.hp=b.max;S.active=b.i;S.turnT=75;S.phase="play"}

/* ---------- gara di carrelli nel parcheggio (livello 7) ---------- */
const RW=44,RH=30,RLAPS=3,RCOOL=60,RSLOTS=[[24.2,25.4],[24.2,27.6],[21.8,25.4],[21.8,27.6],[19.4,25.4],[19.4,27.6],[17,25.4],[17,27.6]];
const rIn=(x,y,x0,y0,x1,y1,r)=>{if(x<x0||x>x1||y<y0||y>y1)return false;const cx=x<x0+r?x0+r:x>x1-r?x1-r:x,cy=y<y0+r?y0+r:y>y1-r?y1-r:y;return(x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r};
const rRoad=(x,y)=>rIn(x,y,1,1,43,29,8)&&!rIn(x,y,6,6,38,24,3);
function racePath(){const x0=3.5,y0=3.5,x1=40.5,y1=26.5,r=5.5,pts=[],P=(x,y)=>pts.push([x,y]);
 const line=(ax,ay,bx,by)=>{const n=Math.max(1,Math.round(Math.hypot(bx-ax,by-ay)/1.1));for(let i=0;i<n;i++)P(ax+(bx-ax)*i/n,ay+(by-ay)*i/n)};
 const arc=(cx,cy,a0,a1)=>{const n=Math.max(2,Math.round(Math.abs(a1-a0)*r/1.1));for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n;P(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}};
 line(26,y1,x1-r,y1);arc(x1-r,y1-r,PI/2,0);line(x1,y1-r,x1,y0+r);arc(x1-r,y0+r,0,-PI/2);line(x1-r,y0,x0+r,y0);arc(x0+r,y0+r,-PI/2,-PI);line(x0,y0+r,x0,y1-r);arc(x0+r,y1-r,PI,PI/2);line(x0+r,y1,26,y1);return pts}
const RPATH=racePath(),RN=RPATH.length;
const angD=(a,b)=>{let d=a-b;while(d>PI)d-=PI*2;while(d<-PI)d+=PI*2;return d};
function loadRace(){S.lvl=7;S.W=RW;S.H=RH;S.G=[];for(let y=0;y<RH;y++){const r=[];for(let x=0;x<RW;x++)r.push(rRoad(x+.5,y+.5)?".":"#");S.G.push(r)}S.gv++;
 Object.assign(S,{enemies:[],proj:[],items:[],tables:[],ovens:[],kiosks:[],shelves:[],hidden:{},respawn:[],exitOpen:true,fragSpot:null,cage:null,exit:null,spawn:[24,26.5],catSpawns:[],spawnT:0,people:[],hallDoors:[],fount:null,shelter:null,mom:null,cages:[],parrots:[],poops:[],critters:[],fobj:[],scats:[],baskets:[[],[],[],[]],catT:0});
 S.mission={kind:"race",n:0,need:0,cats:0,catNeed:0,kit:false,done:false,boss:false,freed:false,sp:0};
 const boxes=[];for(let k=0;k<6;k++){const i=Math.floor(RN*(k+.5)/6),a=RPATH[i],b=RPATH[(i+1)%RN],tx=b[0]-a[0],ty=b[1]-a[1],n=Math.hypot(tx,ty)||1;for(const o of[-1.4,0,1.4])boxes.push({x:a[0]-ty/n*o,y:a[1]+tx/n*o,t:0})}
 S.race={st:"count",t:3.4,big:"",laps:RLAPS,boxes,gums:[],rp:[],placeN:0,winner:-1,endT:0,clock:0,top:[]}}
function raceKarts(){return[...S.players.filter(p=>!p.hidden&&!p.away&&!p.watch),...S.enemies.filter(e=>e.kart&&!e.dead)]}
function startRace(){const R=S.race,hot=S.mode==="hot";S.players.forEach(p=>{p.watch=hot&&p.i!==S.active});
 const hs=S.players.filter(p=>!p.hidden&&!p.away&&!p.watch);let k=0;
 for(const p of hs){const s=RSLOTS[k++];Object.assign(p,{x:s[0],y:s[1],kh:0,ks:0,spin:0,boost:0,shield:0,up1:0,up2:0,wi:RN-3-Math.floor((k-1)/2)*2,wr:0,fin:0,cd:.5,kx:0,ky:0,stun:0,inv:0,doorLock:true,down:false,hp:p.max});p.fish&&(p.fish.x=p.x,p.fish.y=p.y)}
 for(let a=0;a<3;a++){const s=RSLOTS[k++],e=addEnemy("b",s[0],s[1]);Object.assign(e,{kart:true,look:["cop","nonna","kid"][a],kh:0,ks:0,spin:0,boost:0,shield:0,wi:RN-3-Math.floor((k-1)/2)*2,wr:0,fin:0,off:[-1,0,1][a]*.9,vmax:6.6+a*.25,fcd:rnd(3,6),face:1,dmg:0,hp:999,max:999})}
 toast("Gara di carrelli! Salite sul carrello: "+RLAPS+" giri. Raccogliete i ? per i gadget. Vince chi taglia per primo il traguardo!",6)}
function rkAdv(o){let best=o.wi,bd=1e9;for(let j=-4;j<=12;j++){const i=((o.wi+j)%RN+RN)%RN,d=dist(o.x,o.y,RPATH[i][0],RPATH[i][1]);if(d<bd){bd=d;best=i}}
 if(best<o.wi-RN/2)o.wr++;else if(best>o.wi+RN/2)o.wr--;o.wi=best}
const rProg=o=>o.wr*RN+o.wi;
function spinKart(o,by){if(o.shield>0){o.shield=0;float(o.x,o.y-.8,"Bolla!","#9fe8ff");ev({k:"sfx",s:"pick"});return}if(o.spin>.4)return;o.spin=1.4;o.ks*=.3;ev({k:"sfx",s:"stun",x:o.x,y:o.y});ev({k:"burst",x:o.x,y:o.y,col:"#ffe36b",n:10});float(o.x,o.y-.8,"Ooops!","#ffe36b")}
function kartDrive(o,dt,want,max,steer){ // want: angolo desiderato o null
 o.spin=Math.max(0,(o.spin||0)-dt);o.boost=Math.max(0,(o.boost||0)-dt);o.shield=Math.max(0,(o.shield||0)-dt);
 let top=max*(o.boost>0?1.45:1);
 if(o.spin>0)o.ks*=Math.pow(.1,dt);
 else{if(want!=null){const d=angD(want,o.kh),rate=steer*(1.15-.5*Math.min(1,o.ks/top));o.kh+=Math.max(-rate*dt,Math.min(rate*dt,d))}
  const tg=want!=null?top:top*.5;o.ks+=(tg-o.ks)*Math.min(1,dt*(tg>o.ks?2.4:1.4))}
 const vx=Math.cos(o.kh)*o.ks,vy=Math.sin(o.kh)*o.ks,ox=o.x,oy=o.y;moveCircle(o,vx*dt,vy*dt,.34);
 const dd=Math.hypot(o.x-ox,o.y-oy),w=Math.hypot(vx,vy)*dt;if(w>.001&&dd<w*.6){o.ks*=Math.pow(.04,dt);if(S.time-(o.bumpT||-9)>.5){o.bumpT=S.time;ev({k:"sfx",s:"bump",x:o.x,y:o.y})}}
 o.face=Math.cos(o.kh)<0?-1:1;o.walk=(o.walk||0)+o.ks*dt*2}
function raceGift(p){const r=Math.random(),n=p.name;
 if(r<.3){p.up1=3;float(p.x,p.y-1,"Saponetta razzo ×3!","#ff9fd6")}
 else if(r<.55){p.up2=2;float(p.x,p.y-1,"Gomma gigante ×2!","#ffb3e6")}
 else if(r<.8){p.boost=2.4;float(p.x,p.y-1,"Turbo!","#ffd23c")}
 else{p.shield=8;float(p.x,p.y-1,"Bolla scudo!","#9fe8ff")}ev({k:"sfx",s:"pick",x:p.x,y:p.y})}
function raceFire(o,kind,own){const R=S.race,c=Math.cos(o.kh),s=Math.sin(o.kh);
 if(kind==="soap"){const hm=own&&o.up1>0;if(hm)o.up1--;R.rp.push({id:S.nid++,x:o.x+c*.7,y:o.y+s*.7,vx:c*(hm?15:13)+c*Math.max(0,o.ks)*.3,vy:s*(hm?15:13)+s*Math.max(0,o.ks)*.3,by:own?o.i:-1,ai:!own,hm,life:1.3})}
 else{const big=own&&o.up2>0;if(big)o.up2--;R.gums.push({id:S.nid++,x:o.x-c*.95,y:o.y-s*.95,by:own?o.i:-1,ai:!own,big,t:14,arm:.8})}
 ev({k:"sfx",s:kind==="soap"?"soap":"gum",x:o.x,y:o.y})}
function raceAttack(p){if(p.cd>0||p.spin>0||p.fin)return;
 if(p.w===0){p.cd=.5;p.swing=.22;ev({k:"sfx",s:"towel",x:p.x,y:p.y});ev({k:"swing",id:p.id,ax:Math.cos(p.kh),ay:Math.sin(p.kh),wet:false});
  for(const o of raceKarts()){if(o===p)continue;const dx=o.x-p.x,dy=o.y-p.y,d=Math.hypot(dx,dy);if(d<1.9)spinKart(o,p)}}
 else if(p.w===1){p.cd=p.up1>0?.55:1;raceFire(p,"soap",true)}
 else{p.cd=1.3;raceFire(p,"gum",true)}}
function kartAI(e,dt){const R=S.race,go=R.st==="go"||R.st==="end";rkAdv(e);
 if(!go||e.fin){kartDrive(e,dt,null,e.fin?4:0,3);if(!go)e.ks=0;return}
 const L=4+Math.floor(e.ks/3),t=RPATH[(e.wi+L)%RN],t2=RPATH[(e.wi+L+1)%RN],tx=t2[0]-t[0],ty=t2[1]-t[1],n=Math.hypot(tx,ty)||1,gx=t[0]-ty/n*e.off,gy=t[1]+tx/n*e.off;
 let want=Math.atan2(gy-e.y,gx-e.x);
 const pl=S.players.filter(p=>!p.hidden&&!p.away&&!p.watch);let mx=0;for(const p of pl)mx=Math.max(mx,rProg(p));
 const diff=mx-rProg(e),k=diff>RN*.25?1.12:diff<-RN*.12?.88:1;
 for(const g of R.gums)if(dist(g.x,g.y,e.x+Math.cos(e.kh)*1.6,e.y+Math.sin(e.kh)*1.6)<(g.big?1.5:.9)&&g.by!==-1){want+=.55}
 kartDrive(e,dt,want,e.vmax*k,3.3);
 e.fcd-=dt;if(e.fcd<=0){e.fcd=rnd(3.5,7);const c=Math.cos(e.kh),s=Math.sin(e.kh);
  const ahead=pl.find(p=>{const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);return d<7&&d>1.5&&(dx*c+dy*s)/d>.93});
  if(ahead)raceFire(e,"soap",false);else if(pl.some(p=>{const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);return d<3&&(dx*c+dy*s)/d<-.7}))raceFire(e,"gum",false)}}
function raceTick(dt){const R=S.race;if(!R)return;
 const go=R.st==="go"||R.st==="end";
 if(R.st==="count"){R.t-=dt;R.big=R.t>0?String(Math.ceil(R.t)):"";if(R.t<=0){R.st="go";R.big="VIA!";R.bigT=1;ev({k:"sfx",s:"deliver"})}}
 else{R.clock+=dt;if(R.bigT>0){R.bigT-=dt;if(R.bigT<=0)R.big=""}}
 const ps=S.players.filter(p=>!p.hidden&&!p.away&&!p.watch);
 S.players.forEach((p,i)=>{if(p.hidden||p.away||p.watch)return;const inp=inputFor(i);if(inp.wsel>=0&&inp.wsel<3&&inp.wsel!==p.w)p.w=inp.wsel|0;
  p.cd-=dt;p.swing-=dt;let mx=inp.mx||0,my=inp.my||0;const m=Math.hypot(mx,my);
  kartDrive(p,dt,go&&!p.fin&&m>.2?Math.atan2(my,mx):null,go&&!p.fin?7.2:p.fin?4:0,3.6);if(!go)p.ks=0;
  if(go&&inp.ab&&!p.fin){p.fin=-1;p.watch=true;toast(p.name+" abbandona la corsa",2.5);if(S.mode==="hot"){S.raceTimes=S.raceTimes||{};S.raceTimes[p.i]=-1}if(S.players.every(q=>q.hidden||q.away||q.watch||q.fin)&&R.st!=="end"){R.st="end";R.endT=.6}return}
  if(go&&inp.atk)raceAttack(p);
  rkAdv(p);p.fx=Math.cos(p.kh);p.fy=Math.sin(p.kh);p.walk=0;
  if(go&&!p.fin&&p.wr>=RLAPS+1){p.fin=++R.placeN;p.finT=R.clock;
   if(S.mode==="hot"){S.raceTimes=S.raceTimes||{};S.raceTimes[p.i]=R.clock;R.winner=p.i;R.st="end";R.endT=3.5;ev({k:"sfx",s:"free"});toast(`🏁 ${p.name}: tempo ${fmtT(R.clock)}`,3.5)}
   else if(R.winner<0){R.winner=p.i;R.st="end";R.endT=9;const G=GR(p);G.coins+=25;p.score=(p.score|0)+1500;ev({k:"sfx",s:"free"});ev({k:"burst",x:p.x,y:p.y,col:"#ffc93c",n:40});
    toast(`🏁 Ha vinto ${S.rule==="squadre"?grpName(gi(p))+" con "+p.name:p.name}! +25 monete${S.rule==="insieme"?" per tutti":""}`,5)}
   else float(p.x,p.y-1,`${p.fin}° posto!`,"#fff")}});
 for(const e of S.enemies)if(e.kart&&!e.dead){e.cd=0;kartAI(e,dt);if(e.wr>=RLAPS+1&&!e.fin){e.fin=1;float(e.x,e.y-1,"Un concorrente ha finito","#ccc")}}
 const ks=raceKarts();
 for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const a=ks[i],b=ks[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>0&&d<.8){const o=(.8-d)/2,nx=dx/d,ny=dy/d;moveCircle(a,-nx*o,-ny*o,.34);moveCircle(b,nx*o,ny*o,.34);const av=a.ks,bv=b.ks;a.ks=a.ks*.85+bv*.1;b.ks=b.ks*.85+av*.1}}
 for(const bx of R.boxes){if(bx.t>0){bx.t-=dt;continue}for(const o of ks){if(!o.name||dist(o.x,o.y,bx.x,bx.y)>.85)continue;bx.t=6;raceGift(o);break}}
 for(let i=R.gums.length-1;i>=0;i--){const g=R.gums[i];g.t-=dt;g.arm-=dt;if(g.t<=0){R.gums.splice(i,1);continue}
  for(const o of ks){if(g.arm>0&&o.i===g.by&&o.name)continue;if(dist(o.x,o.y,g.x,g.y)<(g.big?1.25:.7)){if(g.ai&&!o.name)continue;spinKart(o);R.gums.splice(i,1);break}}}
 for(let i=R.rp.length-1;i>=0;i--){const q=R.rp[i];q.life-=dt;
  if(q.hm){let tg=null,bd=9;for(const o of ks){if(o.i===q.by&&o.name)continue;const d=dist(q.x,q.y,o.x,o.y);if(d<bd&&(o.name||!q.ai)){bd=d;tg=o}}
   if(tg){const sp=Math.hypot(q.vx,q.vy),a=Math.atan2(q.vy,q.vx),w=Math.atan2(tg.y-q.y,tg.x-q.x),na=a+Math.max(-4*dt,Math.min(4*dt,angD(w,a)));q.vx=Math.cos(na)*sp;q.vy=Math.sin(na)*sp}}
  q.x+=q.vx*dt;q.y+=q.vy*dt;let dead=q.life<=0||solidAt(Math.floor(q.x),Math.floor(q.y));
  if(!dead)for(const o of ks){if(o.i===q.by&&o.name)continue;if(q.ai&&!o.name)continue;if(dist(o.x,o.y,q.x,q.y)<.7){spinKart(o);dead=true;break}}
  if(dead){ev({k:"burst",x:q.x,y:q.y,col:"#e8c6ff",n:6});R.rp.splice(i,1)}}
 R.top=[...ps].sort((a,b)=>(a.fin?a.fin-99:0)-(b.fin?b.fin-99:0)||rProg(b)-rProg(a)).map(p=>p.i);
 if(R.st==="end"){R.endT-=dt;if(R.endT<=0||((S.mode!=="hot"||!ps.length)&&ps.every(p=>p.fin)))leaveRace()}
 else if(go&&R.clock>170&&R.winner<0){if(S.mode==="hot"){S.raceTimes=S.raceTimes||{};ps.forEach(p=>{if(S.raceTimes[p.i]===undefined)S.raceTimes[p.i]=-1})}toast("Tempo scaduto: nessun vincitore",4);R.winner=-2;R.st="end";R.endT=3}}
const fmtT=t=>{const m=Math.floor(t/60);return m+":"+(t-m*60).toFixed(1).padStart(4,"0")};
function leaveRace(){let cool=true,msg="Pulizie nel parcheggio: la porta resta chiusa per 1 minuto";
 if(S.mode==="hot"){const rt=S.raceTimes||{},pend=S.players.filter(p=>!p.away&&rt[p.i]===undefined);
  if(pend.length){cool=false;S.turnT=0;msg="Fine corsa: tocca al prossimo giocatore"}
  else{const res=S.players.filter(p=>rt[p.i]>0).sort((a,b)=>rt[a.i]-rt[b.i]);S.raceTimes=null;
   if(res.length){const w=res[0],G=GR(w);G.coins+=25;w.score=(w.score|0)+1500;msg=`🏆 Miglior tempo: ${w.name} (${fmtT(rt[w.i])}) +25 monete · `+msg;ev({k:"sfx",s:"free"})}else msg="Nessun tempo valido · "+msg}}
 if(cool)S.raceCool=RCOOL;S.race=null;S.players.forEach(p=>{p.watch=false;p.spin=0;p.boost=0;p.shield=0});toast(msg,5);enterArea(0)}

/* ---------- puzzle del parcheggio (dopo il Cuoco) ---------- */
const PN=6,PCS=1.5,PSCR=5,PW=11,PH=12,PGX=.5,PGY=2.3,PCOL=["#4fb8ff","#ffd23c","#2fcf98","#c9a5ff","#ff9a2e","#eceff4","#2b3a5c","#ff8fb8","#8fd14f","#b08a58","#5fd8d8","#9aa0ff"];
function pzSolve(cars,cap){const n=cars.length,P0=cars.map(c=>c.ho?c.x:c.y),rd=cars.findIndex(c=>c.red);let key=p=>{let k=0;for(let i=0;i<n;i++)k=k*6+p[i];return k};
 const seen=new Set([key(P0)]);let cur=[P0],d=0;
 while(cur.length){const nx=[];
  for(const P of cur){if(P[rd]===PN-cars[rd].len)return d+1;
   const g=new Int8Array(PN*PN).fill(-1);for(let i=0;i<n;i++){const c=cars[i];for(let k=0;k<c.len;k++)g[c.ho?c.y*PN+P[i]+k:(P[i]+k)*PN+c.x]=i}
   for(let i=0;i<n;i++){const c=cars[i],st=c.ho?1:PN,base=c.ho?c.y*PN+P[i]:P[i]*PN+c.x;
    for(const dir of[-1,1]){for(let s=1;s<PN;s++){const np=P[i]+dir*s;if(np<0||np+c.len>PN)break;const cell=dir>0?base+(c.len-1+s)*st:base-s*st;if(g[cell]!==-1)break;
     const Q=P.slice();Q[i]=np;const kk=key(Q);if(!seen.has(kk)){seen.add(kk);if(seen.size>cap)return-1;nx.push(Q)}}}}}
  cur=nx;d++}
 return-1}
function pzGraph(cars,cap){ // tutti gli stati raggiungibili + distanza dall'uscita (in scivolate)
 const n=cars.length,rd=cars.findIndex(c=>c.red),key=p=>{let k=0;for(let i=0;i<n;i++)k=k*6+p[i];return k},P0=Uint8Array.from(cars.map(c=>c.ho?c.x:c.y));
 const idx=new Map([[key(P0),0]]),st=[P0],adj=[];
 const nb=P=>{const out=[],g=new Int8Array(PN*PN).fill(-1);for(let i=0;i<n;i++){const c=cars[i];for(let k=0;k<c.len;k++)g[c.ho?c.y*PN+P[i]+k:(P[i]+k)*PN+c.x]=i}
  for(let i=0;i<n;i++){const c=cars[i],s=c.ho?1:PN,base=c.ho?c.y*PN+P[i]:P[i]*PN+c.x;
   for(const dir of[-1,1])for(let k=1;k<PN;k++){const np=P[i]+dir*k;if(np<0||np+c.len>PN)break;const cell=dir>0?base+(c.len-1+k)*s:base-k*s;if(g[cell]!==-1)break;const Q=P.slice();Q[i]=np;out.push(Q)}}return out};
 for(let h=0;h<st.length;h++){const L=[];for(const Q of nb(st[h])){const k=key(Q);let j=idx.get(k);if(j===undefined){if(st.length>=cap)return null;j=st.length;idx.set(k,j);st.push(Q)}L.push(j)}adj.push(L)}
 const dist=new Int16Array(st.length).fill(-1),q=[];st.forEach((P,i)=>{if(P[rd]===PN-cars[rd].len){dist[i]=0;q.push(i)}});
 for(let h=0;h<q.length;h++)for(const j of adj[q[h]])if(dist[j]<0){dist[j]=dist[q[h]]+1;q.push(j)}
 return{st,dist}}
function pzGen(target){let best=null,bs=-1;
 for(let tr=0;tr<14;tr++){const cars=[{x:ri(0,1),y:2,len:2,ho:true,red:true}],occ=Array.from({length:PN},()=>Array(PN).fill(0));occ[2][cars[0].x]=occ[2][cars[0].x+1]=1;
  const want=ri(10,13);
  for(let a=0;a<120&&cars.length<want;a++){const ho=Math.random()<.5,len=Math.random()<.3?3:2,x=ri(0,ho?PN-len:PN-1),y=ri(0,ho?PN-1:PN-len);if(ho&&y===2)continue;
   let ok=true;for(let k=0;k<len;k++)if(occ[y+(ho?0:k)][x+(ho?k:0)])ok=false;if(!ok)continue;
   for(let k=0;k<len;k++)occ[y+(ho?0:k)][x+(ho?k:0)]=1;cars.push({x,y,len,ho})}
  const G=pzGraph(cars,45000);if(!G)continue;let mx=0;for(const v of G.dist)if(v>mx)mx=v;if(mx<2)continue;
  const goal=Math.min(target,mx),cand=[];G.dist.forEach((v,i)=>{if(v===goal)cand.push(i)});if(!cand.length)continue;
  const sc=goal;if(sc>bs){bs=sc;const P=G.st[cand[ri(0,cand.length-1)]];best={cars:cars.map((c,i)=>({...c,x:c.ho?P[i]:c.x,y:c.ho?c.y:P[i]})),d:goal+1}}
  if(goal>=target)break}
 if(!best){const cars=[{x:0,y:2,len:2,ho:true,red:true},{x:3,y:1,len:2,ho:false},{x:4,y:3,len:3,ho:false}];best={cars,d:3}}
 return best}
function pzNew(k){const g=pzGen([8,11,14,17,21][k]),cs=g.cars,perm=[...PCOL].sort(()=>Math.random()-.5);let ci=0;
 cs.forEach(c=>{c.col=c.red?"#e63946":perm[ci++%perm.length];c.px=c.x;c.py=c.y});
 S.pz={scr:k,cars:cs,init:cs.map(c=>({x:c.x,y:c.y})),moves:0,best:g.d,out:0,t:0}}
function loadPuzzle(){loadRace();S.race=null;S.lvl=8;S.W=PW;S.H=PH;S.G=Array.from({length:PH},()=>Array(PW).fill("."));S.spawn=[5.5,6.2];S.gv++;S.mission.kind="puzzle";S.mission.need=PSCR;pzNew(0)}
function startPuzzle(){S.players.forEach(p=>{p.watch=false;p.sel=S.pz.cars.findIndex(c=>c.red);p.x=5.5;p.y=6.2;p.mc=0;p.aP=0;p.abP=0});toast("Puzzle del parcheggio: scegli un'auto, poi spostala con la levetta. Libera la macchina rossa fino all'uscita! 5 posti per arrivare alla strada.",6)}
function pzCanMove(Z,i,dir){const c=Z.cars[i],g=Array.from({length:PN},()=>Array(PN).fill(-1));Z.cars.forEach((o,j)=>{if(j===i)return;for(let k=0;k<o.len;k++)g[o.y+(o.ho?0:k)][o.x+(o.ho?k:0)]=j});
 if(c.ho){const nx=dir>0?c.x+c.len:c.x-1;if(nx<0)return false;if(nx>=PN)return !!c.red&&dir>0;return g[c.y][nx]===-1}
 const ny=dir>0?c.y+c.len:c.y-1;if(ny<0||ny>=PN)return false;return g[ny][c.x]===-1}
function puzzleTick(dt){const Z=S.pz;if(!Z)return;Z.t+=dt;
 for(const c of Z.cars){c.px+=(c.x-c.px)*Math.min(1,dt*16);c.py+=(c.y-c.py)*Math.min(1,dt*16)}
 if(Z.out>0){Z.out-=dt;const r=Z.cars.find(c=>c.red);r.px+=dt*9;if(Z.out<=0)pzAdvance();return}
 S.players.forEach((p,i)=>{if(p.hidden||p.away)return;const inp=inputFor(i);p.mc=Math.max(0,(p.mc||0)-dt);
  if(inp.ab&&!p.abP){p.abP=1;leavePuzzle(p.name+" ha lasciato il parcheggio");return}if(!inp.ab)p.abP=0;
  if(inp.atk&&!p.aP){p.aP=1;const n=Z.cars.length;
   if(inp.wsel===2){Z.cars.forEach((c,j)=>{c.x=Z.init[j].x;c.y=Z.init[j].y});Z.moves=0;toast("Schermata ricominciata",1.5)}
   else{p.sel=((p.sel|0)+(inp.wsel===1?n-1:1))%n;ev({k:"sfx",s:"pick",x:5,y:5})}}
  else if(!inp.atk)p.aP=0;
  if(Z.out>0||p.mc>0)return;const c=Z.cars[p.sel|0];if(!c)return;const v=c.ho?inp.mx:inp.my;if(Math.abs(v)<.5)return;const dir=v>0?1:-1;
  if(pzCanMove(Z,p.sel|0,dir)){p.mc=.2;Z.last=p.i;
   if(c.red&&c.ho&&dir>0&&c.x+c.len>=PN){Z.out=.9;Z.moves++;ev({k:"sfx",s:"deliver"});return}
   if(c.ho)c.x+=dir;else c.y+=dir;Z.moves++;ev({k:"sfx",s:"bump",x:5,y:5})}
  else{p.mc=.25}})}
function pzAdvance(){const Z=S.pz,p=S.players.find(q=>q.i===Z.last)||S.players.find(q=>!q.hidden&&!q.away)||S.players[0],G=GR(p),k=Z.scr;
 const bonus=Math.max(2,8-Math.max(0,Z.moves-Z.best));G.coins+=bonus;p.score=(p.score|0)+200;
 if(k+1>=PSCR){G.coins+=20;p.score=(p.score|0)+1000;ev({k:"sfx",s:"free"});S.puzzleDone=(S.puzzleDone|0)+1;leavePuzzle("🚦 Strada libera! Hai fatto uscire il carrello dal parcheggio: +"+(bonus+20)+" monete");return}
 float(p.x,p.y-1,"+"+bonus,"#ffd23c");toast(`Posto ${k+1}/${PSCR} liberato! +${bonus} monete · ${k+2}° posto`,3);ev({k:"sfx",s:"mission"});pzNew(k+1);S.players.forEach(q=>{q.mc=0;q.sel=S.pz.cars.findIndex(c=>c.red)})}
function leavePuzzle(msg){S.raceCool=RCOOL;S.pz=null;toast(msg+" · pulizie: porta chiusa 1 minuto",5);enterArea(0)}
