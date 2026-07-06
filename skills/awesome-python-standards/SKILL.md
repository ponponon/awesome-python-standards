---
name: awesome-python-standards
description: 当编写 Python 代码时使用 - 包含类型注解规范、Pydantic 数据建模、FastAPI 开发模式、ORM 使用约定和项目组织最佳实践
---

# Python 后端开发规范

## 概述

本文档记录了 Python 后端项目的编码标准、模式和最佳实践，涵盖类型注解规范、Pydantic 数据建模、FastAPI 开发模式、ORM 使用约定和项目组织结构。

## 使用场景

- 编写 Python 后端服务代码时
- 使用 FastAPI 构建 API 时
- 使用 Pydantic 进行数据验证和序列化时
- 设计数据库模型和 ORM 映射时
- 团队统一代码风格和规范时
- 新开发者入职 Python 后端项目时

## 项目结构

```
my_project/
├── apps/                    # API 路由，按版本组织
│   ├── v1/                 # V1 版本 API
│   └── v2/                 # V2 版本 API（最新，使用异步）
├── core/                    # 核心功能模块
│   ├── database/           # 数据库层（MySQL/PostgreSQL）
│   ├── cache/              # 缓存层（Redis）
│   ├── queue/              # 消息队列（RabbitMQ/Kafka）
│   └── storage/            # 对象存储（S3/OSS/GCS）
├── models/                  # 数据模型定义
│   ├── schemas/            # Pydantic schemas
│   ├── dto/                # 数据传输对象
│   └── entities/           # 数据库实体
├── services/                # 业务逻辑层
├── repositories/            # 数据访问层
├── utils/                   # 工具函数
├── config/                  # 配置文件目录
│   └── config.yaml         # 集中化配置文件
├── settings.py             # 配置加载器
└── main.py                 # 应用入口
```

**目录职责说明：**

| 目录 | 职责 | 示例 |
|------|------|------|
| `apps/` | API 路由和端点定义 | FastAPI Router |
| `core/` | 基础设施层，封装第三方服务 | 数据库连接、Redis 客户端 |
| `models/` | 数据模型定义 | Pydantic BaseModel、SQLModel |
| `services/` | 业务逻辑 | 用户服务、订单服务 |
| `repositories/` | 数据访问 | CRUD 操作、查询封装 |
| `utils/` | 通用工具 | 日期处理、加密、验证 |

## 依赖库使用模式

### 核心依赖

| 库名 | 用途 | 版本 |
|------|------|------|
| fastapi | API 框架 | 最新版 |
| pydantic | 数据验证和序列化 | V2 |
| sqlmodel | ORM（异步支持） | 最新版 |
| sqlalchemy | ORM（底层） | 2.0+ |
| alembic | 数据库迁移 | 最新版 |
| loguru | 日志管理 | 最新版 |
| redis | 缓存客户端 | 最新版 |
| httpx | 异步 HTTP 客户端 | 最新版 |
| uvicorn | ASGI 服务器 | 最新版 |
| python-dotenv | 环境变量管理 | 最新版 |

**可选依赖（根据项目需求）：**

| 库名 | 用途 |
|------|------|
| celery | 异步任务队列 |
| rabbitmq/kafka | 消息队列 |
| boto3 | AWS S3 存储 |
| oss2 | 阿里云 OSS 存储 |
| google-cloud-storage | GCS 存储 |
| peewee | 轻量级 ORM（适合小项目） |

### Pydantic 模型

```python
from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Literal
from datetime import datetime


class MyModel(BaseModel):
    """始终使用 Pydantic V2 模式"""
    
    # 必填字段
    name: str = Field(..., description='名称')
    
    # 带默认值的可选字段
    priority: int = Field(0, description='优先级')
    
    # 可空字段
    author: str | None = Field(None, description='作者')
    
    # 枚举字段
    status: Literal['active', 'inactive'] = Field('active')
    
    # 复杂字段
    extra: dict = Field({}, description='附加信息')
    tags: list[str] = Field([], description='标签列表')
    
    # 验证器
    @model_validator(mode='after')
    def set_hash(self):
        if not self.hash and self.url:
            self.hash = hashlib.md5(self.url.encode()).hexdigest()
        return self
    
    # 配置
    model_config = ConfigDict(
        use_enum_values=True,
        from_attributes=True
    )
```

### 数据库模型

#### 旧版（Peewee）

```python
from peewee import Model, MySQLDatabase, CharField, IntegerField
from playhouse.shortcuts import ReconnectMixin


class ReconnectMySQLDatabase(ReconnectMixin, MySQLDatabase):
    pass


db = ReconnectMySQLDatabase(
    database=settings.MYSQL_CONFIG.database_name,
    host=settings.MYSQL_CONFIG.host,
    port=settings.MYSQL_CONFIG.port,
    user=settings.MYSQL_CONFIG.username,
    password=settings.MYSQL_CONFIG.password,
    charset='utf8mb4'
)


class MyTable(Model):
    id = AutoField(primary_key=True)
    name = CharField(max_length=255)
    created_at = DateTimeField(
        constraints=[SQL('DEFAULT CURRENT_TIMESTAMP')]
    )
    
    class Meta:
        database = db
        table_name = 'my_table'
```

#### SQLModel（异步 ORM）

```python
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class MyTable(SQLModel, table=True):
    __tablename__ = "mytable"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_at: Optional[datetime] = None
```

### 配置管理

```python
# settings.py
import yaml
from pydantic import BaseModel


class MysqlConfig(BaseModel):
    host: str
    port: int
    database_name: str
    username: str
    password: str


# 加载配置
run_mode = os.environ['RUN_MODE'].lower()

with open('config.yaml', 'r') as f:
    config = yaml.load(f.read(), Loader=yaml.CLoader)
    current_config = config[run_mode]

MYSQL_CONFIG = MysqlConfig(**(current_config['mysql']))
```

## Typing 规范（重点）

### 基本原则

1. **始终使用 Python 3.10+ 的现代语法**
2. **所有函数签名都必须有类型注解**
3. **优先使用内置类型而非 typing 模块的类型**

### 基础类型注解

```python
# ✅ 正确 - 使用现代语法
def process(items: list[str]) -> dict[str, str]:
    pass

def get_user(user_id: int) -> User | None:
    pass

def calculate(a: int, b: float = 0.5) -> float:
    return a * b

# ❌ 错误 - 避免使用旧语法
from typing import List, Dict, Optional

def process(items: List[str]) -> Dict[str, str]:
    pass

def get_user(user_id: int) -> Optional[User]:
    pass
```

### 可选值和可空值

```python
# ✅ 正确 - 使用 X | None 语法
def find_by_id(item_id: int) -> Item | None:
    """查找元素，不存在返回 None"""
    pass

def get_name(user: User) -> str | None:
    """获取用户名，可能为空"""
    return user.name

# ✅ 正确 - 在 Pydantic 模型中
class MyModel(BaseModel):
    name: str | None = Field(None, description='名称')
    tags: list[str] | None = Field(None, description='标签')

# ❌ 错误 - 避免使用 Optional
from typing import Optional

def find_by_id(item_id: int) -> Optional[Item]:
    pass
```

### 联合类型

```python
# ✅ 正确 - 使用 | 操作符
def process_input(data: str | bytes) -> str:
    if isinstance(data, bytes):
        return data.decode()
    return data

def get_result() -> dict | list | None:
    """返回可能是字典、列表或 None"""
    pass

# ✅ 正确 - 复杂联合类型
from typing import Literal

def set_priority(level: Literal[0, 1, 2, 3]) -> None:
    pass

def set_mode(mode: Literal['fast', 'slow', 'auto']) -> None:
    pass

# ❌ 错误 - 避免使用 Union
from typing import Union

def process_input(data: Union[str, bytes]) -> str:
    pass
```

### 容器类型

```python
# ✅ 正确 - 使用内置类型
def get_names() -> list[str]:
    return ['Alice', 'Bob']

def get_mapping() -> dict[str, int]:
    return {'a': 1, 'b': 2}

def get_nested() -> dict[str, list[int]]:
    return {'data': [1, 2, 3]}

def get_complex() -> list[dict[str, str | int]]:
    return [{'name': 'Alice', 'age': 30}]

# ✅ 正确 - 使用 set 和 tuple
def get_unique() -> set[str]:
    return {'a', 'b', 'c'}

def get_pair() -> tuple[str, int]:
    return ('Alice', 30)

def get_fixed() -> tuple[int, int, int]:
    return (1, 2, 3)

# ❌ 错误 - 避免使用 typing 模块
from typing import List, Dict, Set, Tuple

def get_names() -> List[str]:
    return ['Alice', 'Bob']
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

# ✅ 正确 - Pydantic 模型中的嵌套
class Response(BaseModel):
    data: list[dict[str, str | int | None]]
    metadata: dict[str, list[str]]
```

### 函数签名规范

```python
# ✅ 正确 - 完整的函数签名
def search_one_page(
    self,
    key_word: str,
    start_date: datetime | None,
    page: int = 1,
    limit: int = 20
) -> list[ClipResultDTO]:
    """
    在单个页面中搜索特定关键词。

    参数:
        key_word: 要搜索的关键词
        start_date: 开始日期，可选
        page: 页码，默认为 1
        limit: 每页数量，默认为 20

    返回:
        包含搜索结果的 ClipResultDTO 对象列表
    """
    pass

# ✅ 正确 - 带有默认值的参数
def create_task(
    name: str,
    priority: int = 0,
    skip_filter: bool = False,
    extra: dict | None = None
) -> Task:
    pass

# ✅ 正确 - 回调函数类型
from collections.abc import Callable

def on_complete(callback: Callable[[str, bool], None]) -> None:
    """注册完成回调"""
    pass

def process_with_handler(
    data: list[str],
    handler: Callable[[str], str | None]
) -> list[str]:
    pass
```

### 类型别名

```python
# ✅ 正确 - 使用 TypeAlias
from typing import TypeAlias

UserId: TypeAlias = int
UserName: TypeAlias = str
UserMap: TypeAlias = dict[UserId, UserName]

def get_user(user_id: UserId) -> UserName | None:
    pass

# ✅ 正确 - 复杂类型别名
JsonData: TypeAlias = dict[str, str | int | float | bool | None]
ParseResultList: TypeAlias = list[ParseResult | CollectionResult]
```

### 泛型

```python
# ✅ 正确 - 使用 TypeVar
from typing import TypeVar

T = TypeVar('T')

def first(items: list[T]) -> T | None:
    """获取列表第一个元素"""
    return items[0] if items else None

# ✅ 正确 - 带约束的 TypeVar
from typing import TypeVar

Numeric = TypeVar('Numeric', int, float)

def add(a: Numeric, b: Numeric) -> Numeric:
    return a + b
```

### 常量类型

```python
# ✅ 正确 - 使用 Final
from typing import Final

MAX_RETRIES: Final = 3
DEFAULT_TIMEOUT: Final[int] = 30

# ✅ 正确 - 使用 Literal 作为常量
from typing import Literal

LogLevel = Literal['DEBUG', 'INFO', 'WARNING', 'ERROR']
```

### 类型注解最佳实践

```python
# ✅ 1. 始终注解公共函数的返回类型
def get_data() -> dict[str, Any]:
    pass

# ✅ 2. 私有函数可以省略返回类型（但推荐加上）
def _internal_process(data: list[str]) -> list[str]:
    pass

# ✅ 3. 使用 TypeGuard 进行类型窄化
from typing import TypeGuard

def is_string_list(val: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in val)

# ✅ 4. 使用 overload 处理不同参数组合
from typing import overload

@overload
def process(data: str) -> str: ...

@overload
def process(data: list[str]) -> list[str]: ...

def process(data: str | list[str]) -> str | list[str]:
    if isinstance(data, str):
        return data.upper()
    return [x.upper() for x in data]
```

### Pydantic 模型中的 Typing

```python
from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime


class UserResponse(BaseModel):
    """用户响应模型"""
    
    # 基础类型
    id: int | None = None
    username: str = Field(description='用户名')
    email: str | None = Field(None, description='邮箱')
    
    # 枚举类型
    role: Literal['admin', 'user', 'guest'] = Field('user')
    status: Literal['active', 'inactive', 'banned'] = Field('active')
    
    # 复杂类型
    tags: list[str] = Field([], description='标签列表')
    metadata: dict = Field({}, description='元数据')
    
    # 嵌套类型
    posts: list['PostResponse'] = Field([], description='文章列表')
    profile: 'UserProfile | None' = Field(None, description='用户资料')
    
    # 日期类型
    created_at: datetime | None = Field(None, description='创建时间')
    updated_at: datetime | None = None


class PostResponse(BaseModel):
    """文章响应模型"""
    id: int
    title: str
    content: str
    author_id: int
    tags: list[str] = []
    published_at: datetime | None = None


class UserProfile(BaseModel):
    """用户资料模型"""
    avatar_url: str | None = None
    bio: str | None = None
    website: str | None = None
```

### 类型检查工具

```python
# 运行类型检查
# pip install mypy
# mypy your_file.py --ignore-missing-imports

# 或者使用 pyright
# pip install pyright
# pyright your_file.py
```

## 代码风格

### 日志记录

```python
from loguru import logger

# 使用合适的日志级别
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.exception('异常信息（带堆栈）')
```

### 路径处理

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / 'config.yaml'
```

### 哈希生成

```python
import hashlib

def get_md5(text: str) -> str:
    return hashlib.md5(text.encode(encoding="utf-8")).hexdigest()
```

### UUID 生成

```python
from utils.uuid_helpers import get_uuid

unique_id = get_uuid()
```

## API 模式

### FastAPI 路由

```python
from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse

router = APIRouter(
    tags=["服务名称"],
    prefix='/api/v1/service'
)


@router.get(
    '/endpoint',
    summary='接口摘要',
    description='详细描述',
    responses={
        200: {'model': SuccessResponse},
        500: {'model': ErrorResponse}
    }
)
def my_endpoint(
    param: str = Query(description='参数说明'),
    optional: int = Query(20, description='可选参数')
) -> SuccessResponse | ErrorResponse:
    try:
        # 实现逻辑
        return SuccessResponse(succeed=True, data=result)
    except Exception as e:
        logger.exception(f'错误: {param}')
        return JSONResponse(
            content={'message': str(e), 'succeed': False},
            status_code=500
        )
```

### 响应模型

```python
from pydantic import BaseModel, Field


class SuccessResponse(BaseModel):
    succeed: bool = Field(True)
    message: str = Field('成功')
    data: dict | list | None = None


class ErrorResponse(BaseModel):
    succeed: bool = Field(False)
    message: str = Field(...)
```

## 环境变量

### 常用环境变量

```bash
# 应用环境
APP_ENV=development  # 可选值: development, testing, production

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379/0

# 密钥（不要提交到版本控制）
SECRET_KEY=your-secret-key
```

### 加载方式

```shell
# 方式1: 使用 python-dotenv
from dotenv import load_dotenv
load_dotenv()

# 方式2: 使用系统 export
export APP_ENV=development
python main.py
```

## 代码质量工具

### Ruff 配置

```toml
# .ruff.toml
exclude = ["tests", "scripts", "migrations"]

[lint]
select = ["E", "F", "B"]
ignore = ["E501", "B008", "F841", "F811", "F541", "F401", "E711", "E712"]
```

### 运行检查

```shell
# 代码格式化
autopep8 --recursive . --in-place

# 静态分析
ruff check . --exclude testing --extend-exclude dev
```

## 常用模式

### 异步任务（Celery）

```python
from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def send_email(to: str, subject: str, body: str) -> bool:
    """异步发送邮件"""
    # 实现逻辑
    return True

# 调用异步任务
result = send_email.delay('user@example.com', 'Hello', 'World')
```

### 消息队列（RabbitMQ/Kafka）

```python
# 使用 aio-pika（RabbitMQ）
import aio_pika

async def publish_message(queue_name: str, message: str) -> None:
    """发布消息到队列"""
    connection = await aio_pika.connect_robust("amqp://guest:guest@localhost/")
    async with connection:
        channel = await connection.channel()
        await channel.default_exchange.publish(
            aio_pika.Message(body=message.encode()),
            routing_key=queue_name,
        )
```

### Redis 操作

```python
import redis.asyncio as redis

# 创建客户端
client = redis.from_url("redis://localhost:6379/0")

# 设置带过期时间的键
await client.set(key, value, ex=3600)

# 获取值
value = await client.get(key)

# 原子计数器
count = await client.incr("counter")
```

### 数据库事务

```python
from sqlalchemy.ext.asyncio import AsyncSession

async def transfer_money(
    session: AsyncSession,
    from_id: int,
    to_id: int,
    amount: float
) -> None:
    """转账操作（事务示例）"""
    async with session.begin():
        from_account = await session.get(Account, from_id)
        to_account = await session.get(Account, to_id)
        
        from_account.balance -= amount
        to_account.balance += amount
```

## 最佳实践

### 依赖管理

1. **使用虚拟环境** - venv、poetry 或 pipenv
2. **锁定依赖版本** - 生成 requirements.txt 或 poetry.lock
3. **分离开发和生产依赖** - requirements-dev.txt vs requirements.txt

### 代码质量

4. **不确定 API 用法时查看第三方包源代码**（避免幻觉）
5. **使用配置文件集中管理配置** - config.yaml 或 .env
6. **测试脚本**放在 `tests/` 目录
7. **工具脚本**放在 `scripts/` 目录

### 开发流程

8. **编写单元测试** - pytest 或 unittest
9. **运行 lint 检查** - ruff、flake8 或 pylint
10. **代码格式化** - black 或 autopep8
11. **类型检查** - mypy 或 pyright

### 文档

12. **编写 README.md** - 项目说明和使用方法
13. **使用 docstring** - 函数和类的文档字符串
14. **维护 CHANGELOG.md** - 版本变更记录

## 反模式（避免）

- ❌ 使用 `Optional[X]` 而非 `X | None`
- ❌ 使用 `List[X]` 而非 `list[X]`
- ❌ 使用 `Dict[X, Y]` 而非 `dict[X, Y]`
- ❌ 使用 `Union[X, Y]` 而非 `X | Y`
- ❌ 硬编码配置值
- ❌ 使用 print() 而非 logger
- ❌ 将脚本放在根目录
- ❌ 不运行 lint 检查就提交代码
- ❌ 函数签名缺少类型注解
- ❌ 返回类型未标注

## 实际收益

遵循这些规范可以确保：

- 团队代码库一致性
- 新开发者更容易上手
- 减少类型不匹配导致的 Bug
- 更好的 IDE 支持和自动补全
- 可维护的配置管理
- 类型安全的数据流转
