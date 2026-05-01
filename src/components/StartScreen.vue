<template>
  <div style="width: 1920px; height: 1080px; overflow: hidden; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: linear-gradient(160deg, #0d0d1a 0%, #1a0533 60%, #0d1b4b 100%);
    position: relative;">

    <!-- 背景星星粒子 -->
    <div style="position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;">
      <span v-for="s in stars" :key="s.id" class="star-particle"
        :style="{
          left: s.x + '%', top: s.y + '%',
          width: s.size + 'px', height: s.size + 'px',
          background: s.color,
          animationDuration: s.dur + 's',
          animationDelay: s.delay + 's',
        }" />
    </div>

    <!-- 静音按钮 -->
    <button @click="$emit('toggle-mute')"
      style="position: absolute; top: 14px; right: 20px; z-index: 200;
        background: rgba(201,168,76,0.2); border: 1px solid #c9a84c;
        border-radius: 50%; width: 40px; height: 40px;
        font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;">
      {{ muted ? '🔇' : '🔊' }}
    </button>

    <!-- 主卡片 -->
    <div class="animate__animated animate__zoomIn" style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">

      <!-- 卡片外标题 -->
      <div style="margin-bottom: 28px; width: 900px; text-align: center;">
        <div style="font-size: 56px; font-weight: bold; letter-spacing: 4px; white-space: nowrap;
          background: linear-gradient(90deg, #c9a84c 0%, #f4d03f 50%, #c9a84c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-shadow: none; filter: drop-shadow(0 0 18px rgba(244,208,63,0.6));
          animation: titleGlow 2.5s ease-in-out infinite;">
          🏪 魔法数字商店 🏪
        </div>
      </div>

      <!-- 羊皮纸卡片 -->
      <div style="width: 900px; background: linear-gradient(145deg, #f5e6c8 0%, #ede0b0 100%);
        border: 3px solid #c9a84c; border-radius: 22px;
        box-shadow: 0 0 60px rgba(201,168,76,0.45), 0 8px 32px rgba(0,0,0,0.5);
        overflow: hidden;">

        <!-- 顶部横幅 -->
        <div class="magic-banner" style="padding: 20px 32px; text-align: center;">
          <div style="font-size: 30px; font-weight: bold; letter-spacing: 2px;">
            ✨ 五大关卡 · 十一位魔法顾客等你挑战 ✨
          </div>
        </div>

        <div style="padding: 28px 48px 36px;">

          <!-- 每关第1位顾客预览 -->
          <div style="display: flex; justify-content: center; gap: 28px; margin-bottom: 24px;">
            <div v-for="(c, idx) in levelFirstCustomers" :key="c.id"
              style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <div style="width: 100px; height: 100px; border-radius: 50%;
                background: rgba(74,44,140,0.15); border: 2px solid rgba(201,168,76,0.5);
                display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <img :src="c.image" :alt="c.name"
                  style="width: 86px; height: 86px; object-fit: contain;" />
              </div>
              <span style="font-size: 16px; color: #7a5c2e; font-weight: bold;">第{{ idx + 1 }}关</span>
            </div>
          </div>

          <!-- 分割线 -->
          <div style="height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin-bottom: 22px;" />

          <!-- 游戏说明 -->
          <div style="background: rgba(74,44,140,0.1); border: 1px solid rgba(201,168,76,0.35);
            border-radius: 14px; padding: 16px 24px; margin-bottom: 28px; text-align: center;">
            <p style="font-size: 28px; color: #3d2b1f; line-height: 1.7; margin: 0;">
              🪙 通过等量代换，算出物品的金币价值，闯过 5 关赢取金币！
            </p>
          </div>

          <!-- 开始按钮 -->
          <button class="gold-btn start-btn" @click="$emit('start')">
            ✨ 开始闯关 ✨
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { customers } from '../data/customers.js'

defineProps({
  muted: { type: Boolean, default: false },
})
defineEmits(['start', 'toggle-mute'])

// 每关代表性NPC预览（各关选最具特色的角色）
const previewIds = ['little_witch', 'phoenix', 'magic_apprentice', 'dragon_baby', 'grand_mage']
const levelFirstCustomers = previewIds.map(id => customers.find(c => c.id === id)).filter(Boolean)

const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x:    Math.random() * 100,
  y:    Math.random() * 100,
  size: Math.random() * 4 + 1,
  color: ['#c9a84c','#f4d03f','#ffffff','#a78bfa','#60a5fa'][Math.floor(Math.random() * 5)],
  dur:   Math.random() * 3 + 2,
  delay: Math.random() * 4,
}))
</script>

<style scoped>
@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(244,208,63,0.4)); }
  50%       { filter: drop-shadow(0 0 28px rgba(244,208,63,0.9)); }
}

.start-btn {
  width: 100%;
  height: 88px;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 4px;
  border-radius: 14px;
  animation: btnPulse 2s ease-in-out infinite;
}

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(201,168,76,0.4); }
  50%       { box-shadow: 0 0 32px rgba(244,208,63,0.8), 0 0 60px rgba(244,208,63,0.3); }
}

.start-btn:hover {
  animation: none;
  box-shadow: 0 0 40px rgba(244,208,63,0.9);
  transform: translateY(-2px) scale(1.02);
}
</style>
