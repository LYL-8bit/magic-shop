<template>
  <div class="fixed inset-0 flex items-center justify-center animate__animated animate__fadeIn"
    style="background: rgba(10,5,30,0.9); z-index: 100;">

    <div v-for="c in confetti" :key="c.id" class="confetti-piece"
      :style="{ left: c.x+'%', width: c.w+'px', height: c.h+'px',
        backgroundColor: c.color, animationDuration: c.dur+'s',
        animationDelay: c.delay+'s', borderRadius: c.round ? '50%' : '2px' }" />

    <div class="animate__animated animate__zoomIn overflow-y-auto text-center"
      style="width: 820px; max-height: 960px;
        background: linear-gradient(145deg, #f5e6c8 0%, #ede0b0 100%);
        border: 3px solid #c9a84c; border-radius: 22px;
        box-shadow: 0 0 90px rgba(201,168,76,0.5); overflow: hidden; padding: 0;">

      <div class="magic-banner" style="padding: 22px 32px;">
        <div style="font-size: 38px; font-weight: bold; letter-spacing: 3px;">
          🏆 魔法冒险 · 结算报告 🏆
        </div>
      </div>

      <div style="padding: 28px 48px 36px;">
        <!-- 星级 -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 8px;">
            <img v-for="i in 5" :key="i"
              :src="i <= starCount ? icons.starFilled : icons.starEmpty"
              :style="{ width: '56px', height: '56px', objectFit: 'contain',
                filter: i <= starCount ? 'drop-shadow(0 0 8px #f4d03f)' : 'none' }" />
          </div>
          <div style="font-size: 42px; color: #4a2c8c; font-weight: bold;
            text-shadow: 0 2px 10px rgba(74,44,140,0.3);">
            {{ rating && rating.title }}
          </div>
        </div>

        <div style="height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin-bottom: 24px;" />

        <!-- 4格数据 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
          <div class="stat-card-hp">
            <div class="stat-label">答对题目</div>
            <div class="stat-value" style="color: #2ecc71;">{{ correctCount }} / {{ totalAnswered }}</div>
          </div>
          <div class="stat-card-hp">
            <div class="stat-label">获得金币</div>
            <div class="stat-value" style="color: #c9a84c;">{{ totalCoins }} 🪙</div>
          </div>
          <div class="stat-card-hp">
            <div class="stat-label">答对率</div>
            <div class="stat-value" style="color: #4a2c8c;">{{ accuracy }}%</div>
          </div>
          <div class="stat-card-hp">
            <div class="stat-label">游戏用时</div>
            <div class="stat-value" style="color: #3d2b1f;">{{ duration }}</div>
          </div>
        </div>

        <div style="height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin-bottom: 24px;" />

        <!-- 评语 -->
        <div style="background: rgba(74,44,140,0.1); border: 1px solid rgba(201,168,76,0.4);
          border-radius: 14px; padding: 20px 28px; margin-bottom: 28px;">
          <p style="font-size: 28px; color: #3d2b1f; line-height: 1.6; margin: 0 0 10px;">
            {{ rating && rating.summary }}
          </p>
          <p style="font-size: 24px; color: #c9a84c; font-weight: bold; margin: 0;">
            {{ rating && rating.praise }}
          </p>
        </div>

        <button class="magic-btn font-bold w-full"
          style="height: 72px; font-size: 30px; letter-spacing: 2px;"
          @click="$emit('restart')">
          🏠 再来一次
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalCoins: Number, correctCount: Number, totalAnswered: Number,
  accuracy: Number, duration: String, rating: Object,
  icons: { type: Object, default: () => ({}) },
})
defineEmits(['restart'])

const starCount = computed(() => 5)

const colors = ['#f4d03f','#e74c3c','#2ecc71','#3498db','#9b59b6','#e67e22']
const confetti = Array.from({ length: 50 }, (_, i) => ({
  id: i, x: Math.random() * 100,
  w: Math.random() * 10 + 6, h: Math.random() * 10 + 6,
  color: colors[Math.floor(Math.random() * colors.length)],
  dur: Math.random() * 2 + 2.5, delay: Math.random() * 2,
  round: Math.random() > 0.5,
}))
</script>

<style scoped>
.stat-card-hp {
  background: rgba(201,168,76,0.12);
  border: 1px solid rgba(201,168,76,0.35);
  border-radius: 12px; padding: 16px; text-align: center;
}
.stat-label { font-size: 20px; color: #7a5c2e; font-weight: bold; margin-bottom: 6px; }
.stat-value { font-size: 42px; font-weight: bold; }
</style>
