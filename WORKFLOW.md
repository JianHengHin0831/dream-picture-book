# 🌟 Dream Picture Book - Workflow & Features

## 📖 完整工作流程

### 阶段 1: 上传图片 (Upload Phase)

**用户操作:**

- 点击上传区域选择一张照片
- 可以是任何日常物品：咖啡杯、书本、植物等

**系统响应:**

- 自动调用 `/api/generate` 生成故事和插画
- AI 分析图片中的主角
- 生成带有 `[CHARACTER]` 占位符的故事模板
- 生成角色描述
- 使用 DALL-E 3 创建第一张插画

---

### 阶段 2: 故事展示 & 角色命名 (Story Display & Naming)

**展示内容:**

- ✨ 左侧：DALL-E 生成的魔法插画
- 📖 右侧：带占位符的故事文本（例如："Once upon a time, [CHARACTER] lived..."）
- 💭 角色描述（AI 生成）

**用户操作:**

- 给角色取一个温暖的名字
- 点击 "Let's Talk!" 进入对话

**系统响应:**

- 将 `[CHARACTER]` 替换为用户提供的名字
- 初始化对话，角色以第一人称介绍自己

---

### 阶段 3: 互动对话 (Interactive Chat)

**界面布局:**

- **左侧栏:**

  - 顶部：角色卡片（插画 + 名字 + 描述）
  - 底部：原始上传的照片

- **右侧栏:**
  - 对话历史区域
  - 输入框和发送按钮

**对话特性:**

1. **流式传输 (Streaming)**

   - 角色回复逐字显示
   - 实时更新 UI

2. **治愈式对话保护**

   - 即使用户说脏话或负面内容
   - AI 永远用温暖、善良的方式回应
   - 引导对话往正面方向发展

3. **自动图片生成**
   - AI 在回复中包含 `[DRAWING:...]` 标记时触发
   - 后台异步生成图片（不阻塞对话）
   - 图片完成后自动插入对话流中
   - 每张图片都标注"✨ A magical moment ✨"

---

## 🎨 设计主题：温暖治愈

### 颜色方案

```css
主背景: from-blue-50 via-purple-50 to-pink-50 (淡蓝→淡紫→淡粉)
标题渐变: from-rose-400 via-orange-400 to-amber-400 (玫瑰→橙→琥珀)
角色卡片: from-amber-50 via-rose-50 to-orange-50 (琥珀→玫瑰→橙)
用户消息: from-purple-400 to-pink-400 (紫→粉)
AI 消息: from-amber-100 to-orange-100 (淡琥珀→淡橙)
```

### UI 元素

- 🌸 **圆润边角**: `rounded-2xl`, `rounded-3xl`, `rounded-full`
- ✨ **柔和阴影**: `shadow-lg`, `shadow-xl`
- 🎨 **渐变边框**: `border-rose-200/50`
- 💫 **背景模糊**: `backdrop-blur`
- 🌈 **半透明层**: `bg-white/80`

### 动画效果

- 淡入动画：`animate-fade-in`
- 加载点点：三个跳动的圆点
- 悬停效果：`hover:scale-105`, `hover:shadow-xl`

---

## 🔧 技术实现

### 后端 API

#### `/api/generate` (POST)

**功能:** 生成故事模板和插画

**请求:**

```json
{
  "image": "base64_encoded_image"
}
```

**响应:**

```json
{
  "storyTemplate": "Once upon a time, [CHARACTER] lived in...",
  "characterDescription": "a shy coffee cup with warm tones",
  "imageUrl": "https://dalle-generated-image-url"
}
```

#### `/api/chat` (POST)

**功能:** 流式对话 + 异步图片生成

**请求:**

```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi!" }
  ],
  "characterName": "Luna",
  "characterDescription": "a gentle moon"
}
```

**响应流 (SSE):**

```
{"type":"text_chunk","content":"Hello, I'm "}
{"type":"text_chunk","content":"Luna..."}
{"type":"image_url","content":"https://dalle-url"}
{"type":"done"}
```

### 前端状态管理

```javascript
currentPhase: "upload" | "story_display" | "chat";
storyTemplate: "带 [CHARACTER] 占位符的故事";
characterDescription: "AI 生成的角色描述";
characterName: "用户输入的名字";
generatedImageUrl: "初始故事插画";
chatImages: ["对话中生成的图片数组"];
```

---

## 💝 AI 对话规则 (System Prompt)

```
你是 [characterName]，一个 [characterDescription]。
你的性格温柔、善良、充满好奇心。
永远以积极、治愈的视角看待世界。

**绝对规则:**
1. 保持角色：永远用第一人称说话 ("I")
2. 治愈基调：即使用户说负面话语，也要温暖回应
3. 图片触发：描述美丽场景时添加 [DRAWING:详细提示词]
4. 简洁表达：像孩子一样说话，通常不超过3句话
```

---

## 🎯 关键特性总结

✅ **三阶段流程**

- Upload → Story Display → Chat

✅ **AI 占位符系统**

- 故事自动隐藏角色名
- 用户命名后动态替换

✅ **治愈式对话**

- 永远正面引导
- 温暖善良的回应

✅ **异步图片生成**

- 不阻塞对话流
- 自动插入到对话中

✅ **温暖治愈 UI**

- 柔和的渐变色彩
- 圆润的边角
- 轻柔的动画

---

## 🚀 运行应用

```bash
# 安装依赖
npm install

# 设置环境变量
# 在 .env 文件中添加:
NUXT_OPEN_AI_API_KEY=your-openai-api-key

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 开始创作！

---

**最后更新:** 2025 年 10 月 20 日  
**版本:** 2.0 - Story First with Placeholder System
