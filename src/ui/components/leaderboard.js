diff --git a/src/ui/components/leaderboard.js b/src/ui/components/leaderboard.js
index 44028ba9d64cc2b1f02198f46b30ef62c3c303ac..bacf8737b7f61a43174838f5319785b2373b67bd 100644
--- a/src/ui/components/leaderboard.js
+++ b/src/ui/components/leaderboard.js
@@ -1,15 +1,30 @@
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
+    <div class="row" style="justify-content:space-between"><h1>Leaderboard</h1><button class="secondary small" id="back">← Terug</button></div>
     <div id="lead-list" class="card"></div>
   `
-  page.querySelector('#back').onclick = () => history.back()
+  page.querySelector('#back').onclick = () => navigate('home')
   const box = page.querySelector('#lead-list')
   const sorted = [...STORE.users].sort((a,b)=>(b.points||0)-(a.points||0))
   box.innerHTML = sorted.map((u,i)=> `<div class="row" style="justify-content:space-between"><div>${i+1}. ${u.name}</div><div class="muted">${(u.points||0).toFixed(2)} pt</div></div>`).join('') || '<div class="muted">Nog geen spelers</div>'
+  renderNav(page)
   return page
 }

