<template>
  <canvas
    ref="canvasRef"
    style="position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none; z-index: 160;"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const canvasRef = ref(null)
let ctx = null
let animId = null
let rockets = []
let particles = []

const W = 1920
const H = 1080

const COLORS = [
  '#f4d03f', '#e74c3c', '#2ecc71', '#3498db',
  '#9b59b6', '#e67e22', '#1abc9c', '#ff69b4',
  '#fff176', '#ff8a65',
]

class Rocket {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX
    this.y = startY
    this.targetX = targetX
    this.targetY = targetY
    const dx = targetX - startX
    const dy = targetY - startY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const speed = dist / 28
    this.vx = (dx / dist) * speed
    this.vy = (dy / dist) * speed
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.trail = []
    this.exploded = false
  }

  update() {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 8) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.12

    const dx = this.x - this.targetX
    const dy = this.y - this.targetY
    if (Math.sqrt(dx * dx + dy * dy) < 8 || this.vy > 0.5) {
      this.explode()
      return true
    }
    return false
  }

  explode() {
    const count = 44 + Math.floor(Math.random() * 16)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3
      const speed = 3.5 + Math.random() * 4.5
      particles.push(new Particle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this.color,
      ))
    }
    const color2 = COLORS[Math.floor(Math.random() * COLORS.length)]
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3
      particles.push(new Particle(this.x, this.y,
        Math.cos(angle) * speed, Math.sin(angle) * speed, color2))
    }
  }

  draw() {
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.6
      ctx.beginPath()
      ctx.arc(this.trail[i].x, this.trail[i].y, (1 - i / this.trail.length) * 3, 0, Math.PI * 2)
      ctx.globalAlpha = alpha
      ctx.fillStyle = this.color
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }
}

class Particle {
  constructor(x, y, vx, vy, color) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.color = color
    this.alpha = 1
    this.radius = 3 + Math.random() * 2
    this.trail = []
  }

  update() {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 5) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.09
    this.vx *= 0.97
    this.vy *= 0.98
    this.alpha -= 0.016
    this.radius *= 0.992
    return this.alpha <= 0
  }

  draw() {
    for (let i = 0; i < this.trail.length; i++) {
      const a = (i / this.trail.length) * this.alpha * 0.4
      ctx.beginPath()
      ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * 0.5, 0, Math.PI * 2)
      ctx.globalAlpha = a
      ctx.fillStyle = this.color
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function launchFireworks() {
  // Modal is roughly centered, ~720px wide
  const modalW = 720
  const modalLeft  = (W - modalW) / 2
  const modalRight = (W + modalW) / 2
  const modalBottomY = H * 0.75

  const lx = modalLeft + 20
  const rx = modalRight - 20

  setTimeout(() => {
    rockets.push(new Rocket(lx, modalBottomY, lx - 200, H * 0.28))
  }, 0)
  setTimeout(() => {
    rockets.push(new Rocket(rx, modalBottomY, rx + 200, H * 0.28))
  }, 300)
  setTimeout(() => {
    rockets.push(new Rocket(lx - 60, modalBottomY - 60, lx - 320, H * 0.22))
    rockets.push(new Rocket(rx + 60, modalBottomY - 60, rx + 320, H * 0.22))
  }, 600)
  setTimeout(() => {
    rockets.push(new Rocket(W * 0.5, modalBottomY + 20, W * 0.3, H * 0.18))
    rockets.push(new Rocket(W * 0.5, modalBottomY + 20, W * 0.7, H * 0.18))
  }, 900)
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)

  rockets = rockets.filter(r => {
    r.draw()
    return !r.update()
  })

  particles = particles.filter(p => {
    p.draw()
    return !p.update()
  })

  if (rockets.length > 0 || particles.length > 0) {
    animId = requestAnimationFrame(loop)
  } else {
    animId = null
  }
}

watch(() => props.active, (val) => {
  if (val) {
    rockets = []
    particles = []
    launchFireworks()
    if (!animId) {
      animId = requestAnimationFrame(loop)
    }
  } else {
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
    rockets = []
    particles = []
    if (ctx && canvasRef.value) {
      ctx.clearRect(0, 0, W, H)
    }
  }
})

onMounted(() => {
  const c = canvasRef.value
  c.width = W
  c.height = H
  ctx = c.getContext('2d')
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>
