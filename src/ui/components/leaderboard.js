import { STORE } from '../../state/store.js'

export function renderLeaderboard(){
  const page = document.createElement('div')
  page.className = 'screen active'
  page.innerHTML = `
    <div class="row" style="justify-content:space-between"><h1>Leaderboard</h1><button class="small" id="back">Terug</button></div>
    <div id="lead-list" class="card"></div>
  `
  page.querySelector('#back').onclick = () => history.back()
  const box = page.querySelector('#lead-list')
  const sorted = [...STORE.users].sort((a,b)=>(b.points||0)-(a.points||0))
  box.innerHTML = sorted.map((u,i)=> `<div class="row" style="justify-content:space-between"><div>${i+1}. ${u.name}</div><div class="muted">${(u.points||0).toFixed(2)} pt</div></div>`).join('') || '<div class="muted">Nog geen spelers</div>'
  return page
}
