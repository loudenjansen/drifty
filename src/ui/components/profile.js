import { STORE, save } from '../../state/store.js'

export function renderProfile(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between"><h1>Profiel</h1><button class="small" id="back">Terug</button></div>
    <p><strong>Naam:</strong> <span id="p-name"></span></p>
    <p><strong>Punten:</strong> <span id="p-pts"></span></p>

    <h2>Koop punten</h2>
    <div class="row card">
      <button class="small" data-add="1">+1 punt</button>
      <button class="small" data-add="5">+5 punten</button>
      <button class="small" data-add="10">+10 punten</button>
    </div>

    <h2>Mijn reserveringen</h2>
    <div id="my-res"></div>

    <div class="card">
      <button class="small link" id="reset">Reset simulatie</button>
    </div>
  `
  page.querySelector('#back').onclick = () => history.back()
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
      const el = document.createElement('div'); el.className='card'
      el.innerHTML = `<div><strong>${b?.name||'Boot'}</strong> — ${r.status}</div><div class="muted">${new Date(r.start).toLocaleString()} → ${new Date(r.end).toLocaleString()}</div><div class="muted">Deelnemers: ${r.users.join(', ')}</div>`
      mineBox.appendChild(el)
    })
  }

  update()
  return page
}
