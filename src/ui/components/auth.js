diff --git a/src/ui/components/auth.js b/src/ui/components/auth.js
index 6a67aa34d589c07196923e4d6b3f3351e18e1689..11636da62d8ed4f811aef2f4157c0dc506498c05 100644
--- a/src/ui/components/auth.js
+++ b/src/ui/components/auth.js
@@ -1,20 +1,45 @@
-import { STORE, save } from '../../state/store.js'
+import { STORE, ensureAdminFlag, save } from '../../state/store.js'
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
+
+      <div class="card strong" style="margin-top:16px">
+        <label for="login-name">Jouw naam</label>
+        <input id="login-name" placeholder="Voer je naam in (admin: drifty)"/>
+        <div class="row" style="justify-content:space-between; align-items:center; margin-top:6px">
+          <div class="muted">Je account wordt lokaal opgeslagen.</div>
+          <button id="login-btn">Start sessie</button>
+        </div>
+      </div>
+
+      <div class="stat-grid" style="margin-top:12px">
+        <div class="stat">
+          <div class="label">Nieuw account</div>
+          <div class="value">+5 punten</div>
+          <div class="muted">Je start direct met een bonus.</div>
+        </div>
+        <div class="stat">
+          <div class="label">Beveiligde opslag</div>
+          <div class="value">Lokaal</div>
+          <div class="muted">Gegevens blijven op dit device.</div>
+        </div>
+      </div>
+    </div>
   `
   wrap.querySelector('#login-btn').onclick = () => {
     const name = wrap.querySelector('#login-name').value.trim()
     if(!name) return alert('Voer een naam in')
     let u = STORE.users.find(x=>x.name===name)
     if(!u){ u = { id:crypto.randomUUID?.() || name, name, points:5, purchases:[], badges:[] }; STORE.users.push(u) }
+    ensureAdminFlag(u)
     STORE.currentUser = u; save(); navigate('home')
   }
   return wrap
 }




