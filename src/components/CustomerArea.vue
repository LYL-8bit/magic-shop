<template>
  <div
    class="flex flex-col flex-1 p-6 overflow-hidden"
    style="background: linear-gradient(135deg, #16213E 0%, #0F3460 100%);"
  >
    <!-- 顾客区 -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- 顾客头像 + 对话气泡 -->
      <div
        class="flex items-end gap-4 mb-4"
        :class="customerAnimClass"
        :key="customerKey"
      >
        <!-- 顾客头像 -->
        <div class="flex flex-col items-center flex-shrink-0">
          <div
            class="rounded-full flex items-center justify-center"
            style="width: clamp(64px, 8vw, 120px); height: clamp(64px, 8vw, 120px); background: rgba(255,255,255,0.08);"
          >
            <span style="font-size: clamp(40px, 5.5vw, 88px); line-height: 1;">{{ customer?.emoji }}</span>
          </div>
          <!-- 顾客名字标签 -->
          <div
            class="mt-1 px-3 py-1 rounded-full text-center font-bold"
            style="font-size: 1.5vw; color: #fff;"
            :style="{ backgroundColor: customer?.themeColor || '#6C63FF' }"
          >
            {{ customer?.name }}
          </div>
        </div>

        <!-- 对话气泡 -->
        <div
          class="flex-1 rounded-bubble px-5 py-4 relative dialogue-bubble"
          style="background-color: #6C63FF; min-height: 6vh;"
          :class="{ 'flash-correct': feedbackType === 'correct' }"
        >
          <p class="font-bold" style="font-size: 2.6vw; color: #FFFFFF; line-height: 1.4;">
            {{ dialogue }}
          </p>
        </div>
      </div>

      <!-- 题目展示区 -->
      <div
        class="rounded-card p-4 mb-4 flex-shrink-0"
        style="background: rgba(15, 52, 96, 0.7); border: 1px solid rgba(108,99,255,0.4);"
      >
        <div class="font-bold mb-1" style="font-size: 1.5vw; color: #AAAAAA;">题目：</div>
        <p style="font-size: 2.3vw; color: #FFFFFF; line-height: 1.5;">
          {{ question?.question }}
        </p>
      </div>

      <!-- 答题区 -->
      <div class="flex items-center gap-4 flex-shrink-0">
        <!-- 输入框 -->
        <input
          v-model="localAnswer"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="请输入答案..."
          class="answer-input flex-1 rounded-button font-bold"
          :class="{ 'error': feedbackType === 'wrong', 'animate__animated animate__shakeX': feedbackType === 'wrong' }"
          style="
            height: 7vh;
            min-height: 48px;
            background-color: #0F3460;
            border: 2px solid #6C63FF;
            color: #FFFFFF;
            font-size: 2.2vw;
            padding: 0 20px;
          "
          @keyup.enter="onConfirm"
        />

        <!-- 确认按钮 -->
        <button
          class="font-bold rounded-button flex-shrink-0"
          style="
            height: 7vh;
            min-height: 48px;
            width: 12vw;
            min-width: 120px;
            background-color: #6C63FF;
            color: #FFFFFF;
            font-size: 2vw;
            border: none;
            cursor: pointer;
            transition: background-color 0.15s, transform 0.1s;
          "
          @click="onConfirm"
          @mouseenter="e => e.target.style.backgroundColor = '#5652d9'"
          @mouseleave="e => e.target.style.backgroundColor = '#6C63FF'"
        >
          确认答案
        </button>
      </div>

      <!-- 答题进度 -->
      <div class="mt-3 text-center" style="font-size: 1.5vw; color: #AAAAAA;">
        第 {{ currentIndex + 1 }} / 5 位顾客
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  customer: Object,
  question: Object,
  dialogue: String,
  feedbackType: String,
  studentAnswer: String,
  gameStatus: String,
})

const emit = defineEmits(['update:studentAnswer', 'confirm'])

const localAnswer = ref('')
const customerKey = ref(0)
const customerAnimClass = ref('animate__animated animate__slideInRight')

// 同步 localAnswer 到父组件
watch(localAnswer, (val) => {
  emit('update:studentAnswer', val)
})

// 当顾客切换时触发入场动画
watch(() => props.question?.id, () => {
  customerKey.value++
  customerAnimClass.value = ''
  setTimeout(() => {
    customerAnimClass.value = 'animate__animated animate__slideInRight'
  }, 50)
  localAnswer.value = ''
})

const currentIndex = computed(() => {
  const id = props.question?.id || 'L1-01'
  const parts = id.split('-')
  return parseInt(parts[1] || '1') - 1
})

function onConfirm() {
  if (props.gameStatus !== 'playing') return
  emit('confirm')
}
</script>
