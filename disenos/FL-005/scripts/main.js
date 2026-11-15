const toggle=document.querySelector('.menu-button');
const nav=document.querySelector('#main-nav');
if(toggle&&nav){
 const close=(restore=false)=>{
  const open=nav.classList.contains('open');
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Abrir navegación');
  if(restore&&open)toggle.focus();
 };
 toggle.addEventListener('click',()=>{
  const open=!nav.classList.contains('open');
  nav.classList.toggle('open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Cerrar navegación':'Abrir navegación');
 });
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close()));
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close(true)});
 document.addEventListener('click',event=>{if(!toggle.contains(event.target)&&!nav.contains(event.target))close()});
 window.matchMedia('(min-width: 901px)').addEventListener?.('change',event=>{if(event.matches)close()});
}
const form=document.querySelector('#contact-form');
if(form){
 const result=document.querySelector('#form-result');
 const area=form.elements.namedItem('topic');
 const scope=form.elements.namedItem('scope');
 const validAreas=new Set(['Estrategia','Transformación digital','Diseño de servicios','Optimización']);
 const validScopes=new Set(['Conocer servicios','Explorar proyecto','Solicitar orientación']);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const valid=validAreas.has(area.value)&&validScopes.has(scope.value);
  result.classList.toggle('error',!valid);
  if(!valid){
   result.textContent='Selecciona el área y el tipo de consulta para completar la simulación.';
   return;
  }
  result.textContent='Simulación completada: '+area.value+' · '+scope.value+'. No se guardaron datos ni se envió ninguna solicitud real.';
 });
}
