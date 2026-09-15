# Project Brief

> 项目目标与范围
>
> 来源：用户确认的产品决策 ｜ 最后确认：2026-09-15 ｜ 适用范围：产品层定位与边界 ｜ 状态：**已核实**

## 目标

VS Code 扩展：自动追踪编码时间并提供统计分析。与 `../code-time-tracker`（JetBrains 插件）
同属 Code Time Tracker (CTT) 体系，共享 `../ctt-server` 后端与 `../ctt-web` 数据看板。

## 核心元语（业务层消歧）

**先消歧，再检索。** 下面这些词在需求里出现时，先确认它指的是哪一个——混用会让后续在代码里
搜索时把同名不同义的东西混在一起，方案从第一步就偏。领域内的细分在各自 `meta.md`。

| 需求里的说法 | 本项目的确定含义 | **易混的其它含义** |
|---|---|---|
| 「记录一条时间」「编码时长」 | 一条 `coding_sessions` 记录，跨越 `startTime`→`endTime`（排除空闲的空档） | VS Code 的窗口会话；插件的统计口径 |
| 「语言统计」 | 按 `language` 字段聚合的**语言分布**；本仓库**原样发送** `document.languageId`（`typescript`），归一化由服务端按 Linguist 规范名统一承担 | 「本地先美化语言名」——**不允许**：两端各持一套规则必然漂移 |
| 「设备」 | ctt-server 注册表里的一条记录，由客户端生成的 UUID 标识 | 一台物理机器；VS Code 的一次安装；插件的 `app_user` |
| 「统计」「数据」 | 服务端聚合出的**权威**数值；本扩展另有**本地独立统计**，两者允许不等 | 把两者当成同一份数据去做对账 |
| 「同步」「云端」 | 把本地会话推到自建 ctt-server、并拉回权威状态（默认关闭） | 备份；跨端实时协作 |
| 「时长」 | `endTime - startTime` 的秒数 | merge / accumulate / **average** 三种聚合语义（见 `domains/server-api/principles.md` P4） |
| 「多设备」 | 多个设备注册到**同一个账号**下的会话互通 | 多账号；换设备不换账号 |

## 核心价值

- **全自动追踪**：无需手动操作，编辑器活动自动记录（含空闲检测）
- **可视化**：状态栏实时显示今日/本周/本月/本年时长，命令面板打开统计视图
- **多项目独立统计**：按项目 / 语言 / 时段维度聚合
- **可选云同步**：对接自建 ctt-server，多设备会话同步（LWW 冲突解决）

## 与 JetBrains 插件的关系

本仓库是 `../code-time-tracker` 的**衍生项目**，不是代码移植：

| 维度 | JetBrains 插件 | 本仓库 |
|---|---|---|
| 宿主 API | IntelliJ Platform（`@Service`、EDT、`plugin.xml`） | VS Code Extension API（`activate`/`dispose`、单线程扩展宿主、`contributes`） |
| 语言 | Kotlin / JVM 25 | TypeScript（`strict`） |
| 本地存储 | SQLite：`~/.config/code-time-tracker/coding_data.db` | **同一个文件**（两端共用同一份本地数据） |
| 构建 | Gradle Kotlin DSL | pnpm + esbuild |
| 统计 | 插件端独立统计（本地权威） | 同样做独立统计，语义与之对齐 |

**共享的是**：本地 SQLite 库（同一文件）、ctt-server 契约、数据模型语义、同步协议、统计口径。
**重写的是**：宿主实现层（活动采集、UI、生命周期）。

## 范围

- 当前版本：`0.1.0`（`package.json` → `version`），仅脚手架，无业务功能
- 目标宿主：VS Code `^1.137.0`（`engines.vscode`）
- 云同步：**未实现**

## 用户故事

- 作为开发者，我希望 VS Code 自动记录我的编码时间，无需手动操作
- 作为开发者，我希望在状态栏看到今日 / 本周 / 本月 / 本年的编码时长
- 作为开发者，我希望在 ctt-web 看板看到涵盖 VS Code 的完整统计
- 作为开发者，我希望数据默认留在本地，云同步是可选且自建的

## 关键约束

- **第三个客户端**：ctt-server 的统计口径由 JetBrains 插件定义、服务端为准（plugin parity）。
  本仓库**不定义**统计语义，只消费服务端的（见 `domains/server-api`）
- **IDE 归因**：同步协议**不携带每会话的 IDE 名称**，IDE 维度来自设备注册时的 `ideName`。
  因此必须注册独立 `deviceId`，否则与同机 JetBrains 插件混为一个桶
- **本地库与插件端共用**：SQLite 文件 `~/.config/code-time-tracker/coding_data.db` 与
  `../code-time-tracker` 是**同一个**；**schema 变更权归插件端独占**——本插件不迁移、不加列，
  需要新列时走需求报告；本地库**只存原生值**，两端可能并发写
- **语言字段原样发送**：发 `document.languageId` 的原始值，**不做大小写转换、不做命名美化**；
  归一化（GitHub Linguist 规范名 + 历史回填）由服务端统一承担。**本地不得自建映射表**
- **只读关联项目**：`ctt-server` / `ctt-web` / `code-time-tracker` 一律只读（AGENTS.md R3）

## 里程碑

- [x] 2026-09-14：仓库初始化（GitHub + master/develop 分支）
- [x] AI 协作架构（AGENTS.md + memory-bank + SKILL_GRAPH.md）—— 状态与明细见 `progress.md`
- [x] 非 AI 项目内容（README / CONTRIBUTING / Code of Conduct / SECURITY / LICENSE）
- [ ] 本地追踪核心（活动监听 + 空闲检测 + 会话切分）
- [ ] SQLite 对接（与插件端同一个库；**只读 schema，不迁移**）
- [ ] 统计与状态栏
- [ ] 云同步（依赖上述全部）
