# sync-client — references

> 事实来自 `../ctt-server` 源码（v0.72.0）与 `../code-time-tracker` 的已实现客户端。
> **Base URL 含 `/ctt-server` 上下文路径。**

## 端点

| 端点 | 方法 | Scope | 限流 | 请求 | 响应 |
|---|---|---|---|---|---|
| `/api/v1/devices` | POST | `SYNC` | 10/小时/用户 | `{deviceId, deviceName?, platform?, ideName?, ideVersion?, appVersion?}` | 设备对象 |
| `/api/v1/devices` | GET | `READ` 或 `SYNC` | — | — | 设备数组 |
| `/api/v1/devices/{deviceId}` | DELETE | `WRITE` | — | — | **200 + 信封**（非 204） |
| `/api/v1/sync/pull` | POST | `SYNC` | 120/分钟/API | `{deviceId, lastPulledChangeId}` | `{changes[], nextCursor, hasMore}` |
| `/api/v1/sync/push` | POST | `SYNC` | 120/分钟/API | `{deviceId, sessions[]}` | `{nextCursor}` |
| `/api/v1/users/me` | GET | `READ` | — | — | `{id, email}`（账号归属） |

## `SyncSessionDto`（push 载荷字段）

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| `sessionUuid` | uuid | `@NotNull` | 客户端生成的会话身份；每用户唯一 |
| `projectName` | string | `@NotBlank` | |
| `language` | string | `@NotBlank` | 列宽 VARCHAR(50) |
| `startTime` | Instant | `@NotNull` | UTC ISO-8601 带 `Z` |
| `endTime` | Instant | `@NotNull` | 同上；与 startTime 相等会产生被所有统计跳过的退化行 |
| `clientModifiedAt` | Instant | `@NotNull` | LWW 输入 |
| `clientVersion` | int | `@PositiveOrZero` | 每次本地编辑递增 |
| `deleted` | boolean | — | 软删除标记 |

服务端**不校验** `startTime < endTime`（仅 DB 有 `CHECK (end_time >= start_time)`）——
客户端义务见 `principles.md` P2 与 `practices.md` 推送载荷一节。

## `SyncChangeDto`（pull 元素）

| 字段 | 类型 | 说明 |
|---|---|---|
| `changeId` | long | 单调递增；游标单位 |
| `sessionId` | uuid | 服务端主键 |
| `sessionUuid` | uuid \| 缺失 | 客户端身份；**服务端物理删除时为 null** |
| `op` | string | `UPSERT` \| `DELETE` |
| `serverVersion` | long | 该变更后的服务端版本 |
| `happenedAt` | Instant | 变更记录时刻 |
| `projectName`, `language` | string | 胜者快照（sessionUuid 为 null 时一并缺失） |
| `startTime`, `endTime`, `clientModifiedAt` | Instant | 同上 |
| `clientVersion` | int | 同上（null 时该场景为 0） |
| `deleted` | boolean | 同上 |

## 配置键（服务端）

| 键 | 默认 | 约束 |
|---|---|---|
| `ctt.sync.pull-batch-size` | 1000 | 1..10000；环境变量 `SYNC_PULL_BATCH_SIZE` |

## 错误码（同步路径）

| 场景 | Code | HTTP |
|---|---|---|
| 设备未知 / 他人 / 已吊销 | `COMMON_002` | 404 |
| 设备 ID 已被其他用户占用 | `DEVICE_001` | 409 |
| 缺 SYNC scope | `AUTH_020` | 403 |
| 限流 | `RATE_LIMIT_001` | 429（双信号退避） |
| 请求体校验失败 | `COMMON_003` | 400 |

## 会话表相关列（服务端）

| 列 | 作用 |
|---|---|
| `session_uuid` | 客户端身份，每用户唯一（`uk_coding_sessions_user_session_uuid`） |
| `client_version`, `client_modified_at` | 客户端 LWW 输入 |
| `server_version` | 服务端分配，每次被接受的变更递增 |
| `origin_device_id` | 首次推送设备（设备维度统计据此过滤） |
| `updated_by_device_id` | 最后写入设备 |
| `is_deleted`, `deleted_at` | 软删除状态 |

## 参考实现（可对照，勿修改）

`../code-time-tracker/src/main/kotlin/com/ahogek/codetimetracker/service/sync/`

| 文件 | 作用 |
|---|---|
| `SyncDtos.kt` | 线上 DTO（全字段可空 + 默认值，适配 Gson） |
| `SyncApiServiceImpl.kt` | 6 个实际调用的端点 |
| `SyncCoordinator` | `syncOnce()` = pull → push → pull；CAS 防重入 |
| `SyncSessionApplier` | 五种应用结局（P3） |
| `SyncSessionMapper` | 本地模型 ↔ DTO |
| `SyncScheduler` | 单线程守护、`scheduleWithFixedDelay`、默认 5 分钟、0 = 关 |
| `database/SyncCursorRepository.kt`（注意：不在 `service/sync/`） | 游标持久化，`MAX` 单调守卫，账号切换 `clear()` |
| `SyncHttpClient.kt` + `SyncKeyVault.kt` | 传输与凭据（凭据存 IDE 的 PasswordSafe，本仓库对应 `context.secrets`，见 `systemPatterns.md` 凭据存储） |

**设计文档**：`../code-time-tracker/memory-bank/docs/SYNC-CORE-DESIGN.md`（C 阶段同步核心，
含 3 步同步、8 项设计决策、失败与幂等表；其「同步仅在绑定时触发」一节已被 D 阶段取代，
定时与手动同步均已交付 —— 读该文档时注意区分）。

## 服务端代码映射

| 关注点 | 文件 |
|---|---|
| LWW 决策 | `sync/service/ConflictResolver.java` |
| pull / 游标 / 分页 | `sync/service/SyncPullService.java` |
| push / 批量写 / 副作用 | `sync/service/SyncPushService.java` |
| 游标原子 upsert | `sync/repository/SyncCursorRepository.java` |
| 变更日志查询 | `sync/repository/SessionChangeRepository.java` |
| 设备注册 / 吊销 | `device/service/DeviceService.java` |
| 分页配置 | `common/config/properties/SyncProperties.java` |
| 客户端对接指南（中文） | `dev-docs/sync/frontend-integration.md`（581 行） |

**注意**：`dev-docs/sync/frontend-integration.md` 与 memory-bank 领域文件均存在与源码的
偏差（如 `DELETE /devices/{id}` 的状态码、`AUTH_021` 的存在性）。**以源码为准**；
完整漂移表见 `../server-api/references.md`。
