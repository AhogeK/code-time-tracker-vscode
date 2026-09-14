# SKILL GRAPH — AI Agent 技能索引

> **用途**：AI 在会话开始时扫描本文件，识别可用技能并按需加载（AGENTS.md R24 要求先列同类技能再选择）。
> **维护**：新增 / 删除 / 修改技能后必须同步本文件——**本文件只列实际存在的技能**，不留幽灵条目。
> **位置**：项目根目录，与 `AGENTS.md` 同级。
> **来源**：`~/.agents/skills/`（368）+ `~/.config/opencode/skills/`（64），去重后 **432**。

## 技能发现机制（本 harness 实测）

| 来源 | 路径 | 本机数量 | 说明 |
|---|---|---|---|
| 用户技能 | `~/.agents/skills/<name>/SKILL.md` | 368 | 主目录，含子目录树 |
| opencode 技能 | `~/.config/opencode/skills/<name>/SKILL.md` | 64 | gstack 套件与 doko 系列在此 |
| 项目技能 | `<repo>/.agents/skills/` | 0 | **本项目无**（AGENTS.md R19 保护，只在用户明确要求时创建） |
| 托管技能 | `~/.omp/agent/managed-skills/` | 0 | 由 `manage_skill` 工具创建 |

`~/.claude/skills/` 是 229 个指向 `~/.agents/skills/` 的**符号链接**，属于同一批技能的镜像，
**不重复计数**。`~/.codex/skills/` 为空。

**已移除、不得再列入的条目**（旧版索引遗留的幽灵，本机已无对应目录）：

arkcli 全系列（24 个）、`algorithmic-art`、`antfu`、`brand-guidelines`、`canvas-design`、
`claude-api`、`doc-coauthoring`、`frontend-design`、`internal-comms`、`nuxt`、`pinia`、`pnpm`、
`skill-creator`、`slack-gif-creator`、`slidev`、`template-skill`、`theme-factory`、`transient-ui-capture`、
`transitions-dev`、`tsdown`、`turborepo`、`unocss`、`vite`、`vitepress`、`vitest`、`vue`、
`vue-best-practices`、`vue-router-best-practices`、`vue-testing-best-practices`、`vueuse-functions`、
`web-artifacts-builder`、`api-contract-verification`、`visual-qa`、`review-work`、`remove-ai-slops`、
`init-deep`，以及工具内置的 `playwright` / `frontend` / `git-master` / `debugging` /
`security-research` / `security-review` / `customize-opencode`（本 harness **不提供**内置技能目录）。

> 前一列中的多数是 ctt-web 的**项目级**技能（Vue 技术栈），只存在于那个仓库的 `.agents/`，
> 跨仓库不可见。本项目需要时应通过 `find-skills` / `skills` 安装，而非假定已存在。

---

## 思维与规划（32）

> 把想法变成可执行计划、做决策与质疑

| 技能 | 说明 |
|---|---|
| `think` | Turns rough ideas into approved, decision-complete plans with validated structure before coding |
| `idea-refine` | Refines raw ideas into sharp, actionable concepts through structured divergent and convergent thinking |
| `planning-and-task-breakdown` | Breaks work into ordered tasks. Use when you have a spec or clear requirements and need to break work into implementable tasks |
| `wayfinder` | Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear |
| `spec-driven-development` | Creates specs before coding. Use when starting a new project, feature, or significant change and no specification exists yet |
| `to-spec` | Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed |
| `to-tickets` | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker) |
| `triage` | Move issues and external PRs through a state machine of triage roles, categorise, verify, grill if needed, and write agent-ready briefs |
| `grilling` | Grill the user relentlessly about a plan, decision, or idea |
| `grill-me` | A relentless interview to sharpen a plan or design |
| `grill-with-docs` | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go |
| `loop-me` | Grill me about specs for the workflows I want to build, within this workspace |
| `consciousness-council` | Run a multi-perspective Mind Council deliberation on any question, decision, or creative challenge |
| `what-if-oracle` | Run structured What-If scenario analysis with 4–6 branch possibility exploration (best, likely, worst, wild card, contrarian, second-order) |
| `software-engineering-laws-and-philosophy` | Guides technical decisions, architecture design, planning, and team management using the 56 Laws of Software Engineering |
| `arbor` | Autonomously improve a real artifact (code, training recipe, agent harness, data pipeline, prompt) against an objective and an evaluator, using Hypothesis Tree Refinement (HTR) from the Arbor paper |
| `incremental-implementation` | Delivers changes incrementally in thin, verifiable slices |
| `implement` | Implement a piece of work based on a spec or set of tickets |
| `prototype` | Build a throwaway prototype to answer a design question |
| `improve-codebase-architecture` | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick |
| `codebase-design` | Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary |
| `domain-modeling` | Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a CONTEXT.md, or recording or editing an ADR |
| `context-engineering` | Optimizes agent context setup. Use when starting a new session, when agent output quality degrades, when switching between tasks, or when you need to configure rules files and context for a project |
| `handoff` | Compact the current conversation into a handoff document for another agent to pick up |
| `claude-handoff` | Hand the current conversation off to a fresh background agent that picks up the work immediately |
| `using-agent-skills` | Discovers and invokes agent skills. Use when starting a session, or when you need to decide which skill or workflow applies to the piece of work at hand |
| `ask-matt` | Ask which skill or flow fits your situation. A router over the skills in this repo |
| `find-skills` | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities |
| `autoskill` | Observe the user's screen via screenpipe, detect repeated research workflows, match them against existing scientific-agent-skills, and draft new skills (or composition recipes that chain existing ones) for the patterns not yet covered |
| `learn` | Runs a six-phase research workflow that turns unfamiliar domains, source bundles, or collected material into publish-ready output |
| `teach` | Teach the user a new skill or concept, within this workspace |
| `scheduler` | Schedule on-device reminders and local actions only |

## 代码工程与架构（14）

> 写代码、设计接口、重构与工程规范

| 技能 | 说明 |
|---|---|
| `api-and-interface-design` | Guides stable API and interface design. Use when designing APIs, module boundaries, or any public interface |
| `code-simplification` | Simplifies code for clarity. Use when refactoring code for clarity without changing behavior |
| `deprecation-and-migration` | Manages deprecation and migration. Use when removing old systems, APIs, or features |
| `documentation-and-adrs` | Records decisions and documentation. Use when you need to document an architecture decision (ADR) or the reasoning behind a design choice, when changing public APIs, shipping features, or when you need to record context that future engineers and agents will need to understand the codebase |
| `git-workflow-and-versioning` | Structures git workflow practices. Use when making any code change |
| `resolving-merge-conflicts` | Use when you need to resolve an in-progress git merge/rebase conflict |
| `migrate-to-shoehorn` | Migrate test files from as type assertions to @total-typescript/shoehorn |
| `full-output-enforcement` | Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly |
| `performance-optimization` | Optimizes application performance across frontend, backend, queries, and databases |
| `setup-pre-commit` | Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo |
| `terraform-style-check` | Generate Terraform HCL code following HashiCorp's official style conventions and best practices |
| `matlab` | Build, review, migrate, and safely plan MATLAB or GNU Octave numerical workflows, including arrays, tabular/time data, tests, projects, graphics, MAT files, and explicit Python interoperability |
| `pi-agent` | Build with and use Pi, the minimal terminal coding harness |
| `dhdna-profiler` | Extract cognitive patterns and thinking fingerprints from any text |

## 审查、质量与安全（12）

> 代码审查、项目审计与安全加固

| 技能 | 说明 |
|---|---|
| `check` | Reviews code diffs, PRs, issue queues, release readiness, commits, pushes, publishing, and project audits |
| `code-review` | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?) |
| `code-review-and-quality` | Conducts multi-axis code review. Use before merging any change |
| `slack-qa-investigate` | Investigate and answer repository questions in read-only mode |
| `health` | Runs a budget-aware agent-assisted engineering health audit for instruction/config drift, hooks/MCP, verifier surfaces, and AI maintainability |
| `security-and-hardening` | Hardens code against vulnerabilities. Use when auditing an input handler for vulnerabilities, when handling user input, authentication, data storage, or external integrations, or when checking a login flow is safe against the OWASP Top Ten |
| `github-bug-report-triage` | Triage GitHub bug reports for actionability. Use when evaluating whether a bug issue has sufficient detail and identifying missing information from the reporter |
| `github-issue-dedupe` | Detect duplicate GitHub issues using semantic search and keyword matching |
| `web-design-guidelines` | Review UI code for Web Interface Guidelines compliance |
| `seo-aeo-audit` | Optimize for search engine visibility, ranking, and AI citations |
| `review-animations` | Reviews animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy |
| `setup-matt-pocock-skills` | Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, and domain doc layout |

## 测试与调试（16）

> 写测试、定位根因、排查性能与可访问性问题

| 技能 | 说明 |
|---|---|
| `tdd` | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests |
| `debugging-and-error-recovery` | Guides systematic root-cause debugging. Use when tests fail, builds break, something that worked yesterday broke, behavior doesn't match expectations, or you encounter any unexpected error |
| `diagnosing-bugs` | Diagnosis loop for hard bugs and performance regressions |
| `hunt` | Finds root cause before applying fixes for errors, crashes, regressions, failing tests, broken behavior, and screenshot-reported defects |
| `troubleshooting` | Uses Chrome DevTools MCP and documentation to troubleshoot connection and target issues |
| `memory-leak-debugging` | Diagnoses and resolves memory leaks in JavaScript/Node.js applications |
| `test-auth-bootstrap` | Automatically obtain a valid auth token (or full account) in a dev/test environment so E2E verification can run without asking the human for credentials |
| `webapp-testing` | Test local web applications with Playwright. Use when asked to verify frontend functionality, debug UI behavior, capture browser screenshots, or inspect browser logs |
| `browser-testing-with-devtools` | Tests in real browsers via Chrome DevTools MCP. Use when building or debugging anything that runs in a browser |
| `chrome-devtools` | Uses Chrome DevTools via MCP for efficient debugging, troubleshooting and browser automation |
| `chrome-devtools-cli` | Use this skill to write shell scripts or run shell commands to automate tasks in the browser or otherwise use Chrome DevTools via CLI |
| `a11y-debugging` | Uses Chrome DevTools MCP for accessibility (a11y) debugging and auditing based on web.dev guidelines |
| `web-accessibility-audit` | Audit web applications for WCAG accessibility compliance |
| `web-performance-audit` | Audit web performance using Chrome DevTools MCP. Use when asked to audit, profile, debug, or optimize page load performance, Lighthouse scores, or site speed |
| `debug-optimize-lcp` | Guides debugging and optimizing Largest Contentful Paint (LCP) using Chrome DevTools MCP tools |
| `scaffold-exercises` | Create exercise directory structures with sections, problems, solutions, and explainers that pass linting |

## 前端与 UI 设计（22）

> 界面实现、视觉规范与设计系统

| 技能 | 说明 |
|---|---|
| `ui` | Produces distinctive, production-grade UI for pages, components, visual interfaces, typography, and screenshot-driven polish |
| `frontend-ui-engineering` | Builds production-quality, accessible, responsive user-facing UIs |
| `design-taste-frontend` | Anti-slop frontend skill for landing pages, portfolios, and redesigns |
| `design-taste-frontend-v1` | The original v1 taste-skill, preserved for projects depending on its exact behavior |
| `gpt-taste` | Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP ScrollTriggers (pinning, stacking, scrubbing), inline micro-images, and massive section spacing |
| `high-end-visual-design` | Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive |
| `minimalist-ui` | Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels |
| `industrial-brutalist-ui` | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics |
| `emil-design-eng` | This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great |
| `stitch-design-taste` | Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-accelerated performance |
| `redesign-existing-projects` | Upgrades existing websites and apps to premium quality |
| `image-to-code` | Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible |
| `imagegen-frontend-web` | Elite frontend image-direction skill for generating premium, conversion-aware website design references |
| `imagegen-frontend-mobile` | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows |
| `vercel-composition-patterns` | React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs |
| `vercel-react-best-practices` | React and Next.js performance optimization guidelines from Vercel Engineering |
| `vercel-react-native-skills` | React Native and Expo best practices for building performant mobile apps |
| `vercel-react-view-transitions` | Guide for implementing smooth, native-feeling animations using React's View Transition API (<ViewTransition> component, addTransitionType, and CSS view transition pseudo-elements) |
| `brandkit` | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations |
| `animation-vocabulary` | Reverse-lookup glossary that turns a vague description of a web animation or motion effect into its exact term ("the bouncy thing when a popover opens" → Pop in; "the iOS rubber-band scroll" → Rubber-banding) |
| `infocard` | Create editorial-style information cards using HTML/CSS in Markdown |
| `generate-image` | Generate or edit images with AI models through the OpenRouter Image API (Gemini, Seedream, Recraft, GPT-Image, Riverflow) |

## 文档与写作（16）

> 撰写/校对文档、处理 Office 与 PDF 文件

| 技能 | 说明 |
|---|---|
| `write` | Rewrites and polishes prose in Chinese or English, removes AI-like wording, and reviews product localization copy while preserving intent for drafts, docs, release notes, launch copy, and social posts |
| `writing-guidelines` | Review docs/prose for Writing Guidelines compliance |
| `writing-beats` | Writing, exploit; assemble raw material into a journey of beats, grounding each term before a beat leans on it |
| `writing-fragments` | Writing, explore: mine raw fragments, no structure yet |
| `writing-shape` | Writing, exploit: shape raw material into an article, paragraph by paragraph |
| `docs-update` | Update user-facing documentation when code changes |
| `docx` | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files) |
| `pdf` | Use this skill whenever the user wants to do anything with PDF files |
| `pptx` | Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both |
| `xlsx` | Create, edit, analyze, or convert Excel spreadsheets (.xlsx, .xlsm, .xltx) where the workbook file is the primary deliverable |
| `markitdown` | Convert heterogeneous documents and selected URIs to Markdown with Microsoft MarkItDown for text analysis, search, and LLM/RAG ingestion |
| `liteparse` | Local document and PDF parsing that returns spatial text with bounding boxes |
| `markdown-mermaid-writing` | Comprehensive markdown and Mermaid diagram writing skill |
| `show-me` | Help the user understand the current topic visually with concise diagrams, code-shape sketches, and focused HTML artifacts |
| `infographic` | Create template-based infographics with space-separated key-value syntax (NOT YAML) |
| `infographics` | Create professional infographics using Nano Banana Pro AI with smart iterative refinement |

## 图示与可视化（18）

> 画架构/流程/UML/图表与数据可视化

| 技能 | 说明 |
|---|---|
| `diagram-design` | Create branded architecture, IT current-state, flowchart, sequence, state machine, ER/data model, timeline, swimlane, quadrant, radar/spider, polar chart (polar/radial lollipop), loop/flywheel, nested, tree, org chart, layer stack, Venn, pyramid/funnel, treemap, bar, waterfall, line, Gantt and scatter charts, high-leve… |
| `vega` | Create data-driven charts with Vega-Lite (declarative) and Vega (programmatic) |
| `matplotlib` | Low-level plotting library for full customization |
| `seaborn` | Statistical visualization with pandas integration |
| `scientific-visualization` | Create and audit truthful, accessible, publication-ready scientific figures with Matplotlib, Seaborn, or Plotly |
| `chart-designer` | Design effective data visualizations and charts. Generate chart configurations for ECharts, Chart.js, and other libraries |
| `graphviz` | Create directed/undirected graphs using DOT language with automatic layout |
| `uml` | Create UML diagrams using PlantUML syntax. Best for software modeling — Class, Sequence, Activity, State Machine, Component, Use Case, and Deployment diagrams with concise text-based notation and auto-layout |
| `archimate` | Create ArchiMate enterprise architecture diagrams using PlantUML stdlib macros |
| `bpmn` | Create business process diagrams using PlantUML syntax with BPMN, EIP, and Lean Mapping stencil icons |
| `cloud` | Create cloud provider architecture diagrams using PlantUML syntax with official AWS, Azure, GCP, and Alibaba Cloud service icons |
| `iot` | Create IoT architecture diagrams using PlantUML syntax with device and sensor stencil icons |
| `network` | Create network topology diagrams using PlantUML syntax with mxgraph device icons (Cisco, Citrix, etc.) |
| `security` | Create security architecture diagrams using PlantUML syntax with identity, encryption, firewall, and compliance stencil icons |
| `data-analytics` | Create data pipeline and analytics architecture diagrams using PlantUML syntax with database/analytics stencil icons |
| `architecture` | Create layered system architecture diagrams using HTML/CSS templates with color-coded tiers and grid layouts |
| `canvas` | Create spatial diagrams with free-positioned nodes using JSON format |
| `mindmap` | Create hierarchical mind maps using PlantUML @startmindmap syntax |

## 网络检索与数据获取（9）

> 联网搜索、抓取页面、查询公开数据库

| 技能 | 说明 |
|---|---|
| `read` | Reads URLs and PDFs by fetching source content, defaulting to concise summaries for plain read requests and clean Markdown when asked to convert, save, quote, cite, or feed downstream work |
| `exa-search` | Web toolkit powered by Exa, tuned for scientific and technical content |
| `parallel-web` | Use Parallel CLI for web search, URL extraction, deep research, structured data enrichment, entity discovery, and recurring web monitoring |
| `smart-search` | 基于 opencli 命令的智能搜索路由器。当用户想要使用 OpenCLI、CLI 或 API 搜索、查询、查找或研究信息时，尤其是涉及指定网站、社交媒体、技术资料、新闻、购物、旅游、求职、金融或中文内容时，务必使用此 skill |
| `database-lookup` | Query documented public database APIs with explicit endpoints, filters, pagination, and provenance |
| `usfiscaldata` | Query the U.S. Treasury Fiscal Data REST API for federal financial data |
| `dbt-model-index` | Provide a lookup index of dbt models (BigQuery tables) to guide query writing against a data warehouse |
| `analysis-artifacts` | Generate reproducible analysis artifacts — SQL queries, Python visualizations, and summary tables — as you work through a BigQuery data analysis |
| `exploratory-data-analysis` | Perform bounded, local exploratory analysis of explicitly supported scientific files |

## 浏览器与自动化（12）

> 驱动真实浏览器、站点适配器与桌面逆向

| 技能 | 说明 |
|---|---|
| `browser` | Control a real browser via CDP: clicking, typing, navigation, logged-in sessions, JS-rendered or bot-protected pages |
| `browser-harness` | Control a real browser via CDP: clicking, typing, navigation, logged-in sessions, JS-rendered or bot-protected pages |
| `browser-use` | Control a real browser via CDP: clicking, typing, navigation, logged-in sessions, JS-rendered or bot-protected pages |
| `opencli-usage` | Use at the start of any OpenCLI session — this is the top-level map of what opencli can do, how to discover adapters, what flags and output formats are universal, and which specialized skill to load next |
| `opencli-browser` | Use when an agent needs to drive a real Chrome window via opencli — inspect a page, fill forms, click through logged-in flows, or extract data ad-hoc |
| `opencli-browser-sitemap` | Use when driving a website with opencli browser and sitemap context is available, requested, or needed to avoid blind navigation |
| `opencli-adapter-author` | Use when writing an OpenCLI adapter for a new site or adding a new command to an existing site |
| `opencli-sitemap-author` | Use when creating or maintaining OpenCLI site sitemaps: agent-facing navigation, page-state, action, workflow, API-reference, pitfall, and fallback knowledge for a website |
| `opencli-autofix` | Automatically fix broken OpenCLI adapters when commands fail |
| `cli-hub-meta-skill` | Discover agent-native CLIs for professional software |
| `reverse-engineering` | Use when 需要逆向 macOS 私有 API、stripped Mach-O 二进制或 Apple 系统进程（Dock.app 等，arm64e）时——Ghidra 静态分析定位函数、LLDB 动态验证、字节 Pattern 提取与唯一性验证、ADRP/BL 立即数解码、Swift/ObjC 调用约定（ABI）推断、崩溃根因分析、macOS 系统更新后的 Pattern/offset 维护。不适用于 Linux/Windows ELF/PE 逆向 |
| `ai-chat-browser` | Use when the user wants to communicate with Gemini or Perplexity via browser automation — sending messages, switching models, extracting responses, or exploring AI chat interfaces |

## Git、CI 与部署（9）

> 提交、发布、CI 修复与线上部署

| 技能 | 说明 |
|---|---|
| `git-guardrails-claude-code` | Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute |
| `create-pull-request` | Create a GitHub pull request following project conventions |
| `ci-cd-and-automation` | Automates CI/CD pipeline setup. Use when setting up or modifying build and deployment pipelines |
| `ci-fix` | Diagnose and fix GitHub Actions CI failures. Inspects workflow runs and logs, identifies root causes, implements minimal fixes, and pushes to a fix branch |
| `shipping-and-launch` | Prepares production launches. Use when preparing to deploy to production, or when asking what needs to be in place before shipping |
| `deploy-to-vercel` | Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment" |
| `vercel-cli-with-tokens` | Deploy and manage projects on Vercel using token-based authentication |
| `vercel-optimize` | Use for Vercel cost and performance optimization on deployed projects, especially Next.js, SvelteKit, Nuxt, and limited Astro apps |
| `sisyphus-execution-rules` | / 会话开始强制加载 — Sisyphus执行规则：Agent分工、实时更新、Git限制、资源管理 |

## 科研与学术写作（30）

> 文献检索、论文写作、统计与投稿

| 技能 | 说明 |
|---|---|
| `research` | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo |
| `research-lookup` | Compile current scholarly evidence for a scientific manuscript or research brief |
| `research-grants` | Write competitive research proposals for NSF, NIH, DOE, DARPA, and Taiwan NSTC |
| `researchwrite` | Compose, revise, or audit research proposals, opening reports, and research plans from supporting evidence |
| `literature-review` | Conduct comprehensive, systematic literature reviews using multiple academic databases (PubMed, arXiv, bioRxiv, Semantic Scholar, etc.) |
| `citation-management` | Comprehensive citation management for academic research |
| `paper-lookup` | Search 18 scholarly APIs for papers, preprints, citations, open-access full text, repository records, and journal OA status, and return results with reproducible provenance |
| `paperzilla` | Chat with your agent about projects, recommendations, and canonical papers in Paperzilla |
| `peer-review` | Prepare evidence-bounded, constructive peer-review drafts and structured manuscript assessments |
| `scholar-evaluation` | Provide qualitative-first, evidence-traceable developmental review of scholarly works and audit low-stakes research-assessment rubrics with optional local quality controls |
| `scientific-writing` | Draft, revise, and audit scientific manuscripts or reports with explicit evidence provenance, reporting-guideline coverage, authorship accountability, confidentiality controls, and local consistency checks |
| `scientific-critical-thinking` | Evaluate scientific claims and evidence quality. Use for assessing experimental design validity, identifying biases and confounders, applying evidence grading frameworks (GRADE, Cochrane Risk of Bias), or teaching critical analysis |
| `scientific-brainstorming` | Facilitates evidence-aware scientific ideation with independent generation, structured discussion, explicit assumptions, transparent evaluation, adversarial review, and decision logs |
| `scientific-schematics` | Create publication-quality scientific diagrams using Nano Banana 2 AI with smart iterative refinement |
| `scientific-slides` | Build slide decks and presentations for research talks |
| `hypothesis-generation` | Formulate evidence-bounded scientific questions, candidate hypotheses, rival explanations, causal or associational claims, discriminating predictions, measurements, and preregistration-ready analysis plans |
| `hypogenic` | Plans and audits use of ChicagoHAI HypoGeniC/HypoRefine for LLM-assisted hypothesis generation from labeled text datasets |
| `experimental-design` | Design experiments and studies BEFORE data is collected — choosing a design, randomizing, blocking, and laying out treatment combinations so results are interpretable |
| `statistical-analysis` | Guided statistical analysis for research data - test selection, assumption checking, effect sizes, power analysis, Bayesian alternatives, and APA-formatted reporting |
| `statistical-power` | Sample-size and statistical power calculations for planning studies |
| `venue-templates` | Prepare journal manuscripts, conference papers, research posters, and grant documents using venue-specific formatting guidance and bundled LaTeX scaffolds |
| `latex-posters` | Create professional research posters in LaTeX using beamerposter, tikzposter, or baposter |
| `pptx-posters` | Create and audit editable scientific posters in macro-free PowerPoint (.pptx) from author-approved local content and assets |
| `clinical-reports` | Create safety-bounded draft structures and run local deterministic checks for clinical case, diagnostic, trial, safety, and aggregate research reports |
| `clinical-decision-support` | Prepare and validate research-only clinical decision-support evaluation, evidence-profile, cohort, survival, biomarker/model, privacy, and governance artifacts |
| `treatment-plans` | Format and structurally validate local treatment-plan documentation after clinical decisions have already been supplied and verified by authorized licensed professionals |
| `market-research-reports` | Build evidence-traceable market research reports and assumption-driven market sizing or forecast scenarios |
| `bgpt-paper-search` | Search scientific papers and retrieve structured experimental data extracted from full-text studies via the BGPT MCP server |
| `open-notebook` | Self-hosted, open-source alternative to Google NotebookLM for AI-powered research and document analysis |
| `pyzotero` | Interact with Zotero reference management libraries using the pyzotero Python client |

## 生物信息与组学（50）

> 基因组/转录组/蛋白/影像等生命科学数据处理

| 技能 | 说明 |
|---|---|
| `biopython` | Comprehensive molecular biology toolkit. Use for sequence manipulation, file parsing (FASTA/GenBank/PDB), phylogenetics, and programmatic NCBI/PubMed access (Bio.Entrez) |
| `bioservices` | Unified Python interface to 40+ bioinformatics services |
| `gget` | Fast CLI/Python queries to 20+ bioinformatics databases |
| `scanpy` | Standard single-cell RNA-seq analysis pipeline. Use for QC, normalization, dimensionality reduction (PCA/UMAP/t-SNE), clustering, differential expression, visualization, and converting R-friendly single-cell formats such as Seurat or SingleCellExperiment RDS files into h5ad for Scanpy |
| `anndata` | Data structure for annotated matrices in single-cell analysis |
| `scvi-tools` | Deep generative models for single-cell omics. Use when you need probabilistic batch correction (scVI), transfer learning, differential expression with uncertainty, or multi-modal integration (TOTALVI, MultiVI) |
| `scvelo` | RNA velocity analysis with scVelo. Estimate cell state transitions from unspliced/spliced mRNA dynamics, infer trajectory directions, compute latent time, and identify driver genes in single-cell RNA-seq data |
| `bulk-rnaseq` | End-to-end bulk RNA-seq orchestrator — takes raw FASTQ reads through QC and trimming (FastQC, fastp/Trim Galore), alignment and quantification (STAR, Salmon, featureCounts), assembles a gene-level counts matrix, then hands off to differential expression (pydeseq2), pathway/GSEA enrichment (pathway-enrichment), and publ… |
| `pydeseq2` | Differential gene expression analysis for bulk RNA-seq with PyDESeq2, including formulaic designs, Wald tests, FDR correction, LFC shrinkage, and result visualization |
| `pathway-enrichment` | Run pathway and gene-set enrichment analysis on gene lists or ranked gene data, then interpret the results |
| `nextflow` | Build, run, and debug Nextflow data pipelines and nf-core workflows end to end |
| `pacsomatic` | Operator toolkit for nf-core/pacsomatic matched tumor-normal workflows from BAM inputs |
| `deeptools` | NGS analysis toolkit. BAM to bigWig conversion, QC (correlation, PCA, fingerprints), heatmaps/profiles (TSS, peaks), for ChIP-seq, RNA-seq, ATAC-seq visualization |
| `pysam` | Python/HTSlib workflows for genomic files. Use when reading, querying, filtering, or writing SAM/BAM/CRAM, VCF/BCF, FASTA/FASTQ, or tabix data with pysam, including pileup, coverage, indexing, and CRAM references |
| `polars-bio` | High-performance genomic interval operations and bioinformatics file I/O on Polars DataFrames |
| `gtars` | Use Gtars for local genomic interval models and set algebra, overlaps and counts, consensus and coverage, tokenization, fragment processing, and refget/BEDbase planning across Python, Rust, and the CLI |
| `geniml` | Use Geniml for audited local genomic-interval workflows: validate BED and universe contracts, plan Region2Vec or scEmbed runs, inspect model/tokenizer compatibility, and assess consensus universes |
| `tiledbvcf` | Efficient storage and retrieval of genomic variant data using TileDB |
| `arboreto` | Infer gene regulatory networks (GRNs) from gene expression data using scalable algorithms (GRNBoost2, GENIE3) |
| `cellxgene-census` | Query the CZ CELLxGENE Census programmatically for versioned public single-cell and spatial transcriptomics data |
| `onekgpd` | Query the 1000 Genomes Project dataset (3,202 whole-genome-sequenced individuals, GRCh38) at the level of individual participants |
| `primekg` | Query the Precision Medicine Knowledge Graph (PrimeKG) for multiscale biological data including genes, drugs, diseases, phenotypes, and more |
| `depmap` | Query the Cancer Dependency Map (DepMap) for cancer cell line gene dependency scores (CRISPR Chronos), drug sensitivity data, and gene effect profiles |
| `scikit-bio` | Biological data toolkit. Sequence analysis, alignments, phylogenetic trees, diversity metrics (alpha/beta, UniFrac), ordination (PCoA), PERMANOVA, FASTA/Newick I/O, for microbiome analysis |
| `phylogenetics` | Build and analyze phylogenetic trees using MAFFT (multiple alignment), IQ-TREE 2 (maximum likelihood), and FastTree (fast NJ/ML) |
| `etetoolkit` | Analyze, manipulate, compare, annotate, and visualize phylogenetic or other hierarchical trees with ETE 4 |
| `esm` | Use when working directly with the esm Python SDK, ESM3 or ESMC model IDs, Forge/Biohub inference clients, or ESMFold2 folding workflows |
| `glycoengineering` | Analyze and engineer protein glycosylation. Scan sequences for N-glycosylation sequons (N-X-S/T), predict O-glycosylation hotspots, and access curated glycoengineering tools (NetOGlyc, GlycoShield, GlycoWorkbench) |
| `hugging-science` | Use when the user is doing AI/ML work in a scientific domain such as biology, chemistry, physics, astronomy, climate, genomics, materials, medicine, ecology, energy, engineering, math, drug discovery, protein design, weather modeling, theorem proving, single-cell, or PDE solving |
| `bids` | Use this skill when working with Brain Imaging Data Structure (BIDS) datasets: organizing neuroscience and biomedical data (MRI, EEG, MEG, iEEG, PET, microscopy, NIRS, motion capture, EMG, MR spectroscopy, behavioral), querying BIDS layouts, validating compliance, converting DICOM to BIDS, writing metadata sidecars, or… |
| `imaging-data-commons` | Query and download public cancer imaging data from NCI Imaging Data Commons |
| `omero-integration` | Securely inspect and automate microscopy data workflows against OMERO.server with omero-py, BlitzGateway, OMERO CLI, tables, annotations, ROIs, rendering, and documented OMERO.web APIs |
| `histolab` | Lightweight WSI tile extraction and preprocessing |
| `pathml` | Use PathML for local, research-only computational pathology workflows: load and tile slides, build preprocessing and QC pipelines, manage h5path data, quantify multiplex images, construct spatial graphs, and plan bounded model inference |
| `flowio` | Read, inspect, and write Flow Cytometry Standard (FCS) 2.0, 3.0, and 3.1 files with FlowIO |
| `neuropixels-analysis` | Analyze Neuropixels extracellular recordings end-to-end with SpikeInterface |
| `neurokit2` | Use NeuroKit2 to build or audit reproducible research workflows for physiological time-series preprocessing, event/interval analysis, multimodal alignment, variability, and complexity |
| `pyhealth` | 用 PyHealth 构建临床/医疗深度学习流水线：加载 EHR/信号/影像数据集、定义任务、实例化模型、训练与临床指标计算 |
| `pydicom` | Use pydicom to read, inspect, write, transform, and safely preflight local DICOM datasets and pixel data |
| `labarchive-integration` | Securely integrate with the official LabArchives ELN REST-like API and Inventory API v1 |
| `benchling-integration` | Benchling Python SDK and REST API integration for registry entities, inventory, ELN entries, workflows, Benchling Apps, and Data Warehouse queries |
| `protocolsio-integration` | Read, validate, and safely export protocols.io data with current official REST/MCP contracts, or create non-executing mutation plans |
| `latchbio-integration` | Build, register, debug, and operate bioinformatics workflows on Latch using the Python SDK, CLI, Latch Data and Registry, Nextflow, Snakemake, programmatic execution, and Latch MCP |
| `dnanexus-integration` | Build and operate reproducible genomics workloads on DNAnexus with the dx CLI, dxpy, apps/applets, native workflows, dxCompiler, and Nextflow |
| `lamindb` | Use when working with LaminDB, the open-source lineage-native lakehouse for biological datasets and models |
| `pylabrobot` | Develop and review PyLabRobot lab-automation resources, liquid-handling plans, offline simulations, and supported-device integrations |
| `opentrons-integration` | Author, review, migrate, simulate, and troubleshoot official Opentrons Python Protocol API v2 protocols for Flex and OT-2 robots |
| `ginkgo-cloud-lab` | Submit and manage protocols on Ginkgo Bioworks Cloud Lab (cloud.ginkgo.bio), a web-based interface for autonomous lab execution on Reconfigurable Automation Carts (RACs) |
| `adaptyv` | How to use the Adaptyv Bio Foundry API and Python SDK for protein experiment design, submission, and results retrieval |
| `tamarind` | Access a collection of open-source molecular design and structural biology tools on the Tamarind Bio platform, via its REST API or MCP server — no local GPUs required |

## 化学与药物发现（13）

> 分子处理、对接、成药性与代谢建模

| 技能 | 说明 |
|---|---|
| `rdkit` | Cheminformatics toolkit for fine-grained molecular control |
| `datamol` | Pythonic wrapper around RDKit with simplified interface and sensible defaults |
| `medchem` | Medicinal chemistry filters for compound triage. Apply drug-likeness rules (Lipinski, Veber, CNS), structural alert catalogs (PAINS, NIBR, ChEMBL), complexity metrics, and the medchem query language for library filtering |
| `molfeat` | Molecular featurization for ML (100+ featurizers) |
| `deepchem` | Molecular ML with diverse featurizers and pre-built datasets |
| `diffdock` | DiffDock and DiffDock-L molecular docking. Use for protein-small-molecule pose prediction from PDB or sequence plus SMILES/SDF/MOL2, batch docking, virtual screening, and pose-confidence interpretation |
| `molecular-dynamics` | Run and analyze molecular dynamics simulations with OpenMM and MDAnalysis |
| `rowan` | Rowan is a cloud-native molecular modeling and medicinal-chemistry workflow platform with a Python API |
| `matchms` | Process, clean, compare, and search tandem mass spectra with matchms |
| `pyopenms` | Complete mass spectrometry analysis platform. Use for proteomics and metabolomics workflows—feature detection, peptide/protein identification, label-free and isobaric quantification, adduct/accurate-mass annotation, and complex LC-MS/MS pipelines |
| `pymatgen` | Analyze, validate, convert, and transform materials structures and computed materials data with current pymatgen APIs, including local phase diagrams, symmetry sensitivity, electronic-structure I/O, and explicitly bounded Materials Project queries |
| `cobrapy` | Constraint-based metabolic modeling (COBRA). FBA, FVA, gene knockouts, flux sampling, SBML models, for systems biology and metabolic engineering analysis |
| `pytdc` | Use Therapeutics Data Commons through the PyTDC Python package for registry discovery, approved dataset access, task-aware splits, evaluator metrics, benchmark groups, and bounded molecular-oracle workflows |

## 机器学习与 AI 工程（15）

> 传统 ML、深度学习、概率建模与 MCP 服务

| 技能 | 说明 |
|---|---|
| `scikit-learn` | Machine learning in Python with scikit-learn. Use when working with supervised learning (classification, regression), unsupervised learning (clustering, dimensionality reduction), model evaluation, hyperparameter tuning, preprocessing, or building ML pipelines |
| `scikit-survival` | Build, evaluate, and audit right-censored or competing-risk survival workflows with scikit-survival, including leakage-safe preprocessing, model selection, probability prediction, and censoring-aware metrics |
| `transformers` | Hugging Face Transformers for loading Hub models, running pipeline inference, text generation, and Trainer fine-tuning on NLP, vision, audio, and multimodal tasks |
| `pytorch-lightning` | Deep learning framework (PyTorch Lightning / lightning package) |
| `torch-geometric` | PyTorch Geometric (PyG) for graph neural networks — node/link/graph classification, message passing (GCN, GAT, GraphSAGE, GIN), heterogeneous graphs, neighbor sampling, and custom datasets |
| `torchdrug` | Build and troubleshoot TorchDrug 0.2.1 workflows for molecular graphs, property prediction, self-supervised pretraining, molecule generation, retrosynthesis, protein representation learning, and knowledge graph reasoning |
| `stable-baselines3` | Production-ready reinforcement learning algorithms (PPO, SAC, DQN, TD3, DDPG, A2C) with scikit-learn-like API |
| `pufferlib` | Version-aware guidance for PufferLib reinforcement-learning environments, vectorization, policies, PuffeRL training, evaluation, and safe checkpoint review |
| `pymc` | Bayesian modeling with PyMC. Build hierarchical models, MCMC (NUTS), variational inference, LOO/WAIC comparison, posterior checks, for probabilistic programming and inference |
| `shap` | Explain and audit machine-learning predictions with SHAP |
| `umap-learn` | Use UMAP-learn for nonlinear dimensionality reduction, 2D/3D embeddings, clustering preprocessing, supervised or semi-supervised UMAP, DensMAP, AlignedUMAP, and Parametric UMAP workflows |
| `statsmodels` | Statistical models library for Python. Use when you need specific model classes (OLS, GLM, mixed models, ARIMA) with detailed diagnostics, residuals, and inference |
| `modal` | Modal is a serverless cloud platform for running Python on demand, including on-demand GPUs |
| `mcp-builder` | Build high-quality MCP (Model Context Protocol) servers that let LLMs interact with external services through well-designed tools |
| `notion-mcp` | Use when interacting with Notion workspace via MCP tools - creating, searching, updating pages, databases, views, comments, or querying data |

## 数据与基础设施（6）

> 大数据框、分布式计算、存储与资源编排

| 技能 | 说明 |
|---|---|
| `polars` | High-performance DataFrame library for Python ETL, analytics, and pandas migration |
| `dask` | Distributed computing for larger-than-RAM pandas/NumPy workflows |
| `vaex` | Use this skill for processing and analyzing large tabular datasets (billions of rows) that exceed available RAM |
| `zarr-python` | Chunked N-D arrays for cloud storage (Zarr-Python 3) |
| `networkx` | Create, analyze, and visualize complex networks and graphs in Python with NetworkX |
| `simpy` | Build, inspect, test, and analyze bounded process-based discrete-event simulations with SimPy, including events, resources, interrupts, monitoring, replications, warm-up, and reproducible output analysis |

## 科学计算与仿真（12）

> 符号计算、量子计算、天体物理与数值优化

| 技能 | 说明 |
|---|---|
| `sympy` | Use when you need exact symbolic math in Python — algebra, calculus, equation solving, symbolic linear algebra, or code generation via lambdify/LaTeX |
| `pennylane` | Hardware-agnostic quantum ML framework with automatic differentiation |
| `qiskit` | Build, simulate, transpile, and execute quantum circuits with Qiskit and IBM Quantum Runtime |
| `cirq` | Google quantum computing framework. Use when targeting Google Quantum AI hardware, designing noise-aware circuits, or running quantum characterization experiments |
| `qutip` | Simulate and audit closed and open quantum-system models with QuTiP 5, including deterministic, trajectory, steady-state, spectral, and phase-space workflows |
| `astropy` | Core Python library for astronomy and astrophysics workflows that need Astropy APIs, including units/quantities, coordinates, FITS I/O, tables, time systems, WCS, and cosmology |
| `pymoo` | Multi-objective optimization framework. NSGA-II, NSGA-III, MOEA/D, Pareto fronts, constraint handling, benchmarks (ZDT, DTLZ), for engineering design and optimization problems |
| `fluidsim` | Plan, configure, inspect, restart, and analyze bounded FluidSim computational-fluid-dynamics simulations with explicit numerical-validity and HPC safety checks |
| `optimize-for-gpu` | GPU-accelerates scientific Python on NVIDIA hardware and verifies that the result is correct and faster |
| `get-available-resources` | Detect host inventory and effective CPU, memory, disk, scheduler, container, and accelerator limits when a user asks for resource-aware planning or before a clearly resource-sensitive local workload |
| `timesfm-forecasting` | Zero-shot time series forecasting with Google's TimesFM foundation model |
| `aeon` | This skill should be used for time series machine learning tasks including classification, regression, clustering, forecasting, anomaly detection, segmentation, and similarity search |

## 地理空间与遥感（2）

> 遥感、GIS 与地球观测

| 技能 | 说明 |
|---|---|
| `geomaster` | Comprehensive geospatial science skill covering remote sensing, GIS, spatial analysis, machine learning for earth observation, and 30+ scientific domains |
| `geopandas` | Guidance and local audit tools for Python workflows that directly use GeoPandas GeoSeries, GeoDataFrame, spatial operations, or vector-data I/O |

### CLI-Anything · 创意与媒体（14）

| 技能 | 说明 |
|---|---|
| `cli-anything-blender` | Command-line interface for Blender - A stateful command-line interface for 3D scene editing, following the same patterns as the GIMP CLI |
| `cli-anything-gimp` | Command-line interface for Gimp - A stateful command-line interface for image editing, built on Pillow |
| `cli-anything-inkscape` | Command-line interface for Inkscape - A stateful command-line interface for vector graphics editing, following the same patterns as the GI |
| `cli-anything-krita` | CLI harness for Krita digital painting — manage projects, layers, filters, and export via command line |
| `cli-anything-audacity` | Command-line interface for Audacity - A stateful command-line interface for audio editing, following the same patterns as the GIMP and Ble |
| `cli-anything-musescore` | CLI for music notation — transpose, export PDF/audio/MIDI, extract parts, manage instruments |
| `cli-anything-kdenlive` | Command-line interface for Kdenlive - A stateful command-line interface for video editing, following the same patterns as the Blender CLI |
| `cli-anything-shotcut` | Command-line interface for Shotcut - A stateful command-line interface for video editing, built on the MLT XML format |
| `cli-anything-obs-studio` | Command-line interface for Obs Studio - A stateful command-line interface for OBS Studio scene collection editing, following the same patter |
| `cli-anything-openscreen` | Command-line interface for Openscreen — a screen recording editor |
| `cli-anything-videocaptioner` | AI-powered video captioning — transcribe speech, optimize/translate subtitles, and burn them into video via the stable VideoCaptioner backend |
| `cli-anything-live2d` | Inspect, validate, edit, lint, diff, batch-manage, and deploy Live2D Cubism models (.model3.json) from the command line |
| `cli-anything-quietshrink` | Compress macOS screen recordings with zero CPU stress using Apple Silicon's hardware HEVC encoder |
| `cli-anything-calibre` | Command-line interface for Calibre - A stateful CLI harness for e-book library management, metadata editing, and format conversion wrapping the real Calibre tools (calibredb, ebook-convert, ebook-meta) |

### CLI-Anything · 3D、CAD 与制造（3）

| 技能 | 说明 |
|---|---|
| `cli-anything-freecad` | Complete CLI harness for FreeCAD parametric 3D CAD modeler (258 commands) |
| `cli-anything-threemf` | 3MF mesh geometry editor — detect and resize cylindrical holes, repair meshes, compare 3D printing files |
| `cli-anything-cloudcompare` | Command-line interface for CloudCompare — Agent-friendly harness for CloudCompare, the open-source 3D point cloud and mesh processing software |

### CLI-Anything · 游戏与引擎（4）

| 技能 | 说明 |
|---|---|
| `cli-anything-godot` | Agent-native CLI for Godot project management, scenes, exports, and script execution |
| `cli-anything-sbox` | Agent-native CLI for the s&box game engine (Facepunch Studios, Source 2): project management, scene/prefab editing, material/sound/localization configs, C# code generation, asset graph queries, project validation, and editor launch |
| `cli-anything-unrealinsights` | Capture Unreal Engine traces, inspect Trace Store files, keep Unreal Insights GUI open, and export/summarize timing/counter data |
| `cli-anything-slay-the-spire-ii` | Command-line interface for Slay the Spire 2 - Control the real game through a local bridge mod HTTP API |

### CLI-Anything · 图表、文档与笔记（9）

| 技能 | 说明 |
|---|---|
| `cli-anything-drawio` | Command-line interface for Drawio - A CLI harness for **Draw.io** — create, edit, and export diagrams from the command line |
| `cli-anything-mermaid` | Command-line interface for Mermaid Live Editor - Create, edit, and render Mermaid diagrams via stateful project files and mermaid.ink renderer URLs |
| `cli-anything-libreoffice` | Command-line interface for Libreoffice - A stateful command-line interface for document editing, producing real ODF files (ZIP archives with |
| `cli-anything-joplin` | Command-line interface for Joplin workflows using the real joplin terminal backend |
| `cli-anything-obsidian` | Command-line interface for Obsidian — Knowledge management and note-taking via Obsidian Local REST API |
| `cli-anything-siyuan` | SiYuan (思源笔记) CLI — manage notebooks, documents, blocks, and search your knowledge base from the terminal |
| `cli-anything-notebooklm` | Experimental NotebookLM harness for listing notebooks, managing sources, asking questions, generating artifacts, and downloading outputs through an installed notebooklm CLI |
| `cli-anything-zotero` | CLI harness for Zotero |
| `cli-anything-mubu` | Command-line interface for Mubu - Canonical packaged entrypoint for the Mubu live bridge |

### CLI-Anything · 数据库与存储（3）

| 技能 | 说明 |
|---|---|
| `cli-anything-chromadb` | Command-line interface for ChromaDB - A stateless CLI for managing vector database collections, documents, and semantic search |
| `cli-anything-tigris` | Command-line interface for Tigris object storage — wraps the official tigris CLI to expose buckets, objects, presigned URLs, snapshots, IAM, and scoped access keys to AI agents |
| `cli-anything-openrefine` | Use OpenRefine through an agent-native CLI for importing messy data, applying JSON operation histories, inspecting rows, exporting cleaned data, and managing session undo/redo |

### CLI-Anything · AI 与 LLM（6）

| 技能 | 说明 |
|---|---|
| `cli-anything-ollama` | Command-line interface for Ollama - Local LLM inference and model management via Ollama REST API |
| `cli-anything-comfyui` | Command-line interface for ComfyUI - AI image generation workflow management via ComfyUI REST API |
| `cli-anything-dify-workflow` | Wrapper for the Dify workflow DSL CLI. Create, inspect, validate, edit, and export Dify workflow files through a CLI-Anything harness |
| `cli-anything-minimax` | Command-line interface for MiniMax AI — chat (MiniMax-M3, MiniMax-M2.7) and speech-2.x TTS via the MiniMax API |
| `cli-anything-novita` | Command-line interface for Novita AI - An OpenAI-compatible AI API client for DeepSeek, GLM, and other models |
| `cli-anything-anygen` | Command-line interface for Anygen - A stateful command-line interface for AnyGen OpenAPI — generate professional slides, documents, webs |

### CLI-Anything · 自动化与集成（9）

| 技能 | 说明 |
|---|---|
| `cli-anything-n8n` | Command-line interface for n8n workflow automation platform |
| `cli-anything-mailchimp` | CLI harness for the Mailchimp Marketing API v3.0 — 303 commands across 30 resource groups (lists, campaigns, reports, automations, ecommerce, templates, and more) |
| `cli-anything-wiremock` | Python CLI harness for WireMock HTTP mock server administration |
| `cli-anything-seaclip` | Command-line interface for SeaClip-Lite - A stateless CLI for managing issues, pipelines, agents, schedules, and activity on the SeaClip-Lite project management board |
| `cli-anything-pm2` | Command-line interface for PM2 - A stateless CLI for Node.js process management via the PM2 CLI |
| `cli-anything-hermes` | Use when the user wants Hermes Agent to build, refine, test, or validate a CLI-Anything harness for a GUI application or source repository |
| `cli-anything-macrocli` | Use when the agent wants to define, list, inspect, or execute GUI macros via the MacroCLI CLI |
| `cli-anything-web-yu-pri` | Use Japan Post Web Yu-pri from a CLI by driving the real browser UI for login, inspection, screenshots, dry-run planning, and contents-form filling |
| `cli-anything` | 把 CLI-Anything 方法论适配到本 harness：为 GUI 应用或源码仓库构建、细化、测试与列出 CLI harness |

### CLI-Anything · 系统、运维与调试（13）

| 技能 | 说明 |
|---|---|
| `cli-anything-iterm2` | Provides the cli-anything-iterm2 commands — the only way to actually send text to iTerm2 sessions, read live terminal output and scrollback history, manage windows/tabs/split panes, run tmux -CC workflows, broadcast to multiple panes, show macOS dialogs, and read/write iTerm2 preferences |
| `cli-anything-iterm2-ctl` | Provides the cli-anything-iterm2 commands — the only way to actually send text to iTerm2 sessions, read live terminal output and scrollback history, manage windows/tabs/split panes, run tmux -CC workflows, broadcast to multiple panes, show macOS dialogs, and read/write iTerm2 preferences |
| `cli-anything-lldb` | Stateful LLDB debugging via LLDB Python API |
| `cli-anything-renderdoc` | CLI harness for RenderDoc graphics debugger capture analysis |
| `cli-anything-nsight-graphics` | Windows-first CLI harness for Nsight Graphics capture, GPU Trace summary, and ngfx-replay analysis |
| `cli-anything-nslogger` | CLI harness for NSLogger — parse, filter, export, and monitor NSLogger log files (.rawnsloggerdata / .nsloggerdata) |
| `cli-anything-rms` | Teltonika RMS device management and monitoring CLI |
| `cli-anything-jumpserver` | Stateful CLI harness for JumpServer bastion host management |
| `cli-anything-ccswitch` | CLI interface for CC Switch — manage AI coding tool configurations from the terminal |
| `cli-anything-adguardhome` | Command-line interface for AdGuard Home - Network-wide ad blocking and DNS management via AdGuard Home REST API |
| `cli-anything-eth2-quickstart` | Use eth2-quickstart to autonomously deploy a hardened Ethereum node, install execution and consensus clients, configure validator metadata, expose RPC safely, and inspect node health with structured JSON output |
| `cli-anything-unimol-tools` | Interactive CLI for Uni-Mol molecular property prediction training and inference workflows |
| `cli-anything-eez-studio` | 从命令行驱动 EEZ Studio：检视与修改 .eez-project、编辑 LVGL 屏幕/控件、管理 SCPI 命令并调用真实后端构建 |

### CLI-Anything · 浏览器与 Web（3）

| 技能 | 说明 |
|---|---|
| `cli-anything-browser` | Browser automation CLI using DOMShell MCP server. Maps Chrome's Accessibility Tree to a virtual filesystem for agent-native navigation |
| `cli-anything-safari` | Safari browser automation CLI on macOS via safari-mcp |
| `cli-anything-exa` | Agent-native CLI for Exa web search and content retrieval workflows |

### CLI-Anything · 效率与生活（7）

| 技能 | 说明 |
|---|---|
| `cli-anything-firefly-iii` | Firefly III CLI - Personal finance management via CLI-Anything |
| `cli-anything-rekordbox` | Command-line interface for Pioneer Rekordbox 6/7 - DJ library and live-deck control via guarded SQLCipher master.db access (pyrekordbox) + virtual MIDI mapping |
| `cli-anything-zoom` | Command-line interface for Zoom - CLI harness for **Zoom** — manage meetings, participants, and recordings from the command line via t |
| `cli-anything-wavetone` | Control WaveTone 2.61 workflows through a JSON manifest and launch the real Windows WaveTone executable |
| `cli-anything-cloudanalyzer` | Command-line interface for CloudAnalyzer — Agent-friendly harness for CloudAnalyzer, a QA platform for mapping, localization, and perception outputs |
| `cli-anything-qgis` | Stateful QGIS CLI for projects, writable layers, features, layouts, exports, and qgis_process operations using the real QGIS runtime |
| `cli-anything-intelwatch` | Zero friction. Full context |

## Nature 系列 · 论文全流程（14）

> 科研论文写作、精读、润色、配图、投稿与审稿回复；面向 CNS 级与中文科研场景

| 技能 | 说明 |
|---|---|
| `nature-academic-search` | Search literature across sources, verify or manage citations, and build MeSH strategies or citation-impact audits |
| `nature-citation` | Find and verify Nature/CNS-family literature supporting manuscript claims, with claim-to-source mapping and reference-manager export |
| `nature-data` | Draft or audit manuscript Data/Code Availability statements, dataset access routes, repository plans, and FAIR metadata |
| `nature-downloader` | Use when a user needs lawful academic full text, CNKI institutional access, English OA retrieval, publisher API access, institutional browser fallback, or supporting information downloads |
| `nature-experiment-log` | 标准化实验日志记录——直接上传或读取本地图片、语音和文字，产出带 YAML frontmatter 的 Markdown；可选集成飞书 CLI 与 Obsidian |
| `nature-figure` | Create, revise, audit, and export manuscript scientific figures in Python or R |
| `nature-literature-pipeline` | / Complete automated literature discovery pipeline: multi-source search → six-dimension scoring → fine reading → formatted delivery → archival |
| `nature-paper-to-patent` | Turn research papers or inventor materials into evidence-grounded Chinese invention patent drafts and technical disclosures |
| `nature-paper2ppt` | Create or improve a Chinese academic PPTX from a scientific paper or research reading notes, with source figures and speaker notes |
| `nature-polishing` | Polish, translate, or tighten existing academic prose while preserving facts, terminology, and evidence boundaries |
| `nature-reader` | Create source-grounded Chinese-English paper readers with aligned text, figures, tables, and equations |
| `nature-response` | Draft, audit, or revise responses to peer review, revision cover letters, and marked-manuscript or LaTeX revision packages |
| `nature-reviewer` | Provide evidence-grounded mock peer review of scientific manuscripts or excerpts, covering significance, validity, and major/minor concerns |
| `nature-writing` | Draft or restructure scientific manuscript arguments, sections, and initial-submission materials from author-provided evidence |

## GStack 套件（54）

> 规划/审查/QA/设计/部署/文档的端到端工作流套件，入口为 `gstack` 路由

| 技能 | 说明 |
|---|---|
| `gstack` | / Router for the gstack skill suite. Sends any gstack request to the right skill (planning, review, QA, shipping, debugging, docs, security, design) |
| `gstack-autoplan` | / Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles |
| `gstack-benchmark` | / Performance regression detection. Establishes baselines for page load times, Core Web Vitals, and resource sizes |
| `gstack-benchmark-models` | / Cross-model benchmark for gstack skills. Runs the same prompt through Claude, GPT (via Codex CLI), and Gemini side-by-side — compares latency, tokens, cost, and optionally quality via LLM judge |
| `gstack-browse` | / Drive a real browser through Aside: open a page, read it, click through a flow, take screenshots, check console errors |
| `gstack-canary` | / Post-deploy canary monitoring. Watches the live app for console errors, performance regressions, and page failures |
| `gstack-careful` | / Safety guardrails for destructive commands. Warns before rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete, and similar destructive operations |
| `gstack-claude` | / Claude Code CLI wrapper for non-Claude hosts - three modes |
| `gstack-context-restore` | / Restore working context saved earlier by /context-save |
| `gstack-context-save` | / Save working context. Captures git state, decisions made, and remaining work so any future session can pick up without losing a beat |
| `gstack-cso` | / Chief Security Officer mode. Infrastructure-first security audit: secrets archaeology, dependency supply chain, CI/CD pipeline security, LLM/AI security, skill supply chain scanning, plus OWASP Top 10, STRIDE threat modeling, and active verification |
| `gstack-design-consultation` | / Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic, typography, color, layout, spacing, motion), and generates font+color preview pages |
| `gstack-design-html` | / Design finalization: generates production-quality Pretext-native HTML/CSS |
| `gstack-design-review` | / Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them |
| `gstack-design-shotgun` | / Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate |
| `gstack-devex-review` | / Live developer experience audit. Actually TESTS the developer experience in the Aside browser: navigates docs, tries the getting started flow, times TTHW, screenshots error messages, evaluates CLI help text |
| `gstack-diagram` | / Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open on excalidraw.com, and rendered SVG + PNG |
| `gstack-document-generate` | / Generate missing documentation from scratch for a feature, module, or entire project |
| `gstack-document-release` | / Post-ship documentation update. Reads all project docs, cross-references the diff, builds a Diataxis coverage map (reference/how-to/tutorial/explanation), updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md to match what shipped, detects architecture diagram drift, polishes CHANGELOG voice with a sell-test rubric, cle… |
| `gstack-freeze` | / Restrict file edits to a specific directory for the session |
| `gstack-guard` | / Full safety mode: destructive command warnings + directory-scoped edits |
| `gstack-health` | / Code quality dashboard. Wraps existing project tools (type checker, linter, test runner, dead code detector, shell linter), computes a weighted composite 0-10 score, and tracks trends over time |
| `gstack-investigate` | / Systematic debugging with root cause investigation |
| `gstack-ios-clean` | / Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app |
| `gstack-ios-design-review` | / Visual design audit for iOS apps on real hardware |
| `gstack-ios-fix` | / Autonomous iOS bug fixer. Takes a bug found by /ios-qa, reads the source, writes the fix, rebuilds, redeploys, and verifies the fix on the real device |
| `gstack-ios-qa` | / Live-device iOS QA for SwiftUI apps. Connects to a real iPhone via USB CoreDevice IPv6 tunnel, reads Swift source to understand every screen, then runs a vision-driven agent loop: screenshot → analyze → decide → act → verify → repeat |
| `gstack-ios-sync` | / Regenerate the iOS debug bridge against the latest upstream gstack templates |
| `gstack-land-and-deploy` | / Land and deploy workflow. Merges the PR, waits for CI and deploy, verifies production health via canary checks |
| `gstack-landing-report` | / Read-only queue dashboard for workspace-aware ship |
| `gstack-learn` | / Manage project learnings. Review, search, prune, and export what gstack has learned across sessions |
| `gstack-make-pdf` | / Turn any markdown file into a publication-quality PDF |
| `gstack-office-hours` | / YC Office Hours — two modes. Startup mode: six forcing questions that expose demand reality, status quo, desperate specificity, narrowest wedge, observation, and future-fit |
| `gstack-open-gstack-browser` | / Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in |
| `gstack-pair-agent` | / Pair a remote AI agent with your browser. One command generates a setup key and prints instructions the other agent can follow to connect |
| `gstack-plan-ceo-review` | / CEO/founder-mode plan review. Rethink the problem, find the 10-star product, challenge premises, expand scope when it creates a better product |
| `gstack-plan-design-review` | / Designer's eye plan review — interactive, like CEO and Eng review |
| `gstack-plan-devex-review` | / Interactive developer experience plan review. Explores developer personas, benchmarks against competitors, designs magical moments, and traces friction points before scoring |
| `gstack-plan-eng-review` | / Eng manager-mode plan review. Lock in the execution plan — architecture, data flow, diagrams, edge cases, test coverage, performance |
| `gstack-plan-tune` | / Self-tuning question sensitivity + developer psychographic for gstack (v1: observational) |
| `gstack-qa` | / Systematically QA test a web application and fix bugs found |
| `gstack-qa-only` | / Report-only QA testing. Systematically tests a web application and produces a structured report with health score, screenshots, and repro steps — but never fixes anything |
| `gstack-retro` | / Weekly engineering retrospective. Analyzes commit history, work patterns, and code quality metrics with persistent history and trend tracking |
| `gstack-review` | / Pre-landing PR review. Analyzes diff against the base branch for SQL safety, LLM trust boundary violations, conditional side effects, and other structural issues |
| `gstack-scrape` | / Pull data from a web page through the Aside browser — your real, already signed-in sessions |
| `gstack-setup-browser-cookies` | / Import cookies from your real Chromium browser into the headless browse session |
| `gstack-setup-deploy` | / Configure deployment settings for /land-and-deploy |
| `gstack-setup-gbrain` | / Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy |
| `gstack-ship` | / Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR |
| `gstack-skillify` | / Codify the most recent successful /scrape flow into a permanent browser-skill on disk |
| `gstack-spec` | / Turn vague intent into a precise, executable spec in five phases |
| `gstack-sync-gbrain` | / Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md |
| `gstack-unfreeze` | / Clear the freeze boundary set by /freeze, allowing edits to all directories again |
| `gstack-upgrade` | / Upgrade gstack to the latest version. Detects global vs vendored install, runs the upgrade, and shows what's new |

## Doko 系列（浏览器检索）（5）

> 经用户真实 Chrome 读取网页与搜索结果，无需 API key

| 技能 | 说明 |
|---|---|
| `doko-research` | Iterative web research with structured synthesis and source tracking |
| `doko-search` | Free web search using dokobot read in local mode — read search engine result pages through your real Chrome browser |
| `doko-summarize` | Generate concise summaries of web pages with key points extraction |
| `doko-translate` | Translate web page content while preserving structure and formatting |
| `dokobot` | Read and extract content from any web page using a real Chrome browser — including SPAs, JavaScript-rendered sites, and complex dynamic pages |

---

## 高频技能链

| 场景 | 推荐组合 |
|---|---|
| 需求到实现 | `think` → `planning-and-task-breakdown` → `incremental-implementation` → `tdd` → `check` |
| 定位疑难 bug | `diagnosing-bugs` → `hunt` → `debugging-and-error-recovery` |
| 前端页面实现 | `design-taste-frontend` → `frontend-ui-engineering` → `web-design-guidelines` → `webapp-testing` |
| 可访问性与性能 | `a11y-debugging` → `web-accessibility-audit` → `web-performance-audit` → `debug-optimize-lcp` |
| 提交与发布 | `git-workflow-and-versioning` → `create-pull-request` → `ci-fix` → `shipping-and-launch` |
| 需要联网取证 | `read`（已知 URL）→ `doko-search` 或 `exa-search` → `parallel-web`（深研） |
| 需要驱动真实浏览器 | `browser` 或 `opencli-usage` → `opencli-browser` |
| 论文写作 | `literature-review` → `nature-writing` → `nature-polishing` → `nature-figure` |
| 数据分析 | `exploratory-data-analysis` → `polars` → `statistical-analysis` → `scientific-visualization` |
| 委托子任务 | `dispatching-parallel-agents` 思路 + `task` 工具（子任务严格只读，见 AGENTS.md R26） |

## 选择规范（AGENTS.md R24）

1. **先列同类再选**：使用某类技能前，先在本文件中列出该类的全部候选，可**同时加载多个**。
2. **规则优先**：用户指令 > 技能指引 > 默认行为；技能不得覆盖 `AGENTS.md`。
3. **流程先于实现**：规划类技能（`think` / `planning-and-task-breakdown`）用在实现类之前。
4. **项目优先**：项目级 `.agents/skills/` > 用户级 > 内置（本项目当前无项目级技能）。
5. **不确定就先查**：不知道有没有对应技能时用 `find-skills` / `ask-matt`。

## 加载方式

```
read skill://<skill-name>          # 读取技能说明（第一步必做）
read skill://<skill-name>/<file>   # 读取技能内的附属文件
```

多个技能可连续读取；技能说明会给出确切的命令、参数与陷阱。

---

_技能总数: 432_
_去重后 432 = `~/.agents/skills/` 368 + `~/.config/opencode/skills/` 64（两者仅 `notion-mcp` 同名）_
_本文件由 AI 维护；**新增/删除/修改技能后必须同步**，且只列实际存在的技能_
