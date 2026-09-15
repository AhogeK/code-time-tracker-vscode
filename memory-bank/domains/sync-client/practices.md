# sync-client — practices

> 来源：`../ctt-server` 源码 + `../code-time-tracker` 的 `SyncCoordinator` / `SyncSessionApplier` / `SYNC-CORE-DESIGN.md`
> 最后确认：2026-09-15 ｜ 适用范围：同步循环与状态机的具体做法 ｜ 状态：**已核实**

## 同步循环（一轮）

```
1. pull  ← 用本地持久化的游标
   └─ 按 changeId 升序应用 changes[]
   └─ 持久化响应里的 nextCursor
   └─ hasMore === true 时重复步骤 1
   └─ 记录本步结束时的游标 C（步骤 3 要从它开始）
2. push  ← 本地所有 dirty 会话（分批）
   └─ 成功则清除这些会话的 dirty 标记
   └─ **不推进 pull 游标**（push 响应的 nextCursor 只记日志，不进游标）
3. pull  ← 用**步骤 1 结束时的游标 C** 再拉一次，收敛到服务端权威状态
```

**步骤 3 不能省**：它让本设备看到服务端对自己推送的**裁决结果** —— 尤其是竞争失败时服务端
采纳的版本。`KEEP_EXISTING` 不写 change-log，所以服务端对这个会话的裁决**只能**从这条
change 里读到。

**步骤 3 必须用 C，不能用 push 响应的 nextCursor**（红线）：

- 服务端 push 响应返回的是「该用户当前的**最大** changeId」（`SyncPushService` →
  `findMaxChangeIdForUser`），也就是**本次 push 产生的 change 之后**的位置
- 从它开始拉，会**恰好跳过**本次 push 写下的那些 change 行 —— 包括服务端否决你推送时写下的
  裁决结果。客户端于是保留陈旧本地状态，**永不收敛**
- 参考实现正是为此拒绝使用 push 游标（`SYNC-CORE-DESIGN.md` 决策 #1：
  「pull 游标只由 pull 响应推进，push 不推进 …… 若用作 pull 起点会跳过本机自己的 change」）

**游标推进的唯一来源是 pull 响应**。push 响应里的 `nextCursor` 只值得记进日志。

**重入保护**：手动触发与定时触发可能重叠。用原子标志防重入（参考实现用 CAS 锁），
两个同步循环并发会互相覆盖游标。

## 应用拉取结果（五种结局）

参考实现 `SyncSessionApplier` 的分支，本仓库应保持等价语义：

| 本地状态 | 服务端变更 | 动作 |
|---|---|---|
| 无该 `sessionUuid` | `UPSERT` | 创建 |
| 有、本地**干净** | `UPSERT` | 覆盖 |
| 有、本地 **dirty** | `UPSERT` | **跳过**（本地未推送的编辑优先，下次 push 由 LWW 裁决） |
| 有、本地干净 | `DELETE` | 软删除（保留行作为墓碑） |
| 有、本地 dirty | `DELETE` | **保留本地**（同上理由） |
| 任意 | `sessionUuid` 为 null | 跳过（服务端物理删除的降级路径） |

**墓碑**：不要物理删除行 —— 删掉后服务端再次投递该 `sessionUuid` 会重新创建，
出现「删了又回来」的循环。

## 推送载荷（8 字段，一字不差）

```
sessionUuid      string(uuid)  客户端生成，每用户唯一
projectName      string        非空
language         string        非空
startTime        string(ISO)   UTC，带 Z
endTime          string(ISO)   UTC，带 Z
clientModifiedAt string(ISO)   LWW 输入
clientVersion    number        ≥0，每次本地修改递增
deleted          boolean       软删除标记
```

**不要发送**：时长/秒数、设备名、IDE 名、时区、偏移 —— 服务端自行推导或从注册信息取。

**时间格式**：UTC ISO-8601 带 `Z`（服务端 `docs/time-strategy.md` 的强制约定）。
本地时间字符串会被解析成错误时刻，进而毒化 LWW 与统计分桶。

## 游标持久化

- 键：(账号标识, `deviceId`) —— 换账号必须换键或清空
- 值：`lastPulledChangeId`，**单调递增**
- 写入时机：**每次成功应用一页之后**（不是整轮结束后）—— 中断时才能从断点续拉
- 附带记录（便于排障）：`lastPushAt`、`lastSyncAt`、`lastError`

## 设备注册

```
POST /api/v1/devices
{
  deviceId:   <UUIDv4，持久化>
  deviceName: <机器名，便于用户在 ctt-web 辨认>
  platform:   "macOS" | "Windows" | "Linux"      (≤50 字符)
  ideName:    "VSCode"                            (≤100 字符)
  ideVersion: <VS Code 版本，来自 vscode.version> (≤50)
  appVersion: <本扩展版本，来自 packageJSON.version> (≤50)
}
```

- 服务端 upsert；**重注册同一 `deviceId` 会清除 `revokedAt`**（P7 自愈路径）
- 触发时机：首次绑定、启动时若本地无注册记录、收到 `404 COMMON_002` 后
- `ideName` 决定 IDE 维度归因与 `ideName` 过滤（`../server-api` P8）——
  **必须用独立 `deviceId`**，否则与同机 JetBrains 插件塌成一个桶

## 定时与手动同步

- 定时：`setInterval` 并保存 handle，随扩展停用 `clearInterval`（`systemPatterns.md`）
- 手动：命令面板命令 + 状态栏/通知反馈
- **关窗时**：VS Code 的停用是「快速返回」语义 —— 落盘本地状态后立即返回，网络同步不可依赖
- 间隔可配置（`contributes.configuration`），`0` = 关闭

## 测试配方

1. push → pull 增量 → 再 pull 返回空且游标不变（幂等）
2. 同一会话推两次不同版本 → 只有一行，且是胜者的字段
3. 推一个服务端从未有过的删除 → 无操作，无 change log 条目
4. 分页：把小批量值调下，推超过一页的数据，按 `hasMore` 拉干；断言无重复、`changeId` 升序、
   最终游标等于 push 游标
5. 设备边界：他人/已吊销设备 → 两个端点都 `404 COMMON_002`
6. 本地 dirty 不被拉取覆盖（P3）
7. 账号切换后游标被清空、不跨账号串数据

参考实现在 `../code-time-tracker` 有 4 个双设备收敛场景测试（创建/编辑/删除/并发 LWW），
可作用例设计的参照。
