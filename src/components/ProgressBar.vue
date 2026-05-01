<template>
  <div class="magic-banner w-full flex items-center justify-center px-16"
    style="height: 130px; flex-shrink: 0; position: relative; z-index: 10; gap: 0;">

    <img :src="boltImg" style="width: 48px; height: 48px; object-fit: contain; margin-right: 20px; filter: drop-shadow(0 0 6px #f4d03f);" />

    <template v-for="(lv, index) in levels" :key="lv.num">
      <!-- 节点 -->
      <div class="flex flex-col items-center" style="position: relative;">
        <div class="flex items-center justify-center rounded-full font-bold transition-all duration-500 relative"
          :style="nodeStyle(lv.num)">
          <div v-if="lv.num === currentLevel" class="glow-ring" />
          <img v-if="lv.num < currentLevel && icons.complete"
            :src="icons.complete" style="width: 56px; height: 56px; object-fit: contain;" />
          <img v-else-if="lv.num === currentLevel && icons.current"
            :src="icons.current" style="width: 56px; height: 56px; object-fit: contain;" />
          <img v-else-if="lv.num > currentLevel && icons.locked"
            :src="icons.locked" style="width: 48px; height: 48px; object-fit: contain;" />
          <span v-else style="font-size: 28px;">{{ nodeFallback(lv.num) }}</span>
        </div>
        <span class="font-bold mt-1" :style="labelStyle(lv.num)">
          第{{ chineseNums[lv.num - 1] }}关
        </span>
      </div>

      <!-- 连接线 -->
      <div v-if="index < levels.length - 1"
        class="progress-line flex-1 mx-2"
        :style="lineStyle(lv.num)" />
    </template>

    <img :src="boltImg" style="width: 48px; height: 48px; object-fit: contain; margin-left: 20px; filter: drop-shadow(0 0 6px #f4d03f);" />
  </div>
</template>

<script setup>
import boltImg from '../assets/ui/hint_bolt.png'

const props = defineProps({
  currentLevel: { type: Number, default: 1 },
  icons: {
    type: Object,
    default: () => ({ complete: null, current: null, locked: null }),
  },
})

const levels      = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }]
const chineseNums = ['一', '二', '三', '四', '五']

function nodeFallback(num) {
  if (num < props.currentLevel)  return '✓'
  if (num === props.currentLevel) return num
  return '🔒'
}

function nodeStyle(num) {
  const base = { width: '88px', height: '88px', position: 'relative' }
  if (num < props.currentLevel)
    return { ...base, background: 'linear-gradient(135deg,#2ecc71,#27ae60)', boxShadow: '0 0 12px #2ecc71' }
  if (num === props.currentLevel)
    return { ...base, background: 'linear-gradient(135deg,#c9a84c,#f4d03f)', color: '#3d2b1f', boxShadow: '0 0 20px #f4d03f, 0 0 40px rgba(244,208,63,0.4)' }
  return { ...base, background: 'linear-gradient(135deg,#2a1a4a,#1a0f2e)', border: '2px solid #444' }
}

function labelStyle(num) {
  if (num < props.currentLevel)   return { color: '#2ecc71', fontSize: '22px' }
  if (num === props.currentLevel) return { color: '#f4d03f', fontSize: '22px', textShadow: '0 0 8px #f4d03f' }
  return { color: '#666', fontSize: '22px' }
}

function lineStyle(num) {
  if (num < props.currentLevel)
    return { background: 'linear-gradient(90deg,#2ecc71,#27ae60)', boxShadow: '0 0 6px #2ecc71' }
  return { background: '#2a1a4a' }
}
</script>

<style scoped>
.glow-ring {
  position: absolute; inset: -5px;
  border-radius: 50%;
  border: 2px solid #f4d03f;
  animation: pulseRing 1.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes pulseRing {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.18); }
}
</style>
