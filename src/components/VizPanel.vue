<template>
  <div class="viz-panel">
    <div class="viz-title">📐 等量关系</div>
    <div class="viz-steps">
      <div v-for="(step, i) in viz.steps" :key="i" class="viz-row">
        <!-- 左侧：每个 item 按 count 重复渲染图标 -->
        <div class="viz-side viz-side-left">
          <template v-for="(item, j) in step.left" :key="'l'+j">
            <div v-for="n in item.count" :key="'l'+j+'_'+n" class="viz-item">
              <div class="viz-item-img-wrap">
                <img v-if="getImg(item)" :src="getImg(item)" :alt="getName(item)" class="viz-img" />
                <span v-else class="viz-coin-emoji">🪙</span>
              </div>
            </div>
          </template>
        </div>

        <!-- 等号 -->
        <div class="viz-eq">=</div>

        <!-- 右侧：每个 item 按 count 重复渲染图标 -->
        <div class="viz-side viz-side-right">
          <template v-for="(item, j) in step.right" :key="'r'+j">
            <div v-for="n in item.count" :key="'r'+j+'_'+n" class="viz-item">
              <div class="viz-item-img-wrap">
                <img v-if="getImg(item)" :src="getImg(item)" :alt="getName(item)" class="viz-img" />
                <span v-else class="viz-coin-emoji">🪙</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import coinImg from '../assets/items/coin.png'

const props = defineProps({
  viz:      { type: Object, required: true },
  products: { type: Array,  default: () => [] },
})

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
</script>

<style scoped>
.viz-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  width: fit-content;
}

.viz-title {
  font-size: 18px;
  color: #7a5c2e;
  font-weight: bold;
  letter-spacing: 1px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(201,168,76,0.35);
  flex-shrink: 0;
}

.viz-steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
}

.viz-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255,248,230,0.55);
  border: 1.5px solid rgba(201,168,76,0.4);
  border-radius: 12px;
  padding: 10px 14px;
}

.viz-side {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.viz-side-left {
  justify-content: flex-end;
}

.viz-side-right {
  justify-content: flex-start;
}

.viz-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viz-item-img-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #fff8ec 0%, #ede0b0 100%);
  border-radius: 8px;
  border: 1px solid rgba(201,168,76,0.3);
}

.viz-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));
}

.viz-coin-emoji {
  font-size: 26px;
  line-height: 1;
}

.viz-eq {
  font-size: 26px;
  font-weight: bold;
  color: #c9a84c;
  flex-shrink: 0;
  padding: 0 4px;
}
</style>
