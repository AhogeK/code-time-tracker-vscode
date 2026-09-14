# ai-workflow — practices

## 提交形态（R7）

```
feat(tracker): <改了什么>              # 代码 —— 一个连贯变更
chore(release): bump version to X.Y.Z  # 版本 —— 独立提交，且永远在代码之后
docs(memory-bank): record <记了什么>    # AI 记忆 —— 绝不与代码混在一起
```

- Subject ≤72 字符；body 说明**为什么**，附上支撑结论的测量值。
- **零 AI 署名**：无 `Co-authored-by`、无 `Generated with`、无任何页脚。
- 先 `develop`。`master` 只收逐个 cherry-pick 的非 AI 提交：

```bash
git checkout master && git cherry-pick <feat-hash> <version-hash>
git diff develop master --stat -- src/ package.json README.md CHANGELOG.md   # 必须为空
```

此 diff 非空 = 有 AI 提交泄漏，或 cherry-pick 了错误（过期）的提交 —— 停下来查清再推送。

## 验证配方（本仓库）

| 目的 | 命令 / 方法 |
|---|---|
| 类型 | `pnpm run check-types` |
| Lint | `pnpm run lint` |
| 构建 | `pnpm run compile`（= 类型 + lint + esbuild） |
| 生产构建 | `pnpm run package` |
| 宿主测试 | `pnpm run test`（真实下载并驱动 VS Code） |
| 扩展实机行为 | VS Code 中 `F5` → Extension Development Host，手动执行命令并观察 |
| 扩展日志 | Output 面板选中扩展的输出通道（`LogOutputChannel`） |

**提交前必跑**：`pnpm run compile`。仅类型通过不够 —— lint 会拦住未使用的变量与风格漂移。

## 验证一个 VS Code API 行为

类型定义是**版本一致的事实来源**，比搜索可靠：

```bash
# 先查本地类型定义（与 engines.vscode 严格对应）
grep -n "onDidChangeTextDocument" node_modules/@types/vscode/index.d.ts
```

顺序：**本地 `@types/vscode` → 官方文档 → 网络搜索**（R25）。
本地类型与 `engines.vscode` 来自同一版本，不会出现文档描述新版本 API 而宿主不支持的陷阱。

**类型通过 ≠ 能跑**：事件是否触发、激活时机、权限、Disposable 泄漏在 `tsc` 中全部不可见。
涉及宿主的改动必须在 Extension Development Host 里实际执行一次。

## 测试写法

- 纯逻辑（不 import `vscode`）→ 普通 Mocha，速度极快
- 宿主交互 → `@vscode/test-cli` / `@vscode/test-electron`
- 文件名与被测源文件同名；描述用 `shouldX whenY`
- 断言用 Node `assert`（`assert.strictEqual` / `assert.deepStrictEqual`）

**删掉通不过 P3 判定表的测试**：断言源码文本、断言「函数被调用过」、
断言某个默认值等于某常量 —— 这些测试锁住实现细节，重构时全是假失败。

## 提交信息里的「根因 + 修复 + 验证」

修 bug 时 body 必须能回答：**根因是什么、怎么修的、怎么知道修好了**。
只写「修复了 X」的提交在半年后毫无价值 —— 下次有人碰到同样症状时，需要的是复现条件与判据。

## 交接与长任务

- 触及 >5 个文件 → 计划先落 `.omp/plans/<feature>-plan.md`（不带日期，日期在文件内 `Date:`）
- 计划里写**已否决的替代方案与理由** —— 那部分是未来最省时间的
- 完成的计划**保留**，是机构记忆

## 读到「某个东西和记忆不一致」时

1. `git log` / `git diff` 确认变更来源
2. 验证当前行为是否正确（测试通过 = 逻辑对）
3. 若用户改过 → **更新记忆适应新逻辑**，不要恢复旧版本
4. 若是我改错 → 修代码

**禁止**直接下结论「这应该是错的」。真实的常见情况是：用户改了、我忘了。

## 资源收尾清单

- [ ] `pnpm run watch` 进程已停
- [ ] Extension Development Host 窗口已关
- [ ] `vscode-test` 下载的宿主实例已退出
- [ ] 临时脚本/载荷已删
- [ ] `git status` 干净（或被授权提交）

**按命令行匹配确认归属**，不按端口、不按记忆中的 PID。
