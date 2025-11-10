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

export function save(){
  storage.saveAll({ ...STORE, currentUser: STORE.currentUser, currentBoatId: STORE.currentBoatId })
  if (STORE.currentUser) storage.saveUserName(STORE.currentUser.name)
}

export function loadFromStorage(){
  const data = storage.loadAll()
  if (Object.keys(data).length){ Object.assign(STORE, data) }
  const cu = storage.loadUserName()
  if (cu) STORE.currentUser = STORE.users.find(u => u.name === cu) || null
}
