# server-api — references

> 来源：**`../ctt-server` 源码**（v0.72.0 起逐条核对；v0.74.2 复查语言归一化）
> 最后确认：2026-09-16 ｜ 适用范围：端点 / 错误码 / 信封 / 漂移表 ｜ 状态：**已核实**

服务端 Spring Boot 4.1.1，Java 25。**Base URL 含 servlet context path `/ctt-server`**：
`http://host:8080/ctt-server/api/v1/...`（`application.yaml:60`）

## 认证

| 方式 | 头 | 适用 |
|---|---|---|
| API Key（IDE 客户端） | `Authorization: Bearer cttak_<8-char>_<32-char>` | 日常全部调用 |
| JWT（Web） | `Authorization: Bearer <jwt>` | 仅用于铸造 Key / 读 `/users/me` |

- Key 格式由 `ApiKeyHasher` 定义；服务端只存 SHA-256 + prefix，**原始 Key 只在创建时返回一次**
- 解析器 `ApiKeyAuthenticationFilter` 注册在 `BearerTokenAuthenticationFilter` **之前**，
  靠 `cttak_` 前缀区分；`ApiKeyAwareBearerTokenResolver` 对 `cttak_*` 返回 null
- Key 有效期由创建者指定（`expiresAt`，可空 = 永不过期）；每用户最多 20 个活跃 Key
- **JWT 绕过全部 scope 检查**；API Key 受 `@RequiresApiKeyScope` 约束（any-of，ADMIN 超集）

### Scope

| Scope | 授予 |
|---|---|
| `READ` | 统计、设备列表、资料读取 |
| `WRITE` | 设备吊销等非同步写操作 |
| `SYNC` | 设备注册、pull、push |
| `ADMIN` | 超集 |

## 统计端点（`/api/v1/stats`，全部需 `READ`，限流 60/60s/API）

| # | 方法 + 路径 | 查询参数 | 响应要点 |
|---|---|---|---|
| 1 | `GET /summary` | `timezoneOffset`(0)、`deviceId`、`ideName` | `today/dailyAverage/thisWeek/thisMonth/thisYear/total`，单位**秒** |
| 2 | `GET /heatmap` | `timezoneOffset`、`start`、`end`、`deviceId`、`ideName` | `points[]`：**密集**，范围内每天一条（含 0）；`end<start` **不报错**，返回空数组 |
| 3 | `GET /streaks` | `timezoneOffset`、`deviceId`、`ideName` | `current`、`max`（天） |
| 4 | `GET /distribution` | **`type`（必填）**、`timezoneOffset`、`start`、`end`、`deviceId`、`ideName` | `entries[]`：`{name, seconds}`，按 seconds **降序** |
| 5 | `GET /hourly` | `timezoneOffset`、`start`、`end`、`deviceId`、`ideName` | `points[]` **恒 24 条**，`{hour, averageSeconds}`；`activeDays` —— **均值** |
| 6 | `GET /week-hour` | 同上 | `points[]` 仅出现的格子，`{dayOfWeek(1=Mon..7), hour, averageSeconds}`；`weekdayCounts` —— **均值** |
| 7 | `GET /recent` | `limit`(20, 1..100)、`deviceId`、`ideName` | 会话数组：`sessionId/sessionUuid/projectName/language/startTime/endTime/durationSeconds` |
| 8 | `GET /heatmap-years` | `timezoneOffset` | `number[]` 降序 |
| 9 | `GET /heatmap-months` | `timezoneOffset` | `string[]`（`yyyy-MM`）降序 |
| 10 | `GET /ide-filters` | 无 | `string[]` 升序（读**设备注册表**，非会话） |
| 11 | `GET /achievements` | `timezoneOffset` | 成就数组；**不是只读**——会评估并写入解锁行 + Redis 缓存 60s |

### `type` 取值与语义

| type | 语义族 | 说明 |
|---|---|---|
| `LANGUAGES` | accumulate | 按 `language` 累加；**读取时**用 `LanguageVocabulary` 归一化到 GitHub Linguist 规范名 |
| `PROJECTS` | accumulate | 按 `projectName` 累加 |
| `TIME_OF_DAY` | **merge** | 按桶切时间轴 |
| `WEEKDAY` | accumulate | 键是**星期名**（`MONDAY`），按**起始时刻**的 ISO 星期 |
| `DEVICES` | accumulate | 标签来自设备注册表 `deviceName`；缺省 `Unknown device` |
| `IDES` | accumulate | 标签来自设备注册表 `ideName`；缺省 `Unknown IDE` |

`TIME_OF_DAY` 桶（与 JetBrains 插件对齐，左闭右开按小时）：
`NIGHT` 00:00–05:59 · `MORNING` 06:00–11:59 · `DAYTIME` 12:00–17:59 · `EVENING` 18:00–23:59

## 设备端点

| 方法 + 路径 | Scope | 限流 | 说明 |
|---|---|---|---|
| `POST /api/v1/devices` | `SYNC` | 10/小时/用户 | 注册（**同步前置**）；upsert，重注册会清除 `revokedAt` |
| `GET /api/v1/devices` | `READ` 或 `SYNC` | — | 设备列表（`data` 是数组） |
| `DELETE /api/v1/devices/{deviceId}` | `WRITE` | — | **返回 HTTP 200 + 信封**（不是 204） |

## 信封

```jsonc
// 成功
{ "success": true, "message": "Operation successful", "data": { }, "timestamp": "<ISO-8601>" }

// 失败（处理器路径）
{ "code": "COMMON_002", "message": "...", "details": [{"field":"deviceId","message":"..."}],
  "traceId": "...", "httpStatus": 404, "timestamp": "<ISO-8601>", "retryAfter": "<ISO-8601>" }
```

**过滤器路径**（API Key 认证 / terms 门 / JWT 入口）把 `ErrorResponse` 包在
`RestApiResponse.data` 里 → code 在 `$.data.code`（P2）。

`application.yaml:29`：`spring.jackson.default-property-inclusion: non_null` → **null 字段缺失**。
`success` 是原始 boolean，永远存在。

## 客户端应处理的错误码

| Code | HTTP | 含义 | 客户端动作 |
|---|---|---|---|
| `AUTH_010` | 401 | Key 无效 / 不属于你 | 终态：重配 Key |
| `AUTH_011` | 401 | Key 已过期 | 终态：重建 Key |
| `AUTH_012` | 403 | Key 已吊销 | 终态：重建 Key |
| `AUTH_020` | 403 | 缺所需 scope | 终态：重建含 scope 的 Key |
| `COMMON_001` | 400 | 请求参数非法（JSON 体畸形等） | 修请求 |
| `COMMON_002` | 404 | **不存在或不属于你**（设备类；stats 中 `ideName` 无匹配） | 注册设备后重试 |
| `COMMON_003` | 400 | 校验失败（`deviceId`+`ideName` 同时传 / `end<start` / `timezoneOffset` 越界 / 枚举错） | 修请求；`details[]` 有明细 |
| `COMMON_005` | 400 | 缺必填（`distribution` 无 `type`） | 补参数 |
| `RATE_LIMIT_001` | 429 | 限流 | 按双信号退避（P6） |
| `DEVICE_001` | 409 | 设备已属他人 | 换新 UUID |
| `SYSTEM_001` | 500 | 内部错误 | 退避重试，报 `traceId` |
| `SYSTEM_003` | 503 | Redis 连接错误 | **源码中从未抛出，勿写分支** |

**两个「定义了但从未抛出」的码**：`AUTH_021`（header 畸形 —— 畸形头会落到 JWT 链并返回
`AUTH_003`）与 `SYSTEM_003`。两者都只在 `ErrorCode.java` 有定义，全源码无抛出点。
**不要为它们写分支。**

## 文档 vs 源码：已确认的漂移（实现时以源码为准）

| # | 文档说 | 源码事实 | 位置 |
|---|---|---|---|
| 1 | `DELETE /devices/{id}` → 204 | **200 + 信封** | `DeviceController.revokeDevice` |
| 2 | `AUTH_021` 是需要处理的错误码 | 从未抛出 | `ErrorCode.java` 仅有定义 |
| 3 | 端点表的参数列写作 `zone`，与 Cookie 属性同名易混 | 线上参数名是 **`timezoneOffset`**（分钟数）；`zone` 只是该文档的简写 | `StatsController.java` 各方法 |
| 4 | `refresh-token-ttl-plugin` = 14d | 所有签发点都传 `WEB` → 实际 30d | `common/config/properties/SecurityProperties.java:44-45`；签发点 `UserLoginService` / `TokenRefreshService` / `OAuthLoginOrRegisterService` |
| 5 | OAuth authorize 返回 `{code,message,data}` | `RestApiResponse{success,message,data,timestamp}` | `OAuthCallbackController` |
| 6 | 统计端点声明 400 | `@ApiResponses` 中**无** 400（但确实会返回） | `StatsController.java` |
| 7 | `/api/v1/stats/dashboard` | **不存在** | 全源码 grep 无命中 |
| 8 | `LoginResponse.expiresIn` 示例 3600 | 实际 **900**（15m） | `SecurityProperties.java:43` |

## 源码验证的行为事实（非文档）

- `heatmap` 对 `end < start` **不校验**（返回 200 + 空数组），而 `distribution`/`hourly`/`week-hour`
  返回 `400 COMMON_003`
- `hourly` / `week-hour` 在切片循环内做 `toSeconds()`，与「只截断一次，再用最大余数法分配」的
  不变量相悖；因两者是均值维度、不与 `summary.total` 对账，未构成实际违约
- push 请求**没有**批量上限（仅 `@NotEmpty`）；1000 的上限只存在于 pull 侧
  （`ctt.sync.pull-batch-size`）
- `GET /api/v1/users/me` **无** scope 注解，任何已认证凭据均可访问；
  响应为 `UserProfileResponse`（9 字段：`id`、`email`、`displayName`、`emailVerified`、
  `emailChangePending`、`hasPassword`、`createdAt`、`lastLoginAt`、`termsVersion`）

对应的客户端动作见 `principles.md` P9。

## 代码映射

| 关注点 | 文件 |
|---|---|
| 统计端点 | `stats/controller/StatsController.java` |
| 统计服务（过滤/来源选择/选项表） | `stats/service/StatsService.java` |
| 统计计算（纯函数） | `stats/service/StatsCalculator.java` |
| 信封 | `common/response/{RestApiResponse,ErrorResponse}.java` |
| **语言归一化** | `language/{LanguageVocabulary,CanonicalLanguage,LanguageType}.java` + 资源 `resources/language/vocabulary.json` |
| 错误码注册表 | `common/exception/ErrorCode.java` |
| 异常→响应 | `common/exception/GlobalExceptionHandler.java` |
| 设备 | `device/{controller,service,dto}/` |
| 请求头常量 | `common/context/ClientHeaderConstants.java` |
