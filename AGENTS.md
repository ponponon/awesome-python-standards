# AGENTS.md - 贡献指南

## 项目结构

```
awesome-python-standards/
├── skills/                          # AI Agent Skill 文件
│   └── awesome-python-standards/
│       └── SKILL.md                 # 核心规范文档
├── cli/                             # CLI 安装工具
│   ├── src/index.ts                 # CLI 源码
│   ├── package.json
│   └── dist/                        # 构建产物
├── .claude-plugin/                  # Claude Code 插件配置
├── .codex-plugin/                   # Codex CLI 插件配置
├── .cursor-plugin/                  # Cursor 插件配置
├── .opencode/                       # OpenCode 插件配置
├── README.md                        # 英文文档（主文档）
├── README.zh-CN.md                  # 中文文档
├── CHANGELOG.md                     # 版本变更日志
├── LICENSE                          # MIT 协议
├── package.json                     # 根包配置
└── AGENTS.md                        # 本文件
```

## 开发环境

### 前置要求

- Node.js >= 18
- Bun（推荐）或 npm
- Git

### 安装依赖

```bash
# 安装 CLI 工具依赖
cd cli && bun install
```

### 本地开发

```bash
# 开发模式
cd cli && bun run dev

# 构建
cd cli && bun run build
```

## 贡献流程

### 1. 修改 Skill 内容

核心规范文档位于 `skills/awesome-python-standards/SKILL.md`。

**修改要求：**
- 保持 Markdown 格式规范
- 代码示例必须可运行
- 中英文对照（如适用）
- 遵循现有的章节结构

### 2. 维护双语文档

| 文件 | 说明 |
|------|------|
| `README.md` | 英文版（主文档） |
| `README.zh-CN.md` | 中文版 |

**同步更新要求：**
- 新增内容必须同时更新两个版本
- 保持章节标题和结构一致
- badge 链接保持一致

### 3. 版本号管理

本项目遵循 [语义化版本规范](https://semver.org/lang/zh-CN/)：

| 版本类型 | 格式 | 说明 |
|---------|------|------|
| 主版本 | X.0.0 | 不兼容的 API 变更 |
| 次版本 | 0.X.0 | 向后兼容的功能新增 |
| 补丁版本 | 0.0.X | 向后兼容的问题修复 |

**需要同步更新版本号的文件：**

```bash
# 根目录 package.json
package.json

# CLI 目录
cli/package.json
```

### 4. 发布流程

#### 步骤 1：更新版本号

```bash
# 假设新版本为 1.1.0
cd /Users/ponponon/Desktop/code/me/awesome-python-standards

# 更新根 package.json
npm version 1.1.0 --no-git-tag-version

# 更新 CLI package.json
cd cli && npm version 1.1.0 --no-git-tag-version
```

#### 步骤 2：更新 CHANGELOG.md

在 `CHANGELOG.md` 顶部添加新版本说明：

```markdown
## [1.1.0] - 2026-07-07

### Added
- 新增功能描述

### Changed
- 变更内容描述

### Fixed
- 修复问题描述
```

#### 步骤 3：同步双语文档

确保 README.md 和 README.zh-CN.md 都已更新。

#### 步骤 4：提交代码

```bash
git add .
git commit -m "release: v1.1.0"
git tag v1.1.0
git push origin main --tags
```

#### 步骤 5：发布到 npm

```bash
# 发布 CLI 工具
cd cli
npm publish --registry https://registry.npmjs.org/
```

#### 步骤 6：创建 GitHub Release

1. 访问 https://github.com/ponponon/awesome-python-standards/releases/new
2. 选择刚推送的 tag（如 `v1.1.0`）
3. 标题填写 `v1.1.0`
4. 描述复制 CHANGELOG.md 中对应版本的内容
5. 发布 Release

### 5. 版本一致性检查清单

发布前确认：

- [ ] 根 `package.json` 版本号已更新
- [ ] `cli/package.json` 版本号已更新
- [ ] `CHANGELOG.md` 已添加新版本说明
- [ ] `README.md` 版本 badge 可选更新
- [ ] `README.zh-CN.md` 与 README.md 保持同步
- [ ] 本地测试通过（`cd cli && bun run build`）
- [ ] Git tag 已创建
- [ ] GitHub Release 已发布
- [ ] npm 包已发布

## 代码规范

### SKILL.md 规范

- 使用清晰的标题层级
- 代码示例使用 fenced code blocks
- 标注 Python 版本要求
- 提供正确和错误的对比示例

### CLI 工具规范

- 使用 TypeScript 编写
- 使用 Commander.js 处理命令行参数
- 使用 chalk 进行终端着色
- 使用 ora 显示加载状态

## 联系方式

- Issues: https://github.com/ponponon/awesome-python-standards/issues
- Email: 1729303158@qq.com
