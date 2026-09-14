# server-api — meta

## Boundary

本仓库作为**客户端**调用 ctt-server 的一切通用面：认证（API Key / JWT）、响应与错误信封、
错误码语义、限流与重试、分页约定、以及**统计读接口**的消费。

**In scope**：如何拿到并携带凭据、如何解析成功与失败响应、错误码到用户消息的映射、
429 / 锁定的重试契约、`/api/v1/stats/**` 的消费语义（时长语义、时区参数、维度划分）、
`null` 字段在 JSON 中缺失的影响。

**Out of scope**：

- 同步写路径（`/api/v1/sync/**`、设备注册）→ [`sync-client`](../sync-client/meta.md)
- 服务端内部实现（聚合算法、物化表、缓存）→ 服务端自己的领域文件
- 本仓库的 HTTP 客户端组织方式（模块/分层）→ 待实现时写入 `systemPatterns.md`

## Owned paths

| 路径 | 角色 |
|---|---|
| 本仓库调用服务端的代码（待建，如 `src/server/`） | 唯一 HTTP 边界 |
| `memory-bank/domains/server-api/*` | 本领域知识 |

**只读对端**：`../ctt-server` —— 契约的唯一权威。**严禁修改**（AGENTS.md R3）。

## 术语

| 术语 | 含义 |
|---|---|
| 信封 | 成功响应的外层 `RestApiResponse{success,message,data,timestamp}` |
| 错误体 | 失败响应的 `ErrorResponse{code,message,details,traceId,httpStatus,timestamp,retryAfter}` |
| 两种错误形状 | 处理器路径 code 在 `$.code`；过滤器路径 code 在 `$.data.code`（见 `principles.md` P2） |
| merge 语义 | 时间轴维度：重叠区间合并，「同时开两个项目」只算一次墙钟时间 |
| accumulate 语义 | 类别维度：每个会话各自计入，「同时开两个项目」计两次 —— 总和**可以超过** `summary.total` |
| plugin parity | 统计口径由插件定义、**服务端为裁决者**；分歧时服务端正确 |
| `timezoneOffset` | 时区参数，**分钟数、UTC 以东为正**（不是时区名） |
| `non_null` | 服务端 Jackson 配置，null 字段**从 JSON 中省略**而非输出 `null` |

## Where to start

| 要做什么 | 从哪看起 |
|---|---|
| 第一次接服务端 | `references.md` 的端点表 → `principles.md` P1–P3 |
| 处理某个失败响应 | `principles.md` P2（两种形状）→ `references.md` 错误码表 |
| 展示统计数字 | `principles.md` P4–P5（时长语义）→ `practices.md` |
| 排查「数字对不上」 | `scenarios.md`「数字对不上」 |
| 需要服务端改动 | `scenarios.md`「需要服务端改动」（需求报告流程 + 报告格式） |
