# server-api — practices

## HTTP 客户端的形状（待实现时对齐）

唯一的 HTTP 边界集中在一个模块里，业务代码不直接 `fetch`：

- 一处注入 `Authorization: Bearer <rawKey>`
- 一处统一解析信封（`$.code` 与 `$.data.code` 双路径，P2）
- 一处把错误码映射为面向用户的消息
- 一处实现退避（读 `Retry-After` 头 → `retryAfter` 体）

分散的 `fetch` 会让「错误码映射」出现 N 份，很快就互相不一致。

## 直接验证服务端行为（写 UI 之前）

```bash
# 统一入口：BASE 含 servlet context path
BASE=http://localhost:8080/ctt-server

# 账号信息（确认 Key 属于哪个账号）
curl -s "$BASE/api/v1/users/me" -H "Authorization: Bearer $KEY"

# 统计：注意时区参数是分钟数，不是时区名
curl -s "$BASE/api/v1/stats/summary?timezoneOffset=480" -H "Authorization: Bearer $KEY"

# 分布：type 必填，且**大写**
curl -s "$BASE/api/v1/stats/distribution?type=LANGUAGES&timezoneOffset=480" -H "Authorization: Bearer $KEY"

# 看完整错误形状
curl -s -i "$BASE/api/v1/stats/summary?timezoneOffset=9999" -H "Authorization: Bearer $KEY"
```

**先跑 curl 再写 UI 代码**：字段名、可空性、错误形状在真实响应里一眼可见，
比读文档靠谱（文档已多处漂移）。响应里**看不到**的字段就是 `null`（P3）。

## 参数易错点

| 参数 | 正确 | 错误 |
|---|---|---|
| 时区 | `timezoneOffset=480`（分钟，UTC 以东为正） | `zone=Asia/Shanghai`、`timezone=+08:00` |
| 分布类型 | `type=LANGUAGES`（大写） | `type=languages`（枚举绑定区分大小写） |
| 设备过滤 | `deviceId=<uuid>` **或** `ideName=VSCode` | 两个都传 → `400 COMMON_003` |
| 日期范围 | `start=2026-01-01&end=2026-12-31`（含两端） | 传时间戳 |
| 分页（recent） | `limit=20`（1..100） | 传 offset / page |

## 展示统计数字

- **不要**在本地重算服务端已给的聚合值 —— 两份实现必然漂移（P7）
- 需要本地即时反馈时，显式标注来源（「本地近似」vs「服务端」），必要时加刷新入口
- accumulate 维度的百分比要基于**该维度的总和**算，不是基于 `summary.total`；
  否则各项占比之和 ≠ 100% 会让用户以为数据坏了
- 时长单位统一：服务端返回**秒**（整数）。展示层负责格式化，不要在中间层换算

## 设备与 IDE 归因

- 注册设备时 `ideName` 填 `VSCode`（服务端 `ClientHeaderConstants` 的预期取值示例）
- **必须用独立 `deviceId`**，不要复用同机 JetBrains 插件的 —— 否则两个 IDE 在
  `distribution?type=IDES` 与 `ideName` 过滤里塌成一个桶（P8）
- 展示 IDE 维度时，措辞用「设备」或加说明，不要宣称是精确的每会话 IDE 归属

## 附：请求头（可选，非契约）

`X-Device-ID` / `X-Platform` / `X-IDE-Name` / `X-IDE-Version` / `X-App-Version` 会被服务端
解析进日志上下文（MDC），**不参与设备绑定或统计归因**。发送它们有利于排障关联，
但**不是**必需的，也不要期望它们影响任何业务结果。
