/**
 * 畢專使用者研究｜自動建立 Google 表單（含回應試算表）
 * 使用方式：到 script.google.com 新增專案 → 貼上全部程式碼 → 選擇 createAllForms → 執行 → 授權。
 * 執行完成後，到「執行紀錄」複製表單網址。表單與試算表會出現在你的 Google 雲端硬碟根目錄。
 * 本檔由 forms/build.py 從 forms/spec.py 產生，修改題目請改 spec.py 再重新產生。
 */

function createAllForms() {
  createStrategyCanvasForm();
  createCalibrationForm();
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

function createStrategyCanvasForm() {
  var form = FormApp.create("畢專策略畫布｜課堂實作繳交單");
  form.setDescription("資傳系大四畢業專題・使用者研究（2026-09-24）。每組填一份。\n請注意：今天寫下的內容都是「假設」，不是研究發現。凡是 AI 產生或尚未有訪談證據的內容，請照實標示。\n回收資料僅用於課程回饋與教學改善。");
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  form.addTextItem().setTitle("組別").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("畢專名稱（暫定）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("組員姓名與學號").setRequired(true).setHelpText("每行一位");
  form.addMultipleChoiceItem().setTitle("畢專類型").setRequired(true).setHelpText("").setChoiceValues(["數位產品／App／網站", "品牌與行銷傳播企劃", "內容／影音／互動敘事", "服務設計"]).showOtherOption(true);
  form.addPageBreakItem().setTitle("① Persona 假設（0–15 分）").setHelpText("只寫行為、目標、動機、障礙、觸發點、資訊管道。有 3 筆以上訪談證據之前，不放照片、不取名字。");
  form.addParagraphTextItem().setTitle("行為：他現在實際怎麼做？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("目標：他想完成什麼？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("動機：為什麼這件事對他重要？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("障礙：什麼讓他卡住？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("觸發點：什麼時刻會讓他開始行動？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("資訊管道：他從哪裡得知、向誰詢問？").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("Anti-persona：我們明確「不為誰設計」？").setRequired(true).setHelpText("沒有排除，就沒有定位。");
  form.addGridItem().setTitle("以上各項目前的證據狀態").setRequired(true).setHelpText("誠實標示即可，不影響成績。").setRows(["行為", "目標", "動機", "障礙", "觸發點", "資訊管道"]).setColumns(["有證據（訪談或觀察）", "推論", "待驗證（含 AI 產生）"]);
  form.addPageBreakItem().setTitle("② Scenario 與 JTBD（15–25 分）").setHelpText("問題情境只寫人怎麼卡住，不要寫你的產品。");
  form.addParagraphTextItem().setTitle("問題情境（現況）").setRequired(true).setHelpText("句型：當＿＿的時候，＿＿想要＿＿，但是因為＿＿，所以目前只能＿＿。");
  form.addParagraphTextItem().setTitle("活動情境（介入後）").setRequired(true).setHelpText("你的作品介入之後，同一個時刻會變成怎樣？");
  form.addTextItem().setTitle("JTBD 功能面：他要完成的任務").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("JTBD 情感面：他想要（或不想要）的感受").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("JTBD 社會面：他想在別人眼中看起來如何").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("③ Mini CJM（25–40 分）").setHelpText("五個階段：發現 → 考慮 → 行動 → 使用 → 分享／回訪。每階段寫：行為、接觸點、痛點、機會。");
  form.addParagraphTextItem().setTitle("階段「發現」：行為／接觸點／痛點／機會").setRequired(true).setHelpText("可用分號分隔四項");
  form.addParagraphTextItem().setTitle("階段「考慮」：行為／接觸點／痛點／機會").setRequired(true).setHelpText("可用分號分隔四項");
  form.addParagraphTextItem().setTitle("階段「行動」：行為／接觸點／痛點／機會").setRequired(true).setHelpText("可用分號分隔四項");
  form.addParagraphTextItem().setTitle("階段「使用」：行為／接觸點／痛點／機會").setRequired(true).setHelpText("可用分號分隔四項");
  form.addParagraphTextItem().setTitle("階段「分享／回訪」：行為／接觸點／痛點／機會").setRequired(true).setHelpText("可用分號分隔四項");
  form.addGridItem().setTitle("各階段最主要接觸點的擁有者").setRequired(true).setHelpText("依 Lemon & Verhoef (2016) 的分類。").setRows(["發現", "考慮", "行動", "使用", "分享／回訪"]).setColumns(["品牌擁有", "夥伴擁有", "顧客擁有", "社會／外部"]);
  form.addGridItem().setTitle("各階段預估的感受（語意差異：1＝非常安心，7＝非常焦慮）").setRequired(true).setHelpText("這是預估（假設），下週用真人訪談驗證。").setRows(["發現", "考慮", "行動", "使用", "分享／回訪"]).setColumns(["1", "2", "3", "4", "5", "6", "7"]);
  form.addParagraphTextItem().setTitle("各階段的 KPI（微轉換或巨轉換）").setRequired(true).setHelpText("例：詳情頁 → 報名按鈕轉換率");
  form.addParagraphTextItem().setTitle("最重要的一個痛點").setRequired(true).setHelpText("");
  form.addMultipleChoiceItem().setTitle("這個痛點落在哪個象限？").setRequired(true).setHelpText("").setChoiceValues(["Fix First（高嚴重・高頻率）", "Design for Edge（高嚴重・低頻率）", "Quick Win（低嚴重・高頻率）", "Backlog（低嚴重・低頻率）"]);
  form.addPageBreakItem().setTitle("④ AI 壓力測試（40–50 分）").setHelpText("角色扮演走查一次、紅隊批評一次。AI 產生的內容一律視為「待驗證」。");
  form.addCheckboxItem().setTitle("使用的 AI 工具").setRequired(true).setHelpText("").setChoiceValues(["Claude", "ChatGPT", "Gemini", "Copilot"]).showOtherOption(true);
  form.addCheckboxItem().setTitle("使用了哪些 AI 角色").setRequired(true).setHelpText("").setChoiceValues(["假設萃取器", "認知走查模擬器（角色扮演）", "紅隊批評者", "訪談題目產生器"]);
  form.addParagraphTextItem().setTitle("AI 指出最危險的 3 個假設").setRequired(true).setHelpText("");
  form.addScaleItem().setTitle("AI 的回應和你們原本的假設有多大落差？").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全相反");
  form.addParagraphTextItem().setTitle("AI 的哪一個說法你們認為不對？為什麼？").setRequired(false).setHelpText("這一題最能看出你們的判斷力。");
  form.addPageBreakItem().setTitle("⑤ 假設卡（50–60 分）").setHelpText("驗證是設計一個「可能證明自己錯」的方法。");
  form.addParagraphTextItem().setTitle("我們相信【行為型 Persona】在【Scenario】時，主要障礙是【Barrier】（而不是＿＿）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("所以我們做【Strategy】，預期【行為改變】").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("用什麼指標量測").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("門檻：什麼結果代表要修正假設").setRequired(true).setHelpText("例：訪談 5 人中少於 3 人把此障礙排進前兩名");
  form.addParagraphTextItem().setTitle("最危險的假設（如果錯了，整個方向就要轉彎）").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("⑥ 三條策略卡").setHelpText("格式：Because（洞察）／We will（策略）／We expect（行為改變）／We measure（指標＋門檻）");
  form.addParagraphTextItem().setTitle("策略卡 1").setRequired(true).setHelpText("Because… We will… We expect… We measure…");
  form.addParagraphTextItem().setTitle("策略卡 2").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("策略卡 3").setRequired(true).setHelpText("");
  form.addPageBreakItem().setTitle("⑦ 下週驗證計畫與自評").setHelpText("");
  form.addParagraphTextItem().setTitle("訪談對象條件（3 人）").setRequired(true).setHelpText("符合 Persona 的哪些行為條件？怎麼找到他們？");
  form.addParagraphTextItem().setTitle("要問的 3 個開放式問題").setRequired(true).setHelpText("");
  form.addCheckboxItem().setTitle("預計做到的驗證層級").setRequired(true).setHelpText("").setChoiceValues(["L1 存在性：這種行為模式存在嗎？", "L2 區辨性：兩型的人做法不同嗎？", "L3 有效性：介入改變了行為嗎？"]);
  form.addScaleItem().setTitle("你們對這份 Persona 假設有多少信心？").setRequired(true).setBounds(1, 5).setLabels("很沒把握", "非常有把握");
  form.addParagraphTextItem().setTitle("今天最卡的地方").setRequired(false).setHelpText("");
  finish_(form);
}

function createCalibrationForm() {
  var form = FormApp.create("AI 預測 vs 真人訪談｜校準作業");
  form.setDescription("畢業專題回家作業（下週課前繳交）。每組填一份。\n步驟：① 課堂上讓 AI 扮演你的 Persona，回答 3 個關鍵問題並保存答案；② 訪談 3 位真人，問同樣的 3 個問題；③ 比對落差。\n落差最大的地方，通常就是真正的設計洞察。回收資料僅用於課程回饋與教學改善。");
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  form.addTextItem().setTitle("組別").setRequired(true).setHelpText("");
  form.addTextItem().setTitle("畢專名稱").setRequired(true).setHelpText("");
  form.addCheckboxItem().setTitle("扮演 Persona 的 AI 工具").setRequired(true).setHelpText("").setChoiceValues(["Claude", "ChatGPT", "Gemini", "Copilot"]).showOtherOption(true);
  form.addParagraphTextItem().setTitle("受訪者概況（3 人，不寫真名）").setRequired(true).setHelpText("例：A｜大四｜每週用 IG 找店 3 次以上");
  form.addPageBreakItem().setTitle("問題 1").setHelpText("");
  form.addTextItem().setTitle("問題 1 的題目").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 1：AI 的回答（摘要）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 1：3 位真人的回答（摘要）").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 1：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 1：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addPageBreakItem().setTitle("問題 2").setHelpText("");
  form.addTextItem().setTitle("問題 2 的題目").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 2：AI 的回答（摘要）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 2：3 位真人的回答（摘要）").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 2：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 2：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addPageBreakItem().setTitle("問題 3").setHelpText("");
  form.addTextItem().setTitle("問題 3 的題目").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 3：AI 的回答（摘要）").setRequired(true).setHelpText("");
  form.addParagraphTextItem().setTitle("問題 3：3 位真人的回答（摘要）").setRequired(true).setHelpText("每人一行");
  form.addScaleItem().setTitle("問題 3：AI 與真人的落差").setRequired(true).setBounds(1, 5).setLabels("幾乎一致", "完全不同");
  form.addMultipleChoiceItem().setTitle("問題 3：落差主要來自哪裡").setRequired(true).setHelpText("").setChoiceValues(["AI 太理想化、太理性", "AI 漏掉真實情境的細節", "AI 有刻板印象", "真人之間差異大，AI 太一致", "幾乎沒有落差"]).showOtherOption(true);
  form.addPageBreakItem().setTitle("整體反思").setHelpText("");
  form.addParagraphTextItem().setTitle("落差最大的地方帶來什麼設計洞察？").setRequired(true).setHelpText("");
  form.addMultipleChoiceItem().setTitle("原本的假設卡要怎麼處理？").setRequired(true).setHelpText("").setChoiceValues(["Keep 保留：達到門檻", "Revise 修正：部分成立，調整某一欄", "Pivot 轉向：最危險的假設被推翻"]);
  form.addParagraphTextItem().setTitle("要修改的內容（Persona、Scenario 或策略）").setRequired(true).setHelpText("");
  form.addScaleItem().setTitle("做完這份作業後，你對「AI 模擬使用者」的信任程度").setRequired(true).setBounds(1, 5).setLabels("非常不信任", "非常信任");
  form.addScaleItem().setTitle("做作業前，你對「AI 模擬使用者」的信任程度（回想）").setRequired(true).setBounds(1, 5).setLabels("非常不信任", "非常信任");
  finish_(form);
}
