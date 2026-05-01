<template>
  <!-- 开始页面 -->
  <StartScreen
    v-if="gamePhase === 'start'"
    :muted="audioMuted"
    @start="onStartGame"
    @toggle-mute="toggleMute"
  />

  <!-- 固定1920×1080画布，zoom缩放由main.js控制 -->
  <div v-else style="width: 1920px; height: 1080px; overflow: hidden; display: flex; flex-direction: column;
    background: linear-gradient(160deg, #0d0d1a 0%, #1a0533 60%, #0d1b4b 100%); position: relative;">

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

    <!-- 顶部关卡栏 -->
    <ProgressBar :currentLevel="state.currentLevel" :icons="progressIcons" />

    <!-- 主体：左384px + 右auto -->
    <div style="display: flex; flex: 1 1 0; min-height: 0; position: relative; z-index: 1;">
      <LeftPanel
        :level="state.currentLevel"
        :coins="state.totalCoins"
        :customer="currentCustomer"
        :dialogue="state.currentDialogue"
        :feedbackType="state.feedbackType"
        :questionId="currentQuestion && currentQuestion.id"
        :coinsBounce="state.coinsBounce"
        :icons="icons"
        :questionIndex="state.currentQuestionIndex"
        :totalQuestions="questions['level' + state.currentLevel]?.length || 5"
      />
      <RightPanel
        :products="allProducts"
        :currentLevel="state.currentLevel"
        :question="currentQuestion"
        :feedbackType="state.feedbackType"
        :showHint="state.showHint"
        :hintIndex="state.currentHintIndex"
        :hints="currentQuestion && currentQuestion.hints"
        :correctAnswer="currentQuestion && currentQuestion.answer"
        :answered="state.answered"
        :studentAnswer="state.studentAnswer"
        :icons="icons"
        @update:studentAnswer="state.studentAnswer = $event"
        @confirm="handleConfirm"
        @next="handleNext"
        @subst-done="handleSubstDone"
      />
    </div>

    <!-- 答对弹窗 -->
    <CorrectModal
      v-if="state.showCorrectModal"
      :coinsEarned="state.lastCoinsEarned"
      :dialogue="state.currentDialogue"
      :isLastInLevel="isLastQuestionInLevel"
      @next="handleNext"
    />

    <!-- 烟花：顶层独立渲染，不受弹窗z-index影响 -->
    <FireworksCanvas :active="state.showCorrectModal" />

    <!-- 静音按钮 -->
    <button @click="toggleMute"
      style="position: absolute; top: 14px; right: 20px; z-index: 200;
        background: rgba(201,168,76,0.2); border: 1px solid #c9a84c;
        border-radius: 50%; width: 40px; height: 40px;
        font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;">
      {{ audioMuted ? '🔇' : '🔊' }}
    </button>

    <!-- 过关弹窗 -->
    <LevelUpModal
      v-if="state.gameStatus === 'levelup'"
      :info="state.levelUpInfo"
      :icons="icons"
      @continue="onContinue"
    />

    <!-- 结算弹窗 -->
    <FinalReport
      v-if="state.gameStatus === 'finished'"
      :totalCoins="state.totalCoins"
      :correctCount="state.correctCount"
      :totalAnswered="state.totalAnswered"
      :accuracy="accuracy"
      :duration="gameDuration"
      :rating="finalRating"
      :icons="icons"
      @restart="onGoHome"
    />

    <!-- Toast提示 -->
    <div v-if="state.toastMsg" class="toast">{{ state.toastMsg }}</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { initAudio, playSound, playBgm, setMuted } from './utils/audio.js'
import { createGameStore } from './stores/gameStore.js'
import { checkAnswer }     from './utils/gameLogic.js'
import { products }        from './data/products.js'
import { questions }       from './data/questions.js'
import { icons }           from './data/icons.js'

import ProgressBar    from './components/ProgressBar.vue'
import LeftPanel      from './components/LeftPanel.vue'
import RightPanel     from './components/RightPanel.vue'
import CorrectModal   from './components/CorrectModal.vue'
import FireworksCanvas from './components/FireworksCanvas.vue'
import LevelUpModal   from './components/LevelUpModal.vue'
import FinalReport    from './components/FinalReport.vue'
import StartScreen    from './components/StartScreen.vue'

const gamePhase = ref('start') // 'start' | 'game'

const store = createGameStore()
const {
  state, currentQuestion, currentCustomer,
  accuracy, finalRating, gameDuration,
  handleCorrect, handleWrong, nextQuestion,
  continueGame, restartGame, showCorrectModalNow,
} = store

const allProducts = products

const audioMuted = ref(false)

function toggleMute() {
  audioMuted.value = !audioMuted.value
  setMuted(audioMuted.value)
}

function onStartGame() {
  restartGame()
  gamePhase.value = 'game'
  playBgm()
}

function onGoHome() {
  gamePhase.value = 'start'
}

onMounted(() => {
  initAudio()
  // BGM starts on first user interaction
  const startBgm = () => {
    playBgm()
    window.removeEventListener('click', startBgm)
    window.removeEventListener('keydown', startBgm)
  }
  window.addEventListener('click', startBgm)
  window.addEventListener('keydown', startBgm)
})

// 拆分进度条专用图标
const progressIcons = computed(() => ({
  complete: icons.complete,
  current:  icons.current,
  locked:   icons.locked,
}))

// 是否当前关最后一题
const isLastQuestionInLevel = computed(() => {
  const levelKey = 'level' + state.currentLevel
  const total    = questions[levelKey]?.length || 5
  return state.currentQuestionIndex + 1 >= total
})

// 背景星星（固定px）
const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x:    Math.random() * 100,
  y:    Math.random() * 100,
  size: Math.random() * 4 + 1,
  color: ['#c9a84c','#f4d03f','#ffffff','#a78bfa','#60a5fa'][Math.floor(Math.random() * 5)],
  dur:   Math.random() * 3 + 2,
  delay: Math.random() * 4,
}))

// Toast
let toastTimer = null
function showToast(msg) {
  state.toastMsg = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { state.toastMsg = '' }, 1800)
}

function handleConfirm() {
  if (state.gameStatus !== 'playing') return
  if (state.answered) return
  if (!state.studentAnswer && state.studentAnswer !== '0') {
    showToast('请输入答案！')
    return
  }
  const isCorrect = checkAnswer(state.studentAnswer, currentQuestion.value.answer)
  if (isCorrect) {
    playSound('correct')
    const hasViz = !!currentQuestion.value?.viz
    handleCorrect(hasViz)
  } else {
    playSound('wrong')
    handleWrong()
  }
}

function handleSubstDone() {
  showCorrectModalNow()
}

function handleNext() {
  if (!state.answered) {
    showToast('✨ 请先答对当前题目！')
    return
  }
  playSound('click')
  nextQuestion()
}

function onContinue() {
  playSound('click')
  continueGame()
}
</script>
