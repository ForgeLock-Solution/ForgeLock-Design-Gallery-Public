import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { businesses, photo } from '../assets/admin-core/businesses.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
for(const [id,config] of Object.entries(businesses)){
  const dir=path.join(root,'disenos',id);
  fs.mkdirSync(dir,{recursive:true});
  const page=fs.readFileSync(path.join(root,'assets/admin-core/public-template.html'),'utf8')
    .replace('data-business="FL-007"',`data-business="${id}"`)
    .replace('data-theme="bakery"',`data-theme="${config.theme}"`)
    .replace('<title>Diseño conceptual | ForgeLock</title>',`<title>${escapeHtml(config.name)} · Diseño conceptual</title>`)
    .replace('id="brand" href="#inicio">ForgeLock','id="brand" href="#inicio">'+escapeHtml(config.name))
    .replace('class="kicker">DEMOSTRACIÓN CONCEPTUAL','class="kicker">'+escapeHtml(config.eyebrow))
    .replace('id="hero-title">Una experiencia para tu negocio.','id="hero-title">'+escapeHtml(config.headline))
    .replace('id="hero-copy"></p>',`id="hero-copy">${escapeHtml(config.intro)}</p>`)
    .replace('id="hero-photo" alt="" fetchpriority="high"',`id="hero-photo" src="${escapeHtml(photo(config.hero,1400))}" alt="${escapeHtml(config.heroAlt)}" fetchpriority="high"`)
    .replace('id="section-title"></h2>',`id="section-title">${escapeHtml(config.sectionTitle)}</h2>`)
    .replace('id="section-copy"></p>',`id="section-copy">${escapeHtml(config.sectionCopy)}</p>`)
    .replace('id="story-photo" src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&amp;fit=crop&amp;w=1100&amp;q=82" alt="Detalle de un espacio de trabajo preparado para atender a sus clientes"',`id="story-photo" src="${escapeHtml(photo(config.storyPhoto||config.photos[1],1100))}" alt="${escapeHtml(config.storyAlt||config.sector+': vista de '+config.name)}"`)
    .replace('id="footer-business">Diseño conceptual',`id="footer-business">${escapeHtml(config.name)} · Marca conceptual`);
  const admin=fs.readFileSync(path.join(root,'assets/admin-core/admin-template.html'),'utf8')
    .replace('data-business="FL-007"',`data-business="${id}"`)
    .replace('<title>Administración demostrativa | ForgeLock</title>',`<title>Administración de ${config.name} · Demostración</title>`);
  fs.writeFileSync(path.join(dir,'index.html'),page);
  fs.writeFileSync(path.join(dir,'admin.html'),admin);
}
console.log('Páginas públicas y paneles demostrativos locales generados para FL-007 a FL-012.');
