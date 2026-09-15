# Tech Context

> 技术栈、项目结构、常用命令

## 技术栈

| 维度 | 选型 | 来源 |
|---|---|---|
| 语言 | TypeScript `6.0.3` | `package.json` |
| 宿主 | VS Code `^1.137.0` | `engines.vscode` |
| 类型定义 | `@types/vscode ^1.137.0`、`@types/node 24.x` | `package.json` |
| 运行时 | Node（开发机 v24.21.0） | `node --version` |
| 包管理 | pnpm `12.4.1`（`~/Library/pnpm/bin/pnpm`） | `pnpm --version` |
| 打包 | esbuild `^0.28.1`（`esbuild.js`，CJS，输出 `dist/extension.js`） | `esbuild.js` |
| 类型检查 | `tsc --noEmit`（`tsconfig.json`，`module: Node16`、`target: ES2022`、`strict: true`） | `tsconfig.json` |
| Lint | ESLint `^10.5.0` + `typescript-eslint ^8.61.1`（`eslint.config.mjs`，flat config） | `eslint.config.mjs` |
| 测试 | Mocha（由 `@vscode/test-cli` 提供，当前 11.8.0）+ `@vscode/test-cli ^0.0.15` + `@vscode/test-electron ^3`；类型声明 `@types/mocha ^10.0.10` | `package.json` / `pnpm-lock.yaml` |
| 本地数据库 | **SQLite**，文件 `~/.config/code-time-tracker/coding_data.db` —— 与 `../code-time-tracker` **同一个文件**（见「已决」） | 用户决策 2026-09-14 + `PathUtils.kt` 核实 |

## 项目结构

```
src/
├── extension.ts          # activate / deactivate 入口（当前仅 helloWorld 脚手架）
└── test/
    └── extension.test.ts # Mocha 测试（当前仅示例断言）
dist/                     # esbuild 产物（gitignore）
out/                      # 测试编译产物（gitignore）
```

新增业务代码时按职责建目录（如 `tracker/`、`storage/`、`sync/`、`stats/`、`ui/`），
命名遵循 AGENTS.md R9；**不要**把逻辑堆在 `extension.ts`。

## 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm run compile` | 类型检查 + lint + esbuild 打包（提交前必跑） |
| `pnpm run check-types` | 仅 `tsc --noEmit` |
| `pnpm run lint` | 仅 `eslint src` |
| `pnpm run watch` | 并行 watch（esbuild + tsc），F5 调试用 |
| `pnpm run package` | 生产构建（`--production`，minify） |
| `pnpm run test` | `vscode-test`（下载并驱动 VS Code 运行测试） |
| `pnpm run compile-tests` | 编译测试到 `out/` |

调试：VS Code 中按 `F5` → 启动 Extension Development Host（`launch.json` 已配好
`preLaunchTask: ${defaultBuildTask}`，即 `watch`）。

## 版本信息

- `version`：`0.1.0`（`package.json` 单一来源）
- `CHANGELOG.md` 同步维护
- 版本规则见 AGENTS.md R17

## 关键事实（验证过的）

- `esbuild.js` 把 `vscode` 标为 `external`，`platform: node`，输出 CJS——
  与该扩展宿主加载方式一致，改动需谨慎
- `tsconfig.json` 的 `rootDir: src`；测试编译走 `tsc -p . --outDir out`
- `.vscodeignore` 已排除 `src/**`、`**/*.ts`、`**/*.map`——发布包只含 `dist/` 与元数据
- `.npmrc` 有 `enable-pre-post-scripts = true`；`pnpm-workspace.yaml` 有 `allowBuilds: esbuild: true`

## 已决（2026-09-14，用户确认）

| 议题 | 决定 | 依据 |
|---|---|---|
| **本地存储** | 与 `../code-time-tracker` **同一方案、同一个库、数据共通** —— SQLite 单文件，schema 与其对齐 | 用户指示；两个 IDE 共享同一份本地数据，避免重复统计 |
| **语义对齐** | 统计口径**照 JetBrains 插件对齐**；后续必须建立**编程语言字典**并做跨端同步对齐 | 用户指示；语言名不一致会让 `LANGUAGES` 维度分裂成两个桶 |
| **本地统计** | 插件端**也做**与 JetBrains 插件类似的 IDE 端独立统计 | 用户指示；本地视图不依赖服务端可用性 |

**由「同一个库」直接推出的强制后果**：

1. **数据库路径已核实**（`../code-time-tracker` 的 `util/PathUtils.kt`）：
   本机为 `~/.config/code-time-tracker/coding_data.db`（macOS/Linux 用 `~/.config/code-time-tracker/`，
   Windows 用 `%APPDATA%\code-time-tracker\`）。**文件已存在且有真实数据**（约 1.9 MB）。
   本仓库必须指向**同一个文件**，不得自建
2. **schema 必须与插件端逐列对齐** —— 现有表：`coding_sessions`（+3 索引
   `idx_sessions_time_range` / `idx_sessions_min_time` / `idx_sessions_sync_state`）、
   `app_user`、`sync_cursor`。详见 `../code-time-tracker/src/main/kotlin/com/ahogek/codetimetracker/database/MigrationManager.kt`
3. **并发写入**：两个 IDE 可能同时打开同一 SQLite 文件，必须按 SQLite 锁语义设计
   （WAL 模式 + 忙等待重试），且**任何 schema 变更都要与插件端同步**，不能单方面迁移
4. **`sessionUuid` 是跨端会话身份**：两端生成的会话必须用同一套 UUID 规则，
   否则同步时同一会话会被当成两条
5. **本地统计与服务端统计是两套实现**：服务端为权威（plugin parity），本地是近似 ——
   本地实现必须复刻 JetBrains 的桶边界（见 `domains/server-api/principles.md` P4/P7）
6. **语言字典是关键对齐面**：语言标识需与插件端使用同一套命名
   （如 `TypeScript` 而非 `typescript`），否则语言分布会分裂

**尚需细化（实现前必须先确认）**：

- SQLite 接入方式（`node:sqlite` 内置 / `better-sqlite3` 原生模块 / WASM）—— 涉及打包体积与原生依赖，属 R14 依赖决策
- 数据库文件路径（插件端已有固定位置，本仓库必须指向**同一个文件**而非自建）
- 语言字典的具体形态（内置表 / 从 VS Code `languageId` 映射 / 双向同步机制）
- 空闲检测阈值与插件端是否一致（影响会话切分口径）

## 依赖变更记录

- （新增 / 升级依赖后在此登记，含理由；见 AGENTS.md R14）
