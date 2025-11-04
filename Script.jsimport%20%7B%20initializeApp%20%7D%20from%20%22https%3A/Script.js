import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
  ctx.fillStyle='#0b0b20'; ctx.fillRect(0,0,el('c').width,el('c').height);

  for(let e of effects){
    e.t++; e.alpha -= 0.03;
    if(e.type==='light') drawLightning(e);
    if(e.type==='explosion') drawExplosion(e);
  }
  effects = effects.filter(e => e.alpha > 0.05);

  drawHero();
  drawBoss();

  state.heroAnim++; state.bossAnim++;
  if(state.heroHit>0) state.heroHit--;
  if(state.bossHit>0) state.bossHit--;
}

// ================= Draw Hero & Boss =================
function drawHero(){
  ctx.save();
  const x = 80;
  const y = 120 + Math.sin(state.heroAnim * 0.1) * 0.6;
  ctx.translate(x, y);

  // ตัวฮีโร่
  ctx.fillStyle = state.heroHit > 0 ? '#94a3b8' : '#1e3a8a';
  ctx.fillRect(-10, 0, 20, 30);

  // เสื้อคลุมสามเหลี่ยม
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(0, -25);
  ctx.lineTo(15, 0);
  ctx.closePath();
  ctx.fillStyle = '#2563eb';
  ctx.fill();

  // ดาบ/ไม้เท้า
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, 5);
  ctx.lineTo(25, -10);
  ctx.stroke();

  ctx.restore();
}

function drawBoss(){
  ctx.save();
  const x = 240;
  const y = 90 + Math.sin(state.bossAnim * 0.08) * 0.4;
  ctx.translate(x, y);

  // ตัวบอส
  ctx.fillStyle = state.bossHit > 0 ? '#b91c1c' : '#3b0000';
  ctx.beginPath(); ctx.ellipse(0, 0, 35, 45, 0, 0, Math.PI*2); ctx.fill();

  // แขน/เขา
  ctx.fillStyle = 'rgba(80,0,0,0.7)';
  ctx.beginPath();
  ctx.moveTo(-50, -10); ctx.lineTo(-80, -30); ctx.lineTo(-40, 0);
  ctx.moveTo(50, -10); ctx.lineTo(80, -30); ctx.lineTo(40, 0);
  ctx.fill();

  // ตา
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(-10, -5, 5, 0, Math.PI*2);
  ctx.arc(10, -5, 5, 0, Math.PI*2);
  ctx.fill();

  // ปาก/ฟัน
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-10, 15, 20, 15);

  ctx.restore();
}

// ================= Effects =================
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
  ctx.stroke(); ctx.restore();
}

function drawExplosion(e){
  ctx.save(); ctx.fillStyle=`rgba(255,50,50,${e.alpha})`;
  ctx.beginPath(); ctx.arc(180,100,e.t*2,0,Math.PI*2); ctx.fill(); ctx.restore();
}

function heroAttack(){for(let i=0;i<3;i++) effects.push({type:'light',alpha:1,t:0}); state.bossHit=2;}
function bossAttack(){for(let i=0;i<10;i++) effects.push({type:'explosion',alpha:1,t:i}); state.heroHit=2;}

// ================= Questions =================
const questions=[
  ['งบดุลประกอบด้วยอะไรบ้าง?', ['สินทรัพย์ หนี้สิน ทุน','รายได้ ค่าใช้จ่าย','กระแสเงินสด'],0],
  ['งบกำไรขาดทุนใช้เพื่อ?', ['วัดผลการดำเนินงาน','วัดฐานะการเงิน','วัดกระแสเงินสด'],0],
  ['บัญชีคู่หมายถึง?', ['เดบิต = เครดิต','สินทรัพย์ = รายได้','ทุน = หนี้สิน'],0],
  ['รายการในฝั่งเดบิตหมายถึง?', ['การเพิ่มสินทรัพย์','การลดสินทรัพย์','การเพิ่มรายได้'],0],
  ['รายการในฝั่งเครดิตหมายถึง?', ['การเพิ่มรายได้','การเพิ่มค่าใช้จ่าย','การเพิ่มสินทรัพย์'],0],
  ['ต้นทุนขายคำนวณอย่างไร?', ['สินค้าต้นงวด + ซื้อ - ปลายงวด','รายได้ - ค่าใช้จ่าย','สินทรัพย์ - หนี้สิน'],0],
  ['ต้นทุนการผลิตคืออะไร?', ['ค่าแรง + วัตถุดิบ + ค่าใช้จ่ายการผลิต','รายได้ทั้งหมด','กำไรขั้นต้น'],0],
  ['ภาษีมูลค่าเพิ่มคิดกี่เปอร์เซ็นต์?', ['7%','5%','10%'],0],
  ['ภาษีหัก ณ ที่จ่าย ใช้เมื่อ?', ['มีการจ่ายค่าบริการหรือแรงงาน','ขายสินค้าทั่วไป','ซื้อต่างประเทศ'],0],
  ['สมุดรายวันทั่วไปคืออะไร?', ['สมุดบันทึกรายการประจำวัน','สมุดรวมยอดบัญชี','สมุดงบดุล'],0],
  ['ใบกำกับภาษีออกเมื่อ?', ['มีการขายสินค้าหรือบริการ','รับเงินสดเท่านั้น','จ่ายค่าแรง'],0],
  ['เอกสารใดใช้รับเงินสด?', ['ใบเสร็จรับเงิน','ใบสำคัญจ่าย','ใบกำกับภาษี'],0],
  ['เอกสารใดใช้จ่ายเงินสด?', ['ใบสำคัญจ่าย','ใบกำกับภาษี','ใบเสร็จรับเงิน'],0],
  ['งบกระแสเงินสดแสดงอะไร?', ['การรับและจ่ายเงินสด','กำไรสุทธิ','ยอดสินทรัพย์'],0],
  ['งบแสดงฐานะการเงินคือ?', ['งบดุล','งบกำไรขาดทุน','งบต้นทุน'],0],
  ['รายการปรับปรุงคืออะไร?', ['การแก้ไขยอดสิ้นงวด','การเพิ่มทุน','การโอนเงิน'],0],
  ['ค่าเสื่อมราคาคืออะไร?', ['การกระจายต้นทุนสินทรัพย์ถาวร','การเพิ่มทุน','การลดหนี้สิน'],0],
  ['ค่าเผื่อหนี้สงสัยจะสูญคือ?', ['ประมาณการหนี้ที่อาจเก็บไม่ได้','หนี้สินคงค้าง','ทุนสำรอง'],0],
  ['สินทรัพย์หมุนเวียนหมายถึง?', ['สินทรัพย์ที่ใช้จ่ายใน 1 ปี','สินทรัพย์ถาวร','ทุนเจ้าของ'],0],
  ['เจ้าหนี้การค้าอยู่ฝั่งใด?', ['หนี้สิน','สินทรัพย์','ทุน'],0],
  ['ลูกหนี้การค้าอยู่ฝั่งใด?', ['สินทรัพย์','หนี้สิน','ทุน'],0],
  ['กำไรขั้นต้นคำนวณจาก?', ['รายได้จากการขาย - ต้นทุนขาย','รายได้ - ค่าใช้จ่ายทั้งหมด','สินทรัพย์ - หนี้สิน'],0],
  ['กำไรสุทธิเท่ากับ?', ['กำไรขั้นต้น - ค่าใช้จ่ายอื่น','รายได้ทั้งหมด','ต้นทุนขาย - รายได้'],0],
  ['ถ้าซื้ออุปกรณ์ด้วยเงินสด?', ['สินทรัพย์เพิ่มลดเท่ากัน','สินทรัพย์เพิ่ม','ทุนลด'],0],
  ['ถ้ารับเงินค่าบริการล่วงหน้า?', ['สินทรัพย์และหนี้สินเพิ่มขึ้น','รายได้เพิ่มทันที','ทุนลด'],0]
];

let correctAnswer = null;

function newQuestion(){
  const [q,choices,a] = questions[Math.floor(Math.random()*questions.length)];
  el('questionPanel').style.display='block';
  el('qText').textContent = q;
  el('qChoices').innerHTML = choices.map((c,i)=>`<label><input type="radio" name="ans" value="${i}"> ${c}</label>`).join('');
  return a;
}

// ================= Start Fight =================
el('startFight').onclick = () => {
  if(state.inFight) return;
  state.inFight = true;
  bossHP = bossHPMax;
  log('👹 ปีศาจปรากฏแล้ว!');
  startTime = Date.now();
  correctAnswer = newQuestion();
  updateHUD();
};

// ================= Answer =================
el('answerBtn').onclick = () => {
  const selected = [...document.getElementsByName('ans')].find(x=>x.checked);
  if(!selected) return alert('เลือกคำตอบก่อน!');
  el('questionPanel').style.display='none';

  if(Number(selected.value)===correctAnswer){
    heroAttack();
    let dmg = state.buffs.sword?40:15;
    if(state.buffs.sword){state.buffs.sword=0; log('✨ ใช้คฑาเวท!');}
    bossHP -= dmg;
    log(`⚡ โจมตีปีศาจ -${dmg}`);
    if(bossHP<=0){
      const elapsed = Math.floor((Date.now()-startTime)/1000);
      log(`🏆 ชนะ! ใช้เวลา ${elapsed} วินาที`);
      saveScore(playerName, elapsed);
      state.inFight=false;
      updateHUD();
      return;
    }
  }else{
    bossAttack();
    state.hp -= 25;
    log('🔥 ปีศาจโจมตี -25 HP');
    if(state.hp<=0){ alert('💀 Game Over'); state.hp=state.maxhp; state.inFight=false; updateHUD(); return;}
  }
  updateHUD();
  setTimeout(()=>{correctAnswer=newQuestion();},500);
};

// ================= Shop =================
document.querySelectorAll('[data-item]').forEach(btn=>{
  btn.onclick=()=>{
    const item = btn.dataset.item;
    if(item==='potion'){state.hp=Math.min(state.maxhp,state.hp+50); log('💊 +50 HP');}
    else if(item==='sword'){state.buffs.sword=1; log('🪄 คฑาเวทพร้อม!');}
    updateHUD();
  };
});

// ================= Firebase Save =================
async function saveScore(name, time){
  const data = { name,time,date:new Date().toLocaleString()};
  await set(ref(db,'scores/'+name),data);
  loadLeaderboard();
}

// ================= Load Leaderboard =================
async function loadLeaderboard(){
  const snapshot = await get(child(ref(db),'scores'));
  let scores = [];
  if(snapshot.exists()){ scores=Object.values(snapshot.val()); }
  scores.sort((a,b)=>a.time-b.time);
  const tbody = el('leaderboardBody');
  if(!tbody) return;
  tbody.innerHTML='';
  scores.forEach((s,i)=>{
    const tr=document.createElement('tr');
    if(s.name===playerName) tr.classList.add('self');
    tr.innerHTML=`<td>${i+1}</td><td>${s.name}</td><td>${s.time}</td><td>${s.date}</td>`;
    tbody.appendChild(tr);
  });
}

// ================= Game Loop =================
function loop(){
  drawScene();
  requestAnimationFrame(loop);
}

// ================= Init =================
updateHUD();
loadLeaderboard();
loop();
