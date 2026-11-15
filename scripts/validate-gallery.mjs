import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { businesses } from '../assets/admin-core/businesses.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const designs=JSON.parse(fs.readFileSync(path.join(root,'data/designs-public.json'),'utf8'));
assert.equal(designs.length,12,'el catálogo debe contener doce diseños');
assert.deepEqual(designs.map(d=>d.id),Array.from({length:12},(_,i)=>`FL-${String(i+1).padStart(3,'0')}`),'los IDs deben ser consecutivos');
assert.equal(designs.filter(d=>d.adminAvailable).length,6,'solo seis diseños deben tener paneles demo');
assert.equal(Object.keys(businesses).length,6,'el núcleo debe declarar seis negocios nuevos');
for(const [id] of Array.from({length:6},(_,i)=>[`FL-${String(i+7).padStart(3,'0')}`,i])){
  const config=businesses[id],dir=path.join(root,'disenos',id);
  assert.ok(config,`${id}: falta configuración`);
  assert.ok(fs.existsSync(path.join(dir,'index.html')),`${id}: falta página pública`);
  assert.ok(fs.existsSync(path.join(dir,'admin.html')),`${id}: falta panel`);
  const images=[config.hero,config.storyPhoto,...config.sample.map(item=>item.image)];
  assert.ok(images.every(Boolean),`${id}: imágenes requeridas`);
  assert.equal(new Set(images).size,images.length,`${id}: imágenes repetidas dentro de la página`);
  const page=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  const admin=fs.readFileSync(path.join(dir,'admin.html'),'utf8');
  assert.match(page,/name="robots" content="noindex,nofollow"/i,`${id}: las páginas demo deben llevar noindex`);
  assert.match(admin,/name="robots" content="noindex,nofollow"/i,`${id}: panel sin noindex`);
  assert.match(page,/\.\.\/\.\.\/assets\/admin-core\/page\.js/,`${id}: núcleo público no enlazado`);
  assert.match(admin,/\.\.\/\.\.\/assets\/admin-core\/admin-page\.js/,`${id}: núcleo de administración no enlazado`);
}
const schema=fs.readFileSync(path.join(root,'data/admin-core-schema.sql'),'utf8');
assert.match(schema,/marketplace_channels/,'el modelo debe incluir marketplaces');
assert.match(schema,/business_id/,'el modelo debe aislar datos por negocio');
assert.doesNotMatch(schema,/(postgres|postgresql):\/\/|service_role|anon_key|password\s*=/i,'el esquema no debe incluir credenciales');
assert.equal(designs.filter(d=>d.adminAvailable).length,designs.filter(d=>/^FL-00[7-9]$|^FL-01[0-2]$/.test(d.id)).length,'los nuevos paneles deben tener opción visible en el catálogo');
console.log(`Validación correcta: ${designs.length} diseños, ${Object.keys(businesses).length} paneles nuevos y esquema desconectado.`);
