import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '../index.html');
const html = readFileSync(path);
let server, browser, origin;
before(async () => {
  server=createServer((req,res)=>{
    if(req.url!=='/'&&req.url!=='/index.html'){res.writeHead(404);res.end();return}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    res.end(html);
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true});
});
after(async()=>{await browser?.close();await new Promise(done=>server?.close(done))});
async function openMobile(){
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto(origin);
 return {context,page};
}
test('Bienvenida se conserva y se puede cambiar',async()=>{
 const {context,page}=await openMobile();
 try{
  assert.equal(await page.locator('#name-dialog').isVisible(),true);
  await page.locator('#preferred-name').fill('Prueba');
  await page.locator('#save-name').click();
  assert.match(await page.locator('#greeting').textContent(),/Prueba/);
  await page.reload();
  assert.equal(await page.locator('#name-dialog').isVisible(),false);
  assert.match(await page.locator('#greeting').textContent(),/Prueba/);
  await page.locator('#edit-name').click();
  await page.locator('#clear-name').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('elchaman.preferredName.v1')),null);
 }finally{await context.close()}
});
test('La vista móvil no requiere desplazamiento horizontal',async()=>{
 const {context,page}=await openMobile();
 try{
  await page.locator('#skip-name').click();
  const measures=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
  assert.ok(measures.scroll <= measures.inner+1,'Desbordamiento horizontal '+JSON.stringify(measures));
  mkdirSync('screenshots',{recursive:true});
  await page.screenshot({path:'screenshots/chaman-mobile.png',fullPage:true});
 }finally{await context.close()}
});
test('Diez minutos y seis fases con pausa y reanudación',async()=>{
 const {context,page}=await openMobile();
 try{
  await page.locator('#skip-name').click();
  await page.clock.install();
  await page.getByRole('button',{name:/Entrar al Despertar 1/}).click();
  assert.equal(await page.locator('#clock').textContent(),'00:00 / 10:00');
  await page.locator('#play').click();
  await page.clock.fastForward(46_000);
  assert.match(await page.locator('#stage-label').textContent(),/02/);
  await page.locator('#play').click();
  const paused=await page.locator('#clock').textContent();
  await page.clock.fastForward(80_000);
  assert.equal(await page.locator('#clock').textContent(),paused);
  await page.locator('#play').click();
  await page.clock.fastForward(554_000);
  assert.equal(await page.locator('#clock').textContent(),'10:00 / 10:00');
  assert.equal(await page.locator('#after').isVisible(),true);
  assert.equal(await page.locator('#play').isDisabled(),true);
  await page.locator('#restart').click();
  assert.equal(await page.locator('#after').isVisible(),false);
  await page.locator('#exit').click();
  assert.equal(await page.locator('#experiencia').isVisible(),false);
 }finally{await context.close()}
});
test('Cuaderno no guarda nada sin consentimiento explícito',async()=>{
 const {context,page}=await openMobile();
 try{
  await page.locator('#skip-name').click();
  await page.clock.install();
  await page.getByRole('button',{name:/Entrar al Despertar 1/}).click();
  await page.locator('#play').click();
  await page.clock.fastForward(600_000);
  assert.equal(await page.locator('#after').isVisible(),true);
  await page.locator('#reflection').fill('Una prueba de privacidad');
  await page.locator('#save-reflection').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('elchaman.reflection.1.v1')),null);
  await page.locator('#local-consent').check();
  await page.locator('#save-reflection').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('elchaman.reflection.1.v1')),'Una prueba de privacidad');
  await page.locator('#erase-reflection').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('elchaman.reflection.1.v1')),null);
 }finally{await context.close()}
});

test('Omitir el nombre se respeta entre visitas y el diálogo contiene el foco',async()=>{
 const {context,page}=await openMobile();
 try{
  assert.equal(await page.locator('header').evaluate(el=>el.inert),true);
  await page.locator('#preferred-name').focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#clear-name').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#preferred-name').evaluate(el=>el===document.activeElement),true);
  await page.locator('#skip-name').click();
  assert.equal(await page.locator('header').evaluate(el=>el.inert),false);
  await page.reload();
  assert.equal(await page.locator('#name-dialog').isVisible(),false);
  await page.locator('#edit-name').click();
  assert.equal(await page.locator('#name-dialog').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#name-dialog').isVisible(),false);
 }finally{await context.close()}
});
test('La nota consentida reaparece tras repetir la meditación y se puede borrar',async()=>{
 const {context,page}=await openMobile();
 try{
  await page.locator('#skip-name').click();
  await page.clock.install();
  await page.getByRole('button',{name:/Entrar al Despertar 1/}).click();
  await page.locator('#play').click();
  await page.clock.fastForward(600_000);
  await page.locator('#reflection').fill('Recordar esta sensación');
  await page.locator('#local-consent').check();
  await page.locator('#save-reflection').click();
  await page.locator('#restart').click();
  assert.equal(await page.locator('#reflection').inputValue(),'');
  await page.clock.fastForward(600_000);
  assert.equal(await page.locator('#reflection').inputValue(),'Recordar esta sensación');
  assert.match(await page.locator('#save-status').textContent(),/recuperó tu nota/);
  await page.locator('#erase-reflection').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('elchaman.reflection.1.v1')),null);
 }finally{await context.close()}
});
