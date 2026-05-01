<template>
  <div class="fixed inset-0 flex items-center justify-center"
    style="background: rgba(10,5,30,0.85); z-index: 100;">

    <!-- 彩色纸屑 -->
    <div v-for="c in confetti" :key="c.id" class="confetti-piece"
      :style="{ left: c.x+'%', width: c.w+'px', height: c.h+'px',
        backgroundColor: c.color, animationDuration: c.dur+'s',
        animationDelay: c.delay+'s', borderRadius: c.round ? '50%' : '2px' }" />

    <div class="animate__animated animate__zoomIn overflow-y-auto text-center"
      style="width: 760px; max-height: 960px;
        background: linear-gradient(145deg, #f5e6c8 0%, #ede0b0 100%);
        border: 3px solid #c9a84c; border-radius: 22px;
        box-shadow: 0 0 70px rgba(201,168,76,0.5); overflow: hidden; padding: 0;">

      <!-- 顶部横幅 -->
      <div class="magic-banner" style="padding: 22px 32px;">
        <div style="font-size: 42px; letter-spacing: 3px; font-weight: bold;">
          🎉 第{{ info && info.level }}关通关！🎉
        </div>
      </div>

      <div style="padding: 28px 40px 36px;">
        <!-- 关卡徽章 -->
        <div style="margin: 8px 0 20px; display: flex; justify-content: center;">
          <img v-if="levelBadge" :src="levelBadge"
            style="width: 160px; height: 160px; object-fit: contain;
              filter: drop-shadow(0 0 20px rgba(201,168,76,0.9)) drop-shadow(0 0 40px rgba(201,168,76,0.5));
              animation: badgePulse 2s ease-in-out infinite;" />
          <span v-else style="font-size: 96px; line-height: 1; display: block; text-align: center;
            animation: badgePulse 2s ease-in-out infinite;">{{ levelEmojiFallback }}</span>
        </div>

        <!-- 庆祝台词 -->
        <div style="background: rgba(74,44,140,0.1); border: 1px solid rgba(201,168,76,0.4);
          border-radius: 14px; padding: 16px 24px; margin-bottom: 24px;
          font-size: 28px; color: #3d2b1f; line-height: 1.6;">
          {{ info && info.dialogue }}
        </div>

        <div style="height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin-bottom: 24px;" />

        <!-- 结算数据 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          <div style="background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4);
            border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-size: 20px; color: #7a5c2e; font-weight: bold;">本关金币</div>
            <div style="font-size: 42px; color: #c9a84c; font-weight: bold; margin-top: 4px;">
              +{{ info && info.coinsEarned }}
            </div>
          </div>
          <div style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.4);
            border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-size: 20px; color: #7a5c2e; font-weight: bold;">答题正确</div>
            <div style="font-size: 42px; color: #2ecc71; font-weight: bold; margin-top: 4px;">
              {{ info && info.correctCount }}/{{ info && info.totalQuestions }}
            </div>
          </div>
          <div style="background: rgba(74,44,140,0.15); border: 1px solid rgba(74,44,140,0.4);
            border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-size: 20px; color: #7a5c2e; font-weight: bold;">
              {{ info && info.nextCustomer ? '下位顾客' : '全部通关' }}
            </div>
            <div style="font-size: 28px; color: #4a2c8c; font-weight: bold; margin-top: 4px;">
              {{ info && info.nextCustomer ? info.nextCustomer.name : '🏆 传说！' }}
            </div>
          </div>
        </div>

        <!-- 评级 -->
        <div style="text-align: center; margin-bottom: 20px; font-size: 26px; font-weight: bold; color: #7a5c2e;">
          {{ levelRating }}
        </div>

        <button class="magic-btn font-bold w-full"
          style="height: 72px; font-size: 30px; letter-spacing: 2px;"
          @click="$emit('continue')">
          {{ info && info.level >= 5 ? '🏆 查看成绩' : '继续冒险 →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { playSound } from '../utils/audio.js'

const props = defineProps({
  info:  Object,
  icons: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['continue'])

function onKeydown(e) {
  if (e.key === 'Enter') emit('continue')
}

onMounted(() => {
  playSound('levelup')
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

const levelRating = computed(() => {
  if (!props.info) return ''
  const { correctCount, totalQuestions } = props.info
  if (correctCount === totalQuestions) return '⭐⭐⭐ 完美通关！全部答对！'
  if (correctCount >= totalQuestions * 0.8) return '⭐⭐ 优秀！继续加油！'
  return '⭐ 加油！多多练习！'
})

const levelEmojiFallbacks = ['🌱', '🌟', '🔮', '🐉', '🏆']
const levelEmojiFallback  = computed(() => props.info ? levelEmojiFallbacks[props.info.level - 1] : '🌟')
const levelBadge = computed(() => {
  if (!props.info || !props.icons) return null
  const key = 'badge' + props.info.level
  return props.icons[key] || null
})

const colors = ['#f4d03f','#e74c3c','#2ecc71','#3498db','#9b59b6','#e67e22','#1abc9c','#ff69b4']
const confetti = Array.from({ length: 60 }, (_, i) => ({
  id: i, x: Math.random() * 100,
  w: Math.random() * 10 + 6, h: Math.random() * 10 + 6,
  color: colors[Math.floor(Math.random() * colors.length)],
  dur: Math.random() * 2 + 2, delay: Math.random() * 2,
  round: Math.random() > 0.5,
}))
</script>

<style scoped>
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}
</style>
