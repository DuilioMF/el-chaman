import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
test('El Chamán tiene documento y JavaScript válido',()=>{
 assert.match(html,/<!doctype html>/i);
 assert.ok(script,'script faltante');
 new vm.Script(script);
});
test('Despertar 1 dura exactamente 600 segundos en seis fases',()=>{
 const starts=[...script.matchAll(/\{start:(\d+),title:/g)].map(m=>Number(m[1]));
 assert.deepEqual(starts,[0,45,135,255,405,525]);
 assert.deepEqual(starts.slice(1).map((t,i)=>t-starts[i]).concat(600-starts.at(-1)),[45,90,120,150,120,75]);
 assert.match(script,/const TOTAL=600/);
 assert.match(script,/performance\.now\(\)/);
});
test('Catálogo extensible con un solo Despertar publicado',()=>{
 assert.match(script,/const catalog=\[\{id:1,/);
 assert.doesNotMatch(script,/id:2,title:/);
 assert.match(script,/catalog\.forEach/);
});
test('Controles principales y accesibilidad están presentes',()=>{
 for(const id of ['play','restart','exit','voice-enabled','voice-volume','ambient-enabled','ambient-volume','progress','stage-prompt','name-dialog','edit-name']) {
  assert.ok(html.includes('id="'+id+'"'),id+' ausente');
 }
 assert.match(html,/prefers-reduced-motion:reduce/);
 assert.match(html,/aria-live="polite"/);
 assert.match(html,/aria-label="Cerrar El Chamán/);
});
test('El modo seguro preserva el consentimiento y no contiene secretos en HTML',()=>{
 assert.match(script,/chaman_profiles/);
 assert.match(script,/chaman_reflections/);
 assert.match(script,/chaman_access/);
 assert.match(script,/signInWithOtp/);
 assert.match(script,/record\?\.active/);
 assert.doesNotMatch(script,/signInWithPassword/);
 assert.match(script,/remoteClient\.auth\.getUser/);
 assert.match(script,/TEST_DEMO/);
 assert.match(script,/local-consent/);
 assert.doesNotMatch(html,/sb_secret_/);
});
