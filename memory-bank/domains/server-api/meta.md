# server-api — meta

> 来源：`../ctt-server` 源码 + 其 `memory-bank/domains/{api-contract,auth-lifecycle,stats-aggregation}`
> 最后确认：2026-09-15 ｜ 适用范围：服务端调用面（读路径 + 通用约定） ｜ 状态：**已核实**

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

## 元语与消歧

**先消歧，再检索。** 同一个词在本领域与别处含义不同时，混用会让后续检索与设计从第一步就偏。

### 核心对象

| 元语 | 本领域的确定含义 | 别名 / 口语 | **非同义词（必须区分）** |
|---|---|---|---|
| 信封 | 成功响应外层 `RestApiResponse{success,message,data,timestamp}` | 「返回体」「响应」 | **错误体** `ErrorResponse` —— 形状不同，没有 `success`/`data` |
| 错误码位置 | code 出现在 JSON 的哪一层 | 「错误码」 | **`$.code` 与 `$.data.code` 是两条路径**：处理器路径在前者，过滤器路径在后者；只读一个会在「凭据坏了」时拿到 `undefined` |
| 统计 | 服务端聚合出来的权威数值 | 「数据」「报表」 | **本地近似值** —— 本仓库自己算的那份，两者**允许不等**（P7） |
| 语言 | 服务端 `language` 字段的取值 | 「语言」 | **VS Code `languageId`**（`typescript`）—— 命名与大小写都不同，是本项目已知的跨端对齐风险 |
| 时区参数 | `timezoneOffset`，**UTC 以东的分钟数** | 「时区」「zone」 | 时区名（`Asia/Shanghai`）、偏移字符串（`+08:00`）—— 都**不可用** |
| plugin parity | 口径由插件定义、**服务端为裁决者** | 「一致性」 | **「两端数字必须相等」不是它的含义** —— 类别维度本就允许不等（P4） |
| merge / accumulate / average | 三类时长语义 | 「时长」 | 三者**不可互相比较**；把 accumulate 归一化成 merge 是缺陷，不是修复 |

### 边界

- 「统计」在本领域**只读**；产生统计的写入路径属于 [`sync-client`](../sync-client/meta.md)
- 「语言」在这里是**消费方视角**（怎么送、怎么显示）；字典本身的对齐规则待建，见
  [`../sync-client/references.md`](../sync-client/references.md)

## Where to start

| 要做什么 | 从哪看起 |
|---|---|
| 第一次接服务端 | `references.md` 的端点表 → `principles.md` P1–P3 |
| 处理某个失败响应 | `principles.md` P2（两种形状）→ `references.md` 错误码表 |
| 展示统计数字 | `principles.md` P4–P5（时长语义）→ `practices.md` |
| 排查「数字对不上」 | `scenarios.md`「数字对不上」 |
| 需要服务端改动 | `scenarios.md`「需要服务端改动」（需求报告流程 + 报告格式） |
