import { STORE, save, generateShareCode } from '../../state/store.js'
import { navigate } from '../router.js'

function getBoats(){
  return Array.isArray(STORE.boats) ? STORE.boats : []
}

function getBoatById(id){
  return getBoats().find(b => b.id === id)
}

function normalizeReservation(res){
  if(!res || typeof res !== 'object') return null
  if(!res.users || !Array.isArray(res.users)) res.users = []
  if(typeof res.total !== 'number') res.total = Number(res.total || 0)
  if(!res.shareCode || !/^\d{4}$/.test(res.shareCode)) res.shareCode = generateShareCode()
  if(!res.owner && res.users.length) res.owner = res.users[0]
  return res
}

function crew(res){
  const norm = normalizeReservation(res)
  return norm?.users || []
}

function renderNav(container){
  const nav = document.createElement('div')
  nav.className = 'bottom-nav'
  const isAdmin = !!STORE.currentUser?.isAdmin
  nav.innerHTML = `
    <button data-nav="home">🏠 Home</button>
    <button class="active" data-nav="share">🤝 Delen</button>
    <button data-nav="social">📸 Social</button>
    <button data-nav="shop">🛒 Shop</button>
    <button data-nav="profile">👤 Profiel</button>
    <button data-nav="leader">🏆 Leaderboard</button>
    ${isAdmin ? '<button data-nav="admin">🛠️ Admin</button>' : ''}
  `
  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
  container.appendChild(nav)
}

function ensureCodes(){
  if(!Array.isArray(STORE.reservations)) STORE.reservations = []
  let changed = false
  (STORE.reservations||[]).forEach(r => {
    const normalized = normalizeReservation(r)
    if(normalized !== r) changed = true
  })
  if(changed) save()
}

function renderMyCodes(page){
  const box = page.querySelector('#share-my')
  box.innerHTML = ''
  const me = STORE.currentUser?.name
  const mine = (STORE.reservations||[])
    .map(normalizeReservation)
    .filter(Boolean)
    .filter(r=> (r.owner===me))
    .sort((a,b)=> new Date(a.start)-new Date(b.start))
  if(!mine.length){ box.innerHTML = '<div class="muted">Nog geen deelcodes. Maak eerst een reservering.</div>'; return }
  mine.forEach(r=>{
    const boat = getBoatById(r.boatId)
    const per = (r.total/Math.max(1,crew(r).length)).toFixed(3)
    const card = document.createElement('div')
    card.className = 'card strong'
    card.innerHTML = `
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat?.name||'Boot'}</div>
          <div style="font-weight:700; font-size:18px; margin-top:6px">${new Date(r.start).toLocaleString()}</div>
          <div class="muted">Crew: ${r.users.length} • ~${per} pt p.p.</div>
        </div>
        <div class="row" style="gap:8px; align-items:center; flex-wrap:wrap">
          <span class="pill ghost">${r.shareCode}</span>
          <button class="small" data-copy>Code kopiëren</button>
        </div>
      </div>
    `
    card.querySelector('[data-copy]').onclick = () => {
      const text = r.shareCode
      if(navigator.clipboard){ navigator.clipboard.writeText(text) }
      else { prompt('Kopieer de code', text) }
      alert('Deelcode gekopieerd')
    }
    box.appendChild(card)
  })
}

function joinReservation(res, page, codeInput){
  const normalized = normalizeReservation(res)
  if(!normalized) return alert('Geen reservering gevonden')
  const me = STORE.currentUser?.name
  if(!me) return alert('Log in om mee te doen')
  const crewList = crew(normalized)
  const codeRaw = codeInput ?? prompt('Voer de 4-cijferige code in')
  if(!codeRaw) return alert('Voer de code in om aan te sluiten')
  const code = codeRaw.trim()
  if(code !== normalized.shareCode) return alert('Onjuiste code. Vraag de code aan de host.')
  if(!crewList.includes(me)){
    crewList.push(me)
    save()
    renderMyCodes(page)
    renderOpenShares(page)
    showResult(page, normalized)
    alert('Je bent toegevoegd. Kosten worden verdeeld!')
  } else {
    alert('Je stond al op deze reservering')
  }
}

function renderOpenShares(page){
  const box = page.querySelector('#share-open')
  if(!box) return
  box.innerHTML = ''
  const me = STORE.currentUser?.name
  const list = (STORE.reservations||[])
    .map(normalizeReservation)
    .filter(Boolean)
    .filter(r => (r.users?.length)
      && (!me || !r.users.includes(me)))
    .sort((a,b)=> new Date(a.start)-new Date(b.start))

  if(!list.length){ box.innerHTML = '<div class="muted">Nog geen gedeelde boten beschikbaar.</div>'; return }

  list.forEach(r => {
    const boat = getBoatById(r.boatId)
    const per = (r.total/Math.max(1,crew(r).length+1)).toFixed(3)
    const card = document.createElement('div')
    card.className = 'card strong'
    card.innerHTML = `
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat?.name||'Boot'}</div>
          <div style="font-weight:700; margin-top:6px">${new Date(r.start).toLocaleString()}</div>
          <div class="muted">Crew: ${r.users.join(', ')} • ~${per} pt p.p. (incl. jou)</div>
        </div>
        <div class="row" style="gap:8px; align-items:center; flex-wrap:wrap">
          <span class="pill ghost">Code via host</span>
          <button class="small" data-join>Inschrijven</button>
        </div>
      </div>
    `
    card.querySelector('[data-join]').onclick = () => joinReservation(r, page)
    box.appendChild(card)
  })
}

function showResult(page, res){
  const normalized = normalizeReservation(res)
  if(!normalized) return
  const boat = getBoatById(normalized.boatId)
  const crewList = crew(normalized)
  const per = (normalized.total/Math.max(1,crewList.length)).toFixed(3)
  const wrap = page.querySelector('#share-result')
  wrap.innerHTML = `
    <div class="card fade-card">
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat?.name||'Boot'}</div>
          <h2 style="margin:6px 0">Slot gedeeld</h2>
          <div class="muted">${new Date(normalized.start).toLocaleString()} → ${new Date(normalized.end).toLocaleString()}</div>
        </div>
        <span class="pill green">Crew: ${crewList.length}</span>
      </div>
      <div class="msg" style="margin-top:10px">Kosten worden gesplitst: ${normalized.total.toFixed(3)} pt / ${crewList.length} = ${per} pt per persoon.</div>
      <div class="row" style="gap:8px; margin-top:8px; flex-wrap:wrap">
        <span class="pill ghost">Deelcode: ${normalized.shareCode}</span>
        <button class="small" id="to-boat">Naar boot</button>
      </div>
    </div>
  `
  wrap.querySelector('#to-boat').onclick = () => { STORE.currentBoatId = normalized.boatId; navigate('boat') }
}

function redeem(page){
  const input = page.querySelector('#share-code')
  const code = (input.value||'').trim()
  if(!code) return alert('Voer een code in')
  if(!STORE.currentUser) return alert('Log eerst in om een code te gebruiken')
  const res = (STORE.reservations||[]).find(r=> (r.shareCode||'') === code)
  const normalized = normalizeReservation(res)
  if(!normalized) return alert('Onbekende code')
  if(!normalized.shareCode) normalized.shareCode = code
  const me = STORE.currentUser?.name
  const crewList = crew(normalized)
  if(me && !crewList.includes(me)) crewList.push(me)
  save()
  input.value = ''
  STORE.sharePrefillCode = null
  renderMyCodes(page)
  renderOpenShares(page)
  showResult(page, normalized)
  alert('Je bent toegevoegd aan de reservering. Kosten worden gesplitst!')
}

function renderReservedList(page){
  const box = page.querySelector('#share-reserved')
  box.innerHTML = ''
  const me = STORE.currentUser?.name
  const list = (STORE.reservations||[])
    .map(normalizeReservation)
    .filter(Boolean)
    .sort((a,b)=> new Date(a.start)-new Date(b.start))

  if(!list.length){
    box.innerHTML = '<div class="muted">Nog geen gereserveerde boten. Boek een slot en deel de code met je crew.</div>'
    return
  }

  list.forEach(res => {
    const boat = getBoatById(res.boatId)
    const crewList = crew(res)
    const isHost = !!me && res.owner === me
    const per = (res.total/Math.max(1,crewList.length)).toFixed(3)
    const card = document.createElement('div')
    card.className = 'card strong'
    card.innerHTML = `
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat?.name||'Boot'}</div>
          <div style="font-weight:700; margin-top:6px">${new Date(res.start).toLocaleString()}</div>
          <div class="muted">Crew: ${crewList.join(', ')||'—'} • ~${per} pt p.p.</div>
          ${res.owner ? `<div class="muted" style="margin-top:4px">Host: ${res.owner}</div>` : ''}
        </div>
        <div class="row" style="gap:8px; align-items:center; flex-wrap:wrap; justify-content:flex-end">
          <span class="pill ghost">${isHost ? `Code: ${res.shareCode}` : 'Code via host'}</span>
          ${isHost ? '<button class="small" data-copy>Kopieer code</button>' : '<button class="small" data-join>Inschrijven</button>'}
        </div>
      </div>
    `
    const copy = card.querySelector('[data-copy]')
    if(copy){
      copy.onclick = () => {
        if(navigator.clipboard){ navigator.clipboard.writeText(res.shareCode) }
        else { prompt('Kopieer de code', res.shareCode) }
        alert('Code gekopieerd')
      }
    }
    const joinBtn = card.querySelector('[data-join]')
    if(joinBtn){
      joinBtn.onclick = () => joinReservation(res, page)
    }
    box.appendChild(card)
  })
}

function renderReserveableBoats(page){
  const box = page.querySelector('#share-boats')
  if(!box) return
  box.innerHTML = ''
  const boats = getBoats()
  if(!boats.length){ box.innerHTML = '<div class="muted">Geen boten beschikbaar.</div>'; return }

  boats.forEach(boat => {
    const card = document.createElement('div')
    card.className = 'card strong'
    card.innerHTML = `
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat.name}</div>
          <div class="muted" style="margin-top:6px">${boat.location || 'Onbekende locatie'}</div>
        </div>
        <button class="small" data-reserve>Reserveer</button>
      </div>
    `
    card.querySelector('[data-reserve]').onclick = () => {
      STORE.currentBoatId = boat.id
      navigate('boat')
    }
    box.appendChild(card)
  })
}

export function renderShare(){
  ensureCodes()
  const page = document.createElement('div')
  page.className = 'screen active'
  const me = STORE.currentUser?.name || 'Gast'
  page.innerHTML = `
    <div class="hero fade-card">
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">Crew share</div>
          <h1>Deel een boot</h1>
          <p class="muted">${me}, gebruik de deelcode van de eerste reserveerder om punten te delen. Kosten worden automatisch gesplitst.</p>
        </div>
        <button class="ghost small" id="back">← Terug</button>
      </div>
    </div>

    <div class="layout-split">
      <div class="card fade-card">
        <h2>Met code aansluiten</h2>
        <p class="muted">Voer de 4-cijferige code in die je vriend heeft gedeeld om samen te varen.</p>
        <input id="share-code" placeholder="Bijv. 1234" />
        <button id="share-submit">Deelcode gebruiken</button>
        <div class="msg" style="margin-top:10px">Kosten per persoon: totaal / aantal deelnemers. 2 pers. = 0,5 pt, 4 pers. = 0,25 pt per uur.</div>
        <div id="share-result" style="margin-top:12px"></div>
      </div>
      <div class="card strong">
        <h2>Mijn deelcodes</h2>
        <p class="muted">Jij bent de eerste reserveerder van deze slots.</p>
        <div id="share-my" class="list-stack" style="margin-top:10px"></div>
      </div>
    </div>

    <div class="section-title">🚤 Meld je aan bij bestaande boten</div>
    <div class="card fade-card">
      <p class="muted">Zie welke crews al een boot hebben gereserveerd en schrijf je direct in. Je punten worden automatisch gesplitst.</p>
      <div id="share-open" class="list-stack" style="margin-top:10px"></div>
    </div>

    <div class="section-title">⛵ Overzicht gereserveerde boten</div>
    <div class="card fade-card">
      <p class="muted">Alle lopende reserveringen met hun host en verdeling. Hosts zien hun deelcode en kunnen die kopiëren.</p>
      <div id="share-reserved" class="list-stack" style="margin-top:10px"></div>
    </div>

    <div class="section-title">🛥️ Boten beschikbaar om te reserveren</div>
    <div class="card fade-card">
      <p class="muted">Kies een boot, bekijk de stad en start je reservering. Deel de code zodra je de eerste reserveerder bent.</p>
      <div id="share-boats" class="list-stack" style="margin-top:10px"></div>
    </div>
  `

  page.querySelector('#back').onclick = () => navigate('home')
  page.querySelector('#share-submit').onclick = () => redeem(page)

  if(STORE.sharePrefillCode){
    const inp = page.querySelector('#share-code')
    inp.value = STORE.sharePrefillCode
    STORE.sharePrefillCode = null
  }

  renderMyCodes(page)
  renderOpenShares(page)
  renderReservedList(page)
  renderReserveableBoats(page)
  renderNav(page)
  return page
}
