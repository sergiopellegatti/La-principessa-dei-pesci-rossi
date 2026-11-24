/* ---------- audio: musica chiptune anni '80 ed effetti ---------- */
const AU={ctx:null,on:true,song:null,timer:0,playing:-1,noise:null};
try{AU.on=localStorage.getItem("ppr-audio")!=="off"}catch(e){}
const mf=m=>440*Math.pow(2,(m-69)/12);
function auInit(){if(AU.ctx){if(AU.ctx.state==="suspended")AU.ctx.resume();return}
 try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=AU.ctx=new C();
  AU.master=c.createGain();AU.master.gain.value=AU.on?.55:0;AU.master.connect(c.destination);
  AU.mus=c.createGain();AU.mus.gain.value=.16;AU.mus.connect(AU.master);AU.fx=c.createGain();AU.fx.gain.value=.5;AU.fx.connect(AU.master);
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b}catch(e){AU.ctx=null}}
function auToggle(){AU.on=!AU.on;try{localStorage.setItem("ppr-audio",AU.on?"on":"off")}catch(e){}if(AU.master)AU.master.gain.value=AU.on?.55:0;muteIcons()}
function tone(f,dur,type,vol,dest,t0,slide){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t0+dur);
 g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);o.connect(g);g.connect(dest);o.start(t0);o.stop(t0+dur+.03)}
function nz(dur,vol,dest,t0,type,freq,q){const c=AU.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.noise;f.type=type||"highpass";f.frequency.value=freq||1000;f.Q.value=q||.7;
 g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);s.connect(f);f.connect(g);g.connect(dest);s.start(t0,Math.random()*.5);s.stop(t0+dur+.03)}
/* brani: lead/bassi in MIDI, null = pausa */
const _=null;
const SONGS={
 6:{dt:.14,bar:16,be:8,lead:[69,_,73,76,_,73,81,_,78,_,76,_,73,_,_,_, 71,_,74,78,_,74,81,_,80,_,78,_,76,_,_,_, 73,_,76,81,_,76,85,_,83,_,81,_,78,_,76,_, 74,_,73,_,71,_,73,_,69,_,_,_,_,_,_,_],bass:[45,50,45,40],dr:"soft",wave:"triangle"},
 0:{dt:.15,bar:16,be:8,lead:[74,_,73,_,71,_,69,_,71,_,_,_,66,_,_,_, 69,_,71,_,73,_,74,_,76,_,_,_,_,_,_,_, 74,_,73,_,71,_,69,_,66,_,_,_,64,_,_,_, 62,_,64,_,66,_,69,_,71,_,_,_,_,_,_,_],bass:[50,47,43,45],dr:"soft",wave:"triangle"},
 1:{dt:.118,bar:16,be:4,lead:[72,_,76,_,79,_,76,_,77,_,76,_,74,_,72,_, 74,_,77,_,81,_,77,_,79,_,77,_,76,_,74,_, 72,_,76,_,79,_,84,_,83,_,79,_,81,_,79,_, 77,_,76,_,74,_,76,_,72,_,_,_,72,_,_,_],bass:[48,50,48,43],dr:"pop"},
 2:{dt:.115,bar:12,be:6,lead:[69,72,76,_,76,74,72,71,69,_,69,_, 71,74,77,_,77,76,74,72,71,_,71,_, 72,76,79,_,79,77,76,74,72,_,76,_, 71,72,74,76,74,72,71,_,69,_,_,_],bass:[45,40,45,40],dr:"tar"},
 3:{dt:.13,bar:16,be:8,lead:[77,_,_,81,84,_,81,_,79,_,_,77,76,_,77,_, 79,_,_,77,76,_,74,_,72,_,_,_,_,_,_,_, 74,_,_,77,81,_,79,_,77,_,_,76,74,_,76,_, 77,_,_,_,72,_,_,_,77,_,_,_,_,_,_,_],bass:[41,36,38,36],dr:"soft",wave:"triangle"},
 4:{dt:.12,bar:16,be:4,lead:[67,_,71,74,_,71,79,_,78,_,74,_,71,_,_,_, 69,_,72,76,_,72,81,_,79,_,76,_,72,_,_,_, 71,_,74,79,_,74,83,_,81,_,79,_,78,_,76,_, 74,_,79,_,78,_,76,_,74,_,_,_,67,_,_,_],bass:[43,45,40,38],dr:"pop"},
 5:{dt:.14,bar:16,be:8,lead:[74,_,_,75,74,_,72,_,69,_,_,_,67,_,69,_, 72,_,_,69,67,_,63,_,62,_,_,_,_,_,_,_, 74,_,75,_,79,_,_,75,74,_,72,_,69,_,_,_, 67,_,69,_,72,_,69,67,63,_,_,_,62,_,_,_],bass:[38,38,36,38],dr:"taiko"}};
function musicStart(l){musicStop();if(!AU.ctx||!SONGS[l])return;AU.song={M:SONGS[l],step:0,next:AU.ctx.currentTime+.08};AU.playing=l;AU.timer=setInterval(musTick,40)}
function musicStop(){clearInterval(AU.timer);AU.timer=0;AU.song=null;AU.playing=-1}
function musTick(){const s=AU.song,c=AU.ctx;if(!s||!c)return;if(c.currentTime-s.next>.5)s.next=c.currentTime+.05;
 while(s.next<c.currentTime+.18){const M=s.M,i=s.step%M.lead.length,bi=i%M.bar,bar=Math.floor(i/M.bar),t=s.next;
  const n=M.lead[i];if(n)tone(mf(n),M.dt*1.7,M.wave||"square",.11,AU.mus,t);
  if(bi%M.be===0){const b=M.bass[bar%M.bass.length];tone(mf(b),M.dt*M.be*.85,"triangle",.32,AU.mus,t);if(M.be>=6)tone(mf(b+12),M.dt*1.5,"triangle",.15,AU.mus,t+M.dt*(M.be/2))}
  if(M.dr==="pop"){if(bi%8===0)tone(120,.12,"sine",.5,AU.mus,t,45);if(bi%8===4)nz(.09,.25,AU.mus,t,"bandpass",1800,1);if(bi%2===1)nz(.03,.08,AU.mus,t,"highpass",7000)}
  else if(M.dr==="tar"){if(bi%6===0)tone(110,.1,"sine",.45,AU.mus,t,45);if(bi%6===3)nz(.06,.18,AU.mus,t,"bandpass",2400,1.2);if(bi%3===2)nz(.025,.1,AU.mus,t,"highpass",8000)}
  else if(M.dr==="soft"){if(bi%8===0)tone(100,.1,"sine",.35,AU.mus,t,50);if(bi%4===2)nz(.02,.06,AU.mus,t,"highpass",9000)}
  else if(M.dr==="taiko"){if(bi===0||bi===6||bi===8)tone(90,.25,"sine",.6,AU.mus,t,40);if(bi===12)nz(.15,.3,AU.mus,t,"lowpass",500);if(bi%4===2)nz(.03,.07,AU.mus,t,"highpass",6000)}
  s.next+=M.dt;s.step++}}
function jingle(notes,dt,type){if(!AU.ctx)return;const t=AU.ctx.currentTime+.02;notes.forEach((n,i)=>n&&tone(mf(n),dt*1.6,type||"square",.18,AU.fx,t+i*dt))}
let sfxLast={};
function sfx(n,vol){if(!AU.ctx||!AU.on)return;const now=AU.ctx.currentTime;if(sfxLast[n]&&now-sfxLast[n]<.045)return;sfxLast[n]=now;const t=now+.005,v=vol==null?1:vol,F=AU.fx;
 switch(n){
 case"towel":nz(.16,.35*v,F,t,"bandpass",900,.8);nz(.12,.2*v,F,t+.04,"bandpass",2200,1);break;
 case"soap":tone(900,.09,"square",.12*v,F,t,420);break;
 case"gum":tone(260,.16,"triangle",.3*v,F,t,640);break;
 case"boom":nz(.5,.6*v,F,t,"lowpass",900);tone(140,.4,"sine",.55*v,F,t,35);break;
 case"hit":tone(230,.06,"square",.14*v,F,t,140);nz(.04,.15*v,F,t,"bandpass",1500);break;
 case"death":tone(520,.28,"square",.13*v,F,t,90);break;
 case"coin":tone(988,.06,"square",.1*v,F,t);tone(1319,.14,"square",.1*v,F,t+.06);break;
 case"pick":tone(660,.1,"triangle",.25*v,F,t,1000);tone(1320,.08,"triangle",.12*v,F,t+.07);break;
 case"deliver":[72,76,79].forEach((m,i)=>tone(mf(m),.12,"square",.11*v,F,t+i*.07));break;
 case"hurt":tone(220,.22,"sawtooth",.2*v,F,t,70);break;
 case"spray":nz(.12,.08*v,F,t,"highpass",3000);break;
 case"throw":tone(520,.12,"triangle",.12*v,F,t,300);break;
 case"stun":tone(1400,.18,"square",.07*v,F,t,700);tone(1800,.12,"square",.05*v,F,t+.08,900);break;
 case"slip":tone(700,.35,"sine",.3*v,F,t,140);break;
 case"crash":nz(.25,.35*v,F,t,"bandpass",600,.6);tone(180,.2,"square",.1*v,F,t,60);break;
 case"meow":tone(700,.12,"sawtooth",.08*v,F,t,1000);tone(1000,.2,"sawtooth",.07*v,F,t+.1,520);break;
 case"empty":tone(160,.08,"square",.1*v,F,t);break;
 case"buy":tone(1046,.08,"square",.12*v,F,t);tone(1568,.16,"square",.12*v,F,t+.08);break;
 case"stepup":tone(523,.08,"square",.1*v,F,t);break;
 case"revive":[60,64,67,72].forEach((m,i)=>tone(mf(m),.1,"triangle",.25*v,F,t+i*.06));break;
 case"life":[67,63,60,55].forEach((m,i)=>tone(mf(m),.18,"square",.14*v,F,t+i*.14));break;
 case"frag":[72,76,79,84,88].forEach((m,i)=>tone(mf(m),.12,"square",.12*v,F,t+i*.08));break;
 case"mission":[67,72,76,79,76,79,84].forEach((m,i)=>tone(mf(m),.14,"square",.12*v,F,t+i*.09));break;
 case"level":[72,_,72,74,76,_,79,_,84].forEach((m,i)=>m&&tone(mf(m),.16,"square",.13*v,F,t+i*.1));break;
 case"alarm":for(let i=0;i<4;i++)tone(i%2?660:880,.12,"square",.1*v,F,t+i*.13);break;
 case"door":tone(660,.07,"square",.1*v,F,t);tone(990,.1,"square",.1*v,F,t+.07);nz(.2,.08*v,F,t,"bandpass",3000,.5);break;
 case"bump":tone(300,.08,"triangle",.25*v,F,t,200);break;
 case"save":[60,67,72,76,79].forEach((m,i)=>tone(mf(m),.16,"triangle",.28*v,F,t+i*.08));nz(.5,.08,F,t,"highpass",4000);break;
 case"plop":tone(1200,.08,"sine",.05*v,F,t,700);break;
 case"splat":nz(.18,.3*v,F,t,"lowpass",700);tone(160,.15,"sine",.25*v,F,t,60);break;
 case"free":[60,64,67,72,76,79].forEach((m,i)=>tone(mf(m),.12,"square",.11*v,F,t+i*.06));tone(mf(84),.3,"triangle",.2*v,F,t+.4);break;
 case"cast":nz(.25,.18*v,F,t,"bandpass",1500,.6);tone(900,.25,"sine",.08*v,F,t,300);setTimeout(()=>AU.ctx&&nz(.12,.2,AU.fx,AU.ctx.currentTime,"lowpass",900),380);break;
 case"bite":tone(500,.08,"square",.12*v,F,t,900);tone(1200,.1,"triangle",.15*v,F,t+.08);break;
 case"clunk":tone(140,.18,"square",.16*v,F,t,80);nz(.1,.2*v,F,t,"lowpass",600);break;
 case"shock":for(let i=0;i<6;i++)tone(i%2?180:2400,.05,"sawtooth",.1*v,F,t+i*.05);nz(.3,.25*v,F,t,"highpass",3000);break;
 case"squeak":tone(1800,.06,"square",.08*v,F,t,2600);tone(2200,.08,"square",.07*v,F,t+.1,1600);break;
 case"sell":for(let i=0;i<6;i++){tone(988,.05,"square",.08*v,F,t+i*.09);tone(1319,.08,"square",.08*v,F,t+i*.09+.05)}break;
 case"win":[72,76,79,84,79,84,88,91].forEach((m,i)=>tone(mf(m),.22,"square",.14*v,F,t+i*.14));break;
 case"over":[64,60,57,52,48].forEach((m,i)=>tone(mf(m),.3,"triangle",.25*v,F,t+i*.22));break;
 }}
function fxSound(e,m){if(!AU.ctx||!AU.on)return;let v=1;if(m&&e.x!=null)v=cl(1.15-dist(m.x,m.y,e.x,e.y)/12,.15,1);
 const map={coin:"coin",hurt:"hurt",hitE:"hit",death:"death",boom:"boom",buy:"buy"};
 if(e.k==="sfx")sfx(e.s,v);else if(map[e.k])sfx(map[e.k],e.k==="hurt"?1:v)}
const SPK_ON='<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
 SPK_OFF='<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 9l6 6M22 9l-6 6" stroke="#ff8a95" stroke-width="2.2" stroke-linecap="round"/></svg>';
function muteIcons(){$("bMute").innerHTML=AU.on?SPK_ON:SPK_OFF;$("bMute2").textContent=AU.on?"Spegni musica e suoni":"Accendi musica e suoni"}
