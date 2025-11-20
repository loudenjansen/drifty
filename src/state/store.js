diff --git a/src/state/store.js b/src/state/store.js
index 3d659f82debb00286c8c01f7c0cbb5d8273139a8..650ca2e2c0acd1b3495e9a199c3f255b2ef76217 100644
--- a/src/state/store.js
+++ b/src/state/store.js
@@ -1,36 +1,48 @@
 import { storage } from './storage.js'
 
 export const STORE = {
   users: [],
   boats: [],
   reservations: [],
   weather: { code: 'green' },
   safety: {},
   docs: [],
   incidents: [],
   chats: [],
   currentUser: null,
   currentBoatId: null,
 }
 
 export function initStore(){
   if (!STORE.boats || !STORE.boats.length){
     STORE.boats = [
       { id:1, name:'Boot 1', x:80,  y:60,  status:'available' },
       { id:2, name:'Boot 2', x:220, y:120, status:'available' },
       { id:3, name:'Boot 3', x:340, y:160, status:'available' },
     ]
   }
 }
 
+export function ensureAdminFlag(user){
+  if (!user) return false
+  const isAdmin = user.name?.toLowerCase() === 'drifty'
+  user.isAdmin = !!isAdmin
+  return user.isAdmin
+}
+
 export function save(){
   storage.saveAll({ ...STORE, currentUser: STORE.currentUser, currentBoatId: STORE.currentBoatId })
   if (STORE.currentUser) storage.saveUserName(STORE.currentUser.name)
 }
 
 export function loadFromStorage(){
   const data = storage.loadAll()
   if (Object.keys(data).length){ Object.assign(STORE, data) }
   const cu = storage.loadUserName()
-  if (cu) STORE.currentUser = STORE.users.find(u => u.name === cu) || null
+  if (STORE.users?.length){ STORE.users.forEach(ensureAdminFlag) }
+  if (cu){
+    const found = STORE.users.find(u => u.name === cu)
+    if (found) STORE.currentUser = found
+  }
+  if (STORE.currentUser) ensureAdminFlag(STORE.currentUser)
 }

