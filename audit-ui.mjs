/* Static portfolio usability audit. Node 22; no third-party dependencies.
   This checks source structure and budgets, not browser paint or Lighthouse scores. */
import {readFileSync,existsSync,statSync} from 'node:fs';
import {dirname,resolve,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url));
const root=existsSync(join(here,'index.html'))?here:resolve(here,'..');
const classic=existsSync(join(root,'classic.css'));
const pages=classic
 ? ['index.html','project-log.html','cv.html','projects/deepfake.html','projects/market.html','projects/rovan.html','projects/automoto.html']
 : ['index.html','project-log.html','cv.html','projects/deepfake-detection.html','projects/indian-market-lab.html','projects/rovan.html','projects/automoto-studio.html'];
const scripts=classic?['classic.js']:['v5.js','intro.js'];
const styles=classic?['classic.css','project-log.css']:['v5.css','profile.css','project-log.css'];
let assertions=0,fragmentLinks=0,externalLinks=0;
function assert(x,label){assertions++;if(!x)throw new Error('FAIL: '+label);}
const texts=new Map();
for(const f of pages){
 const path=join(root,f);
 assert(existsSync(path),'HTML exists: '+f);
 const t=readFileSync(path,'utf8');
 texts.set(f,t);
 assert(/<html\b[^>]*\blang="en"/i.test(t),'Document language: '+f);
 assert(/<meta\b[^>]*name="viewport"/i.test(t),'Responsive viewport: '+f);
 assert((t.match(/<main\b/g)||[]).length===1,'Exactly one main landmark: '+f);
 assert((t.match(/<h1\b/g)||[]).length===1,'Exactly one page heading: '+f);
 if(f!=='cv.html')assert(/href="#main"/.test(t),'Skip-to-content anchor: '+f);
 const ids=[...t.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert(new Set(ids).size===ids.length,'No duplicate IDs: '+f);
 for(const tag of t.match(/<[^>]*\brole="img"[^>]*>/g)||[]){
   assert(/\baria-label=|\baria-labelledby=/.test(tag),'Illustrative graphic has accessible label: '+f);
 }
 for(const tag of t.match(/<img\b[^>]*>/g)||[]){
   assert(/\balt=/.test(tag),'Image alt text: '+f);
 }
 for(const tag of t.match(/<a\b[^>]*\btarget="_blank"[^>]*>/g)||[]){
   externalLinks++;
   assert(/\brel="[^"]*noopener/.test(tag),'New-tab link has noopener: '+f);
 }
 assert(statSync(path).size<90000,'HTML size under 90 KB: '+f);
}
for(const f of pages){
 const t=texts.get(f);
 for(const match of t.matchAll(/\bhref="([^"]+)"/g)){
   const href=match[1];
   if(/^(?:https?:|mailto:|tel:|data:)/i.test(href)||!href.includes('#'))continue;
   const [pathPart,fragment]=href.split('#');
   if(!fragment)continue;
   const target=pathPart?resolve(dirname(join(root,f)),pathPart):join(root,f);
   if(extname(target)!=='.html'||!existsSync(target))continue;
   const targetText=readFileSync(target,'utf8');
   const safe=decodeURIComponent(fragment);
   assert(targetText.includes('id="'+safe+'"'),'Fragment '+href+' resolves from '+f);
   fragmentLinks++;
 }
}
for(const f of styles){
 const path=join(root,f);
 assert(existsSync(path),'Stylesheet exists: '+f);
 assert(statSync(path).size<95000,'CSS text under 95 KB: '+f);
}
const sharedCSS=readFileSync(join(root,classic?'classic.css':'v5.css'),'utf8');
assert(sharedCSS.includes('prefers-reduced-motion'),'Motion preferences supported');
assert(sharedCSS.includes('max-width:'),'Responsive CSS breakpoints present');
assert(sharedCSS.includes(':focus-visible'),'Visible keyboard focus styles present');
for(const f of scripts){
 const path=join(root,f);
 assert(existsSync(path),'Script exists: '+f);
 assert(statSync(path).size<32000,'JavaScript under 32 KB: '+f);
 execFileSync(process.execPath,['--check',path],{stdio:'pipe'});
}
const home=texts.get('index.html');
assert(home.includes('project-log.html'),'Project evidence page discoverable');
assert(!/internship/i.test(home),'No unwanted internship pitch');
if(!classic){
 const js=readFileSync(join(root,'v5.js'),'utf8');
 assert(js.includes("Array.from(document.querySelectorAll("),'Navigation selector uses a collection');
 assert(home.includes('role="combobox"'),'Keyboard-search accessible role');
}else{
 const js=readFileSync(join(root,'classic.js'),'utf8');
 assert(js.includes("classList.toggle('is-in-view',entry.isIntersecting)"),'Offscreen animations pause');
 assert(js.includes('window.scrollTo({top:0,left:0'),'Back-to-top remains functional');
}
console.log('PASS: '+assertions+' static quality checks; '+pages.length+' HTML pages; '+fragmentLinks+' in-page links; '+externalLinks+' external new-tab links.');
console.log('Note: These are static tests, not real-device tests, Lighthouse or measured Core Web Vitals.');
