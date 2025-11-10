import { STORE, save } from '../../state/store.js'
import { hoursBetween, toISODateHour, timesOverlap } from '../../lib/utils.js'
import { navigate } from '../router.js'

export function renderBoat(){
  const b = STORE.boats.find(x=>x.id===STORE.currentBoatId)
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 id="b-name">${b?.name||'Boot'}</h1>
      <button class="small" id="back">Terug</button>
    </div>
    <p class="muted">Per uur reserveren. Status: <span id="b-status">${b?.status||'—'}</span></p>

    <h2>Reserveer uurslot</h2>
    <div class="card">
      <label>Datum</label><input id="slot-date" type="date"/>
      <label>Startuur</label><select id="slot-hour"></select>
      <label>Duur (uren)</label><select id="slot-dur"></select>

      <div class="row">
        <button id="reserve">Reserveer (onder voorbehoud)</button>
        <button class="small" id="join-exact">Join exact slot</button>
      </div>
    </div>

    <h2>Uursloten</h2>
    <div id="res-list"></div>
  `

  page.querySelector('#back').onclick = () => navigate('home')

  const hourSel = page.querySelector('#slot-hour')
  for(let h=6; h<=22; h++){ const o=document.createElement('option'); o.value=h; o.textContent = String(h).padStart(2,'0')+':00'; hourSel.appendChild(o) }
  const durSel = page.querySelector('#slot-dur')
  for(let d=1; d<=8; d++){ const o=document.createElement('option'); o.value=d; o.textContent = d+' uur'; durSel.appendChild(o) }
  page.querySelector('#slot-date').value = (new Date()).toISOString().slice(0,10)

  page.querySelector('#reserve').onclick = () => reserveSlot(page)
  page.querySelector('#join-exact').onclick = () => joinExact(page)

  renderResList(page)
  return page
}

function calcCost(res){
  const hrs = hoursBetween(res.start,res.end)
  res.total = +(1*hrs).toFixed(3) // accessoires later
}

function reserveSlot(page){
  const date = page.querySelector('#slot-date').value
  const hour = +page.querySelector('#slot-hour').value
  const dur  = +page.querySelector('#slot-dur').value
  if(!date) return alert('Kies een datum')
  const start = toISODateHour(date,hour), end = toISODateHour(date,hour+dur)
  const clash = STORE.reservations.some(r=> r.boatId===STORE.currentBoatId && timesOverlap(start,end,r.start,r.end))
  if(clash) return alert('Overlappende reservering op deze boot')
  let r = STORE.reservations.find(x=>x.boatId===STORE.currentBoatId && x.start===start && x.end===end)
  if(!r){ r = { id:crypto.randomUUID?.()||start, boatId:STORE.currentBoatId, start, end, users:[], status:'pending' }; calcCost(r); STORE.reservations.push(r) }
  const me = STORE.currentUser?.name; if (me && !r.users.includes(me)) r.users.push(me)
  save(); renderResList(page); alert('Onder voorbehoud. Betalen pas bij activeren.')
}

function joinExact(page){
  const date = page.querySelector('#slot-date').value
  const hour = +page.querySelector('#slot-hour').value
  const dur  = +page.querySelector('#slot-dur').value
  const start = toISODateHour(date,hour), end = toISODateHour(date,hour+dur)
  let r = STORE.reservations.find(x=>x.boatId===STORE.currentBoatId && x.start===start && x.end===end)
  if(!r) return alert('Geen exact slot gevonden')
  const me = STORE.currentUser?.name; if (me && !r.users.includes(me)) r.users.push(me)
  save(); renderResList(page); alert('Je doet mee met dit slot')
}

function renderResList(page){
  const box = page.querySelector('#res-list'); box.innerHTML=''
  const list = STORE.reservations.filter(r=>r.boatId===STORE.currentBoatId).sort((a,b)=>new Date(a.start)-new Date(b.start))
  if(!list.length){ box.innerHTML='<div class="muted">Nog geen reserveringen</div>'; return }
  list.forEach(r=>{
    const perPerson = (r.total/Math.max(1,r.users.length))
    const row = document.createElement('div'); row.className='card'
    row.innerHTML = `
      <div><strong>${new Date(r.start).toLocaleString()}</strong> → ${new Date(r.end).toLocaleString()}</div>
      <div class="muted">Deelnemers: ${r.users.join(', ')||'—'}</div>
      <div class="muted">Kosten: ${r.total.toFixed(3)} pt (~${perPerson.toFixed(3)} p.p.)</div>
    `
    box.appendChild(row)
  })
}
