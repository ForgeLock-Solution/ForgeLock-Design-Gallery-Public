'use strict';
(()=>{
  const list=document.getElementById('external-cards');
  const search=document.getElementById('external-search');
  const category=document.getElementById('external-category');
  const count=document.getElementById('external-count');
  if(!list||!search||!category||!count)return;
  let entries=[];
  const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const validURL=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}};
  const screenshot=url=>'https://s0.wp.com/mshots/v1/'+encodeURIComponent(url)+'?w=900&h=560';
  const quote=item=>'https://wa.me/573123007530?text='+encodeURIComponent('Hola ForgeLock, quisiera cotizar una página basada en esta referencia externa: '+item.name+' ('+item.id+'). Enlace: '+item.url+'. ¿Podemos adaptarla para mi negocio?');
  const render=()=>{
    const q=search.value.toLocaleLowerCase('es').trim(),cat=category.value;
    const filtered=entries.filter(e=>(cat==='all'||e.sector===cat)&&[e.name,e.title,e.description,e.sector,e.kind].join(' ').toLocaleLowerCase('es').includes(q));
    count.textContent=filtered.length+' referencias encontradas';
    list.replaceChildren();
    if(!filtered.length){const p=document.createElement('p');p.textContent='No hay referencias con estos filtros.';list.append(p);return}
    filtered.forEach(entry=>{
      const url=validURL(entry.url);if(!url)return;
      const article=document.createElement('article');article.className='external-card';
      article.innerHTML='<div class="external-card-preview style-'+escapeHTML(entry.style)+'"><span class="external-origin">'+escapeHTML(entry.kind)+'</span><img class="external-cover" src="'+escapeHTML(screenshot(url))+'" alt="Vista previa del sitio '+escapeHTML(entry.name)+'" loading="lazy" decoding="async" width="900" height="560" referrerpolicy="no-referrer"><span class="external-icon" aria-hidden="true"></span><strong>'+escapeHTML(entry.name)+'</strong></div><div class="external-card-body"><p class="external-category">'+escapeHTML(entry.sector)+' · '+escapeHTML(entry.id)+'</p><h3>'+escapeHTML(entry.title)+'</h3><p>'+escapeHTML(entry.description)+'</p><div class="external-actions"><a class="button-outline" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(url)+'">Ver páginas ↗</a><a class="button" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(quote(entry))+'">Cotizar estilo</a></div></div>';
      const cover=article.querySelector('.external-cover');cover.addEventListener('error',()=>{cover.hidden=true;article.querySelector('.external-card-preview').classList.add('cover-fallback')});list.append(article);
    });
  };
  fetch('./data/referencias-externas.json').then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.json()}).then(value=>{
    if(!Array.isArray(value))throw Error('Formato no válido');
    entries=value.filter(e=>e&&typeof e.name==='string'&&validURL(e.url));
    [...new Set(entries.map(e=>e.sector))].sort((a,b)=>a.localeCompare(b,'es')).forEach(name=>category.add(new Option(name,name)));
    search.addEventListener('input',render);category.addEventListener('change',render);render();
  }).catch(()=>{list.innerHTML='<p role="status">No fue posible cargar las referencias externas. Los diseños de ForgeLock siguen disponibles arriba.</p>';count.textContent='Referencias no disponibles'});
})();
