# Progress 归档 — 第一至五轮（2026-09-14 → 2026-09-16）

> 冷数据归档（R15）。仅供回溯，不再更新。
> 从 `memory-bank/progress.md` 移出：条目均已完结，可复用的结论已沉入
> `memory-bank/domains/` 与 `techContext.md`；过程细节另见
> `.omp/plans/ai-architecture-plan.md`。

### 语言归一化：源码核实（2026-09-16，第五轮）

后端告知 ctt-server 已实现跨端语言归一化（v0.74.1+）。按 R31 **回源核对**——直接读服务端源码，
把这条从「方向转达」升格为「源码已核实」。

**核实结果**（`../ctt-server/src/main/java/com/ahogek/cttserver/language/`）：

| 项 | 事实 |
|---|---|
| 实现 | `LanguageVocabulary`（`@Component`）+ `CanonicalLanguage` + `LanguageType` |
| 词表 | 资源文件 `resources/language/vocabulary.json`，`version: 1`，92 规范名 / 75 别名 / 76 非语言值 |
| 匹配 | `strip().toLowerCase()` —— **大小写与首尾空白都不敏感** |
| 三种结局 | 已知非语言 → `Other`；已知语言 → 规范名 + 类型；**未识别 → 原样保留 + `recognized=false` + WARN，不并入 `Other`** |
| 发生时机 | **读取时**（`StatsCalculator.languageDistribution` 查询期），列里始终是原样值 |
| HTTP 暴露 | **无端点**；`unmappedValues()` 有意不公开（全局集合 vs 按用户隔离的读接口） |

**跑通服务端算法后的对照**（用户给的示例全部验证通过）：

```
typescript / TypeScript / TYPESCRIPT  →  TypeScript
java / JAVA                            →  Java
kotlin / Kotlin / KOTLIN               →  Kotlin
ignore(VS Code) / GitIgnore file(JB)   →  Ignore List   ← 跨端分歧被合并
shellscript                            →  Shell
textmate / ARCHIVE                     →  Other（已知非语言）
```

**schema 无变更**（已核实）：`coding_sessions.language` 仍是 `VARCHAR(50) NOT NULL`，
迁移目录无新增，与后端「本次无需协调迁移」的说法一致。
**归一化在读取时发生，所以历史数据无需回填** —— 这解释了为什么不需要迁移。

**落地位置**：`techContext`（升级为源码核实 + 对照表）、`sync-client/practices`（对照表 +
「未识别值安全」）、`server-api/principles`（**新增 P10**）、`server-api/references`（代码映射 +
版本溯源）、`activeContext`。

**教训**：这条最初只是「方向转达」，转达与核实之间隔着一层——核实后才发现
「历史回填」实际是**读取时归一化**的副作用，而非一批 UPDATE 语句。
**方向性描述能定调，但只有源码能定性**。

**状态**：✅ 完成。**待授权提交**。

### 接收后端方向并就地改正漂移（2026-09-15，第四轮）

ctt-server 后端转达三条方向，其中**第一条推翻了本仓库此前记录的一条判断**。按 R31
（知识回源与漂移检测）**就地改正**，未新增文件。

| # | 后端方向 | 改正内容 |
|---|---|---|
| 1 | **语言字段发原生值**：发 `document.languageId`（`typescript`），不转换不美化；归一化由服务端（GitHub Linguist 规范名） | 此前写的是「须与插件端使用同一套命名，需建语言字典」——**错的**。已改为「原样转发，本地不得自建映射表」 |
| 2 | **schema 由 JetBrains 插件统一管理** | 此前写的是「schema 必须逐列对齐 / 变更要与插件端同步」——不够硬。已改为「**变更权归插件端独占**，本插件不迁移、不加列、不改约束；需要新列走需求报告」 |
| 3 | 词表快照格式待后端提供对接文档 | 记为 `待确认`；**收到文档前不得自行设计格式** |

**顺带发现并修复一处自相矛盾**：`sync-client/principles.md` 的 P9 末尾写着 push 响应的
`nextCursor`「可直接作下一轮 pull 的起点」——这与第一轮审查修复的 blocker 直接冲突，
也与同文件 P4、`practices.md` 红线矛盾。已改为「游标只由 pull 响应推进」。
**这条说明：修一处判断时必须全库搜同类表述**，否则会留下互相打脸的记录。

**新增不变量 P10（客户端只转发事实，不做语义转换）**：把「什么由客户端做、什么由服务端做」
固化成表（语言 / 时长 / 时区 / schema），并给出红线——本地不得自建映射表或词表。

**改动文件**（全部为 AI 文件，无代码）：`techContext` / `projectbrief` / `systemPatterns` /
`domains/README` / `server-api/meta` / `sync-client/{meta,principles,practices}` /
`activeContext` / `progress`。

**状态**：✅ 完成。**待授权提交**。

### 知识库体系升级（2026-09-15，第三轮）

参照业界关于「让 AI 理解复杂存量系统」的实践，对照本仓库现状补齐五处缺口。

**核心判断**：知识应先对齐**领域**而不是先上 RAG——检索解决「找出可能相关内容」，
不解决「AI 是否已拿到做出完整工程判断所需的知识集合」。RAG 的定位是**长尾补证**：
结构里缺的细节去检索原始文档，确认后**回写**到结构里。

| # | 缺口 | 处理 |
|---|---|---|
| 1 | **无阅读路径**——AI 只能自己猜先读什么 | `domains/README.md` 新增**渐进式披露四层**（业务 → 架构 → 系统 → 基建）；R1 升级为按路径推进，并写明「不要跳层」 |
| 2 | 事实回源只有个例、无通则 | 新增按事实类型的**权威来源裁决表**，升格为 **R31** |
| 3 | **无新鲜度标记**（最危险的缺口） | 15 个领域文件全部补 `来源 ｜ 最后确认 ｜ 适用范围 ｜ 状态` 页头；状态三选一（`已核实` / `待确认` / `已过时`） |
| 4 | 元语只有平铺的「术语」表 | `projectbrief.md` 新增业务层**核心元语消歧**表；三个 `meta.md` 升级为「元语与消歧」（补**别名**与**非同义词**两列） |
| 5 | 漂移检测只有一句「就地改正」 | R31 明确触发条件与动作，并划定**自动化边界** |

**顺带修复的结构性缺陷**：`domains/README.md` 把「架构层」指向 `systemPatterns.md` 的关系图，
但那张图只有三行 ASCII。已补实为体系图 + **读写分离数据流表** + 归属与影响面问答表 + 三条不可越界约束。

**新增 R31**：知识回源与漂移检测。规则总数 30 → **31**。

**最要紧的一条消歧**（写入 `sync-client/meta.md`）：**游标 / watermark / push 响应的 `nextCursor`
三者必须区分**——把 push 响应游标用作 pull 起点会跳过本次 push 写下的 change（含服务端裁决结果），
客户端**永不收敛**。这是第一轮审查抓到的 blocker，现在成了元语表里的一条。

**验证**：31 条规则升序唯一；零悬空引用；40 条相对链接全部可解析；15 个领域文件页头齐全；
记忆文件最大 145 行（限 200）；`activeContext.md` 压缩 199 → 118 行。

**无代码改动，故不触发版本号提升**（R17 只管代码变更）。

**状态**：✅ 完成。**待授权提交**。

### 初期完善（2026-09-14，第二轮）

- **移除 `.opencode/`**：插件端早期机制，当前工具链不需要；会话初始化改由 R1 约束。
  **本仓库永久不设该目录**
- **重建 `SKILL_GRAPH.md`**：旧索引有 68 个幽灵条目 + 不存在的「内置技能」。从文件系统重新测绘
  **432 个技能**（`~/.agents/skills` 368 + `~/.config/opencode/skills` 64），按能力分 30 类，
  描述取自技能自身 `description`。零幽灵、零遗漏；新增 **R30** 治理
- **补齐非 AI 内容**：`README.md`（重写）、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、
  `SECURITY.md`、`LICENSE`（**MIT**）、`CHANGELOG.md`
- **三项架构决策**记入 `techContext.md`「已决」（语言对齐细节于第四轮被后端方向更正）

### AI 协作架构（2026-09-14，第一轮）

- **研究**：5 个子 agent 并行调查三个兄弟仓库（AI 架构 + ctt-server 同步/认证/统计契约，含源码级验证）
- **规则集**：`AGENTS.md`（现为 **R1–R31**，按数字顺序），技术规范集中在 R9，
  语言边界明确（代码/用户文档英文，AI 文件中文）
- **记忆库**：时间线 5 文件 + 领域层 3 领域 × 5 件套
- **契约落库**：`sync-client` / `server-api` 记录从源码验证的 **8 处「文档 vs 源码」不一致**
- **双轴独立审查**（逻辑 + 风格，互相不可见）：首轮均 FAIL，3 个 blocker 全部修复 ——
  push 游标误用（会导致永不收敛）、R6 自检死锁、领域层缺编号规则（促生 R29）
- **规避的兄弟仓库缺陷**（**未修改关联项目**）：R5/R6.5 自相矛盾 → 本仓库拆为「R5 管时序、
  R7 管粒度」；规则编号乱序 → 按序；构建系统专属条款混入规则集 → 收进 R9；
  `SKILL_GRAPH.md` 漂移 → 重建并加 R30；`.opencode/` 忽略陷阱 → 不使用该机制

*完整决策、审查记录与已否决方案见 `.omp/plans/ai-architecture-plan.md`。*

### 仓库初始化（2026-09-14）

- `git init` + 首次提交（`README.md`）推送至 `origin/master`
- 建立 `develop` 分支（AI 工作分支）并推送
- 仓库：`git@github.com:AhogeK/code-time-tracker-vscode.git`（public，MIT）
