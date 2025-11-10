import { STORE, save } from '../../state/store.js'

export function renderAdmin(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1>Admin</h1>
      <button class="small" id="back">Terug</button>
    </div>
    <h2>Weer-gate (alleen admin)</h2>
    <div class="card row">
      <select id="weather"><option value="green">Groen</option><option value="yellow">Geel</option><option value="red">Rood</option></select>
      <button id="save-weather">Opslaan</button>
      <span class="pill" id="weather-state">Huidig: ${STORE.weather.code}</span>
    </div>

    <h2>Overzicht reserveringen</h2>
    <div id="admin-res" class="card"></div>
  `

  page.querySelector('#back').onclick = () => history.back()
  page.querySelector('#save-weather').onclick = () => {
    STORE.weather.code = page.querySelector('#weather').value
    save(); page.querySelector('#weather-state').textContent = 'Huidig: ' + STORE.weather.code
  }

  const list = page.querySelector('#admin-res')
  const all = STORE.reservations.slice().sort((a,b)=>new Date(a.start)-new Date(b.start))
  list.innerHTML = all.map(r=> `
    <div class="row" style="justify-content:space-between">
      <div>${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div>
      <div class="muted">Boot ${r.boatId} • ${r.status} • ${r.users.join(', ')||'—'}</div>
    </div>`).join('') || '<div class="muted">Geen reserveringen</div>'

  return page
}
