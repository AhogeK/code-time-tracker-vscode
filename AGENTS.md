# AGENTS.md - 项目记忆与行为约束

> 本文件由 AI 自动维护，人类请勿手动编辑
>
> 语言边界：代码/注释/日志/README/CHANGELOG/docs 用英文；**本文件、`memory-bank/`、
> `SKILL_GRAPH.md`** 用中文（AI 与用户的交互语言）。详见 R9。
>
> **本文件只承载约束与路由，不承载事实。** 事实在 `memory-bank/`（结构化知识），
> 技能在 `SKILL_GRAPH.md`。想在规则文件里找事实，找错地方了。

## 知识地图（先看这里）

| 你要做的事 | 先读 | 再读 |
|---|---|---|
| 会话开始 | 本文件（约束） | `memory-bank/` 全部（R1） |
| **需求消歧**：这个词指什么 | [`projectbrief.md`](memory-bank/projectbrief.md)「核心元语」 | 领域 `meta.md` 的「元语与消歧」 |
| 定位该改哪个模块 | [`systemPatterns.md`](memory-bank/systemPatterns.md) 体系图 | `domains/*/meta.md` 的 Owned paths |
| 调用服务端 | [`domains/server-api/meta.md`](memory-bank/domains/server-api/meta.md) | 其 `references.md`（端点 / 错误码） |
| 实现或调试同步 | [`domains/sync-client/meta.md`](memory-bank/domains/sync-client/meta.md) | 其 `principles.md` → `practices.md` |
| 提交 / 版本 / 分支 | 本文件 R6 / R7 / R17 / R20 | [`domains/ai-workflow/practices.md`](memory-bank/domains/ai-workflow/practices.md) |
| 选技能 | `SKILL_GRAPH.md` | `read skill://<skill-name>` |
| 判断某条知识是否可信 | 领域文件页头的「来源 / 状态」 | [`domains/README.md`](memory-bank/domains/README.md)「事实回源」 |

**阅读路径遵循渐进式披露**（业务层 → 架构层 → 系统层 → 基建层，见
[`domains/README.md`](memory-bank/domains/README.md)）。**不要从系统层直接起步**——
在没确认「需求说的是什么」之前就 grep 代码，会把同名不同义的概念混在一起，
这是「局部正确、整体错误」的主要来源。

## 核心规则

### R1: 会话初始化

每次会话开始，**先读 `AGENTS.md`**（它是约束，不是背景资料），再读 `memory-bank/` 下所有文件
（projectbrief / techContext / systemPatterns / activeContext / progress），缺失则创建。

然后按**渐进式披露**路径推进，**不要跳层**（完整定义见
[`domains/README.md`](memory-bank/domains/README.md)）：

1. **消歧**（业务层）—— 需求里的词在本项目指什么 → `projectbrief.md`「核心元语」+ 领域 `meta.md`
2. **定位**（架构层）—— 涉及哪些模块与契约 → `systemPatterns.md` 体系图 + `domains/*/meta.md` 的 Owned paths
3. **深入**（系统层）—— 该领域的 `principles.md`，再按需 `scenarios` / `practices` / `references`
4. **基建层** —— 提交、版本、分支规则见本文件 R6 / R7 / R17 / R20

**跳过第 1 步就 grep 代码，会把同名不同义的概念混在一起**——这是「局部正确、整体错误」的主要来源。
跳过第 3 步则是同一个错误重犯的来源：规则只说「不要 X」，而**为什么**与已否决的替代方案在领域文件里。

### R2: 记忆更新（强制实时）

**严禁滞后更新** —— 留到会话结束再写会造成断片。响应完成后**立即**按触发条件更新：

| 触发条件 | 更新文件 | 更新内容 |
|---|---|---|
| 代码修改 | `activeContext.md` | 具体变更 + 日期前缀 `[YYYY-MM-DD]` |
| 任务完成 | `progress.md` | 完成项移入已完成 |
| 架构决策 | `systemPatterns.md` 或对应领域文件 | 新模式 / 设计决策与理由 |
| 技术栈变化 | `techContext.md` | 依赖 / 版本变更 |
| 面向用户的变更 | `README.md` | API / 功能 / 里程碑（R4） |

**分类先于落笔**：可复用的判断 → 领域文件；仅「最近发生了什么」→ `activeContext.md`；
里程碑 → `progress.md`；没有新知识 → **什么都不记**（禁止为凑数灌水）。

### R3: 关联项目（只读红线）

`../ctt-server`（后端）、`../ctt-web`（Web 前端）、`../code-time-tracker`（JetBrains 插件端）
均为**只读**关联项目。

- **允许且必须**：读取其源码/文档验证契约（DTO 字段、端点、认证协议、错误码、同步语义）。
  涉及服务端交互时**不猜测接口形状**，先读源码。
- **严禁修改关联项目任何文件**（含源码/测试/文档/版本号），无论任何理由。
- 本仓库是该体系的**第三个客户端**；统计语义由服务端裁决，见
  [`domains/server-api/principles.md`](memory-bank/domains/server-api/principles.md) P7。

**需求报告流程**（当工作依赖关联项目改动时）：

1. 绝不自行修改关联项目 —— 哪怕实现缺失、契约不符，也只在本仓库适配或提需求
2. 输出**可复制的需求报告**到 `.omp/<topic>-requirement.md`，五段齐全：
   现状 / 期望行为 / 理由 / 影响面 / 验收标准
3. 报告交用户，由用户联系该项目负责人（AI 不跨项目实施）
4. 负责人完成后结果反馈用户 → 用户转达 → 本仓库对接（仍不碰关联项目）

### R4: README 同步

重大变更（功能 / 架构 / 部署 / 里程碑）时同步更新 `README.md`。

版本号变更时同步 README 中**已有的**版本标识（当前 README 无版本标识，写入时一并补上并在此登记）。

### R5: AI 文件与提交同步

`memory-bank/`、`AGENTS.md`、`SKILL_GRAPH.md` 等 AI 文件的变更必须与**触发它的那次工作**在
同一轮推送内完成，禁止「先写代码，过几天补记忆」。

**提交粒度见 R7**（AI 内容独立成 commit）——本条只规定**时序**，R7 规定**拆分方式**。

### R6: Git 操作确认（强制）

**核心原则：单次交互授权。提交授权仅限当前变更，用完即失效。**

#### 授权范围

| 操作类型 | 授权有效期 | 说明 |
|---|---|---|
| `git commit` / `git push` | **仅当前变更** | 授权仅针对用户指明的那些文件/变更 |
| `git status` / `log` / `diff` / `show` | 无需授权 | 只读操作，可自主执行 |
| `git branch` | 仅创建分支 | 不包含后续 commit / push |
| `gh pr create` / `merge` | 需单独授权 | 与 commit 授权独立 |

#### 触发关键词

| 关键词 | 含义 | 示例 |
|---|---|---|
| `提交` / `commit` | 执行 commit（不含 push） | 「提交这个变更」→ 仅 commit |
| `推送` / `push` | 执行 push（不含 commit） | 「推送」→ 仅 push |
| `提交并推送` | commit + push | 「提交并推送」→ commit 然后 push |
| `提交然后X` | commit + 继续 X | commit 后继续 X，**X 完成后需新授权** |
| `检查` / `查看` / `review` | 只读 | 不执行任何写操作 |
| `做吧` / `继续` | 执行需确认 | 明确动作 + 变更范围 |

#### 红线（绝对禁止）

1. **授权不延续**：用户对变更 A 的授权 ≠ 对变更 B 的授权
2. **模糊话术不算授权**：「可以」「没问题」「通过」「审查通过」「看起来不错」—— 必须含明确动作词
3. **修复指令 ≠ 提交指令**：「修好它」授权的是**修改动作**；改完停下等审查/提交指令
4. **前瞻动词不携带提交授权**：「提交并推送，然后继续实施下一阶段」—— 授权在 push 后**立即闭合**，
   后续阶段的提交需重新授权
5. **工具建议不算授权**：code reviewer 说「可以提交」≠ 用户授权

#### 执行前强制自检

**每次 commit/push 前必须逐项检查：**

```
□ 用户是否在【当前交互】中说了「提交 / commit / 推送 / push」？
□ 用户说的是提交【哪些变更】？（确认文件范围）
□ 是否有用户未明确授权的额外变更？（memory-bank 除外，见 R5）
□ 用户是否说了任何模棱两可的话？（「可以」「没问题」→ 不算授权）
□ 本回合用户消息中是否有提交/推送关键词？没有 → 一律不得提交，
  不得以「上一轮授权过」「已在流程中」为由提交
```

**机械判定法（防自我说服）**：动手前先在本回合用户消息里**字面搜索** `提交` / `commit` /
`推送` / `push`。命中 → 可提交（严格限于其指名的变更）；未命中 → **禁止提交**，改为报告 +
收尾写「待授权提交」后停止。

**任何一项不确定 → 停下来问用户。**

### R7: 提交规则（强制）

**核心原则：原子化提交、版本同步、AI 独立、cherry-pick 合并。**

- **原子化**：一个 commit 一件事；代码修改触发版本号更新（R17），**版本提交独立且晚于代码提交**
- **提交顺序**：功能代码 → 版本号更新 → AI 记忆记录
- **AI 独立**：`memory-bank/`、`AGENTS.md`、`SKILL_GRAPH.md` 等 AI 内容**单独提交**，不与代码混在一起
- **累计更新**：不必为每次中途改动单独提交，可只提交最终的版本描述
- **分支顺序**：优先完成 `develop` 全部提交，再考虑 `master`
- **master 合并**：非 AI 内容单独 cherry-pick 进 `master`，**严禁整条分支合并**（导致 AI 污染），
  严禁错误 cherry-pick 旧 develop 导致污染
- **提交信息格式**（模板见 `.gitmessage`）：
  `feat(scope): 描述` / `fix(scope): 根因+修复+验证` / `chore(release): bump version to X.Y.Z` /
  `docs(memory-bank): record <内容>`
- **零 AI 署名**：禁止 `Co-authored-by`、`Generated with`、`Ultraworked with` 等任何 AI 署名/页脚
- **最终清理**：功能 commit → 版本 commit → AI 记忆 commit → 推送 → 验证 `git status` 干净 → 有残留立即补提交

### R8: 技术决策确认

**禁止擅自修改**：Node/pnpm/TypeScript 版本、VS Code 引擎版本（`engines.vscode`）、构建方案
（esbuild 配置）、架构设计、本地数据模型/schema、`package.json` 的 `contributes` 契约、依赖版本。

原则：**只读取不猜测，只实现不决策，有疑问必须问。**

### R9: 代码规范

- **语言**：代码/注释/日志/JSDoc 强制英文；README/CHANGELOG/docs 面向用户，英文；
  AGENTS.md/memory-bank/SKILL_GRAPH.md 中文
- **注释（Clean Code）**：✅ 公共 API 的 JSDoc、复杂算法的 Why、警示信息；
  ❌ 解释代码做了什么、冗余注释、注释掉的代码、`TODO`/`FIXME`
- **TypeScript**：`strict` 已开启，禁止 `any`（需逃逸时用 `unknown` + 收窄）；
  禁止非空断言 `!` 除非紧邻不变量校验；优先 `readonly`、`const`、穷尽 `switch` 的 `never` 兜底
- **命名**：`PascalCase`(类/类型/接口)、`camelCase`(变量/函数)、`UPPER_SNAKE_CASE`(常量)、
  `kebab-case`(文件名)；VS Code 命令 ID 用 `code-time-tracker-vscode.<verb>` 形式，与 `package.json` 一致
- **VS Code 宿主 API**：
  - 所有 `Disposable` 必须进 `context.subscriptions`，禁止裸注册（防止扩展停用后泄漏）
  - 密钥用 `context.secrets`（`SecretStorage`），**禁止**写入 `settings.json` 或 `globalState`
  - 扩展宿主是单线程：禁止同步阻塞操作（`fs.readFileSync` 循环、长 CPU 循环）；重活分片或移出主线程
  - `deactivate()` 必须快速返回：落盘已积累数据后立即返回，不等待网络
  - 面向用户的通知/日志走 `vscode.window` / `LogOutputChannel`，禁止 `console.log` 作为长期日志
- **测试**：Mocha + `@vscode/test-cli`；断言用 Node `assert`；测试文件名与被测源文件同名；
  方法描述用 `shouldX whenY` 风格
- **编辑前验证（强制）**：先读完整文件 → 编辑后跑 `pnpm run check-types` 与 `pnpm run lint`
  → 涉及运行时的改动必须实际启动扩展验证（见
  [`domains/ai-workflow/principles.md`](memory-bank/domains/ai-workflow/principles.md) P3）

### R10: 边界原则

- **不懂就问**：不确定时停下来问用户，禁止盲目猜测
- **讨论信号**：用户提出「为什么 / 能不能 / 是否应该 / 你看呢 / 是不是…更好」类问题 = **讨论与确认信号**，
  先给分析 + 方案，**确认后才实施**；严禁把质疑性提问当作实施指令
- **验证优先**：不确定的 API 行为先验证再使用（VS Code API 版本差异用 `engines.vscode` 与
  `@types/vscode` 对齐确认）
- **变更溯源**：发现与预期/记忆不一致时，优先猜想「是否被用户修改了」而非「AI 忘了改/改错了」
  - **第一步**：`git diff` / `git log` 确认变更来源
  - **第二步**：验证当前行为是否正确（测试通过 = 逻辑正确）
  - **第三步**：若用户改过，更新记忆适应新逻辑，**不要恢复「旧版本」**
  - **禁止**：笃定「这应该是错的」等揣测性结论

### R11: 项目一致性优先（强制）

**核心原则：按项目来而不是按任务需求，需求要变通符合项目的一致性。**

| 场景 | 错误 ❌ | 正确 ✅ |
|---|---|---|
| 数据访问 | 任务说新建就新建一个存储层 | 复用现有 `storage/` 模式（若已有） |
| 命名/结构 | 按任务需求临时创建 | 遵循项目现有 `*Service` / `*Repository` / `*Manager` 模式 |
| 注释 | 解释「代码做了什么」 | 遵循 Clean Code（R9），删除冗余注释 |
| 命令注册 | 桥接到已有的 `helloWorld` | 与 `package.json` `contributes.commands` 的既有命名风格一致 |

执行前检查：任务是否与现有模式冲突？是否应复用而非新建？
发现冲突 → 暂停 → grep 搜索现有模式 → 向用户确认 → 按项目一致性调整。

### R12: 任务规划（强制）

多步骤任务（**3 步以上**）必须先创建 todo list，规划后再执行，完成后清理。
触及 **>5 个文件**的改动必须先写实施计划到 `.omp/plans/<feature>-plan.md`（R28）。

### R13: 文件管理（强制）

禁止创建**临时**文件：❌ 重定向到文件（`> output.log`），❌ 临时 `.log` / `.txt` / `.tmp` 文件；
✅ 输出到控制台。

**例外**：长期运行的服务（`pnpm run watch`、构建守护进程等）的日志文件不在此限（见 R22），
但必须在任务结束时清理，**不得**留在仓库内。

任务完成检查是否误创建文件，发现立即删除。

### R14: 依赖管理（强制）

禁止擅自添加依赖。`pnpm add` 前必须提供分析（目的、选型理由、影响评估、替代方案）并获得用户同意。

红线：禁止冗余依赖、禁止重复功能包、优先复用现有依赖、优先零依赖实现（例：提交信息校验用
`.gitmessage` 模板而非引入 commitlint）。

### R15: 记忆文件维护与归档（强制）

**核心原则：记忆可优化、可归档，但禁止直接删除。** 旧内容（超期/超行数/被取代）是冷数据——
未来可能用不上，但无法保证 100% 不用，必须**归档而非删除**。

| 文件 | 超限处理 |
|---|---|
| `activeContext.md` | **保留最近 30 天**；超 30 天 或 >200 行 → 归档 |
| `progress.md` | 已完成项 → 归档 |
| `systemPatterns.md` | 合并相似模式；被取代的旧模式 → 归档 |
| `techContext.md` | 过时配置 → 归档（不删除） |
| `domains/**` | 与代码/契约不一致的内容**就地改正**，不留过时判断 |

**归档流程**：

1. 归档位置：`memory-bank/archives/YYYY-MM-DD-<topic>.md`（目录不存在时创建）
2. 触发：文件超 200 行、条目超 30 天、内容被新规则/新实现取代
3. 归档内容保留原文；主文件仅保留一句摘要 + 指向归档文件的链接（保持主文件精简可读）
4. **完整性校验**：归档前后总行数差 = 新增归档文件头行数（零丢失）
5. 归档与业务代码同一次推送提交（R5/R7）

**行数超限但无超期条目时**：不得删除热数据，也**不得**为此归档 30 天内的条目。
顺序为：压缩措辞（信息量不减）→ 将已完结的成组条目移入归档（保留结论、丢弃过程）→
仍超限则按 R16 提出规则修订，**不得靠删记忆达标**。

`memory-bank/archives/` 是**唯一豁免 200 行限制**的记忆位置——它的存在就是为了装时间线溢出。

### R16: AGENTS.md 自更新（强制）

触发条件：规则漏洞 / 用户新约束 / 重复错误需固化。

流程：记录问题 → 添加或修改规则 → 记录到 `activeContext.md` → **等待用户确认**。

命名：新增用 `R{n}`（递增，**按数字顺序排列**）；修改保留原序号 + 版本说明；
删除标记 `[已废弃]` 而非移除（保留溯源）。

**禁止**：为凑规则数量写空泛条款；同一约束在两处重复表述（重复即需合并并互相引用）。

### R17: 版本号管理（强制实时）

**核心原则：任何代码变更必须同步更新版本号，严禁滞后更新（防断片）。**

- **位置**：`package.json` 的 `version` 字段（唯一来源；禁止在代码中硬编码版本，
  需要时从 `context.extension.packageJSON.version` 读取）
- **格式**：`MAJOR.MINOR.PATCH[-SUFFIX]`；开发中用 `-beta` / `-rc` 后缀
- **变更规则**：Bug 修复 → `PATCH+1`；新功能 → `MINOR+1`；破坏性 → `MAJOR+1`
- **执行时机**（每次代码修改后立即）：1. 确定新版本号 2. 更新 `package.json`
  3. 同步 `CHANGELOG.md` 4. 全局搜索检查硬编码 5. 记录到 `activeContext.md`
- **禁止**：代码变更不更新、跳版本、未经确认升 MAJOR
- **提交时序**：版本提交独立且**晚于**代码提交（R7）

### R18: 自我学习（强制）

触发条件（满足其一）：同一问题解决 **2 次以上**；单次排查/研究耗时较长（>30 分钟）且有复盘价值。

**动作：先询问用户**是否沉淀为 skill，**用户同意后**才创建，**禁止自动写入**。

存放位置：`.agents/skills/<skill-name>/SKILL.md`。
流程：确认解决 → 询问用户 → 用户同意 → 用 skill-creator 创建 → 写入 `.agents/skills/` → 更新版本号。

与 R19 的关系：R19 的「仅当用户明确要求时才可操作 `.agents/`」即本规则的询问环节，二者一致不冲突。

### R19: AI 文件保护（强制）

**禁止修改 `.agents/` 目录** —— 该目录是 AI 技能工作区，不是项目源码的一部分。

- ❌ 禁止修改、删除 `.agents/skills/` 下任何文件
- ❌ 禁止因「发现问题」而改动 skill 文件
- ❌ 禁止将 `.agents/` 纳入代码审查或重构范围
- ✅ **为选择技能而阅读** skill 说明文件是允许的（R24 需要读取才能列出同类技能）
- ✅ 仅当用户明确要求时才可**创建或修改**

**红线**：即使 skill 文件有问题（过时 / 错误 / 冗余），也不得自行修改，**只能提醒用户**。

### R20: 分支管理（强制 — 防止生产事故）

**核心原则：`master` 是生产分支，永远保持干净（无 AI 文件）。**

| 分支 | 用途 | 允许 | 禁止 |
|---|---|---|---|
| `master` | 发布 | 业务代码 / 测试 / 版本号 / 面向用户文档（README、CHANGELOG、docs） | AI 文件（`AGENTS.md`、`SKILL_GRAPH.md`、`memory-bank/`、`.omp/`、`.agents/`） |
| `develop` | AI 工作分支 | 业务代码 + AI 文件 | 无 |

**AI 默认在 `develop` 上工作。**

**master 同步规则**：从固定起点 → `git rm -rf` AI 文件 → cherry-pick develop
（**排除** `docs(memory-bank)` 类提交）→ 冲突处理（memory-bank 冲突用 `git rm -f`，
版本号冲突用 `--theirs`）→ 验证（`git ls-files` 无 AI 文件 + `pnpm run compile` 通过）

**禁止操作**：直接 `merge develop`、在 master 创建 AI 文件、在 master 提交 `docs(memory-bank)`、
`git reset --hard develop`、反向 cherry-pick（master → develop）、在 master 直接修改代码

**事故恢复**：立即停止 → 确认污染 → 重置到安全点 → 重新 cherry-pick →
`--force-with-lease` 推送 → 记录事故到 `activeContext.md`

### R21: Git 恢复禁止（强制）

**禁止执行 `git reset` 恢复到初始状态** —— 会导致工作丢失且不可恢复，必须经由用户确认。

同理禁止：`git checkout .`、`git clean -fd`、`git stash drop`、`git branch -D`（未经确认）。

### R22: 资源清理（强制）

占用资源的工具/服务使用后必须关闭（dev server、watch 进程、扩展宿主测试实例、调试会话）。

持续服务需后台静默启动，日志单独输出，避免超时/资源堆积。任务完成后立即清理。
**只关闭自己启动的资源**——按实际监听进程确认归属，不凭记忆中的 PID。

### R23: 文件阅读原则（强制）

片段读取无法解决时**直接读取整个文件**；改文件前必须详细阅读原文件；
不反复片段读取同一文件。

### R24: Skills 选择规范（强制）

使用某类 Skills 前，先在 **`SKILL_GRAPH.md`** 中**列出该类全部候选**，再选择；**可同时加载多个**。

加载方式：`read skill://<skill-name>`（附属文件用 `skill://<skill-name>/<file>`）。

**选择顺序**：用户指令 > 技能指引 > 默认行为；技能**不得覆盖本文件**。
流程类技能（`think` / `planning-and-task-breakdown`）用在实现类之前。
不知道有无对应技能时用 `find-skills` 查。

**技能索引治理见 R30。**

### R25: 网络检索与外部 AI 咨询（强制）

- 网络检索择优：内置 `WebSearch`、浏览器类技能（`doko-search` / `dokobot`）、
  `opencli <site> search`（站点适配器）、`grep.app`（代码搜索），可配合使用
- **已知 URL 优先内置 `read` 直读**（静态页）；需要已登录 / JS 渲染页面才用浏览器工具
- 浏览器行为必须在**用户在用或包含用户数据的浏览器**上进行，**禁止 Incognito 模式**
- 使用前按 R24 列出同类技能并读对应技能文档
- 高级 AI 咨询：可用 `ai-chat-browser` / `opencli` 访问 gemini.google.com / perplexity.ai（需选择模型）
- **VS Code 扩展 API 事实优先查本地类型定义**（`node_modules/@types/vscode/index.d.ts`），
  其次查官方文档，最后才用搜索——本地类型与 `engines.vscode` 版本强一致

### R26: 子任务只读约束（强制）

审查 / 检查 / 调查类子任务（code-review、explore、scout 等）必须**严格只读**：
禁止执行任何 `--fix` 类命令（`eslint --fix`、格式化写盘）或文件写入。
需要验证时仅允许只读检查（`tsc --noEmit`、不带 `--fix` 的 lint、不写盘的定位分析）。

**红线**：子 agent 运行 `--fix` 会全项目格式化污染工作区
（先例：2026-08-11 ctt-web 审查事故，16 个无关文件被重排）。

### R27: AI 身份与职责边界（强制）

AI 身份：**code-time-tracker-vscode 扩展开发者**。

- **唯一可写仓库 = code-time-tracker-vscode**；跨仓库（ctt-server、ctt-web、code-time-tracker）
  一律**只读 + 提需求**（R3）
- **架构/契约级变更**（数据模型、同步协议、本地存储 schema、跨模块设计）：先出方案 + 影响分析，
  经用户明确授权后实施
- **讨论 ≠ 指令**（R6/R10）：「审查通过」≠ 执行授权；用户问「为什么不能 / 能不能」时先分析，不得直接动手

### R28: AI 产物位置（强制）

`docs/` 只放**面向用户的项目文档**；AI 工作产物一律放 `.omp/`（已 gitignore，不进仓库）。
`.omp/README.md` 是该目录的权威说明。

| 产物 | 位置 | 提交？ |
|---|---|---|
| 实施计划 | `.omp/plans/<feature>-plan.md`（**不带日期**，日期写文件内 `Date:` 字段） | 否 |
| 交付报告 / 需求草案 | `.omp/<topic>-delivery-report.md`、`.omp/<topic>-requirement.md` | 否 |
| Agent 记忆（时间线 + 领域） | `memory-bank/` | **是** |
| 面向用户的项目文档 | `docs/`（内容存在时才建） | 是 |

红线：禁止把实施计划写进 `docs/plans/`。

### R29: 领域知识库（强制）

**核心原则：知识按「领域」沉淀，不按「时间」堆积。** 时间线（`activeContext.md` / `progress.md`）
只回答「最近发生了什么」；跨轮次可复用的判断必须沉淀到 `memory-bank/domains/<domain>/`。

**第一层永远是领域**（业务/技术能力面，如 `sync-client`、`server-api`），**禁止**按文档类型
建第一层（如 `principles/`、`practices/` 这类全局扁平目录）。

**每个领域五件套**（缺一不可，**建成即填实，禁止占位**）：

| 文件 | 承载 | 判定标准 |
|---|---|---|
| `meta.md` | 领域边界、负责范围、代码入口、领域术语 | 只看这一个就知道「归哪、从哪看起」 |
| `principles.md` | 不变量与第一性原理（决策依据） | 能用来裁决新情况 |
| `scenarios.md` | 触发场景 → 判断 → 动作 | 遇到 X 该怎么做，不用重新推理 |
| `practices.md` | 具体做法、参数、代码形状、踩坑与规避 | 可直接照做，含反例与「为什么」 |
| `references.md` | 外部契约、端点、错误码、数据字典、文件路径 | **事实性查表，不含判断** |

**生长规则**：按需建档——只在某领域确有可复用知识时才创建，**宁可少而实，不可多而空**；
新知识先归类再更新对应文件，无匹配才新建五件套；`memory-bank/domains/README.md` 索引
必须与目录实际内容同步；横切规范留 `systemPatterns.md`，领域专属判断进领域文件，
**不得两处重复**（重复即需合并并互相引用）。

**红线**：

- ❌ 占位文件、`TODO: fill`、空章节 —— 建了就写实，写不出来说明知识还没形成（见
  [`domains/ai-workflow/principles.md`](memory-bank/domains/ai-workflow/principles.md) P5）
- ❌ 把领域文件当 changelog 用（「v0.34.0 改了 X」）—— 版本流水账属于 `progress.md`；
  领域文件只写**当前有效**的结论
- ❌ 与代码/契约不一致的表述 —— 领域文件是事实，涉及 ctt-server 契约必须先只读核对源码（R3）
- 单文件仍受 **≤200 行**约束；超出即拆分或压缩

### R30: SKILL_GRAPH.md 维护（强制 —— 只列真实存在的技能）

`SKILL_GRAPH.md` 是技能索引，供 R24 使用。**它必须与实际安装的技能严格一致。**

**红线：不得保留幽灵条目。** 索引中出现的每个技能，本机必须存在 `SKILL.md`：

- `~/.agents/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`

**维护规则**：

1. **新增**：安装技能后加入索引，并更新所属分类的计数与末尾总数。
2. **删除**：技能目录不存在时**必须从索引移除**——「以前有」不是保留理由。
3. **去重**：`~/.claude/skills/` 是指向 `~/.agents/skills/` 的**符号链接**，属镜像，
   **不重复计数**。
4. **描述准确**：说明取自技能的 `description` 字段，改写只可压缩长度，**不得编造能力**。
5. **分类清晰**：按**能力**归类（思维 / 工程 / 测试 / 设计 / 科研…），不按来源或安装时间归类。
6. **计数自洽**：分类标题的 `（N）` 必须等于该表实际行数；末尾总数等于全部行数之和。

**校验命令**（任何时候可重跑，**必须零输出**）：

```bash
comm -3 \
  <(find -L ~/.agents/skills ~/.config/opencode/skills \
      -mindepth 1 -maxdepth 1 -type d \
      -exec test -f '{}/SKILL.md' \; -print 2>/dev/null \
    | xargs -n1 basename | sort -u) \
  <(grep -oE '^\| `[a-z0-9._-]+`' SKILL_GRAPH.md | tr -d '|` ' | sort -u)
```

输出为空的含义是两侧完全一致。若有输出：

- **第一列**（无前导制表符）= 有技能但未收录 → **补进索引**
- **第二列**（有前导制表符）= 已收录但无技能 → **幽灵条目，必须删除**

**两个必须注意的实现细节**（否则命令会给出错误结果）：

- 必须带 **`-L`**：`~/.config/opencode/skills/` 下大量条目是指向外部仓库的**符号链接**
  （如 gstack 系列），不带 `-L` 的 `find -type d` 会跳过它们，把它们误报成幽灵。
- 必须用 **`-exec test -f '{}/SKILL.md'`** 而非只判目录：`~/.agents/skills/kami` 等目录
  没有顶层 `SKILL.md`，不是可注册技能。

**与 R19 的关系**：`~/.agents/skills/` 下的技能文件本身仍受 R19 保护（只读、不修改）；
本规则管的是**索引**（本仓库内的 `SKILL_GRAPH.md`），不是技能本体。

### R31: 知识回源与漂移检测（强制）

**核心原则：不同事实回不同源；知识过期比知识缺失更危险**——过期的知识会以「看起来很可信」
的方式误导判断，而缺失至少会让人去查。

#### 回源裁决（冲突时按下表，不得越级）

| 事实类型 | 权威来源 |
|---|---|
| ctt-server 当前行为 | `../ctt-server` **源码** |
| 本地库 schema | `../code-time-tracker` 的 `database/MigrationManager.kt` |
| 本仓库当前行为 | 本仓库代码 + 配置 |
| 产品意图与取舍 | **用户确认过的结论** |
| 历史原因 | 领域 `practices.md` 的可追溯记录 |

**红线**：不得因为代码实现了某种行为，就把它当作未来需求的正确业务规则；
也不得因为旧文档写过某种设计，就忽略代码已经变了。完整表见
[`domains/README.md`](memory-bank/domains/README.md)「事实回源」。

#### 状态标记

领域文件页头**必须**携带 `来源 ｜ 最后确认 ｜ 适用范围 ｜ 状态`，状态三选一：

| 状态 | 可作依据？ |
|---|---|
| `已核实` | ✅ 已回源确认 |
| `待确认` | ⚠️ 有来源但未核实 —— **不得静默升级为领域事实** |
| `已过时` | ❌ 与当前事实不符，保留用于追溯 |

**读领域文件先看状态。** 把 `待确认` 的内容当结论使用，是本规则要防的主要错误。

#### 漂移检测

**触发**：契约变更 / 版本升级 / **实测与记录不符**（最强信号）/ 关联仓库改动 /
每个里程碑收尾时校准一次。

**动作**：`git log` 确认变更来源（R10 变更溯源）→ 回源核对 → **就地改正**领域文件
（不留过时判断，R15）→ 无法当场确认的标记 `待确认` 并写明**缺什么证据**
（**不得删除、不得猜测**）→ 记录到 `activeContext.md`。

#### 自动化边界

自动化只负责**发现变化、生成候选、阻止遗漏**；契约语义、历史兼容理由这类高风险判断
**必须由人确认**后才写入领域文件。**不得让「代码变了」自动改写领域知识**——
工具守的是「代码变了、知识不能完全不变」的底线，语义判断仍然归人。

## 执行流程

会话开始 → 读 AGENTS.md + memory-bank → **需求消歧 + 回源核对**（R31）→ 识别领域 → 创建 todo（如需）→
处理请求 → 代码修改 + 版本号更新（R17）+ 编辑验证（R9）→ 清理临时文件（R13/R22）→
更新记忆（R2）+ 行数修剪（R15）+ **漂移检查**（R31）→ 提交前审查 + Git 授权（R6）

## 约束

1. 文件读写由 AI 自主完成
2. 记忆文件 ≤200 行（`memory-bank/archives/` 除外，见 R15）
3. 只记录已发生事实，不猜测
4. 变更即时更新
5. **项目一致性优先**（R11）
6. **编辑前必须验证**（R9）
7. **提交前必须审查**（R7 / R20）
8. 截图保存至 `/Users/ahogek/Pictures/screenshots`

## 记忆库结构

| 层 | 位置 | 回答 | 治理 |
|---|---|---|---|
| **时间线层** | `memory-bank/*.md`（5 文件）+ `archives/` | 「现在 / 最近发生了什么」 | R2、R15 |
| **领域层** | `memory-bank/domains/<domain>/`（五件套） | 「这里什么是真的、该怎么做」 | **R29** |
| **横切规范** | `memory-bank/systemPatterns.md` | 命名、线程模型、VS Code 宿主 API 用法 | R11 |

领域文件集、生长规则、**元数据契约（来源 / 新鲜度 / 状态）**与**四层阅读路径**见
[`memory-bank/domains/README.md`](memory-bank/domains/README.md)；此处不重复——
同一约束在两处表述必然漂移（R16）。
