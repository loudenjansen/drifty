diff --git a/src/ui/components/profile.js b/src/ui/components/profile.js
index ca0c81b984d1f1fed95780f4399326c59c4d4444..29c9fe8d1cd24a6003fdcf02580ce9c12a77d68f 100644
--- a/src/ui/components/profile.js
+++ b/src/ui/components/profile.js
@@ -1,45 +1,65 @@
 import { STORE, save } from '../../state/store.js'
+import { navigate } from '../router.js'
+
+function renderNav(container){
+  const nav = document.createElement('div')
+  nav.className = 'bottom-nav'
+  nav.innerHTML = `
+    <button data-nav="home">🏠 Home</button>
+    <button class="active" data-nav="profile">👤 Profiel</button>
+    <button data-nav="leader">🏆 Leaderboard</button>
+    <button data-nav="admin">🛠️ Admin</button>
+  `
+  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
+  container.appendChild(nav)
+}
 
 export function renderProfile(){
   const page = document.createElement('div')
   page.className = 'screen active'
   page.innerHTML = `
-    <div class="row" style="justify-content:space-between"><h1>Profiel</h1><button class="small" id="back">Terug</button></div>
-    <p><strong>Naam:</strong> <span id="p-name"></span></p>
-    <p><strong>Punten:</strong> <span id="p-pts"></span></p>
-
-    <h2>Koop punten</h2>
-    <div class="row card">
-      <button class="small" data-add="1">+1 punt</button>
-      <button class="small" data-add="5">+5 punten</button>
-      <button class="small" data-add="10">+10 punten</button>
+    <div class="row" style="justify-content:space-between; align-items:center"><h1>Profiel</h1><button class="secondary small" id="back">← Terug</button></div>
+    <div class="layout-split">
+      <div class="card fade-card">
+        <div class="pill">Account</div>
+        <p><strong>Naam:</strong> <span id="p-name"></span></p>
+        <p><strong>Punten:</strong> <span id="p-pts"></span></p>
+        <h2>Koop punten</h2>
+        <div class="row card" style="margin-top:8px">
+          <button class="small" data-add="1">+1 punt</button>
+          <button class="small" data-add="5">+5 punten</button>
+          <button class="small" data-add="10">+10 punten</button>
+        </div>
+      </div>
+      <div class="card">
+        <h2>Simulatie</h2>
+        <p class="muted">Wis lokale data en begin opnieuw.</p>
+        <button class="link small" id="reset">Reset simulatie</button>
+      </div>
     </div>
 
     <h2>Mijn reserveringen</h2>
     <div id="my-res"></div>
-
-    <div class="card">
-      <button class="small link" id="reset">Reset simulatie</button>
-    </div>
   `
-  page.querySelector('#back').onclick = () => history.back()
+  page.querySelector('#back').onclick = () => navigate('home')
   page.querySelectorAll('[data-add]').forEach(btn=> btn.onclick = () => { const n=+btn.dataset.add; STORE.currentUser.points=(STORE.currentUser.points||0)+n; save(); update() })
   page.querySelector('#reset').onclick = () => { if(confirm('Weet je zeker dat je wilt resetten?')){ localStorage.clear(); location.reload() } }
 
   function update(){
     page.querySelector('#p-name').textContent = STORE.currentUser?.name || '-'
     page.querySelector('#p-pts').textContent = (STORE.currentUser?.points ?? 0).toFixed(2)
     const mineBox = page.querySelector('#my-res'); mineBox.innerHTML=''
     const mine = (STORE.reservations||[]).filter(r=>r.users.includes(STORE.currentUser?.name)).sort((a,b)=>new Date(a.start)-new Date(b.start))
     if(!mine.length) mineBox.innerHTML = '<div class="muted">Geen reserveringen</div>'
     mine.forEach(r=>{
       const b = STORE.boats.find(x=>x.id===r.boatId)
       const el = document.createElement('div'); el.className='card'
-      el.innerHTML = `<div><strong>${b?.name||'Boot'}</strong> — ${r.status}</div><div class="muted">${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div><div class="muted">Deelnemers: ${r.users.join(', ')}</div>`
+      el.innerHTML = `<div class="row" style="justify-content:space-between; align-items:flex-start"><div><strong>${b?.name||'Boot'}</strong> — ${r.status}</div><span class="pill">${r.users.length} deelnemers</span></div><div class="muted">${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div>`
       mineBox.appendChild(el)
     })
   }
 
   update()
+  renderNav(page)
   return page
 }

