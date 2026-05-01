<template>
  <Teleport to="body">
    <div class="subst-overlay" @click="handleClick">
      <div class="subst-card">
        <div class="subst-label">🔄 等量代换过程</div>

        <!-- 三阶段展示区 -->
        <div class="subst-stages">
          <template v-for="(frame, fi) in viz.subst" :key="fi">
            <!-- 箭头（第2、3帧前） -->
            <div v-if="fi > 0" class="subst-arrow"
              :class="{ 'subst-arrow--visible': currentPhaseIdx >= fi }">
              ▶
            </div>

            <!-- 物品帧 -->
            <div class="subst-frame"
              :class="{
                'subst-frame--active':  currentPhaseIdx === fi,
                'subst-frame--done':    currentPhaseIdx > fi,
                'subst-frame--pending': currentPhaseIdx < fi,
              }">
              <template v-for="(item, ii) in frame.items" :key="ii">
                <div v-for="n in item.count" :key="ii+'_'+n" class="subst-item">
                  <div class="subst-item-wrap"
                    :class="{ 'subst-item-wrap--coin': item.type === 'coin' }">
                    <img v-if="getImg(item)" :src="getImg(item)" :alt="getName(item)"
                      class="subst-img" />
                    <span v-else class="subst-emoji">🪙</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>

        <!-- 底部文字 -->
        <div class="subst-result" v-if="currentPhaseIdx >= viz.subst.length - 1">
          <span>{{ resultText }}</span>
        </div>

        <!-- 点击提示 -->
        <div class="subst-hint" v-if="waitingForClick">
          点按屏幕任意位置继续
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import coinImg from '../assets/items/coin.png'

const props = defineProps({
  viz:      { type: Object, required: true },
  products: { type: Array,  default: () => [] },
  answer:   { type: Number, default: 0 },
})

const emit = defineEmits(['done'])

const currentPhaseIdx = ref(0)
const waitingForClick = ref(false)

// 播放时序：frame0(500ms) → frame1(800ms) → frame2(900ms) → 定格等待点击
onMounted(() => {
  const delays = [500, 800, 900, 400]
  let t = 0
  for (let i = 1; i < props.viz.subst.length; i++) {
    t += delays[i - 1]
    const idx = i
    setTimeout(() => { currentPhaseIdx.value = idx }, t)
  }
  // 最后一帧结束后定格，显示点击提示
  t += delays[props.viz.subst.length - 1]
  setTimeout(() => { waitingForClick.value = true }, t)
})

function handleClick() {
  if (waitingForClick.value) {
    waitingForClick.value = false
    emit('done')
  }
}

function getImg(item) {
  if (item.type === 'coin') return coinImg
  const p = props.products.find(x => x.id === item.id)
  return p?.image || null
}

function getName(item) {
  if (item.type === 'coin') return '金币'
  const p = props.products.find(x => x.id === item.id)
  return p?.name || item.id
}

const resultText = computed(() => `= ${props.answer} 金币！`)
</script>

<style scoped>
.subst-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 5, 30, 0.72);
  animation: overlayIn 0.25s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.subst-card {
  background: linear-gradient(145deg, #f5e6c8 0%, #ede0b0 100%);
  border: 3px solid #c9a84c;
  border-radius: 22px;
  box-shadow: 0 0 60px rgba(201,168,76,0.5), 0 8px 32px rgba(0,0,0,0.5);
  padding: 36px 56px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  min-width: 680px;
  animation: cardPop 0.35s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes cardPop {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.subst-label {
  font-size: 26px;
  font-weight: bold;
  color: #7a5c2e;
  letter-spacing: 2px;
}

/* ── 三帧横排 ── */
.subst-stages {
  display: flex;
  align-items: center;
  gap: 16px;
}

.subst-arrow {
  font-size: 28px;
  color: #c9a84c;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.subst-arrow--visible {
  opacity: 1;
  transform: translateX(0);
}

/* 帧容器 */
.subst-frame {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: 16px;
  border: 2.5px solid rgba(201,168,76,0.35);
  background: rgba(255,248,230,0.6);
  transition: border-color 0.3s, box-shadow 0.3s, opacity 0.4s;
}
.subst-frame--active {
  border-color: #f4d03f;
  box-shadow: 0 0 20px rgba(244,208,63,0.7), 0 0 40px rgba(244,208,63,0.3);
}
.subst-frame--done {
  border-color: rgba(201,168,76,0.5);
  opacity: 0.6;
}
.subst-frame--pending {
  opacity: 0.3;
}

/* 单个物品 */
.subst-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.subst-item-wrap {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #fff8ec 0%, #ede0b0 100%);
  border: 1.5px solid rgba(201,168,76,0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.subst-frame--active .subst-item-wrap {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.subst-item-wrap--coin {
  background: radial-gradient(ellipse at center, #fff7d0 0%, #f4d03f 100%);
  border-color: #c9a84c;
}

.subst-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
}
.subst-emoji {
  font-size: 42px;
  line-height: 1;
}

.subst-count {
  font-size: 18px;
  font-weight: bold;
  color: #4a2c0a;
}

/* 点击继续提示 */
.subst-hint {
  font-size: 17px;
  color: rgba(122, 92, 46, 0.7);
  letter-spacing: 1px;
  animation: hintBlink 1.2s ease-in-out infinite;
}

@keyframes hintBlink {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}

/* 结果文字 */
.subst-result {
  font-size: 34px;
  font-weight: bold;
  color: #b8630a;
  animation: resultIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes resultIn {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
</style>
