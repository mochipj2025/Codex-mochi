import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile, access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('app.js',root),'utf8');
function harness({failCopy=false, stored='null'}={}){
  const field={focus(){},select(){this.selected=true}};
  const details={open:false,querySelector(){return field}};
  const status={},manual={},announcement={};
  const main={innerHTML:'',querySelector(s){return s==='details'?details:s==='#saved-count'?{value:'2'}:field}};
  const state={hash:'#home'};
  const written=[];
  const sandbox={document:{querySelector(s){return ({main,dialog:{},'#copy-status':status,'#manual-copy-next':manual,'#announcement':announcement})[s]},querySelectorAll(){return []},addEventListener(){}},window:{addEventListener(){}},location:state,localStorage:{getItem(){return stored},setItem(){}},navigator:{clipboard:{async writeText(text){if(failCopy)throw Error('denied');written.push(text)}}}};
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  vm.runInContext('globalThis.api={copy,steps,home,gettingStarted,makeHub,workshop,renderStage,resumeSeriesPrompt,readProgress}',sandbox);
  return {...sandbox.api,state,main,field,details,status,manual,written};
}
test('copy success advances with the prepared prompt',async()=>{
  const h=harness();await h.copy('creation',{});
  assert.equal(h.state.hash,'paste');assert.match(h.written[0],/カピバラ/);
  await h.copy('series-resume',{});assert.equal(h.state.hash,'series-paste');assert.match(h.written[1],/確認できたのは2枚/);
});
test('denied clipboard stays on the screen and offers manual copy',async()=>{
  const h=harness({failCopy:true}),trigger={};await h.copy('creation',trigger);
  assert.equal(h.state.hash,'#home');assert.equal(h.details.open,true);assert.equal(h.field.selected,true);assert.equal(trigger.disabled,false);
  assert.match(h.manual.innerHTML,/自分でコピーできた/);assert.match(h.status.textContent,/右クリック/);
});
test('every rendered route and local image resolves',async()=>{
  const h=harness(),known=new Set(['home','main','make','getting-started','workshop',...Object.keys(h.steps)]);
  const pages=[h.home(),h.gettingStarted(),h.makeHub(),h.workshop(),...Object.keys(h.steps).map(h.renderStage)];
  for(const page of pages){
    for(const [,target] of page.matchAll(/(?:href="#|data-go=")([^" ]+)/g))assert.ok(known.has(target),target);
    for(const [,src] of page.matchAll(/src="([^" ]+)"/g))await access(new URL(src,root));
  }
  const copy=h.renderStage('copy');assert.ok(copy.indexOf('data-copy=')<copy.indexOf('<textarea'));
});
test('corrupt saved progress is ignored and resume count is bounded',()=>{
  for(const stored of ['broken','{"step":"bogus"}','null'])assert.equal(harness({stored}).readProgress(),null);
  const h=harness();assert.match(h.resumeSeriesPrompt(9),/確認できたのは4枚/);assert.match(h.resumeSeriesPrompt(-1),/確認できたのは0枚/);
});
test('HTML and manifest icon files exist',async()=>{
  const html=await readFile(new URL('index.html',root),'utf8');
  for(const [,src] of html.matchAll(/(?:src|href)="((?:icons\/|site\.webmanifest)[^"]*)"/g))await access(new URL(src,root));
  const manifest=JSON.parse(await readFile(new URL('site.webmanifest',root),'utf8'));
  assert.equal(manifest.start_url,'./#home');
  for(const icon of manifest.icons){const png=await readFile(new URL(icon.src,root));assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`,icon.sizes);assert.equal(png[25],6);}
});
