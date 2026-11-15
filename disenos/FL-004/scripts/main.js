const catalog = Object.freeze([
  {id:'NV-101',name:'Jarrón Luma',category:'decoracion',price:89000,description:'Cerámica escultórica de líneas suaves.',art:'vase',tone:'clay'},
  {id:'NV-102',name:'Lámpara Alba',category:'iluminacion',price:189000,description:'Luz cálida con presencia minimalista.',art:'lamp',tone:'sage'},
  {id:'NV-103',name:'Cuenco Origen',category:'hogar',price:59000,description:'Forma orgánica para los pequeños rituales.',art:'bowl',tone:'sand'},
  {id:'NV-104',name:'Espejo Nube',category:'decoracion',price:249000,description:'Un acento de luz para cualquier espacio.',art:'mirror',tone:'rose'},
  {id:'NV-105',name:'Lámpara Nido',category:'iluminacion',price:229000,description:'Geometría serena para iluminar rincones.',art:'lamp',tone:'clay'},
  {id:'NV-106',name:'Set Terra',category:'hogar',price:99000,description:'Piezas de mesa inspiradas en lo natural.',art:'bowl',tone:'sage'},
  {id:'NV-107',name:'Vaso Oliva',category:'hogar',price:39000,description:'Un objeto sencillo para cada día.',art:'cup',tone:'rose'},
  {id:'NV-108',name:'Jarrón Bruma',category:'decoracion',price:129000,description:'Textura y proporción en equilibrio.',art:'vase',tone:'sand'}
]);
const money=value=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);
const products=new Map(catalog.map(item=>[item.id,item]));
const cart=new Map(); // En memoria solamente: sin almacenamiento, red ni pagos.
const searchInput=document.querySelector('#search-products');
const categorySelect=document.querySelector('#category');
const orderSelect=document.querySelector('#order');
const grid=document.querySelector('#product-grid');
const results=document.querySelector('#results-count');
const empty=document.querySelector('#no-results');
const form=document.querySelector('#catalog-controls');
const dialog=document.querySelector('#cart-dialog');
const trigger=document.querySelector('#cart-trigger');
const count=document.querySelector('#cart-count');
const drawerCount=document.querySelector('#drawer-count');
const items=document.querySelector('#cart-items');
const subtotal=document.querySelector('#cart-subtotal');
const emptyCart=document.querySelector('#cart-empty');
const checkout=document.querySelector('#checkout-trigger');
const checkoutStatus=document.querySelector('#checkout-status');

function make(tag,cls,txt){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(txt!==undefined)node.textContent=txt;
 return node;
}
function renderCatalog(){
 const term=searchInput.value.trim().toLocaleLowerCase('es');
 const category=categorySelect.value;
 const filtered=catalog.filter(item=>(category==='todos'||item.category===category)&&
   (item.name.toLocaleLowerCase('es').includes(term)||item.description.toLocaleLowerCase('es').includes(term)));
 const sort=orderSelect.value;
 if(sort==='low')filtered.sort((a,b)=>a.price-b.price);
 if(sort==='high')filtered.sort((a,b)=>b.price-a.price);
 if(sort==='name')filtered.sort((a,b)=>a.name.localeCompare(b.name,'es'));
 grid.replaceChildren();
 const fragment=document.createDocumentFragment();
 for(const item of filtered){
  const article=make('article','product-card');
  article.dataset.id=item.id;
  const figure=make('div','product-art art-'+item.tone);
  figure.setAttribute('role','img');
  figure.setAttribute('aria-label','Ilustración conceptual de '+item.name);
  const object=make('div','product-shape shape-'+item.art);
  object.setAttribute('aria-hidden','true');
  const number=make('span','product-number',item.id);
  figure.append(object,number);
  const info=make('div','product-info');
  info.append(make('p','product-category',item.category.toUpperCase()+' · DEMOSTRACIÓN'),
              make('h3','product-name',item.name),
              make('p','product-description',item.description),
              make('p','product-price',money(item.price)));
  const button=make('button','add-button','Agregar a mi bolsa');
  button.type='button';
  button.dataset.add=item.id;
  button.setAttribute('aria-label','Agregar '+item.name+' al carrito');
  info.append(button);
  article.append(figure,info);
  fragment.append(article);
 }
 grid.append(fragment);
 results.textContent=filtered.length+' '+(filtered.length===1?'producto':'productos')+' de demostración';
 empty.hidden=filtered.length!==0;
}
form.addEventListener('input',renderCatalog);
form.addEventListener('change',renderCatalog);
form.addEventListener('reset',()=>queueMicrotask(renderCatalog));
document.querySelector('#clear-empty').addEventListener('click',()=>form.reset());
function renderCart(){
 const entries=[...cart.entries()];
 const quantity=entries.reduce((sum,[,qty])=>sum+qty,0);
 const amount=entries.reduce((sum,[id,qty])=>sum+products.get(id).price*qty,0);
 count.textContent=String(quantity);
 drawerCount.textContent='('+quantity+')';
 trigger.setAttribute('aria-label','Abrir carrito, '+quantity+' '+(quantity===1?'producto':'productos'));
 subtotal.textContent=money(amount);
 checkout.disabled=quantity===0;
 emptyCart.hidden=quantity!==0;
 items.replaceChildren();
 const fragment=document.createDocumentFragment();
 for(const [id,qty] of entries){
  const item=products.get(id);
  const row=make('div','cart-row');row.dataset.id=id;
  const miniature=make('div','cart-mini art-'+item.tone);
  miniature.append(make('div','product-shape shape-'+item.art));miniature.setAttribute('aria-hidden','true');
  const info=make('div','cart-item-info');
  info.append(make('strong','',item.name),make('span','',money(item.price)));
  const controls=make('div','quantity-controls');
  const minus=make('button','','−');minus.type='button';minus.dataset.change=id;minus.dataset.delta='-1';
  minus.setAttribute('aria-label','Quitar una unidad de '+item.name);
  const number=make('output','',String(qty));number.setAttribute('aria-label',qty+' unidades');
  const plus=make('button','', '+');plus.type='button';plus.dataset.change=id;plus.dataset.delta='1';
  plus.setAttribute('aria-label','Añadir una unidad de '+item.name);
  controls.append(minus,number,plus);
  const remove=make('button','remove-item','Eliminar');remove.type='button';remove.dataset.remove=id;
  remove.setAttribute('aria-label','Eliminar '+item.name+' del carrito');
  info.append(controls,remove);
  row.append(miniature,info);fragment.append(row);
 }
 items.append(fragment);
}
function changeQuantity(id,delta){
 if(!products.has(id))return;
 const next=(cart.get(id)||0)+delta;
 if(next<=0)cart.delete(id);
 else cart.set(id,Math.min(next,99));
 checkoutStatus.textContent='';
 renderCart();
}
grid.addEventListener('click',event=>{
 const button=event.target.closest('[data-add]');
 if(!button||!grid.contains(button))return;
 changeQuantity(button.dataset.add,1);
 trigger.focus();
 dialog.showModal();
});
items.addEventListener('click',event=>{
 const update=event.target.closest('[data-change]');
 const remove=event.target.closest('[data-remove]');
 if(update)changeQuantity(update.dataset.change,Number(update.dataset.delta));
 if(remove){cart.delete(remove.dataset.remove);checkoutStatus.textContent='';renderCart();}
});
trigger.addEventListener('click',()=>dialog.showModal());
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
checkout.addEventListener('click',()=>{
 if(cart.size===0)return;
 const countItems=[...cart.values()].reduce((a,b)=>a+b,0);
 checkoutStatus.textContent='Simulación completada para '+countItems+' '+(countItems===1?'producto':'productos')+'. No se realizó ningún cobro, pedido ni envío de datos.';
});
const menuButton=document.querySelector('.nav-toggle');
const nav=document.querySelector('#nav');
function closeMenu(restore=false){
 const wasOpen=nav.classList.contains('open');
 nav.classList.remove('open');
 menuButton.setAttribute('aria-expanded','false');
 menuButton.setAttribute('aria-label','Abrir menú');
 if(restore&&wasOpen)menuButton.focus();
}
menuButton.addEventListener('click',()=>{
 const open=!nav.classList.contains('open');
 nav.classList.toggle('open',open);
 menuButton.setAttribute('aria-expanded',String(open));
 menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu(true);});
document.addEventListener('click',event=>{if(!menuButton.contains(event.target)&&!nav.contains(event.target))closeMenu();});
window.matchMedia('(min-width: 901px)').addEventListener?.('change',e=>{if(e.matches)closeMenu();});
renderCatalog();renderCart();
