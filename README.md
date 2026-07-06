# Awesome Python Standards

一个通用的 Python 后端开发规范 Agent Skill，适用于各种 AI 编码助手。

## 概述

Awesome Python Standards 是一个 Agent Skill，为 AI 编码助手提供 Python 后端开发的最佳实践和规范。它包含：

- **类型注解规范** - Python 3.10+ 现代语法
- **Pydantic 数据建模** - V2 模式和验证器
- **FastAPI 开发模式** - 路由、响应、依赖注入
- **ORM 使用约定** - SQLModel、SQLAlchemy、Peewee
- **Redis 高级模式** - 限流器、布隆过滤器、多数据库分离
- **API 分页响应** - 通用分页模式和类型安全
- **项目组织结构** - 目录划分、配置管理
- **代码质量工具** - Ruff、mypy、pytest

## 快速开始

### Claude Code

```bash
# 从官方市场安装
/plugin install awesome-python-standards@claude-plugins-official

# 或者从 GitHub 安装
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
# 打开插件搜索界面
/plugins

# 搜索并安装
awesome-python-standards
```

### Cursor

在 Cursor Agent chat 中：

```text
/add-plugin awesome-python-standards
```

### Gemini CLI

```bash
gemini extensions install https://github.com/ponponon/awesome-python-standards
```

### 其他平台

| 平台 | 安装方式 |
|------|----------|
| GitHub Copilot CLI | `copilot plugin install awesome-python-standards@superpowers-marketplace` |
| Factory Droid | `droid plugin install awesome-python-standards@awesome-python-standards` |
| Roo Code | 在插件市场搜索 "awesome-python-standards" |
| TRAE | 参考平台文档安装 |

## 使用场景

当你需要：

- 编写 Python 后端服务代码
- 使用 FastAPI 构建 API
- 使用 Pydantic 进行数据验证
- 设计数据库模型和 ORM 映射
- 团队统一代码风格
- 新开发者入职培训

只需告诉你的 AI 助手："帮我按照 Python 后端开发规范写代码"，它会自动加载这个 skill。

## 包含内容

### 类型注解规范

```python
# ✅ 正确 - 使用现代语法
def process(items: list[str]) -> dict[str, str]:
    pass

def get_user(user_id: int) -> User | None:
    pass

# ❌ 错误 - 避免使用旧语法
from typing import List, Dict, Optional

def process(items: List[str]) -> Dict[str, str]:
    pass
```

### Pydantic 数据建模

```python
from pydantic import BaseModel, Field, ConfigDict

class UserResponse(BaseModel):
    id: int | None = None
    username: str = Field(description='用户名')
    email: str | None = Field(None, description='邮箱')
    role: Literal['admin', 'user', 'guest'] = Field('user')
    
    model_config = ConfigDict(use_enum_values=True)
```

### FastAPI 开发模式

```python
from fastapi import APIRouter, Query

router = APIRouter(prefix='/api/v1/users')

@router.get('/', summary='获取用户列表')
def get_users(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100)
) -> list[UserResponse]:
    pass
```

### 项目组织结构

```
my_project/
├── apps/          # API 路由
├── core/          # 基础设施层
├── models/        # 数据模型
├── services/      # 业务逻辑
├── repositories/  # 数据访问
├── utils/         # 工具函数
└── config/        # 配置文件
```

## 支持的平台

| 平台 | 状态 |
|------|------|
| Claude Code | ✅ |
| OpenCode | ✅ |
| Codex CLI | ✅ |
| Codex App | ✅ |
| Cursor | ✅ |
| Gemini CLI | ✅ |
| GitHub Copilot CLI | ✅ |
| Factory Droid | ✅ |
| Roo Code | ✅ |
| TRAE | ✅ |
| Windsurf | ✅ |
| Kiro | ✅ |

## 本地开发

### 克隆仓库

```bash
git clone https://github.com/ponponon/awesome-python-standards.git
cd awesome-python-standards
```

### 目录结构

```
awesome-python-standards/
├── skills/
│   └── awesome-python-standards/
│       └── SKILL.md          # 核心 skill 内容
├── .claude-plugin/           # Claude Code 配置
├── .codex-plugin/            # Codex 配置
├── .cursor-plugin/           # Cursor 配置
├── .opencode/                # OpenCode 配置
├── cli/                      # npm CLI 工具
├── README.md                 # 本文件
├── LICENSE                   # MIT 许可证
└── package.json              # npm 包配置
```

### 本地安装

```bash
# Claude Code
/plugin install /path/to/awesome-python-standards

# OpenCode
# 在 opencode.json 中添加本地路径
{
  "plugin": ["/path/to/awesome-python-standards"]
}
```

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 贡献内容

- 添加新的 Python 最佳实践
- 改进现有规范
- 添加更多平台支持
- 修复文档错误
- 翻译成其他语言

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 相关链接

- [Agent Skills 规范](https://agentskills.io)
- [GitHub 仓库](https://github.com/ponponon/awesome-python-standards)
- [问题反馈](https://github.com/ponponon/awesome-python-standards/issues)

## 致谢

- [Anthropic](https://www.anthropic.com/) - Agent Skills 规范的发起者
- [Superpowers](https://github.com/obra/superpowers) - 参考项目结构
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) - 参考 npm 分发方式
