import { STORE, save } from '../../state/store.js'
import { navigate } from '../router.js'

export function renderLogin(){
  const wrap = document.createElement('div')
  wrap.className = 'screen active'
  wrap.innerHTML = `
    <h1>DRIFTY — Login</h1>
    <input id="login-name" placeholder="Voer je naam in (admin: drifty)"/>
    <button id="login-btn">Login</button>
  `
  wrap.querySelector('#login-btn').onclick = () => {
    const name = wrap.querySelector('#login-name').value.trim()
    if(!name) return alert('Voer een naam in')
    let u = STORE.users.find(x=>x.name===name)
    if(!u){ u = { id:crypto.randomUUID?.() || name, name, points:5, purchases:[], badges:[] }; STORE.users.push(u) }
    STORE.currentUser = u; save(); navigate('home')
  }
  return wrap
}
