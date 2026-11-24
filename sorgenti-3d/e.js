/* ---------- interfaccia ---------- */
let pzIco=false,abT=0,abArm=0;
let CFG={mode:"solo",rule:"insieme",solo:0,sel:[0,1],teams:[0,1,0,1],cont:null},uiT=0,lastPhase=null,shopMode=null,shopSig="",OUTEV=[],dc=null,pc=null,GRID=null,lastGv=-1,netLost=false,MYI=0;
const myIdx=()=>S&&S.mode==="hot"?S.active:MYI;
const LI=()=>S&&S.mode==="coop"&&role==="host"?MYI:0;
const DEFN=["Tommy","Viola","Mamma","Papà"],HERON=["Ragazzo con la felpa","Ragazza dai capelli viola","Mamma con le trecce bionde","Papà muscoloso del fai da te"];
function names(){return[0,1,2,3].map(i=>($("n"+(i+1)).value.trim()||DEFN[i]).slice(0,14))}
const flyerHTML=n=>[1,2,3,4].map(i=>`<i class="${i<=n?"got":""}">${i<=n?"SUSHI":i}</i>`).join("");
function hide(...ids){ids.forEach(i=>$(i).hidden=true)}
const RULEN={insieme:"Insieme",sfida:"Ognuno per sé",squadre:"Foche contro Pinguini"};
function ranking(){return groupsInPlay().map(g=>({g,name:grpName(g),score:grpScore(g)})).sort((a,b)=>b.score-a.score)}
function onPhase(ph){
 hide("ovTurn","ovEnd");if(ph!=="play"){if(shopMode)closeShop();if(!$("ovStat").hidden)closeStat();if(!$("ovSave").hidden)closeSave()}
 const G=role==="guest";
 if(ph==="turn"){const n=S.players[nextTurnIdx()];$("tuT").textContent="Tempo scaduto!";$("tuP").textContent=`Passa il telefono a ${n.name}. Riparte dal punto in cui eri${S.rule==="insieme"?", con le stesse monete e lo stesso pesce":" con le sue monete e il suo pesce"}.`;$("bTurn").textContent=`Sono ${n.name}, pronto/a!`;$("ovTurn").hidden=false;sfx("stepup")}
 else if(ph==="over"){sfx("over");$("enT").textContent="Vite finite!";$("enP").textContent=`Il Cuoco del Sushi ride sotto i baffi... ma non è finita: ripartite da ${S.lvl?LV[S.lvl].name:"la hall"} con 3 vite nuove, la missione resta a dove eravate arrivati.`;
  $("bEnd").textContent=G?"In attesa…":"Riprova";$("bEnd").disabled=G;$("enH").textContent="";$("ovEnd").hidden=false}
 else if(ph==="win"){sfx("win");const mm=Math.floor(S.time/60),ss=String(Math.floor(S.time%60)).padStart(2,"0"),fr=S.players[S.freer]||meP();$("enT").textContent="Principessa liberata!";
  if(S.rule==="insieme")$("enP").textContent=`${inPlay().map(p=>p.name).join(", ")} ${inPlay().length>1?"hanno":"ha"} sconfitto il Cuoco del Sushi e salvato la principessa dei pesci rossi! Mostri sconfitti: ${S.kills} · punti: ${grpScore(0)} · tempo di gioco: ${mm}:${ss}.`;
  else{const r=ranking();$("enP").innerHTML=`${esc(fr?fr.name:"")} ha liberato la principessa (+3000)! Classifica finale:<br>`+r.map((x,i)=>`<b>${i+1}° ${esc(x.name)}</b> ${x.score} punti`).join("<br>")+`<br><b style="color:var(--gold)">Vince ${esc(r[0].name)}!</b>`}
  hsUpdate(scoreEntries());
  $("bEnd").textContent="Gioca ancora";$("bEnd").disabled=false;$("enH").textContent="I punteggi sono entrati nella classifica.";$("ovEnd").hidden=false}
}
function missionText(){const m=S.mission,p=meP(),G=myG();
 if(S.lvl===8&&S.pz){const Z=S.pz;return`Posto ${Z.scr+1}/${PSCR} · mosse ${Z.moves} (record ${Z.best}) · ◀▶ cambia auto, levetta sposta, rossa verso la strada`}
 if(S.lvl===7&&S.race){const R=S.race;if(!p||p.watch)return"Gara in corso: tocca al compagno di turno";const pos=Math.max(1,R.top.indexOf(p.i)+1);return p.fin>0?`Traguardo! ${p.fin}° posto · ${fmtT(R.clock)}`:`⏱ ${fmtT(R.clock)} · Giro ${Math.min(RLAPS,p.wr)+(p.wr>=RLAPS?0:1)}/${RLAPS} · ${pos}° posto · ? = gadget`}
 if(m.kind==="hall"&&p&&p.carts>0)return`Carrelli agganciati ${p.carts}/3 · portali alla pensilina in basso (più ne porti, più ricompense)`;
 if(m.kind==="hall"){const left=[1,2,3,4].filter(l=>!G.done[l]).map(l=>LV[l].name);if(G.frags>=4)return sushiOpen()?"Volantino completo: entrate nel Sushi Samurai!":"Volantino completo! Il Sushi apre quando tutti avranno i 4 pezzi";return`Negozi da completare: ${left.join(", ")}`}
 if(S.items.some(i=>i.k==="frag")&&!G.done[S.lvl])return"Missione compiuta: prendi il pezzo del volantino!";if(G.done[S.lvl])return"Pezzo del volantino preso · uscite dalla porta HALL";
 switch(m.kind){case"shelves":return`Riordina gli scaffali ${m.n}/${m.need}${p&&p.carry?" · portalo allo scaffale del suo colore":""}`;
 case"pizza":return`Pizze servite ${m.n}/${m.need}${p&&p.carry?" · portala a un tavolo col fumetto":""}`;
 case"pastry":return`Pasticcini ${Math.min(m.n,m.need)}/${m.need}`;
 case"ark":return`Animali dell'Arca liberati ${m.n}/${m.need} coppie${p&&p.carry&&p.carry.k==="key"?` · porta la chiave alla gabbia dei ${SP[p.carry.sp].n}`:" · colpisci i commessi travestiti per avere le chiavi"}`;
 case"fishing":{const b=p?bk(p):[],n=b.length,v=b.reduce((s,f)=>s+f.v,0);return`Pesci nel tuo cesto ${n} (valgono ${v} monete) · esci col chewing-gum per venderli`}
 case"boss":return m.boss?"Libera la principessa nella gabbia!":(()=>{const b=S.enemies.find(e=>e.t==="B");return b?`Sconfiggi il Cuoco del Sushi · energia ${Math.max(0,Math.ceil(b.hp/b.max*100))}%`:"Trova il Cuoco del Sushi"})()}return""}
const WNAME=["Asciugamano","Saponette","Chewing-gum"];
let shopLock=false,saveLock=false;
function hudHTML(){const G=myG(),p=meP(),bits=[];
 if(S.rule==="squadre")bits.push(...[0,1].filter(g=>groupsInPlay().includes(g)).map(g=>`<b style="color:${TEAMC[g]}">${g?"🐧":"🦭"} ${grpScore(g)}</b>`));
 else if(S.rule==="sfida"){const r=ranking(),me=p?gi(p):-1,pos=r.findIndex(x=>x.g===me)+1;bits.push(`<b>${S.mode==="hot"&&p?esc(p.name)+" ":""}★ ${p?p.score|0:0}</b>`,`<span>${pos}° su ${r.length}</span>`)}
 else{if(S.mode!=="solo")bits.push(S.players.filter(q=>!q.away).map(q=>`<b class="${S.mode==="hot"&&q.i===S.active?"on":""}">${esc(q.name)}${q.down?" (KO)":""}</b>`).join(" · "));bits.push(`<span style="color:#ff8cc0">♥ ${G.lives}</span>`,`<span>★ ${grpScore(0)}</span>`)}
 bits.push(`<span style="color:#ffc93c">● ${G.coins}</span>`,`<span style="color:#c9c2ff">📜 ${G.frags}/4</span>`);
 if(S.mode==="hot")bits.push(`<span>${S.rule==="squadre"&&p?esc(p.name)+" · ":""}⏱ ${Math.max(0,Math.ceil(S.turnT))}s</span>`);
 return bits.join(" ")}
function syncUI(){
 if(S&&S.phase!==lastPhase){lastPhase=S.phase;onPhase(S.phase)}
 updateInput();
 if(AU.ctx){const want=S&&S.phase==="play"?S.lvl:-1;if(want!==AU.playing){if(want>=0)musicStart(want);else musicStop()}}
 drawMenuHeroes();drawPickers();
 const now=performance.now();if(now-uiT<120)return;uiT=now;if(!S)return;
 const p=meP(),G=myG();
 $("lvl").textContent=`${S.lvl&&S.lvl<6?`Negozio ${S.lvl}/5 · `:""}${LV[S.lvl].name} — ${missionText()}${netLost?" · collegamento perso!":""}`;
 $("hud").innerHTML=hudHTML();
 const scene=S.lvl===6;const cI=!scene&&S.lvl<7&&!!p&&(p.carts|0)>0;const pzm=S.lvl===8;if(scene!==iconScene||cI!==cartIco||pzm!==pzIco){iconScene=scene;cartIco=cI;pzIco=pzm;wIcons(scene)}
 {const ba=$("bAbandon");const show=!!p&&S.phase==="play"&&((S.lvl===7&&S.race&&!p.watch&&!p.fin)||S.lvl===8);if(ba.hidden===show)ba.hidden=!show}
 if(p)document.querySelectorAll(".wb").forEach(b=>{const i=+b.dataset.w,am=scene?-2:S.lvl===8?-3:S.lvl===7?(i===1?p.up1|0:i===2?p.up2|0:-1):i===1?(cartIco?p.carts:G.ammo.soap):i===2?G.ammo.gum:-1;b.classList.toggle("sel",!scene&&S.lvl!==8&&p.w===i);b.classList.toggle("empty",am===0&&S.lvl!==7);b.querySelector("small").textContent=scene?["Lancia","Sciò","Esci"][i]:am===-3?["Avanti","Indietro","Da capo"][i]:am<0?"∞":am});
 {const rb=$("raceBig");if(rb){const t=S.lvl===7&&S.race?S.race.big:"";if(rb.textContent!==t)rb.textContent=t;rb.hidden=!t}}
 const free=!shopMode&&$("ovStat").hidden&&$("ovHelp").hidden&&$("ovSave").hidden&&$("ovPause").hidden;
 if(p&&S.phase==="play"){
  if(!(p.kT>0))shopLock=false;else if(p.kT>1&&!shopLock&&free&&!p.down){shopLock=true;openShop()}
  if(!(p.fT>0))saveLock=false;else if(p.fT>1.2&&!saveLock&&free&&!p.down){saveLock=true;openSave()}}
 if(shopMode&&shopKey()!==shopSig)renderShop();
 if(!$("ovStat").hidden)renderStat();
}
const shopKey=()=>{const p=meP(),G=myG(),f=p?p.fish:{};return[G.coins,G.ammo.soap,G.ammo.gum,G.lives,JSON.stringify(G.up),f.food|0,f.water|0,f.pot,p&&p.hp|0].join()};
/* pausa / sicurezza mentre una finestra è aperta */
function setSafe(v){if(!S)return;if(S.mode==="coop"){if(role==="guest")send({t:"shop",v});else{const p=S.players[MYI];if(p)p.shop=v}}else S.paused=v}
let shopCat=null;
function openShop(){const f=meP().fish;shopMode="kiosk";shopSig="";shopCat=f.food<40||f.water<40?"pesce":null;renderShop();$("ovShop").hidden=false;setSafe(true);sfx("buy",.4)}
function closeShop(){if(!shopMode)return;shopMode=null;$("ovShop").hidden=true;setSafe(false)}
function renderShop(){if(!S)return;const p=meP(),G=myG(),f=p.fish,gst=role==="guest";
 shopSig=shopKey();
 $("shW").innerHTML=[S.rule==="squadre"?`Cassa ${TEAMS[gi(p)]}`:S.rule==="sfida"?`Cassa di ${esc(p.name)}`:"",`Monete ${G.coins}`,`Pappa ${Math.ceil(f.food)}%`,`Acqua ${Math.ceil(f.water)}%`,`Saponette ${G.ammo.soap}`,`Chewing-gum ${G.ammo.gum}`,S.rule==="insieme"?`Vite ${G.lives}`:"",p?`Energia ${Math.ceil(p.hp)}`:""].filter(Boolean).map(s=>`<span>${s}</span>`).join("");
 const cats=CAT.filter(c=>!c.only||c.only===S.lvl);
 $("shC").innerHTML=cats.map(c=>`<button class="shelf${shopCat===c.id?" sel":""}" data-c="${c.id}"><canvas data-i="${c.icon}" width="80" height="80"></canvas>${esc(c.name)}</button>`).join("");
 const cat=cats.find(c=>c.id===shopCat);
 $("shG").innerHTML=cat?cat.ids.filter(id=>id!=="heart"||S.rule==="insieme").map(id=>SHOP.find(s=>s.id===id)).filter(Boolean).map(it=>{const own=!!(it.up&&G.up[it.id]);return`<div class="it${own?" own":""}"><canvas data-i="${it.icon}" width="80" height="80"></canvas><div><b>${esc(it.name)}</b><small>${esc(it.desc)}</small></div><button data-b="${it.id}" ${own||G.coins<it.price?"disabled":""}>${own?"Già vostro":it.price+" monete"}</button></div>`}).join(""):"";
 document.querySelectorAll("#shC canvas,#shG canvas").forEach(cn=>{const c=cn.getContext("2d");c.setTransform(2,0,0,2,20,20);c.scale(1.3,1.3);drawIcon(c,cn.dataset.i,0)});
 $("shC").querySelectorAll("button").forEach(b=>b.onclick=()=>{shopCat=shopCat===b.dataset.c?null:b.dataset.c;renderShop()});
 $("shG").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(gst)send({t:"buy",id:b.dataset.b});else{buy(b.dataset.b,myIdx());const q=EVQ;EVQ=[];q.forEach(playFx);if(role==="host")OUTEV.push(...q)}renderShop()});
 $("shH").textContent=!cat?"Scegli uno scaffale per vedere i prodotti.":""}
function renderStat(){if(!S)return;const me=meP(),f=me.fish,bar=(v,col)=>`<div class="sb"><i style="width:${cl(v,0,100)}%;background:${col}"></i></div>`,wq=f.water>66?"pulita":f.water>33?"da cambiare":"sporca",G=myG();
 let h=`<h3>Il pesce rosso di ${esc(me.name)}</h3><div class="sr"><span>Cibo</span>${bar(f.food,"linear-gradient(90deg,#ff9a2e,#ffd36b)")}<span>${Math.ceil(f.food)}%</span></div><div class="sr"><span>Acqua ${wq}</span>${bar(f.water,waterCol(f.water))}<span>${Math.ceil(f.water)}%</span></div>`+
  `<div class="tags"><span>${f.pot?"Pozione "+POT[f.pot].name+" · "+Math.ceil(f.potT)+" s":"Nessuna pozione attiva"}</span><span>${f.food<=0||f.water<=0?"Sta male: non spruzza":f.food<25||f.water<25?"Affaticato: spruzza piano":"In forma: spruzza acqua"}</span></div>`;
 for(const q of inPlay())h+=`<h3>${S.rule==="squadre"?(q.team?"🐧 ":"🦭 "):""}${esc(q.name)}${S.mode==="hot"&&q.i===S.active?" (di turno)":""}</h3><div class="sr"><span>Energia</span>${bar(q.hp/q.max*100,"linear-gradient(90deg,#4fe3b5,#9dfbd8)")}<span>${q.down?"KO":Math.ceil(q.hp)}</span></div><div class="tags"><span>★ ${q.score|0} punti</span><span>Arma: ${WNAME[q.w]}</span>${q.carry?`<span>Sta portando ${q.carry.k==="pizza"?"una pizza":q.carry.k==="key"?"la chiave dei "+SP[q.carry.sp].n:"un vestito"}</span>`:""}</div>`;
 const ups=SHOP.filter(i=>i.up&&G.up[i.id]).map(i=>i.name);
 h+=`<h3>${S.rule==="insieme"?"Squadra":esc(grpName(gi(me)))}</h3><div class="tags">${S.rule==="insieme"?`<span>Vite ${G.lives}</span>`:""}<span>Monete ${G.coins}</span><span>Volantino ${G.frags}/4</span><span>Saponette ${G.ammo.soap}</span><span>Chewing-gum ${G.ammo.gum}</span><span>Mostri sconfitti ${S.kills}</span><span>${ups.length?"Potenziamenti: "+ups.join(", "):"Nessun potenziamento"}</span></div>`;
 if(S.rule!=="insieme")h+=`<h3>Classifica della partita</h3><div class="tags">${ranking().map((r,i)=>`<span>${i+1}° ${esc(r.name)} ${r.score} · volantino ${S.grp[r.g].frags}/4</span>`).join("")}</div>`;
 h+=`<h3>Negozi</h3><div class="tags">${[1,2,3,4,5].map(l=>`<span>${G.done[l]?"✓ ":""}${esc(LV[l].name)}</span>`).join("")}</div><h3>Adesso</h3><p>${esc(LV[S.lvl].name)}: ${esc(missionText())}</p>`;
 if($("stB").innerHTML!==h)$("stB").innerHTML=h}
function openStat(){if(!S||S.phase!=="play")return;renderStat();$("ovStat").hidden=false;setSafe(true)}
function closeStat(){$("ovStat").hidden=true;setSafe(false)}
/* ---------- classifica stile sala giochi ---------- */
const HSK="ppr-hiscore";
function hsLoad(){try{const a=JSON.parse(localStorage.getItem(HSK));return Array.isArray(a)?a:[]}catch(e){return[]}}
function hsStore(a){try{localStorage.setItem(HSK,JSON.stringify(a))}catch(e){}}
function scoreEntries(){return inPlay().map(p=>({n:p.name,s:p.score|0,h:p.hero,tm:S.rule==="squadre"?(p.team|0):-1,d:Date.now()}))}
function hsMerge(list,add){const a=list.slice();for(const e of add){if(!e||!e.n)continue;const k=String(e.n).toLowerCase()+"|"+e.h,i=a.findIndex(x=>String(x.n).toLowerCase()+"|"+x.h===k);
  if(i>=0){if((e.s|0)>=(a[i].s|0))a[i]={...e}}else a.push({...e})}
 return a.sort((x,y)=>(y.s|0)-(x.s|0)).slice(0,10)}
function hsUpdate(add){const a=hsMerge(hsLoad(),add);hsStore(a);if(role==="host")sendAll({t:"hs",add});return a}
const ORD=["1ST","2ND","3RD","4TH","5TH","6TH","7TH","8TH","9TH","10TH"],HSC=["#ff3b5c","#ff9a2e","#ffe14d","#5dff6b","#3ff0ff","#5a8bff","#d46bff","#ff6fd8","#ffffff","#b0b0b0"];
function rankHTML(max,hl){const a=hsLoad().slice(0,max||10),H=new Set((hl||[]).map(n=>String(n).toLowerCase()));
 return`<div class="arcade"><div class="arT">HIGH SCORES</div>`+(a.length?`<ol>${a.map((e,i)=>`<li class="${H.has(String(e.n).toLowerCase())?"me":""}" style="color:${HSC[i]}"><span>${ORD[i]}</span><span>${esc(String(e.n).toUpperCase().slice(0,10))}${e.tm>=0?(e.tm?" 🐧":" 🦭"):""}</span><span>${String(e.s|0).padStart(6,"0")}</span></li>`).join("")}</ol>`:`<p class="arE">NESSUN PUNTEGGIO<br>SALVA ALLA FONTANA!</p>`)+`<div class="arI">INSERT COIN</div></div>`}
/* ---------- salvataggio alla fontana ---------- */
let exitArm=false;
function openSave(){const sv=loadSave(),G=myG();
 $("svW").innerHTML=[S.rule==="insieme"?`Vite ${G.lives}`:"",`Monete ${G.coins}`,`Negozi completati ${[1,2,3,4].filter(l=>G.done[l]).length}/4`,`Mostri sconfitti ${S.kills}`].filter(Boolean).map(s=>`<span>${s}</span>`).join("");$("svF").innerHTML=flyerHTML(G.frags);
 $("bSave").disabled=false;$("bSave").textContent=inPlay().length>1?"Salva per tutti":"Salva la partita";exitArm=false;$("bQuit").textContent="Esci dal gioco";
 $("svR").innerHTML=rankHTML(5,inPlay().map(p=>p.name));
 $("svH").textContent=role==="guest"?"Salvando aggiorni la classifica di tutti; la partita si salva sul telefono di chi l'ha creata.":sv&&sv.when?`Ultimo salvataggio: ${new Date(sv.when).toLocaleString("it-IT",{dateStyle:"short",timeStyle:"short"})}`:"Nessun salvataggio precedente.";
 $("ovSave").hidden=false;setSafe(true);sfx("spray")}
function closeSave(){$("ovSave").hidden=true;setSafe(false)}
/* ---------- account (su questo dispositivo) e partite ---------- */
const UK="ppr-users",SSK="ppr-session",TP={ON:{n:"Più telefoni",e:"📱",m:"coop"},TU:{n:"A turno",e:"👥",m:"hot"},SO:{n:"Da solo",e:"🎮",m:"solo"}},typeOf=m=>m==="coop"?"ON":m==="hot"?"TU":"SO";
let USER=null;
const jget=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const ukey=n=>String(n).trim().toLowerCase(),users=()=>jget(UK,{}),games=()=>USER?jget("ppr-games:"+USER.key,{}):{},putGames=g=>USER&&jset("ppr-games:"+USER.key,g);
async function hashPw(pw,salt){const t=new TextEncoder().encode(salt+":"+pw);if(window.crypto&&crypto.subtle){const h=await crypto.subtle.digest("SHA-256",t);return[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join("")}let x=5381;for(const b of t)x=((x<<5)+x+b)>>>0;return"f"+x.toString(16)}
function newGid(type){const g=games(),A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let id;do{id=type+"-"+Array.from({length:6},()=>A[Math.random()*A.length|0]).join("")}while(g[id]);return id}
function createGame(type,alias){const g=games(),id=newGid(type);g[id]={id,type,alias:alias||TP[type].n,rule:CFG.rule,when:Date.now(),S:null,members:[]};putGames(g);return id}
function bindGame(){if(!S||!USER)return;S.gid=CFG.gid;S.alias=CFG.alias;const g=games(),r=g[S.gid];if(r){r.rule=S.rule;r.members=S.players.map(p=>({name:p.name,hero:p.hero,team:p.team|0}));r.when=Date.now();putGames(g)}}
function save(){try{const s=JSON.parse(JSON.stringify(S));s.phase="play";s.paused=false;s.players.forEach(p=>p.shop=false);s.proj=[];
 const g=games();if(!s.gid){S.gid=s.gid=newGid(typeOf(S.mode))}
 const r=g[s.gid]||{id:s.gid,type:typeOf(S.mode),alias:S.alias||TP[typeOf(S.mode)].n};
 r.S=s;r.when=Date.now();r.rule=S.rule;r.members=s.players.map(p=>({name:p.name,hero:p.hero,team:p.team|0}));g[r.id]=r;
 if(!putGames(g))return false;hsUpdate(scoreEntries());return true}catch(e){return false}}
function migrate(sv){const s=sv&&sv.S;if(!s||s.grp)return sv;
 s.rule="insieme";s.grp=[{coins:s.coins|0,lives:s.lives||3,frags:s.frags|0,done:{...(s.done||{})},ammo:s.ammo||{soap:20,gum:3},up:s.up||{},score:0}];
 const f=s.fish||newFish();s.players.forEach((p,i)=>{p.fish={...f};p.score=0;p.team=i%2;p.away=false});
 for(const k of["coins","lives","frags","ammo","up","fish"])delete s[k];const fixB=o=>{if(o&&o.baskets)while(o.baskets.length<4)o.baskets.push([])};fixB(s);for(const k in s.shops||{})fixB(s.shops[k]);return sv}
function loadSave(){const id=(S&&S.gid)||CFG.gid,r=id&&games()[id];return r&&r.S?{when:r.when,S:r.S}:null}
function savedMsg(ok){sfx(ok?"save":"empty");$("svH").textContent=ok?"Partita salvata e classifica aggiornata! Dal menu potrai riaprirla.":"Non è stato possibile salvare su questo dispositivo.";$("bSave").textContent=ok?"Salvata ✓":"Riprova";$("svR").innerHTML=rankHTML(5,inPlay().map(p=>p.name));exitArm=true}
$("bSave").onclick=()=>{if(role==="guest"){send({t:"save"});$("bSave").textContent="Salvataggio…";return}const ok=save();savedMsg(ok);if(ok&&role==="host")sendAll({t:"saved"})};
$("bQuit").onclick=()=>{if(!exitArm){exitArm=true;$("bQuit").textContent="Non hai salvato: tocca ancora per uscire";return}toMenu()};
$("bSaveX").onclick=closeSave;$("bShopX").onclick=closeShop;$("bStatX").onclick=closeStat;
for(const id of["ovStat","ovSave","ovShop"])$(id).addEventListener("click",e=>{if(e.target.id===id)(id==="ovStat"?closeStat:id==="ovSave"?closeSave:closeShop)()});
$("bMute").onclick=()=>{auInit();auToggle()};$("bMute2").onclick=()=>{auInit();auToggle()};
$("bAbandon").onclick=()=>{const n=performance.now();if(n>abArm){abArm=n+2800;showToast(S&&S.lvl===8?"Premi ancora per uscire dal puzzle":"Premi ancora per abbandonare la corsa");$("bAbandon").classList.add("arm");setTimeout(()=>$("bAbandon").classList.remove("arm"),2800)}else{abArm=0;abT=n+350;$("bAbandon").classList.remove("arm")}};
$("b3d").onclick=()=>{R3.on=!R3.on;try{localStorage.setItem("ppr-3d",R3.on?"1":"0")}catch(_){}showToast(R3.on?"Grafica 3D attiva (prova: solo la hall)":"Grafica 2D")};
$("bTurn").onclick=()=>{if(S&&S.phase==="turn")switchTurn()};
$("bEnd").onclick=()=>{if(!S)return;if(S.phase==="win")toMenu();else if(S.phase==="over"&&role!=="guest")retryArea()};
$("bMenu").onclick=toMenu;
$("bRank").onclick=()=>{$("rkB").innerHTML=rankHTML(10);$("ovRank").hidden=false};$("bRankX").onclick=()=>{$("ovRank").hidden=true};
$("ovRank").addEventListener("click",e=>{if(e.target.id==="ovRank")$("ovRank").hidden=true});
function toMenu(){closePeer();role=null;S=null;MYI=0;lastPhase=null;shopMode=null;musicStop();hide("ovEnd","ovShop","ovTurn","ovNet","ovStat","ovSave","ovPause");$("ovMenu").hidden=false;refreshMenu()}

/* ---------- menu ---------- */
function heroSelected(i){return CFG.mode==="hot"?CFG.sel.includes(i):CFG.solo===i}
function refreshMenu(){if(!USER)return;document.querySelectorAll("#modes button").forEach(b=>b.classList.toggle("sel",b.dataset.m===CFG.mode));
 document.querySelectorAll("#rules button").forEach(b=>b.classList.toggle("sel",b.dataset.r===CFG.rule));
 $("rules").hidden=CFG.mode==="solo"||!!CFG.join;
 $("whoN").textContent=USER.id;{const hot=CFG.mode==="hot";if(hot&&!CFG.sel.includes(USER.hero)){CFG.sel.push(USER.hero);CFG.sel.sort()}CFG.solo=USER.hero;$("n"+(USER.hero+1)).value=USER.id;$("n"+(USER.hero+1)).readOnly=true;document.querySelectorAll(".heroes").forEach(e=>e.classList.toggle("one",!hot))}
 document.querySelectorAll(".hero").forEach(h=>{const i=+h.dataset.h;h.hidden=CFG.mode!=="hot"&&i!==USER.hero;h.classList.toggle("sel",heroSelected(i));const tb=h.querySelector(".tb");tb.hidden=CFG.mode==="solo"||CFG.rule!=="squadre"||!heroSelected(i);tb.textContent=CFG.teams[i]?"🐧 Pinguini":"🦭 Foche";tb.classList.toggle("p",!!CFG.teams[i])});
 const nm=names();
 $("menuSub").textContent=CFG.mode==="hot"?"Tu giochi con il tuo personaggio: tocca gli altri che giocano (da 2 a 4) e scrivete i loro nomi":`Giochi come ${USER.id}`;
 $("menuHint").textContent=CFG.mode==="coop"?`Fino a 4 telefoni sulla stessa Wi-Fi: ognuno sceglie il suo personaggio sul proprio telefono. Regola: ${RULEN[CFG.rule]}.`:CFG.mode==="hot"?`Giocano ${CFG.sel.map(i=>nm[i]).join(", ")}; ogni turno dura 75 secondi. Regola: ${RULEN[CFG.rule]}.`:"";
 if(CFG.mode!=="solo"&&CFG.rule!=="insieme")$("menuHint").textContent+=" Il Sushi apre solo quando "+(CFG.rule==="squadre"?"entrambe le squadre hanno":"tutti hanno")+" completato i 4 negozi.";
 if(CFG.join){$("menuSub").textContent="Ti hanno invitato a una partita: giochi come "+USER.id;$("menuHint").textContent="Poi tocca «Unisciti» e fai inquadrare il QR di risposta a chi ti ha invitato."+(CFG.rule==="squadre"?" Tocca il cartellino per scegliere la squadra.":"")}
 if(CFG.reloaded)$("menuHint").textContent="La pagina si è ricaricata mentre vi stavate collegando: rifate lo scambio dei codici tenendo il gioco aperto.";
 $("bPlay").textContent=CFG.join&&CFG.mode==="coop"?"Unisciti":"Gioca!";
 const multi=CFG.mode!=="solo"&&!CFG.join,sr=soloRec();$("bPlay").hidden=multi;$("bCont").hidden=multi||CFG.mode!=="solo"||!sr||!sr.S;if(sr&&sr.S)$("bCont").textContent="Continua";renderGames()}
function soloRec(){return Object.values(games()).find(r=>r.type==="SO")}
function fmtD(t){return new Date(t).toLocaleDateString("it-IT",{day:"numeric",month:"short"})}
const gEsc=x=>String(x).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function renderGames(){const box=$("gamesBox");box.hidden=CFG.mode==="solo"||!!CFG.join;if(box.hidden)return;const all=Object.values(games());let h="";
 for(const ty of["ON","TU"]){const l=all.filter(r=>r.type===ty).sort((a,b)=>b.when-a.when);h+=`<h3>${TP[ty].e} ${TP[ty].n}</h3>`;
  if(!l.length)h+='<p class="gnone">Nessuna partita aperta</p>';
  for(const r of l)h+=`<div class="grow" data-id="${r.id}"><div class="gi"><b>${gEsc(r.alias)}</b><small>${r.id} · ${RULEN[r.rule]||""} · ${fmtD(r.when)}${r.guest?" · ospite":r.S?"":" · da iniziare"}${r.members&&r.members.length?" · "+r.members.map(m=>gEsc(m.name)).join(", "):""}</small></div><button class="ok go">${r.guest?"Unisciti":"Apri"}</button><button class="del" aria-label="Elimina la partita ${gEsc(r.alias)}">🗑</button></div>`}
 $("gList").innerHTML=h}
$("gList").addEventListener("click",e=>{const row=e.target.closest(".grow");if(!row)return;const id=row.dataset.id;
 if(e.target.closest(".del")){const b=e.target.closest(".del");if(!b.dataset.arm){b.dataset.arm=1;b.textContent="Sicuro?";setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent="🗑"}},3000);return}const g=games();delete g[id];putGames(g);if(CFG.gid===id)CFG.gid=null;renderGames();return}
 openGame(id)});
function newMulti(){const alias=$("gAlias").value.trim().slice(0,24);if(!alias){$("gAlias").focus();showToast("Dai un nome (alias) alla partita");return}
 CFG.gid=createGame(CFG.mode==="coop"?"ON":"TU",alias);CFG.alias=alias;$("gAlias").value="";auInit();CFG.reloaded=false;CFG.cont=null;
 if(CFG.mode==="coop"){$("ovMenu").hidden=true;openNet("host")}else startLocal()}
$("bNew").onclick=newMulti;$("gAlias").addEventListener("keydown",e=>{if(e.key==="Enter")newMulti()});
function openGame(id){const r=games()[id];if(!r)return;auInit();CFG.reloaded=false;CFG.join=null;CFG.gid=r.id;CFG.alias=r.alias;CFG.mode=TP[r.type].m;if(r.rule)CFG.rule=r.rule;
 if(r.guest){$("ovMenu").hidden=true;openNet("guest");return}
 const ms=r.members||[];
 if(CFG.mode==="hot"){CFG.sel=[...new Set([USER.hero,...ms.map(m=>m.hero)])].sort();if(CFG.sel.length<2)CFG.sel.push(USER.hero===0?1:0),CFG.sel.sort();ms.forEach(m=>{if(m.hero!==USER.hero)$("n"+(m.hero+1)).value=m.name;if(m.team!=null)CFG.teams[m.hero]=m.team})}
 if(r.S){const sv={when:r.when,S:r.S};if(CFG.mode==="coop"){CFG.cont=sv;$("ovMenu").hidden=true;openNet("host")}else{role=null;restoreGame(sv,"hot");S.gid=r.id;S.alias=r.alias;$("ovMenu").hidden=true;showToast("Partita ripresa: "+r.alias)}}
 else if(CFG.mode==="coop"){CFG.cont=null;$("ovMenu").hidden=true;openNet("host")}else startLocal()}
document.querySelectorAll("#modes button").forEach(b=>b.onclick=()=>{CFG.mode=b.dataset.m;refreshMenu()});
document.querySelectorAll("#rules button").forEach(b=>b.onclick=()=>{CFG.rule=b.dataset.r;refreshMenu()});
document.querySelectorAll(".hero").forEach(h=>{const i=+h.dataset.h,pick=()=>{if(CFG.mode==="hot"){const k=CFG.sel.indexOf(i);if(k<0)CFG.sel.push(i);else if(CFG.sel.length>2&&i!==USER.hero)CFG.sel.splice(k,1);CFG.sel.sort()}refreshMenu()};
 h.querySelector(".tb").addEventListener("click",e=>{e.stopPropagation();CFG.teams[i]=CFG.teams[i]?0:1;refreshMenu()});
 h.addEventListener("click",e=>{if(e.target.tagName!=="INPUT")pick()});h.querySelector("input").addEventListener("focus",()=>{if(!heroSelected(i))pick()});h.querySelector("input").addEventListener("input",refreshMenu);h.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target===h)pick()})});
function drawMenuHeroes(){if($("ovMenu").hidden)return;const t=performance.now();for(const i of[0,1,2,3]){const el=$("hc"+i),w=el.clientWidth,h=el.clientHeight;if(!w)continue;
 const px=Math.round(w*dpr),py=Math.round(h*dpr);if(el.width!==px||el.height!==py){el.width=px;el.height=py}const c=el.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const sel=heroSelected(i),s=Math.min(h/64,w/40);c.save();c.translate(w/2,h*.64);c.scale(s*(i%2?-1:1),s);drawKid(c,t+i*400,{hero:i,look:"boy",walk:sel?t/140:0});c.restore();
 if(sel){c.save();c.translate(w/2+(i%2?-1:1)*w*.3,h*.22+Math.sin(t/400)*3);c.scale(s*.45,s*.45);drawBowl(c,t,95,null,false);c.restore()}}}
function localList(){const nm=names(),ids=CFG.mode==="hot"?CFG.sel.slice():[CFG.solo];return ids.map(h=>({hero:h,name:nm[h],team:CFG.teams[h]}))}
function startLocal(){role=null;MYI=0;lastPhase=null;if(CFG.mode==="solo"){const r=soloRec();CFG.gid=r?r.id:createGame("SO","Partita singola");CFG.alias=r?r.alias:"Partita singola"}newRun({mode:CFG.mode,rule:CFG.rule,list:localList()});bindGame();$("ovMenu").hidden=true}
function restoreGame(sv,mode,joined){const s=sv.S;S=s;S.phase="play";S.paused=false;S.gv=(S.gv||0)+1;S.proj=[];if(!S.seen)S.seen={};if(!S.grp)migrate(sv);
 for(const k in S.shops)if(!S.shops[k].G)S.shops[k].G=baseGrid(+k);if(!S.G)S.G=baseGrid(S.lvl);
 S.players.forEach(p=>{p.away=false;p.hidden=false;p.carts=p.carts|0;if(!p.fish)p.fish=newFish()});if(S.cartCap==null)Object.assign(S,{cartN:2,cartCap:5,abn:2,abT:30,momT:10});if(S.lvl===0&&!S.shelter){const pp=S.players.map(p=>[p.x,p.y]);loadLevel(0);S.players.forEach((p,i)=>{p.x=pp[i][0];p.y=pp[i][1]})}
 const match=(want)=>{const free=S.players.filter(p=>!p.taken);let p=free.find(q=>q.name.toLowerCase()===String(want.name).toLowerCase())||free.find(q=>q.hero===want.hero);
  if(!p){p=mkPlayer(S.players.length,want.hero,want.name,want.team);S.players.push(p);GR(p)}p.taken=true;p.name=want.name;p.hero=want.hero;if(want.team!=null&&S.rule==="squadre")p.team=want.team;return p};
 let me=0;
 if(mode==="solo"){const p=match(localList()[0]);me=p.i;S.players.forEach(q=>{if(q!==p)q.away=true})}
 let slots=null;if(mode==="coop"){const ps=(joined||[]).map(match);slots=ps.map(p=>p.i);me=ps[0].i;S.players.forEach(q=>{if(!q.taken)q.away=true})}
 if(mode==="hot"){const ps=localList().map(match);S.players.forEach(q=>{if(!q.taken)q.away=true});if(!ps.includes(S.players[S.active]))S.active=ps[0].i;S.players.forEach(q=>q.hidden=q.i!==S.active)}
 S.players.forEach(p=>{delete p.taken;p.shop=false;p.doorLock=true});
 if(mode!=="hot")S.active=me;MYI=me;
 if(S.mode!==mode){S.mode=mode;S.cfg.mode=mode}
 lastPhase=null;shopMode=null;saveLock=true;shopLock=true;return slots}
$("bPlay").onclick=()=>{auInit();CFG.reloaded=false;if(CFG.mode==="coop"){CFG.cont=null;$("ovMenu").hidden=true;if(CFG.join){const c=CFG.join;CFG.join=null;openNet("guest",c)}else openNet("host")}else{CFG.join=null;startLocal()}};
$("bCont").onclick=()=>{auInit();const r=soloRec();if(!r||!r.S)return;CFG.gid=r.id;CFG.alias=r.alias;role=null;restoreGame({when:r.when,S:r.S},"solo");S.gid=r.id;S.alias=r.alias;$("ovMenu").hidden=true;showToast("Partita ripresa dall'ultimo salvataggio")};
const openHelp=()=>{helpGo(0);$("ovHelp").hidden=false;if(S&&S.phase==="play")setSafe(true)},closeHelp=()=>{$("ovHelp").hidden=true;if(S&&S.phase==="play"&&!shopMode&&$("ovStat").hidden&&$("ovSave").hidden&&$("ovPause").hidden)setSafe(false)};
const openPause=()=>{if(!S||S.phase!=="play"||!$("ovMenu").hidden)return;$("bPMute").textContent=AU.on?"Spegni musica":"Accendi musica";$("ovPause").hidden=false;setSafe(true)},
 closePause=()=>{$("ovPause").hidden=true;if(S&&S.phase==="play"&&!shopMode&&$("ovStat").hidden&&$("ovSave").hidden&&$("ovHelp").hidden)setSafe(false);};
$("bPause").onclick=()=>{auInit();$("ovPause").hidden?openPause():closePause()};$("bResume").onclick=closePause;
$("bPHelp").onclick=()=>{closePause();openHelp()};$("bPMute").onclick=()=>{auInit();auToggle();$("bPMute").textContent=AU.on?"Spegni musica":"Accendi musica"};$("bPMenu").onclick=()=>{$("ovPause").hidden=true;toMenu()};
$("ovPause").addEventListener("click",e=>{if(e.target.id==="ovPause")closePause()});
$("bHelp").onclick=$("bHelp2").onclick=openHelp;$("bHelpOk").onclick=closeHelp;$("ovHelp").addEventListener("click",e=>{if(e.target.id==="ovHelp")closeHelp()});

/* ---------- aiuto a capitoli ---------- */
const HCH=[["🎯","Obiettivo",[]],["🏬","Hall",["La hall"]],["👥","Modalità",["Modalità","Regole","Classifica"]],["🎮","Comandi",["Comandi sul","Comandi da","Armi"]],["🐠","Pesce",["Il pesce"]],["🛍️","Negozi",["I livelli","Il Mondo dei Pesci"]],["🪙","Monete",["Monete"]],["📲","Installa",["Installare","Musica"]]];
let hPage=0,hBodies=[];
function helpInit(){const m=document.querySelector("#ovHelp .help");if(!m||m.dataset.ch)return;m.dataset.ch=1;const kids=[...m.children],h2=kids.find(k=>k.tagName==="H2"),ok=kids.find(k=>k.classList.contains("row")),body=kids.filter(k=>k!==h2&&k!==ok);
 hBodies=HCH.map(()=>document.createElement("div"));let cur=0;
 for(const k of body){if(k.tagName==="H3"){const i=HCH.findIndex(c=>c[2].some(p=>k.textContent.startsWith(p)));cur=i<0?cur:i}else if(k===body[0])cur=0;hBodies[cur].appendChild(k)}
 const tabs=document.createElement("div");tabs.className="htabs";tabs.setAttribute("role","tablist");
 HCH.forEach((c,i)=>{const b=document.createElement("button");b.innerHTML=`<b>${c[0]}</b>${c[1]}`;b.setAttribute("role","tab");b.onclick=()=>helpGo(i);tabs.appendChild(b)});
 const bd=document.createElement("div");bd.className="hbody";bd.id="hBody";
 const nav=document.createElement("div");nav.className="hnav";nav.innerHTML='<button id="hPrev">‹ Indietro</button><span class="pg" id="hPg"></span><button id="hNext">Avanti ›</button>';
 ok.className="hnav";ok.querySelector("button").className="big";
 m.append(tabs,bd,nav,ok);ok.style.marginTop="6px";ok.style.justifyContent="center";
 $("hPrev").onclick=()=>helpGo(hPage-1);$("hNext").onclick=()=>helpGo(hPage+1);helpGo(0)}
function helpGo(i){helpInit();hPage=cl(i,0,HCH.length-1);const bd=$("hBody");bd.replaceChildren(hBodies[hPage]);bd.scrollTop=0;
 document.querySelectorAll(".htabs button").forEach((b,k)=>{b.classList.toggle("sel",k===hPage);b.setAttribute("aria-selected",k===hPage);if(k===hPage)try{b.scrollIntoView({inline:"center",block:"nearest"})}catch(_){}});
 $("hPg").textContent=`${hPage+1} / ${HCH.length} · ${HCH[hPage][1]}`;$("hPrev").disabled=hPage===0;$("hNext").disabled=hPage===HCH.length-1}
/* ---------- comandi ---------- */
const KEY={};let atkBtn=false,atkKey=false,JV={x:0,y:0},jid=null,jcx=0,jcy=0;
const joy=$("joy"),ring=$("ring"),knob=$("knob");
function ringHome(){ring.style.left="84px";ring.style.top=(joy.clientHeight-84)+"px";knob.style.transform="";JV={x:0,y:0}}
function tapFish(x,y){if(!S||S.phase!=="play"||S.lvl===6)return false;const r=cv.getBoundingClientRect(),wx=(x-r.left)/r.width*VWt+VIEW.camX,wy=(y-r.top)/r.height*VHt+VIEW.camY,me=meP(),fr=me&&(RP["fish"+me.id]||me.fish);if(!fr)return false;
 if(dist(wx,wy,fr.x,fr.y-.1)<.95){openStat();return true}return false}
joy.addEventListener("pointerdown",e=>{e.preventDefault();if(tapFish(e.clientX,e.clientY))return;jid=e.pointerId;try{joy.setPointerCapture(jid)}catch(_){}const r=joy.getBoundingClientRect();jcx=e.clientX;jcy=e.clientY;ring.style.left=(e.clientX-r.left)+"px";ring.style.top=(e.clientY-r.top)+"px"});
joy.addEventListener("pointermove",e=>{if(e.pointerId!==jid)return;let dx=e.clientX-jcx,dy=e.clientY-jcy;const m=Math.hypot(dx,dy),R=46;if(m>R){dx*=R/m;dy*=R/m}knob.style.transform=`translate(${dx}px,${dy}px)`;JV={x:dx/R,y:dy/R}});
const jend=e=>{if(e.pointerId!==jid)return;jid=null;ringHome()};joy.addEventListener("pointerup",jend);joy.addEventListener("pointercancel",jend);
cv.addEventListener("pointerdown",e=>{tapFish(e.clientX,e.clientY)});
let wPtr=null;
document.querySelectorAll(".wb").forEach(b=>{const i=+b.dataset.w;
 b.addEventListener("pointerdown",e=>{e.preventDefault();IN[LI()].wsel=i;atkBtn=true;pulse=performance.now()+160;wPtr=e.pointerId;b.classList.add("on");try{b.setPointerCapture(e.pointerId)}catch(_){}});
 const up=e=>{if(e.pointerId!==wPtr)return;atkBtn=false;wPtr=null;b.classList.remove("on")};b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up);
 b.addEventListener("contextmenu",e=>e.preventDefault())});
let iconScene=false,cartIco=false;
function wIcons(scene){if(S&&S.lvl===8){document.querySelectorAll(".wb").forEach((b,i)=>{b.setAttribute("aria-label",["Auto successiva","Auto precedente","Ricomincia il puzzle"][i]);const c=b.querySelector("canvas").getContext("2d");c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,88,88);c.fillStyle="#fff";c.font="700 40px system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText(["▶","◀","↺"][i],44,42)});return}
 const ids=scene?["hook","shoo","exit"]:["towel",cartIco?"cart":"soap","gum"],lab=scene?["Lancia l'amo","Scaccia i gatti","Esci e vendi i pesci"]:["Asciugamano",cartIco?"Lancia il carrello":"Saponette","Chewing-gum esplosivo"];
 document.querySelectorAll(".wb").forEach((b,i)=>{b.setAttribute("aria-label",lab[i]);const cn=b.querySelector("canvas"),c=cn.getContext("2d");c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,88,88);c.setTransform(2.6,0,0,2.6,44,44);if(scene)drawSceneIcon(c,ids[i],0);else drawIcon(c,ids[i],0)})}
const anyOpen=()=>["ovShop","ovMenu","ovHelp","ovStat","ovSave","ovTurn","ovEnd","ovNet","ovPause"].some(i=>!$(i).hidden);
addEventListener("keydown",e=>{if(/INPUT|TEXTAREA/.test(e.target.tagName))return;auInit();
 if(e.key==="Escape"||e.code==="KeyP"){if(!$("ovHelp").hidden)closeHelp();else if(!$("ovStat").hidden)closeStat();else if(!$("ovSave").hidden)closeSave();else if(shopMode)closeShop();else if(!$("ovPause").hidden)closePause();else if(S&&S.phase==="play")openPause();return}
 if(!$("ovHelp").hidden&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){helpGo(hPage+(e.key==="ArrowRight"?1:-1));e.preventDefault();return}
 if(anyOpen())return;
 KEY[e.code]=1;
 if(S&&S.lvl===6){if(e.code==="Space"||e.code==="KeyJ"||e.code==="Digit1"){IN[LI()].wsel=0;atkKey=e.code!=="Digit1";if(e.code==="Digit1")pulse=performance.now()+180;e.preventDefault();return}
  if(e.code==="Digit2"||e.code==="Digit3"){IN[LI()].wsel=e.code==="Digit2"?1:2;pulse=performance.now()+180;return}}
 if(e.code==="Space"||e.code==="KeyJ"){atkKey=true;e.preventDefault()}
 else if(e.code==="Digit1"||e.code==="Digit2"||e.code==="Digit3")IN[LI()].wsel=+e.code.slice(5)-1;
 else if(e.code==="KeyQ"&&!e.repeat){const p=meP();IN[LI()].wsel=((p?p.w:IN[LI()].wsel)+1)%3}
 else if(e.code==="KeyF")openStat();
 if(e.code.startsWith("Arrow"))e.preventDefault()});
addEventListener("keyup",e=>{KEY[e.code]=0;if(e.code==="Space"||e.code==="KeyJ")atkKey=false});
addEventListener("blur",()=>{for(const k in KEY)KEY[k]=0;atkKey=atkBtn=false});
document.addEventListener("pointerdown",()=>auInit(),{capture:true});
let sendT=0,pulse=0;
function updateInput(){const kx=(KEY.ArrowRight||KEY.KeyD?1:0)-(KEY.ArrowLeft||KEY.KeyA?1:0),ky=(KEY.ArrowDown||KEY.KeyS?1:0)-(KEY.ArrowUp||KEY.KeyW?1:0);
 const I=IN[LI()];if(jid!==null){I.mx=JV.x;I.my=JV.y}else{I.mx=kx;I.my=ky}I.atk=atkBtn||atkKey||performance.now()<pulse;I.ab=performance.now()<abT;
 if(role==="guest"&&dc&&dc.readyState==="open"){const n=performance.now();if(n-sendT>50){sendT=n;send({t:"in",mx:+I.mx.toFixed(2),my:+I.my.toFixed(2),atk:I.atk,wsel:I.wsel,ab:I.ab})}}}

/* ---------- rete (WebRTC con codici, fino a 4 telefoni) ---------- */
const ICE={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};
let PEERS=[],pend=null;
function send(o){if(dc&&dc.readyState==="open")try{dc.send(JSON.stringify(o))}catch(e){}}
function sendTo(pr,o){const d=pr&&pr.dc;if(d&&d.readyState==="open")try{d.send(typeof o==="string"?o:JSON.stringify(o))}catch(e){}}
function sendAll(o){const m=JSON.stringify(o);PEERS.forEach(p=>sendTo(p,m))}
function sendSnap(){if(!S||!PEERS.length){OUTEV=[];return}const s=JSON.stringify({t:"snap",ev:OUTEV,s:S},(k,v)=>k==="G"||k==="shops"?undefined:v);OUTEV=[];
 for(const pr of PEERS){if(pr.slot==null||!pr.dc||pr.dc.readyState!=="open")continue;if(pr.gv!==S.gv){pr.gv=S.gv;sendTo(pr,{t:"grid",G:S.G,gv:S.gv})}sendTo(pr,s)}}
function b64e(u8){let s="";for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function b64d(s){s=s.replace(/-/g,"+").replace(/_/g,"/").replace(/=+$/,"");while(s.length%4)s+="=";const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
const slimSdp=sdp=>sdp.split("\r\n").filter(l=>!/^a=(extmap-allow-mixed|msid-semantic)/.test(l)&&!(/^a=candidate/.test(l)&&/ tcp /i.test(l))).join("\r\n");
async function pack(o,extra){const s=JSON.stringify({type:o.type,sdp:slimSdp(o.sdp),...extra});
 if(window.CompressionStream){try{const buf=await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer();return"PESCE2Z"+b64e(new Uint8Array(buf))+"."}catch(e){}}return"PESCE2J"+b64e(new TextEncoder().encode(s))+"."}
async function unpack(txt){txt=String(txt||"");try{txt=decodeURIComponent(txt)}catch(e){}
 const m=txt.match(/PESCE[12]\s*([ZJ])([A-Za-z0-9+\/_=\s-]+)([.~]?)/);if(!m)throw new Error("nocode");if(!m[3]&&/PESCE2/.test(txt))throw new Error("cut");m[2]=m[2].replace(/\s+/g,"");
 let s;try{const u=b64d(m[2]);if(m[1]==="Z"){if(!window.DecompressionStream)throw new Error("old");s=await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text()}else s=new TextDecoder().decode(u)}
 catch(e){throw new Error(e.message==="old"?"old":"broken")}
 let o;try{o=JSON.parse(s)}catch(e){throw new Error("broken")}if(!o||!o.type||!o.sdp)throw new Error("broken");return o}
const codeErr=e=>e.message==="cut"?"Il codice è tagliato: manca la parte finale (termina con un punto). Fallo ricopiare per intero oppure usate il QR.":e.message==="nocode"?"Non trovo il codice: incolla tutto il messaggio ricevuto (il codice inizia con PESCE2).":e.message==="old"?"Questo browser è troppo vecchio per leggere il codice: aggiornalo o usa Chrome.":"Il codice è incompleto o rovinato: fallo ricopiare per intero oppure usate il QR.";
function waitIce(p){return new Promise(r=>{if(p.iceGatheringState==="complete")return r();const tm=setTimeout(r,4000);p.addEventListener("icegatheringstatechange",()=>{if(p.iceGatheringState==="complete"){clearTimeout(tm);r()}})})}
function netStatus(t,cls){const e=$("netS");e.textContent=t;e.className="status "+(cls||"");if(t&&!$("ovNet").hidden)try{e.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(_){}}
function netMark(v){try{v?sessionStorage.setItem("ppr-net",v):sessionStorage.removeItem("ppr-net")}catch(e){}}
function drawQR(cv,text){try{if(typeof qrcode!=="function")throw 0;const q=qrcode(0,"L");q.addData(text);q.make();const n=q.getModuleCount(),cell=Math.max(3,Math.floor(300/(n+8))),W=cell*(n+8);
 cv.width=W;cv.height=W;const c=cv.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,W,W);c.fillStyle="#000";for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))c.fillRect((k+4)*cell,(r+4)*cell,cell,cell);cv.hidden=false}catch(e){cv.hidden=true}}
const joinURL=code=>/^https?:/.test(location.protocol)?location.origin+location.pathname+"#join="+code.replace(/\.$/,"~")+"&r="+CFG.rule:code;
function closePeer(){stopScan();try{dc&&dc.close()}catch(e){}try{pc&&pc.close()}catch(e){}dc=null;pc=null;netLost=false;
 for(const p of PEERS.concat(pend?[pend]:[])){try{p.dc&&p.dc.close()}catch(e){}try{p.pc.close()}catch(e){}}PEERS=[];pend=null}
function wirePc(){pc.onconnectionstatechange=()=>{const s=pc&&pc.connectionState;if(s==="failed"){netStatus("Collegamento non riuscito: controllate di essere sulla stessa rete Wi-Fi e riprovate.","bad");if(S)netLost=true}else if(s==="disconnected"&&S)netLost=true}}
/* telefono di chi si unisce */
function wireDc(){dc.onopen=()=>{netLost=false;netMark(null);stopScan();netStatus("Collegato! Aspetta che chi ha creato la partita la faccia partire.","good");send({t:"hello",name:names()[CFG.solo],hero:CFG.solo,team:CFG.teams[CFG.solo]})};
 const my=dc;dc.onmessage=e=>{if(my!==dc)return;let m;try{m=JSON.parse(e.data)}catch(_){return}guestMsg(m)};dc.onclose=()=>{if(S){netLost=true;showToast("Collegamento perso con chi ha creato la partita")}}}
function guestMsg(m){if(role!=="guest")return;
 if(m.t==="you"){MYI=m.i|0;if(m.gid&&USER){const g=games();if(!g[m.gid]){g[m.gid]={id:m.gid,type:"ON",alias:m.alias||"Partita",rule:m.rule,when:Date.now(),S:null,members:[],guest:true}}else g[m.gid].when=Date.now();putGames(g)}}
 else if(m.t==="lobby")netStatus(`Collegato! Siete in ${m.n|0}. Aspetta che chi ha creato la partita la faccia partire.`,"good");
 else if(m.t==="grid")GRID={G:m.G,gv:m.gv};
 else if(m.t==="snap"){const s=m.s;s.G=GRID&&GRID.gv===s.gv?GRID.G:(S?S.G:null);if(!s.G)return;S=s;if(!$("ovNet").hidden||!$("ovMenu").hidden)hide("ovNet","ovMenu");(m.ev||[]).forEach(playFx)}
 else if(m.t==="hs")hsStore(hsMerge(hsLoad(),m.add||[]));
 else if(m.t==="saved"){if(!$("ovSave").hidden)savedMsg(true)}}
/* telefono di chi crea la partita */
function hostMsg(p,m){
 if(m.t==="hello"){p.hello=true;p.name=String(m.name||"Amico").slice(0,14);p.hero=cl(m.hero|0,0,3);p.team=m.team?1:0;renderLobby()}
 else if(!S||p.slot==null)return;
 else if(m.t==="in"){const I=IN[p.slot];I.mx=cl(+m.mx||0,-1,1);I.my=cl(+m.my||0,-1,1);I.atk=!!m.atk;I.ab=!!m.ab;I.wsel=cl(m.wsel|0,0,2)}
 else if(m.t==="buy"&&typeof m.id==="string")buy(m.id,p.slot);
 else if(m.t==="shop"){const q=S.players[p.slot];if(q)q.shop=!!m.v}
 else if(m.t==="save"){const ok=save();if(ok){sendAll({t:"saved"});showToast(`${S.players[p.slot].name} ha salvato la partita`);if(!$("ovSave").hidden)savedMsg(true)}}}
function peerLost(p){if(p.lost)return;p.lost=true;const pl=S&&p.slot!=null?S.players[p.slot]:null;
 if(!S){PEERS=PEERS.filter(q=>q!==p);renderLobby();return}
 showToast(`${pl?pl.name:"Un giocatore"} si è scollegato`);if(pl){pl.away=true;IN[p.slot]={mx:0,my:0,atk:false,wsel:0}}}
function renderLobby(){const nm=names(),list=[`<span>1 · ${esc(nm[CFG.solo])} (tu)</span>`].concat(PEERS.map((p,k)=>`<span>${k+2} · ${p.hello?esc(p.name):"…"}${CFG.rule==="squadre"&&p.hello?(p.team?" 🐧":" 🦭"):""}</span>`));
 $("netList").innerHTML=list.join("");const n=PEERS.filter(p=>p.hello).length;$("bStart").disabled=!n;$("bStart").textContent=n?`Inizia la partita in ${n+1}`:"Inizia la partita";
 $("netStep").hidden=PEERS.length>=3;sendAll({t:"lobby",n:PEERS.length+1})}
function wireHostPeer(p){
 p.pc.onconnectionstatechange=()=>{const s=p.pc.connectionState;if(s==="failed"&&pend===p)netStatus("Collegamento non riuscito: controllate di essere sulla stessa rete Wi-Fi e riprovate con «Ricrea».","bad");if((s==="failed"||s==="disconnected"||s==="closed")&&PEERS.includes(p))peerLost(p)};
 p.dc.onopen=()=>{if(pend===p)pend=null;if(!PEERS.includes(p))PEERS.push(p);netMark(null);stopScan();sfx("pick");renderLobby();if(!S&&PEERS.length<3)newOffer();else if(PEERS.length>=3)netStatus("Siete in 4: tocca «Inizia la partita».","good")};
 p.dc.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(_){return}hostMsg(p,m)};
 p.dc.onclose=()=>{if(PEERS.includes(p))peerLost(p)}}
async function newOffer(){if(pend){try{pend.pc.close()}catch(e){}pend=null}
 $("codeOut").value="";$("codeIn").value="";$("qrOut").hidden=true;if(PEERS.length>=3)return;netStatus("Preparo il codice…");
 try{const p={pc:new RTCPeerConnection(ICE),id:Math.random().toString(36).slice(2,8)};pend=p;p.dc=p.pc.createDataChannel("pesce");wireHostPeer(p);
  await p.pc.setLocalDescription(await p.pc.createOffer());await waitIce(p.pc);if(pend!==p)return;
  const code=await pack(p.pc.localDescription,{id:p.id});$("codeOut").value=code;drawQR($("qrOut"),joinURL(code));netMark("host");
  netStatus(PEERS.length?`Collegati in ${PEERS.length+1}! Per aggiungere un altro giocatore fategli inquadrare il nuovo QR, altrimenti tocca «Inizia la partita».`:"Codice pronto: fallo inquadrare o mandalo a chi vuole giocare.",PEERS.length?"good":"")}
 catch(e){netStatus("Qui il gioco con più telefoni non è disponibile: apri il gioco dal suo indirizzo GitHub in Chrome o Safari.","bad")}}
async function hostStart(force){if(role!=="host"){closePeer();role="host"}
 if(!force&&pend&&pend.pc.signalingState==="have-local-offer"&&$("codeOut").value){netStatus("Codice pronto: fallo inquadrare o mandalo a chi vuole giocare.");renderLobby();return}
 renderLobby();await newOffer()}
async function hostLink(){let o;try{o=await unpack($("codeIn").value)}catch(e){return netStatus(codeErr(e),"bad")}
 if(o.type!=="answer")return netStatus("Questo è il codice della partita, non la risposta: serve il codice che ti rimanda l'altro telefono.","bad");
 const p=pend;if(!p||p.pc.signalingState!=="have-local-offer")return netStatus("Questa partita non aspetta più una risposta (forse la pagina si è ricaricata): tocca «Ricrea» e rifate lo scambio.","bad");
 if(o.re&&o.re!==p.id)return netStatus("Questa risposta è stata creata da un codice vecchio, non da quello che vedi qui sopra. Fai inquadrare all'altro telefono il QR attuale e rifate la risposta.","bad");
 try{await p.pc.setRemoteDescription({type:o.type,sdp:o.sdp});netStatus("Collegamento in corso…");clearTimeout(linkT);linkT=setTimeout(()=>{if(pend===p&&p.pc.connectionState!=="connected"&&!$("ovNet").hidden)netStatus("I telefoni non riescono a parlarsi: controllate che siano sulla stessa rete Wi-Fi (non con i dati mobili) e riprovate con «Ricrea».","bad")},15000)}catch(e){netStatus("La risposta non corrisponde a questa partita: è stata creata da un codice vecchio. Tocca «Ricrea» e rifate lo scambio dall'inizio.","bad")}}
function startNet(){const ready=PEERS.filter(p=>p.hello&&p.dc.readyState==="open");if(!ready.length)return;
 if(pend){try{pend.pc.close()}catch(e){}pend=null}
 const nm=names(),want=[{hero:CFG.solo,name:nm[CFG.solo],team:CFG.teams[CFG.solo]}].concat(ready.map(p=>({hero:p.hero,name:p.name,team:p.team})));
 const seen={};want.forEach(w=>{const k=w.name.toLowerCase();if(seen[k])w.name=(w.name+" "+(++seen[k])).slice(0,14);else seen[k]=1});
 let slots;if(CFG.cont){slots=restoreGame(CFG.cont,"coop",want);CFG.cont=null}else{newRun({mode:"coop",rule:CFG.rule,list:want});slots=want.map((w,k)=>k)}
 MYI=slots[0];bindGame();PEERS=ready;ready.forEach((p,k)=>{p.slot=slots[k+1];p.gv=-1;sendTo(p,{t:"you",i:p.slot,gid:S.gid,alias:S.alias,rule:S.rule})});
 lastPhase=null;netMark(null);hide("ovNet","ovMenu")}
let linkT=0;
async function guestAnswer(){{const rq=(/&r=(\w+)/.exec($("gIn").value)||[])[1];if(RULEN[rq])CFG.rule=rq}let off;try{off=await unpack($("gIn").value)}catch(e){return netStatus(codeErr(e),"bad")}
 if(off.type!=="offer")return netStatus("Questo è un codice di risposta: serve il codice della partita creato dall'altro telefono.","bad");
 try{closePeer();role="guest";pc=new RTCPeerConnection(ICE);wirePc();pc.ondatachannel=e=>{dc=e.channel;wireDc()};
  await pc.setRemoteDescription({type:off.type,sdp:off.sdp});await pc.setLocalDescription(await pc.createAnswer());netStatus("Preparo la risposta…");await waitIce(pc);
  const code=await pack(pc.localDescription,{re:off.id||""});$("gOut").value=code;drawQR($("qrG"),code);netMark("guest");netStatus("Fai inquadrare questo QR a chi ha creato la partita (o mandagli il codice), poi aspetta.","good")}
 catch(e){netStatus("Non riesco a usare questo codice: fatelo ricreare a chi ha creato la partita.","bad")}}
function openNet(r,code){$("ovNet").hidden=false;document.querySelectorAll("#netRole button").forEach(b=>b.classList.toggle("sel",b.dataset.r===r));$("netHost").hidden=r!=="host";$("netGuest").hidden=r!=="guest";
 if(r==="host")hostStart();else{if(role==="host")closePeer();role="guest";if(code){$("gIn").value=code;guestAnswer()}else if(!$("gOut").value){$("gIn").value="";$("qrG").hidden=true;netStatus("Inquadra il QR della partita o incolla il codice ricevuto.")}}}
document.querySelectorAll("#netRole button").forEach(b=>b.onclick=()=>openNet(b.dataset.r));
$("bStart").onclick=startNet;
/* scanner QR con la fotocamera */
let scanStream=null,scanRAF=0;
async function startScan(onCode){const box=$("scanBox"),v=$("scanV"),st=$("scanS");if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return netStatus("Su questo dispositivo non posso usare la fotocamera: incolla il codice.","bad");
 box.hidden=false;st.textContent="Apro la fotocamera…";
 try{scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1080}},audio:false});v.srcObject=scanStream;await v.play()}
 catch(e){box.hidden=true;scanStream=null;return netStatus("Non riesco ad aprire la fotocamera (permesso negato?): consenti la fotocamera nelle impostazioni del browser oppure incolla il codice.","bad")}
 st.textContent="Inquadra il QR dell'altro telefono, a 15-25 cm";
 let det=null;try{if("BarcodeDetector"in window&&(await BarcodeDetector.getSupportedFormats()).includes("qr_code"))det=new BarcodeDetector({formats:["qr_code"]})}catch(e){}
 const cn=document.createElement("canvas"),c2=cn.getContext("2d",{willReadFrequently:true}),t0=performance.now();let n=0,busy=false,seen=false;
 const done=txt=>{if(!/PESCE[12]/.test(txt)){if(!seen){seen=true;st.textContent="Questo QR non è della Principessa dei Pesci Rossi: inquadra quello mostrato dall'altro telefono."}return false}stopScan();sfx("pick");onCode(txt);return true};
 const loop=async()=>{if(!scanStream)return;scanRAF=requestAnimationFrame(loop);if(busy||v.readyState<2||!v.videoWidth)return;busy=true;n++;
  try{if(det){const r=await det.detect(v);if(r&&r.length&&done(r[0].rawValue))return}
   if(typeof jsQR==="function"){const vw=v.videoWidth,vh=v.videoHeight,crop=n%2===0,sd=crop?Math.min(vw,vh)*.8:Math.max(vw,vh),sx=crop?(vw-sd)/2:0,sy=crop?(vh-sd)/2:0,sw=crop?sd:vw,sh=crop?sd:vh,k=Math.min(1,1000/Math.max(sw,sh));
    cn.width=sw*k|0;cn.height=sh*k|0;c2.drawImage(v,sx,sy,sw,sh,0,0,cn.width,cn.height);const r=jsQR(c2.getImageData(0,0,cn.width,cn.height).data,cn.width,cn.height,{inversionAttempts:n%6===0?"attemptBoth":"dontInvert"});if(r&&done(r.data))return}}catch(e){}
  if(!seen&&performance.now()-t0>7000)st.textContent="Non lo trovo ancora: avvicina o allontana il telefono, alza la luminosità dell'altro schermo e tocca il suo QR per ingrandirlo.";
  busy=false};loop()}
function stopScan(){cancelAnimationFrame(scanRAF);if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null}const b=$("scanBox");if(b)b.hidden=true}
$("bScanH").onclick=()=>startScan(code=>{$("codeIn").value=code;hostLink()});
$("bScanG").onclick=()=>startScan(code=>{$("gIn").value=code;guestAnswer()});
$("bScanX").onclick=stopScan;
for(const id of["qrOut","qrG"])$(id).addEventListener("click",()=>{const src=$(id),big=$("qrBigC");big.width=src.width;big.height=src.height;big.getContext("2d").drawImage(src,0,0);$("qrBig").hidden=false});
$("qrBig").onclick=()=>{$("qrBig").hidden=true};$("bRedo").onclick=()=>newOffer();
async function copyText(id,btn){const v=$(id).value;if(!v)return;let ok=false;try{await navigator.clipboard.writeText(v);ok=true}catch(e){const ta=$(id);ta.focus();ta.select();try{ok=document.execCommand("copy")}catch(_){}}
 btn.textContent=ok?"Copiato!":"Selezionato";setTimeout(()=>btn.textContent="Copia",1800)}
async function shareText(id,cb){const v=$(id).value;if(!v)return;const text=id==="codeOut"&&/^https?:/.test(location.protocol)?"Unisciti alla mia partita della Principessa dei Pesci Rossi: "+joinURL(v):v;
 if(navigator.share){try{await navigator.share({text})}catch(e){}}else copyText(id,$(cb))}
$("bLink").onclick=hostLink;$("bAnswer").onclick=guestAnswer;
$("cpOut").onclick=e=>copyText("codeOut",e.currentTarget);$("cpG").onclick=e=>copyText("gOut",e.currentTarget);
$("shOut").onclick=()=>shareText("codeOut","cpOut");$("shG2").onclick=()=>shareText("gOut","cpG");
$("bNetX").onclick=()=>{closePeer();netMark(null);role=null;$("ovNet").hidden=true;$("ovMenu").hidden=false;refreshMenu()};
/* invito tramite link (#join=...) e avviso se la pagina si è ricaricata durante il collegamento */
(()=>{const h=location.hash;if(h.startsWith("#join=")){{const[cd,rq]=h.slice(6).split("&r=");CFG.join=cd.replace(/~$/,".");if(RULEN[rq])CFG.rule=rq}CFG.mode="coop";try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}}
 let mk=null;try{mk=sessionStorage.getItem("ppr-net")}catch(e){}if(mk&&!CFG.join){netMark(null);CFG.reloaded=true}})();

/* ---------- accesso, iscrizione, dati personali ---------- */
const HEROP=["Ragazzo con la felpa","Ragazza dai capelli viola","Mamma con le trecce bionde","Papà del fai da te"];
document.querySelectorAll(".picker").forEach(pk=>{pk.innerHTML=HEROP.map((n,i)=>`<button type="button" aria-label="${n}"><canvas></canvas></button>`).join("");
 pk.querySelectorAll("button").forEach((b,i)=>b.onclick=()=>{pk.dataset.sel=i})});
function drawPickers(){const t=performance.now();document.querySelectorAll(".picker").forEach(pk=>{if(!pk.offsetParent)return;const sel=+pk.dataset.sel;pk.querySelectorAll("button").forEach((b,i)=>{b.classList.toggle("sel",i===sel);const el=b.firstElementChild,w=el.clientWidth,h=el.clientHeight;if(!w)return;
 const px=Math.round(w*dpr),py=Math.round(h*dpr);if(el.width!==px||el.height!==py){el.width=px;el.height=py}const c=el.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);const s=Math.min(h/64,w/40);c.save();c.translate(w/2,h*.7);c.scale(s*(i%2?-1:1),s);drawKid(c,t+i*400,{hero:i,look:"boy",walk:i===sel?t/140:0});c.restore()})})}
let lgMode="in";
function lgSet(m){lgMode=m;document.querySelectorAll("#lgTab button").forEach(b=>b.classList.toggle("sel",b.dataset.t===m));$("lgUp").hidden=m!=="up";$("lgP").autocomplete=m==="up"?"new-password":"current-password";$("bLogin").textContent=m==="up"?"Iscriviti e gioca":"Accedi";$("lgS").textContent="";$("lgS").className="status"}
document.querySelectorAll("#lgTab button").forEach(b=>b.onclick=()=>lgSet(b.dataset.t));
const lgErr=m=>{$("lgS").textContent=m;$("lgS").className="status bad"};
function showLogin(){USER=null;$("ovMenu").hidden=true;hide("ovProf");$("lgP").value="";$("lgP2").value="";$("ovLogin").hidden=false;lgSet(Object.keys(users()).length?"in":"up")}
function setUser(u){const old=USER&&USER.id;USER={id:u.id,key:ukey(u.id),hero:u.hero};try{localStorage.setItem(SSK,USER.key)}catch(e){}CFG.solo=u.hero;
 for(let i=0;i<4;i++){const el=$("n"+(i+1));if(i===u.hero){el.value=u.id;el.readOnly=true}else{el.readOnly=false;if(old&&el.value===old)el.value=DEFN[i]}}
 CFG.sel=old?[u.hero,...CFG.sel.filter(h=>h!==u.hero)].slice(0,4):[u.hero,u.hero===0?1:0];if(CFG.sel.length<2)CFG.sel.push(u.hero===0?1:0);CFG.sel.sort()}
function enterMenu(){$("ovLogin").hidden=true;CFG.gid=null;CFG.alias=null;$("ovMenu").hidden=false;refreshMenu()}
function adoptLegacy(){let sv=null;try{sv=JSON.parse(localStorage.getItem("ppr-save4"))||migrate(JSON.parse(localStorage.getItem("ppr-save3")))}catch(e){}
 if(!sv||!sv.S)return;const S0=sv.S,ty=typeOf(S0.mode||"solo"),id=newGid(ty);S0.gid=id;S0.alias="Partita salvata";const g=games();
 g[id]={id,type:ty,alias:"Partita salvata",rule:S0.rule||"insieme",when:sv.when||Date.now(),S:S0,members:(S0.players||[]).map(p=>({name:p.name,hero:p.hero,team:p.team|0}))};putGames(g);try{localStorage.removeItem("ppr-save4");localStorage.removeItem("ppr-save3")}catch(e){}}
async function doLogin(){const id=$("lgN").value.trim().replace(/\s+/g," "),pw=$("lgP").value,key=ukey(id),us=users();
 if(id.length<2)return lgErr("Scrivi il nome utente (almeno 2 lettere).");if(/[<>&"]/.test(id))return lgErr("Nel nome non si possono usare i simboli < > & \".");
 if(pw.length<4)return lgErr("La password deve avere almeno 4 caratteri.");
 $("bLogin").disabled=true;try{
  if(lgMode==="up"){if(us[key])return lgErr("Questo nome utente esiste già: scegline un altro oppure accedi.");if(pw!==$("lgP2").value)return lgErr("Le due password non sono uguali.");
   const salt=Math.random().toString(36).slice(2),hash=await hashPw(pw,salt),first=!Object.keys(us).length;us[key]={id,hero:+$("pkR").dataset.sel,salt,hash,created:Date.now()};
   if(!jset(UK,us))return lgErr("Non riesco a salvare l'account su questo dispositivo.");setUser(us[key]);if(first)adoptLegacy();enterMenu()}
  else{const u=us[key];if(!u||u.hash!==await hashPw(pw,u.salt))return lgErr("Nome utente o password non corretti.");setUser(u);enterMenu()}}finally{$("bLogin").disabled=false}}
$("bLogin").onclick=doLogin;for(const id of["lgN","lgP","lgP2"])$(id).addEventListener("keydown",e=>{if(e.key==="Enter")doLogin()});
$("bOut").onclick=()=>{try{localStorage.removeItem(SSK)}catch(e){}USER=null;CFG.gid=null;CFG.join=null;showLogin();$("lgN").value=""};
function openProf(){const u=users()[USER.key];$("pfId").textContent=USER.id;$("pkP").dataset.sel=u.hero;for(const i of["pfO","pfN","pfN2"])$(i).value="";$("pfS").textContent="";$("pfS").className="status";$("ovProf").hidden=false}
$("bProf").onclick=openProf;$("bProfX").onclick=$("bProfClose").onclick=()=>{$("ovProf").hidden=true};
$("bProfSave").onclick=async()=>{const us=users(),u=us[USER.key],op=$("pfO").value,np=$("pfN").value,np2=$("pfN2").value,say=(m,ok)=>{$("pfS").textContent=m;$("pfS").className="status "+(ok?"good":"bad")};
 if(np||np2||op){if(!op)return say("Scrivi la password attuale per cambiarla.");if(u.hash!==await hashPw(op,u.salt))return say("La password attuale non è corretta.");if(np.length<4)return say("La nuova password deve avere almeno 4 caratteri.");if(np!==np2)return say("Le due nuove password non sono uguali.");
  u.salt=Math.random().toString(36).slice(2);u.hash=await hashPw(np,u.salt)}
 u.hero=+$("pkP").dataset.sel;us[USER.key]=u;if(!jset(UK,us))return say("Non riesco a salvare su questo dispositivo.");setUser(u);refreshMenu();say("Dati salvati ✓",true);for(const i of["pfO","pfN","pfN2"])$(i).value=""};
(()=>{let k=null;try{k=localStorage.getItem(SSK)}catch(e){}const u=k&&users()[k];if(u){setUser(u);enterMenu()}else showLogin()})();

/* ---------- app installabile (PWA) ---------- */
let instEvt=null;
addEventListener("beforeinstallprompt",ev=>{ev.preventDefault();instEvt=ev;$("bInst").hidden=false});
addEventListener("appinstalled",()=>{instEvt=null;$("bInst").hidden=true;showToast("Gioco installato! Lo trovi tra le app")});
$("bInst").onclick=async()=>{if(!instEvt)return;instEvt.prompt();try{await instEvt.userChoice}catch(e){}instEvt=null;$("bInst").hidden=true};
if("serviceWorker"in navigator&&/^https:|^http:\/\/localhost/.test(location.href))addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})});
/* ---------- avvio ---------- */
muteIcons();wIcons(false);refreshMenu();resize();ringHome();requestAnimationFrame(frame);
