import { STORE, save } from '../../state/store.js'
import { navigate } from '../router.js'

function renderNav(container){
  const nav = document.createElement('div')
  nav.className = 'bottom-nav'
  const isAdmin = !!STORE.currentUser?.isAdmin
  nav.innerHTML = `
    <button data-nav="home">🏠 Home</button>
    <button data-nav="shop">🛒 Shop</button>
    <button class="active" data-nav="profile">👤 Profiel</button>
    <button data-nav="leader">🏆 Leaderboard</button>
    ${isAdmin ? '<button data-nav="admin">🛠️ Admin</button>' : ''}
  `
  nav.querySelectorAll('button').forEach(btn=> btn.onclick = () => navigate(btn.dataset.nav))
  container.appendChild(nav)
}

export function renderProfile(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="hero fade-card">
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div>
          <div class="pill">Mijn account</div>
          <h1>Profiel</h1>
          <p class="muted">Beheer je punten, crew en persoonlijke reserveringen in DRIFTY-stijl.</p>
        </div>
        <button class="ghost small" id="back">← Terug</button>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <div class="label">Naam</div>
          <div class="value" id="p-name"></div>
          <div class="muted">Je publieke naam in de app.</div>
        </div>
        <div class="stat">
          <div class="label">Punten</div>
          <div class="value" id="p-pts"></div>
          <div class="muted">Gebruik ze voor reserveringen.</div>
        </div>
        <div class="stat">
          <div class="label">Vloot</div>
          <div class="value">${STORE.boats.length}</div>
          <div class="muted">Boten in jouw hub.</div>
        </div>
      </div>
    </div>

    <div class="layout-split">
      <div class="card fade-card">
        <div class="pill">Punten opladen</div>
        <h2>Koop punten</h2>
        <p class="muted">Vergroot je balans en claim sneller slots.</p>
        <div class="row card" style="margin-top:8px">
          <button class="small" data-add="1">+1 punt</button>
          <button class="small" data-add="5">+5 punten</button>
          <button class="small" data-add="10">+10 punten</button>
        </div>
      </div>
      <div class="card strong">
        <h2>Simulatie</h2>
        <p class="muted">Wis lokale data en begin opnieuw.</p>
        <button class="link small" id="reset">Reset simulatie</button>
      </div>
    </div>

    <h2>Mijn reserveringen</h2>
    <div id="my-res" class="list-stack"></div>
  `
  page.querySelector('#back').onclick = () => navigate('home')
  page.querySelectorAll('[data-add]').forEach(btn=> btn.onclick = () => { const n=+btn.dataset.add; STORE.currentUser.points=(STORE.currentUser.points||0)+n; save(); update() })
  page.querySelector('#reset').onclick = () => { if(confirm('Weet je zeker dat je wilt resetten?')){ localStorage.clear(); location.reload() } }

  function update(){
    page.querySelector('#p-name').textContent = STORE.currentUser?.name || '-'
    page.querySelector('#p-pts').textContent = (STORE.currentUser?.points ?? 0).toFixed(2)
    const mineBox = page.querySelector('#my-res'); mineBox.innerHTML=''
    const mine = (STORE.reservations||[]).filter(r=>r.users.includes(STORE.currentUser?.name)).sort((a,b)=>new Date(a.start)-new Date(b.start))
    if(!mine.length) mineBox.innerHTML = '<div class="muted">Geen reserveringen</div>'
    mine.forEach(r=>{
      const b = STORE.boats.find(x=>x.id===r.boatId)
      const el = document.createElement('div'); el.className='card strong'
      el.innerHTML = `<div class="row" style="justify-content:space-between; align-items:flex-start"><div><strong>${b?.name||'Boot'}</strong> — ${r.status}</div><span class="pill">${r.users.length} deelnemers</span></div><div class="muted">${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div>`
      mineBox.appendChild(el)
    })
  }

  update()
  renderNav(page)
  return page
}
