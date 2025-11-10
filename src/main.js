import './styles/style.css'
import { initStore, loadFromStorage } from './state/store.js'
import { initRouter, navigate } from './ui/router.js'
import { renderApp } from './ui/render.js'

initStore()
loadFromStorage()

initRouter(() => renderApp())
navigate('login')
