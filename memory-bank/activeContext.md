# Active Context

> 本文件只记「现在与最近」。**跨轮次可复用的判断在 [`domains/`](./domains/README.md)**（AGENTS.md R29）。
> 超 30 天或超 200 行的条目按 R15 归档至 `memory-bank/archives/`。

## Current Status

- **阶段**：初期完善（脚手架 + AI 架构 + 项目文档），**尚无业务功能**
- **版本**：`0.0.1`（`package.json`）
- **分支**：`develop`（AI 工作分支；`master` 为发布分支，保持无 AI 文件）
- **验证**：`pnpm run compile` 通过（tsc + eslint + esbuild，0 error 0 warning）

## 领域索引

| 领域 | 何时读 |
|---|---|
| [`ai-workflow`](./domains/ai-workflow/meta.md) | 关于「AI 在本仓库怎么工作」：记忆维护、版本、提交、验证、资源归属 |
| [`sync-client`](./domains/sync-client/meta.md) | 实现/调试同步引擎：pull/push、游标、LWW、设备注册（**写路径**） |
| [`server-api`](./domains/server-api/meta.md) | 调用服务端：认证、信封、错误码、分页/重试、统计读接口 |

## 已决的架构基线（2026-09-14，用户确认）

1. **本地存储与插件端同一方案、同一个库、数据共通** —— SQLite，文件
   `~/.config/code-time-tracker/coding_data.db`（已核实存在且含真实数据）。schema 必须逐列对齐，
   两端并发写同一文件需按 SQLite 锁语义设计。详见 `techContext.md`「已决」
2. **统计语义照 JetBrains 插件对齐** —— 后续必须建立**编程语言字典**并跨端同步，
   否则 `LANGUAGES` 维度会因命名不一致而分裂
3. **插件端做独立的 IDE 端统计** —— 与 JetBrains 插件类似，本地视图不依赖服务端

---

## [2026-09-14] 初期完善（第二轮）

### 移除 `.opencode/`

`.opencode/commands/` 的 boot/save 是 `../code-time-tracker` 早期使用的机制，用户当前工具链
（oh-my-opencode / omp）不再需要。**已删除整个 `.opencode/` 目录**，并同步清理：

- `AGENTS.md` 全部 `.opencode/` 引用 → 改为 `SKILL_GRAPH.md` 或删除
- `.gitignore` 移除 opencode 生成物忽略块
- `ai-workflow/{meta,references}.md` 的 owned paths / 布局表

会话初始化改由 **R1** 直接约束（先读 `AGENTS.md` → `memory-bank/` → 识别领域），不走命令文件。

### 新增 SKILL_GRAPH.md（重建，非沿用）

旧索引（源自 ctt-web）有 **68 个幽灵条目**——列了本机不存在的技能，且「内置技能」列表
（playwright / frontend / git-master 等）在当前 harness 中**根本不存在**。

本次**从文件系统重新测绘**（用户明确授权）：

| 来源 | 路径 | 数量 |
|---|---|---|
| 用户技能 | `~/.agents/skills/<name>/SKILL.md` | 368 |
| opencode 技能 | `~/.config/opencode/skills/<name>/SKILL.md` | 64 |
| **去重后** | | **432** |

- `~/.claude/skills/` 是 229 个指向 `~/.agents/skills/` 的**符号链接**，属镜像，**不重复计数**
- `~/.codex/skills/` 与 `~/.omp/agent/managed-skills/` 均为空
- 按**能力**分 30 类（思维/工程/审查/测试/设计/文档/图示/检索/浏览器/Git/科研/生信/化学/ML/
  数据/科学计算/地理 + CLI-Anything 10 组 + Nature/GStack/Doko 三系列）
- **描述取自技能自身 `description` 字段**，仅压缩长度不改语义
- 校验：列出的 432 个 = 实际的 432 个，**零幽灵、零遗漏**；分类计数与行数全部自洽

### 新增 R30：SKILL_GRAPH.md 维护

把「只列真实存在的技能」固化为规则：禁止幽灵条目、`~/.claude/` 不重复计数、
描述不得编造、计数必须自洽，并给出可重跑的 `comm` 校验命令。

### 补齐非 AI 项目内容

| 文件 | 内容 |
|---|---|
| `README.md` | 重写（原为 VS Code 模板残留 + 重复 H1）：定位、family 关系、规划中的功能、依赖、开发命令、里程碑、协议 |
| `CONTRIBUTING.md` | 环境准备、F5 调试、命令表、代码规范（含 VS Code 特有陷阱）、提交信息、PR 流程、Bug/需求报告、隐私与安全 |
| `CODE_OF_CONDUCT.md` | Contributor Covenant 2.0（沿用插件端，联系邮箱一致） |
| `SECURITY.md` | 支持版本、私下报告流程、**本仓库的范围界定**（凭据必须进 SecretStorage、数据默认不外发、范围外事项） |
| `LICENSE` | **MIT**（用户选定；与 ctt-web / ctt-server 一致） |
| `CHANGELOG.md` | Keep a Changelog 格式 + 比较链接 |

### 记录三项架构决策

写入 `techContext.md`「已决」，含由「同一个库」直接推出的 6 条强制后果与 4 项待细化事项。

**状态**：✅ 文件已建立。**待授权提交**。

---

## [2026-09-14] AI 协作架构初始化（第一轮）

**背景**：本仓库是 `../code-time-tracker`（JetBrains 插件）的衍生项目，仅有 VS Code 扩展脚手架。

**研究**（5 个 scout 子 agent 并行，只读）：

| 调查项 | 关键产出 |
|---|---|
| ctt-server AI 架构 | 28 条规则、memory-bank 两层结构、archive 按月分片、`.omp/` 产物约定、commit/branch 政策 |
| ctt-web AI 架构 | 26 条规则、domains 4 领域、`.omp/README.md` 权威说明、3 条规则带事故记录 |
| code-time-tracker AI 架构 + 产品 | 28 条规则、`CodingSession` 12 字段、`sync_cursor`/`app_user` 表、同步 A–E 阶段全部已实现 |
| ctt-server 同步/认证契约 | 端点/DTO 字段级验证，发现 **8 处文档 vs 源码不一致** |
| ctt-server 统计契约 | 会话唯一入口是 sync push；三种时长语义（merge/accumulate/average）；`timezoneOffset` 参数名纠正 |

**建立的文件**：`AGENTS.md`（R1–R30）、`memory-bank/`（时间线 5 文件 + 3 领域 × 5 件套 +
`domains/README.md`）、`.omp/`（`README.md` + 计划）、`.editorconfig`、`.gitmessage`、`.gitignore`。

**规避的兄弟仓库缺陷**（**未修改任何关联项目文件**）：兄弟仓库的 **R5/R6.5 自相矛盾**、
规则编号乱序、技术规范混入规则集、`SKILL_GRAPH.md` 漂移、`.opencode/` 忽略语义陷阱。

**服务端契约落库**（源码验证，非文档转抄）：

- `sync-client`：LWW 固定优先级链、游标数学（`max(watermark, clientCursor)`）、
  批内原子性、失败可重试语义、`origin_device_id` 与 `updated_by_device_id` 的区别、
  **push 响应的 `nextCursor` 不得用作 pull 起点**（会跳过本次 push 的 change）
- `server-api`：两种错误体形状（`$.code` vs `$.data.code`）、`non_null` 导致 null 字段缺失、
  429 双信号重试契约、`AUTH_021` 与 `SYSTEM_003` 均从未被抛出、
  `DELETE /devices/{id}` 实为 200（非文档所称 204）、`GET /users/me` 无 scope 注解

**双轴独立审查（逻辑 + 风格，互相不可见）**：首轮均判 FAIL，共 3 个 blocker + 多项 major，
已逐条核实并全部修复：

- **blocker** 同步循环把 push 响应的 `nextCursor` 当作下一轮 pull 起点 → 改为「push 不推进
  pull 游标」，引用参考实现的 SYNC-CORE-DESIGN 决策 #1
- **blocker** R6 提交前自检缺 memory-bank 豁免项（与 R5/R7 死锁）→ 恢复豁免项
- **blocker** 领域知识库无编号规则且被误引为 R28 → 新增 **R29: 领域知识库**
- **blocker** `references.md` 中 `_HttpClient`、`SecretStore` 两个不存在的标识符 → 改为真实标识符
- 其余 major：`DisposableStore` 非公开 API、Node16 `.js` 后缀说法不成立（已实测）、
  R13/R22 日志矛盾、30/90 天双阈值、`week-hour` 语义归属、`.opencode/.gitignore` 自忽略陷阱、
  R5/R7 重复陈述、`.omp/README.md` 规则引用错号

审查中**未采纳**一条：报告称 `../code-time-tracker` 无 E 阶段，但该仓库
`activeContext.md:126` 记录了 E phase（其 `progress.md` 反而滞后——正是 P10 描述的陈旧记忆）。

---

## 待办线索

- **实现前必须细化**（`techContext.md`「已决」末段）：SQLite 接入方式、库文件路径指向、
  语言字典形态、空闲检测阈值
- **首次业务开发前**：先定 SQLite 接地方案（影响打包体积与原生依赖，属 R14 依赖决策）
- **技能索引**：任何时候新增/删除技能后，按 R30 重跑校验命令
