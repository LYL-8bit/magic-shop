// Audio manager — singleton, preloads all sounds
import correctSrc   from '../assets/audio/correct.mp3'
import wrongSrc     from '../assets/audio/wrong.mp3'
import coinSrc      from '../assets/audio/coin.mp3'
import coinThrowSrc from '../assets/audio/coin_throw.mp3'
import levelupSrc   from '../assets/audio/levelup.mp3'
import clickSrc     from '../assets/audio/click.mp3'
import bgmSrc       from '../assets/audio/bgm.mp3'

let bgm = null
let muted = false

const sounds = {}

function load(key, src, volume = 1.0) {
  const a = new Audio(src)
  a.volume = volume
  sounds[key] = a
}

export function initAudio() {
  load('correct',    correctSrc,   0.9)
  load('wrong',      wrongSrc,     0.8)
  load('coin',       coinSrc,      0.7)
  load('coinThrow',  coinThrowSrc, 0.7)
  load('levelup',    levelupSrc,   0.9)
  load('click',      clickSrc,     0.6)

  bgm = new Audio(bgmSrc)
  bgm.loop = true
  bgm.volume = 0.25
}

export function playSound(key) {
  if (muted) return
  const s = sounds[key]
  if (!s) return
  const clone = s.cloneNode()
  clone.volume = s.volume
  clone.play().catch(() => {})
}

export function playBgm() {
  if (muted || !bgm) return
  bgm.currentTime = 0
  bgm.play().catch(() => {})
}

export function stopBgm() {
  if (!bgm) return
  bgm.pause()
  bgm.currentTime = 0
}

export function setMuted(val) {
  muted = val
  if (bgm) {
    if (val) bgm.pause()
    else bgm.play().catch(() => {})
  }
}

export function isMuted() { return muted }

// 8-bit 像素风金币音效（Web Audio API 合成，无需音频文件）
export function playPixelCoin() {
  if (muted) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // 主音：短促正弦波上扫（马里奥金币风格）
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08)
    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    osc.start(now)
    osc.stop(now + 0.18)

    // 谐波层：增加像素感
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(1040, now)
    osc2.frequency.exponentialRampToValueAtTime(2080, now + 0.08)
    gain2.gain.setValueAtTime(0.12, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
    osc2.start(now)
    osc2.stop(now + 0.14)

    osc.onended = () => ctx.close()
  } catch (e) {}
}
