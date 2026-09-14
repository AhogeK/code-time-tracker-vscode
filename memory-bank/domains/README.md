# Domain Knowledge Map — code-time-tracker-vscode

本项目的领域优先知识库，由 **AGENTS.md R29** 治理（文件集与生长规则在规则文件里，此处为入口索引）。

## 两层分工

| 层 | 位置 | 回答 | 性质 |
|---|---|---|---|
| 时间线 | `memory-bank/*.md` | 「正在发生什么 / 刚改了什么」 | 按时序，会被时间取代 |
| **领域（本目录）** | `memory-bank/domains/<domain>/` | 「这里什么是真的、该怎么做」 | 持久，经过判断，**永不作为 changelog** |

横切规范（命名、Disposable 所有权、线程模型、日志）留在 `systemPatterns.md`。
领域文件只承载**领域专属判断**，**不得重复**横切内容——需要时链接过去。

## 领域

| 领域 | 范围 | 入口 |
|---|---|---|
| [`ai-workflow`](./ai-workflow/meta.md) | Agent 在本仓库如何工作：记忆维护、版本号、原子提交、验证证据、资源归属、只读边界 | `ai-workflow/meta.md` |
| [`sync-client`](./sync-client/meta.md) | 与 ctt-server 的同步引擎（**写路径**）：设备注册、pull/push、游标、LWW 冲突、批量原子性、幂等重试 | `sync-client/meta.md` |
| [`server-api`](./server-api/meta.md) | 服务端调用面（**读路径 + 通用约定**）：认证（API Key / JWT）、响应与错误信封、错误码、限流与重试、统计端点消费 | `server-api/meta.md` |

**为什么是 3 个而不是照搬 ctt-server 的 4 个**：本仓库是**客户端**。ctt-server 把
`auth-lifecycle` 与 `api-contract` 分开，是因为它同时**实现**认证流程与**产出** API 契约；
本仓库只**消费**两者，拆开会让「怎么调用服务端」这一件事被切成两半、大量互相引用。
故合并入 `server-api`。ctt-server 的 `stats-aggregation` 对应本仓库的统计读接口消费，
归入 `server-api`；写入侧的同步语义单独成 `sync-client`。

## 每个领域的文件集（AGENTS.md R29 —— 建成即填实，禁止占位）

| 文件 | 承载 | 何时读 |
|---|---|---|
| `meta.md` | 边界、负责路径、术语、从哪看起 | 还不确定本领域是否适用 |
| `principles.md` | 不变量与第一性原理——冲突时的裁决依据 | 两个方案冲突，需要判定规则 |
| `scenarios.md` | 触发 → 判断 → 动作 | 出现了似曾相识的问题 |
| `practices.md` | 具体做法、参数、代码形状、踩过的坑 | 知道要做什么，需要做对 |
| `references.md` | 事实：端点、错误码、字段表、文件路径 | 需要查事实，不需要判断 |

## 生长规则

- **按需建档**：只在确有可复用知识时创建领域。空领域是违规，不是占位符——**宁可少而实**。
- **先归类**：新知识先判断归属领域，更新对应文件；无领域匹配才新建五件套。
- **索引同步**：本文件（表格）必须与目录实际内容一致。
- **红线清单与五件套定义在 R29**，此处不重复——重复即会漂移。

领域名用 `kebab-case`，命名**能力或知识领域**而非文档类型；
两个领域的 `principles.md` 若开始大面积重合，它们就是一个领域——合并。
