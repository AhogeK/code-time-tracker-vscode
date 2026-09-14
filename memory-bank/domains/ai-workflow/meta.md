# ai-workflow — meta

## Boundary

Agent 在**本仓库内**如何工作：知识存在哪、怎么保证不漂移、工作如何被版本化与提交、如何被验证、
允许触碰什么。本领域讲**工作过程**，不讲产品。

**In scope**：记忆/知识维护、版本管理、提交粒度、分支政策、验证证据、资源归属、只读边界。

**Out of scope**：

- 扩展本身的架构约定 → [`systemPatterns.md`](../../systemPatterns.md)
- 如何与后端交互 → [`server-api`](../server-api/meta.md)
- 同步引擎实现 → [`sync-client`](../sync-client/meta.md)
- 规则条文本身（在 `AGENTS.md`）—— 本领域承载规则**背后的实践与陷阱**，以及让规则站得住的理由

## Owned paths

| 路径 | 角色 |
|---|---|
| `AGENTS.md` | 约束性规则（R1–R30），AI 维护 |
| `SKILL_GRAPH.md` | 技能索引（R30 治理），只列实际存在的技能 |
| `memory-bank/*.md` | 时间线层：状态、进度、横切模式 |
| `memory-bank/domains/` | 领域层：本知识图谱 |
| `memory-bank/archives/` | 从时间线层冻结出来的历史（按需建立） |
| `.omp/` | 本地 AI 工作产物（gitignore，不提交） |
| `.editorconfig`、`.gitmessage`、`.gitignore` | 仓库卫生 |

> 本仓库**没有** `.opencode/`：会话命令那套是 `../code-time-tracker` 早期使用的机制，
> 当前工具链不再需要。会话初始化由 R1 直接约束，不走命令文件。

## 术语

| 术语 | 含义 |
|---|---|
| 时间线层 | `activeContext.md` / `progress.md` —— 按时序，会被时间取代 |
| 领域层 | `memory-bank/domains/<domain>/` —— 持久判断，永不作为 changelog |
| 横切规范 | 适用于所有地方的约定 → `systemPatterns.md` |
| 原子提交 | 一个 commit 一件事；代码与其版本号提升是**两个** commit |
| 验证证据 | 一个测量值、一次实际运行输出、一张截图 —— 不是「应该能跑」 |
| 任务级规则 | 用户指令管辖一个任务，**不是**长期提交授权 |
| 归因漂移 | 「这是错的」掩盖了「用户改过」的真实情况 |

## Where to start

| 要做什么 | 读哪个 |
|---|---|
| 即将改动任何东西 | `scenarios.md`（哪条流程适用） |
| 决定知识记到哪 | `principles.md` P4–P7 |
| 提交 / 版本化 | `practices.md`，再看 `AGENTS.md` R6 / R7 / R17 |
| 查一个记住的细节 | `references.md` |
| 想知道某个规则为什么存在 | `principles.md`（含事故记录） |
