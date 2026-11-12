# 台股电子产业链月度看板 · 数据层

## 文件

| 文件 | 用途 |
|---|---|
| `data/meta.json` | 页面修订日、行情 asof、目标月/完整月、披露进度、KPI、环节汇总 |
| `data/companies.json` | 36 家公司名单、行情、最新月营收指标、近年月度序列片段 |
| `data/charts.json` | 13 个环节 Chart.js 序列（2023-01 起） |
| `data/dashboard-data.js` | 由上述 JSON 打包生成，供 HTML `<script>` 加载（GitHub Pages + `file://` 离线均可） |
| `taiwan-electronics-dashboard.html` | 渲染层：加载 `dashboard-data.js`，绘制披露进度/KPI/表/图 |

## 例行更新（每月中旬）

1. 从公开源抓月营收（TWSE/TPEx）与行情（FinMind），**不要编造数字**。
2. 更新 `data/companies.json`（`latest_month` / `rev` / `mom` / `yoy` / `cum_yoy` / `monthly` / 市值与涨幅字段）。
3. 同步延长 `data/charts.json` 各序列；未披露月保持 `null`。
4. 改 `data/meta.json`：`asof_page`、`asof_prices`、`latest_complete_month`、`target_month`、`disclosure.*`、`kpis`、`segments`。
5. 重新生成 `data/dashboard-data.js`（把 meta+companies+charts 打成 `window.TW_ELECTRONICS_DASHBOARD`）。
6. 一般**不必**改 HTML，除非交互或口径文案变更。
7. 如需，同步 `main-dashboard.html` / `00_INDEX.md` 的同步日期。
8. push 到 `main`，打开 Pages 核对披露进度与图表。

当前（2026-11-10）：最新完整月 **2026-09**（36/36）；目标月 **2026-10** 部分已披露（31/36）。未披露：2330 台积电、2454 联发科、3711 日月光投控、3661 世芯-KY、3044 健鼎。
