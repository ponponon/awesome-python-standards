<div align="center">

# Awesome Python Standards 🐍

**A modern Python high-standard development specification Agent Skill tailored for AI coding assistants**

[![NPM Version](https://img.shields.io/npm/v/awesome-python-standards-cli?color=3B82F6&style=flat-square)](https://www.npmjs.com/package/awesome-python-standards-cli)
[![GitHub License](https://img.shields.io/github/license/ponponon/awesome-python-standards?color=10B981&style=flat-square)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-ffd43b?style=flat-square&logo=python)](https://www.python.org)
[![Awesome Skills](https://img.shields.io/badge/agent--skills-compatible-6366f1?style=flat-square)](https://agentskills.io)

<p align="center">
  Give AI assistants (Claude Code, OpenCode, Cursor, Codex) instant intuition for writing 2026 modern Python at expert level.
  <br />
  <strong>Say goodbye to outdated type syntax, embrace safe, elegant, and robust production-grade code!</strong>
</p>

---

[Core Content](#-core-content) • [Quick Start](#-quick-start) • [Core Principles Comparison](#-core-principles-comparison) • [Multi-platform Configuration](#-multi-platform-configuration) • [Version Notice](#-python-version-notice)

</div>

---

## 💡 Core Content

* 🏷️ **Modern Type Annotations (Typing Hints)** — Enforce Python 3.10+ native syntax, completely eliminating outdated `Optional`, `List`, `Dict` imports.
* 🛡️ **Pydantic Data Validation** — Guide AI to use Pydantic instead of validation-incapable `dataclass` and native `dict`, guarding the defense line of dynamic languages.
* 📦 **Standardized Virtual Environment** — Standardize dependency installation process, never use global `pip`, prioritize virtual environment sandboxing with `pipenv`, `poetry`, etc.
* 📝 **FastAPI Production-level Documentation** — Constrain AI to write `summary`, `description`, parameter descriptions, and `APIRouter` `tags` grouping for every endpoint.
* 🪵 **Loguru Modern Logging** — Replace complex built-in `logging` configuration and crude `print` with out-of-the-box, automatic exception formatting `loguru`.

---

## 🚀 Quick Start

You can instantly obtain rapid configuration and integration for various AI assistants through our official NPM scaffold:

```bash
# Run initialization scaffold with your network proxy
npx awesome-python-standards-cli init
```

*(The scaffold will guide you to select your current AI coding assistant and provide platform-specific second-level configuration and instruction guidance)*

---

## ⚖️ Core Principles Comparison

After loading this Skill, AI will exhibit completely different code taste:

### 1. Modern Type Annotations

* ❌ **Outdated Syntax (Deprecated)**
  ```python
  from typing import List, Optional
  
  def get_users(limit: int) -> Optional[List[User]]:
      pass
  ```
* ✅ **Modern Syntax (Recommended)**
  ```python
  def get_users(limit: int) -> list[User] | None:
      pass
  ```

### 2. Pydantic Runtime Data Validation

* ❌ **No Validation Syntax (High Risk)**
  ```python
  from dataclasses import dataclass
  
  @dataclass
  class User:
      name: str
      age: int  # Passing age=-500 cannot be intercepted, leaving hidden dangers
  ```
* ✅ **Pydantic Validation Syntax (Safe)**
  ```python
  from pydantic import BaseModel, Field
  
  class User(BaseModel):
      name: str = Field(..., description="Username, required")
      age: int = Field(..., ge=0, le=150, description="Age, must be between 0 and 150")
  ```

### 3. Dependency and Virtual Environment Isolation

* ❌ **Global Installation (High Pollution)**
  ```bash
  pip install fastapi pydantic loguru
  python main.py
  ```
* ✅ **Virtual Environment Isolation (High Isolation)**
  ```bash
  pipenv install fastapi pydantic loguru
  pipenv run python main.py
  ```

### 4. FastAPI Specification Self-documentation

* ❌ **Bare Endpoint Definition (Non-standard)**
  ```python
  @router.get('/users')
  async def get_user_list(page: int = 1):
      pass
  ```
* ✅ **Standardized Endpoint Definition (High Readability)**
  ```python
  @router.get(
      '/users',
      summary="Get user list",
      description="Query system users with pagination. Supports conditional filtering by activation status.",
      response_model=list[UserResponse]
  )
  async def get_user_list(
      page: int = Query(1, ge=1, description="Page number, starting from 1"),
  ):
      pass
  ```

### 5. Modern Structured Logging

* ❌ **Crude Debugging (Hard to Trace)**
  ```python
  print(f"User login failed: {user_id}")
  ```
* ✅ **Loguru Structured Logging (Colored, with Stack Trace)**
  ```python
  from loguru import logger
  
  logger.warning("User login failed: user_id={}", user_id)
  ```

---

## 🛠️ Multi-platform Configuration

You can seamlessly integrate and load this specification directly in your AI tools:

### 🤖 Claude Code
Execute the installation command in your project root directory:
```bash
/plugin install awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git
```

### 💻 OpenCode
Configure the plugin source in your project's `opencode.json`:
```json
{
  "plugin": ["awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git"]
}
```

### 🧭 Cursor / Trae / Windsurf / CodeBuddy
Directly tell your assistant in the AI chat box:
> `/add-plugin awesome-python-standards`
> 
> Or:
> *"Please load the Awesome Python Standards specification and help me write code according to modern Python high-standard development specifications."*

---

## ⚠️ Python Version Notice

This specification is entirely built on the modern standards of **Python 3.10+**. If you or your project is still running older versions, please note:

* 🚫 **Python 3.9** officially ceased all security and version maintenance in **October 2025**.
* 🚫 **Python 3.10** will also cease support in **October 2026**.
* 💡 It is strongly recommended to upgrade the underlying CPython to **3.11 or 3.12**, which not only enables seamless use of modern type systems like `X | Y`, `list[T]`, but also provides **20%~60% runtime performance improvement**.

---

## 🤝 Contributing

We warmly welcome suggestions and improvements from the community:
- If you discover new modern Python usage, specifications, or anti-patterns, please submit an [Issue](https://github.com/ponponon/awesome-python-standards/issues) for discussion.
- Welcome to submit [Pull Requests](https://github.com/ponponon/awesome-python-standards/pulls) to improve best practices!

## 📄 License

Open-sourced under the [MIT License](LICENSE).