diff --git a/src/ui/components/auth.js b/src/ui/components/auth.js
index 6a67aa34d589c07196923e4d6b3f3351e18e1689..502c4a22d410637be9de0ef8b6f02d9b37d1aaec 100644
--- a/src/ui/components/auth.js
+++ b/src/ui/components/auth.js
@@ -1,20 +1,31 @@
 import { STORE, save } from '../../state/store.js'
 import { navigate } from '../router.js'
 
 export function renderLogin(){
   const wrap = document.createElement('div')
   wrap.className = 'screen active'
   wrap.innerHTML = `
-    <h1>DRIFTY — Login</h1>
-    <input id="login-name" placeholder="Voer je naam in (admin: drifty)"/>
-    <button id="login-btn">Login</button>
+    <div class="hero fade-card">
+      <div class="pill">🚤 DRIFTY Access</div>
+      <h1>Welkom terug</h1>
+      <p class="muted">Log in om je boten, reserveringen en punten te beheren. Admin login: <strong class="muted">drifty</strong>.</p>
+      <div class="card">
+        <label for="login-name">Jouw naam</label>
+        <input id="login-name" placeholder="Voer je naam in (admin: drifty)"/>
+        <div class="row" style="justify-content:space-between; align-items:center">
+          <div class="muted">Je account wordt lokaal opgeslagen.</div>
+          <button id="login-btn">Start sessie</button>
+        </div>
+      </div>
+      <div class="muted" style="margin-top:8px">Bonus: nieuwe spelers krijgen automatisch 5 punten.</div>
+    </div>
   `
   wrap.querySelector('#login-btn').onclick = () => {
     const name = wrap.querySelector('#login-name').value.trim()
     if(!name) return alert('Voer een naam in')
     let u = STORE.users.find(x=>x.name===name)
     if(!u){ u = { id:crypto.randomUUID?.() || name, name, points:5, purchases:[], badges:[] }; STORE.users.push(u) }
     STORE.currentUser = u; save(); navigate('home')
   }
   return wrap
 }


