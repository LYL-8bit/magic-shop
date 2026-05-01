<template>
  <div
    class="flex flex-col p-6 overflow-hidden"
    style="width: 35vw; flex-shrink: 0; transition: background-color 0.8s ease; min-height: 0;"
    :style="{ backgroundColor: shopBgColor }"
  >
    <!-- 商店名称 -->
    <div
      class="text-center font-bold mb-4 pb-4"
      style="font-size: 3vw; color: #FFD700; border-bottom: 2px solid rgba(255,215,0,0.3);"
    >
      {{ shopName }}
    </div>

    <!-- 金币与等级 -->
    <div class="flex flex-col gap-3 mb-4 pb-4" style="border-bottom: 2px solid rgba(255,255,255,0.1);">
      <!-- 金币 -->
      <div class="flex items-center gap-3">
        <span style="font-size: 2.2vw;">💰</span>
        <span class="font-bold" style="font-size: 2.2vw; color: #FFD700;">
          金币：{{ coins }}
        </span>
      </div>
      <!-- 等级 -->
      <div class="flex items-center gap-3">
        <span style="font-size: 2vw;">⭐</span>
        <span style="font-size: 2vw; color: #FFFFFF;">
          等级：{{ level }}级
          <span style="font-size: 1.6vw; color: #AAAAAA;">{{ levelName }}</span>
        </span>
      </div>
    </div>

    <!-- 商品货架 -->
    <div class="flex flex-col flex-1 overflow-hidden" style="min-height: 0;">
      <div class="font-bold mb-3" style="font-size: 1.8vw; color: #AAAAAA;">商品货架</div>
      <div class="flex flex-col gap-2 overflow-y-auto" style="flex: 1 1 0; min-height: 0;">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex items-center justify-between px-3 py-2 rounded-button"
          style="background: rgba(255,255,255,0.05);"
        >
          <div class="flex items-center gap-2">
            <span style="font-size: 1.8vw;">{{ product.emoji }}</span>
            <span style="font-size: 1.8vw; color: #FFFFFF;">{{ product.name }}</span>
          </div>
          <span class="font-bold" style="font-size: 1.8vw; color: #FFD700;">{{ product.price }}币</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  shopName: String,
  coins: Number,
  level: Number,
  products: Array,
  shopBgColor: String,
})

const levelName = computed(() => {
  const names = ['', '小木屋', '初级', '中级', '高级', '传说']
  return names[props.level] || ''
})
</script>
