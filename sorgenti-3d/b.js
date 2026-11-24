const TS=40,PI=Math.PI,SOLID="#SRPCOTALK=F1234VWhGJ",DOORS={Q:1,U:2,Y:3,Z:4,X:5,H:6,N:7};
const $=id=>document.getElementById(id);
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const dist=(a,b,x,y)=>Math.hypot(a-x,b-y);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295}

const LV=[{name:"Hall del centro commerciale",kind:"hall",floor:["#efe9df","#e4ddd0"],wall:"#4b5170",top:"#7c83a3",acc:"#ffc93c",intro:""},
 {name:"Moda & Stile",kind:"shelves",floor:["#f4e6ef","#ead6e3"],wall:"#7a4a6e",top:"#b67aa5",acc:"#ff6fae",
  intro:"Il negozio di vestiti è un disastro! Riporta ogni capo sullo scaffale del suo colore. La commessa ti insegue: se ti prende resti stordito e perdi il vestito. Colpiscila e resterà stordita per qualche secondo."},
 {name:"Pizzeria da Gennaro",kind:"pizza",floor:["#f1d9b5","#e6c89c"],wall:"#8a3b22",top:"#c8673e",acc:"#e63946",
  intro:"Prendi le pizze dal forno a legna e portale ai tavoli che mostrano il fumetto con la pizza. Il pizzaiolo lancia pizze roteanti: se ti prendono perdi energia!"},
 {name:"Pasticceria Dolce Vita",kind:"pastry",floor:["#dff6ee","#fbe3ee"],wall:"#6e4a7a",top:"#b58ac9",acc:"#ff8cc0",
  intro:"Raccogli 20 pasticcini senza farti prendere dalla pasticcera, che lancia torte appiccicose. Attento alle bucce di banana: si scivola!"},
 {name:"Zoo Planet",kind:"ark",floor:["#d9f1e4","#c7e8d6"],wall:"#2f6b5a",top:"#4fa88c",acc:"#2fcf98",
  intro:"Liberate le 10 coppie di animali dell'Arca di Noè! Colpite i commessi travestiti: vi danno la chiave dell'animale che ricordano. Attenti ai pappagalli in volo, la loro cacca sporca l'acqua del pesce. I gatti non vi fanno male ma rubano la pappa al pesce."},
 {name:"Sushi Samurai",kind:"boss",floor:["#3a2a24","#33251f"],wall:"#1d1412",top:"#5a3a2c",acc:"#ff3b3b",
  intro:"Il volantino è completo: il ristorante sushi è aperto! Sconfiggi i camerieri ninja e il terribile Cuoco del Sushi coi coltelli affilati, poi libera la principessa dei pesci rossi."}];

LV[6]={name:"Il Mondo dei Pesci",kind:"fishing",floor:["#bfe6f2","#acdcec"],wall:"#1f5a7a",top:"#3f8fb5",acc:"#3fa9f5",
 intro:"Pesca dalla grande boccia! Le frecce orientano la canna, l'asciugamano lancia l'amo. Evita murena (scossa), topo (mangia la pappa del pesce rosso), scarpone e lattina di pelati. La saponetta scaccia i gatti che rubano dal cesto, il chewing-gum ti fa uscire vendendo i pesci pescati."};
LV[7]={name:"Parcheggio — Gara di carrelli",kind:"race",floor:["#4a4d57","#454852"],wall:"#2f7a45",top:"#3f8f55",acc:"#ff9a2e",intro:"Gara di carrelli nel parcheggio! Guidate con la levetta (l'acceleratore è automatico), raccogliete i ? per saponette razzo, gomma gigante, turbo e bolla scudo. Chi viene colpito gira su se stesso e rallenta. Il bambino, il poliziotto e la vecchietta sui carrelli corrono contro di voi ma non possono vincere. Con un solo telefono a turni vince il miglior tempo. Il tasto 🚪 abbandona la corsa. Chi vince guadagna 25 monete."};
LV[8]={name:"Parcheggio — Liberiamo l'uscita",kind:"puzzle",floor:["#4a4d57","#454852"],wall:"#2f7a45",top:"#3f8f55",acc:"#ffd23c",intro:"Il Cuoco è sconfitto, ma il parcheggio è pieno di auto! Sposta le macchine per far passare quella rossa fino alla strada: 5 posti, ognuno con un puzzle diverso."};
/* Enemy definitions (valori al livello 1) */
const EN={
 g:{name:"Guardia",type:"melee",hp:60,spd:2.1,dmg:12,cd:1.3,aggro:7,coins:[3,5],r:.34},
 v:{name:"Vecchietta",type:"melee",hp:40,spd:1.3,dmg:10,cd:1.5,aggro:6,coins:[2,4],r:.32},
 b:{name:"Bambino nel carrello",type:"cart",hp:50,spd:1.4,dmg:15,cd:1,aggro:8,coins:[3,6],r:.38},
 c:{name:"Commessa",type:"chaser",hp:1,spd:2.8,dmg:8,cd:2,aggro:9,stunOnly:4,r:.32},
 z:{name:"Pizzaiolo",type:"thrower",hp:1,spd:1.1,dmg:10,cd:2.0,aggro:10,stunOnly:4,proj:"pizza",r:.34},
 t:{name:"Pasticcera",type:"thrower",hp:1,spd:1.6,dmg:10,cd:2.6,aggro:9,stunOnly:4,proj:"cake",chase:true,r:.34},
 k:{name:"Gatto",type:"cat",hp:1,spd:3.4,dmg:0,cd:1,aggro:7,r:.28},
 w:{name:"Commesso dello zoo",type:"clerk",hp:30,spd:2.3,dmg:0,cd:1,aggro:4,coins:[2,3],r:.32},
 n:{name:"Cameriere ninja",type:"ninja",hp:55,spd:2.8,dmg:12,cd:2.2,aggro:10,coins:[4,7],proj:"chop",r:.32},
 B:{name:"Cuoco del Sushi",type:"boss",hp:650,spd:2.0,dmg:15,cd:1.6,aggro:30,coins:[0,0],r:.55}};

/* Scaffali del negozio Tutto a Tutti Pure i Tetti */
const CAT=[{id:"pesce",name:"Per il pesce",icon:"food",ids:["food","water","pr","pb","pg","po"]},{id:"armi",name:"Armi",icon:"towel",ids:["towel","lav","mega"]},{id:"mun",name:"Munizioni",icon:"soap",ids:["soap","gum"]},
 {id:"ris",name:"Ristoro e vite",icon:"heart",ids:["snack","heart","shoes"]}];
/* Animali dell'Arca di Noè (Zoo Planet) */
const SP=[{n:"leoni",c:"#f4a62a"},{n:"elefanti",c:"#8d97ad"},{n:"giraffe",c:"#e8b71c"},{n:"zebre",c:"#3a3a48"},{n:"pinguini",c:"#2f6bd8"},{n:"scimmie",c:"#8a5a2b"},{n:"conigli",c:"#ff7eb6"},{n:"tartarughe",c:"#2f9a4a"},{n:"pappagalli",c:"#e63946"},{n:"orsi",c:"#6b4423"}];
const CLERK_SP=[3,7,0,5,9,1,8,2,6,4];
/* Shop */
const SHOP=[
 {id:"pr",name:"Pozione rossa",desc:"Spruzzo bollente, danno doppio per 60 s",price:10,icon:"pr"},
 {id:"pb",name:"Pozione blu",desc:"Spruzzo gelato che rallenta, 60 s",price:10,icon:"pb"},
 {id:"pg",name:"Pozione verde",desc:"Acqua appiccicosa, danno continuo, 60 s",price:12,icon:"pg"},
 {id:"po",name:"Pozione oro",desc:"Il pesce spara il doppio, 60 s",price:14,icon:"po"},
 {id:"soap",name:"Saponette ×15",desc:"Munizioni da lancio",price:6,icon:"soap"},
 {id:"gum",name:"Chewing-gum ×3",desc:"Esplosivi appiccicosi",price:10,icon:"gum"},
 {id:"snack",name:"Merendina",desc:"Ridà 40 di energia a chi la compra",price:8,icon:"snack"},
 {id:"food",name:"Mangime",desc:"Pappa per il pesce +40",price:5,icon:"food"},
 {id:"water",name:"Acqua fresca",desc:"Ricarica la boccia: acqua pulita +50",price:4,icon:"water"},
 {id:"towel",name:"Asciugamano Bagnato",desc:"Arma: frustata più forte",price:30,icon:"towel",up:1},
 {id:"lav",name:"Saponette alla Lavanda",desc:"Arma: più danno e attraversano i nemici",price:35,icon:"soap",up:1},
 {id:"mega",name:"Mega Chewing-gum",desc:"Arma: esplosione più grande",price:40,icon:"gum",up:1},
 {id:"shoes",name:"Scarpe da ginnastica",desc:"Correte più veloci",price:30,icon:"shoes",up:1},
 {id:"heart",name:"Cuore extra",desc:"Una vita in più per la squadra",price:45,icon:"heart"}];
const POT={pr:{name:"rossa",col:"#ff5a4a"},pb:{name:"blu",col:"#5ab8ff"},pg:{name:"verde",col:"#6ee05a"},po:{name:"oro",col:"#ffc93c"}};
const LOOK=[{hood:"#262b36",hood2:"#121419",acc:"#6ff05a",hair:"#2a1d16",skin:"#f2c29b"},{hood:"#ffb703",hood2:"#e08a00",acc:"#fff3c4",hair:"#9b5cff",skin:"#f6cfae"}];

/* ---------- drawing helpers ---------- */
function rr(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function el(c,x,y,rx,ry,f){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,7);c.fillStyle=f;c.fill()}
function ln(c,a,b,x,y){c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke()}
const lg=(c,a,b,x,y,s,e)=>{const g=c.createLinearGradient(a,b,x,y);g.addColorStop(0,s);g.addColorStop(1,e);return g};
const rg=(c,x,y,r0,r1,s,e)=>{const g=c.createRadialGradient(x,y,r0,x,y,r1);g.addColorStop(0,s);g.addColorStop(1,e);return g};
const shadow=(c,rx)=>el(c,0,17,rx,rx*.3,"rgba(0,0,0,.22)");
function star(c,x,y,r,f){c.beginPath();for(let i=0;i<10;i++){const a=i*PI/5-PI/2,q=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}c.closePath();c.fillStyle=f;c.fill()}
function eyes(c,y,sp,col,angry){el(c,-sp,y,1.8,2.3,col||"#2b1a12");el(c,sp,y,1.8,2.3,col||"#2b1a12");el(c,-sp+.6,y-.8,.6,.6,"#fff");el(c,sp+.6,y-.8,.6,.6,"#fff");
 if(angry){c.strokeStyle="#2b1a12";c.lineWidth=1.6;c.lineCap="round";ln(c,-sp-3,y-4.5,-sp+2,y-3);ln(c,sp+3,y-4.5,sp-2,y-3)}}
function legs(c,walk,col,shoe){const s=Math.sin(walk)*3;c.fillStyle=col;rr(c,-7,6+Math.max(0,s)*.3,5,9-s*.4,2);c.fill();rr(c,2,6+Math.max(0,-s)*.3,5,9+s*.4,2);c.fill();
 c.fillStyle=shoe||"#1b1d24";rr(c,-8.5,13.5-s*.2,7.5,4,2);c.fill();rr(c,1,13.5+s*.2,7.5,4,2);c.fill()}
function stars(c,t,y){for(let i=0;i<3;i++){const a=t/250+i*2.1;star(c,Math.cos(a)*10,y+Math.sin(a)*3,3,"#ffe36b")}}

/* Eroi */
function drawKid(c,t,o){if(o.hero===2)return drawMom(c,t,o);if(o.hero===3)return drawDad(c,t,o);
 const L=LOOK[o.hero],walk=o.walk||0,b=Math.sin(t/300)*.6,sw=Math.sin(walk)*3;
 shadow(c,12);
 legs(c,walk,o.hero?"#3b3f6b":"#3a4152",o.hero?"#ff6fae":"#1b1d24");
 if(o.hero===1||o.look==="girl"){c.fillStyle=L.hair;c.beginPath();c.ellipse(o.hero?9:0,-6+b,o.hero?4:10,o.hero?10:7,o.hero?.3:0,0,7);c.fill()}
 c.fillStyle=lg(c,0,-4,0,12,L.hood,L.hood2);rr(c,-10,-4+b,20,15,6);c.fill();
 c.fillStyle="rgba(0,0,0,.16)";rr(c,-6,4+b,12,4.5,2);c.fill();
 c.strokeStyle=L.acc;c.lineWidth=1.2;ln(c,-2.5,-3+b,-2.5,2+b);ln(c,2.5,-3+b,2.5,2+b);
 c.fillStyle=L.hood2;rr(c,-14,-2+b-sw*.3,5,11,2.5);c.fill();rr(c,9,-2+b+sw*.3,5,11,2.5);c.fill();
 c.fillStyle=L.acc;c.fillRect(-13.5,4+b-sw*.3,4,1.6);c.fillRect(9.5,4+b+sw*.3,4,1.6);
 el(c,-11.5,9+b-sw*.3,2.6,2.6,L.skin);el(c,11.5,9+b+sw*.3,2.6,2.6,L.skin);
 const hy=-14+b;
 c.fillStyle=L.hood;c.beginPath();c.ellipse(0,hy+1,13.5,12.5,0,0,7);c.fill();
 c.fillStyle=L.hood2;c.beginPath();c.ellipse(0,hy+1,13.5,12.5,0,.2,PI-.2);c.fill();
 c.beginPath();c.arc(0,hy,10.5,0,7);c.fillStyle=rg(c,-3,hy-4,2,13,"#fde0c4",L.skin);c.fill();
 c.fillStyle=L.hair;c.beginPath();c.ellipse(0,hy-3,10.8,8,0,PI,0);
 if(o.hero===1||o.look==="girl"){c.lineTo(11,hy+5);c.lineTo(8,hy-2);c.lineTo(4,hy-4);c.lineTo(0,hy-3);c.lineTo(-4,hy-4.5);c.lineTo(-8,hy-2);c.lineTo(-11,hy+5)}
 else{c.lineTo(9,hy-3);c.lineTo(5,hy-5);c.lineTo(1,hy-4);c.lineTo(-3,hy-5.4);c.lineTo(-7,hy-4);c.lineTo(-10.8,hy-2)}
 c.closePath();c.fill();
 if(o.hero===1){el(c,-6,hy-7,3,1.4,"rgba(255,255,255,.25)");star(c,7,hy-8,2.6,"#ffc93c")}
 eyes(c,hy+2,4.2);el(c,-7,hy+5,2,1.2,"rgba(255,110,90,.3)");el(c,7,hy+5,2,1.2,"rgba(255,110,90,.3)");
 c.strokeStyle="#8a4b3a";c.lineWidth=1.2;c.beginPath();c.arc(0,hy+5,2.4,.3,PI-.3);c.stroke();
}
/* la mamma con le trecce bionde */
function drawMom(c,t,o){const walk=o.walk||0,b=Math.sin(t/300)*.6,sw=Math.sin(walk)*3,HA="#f5d36a",HD="#d9ab3a",SK="#f6cfae";
 shadow(c,12);legs(c,walk,"#4a6fa5","#f2ede2");
 c.fillStyle=lg(c,0,-6,0,12,"#2fc4b2","#1f9488");rr(c,-10.5,-6+b,21,17,7);c.fill();
 c.fillStyle="#fff";c.beginPath();c.moveTo(-4,-6+b);c.lineTo(0,-1+b);c.lineTo(4,-6+b);c.fill();
 for(let i=0;i<3;i++)el(c,0,1+i*3.4+b,.9,.9,"#fff");
 c.fillStyle="#1f9488";rr(c,-14.5,-4+b-sw*.3,5,12,2.5);c.fill();rr(c,9.5,-4+b+sw*.3,5,12,2.5);c.fill();
 el(c,-12,9+b-sw*.3,2.6,2.6,SK);el(c,12,9+b+sw*.3,2.6,2.6,SK);
 const hy=-17+b;
 for(const s of[-1,1]){c.fillStyle=HA;for(let k=0;k<4;k++)el(c,s*10.5,hy+7+k*4.2,3.1-k*.25,2.6,k%2?HD:HA);el(c,s*10.5,hy+24,2,1.6,"#ff6fae");c.fillStyle=HA;c.beginPath();c.moveTo(s*10.5-1.6,hy+25);c.lineTo(s*10.5,hy+29);c.lineTo(s*10.5+1.6,hy+25);c.fill()}
 c.beginPath();c.arc(0,hy,10.5,0,7);c.fillStyle=rg(c,-3,hy-4,2,13,"#fde4cc",SK);c.fill();
 c.fillStyle=HA;c.beginPath();c.ellipse(0,hy-3,11.4,8.6,0,PI,0);c.lineTo(10,hy+3);c.lineTo(6,hy-3);c.lineTo(1,hy-5.5);c.lineTo(-3,hy-3.5);c.lineTo(-7,hy-2.5);c.lineTo(-10,hy+3);c.closePath();c.fill();
 c.strokeStyle=HD;c.lineWidth=1;c.beginPath();c.moveTo(0,hy-11);c.lineTo(1,hy-5.5);c.stroke();
 eyes(c,hy+2,4.2);c.strokeStyle="#2b1a12";c.lineWidth=1;ln(c,-6.5,hy-.8,-5.2,hy-.2);ln(c,6.5,hy-.8,5.2,hy-.2);
 el(c,-7,hy+5,2,1.2,"rgba(255,110,90,.35)");el(c,7,hy+5,2,1.2,"rgba(255,110,90,.35)");
 c.strokeStyle="#d9485f";c.lineWidth=1.5;c.beginPath();c.arc(0,hy+5,2.4,.3,PI-.3);c.stroke();el(c,-10.6,hy+5,1.1,1.1,"#ffc93c");el(c,10.6,hy+5,1.1,1.1,"#ffc93c")}
/* il papà muscoloso con la maglietta del fai da te */
function drawDad(c,t,o){const walk=o.walk||0,b=Math.sin(t/300)*.6,sw=Math.sin(walk)*3,SK="#e8b48f",TS1="#e8622a",TS2="#c44a18";
 shadow(c,14);legs(c,walk,"#5a5f6b","#7a4a22");
 c.fillStyle=lg(c,0,-7,0,12,TS1,TS2);rr(c,-12.5,-7+b,25,18,7);c.fill();
 c.fillStyle="#3a2a1a";c.fillRect(-12,8+b,24,3);el(c,0,9.5+b,2,1.6,"#c9a26b");
 c.save();c.translate(0,1+b);c.rotate(-.6);c.fillStyle="#fff";c.fillRect(-.9,-5.5,1.8,10);c.fillRect(-3.2,-6.5,6.4,2.6);c.restore();
 c.save();c.translate(0,1+b);c.rotate(.6);c.fillStyle="#fff";c.fillRect(-.9,-4.5,1.8,9);c.beginPath();c.arc(0,-5.2,2.6,0,7);c.fill();c.fillStyle=TS1;c.fillRect(-.8,-8,1.6,3);c.restore();
 for(const s of[-1,1]){const ay=s<0?-sw*.3:sw*.3;c.fillStyle=TS2;rr(c,s>0?11:-17,-6+b,6,6,2.5);c.fill();
  el(c,s*14.5,1+b+ay,4.4,5.6,SK);el(c,s*15.4,-1+b+ay,3,2.6,"#f2c29b");el(c,s*14,9+b+ay,3.1,3.1,SK)}
 const hy=-18+b;
 c.beginPath();c.arc(0,hy,10.5,0,7);c.fillStyle=rg(c,-3,hy-4,2,13,"#f6cfae",SK);c.fill();
 c.fillStyle="rgba(70,45,30,.35)";c.beginPath();c.arc(0,hy+2,10.2,.15,PI-.15);c.fill();
 c.fillStyle="#3b2618";c.beginPath();c.ellipse(0,hy-4,10.8,7.2,0,PI,0);c.lineTo(9,hy-4);c.lineTo(5,hy-6.5);c.lineTo(-1,hy-5.2);c.lineTo(-6,hy-6.6);c.lineTo(-10.8,hy-3);c.closePath();c.fill();
 c.save();c.translate(10,hy-6);c.rotate(.5);c.fillStyle="#ffc93c";c.fillRect(-1.2,-6,2.4,10);c.fillStyle="#3a2a1a";c.fillRect(-1.2,3.5,2.4,1.5);c.restore();
 eyes(c,hy+1,4.2);c.strokeStyle="#3b2618";c.lineWidth=1.8;c.lineCap="round";ln(c,-6.5,hy-3,-2.5,hy-3.4);ln(c,6.5,hy-3,2.5,hy-3.4);
 c.fillStyle="#3b2618";rr(c,-4.5,hy+4,9,2,1);c.fill();
 c.strokeStyle="#7a3b2a";c.lineWidth=1.3;c.beginPath();c.arc(0,hy+6.3,2.4,.3,PI-.3);c.stroke()}
/* Passanti e acquirenti */
const SHIRTS=["#ff6f61","#5ab8ff","#ffc93c","#7bd389","#c77dff","#ff9cc6","#4fe3b5","#f4a261","#8d99ae"],HAIRS=["#2a1d16","#5b3a1f","#c98a3a","#e8d27a","#1b1b1b","#cfcfd8","#a0522d"],SKINS=["#f6cfae","#e8b48f","#c68c64","#8d5a3b","#f2c29b"];
function drawShopper(c,t,o){const b=Math.sin(t/330)*.5;shadow(c,11);legs(c,o.walk||0,o.pants,"#2a2a33");
 if(o.bag){c.fillStyle=o.bag;rr(c,-17,2+b,7,9,1.5);c.fill();c.strokeStyle="rgba(0,0,0,.3)";c.lineWidth=1;c.beginPath();c.arc(-13.5,2+b,2.6,PI,0);c.stroke()}
 c.fillStyle=lg(c,0,-4,0,11,o.shirt,shadeS(o.shirt));rr(c,-10,-4+b,20,14,5);c.fill();
 c.fillStyle=shadeS(o.shirt);rr(c,-13.5,-2+b,4.5,10,2.2);c.fill();rr(c,9,-2+b,4.5,10,2.2);c.fill();
 el(c,-11.2,8.5+b,2.4,2.4,o.skin);el(c,11.2,8.5+b,2.4,2.4,o.skin);
 const hy=-14+b;c.beginPath();c.arc(0,hy,9.5,0,7);c.fillStyle=o.skin;c.fill();
 c.fillStyle=o.old?"#d9d9e2":o.hair;c.beginPath();c.ellipse(0,hy-3,10,7.5,0,PI,0);c.fill();
 if(o.long){c.beginPath();c.ellipse(0,hy+1,10.6,9,0,PI,0);c.lineTo(10.6,hy+7);c.lineTo(7,hy);c.lineTo(-7,hy);c.lineTo(-10.6,hy+7);c.fill()}
 if(o.cap){c.fillStyle=o.cap;c.beginPath();c.ellipse(0,hy-5,10,6,0,PI,0);c.fill();rr(c,2,hy-6,11,2.6,1.3);c.fill()}
 if(o.old){c.strokeStyle="#3a3a48";c.lineWidth=1;c.beginPath();c.arc(-3.6,hy+1,2.4,0,7);c.stroke();c.beginPath();c.arc(3.6,hy+1,2.4,0,7);c.stroke()}
 el(c,-3.6,hy+1,1.4,1.8,"#2b1a12");el(c,3.6,hy+1,1.4,1.8,"#2b1a12");
 c.strokeStyle="#8a4b3a";c.lineWidth=1.1;c.beginPath();c.arc(0,hy+4.5,2,.3,PI-.3);c.stroke()}
function shadeS(h){const n=parseInt(h.slice(1),16);return`rgb(${(n>>16)*.78|0},${(n>>8&255)*.78|0},${(n&255)*.78|0})`}
/* Mostri */
function drawGuard(c,t,o){const b=Math.sin(t/280)*.6;shadow(c,12);legs(c,o.walk||0,"#1f2d55","#111");
 c.fillStyle=lg(c,0,-4,0,12,"#34508f","#22396b");rr(c,-11,-4+b,22,15,5);c.fill();c.fillStyle="#ffc93c";star(c,-5,0+b,2.4,"#ffc93c");
 c.fillStyle="#1d1d22";c.fillRect(-11,7+b,22,2.4);
 c.fillStyle="#22396b";rr(c,-15,-2+b,5,11,2.5);c.fill();rr(c,10,-2+b,5,11,2.5);c.fill();
 c.save();c.translate(13,8+b);c.rotate(o.atk?-1.6+o.atk*2.4:-.5);c.fillStyle="#1a1a1a";rr(c,-1.6,-18,3.2,19,1.5);c.fill();c.restore();
 el(c,12.5,8.5+b,2.6,2.6,"#e8b48f");el(c,-12.5,8.5+b,2.6,2.6,"#e8b48f");
 const hy=-14+b;c.beginPath();c.arc(0,hy,10,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#f6cda9","#dca07a");c.fill();
 c.fillStyle="#1f2d55";rr(c,-11,hy-11,22,7,3);c.fill();c.fillStyle="#141e3d";rr(c,-12,hy-5,24,3,1.5);c.fill();star(c,0,hy-7.5,2.2,"#ffc93c");
 eyes(c,hy+1,4,null,true);c.fillStyle="#3a2418";rr(c,-5,hy+4,10,2.6,1.3);c.fill()}
function drawGranny(c,t,o){const b=Math.sin(t/320)*.6;shadow(c,12);legs(c,o.walk||0,"#6b6b7a","#4a2f22");
 c.fillStyle=lg(c,0,-2,0,12,"#9a6bc9","#6d43a0");rr(c,-11,-2+b,22,14,7);c.fill();c.fillStyle="#c9a5f0";c.beginPath();c.moveTo(-11,0+b);c.lineTo(0,8+b);c.lineTo(11,0+b);c.lineTo(11,-2+b);c.lineTo(-11,-2+b);c.fill();
 c.save();c.translate(12,6+b);c.rotate(o.atk?-1.8+o.atk*2.6:.15);c.strokeStyle="#8a5a2b";c.lineWidth=2.6;c.lineCap="round";ln(c,0,12,0,-14);c.beginPath();c.arc(-3,-14,3,-PI,0);c.stroke();c.restore();
 el(c,12,6+b,2.6,2.6,"#efc6a4");el(c,-12,7+b,2.6,2.6,"#efc6a4");
 const hy=-11+b;el(c,0,hy-10,5,4.5,"#d9d9e2");c.beginPath();c.arc(0,hy,10,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#f8dcc6","#e3b896");c.fill();
 c.fillStyle="#d9d9e2";c.beginPath();c.ellipse(0,hy-3,10.5,7.5,0,PI,0);c.fill();
 c.strokeStyle="#3a3a48";c.lineWidth=1.1;c.beginPath();c.arc(-4,hy+1,2.8,0,7);c.stroke();c.beginPath();c.arc(4,hy+1,2.8,0,7);c.stroke();ln(c,-1.2,hy+1,1.2,hy+1);
 el(c,-4,hy+1,1,1.2,"#2b1a12");el(c,4,hy+1,1,1.2,"#2b1a12");c.strokeStyle="#8a4b3a";c.lineWidth=1.1;ln(c,-2.5,hy+6,2.5,hy+6)}
function drawCartEmpty(c,t,o){const sc=o&&o.s||1;c.save();c.scale(sc,sc);el(c,0,17,15,4,"rgba(0,0,0,.22)");for(const x of[-10,10])el(c,x,15,3,3,"#2a2a33");
 c.fillStyle="rgba(190,200,215,.35)";rr(c,-15,-6,30,17,3);c.fill();c.strokeStyle="#aeb8c8";c.lineWidth=1.5;rr(c,-15,-6,30,17,3);c.stroke();for(let x=-10;x<=10;x+=5)ln(c,x,-6,x,11);ln(c,-15,2,15,2);
 c.strokeStyle="#e63946";c.lineWidth=2.6;c.beginPath();c.moveTo(15,-7);c.lineTo(19,-13);c.stroke();c.restore()}
function drawCart(c,t,o){const b=o.charge?Math.sin(t/40)*.8:0;el(c,0,17,16,4.5,"rgba(0,0,0,.22)");
 c.fillStyle="#2a2a33";for(const x of[-11,11])el(c,x,15,3,3,"#2a2a33");
 const hy=-12+b;c.beginPath();c.arc(0,hy,8.5,0,7);c.fillStyle=rg(c,-3,hy-3,2,10,"#ffe0c2","#f0b98e");c.fill();
 c.fillStyle="#e63946";c.beginPath();c.ellipse(0,hy-4,9,5.5,0,PI,0);c.fill();rr(c,-1,hy-6,12,2.6,1.3);c.fill();
 eyes(c,hy+1,3.4,null,!o.calm);if(o.calm){c.strokeStyle="#7a2f22";c.lineWidth=1.3;c.beginPath();c.arc(0,hy+3.6,2.4,.2,PI-.2);c.stroke()}else{c.fillStyle="#7a2f22";c.beginPath();c.arc(0,hy+4.5,2.2,0,PI);c.fill()}
 c.fillStyle="#f0b98e";el(c,-10,hy-2+Math.sin(t/120)*2,2.4,2.4,"#f0b98e");el(c,10,hy-2-Math.sin(t/120)*2,2.4,2.4,"#f0b98e");
 c.fillStyle="rgba(190,200,215,.35)";rr(c,-15,-5,30,17,3);c.fill();
 c.strokeStyle="#aeb8c8";c.lineWidth=1.4;rr(c,-15,-5,30,17,3);c.stroke();for(let x=-10;x<=10;x+=5)ln(c,x,-5,x,12);ln(c,-15,3,15,3);
 c.strokeStyle="#e63946";c.lineWidth=2.4;ln(c,15,-6,19,-11)}
function drawClerk(c,t,o){const b=Math.sin(t/260)*.6;shadow(c,11);legs(c,o.walk||0,"#2b2b38","#c2185b");
 el(c,7,-14+b,4,9,"#6b3a1f");
 c.fillStyle=lg(c,0,-4,0,12,"#ff4f8b","#c2185b");rr(c,-10,-4+b,20,15,5);c.fill();c.fillStyle="#fff";rr(c,2,-1+b,6,3.4,1);c.fill();
 c.fillStyle="#c2185b";rr(c,-14,-2+b,5,10,2.5);c.fill();rr(c,9,-2+b,5,10,2.5);c.fill();
 c.strokeStyle="#cfd6e0";c.lineWidth=1.4;c.beginPath();c.moveTo(8,10+b);c.lineTo(16,6+b);c.lineTo(20,10+b);c.closePath();c.stroke();ln(c,16,6+b,16,3+b);
 const hy=-14+b;c.beginPath();c.arc(0,hy,10,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#fde0c4","#efbf98");c.fill();
 c.fillStyle="#6b3a1f";c.beginPath();c.ellipse(0,hy-3,10.5,8,0,PI,0);c.lineTo(10.5,hy+2);c.lineTo(7,hy-3);c.lineTo(-7,hy-3);c.lineTo(-10.5,hy+2);c.fill();
 eyes(c,hy+1.5,4,null,true);c.fillStyle="#d1204f";c.beginPath();c.ellipse(0,hy+6,2.6,1.4,0,0,7);c.fill()}
function drawPizzaiolo(c,t,o){const b=Math.sin(t/300)*.6;shadow(c,13);legs(c,o.walk||0,"#3a3a46","#111");
 c.fillStyle=lg(c,0,-4,0,12,"#ffffff","#dfe4ea");rr(c,-12,-4+b,24,16,6);c.fill();c.fillStyle="#e63946";c.beginPath();c.moveTo(-6,-4+b);c.lineTo(0,3+b);c.lineTo(6,-4+b);c.fill();
 c.fillStyle="#dfe4ea";rr(c,-16,-2+b,5,11,2.5);c.fill();rr(c,11,-2+b,5,11,2.5);c.fill();
 if(!o.stun){c.save();c.translate(14,-6+b);c.rotate(t/90);drawPizzaShape(c,7);c.restore()}
 el(c,-13.5,9+b,2.6,2.6,"#efbf98");
 const hy=-14+b;c.beginPath();c.arc(0,hy,10.5,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#fde0c4","#e8b48f");c.fill();
 c.fillStyle="#fff";el(c,0,hy-14,10,7,"#fff");el(c,-6,hy-12,5,5,"#fff");el(c,6,hy-12,5,5,"#fff");rr(c,-10,hy-10,20,5,2);c.fill();
 eyes(c,hy,4.2,null,true);c.fillStyle="#2b1a12";c.beginPath();c.moveTo(-8,hy+5);c.quadraticCurveTo(-4,hy+2,0,hy+4);c.quadraticCurveTo(4,hy+2,8,hy+5);c.quadraticCurveTo(4,hy+7,0,hy+5.5);c.quadraticCurveTo(-4,hy+7,-8,hy+5);c.fill()}
function drawPizzaShape(c,r){c.beginPath();c.arc(0,0,r,0,7);c.fillStyle="#e8a948";c.fill();c.beginPath();c.arc(0,0,r*.82,0,7);c.fillStyle="#e63946";c.fill();
 c.fillStyle="#fff6d8";for(let i=0;i<5;i++){const a=i*1.26;el(c,Math.cos(a)*r*.5,Math.sin(a)*r*.5,r*.18,r*.15,"#fff6d8")}el(c,r*.15,-r*.2,r*.12,r*.12,"#2f8a3a")}
function drawBaker(c,t,o){const b=Math.sin(t/280)*.6;shadow(c,12);legs(c,o.walk||0,"#fff0f6","#ff6fae");
 c.fillStyle=lg(c,0,-4,0,12,"#ffffff","#f3e4ec");rr(c,-11,-4+b,22,16,6);c.fill();c.fillStyle="#ff8cc0";rr(c,-8,-1+b,16,13,4);c.fill();
 c.fillStyle="#f3e4ec";rr(c,-15,-2+b,5,10,2.5);c.fill();rr(c,10,-2+b,5,10,2.5);c.fill();
 if(!o.stun){c.save();c.translate(13,-4+b);drawCakeShape(c,7);c.restore()}
 const hy=-14+b;c.beginPath();c.arc(0,hy,10,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#fde0c4","#efbf98");c.fill();
 c.fillStyle="#f6d06a";c.beginPath();c.ellipse(0,hy-3,10.5,7,0,PI,0);c.fill();
 c.fillStyle="#fff";rr(c,-9,hy-14,18,8,4);c.fill();
 eyes(c,hy+1.5,4,null,true);c.strokeStyle="#c2185b";c.lineWidth=1.3;c.beginPath();c.arc(0,hy+7,2.4,PI+.4,-.4);c.stroke()}
function drawCakeShape(c,r){c.fillStyle="#fff1f6";rr(c,-r,-r*.4,r*2,r*1.2,r*.3);c.fill();c.fillStyle="#ff8cc0";rr(c,-r,-r*.6,r*2,r*.5,r*.25);c.fill();el(c,0,-r*.85,r*.25,r*.25,"#e63946")}
function drawCat(c,t,o){const run=o.walk||0,b=Math.abs(Math.sin(run))*1.5;el(c,0,16,13,3.5,"rgba(0,0,0,.2)");
 c.strokeStyle="#f08a24";c.lineWidth=3.2;c.lineCap="round";c.beginPath();c.moveTo(-10,8);c.quadraticCurveTo(-20,6,-17,-6+Math.sin(t/180)*3);c.stroke();
 c.beginPath();c.ellipse(-1,7-b,12,7.5,0,0,7);c.fillStyle=rg(c,-3,4,2,13,"#ffb15a","#e57a12");c.fill();
 c.strokeStyle="#c75f08";c.lineWidth=1.4;for(const x of[-6,-2,2])ln(c,x,1-b,x+1,6-b);
 c.fillStyle="#f08a24";for(const x of[-8,-3,3,7])rr(c,x,11,3,5,1.5),c.fill();
 const hx=9,hy=-2-b;c.beginPath();c.arc(hx,hy,7.5,0,7);c.fillStyle="#f59a32";c.fill();
 c.fillStyle="#f59a32";c.beginPath();c.moveTo(hx-7,hy-3);c.lineTo(hx-5,hy-11);c.lineTo(hx-1,hy-6);c.fill();c.beginPath();c.moveTo(hx+7,hy-3);c.lineTo(hx+5,hy-11);c.lineTo(hx+1,hy-6);c.fill();
 el(c,hx-2.6,hy,1.4,o.flee?.5:2,"#2d6a1f");el(c,hx+2.6,hy,1.4,o.flee?.5:2,"#2d6a1f");el(c,hx,hy+2.6,1,.8,"#ff8a9a");
 c.strokeStyle="rgba(255,255,255,.8)";c.lineWidth=.7;ln(c,hx+3,hy+3,hx+10,hy+2);ln(c,hx-3,hy+3,hx-10,hy+2)}
function drawNinja(c,t,o){const b=Math.sin(t/220)*.6;shadow(c,11);legs(c,o.walk||0,"#15151c","#0a0a0d");
 c.fillStyle=lg(c,0,-4,0,12,"#26262f","#121218");rr(c,-10,-4+b,20,15,5);c.fill();c.fillStyle="#e63946";c.fillRect(-10,5+b,20,3);
 c.fillStyle="#121218";rr(c,-14,-2+b,5,10,2.5);c.fill();rr(c,9,-2+b,5,10,2.5);c.fill();
 c.save();c.translate(13,4+b);c.rotate(-.6);c.fillStyle="#c9a26b";c.fillRect(-1,-14,1.6,16);c.fillRect(2,-14,1.6,16);c.restore();
 const hy=-14+b;c.beginPath();c.arc(0,hy,10,0,7);c.fillStyle="#1b1b22";c.fill();c.fillStyle="#efbf98";rr(c,-8,hy-2,16,6,3);c.fill();
 eyes(c,hy+1,3.6,null,true);c.fillStyle="#e63946";c.fillRect(-10.5,hy-6,21,2.6);c.beginPath();c.moveTo(10,hy-5);c.lineTo(16,hy-8+Math.sin(t/120)*2);c.lineTo(16,hy-2);c.fill()}
function drawChef(c,t,o){c.save();c.scale(1.45,1.45);const b=Math.sin(t/260)*.7;shadow(c,13);legs(c,o.walk||0,"#2a2a36","#111");
 c.fillStyle=lg(c,0,-4,0,12,"#ffffff","#dde3ea");rr(c,-12,-4+b,24,16,6);c.fill();c.fillStyle="#1d1d22";c.fillRect(-12,6+b,24,2.4);
 for(const s of[-1,1]){c.fillStyle="#dde3ea";rr(c,s>0?11:-16,-2+b,5,10,2.5);c.fill();c.save();c.translate(s*15,6+b);c.rotate(s*(o.atk?-1.2:-.4));
  c.fillStyle=lg(c,-2,0,2,0,"#f4f7fb","#9aa4b6");c.beginPath();c.moveTo(-1.6,0);c.lineTo(-1.6,-16);c.quadraticCurveTo(2.5,-12,1.8,0);c.fill();c.fillStyle="#3a2a1a";c.fillRect(-2,0,4,6);c.restore()}
 const hy=-14+b;c.beginPath();c.arc(0,hy,10.5,0,7);c.fillStyle=rg(c,-3,hy-4,2,12,"#fde0c4","#e8b48f");c.fill();
 c.fillStyle="#1d1d22";c.beginPath();c.ellipse(0,hy-4,10.8,7,0,PI,0);c.fill();
 c.fillStyle="#fff";c.fillRect(-11,hy-6,22,4);el(c,0,hy-4,2.2,2.2,"#e63946");c.beginPath();c.moveTo(10,hy-5);c.lineTo(17,hy-9);c.lineTo(16,hy-2);c.fill();
 eyes(c,hy+1.5,4.2,null,true);c.strokeStyle="#2b1a12";c.lineWidth=1.4;c.beginPath();c.arc(0,hy+8,3,PI+.4,-.4);c.stroke();c.restore()}
function drawFishBody(c,t,col,s){s=s||1;c.save();c.scale(s,s);const w=Math.sin(t/120)*2;
 c.fillStyle="#ff9a2e";c.beginPath();c.moveTo(-4,0);c.lineTo(-10,-5+w);c.lineTo(-10,5+w);c.fill();c.beginPath();c.moveTo(-1,-3.5);c.lineTo(2,-7);c.lineTo(4,-3.5);c.fill();
 c.beginPath();c.ellipse(1,0,6.5,4.6,0,0,7);c.fillStyle=lg(c,0,-4,0,4,"#ffc04a",col||"#f07c12");c.fill();el(c,4,-1,1.2,1.2,"#1a1a1a");el(c,4.3,-1.4,.4,.4,"#fff");c.restore()}
function waterCol(w){const A=[[127,211,255],[110,200,95],[128,84,40]],t=cl(1-w/100,0,1),i=t<.5?0:1,f=t<.5?t*2:(t-.5)*2;return"rgb("+A[i].map((v,k)=>Math.round(v+(A[i+1][k]-v)*f)).join(",")+")"}
function drawBowl(c,t,water,potion,sick){const wc=waterCol(water);
 el(c,0,15,12,3,"rgba(0,0,0,.2)");
 if(potion){const pc=POT[potion].col;c.fillStyle=rg(c,0,0,8,24,pc+"aa",pc+"00");c.beginPath();c.arc(0,0,24,0,7);c.fill();
  for(let i=0;i<4;i++){const a=t/350+i*PI/2;star(c,Math.cos(a)*17,Math.sin(a)*17,2.6,pc)}}
 c.beginPath();c.arc(0,0,13,0,7);c.fillStyle="rgba(220,240,255,.2)";c.fill();
 c.save();c.beginPath();c.arc(0,0,12.4,0,7);c.clip();const lvl=12-24*cl(water,0,100)/100;c.fillStyle=wc;c.globalAlpha=.62;c.fillRect(-14,lvl+Math.sin(t/300)*.8,28,30);c.globalAlpha=1;if(water>2&&water<100){c.fillStyle="rgba(255,255,255,.55)";c.fillRect(-12,lvl+Math.sin(t/300)*.8,24,1.2)}
 if(water<45){c.fillStyle="rgba(70,45,20,.35)";for(let i=0;i<5;i++)el(c,Math.sin(i*7.3+t/900)*8,2+Math.cos(i*3.1+t/700)*6,1.4,1.4,"rgba(70,45,20,.45)")}
 c.translate(Math.sin(t/700)*4,Math.max(3,Math.min(9,lvl+5))+Math.sin(t/350)*1.5);c.scale(Math.cos(t/700)>=0?1:-1,1);if(sick)c.rotate(PI*.9);drawFishBody(c,t);c.restore();
 c.strokeStyle="rgba(230,245,255,.8)";c.lineWidth=1.3;c.beginPath();c.arc(0,0,13,0,7);c.stroke();
 c.strokeStyle="rgba(255,255,255,.7)";c.beginPath();c.arc(0,0,10,-2.6,-1.8);c.stroke();
 c.fillStyle="rgba(230,245,255,.5)";rr(c,-8,-14,16,3,1.5);c.fill()}
function drawPrincess(c,t,free){const b=Math.sin(t/300)*2;
 c.save();c.translate(0,b-4);c.scale(Math.cos(t/900)>=0?1.6:-1.6,1.6);drawFishBody(c,t,"#ff5a2a");c.restore();
 c.save();c.translate(0,b-14);c.fillStyle=lg(c,0,-6,0,2,"#ffe58a","#d99a1e");c.beginPath();c.moveTo(-6,2);c.lineTo(-7,-5);c.lineTo(-3,-1);c.lineTo(0,-7);c.lineTo(3,-1);c.lineTo(7,-5);c.lineTo(6,2);c.closePath();c.fill();el(c,0,-1,1.3,1.3,"#ff3d5a");c.restore();
 if(!free){c.strokeStyle="#8d97ad";c.lineWidth=2;rr(c,-17,-26,34,40,6);c.stroke();for(let x=-11;x<=11;x+=5.5)ln(c,x,-26,x,14);c.fillStyle="#6b7590";rr(c,-19,12,38,5,2);c.fill();rr(c,-19,-29,38,5,2);c.fill()}
 else{for(let i=0;i<4;i++){const a=t/300+i*PI/2;star(c,Math.cos(a)*20,-6+Math.sin(a)*14,3,"#ffe36b")}}}

/* oggetti */
function drawItem(c,it,t){const b=Math.sin(t/300+it.x*3)*2.5;
 if(it.k==="cart"){drawCartEmpty(c,t,{s:.95});if(it.ab){const p=(t%1400)/1400;c.strokeStyle=`rgba(159,210,238,${.7-.6*p})`;c.lineWidth=2;c.beginPath();c.arc(0,4,16+p*10,0,7);c.stroke()}return}
 if(it.k==="coin"){const sx=Math.abs(Math.cos(t/260+it.x*2));el(c,0,12,6,2,"rgba(0,0,0,.2)");c.save();c.translate(0,b);c.scale(Math.max(.15,sx),1);
  c.beginPath();c.arc(0,0,7,0,7);c.fillStyle=lg(c,0,-7,0,7,"#ffe58a","#e0a21e");c.fill();c.strokeStyle="#b97d0a";c.lineWidth=1.2;c.beginPath();c.arc(0,0,4.6,0,7);c.stroke();c.restore()}
 else if(it.k==="merch"){const col=["","#ff4f6d","#4f8bff","#ffc93c","#3fcf7a"][it.c];el(c,0,13,10,2.6,"rgba(0,0,0,.2)");
  c.save();c.translate(0,b*.5);c.fillStyle=col;c.beginPath();c.moveTo(-10,-6);c.lineTo(-4,-10);c.lineTo(4,-10);c.lineTo(10,-6);c.lineTo(7,-1);c.lineTo(5,-3);c.lineTo(5,9);c.lineTo(-5,9);c.lineTo(-5,-3);c.lineTo(-7,-1);c.closePath();c.fill();
  c.fillStyle="rgba(255,255,255,.35)";rr(c,-3,-2,6,3,1);c.fill();c.restore()}
 else if(it.k==="pastry"){el(c,0,13,8,2.4,"rgba(0,0,0,.2)");c.save();c.translate(0,b*.6);const v=it.v||0;
  if(v===0){c.fillStyle="#c98a4a";c.beginPath();c.moveTo(-7,0);c.lineTo(-5,9);c.lineTo(5,9);c.lineTo(7,0);c.fill();el(c,0,-2,8,6,"#ff9cc6");el(c,0,-7,2,2,"#e63946")}
  else if(v===1){el(c,0,3,9,5,"#e9b26a");el(c,0,1,7,3,"#7a4a22");c.fillStyle="#fff";for(let i=0;i<4;i++)c.fillRect(-5+i*3,-1,1.4,1.4)}
  else{c.fillStyle="#f3d9a6";c.beginPath();c.moveTo(-9,6);c.quadraticCurveTo(0,-14,9,6);c.closePath();c.fill();c.strokeStyle="#c9883a";c.lineWidth=1.2;for(const x of[-4,0,4])ln(c,x,4,x*.6,-4)}
  c.restore()}
 else if(it.k==="banana"){c.fillStyle="#ffd23c";for(let i=0;i<3;i++){c.save();c.rotate(i*2.1);c.beginPath();c.ellipse(0,-5,2.6,7,0,0,7);c.fill();c.restore()}el(c,0,0,3,3,"#6b4a12")}
 else if(it.k==="frag"){c.save();c.translate(0,b-2);c.rotate(Math.sin(t/400)*.15);c.fillStyle=rg(c,0,0,1,26,"rgba(255,201,60,.55)","rgba(255,201,60,0)");c.fillRect(-26,-26,52,52);
  c.fillStyle="#fff";c.beginPath();c.moveTo(-10,-13);c.lineTo(10,-13);c.lineTo(12,-2);c.lineTo(9,13);c.lineTo(-11,12);c.lineTo(-9,0);c.closePath();c.fill();
  c.fillStyle="#e63946";c.fillRect(-7,-9,14,4);el(c,0,3,5,3,"#ff8a5c");c.fillStyle="#2b2b2b";c.fillRect(-6,8,12,1.4);c.restore()}
 else if(it.k==="food"){c.save();c.translate(0,b);el(c,0,12-b,8,2.4,"rgba(0,0,0,.2)");c.fillStyle=lg(c,0,-9,0,9,"#ffb347","#e8731a");c.beginPath();c.moveTo(-8,-6);c.lineTo(8,-6);c.lineTo(9,9);c.lineTo(-9,9);c.closePath();c.fill();
  c.fillStyle="#c95f10";c.beginPath();c.moveTo(-8,-6);c.lineTo(-5,-10);c.lineTo(5,-10);c.lineTo(8,-6);c.fill();c.fillStyle="#fff";rr(c,-6,-2,12,8,2);c.fill();c.translate(0,2);drawFishBody(c,t,null,.55);c.restore()}
 else if(it.k==="water"){c.save();c.translate(0,b);el(c,0,12-b,7,2.2,"rgba(0,0,0,.2)");c.fillStyle="rgba(170,225,255,.85)";rr(c,-6,-6,12,16,4);c.fill();c.fillStyle="#3f9df0";rr(c,-6,1,12,9,4);c.fill();
  c.fillStyle="#2a6fd0";rr(c,-3,-11,6,5,1.5);c.fill();c.fillStyle="#fff";rr(c,-4.5,-2,9,4,1);c.fill();el(c,-3,4,1.2,2.4,"rgba(255,255,255,.6)");c.restore()}
 else if(it.k==="key"){c.save();c.translate(0,b);el(c,0,12-b,8,2.4,"rgba(0,0,0,.2)");c.fillStyle=rg(c,0,0,1,18,SP[it.sp].c+"66",SP[it.sp].c+"00");c.fillRect(-18,-18,36,36);drawKey(c,it.sp);c.translate(0,-12);c.scale(.55,.55);drawAnimal(c,it.sp,t,false);c.restore()}
 else if(it.k==="heal"){c.save();c.translate(0,b);el(c,0,0,9,7,"#e63946");c.fillStyle="#fff";c.fillRect(-1.5,-5,3,10);c.fillRect(-5,-1.5,10,3);c.restore()}
}
function drawIcon(c,id,t){c.save();
 if(id==="food"){c.fillStyle="#ff9a2e";rr(c,-9,-11,18,22,3);c.fill();c.fillStyle="#fff";rr(c,-6,-6,12,8,2);c.fill();c.translate(0,-2);drawFishBody(c,t,null,.7)}
 else if(id==="water"){c.fillStyle="rgba(127,211,255,.8)";c.beginPath();c.moveTo(0,-12);c.quadraticCurveTo(10,2,0,11);c.quadraticCurveTo(-10,2,0,-12);c.fill()}
 else if(POT[id]){c.fillStyle="rgba(220,235,255,.3)";c.beginPath();c.arc(0,4,9,0,7);c.fill();c.fillStyle=POT[id].col;c.beginPath();c.arc(0,5,7.5,0,PI);c.fill();rr(c,-7.5,2,15,3,1);c.fill();c.fillStyle="#b07a45";rr(c,-3,-12,6,5,1.5);c.fill();c.fillStyle="rgba(220,235,255,.4)";rr(c,-3,-7,6,5,1);c.fill()}
 else if(id==="cart"){c.translate(0,-3);c.scale(.62,.62);drawCartEmpty(c,t,{s:1})}
 else if(id==="soap"){c.fillStyle=lg(c,0,-6,0,6,"#e8c6ff","#b583e6");rr(c,-10,-6,20,12,5);c.fill();el(c,-4,-2,3,1.5,"rgba(255,255,255,.6)");for(let i=0;i<3;i++){c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1;c.beginPath();c.arc(-6+i*6,-10,1.8+i*.5,0,7);c.stroke()}}
 else if(id==="gum"){c.beginPath();c.arc(0,0,9,0,7);c.fillStyle=rg(c,-3,-3,1,10,"#ffc2e0","#ff4f9a");c.fill();c.strokeStyle="#ffd23c";c.lineWidth=2;ln(c,4,-6,9,-11);star(c,10,-12,3,"#ffd23c")}
 else if(id==="snack"){c.fillStyle="#ffc93c";rr(c,-11,-6,22,12,3);c.fill();c.fillStyle="#7a4a22";rr(c,-7,-3,14,6,2);c.fill()}
 else if(id==="kit"){c.fillStyle="#2fcf98";rr(c,-11,-9,22,18,3);c.fill();c.fillStyle="#fff";c.fillRect(-2,-6,4,12);c.fillRect(-6,-2,12,4);c.translate(6,5);drawFishBody(c,t,null,.5)}
 else if(id==="towel"){c.fillStyle="#4fb8ff";rr(c,-10,-10,20,20,3);c.fill();c.fillStyle="#fff";for(let i=0;i<3;i++)c.fillRect(-10,-6+i*6,20,2);c.fillStyle="#8fe0ff";el(c,6,8,2,3,"#8fe0ff")}
 else if(id==="shoes"){c.fillStyle="#ff4f6d";c.beginPath();c.moveTo(-11,4);c.lineTo(-11,-6);c.lineTo(-2,-6);c.lineTo(2,0);c.lineTo(11,2);c.lineTo(11,6);c.lineTo(-11,6);c.fill();c.fillStyle="#fff";c.fillRect(-11,4,22,3)}
 else if(id==="heart"){c.fillStyle="#ff4f6d";c.beginPath();c.moveTo(0,10);c.bezierCurveTo(-14,0,-8,-12,0,-4);c.bezierCurveTo(8,-12,14,0,0,10);c.fill()}
 c.restore()}

/* animali, commessi travestiti, pappagalli */
function drawAnimal(c,sp,t,run){const b=run?Math.abs(Math.sin(t/90))*2:Math.sin(t/400)*.6,E=(x,y)=>el(c,x,y,1,1.1,"#1a1a1a");c.save();c.translate(0,-b);
 switch(sp){
 case 0:el(c,0,4,8,6,"#f2b24a");el(c,6,-3,7,7,"#c96a1a");el(c,6,-3,4.5,4.5,"#f6c860");E(5,-4);E(8,-4);c.strokeStyle="#c96a1a";c.lineWidth=2;ln(c,-8,3,-12,-2);break;
 case 1:el(c,0,4,9,7,"#a7afc0");el(c,7,-1,6,6,"#a7afc0");el(c,3,-1,4,5.5,"#8d96aa");c.strokeStyle="#a7afc0";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(12,1);c.quadraticCurveTo(14,6,12,9);c.stroke();E(8,-2);break;
 case 2:el(c,-1,7,7,5,"#ffd23c");c.fillStyle="#ffd23c";rr(c,2,-10,4,16,2);c.fill();el(c,6,-11,4.5,3,"#ffd23c");c.fillStyle="#a0522d";for(const[x,y]of[[-4,6],[1,8],[-1,4],[3,-4],[4,1]])el(c,x,y,1.4,1.2,"#a0522d");ln(c,4,-13,4,-16);ln(c,7,-13,7,-16);E(8,-11);break;
 case 3:el(c,0,4,9,6,"#fff");el(c,8,-1,4.5,4,"#fff");c.strokeStyle="#1a1a1a";c.lineWidth=1.4;for(const x of[-6,-3,0,3])ln(c,x,-1,x+1,9);ln(c,7,-4,8,2);c.fillStyle="#1a1a1a";rr(c,3,-6,5,2,1);c.fill();E(9,-2);break;
 case 4:el(c,0,2,6,9,"#222");el(c,1,4,4,6.5,"#fff");c.fillStyle="#ff9a2e";c.beginPath();c.moveTo(4,-4);c.lineTo(9,-3);c.lineTo(4,-2);c.fill();el(c,2,-5,1,1.1,"#fff");el(c,-1,11,2.5,1.2,"#ff9a2e");el(c,3,11,2.5,1.2,"#ff9a2e");break;
 case 5:c.strokeStyle="#8a5a2b";c.lineWidth=2;c.beginPath();c.moveTo(-5,8);c.quadraticCurveTo(-12,6,-10,-2);c.stroke();el(c,0,5,6,6,"#8a5a2b");el(c,0,-4,6,6,"#8a5a2b");el(c,-6,-4,2.4,2.4,"#e8c39e");el(c,6,-4,2.4,2.4,"#e8c39e");el(c,0,-3,4,3.5,"#e8c39e");E(-1.6,-4);E(1.6,-4);break;
 case 6:el(c,0,5,6,5,"#fff");el(c,4,-1,4.5,4,"#fff");el(c,2.5,-9,1.6,5,"#fff");el(c,6,-9,1.6,5,"#fff");el(c,2.5,-9,.7,3.5,"#ffb3c8");el(c,6,-9,.7,3.5,"#ffb3c8");el(c,-6,5,2,2,"#fff");E(5,-2);el(c,8,0,1,.8,"#ff8aa8");break;
 case 7:el(c,9,3,3,2.6,"#8fd16a");for(const x of[-6,5])el(c,x,8,2.2,1.6,"#8fd16a");el(c,0,2,9,6,"#3fae5a");c.strokeStyle="#2b7a3e";c.lineWidth=1.2;ln(c,-4,-3,-4,7);ln(c,3,-3,3,7);ln(c,-8,2,8,2);E(10,2);break;
 case 8:c.fillStyle="#ffd23c";c.beginPath();c.moveTo(-3,6);c.lineTo(-8,14);c.lineTo(-1,9);c.fill();el(c,0,2,4.5,7,"#e63946");el(c,-2,3,3,5,"#2f6bd8");el(c,1,-6,4,4,"#e63946");c.fillStyle="#f2d28a";c.beginPath();c.moveTo(4,-6);c.quadraticCurveTo(8,-6,6,-2);c.lineTo(4,-4);c.fill();el(c,2,-7,1,1,"#1a1a1a");break;
 case 9:el(c,0,5,8,6.5,"#7a4a22");el(c,5,-3,5.5,5,"#7a4a22");el(c,2,-8,2,2,"#7a4a22");el(c,8,-8,2,2,"#7a4a22");el(c,9,-2,2.6,2,"#c9a27a");E(5,-4);E(8,-4);break}
 c.restore()}
function drawZooClerk(c,t,o){const sp=o.sp,b=Math.sin(t/260)*.6,ff=o.flee;shadow(c,11);legs(c,o.walk||0,"#2f3443","#1b1d24");
 if(sp===7)el(c,0,0,13,11,"#3fae5a");
 c.fillStyle=lg(c,0,-4,0,11,"#3fe0a8","#1fa878");rr(c,-10,-4+b,20,14,5);c.fill();
 if(sp===3){c.fillStyle="#1a1a1a";for(const x of[-7,-3,1,5])c.fillRect(x,-4+b,2,14)}
 if(sp===4){c.fillStyle="#1a1a1a";rr(c,-10,-4+b,20,14,5);c.fill();c.fillStyle="#fff";rr(c,-4,-4+b,8,14,3);c.fill();c.fillStyle="#ff9a2e";c.beginPath();c.moveTo(-4,-3+b);c.lineTo(0,-1+b);c.lineTo(-4,1+b);c.fill();c.beginPath();c.moveTo(4,-3+b);c.lineTo(0,-1+b);c.lineTo(4,1+b);c.fill()}
 c.fillStyle="#fff";rr(c,2,0+b,6,3,1);c.fill();
 c.fillStyle="#1fa878";rr(c,-13.5,-2+b,4.5,10,2.2);c.fill();rr(c,9,-2+b,4.5,10,2.2);c.fill();el(c,-11.2,8.5+b,2.4,2.4,"#f2c29b");el(c,11.2,8.5+b,2.4,2.4,"#f2c29b");
 if(sp===5){c.save();c.translate(13,5+b);c.rotate(-.6);c.fillStyle="#ffd23c";c.beginPath();c.ellipse(0,0,2.6,7,0,0,7);c.fill();c.restore()}
 if(sp===9){c.fillStyle="#d9922e";rr(c,9,2+b,9,9,3);c.fill();c.fillStyle="#fff3c4";c.fillRect(10,5+b,7,3)}
 const hy=-14+b;
 if(sp===0)el(c,0,hy,14,13.5,"#c96a1a");
 if(sp===1){el(c,-10,hy+1,6,8,"#a7afc0");el(c,10,hy+1,6,8,"#a7afc0")}
 c.beginPath();c.arc(0,hy,9.5,0,7);c.fillStyle="#f2c29b";c.fill();
 c.fillStyle="#3a2418";c.beginPath();c.ellipse(0,hy-3,10,7,0,PI,0);c.fill();
 if(sp===2){c.fillStyle="#ffd23c";c.beginPath();c.ellipse(0,hy-6,10,6,0,PI,0);c.fill();el(c,-4,hy-8,1.6,1.3,"#a0522d");el(c,3,hy-9,1.6,1.3,"#a0522d");c.strokeStyle="#c98a1a";c.lineWidth=2;ln(c,-3,hy-11,-4,hy-16);ln(c,3,hy-11,4,hy-16);el(c,-4,hy-16,1.6,1.6,"#a0522d");el(c,4,hy-16,1.6,1.6,"#a0522d")}
 if(sp===6){c.fillStyle="#fff";el(c,-4,hy-14,2.6,7,"#fff");el(c,4,hy-14,2.6,7,"#fff");el(c,-4,hy-14,1.2,5,"#ffb3c8");el(c,4,hy-14,1.2,5,"#ffb3c8")}
 if(sp===8){el(c,0,hy-8,8,4,"#2f6bd8");c.fillStyle="#e63946";c.beginPath();c.moveTo(-2,hy-10);c.lineTo(-6,hy-22);c.lineTo(1,hy-11);c.fill();c.fillStyle="#ffd23c";c.beginPath();c.moveTo(2,hy-10);c.lineTo(6,hy-21);c.lineTo(4,hy-10);c.fill()}
 if(sp===9){el(c,-7,hy-8,3,3,"#7a4a22");el(c,7,hy-8,3,3,"#7a4a22")}
 if(sp===0){el(c,0,hy-6,6,3,"#3a2418")}
 el(c,-3.6,hy+1,1.4,ff?.6:1.8,"#2b1a12");el(c,3.6,hy+1,1.4,ff?.6:1.8,"#2b1a12");
 if(sp===1){c.strokeStyle="#a7afc0";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(0,hy+3);c.quadraticCurveTo(2,hy+9,-1,hy+12);c.stroke()}
 else{c.strokeStyle="#8a4b3a";c.lineWidth=1.2;c.beginPath();if(ff)c.arc(0,hy+6,2,0,7);else c.arc(0,hy+4.5,2.2,.3,PI-.3);c.stroke()}
 if(o.hasKey){c.save();c.translate(-15,-2+b+Math.sin(t/200)*2);c.scale(.6,.6);drawKey(c,o.sp);c.restore()}}
function drawKey(c,sp){const col=SP[sp].c;c.strokeStyle=col;c.lineWidth=3.4;c.beginPath();c.arc(-6,0,5,0,7);c.stroke();c.fillStyle=col;rr(c,-1.5,-1.7,15,3.4,1.5);c.fill();rr(c,9,1,2.8,5,1);c.fill();rr(c,5,1,2.8,4,1);c.fill();
 c.fillStyle="#fff";el(c,-6,0,3.2,3.2,"#fff")}
function drawParrotFly(c,t,ph){const w=Math.sin(t/70+ph)*6;c.save();c.fillStyle="#2f6bd8";c.beginPath();c.moveTo(-2,0);c.lineTo(-10,-6-w);c.lineTo(-5,2);c.fill();c.beginPath();c.moveTo(2,0);c.lineTo(10,-6-w);c.lineTo(5,2);c.fill();
 c.scale(.9,.9);drawAnimal(c,8,t,false);c.restore()}

/* negozio di pesca */
function drawEel(c,t){const w=n=>Math.sin(t/160+n*.35)*4;c.lineCap="round";c.lineJoin="round";
 c.strokeStyle="#5f7d1e";c.lineWidth=9;c.beginPath();for(let i=0;i<=12;i++){const x=-26+i*4.2,y=w(i);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
 c.strokeStyle="#a8c84a";c.lineWidth=6;c.stroke();c.strokeStyle="rgba(40,60,10,.5)";c.lineWidth=1.2;for(let i=1;i<12;i+=2)el(c,-26+i*4.2,w(i)-1,1.2,1.2,"rgba(40,60,10,.5)");
 const hx=26,hy=w(12);el(c,hx,hy,7,5,"#a8c84a");el(c,hx+2,hy-2,1.6,1.6,"#ffe36b");el(c,hx+2.3,hy-2,.7,.9,"#111");c.fillStyle="#4a1a12";c.beginPath();c.moveTo(hx+7,hy);c.lineTo(hx+3,hy+2.5);c.lineTo(hx+7,hy+3);c.fill();
 if(Math.sin(t/90)>.2){c.strokeStyle="#ffe36b";c.lineWidth=1.6;for(const[a,b]of[[-10,-10],[6,-11],[20,-9]]){c.beginPath();c.moveTo(a,b);c.lineTo(a+3,b-4);c.lineTo(a+1,b-4);c.lineTo(a+4,b-8);c.stroke()}}}
function drawMouseSwim(c,t){const b=Math.sin(t/150)*1.5;c.strokeStyle="#e89aa6";c.lineWidth=1.8;c.beginPath();c.moveTo(-9,2);c.quadraticCurveTo(-17,-4+b,-21,1);c.stroke();
 el(c,0,2,10,6,"#9a9aa6");el(c,9,-1,6,5,"#a8a8b4");el(c,6,-7,3.4,3.4,"#a8a8b4");el(c,6,-7,1.8,1.8,"#ffb3c8");el(c,15,0,1.6,1.4,"#ff8aa8");el(c,10,-2,1.1,1.1,"#111");
 c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1;for(const x of[-8,-1,6])ln(c,x,7+b,x+3,9+b)}
function drawBoot(c){c.fillStyle="#6b4423";rr(c,-6,-14,12,18,3);c.fill();c.beginPath();c.moveTo(-6,0);c.lineTo(-6,6);c.lineTo(14,6);c.quadraticCurveTo(15,0,8,-1);c.lineTo(6,-2);c.closePath();c.fill();
 c.fillStyle="#2a1a0e";c.fillRect(-7,5,22,3);c.strokeStyle="#d9c7a0";c.lineWidth=1;for(let i=0;i<4;i++)ln(c,-3,-11+i*3.4,3,-9+i*3.4);el(c,10,3,1.2,1.2,"#3fae5a");el(c,-2,-15,3,1.4,"rgba(63,174,90,.7)")}
function drawCan(c){c.fillStyle=lg(c,-8,0,8,0,"#b8bec9","#7d8594");rr(c,-8,-11,16,22,3);c.fill();c.fillStyle="#d62828";c.fillRect(-8,-6,16,13);
 c.fillStyle="#fff";c.font="700 4.6px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.fillText("PELATI",0,4);el(c,0,-2,3.4,3,"#ff4a2a");c.fillStyle="#2f8a3a";c.fillRect(-1,-5.6,2,1.6);
 c.strokeStyle="rgba(255,255,255,.5)";c.lineWidth=1;ln(c,-8,-9,8,-9);ln(c,-8,9,8,9)}
function drawBasket(c,n,t,cols){el(c,0,9,15,3,"rgba(0,0,0,.2)");
 for(let i=0;i<Math.min(n,5);i++){c.save();c.translate(-8+i*4,-6-(i%2)*2);c.rotate(-1.2+i*.5);drawFishBody(c,t,cols[i]||"#f07c12",.75);c.restore()}
 c.fillStyle="#b98454";c.beginPath();c.moveTo(-14,-4);c.lineTo(14,-4);c.lineTo(11,9);c.lineTo(-11,9);c.closePath();c.fill();
 c.strokeStyle="#8a5a2b";c.lineWidth=1.3;for(let y=-1;y<9;y+=3.3)ln(c,-13+(y+4)*.2,y,13-(y+4)*.2,y);for(let x=-10;x<=10;x+=4)ln(c,x,-4,x*.8,9);
 c.fillStyle="#8a5a2b";rr(c,-15,-6,30,3,1.5);c.fill();
 if(n){c.fillStyle="#fff";c.font="700 9px Fredoka,system-ui";c.textAlign="center";c.textBaseline="middle";c.lineWidth=3;c.strokeStyle="rgba(20,10,40,.8)";c.strokeText(n,0,3);c.fillText(n,0,3)}}
function drawSceneIcon(c,id,t){c.save();
 if(id==="hook"){c.strokeStyle="#e6ebf2";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(2,-12);c.lineTo(2,4);c.arc(-3,4,5,0,PI*.9);c.stroke();c.beginPath();c.moveTo(-8,5);c.lineTo(-9,1);c.stroke();c.strokeStyle="rgba(255,255,255,.6)";c.lineWidth=1;ln(c,2,-12,2,-16);el(c,2,-14,3,2.4,"#ff4f6d")}
 else if(id==="shoo"){c.save();c.scale(.85,.85);c.translate(-3,4);drawCat(c,t,{walk:0,flee:true});c.restore();c.fillStyle=lg(c,0,-6,0,6,"#f1d9ff","#b583e6");rr(c,2,-13,12,8,3);c.fill()}
 else if(id==="exit"){c.fillStyle="#2b2f3c";rr(c,-10,-12,14,24,2);c.fill();c.fillStyle="rgba(190,235,255,.9)";c.fillRect(-8,-10,10,20);c.strokeStyle="#4fe3b5";c.lineWidth=3;c.lineCap="round";ln(c,0,0,11,0);c.beginPath();c.moveTo(7,-4);c.lineTo(11,0);c.lineTo(7,4);c.stroke()}
 c.restore()}
