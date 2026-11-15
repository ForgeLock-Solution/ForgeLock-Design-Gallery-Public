const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#main-nav');
if(menuButton&&navigation){
 const close=(focus=false)=>{
  const wasOpen=navigation.classList.contains('open');
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','Abrir menú');
  if(focus&&wasOpen)menuButton.focus();
 };
 menuButton.addEventListener('click',()=>{
  const open=!navigation.classList.contains('open');
  navigation.classList.toggle('open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
 });
 navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close()));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close(true)});
 document.addEventListener('click',e=>{if(!menuButton.contains(e.target)&&!navigation.contains(e.target))close()});
 window.matchMedia('(min-width: 901px)').addEventListener?.('change',e=>{if(e.matches)close()});
}
// Agenda de ejemplo local. No hay clases ni disponibilidad de una empresa real.
const classes=Object.freeze([
 {day:'lunes',time:'06:30',type:'Fuerza',name:'Power Base',coach:'Alex · ficticio'},
 {day:'lunes',time:'18:00',type:'Cardio',name:'Energy Circuit',coach:'Vale · ficticia'},
 {day:'martes',time:'07:00',type:'Movilidad',name:'Flow Reset',coach:'Sam · ficticio'},
 {day:'martes',time:'19:00',type:'Fuerza',name:'Lift Lab',coach:'Alex · ficticio'},
 {day:'miercoles',time:'06:30',type:'Cardio',name:'Pulse Ride',coach:'Vale · ficticia'},
 {day:'miercoles',time:'18:30',type:'Movilidad',name:'Recovery Flow',coach:'Sam · ficticio'},
 {day:'jueves',time:'07:30',type:'Fuerza',name:'Strength Club',coach:'Alex · ficticio'},
 {day:'jueves',time:'19:00',type:'Cardio',name:'Tempo Blast',coach:'Vale · ficticia'},
 {day:'viernes',time:'06:30',type:'Movilidad',name:'Stretch Studio',coach:'Sam · ficticio'},
 {day:'viernes',time:'17:30',type:'Fuerza',name:'Full Body',coach:'Alex · ficticio'}
]);
const dayButtons=[...document.querySelectorAll('.day')];
const activity=document.querySelector('#activity-filter');
const classList=document.querySelector('#class-list');
const classStatus=document.querySelector('#class-status');
let selectedDay='lunes';
function drawSchedule(){
 const type=activity.value;
 const matches=classes.filter(item=>item.day===selectedDay&&(type==='todas'||item.type===type));
 const fragment=document.createDocumentFragment();
 for(const item of matches){
  const row=document.createElement('article');row.className='class-row';
  const primary=document.createElement('div');primary.className='class-primary';
  const time=document.createElement('time');time.textContent=item.time;
  const desc=document.createElement('div');
  const title=document.createElement('strong');title.textContent=item.name;
  const subtitle=document.createElement('small');subtitle.textContent=item.type+' · Demostración';
  desc.append(title,subtitle);primary.append(time,desc);
  const coach=document.createElement('span');coach.textContent=item.coach;
  const state=document.createElement('span');state.className='class-badge';state.textContent='SOLO EJEMPLO';
  row.append(primary,coach,state);fragment.append(row);
 }
 classList.replaceChildren(fragment);
 classStatus.textContent=matches.length+' '+(matches.length===1?'clase ficticia':'clases ficticias')+' en el horario de ejemplo';
}
dayButtons.forEach(button=>button.addEventListener('click',()=>{
 selectedDay=button.dataset.day;
 dayButtons.forEach(item=>{
  const active=item===button;
  item.classList.toggle('active',active);
  item.setAttribute('aria-pressed',String(active));
 });
 drawSchedule();
}));
activity.addEventListener('change',drawSchedule);
drawSchedule();

const interestForm=document.querySelector('#interest-form');
const planSelect=document.querySelector('#plan-interest');
const goalSelect=document.querySelector('#goal-interest');
const interestStatus=document.querySelector('#interest-status');
const validPlans=new Set(['START','MOVE','PRO']);
const validGoals=new Set(['Fuerza','Cardio','Movilidad']);
document.querySelectorAll('.plan-select').forEach(button=>button.addEventListener('click',()=>{
 const plan=button.dataset.plan;
 if(!validPlans.has(plan))return;
 planSelect.value=plan;
 interestStatus.textContent='Plan '+plan+' seleccionado como ejemplo. Completa la simulación sin datos personales.';
 interestStatus.classList.remove('error');
 document.querySelector('#contacto').scrollIntoView({behavior:'auto'});
 planSelect.focus({preventScroll:true});
}));
interestForm.addEventListener('submit',event=>{
 event.preventDefault();
 const valid=validPlans.has(planSelect.value)&&validGoals.has(goalSelect.value);
 interestStatus.classList.toggle('error',!valid);
 interestStatus.textContent=valid?
  'Simulación completada: plan '+planSelect.value+' · objetivo '+goalSelect.value+'. No existe inscripción real; no se guardaron ni enviaron datos.':
  'Selecciona un plan y un objetivo de ejemplo para continuar.';
});
