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
  socialPosts: [],
  sharePrefillCode: null,
}

export function generateShareCode(){
  // Random 4-digit numeric code for sharing reservations
  return String(Math.floor(1000 + Math.random() * 9000))
}

function ensureArrays(){
  if (!Array.isArray(STORE.reservations)) STORE.reservations = []
  if (!Array.isArray(STORE.boats)) STORE.boats = []
}

export function initStore(){
  ensureArrays()
  if (!STORE.boats || !STORE.boats.length){
    STORE.boats = [
      { id:1, name:'Boot 1', x:80,  y:60,  status:'available', location:'Amsterdam' },
      { id:2, name:'Boot 2', x:220, y:120, status:'available', location:'Rotterdam' },
      { id:3, name:'Boot 3', x:340, y:160, status:'available', location:'Utrecht' },
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

  if (!STORE.socialPosts || !STORE.socialPosts.length){
    STORE.socialPosts = [
      {
        id: crypto.randomUUID?.() || 'sail-1',
        user: 'Mila',
        caption: 'Golden hour in de grachten — vloeiend water en zachte wind.',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        likes: 42,
        location: 'Amsterdam',
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
      },
      {
        id: crypto.randomUUID?.() || 'sail-2',
        user: 'Jasper',
        caption: 'Crew klaar, koers richting het IJ. Drifty vibes ✨',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        likes: 35,
        location: 'IJhaven',
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
      },
      {
        id: crypto.randomUUID?.() || 'sail-3',
        user: 'Noor',
        caption: 'Night cruise met neon skyline — bedankt crew! 🌊',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        likes: 28,
        location: 'Houthavens',
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
      },
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
  ensureArrays()
  const cu = storage.loadUserName()
  if (STORE.users?.length){ STORE.users.forEach(ensureAdminFlag) }
  if (cu){
    const found = STORE.users.find(u => u.name === cu)
    if (found) STORE.currentUser = found
  }
  if (STORE.currentUser) ensureAdminFlag(STORE.currentUser)
}
