const entries=[
[203,'Non-respect du STOP','Signalisation'],[210,'Non-respect du feu rouge','Signalisation'],[256,'Circulation en sens interdit','Signalisation'],[11325,'Franchissement d’une ligne continue','Circulation'],[23800,'Téléphone tenu en main au volant','Téléphone'],[31063,'Port à l’oreille d’un dispositif susceptible d’émettre du son','Téléphone'],[217,'Changement de direction sans avertissement préalable','Circulation'],[6090,'Conduite sans possibilité de manœuvrer aisément','Circulation'],[12522,'Défaut de contrôle technique (véhicule léger)','Documents'],[6163,'Circulation sans assurance','Documents'],[23761,'Conduite après usage de stupéfiants','Conduite'],[6224,'Changement de domicile non déclaré sur certificat d’immatriculation','Documents'],[12867,'Non-respect d’indications de signalisation routière','Signalisation']];
const cats=['Toutes','Favoris',...new Set(entries.map(e=>e[2]))];let cat='Toutes';let stored=[];
try{stored=JSON.parse(localStorage.getItem('natinf-fav')||'[]');if(!Array.isArray(stored))stored=[]}catch{}
const fav=new Set(stored);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const norm=s=>String(s).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const q=document.getElementById('q'),results=document.getElementById('results'),filters=document.getElementById('filters');
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.style.display='none',1700)}
function render(){
const query=norm(q.value.trim());
filters.innerHTML=cats.map(c=>'<button type="button" class="'+(cat===c?'active':'')+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>').join('');
const rows=entries.filter(e=>(cat==='Toutes'||(cat==='Favoris'?fav.has(e[0]):e[2]===cat))&&norm(e.join(' ')).includes(query));
document.getElementById('count').textContent=rows.length+' résultat'+(rows.length>1?'s':'');
results.innerHTML=rows.map(e=>'<article class="item"><div class="item-top"><span class="code">NATINF '+e[0]+'</span><span class="category">'+esc(e[2])+'</span></div><h3>'+esc(e[1])+'</h3><div class="muted">Qualification abrégée · À vérifier</div><div class="actions"><button type="button" class="'+(fav.has(e[0])?'saved':'')+'" data-fav="'+e[0]+'">'+(fav.has(e[0])?'★ Favori':'☆ Favori')+'</button><button type="button" data-copy="'+e[0]+'">⧉ Copier</button><a href="https://www.legifrance.gouv.fr/" target="_blank" rel="noopener noreferrer">Vérifier ↗</a></div></article>').join('')||'<div class="empty">Aucun résultat dans cette sélection limitée.<br>Essayez un autre terme ou consultez les sources officielles.</div>';
}
filters.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b){cat=b.dataset.cat;render()}});
results.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.fav){const n=Number(b.dataset.fav);fav.has(n)?fav.delete(n):fav.add(n);try{localStorage.setItem('natinf-fav',JSON.stringify([...fav]))}catch{}render()}else if(b.dataset.copy){try{await navigator.clipboard.writeText(b.dataset.copy);toast('Code NATINF copié')}catch{window.prompt('Copiez ce code :',b.dataset.copy)}}});
document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{q.value=b.dataset.query;cat='Toutes';render();q.focus()}));
document.getElementById('clear').addEventListener('click',()=>{q.value='';render();q.focus()});
q.addEventListener('input',render);render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
