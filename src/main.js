import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import './style.css'

// transform:scale缩放：以1920×1080为设计基准，整体缩放适配任何屏幕
function applyZoom() {
  const scaleX = window.innerWidth  / 1920
  const scaleY = window.innerHeight / 1080
  const scale  = Math.min(scaleX, scaleY)
  const offsetX = (window.innerWidth  - 1920 * scale) / 2
  const offsetY = (window.innerHeight - 1080 * scale) / 2
  document.body.style.transform       = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
  document.body.style.transformOrigin = '0 0'
  document.body.style.width           = '1920px'
  document.body.style.height          = '1080px'
  document.body.style.overflow        = 'hidden'
  document.documentElement.style.background = '#000'
  document.documentElement.style.overflow   = 'hidden'
}

applyZoom()
window.addEventListener('resize', applyZoom)

createApp(App).mount('#app')
