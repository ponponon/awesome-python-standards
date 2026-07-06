# Awesome Python Standards

一个专注于 Python 现代开发规范的 Agent Skill，适用于各种 AI 编码助手。

## 核心内容

- **类型注解规范** - 强制使用 Python 3.10+ 现代语法，告别 `Optional`、`List`、`Dict`
- **Pydantic 数据验证** - 用 Pydantic 替代 dataclass，获得运行时验证能力
- **虚拟环境规范** - 使用 pipenv/venv/poetry 管理依赖，不要用全局 pip
- **FastAPI 最佳实践** - 每个接口都要写清楚 summary、description、tags
- **Loguru 日志** - 替代内置 logging，更易用、更强大

## 快速开始

### Claude Code

```bash
/plugin install awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git
```

### OpenCode

在 `opencode.json` 中添加：

```json
{
  "plugin": ["awesome-python-standards@git+https://github.com/ponponon/awesome-python-standards.git"]
}
```

### Codex CLI

```bash
/plugins
# 搜索 awesome-python-standards
```

### Cursor

```text
/add-plugin awesome-python-standards
```

## 使用场景

当你需要：

- 编写 Python 代码时自动添加类型注解
- 让 AI 生成现代 Python 语法（而非过时的 typing 语法）
- 使用 Pydantic 进行数据验证
- 编写规范的 FastAPI 接口
- 使用 loguru 记录日志

只需告诉你的 AI 助手："帮我按照 Python 开发规范写代码"。

## 核心原则

### 1. 使用现代类型注解

```python
# ✅ 正确 - Python 3.10+ 语法
def get_user(user_id: int) -> User | None:
    pass

# ❌ 错误 - 过时语法
from typing import Optional
def get_user(user_id: int) -> Optional[User]:
    pass
```

### 2. 用 Pydantic 替代 dataclass

```python
# ✅ 正确 - 有验证能力
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(..., description='用户名')
    age: int = Field(..., ge=0, description='年龄')

# ❌ 错误 - 没有验证能力
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int  # 可以传入负数
```

### 3. 使用虚拟环境

```bash
# ✅ 正确 - 用 pipenv 安装
pipenv install pydantic loguru

# ❌ 错误 - 用全局 pip 安装
pip install pydantic loguru

# ✅ 正确 - 用 pipenv run 运行
pipenv run python main.py

# ❌ 错误 - 直接运行
python main.py
```

### 4. FastAPI 接口要写清楚文档

```python
# ✅ 正确
@router.get('/', summary='获取用户列表', description='分页获取用户列表')
async def list_users(
    page: int = Query(1, description='页码'),
):
    pass

# ❌ 错误
@router.get('/')
async def list_users(page: int = 1):
    pass
```

### 5. 用 loguru 替代 print

```python
# ✅ 正确
from loguru import logger
logger.info('用户登录: {}', user_id)

# ❌ 错误
print(f'用户登录: {user_id}')
```

## Python 版本提醒

本规范基于 **Python 3.10+**。如果你的 Python 版本低于 3.10，请升级：

- Python 3.9 已于 2025 年 10 月停止支持
- Python 3.10+ 支持现代类型语法 `X | Y`

## 贡献

欢迎贡献！请提交 PR 或 Issue。

## 许可证

MIT License
