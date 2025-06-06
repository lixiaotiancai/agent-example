# 🧠 ReAct + Function Calling 智能待办事项

## 📚 教学案例09 | ReAct 模式升级版

> 基于08-function-calling进行迭代升级，引入**ReAct (Reasoning + Acting)**模式，实现复合任务指令的智能处理。

---

## 🎯 教学目标对比

| 对比点 | 08-function-calling | 09-react-function-calling |
|--------|-------------------|---------------------------|
| **Prompt 类型** | 单任务指令 | 复合任务指令 |
| **模型行为** | 返回单个 function_call | 返回多个 function_call |
| **执行模式** | 单轮执行 | 串行执行多个调用，含思考语句 |
| **结果展示** | 单函数结果 | 每步结果依次反馈给用户 |
| **用户体验** | 逐个操作 | 一句话完成多个操作 |

---

## 🧩 ReAct 核心特色

### 1. 推理链条 (Reasoning Chain)
AI会先**思考计划**，然后**逐步执行**：

```
用户输入: "请添加一个学习 JavaScript 的任务，然后显示当前所有任务。"

AI回应:
"好的，我来帮你完成这个请求。
首先，我会添加一个学习任务。"

[调用 addTodo 函数]

"任务添加成功！接下来，我来帮你列出所有任务。"

[调用 listTodos 函数]
```

### 2. 复合指令处理
支持一句话包含多个操作：
- ✅ "添加写日报和买咖啡两个任务，并展示全部列表"
- ✅ "完成第一个任务，然后清除所有已完成任务"
- ✅ "添加三个学习任务：Python、React、Node.js，最后显示列表"

### 3. 自然对话流程
每一步都有清晰的思考过程和执行反馈，用户能看到AI的"思维过程"。

---

## 🛠️ 技术实现要点

### 升级的系统提示词

```javascript
const systemPrompt = `
你是一个智能待办事项助手，具备规划和执行多个任务的能力。

你的核心能力：
1. **理解用户复合型指令**，例如："添加任务后显示列表"
2. **逐步思考（Reasoning）并执行操作（Acting）**
3. **使用 Function Calling 完成每一步**
4. **每次最多执行一个函数调用，按顺序完成多个操作**
5. **保持自然友好，逐步展示你的思考与执行**

## 重要指导原则：
1. **先说明思路，再执行函数**
2. **一次只调用一个函数**
3. **在函数执行后，根据结果决定下一步**
4. **对于复合指令，拆解成清晰的步骤序列**
5. **保持自然的对话风格**
`;
```

---

## 🚀 快速开始

### 1. 环境配置
```bash
cd examples/09-react-function-calling
npm install
```

### 2. 配置API密钥
```bash
cp env.example .env.local
# 编辑 .env.local 添加你的 DEEPSEEK_API_KEY
```

### 3. 启动应用
```bash
npm run dev
```

---

## 💡 推荐测试用例

### 基础复合指令
```
"请添加一个学习 JavaScript 的任务，然后显示当前所有任务。"
```

### 批量操作
```
"添加三个任务：买菜、做饭、洗碗，然后展示列表"
```

### 条件执行
```
"添加一个读书任务，完成它，然后清除所有已完成任务"
```

### 复杂场景
```
"请帮我添加两件事：写周报、开会准备，添加完后显示所有任务，如果超过5个任务就清除已完成的"
```

---

## 📊 与前版本的关键差异

### 用户体验提升
- **08版本**: 需要多次交互 → "添加任务" → "显示列表"
- **09版本**: 一次完成 → "添加任务后显示列表"

### AI行为变化
- **08版本**: 直接执行单个函数
- **09版本**: 先思考计划，再逐步执行多个函数

### 开发者收益
- **理解ReAct模式**: 推理与行动的结合
- **复合指令处理**: 处理复杂用户需求
- **多步骤协调**: Function Calling的高级应用

---

## 🎓 学习收获

通过本案例，你将掌握：

1. **ReAct模式设计**: 如何让AI进行推理链条
2. **复合指令处理**: 解析和执行多步骤任务
3. **Function Calling进阶**: 串行调用多个函数
4. **用户体验优化**: 从单步操作到智能批处理
5. **Prompt Engineering**: 设计引导AI逐步思考的提示词

---

## 🔗 相关资源

- [08-function-calling](../08-function-calling/README.md) - 前置教学案例
- [ReAct论文](https://arxiv.org/abs/2210.03629) - 理论基础
- [Function Calling最佳实践](./FUNCTION_CALLING_GUIDE.md) - 技术指南

---

**🎯 教学重点**: 从单任务执行到复合任务智能规划，体验AI助手的"思维升级"！
