
# 🧙 魔法数字商店

一款以"魔法商店"为背景的数学益智小游戏，专为小学生设计，通过等量代换题型培养逻辑推理能力。

游戏共 5 关，每关 5 道题，答对可赚取金币、解锁新商品，关卡结束后有过关动画和结算报告。

**技术栈**：Vue 3 · Vite · Tailwind CSS · DaisyUI

---

## 游戏截图

> 
<img width="2264" height="1269" alt="屏幕截图 2026-05-01 184432" src="https://github.com/user-attachments/assets/1a192ffc-b5ab-421a-8395-f3e4635a78df" />


## 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) 18 或以上版本
- npm（随 Node.js 一起安装）

### 启动步骤

```bash
# 1. 克隆仓库
git clone https://github.com/LYL-8bit/magic-shop.git
cd magic-shop

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

启动后浏览器打开 `http://localhost:5173` 即可看到游戏。

> 修改源码后页面会自动刷新，无需手动重启。

---

## 构建正式版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态服务器。

---

## 部署上线

### 方案一：Vercel（推荐，免费，自动部署）

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点击 **"Add New Project"**，选择 `magic-shop` 仓库
3. 点击 **Deploy**，等待几分钟即可

部署完成后 Vercel 会分配一个访问网址。**此后每次 `git push`，Vercel 会自动重新部署**，无需手动操作。

---

### 方案二：GitHub Pages（免费，手动部署）

```bash
# 1. 安装部署工具（只需执行一次）
npm install --save-dev gh-pages

# 2. 构建并部署
npm run build
npx gh-pages -d dist
```

部署完成后访问地址为：
`https://LYL-8bit.github.io/magic-shop/`

> 第一次部署后还需在 GitHub 仓库 → **Settings → Pages → Source** 中选择 `gh-pages` 分支并保存。

---

### 方案三：自己的服务器（Nginx）

```bash
# 1. 本地构建
npm run build

# 2. 将 dist/ 目录的全部文件上传到服务器的网站根目录
# 例如 /var/www/html/magic-shop/

# 3. Nginx 配置示例
server {
    listen 80;
    server_name 你的域名或IP;
    root /var/www/html/magic-shop;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 项目结构

```
magic-shop/
├── src/
│   ├── components/     # Vue 组件（界面、弹窗、动画等）
│   ├── data/           # 题库、商品、顾客 NPC 数据
│   ├── stores/         # 游戏状态管理
│   ├── utils/          # 音效、游戏逻辑等工具函数
│   ├── assets/         # 图片、音频资源
│   └── main.js         # 入口文件
├── public/             # 静态资源（图标、Service Worker）
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 游戏说明

| 关卡 | 主题 | 题型 |
|------|------|------|
| 第 1 关 | 见习学徒 | 直接代换（1步） |
| 第 2 关 | 初级魔法师 | 两步代换 |
| 第 3 关 | 中级魔法师 | 多步代换 |
| 第 4 关 | 高级魔法师 | 综合代换 |
| 第 5 关 | 终极挑战 | 复杂等量代换 |

- 答对得金币，可解锁新商品（共 23 种魔法物品）
- 每题最多有 3 条提示，答错后逐步显示
- 答对后有可视化动画演示代换过程
- 全部通关后显示成绩结算报告

---

## License

MIT
