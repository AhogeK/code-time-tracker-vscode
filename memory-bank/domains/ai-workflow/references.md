# ai-workflow — references

## 记忆与文档布局

| 位置 | 内容 | 提交？ |
|---|---|---|
| `AGENTS.md` | 规则 R1–R30 | 是（develop） |
| `SKILL_GRAPH.md` | 技能索引（R30 治理） | 是 |
| `memory-bank/*.md` | 时间线层（5 文件） | 是 |
| `memory-bank/domains/<d>/` | 领域层（五件套） | 是 |
| `memory-bank/archives/` | 冻结历史（唯一豁免 200 行） | 是（按需建立） |
| `.omp/` | 计划 / 交付报告 / 需求草案 | **否**（gitignore） |
| `docs/` | 面向用户文档 | 是（含 master） |

## 限额与格式

正式定义在 `AGENTS.md` R15（行数上限与归档流程）与 R17（版本），此处只列常用值：

| 项 | 值 |
|---|---|
| 提交 subject | ≤72 字符 |
| 提交模板 | `.gitmessage`（需 `git config commit.template .gitmessage`） |
| 版本位置 | `package.json` → `version`（单一来源） |
| 计划文件名 | 不带日期；日期在文件内 `Date:` 字段 |

## 本仓库已固定的配置

```
.npmrc             enable-pre-post-scripts = true
pnpm-workspace.yaml allowBuilds: { esbuild: true }
tsconfig.json      module Node16 / target ES2022 / strict true / rootDir src
esbuild.js         cjs / platform node / external ['vscode'] / outfile dist/extension.js
.vscode-test.mjs   files: out/test/**/*.test.js
```

## 常用命令

```bash
pnpm install                 # 安装
pnpm run compile             # 类型 + lint + 打包（提交前必跑）
pnpm run check-types         # 仅 tsc --noEmit
pnpm run lint                # 仅 eslint src
pnpm run watch               # 并行 watch（F5 用）
pnpm run test                # 宿主测试
pnpm run package             # 生产构建
```

## Git 事实

| 项 | 值 |
|---|---|
| remote | `git@github.com:AhogeK/code-time-tracker-vscode.git` |
| 发布分支 | `master`（无 AI 文件） |
| AI 工作分支 | `develop` |
| 初始提交 | `3d67739 first commit`（仅 README.md） |
| 默认分支（GitHub） | `master` |

## 只读关联项目

| 仓库 | 角色 | 路径 |
|---|---|---|
| ctt-server | 后端（唯一） | `../ctt-server` |
| ctt-web | Web 看板 | `../ctt-web` |
| code-time-tracker | JetBrains 插件（本仓库的来源项目） | `../code-time-tracker` |

契约核对从源码读，不转抄文档措辞（见 `../server-api/references.md` 的文档漂移表）。

## 领域清单

`ai-workflow`（本领域）· `sync-client` · `server-api`
—— 索引见 `../README.md`。
