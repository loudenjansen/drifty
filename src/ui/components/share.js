import { STORE, save, generateShareCode } from '../../state/store.js'
import { navigate } from '../router.js'

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
  let changed = false
  (STORE.reservations||[]).forEach(r => {
    if(!r.shareCode || !/^\d{4}$/.test(r.shareCode)){ r.shareCode = generateShareCode(); changed = true }
  })
  if(changed) save()
}

function renderMyCodes(page){
  const box = page.querySelector('#share-my')
  box.innerHTML = ''
  const me = STORE.currentUser?.name
  const mine = (STORE.reservations||[]).filter(r=> (r.users?.[0]===me)).sort((a,b)=> new Date(a.start)-new Date(b.start))
  if(!mine.length){ box.innerHTML = '<div class="muted">Nog geen deelcodes. Maak eerst een reservering.</div>'; return }
  mine.forEach(r=>{
    const boat = STORE.boats.find(b=>b.id===r.boatId)
    const per = (r.total/Math.max(1,r.users.length)).toFixed(3)
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

function joinReservation(res, page){
  if(!res) return alert('Geen reservering gevonden')
  const me = STORE.currentUser?.name
  if(!me) return alert('Log in om mee te doen')
  if(!res.shareCode || !/^\d{4}$/.test(res.shareCode)) res.shareCode = generateShareCode()
  if(!res.users) res.users = []
  if(!res.users.includes(me)){
    res.users.push(me)
    save()
    renderMyCodes(page)
    renderOpenShares(page)
    showResult(page,res)
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
    .filter(r => (r.users?.length)
      && (!me || !r.users.includes(me)))
    .sort((a,b)=> new Date(a.start)-new Date(b.start))

  if(!list.length){ box.innerHTML = '<div class="muted">Nog geen gedeelde boten beschikbaar.</div>'; return }

  list.forEach(r => {
    const boat = STORE.boats.find(b=>b.id===r.boatId)
    const per = (r.total/Math.max(1,r.users.length+1)).toFixed(3)
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
          <span class="pill ghost">${r.shareCode}</span>
          <button class="small" data-join>Inschrijven</button>
        </div>
      </div>
    `
    card.querySelector('[data-join]').onclick = () => joinReservation(r, page)
    box.appendChild(card)
  })
}

function showResult(page, res){
  const boat = STORE.boats.find(b=>b.id===res.boatId)
  const per = (res.total/Math.max(1,res.users.length)).toFixed(3)
  const wrap = page.querySelector('#share-result')
  wrap.innerHTML = `
    <div class="card fade-card">
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">${boat?.name||'Boot'}</div>
          <h2 style="margin:6px 0">Slot gedeeld</h2>
          <div class="muted">${new Date(res.start).toLocaleString()} → ${new Date(res.end).toLocaleString()}</div>
        </div>
        <span class="pill green">Crew: ${res.users.length}</span>
      </div>
      <div class="msg" style="margin-top:10px">Kosten worden gesplitst: ${res.total.toFixed(3)} pt / ${res.users.length} = ${per} pt per persoon.</div>
      <div class="row" style="gap:8px; margin-top:8px; flex-wrap:wrap">
        <span class="pill ghost">Deelcode: ${res.shareCode}</span>
        <button class="small" id="to-boat">Naar boot</button>
      </div>
    </div>
  `
  wrap.querySelector('#to-boat').onclick = () => { STORE.currentBoatId = res.boatId; navigate('boat') }
}

function redeem(page){
  const input = page.querySelector('#share-code')
  const code = (input.value||'').trim()
  if(!code) return alert('Voer een code in')
  const res = (STORE.reservations||[]).find(r=> (r.shareCode||'') === code)
  if(!res) return alert('Onbekende code')
  if(!res.shareCode) res.shareCode = code
  const me = STORE.currentUser?.name
  if(me && !res.users.includes(me)) res.users.push(me)
  save()
  input.value = ''
  STORE.sharePrefillCode = null
  renderMyCodes(page)
  renderOpenShares(page)
  showResult(page, res)
  alert('Je bent toegevoegd aan de reservering. Kosten worden gesplitst!')
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
  renderNav(page)
  return page
}
