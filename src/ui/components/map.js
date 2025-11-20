import { STORE } from '../../state/store.js'
import { navigate } from '../router.js'

function renderNav(container){
  const nav = document.createElement('div')
  nav.className = 'bottom-nav'
  nav.innerHTML = `
    <button class="active" data-nav="home">🏠 Home</button>
    <button data-nav="profile">👤 Profiel</button>
    <button data-nav="leader">🏆 Leaderboard</button>
    <button data-nav="admin">🛠️ Admin</button>
  `
  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
  container.appendChild(nav)
}

export function renderHome(){
  const page = document.createElement('div')
  page.className = 'screen active'
  const username = STORE.currentUser?.name || 'Gast'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between; align-items:flex-start">
      <div>
        <div class="pill">Control Center</div>
        <h1>Welkom, ${username}</h1>
        <p class="muted">Bekijk de vloot, claim je slot en blijf op koers. Weerstatus: <strong class="muted">${STORE.weather.code}</strong>.</p>
      </div>
      <div class="row" style="justify-content:flex-end; gap:8px">
        <button class="secondary small" id="btn-profile">Profiel</button>
        <button class="secondary small" id="btn-lead">Leaderboard</button>
        <button class="secondary small" id="btn-admin">Admin</button>
        <button class="link small" id="btn-logout">Uitloggen</button>
      </div>
    </div>

    <div class="layout-split">
      <div class="card fade-card">
        <div class="row" style="justify-content:space-between; align-items:center">
          <h2>Live kaart</h2>
          <span class="pill">🚦 Weer-gate: ${STORE.weather.code}</span>
        </div>
        <div id="map"></div>
      </div>
      <div class="card">
        <h2>Snelle acties</h2>
        <div class="row" style="margin-top:6px; align-items:stretch; flex-wrap:wrap">
          <button class="small" id="btn-profile2">👤 Mijn profiel</button>
          <button class="small" id="btn-lead2">🏆 Ranglijst</button>
          <button class="small" id="btn-admin2">🛠️ Admin</button>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="row" style="justify-content:space-between; align-items:center">
            <div>
              <div class="muted">Beschikbare punten</div>
              <div style="font-size:22px; font-weight:700; letter-spacing:-0.01em">${(STORE.currentUser?.points||0).toFixed(2)} pt</div>
            </div>
            <div class="pill">${STORE.boats.length} boten</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">🚤 Boten</div>
    <div id="boats-list"></div>
  `

  page.querySelector('#btn-profile').onclick = () => navigate('profile')
  page.querySelector('#btn-lead').onclick = () => navigate('leader')
  page.querySelector('#btn-admin').onclick = () => navigate('admin')
  page.querySelector('#btn-logout').onclick = () => { STORE.currentUser=null; localStorage.removeItem('drifty_user'); navigate('login') }
  page.querySelector('#btn-profile2').onclick = () => navigate('profile')
  page.querySelector('#btn-lead2').onclick = () => navigate('leader')
  page.querySelector('#btn-admin2').onclick = () => navigate('admin')

  const map = page.querySelector('#map')
  STORE.boats.forEach(b=>{
    const el = document.createElement('div')
    el.className = 'boat ' + (b.status==='available'?'ok':'busy')
    el.style.left = b.x+'px'
    el.style.top  = b.y+'px'
    el.textContent = b.name.split(' ')[1]
    el.title = b.name
    el.onclick = () => { STORE.currentBoatId=b.id; navigate('boat') }
    map.appendChild(el)
  })

  const list = page.querySelector('#boats-list')
  STORE.boats.forEach(b=>{
    const c = document.createElement('div')
    c.className = 'card row'
    c.style.justifyContent = 'space-between'
    c.innerHTML = `
      <div>
        <div style="font-weight:700; letter-spacing:-0.01em">${b.name}</div>
        <div class="muted">Status: ${b.status}</div>
      </div>
      <div class="row">
        <span class="pill">${b.status==='available'?'🟢': '🟡'} Ready</span>
        <button class="small" aria-label="Open ${b.name}">Open</button>
      </div>`
    c.querySelector('button').onclick = () => { STORE.currentBoatId=b.id; navigate('boat') }
    list.appendChild(c)
  })

  renderNav(page)
  return page
}
