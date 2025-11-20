diff --git a/src/ui/components/leaderboard.js b/src/ui/components/leaderboard.js
index 44028ba9d64cc2b1f02198f46b30ef62c3c303ac..95da7614342552ec47a44983fc88c397c275f7a5 100644
--- a/src/ui/components/leaderboard.js
+++ b/src/ui/components/leaderboard.js
@@ -1,15 +1,53 @@
 import { STORE } from '../../state/store.js'
+import { navigate } from '../router.js'
+
+function renderNav(container){
+  const nav = document.createElement('div')
+  nav.className = 'bottom-nav'
+  nav.innerHTML = `
+    <button data-nav="home">🏠 Home</button>
+    <button data-nav="profile">👤 Profiel</button>
+    <button class="active" data-nav="leader">🏆 Leaderboard</button>
+    <button data-nav="admin">🛠️ Admin</button>
+  `
+  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
+  container.appendChild(nav)
+}
 
 export function renderLeaderboard(){
   const page = document.createElement('div')
   page.className = 'screen active'
   page.innerHTML = `
-    <div class="row" style="justify-content:space-between"><h1>Leaderboard</h1><button class="small" id="back">Terug</button></div>
-    <div id="lead-list" class="card"></div>
+    <div class="hero fade-card">
+      <div class="row" style="justify-content:space-between; align-items:flex-start">
+        <div>
+          <div class="pill">Ranglijst</div>
+          <h1>Leaderboard</h1>
+          <p class="muted">Competitief overzicht van alle spelers en hun DRIFTY-punten.</p>
+        </div>
+        <button class="ghost small" id="back">← Terug</button>
+      </div>
+    </div>
+
+    <div class="card strong">
+      <h2>Top crews</h2>
+      <div id="lead-list" class="list-stack"></div>
+    </div>
   `
-  page.querySelector('#back').onclick = () => history.back()
+  page.querySelector('#back').onclick = () => navigate('home')
   const box = page.querySelector('#lead-list')
   const sorted = [...STORE.users].sort((a,b)=>(b.points||0)-(a.points||0))
-  box.innerHTML = sorted.map((u,i)=> `<div class="row" style="justify-content:space-between"><div>${i+1}. ${u.name}</div><div class="muted">${(u.points||0).toFixed(2)} pt</div></div>`).join('') || '<div class="muted">Nog geen spelers</div>'
+  box.innerHTML = sorted.map((u,i)=> `
+    <div class="list-row">
+      <div class="row" style="align-items:center; gap:10px">
+        <span class="pill ${i<3?'green':''}">${i+1}</span>
+        <div>
+          <div style="font-weight:600; letter-spacing:-0.01em">${u.name}</div>
+          <div class="muted">${i===0?'🚀 Aanvoerder':'Crew member'}</div>
+        </div>
+      </div>
+      <div class="pill">${(u.points||0).toFixed(2)} pt</div>
+    </div>`).join('') || '<div class="muted">Nog geen spelers</div>'
+  renderNav(page)
   return page
 }



