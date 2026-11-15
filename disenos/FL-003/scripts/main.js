const menuButton=document.querySelector('.nav-toggle');
const nav=document.querySelector('#menu-principal');
if(menuButton&&nav){
  const close=(restore=false)=>{const open=nav.classList.contains('open');nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menú');if(open&&restore)menuButton.focus();};
  menuButton.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close(true)});
  document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menuButton.contains(event.target))close()});
  const wide=window.matchMedia('(min-width: 901px)');wide.addEventListener?.('change',event=>{if(event.matches)close()});
}
const cards=[...document.querySelectorAll('.property-card')];
const data=new Map(cards.map(card=>{
  const id=card.dataset.id;
  return [id,{
    id,type:card.dataset.type,area:card.dataset.area,price:Number(card.dataset.price),
    title:card.querySelector('h3').textContent.trim(),
    description:card.querySelector('.property-description').textContent.trim(),
    specs:[...card.querySelectorAll('.property-specs span')].map(el=>el.textContent.trim())
  }];
}));
const form=document.querySelector('#filters');
const count=document.querySelector('#result-count');
const empty=document.querySelector('#empty-state');
if(form){
  const apply=()=>{
    const type=form.elements.namedItem('type').value;
    const area=form.elements.namedItem('area').value;
    const budget=form.elements.namedItem('budget').value;
    let visible=0;
    for(const card of cards){
      const item=data.get(card.dataset.id);
      const match=(type==='todos'||item.type===type)&&(area==='todas'||item.area===area)&&(budget==='todos'||item.price<=Number(budget));
      card.hidden=!match;
      if(match)visible++;
    }
    count.textContent=`${visible} ${visible===1?'propiedad':'propiedades'} de demostración`;
    empty.hidden=visible!==0;
  };
  form.addEventListener('change',apply);
  form.addEventListener('reset',()=>queueMicrotask(apply));
  document.querySelector('#empty-reset')?.addEventListener('click',()=>form.reset());
}
const dialog=document.querySelector('#property-dialog');
const detailButtons=[...document.querySelectorAll('.details-button')];
const contactSelect=document.querySelector('#property-select');
const contactStatus=document.querySelector('#contact-status');
let previousTrigger=null;
function openDetails(id,trigger){
  const item=data.get(id);
  if(!item||!dialog)return;
  previousTrigger=trigger;
  document.querySelector('#dialog-title').textContent=item.title;
  document.querySelector('#dialog-location').textContent=`${item.id} · Zona ${item.area} de ejemplo · ${item.type} ficticio`;
  document.querySelector('#dialog-description').textContent=item.description;
  const specs=document.querySelector('#dialog-specs');
  specs.replaceChildren();
  const values=[['Superficie',item.specs[0]],['Habitaciones',item.specs[1]],['Baños',item.specs[2]],['Valor ilustrativo',`$${item.price} millones COP`]];
  for(const [label,value] of values){const dt=document.createElement('dt');const dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;specs.append(dt,dd)}
  dialog.showModal();
}
detailButtons.forEach(button=>button.addEventListener('click',()=>openDetails(button.dataset.id,button)));
document.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog?.addEventListener('close',()=>{previousTrigger?.focus();previousTrigger=null});
document.querySelector('#dialog-contact')?.addEventListener('click',()=>{
  const id=previousTrigger?.dataset.id;
  if(id && contactSelect){contactSelect.value=id;contactStatus.textContent='';}
  dialog.close();
  document.querySelector('#contacto')?.scrollIntoView({behavior:'auto'});
  contactSelect?.focus({preventScroll:true});
});
document.querySelector('#simulate-contact')?.addEventListener('click',()=>{
  const id=contactSelect.value;
  contactStatus.textContent=data.has(id)?`Simulación completada para ${id} · ${data.get(id).title}. No se envió ninguna solicitud ni se guardó información.`:'Selecciona una propiedad ficticia antes de simular la consulta.';
});
