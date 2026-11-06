import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=dirname(fileURLToPath(import.meta.url));
const paths=['index.html','classic.css','classic.js','cv.html','favicon.svg','.nojekyll','README.md','projects/deepfake.html','projects/market.html','projects/rovan.html','projects/automoto.html','projects/ashok.html'];
let count=0;
function check(test,message){count++;if(!test)throw new Error('FAIL: '+message)}
for(const p of paths)check(existsSync(join(root,p)),'Required file '+p);
const read=p=>readFileSync(join(root,p),'utf8');
const home=read('index.html'),css=read('classic.css'),js=read('classic.js');
check((home.match(/class="project-item"/g)||[]).length===5,'Five project entries');
check(home.includes('Most implementation')||home.includes('AI tools produce most'),'Disclose AI assistance');
check(home.includes('research and broader validation are not complete'),'Research unfinished');
check(!home.includes('href="../"'),'No links to parent Digital Lab');
check(home.includes('href="cv.html"')&&home.includes('href="favicon.svg"'),'Independent CV and favicon paths');
check(home.includes('id="opening"')&&home.includes('opening-skip'),'Opening / skip controls');
check(js.includes('setTimeout(finishIntro,5000)')&&js.includes('rc-classic-seen'),'Intro duration and session rule');
check(js.includes("e.key==='Escape'"),'Escape shortcut');
check(css.includes('opening-leave')&&css.includes('prefers-reduced-motion'),'Transition and accessible fallback');
check(!/internship/i.test(home),'No internship section');
check(!/digital forensic/i.test(home),'No unsupported specialization');
check(!/ashokenterprise\.com/i.test(home),'No unverified Ashok public domain');
for(const p of paths.filter(x=>x.endsWith('.html'))){
 const text=read(p);
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  const raw=match[1],u=raw.split(/[?#]/)[0];
  if(!u||u.startsWith('#')||/^(https?:|mailto:|tel:|data:)/.test(u))continue;
  const target=resolve(dirname(join(root,p)),u);
  check(target===root||target.startsWith(root+'/'),'No link above classic root: '+p+' → '+raw);
  check(existsSync(target),'Relative link '+p+' → '+raw);
 }
 if(p.startsWith('projects/')){
  check(text.includes('manual testing has been limited'),'Project limitations '+p);
  check(!text.includes('DIGITAL LAB'),'No link to original Digital Lab '+p);
  check(text.includes('not a software screenshot'),'No fake screenshot '+p);
 }
}
execFileSync(process.execPath,['--check',join(root,'classic.js')],{stdio:'pipe'});
console.log('PASS: '+count+' Classic Portfolio static checks.');
