import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// ================= Firebase =================

const firebaseConfig = {

  apiKey: "AIzaSyC4a9DrCeSN_HQFIHXWJhnzN4Jn376CdIc",

  authDomain: "hero-4ebbe.firebaseapp.com",

  databaseURL: "https://hero-4ebbe-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "hero-4ebbe",

  storageBucket: "hero-4ebbe.appspot.com",

  messagingSenderId: "868857385644",

  appId: "1:868857385644:web:d5366bee7f5d7b11e60509",

  measurementId: "G-2DE96HJN7Z"

};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

// ================= Player & State =================

let playerName = prompt("กรุณากรอกชื่อผู้เล่น:", "ผู้กล้า") || "ผู้กล้า";

let startTime = null;

const state = {

  hp: 100,

  maxhp: 100,

  gold: 60,

  buffs: { sword: 0 },

  inFight: false,

  heroAnim: 0,

  bossAnim: 0,

  heroHit: 0,

  bossHit: 0

};

const bossHPMax = 300;

let bossHP = bossHPMax;

const el = id => document.getElementById(id);

// ================= HUD =================

function updateHUD() {

  el('hpHeroBar').style.width = (state.hp/state.maxhp*100)+'%';

  el('hpHeroText').textContent = `${state.hp}/${state.maxhp}`;

  el('hpBossBar').style.width = (bossHP/bossHPMax*100)+'%';

  el('hpBossText').textContent = `${bossHP}/${bossHPMax}`;

  el('buffs').textContent = state.buffs.sword ? 'คฑาเวท' : 'ไม่มี';

  el('gold').textContent = state.gold;

}

// ================= Log =================

function log(msg){

  const logEl = el('log');

  logEl.innerHTML = `<div>${msg}</div>` + logEl.innerHTML;

}

// ================= Effects =================

let effects = [];

const ctx = el('c').getContext('2d');

function drawScene(){

  ctx.clearRect(0,0,el('c').width,el('c').height);

  ctx.fillStyle='#0b0b20'; 

  ctx.fillRect(0,0,el('c').width,el('c').height);

  drawHero();

  drawBoss();

  for(let i=effects.length-1;i>=0;i--){

    const e = effects[i];

    if(e.type==='light') drawLightning(e);

    if(e.type==='explosion') drawExplosion(e);

    if(e.type==='firework') drawFirework(e);

    e.t++;

    e.alpha -= 0.02;

    if(e.alpha <= 0) effects.splice(i,1);

  }

  state.heroAnim++;

  state.bossAnim++;

  if(state.heroHit>0) state.heroHit--;

  if(state.bossHit>0) state.bossHit--;

}

// ================= Draw Hero & Boss =================

function drawHero(){

  ctx.save();

  const x = 80;

  const y = 120 + Math.sin(state.heroAnim * 0.1) * 0.6;

  ctx.translate(x, y);

  ctx.fillStyle = state.heroHit > 0 ? '#94a3b8' : '#1e3a8a';

  ctx.fillRect(-10, 0, 20, 30);

  ctx.beginPath();

  ctx.moveTo(-15,0); ctx.lineTo(0,-25); ctx.lineTo(15,0); ctx.closePath();

  ctx.fillStyle = '#2563eb'; ctx.fill();

  ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3;

  ctx.beginPath(); ctx.moveTo(10,5); ctx.lineTo(25,-10); ctx.stroke();

  ctx.restore();

}

function drawBoss(){

  ctx.save();

  const x = 240 + Math.sin(state.bossAnim*0.05)*5;

  const y = 90 + Math.sin(state.bossAnim*0.08)*2;

  ctx.translate(x, y);

  ctx.fillStyle = state.bossHit>0 ? '#b91c1c' : '#3b0000';

  ctx.beginPath();

  ctx.ellipse(0,0,40,50,0,0,Math.PI*2);

  ctx.fill();

  ctx.fillStyle='#ff0000';

  ctx.beginPath();

  ctx.arc(-12,-10,5,0,Math.PI*2);

  ctx.arc(12,-10,5,0,Math.PI*2);

  ctx.fill();

  ctx.fillStyle='#fff';

  ctx.beginPath();

  ctx.moveTo(-10,10); ctx.lineTo(-5,20); ctx.lineTo(0,10);

  ctx.lineTo(5,20); ctx.lineTo(10,10);

  ctx.fill();

  ctx.restore();

}

// ================= Effects Draw =================

function drawLightning(e){

  ctx.save();

  ctx.strokeStyle = `rgba(150,220,255,${e.alpha})`;

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(100,90);

  for(let i=0;i<6;i++){

    ctx.lineTo(100+i*25+Math.random()*5,90+Math.random()*10-5);

  }

  ctx.lineTo(240,95);

  ctx.stroke(); 

  ctx.restore();

}

function drawExplosion(e){

  ctx.save(); ctx.fillStyle=`rgba(255,50,50,${e.alpha})`;

  ctx.beginPath(); ctx.arc(180,100,e.t*2,0,Math.PI*2); ctx.fill(); ctx.restore();

}

function drawFirework(e){

  ctx.save();

  ctx.fillStyle=`rgba(${Math.floor(200+Math.random()*55)},${Math.floor(Math.random()*255)},0,${e.alpha})`;

  ctx.beginPath();

  ctx.arc(e.x+e.dx*e.t,e.y+e.dy*e.t,e.size,0,Math.PI*2);

  ctx.fill();

  ctx.restore();

}

// ================= Attacks =================

function heroAttack(){ for(let i=0;i<3;i++){ effects.push({type:'light',alpha:1,t:0}); } state.bossHit=2; }

function bossAttack(){ for(let i=0;i<10;i++){ effects.push({type:'explosion',alpha:1,t:i}); } state.heroHit=2; }

// ================= Questions =================

const questions=[

  ['งบดุลประกอบด้วยอะไรบ้าง?',['สินทรัพย์ หนี้สิน ทุน','รายได้ ค่าใช้จ่าย','กระแสเงินสด'],0],

  ['งบกำไรขาดทุนใช้เพื่อ?',['วัดผลการดำเนินงาน','วัดฐานะการเงิน','วัดกระแสเงินสด'],0],

  ['บัญชีคู่หมายถึง?',['เดบิต = เครดิต','สินทรัพย์ = รายได้','ทุน = หนี้สิน'],0],

  ['รายการในฝั่งเดบิตหมายถึง?',['การเพิ่มสินทรัพย์','การลดสินทรัพย์','การเพิ่มรายได้'],0],

  ['สินทรัพย์หมุนเวียนคืออะไร?',['เงินสด ลูกหนี้ สินค้าคงเหลือ','ที่ดิน อาคาร','ทุนจดทะเบียน'],0],

  ['ค่าเสื่อมราคาคืออะไร?',['การลดมูลค่าสินทรัพย์','รายได้','หนี้สิน'],0],

  ['กระแสเงินสดมาจากไหน?',['กิจกรรมดำเนินงาน','กิจกรรมลงทุน','กิจกรรมจัดหาเงินทุน'],0],

  ['ทุนจดทะเบียนคืออะไร?',['ทุนผู้ถือหุ้น','หนี้สิน','สินทรัพย์'],0],

  ['งบกำไรขาดทุนบวกรายได้แล้วได้อะไร?',['กำไรสุทธิ','ขาดทุน','ทุน'],0],

  ['รายการเครดิตหมายถึง?',['การลดสินทรัพย์','การเพิ่มรายได้','การเพิ่มสินทรัพย์'],1]

];

let remainingQuestions = [...questions];

let correctAnswer = null;

function shuffleChoices(choices, correctIndex){

  let arr = choices.map((c,i)=>({c,i}));

  arr.sort(()=>Math.random()-0.5);

  const newIndex = arr.findIndex(x=>x.i===correctIndex);

  return [arr.map(x=>x.c), newIndex];

}

function newQuestion(){

  if(remainingQuestions.length===0) remainingQuestions=[...questions];

  const idx = Math.floor(Math.random()*remainingQuestions.length);

  let [q,choices,a] = remainingQuestions.splice(idx,1)[0];

  [choices,a] = shuffleChoices(choices,a);

  el('questionPanel').style.display='block';

  el('qText').textContent=q;

  el('qChoices').innerHTML = choices.map((c,i)=>`<label><input type="radio" name="ans" value="${i}"> ${c}</label>`).join('');

  return a;

}

// ================= Start Fight =================

el('startFight').onclick=()=>{

  if(state.inFight) return;

  state.inFight=true;

  bossHP=bossHPMax;

  log('👹 ปีศาจปรากฏแล้ว!');

  startTime=Date.now();

  correctAnswer=newQuestion();

  updateHUD();

};

// ================= Answer =================

el('answerBtn').onclick=()=>{

  const selected=[...document.getElementsByName('ans')].find(x=>x.checked);

  if(!selected) return alert('เลือกคำตอบก่อน!');

  el('questionPanel').style.display='none';

  if(Number(selected.value)===correctAnswer){

    heroAttack();

    let dmg = state.buffs.sword?40:15;

    if(state.buffs.sword){state.buffs.sword=0; log('✨ ใช้คฑาเวท!');}

    bossHP -= dmg;

    state.gold += 25;

    log(`⚡ โจมตีปีศาจ -${dmg} | ทอง +25`);

    if(bossHP <=0){

      const elapsed = Math.floor((Date.now()-startTime)/1000);

      state.inFight=false;

      bossHP=0;

      updateHUD();

      // Victory ขึ้นตรงกลาง

      const victoryText = document.createElement('div');

      victoryText.id = 'victoryText';

      victoryText.style.position='absolute';

      victoryText.style.top='50px';

      victoryText.style.left='50%';

      victoryText.style.transform='translateX(-50%)';

      victoryText.style.fontSize='30px';

      victoryText.style.color='gold';

      victoryText.style.textShadow='2px 2px 5px #000';

      victoryText.textContent = '🏆 Victory!';

      document.body.appendChild(victoryText);

      victoryEffect(); 

      saveScore(playerName, elapsed).then(()=>updateLeaderboard());

      setTimeout(()=>{victoryText.remove();},5000);

      log(`🏆 ชนะปีศาจ! ใช้เวลา ${elapsed} วินาที | ทองรวม ${state.gold}`);

      return;

    }

  } else {

    bossAttack();

    state.hp -=25;

    log('🔥 ปีศาจโจมตี -25 HP');

    if(state.hp<=0){

      log('💀 คุณแพ้ปีศาจ!');

      state.inFight=false;

      state.hp=state.maxhp;

      updateHUD();

    }

  }

  if(state.inFight) correctAnswer=newQuestion();

  updateHUD();

};

// ================= Victory Effect =================

function victoryEffect(){

  for(let i=0;i<80;i++){

    effects.push({

      type:'firework',

      x:160 + Math.random()*160-80,

      y:80 + Math.random()*80-40,

      t:0,

      alpha:1,

      dx:Math.random()*4-2,

      dy:Math.random()*-6-2,

      size:Math.random()*4+2

    });

  }

}

// ================= Save Score =================

function saveScore(name,time){

  return new Promise((resolve,reject)=>{

    const scoreRef = ref(db,'scores/'+name);

    const record = { time, date: new Date().toLocaleString() };

    get(scoreRef).then(snapshot=>{

      let prev = snapshot.val();

      if(!prev || time < prev.time){

        set(scoreRef, record).then(()=>resolve());

      } else resolve();

    }).catch(err=>reject(err));

  });

}

// ================= Leaderboard =================

function updateLeaderboard(){

  const lbEl = el('leaderboardBody');

  lbEl.innerHTML='Loading...';

  const scoresRef = ref(db,'scores');

  get(scoresRef).then(snapshot=>{

    const data = snapshot.val() || {};

    const arr = Object.keys(data).map(name=>({name, time:data[name].time, date:data[name].date}));

    arr.sort((a,b)=>a.time-b.time);

    lbEl.innerHTML = arr.map((x,i)=>`<tr>

      <td>${i+1}</td>

      <td>${x.name}</td>

      <td>${x.time}</td>

      <td>${x.date}</td>

    </tr>`).join('');

  });

}

// ================= Shop =================

el('shop').addEventListener('click',e=>{

  const item = e.target.dataset.item;

  if(!item) return;

  if(item==='potion' && state.gold>=30){ state.gold-=30; state.hp=Math.min(state.hp+50,state.maxhp); log('💊 ซื้อยา +50 HP'); }

  if(item==='sword' && state.gold>=80){ state.gold-=80; state.buffs.sword=1; log('🪄 ซื้อคฑาเวท +โจมตีแรง'); }

  updateHUD();

});

// ================= Game Loop =================

function gameLoop(){ drawScene(); requestAnimationFrame(gameLoop); }

gameLoop();

updateHUD();

updateLeaderboard();