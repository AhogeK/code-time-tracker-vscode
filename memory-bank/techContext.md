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

## 已决

> 来源：用户确认（2026-09-14）+ ctt-server 后端方向转达（2026-09-15）
> ｜ 最后确认：2026-09-15 ｜ 适用范围：本地存储与数据边界 ｜ 状态：**已核实**

| 议题 | 决定 | 依据 |
|---|---|---|
| **本地存储** | 与 `../code-time-tracker` **同一个 SQLite 文件**，数据共通；**schema 由插件端独占管理** | 用户指示 + 后端方向 |
| **语言字段** | **发送 VS Code 原生 `document.languageId` 原值**（如 `typescript`），不做大小写转换、不做命名美化；归一化由 ctt-server 统一承担 | 后端方向 + **源码已核实**（见下） |
| **本地统计** | 插件端**也做**与 JetBrains 插件类似的 IDE 端独立统计 | 用户指示 |

### 语言字段：已由服务端源码核实（v0.74.2）

**本插件不做任何语言归一化。** 服务端已实现，实现位置
`../ctt-server/src/main/java/com/ahogek/cttserver/language/`（`LanguageVocabulary` +
`CanonicalLanguage` + `LanguageType`，词表为资源文件 `resources/language/vocabulary.json`）。

**跑通服务端真实算法后的对照**（`key()` = `strip().toLowerCase()`）：

| 送进去 | 归一为 | 类型 |
|---|---|---|
| `typescript` / `TypeScript` / `TYPESCRIPT` | `TypeScript` | programming |
| `java` / `JAVA` | `Java` | programming |
| `kotlin` / `Kotlin` / `KOTLIN` | `Kotlin` | programming |
| **`ignore`（VS Code）与 `GitIgnore file`（JetBrains）** | 都 → `Ignore List` | data |
| `shellscript` | `Shell` | programming |
| `textmate` / `ARCHIVE` | `Other`（已知非语言，合并） | OTHER |

**三种归一路径**（`LanguageVocabulary.normalize`）：

1. **已知非语言**（`textmate`、`archive`）→ 合并进 `Other`
2. **已知语言**（canonical 或 aliases，大小写与首尾空白不敏感）→ 返回规范名 + 类型
3. **未识别** → **原样保留**并标 `recognized=false`，服务端记 WARN 日志等待分类
   —— **不会**被并进 `Other`，以免新语言被埋进没人看的桶

**归一化发生在读取时**（`StatsCalculator.languageDistribution` 在查询期调用
`vocabulary.normalize(...)`），**不是写入时**。这正是「历史数据无需回填」的实现方式：
存量行里的原始值在查询期同样被归一化。

**词表快照**：`VocabularyFile(version, canonical, aliases, nonLanguages)`，
当前 `version: 1`、92 个规范名、75 个别名、76 个非语言值。
**尚未通过 HTTP 暴露**（无对应端点；`unmappedValues()` 有意不公开——它是全局集合，
而其余读接口按用户隔离）。状态：**待确认**——对接文档未到前不得自行设计格式。

### 由「同一个库」推出的强制后果

1. **数据库路径已核实**（`../code-time-tracker` 的 `util/PathUtils.kt`）：
   本机为 `~/.config/code-time-tracker/coding_data.db`（macOS/Linux 用 `~/.config/code-time-tracker/`，
   Windows 用 `%APPDATA%\code-time-tracker\`）。**文件已存在且有真实数据**（约 1.9 MB）。
   本仓库必须指向**同一个文件**，不得自建

2. **schema 变更权归插件端所有** —— 本插件**不得迁移、不得新增列、不得改约束**。
   现有表：`coding_sessions`（+3 索引 `idx_sessions_time_range` / `idx_sessions_min_time` /
   `idx_sessions_sync_state`）、`app_user`、`sync_cursor`。
   定义见 `../code-time-tracker/src/main/kotlin/com/ahogek/codetimetracker/database/MigrationManager.kt`

   **需要新列时**：走需求报告给插件端（R3），**不自行加**。两端各自迁移 = schema 漂移，
   而漂移的代价是**两个 IDE 读到对方的库时崩溃或静默丢数据**。

   **语言归一化不涉及 schema 变更**（后端已确认）：`coding_sessions.language` 保持
   `VARCHAR(50) NOT NULL` **存原样值**，归一化在读取时进行。本插件无需协调迁移。

3. **本地库只存原生值** —— **语言名**归一化一律推到展示时进行。写入时归一化会使原始事实
   不可恢复，且与服务端的归一化结果打架（服务端在**读取时**归一化，不依赖列里存的是规范名）

4. **并发写入**：两个 IDE 可能同时打开同一 SQLite 文件，必须按 SQLite 锁语义设计
   （WAL 模式 + 忙等待重试）

5. **`sessionUuid` 是跨端会话身份**：两端生成的会话必须用同一套 UUID 规则，
   否则同步时同一会话会被当成两条

6. **本地统计与服务端统计是两套实现**：服务端为权威（plugin parity），本地是近似 ——
   本地实现必须复刻 JetBrains 的桶边界（见 `domains/server-api/principles.md` P4/P7）

**尚需细化（实现前必须先确认）**：

- SQLite 接入方式（`node:sqlite` 内置 / `better-sqlite3` 原生模块 / WASM）—— 涉及打包体积与原生依赖，属 R14 依赖决策
- 空闲检测阈值与插件端是否一致（影响会话切分口径）
- **词表快照的对接**（`VocabularyFile{version, canonical, aliases, nonLanguages}`）——
  服务端**尚未通过 HTTP 暴露**，等后端对接文档；**文档未到前不得自行设计格式**

## 依赖变更记录

- （新增 / 升级依赖后在此登记，含理由；见 AGENTS.md R14）
