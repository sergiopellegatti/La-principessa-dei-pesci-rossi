/* ===== r3.js — prova grafica 3D (Three.js), solo la hall per ora ===== */
const R3={view:(()=>{try{return localStorage.getItem("ppr-3dview")||"top"}catch(_){return"top"}})(),on:(()=>{try{return localStorage.getItem("ppr-3d")!=="0"}catch(_){return true}})(),ok:false,fail:false,objs:new Map(),sk:"",mats:{},tex:{}};
const r3m=(c,o)=>{const k=c+(o?JSON.stringify(o):"");return R3.mats[k]||(R3.mats[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.65,metalness:0},o||{})))};
function r3Init(){if(R3.ok)return true;if(R3.fail||typeof THREE==="undefined")return false;
 try{const c3=document.createElement("canvas");c3.id="game3";c3.style.cssText="display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none;visibility:hidden";cv.parentNode.insertBefore(c3,cv.nextSibling);
  const rd=new THREE.WebGLRenderer({canvas:c3,antialias:true,powerPreference:"high-performance"});rd.setPixelRatio(Math.min(2,window.devicePixelRatio||1));rd.shadowMap.enabled=true;rd.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene();sc.background=new THREE.Color("#2b2540");
  const cam=new THREE.PerspectiveCamera(36,1,1,160);
  sc.add(new THREE.HemisphereLight(0xfff3df,0x8f84ad,1.05));
  const sun=new THREE.DirectionalLight(0xffffff,1.25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sh=sun.shadow.camera;sh.left=-15;sh.right=15;sh.top=15;sh.bottom=-15;sh.near=1;sh.far=60;sun.shadow.bias=-.0006;sun.shadow.normalBias=.04;sc.add(sun);sc.add(sun.target);
  Object.assign(R3,{c3,rd,sc,cam,sun,ok:true,tx:0,tz:0,w:0,h:0});return true}catch(e){R3.fail=true;console.warn("3D non disponibile",e);return false}}
function r3Size(){const w=cv.clientWidth||400,h=cv.clientHeight||700;if(R3.w===w&&R3.h===h)return;R3.w=w;R3.h=h;R3.rd.setSize(w,h,false);R3.cam.aspect=w/h;R3.cam.updateProjectionMatrix()}
/* ---- testo e cartelli ---- */
function r3Text(txt,o){o=o||{};const k=txt+"|"+(o.bg||"")+(o.fg||"")+(o.w||0);if(R3.tex[k])return R3.tex[k];const W=o.w||256,H=o.h||64,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
 if(o.bg){g.fillStyle=o.bg;g.beginPath();g.roundRect(2,2,W-4,H-4,H*.28);g.fill();g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=3;g.stroke()}
 g.font=`700 ${o.fs||Math.round(H*.5)}px Fredoka,system-ui,sans-serif`;g.textAlign="center";g.textBaseline="middle";if(!o.bg){g.lineWidth=6;g.strokeStyle="rgba(20,10,40,.85)";g.strokeText(txt,W/2,H/2+2)}g.fillStyle=o.fg||"#fff";g.fillText(txt,W/2,H/2+2);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return R3.tex[k]=t}
function r3Sign(txt,col,wTiles){const t=r3Text(txt,{bg:col,fg:"#1b1530",w:512,h:128,fs:54}),m=new THREE.Mesh(new THREE.PlaneGeometry(wTiles,wTiles/4),new THREE.MeshBasicMaterial({map:t,transparent:true}));return m}
/* ---- personaggi cartoon procedurali ---- */
function makeChar(o){const g=new THREE.Group(),root=new THREE.Group();g.add(root);const sk=r3m(o.skin||"#f2c29b"),sh=r3m(o.shirt||"#5ab8ff"),pa=r3m(o.pants||"#3b3f6b"),ha=r3m(o.hair||"#2a1d16",{roughness:.8}),S3=(o.scale||1)*1.15;
 const add=(geo,m,x,y,z,p,sx,sy,sz)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);if(sx)me.scale.set(sx,sy,sz);me.castShadow=true;(p||root).add(me);return me};
 const mkLeg=s=>{const L=new THREE.Group();L.position.set(s*.09,.3,0);root.add(L);add(new THREE.CapsuleGeometry(.08,.14,4,8),pa,0,-.14,0,L);add(new THREE.BoxGeometry(.13,.07,.2),r3m(o.shoes||"#23242b"),0,-.28,.03,L);return L};
 const mkArm=s=>{const A=new THREE.Group();A.position.set(s*.21,.64,0);A.rotation.z=s*.12;root.add(A);add(new THREE.CapsuleGeometry(.062,.17,4,8),sh,0,-.12,0,A);add(new THREE.SphereGeometry(.064,10,8),sk,0,-.27,0,A);return A};
 const lL=mkLeg(-1),lR=mkLeg(1),aL=mkArm(-1),aR=mkArm(1);
 add(new THREE.CapsuleGeometry(.17,.13,6,12),sh,0,.5,0,null,o.wide||1,1,.92);
 if(o.stripe)add(new THREE.BoxGeometry(.2,.04,.02),r3m(o.stripe),0,.56,.16);
 const head=add(new THREE.SphereGeometry(.225,20,16),sk,0,.93,0);
 for(const s of[-1,1]){add(new THREE.SphereGeometry(.036,8,8),r3m("#1b1b22"),s*.083,.95,.205,null);add(new THREE.SphereGeometry(.012,6,6),r3m("#ffffff"),s*.083+.012,.965,.236,null)}
 add(new THREE.BoxGeometry(.07,.016,.02),r3m("#8a3b2e"),0,.86,.215);
 const hs=o.hairStyle||"short";
 if(hs!=="none"&&hs!=="cap"&&hs!=="police"){const cap=add(new THREE.SphereGeometry(.24,20,14,0,PI*2,0,PI*.58),ha,0,.94,-.025);cap.rotation.x=-.28;
  if(hs==="long"||hs==="braids"){add(new THREE.CapsuleGeometry(.14,.26,4,10),ha,0,.78,-.16)}
  if(hs==="braids"){for(const s of[-1,1])add(new THREE.CapsuleGeometry(.04,.3,4,8),ha,s*.19,.7,.02)}
  if(hs==="pony"){add(new THREE.SphereGeometry(.09,10,8),ha,.0,.95,-.24);add(new THREE.CapsuleGeometry(.05,.2,4,8),ha,.0,.8,-.28)}
  if(hs==="bun")add(new THREE.SphereGeometry(.1,10,8),ha,0,1.16,-.06);
  if(hs==="spiky"){for(let i=0;i<5;i++)add(new THREE.ConeGeometry(.05,.14,6),ha,(i-2)*.09,1.15,-.02)}}
 if(hs==="cap"||hs==="police"){const col=hs==="police"?"#1f2d55":(o.cap||"#e63946");const hm=r3m(col);const cp=add(new THREE.SphereGeometry(.245,20,14,0,PI*2,0,PI*.52),hm,0,.95,-.01);cp.rotation.x=-.12;add(new THREE.BoxGeometry(.3,.025,.16),hm,0,.97,.24);
  if(hs==="police")add(new THREE.SphereGeometry(.04,8,6),r3m("#ffc93c"),0,1.08,.2)}
 if(o.glasses)for(const s of[-1,1]){const r=add(new THREE.TorusGeometry(.05,.01,6,12),r3m("#333"),s*.083,.95,.225);}
 if(o.beard)add(new THREE.SphereGeometry(.2,14,10,0,PI*2,PI*.55,PI*.45),r3m(o.hair||"#5b3a1f"),0,.92,.04);
 if(o.bag)add(new THREE.BoxGeometry(.1,.16,.18),r3m(o.bag),.25,.38,0);
 if(o.cane){const c=add(new THREE.CylinderGeometry(.015,.015,.62,6),r3m("#8a5a2b"),-.28,.3,.05)}
 if(o.baton){const b=aR.add(new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.4,6),r3m("#1a1a1a")));const m=aR.children[aR.children.length-1];m.position.set(0,-.28,.14);m.rotation.x=1.2}
 root.scale.setScalar(S3);g.userData={root,lL,lR,aL,aR,head,walk:0,amp:0,ry:0,S3};return g}
function animChar(g,walk,moving,dt,t,lying){const u=g.userData;u.amp+=((moving?1:0)-u.amp)*Math.min(1,dt*10);const s=Math.sin(walk)*.85*u.amp;u.lL.rotation.x=s;u.lR.rotation.x=-s;u.aL.rotation.x=-s*.9;u.aR.rotation.x=s*.9;
 u.root.position.y=Math.abs(Math.sin(walk))*.045*u.amp+(moving?0:Math.sin(t/420)*.008);u.head.rotation.z=Math.sin(walk*.5)*.05*u.amp;
 u.root.rotation.x+=((lying?-1.45:0)-u.root.rotation.x)*Math.min(1,dt*12);if(lying)u.root.position.y=.1}
const angLerp=(a,b,k)=>{let d=b-a;while(d>PI)d-=PI*2;while(d<-PI)d+=PI*2;return a+d*k};
function faceChar(g,dx,dz,dt){if(Math.abs(dx)+Math.abs(dz)<.01)return;const u=g.userData;u.ry=angLerp(u.ry,Math.atan2(dx,dz),Math.min(1,dt*14));g.rotation.y=u.ry}
const HC3=[{shirt:"#262b36",pants:"#3a4152",hair:"#2a1d16",skin:"#f2c29b",hairStyle:"short",stripe:"#6ff05a",shoes:"#14151a"},{shirt:"#ffb703",pants:"#3b3f6b",hair:"#9b5cff",skin:"#f6cfae",hairStyle:"pony",shoes:"#ff6fae"},{shirt:"#e9758a",pants:"#4a5d8a",hair:"#e8d27a",skin:"#f6cfae",hairStyle:"braids",shoes:"#f4f1e4"},{shirt:"#3c78c8",pants:"#5a4636",hair:"#4a2f1b",skin:"#e8b48f",hairStyle:"short",beard:true,wide:1.22,scale:1.1,shoes:"#3a2a1a"}];
const ENC3={g:{shirt:"#34508f",pants:"#1f2d55",hair:"#1f2d55",skin:"#f6cda9",hairStyle:"police",baton:true},v:{shirt:"#9a6bc9",pants:"#6b6b7a",hair:"#d9d9e2",skin:"#f8dcc6",hairStyle:"bun",glasses:true,cane:true,shoes:"#4a2f22"},kid:{shirt:"#e63946",pants:"#24476b",hair:"#6b3f1f",skin:"#ffe0c2",hairStyle:"cap",cap:"#e63946",scale:.6}};
/* ---- carrello ---- */
function makeCart(sc){const g=new THREE.Group(),L=.74,W=.5,H=.36,Y=.16;const bx=new THREE.BoxGeometry(L,H,W);
 const body=new THREE.Mesh(bx,new THREE.MeshStandardMaterial({color:"#d5deeb",transparent:true,opacity:.3,roughness:.4,depthWrite:false}));body.position.y=Y+H/2;g.add(body);
 const ed=new THREE.LineSegments(new THREE.EdgesGeometry(bx),new THREE.LineBasicMaterial({color:"#8d98ab"}));ed.position.y=Y+H/2;g.add(ed);
 const grid=new THREE.Group();for(let i=-3;i<=3;i++){const r=new THREE.Mesh(new THREE.BoxGeometry(.01,H,.01),r3m("#9aa6ba"));r.position.set(i*L/7,Y+H/2,W/2);grid.add(r);const r2=r.clone();r2.position.z=-W/2;grid.add(r2)}g.add(grid);
 const rim=new THREE.Mesh(new THREE.BoxGeometry(L+.04,.035,W+.04),r3m("#e63946"));rim.position.y=Y+H;g.add(rim);
 for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.34,6),r3m("#e63946"));h.position.set(-L/2-.04,Y+H+.1,s*W*.4);h.rotation.z=.4;g.add(h)}
 const hb=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,W*.85,6),r3m("#e63946"));hb.rotation.x=PI/2;hb.position.set(-L/2-.1,Y+H+.25,0);g.add(hb);
 for(const sx of[-1,1])for(const sz of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.04,10),r3m("#22232b"));w.rotation.x=PI/2;w.position.set(sx*L*.36,.07,sz*W*.42);w.castShadow=true;g.add(w)}
 g.traverse(o=>{if(o.isMesh&&o.material&&!o.material.transparent)o.castShadow=true});g.scale.setScalar(sc||1);return g}
/* ---- scena statica della hall ---- */
function r3Build(){const sc=R3.sc;if(R3.root){sc.remove(R3.root)}const root=R3.root=new THREE.Group();sc.add(root);const W=S.W,H=S.H,L=LV[0];
 const boxes=[],glass=[];const B=(x,y,z,w,h,d,col,arr)=>(arr||boxes).push([x,y,z,w,h,d,col]);
 // pavimento
 const T=64,fc=document.createElement("canvas");fc.width=W*T;fc.height=H*T;const f=fc.getContext("2d");
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){f.fillStyle=(x+y)%2?L.floor[0]:L.floor[1];f.fillRect(x*T,y*T,T,T);const g=f.createLinearGradient(x*T,y*T,x*T+T,y*T+T);g.addColorStop(0,"rgba(255,255,255,.28)");g.addColorStop(1,"rgba(0,0,0,.04)");f.fillStyle=g;f.fillRect(x*T,y*T,T,T);f.strokeStyle="rgba(120,110,95,.18)";f.lineWidth=2;f.strokeRect(x*T+1,y*T+1,T-2,T-2)}
 for(const d of S.hallDoors){f.fillStyle="rgba(60,50,80,.32)";f.fillRect(Math.floor(d.x)*T+6,Math.floor(d.y)*T+6,T-12,T-12)}
 if(S.shelter){const s=S.shelter;f.fillStyle="#c9d1de";f.fillRect(s.x0*T,s.y0*T,(s.x1-s.x0)*T,(s.y1-s.y0)*T);f.fillStyle="#9aa5b8";f.fillRect(s.x0*T,s.y1*T-8,(s.x1-s.x0)*T,8)}
 const ft=new THREE.CanvasTexture(fc);ft.colorSpace=THREE.SRGBColorSpace;ft.anisotropy=8;
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshStandardMaterial({map:ft,roughness:.35,metalness:.05}));fl.rotation.x=-PI/2;fl.position.set(W/2,0,H/2);fl.receiveShadow=true;root.add(fl);
 const out=new THREE.Mesh(new THREE.PlaneGeometry(W+60,H+60),new THREE.MeshStandardMaterial({color:"#2b2540",roughness:1}));out.rotation.x=-PI/2;out.position.set(W/2,-.02,H/2);out.receiveShadow=true;root.add(out);
 const accOf=(x,y)=>{const top=y<H/2,d=S.hallDoors.filter(d=>d.to!==7&&d.to!==8&&(d.y<H/2)===top).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];return d?LV[d.to].acc:"#aaaaaa"};
 const shade=(hex,k)=>{const c=new THREE.Color(hex);c.multiplyScalar(k);return"#"+c.getHexString()};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=S.G[y][x],cx=x+.5,cz=y+.5;
  if(ch==="#"){const h=y===0?1.9:y===H-1?1.1:1.5;B(cx,h/2,cz,1,h,1,L.wall);B(cx,h+.02,cz,1,.05,1,L.top)}
  else if(ch==="V"){const acc=accOf(x,y),top=y<H/2,h=top?1.7:.95;B(cx,h/2,cz,1,h,1,shade(acc,.45));
   if(top){B(cx,.78,cz+.46,.82,.62,.1,"#bfe6f2",glass);B(cx,1.26,cz+.52,1,.14,.22,acc);B(cx,.34,cz+.5,.9,.36,.06,shade(acc,.8))}
   else{B(cx,h+.03,cz,.9,.06,.9,acc);B(cx-.22,h+.07,cz,.24,.04,.5,"#bfe6f2");B(cx+.22,h+.07,cz,.24,.04,.5,"#bfe6f2")}}
  else if(ch==="h"){B(cx,.2,cz,.9,.06,.4,"#8a5a2b");B(cx,.42,cz-.17,.9,.3,.06,"#8a5a2b");B(cx-.36,.1,cz,.07,.2,.36,"#4a4f5c");B(cx+.36,.1,cz,.07,.2,.36,"#4a4f5c")}
  else if(ch==="W"){}
  else if("QUYZXHNE".includes(ch)&&S.G[y][x]!=="."){const top=y<H/2,side=x===W-1||x===0,d=S.hallDoors.find(d=>Math.floor(d.x)===x&&Math.floor(d.y)===y);
   const acc=d?LV[d.to].acc:"#ffc93c";B(cx,.03,cz,.92,.06,.92,acc)}}
 // posti-porta (portali luminosi con cartello) e cartelli
 for(const d of S.hallDoors){const top=d.y<H/2,x=Math.floor(d.x)+.5,z=Math.floor(d.y)+.5,side=d.x>W-1;const acc=LV[d.to].acc;const nm=d.to===7?"Parcheggio":LV[d.to].name.split(" — ")[0];
  const sg=r3Sign(nm.length>18?nm.slice(0,17)+"…":nm,acc,2.3);
  if(side){sg.position.set(x-.9,1.9,z);sg.rotation.set(-.8,-PI/2*0,0);sg.rotation.y=-PI/2;sg.rotation.x=0;sg.rotation.order="YXZ";sg.rotation.x=-.9;sg.position.set(x-.6,1.7,z)}
  else if(top){sg.position.set(x,1.78,z+.62);sg.rotation.x=-.28}
  else{sg.position.set(x,1.5,z-.7);sg.rotation.x=-.9}
  root.add(sg);
  const post=(px,pz)=>B(px,.55,pz,.1,1.1,.1,shade(acc,.8));if(!side){post(x-.42,z+(top?.2:-.1));post(x+.42,z+(top?.2:-.1));B(x,1.12,z+(top?.2:-.1),.94,.1,.12,acc)}}
 // istanziati
 const mk=(arr,mat)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat,arr.length),m4=new THREE.Matrix4(),col=new THREE.Color();arr.forEach((b,i)=>{m4.compose(new THREE.Vector3(b[0],b[1],b[2]),new THREE.Quaternion(),new THREE.Vector3(b[3],b[4],b[5]));im.setMatrixAt(i,m4);col.set(b[6]);im.setColorAt(i,col)});im.castShadow=true;im.receiveShadow=true;root.add(im)};
 mk(boxes,new THREE.MeshStandardMaterial({roughness:.7}));mk(glass,new THREE.MeshStandardMaterial({roughness:.1,metalness:.3,transparent:true,opacity:.75,emissive:"#9fd8ff",emissiveIntensity:.35}));
 // piante
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(S.G[y][x]==="P"){const cx=x+.5,cz=y+.5;const pot=new THREE.Mesh(new THREE.CylinderGeometry(.22,.16,.32,12),r3m("#c96b3a"));pot.position.set(cx,.16,cz);pot.castShadow=true;root.add(pot);
  for(const[ox,oy,oz,r]of[[0,.55,0,.3],[.14,.78,.06,.22],[-.12,.72,-.08,.2]]){const l=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),r3m("#2f9a55"));l.position.set(cx+ox,oy,cz+oz);l.castShadow=true;root.add(l)}}
 // fontana
 if(S.fount){const[x0,y0,x1,y1]=S.fount,cx=(x0+x1)/2,cz=(y0+y1)/2,w=x1-x0,d=y1-y0;const rim=new THREE.Mesh(new THREE.BoxGeometry(w,.4,d),r3m("#c8cfdc"));rim.position.set(cx,.2,cz);rim.castShadow=rim.receiveShadow=true;root.add(rim);
  const wt=new THREE.Mesh(new THREE.BoxGeometry(w-.5,.1,d-.5),new THREE.MeshStandardMaterial({color:"#4fc3f7",roughness:.1,metalness:.2,transparent:true,opacity:.88,emissive:"#2a8fd0",emissiveIntensity:.35}));wt.position.set(cx,.4,cz);root.add(wt);R3.water=wt;
  const ped=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,.9,12),r3m("#d9dfe8"));ped.position.set(cx,.75,cz);ped.castShadow=true;root.add(ped);
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.55,.2,.18,16),r3m("#e4e9f0"));bowl.position.set(cx,1.25,cz);bowl.castShadow=true;root.add(bowl);
  R3.jets=[];for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:"#bfefff"}));s.userData={a:i/14*PI*2,ph:i/14};root.add(s);R3.jets.push(s)};R3.fc=[cx,cz]}
 // pensilina carrelli
 if(S.shelter){const s=S.shelter,cx=(s.x0+s.x1)/2,w=s.x1-s.x0;R3.shel={x0:s.x0,x1:s.x1,y0:s.y0,y1:s.y1};
  const roof=new THREE.Mesh(new THREE.BoxGeometry(w+.2,.06,(s.y1-s.y0)+.1),new THREE.MeshStandardMaterial({color:"#8fd0f0",transparent:true,opacity:.3,roughness:.2,depthWrite:false}));roof.position.set(cx,1.25,(s.y0+s.y1)/2);roof.castShadow=false;root.add(roof);
  for(const px of[s.x0+.05,s.x1-.05])for(const pz of[s.y0+.05,s.y1-.05]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.25,6),r3m("#8a93a6"));p.position.set(px,.62,pz);p.castShadow=true;root.add(p)}}
 R3.sk=S.lvl+":"+S.gv;R3.cartKey=-1}
/* ---- frame ---- */
function r3Frame(t,dt){
 if(!R3.on||!S||S.lvl!==0||S.phase==="menu"){if(R3.ok){R3.c3.style.visibility="hidden"}cv.style.opacity="";return false}
 if(!r3Init()){cv.style.opacity="";return false}
 r3Size();if(R3.sk!==S.lvl+":"+S.gv){r3Build();for(const[,o]of R3.objs)R3.sc.remove(o.g);R3.objs.clear()}
 const sc=R3.sc,k=Math.min(1,dt*(role==="guest"?14:22)),alive=new Set();
 if(R3.view!=="fps")R3.yaw=null;const get=(id,mkf)=>{let o=R3.objs.get(id);if(!o){o=mkf();o.px=null;sc.add(o.g);R3.objs.set(id,o)}alive.add(id);return o};
 const place=(o,x,z,y)=>{if(o.px==null||Math.hypot(o.px-x,o.pz-z)>3){o.px=x;o.pz=z}else{o.px+=(x-o.px)*k;o.pz+=(z-o.pz)*k}const dx=o.px-(o.lx??o.px),dz=o.pz-(o.lz??o.pz);o.sp=Math.hypot(dx,dz)/Math.max(dt,.001);o.dx=dx;o.dz=dz;o.lx=o.px;o.lz=o.pz;o.g.position.set(o.px,y||0,o.pz)};
 const stepChar=(o,moving,vx,vz)=>{o.walk=(o.walk||0)+dt*(moving?10:0);faceChar(o.g,vx,vz,dt);animChar(o.g,o.walk,moving,dt,t,false)};
 const me=meP();
 // giocatori
 for(const p of S.players){if(p.hidden||p.away)continue;const o=get("p"+p.id,()=>{const L=Object.assign({},HC3[p.hero]||HC3[0]);const g=makeChar(L);const ring=new THREE.Mesh(new THREE.RingGeometry(.42,.5,24),new THREE.MeshBasicMaterial({color:p.hero===1?"#ffd23c":"#4fe3b5",transparent:true,opacity:.8,side:THREE.DoubleSide}));ring.rotation.x=-PI/2;ring.position.y=.02;g.add(ring);g.userData.ring=ring;g.userData.ring.visible=false;return{g}});
  place(o,p.x,p.y);const mv=o.sp>.35;o.walk=(o.walk||0)+dt*(mv?10:0);o.g.userData.ring.visible=!!me&&me.i===p.i;
  const fx=Math.abs(p.fx)+Math.abs(p.fy)>.05?p.fx:o.dx,fz=Math.abs(p.fx)+Math.abs(p.fy)>.05?p.fy:o.dz;faceChar(o.g,fx,fz,dt);animChar(o.g,o.walk,mv,dt,t,!!p.down);
  {const sw=FX.sw[p.id],age=sw?(performance.now()-sw.b)/1000:9;
  if(!o.tw){o.tw=new THREE.Mesh(new THREE.RingGeometry(.45,1.55,28,1,0,2.4),new THREE.MeshBasicMaterial({color:"#dff4ff",transparent:true,side:THREE.DoubleSide,depthWrite:false}));o.tw.rotation.x=-PI/2;o.tw.position.y=.55;o.g.parent?0:0;sc.add(o.tw)}
  if(age<.28){const q=age/.28;o.tw.visible=true;o.tw.position.set(o.px,.55,o.pz);o.tw.rotation.z=Math.atan2(-sw.ay,sw.ax)-1.2+(q-.5)*1.4;o.tw.scale.setScalar(.7+q*.45);o.tw.material.opacity=.85*(1-q);o.tw.material.color.set(sw.wet?"#7fd3ff":"#ffffff");const u=o.g.userData;u.aR.rotation.x=-2.2+q*1.6;u.aL.rotation.x=-1.2}else o.tw.visible=false}
  o.g.visible=!(p.inv>0&&Math.floor(t/90)%2&&!p.down);if(R3.view==="fps"&&me&&me.i===p.i)o.g.visible=false;
  if(S.mode!=="solo"){if(!o.tag){o.tag=new THREE.Sprite(new THREE.SpriteMaterial({map:r3Text(p.name,{w:256,h:64,fs:30}),transparent:true,depthTest:false}));o.tag.scale.set(1.6,.4,1);o.tag.position.set(0,1.7,0);o.g.add(o.tag)}}}
 // persone
 for(const q of S.people||[]){const o=get("q"+q.id,()=>{const old=q.old;return{g:makeChar({shirt:q.shirt,pants:q.pants,hair:old?"#d0d0d8":q.hair,skin:q.skin,hairStyle:q.cap?"cap":old?"bun":q.long?"long":"short",cap:q.cap,bag:q.bag,glasses:old,cane:old,scale:old?.92:1})}});
  place(o,q.x,q.y);const mv=o.sp>.25;o.walk=(o.walk||0)+dt*(mv?9:0);faceChar(o.g,o.dx,o.dz,dt);animChar(o.g,o.walk,mv,dt,t,false)}
 // nemici
 for(const e of S.enemies){if(e.dead)continue;const o=get("e"+e.id,()=>{if(e.t==="b"){const g=new THREE.Group(),c=makeCart(1.15),kid=makeChar(ENC3.kid);kid.position.set(0,.14,0);g.add(c,kid);g.userData={kid};return{g,cart:true}}return{g:makeChar(ENC3[e.t]||ENC3.g)}});
  place(o,e.x,e.y);const mv=o.sp>.25;
  if(o.cart){const a=Math.atan2(o.dx,o.dz);if(mv){o.g.rotation.y=angLerp(o.g.rotation.y,a-PI/2+PI/2*0,Math.min(1,dt*10))}o.g.rotation.y=o.g.rotation.y;o.g.children[0].rotation.y=-PI/2;o.g.children[1].rotation.y=0}
  else{o.walk=(o.walk||0)+dt*(mv?9:0);faceChar(o.g,o.dx,o.dz,dt);animChar(o.g,o.walk,mv,dt,t,false)}
  o.g.visible=!(e.hit>0&&Math.floor(t/60)%2)}
 // oggetti
 for(const it of S.items||[]){const o=get("i"+it.id,()=>{let g;
   if(it.k==="coin"){g=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.04,16),new THREE.MeshStandardMaterial({color:"#ffc93c",metalness:.7,roughness:.25,emissive:"#a87400",emissiveIntensity:.3}));g.rotation.x=PI/2}
   else if(it.k==="cart"){g=makeCart(1)}
   else if(it.k==="food"){g=new THREE.Mesh(new THREE.SphereGeometry(.18,12,10),r3m("#e8731a"))}
   else if(it.k==="water"){g=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.32,10),new THREE.MeshStandardMaterial({color:"#aae1ff",transparent:true,opacity:.8}))}
   else{g=new THREE.Mesh(new THREE.OctahedronGeometry(.2),new THREE.MeshStandardMaterial({color:"#ffc93c",emissive:"#ffb703",emissiveIntensity:.6}))}
   g.castShadow=true;const w=new THREE.Group();w.add(g);return{g:w,inner:g,k:it.k}});
  place(o,it.x,it.y);const b=Math.sin(t/260+it.x*2)*.05;
  if(o.k==="coin"){const c=o.inner;c.position.y=.32+b;const sp=t/300+it.x;c.rotation.set(PI/2,0,sp)}
  else if(o.k==="cart"){}else o.inner.position.y=.3+b;o.g.rotation.y=o.k==="coin"||o.k==="cart"?0:t/900}
 // proiettili
 for(const q of S.proj||[]){const o=get("j"+q.id,()=>{const col=q.k==="soap"?"#c9a0f0":q.k==="gum"?"#ff6fae":q.k==="cart"?"#cfd8e6":"#8fd3ff";const g=q.k==="cart"?makeCart(.9):new THREE.Mesh(new THREE.SphereGeometry(q.k==="gum"?.16:.13,10,8),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.35}));return{g}});
  place(o,q.x,q.y,q.k==="cart"?.2:.45);if(q.k==="cart")o.g.rotation.y=t/90;if(q.k==="gum"&&q.h)o.g.position.y=.4+q.h}
 // mamma
 if(S.mom){const m=S.mom,d=m.dir||m.face||1;const o=get("mom",()=>({g:makeChar({shirt:m.shirt||"#e9758a",pants:"#5a4636",hair:m.hair,skin:m.skin,hairStyle:"long"}),kid:makeChar(Object.assign({},ENC3.kid,{skin:m.skin})),cart:makeCart(1.05)}));
  if(!o.init){o.init=1;o.g.add(o.kid);o.kid.position.set(.0,0,0);sc.add(o.cart);alive.add("momc");}
  const sh=S.shelter;o.cart.visible=false;o.kid.visible=false;
  if(m.st==="dash"){place(o,-50,-50);o.cart.visible=true;o.cart.position.set(m.cx,.0,m.y);o.cart.rotation.y=d>0?0:PI;o.kid.visible=true;if(!o.kid.parent||o.kid.parent!==o.cart){o.cart.add(o.kid);o.kid.position.set(0,.12,0);o.kid.rotation.y=PI/2}}
  else{if(o.kid.parent!==o.g){o.g.add(o.kid)}place(o,m.x,m.y);const mv=m.st==="go";o.walk=(o.walk||0)+dt*(mv?9:0);faceChar(o.g,d,0,dt);animChar(o.g,o.walk,mv,dt,t,false);
   if(m.st==="go"){o.kid.visible=true;o.kid.position.set(.62,0,0);o.kid.rotation.y=0}
   else if(m.st==="load"){const p=1-m.t/(m.T||2.2),cx=m.x+d*.95;o.cart.visible=true;o.cart.position.set(cx,p<.4?(1-p/.4)*0:0,m.y);o.cart.rotation.y=d>0?0:PI;o.kid.visible=true;if(p<.4){o.kid.position.set(.62,0,0)}else if(p<.72){const kk=(p-.4)/.32;o.kid.position.set(.62+(.95-.62)*kk,Math.sin(kk*PI)*.5,0)}else{o.kid.position.set(.95,.14,0)}}}}
 // carrelli nella pensilina
 if(R3.shel&&R3.cartKey!==(S.cartN|0)){R3.cartKey=S.cartN|0;if(R3.shelG)R3.root.remove(R3.shelG);const g=R3.shelG=new THREE.Group(),s=R3.shel,cap=S.cartCap|0,w=(s.x1-s.x0)/cap;for(let i=0;i<R3.cartKey;i++){const c=makeCart(1);c.position.set(s.x0+(i+.5)*w,0,s.y0+.7);c.rotation.y=PI/2;g.add(c)}R3.root.add(g)}
 for(const[id,o]of R3.objs)if(!alive.has(id)){sc.remove(o.g);if(o.tw)sc.remove(o.tw);R3.objs.delete(id)}
 // fontana
 if(R3.jets){const[fx,fz]=R3.fc;for(const j of R3.jets){const u=j.userData,ph=(t/900+u.ph)%1,r=.12+ph*.55;j.position.set(fx+Math.cos(u.a)*r,1.3+Math.sin(ph*PI)*.7,fz+Math.sin(u.a)*r)}R3.water.material.emissiveIntensity=.3+Math.sin(t/400)*.08}
 // camera
 if(R3.view==="fps"&&me){const o=R3.objs.get("p"+me.id),px=o?o.px:me.x,pz=o?o.pz:me.y;if(R3.yaw==null)R3.yaw=Math.atan2(me.fy||0,me.fx||1);if(R3.cam.fov!==72){R3.cam.fov=72;R3.cam.near=.08;R3.cam.updateProjectionMatrix()}
  const bob=o?Math.abs(Math.sin(o.walk||0))*.05*(o.g.userData.amp||0):0,yw=R3.yaw;sc.background.set("#a9b4e0");R3.cam.position.set(px-Math.cos(yw)*.05,1.2+bob,pz-Math.sin(yw)*.05);R3.cam.lookAt(px+Math.cos(yw)*3,1.12,pz+Math.sin(yw)*3);
  R3.sun.position.set(px+7,16,pz+6);R3.sun.target.position.set(px,0,pz);R3.rd.render(sc,R3.cam);R3.c3.style.visibility="visible";cv.style.opacity="0";return true}
 sc.background.set("#2b2540");if(R3.cam.fov!==36){R3.cam.fov=36;R3.cam.near=1;R3.cam.updateProjectionMatrix()}
 const tgt=me?{x:me.x,y:me.y}:{x:S.spawn[0],y:S.spawn[1]};const asp=R3.w/R3.h,fov=R3.cam.fov*PI/180,el=.92,vw=Math.min(Math.max(VWt,9),12)*.92,dist=(vw/2)/(Math.tan(fov/2)*asp);
 const visH=2*dist*Math.tan(fov/2)/Math.sin(el)*.8;let tx=S.W<=vw?S.W/2:cl(tgt.x,vw/2-.6,S.W-vw/2+.6),tz=S.H<=visH?S.H/2+.8:cl(tgt.y+1.2,visH/2-2.4,S.H-visH/2+1.6);
 R3.tx+=(tx-R3.tx)*Math.min(1,dt*8)||0;R3.tz+=(tz-R3.tz)*Math.min(1,dt*8)||0;if(!isFinite(R3.tx)||!R3.init){R3.tx=tx;R3.tz=tz;R3.init=1}
 R3.cam.position.set(R3.tx,Math.sin(el)*dist,R3.tz+Math.cos(el)*dist);R3.cam.lookAt(R3.tx,0,R3.tz);
 R3.sun.position.set(R3.tx+7,16,R3.tz+6);R3.sun.target.position.set(R3.tx,0,R3.tz);
 R3.rd.render(sc,R3.cam);R3.c3.style.visibility="visible";cv.style.opacity="0";
 VIEW.camX=R3.tx-VWt/2;VIEW.camY=R3.tz-VHt/2;return true}
let r3T=0;function r3Input(I){const n=performance.now(),dt=Math.min(.1,(n-r3T)/1000||0);r3T=n;
 if(!(R3.on&&R3.ok&&R3.view==="fps"&&S&&S.lvl===0&&S.phase==="play")){I.aim=false;return}
 if(R3.yaw==null){const m=meP();R3.yaw=m?Math.atan2(m.fy||0,m.fx||1):0}
 R3.yaw+=I.mx*2.4*dt;const f=-I.my;I.mx=Math.cos(R3.yaw)*f;I.my=Math.sin(R3.yaw)*f;I.ax=Math.cos(R3.yaw);I.ay=Math.sin(R3.yaw);I.aim=true}
