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
  shopItems: [],
  chores: [],
}

export function initStore(){
  if (!STORE.boats || !STORE.boats.length){
    STORE.boats = [
      { id:1, name:'Boot 1', x:80,  y:60,  status:'available' },
      { id:2, name:'Boot 2', x:220, y:120, status:'available' },
      { id:3, name:'Boot 3', x:340, y:160, status:'available' },
    ]
  }

  if (!STORE.shopItems || !STORE.shopItems.length){
    STORE.shopItems = [
      { id: crypto.randomUUID?.() || 'pack-50', name:'50 punten bundel', description:'Koop direct 50 punten voor snelle reserveringen.', price: 40, reward: 50, kind:'points' },
      { id: crypto.randomUUID?.() || 'tour-vip', name:'Special Night Tour', description:'Exclusieve avondtour met gids en verlichting.', price: 25, reward: 0, kind:'tour' },
      { id: crypto.randomUUID?.() || 'merch-cap', name:'DRIFTY Cap', description:'Premium navy cap met DRIFTY glow-badge.', price: 12, reward: 0, kind:'merch' },
    ]
  }

  if (!STORE.chores || !STORE.chores.length){
    STORE.chores = [
      { id: crypto.randomUUID?.() || 'clean-deck', title:'Reinig het dek', details:'Snelle poetsbeurt en check van veiligheidslijnen.', reward: 5, status:'open', claimedBy:null },
      { id: crypto.randomUUID?.() || 'refill-gear', title:'Check reddingsvesten', details:'Controleer en vul de lockers bij.', reward: 4, status:'open', claimedBy:null },
    ]
  }
}

export function ensureAdminFlag(user){
  if (!user) return false
  const isAdmin = user.name?.toLowerCase() === 'drifty'
  user.isAdmin = !!isAdmin
  return user.isAdmin
}

export function save(){
  storage.saveAll({ ...STORE, currentUser: STORE.currentUser, currentBoatId: STORE.currentBoatId })
  if (STORE.currentUser) storage.saveUserName(STORE.currentUser.name)
}

export function loadFromStorage(){
  const data = storage.loadAll()
  if (Object.keys(data).length){ Object.assign(STORE, data) }
  const cu = storage.loadUserName()
  if (STORE.users?.length){ STORE.users.forEach(ensureAdminFlag) }
  if (cu){
    const found = STORE.users.find(u => u.name === cu)
    if (found) STORE.currentUser = found
  }
  if (STORE.currentUser) ensureAdminFlag(STORE.currentUser)
}
