import { STORE } from '../../state/store.js'
import { navigate } from '../router.js'

export function renderHome(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1>DRIFTY — Kaart & Boten</h1>
      <div class="row">
        <button class="small" id="btn-profile">Profiel</button>
        <button class="small" id="btn-lead">Leaderboard</button>
        <button class="small" id="btn-admin">Admin</button>
        <button class="small" id="btn-logout">Uitloggen</button>
      </div>
    </div>
    <div id="map" class="card"></div>
    <h2>Boten</h2>
    <div id="boats-list"></div>
  `

  page.querySelector('#btn-profile').onclick = () => navigate('profile')
  page.querySelector('#btn-lead').onclick = () => navigate('leader')
  page.querySelector('#btn-admin').onclick = () => navigate('admin')
  page.querySelector('#btn-logout').onclick = () => { STORE.currentUser=null; localStorage.removeItem('drifty_user'); navigate('login') }

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
    c.innerHTML = `<div><strong>${b.name}</strong> <span class="muted">(${b.status})</span></div><button class="small">Open</button>`
    c.querySelector('button').onclick = () => { STORE.currentBoatId=b.id; navigate('boat') }
    list.appendChild(c)
  })

  return page
}
