# sync-client — meta

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

## 术语

| 术语 | 含义 |
|---|---|
| **LWW** | Last-Write-Wins：新状态覆盖旧状态，优先级链由服务端裁决 |
| **change log** | `session_changes`，按用户的追加日志，`change_id` 单调 |
| **watermark** | 服务端按 (user, device) 持久化的 `last_pulled_change_id`，只增不减 |
| **cursor** | 客户端发送/收到的 `change_id`，用于续拉 |
| **page** | 一次 pull 响应，受 `pull-batch-size`（默认 1000）约束，`hasMore` 标记还有 |
| **origin device** | 会话的**首次**推送设备，创建时写入，**永不重写** |
| **last-writing device** | 最近一次被接受的修改所属设备 |
| **dirty** | 本地有未推送修改的会话 |
| **tombstone** | 软删除标记（`deleted=true`），行不物理删除 |

## Where to start

| 要做什么 | 从哪看起 |
|---|---|
| 实现同步主流程 | `practices.md` 的「同步循环」→ `principles.md` P1、P5 |
| 处理冲突 | `principles.md` P2（LWW 链） |
| 设计本地状态 | `principles.md` P3（dirty 标记）、P6（origin vs writer） |
| 排查「某设备少了/多了数据」 | `scenarios.md` |
| 查字段、端点、错误码 | `references.md` |
| 看参考实现怎么做的 | `../code-time-tracker/src/main/kotlin/com/ahogek/codetimetracker/service/sync/` |
