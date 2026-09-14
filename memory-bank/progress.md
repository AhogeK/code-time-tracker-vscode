# Progress

> 里程碑进度。条目从「进行中」移入「已完成」时保留原描述（AGENTS.md R2）。

## Milestone Overview

| 里程碑 | 状态 | 目标版本 |
|---|---|---|
| 仓库初始化（GitHub + 分支策略） | ✅ 完成 | 0.0.1 |
| AI 协作架构（AGENTS.md + memory-bank + SKILL_GRAPH） | ✅ 完成 | 0.0.1 |
| 非 AI 项目内容（README/CONTRIBUTING/CoC/SECURITY/LICENSE） | ✅ 完成 | 0.0.1 |
| 本地追踪核心（活动监听 + 空闲检测 + 会话切分） | ⏳ 未开始 | — |
| SQLite 对接（与插件端同一个库） | ⏳ 未开始 | — |
| 统计与状态栏 | ⏳ 未开始 | — |
| 云同步（ctt-server 对接） | ⏳ 未开始 | — |

## 已完成

### 初期完善（2026-09-14，第二轮，0.0.1）

- **移除 `.opencode/`**：该命令机制是 `../code-time-tracker` 早期产物，当前工具链不再需要；
  同步清理 `AGENTS.md` / `.gitignore` / 领域文件中的全部引用。会话初始化改由 R1 直接约束
- **重建 `SKILL_GRAPH.md`**：旧索引（源自 ctt-web）有 **68 个幽灵条目**，且所列「内置技能」
  在当前 harness 中不存在。经用户授权后**从文件系统重新测绘**：
  `~/.agents/skills/` 368 + `~/.config/opencode/skills/` 64 = **432（去重后）**，
  按能力分 30 类，描述取自技能自身 `description` 字段。
  校验：零幽灵、零遗漏，分类计数与行数全部自洽
- **新增 R30**：把「只列真实存在的技能」固化为规则（禁幽灵、`~/.claude/` 不重复计数、
  描述不得编造、计数自洽 + 可重跑的 `comm` 校验命令）
- **补齐非 AI 项目内容**：`README.md`（重写，原为模板残留 + 重复 H1）、`CONTRIBUTING.md`、
  `CODE_OF_CONDUCT.md`（Contributor Covenant 2.0）、`SECURITY.md`（含本仓库范围界定）、
  `LICENSE`（**MIT**，用户选定）、`CHANGELOG.md`
- **记录三项架构决策**到 `techContext.md`「已决」：与插件端**同一个 SQLite 库**（路径已核实
  `~/.config/code-time-tracker/coding_data.db`，含真实数据）、**统计语义照 JetBrains 对齐**
  （须建语言字典）、**插件端做独立本地统计**

### AI 协作架构（2026-09-14，第一轮，0.0.1）

- **研究阶段**：5 个子 agent 并行调查 —— `../ctt-server`（AI 架构 + 同步/认证契约 + 统计契约，
  含源码级验证）、`../ctt-web`（AI 架构）、`../code-time-tracker`（AI 架构 + 产品与数据模型）
- **规则集**：`AGENTS.md` 30 条规则（R1–R30，**按数字顺序排列**），技术规范集中在 R9，
  语言边界明确化（代码/用户文档英文，AI 文件中文），领域知识库由 R29 治理
- **记忆库**：时间线层 5 文件 + 领域层 3 领域 × 5 件套（`ai-workflow` / `sync-client` / `server-api`）
- **工作流**：`.omp/`（含 `README.md` 权威说明）、`.editorconfig`、`.gitmessage`
- **规避的兄弟仓库缺陷**（研究阶段发现，本仓库不复制；**未修改关联项目**）：
  1. 兄弟仓库的 R5「记忆与代码同 commit」与 R6.5「AI 内容单独提交」自相矛盾 → 本仓库拆为
     「R5 管时序、R7 管粒度」两条，互不重复
  2. 规则编号物理乱序（ctt-server R23–R26 插在 R13 后）→ 本仓库按序
  3. 规则集混入不可移植的构建系统专属条款 → 本仓库 R9 内聚
  4. 手工维护的 `SKILL_GRAPH.md` 已漂移 → 本仓库重建并新增 R30 治理（第二轮完成）
  5. `.opencode/` 忽略语义陷阱 → 本仓库直接不使用该机制（第二轮移除）
- **服务端契约结论落库**：`sync-client` 与 `server-api` 两个领域文件记录了从源码验证的
  8 处「文档 vs 源码」不一致（详见 `domains/server-api/references.md`）
- **双轴独立审查**（逻辑 + 风格，互相不可见）：首轮均 FAIL，3 个 blocker + 多项 major 已逐条
  核实并修复 —— 含 push 游标误用、R6 自检死锁、领域层缺编号规则（促生 R29）、
  两个不存在的标识符。审查记录见 `.omp/plans/ai-architecture-plan.md`

### 仓库初始化（2026-09-14，0.0.1）

- `git init` + 首次提交（`README.md`）推送至 `origin/master`
- 建立 `develop` 分支（AI 工作分支）并推送
- 仓库：`git@github.com:AhogeK/code-time-tracker-vscode.git`（public，MIT）

## 进行中

（无）

## Backlog

- `docs/` 面向用户文档（扩展使用手册、同步故障排查）—— 功能落地后再写
- `.vsc-extension-quickstart.md` 是模板残留，可在首次发版前删除或改写

## 未决（需用户决策）

见 `techContext.md`「已决」末段的待细化项（SQLite 接入方式、库文件路径指向、语言字典形态、
空闲检测阈值）—— 均属架构级变更，AGENTS.md R8 要求先确认再实施。
