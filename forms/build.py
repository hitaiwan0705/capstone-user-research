import json
from spec import FORMS
def js(s): return json.dumps(s,ensure_ascii=False)
out=['/**',' * 畢專使用者研究｜自動建立 Google 表單（含回應試算表）',' * 使用方式：到 script.google.com 新增專案 → 貼上全部程式碼 → 選擇 createAllForms → 執行 → 授權。',' * 執行完成後，到「執行紀錄」複製表單網址。表單與試算表會出現在你的 Google 雲端硬碟根目錄。',' * 本檔由 forms/build.py 從 forms/spec.py 產生，修改題目請改 spec.py 再重新產生。',' */','',
'function createAllForms() {','  createStrategyCanvasForm();','  createCalibrationForm();','}','',
'function finish_(form) {',
'  // 2026 年起 Google 可能將程式建立的表單預設為「未發布」；若有此方法就直接發布',
"  if (typeof form.setPublished === 'function') { try { form.setPublished(true); } catch (e) { Logger.log('請手動按「發布」：' + e); } }",
"  var ss = SpreadsheetApp.create(form.getTitle() + '（回應）');",
'  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());',
"  Logger.log('表單名稱：' + form.getTitle());",
"  Logger.log('填答網址（給學生）：' + form.getPublishedUrl());",
"  Logger.log('編輯網址（老師用）：' + form.getEditUrl());",
"  Logger.log('回應試算表：' + ss.getUrl());",'}','']
for f in FORMS:
    L=[f"function {f['fn']}() {{",f"  var form = FormApp.create({js(f['title'])});",f"  form.setDescription({js(f['desc'])});","  form.setProgressBar(true);","  form.setAllowResponseEdits(true);",""]
    first=True
    for it in f['items']:
        t=it[0]
        if t=='section':
            if first: first=False; continue  # 第一個區段直接接在表單開頭
            L.append(f"  form.addPageBreakItem().setTitle({js(it[1])}).setHelpText({js(it[2])});")
        elif t in('text','para'):
            m='addTextItem' if t=='text' else 'addParagraphTextItem'
            L.append(f"  form.{m}().setTitle({js(it[1])}).setRequired({str(it[2]).lower()}).setHelpText({js(it[3])});")
        elif t in('mc','cb'):
            m='addMultipleChoiceItem' if t=='mc' else 'addCheckboxItem'
            other = it[3][-1]=='其他'
            ch=it[3][:-1] if other else it[3]
            s=f"  form.{m}().setTitle({js(it[1])}).setRequired({str(it[2]).lower()}).setHelpText({js(it[4])}).setChoiceValues({js(ch)})"
            if other: s+=".showOtherOption(true)"
            L.append(s+";")
        elif t=='grid':
            L.append(f"  form.addGridItem().setTitle({js(it[1])}).setRequired({str(it[2]).lower()}).setHelpText({js(it[5])}).setRows({js(it[3])}).setColumns({js(it[4])});")
        elif t=='scale':
            L.append(f"  form.addScaleItem().setTitle({js(it[1])}).setRequired({str(it[2]).lower()}).setBounds({it[3]}, {it[4]}).setLabels({js(it[5])}, {js(it[6])});")
    L+=['  finish_(form);','}','']
    out+=L
open('google-forms.gs','w',encoding='utf-8').write('\n'.join(out))
json.dump(FORMS,open('forms-spec.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('items:',[len(f['items']) for f in FORMS])
