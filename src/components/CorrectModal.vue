<template>
  <div class="fixed inset-0 flex items-center justify-center animate__animated animate__fadeIn"
    style="background: rgba(10,5,30,0.6); z-index: 120;">

    <!-- 金币抛洒层：在弹窗后面 z-index:118 -->
    <div style="position: fixed; inset: 0; pointer-events: none; z-index: 118; overflow: hidden;">
      <div v-for="c in coinPhysics" :key="c.id"
        class="coin-x"
        :style="{
          left: c.originX + 'px',
          top:  c.originY + 'px',
          '--dx':    c.dx    + 'px',
          '--dy1':   c.dy1   + 'px',
          '--dy2':   c.dy2   + 'px',
          '--b1':    c.b1    + 'px',
          '--b2':    c.b2    + 'px',
          '--rot':   c.rot   + 'deg',
          '--dur':   c.dur   + 's',
          '--delay': c.delay + 's',
          '--size':  c.size  + 'px',
        }">
        <div class="coin-y">
          <img :src="coinImg"
            class="coin-img"
            :style="{ width: c.size + 'px', height: c.size + 'px' }" />
        </div>
      </div>
    </div>

    <!-- 弹窗本体 z-index:121 -->
    <div class="animate__animated animate__zoomIn text-center overflow-hidden"
      style="
        width: 720px;
        background: linear-gradient(145deg, #f5e6c8 0%, #ede0b0 100%);
        border: 3px solid #c9a84c;
        border-radius: 22px;
        box-shadow: 0 0 70px rgba(201,168,76,0.6), 0 0 130px rgba(74,44,140,0.3);
        position: relative; z-index: 121;
      ">

      <!-- 顶部横幅 -->
      <div class="magic-banner" style="padding: 20px 32px;">
        <div style="font-size: 42px; font-weight: bold; letter-spacing: 3px;">
          ✨ 回答正确！✨
        </div>
      </div>

      <div style="padding: 28px 48px 36px;">
        <!-- 金币奖励 -->
        <div class="flex items-center justify-center gap-20" style="margin-bottom: 24px;">
          <img :src="coinImg" style="width: 80px; height: 80px; object-fit: contain; animation: coinSpin 0.8s ease-out;" />
          <div style="font-size: 88px; font-weight: bold; color: #c9a84c;
            text-shadow: 0 0 20px rgba(201,168,76,0.8); line-height: 1;"
            class="animate__animated animate__bounceIn">
            +{{ coinsEarned }}
          </div>
          <img :src="coinImg" style="width: 80px; height: 80px; object-fit: contain; animation: coinSpin 0.8s ease-out 0.2s both;" />
        </div>

        <!-- 鼓励台词 -->
        <div style="background: rgba(74,44,140,0.1); border: 1px solid rgba(201,168,76,0.4);
          border-radius: 14px; padding: 18px 24px; margin-bottom: 28px;
          font-size: 28px; color: #3d2b1f; line-height: 1.6;">
          {{ dialogue }}
        </div>

        <!-- 分割线 -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin-bottom: 28px;" />

        <!-- 下一题按钮 -->
        <button class="magic-btn font-bold w-full"
          style="height: 72px; font-size: 30px; letter-spacing: 2px;"
          @click="$emit('next')">
          {{ isLastInLevel ? '🏆 查看通关结果' : '下一位顾客 →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import coinImg from '../assets/items/coin.png'
import { playSound } from '../utils/audio.js'

const props = defineProps({
  coinsEarned:   { type: Number,  default: 10 },
  dialogue:      { type: String,  default: '太棒了！你真是个数学小天才！' },
  isLastInLevel: { type: Boolean, default: false },
})
const emit = defineEmits(['next'])

// 弹窗顶部中心作为金币抛出原点（1920×1080画布）
// 弹窗宽720px，居中于1920→左边界(1920-720)/2=600，右边界1320
// 弹窗顶部横幅高约84px，原点取弹窗顶部中心
const SCREEN_W  = 1920
const SCREEN_H  = 1080
const ORIGIN_X  = SCREEN_W / 2              // 水平中心 960
const ORIGIN_Y  = (SCREEN_H - 540) / 2 + 42 // 弹窗垂直居中后顶部+42px ≈ 312

const coinPhysics = computed(() => {
  const count = Math.min(props.coinsEarned, 25)
  return Array.from({ length: count }, (_, i) => {
    // 散开角度：从弹窗顶部向四周，-80°~+80°（相对向下方向），均匀分布+随机抖动
    const baseAngle = -80 + (160 / Math.max(count - 1, 1)) * i
    const angle = (baseAngle + (Math.random() - 0.5) * 18) * (Math.PI / 180)
    // 初速度
    const speed = 420 + Math.random() * 340

    // 落点X = 原点X + 水平分量
    const dx = Math.sin(angle) * speed * (1.1 + Math.random() * 0.4)

    // 落地Y = 屏幕底部 - 原点Y（相对偏移）
    const landAbsY = SCREEN_H - 18 - Math.random() * 30
    const dy2 = landAbsY - ORIGIN_Y  // 相对原点的总Y位移（向下为正）

    // 飞行最高点：向上偏移（负值）
    const peakH = 180 + Math.random() * 180
    const dy1 = -peakH

    // 弹跳高度
    const b1 = 60 + Math.random() * 50
    const b2 = b1 * 0.4

    return {
      id:     i,
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      dx,
      dy1,     // 最高点Y偏移（负=向上）
      dy2,     // 落地Y偏移
      b1:  -b1, // 第1次弹跳（向上=负）
      b2:  -b2, // 第2次弹跳
      rot:    (Math.random() > 0.5 ? 1 : -1) * (270 + Math.random() * 270),
      dur:    1.6 + Math.random() * 0.6,
      delay:  i * 0.028 + Math.random() * 0.06,
      size:   48 + Math.random() * 24,
    }
  })
})

function onKeydown(e) {
  if (e.key === 'Enter') emit('next')
}

onMounted(() => {
  playSound('coinThrow')                     // 抛出音效：立即播放
  setTimeout(() => playSound('coin'), 450)   // 落地音效：延迟450ms
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
@keyframes coinSpin {
  0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
  60%  { transform: scale(1.25) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/*
  双层嵌套实现真实抛物线：
  .coin-x  外层：控制水平位移（X轴匀速漂移）
  .coin-y  内层：控制垂直位移（先上抛后重力落地）+ 弹跳
  .coin-img 最内层：旋转 + 落地后2秒淡出
*/

.coin-x {
  position: absolute;
  animation: coinMoveX var(--dur) var(--delay) cubic-bezier(0.3, 0, 0.7, 1) forwards;
}

.coin-y {
  animation: coinMoveY var(--dur) var(--delay) ease-in forwards;
}

.coin-img {
  display: block;
  object-fit: contain;
  animation:
    coinRotate var(--dur) var(--delay) linear forwards,
    coinFadeOut 3.5s calc(var(--delay) + var(--dur)) ease-out forwards;
}

/* X方向：匀速平移到落点 */
@keyframes coinMoveX {
  0%   { transform: translateX(0); }
  100% { transform: translateX(var(--dx)); }
}

/* Y方向：抛物线 + 2次弹跳 */
@keyframes coinMoveY {
  0%   { transform: translateY(0); }         /* 起点 */
  22%  { transform: translateY(var(--dy1)); } /* 最高点 */
  50%  { transform: translateY(var(--dy2)); } /* 落地 */
  63%  { transform: translateY(calc(var(--dy2) + var(--b1))); } /* 第1次弹起 */
  74%  { transform: translateY(var(--dy2)); } /* 落回 */
  84%  { transform: translateY(calc(var(--dy2) + var(--b2))); } /* 第2次弹起 */
  92%  { transform: translateY(var(--dy2)); } /* 落回 */
  100% { transform: translateY(var(--dy2)); } /* 静止 */
}

/* 旋转 */
@keyframes coinRotate {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(var(--rot)); }
}

/* 落地静止后3.5秒缓慢淡出 */
@keyframes coinFadeOut {
  0%   { opacity: 1; }
  60%  { opacity: 0.95; }
  100% { opacity: 0; }
}
</style>
