import { reactive, computed } from 'vue'
import { questions } from '../data/questions.js'
import { customers } from '../data/customers.js'
import { products } from '../data/products.js'
import { dialogues } from '../data/dialogues.js'
import { getRandomDialogue, calcRating, calcDuration } from '../utils/gameLogic.js'

export function createGameStore() {
  const state = reactive({
    currentLevel: 1,
    currentQuestionIndex: 0,
    gameStatus: 'playing',  // playing | levelup | finished

    wrongCount: 0,
    studentAnswer: '',
    showHint: false,
    currentHintIndex: 0,    // 0-2 正常提示，3 = 显示答案
    feedbackType: 'none',   // none | correct | wrong
    answered: false,        // 当前题是否已答对（控制下一题按钮）

    totalCoins: 0,
    levelCoins: 0,
    correctCount: 0,
    totalAnswered: 0,
    startTime: Date.now(),

    coinsBounce: false,         // 金币数字弹跳动画触发
    showCorrectModal: false,    // 答对弹窗
    lastCoinsEarned: 0,         // 本次答对获得金币数

    usedDialogueIndexes: {},
    currentDialogue: '',
    levelUpInfo: null,
    toastMsg: '',               // Toast提示
    levelCorrectCount: 0,
  })

  // ===== 计算属性 =====
  const currentQuestion = computed(() => {
    const levelKey = 'level' + state.currentLevel
    return questions[levelKey][state.currentQuestionIndex]
  })

  const currentCustomer = computed(() => {
    const cid = currentQuestion.value.customerId
    return customers.find(c => c.id === cid)
  })

  const unlockedProducts = computed(() => {
    return products.filter(p => p.unlockLevel <= state.currentLevel)
  })

  const shopName = computed(() => {
    const names = ['🌱 小木屋商店', '🏠 普通商店', '🏪 魔法商店', '🏬 魔法超市', '🏰 传说商场']
    return names[state.currentLevel - 1]
  })

  const shopBgColor = computed(() => {
    const colors = ['#1A3A1A', '#16213E', '#2D1B69', '#3D1A00', '#1A0A2E']
    return colors[state.currentLevel - 1]
  })

  const accuracy = computed(() => {
    if (state.totalAnswered === 0) return 0
    return Math.round(state.correctCount / state.totalAnswered * 100)
  })

  const currentRating = computed(() => calcRating(state.totalCoins))
  const finalRating   = computed(() => dialogues.final[currentRating.value])
  const gameDuration  = computed(() => calcDuration(state.startTime))

  // ===== 台词 =====
  function getDialogue(customerId, type) {
    const key = customerId + '_' + type
    if (!state.usedDialogueIndexes[key]) state.usedDialogueIndexes[key] = []
    const arr = dialogues[customerId]?.[type] || []
    return getRandomDialogue(arr, state.usedDialogueIndexes[key])
  }

  function getLevelUpDialogue(level) {
    const arr = dialogues.levelup['level' + level] || []
    return arr[Math.floor(Math.random() * arr.length)] || ''
  }

  function loadEnterDialogue() {
    const cid = currentQuestion.value.customerId
    state.currentDialogue = getDialogue(cid, 'enter')
  }

  // ===== 游戏控制 =====
  function initGame() {
    state.currentLevel        = 1
    state.currentQuestionIndex = 0
    state.gameStatus          = 'playing'
    state.wrongCount          = 0
    state.studentAnswer       = ''
    state.showHint            = false
    state.currentHintIndex    = 0
    state.feedbackType        = 'none'
    state.answered            = false
    state.totalCoins          = 0
    state.levelCoins          = 0
    state.correctCount        = 0
    state.totalAnswered       = 0
    state.startTime           = Date.now()
    state.usedDialogueIndexes = {}
    state.levelUpInfo         = null
    state.coinsBounce         = false
    state.showCorrectModal    = false
    state.lastCoinsEarned     = 0
    state.levelCorrectCount   = 0
    loadEnterDialogue()
  }

  function handleCorrect(hasViz = false) {
    const earned = calcCoinsFromWrong(state.wrongCount)
    state.totalCoins  += earned
    state.levelCoins  += earned
    state.correctCount++
    state.levelCorrectCount++
    state.totalAnswered++
    state.feedbackType    = 'correct'
    state.answered        = true
    state.lastCoinsEarned = earned

    const cid = currentQuestion.value.customerId
    state.currentDialogue = getDialogue(cid, 'correct')

    state.wrongCount    = 0
    state.showHint      = false
    state.studentAnswer = ''

    // 金币弹跳动画
    state.coinsBounce = true
    setTimeout(() => { state.coinsBounce = false }, 600)

    // 有代换动画时不在此处触发弹窗，由外部 subst-done 事件触发
    if (!hasViz) {
      setTimeout(() => { state.showCorrectModal = true }, 300)
    }
  }

  function showCorrectModalNow() {
    state.showCorrectModal = true
  }

  function handleWrong() {
    state.wrongCount++
    state.totalAnswered++
    state.feedbackType = 'wrong'

    const cid = currentQuestion.value.customerId
    state.currentDialogue = getDialogue(cid, 'wrong')

    if (state.wrongCount >= 3) {
      state.currentHintIndex = 3
      state.showHint = true
      // 第3次错显示答案，2秒后允许手动下一题
      setTimeout(() => { state.answered = true }, 2000)
    } else {
      state.currentHintIndex = state.wrongCount - 1
      state.showHint = true
    }

    setTimeout(() => { state.feedbackType = 'none' }, 600)
    state.studentAnswer = ''
  }

  function nextQuestion() {
    state.feedbackType      = 'none'
    state.answered          = false
    state.showCorrectModal  = false
    const levelKey     = 'level' + state.currentLevel
    const totalInLevel = questions[levelKey].length

    const cid = currentQuestion.value.customerId
    state.currentDialogue = getDialogue(cid, 'leave')

    if (state.currentQuestionIndex + 1 >= totalInLevel) {
      // 取下一关第1题的顾客作为"下一位顾客"展示
      const nextLevelKey = 'level' + (state.currentLevel + 1)
      const nextCustomerId = state.currentLevel < 5
        ? questions[nextLevelKey]?.[0]?.customerId
        : null
      const nextCustomer = nextCustomerId
        ? customers.find(c => c.id === nextCustomerId)
        : null
      state.levelUpInfo = {
        level: state.currentLevel,
        shopName: shopName.value,
        coinsEarned: state.levelCoins,
        dialogue: getLevelUpDialogue(state.currentLevel),
        nextCustomer,
        correctCount: state.levelCorrectCount,
        totalQuestions: questions['level' + state.currentLevel].length,
      }
      state.levelCoins = 0
      state.levelCorrectCount = 0
      setTimeout(() => { state.gameStatus = 'levelup' }, 800)
    } else {
      setTimeout(() => {
        state.currentQuestionIndex++
        state.wrongCount       = 0
        state.showHint         = false
        state.currentHintIndex = 0
        loadEnterDialogue()
      }, 800)
    }
  }

  function continueGame() {
    if (state.currentLevel >= 5) {
      state.gameStatus = 'finished'
    } else {
      state.currentLevel++
      state.currentQuestionIndex = 0
      state.wrongCount           = 0
      state.showHint             = false
      state.currentHintIndex     = 0
      state.answered           = false
      state.showCorrectModal   = false
      state.gameStatus         = 'playing'
      state.levelUpInfo        = null
      state.levelCorrectCount  = 0
      loadEnterDialogue()
    }
  }

  function restartGame() { initGame() }

  function calcCoinsFromWrong(wc) {
    if (wc === 0) return 10
    if (wc === 1) return 7
    if (wc === 2) return 5
    return 0
  }

  initGame()

  return {
    state,
    currentQuestion,
    currentCustomer,
    unlockedProducts,
    shopName,
    shopBgColor,
    accuracy,
    currentRating,
    finalRating,
    gameDuration,
    handleCorrect,
    handleWrong,
    nextQuestion,
    continueGame,
    restartGame,
    loadEnterDialogue,
    showCorrectModalNow,
  }
}
