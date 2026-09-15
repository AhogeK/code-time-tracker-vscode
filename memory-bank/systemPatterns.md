# System Patterns

> 横切规范与架构模式。**领域专属判断不放这里**——见 `domains/README.md`（AGENTS.md R28）。

## 当前状态

脚手架阶段：`src/extension.ts` 仅注册 `helloWorld` 命令，`src/test/extension.test.ts` 为示例断言。
**尚无业务模块**——下方的宿主 API 模式是**本仓库确立的强制约定**（AGENTS.md R9），
新增代码必须遵守；尚未落地的部分（存储、统计、同步）在 `domains/` 与 `techContext.md` 的
「待决策」中跟踪，**不要在此处预写未实现的模式**。

## 扩展生命周期

```
activate(context)   → 注册命令/监听器，全部 Disposable 进 context.subscriptions
deactivate()        → 快速落盘已积累数据，立即返回（不等待网络、不做长任务）
```

- 入口 `src/extension.ts`（`main: ./dist/extension.js`）保持**精简**：只做装配，业务逻辑进独立模块
- 应用级状态由模块级单例持有；**禁止**把逻辑堆在 `activate()` 里
- 命令 ID 与 `package.json` 的 `contributes.commands` **必须逐字一致**
  （当前为 `code-time-tracker-vscode.helloWorld`；新增命令沿用 `code-time-tracker-vscode.<verb>`）

## Disposable 所有权

- 每一个 `Disposable`（命令、监听器、事件订阅、输出通道）都必须进 `context.subscriptions`，
  或用 `vscode.Disposable.from(...)` 把一组合并成单个可释放对象后再入 `subscriptions`
  （注意：`DisposableStore` 是 VS Code 内部实现，**不在**公开 API 中，`@types/vscode` 里搜不到）
- **禁止**裸注册：扩展停用/重载后残留的监听器会持续触发并持有闭包，是扩展拖慢宿主的主因
- 事件订阅必须可退订：`vscode.workspace.onDidChangeTextDocument(...)` 返回的 Disposable 不可丢弃

## 凭据存储

| 数据 | 位置 | 理由 |
|---|---|---|
| API Key、令牌 | `context.secrets`（`SecretStorage`） | 加密存储，不进 settings 文件 |
| 非敏感配置（服务器地址、同步间隔） | `workspace.getConfiguration()` / `contributes.configuration` | 用户可见可改 |

**红线**：密钥**禁止**写入 `settings.json`、`globalState`、日志或遥测。

## 日志与用户可见输出

- 长期日志：`vscode.window.createOutputChannel(name, { log: true })`（`LogOutputChannel`）,
  随 `context.subscriptions` 释放；分级用 `trace/debug/info/warn/error`
- 需用户立即知晓：`vscode.window.showInformationMessage` / `showWarningMessage` / `showErrorMessage`
- **禁止** `console.log` 作为长期日志——扩展宿主的 console 用户看不到，且无分级无时间戳
- 错误**不得静默吞掉**：至少记录到 OutputChannel；面向用户的失败要给可操作的提示

## 扩展宿主线程模型

宿主主线程负责 UI 与 API 调用，**阻塞它会让整个编辑器卡顿**。

- 禁止：同步文件 IO 循环（`fs.readFileSync` 遍历）、长 CPU 循环、`while` 轮询占满主线程
- 允许：`fs/promises` 异步 IO、`setTimeout` 分片处理、必要时 `worker_threads`（重活）
- 定期任务用 `setInterval` 时必须保存 handle 并在停用时 `clearInterval`

## 构建与模块形态

```
src/**.ts  --esbuild(bundle, cjs, platform:node, external:vscode)-->  dist/extension.js
src/**.ts  --tsc -p . --outDir out-->                                out/**      (测试)
```

- `vscode` 是 `external`，运行时由宿主注入，**不得**打包
- 源码用 ESM 语法（`import`/`export`）；产物为 CJS，由 esbuild 转换——两者不要混写 `require`
- **相对导入不要带 `.js` 后缀**：`package.json` 没有 `"type": "module"`，本项目在 `module: Node16`
  下按 CommonJS 解析，带后缀与不带后缀都能编译（已实测）。约定统一用**不带后缀**的形式，
  与脚手架现有写法（`src/test/extension.test.ts` 的 `'../../extension'`）一致
- 生产构建走 `pnpm run package`（`--production` → minify、无 sourcemap）

## 命名与文件组织

| 类别 | 约定 | 示例 |
|---|---|---|
| 文件 | `kebab-case.ts` | `session-tracker.ts` |
| 类型 / 类 / 接口 | `PascalCase` | `CodingSession` |
| 函数 / 变量 | `camelCase` | `startTracking` |
| 常量 | `UPPER_SNAKE_CASE` | `DEFAULT_IDLE_TIMEOUT_MS` |
| 测试 | 与被测文件同名 | `session-tracker.test.ts` |
| 测试描述 | `shouldX whenY` | `should split session when idle exceeds timeout` |

类型优先 `interface`（可扩展对象）/ `type`（联合、映射、工具类型）；
禁止 `any`（用 `unknown` + 收窄）；`switch` 对联合类型必须穷尽，用 `never` 兜底。

## 测试分层

| 层 | 工具 | 适用范围 |
|---|---|---|
| 纯逻辑单元 | Mocha 直接跑（不启宿主） | 会话切分、时长计算、序列化、mapper |
| 宿主集成 | `@vscode/test-cli` + `@vscode/test-electron` | 命令注册、配置读取、SecretStorage、事件订阅 |

纯逻辑必须与 `vscode` 模块**解耦**（不 import `vscode`），否则被迫走重量级宿主测试。
当前脚手架只有宿主层示例（`src/test/extension.test.ts`）。

## 架构层：体系与链路

**四个系统，一个后端。** 本仓库是体系中的**第三个客户端**。

```
                    ┌──────────────────────────┐
   JetBrains ──────▶│                          │
   (code-time-tracker)   ctt-server            │
                    │  · 唯一后端              │
   VS Code ────────▶│  · 唯一会话写入方        │
   (本仓库)         │  · 统计口径裁决者        │
                    │                          │
   Web ────────────▶│                          │      读
   (ctt-web)        └──────────────────────────┘ ◀──────
```

### 数据流：读写分离（这是本仓库最重要的一张图）

| 方向 | 路径 | 谁主导 | 本仓库对应 |
|---|---|---|---|
| **写** | 本地采集 → `POST /sync/push` → ctt-server | 客户端推送，**服务端裁决冲突** | [`sync-client`](domains/sync-client/meta.md) |
| **读** | ctt-server `/api/v1/stats/**` → 展示 | **服务端拥有语义** | [`server-api`](domains/server-api/meta.md) |
| 本地 | 本地 SQLite → 本地统计视图 | 本仓库自己算 | 待建（与插件端**同一份库**） |

**关键推论**：写入路径（`sync-client`）只负责把事实送达；**任何聚合值的语义都不由客户端决定**。
在客户端「重算一遍再显示」是与服务端漂移的稳定来源。

### 归属与影响面

| 问题 | 答案 |
|---|---|
| 谁拥有 `coding_sessions`？ | ctt-server 是**唯一写入方**；本地库是副本 + 离线缓冲 |
| 谁决定「时长」怎么算？ | 服务端 `StatsCalculator`；插件端定义显示语义，服务端为 tie-breaker |
| 谁决定本地库 schema？ | **`../code-time-tracker` 独占**——本插件不迁移、不加列、不改约束 |
| 本地库存什么？ | **原生值**；归一化一律推到展示时，写入时不做转换 |
| 改本仓库会影响谁？ | 只影响本扩展与本地库；跨端影响必须走需求报告（R3） |
| 哪些系统本仓库**只读**？ | `../ctt-server`、`../ctt-web`、`../code-time-tracker` 全部 |

### 本地库的三条纪律（共用同一个文件带来的）

1. **schema 变更权归插件端独占。** 本插件**不得**执行迁移、新增列或改约束。
   需要新列 → 走需求报告给插件端（R3）。**两端各自迁移 = schema 漂移**，
   代价是两个 IDE 读到对方的库时**崩溃或静默丢数据**。
2. **只存原生值，归一化在展示时做。** 写入时归一化会让原始事实不可恢复，
   并与服务端的回填结果打架（例：`language` 存 `document.languageId` 原值，
   展示时才映射成可读名）。
3. **按 SQLite 锁语义设计并发。** 两个 IDE 可能同时打开同一文件：WAL 模式 + 忙等待重试。

### 三条不可越界的约束

1. **契约以 ctt-server 源码为准**，不以文档措辞为准（文档已发现 8 处与源码不一致）
2. **统计语义由服务端裁决**（plugin parity）；本仓库**不定义**口径，分歧时服务端正确
3. **关联项目只读**（R3）；需要契约变更时写需求报告，**不跨仓库改动**

事实回源规则见 [`domains/README.md`](domains/README.md)「事实回源」；此处不重复（R16）。
