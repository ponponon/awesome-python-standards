<div align="center">

# Awesome Python Standards 🐍

**一个专为 AI 编码助手定制的现代 Python 高标准开发规范 Agent Skill**

[![NPM Version](https://img.shields.io/npm/v/awesome-python-standards-cli?color=3B82F6&style=flat-衰减)](https://www.npmjs.com/package/awesome-python-standards-cli)
[![GitHub License](https://img.shields.io/github/license/ponponon/awesome-python-standards?color=10B981&style=flat-衰减)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-ffd43b?style=flat-衰减&logo=python)](https://www.python.org)
[![Awesome Skills](https://img.shields.io/badge/agent--skills-compatible-6366f1?style=flat-衰减)](https://agentskills.io)

<p align="center">
  让 AI 助理（Claude Code, OpenCode, Cursor, Codex）瞬间拥有 2026 年现代 Python 顶级专家的编写直觉。
  <br />
  <strong>告别过时的类型语法，拥抱安全、优雅、健壮的生产级代码！</strong>
</p>

---

[核心内容](#-核心内容) • [快速开始](#-快速开始) • [核心原则对比](#-核心原则对比) • [多平台配置](#-多平台配置) • [版本声明](#-python-版本提醒)

</div>

---

## 💡 核心内容

* 🏷️ **现代类型注解 (Typing Hints)** — 强制使用 Python 3.10+ 原生语法，彻底告别过时的 `Optional`、`List`、`Dict` 导入。
* 🛡️ **Pydantic 数据验证** — 引导 AI 用 Pydantic 替代没有验证能力的 `dataclass` 和原生 `dict`，守住动态语言的防线。
* 📦 **规范虚拟环境** — 规范依赖安装流程，坚决不使用全局 `pip`，优先使用 `pipenv`、`poetry` 等虚拟环境进行沙盒隔离。
* 📝 **FastAPI 生产级文档** — 约束 AI 生成的每个接口都必须写明 `summary`、`description`、参数描述及 `APIRouter` 的 `tags` 分组。
* 🪵 **Loguru 现代日志** — 淘汰配置复杂的内置 `logging` 和简陋的 `print`，使用开箱即用、异常自动格式化的 `loguru`。

---

## 🚀 快速开始

可以通过我们发布的官方 NPM 脚手架一键获取针对各个 AI 助手的极速配置与集成：

```bash
# 挂载你的网络代理运行初始化脚手架
npx awesome-python-standards-cli init
```

*（该脚手架将引导你选择当前使用的 AI 编码助手，并提供针对该平台的秒级配置和指令引导）*

---

## ⚖️ 核心原则对比

在加载此 Skill 后，AI 将展现出截然不同的代码品味：

### 1. 现代类型注解

* ❌ **过时写法 (废弃)**
  ```python
  from typing import List, Optional
  
  def get_users(limit: int) -> Optional[List[User]]:
      pass
  ```
* ✅ **现代写法 (推荐)**
  ```python
  def get_users(limit: int) -> list[User] | None:
      pass
  ```

### 2. Pydantic 运行时数据校验

* ❌ **无验证写法 (高危)**
  ```python
  from dataclasses import dataclass
  
  @dataclass
  class User:
      name: str
      age: int  # 传入 age=-500 无法被拦截，埋下隐患
  ```
* ✅ **Pydantic 验证写法 (安全)**
  ```python
  from pydantic import BaseModel, Field
  
  class User(BaseModel):
      name: str = Field(..., description="用户名，必填")
      age: int = Field(..., ge=0, le=150, description="年龄，必须在 0 到 150 之间")
  ```

### 3. 依赖及虚拟环境隔离

* ❌ **全局安装 (高污染)**
  ```bash
  pip install fastapi pydantic loguru
  python main.py
  ```
* ✅ **虚拟环境隔离 (高隔离)**
  ```bash
  pipenv install fastapi pydantic loguru
  pipenv run python main.py
  ```

### 4. FastAPI 规范自文档化

* ❌ **裸接口定义 (不规范)**
  ```python
  @router.get('/users')
  async def get_user_list(page: int = 1):
      pass
  ```
* ✅ **规范化接口定义 (高可读)**
  ```python
  @router.get(
      '/users',
      summary="获取用户列表",
      description="分页查询系统用户。支持根据激活状态进行条件过滤。",
      response_model=list[UserResponse]
  )
  async def get_user_list(
      page: int = Query(1, ge=1, description="页码，从 1 开始"),
  ):
      pass
  ```

### 5. 现代结构化日志

* ❌ **简陋调试 (难反查)**
  ```python
  print(f"User login failed: {user_id}")
  ```
* ✅ **Loguru 结构化日志 (彩色、带堆栈)**
  ```python
  from loguru import logger
  
  logger.warning("User login failed: user_id={}", user_id)
  ```

---

## 🛠️ 多平台配置

你可以直接在你的 AI 工具中无缝集成并加载此规范：

### 🤖 Claude Code
在你的项目根目录下执行安装命令：
```bash
/plugin install awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git
```

### 💻 OpenCode
在项目的 `opencode.json` 中配置插件源：
```json
{
  "plugin": ["awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git"]
}
```

### 🧭 Cursor / Trae / Windsurf / CodeBuddy
直接在 AI 聊天框中告诉你的助理：
> `/add-plugin awesome-python-standards`
> 
> 或者：
> *"请加载 Awesome Python Standards 规范，帮我按照现代 Python 高标准开发规范写代码。"*

---

## ⚠️ Python 版本提醒

本规范完全建立在 **Python 3.10+** 的现代标准之上。如果你或你的项目仍在运行旧版本，请注意：

* 🚫 **Python 3.9** 官方已于 **2025 年 10 月** 停止全部安全和版本维护。
* 🚫 **Python 3.10** 官方亦将于 **2026 年 10 月** 停止支持。
* 💡 强烈建议将底层 CPython 升级至 **3.11 或 3.12**，不仅能无缝使用 `X | Y`、`list[T]` 等现代类型体系，还将获得 **20%~60% 的运行时性能提升**。

---

## 🤝 参与贡献

我们非常欢迎来自社区的提议和改进：
- 如果你发现了新的现代 Python 用法、规范或反模式，请提交 [Issue](https://github.com/ponponon/awesome-python-standards/issues) 进行讨论。
- 欢迎提交 [Pull Request](https://github.com/ponponon/awesome-python-standards/pulls) 完善最佳实践！

## 📄 许可证

基于 [MIT License](LICENSE) 许可协议开源。
