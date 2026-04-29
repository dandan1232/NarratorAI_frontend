# 声悦 - NarratorAI

智能情感陪伴聊天机器人前端项目

## 功能特性

- 🎭 多种陪伴角色（男友、女友、好友、导师等）
- 💬 情感陪伴聊天
- 🎤 语音对话
- 🔊 声音克隆与设计
- 💾 个性化记忆
- 🎨 柔和温暖的界面设计

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- Framer Motion (动画)
- Lucide React (图标)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/     # 组件
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── hooks/          # 自定义 Hooks
│   ├── useAudio.ts
│   └── useRecorder.ts
├── pages/          # 页面
│   ├── WelcomePage.tsx
│   ├── SetupPage.tsx
│   ├── ChatPage.tsx
│   ├── SettingsPage.tsx
│   └── VoicePage.tsx
├── stores/         # 状态管理
│   └── useAppStore.ts
├── types/          # TypeScript 类型
│   └── index.ts
├── utils/          # 工具函数
│   └── api.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 后端 API

前端通过 `/api` 路径与后端通信，需要后端提供以下接口：

- POST `/api/chat/send` - 发送消息
- POST `/api/tts/synthesize` - 语音合成
- POST `/api/voice/clone` - 声音克隆
- POST `/api/voice/design` - 声音设计
- GET `/api/tts/voices` - 获取声音列表
- POST `/api/emotion/detect` - 情感检测

## 使用说明

1. 首次打开会进入欢迎页面
2. 点击"开始旅程"进入设置流程
3. 设置昵称、选择陪伴伙伴
4. 开始聊天，享受陪伴

## 特色功能

### 声音克隆
上传音频文件，AI 会学习并克隆该声音

### 声音设计
通过文字描述生成独特的声音

### 情感识别
AI 会识别对话中的情感，提供更贴心的回应

### 个性化记忆
记住你的喜好和重要时刻
