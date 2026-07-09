# Fiber Optic Stock Sensitivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live 2026E stock earnings sensitivity workbench to the fiber-optic-cable dashboard using the approved Excel model assumptions.

**Architecture:** Keep the existing single-page HTML architecture. Add one pure calculation block with company constants and parameter validation, then add a DOM controller that reads seven editable inputs and renders company cards and a comparison table. Verify the pure model with Node tests and verify the integrated page in the browser.

**Tech Stack:** HTML5, CSS Grid, vanilla JavaScript, Node.js built-in test runner, existing Chart.js page.

---

## File Structure

- Modify `research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html`: styles, workbench markup, pure model, validation, rendering, and responsive behavior.
- Create `tests/fiber-optic-stock-sensitivity.test.mjs`: extract the marked pure-model block from the HTML and test baseline calculations, shared prices, company-specific parameters, validation, and reset defaults.

### Task 1: Pure calculation model

**Files:**
- Modify: `research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html`
- Create: `tests/fiber-optic-stock-sensitivity.test.mjs`

- [ ] **Step 1: Write failing baseline and validation tests**

Create a Node test that reads the dashboard HTML, extracts code between `// MODEL_START` and `// MODEL_END`, evaluates it in a VM context, and asserts:

```js
assert.deepEqual(DEFAULT_PARAMS, {
  g652DomesticPrice: 70,
  g652OverseasPrice: 50,
  non652DomesticBasePrice: 140,
  non652OverseasBasePrice: 140,
  companies: {
    hengtong: { g652Share: 0.35, non652Realization: 1 },
    zhongtian: { g652Share: 0.35, non652Realization: 1 },
    yangtze: { g652Share: 0.45, non652Realization: 100 / 140 },
  },
});
assert.ok(Math.abs(calculateCompany("hengtong", DEFAULT_PARAMS).newNetProfit - 102.3628) < 0.001);
assert.ok(Math.abs(calculateCompany("zhongtian", DEFAULT_PARAMS).newNetProfit - 97.5049) < 0.001);
assert.ok(Math.abs(calculateCompany("yangtze", DEFAULT_PARAMS).newNetProfit - 69.3703) < 0.001);
assert.equal(validateNumber(-1, { min: 0, max: 200 }), false);
assert.equal(validateNumber(0.45, { min: 0, max: 1 }), true);
```

- [ ] **Step 2: Run the test and confirm failure**

Run:

```powershell
node --test tests/fiber-optic-stock-sensitivity.test.mjs
```

Expected: FAIL because the marked model block and exported model functions do not exist.

- [ ] **Step 3: Implement company constants and calculation**

Add a marked pure-model block before the existing chart initialization. It must define:

```js
const DEFAULT_PARAMS = { /* approved seven defaults */ };
const COMPANY_MODELS = { /* Excel rows 3, 17-26, 28, 40-59 for all three companies */ };
function validateNumber(value, { min, max }) { /* finite and bounded */ }
function calculateCompany(companyKey, params) { /* Excel complex-sheet formula chain */ }
function calculateAll(params) { /* return all three company outputs */ }
```

The calculation must produce `fiberRevenue`, `totalRevenue`, `newNetProfit`, `targetMarketCap`, and `upside`, with no DOM dependencies.

- [ ] **Step 4: Run tests and confirm pass**

Run:

```powershell
node --test tests/fiber-optic-stock-sensitivity.test.mjs
```

Expected: all baseline and validation tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html tests/fiber-optic-stock-sensitivity.test.mjs
git commit -m "feat: add fiber stock sensitivity model"
```

### Task 2: Interactive workbench

**Files:**
- Modify: `research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html`
- Modify: `tests/fiber-optic-stock-sensitivity.test.mjs`

- [ ] **Step 1: Add failing structure tests**

Assert the HTML contains unique controls for:

```text
g652-domestic-price
g652-overseas-price
non652-domestic-price
non652-overseas-price
hengtong-g652-share
zhongtian-g652-share
yangtze-g652-share
hengtong-realization
zhongtian-realization
yangtze-realization
reset-sensitivity
```

Also assert result elements exist for each company’s five outputs and that all controls have explicit min/max/step attributes.

- [ ] **Step 2: Run the test and confirm failure**

Run:

```powershell
node --test tests/fiber-optic-stock-sensitivity.test.mjs
```

Expected: FAIL because the workbench markup is absent.

- [ ] **Step 3: Add styles and markup**

Insert the workbench immediately after the KPI grid. Add:

- A left assumptions panel with four numeric price inputs.
- Per-company percentage sliders paired with numeric inputs for 652D share and realization factor.
- Three result cards.
- A comparison table with the five approved outputs.
- Inline validation messages and a reset button.
- A model-note footer explaining fixed assumptions and the long-fiber realization discount.

Use existing color variables and card styles; add only feature-scoped class names prefixed with `sensitivity-`.

- [ ] **Step 4: Add controller and rendering**

Implement:

```js
function readSensitivityParams() { /* parse and validate all inputs */ }
function renderSensitivityResults(results) { /* cards and comparison table */ }
function syncRangeAndNumber(source, target) { /* keep paired controls aligned */ }
function resetSensitivity() { /* restore DEFAULT_PARAMS and render */ }
function initSensitivityWorkbench() { /* attach listeners and first render */ }
```

Invalid values must leave the last valid parameters rendered and show a local message. Valid `input` events must recalculate immediately.

- [ ] **Step 5: Run tests and confirm pass**

Run:

```powershell
node --test tests/fiber-optic-stock-sensitivity.test.mjs
```

Expected: all model and structure tests PASS.

- [ ] **Step 6: Commit**

```powershell
git add research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html tests/fiber-optic-stock-sensitivity.test.mjs
git commit -m "feat: add interactive stock sensitivity workbench"
```

### Task 3: Browser verification and integration polish

**Files:**
- Modify if needed: `research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html`
- Modify if needed: `tests/fiber-optic-stock-sensitivity.test.mjs`

- [ ] **Step 1: Verify baseline rendering**

Open the local dashboard and confirm displayed baseline outputs match:

```text
亨通：光纤收入 90.2817，总收入 122.7700，净利润 102.3628，目标市值 2047.2558，upside 70.6046%
中天：光纤收入 82.0743，总收入 111.6091，净利润 97.5049，目标市值 1950.0982，upside 111.9672%
长飞：光纤收入 88.8573，总收入 146.2185，净利润 69.3703，目标市值 1734.2573，upside 38.7406%
```

- [ ] **Step 2: Verify interactions**

Change one shared price and confirm all companies update. Change only `yangtze-g652-share` and confirm the other two company outputs remain unchanged. Enter an invalid value and confirm the last valid results remain. Click reset and confirm all baseline values return.

- [ ] **Step 3: Verify responsive layout**

Check normal desktop width and a mobile-width viewport. Confirm controls are legible, cards stack, and the comparison table scrolls horizontally without clipping.

- [ ] **Step 4: Check page health**

Confirm existing Chart.js charts render, internal navigation still works, and browser console has no errors.

- [ ] **Step 5: Run final automated verification**

Run:

```powershell
node --test tests/fiber-optic-stock-sensitivity.test.mjs
git diff --check
git status --short
```

Expected: tests PASS, no whitespace errors, and only intended files are modified.

- [ ] **Step 6: Commit final polish if required**

```powershell
git add research/fundamentals/industry-dashboards/fiber-optic-cable/fiber-optic-cable-dashboard.html tests/fiber-optic-stock-sensitivity.test.mjs
git commit -m "test: verify fiber sensitivity dashboard"
```
