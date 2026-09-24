# 講義機制圖（diagram-design × mono-color）

依 [diagram-design](https://github.com/hitaiwan0705/diagram-design) 規範繪製，色彩與字體來自 [mono-color](https://github.com/hitaiwan0705/mono-color-skill) CIS。

| 檔案 | 類型 | 說明 |
|---|---|---|
| `journey-loop.html` | Flowchart＋Funnel | 線性漏斗 vs 消費者決策旅程，紅線為漏斗沒有的兩條回饋路徑 |
| `threshold-fork.html` | Flowchart | 門檻判定後 Keep／Revise／Pivot 退回流程的不同位置 |
| `ai-calibration.html` | Data flow | AI 預測 vs 真人訪談校準，落差最大處＝設計洞察 |
| `service-blueprint.html` | Swimlane | 服務藍圖：畢展報名，紅線為可視線與跨越它的交接 |
| `heart-gsm.html` | Process | HEART 以任務成功為例：目標 → 訊號 → 指標 → 門檻 |

每張圖都遵守：正交折線加 r=8 圓角、標籤遮罩與線保持 6px、accent（Signal Red）最多 2 個元素、`<title>`／`<desc>` 無障礙契約、中文標籤 12px 以上（寬度每字 1em）。

## 重新產生

```bash
python3 diagrams/build_diagrams.py   # 產生 .html 與給講義內嵌的 .svg.txt
```

## 驗證

```bash
python3 <diagram-design>/skills/diagram-design/scripts/self_check.py diagrams/*.html
python3 <diagram-design>/scripts/verify-geometry.py diagrams/*.html
```

## 讓 diagram-design 在這個專案自動套用 mono-color

repo 根目錄的 `.diagram-design` 指定 `profile: mono-color`。第一次使用時，把設定檔複製到個人設定檔庫：

```bash
mkdir -p ~/.diagram-design/profiles
cp design/diagram-design-profile-mono-color.md ~/.diagram-design/profiles/mono-color.md
```
