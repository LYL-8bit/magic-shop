// 23种物品，按关卡解锁
import mushroomImg      from '../assets/items/item_mushroom.png'
import spiderSilkImg    from '../assets/items/item_spider_silk.png'
import starPowderImg    from '../assets/items/item_star_powder.png'
import wandThreadImg    from '../assets/items/item_wand_thread.png'
import fireflyImg       from '../assets/items/item_firefly.png'
import dewDropImg       from '../assets/items/item_dew_drop.png'

import moonstoneImg     from '../assets/items/item_moonstone.png'
import batFangImg       from '../assets/items/item_bat_fang.png'
import gemImg           from '../assets/items/item_gem.png'
import crystalBallImg   from '../assets/items/item_crystal_ball.png'
import magicPineconeImg from '../assets/items/item_magic_pinecone.png'
import magicFeatherImg  from '../assets/items/item_magic_feather.png'
import smallPotionImg   from '../assets/items/item_small_potion.png'
import magicBadgeImg    from '../assets/items/item_magic_badge.png'

import dragonScaleImg   from '../assets/items/item_dragon_scale.png'
import crystalImg       from '../assets/items/item_crystal.png'
import magicWandImg     from '../assets/items/item_magic_wand.png'
import nightPearlImg    from '../assets/items/item_night_pearl.png'

import magicBookImg     from '../assets/items/item_magic_book.png'
import magicKeyImg      from '../assets/items/item_magic_key.png'
import largePotionImg   from '../assets/items/item_large_potion.png'

import phoenixFeatherImg from '../assets/items/item_phoenix_feather.png'
import treasureChestImg  from '../assets/items/item_treasure_chest.png'

export const products = [
  // ── Level 1 解锁：6种基准物品（1金币）──
  { id: 'mushroom',       name: '蘑菇',     image: mushroomImg,      price: 1,  unlockLevel: 1 },
  { id: 'spider_silk',    name: '蜘蛛丝',   image: spiderSilkImg,    price: 1,  unlockLevel: 1 },
  { id: 'star_powder',    name: '星星粉',   image: starPowderImg,    price: 1,  unlockLevel: 1 },
  { id: 'wand_thread',    name: '魔杖线',   image: wandThreadImg,    price: 1,  unlockLevel: 1 },
  { id: 'firefly',        name: '萤火虫',   image: fireflyImg,       price: 1,  unlockLevel: 1 },
  { id: 'dew_drop',       name: '露水',     image: dewDropImg,       price: 1,  unlockLevel: 1 },

  // ── Level 2 解锁：8种普通物品（2–5金币）──
  { id: 'moonstone',      name: '月光石',   image: moonstoneImg,     price: 3,  unlockLevel: 2 },
  { id: 'bat_fang',       name: '蝙蝠牙',   image: batFangImg,       price: 3,  unlockLevel: 2 },
  { id: 'gem',            name: '宝石',     image: gemImg,           price: 4,  unlockLevel: 2 },
  { id: 'crystal_ball',   name: '水晶球',   image: crystalBallImg,   price: 4,  unlockLevel: 2 },
  { id: 'magic_pinecone', name: '魔法松果', image: magicPineconeImg, price: 1,  unlockLevel: 2 },
  { id: 'magic_feather',  name: '魔法羽毛', image: magicFeatherImg,  price: 5,  unlockLevel: 2 },
  { id: 'small_potion',   name: '小瓶药水', image: smallPotionImg,   price: 5,  unlockLevel: 2 },
  { id: 'magic_badge',    name: '魔法徽章', image: magicBadgeImg,    price: 5,  unlockLevel: 2 },

  // ── Level 3 解锁：4种稀有物品（2–6金币）──
  { id: 'dragon_scale',   name: '龙鳞',     image: dragonScaleImg,   price: 6,  unlockLevel: 3 },
  { id: 'crystal',        name: '水晶',     image: crystalImg,       price: 2,  unlockLevel: 3 },
  { id: 'magic_wand',     name: '魔杖',     image: magicWandImg,     price: 6,  unlockLevel: 3 },
  { id: 'night_pearl',    name: '夜明珠',   image: nightPearlImg,    price: 2,  unlockLevel: 3 },

  // ── Level 4 解锁：3种高价物品（12–15金币）──
  { id: 'magic_book',     name: '魔法书',   image: magicBookImg,     price: 12, unlockLevel: 4 },
  { id: 'magic_key',      name: '魔法钥匙', image: magicKeyImg,      price: 12, unlockLevel: 4 },
  { id: 'large_potion',   name: '大瓶药水', image: largePotionImg,   price: 15, unlockLevel: 4 },

  // ── Level 5 解锁：2种传奇物品──
  { id: 'phoenix_feather', name: '凤凰羽毛', image: phoenixFeatherImg, price: 8,  unlockLevel: 5 },
  { id: 'treasure_chest',  name: '宝箱',     image: treasureChestImg,  price: 24, unlockLevel: 5 },
]
