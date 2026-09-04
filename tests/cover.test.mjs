import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,cp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parseChangelog,renderCover,buildCover} from '../scripts/build-cover.mjs';
const root=new URL('../',import.meta.url);
test('changelog is newest first, preserving same-day order',()=>{
  const rows=parseChangelog('2026-09-04｜第1回｜先の項目｜質問\n2026-09-05｜第2回｜新しい項目｜質問\n2026-09-04｜第1回｜次の項目｜質問');
  assert.deepEqual(rows.map(x=>x.content),['新しい項目','先の項目','次の項目']);
});
test('invalid rows and dates fail the build instead of silently disappearing',()=>{
  for(const input of ['2026-09-04｜第1回｜内容','2026-02-30｜第1回｜内容｜質問','2026-09-04｜第1回｜｜質問','2026-09-04｜第1回｜内容｜質問｜余分'])assert.throws(()=>parseChangelog(input));
  assert.equal(parseChangelog('\uFEFF2026-09-04｜第1回｜内容｜質問\r\n\r\n').length,1);
});
test('changelog is escaped and injected exactly once',()=>{
  const html=renderCover('<!-- CHANGELOG_ENTRIES -->','2026-09-04｜第1回｜<script>alert(1)</script>｜A&B');
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('A&amp;B'));assert.ok(!html.includes('<script>'));
  assert.throws(()=>renderCover('no marker',''));
});
test('cover has requested sections in order and no inner lesson text',async()=>{
  const template=await readFile(new URL('index.html',root),'utf8');
  const log=await readFile(new URL('changelog.md',root),'utf8');
  const html=renderCover(template,log);
  const ids=['cover-title','grow-title','contents-title','updates-title','join-title'];
  const positions=ids.map(id=>html.indexOf(`id="${id}"`));
  assert.ok(positions.every((p,i)=>p>=0&&(i===0||p>positions[i-1])));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/class="update"/g)||[]).length,6);
  assert.ok(!html.includes('CHANGELOG_ENTRIES'));assert.ok(!html.includes('{{MEMBER_ORIGIN}}'));
  assert.ok(!html.includes('<script'));assert.ok(!html.includes('<iframe'));assert.ok(!html.includes('<pre'));
  assert.ok(html.includes('第0章「はじめる前に」を新設予定'));
});
test('changing only changelog changes the generated cover',async()=>{
  const {fileURLToPath}=await import('node:url');
  const fixture=await mkdtemp(path.join(os.tmpdir(),'mochi-cover-'));
  await cp(new URL('index.html',root),path.join(fixture,'index.html'));
  await cp(new URL('public',root),path.join(fixture,'public'),{recursive:true,filter:p=>!String(p).includes('downloads')&&!String(p).includes('images')});
  const out=path.join(fixture,'built');
  await writeFile(path.join(fixture,'changelog.md'),'2026-09-05｜第2回｜確認用の追加｜参加者の質問');
  await buildCover(fixture,out);
  const html=await readFile(path.join(out,'index.html'),'utf8');assert.ok(html.includes('確認用の追加'));assert.ok(!html.includes('初回開催'));
});
