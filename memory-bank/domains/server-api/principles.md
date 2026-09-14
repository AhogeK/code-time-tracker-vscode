# server-api — principles

## P1. 源码是契约；文档是线索

`../ctt-server` 的**源码**是唯一权威。文档（含其 memory-bank 领域文件、`dev-docs/`）
已发现多处与源码不一致，**不得**据此实现。

已确认的漂移（完整表见 `references.md`）：`DELETE /devices/{id}` 文档写 204、源码返回 **200**；
`AUTH_021` 文档列出、源码**从未抛出**；时区参数文档写 `zone`、实际是 `timezoneOffset`；
`refresh-token-ttl-plugin` 配置存在但**不可达**。任何契约断言都应能指到源码文件。

## P2. 错误体有两种形状，客户端必须都接受

这是最容易踩的坑，且**只在过滤器路径出现**：

| 产生者 | code 的 JSON 路径 |
|---|---|
| `GlobalExceptionHandler`（业务异常、校验、类型不匹配、数据完整性、系统异常） | `$.code` |
| `ApiKeyAuthenticationFilter`、`TermsCheckFilter`、`JwtAuthenticationEntryPoint` | `$.data.code` |

**解析规则**：先看 `$.code`，为空再看 `$.data.code`。只读一个路径会在「凭据坏了」这条
最需要清晰报错的路径上拿到 `undefined`。

成功路径永远有 `$.success === true` 且数据在 `$.data`；错误路径**没有** `success`、
**没有** `data`（除上述过滤器路径）。

## P3. `null` 是「字段不存在」

服务端配置 `spring.jackson.default-property-inclusion: non_null`（`application.yaml:29`），
**null 字段从 JSON 中省略**。

推论：

- 类型定义里所有可空字段都必须是 `optional`（`foo?: T`），并给默认值
- **不要**写 `if (obj.field === null)` 这类判断 —— 该分支永不成立；应判 `undefined` 或直接给默认值
- 受影响的典型字段：`details`、`retryAfter`、`unlockedAt`、`windowStart`、`windowEnd`，
  甚至整个 `data` 都可能缺失
- `success` 是原始 `boolean`，**永远存在**

## P4. 两种时长语义并存是设计，不是 bug

| 语义 | 适用维度 | 不变量 |
|---|---|---|
| **merge**（合并/并集） | summary、heatmap、streaks、TIME_OF_DAY | 各桶之和 **等于** `summary.total` |
| **accumulate**（累加） | LANGUAGES、PROJECTS、WEEKDAY、DEVICES、IDES | 各项之和 **≥** `summary.total`，超出部分是并行工作时间 |
| **average**（均值） | hourly、week-hour | 返回**活跃日均值**，**不与** `summary.total` 对账 |

**客户端不得「修正」类别维度使其总和等于总览。** 同时开两个窗口、不同语言，是 1 秒墙钟时间
但 2 秒语言归属时间。把类别维度改成 merge 会丢失用户真实想知道的信息。

`hourly` 与 `week-hour` 是**均值**维度，不是求和 —— 拿它们和 `summary.total` 比较是范畴错误。

## P5. 时区先移，再分桶

服务端把存储的 UTC `Instant` **先**移到调用方时区，**再**做日/周/月/时桶划分。
同一会话对 UTC+8 与 UTC 调用方可能落在不同的「天」甚至不同的「月」。

- 参数名 `timezoneOffset`，值 = **UTC 以东的分钟数**（`-720..720`，默认 `0`）
- 本仓库应始终发送**本机实际偏移**；省略则得到 UTC 分桶，会与用户本地直觉（以及
  JetBrains 插件的本地分桶）不一致
- 周起点是 **ISO 周一**

## P6. 限流与锁定用双信号，重试要看它

429（以及账户锁定的 403）**同时**携带：

- `Retry-After` **响应头** —— 增量秒数
- `retryAfter` **响应体字段** —— ISO-8601 绝对时刻

**取值顺序**：响应头优先，响应体兜底。两者都缺 = 「稍后再试」（Redis TTL 不可得）。
不应把 4xx 业务错误纳入重试；`AUTH_010/011`、`AUTH_012/020` 是**终态**——
要用户重新配置凭据，重试只会一直失败。

## P7. 服务端拥有统计语义，本仓库不定义

统计口径由 JetBrains 插件定义、**服务端为 tie-breaker**（plugin parity）。
本仓库是**第三个客户端**（Web、JetBrains、VS Code），不参与语义定义。

推论：

- 不要把服务端数字在本地「重算一遍再显示」——两份实现必然漂移
- 需要本地即时反馈（如状态栏）时，必须**显式区分**「本地近似」与「服务端权威」两个来源，
  并在 UI 上让用户能分辨
- 与服务端数字分歧时，**服务端正确**；分歧本身是需求报告素材，不是改服务端去迁就的理由

## P8. IDE 维度是设备粒度的近似，不是每会话真相

同步协议**不携带每会话的 IDE 名称**。`distribution?type=IDES` 与 `ideName` 过滤器都读取
**设备注册时**写入的 `devices.ide_name`。

推论：同一台机器上，若 VS Code 与 JetBrains 插件共用 `deviceId`，两个 IDE 的会话会
塌进同一个桶。**本仓库必须用独立的 `deviceId`**，`ideName` 取 `VSCode`（服务端
`ClientHeaderConstants` 已把这作为预期取值示例）。

同理 `origin_device_id` 在会话创建时**一次性写入、永不重写**：本仓库采用的是既有的本地会话时，
它们会永久归属原设备。

## P9. 服务端的不一致由客户端兜住，不要依赖它一致

服务端有几处**同族端点行为不一致**与**未声明的可达状态**（源码验证，非文档承诺）：

- `heatmap` 对 `end < start` 不校验（返回 200 + 空数组），而 `distribution`/`hourly`/`week-hour`
  返回 `400 COMMON_003`
- 统计端点的 `@ApiResponses` **没有声明 400**，但 400 确实会返回（`COMMON_003` / `COMMON_005`）
- 两个错误码 `AUTH_021`、`SYSTEM_003` **定义了但从未抛出**

**客户端义务**：自行校验日期范围与必填参数，把「服务端可能返回 400」当成常态纳入错误处理，
不要为从未抛出的码写分支。把这些不一致当作**去实现绕过的理由**是错的 ——
正确做法是**不依赖它们的对称性**，并在必要时走需求报告流程（R3）。
