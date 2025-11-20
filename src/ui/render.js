diff --git a/src/ui/render.js b/src/ui/render.js
index f1c7cc4f574a0272f931561bd2ec85b9e6ddc3f7..a7fc9189c8d8644e9a39b816eb1efe38002033b8 100644
--- a/src/ui/render.js
+++ b/src/ui/render.js
@@ -1,22 +1,26 @@
 import { getRoute, navigate } from './router.js'
 import { renderLogin } from './components/auth.js'
 import { renderHome } from './components/map.js'
 import { renderBoat } from './components/reservationList.js'
 import { renderProfile } from './components/profile.js'
 import { renderAdmin } from './components/admin.js'
 import { renderLeaderboard } from './components/leaderboard.js'
+import { STORE } from '../state/store.js'
 
 export function renderApp(){
   const app = document.getElementById('app')
   const route = getRoute()
   app.innerHTML = ''
 
   if (route === 'login') return app.appendChild(renderLogin())
   if (route === 'home')  return app.appendChild(renderHome())
   if (route === 'boat')  return app.appendChild(renderBoat())
   if (route === 'profile') return app.appendChild(renderProfile())
-  if (route === 'admin') return app.appendChild(renderAdmin())
+  if (route === 'admin'){
+    if (STORE.currentUser?.isAdmin) return app.appendChild(renderAdmin())
+    navigate('home'); return app.appendChild(renderHome())
+  }
   if (route === 'leader') return app.appendChild(renderLeaderboard())
 
   navigate('home')
 }

