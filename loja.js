(() => {
  document.querySelectorAll('.topo,.abertura.manifesto').forEach(section=>{
    const lace=document.createElement('div');lace.className='renda-continua';lace.setAttribute('aria-hidden','true');
    const strip=document.createElement('div');strip.className='renda-fita';
    for(let i=0;i<120;i++)strip.append(document.createElement('span'));
    lace.append(strip);section.append(lace);
  });
  const grid = document.getElementById('grade');
  const detail = document.createElement('dialog');
  detail.className = 'detalhe-loja';
  detail.setAttribute('aria-label','Detalhes da roupinha');
  document.body.append(detail);
  let activeCard = null;
  function fitHanger(card){
    const img=card.querySelector('.foto img:not(.metal-real)');
    if(!img?.complete||!img.naturalWidth)return;
    const metrics=window.BIBILICA_HOOKS?.[img.getAttribute('src')];if(!metrics)return;
    const photo=card.querySelector('.foto');const width=parseFloat(getComputedStyle(img).width);
    const scale=Math.min(width/img.naturalWidth,photo.clientHeight/img.naturalHeight);
    const factor=card.classList.contains('em-destaque')?1.1:1;
    const scene=card.closest('.cenario-boutique'),rack=card.closest('.arara-estrutura');
    if(!scene||!rack)return;
    const mirrored=img.getAttribute("src")==="assets/laterais/vestido-moranguinho-azul.png";
    const hookShift=(metrics.woodX-img.naturalWidth/2)*scale*(factor===1?.85:factor)*(mirrored?-1:1);
    const hookX=rack.offsetLeft+grid.offsetLeft+card.offsetLeft+photo.clientWidth/2+hookShift;
    const railY=(253.4-.04364*(hookX/scene.clientWidth*1672))/941*scene.clientHeight;
    const railLocal=railY-rack.offsetTop-grid.offsetTop;
    const stemLength=scene.clientWidth*.018;
    const offset=railLocal+stemLength-metrics.woodY*scale*factor;
    img.style.top=offset+'px';
    const cut=metrics.woodY*scale;
    img.style.maskImage='linear-gradient(to bottom,transparent 0 '+cut+'px,#000 '+(cut+.3)+'px)';
    const hook=card.querySelector('.gancho-direita');if(!hook)return;
    hook.classList.add('gancho-real');
    const x=photo.clientWidth/2+hookShift,y=railLocal,r=scene.clientWidth*.006;
    const bottom=railLocal+stemLength+1;
    const id='ouro-'+card.dataset.id;
    hook.innerHTML='<svg viewBox="0 0 '+photo.clientWidth+' '+photo.clientHeight+'" aria-hidden="true"><defs><linearGradient id="'+id+'"><stop stop-color="#956d2c"/><stop offset=".45" stop-color="#ffeab0"/><stop offset=".75" stop-color="#d2aa50"/><stop offset="1" stop-color="#94702e"/></linearGradient></defs><path d="M '+x+' '+bottom+' L '+x+' '+(y+r*1.5)+' C '+x+' '+(y+r)+' '+(x-r)+' '+(y+r*.7)+' '+(x-r)+' '+(y-r*.15)+' C '+(x-r)+' '+(y-r*1.9)+' '+(x+r*1.2)+' '+(y-r*1.9)+' '+(x+r*1.2)+' '+(y-r*.35)+'" fill="none" stroke="url(#'+id+')" stroke-width="'+Math.max(.9,scene.clientWidth*.0011)+'" stroke-linecap="round"/></svg>';
  }
  let catalogGrid=null;
  const hookSvg='<svg viewBox="0 0 48 64" aria-hidden="true"><defs><linearGradient id="metal-gancho" x1="0" x2="1"><stop stop-color="#8c6428"/><stop offset=".45" stop-color="#f9e7a8"/><stop offset=".7" stop-color="#d4ad53"/><stop offset="1" stop-color="#a5782d"/></linearGradient></defs><path d="M24 61V39C24 30 9 31 9 19C9 -1 39 -1 39 19V23" fill="none" stroke="url(#metal-gancho)" stroke-width="2.7" stroke-linecap="round"/></svg>';
  function buildCatalog(){
    if(!catalogGrid)return;
    catalogGrid.replaceChildren();
    grid.querySelectorAll('.peca').forEach(source=>{
      const card=source.cloneNode(true);card.hidden=false;card.classList.remove('tem-recorte','em-destaque','selecionada','pegando');
      card.querySelector('.etiqueta-arara')?.remove();card.querySelector('.gancho-direita')?.remove();
      card.querySelectorAll('img').forEach(img=>{if(img.dataset.original)img.src=img.dataset.original;});
      card.querySelectorAll('input').forEach(input=>{input.name='catalogo-'+input.name;});
      catalogGrid.append(card);
    });
    applyCatalogFilter();
  }
  let catalogType='todas';
  function applyCatalogFilter(){catalogGrid?.querySelectorAll('.peca').forEach(card=>{card.hidden=catalogType!=='todas'&&card.dataset.tipo!==catalogType;});}
  let hoverTimer,hoverCard,previewSuppressedUntil=0;
  function hidePreview(){hoverCard?.classList.remove('em-destaque');if(hoverCard){const img=hoverCard.querySelector('.foto img');if(img?.dataset.lateral)img.src=img.dataset.lateral;fitHanger(hoverCard);}hoverCard=null;}
  function showPreview(card){
    if(!card.classList.contains('tem-recorte')||detail.open||Date.now()<previewSuppressedUntil)return;
    clearTimeout(hoverTimer);if(hoverCard!==card)hidePreview();hoverCard=card;card.classList.add('em-destaque');
    const image=card.querySelector('.foto img');image.src=image.dataset.frente;
    fitHanger(card);
  }
  const scheduleHide=()=>{clearTimeout(hoverTimer);hoverTimer=setTimeout(hidePreview,160);};
  window.addEventListener('scroll',hidePreview,true);window.addEventListener('resize',hidePreview);
  window.addEventListener('resize',()=>grid.querySelectorAll('.tem-recorte').forEach(fitHanger));
  grid.addEventListener('transitionend',e=>{if(e.propertyName==='flex-grow')grid.querySelectorAll('.tem-recorte').forEach(fitHanger);});
  const cutoutNames = new Set(['vestido-moranguinho-azul','vestido-cerejinha','vestido-abelhinha','vestido-algodao-doce','vestido-botao-de-rosa','vestido-campinho-azul','vestido-campinho','vestido-cerejeira','vestido-guirlanda','vestido-jardinzinho','vestido-laco-de-fita','vestido-marujinha','vestido-nuvem','vestido-raminho']);
  function paintDetail() {
    if (!activeCard) return;
    const original = activeCard.querySelector('.info');
    detail.innerHTML = '<button type="button" class="fechar-detalhe" aria-label="Fechar detalhes">×</button><div class="detalhe-corpo"><div class="detalhe-imagens"></div><div class="detalhe-info"><p class="detalhe-marca">Bibilica · Boutique Infantil</p></div></div>';
    const images = [...activeCard.querySelectorAll('.foto img:not(.acabamento-cabide):not(.metal-real)')].map(img=>{const original=img.cloneNode();original.removeAttribute('style');original.src=img.dataset.original || img.src;return original;});
    const front=activeCard.querySelector('.foto img')?.dataset.frente;
    if(front) {const frontImage=new Image();frontImage.src=front;frontImage.alt=activeCard.querySelector('h3').textContent+' no cabide';images.unshift(frontImage);}
    const large = images[0].cloneNode(); large.loading = 'eager';
    detail.querySelector('.detalhe-imagens').append(large);
    if (images.length > 1) {
      const thumbs = document.createElement('div'); thumbs.className = 'detalhe-miniaturas';
      images.forEach((img,i) => { const b = document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Ver foto '+(i+1)); b.append(img.cloneNode()); b.onclick=()=>{large.src=img.src;large.alt=img.alt;}; thumbs.append(b); });
      detail.querySelector('.detalhe-imagens').append(thumbs);
    }
    const info = original.cloneNode(true);
    info.querySelectorAll('input').forEach(input => { input.name = 'detalhe-'+input.name; });
    detail.querySelector('.detalhe-info').append(info);
    detail.querySelector('.fechar-detalhe').onclick=()=>detail.close();
  }
  function openDetail(card) {hidePreview();activeCard?.classList.remove('selecionada');activeCard=card;card.classList.add('selecionada');paintDetail(); if(!detail.open) detail.showModal(); }
  detail.addEventListener('close',()=>{previewSuppressedUntil=Date.now()+300;activeCard?.classList.remove('selecionada');activeCard?.querySelector('.etiqueta-arara')?.focus({preventScroll:true});});
  detail.addEventListener('click',e=>{
    if(e.target===detail) { detail.close(); return; }
    const button=e.target.closest('[data-acao]');
    if(!button || !activeCard) return;
    activeCard.querySelector('[data-acao="'+button.dataset.acao+'"]').click();
    const focusAction=button.dataset.acao;
    paintDetail();
    detail.querySelector('[data-acao="'+focusAction+'"]')?.focus();
  });
  detail.addEventListener('change',e=>{
    if(!e.target.matches('input[type=radio]') || !activeCard) return;
    const input=[...activeCard.querySelectorAll('input[type=radio]')].find(i=>i.value===e.target.value);
    if(input) {input.checked=true; input.dispatchEvent(new Event('change',{bubbles:true}));paintDetail();[...detail.querySelectorAll('input')].find(i=>i.value===input.value)?.focus();}
  });
  function decorate() {
    grid.querySelectorAll('.peca').forEach(card=>{
      if(card.querySelector('.etiqueta-arara')) return;
      const first=card.querySelector('.foto img');
      const name=first.getAttribute('src').split('/').pop().replace(/\.(?:jpg|jpeg|png)$/,'');
      if(cutoutNames.has(name)) {
        first.dataset.original=first.getAttribute('src');first.dataset.frente='assets/recortes/'+name+'.png';first.dataset.lateral='assets/laterais/'+name+'.png';first.src=first.dataset.lateral;
        card.classList.add('tem-recorte');
        const hook=document.createElement('span');hook.className='gancho-direita gancho-real';card.querySelector('.foto').append(hook);
        first.addEventListener('load',()=>fitHanger(card));fitHanger(card);
        first.addEventListener('error',()=>{first.src=first.dataset.frente;},{once:true});
      }
      const label=document.createElement('button');label.type='button';label.className='etiqueta-arara';
      const title=document.createElement('b');title.textContent=card.querySelector('h3').textContent;
      const price=document.createElement('small');price.textContent=card.querySelector('.cartao-v').textContent+' · Ver detalhes';
      label.append(title,price);label.addEventListener('click',()=>openDetail(card));card.append(label);
      card.querySelector('.foto').setAttribute('title','Clique para ver tamanhos e detalhes, ou arraste até o carrinho');
      label.setAttribute('aria-label','Ver detalhes de '+title.textContent);
      card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showPreview(card);});
      card.addEventListener('pointerleave',scheduleHide);
      label.addEventListener('focus',()=>showPreview(card));label.addEventListener('blur',scheduleHide);
    });
    if(detail.open && activeCard && !activeCard.isConnected) {detail.close();activeCard=null;}
    if(hoverCard&&!hoverCard.isConnected)hidePreview();
    buildCatalog();
  }
  new MutationObserver(decorate).observe(grid,{childList:true}); decorate();
  document.querySelector('#filtro-tipo [data-v="Vestido"]')?.click();
  let suppressClickUntil=0;
  grid.addEventListener('click',e=>{if(e.target.closest('.foto') && !e.target.closest('button') && Date.now()>suppressClickUntil) openDetail(e.target.closest('.peca'));});
  const basket = document.createElement('button');
  basket.type = 'button';
  basket.className = 'carrinho-chao sacola-bibilica';
  basket.setAttribute('aria-label', 'Abrir sua sacola. Arraste uma roupa até aqui para adicionar.');
  basket.innerHTML = '<img class="carrinho-cenario" src="assets/cestas-banquinho.png" alt="Cesta de compras sobre um banquinho de madeira, com duas cestas de vime ao lado"><span id="loja-qtd" hidden aria-hidden="true">0</span>';
  const scene=document.createElement('div');scene.className='cenario-boutique';grid.before(scene);scene.append(grid,basket);
  const rack=document.createElement('div');rack.className='arara-estrutura';grid.before(rack);rack.append(grid);
  const railFront=document.createElement('img');railFront.className='haste-frente';railFront.src='assets/boutique-integrada.png';railFront.alt='';railFront.setAttribute('aria-hidden','true');scene.append(railFront);
  grid.querySelectorAll('.tem-recorte').forEach(fitHanger);
  const catalog=document.createElement('section');catalog.className='catalogo-completo';catalog.setAttribute('aria-labelledby','titulo-catalogo');
  catalog.innerHTML='<div class="titulo-secao"><span class="eyebrow">Toda a coleção</span><h2 id="titulo-catalogo">Encontre sua peça favorita</h2><p>Vestidos, conjuntos e rompers para descobrir com calma.</p></div><div class="filtro filtros-catalogo" role="group" aria-label="Tipo de peça"><button type="button" data-tipo="todas" aria-pressed="true">Todas as peças</button><button type="button" data-tipo="Vestido" aria-pressed="false">Vestidos</button><button type="button" data-tipo="Conjunto" aria-pressed="false">Conjuntos</button><button type="button" data-tipo="Romper" aria-pressed="false">Rompers</button></div><div class="grade-catalogo"></div>';
  scene.after(catalog);catalogGrid=catalog.querySelector('.grade-catalogo');buildCatalog();
  catalog.querySelector('.filtros-catalogo').addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;catalogType=button.dataset.tipo;catalog.querySelectorAll('.filtros-catalogo button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));applyCatalogFilter();});
  catalogGrid.addEventListener('change',e=>{if(!e.target.matches('input[type=radio]'))return;const card=e.target.closest('.peca');const source=[...grid.querySelectorAll('.peca')].find(c=>c.dataset.id===card.dataset.id);const input=[...source.querySelectorAll('input[type=radio]')].find(i=>i.value===e.target.value);if(input){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));card.querySelector('output').textContent=source.querySelector('output').textContent;card.querySelector('.estoque-msg').textContent=source.querySelector('.estoque-msg').textContent;}});
  catalogGrid.addEventListener('click',e=>{
    const card=e.target.closest('.peca');if(!card)return;
    const source=[...grid.querySelectorAll('.peca')].find(c=>c.dataset.id===card.dataset.id);const button=e.target.closest('button');
    if(!button){if(e.target.closest('.foto'))openDetail(source);return;}
    if(button.dataset.acao==='foto'){const gallery=card.querySelector('.galeria');const index=(Math.round(gallery.scrollLeft/gallery.clientWidth)+Number(button.dataset.dir)+gallery.children.length)%gallery.children.length;gallery.scrollTo({left:index*gallery.clientWidth,behavior:'smooth'});return;}
    if(!button.dataset.acao)return;
    source.querySelector('[data-acao="'+button.dataset.acao+'"]').click();
    card.querySelector('output').textContent=source.querySelector('output').textContent;card.querySelector('.aviso').textContent=source.querySelector('.aviso').textContent;card.querySelector('.aviso').className=source.querySelector('.aviso').className;
  });
  basket.addEventListener('click', () => document.getElementById('abrir-sacola').click());
  const note = document.createElement('p');
  note.className = 'instrucao-arara';
  note.textContent = 'Todos os vestidos no nosso cabideiro. Clique em uma peça para vê-la de frente e escolher o tamanho.';
  scene.before(note);
  const sceneIntro=scene.parentElement.querySelector(':scope > .titulo-secao');
  if(sceneIntro){sceneIntro.hidden=true;sceneIntro.after(scene);}
  const rackControls=scene.parentElement.querySelector(':scope > .filtros');
  if(rackControls)scene.after(note,rackControls,catalog);else scene.after(note,catalog);
  note.hidden=true;
  if(rackControls)rackControls.hidden=true;
  const areaTitle=document.getElementById('titulo-pecas');
  areaTitle.textContent='Um cabideiro de encantos';
  document.getElementById('filtro-tipo').addEventListener('click',e=>{
    hidePreview();
    const option=e.target.closest('button');if(!option)return;
    if(option.dataset.catalogo){document.querySelectorAll('#filtro-tipo button').forEach(b=>b.setAttribute('aria-pressed',String(!b.dataset.catalogo)));catalog.scrollIntoView({behavior:'smooth',block:'start'});return;}
    const other=option.dataset.v==='outras';scene.classList.toggle('modo-outras',other);
    areaTitle.textContent=other?'Mais encantos da Bibilica':'Um cabideiro de encantos';
    document.querySelector('.subtitulo-colecao').textContent=other?'Conjuntos e rompers para completar as descobertas.':'Aqui estão nossas peças favoritas: os vestidos.';
    note.textContent=other?'Mais encantos da Bibilica. Escolha as peças abaixo e combine tudo na mesma sacola.':'Todos os vestidos no nosso cabideiro. Clique em uma peça para vê-la de frente e escolher o tamanho.';
  });
  const live = document.createElement('div');
  live.className = 'loja-recado'; live.setAttribute('role','status'); live.hidden = true; document.body.append(live);
  let timer;
  function say(message) { live.textContent = message; live.hidden = false; clearTimeout(timer); timer = setTimeout(() => live.hidden = true, 4500); }
  const counter = document.getElementById('qtd-sacola');
  let lastItemCount=Number(counter.textContent)||0;
  const sync = () => {
    const count=Number(counter.textContent)||0;
    if(count>lastItemCount){basket.classList.remove('cesta-recebe');void basket.offsetWidth;basket.classList.add('cesta-recebe');}
    lastItemCount=count;
    document.getElementById('loja-qtd').textContent=counter.textContent;
    basket.setAttribute('aria-label','Abrir sua sacola, '+counter.textContent+' peças. Arraste uma roupa até aqui para adicionar.');
  };
  basket.addEventListener('animationend',e=>{if(e.animationName==='balanco-cesta')basket.classList.remove('cesta-recebe');});
  let basketSequence=0;
  async function bounceThenChoose(card){
    const sequence=++basketSequence;
    basket.classList.remove('cesta-recebe');void basket.offsetWidth;basket.classList.add('cesta-recebe');
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const animations=basket.querySelector('.carrinho-cenario').getAnimations();
      if(animations.length)await Promise.race([Promise.allSettled(animations.map(a=>a.finished)),new Promise(resolve=>setTimeout(resolve,850))]);
      else await new Promise(resolve=>setTimeout(resolve,750));
    }
    if(sequence!==basketSequence||detail.open)return;
    basket.classList.remove('cesta-recebe');
    const current=[...grid.querySelectorAll('.peca')].find(c=>c.dataset.id===card.dataset.id);
    if(!current)return;
    openDetail(current);
    detail.querySelector('input[type=radio]:not(:disabled)')?.focus({preventScroll:true});
  }
  async function dropIntoBasket(card,ghost){
    const sequence=++basketSequence;
    const bounds=basket.getBoundingClientRect();
    const x=bounds.left+bounds.width*.5,y=bounds.top+bounds.height*.35;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const animation=ghost.animate([
        {left:ghost.style.left,top:ghost.style.top,opacity:1,transform:'translate(-50%,-40%) scale(1) rotate(-6deg)'},
        {left:x+'px',top:y+'px',opacity:1,transform:'translate(-50%,-40%) scale(.38) rotate(4deg)',offset:.72},
        {left:x+'px',top:(y+12)+'px',opacity:0,transform:'translate(-50%,-40%) scale(.06) rotate(4deg)'}
      ],{duration:380,easing:'cubic-bezier(.3,.05,.45,1)',fill:'forwards'});
      await animation.finished.catch(()=>{});
    }
    ghost.remove();
    if(sequence===basketSequence&&!detail.open)bounceThenChoose(card);
  }
  new MutationObserver(sync).observe(counter, { childList:true, characterData:true, subtree:true }); sync();
  let drag = null;
  function cleanup() {
    if (!drag) return;
    drag.ghost?.remove(); drag.card.classList.remove('pegando'); basket.classList.remove('recebendo'); drag = null;
  }
  grid.addEventListener('pointerdown', e => {
    const photo = e.target.closest('.foto');
    if (!photo || e.target.closest('button') || e.button !== 0) return;
    const card = photo.closest('.peca');
    if (card.classList.contains('esgotada')) return;
    // Touch users keep native scrolling and can use the add button.
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    drag = { card, photo, x:e.clientX, y:e.clientY, pointer:e.pointerId, ghost:null };
    photo.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', e => {
    if (!drag || drag.pointer !== e.pointerId) return;
    if (!drag.ghost && Math.hypot(e.clientX-drag.x,e.clientY-drag.y) < 7) return;
    if (!drag.ghost) {
      hidePreview();
      const img = drag.photo.querySelector('img');
      drag.ghost = img.cloneNode();drag.ghost.removeAttribute('style');drag.ghost.removeAttribute('id'); drag.ghost.className = 'roupa-fantasma'; drag.ghost.alt = ''; document.body.append(drag.ghost); drag.card.classList.add('pegando');
    }
    drag.ghost.style.left = e.clientX+'px'; drag.ghost.style.top = e.clientY+'px';
    const r = basket.getBoundingClientRect();
    basket.classList.toggle('recebendo',e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom);
    if (e.clientY < 70) window.scrollBy(0,-12);
    else if (e.clientY > innerHeight-70 && !basket.classList.contains('recebendo')) window.scrollBy(0,12);
  });
  window.addEventListener('pointerup', e => {
    if (!drag || drag.pointer !== e.pointerId) return;
    const card = drag.card;
    if(drag.ghost) suppressClickUntil=Date.now()+400;
    if (drag.ghost && basket.classList.contains('recebendo')) {
      const ghost=drag.ghost;drag.ghost=null;
      dropIntoBasket(card,ghost);
    }
    cleanup();
  });
  window.addEventListener('pointercancel',cleanup);
  window.addEventListener('blur',cleanup);
  window.addEventListener('keydown',e => { if(e.key==='Escape'){basketSequence++;cleanup();} });
  grid.addEventListener('dragstart', e => { if(e.target.closest('.foto')) e.preventDefault(); });
})();
