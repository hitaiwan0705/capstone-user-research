# 課堂表單（可回收數據）

兩份表單，題目相同，提供兩種建立方式：

| 表單 | 用途 | 題數 |
|---|---|---|
| 畢專策略畫布｜課堂實作繳交單 | 今天 60 分鐘實作的繳交單 | 45 |
| AI 預測 vs 真人訪談｜校準作業 | 下週課前繳交的回家作業 | 24 |

## A. Google 表單（全自動，含回應試算表）

1. 開啟 https://script.google.com ，按「新專案」。
2. 刪掉預設內容，貼上 `google-forms.gs` 全部程式碼，存檔。
3. 上方函式選單選 `createAllForms`，按「執行」，依畫面完成授權。
4. 打開「執行紀錄」，複製「填答網址（給學生）」。表單和回應試算表都在您的 Google 雲端硬碟根目錄。
5. 若表單顯示「未發布」，進入編輯頁按右上角「發布」。

## B. Microsoft Forms（Teams）

1. 到 https://forms.office.com ，選「快速匯入」，上傳對應的 `.docx`。
2. 匯入後檢查：標註【評分題】的題目改成「評分」題型，標註【Likert 題】的題目改成「Likert」題型（快速匯入不會自動辨識這兩種）。
3. 在 Teams 頻道用「+ 新增索引標籤 → Forms」加入表單。回應可在 Forms 的「在 Excel 中開啟」下載。

## 修改題目

題目的唯一來源是 `spec.py`。改完後執行：

```bash
python3 build.py        # 重新產生 google-forms.gs 與 forms-spec.json
node build-docx.js      # 重新產生兩個 .docx
```
