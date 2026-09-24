// 產生 Microsoft Forms「快速匯入」用的 Word 檔（每份表單一個）
const fs=require('fs');const {Document,Packer,Paragraph,TextRun,HeadingLevel}=require('docx');
const FORMS=JSON.parse(fs.readFileSync('forms-spec.json','utf8'));
const L='ABCDEFGHIJ';
for(const f of FORMS){
 const ch=[new Paragraph({heading:HeadingLevel.TITLE,children:[new TextRun(f.title)]})];
 f.desc.split('\n').forEach(t=>ch.push(new Paragraph({children:[new TextRun(t)]})));
 let q=0;
 for(const it of f.items){
  const t=it[0];
  if(t==='section'){ch.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360},children:[new TextRun(it[1])]}));if(it[2])ch.push(new Paragraph({children:[new TextRun({text:it[2],italics:true})]}));continue;}
  q++;const req=it[2]?'':'（選填）';
  let title=`${q}. ${it[1]}${req}`;
  if(t==='cb')title+='（可複選）';
  ch.push(new Paragraph({spacing:{before:200},children:[new TextRun({text:title,bold:true})]}));
  if(t==='mc'||t==='cb')it[3].forEach((c,i)=>ch.push(new Paragraph({children:[new TextRun(`${L[i]}. ${c}`)]})));
  if(t==='scale')ch.push(new Paragraph({children:[new TextRun({text:`【評分題】${it[3]}＝${it[5]}，${it[4]}＝${it[6]}（匯入後請改成「評分」題型）`,color:'555555'})]}));
  if(t==='date')ch.push(new Paragraph({children:[new TextRun({text:'【日期題】匯入後請改成「日期」題型',color:'555555'})]}));
  if(t==='grid'){ch.push(new Paragraph({children:[new TextRun({text:`【Likert 題】列：${it[3].join('、')}；欄：${it[4].join('、')}（匯入後請改成「Likert」題型）`,color:'555555'})]}));}
  const help=(t==='text'||t==='para'||t==='date')?it[3]:(t==='mc'||t==='cb')?it[4]:t==='grid'?it[5]:'';
  if(help)ch.push(new Paragraph({children:[new TextRun({text:help,color:'555555'})]}));
 }
 const doc=new Document({styles:{default:{document:{run:{font:'Microsoft JhengHei',size:22}}}},sections:[{children:ch}]});
 Packer.toBuffer(doc).then(b=>{fs.writeFileSync('回家作業_MicrosoftForms匯入.docx',b);console.log('written',f.id,q,'questions')});
}
