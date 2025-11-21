import { STORE, save } from '../../state/store.js'
import { navigate } from '../router.js'

function renderNav(container){
  const nav = document.createElement('div')
  nav.className = 'bottom-nav'
  nav.innerHTML = `
    <button data-nav="home">🏠 Home</button>
    <button data-nav="share">🤝 Delen</button>
    <button data-nav="social">📸 Social</button>
    <button data-nav="shop">🛒 Shop</button>
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

    <div class="layout-split">
      <div class="card fade-card">
        <h2>Punten beheren</h2>
        <p class="muted">Geef of haal punten bij gebruikers.</p>
        <div class="row" style="align-items:flex-end">
          <div style="flex:1; min-width:180px">
            <label>Gebruiker</label>
            <select id="points-user"></select>
          </div>
          <div style="flex:1; min-width:140px">
            <label>Bedrag</label>
            <input id="points-amount" type="number" step="0.5" value="5" />
          </div>
          <div class="row" style="gap:8px">
            <button class="small" id="btn-add">+ Geef punten</button>
            <button class="secondary small" id="btn-remove">- Haal punten weg</button>
          </div>
        </div>
        <div class="msg">Acties worden direct opgeslagen.</div>
      </div>

      <div class="card strong">
        <h2>Shop beheer</h2>
        <p class="muted">Voeg shop-items toe: puntenbundels, tours, merch.</p>
        <div class="row" style="align-items:flex-end; gap:10px">
          <div style="flex:1; min-width:160px">
            <label>Naam</label>
            <input id="shop-name" placeholder="Item naam" />
          </div>
          <div style="flex:1; min-width:140px">
            <label>Type</label>
            <select id="shop-kind">
              <option value="points">Punten</option>
              <option value="tour">Tour</option>
              <option value="merch">Merch</option>
              <option value="add-on">Add-on</option>
            </select>
          </div>
        </div>
        <div class="row" style="align-items:flex-end; gap:10px">
          <div style="flex:1; min-width:140px">
            <label>Prijs (pt)</label>
            <input id="shop-price" type="number" step="1" value="10" />
          </div>
          <div style="flex:1; min-width:140px">
            <label>Beloning (pt)</label>
            <input id="shop-reward" type="number" step="1" value="0" />
          </div>
          <div style="flex:2; min-width:200px">
            <label>Beschrijving</label>
            <input id="shop-desc" placeholder="Korte omschrijving" />
          </div>
          <button class="small" id="shop-add">Item toevoegen</button>
        </div>
        <div id="shop-admin-list" class="list-stack" style="margin-top:10px"></div>
      </div>
    </div>

    <div class="card fade-card">
      <h2>Klusjes</h2>
      <p class="muted">Zet taken uit waarmee gebruikers punten verdienen.</p>
      <div class="row" style="align-items:flex-end; gap:10px">
        <div style="flex:1; min-width:200px">
          <label>Titel</label>
          <input id="chore-title" placeholder="Bijv. Haven opruimen" />
        </div>
        <div style="flex:1; min-width:200px">
          <label>Omschrijving</label>
          <input id="chore-details" placeholder="Wat moet er gebeuren?" />
        </div>
        <div style="flex:0.5; min-width:120px">
          <label>Beloning</label>
          <input id="chore-reward" type="number" step="1" value="5" />
        </div>
        <button class="small" id="chore-add">Klusje toevoegen</button>
      </div>
      <div id="chore-admin-list" class="list-stack" style="margin-top:10px"></div>
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

  function renderUserSelect(){
    const sel = page.querySelector('#points-user')
    sel.innerHTML = STORE.users.map(u=> `<option value="${u.id}">${u.name}</option>`).join('') || '<option>Geen gebruikers</option>'
  }

  function updateUserPoints(delta){
    const id = page.querySelector('#points-user').value
    const amt = +page.querySelector('#points-amount').value
    if(!id || isNaN(amt)) return alert('Selecteer gebruiker en bedrag')
    const user = STORE.users.find(u=>u.id==id)
    if(!user) return
    user.points = +((user.points||0) + delta*amt).toFixed(2)
    if (STORE.currentUser?.id === user.id){ STORE.currentUser.points = user.points }
    save(); alert('Punten bijgewerkt')
  }

  page.querySelector('#btn-add').onclick = () => updateUserPoints(1)
  page.querySelector('#btn-remove').onclick = () => updateUserPoints(-1)
  renderUserSelect()

  function renderShopList(){
    const box = page.querySelector('#shop-admin-list'); box.innerHTML=''
    if(!STORE.shopItems.length){ box.innerHTML = '<div class="muted">Nog geen items</div>'; return }
    STORE.shopItems.forEach(item=>{
      const row = document.createElement('div')
      row.className = 'list-row'
      row.innerHTML = `
        <div>
          <div style="font-weight:600">${item.name}</div>
          <div class="muted">${item.kind} • ${item.description||''}</div>
        </div>
        <div class="pill">${item.price} pt${item.reward?` / +${item.reward}`:''}</div>
      `
      box.appendChild(row)
    })
  }

  page.querySelector('#shop-add').onclick = () => {
    const name = page.querySelector('#shop-name').value.trim()
    const kind = page.querySelector('#shop-kind').value
    const price = +page.querySelector('#shop-price').value
    const reward = +page.querySelector('#shop-reward').value
    const desc = page.querySelector('#shop-desc').value.trim()
    if(!name || isNaN(price)) return alert('Vul naam en prijs in')
    STORE.shopItems.push({ id:crypto.randomUUID?.()||name+Date.now(), name, kind, price, reward: isNaN(reward)?0:reward, description: desc })
    save(); renderShopList(); page.querySelector('#shop-name').value=''; page.querySelector('#shop-desc').value=''
  }
  renderShopList()

  function renderChores(){
    const box = page.querySelector('#chore-admin-list'); box.innerHTML=''
    if(!STORE.chores.length){ box.innerHTML = '<div class="muted">Nog geen klusjes</div>'; return }
    STORE.chores.forEach(chore=>{
      const row = document.createElement('div')
      row.className = 'list-row'
      row.innerHTML = `
        <div>
          <div style="font-weight:600">${chore.title}</div>
          <div class="muted">${chore.details||''}</div>
        </div>
        <div class="pill">${chore.reward} pt • ${chore.status}</div>
      `
      box.appendChild(row)
    })
  }

  page.querySelector('#chore-add').onclick = () => {
    const title = page.querySelector('#chore-title').value.trim()
    const details = page.querySelector('#chore-details').value.trim()
    const reward = +page.querySelector('#chore-reward').value
    if(!title || isNaN(reward)) return alert('Titel en beloning zijn verplicht')
    STORE.chores.push({ id:crypto.randomUUID?.()||title+Date.now(), title, details, reward, status:'open', claimedBy:null })
    save(); renderChores(); page.querySelector('#chore-title').value=''; page.querySelector('#chore-details').value=''
  }
  renderChores()

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
