// 题库：5关×5题 + 终极挑战（第5关第5题）= 26题
// 题型：等量代换，答案均为金币数量
// items 字段：题目中出现的物品id，用于在题目文字中渲染图标
// customerId：每题对应的NPC，方案A下每题可以是不同顾客

export const questions = {
  // ══════════════════════════════════════════
  // 第1关：见习学徒 · 直接代换（1步）
  // ══════════════════════════════════════════
  level1: [
    {
      id: 'L1-01',
      level: 1,
      customerId: 'dwarf',
      question: '已知1朵蘑菇值1金币。小矮人说："1颗月光石可以换3朵蘑菇。"请问1颗月光石值多少金币？',
      answer: 3,
      items: ['mushroom', 'moonstone'],
      hints: [
        '不对哦，再想想。月光石能和金币直接换吗？不能。那月光石能和谁直接换？金币又能和谁直接换？找出这两个"直接关系"，中间量就藏在这里面。',
        '不对哦！中间量就是蘑菇！先算：1颗月光石能换几朵蘑菇？（3朵）。再算：每朵蘑菇值几金币？（1金币）。那3朵蘑菇一共值多少金币？用加法还是乘法？',
        '3朵蘑菇，每朵换1个金币，一共就是3×1=3个金币。所以1颗月光石能换3个金币。你刚才是不是把3和1直接加起来了？再遇到这样的题，记得先找中间量，再用乘法。',
      ],
      viz: {
        steps: [
          { left: [{ id: 'mushroom', count: 1 }],   right: [{ type: 'coin', count: 1 }] },
          { left: [{ id: 'moonstone', count: 1 }],  right: [{ id: 'mushroom', count: 3 }] },
        ],
        target: { id: 'moonstone', count: 1 },
        subst: [
          { items: [{ id: 'moonstone', count: 1 }],  phase: 'original' },
          { items: [{ id: 'mushroom',  count: 3 }],  phase: 'expand' },
          { items: [{ type: 'coin',    count: 3 }],  phase: 'resolve' },
        ],
      },
    },
    {
      id: 'L1-02',
      level: 1,
      customerId: 'dragon_baby',
      question: '已知1颗月光石值3金币。龙宝宝说："1片龙鳞可以换2颗月光石。"请问1片龙鳞值多少金币？',
      answer: 6,
      items: ['moonstone', 'dragon_scale'],
      hints: [
        '不对哦。龙鳞能和金币直接换吗？不能。那龙鳞能和谁直接换？金币又能和谁直接换？找出这两个"直接关系"，你就能找到中间量啦！',
        '不对哦！中间量是月光石！先算：1片龙鳞能换几颗月光石？（2颗）。再算：每颗月光石值几金币？（3金币）。那2颗月光石一共多少金币？要用乘法，因为每颗月光石都要换3个金币。',
        '2颗月光石，每颗换3个金币，一共就是2×3=6个金币。所以1片龙鳞能换6个金币。记住：两步代换要用乘法，不能把两步的数字直接加。',
      ],
      viz: {
        steps: [
          { left: [{ id: 'moonstone',   count: 1 }], right: [{ type: 'coin', count: 3 }] },
          { left: [{ id: 'dragon_scale', count: 1 }], right: [{ id: 'moonstone', count: 2 }] },
        ],
        target: { id: 'dragon_scale', count: 1 },
        subst: [
          { items: [{ id: 'dragon_scale', count: 1 }], phase: 'original' },
          { items: [{ id: 'moonstone',    count: 2 }], phase: 'expand' },
          { items: [{ type: 'coin',       count: 6 }], phase: 'resolve' },
        ],
      },
    },
    {
      id: 'L1-03',
      level: 1,
      customerId: 'owl',
      question: '已知1个魔法松果值1金币。猫头鹰说："1颗水晶球可以换4个魔法松果。"请问1颗水晶球值多少金币？',
      answer: 4,
      items: ['magic_pinecone', 'crystal_ball'],
      hints: [
        '不对哦，你是不是把水晶球和松果的关系弄反了？或者忘记松果值多少钱？先找出直接关系：水晶球和松果直接换，松果和金币直接换。中间量是松果。',
        '不对哦，1颗水晶球换4个松果，每个松果1金币。要用乘法，不是加法。4个松果一共多少金币？想一想怎么算。',
        '不对哦，完整算式是：4 × 1 = 4。答案是4金币。',
      ],
    },
    {
      id: 'L1-04',
      level: 1,
      customerId: 'bat_sister',
      question: '已知1根蜘蛛丝值1金币。蝙蝠妹妹说："2颗蝙蝠牙可以换6根蜘蛛丝。"请问1颗蝙蝠牙值多少金币？',
      answer: 3,
      items: ['spider_silk', 'bat_fang'],
      hints: [
        '2颗牙换6根丝，1颗牙换3根丝，每根丝1金币，所以3金币。',
        '6÷2=3，3×1=3。',
        '6÷2=3金币。',
      ],
    },
    {
      id: 'L1-05',
      level: 1,
      customerId: 'little_witch',
      question: '已知1包星星粉值1金币。小巫女说："1根魔法羽毛可以换5包星星粉。"请问1根魔法羽毛值多少金币？',
      answer: 5,
      items: ['star_powder', 'magic_feather'],
      hints: [
        '1根羽毛换5包粉，每包1金币，所以5金币。',
        '5×1=5。',
        '5×1=5金币。',
      ],
    },
  ],

  // ══════════════════════════════════════════
  // 第2关：初级店主 · 两步代换（2步连乘）
  // ══════════════════════════════════════════
  level2: [
    {
      id: 'L2-01',
      level: 2,
      customerId: 'dwarf',
      question: '已知1朵蘑菇=1金币，1颗月光石=3朵蘑菇，1片龙鳞=2颗月光石。请问1片龙鳞值多少金币？',
      answer: 6,
      items: ['mushroom', 'moonstone', 'dragon_scale'],
      hints: [
        '先算1片龙鳞能换几朵蘑菇：2×3=6朵，每朵1金币，所以6金币。',
        '1龙鳞=2月光石=2×3=6蘑菇=6金币。',
        '2×3×1=6金币。',
      ],
    },
    {
      id: 'L2-02',
      level: 2,
      customerId: 'owl',
      question: '已知1根魔杖线=1金币，1颗水晶=2根魔杖线，1根魔杖=3颗水晶。请问1根魔杖值多少金币？',
      answer: 6,
      items: ['wand_thread', 'crystal', 'magic_wand'],
      hints: [
        '1魔杖=3水晶，1水晶=2线，所以1魔杖=3×2=6线，每线1金币。',
        '3×2=6金币。',
        '3×2=6金币。',
      ],
    },
    {
      id: 'L2-03',
      level: 2,
      customerId: 'phoenix',
      question: '已知1只萤火虫=1金币，1颗夜明珠=2只萤火虫，1根凤凰羽毛=4颗夜明珠。请问1根凤凰羽毛值多少金币？',
      answer: 8,
      items: ['firefly', 'night_pearl', 'phoenix_feather'],
      hints: [
        '1羽毛=4夜明珠，1夜明珠=2萤火虫，所以1羽毛=4×2=8萤火虫=8金币。',
        '4×2=8。',
        '4×2=8金币。',
      ],
    },
    {
      id: 'L2-04',
      level: 2,
      customerId: 'alchemist',
      question: '已知1滴露水=1金币，1小瓶药水=5滴露水，1大瓶药水=3小瓶药水。请问1大瓶药水值多少金币？',
      answer: 15,
      items: ['dew_drop', 'small_potion', 'large_potion'],
      hints: [
        '1大瓶=3小瓶，1小瓶=5滴，所以1大瓶=3×5=15滴=15金币。',
        '3×5=15。',
        '3×5=15金币。',
      ],
    },
    {
      id: 'L2-05',
      level: 2,
      customerId: 'dragon_baby',
      question: '已知1片龙鳞=6金币。龙宝宝进阶题：请问2片龙鳞值多少金币？',
      answer: 12,
      items: ['dragon_scale'],
      hints: [
        '1片6金币，2片就是6×2=12金币。',
        '6+6=12。',
        '2×6=12金币。',
      ],
    },
  ],

  // ══════════════════════════════════════════
  // 第3关：高级商人 · 代换+加法（多物品组合）
  // ══════════════════════════════════════════
  level3: [
    {
      id: 'L3-01',
      level: 3,
      customerId: 'dwarf',
      question: '已知1朵蘑菇=1金币，1颗月光石=3朵蘑菇，1片龙鳞=2颗月光石。小矮人要买1片龙鳞和1颗月光石，一共值多少金币？',
      answer: 9,
      items: ['mushroom', 'moonstone', 'dragon_scale'],
      hints: [
        '先算1龙鳞值6金币，1月光石值3金币，再加起来。',
        '6+3=9。',
        '6+3=9金币。',
      ],
    },
    {
      id: 'L3-02',
      level: 3,
      customerId: 'owl',
      question: '已知1根魔杖线=1金币，1颗水晶=2根魔杖线，1根魔杖=3颗水晶。猫头鹰要买2根魔杖，需要多少金币？',
      answer: 12,
      items: ['wand_thread', 'crystal', 'magic_wand'],
      hints: [
        '1根魔杖值6金币，2根就是12金币。',
        '2×6=12。',
        '2×6=12金币。',
      ],
    },
    {
      id: 'L3-03',
      level: 3,
      customerId: 'bat_sister',
      question: '已知1只萤火虫=1金币，1颗夜明珠=2只萤火虫，1根凤凰羽毛=4颗夜明珠。蝙蝠妹妹要买1根凤凰羽毛和2颗夜明珠，需要多少金币？',
      answer: 12,
      items: ['firefly', 'night_pearl', 'phoenix_feather'],
      hints: [
        '1根凤凰羽毛值8金币，1颗夜明珠值2金币，2颗值4，一共12。',
        '8+(2×2)=8+4=12。',
        '8+4=12金币。',
      ],
    },
    {
      id: 'L3-04',
      level: 3,
      customerId: 'alchemist',
      question: '已知1滴露水=1金币，1小瓶药水=5滴露水，1大瓶药水=3小瓶药水。药剂师要买2大瓶药水和1小瓶药水，需要多少金币？',
      answer: 35,
      items: ['dew_drop', 'small_potion', 'large_potion'],
      hints: [
        '1大瓶=15金币，2大瓶=30，加1小瓶5，共35。',
        '30+5=35。',
        '2×15+5=35金币。',
      ],
    },
    {
      id: 'L3-05',
      level: 3,
      customerId: 'magic_apprentice',
      question: '已知1根魔杖线=1金币，1颗水晶=2根魔杖线，1根魔杖=3颗水晶，1本魔法书=2根魔杖。请问1本魔法书值多少金币？',
      answer: 12,
      items: ['wand_thread', 'crystal', 'magic_wand', 'magic_book'],
      hints: [
        '1本书=2魔杖，1魔杖=3水晶，1水晶=2线，所以1本书=2×3×2=12线=12金币。',
        '一步一步乘：2×3=6，6×2=12。',
        '2×3×2=12金币。',
      ],
    },
  ],

  // ══════════════════════════════════════════
  // 第4关：大师掌柜 · 反向代换（已知总量求单价）
  // ══════════════════════════════════════════
  level4: [
    {
      id: 'L4-01',
      level: 4,
      customerId: 'dwarf',
      question: '已知1朵蘑菇=1金币。小矮人说："3颗月光石可以换9朵蘑菇。"请问1颗月光石值多少金币？',
      answer: 3,
      items: ['mushroom', 'moonstone'],
      hints: [
        '3颗月光石换9朵蘑菇，那么1颗换3朵，每朵1金币，所以3金币。',
        '9÷3=3朵，3×1=3金币。',
        '9÷3=3金币。',
      ],
    },
    {
      id: 'L4-02',
      level: 4,
      customerId: 'dragon_baby',
      question: '已知1颗月光石=3金币。龙宝宝说："2片龙鳞可以换8颗月光石。"请问1片龙鳞值多少金币？',
      answer: 12,
      items: ['moonstone', 'dragon_scale'],
      hints: [
        '2片龙鳞换8颗月光石，1片换4颗，每颗3金币，4×3=12。',
        '8÷2=4，4×3=12。',
        '(8÷2)×3=12金币。',
      ],
    },
    {
      id: 'L4-03',
      level: 4,
      customerId: 'owl',
      question: '已知1个魔法松果=1金币。猫头鹰说："4颗水晶球可以换12个魔法松果。"请问1颗水晶球值多少金币？',
      answer: 3,
      items: ['magic_pinecone', 'crystal_ball'],
      hints: [
        '4颗水晶球换12松果，1颗换3松果，每松果1金币，所以3金币。',
        '12÷4=3。',
        '12÷4=3金币。',
      ],
    },
    {
      id: 'L4-04',
      level: 4,
      customerId: 'alchemist',
      question: '已知1滴露水=1金币。药剂师说："5小瓶药水可以换15滴露水。"请问3小瓶药水值多少金币？',
      answer: 9,
      items: ['dew_drop', 'small_potion'],
      hints: [
        '先算1小瓶药水换15÷5=3滴=3金币，3小瓶换3×3=9金币。',
        '15÷5=3，3×3=9。',
        '15÷5=3，3×3=9金币。',
      ],
    },
    {
      id: 'L4-05',
      level: 4,
      customerId: 'bat_sister',
      question: '已知1包星星粉=1金币。蝙蝠妹妹说："2个魔法徽章可以换10包星星粉。"请问5个魔法徽章值多少金币？',
      answer: 25,
      items: ['star_powder', 'magic_badge'],
      hints: [
        '1个徽章换10÷2=5包=5金币，5个徽章换5×5=25金币。',
        '10÷2=5，5×5=25。',
        '5×5=25金币。',
      ],
    },
  ],

  // ══════════════════════════════════════════
  // 第5关：传奇冒险商店 · 混合应用 + 终极挑战
  // ══════════════════════════════════════════
  level5: [
    {
      id: 'L5-01',
      level: 5,
      customerId: 'grand_mage',
      question: '大法师说："1片龙鳞=2颗月光石，1颗月光石=3朵蘑菇，1朵蘑菇=2滴露水。"已知1滴露水=1金币。请问1片龙鳞值多少金币？',
      answer: 12,
      items: ['dragon_scale', 'moonstone', 'mushroom', 'dew_drop'],
      hints: [
        '先算：1龙鳞=2月光石=2×3=6蘑菇=6×2=12滴露水，每滴1金币，所以12金币。',
        '2×3×2=12滴，12×1=12金币。',
        '2×3×2=12金币。',
      ],
    },
    {
      id: 'L5-02',
      level: 5,
      customerId: 'book_merchant',
      question: '魔法书商说："1本魔法书=2根魔杖，1根魔杖=3颗水晶。"已知1颗水晶=2金币。请问1本魔法书和1根魔杖一共值多少金币？',
      answer: 18,
      items: ['magic_book', 'magic_wand', 'crystal'],
      hints: [
        '1本书=2魔杖=2×3=6水晶，1根魔杖=3水晶，共6+3=9颗水晶，9×2=18金币。',
        '(2×3+3)×2=9×2=18。',
        '1书=6水晶，1魔杖=3水晶，共9水晶，9×2=18金币。',
      ],
    },
    {
      id: 'L5-03',
      level: 5,
      customerId: 'phoenix',
      question: '凤凰说："2根凤凰羽毛=8颗夜明珠，1颗夜明珠=3只萤火虫。"已知1只萤火虫=1金币。请问3根凤凰羽毛值多少金币？',
      answer: 36,
      items: ['phoenix_feather', 'night_pearl', 'firefly'],
      hints: [
        '2根羽毛换8夜明珠→1根换4夜明珠；1夜明珠换3萤火虫→1根换12萤火虫。3根换36萤火虫=36金币。',
        '8÷2=4，4×3=12，12×3=36。',
        '8÷2=4，4×3=12，12×3=36金币。',
      ],
    },
    {
      id: 'L5-04',
      level: 5,
      customerId: 'potion_master',
      question: '魔药大师说："1大瓶药水=3小瓶药水，1小瓶药水=4滴露水。"已知1滴露水=1金币。请问1大瓶药水和1小瓶药水一共值多少金币？',
      answer: 16,
      items: ['large_potion', 'small_potion', 'dew_drop'],
      hints: [
        '1大瓶=3小瓶，所以1大瓶+1小瓶=4小瓶。1小瓶=4滴，所以4小瓶=16滴=16金币。',
        '(3+1)×4=4×4=16。',
        '(3+1)×4=16金币。',
      ],
    },
    {
      id: 'L5-05',
      level: 5,
      customerId: 'dwarf_final',
      question: '终极挑战！已知：1个宝箱=2把魔法钥匙，1把魔法钥匙=3颗宝石，1颗宝石=4金币。小矮人给你2个宝箱和1把魔法钥匙，值多少金币？',
      answer: 60,
      items: ['treasure_chest', 'magic_key', 'gem'],
      hints: [
        '2个宝箱=4把钥匙，加1把共5把钥匙。5×3=15颗宝石。15×4=60金币。',
        '(2×2+1)×3×4=5×3×4=60。',
        '(2×2+1)×3×4=60金币。',
      ],
    },
  ],
}
