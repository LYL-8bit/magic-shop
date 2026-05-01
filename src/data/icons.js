// UI图标集中管理
// 图标放置目录：src/assets/ui/
// 文件不存在时返回null，组件会自动显示fallback文字

function tryImport(modules, key) {
  return modules[key] ? modules[key].default : null
}

// 使用 import.meta.glob 动态导入，文件不存在不报错
const uiModules = import.meta.glob('../assets/ui/*.png', { eager: true })

function ui(filename) {
  const key = `../assets/ui/${filename}`
  const mod = uiModules[key]
  return mod ? mod.default : null
}

export const icons = {
  // 进度条节点
  complete: ui('node_complete.png'),
  current:  ui('node_current.png'),
  locked:   ui('node_locked.png'),

  // 提示栏
  hintBulb:  ui('hint_bulb.png'),
  hintBolt:  ui('hint_bolt.png'),
  hintCheck: ui('hint_check.png'),

  // 星级
  starFilled: ui('star_filled.png'),
  starEmpty:  ui('star_empty.png'),

  // 关卡徽章
  badge1: ui('badge_1.png'),
  badge2: ui('badge_2.png'),
  badge3: ui('badge_3.png'),
  badge4: ui('badge_4.png'),
  badge5: ui('badge_5.png'),
}
