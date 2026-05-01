<template>
  <!-- 右侧面板 -->
  <div class="flex flex-col overflow-hidden"
    style="flex: 1 1 0; min-width: 0; min-height: 0; padding: 10px 14px 10px 6px; gap: 10px; position: relative; z-index: 1;">

    <!-- 商品栏：310px 高，单行10列横向滚动 -->
    <div class="parchment flex-shrink-0 flex flex-col" style="padding: 10px 16px 10px; height: 310px;">
      <div style="font-size: 22px; color: #7a5c2e; font-weight: bold; margin-bottom: 8px; letter-spacing: 1px; flex-shrink: 0;">
        🏪 魔法商店货架
      </div>
      <!-- Grid 10列铺满，纵向滚动 -->
      <div class="shelf-scroll" style="flex: 1 1 0; min-height: 0; overflow-y: auto; overflow-x: hidden; padding-right: 6px;
        display: grid; grid-template-columns: repeat(10, 1fr); grid-auto-rows: 148px; gap: 6px; align-content: start;">
        <div v-for="product in displayProducts" :key="product.id"
          class="shelf-card"
          :class="{ 'shelf-card--locked': product.unlockLevel > currentLevel && !activeItemIds.includes(product.id), 'shelf-card--active': activeItemIds.includes(product.id) }">

          <!-- 主体区：图标 -->
          <div class="shelf-card__body">
            <img v-if="product.image && (product.unlockLevel <= currentLevel || activeItemIds.includes(product.id))"
              :src="product.image" :alt="product.name"
              style="width: 76px; height: 76px; object-fit: contain;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.28));" />
            <span v-else style="font-size: 34px; opacity: 0.4;">🔒</span>
          </div>

          <!-- 副栏：名称 + 价格，木板纹理底色 -->
          <div class="shelf-card__footer">
            <template v-if="product.unlockLevel <= currentLevel || activeItemIds.includes(product.id)">
              <div style="font-size: 13px; color: #4a2c0a; font-weight: bold; line-height: 1.2; letter-spacing: 0.3px; text-align: center;">
                {{ product.name }}
              </div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 3px; margin-top: 3px;">
                <img :src="coinImg" style="width: 15px; height: 15px; object-fit: contain;" />
                <span style="font-size: 15px; color: #b8630a; font-weight: bold; line-height: 1;">{{ product.price }}</span>
              </div>
            </template>
            <template v-else>
              <div style="font-size: 18px; opacity: 0.5; text-align: center;">🔒</div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 题目栏：增高至 384px；有 viz 时左右分栏 -->
    <div class="parchment flex-shrink-0"
      :class="{ 'flash-correct': feedbackType === 'correct', 'flash-wrong': feedbackType === 'wrong' }"
      style="height: 384px; padding: 20px 28px; display: flex; flex-direction: row; gap: 20px;">

      <!-- 左：题目文字区 -->
      <div class="flex flex-col justify-center" :style="question && question.viz ? 'flex: 3 1 0; min-width: 0;' : 'flex: 1 1 0; min-width: 0;'">
        <div style="font-size: 22px; color: #7a5c2e; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; flex-shrink: 0;">
          📜 题目
        </div>
        <p style="font-size: 44px; color: #3d2b1f; line-height: 1.8; font-weight: bold; margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 2px;">
          <template v-for="(seg, i) in questionSegments" :key="i">
            <span v-if="seg.type === 'text'">{{ seg.content }}</span>
            <img v-else :src="seg.src" :alt="seg.alt"
              style="width: 52px; height: 52px; object-fit: contain; vertical-align: middle;
                filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3)); flex-shrink: 0;" />
          </template>
        </p>
      </div>

      <!-- 右：等量关系图解（仅有 viz 时显示） -->
      <div v-if="question && question.viz"
        style="flex: 0 0 auto; border-left: 1.5px solid rgba(201,168,76,0.35); padding-left: 20px; display: flex; align-items: center;">
        <VizPanel :viz="question.viz" :products="products" />
      </div>
    </div>

    <!-- 代换动画（答对且有 viz 时显示，在 CorrectModal 之前） -->
    <SubstituteAnim
      v-if="showSubstAnim"
      :viz="question.viz"
      :products="products"
      :answer="question.answer"
      @done="onSubstDone"
    />

    <!-- 底部区域：答案栏（全宽）+ 下方行（提示栏 + 下一题） -->
    <div class="flex flex-col flex-1" style="min-height: 0; gap: 10px;">

      <!-- 答案栏：全宽 -->
      <div class="parchment flex items-center gap-16 flex-shrink-0"
        style="padding: 0 24px; height: 100px;">
        <div style="font-size: 24px; color: #7a5c2e; font-weight: bold; white-space: nowrap; letter-spacing: 1px;">
          ✏️ 答案：
        </div>
        <input
          ref="answerInput"
          v-model="localAnswer"
          type="number" inputmode="numeric" pattern="[0-9]*"
          placeholder="输入数字..."
          class="answer-input flex-1"
          :class="{ error: feedbackType === 'wrong' }"
          style="height: 64px; font-size: 38px;"
          :disabled="answered"
          @keyup.enter="onConfirm"
        />
        <button class="gold-btn font-bold flex-shrink-0"
          style="height: 64px; padding: 0 36px; font-size: 26px; white-space: nowrap;"
          :disabled="answered"
          @click="onConfirm">
          ✔ 确认
        </button>
      </div>

      <!-- 下方行：提示栏 + 下一题按钮（等高，flex-1撑满剩余） -->
      <div class="flex gap-10 flex-1" style="min-height: 0;">

        <!-- 提示栏 -->
        <div class="parchment flex items-center"
          style="flex: 1; min-height: 0; padding: 0 20px; transition: border-color 0.3s, box-shadow 0.3s;"
          :style="hintPanelStyle">
          <transition name="hint-fade" mode="out-in">
            <div :key="hintKey" class="flex items-center gap-12" style="width: 100%;">
              <img v-if="hintIconImg" :src="hintIconImg"
                style="width: 44px; height: 44px; object-fit: contain; flex-shrink: 0;" />
              <span v-else style="font-size: 28px; flex-shrink: 0;">{{ hintIconFallback }}</span>
              <p style="font-size: 24px; line-height: 1.4; margin: 0; flex: 1;" :style="hintTextStyle">
                {{ displayText }}<span v-if="isTyping" class="typing-cursor">|</span>
              </p>
            </div>
          </transition>
        </div>

        <!-- 下一题按钮：与提示栏等高 -->
        <button class="magic-btn font-bold flex-shrink-0"
          style="width: 220px; align-self: stretch; font-size: 26px; padding: 0 12px;"
          :disabled="!answered"
          @click="onNext">
          下一题 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onUnmounted } from 'vue'
import coinImg from '../assets/items/coin.png'
import VizPanel       from './VizPanel.vue'
import SubstituteAnim from './SubstituteAnim.vue'

const props = defineProps({
  products:      { type: Array,   default: () => [] },
  currentLevel:  { type: Number,  default: 1 },
  question:      { type: Object,  default: null },
  feedbackType:  { type: String,  default: 'none' },
  showHint:      { type: Boolean, default: false },
  hintIndex:     { type: Number,  default: 0 },
  hints:         { type: Array,   default: () => [] },
  correctAnswer: { type: Number,  default: null },
  answered:      { type: Boolean, default: false },
  studentAnswer: { type: String,  default: '' },
  icons:         { type: Object,  default: () => ({}) },
})

const emit = defineEmits(['update:studentAnswer', 'confirm', 'next', 'subst-done'])

const displayProducts = computed(() => props.products)

// 当前题目涉及的商品ID列表，用于高亮
const activeItemIds = computed(() => props.question?.items || [])

const localAnswer = ref('')
const answerInput = ref(null)

watch(localAnswer, val => emit('update:studentAnswer', val))
watch(() => props.studentAnswer, val => { if (!val) localAnswer.value = '' })

// 每次题目切换后自动聚焦输入框
watch(() => props.question?.id, () => {
  nextTick(() => { answerInput.value?.focus() })
}, { immediate: true })

const hintKey = computed(() => props.hintIndex + '_' + props.showHint)

const hintIconImg = computed(() => {
  if (!props.showHint) return props.icons.hintBulb || null
  if (props.hintIndex === 3) return props.icons.hintCheck || null
  if (props.hintIndex >= 1) return props.icons.hintBolt || null
  return props.icons.hintBulb || null
})
const hintIconFallback = computed(() => {
  if (!props.showHint) return '💡'
  if (props.hintIndex === 3) return '✅'
  if (props.hintIndex >= 1) return '⚡'
  return '💡'
})

const hintFullText = computed(() => {
  if (!props.showHint) return '认真读题，仔细计算！加油！'
  if (props.hintIndex === 3) {
    const hint3 = props.hints && props.hints[2]
    return hint3 ? `提示3：${hint3}` : `正确答案是：${props.correctAnswer} 金币`
  }
  if (props.hints && props.hints[props.hintIndex]) {
    return `提示${props.hintIndex + 1}：${props.hints[props.hintIndex]}`
  }
  return ''
})

const typedText = ref('')
const isTyping = ref(false)
let typingTimer = null

function clearTyping() {
  if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }
  isTyping.value = false
}

function startTyping(text) {
  clearTyping()
  typedText.value = ''
  isTyping.value = true
  let i = 0
  const tick = () => {
    if (i < text.length) {
      typedText.value += text[i++]
      typingTimer = setTimeout(tick, 40)
    } else {
      isTyping.value = false
    }
  }
  tick()
}

const isStreamMode = computed(() =>
  props.currentLevel === 1 && props.showHint
)

watch(hintFullText, (val) => {
  if (isStreamMode.value) startTyping(val)
  else { clearTyping(); typedText.value = val }
})

watch(() => props.question?.id, () => { clearTyping(); typedText.value = '' })

const displayText = computed(() =>
  isStreamMode.value ? typedText.value : hintFullText.value
)

onUnmounted(clearTyping)

const hintTextStyle = computed(() => {
  if (!props.showHint)        return { color: '#7a5c2e' }
  return { color: '#e74c3c', fontWeight: 'bold' }
})

const hintPanelStyle = computed(() => {
  if (!props.showHint) return {}
  if (props.hintIndex === 3) return { borderColor: '#e74c3c', boxShadow: '0 0 12px rgba(231,76,60,0.35)' }
  return { borderColor: '#c9a84c', boxShadow: '0 0 12px rgba(201,168,76,0.35)' }
})

const questionSegments = computed(() => {
  if (!props.question) return []
  const text = props.question.question
  const itemIds = props.question.items || []

  const nameToImg = {}
  for (const pid of itemIds) {
    const p = props.products.find(x => x.id === pid)
    if (p && p.image) nameToImg[p.name] = p.image
  }
  nameToImg['金币'] = coinImg

  const keywords = Object.keys(nameToImg).sort((a, b) => b.length - a.length)
  if (keywords.length === 0) return [{ type: 'text', content: text }]

  const segments = []
  let remaining = text

  while (remaining.length > 0) {
    // 每轮找位置最靠前的关键词；位置相同时取最长（已按长度降序排列）
    let bestIdx = -1
    let bestKw  = null
    for (const kw of keywords) {
      const idx = remaining.indexOf(kw)
      if (idx === -1) continue
      if (bestKw === null || idx < bestIdx) {
        bestIdx = idx
        bestKw  = kw
      }
    }

    if (bestKw === null) {
      // 没有关键词了，剩余全部作为文字
      segments.push({ type: 'text', content: remaining })
      break
    }

    if (bestIdx > 0) {
      // 关键词前面的文字
      segments.push({ type: 'text', content: remaining.slice(0, bestIdx) })
    }
    // 关键词文字 + 图标（名称和图标同时显示）
    segments.push({ type: 'text', content: bestKw })
    segments.push({ type: 'icon', src: nameToImg[bestKw], alt: bestKw })
    remaining = remaining.slice(bestIdx + bestKw.length)
  }

  return segments
})

function onConfirm() { if (!props.answered) emit('confirm') }
function onNext()    { emit('next') }

// 代换动画控制
const showSubstAnim = ref(false)

// feedbackType 变为 'correct' 且题目有 viz 时触发动画
watch(() => props.feedbackType, val => {
  if (val === 'correct' && props.question?.viz) {
    showSubstAnim.value = true
  }
})

// 题目切换时重置
watch(() => props.question?.id, () => {
  showSubstAnim.value = false
})

function onSubstDone() {
  showSubstAnim.value = false
  emit('subst-done')
}
</script>

<style scoped>
.hint-fade-enter-active, .hint-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.hint-fade-enter-from { opacity: 0; transform: translateY(6px); }
.hint-fade-leave-to   { opacity: 0; transform: translateY(-6px); }

/* 货架卡片：竖版布局（图标上，信息下），宽度由 Grid 决定 */
.shelf-card {
  display: flex;
  flex-direction: column;
  border: 2px solid #c9a84c;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

/* 主体区：图标，羊皮纸背景，撑满上方 */
.shelf-card__body {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #fff8ec 0%, #ede0b0 100%);
}

/* 副栏：木板纹理底色，名称+价格，固定高度 */
.shelf-card__footer {
  flex-shrink: 0;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-top: 1px solid rgba(180,120,50,0.4);
  /* Q版浅色木板纹理 */
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.04) 0px,
      rgba(0,0,0,0.04) 1px,
      transparent 1px,
      transparent 5px
    ),
    linear-gradient(135deg, #ddb878 0%, #c9a060 40%, #b8874a 100%);
}

/* 题目涉及商品：金色外发光高亮 */
.shelf-card--active {
  border-color: #f4d03f;
  box-shadow: 0 0 16px rgba(244,208,63,0.8), 0 0 32px rgba(244,208,63,0.4);
}

/* 锁定商品：整体灰暗半透明 */
.shelf-card--locked {
  border-color: #444;
  opacity: 0.45;
  filter: grayscale(60%);
}

/* 滚动条样式：金色调竖向滚动条 */
.shelf-scroll::-webkit-scrollbar {
  width: 6px;
}
.shelf-scroll::-webkit-scrollbar-track {
  background: rgba(201,168,76,0.1);
  border-radius: 3px;
}
.shelf-scroll::-webkit-scrollbar-thumb {
  background: rgba(201,168,76,0.6);
  border-radius: 3px;
}
.shelf-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(201,168,76,0.9);
}
</style>
