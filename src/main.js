import './styles/style.css'
import { initStore, loadFromStorage, loadBoatsFromSupabase } from './state/store.js'
import { initRouter, navigate } from './ui/router.js'
import { renderApp } from './ui/render.js'

async function start(){
  initStore()
  loadFromStorage()
  try {
    await loadBoatsFromSupabase()
  } catch(err){
    console.error('[supabase] startup boats error', err)
  }
  initRouter(() => renderApp())
  navigate('login')
}

start()
