# 网状图动量策略

TMT产业链量化动量轮动策略研究项目，包含策略设计、回测分析、技术面信号监控及原始数据。

**研究时间：** 2026-03-20 ~ 2026-03-23
**状态：** Phase 1 完成，看板已上线

---

## 目录结构

```
网状图动量策略/
├── 01_研究报告/          # 策略研究成果文档
├── 02_回测分析/          # 回测图表与数据
│   └── tmt_signals.json # ← 看板信号数据（自动生成）
├── 03_技术面分析/        # TMT & 全A 技术面信号图
├── 04_原始数据/          # 周度涨跌幅原始数据
├── engine/              # 看板引擎
│   ├── calc_signals.py  # 信号计算（读取xlsx → JSON）
│   └── build_dashboard.py # 看板生成（读取JSON → HTML）
└── dashboard/
    ├── latest.html      # ← 最新看板（直接浏览器打开）
    ├── template.html    # 模板（Chart.js 内嵌，无需网络）
    └── YYYYMMDD_tmt_dashboard.html  # 历史版本
```

---

## 看板使用

**更新看板（每周）**：
```bash
# 1. 确认原始数据已更新（TMT周度涨跌幅.xlsx）
# 2. 计算信号
python workwork/research/策略研究/网状图动量策略/engine/calc_signals.py
# 3. 生成看板
python workwork/research/策略研究/网状图动量策略/engine/build_dashboard.py
# 4. 打开
#    workwork/research/策略研究/网状图动量策略/dashboard/latest.html
```

**看板内容**：
- MA4状态指示（正常/拦截）
- 当前持仓动量排名
- 池内Top 20候选股
- 换仓建议（最弱持仓 vs 最强候选）
- 信号汇总表（一致性/均线/52周回撤）
- 基准净值曲线

---

## 核心成果

### 策略一：TMT动量轮动策略（已回测验证）

- **信号：** 3周累计动量（最优窗口）
- **过滤：** MA4趋势过滤
- **换仓：** 渐进轮动（每周最多换1只）
- **绩效：** 累计 +310.5%，夏普 2.66，最大回撤 -22.8%

### 策略二：全A三层量化策略（框架设计，待回测）

- **第一层：** 仓位决策（沪深300 vs MA40）
- **第二层：** 行业轮动（申万一级 Top 4）
- **第三层：** 个股精选（动量 + 量比 + 基本面）

---

## 文件清单

### 01_研究报告
| 文件 | 说明 |
|------|------|
| `20260320_TMT量化策略研究报告.md` | 主报告（八策略对比、MA4过滤、轮动验证） |
| `20260320_TMT量化策略总结与研究路线图.md` | 现状总结 & Phase 1-4 路线图 |
| `20260323_全A量化策略_框架设计与数据规范.md` | 全A策略框架设计文档 |

### 02_回测分析
| 文件 | 说明 |
|------|------|
| `backtest_8strategies.png` | 八大策略净值对比 |
| `backtest_phases.png` | 四阶段行情分解 |
| `momentum_sensitivity.png` | 动量窗口敏感性（2/3/4/5周） |
| `backtest_trend_filter.png` | MA趋势过滤效果 |
| `backtest_rotation.png` | 轮动策略净值 |
| `backtest_enhanced.png` | 增强版策略（波动率+一致性过滤） |
| `backtest_stock_stop.png` | 动态止损回测 |
| `analysis_extended.png` | 扩展分析图 |
| `backtest_metrics.csv` | 回测指标汇总表 |
| `rotation_log.xlsx` | 64周完整调仓记录 |
| `rotation_speed.png` | 换仓频率分析 |

### 03_技术面分析
| 前缀 | 内容 |
|------|------|
| `A1-A9` | 全A市场宽度、相关性、资金流 |
| `B1-B8` | 全A 行业轮动、动量衰减、筹码分析 |
| `C1-C8` | TMT 行业热度、动量持续性、资金流 |
| `fig1-fig9` | TMT 综合技术面信号 |

### 04_原始数据
| 文件 | 说明 |
|------|------|
| `TMT周度涨跌幅.xlsx` | 128只TMT股票周频数据 |
| `全A周度涨跌幅.xlsx` | 全A市场周频数据 |
| `TMT周度涨跌幅 - 副本.xlsx` | 数据备份 |

---

*项目路径：`workwork/research/网状图动量策略/`*
