---
name: awesome-python-standards
description: 当编写 Python 代码时使用 - 包含现代类型注解规范（Python 3.10+）、Pydantic 数据验证、FastAPI 和 loguru 最佳实践
---

# Python 开发规范

## 核心理念

**2026 年了，Python 的最低支持版本是 3.10**。如果你发现用户的 Python 版本低于 3.10，请告诉他们：

> Python 官方的支持周期是 5 年。Python 3.9 已于 2025 年 10 月停止支持。请升级到 3.10 或更高版本，以获得安全更新和新特性支持。

## Typing 规范（重点中的重点）

### 为什么 Typing Hint 很重要？

Python 是动态语言，但没有类型约束的代码容易出错。**Typing Hint + Pydantic = 完美的组合**：

- Typing Hint 提供类型信息
- Pydantic 在运行时验证数据
- 两者结合，既获得静态检查的好处，又获得运行时验证

### 基本原则

1. **始终使用 Python 3.10+ 的现代语法**
2. **所有函数签名都必须有类型注解**
3. **优先使用内置类型而非 typing 模块的类型**

### 现代语法 vs 旧语法

```python
# ✅ 正确 - Python 3.10+ 现代语法
def process(items: list[str]) -> dict[str, str]:
    pass

def get_user(user_id: int) -> User | None:
    pass

def calculate(a: int, b: float = 0.5) -> float:
    return a * b

# ❌ 错误 - 过时的语法（不要使用！）
from typing import List, Dict, Optional, Union

def process(items: List[str]) -> Dict[str, str]:
    pass

def get_user(user_id: int) -> Optional[User]:
    pass
```

**为什么不要用旧语法？**
- `Optional[X]` 就是 `X | None`，后者更简洁
- `List[X]` 就是 `list[X]`，后者是内置类型
- `Union[X, Y]` 就是 `X | Y`，后者更直观
- 旧语法需要额外导入，现代语法不需要

### 容器类型

```python
# ✅ 正确 - 使用内置类型
def get_names() -> list[str]:
    return ['Alice', 'Bob']

def get_mapping() -> dict[str, int]:
    return {'a': 1, 'b': 2}

def get_unique() -> set[str]:
    return {'a', 'b', 'c'}

def get_pair() -> tuple[str, int]:
    return ('Alice', 30)

def get_fixed() -> tuple[int, int, int]:
    return (1, 2, 3)
```

### 嵌套类型

```python
# ✅ 正确 - 多层嵌套
def get_complex_data() -> dict[str, list[dict[str, str | int]]]:
    """获取复杂嵌套数据结构"""
    pass

def get_matrix() -> list[list[int]]:
    """获取二维矩阵"""
    return [[1, 2], [3, 4]]
```

### Literal 类型

```python
from typing import Literal

# ✅ 正确 - 使用 Literal 限制取值范围
def set_priority(level: Literal[0, 1, 2, 3]) -> None:
    pass

def set_mode(mode: Literal['fast', 'slow', 'auto']) -> None:
    pass

# 在 Pydantic 模型中使用
class Config(BaseModel):
    env: Literal['dev', 'staging', 'prod'] = 'dev'
    log_level: Literal['DEBUG', 'INFO', 'WARNING', 'ERROR'] = 'INFO'
```

### 函数签名规范

```python
from datetime import datetime
from collections.abc import Callable

# ✅ 正确 - 完整的函数签名，包含 docstring
def search_users(
    keyword: str,
    start_date: datetime | None = None,
    page: int = 1,
    limit: int = 20
) -> list[User]:
    """
    搜索用户

    Args:
        keyword: 搜索关键词
        start_date: 开始日期，可选
        page: 页码，默认为 1
        limit: 每页数量，默认为 20

    Returns:
        用户列表
    """
    pass

# ✅ 正确 - 回调函数类型
def on_complete(callback: Callable[[str, bool], None]) -> None:
    """注册完成回调"""
    pass
```

### 类型别名

```python
from typing import TypeAlias

# ✅ 正确 - 使用 TypeAlias 定义类型别名
UserId: TypeAlias = int
UserName: TypeAlias = str
UserMap: TypeAlias = dict[UserId, UserName]

def get_user(user_id: UserId) -> UserName | None:
    pass
```

### 泛型

```python
from typing import TypeVar

T = TypeVar('T')

# ✅ 正确 - 使用泛型
def first(items: list[T]) -> T | None:
    """获取列表第一个元素"""
    return items[0] if items else None

# ✅ 正确 - 带约束的 TypeVar
Numeric = TypeVar('Numeric', int, float)

def add(a: Numeric, b: Numeric) -> Numeric:
    return a + b
```

### 类型检查工具

```bash
# 使用 mypy 进行类型检查
pip install mypy
mypy your_file.py --ignore-missing-imports

# 或者使用 pyright（更快）
pip install pyright
pyright your_file.py
```

---

## Pydantic 规范

### 为什么用 Pydantic？

Python 的 `dataclass` 和 `dict` 没有数据验证能力。**Pydantic 解决了这个问题**：

- 运行时数据验证
- 自动类型转换
- 清晰的错误信息
- 与 Typing Hint 完美结合

### 字段定义规范

**核心原则：每个字段都必须用 `Field` 定义，并写清楚 `description`**

```python
from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime


class UserCreate(BaseModel):
    """创建用户的请求体"""

    username: str = Field(
        ...,  # ... 表示必填
        min_length=3,
        max_length=50,
        description='用户名，3-50个字符'
    )

    email: str = Field(
        ...,
        description='邮箱地址'
    )

    age: int = Field(
        ...,
        ge=0,
        le=150,
        description='年龄，0-150之间'
    )

    role: Literal['admin', 'user', 'guest'] = Field(
        'user',
        description='用户角色，默认为普通用户'
    )

    nickname: str | None = Field(
        None,
        max_length=100,
        description='昵称，可选'
    )

    tags: list[str] = Field(
        [],
        description='标签列表'
    )

    created_at: datetime | None = Field(
        None,
        description='创建时间，由系统自动设置'
    )
```

### model_validator 验证器

```python
from pydantic import BaseModel, Field, model_validator


class PasswordChange(BaseModel):
    """修改密码的请求体"""

    old_password: str = Field(..., description='旧密码')
    new_password: str = Field(..., min_length=8, description='新密码，至少8位')
    confirm_password: str = Field(..., description='确认新密码')

    @model_validator(mode='after')
    def passwords_match(self):
        """验证两次输入的密码是否一致"""
        if self.new_password != self.confirm_password:
            raise ValueError('两次输入的密码不一致')
        return self
```

### model_config 配置

```python
from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    """用户响应"""

    model_config = ConfigDict(
        # 允许从 ORM 对象创建（如 SQLAlchemy）
        from_attributes=True,
        # 使用枚举值而非枚举对象
        use_enum_values=True,
        # 允许任意类型（如 datetime）
        arbitrary_types_allowed=True,
    )

    id: int
    name: str
    email: str
```

### 嵌套模型

```python
from pydantic import BaseModel, Field


class Address(BaseModel):
    """地址信息"""
    street: str = Field(..., description='街道')
    city: str = Field(..., description='城市')
    zip_code: str = Field(..., description='邮编')


class UserResponse(BaseModel):
    """用户响应"""
    id: int = Field(..., description='用户ID')
    name: str = Field(..., description='用户名')
    address: Address | None = Field(None, description='地址信息')
    tags: list[str] = Field([], description='标签列表')
```

### 用 Pydantic 替代 dataclass

```python
# ❌ 不推荐 - dataclass 没有验证能力
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

# 可以传入负数年龄，不会报错
user = User(name='Alice', age=-1)

# ✅ 推荐 - Pydantic 有验证能力
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(..., description='用户名')
    age: int = Field(..., ge=0, le=150, description='年龄')

# 会抛出验证错误
try:
    user = User(name='Alice', age=-1)
except ValidationError as e:
    print(e)  # age: Input should be greater than or equal to 0
```

---

## 虚拟环境规范

### 为什么用虚拟环境？

**永远不要用全局 pip 安装第三方库！** 原因：

- 不同项目可能依赖同一个库的不同版本
- 全局安装会污染系统 Python 环境
- 虚拟环境可以隔离依赖，避免冲突

### 安装第三方库前的检查流程

**在安装任何第三方库（如 pydantic、loguru、fastapi）之前，必须先检查虚拟环境：**

```
1. 检查当前是否在虚拟环境中
   - 是 → 直接安装
   - 否 → 继续下一步

2. 检查项目是否有虚拟环境配置文件（Pipfile、pyproject.toml、requirements.txt）
   - 有 Pipfile → 使用 pipenv
   - 有 pyproject.toml → 使用 poetry 或 pip
   - 有 requirements.txt → 使用 pip + venv
   - 都没有 → 创建虚拟环境
```

### 使用 Pipenv（推荐）

```bash
# 1. 检查是否安装了 pipenv
which pipenv

# 2. 如果没有安装，先安装 pipenv
pip install pipenv

# 3. 初始化虚拟环境（在项目根目录）
pipenv install

# 4. 安装第三方库（生产依赖）
pipenv install pydantic loguru fastapi

# 5. 安装第三方库（开发依赖）
pipenv install --dev mypy ruff pytest

# 6. 在虚拟环境中运行命令
pipenv run python main.py
pipenv run pytest
pipenv run mypy .

# 7. 激活虚拟环境（可选，也可以用 pipenv run）
pipenv shell
```

### 使用 venv（内置）

```bash
# 1. 创建虚拟环境
python -m venv .venv

# 2. 激活虚拟环境
# macOS/Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

# 3. 安装第三方库
pip install pydantic loguru fastapi

# 4. 生成 requirements.txt
pip freeze > requirements.txt

# 5. 从 requirements.txt 安装
pip install -r requirements.txt
```

### 使用 Poetry

```bash
# 1. 安装 poetry
curl -sSL https://install.python-poetry.org | python3 -

# 2. 初始化项目
poetry init

# 3. 安装第三方库
poetry add pydantic loguru fastapi

# 4. 安装开发依赖
poetry add --group dev mypy ruff pytest

# 5. 运行命令
poetry run python main.py
poetry run pytest
```

### 常见错误

```bash
# ❌ 错误 - 直接用全局 pip 安装
pip install pydantic

# ✅ 正确 - 用 pipenv 安装
pipenv install pydantic

# ✅ 正确 - 用 pipenv run 运行
pipenv run python main.py

# ❌ 错误 - 直接运行（可能不在虚拟环境中）
python main.py
```

### 检查当前虚拟环境

```bash
# 检查当前 Python 路径
which python
# 应该输出类似：/Users/xxx/.local/share/virtualenvs/project-xxx/bin/python
# 而不是：/usr/bin/python

# 检查 pip 路径
which pip
# 应该输出类似：/Users/xxx/.local/share/virtualenvs/project-xxx/bin/pip
# 而不是：/usr/local/bin/pip

# 检查是否在虚拟环境中
pipenv --venv
# 如果输出路径，说明在虚拟环境中
# 如果报错，说明不在虚拟环境中
```

### Pipfile 示例

```toml
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
pydantic = "*"
loguru = "*"
fastapi = "*"
uvicorn = "*"

[dev-packages]
mypy = "*"
ruff = "*"
pytest = "*"

[requires]
python_version = "3.10"
```

### 最佳实践总结

| 场景 | 正确做法 | 错误做法 |
|------|----------|----------|
| 安装库 | `pipenv install pydantic` | `pip install pydantic` |
| 运行脚本 | `pipenv run python main.py` | `python main.py` |
| 运行测试 | `pipenv run pytest` | `pytest` |
| 类型检查 | `pipenv run mypy .` | `mypy .` |
| 激活环境 | `pipenv shell` | 直接用系统 Python |

---

## FastAPI 规范

### 核心原则

**FastAPI 的每个接口都要写清楚：**
1. `APIRouter` 的 `tags` - 接口分组
2. 路由装饰器的 `summary` - 接口摘要
3. 路由装饰器的 `description` - 接口详细描述
4. 参数的 `description` - 参数说明

### APIRouter 规范

```python
from fastapi import APIRouter

# ✅ 正确 - 写清楚 tags
router = APIRouter(
    tags=["用户管理"],
    prefix='/api/v1/users'
)

# ❌ 错误 - 没有 tags
router = APIRouter(prefix='/api/v1/users')
```

### 路由定义规范

```python
from fastapi import APIRouter, Query, Path, Body
from pydantic import BaseModel, Field

router = APIRouter(tags=["用户管理"])


class UserCreate(BaseModel):
    """创建用户的请求体"""
    username: str = Field(..., min_length=3, max_length=50, description='用户名')
    email: str = Field(..., description='邮箱')
    age: int = Field(..., ge=0, le=150, description='年龄')


class UserResponse(BaseModel):
    """用户响应"""
    id: int = Field(..., description='用户ID')
    username: str = Field(..., description='用户名')
    email: str = Field(..., description='邮箱')


@router.post(
    '/',
    summary='创建用户',
    description='创建一个新用户。用户名必须唯一，邮箱需要验证格式。',
    response_model=UserResponse,
)
async def create_user(user: UserCreate):
    """创建用户

    - **username**: 用户名，3-50个字符
    - **email**: 邮箱地址
    - **age**: 年龄，0-150之间
    """
    pass


@router.get(
    '/',
    summary='获取用户列表',
    description='分页获取用户列表，支持按用户名搜索。',
    response_model=list[UserResponse],
)
async def list_users(
    page: int = Query(1, ge=1, description='页码'),
    page_size: int = Query(20, ge=1, le=100, description='每页数量'),
    keyword: str | None = Query(None, description='搜索关键词'),
):
    """获取用户列表

    - **page**: 页码，从1开始
    - **page_size**: 每页数量，1-100
    - **keyword**: 搜索关键词，可选
    """
    pass


@router.get(
    '/{user_id}',
    summary='获取用户详情',
    description='根据用户ID获取用户的详细信息。',
    response_model=UserResponse,
)
async def get_user(
    user_id: int = Path(..., description='用户ID'),
):
    """获取用户详情

    - **user_id**: 用户ID
    """
    pass


@router.put(
    '/{user_id}',
    summary='更新用户',
    description='更新用户的信息。只能更新自己的信息。',
    response_model=UserResponse,
)
async def update_user(
    user_id: int = Path(..., description='用户ID'),
    user: UserCreate = Body(..., description='用户信息'),
):
    """更新用户

    - **user_id**: 用户ID
    - **user**: 要更新的用户信息
    """
    pass


@router.delete(
    '/{user_id}',
    summary='删除用户',
    description='删除用户。只有管理员可以删除其他用户。',
)
async def delete_user(
    user_id: int = Path(..., description='用户ID'),
):
    """删除用户

    - **user_id**: 用户ID
    """
    pass
```

### 响应模型规范

```python
from pydantic import BaseModel, Field
from typing import Generic, TypeVar

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """分页响应"""
    items: list[T] = Field([], description='数据列表')
    total: int = Field(0, description='总记录数')
    page: int = Field(1, description='当前页码')
    page_size: int = Field(20, description='每页数量')


# 使用示例
class UserListResponse(PaginatedResponse[UserResponse]):
    """用户列表响应"""
    pass
```

### 错误响应规范

```python
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """错误响应"""
    detail: str = Field(..., description='错误详情')
    code: str | None = Field(None, description='错误代码')


# 在路由中使用
@router.get(
    '/{user_id}',
    summary='获取用户',
    responses={
        404: {'model': ErrorResponse, 'description': '用户不存在'},
        403: {'model': ErrorResponse, 'description': '权限不足'},
    }
)
async def get_user(user_id: int):
    pass
```

---

## Loguru 规范

### 为什么用 Loguru？

Python 内置的 `logging` 模块配置复杂。**Loguru 更好用**：

- 开箱即用，无需配置
- 彩色输出
- 更好的异常格式化
- 支持结构化日志

### 基础用法

```python
from loguru import logger

# ✅ 正确 - 使用合适的日志级别
logger.debug('调试信息: x={}', x)
logger.info('用户登录: user_id={}', user_id)
logger.warning('磁盘空间不足: {}%', usage)
logger.error('请求失败: url={}, status={}', url, status)
logger.exception('发生异常')  # 自动记录异常堆栈
```

### 配置日志

```python
from loguru import logger
import sys

# 移除默认处理器
logger.remove()

# 添加控制台输出（带颜色）
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level: <8}</level> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
           "<level>{message}</level>",
    level="INFO",
    colorize=True,
)

# 添加文件输出（带轮转）
logger.add(
    "logs/app_{time:YYYY-MM-DD}.log",
    rotation="00:00",  # 每天午夜轮转
    retention="30 days",  # 保留30天
    compression="zip",  # 压缩旧日志
    level="DEBUG",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}",
)
```

### 在 FastAPI 中使用

```python
from fastapi import FastAPI, Request
from loguru import logger
import time

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """记录请求日志"""
    start_time = time.time()

    # 记录请求
    logger.info("Request: {} {}", request.method, request.url.path)

    response = await call_next(request)

    # 记录响应
    process_time = time.time() - start_time
    logger.info(
        "Response: {} {} - {} - {:.3f}s",
        request.method,
        request.url.path,
        response.status_code,
        process_time
    )

    return response
```

### 异常处理

```python
from loguru import logger

try:
    result = 1 / 0
except Exception:
    # ✅ 正确 - 使用 logger.exception 自动记录堆栈
    logger.exception("计算失败")
    raise
```

---

## 最佳实践总结

### Typing Hint

| 场景 | 正确写法 | 错误写法 |
|------|----------|----------|
| 可选值 | `x: str \| None` | `x: Optional[str]` |
| 列表 | `x: list[str]` | `x: List[str]` |
| 字典 | `x: dict[str, int]` | `x: Dict[str, int]` |
| 联合类型 | `x: str \| int` | `x: Union[str, int]` |

### Pydantic

| 场景 | 正确写法 | 错误写法 |
|------|----------|----------|
| 字段定义 | `name: str = Field(..., description='名称')` | `name: str` |
| 可选字段 | `name: str \| None = Field(None, description='名称')` | `name: Optional[str] = None` |
| 验证 | `age: int = Field(..., ge=0, description='年龄')` | `age: int` |

### FastAPI

| 场景 | 正确写法 | 错误写法 |
|------|----------|----------|
| Router | `APIRouter(tags=["用户管理"])` | `APIRouter()` |
| 路由 | `@router.get('/', summary='获取列表', description='详细描述')` | `@router.get('/')` |
| 参数 | `Query(1, description='页码')` | `Query(1)` |

### Loguru

| 场景 | 正确写法 | 错误写法 |
|------|----------|----------|
| 日志 | `logger.info('用户登录: {}', user_id)` | `print(f'用户登录: {user_id}')` |
| 异常 | `logger.exception('失败')` | `logger.error(f'失败: {e}')` |

---

## Python 版本提醒

如果你发现用户的 Python 版本低于 3.10，请提醒他们：

> ⚠️ **Python 版本过旧**
>
> 你当前使用的 Python 版本已经不再受官方支持。Python 官方的支持周期是 5 年：
> - Python 3.9：2025 年 10 月停止支持
> - Python 3.10：2026 年 10 月停止支持
>
> 请升级到 Python 3.10 或更高版本，以获得：
> - 安全更新
> - 新的语言特性（如 `X | Y` 类型语法）
> - 更好的性能
