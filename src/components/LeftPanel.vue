<template>
  <!-- 左侧面板：宽384px -->
  <div class="flex flex-col overflow-hidden"
    style="width: 384px; flex-shrink: 0; min-height: 0; padding: 10px 10px 10px 12px; gap: 10px; position: relative; z-index: 1;">

    <!-- 上：状态卡片 -->
    <div class="parchment flex flex-col flex-shrink-0"
      style="padding: 10px 14px 12px; height: 310px; gap: 0; overflow: hidden;">

      <!-- 魔法等级 -->
      <div style="font-size: 16px; color: #7a5c2e; font-weight: bold; letter-spacing: 2px; text-align: center; flex-shrink: 0;">
        ✦ 魔法等级 ✦
      </div>
      <div style="display: flex; justify-content: center; gap: 2px; margin-top: 4px; flex-shrink: 0;">
        <img v-for="i in 5" :key="i"
          :src="i <= level ? icons.starFilled : icons.starEmpty"
          :style="{ width: '40px', height: '40px', objectFit: 'contain', filter: i <= level ? 'drop-shadow(0 0 5px #f4d03f)' : 'none' }"
        />
      </div>
      <div style="font-size: 18px; color: #3d2b1f; font-weight: bold; text-align: center; margin-top: 3px; flex-shrink: 0;">
        {{ levelName }}
      </div>

      <!-- 分割线 -->
      <div style="width: 85%; height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 6px auto; flex-shrink: 0;" />

      <!-- 答题进度 -->
      <div style="flex-shrink: 0;">
        <div style="font-size: 16px; color: #7a5c2e; font-weight: bold; letter-spacing: 2px; text-align: center; margin-bottom: 6px;">
          ✦ 答题进度 ✦
        </div>
        <!-- 进度节点 -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 4px; padding: 0 4px;">
          <template v-for="n in totalQuestions" :key="n">
            <div :style="{
              width: '28px', height: '28px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 'bold', flexShrink: '0',
              border: n <= questionIndex ? '2px solid #2ecc71' : n === questionIndex + 1 ? '2px solid #f4d03f' : '2px solid #555',
              background: n <= questionIndex
                ? 'linear-gradient(135deg,#2ecc71,#27ae60)'
                : n === questionIndex + 1
                  ? 'linear-gradient(135deg,#c9a84c,#f4d03f)'
                  : 'rgba(30,15,50,0.6)',
              color: n <= questionIndex ? '#fff' : n === questionIndex + 1 ? '#3d2b1f' : '#888',
              boxShadow: n === questionIndex + 1 ? '0 0 8px #f4d03f' : 'none',
            }">{{ n <= questionIndex ? '✓' : n }}</div>
            <div v-if="n < totalQuestions" :style="{
              flex: '1', height: '3px', borderRadius: '2px',
              background: n <= questionIndex
                ? 'linear-gradient(90deg,#2ecc71,#27ae60)'
                : '#2a1a4a',
              boxShadow: n < questionIndex ? '0 0 4px #2ecc71' : 'none',
            }" />
          </template>
        </div>
        <div style="font-size: 14px; color: #7a5c2e; text-align: center; margin-top: 5px; font-weight: bold;">
          第 {{ questionIndex + 1 }} / {{ totalQuestions }} 题
        </div>
      </div>

      <!-- 分割线 -->
      <div style="width: 85%; height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 6px auto; flex-shrink: 0;" />

      <!-- 金币余额 -->
      <div style="flex-shrink: 0;">
        <div style="font-size: 16px; color: #7a5c2e; font-weight: bold; letter-spacing: 2px; text-align: center; margin-bottom: 4px;">
          ✦ 金币余额 ✦
        </div>
        <div class="flex items-center justify-center gap-4">
          <img :src="coinImg" alt="金币"
            style="width: 38px; height: 38px; object-fit: contain; flex-shrink: 0;" />
          <span class="font-bold" :class="{ 'coin-bounce': coinsBounce }"
            style="font-size: 44px; color: #c9a84c; text-shadow: 0 0 10px rgba(201,168,76,0.7); line-height: 1;">
            {{ coins }}
          </span>
        </div>
      </div>
    </div>

    <!-- 下2/3：顾客展示区 -->
    <div class="parchment flex flex-col items-center"
      style="flex: 1 1 0; min-height: 0; padding: 10px 8px 14px; position: relative; overflow: hidden;">

      <div style="font-size: 20px; color: #7a5c2e; font-weight: bold; letter-spacing: 2px; margin-bottom: 6px; flex-shrink: 0;">
        ✦ 当前顾客 ✦
      </div>

      <!-- 对话气泡：固定在顾客区顶部，不遮挡人物 -->
      <transition name="bubble-fade">
        <div v-if="dialogue" class="dialogue-bubble" style="flex-shrink: 0; width: 100%; margin-bottom: 6px;">
          <p style="font-size: 17px; color: #3d2b1f; line-height: 1.5; margin: 0; word-break: break-all;">
            {{ dialogue }}
          </p>
        </div>
      </transition>

      <!-- 顾客容器：气泡下方居中展示 -->
      <div class="flex flex-col items-center justify-center"
        style="flex: 1 1 0; min-height: 0; width: 100%;">

        <div :key="customerKey" :class="charAnimClass"
          style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; min-height: 0;">

          <img v-if="customer && customer.image"
            :src="customer.image"
            :class="idleClass"
            style="width: 100%; height: 100%; max-width: 360px; object-fit: contain;
              filter: drop-shadow(0 8px 20px rgba(0,0,0,0.55));" />
          <div v-else :class="idleClass" style="font-size: 120px; line-height: 1; text-align: center;">
            {{ customer && customer.emoji }}
          </div>

          <!-- 名字标签 -->
          <div v-if="customer" class="font-bold text-center"
            style="font-size: 22px; color: #fff; padding: 5px 16px; border-radius: 20px; margin-top: 8px; flex-shrink: 0;"
            :style="{ backgroundColor: customer.themeColor || '#4a2c8c' }">
            {{ customer.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import coinImg from '../assets/items/coin.png'

const props = defineProps({
  level:        { type: Number,  default: 1 },
  coins:        { type: Number,  default: 0 },
  customer:     { type: Object,  default: null },
  dialogue:     { type: String,  default: '' },
  feedbackType: { type: String,  default: 'none' },
  questionId:     { type: String,  default: '' },
  coinsBounce:    { type: Boolean, default: false },
  icons:          { type: Object,  default: () => ({}) },
  questionIndex:  { type: Number,  default: 0 },
  totalQuestions: { type: Number,  default: 5 },
})

const levelNames = ['见习学徒', '初级魔法师', '中级魔法师', '高级魔法师', '传说魔法师']
const levelName  = computed(() => levelNames[props.level - 1] || '')

const customerKey   = ref(0)
const charAnimClass = ref('char-enter')
const idleClass     = ref('char-float')

watch(() => props.questionId, () => {
  customerKey.value++
  charAnimClass.value = 'char-enter'
  idleClass.value = ''
  setTimeout(() => {
    charAnimClass.value = ''
    idleClass.value = 'char-float'
  }, 520)
})

watch(() => props.feedbackType, (val) => {
  if (val === 'correct') {
    idleClass.value = 'char-jump'
    setTimeout(() => { idleClass.value = 'char-float' }, 800)
  } else if (val === 'wrong') {
    idleClass.value = 'char-shake'
    setTimeout(() => { idleClass.value = 'char-float' }, 600)
  }
})
</script>

<style scoped>
.bubble-fade-enter-active, .bubble-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.bubble-fade-enter-from { opacity: 0; transform: translateY(6px); }
.bubble-fade-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
