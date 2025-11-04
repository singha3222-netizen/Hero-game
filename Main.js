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
window.playerName = prompt("กรุณากรอกชื่อผู้เล่น:", "ผู้กล้า") || "ผู้กล้า";

window.state = {
  hp: 100,
  maxhp: 100,
  gold: 60,
  buffs: { sword: 0 },
  inFight: false,
  heroHit: 0,
  bossHit: 0
};

const bossHPMax = 300;
let bossHP = bossHPMax;
const el = id => document.getElementById(id);

// ================= HUD =================
window.updateHUD = function(){
  el('hpHeroBar').style.width = (window.state.hp / window.state.maxhp * 100) + '%';
  el('hpHeroText').textContent = `${window.state.hp}/${window.state.maxhp}`;
  el('hpBossBar').style.width = (bossHP / bossHPMax * 100) + '%';
  el('hpBossText').textContent = `${bossHP}/${bossHPMax}`;
  el('buffs').textContent = window.state.buffs.sword ? 'คฑาเวท' : 'ไม่มี';
  el('gold').textContent = window.state.gold;
};

// ================= Log =================
function log(msg){
  const logEl = el('log');
  logEl.innerHTML = `<div>${msg}</div>` + logEl.innerHTML;
}

// ================= Canvas =================
const ctx = el('c').getContext('2d');
let effects = [];

function drawScene(){
  ctx.clearRect(0,0,el('c').width,el('c').height);
  ctx.fillStyle='#0b0b20'; ctx.fillRect(0,0,el('c').width,el('c').height);
  drawHero(); drawBoss();
  for(let i=effects.length-1;i>=0;i--){
    const e=effects[i]; e.t++; e.alpha-=0.02;
    if(e.type==='light') drawLightning(e);
    if(e.type==='explosion') drawExplosion(e);
    if(e.alpha<=0) effects.splice(i,1);
  }
  if(window.state.heroHit>0) window.state.heroHit--;
  if(window.state.bossHit>0) window.state.bossHit--;
  requestAnimationFrame(drawScene);
}

// ================= Hero & Boss =================
function drawHero(){ ctx.fillStyle=window.state.heroHit>0?'#94a3b8':'#1e3a8a'; ctx.fillRect(70,120,20,30); }
function drawBoss(){ ctx.fillStyle=bossHP<=0?'#3b0000':'#b91c1c'; ctx.beginPath(); ctx.ellipse(240,90,40,50,0,0,Math.PI*2); ctx.fill(); }

// ================= Effects =================
function drawLightning(e){ ctx.strokeStyle=`rgba(150,220,255,${e.alpha})`; ctx.beginPath(); ctx.moveTo(100,90); ctx.lineTo(240,95); ctx.stroke(); }
function drawExplosion(e){ ctx.fillStyle=`rgba(255,50,50,${e.alpha})`; ctx.beginPath(); ctx.arc(180,100,e.t*2,0,Math.PI*2); ctx.fill(); }

// ================= Attacks =================
function heroAttack(){ window.state.bossHit=2; effects.push({type:'light',alpha:1,t:0}); }
function bossAttack(){ window.state.heroHit=2; effects.push({type:'explosion',alpha:1,t:0}); }

// ================= Questions =================
const questions=[
  ['งบดุลประกอบด้วยอะไรบ้าง?',['สินทรัพย์ หนี้สิน ทุน','รายได้ ค่าใช้จ่าย','กระแสเงินสด'],0],
  ['งบกำไรขาดทุนใช้เพื่อ?',['วัดผลการดำเนินงาน','วัดฐานะการเงิน','วัดกระแสเงินสด'],0],
  ['บัญชีคู่หมายถึง?',['เดบิต = เครดิต','สินทรัพย์ = รายได้','ทุน = หนี้สิน'],0]
];
let remainingQuestions=[...questions], correctAnswer=null;
function newQuestion(){
  if(remainingQuestions.length===0) remainingQuestions=[...questions];
  const idx=Math.floor(Math.random()*remainingQuestions.length);
  const [q,choices,a]=remainingQuestions.splice(idx,1)[0];
  el('questionPanel').style.display='block';
  el('qText').textContent=q;
  el('qChoices').innerHTML=choices.map((c,i)=>`<label><input type="radio" name="ans" value="${i}"> ${c}</label>`).join('');
  return a;
}

// ================= Start Fight =================
let startTime=null;
el('startFight').onclick = ()=>{
  if(window.state.inFight) return;
  window.state.inFight=true; bossHP=bossHPMax; startTime=Date.now();
  log('👹 ปีศาจปรากฏแล้ว!'); correctAnswer=newQuestion(); window.updateHUD();
};

// ================= Answer =================
el('answerBtn').onclick = ()=>{
  const selected=[...document.getElementsByName('ans')].find(x=>x.checked);
  if(!selected) return alert('เลือกคำตอบก่อน!');
  el('questionPanel').style.display='none';

  if(Number(selected.value)===correctAnswer){
    heroAttack();
    let dmg = window.state.buffs.sword?40:15;
    if(window.state.buffs.sword){ window.state.buffs.sword=0; log('✨ ใช้คฑาเวท!'); }
    bossHP -= dmg;
    window.state.gold += 25;
    log(`⚡ โจมตีปีศาจ -${dmg} | ทอง +25`);

    if(bossHP <= 0){
      const elapsed=Math.floor((Date.now()-startTime)/1000);
      window.state.inFight=false; bossHP=0; window.updateHUD();
      victory();
      saveScore(window.playerName,elapsed).then(()=>window.updateLeaderboard());
      return;
    }
  } else { bossAttack(); window.state.hp -=25; log('🔥 ปีศาจโจมตี -25 HP'); }

  if(window.state.inFight) correctAnswer=newQuestion();
  window.updateHUD();
};

// ================= Shop =================
el('shop').addEventListener('click', e=>{
  const item=e.target.dataset.item;
  if(!item) return;
  if(item==='potion' && window.state.gold>=30){ window.state.gold-=30; window.state.hp=Math.min(window.state.maxhp,window.state.hp+50); log('💊 ซื้อยา +50 HP'); }
  if(item==='sword' && window.state.gold>=80){ window.state.gold-=80; window.state.buffs.sword=1; log('🪄 ซื้อคฑาเวท'); }
  window.updateHUD();
});

// ================= Victory =================
function victory(){
  const vtxt=document.createElement('div');
  vtxt.textContent='🏆 VICTORY!';
  Object.assign(vtxt.style,{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'50px',color:'gold',fontWeight:'bold',textShadow:'2px 2px 10px #000'});
  document.body.appendChild(vtxt);
  setTimeout(()=>document.body.removeChild(vtxt),3000);
}

// ================= Firebase Leaderboard =================
window.saveScore = async function(name,time){
  const scoreRef=ref(db,'scores/'+name);
  const snap=await get(scoreRef);
  if(!snap.exists() || time<snap.val().time){
    await set(scoreRef,{time:time,date:new Date().toLocaleDateString(),gold:window.state.gold});
  }
}

window.updateLeaderboard = async function(){
  const lbBody=el('leaderboardBody'); lbBody.innerHTML='';
  const snap=await get(ref(db,'scores'));
  if(snap.exists()){
    const arr=Object.entries(snap.val()).map(([name,data])=>({name,...data}));
    arr.sort((a,b)=>a.time-b.time);
    arr.forEach((e,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${i+1}</td><td>${e.name}</td><td>${e.time}</td><td>${e.date}</td>`;
      lbBody.appendChild(tr);
    });
  }
}

// ================= Initialize =================
window.updateHUD();
drawScene();
window.updateLeaderboard();
