import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const db = getDatabase();

// เสกทอง +9999
document.getElementById('addGoldBtn').onclick = async () => {
  if(!window.state || !window.playerName) return alert("เกมยังไม่โหลดเสร็จ!");
  
  window.state.gold += 9999;
  window.updateHUD();

  const playerRef = ref(db,'scores/'+window.playerName);
  const snap = await get(playerRef);
  if(snap.exists()){
    await update(playerRef,{gold:window.state.gold});
  }else{
    await set(playerRef,{
      name: window.playerName,
      gold: window.state.gold,
      time:0,
      date:new Date().toLocaleDateString()
    });
  }

  alert(`✅ เพิ่มทองให้ ${window.playerName} เรียบร้อย!`);
};

// รีเฟรช leaderboard
document.getElementById('refreshLB').onclick = async () => {
  if(typeof window.updateLeaderboard === 'function'){
    await window.updateLeaderboard();
    alert('✅ รีเฟรช Leaderboard เรียบร้อย!');
  }
};
