import {readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function parseChangelog(source){
  return source.replace(/^\uFEFF/,'').split(/\r?\n/).flatMap((line,index)=>{
    if(!line.trim())return [];
    const fields=line.split('｜').map(v=>v.trim());
    if(fields.length!==4||fields.some(v=>!v))throw Error(`changelog.md ${index+1}行目: 日付｜回｜内容｜きっかけ の4項目が必要です`);
    const [date,lesson,content,reason]=fields;
    const parsed=new Date(date+'T00:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date)throw Error(`changelog.md ${index+1}行目: 日付が不正です`);
    return [{date,lesson,content,reason}];
  }).sort((a,b)=>b.date.localeCompare(a.date));
}
export function renderCover(template,source,memberOrigin=''){
  const marker='<!-- CHANGELOG_ENTRIES -->';
  if(template.split(marker).length!==2)throw Error('更新履歴の差し込み位置は1か所必要です');
  if(memberOrigin&&!/^https:\/\/[^/]+$/.test(memberOrigin))throw Error('会員ページの基点はHTTPSのoriginを指定してください');
  const entries=parseChangelog(source).map(({date,lesson,content,reason})=>`<li class="update"><div class="update-date"><time datetime="${date}">${date}</time><span>${escapeHtml(lesson)}</span></div><div><p class="update-content">${escapeHtml(content)}</p><p class="update-reason">きっかけ：${escapeHtml(reason)}</p></div></li>`).join('\n');
  return template.replace(marker,entries).replaceAll('{{MEMBER_ORIGIN}}',escapeHtml(memberOrigin));
}
export async function buildCover(root,out,memberOrigin=''){
  const [template,log]=await Promise.all([readFile(path.join(root,'index.html'),'utf8'),readFile(path.join(root,'changelog.md'),'utf8')]);
  await mkdir(out,{recursive:true});
  await writeFile(path.join(out,'index.html'),renderCover(template,log,memberOrigin));
  await cp(path.join(root,'public/cover-assets'),path.join(out,'cover-assets'),{recursive:true});
  console.log('Cover built from changelog.md');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  await buildCover(root,path.resolve(root,process.argv[2]||'cover-dist'),process.env.MEMBER_ORIGIN||'');
}
