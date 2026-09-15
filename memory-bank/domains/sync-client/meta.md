# sync-client — meta

> 来源：`../ctt-server` 源码 + `../code-time-tracker`（已实现并 E2E 验证的参考客户端）
> 最后确认：2026-09-15 ｜ 适用范围：本仓库同步引擎的边界与元语 ｜ 状态：**已核实**

## Boundary

本仓库实现的**同步引擎**：把本地会话推到 ctt-server、把服务端的权威状态拉回本地、
用每设备游标推进、按服务端 LWW 收敛。

**In scope**：设备注册与吊销处理、`pull`/`push` 循环、游标持久化与推进、
LWW 优先级链的**客户端义务**（发送正确的 `clientVersion` / `clientModifiedAt`）、
批量原子性、幂等与安全重试、同步调度与失败退避、账号切换隔离。

**Out of scope**：

- 认证凭据如何获取与存储的通用面 → [`server-api`](../server-api/meta.md)
- 服务端内部（`ConflictResolver` 实现、事务边界、物化）→ 服务端领域文件
- 本地会话如何被采集（活动监听、空闲切分）→ 待实现时另立领域
- 统计展示 → `server-api`

## Owned paths

| 路径 | 角色 |
|---|---|
| 本仓库的同步实现（待建，如 `src/sync/`） | 唯一写路径入口 |
| 本地游标存储 | 与同步引擎同生命周期，账号切换时必须重置 |
| `memory-bank/domains/sync-client/*` | 本领域知识 |

**只读对端**：`../ctt-server`（契约权威）、`../code-time-tracker`（已实现的参考客户端，
Kotlin，A–E 阶段全部落地并 E2E 验证）。**严禁修改**（AGENTS.md R3）。

## 元语与消歧

**先消歧，再检索。** 本领域有三个「位置」概念极易混用，而其中一个用错会导致**永不收敛**。

### 核心对象

| 元语 | 本领域的确定含义 | 别名 / 口语 | **非同义词（必须区分）** |
|---|---|---|---|
| **游标 cursor** | 客户端持久化的 `lastPulledChangeId`，续拉的起点 | 「进度」「位置」 | **不是** watermark，**更不是** push 响应里的 `nextCursor` —— 三者用途不同，见下 |
| **watermark** | 服务端按 (user, device) 持久化的位置，**只增不减** | 「服务端游标」 | 客户端游标；两者取 `max()` 才是实际查询起点（P4） |
| **push 响应的 `nextCursor`** | 推送**之后**该用户的最大 changeId | 「推送游标」 | **绝不能用作 pull 起点** —— 它会跳过本次 push 写下的 change（含服务端的裁决结果），客户端于是永不收敛（`practices.md` 红线） |
| **dirty** | 本地有未推送修改的会话 | 「待同步」「未同步」 | **`is_deleted`**（软删除标记）—— 两个独立的标志位 |
| **墓碑 tombstone** | 软删除后保留的行 | 「删除」 | **物理删除** —— 协议不做，删掉会导致服务端再次投递时「删了又回来」 |
| **origin device** | 会话的**首次**创建设备，写入后**永不重写** | 「来源设备」「设备」 | **`updated_by_device_id`**（最后写入者）—— 设备维度统计必须用前者，否则会话会从原设备的数据里消失（P6） |
| **会话 session** | `coding_sessions` 的一行，由 `sessionUuid` 标识 | 「记录」「片段」 | VS Code 的窗口会话、HTTP session —— 完全无关 |
| **clientVersion** | 客户端本地递增的版本计数器，LWW 的输入 | 「版本」 | **`serverVersion`** —— 服务端分配，客户端**不得**自行设置（P2） |
| **change log** | `session_changes`，追加日志 | 「变更日志」 | 应用日志；`change_id` 是**全库共享**的序列，只能当**不透明游标**，不能当计数（P9） |

### 边界

- 「设备」在本领域指 **ctt-server 注册表里的一条记录**；VS Code 的一次安装、插件的
  `app_user` 都是别的东西
- **`sessionUuid` 是跨端身份**：与 JetBrains 插件共用同一个本地库时，两端必须用同一套
  UUID 规则，否则同一会话会被当成两条（见 `../README.md` 的本地库约束）
- **语言字段原样转发**：送 `document.languageId` 的原始值，**本地不做任何归一化**——
  归一化与历史回填由服务端承担（见 `principles.md` P10）

## Where to start

| 要做什么 | 从哪看起 |
|---|---|
| 实现同步主流程 | `practices.md` 的「同步循环」→ `principles.md` P1、P5 |
| 处理冲突 | `principles.md` P2（LWW 链） |
| 设计本地状态 | `principles.md` P3（dirty 标记）、P6（origin vs writer） |
| 排查「某设备少了/多了数据」 | `scenarios.md` |
| 查字段、端点、错误码 | `references.md` |
| 看参考实现怎么做的 | `../code-time-tracker/src/main/kotlin/com/ahogek/codetimetracker/service/sync/` |
