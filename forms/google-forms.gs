/**
 * 畢專使用者研究｜自動建立 Google 表單（含回應試算表）
 * 使用方式：到 script.google.com 新增專案 → 貼上全部程式碼 → 選擇 createAllForms → 執行 → 授權（會建立「畢專使用者研究｜回家作業」與回應試算表）。
 * 執行完成後，到「執行紀錄」複製表單網址。表單與試算表會出現在你的 Google 雲端硬碟根目錄。
 * 本檔由 forms/build.py 從 forms/spec.py 產生，修改題目請改 spec.py 再重新產生。
 */

function createAllForms() {
  createHomeworkForm();
}

function finish_(form) {
  // 2026 年起 Google 可能將程式建立的表單預設為「未發布」；若有此方法就直接發布
  if (typeof form.setPublished === 'function') { try { form.setPublished(true); } catch (e) { Logger.log('請手動按「發布」：' + e); } }
  var ss = SpreadsheetApp.create(form.getTitle() + '（回應）');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Logger.log('表單名稱：' + form.getTitle());
  Logger.log('填答網址（給學生）：' + form.getPublishedUrl());
  Logger.log('編輯網址（老師用）：' + form.getEditUrl());
  Logger.log('回應試算表：' + ss.getUrl());
}

function createHomeworkForm() {
  var form = FormApp.create("畢專使用者研究｜回家作業");
  form.setDescription("資傳系大四畢業專題・使用者研究。每組填一份，下週上課前繳交。\n本作業只評 5 個必要指標：① Persona 假設　② 情境與旅程　③ 假設卡與門檻　④ AI 前測　⑤ 真人實測與校準。\n順序很重要：先寫假設卡與門檻 → 再做 AI 前測 → 最後才訪談真人。假設被推翻（Pivot）不扣分；沒有門檻或事後改門檻才扣分。");
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  form.addTextItem().setTitle("組別").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("畢專名稱").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("組員姓名與學號").setRequired(true).setHelpText("每行一位");
  form.addMultipleChoiceItem().setTitle("畢專類型").setRequired(true).setHelpText("").setChoiceValues(["數位產品／App／網站", "品牌與行銷傳播企劃", "內容／影音／互動敘事", "服務設計"]).showOtherOption(true);
  form.addPageBreakItem().setTitle("指標 ① Persona 假設").setHelpText("只寫行為型特徵。有 3 筆以上訪談證據之前，不放照片、不取名字。");
  form.addParagraphTextItem().setTitle("行為與情境：他現在實際怎麼做？在什麼時刻？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("目標與主要障礙：他想完成什麼？什麼讓他卡住？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("資訊管道：他從哪裡得知、向誰詢問？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("Anti-persona：我們明確不為誰設計？").setRequired(true).setHelpText("沒有排除，就沒有定位。");
  form.addGridItem().setTitle("以上各項目前的證據狀態").setRequired(true).setHelpText("誠實標示即可，不影響分數。").setRows(["行為與情境", "目標與障礙", "資訊管道"]).setColumns(["有訪談或觀察證據", "推論", "待驗證（含 AI 產生）"]);
  form.addPageBreakItem().setTitle("指標 ② 情境與旅程").setHelpText("問題情境只寫人怎麼卡住，不寫你的產品。");
  form.addParagraphTextItem().setTitle("問題情境").setRequired(true).setHelpText("句型：當＿＿的時候，＿＿想要＿＿，但是因為＿＿，所以目前只能＿＿。");
  form.addParagraphTextItem().setTitle("Mini CJM：發現 → 考慮 → 行動 → 使用 → 分享／回訪").setRequired(true).setHelpText("每階段一行：行為／接觸點／痛點");
  form.addParagraphTextItem().setTitle("回饋迴路：分享或回訪如何回到下一輪？").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("CJM 圖檔連結（雲端硬碟或 Figma，請開啟檢視權限）").setRequired(true).setHelpText("");
  form.addMultipleChoiceItem().setTitle("最關鍵的痛點落在哪個象限？").setRequired(true).setHelpText("請在上方 CJM 中標出這個痛點").setChoiceValues(["Fix First（高嚴重・高頻率）", "Design for Edge（高嚴重・低頻率）", "Quick Win（低嚴重・高頻率）", "Backlog（低嚴重・低頻率）"]);
  form.addPageBreakItem().setTitle("指標 ③ 假設卡與門檻").setHelpText("門檻必須在 AI 前測與真人訪談之前寫下。");
  form.addParagraphTextItem().setTitle("我們相信【Persona】在【情境】時，主要障礙是【障礙】（而不是＿＿）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("所以我們做【策略】，預期【行為改變】").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("量測指標").setRequired(true).setHelpText("例：5 位受訪者中，把此障礙排進前兩名的人數");
  form.addTextItem().setTitle("門檻：什麼結果代表要修正假設").setRequired(true).setHelpText("例：少於 3 人就修正");
  form.addDateItem().setTitle("門檻寫下的日期").setRequired(true).setHelpText("必須早於 AI 前測與訪談日期");
  form.addParagraphTextItem().setTitle("最危險的假設（如果錯了，整個方向就要轉彎）").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("指標 ④ AI 前測").setHelpText("讓 AI 扮演你們的 Persona，回答 3 個關鍵問題。答案要在訪談前存檔。");
  form.addCheckboxItem().setTitle("使用的 AI 工具").setRequired(true).setHelpText("").setChoiceValues(["Claude", "ChatGPT", "Gemini", "Copilot"]).showOtherOption(true);
  form.addDateItem().setTitle("AI 前測日期").setRequired(true).setHelpText("必須早於真人訪談日期");
  form.addTextItem().setTitle("AI 對話紀錄連結（分享連結或截圖資料夾）").setRequired(true).setHelpText("助教會抽查");
  form.addTextItem().setTitle("問題 1（開放式，不可引導）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 1：AI 的回答摘要").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("問題 2（開放式，不可引導）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 2：AI 的回答摘要").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("問題 3（開放式，不可引導）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 3：AI 的回答摘要").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("指標 ⑤ 真人實測與校準").setHelpText("訪談 3 位符合 Persona 行為條件的真人，問同樣的 3 個問題。不可訪談同組組員，不寫真名。");
  form.addParagraphTextItem().setTitle("受訪者概況（3 人，不寫真名）").setRequired(true).setHelpText("例：A｜大四｜每週用 IG 找店 3 次以上");
  form.addDateItem().setTitle("真人訪談日期（第一場）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 1：3 位真人的回答摘要").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 1：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 1：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addParagraphTextItem().setTitle("問題 2：3 位真人的回答摘要").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 2：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 2：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addParagraphTextItem().setTitle("問題 3：3 位真人的回答摘要").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 3：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 3：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addParagraphTextItem().setTitle("落差最大的地方帶來什麼設計洞察？").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("對照門檻的實際結果").setRequired(true).setHelpText("例：5 人中有 2 人把此障礙排進前兩名");
  form.addMultipleChoiceItem().setTitle("判定").setRequired(true).setHelpText("推翻假設不扣分").setChoiceValues(["Keep 保留：達到門檻", "Revise 修正：部分成立，調整某一欄", "Pivot 轉向：最危險的假設被推翻"]);
  form.addParagraphTextItem().setTitle("接下來要修改的內容（Persona、情境或策略）").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("AI 使用揭露與研究同意").setHelpText("");
  form.addParagraphTextItem().setTitle("本作業哪些內容由 AI 產生或協助？").setRequired(true).setHelpText("未揭露即使用 AI，視同未註明出處");
  form.addScaleItem().setTitle("做完這份作業後，你對「AI 模擬使用者」的信任程度").setRequired(true).setBounds(1, 5).setLabels("非常不信任", "非常信任");
  form.addMultipleChoiceItem().setTitle("是否同意本表單的匿名資料用於教學研究？").setRequired(true).setHelpText("是否同意不影響成績；不同意的資料只用於本課評分與回饋。").setChoiceValues(["同意", "不同意"]);
  finish_(form);
}
