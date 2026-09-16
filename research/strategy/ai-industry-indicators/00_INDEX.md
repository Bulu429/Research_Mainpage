---
title: AI 产业指标监控体系
type: 策略研究
created: 2026-07-28
updated: 2026-07-28
tags: [AI, 泡沫监测, 景气度, 指标体系]
---

# AI 产业指标监控体系

对标中金公司研究部《AI产业指标监控体系》图表23，从**需求 / 现金流 / 资金来源 / 外部约束**四个维度、20 项指标监测 AI 产业的景气与泡沫状态。主展示口径已接入 `20260727_AI产业指标监测体系(1).xlsx` 数据底稿，共 23 条序列。

框架的价值在于把"AI 是不是泡沫"这个定性问题拆成一组可逐期复核的观测点。真正的信号不在单项指标，而在**维度间的背离**——需求端 token 调用量还在数倍增长，而现金流端 Big5 自由现金流同比 -78%、资本开支已占经营性现金流 94%，这两条线的裂口才是要盯的东西。

---

## 怎么用

```bash
python import_workbook.py
```
```bash
python refresh_dashboard.py
```
```bash
python build_dashboard.py && python render_html.py
```

看板：`AI产业指标监控_看板.html`（本地服务端口 7809）

- `indicators/auto/*.csv` 由脚本生成，**不要手工编辑**，改了下次跑脚本会被覆盖。
- `indicators/manual/*.csv` 是人工录入区，每行必须填 `source` 和 `vintage`。
- `indicators/workbook/*.csv` 由 `import_workbook.py` 从底稿生成，**不要手工编辑**；`_manifest.json` 记录每条序列的覆盖范围和 Summary 对账结果。
- 增删指标、改口径一律改 `config/indicators.yaml`，不要改 Python 里的常量。

### CSV 统一格式

```csv
date,key,value,unit,source,vintage,note
2026-06-30,big5_fcf,9.5,bn_usd,yfinance,2026-07-28,Big5 合计单季
```

`vintage` = 取数日期。财务数据会被追溯修订，没有 vintage 就无法解释同一个历史点的值为什么变了。

---

## 数据底稿接入原则

1. **底稿作为历史锚点。** 20 项指标的标签、频率、范围和历史值对齐底稿 Summary。
2. **公开接口只向后续接。** #1/#2/#4/#16/#18/#20 仅采用比底稿更新的联网观测；接口失败时自动回退到底稿，不重写历史。
3. **导入必须通过 23 条序列对账。** `import_workbook.py` 会把各 Sheet 转为统一 CSV，并逐项核对 Summary 的最新值；任一项不一致即停止写入。
4. **原始底稿不修改。** 导入器只读取 xlsx 的缓存值，输出到 `indicators/workbook/`。

底稿接入后，项目相对旧版有四处关键回正：

- 第 3 项同时保留下游“使用量加权 LLM token 支出指数”和上游“B200 GPU 租赁价格”，两条序列单位独立。
- 第 9、10、11、12 项改为底稿中的 **2026 年一致预期周频序列**，不再用季度实际值替代预期指标。
- 第 15 项改为底稿的“投资级科技信用债利差（USOAIGTC Index，bp）”。
- 第 16 项恢复为“对非银机构贷款 / 总贷款（私募信贷）”，不再用“硅谷 VC 信心指数”替代。

---

## 极性（polarity）与配色

这是本体系最容易搞错的地方。**配色和趋势箭头编码的是"指标好坏"，不是"数值正负"。**

- `polarity: positive` —— 数值上行 = 产业向好 → 上行染蓝、绿色上箭头
- `polarity: negative` —— 数值上行 = 风险积累 → 上行染红、红色下箭头

原表中第 11 项资本开支占比 +22%/+29% 全部染红、第 14 项 CDS 上行 +11.3bp 配红色下箭头，就是这个逻辑。

`polarity: negative` 的指标：**#3 使用成本除外**，共 #11 资本开支占比、#12 负债权益比、#13 债券发行、#14 CDS、#15 信用利差、#19 裁员占比 六项。

---

## 与原表的三处差异（已核实）

### 1. 第 20 项单位：原表「万亿美元」应为「十亿美元」

已用 Census 原始数据核实：2026-05 私人数据中心建造支出（季调年化）= **59,307 百万美元 = 59.3 十亿美元**，与中金读数 59.3 完全吻合。原表单位标注有误。本体系按十亿美元记录。

### 2. 第 18 项就业口径：动态吻合，水位低约 100 万人

本体系口径 = FRED `USINFO`（信息业）+ `USFIRE`（金融活动）+ `CES6054150001`（计算机系统设计及相关服务）。

| | 本体系 | 中金 |
|---|---|---|
| 最新值 | 1425.3 万人 | 1524.8 万人 |
| 环比 | -0.4 万人 | -0.3 万人 |
| 同比 | -21.4 万人 | **-21.6 万人** |

环比同比几乎完全一致，说明变动方向与幅度可用；水位差约 100 万人，来自中金口径多含某个近似持平的分项（已排除计算机电子制造 36.9 万、企业管理 261.4 万、电信 32.2 万，加入后同比匹配反而变差）。**监测用途上以变动为准，绝对水位不与中金对齐。**

### 3. 第 15 项信用利差：指数选择差异

本体系用 FRED `BAMLC0A0CM`（ICE BofA US Corporate Index OAS），最新 0.80 ppt；中金报 1.00 ppt，推测其用 Baa 或含更长久期的口径。趋势方向一致，绝对值不可直接对照。

### 4. 第 13 项债券发行：净发行 vs 中金口径，量级不同

本体系口径 = Big5 现金流量表的**长期债发行 − 长期债偿还**，2026Q1 为 111.4 十亿美元；中金报 25 十亿美元。

差异不是算错了。逐家拆开看，2026Q1 亚马逊发债 $53.4bn、谷歌 $31.4bn、甲骨文 $26.7bn，2025Q4 Meta $29.9bn——正是那批为 AI 资本开支融资的大额债券，数字本身可交叉验证。中金的 25 十亿应来自债券市场数据库的另一套口径（可能是月度、或仅特定券种）。

保留本体系口径，因为它直接对应「资金来源」维度要回答的问题：**这些公司靠外部举债支撑了多少资本开支**。若总发行不扣偿还，会混入商业票据滚动，五家合计虚高到千亿量级（实测 2026Q1 总发行 111.5 vs 净发行 111.4，该季偿还极少，但历史上差异显著）。

### 附：第 19 项的一处主动修正

原表第 19 项「裁员人数占比」同比 +25% **染蓝**，但趋势箭头是**黄色下箭头（走弱）**——两者自相矛盾。本体系以趋势箭头为准取 `polarity: negative`（裁员占比上行 = 外部约束收紧）。

---

## 20 项指标数据源与维护方式

### workbook —— 数据底稿导入（20 项 / 23 条序列）

主展示数据全部来自 `20260727_AI产业指标监测体系(1).xlsx` 的对应编号 Sheet。导入结果放在 `indicators/workbook/`，来源列保留“文件名#Sheet”以便追溯。

### auto —— 公开源自动续接与交叉验证

| # | 指标 | 数据源 | 频率 |
|---|---|---|---|
| 1 | AA 前沿模型评分 | Artificial Analysis Data API（`AA_API_KEY`） | 日 |
| 2 | OpenRouter Token 用量 | rankings-daily API（`OPENROUTER_API_KEY`） | 日 |
| 4 | 美国企业模型付费比例 | Ramp AI Index（`RAMP_DATA_API_KEY`） | 月 |
| 10 | Big5 自由现金流 | yfinance `quarterly_cashflow`，OCF − CapEx | 季 |
| 11 | 资本开支 vs 经营性现金流 | 同上，CapEx / OCF | 季 |
| 12 | Big5 负债权益比 | yfinance `quarterly_balance_sheet` | 季 |
| 13 | 企业债新增发行规模 | yfinance cashflow `IssuanceOfDebt` | 季 |
| 15 | 投资级信用债利差 | FRED `BAMLC0A0CM`（无需 API key） | 日 |
| 16 | 私募信贷占比 | FRED `LNFDCBW027SBOG` / `LLBDCBW027SBOG` | 周 |
| 18 | 科技和金融就业人数 | FRED `USINFO`+`USFIRE`+`CES6054150001` | 月 |
| 20 | 数据中心年化建筑额 | Census C30 `privsatime.xlsx` → `Private SA` 表 `Data center` 列，2014-01 起 | 月 |

Big 5 = MSFT / GOOGL / AMZN / META / ORCL。第 9 项云收入为微软、谷歌、亚马逊、甲骨文四家（不含 Meta）。

FRED CSV 端点与 Census C30 xlsx 无需 API key。AA、OpenRouter、Ramp 密钥只从环境变量读取，不写入项目；缺少密钥时对应接口自动跳过。

### manual —— 历史人工录入（保留作备份与非接口指标维护）

| # | 指标 | 下期去哪儿取数 | 库内可回补的历史 |
|---|---|---|---|
| 3 | LLM token 支出指数 | 各家 pricing 页 | `MODEL_DB.pIn/pOut` + `模型计算器数据库.xlsx` 「定价对比」 |
| 5-6 | OpenAI/Anthropic 应用 ARPU | Sensor Tower 口径，研报读数 | 无 |
| 7-8 | OpenAI/Anthropic ARR | 官方披露 / The Information / Yipit | `行业看板/AI Labs/Anthropic_看板.md` 完整时间线 |
| 9 | 四大云收入 | 各家季报分部数据 | `knowledge/database/yipit_csp/` 看板 + 各家 `_历史变化档案.md` |
| 14 | Big5 CDS | **无公开免费源**，需终端或长期留空 | 无 |
| 17 | AI 风险投资额 | CB Insights / Crunchbase 季报（PitchBook MCP 未授权） | 无 |
| 19 | 裁员人数占比 3mma | Challenger 报告 / layoffs.fyi | 无 |

第 2 项需注意：OpenRouter 只覆盖第三方路由流量，不含各家官方 API 直连，是**趋势代理指标而非总量**。

---

## 目录结构

```
AI产业指标监控/
├── 00_INDEX.md                 本文件 —— 口径字典
├── 20260727_AI产业指标监测体系(1).xlsx  原始数据底稿（只读）
├── config/indicators.yaml      20 项元数据，单一真相源
├── indicators/
│   ├── workbook/               底稿导入产出，勿手改
│   ├── auto/                   脚本产出，勿手改
│   └── manual/                 人工录入
├── import_workbook.py          底稿 → 统一 CSV + Summary 对账
├── fetch_fred.py               #15 #16 #18
├── fetch_census.py             #20
├── fetch_public.py             #1 #2 #4
├── refresh_dashboard.py        # 一键抓取并重建看板
├── fetch_big5.py               #10 #11 #12 #13
├── build_dashboard.py          合并 → _data.json
├── render_html.py              → 看板 HTML
└── AI产业指标监控_看板.html
```
