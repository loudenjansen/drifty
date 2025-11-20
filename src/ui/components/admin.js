import { STORE, save } from '../../state/store.js'
import { navigate } from '../router.js'

function renderNav(container){
  const nav = document.createElement('div')
  nav.className = 'bottom-nav'
  nav.innerHTML = `
    <button data-nav="home">🏠 Home</button>
    <button data-nav="profile">👤 Profiel</button>
    <button data-nav="leader">🏆 Leaderboard</button>
    <button class="active" data-nav="admin">🛠️ Admin</button>
  `
  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
  container.appendChild(nav)
}

export function renderAdmin(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="hero fade-card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="pill">Beheer</div>
          <h1>Admin</h1>
          <p class="muted">Pas snel de weer-gate aan en bekijk alle reserveringen.</p>
        </div>
        <button class="ghost small" id="back">← Terug</button>
      </div>
    </div>

    <div class="card strong">
      <h2>Weer-gate (alleen admin)</h2>
      <div class="row" style="align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap">
        <div class="row" style="flex:1; gap:10px">
          <select id="weather"><option value="green">Groen</option><option value="yellow">Geel</option><option value="red">Rood</option></select>
          <span class="pill" id="weather-state">Huidig: ${STORE.weather.code}</span>
        </div>
        <button id="save-weather">Opslaan</button>
      </div>
      <div class="msg" style="margin-top:8px">Gebruik de gate om de vloot veilig te houden bij slecht weer.</div>
    </div>

    <div class="card fade-card">
      <h2>Overzicht reserveringen</h2>
      <div id="admin-res" class="list-stack"></div>
    </div>
  `

  page.querySelector('#back').onclick = () => navigate('home')
  page.querySelector('#save-weather').onclick = () => {
    STORE.weather.code = page.querySelector('#weather').value
    save(); page.querySelector('#weather-state').textContent = 'Huidig: ' + STORE.weather.code
  }

  const list = page.querySelector('#admin-res')
  const all = STORE.reservations.slice().sort((a,b)=>new Date(a.start)-new Date(b.start))
  list.innerHTML = all.map(r=> `
    <div class="list-row">
      <div>
        <div style="font-weight:600">${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div>
        <div class="muted">Boot ${r.boatId} • ${r.users.join(', ')||'—'}</div>
      </div>
      <div class="pill">${r.status}</div>
    </div>`).join('') || '<div class="muted">Geen reserveringen</div>'

  renderNav(page)
  return page
}
