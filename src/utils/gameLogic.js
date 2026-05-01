// 游戏核心逻辑工具函数

// 判断答案是否正确
export function checkAnswer(studentInput, correctAnswer) {
  const trimmed = String(studentInput).trim()
  if (trimmed === '') return false
  const input = parseInt(trimmed)
  if (isNaN(input)) return false
  return input === correctAnswer
}

// 计算本题获得金币
export function calcCoins(wrongCount) {
  if (wrongCount === 0) return 10
  if (wrongCount === 1) return 7
  if (wrongCount === 2) return 5
  return 0
}

// 随机获取台词（避免重复）
// dialogueArray: 台词数组
// usedIndexes: 已用索引数组（引用传入，会被修改）
export function getRandomDialogue(dialogueArray, usedIndexes) {
  if (!dialogueArray || dialogueArray.length === 0) return ''
  // 所有台词都用过时重置
  if (usedIndexes.length >= dialogueArray.length) {
    usedIndexes.splice(0, usedIndexes.length)
  }
  const available = dialogueArray
    .map((_, i) => i)
    .filter(i => !usedIndexes.includes(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  usedIndexes.push(idx)
  return dialogueArray[idx]
}

// 根据总金币计算评级
// 新题库26题，满分 = 26×10 = 260金币
export function calcRating(totalCoins) {
  if (totalCoins >= 220) return 'legend'    // ≥85% 满分
  if (totalCoins >= 170) return 'excellent' // ≥65% 满分
  if (totalCoins >= 100) return 'good'      // ≥38% 满分
  return 'tryAgain'
}

// 计算游戏用时（返回格式：X分X秒）
export function calcDuration(startTime) {
  const seconds = Math.floor((Date.now() - startTime) / 1000)
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return s + '秒'
  return m + '分' + s + '秒'
}
