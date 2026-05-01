<template>
  <div
    class="w-full flex items-center px-8 gap-4"
    style="height: 12vh; min-height: 56px; background-color: #0F3460; flex-shrink: 0; border-top: 2px solid rgba(108,99,255,0.2);"
  >
    <!-- 图标 -->
    <span style="font-size: 2.2vw; flex-shrink: 0;">{{ icon }}</span>

    <!-- 提示文字 -->
    <transition name="hint-fade" mode="out-in">
      <p
        :key="hintKey"
        class="font-medium"
        :style="textStyle"
        style="font-size: 1.8vw; line-height: 1.4;"
      >
        {{ hintText }}
      </p>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  hintIndex: Number,  // 0,1,2 = 提示，3 = 显示答案
  hints: Array,
  correctAnswer: Number,
})

const hintKey = computed(() => props.hintIndex + '_' + props.show)

const icon = computed(() => {
  if (!props.show) return '💡'
  if (props.hintIndex === 3) return '✅'
  if (props.hintIndex >= 1) return '⚡'
  return '💡'
})

const hintText = computed(() => {
  if (!props.show) return '认真看题目，仔细计算！'
  if (props.hintIndex === 3) {
    const hint3 = props.hints && props.hints[2]
    return hint3 ? `提示3：${hint3}` : `正确答案是：${props.correctAnswer} 金币`
  }
  if (props.hints && props.hints[props.hintIndex]) {
    return `提示${props.hintIndex + 1}：${props.hints[props.hintIndex]}`
  }
  return ''
})

const textStyle = computed(() => {
  if (!props.show) return { color: '#AAAAAA' }
  if (props.hintIndex === 3) return { color: '#FF4444', fontWeight: 'bold' }
  return { color: '#FFD700' }
})
</script>

<style scoped>
.hint-fade-enter-active, .hint-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.hint-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
