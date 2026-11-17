/* Favoritos: a cliente marca peças com um coração.
   Fica salvo só no aparelho dela (localStorage). Aparece no catálogo,
   nos detalhes da peça e num filtro "Favoritas". */
(() => {
  const CHAVE = 'bibilica-favoritos';
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem(CHAVE) || '[]')); } catch (e) {}
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify([...favoritos])); } catch (e) {} };

  const coracao = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/></svg>';
  const nomeDe = id => document.querySelector(`#grade .peca[data-id="${id}"] h3`)?.textContent || 'esta peça';

  function pintar(botao) {
    const id = botao.dataset.favorito, ativo = favoritos.has(id);
    botao.setAttribute('aria-pressed', String(ativo));
    botao.setAttribute('aria-label', (ativo ? 'Remover dos favoritos: ' : 'Adicionar aos favoritos: ') + nomeDe(id));
    botao.title = ativo ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    const texto = botao.querySelector('.fav-texto');
    const novo = ativo ? 'Nos seus favoritos' : 'Favoritar';
    if (texto && texto.textContent !== novo) texto.textContent = novo;
  }

  function criarBotao(id, comTexto) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = comTexto ? 'favorito favorito-texto' : 'favorito';
    b.dataset.favorito = id;
    b.innerHTML = coracao + (comTexto ? '<span class="fav-texto"></span>' : '');
    pintar(b);
    return b;
  }

  let filtroBotao = null;
  function atualizarFiltro() {
    const catalogo = document.querySelector('.grade-catalogo');
    const grupo = document.querySelector('.filtros-catalogo');
    if (grupo && !filtroBotao?.isConnected) {
      filtroBotao = document.createElement('button');
      filtroBotao.type = 'button';
      filtroBotao.className = 'filtro-favoritas';
      filtroBotao.dataset.tipo = 'favoritas';
      filtroBotao.setAttribute('aria-pressed', 'false');
      grupo.append(filtroBotao);
    }
    if (filtroBotao) {
      const html = coracao + `Favoritas <span class="fav-qtd">${favoritos.size}</span>`;
      if (filtroBotao.dataset.html !== html) { filtroBotao.innerHTML = html; filtroBotao.dataset.html = html; }
    }
    if (!catalogo) return;
    const ativo = filtroBotao?.getAttribute('aria-pressed') === 'true';
    let visiveis = 0;
    if (ativo) catalogo.querySelectorAll('.peca').forEach(card => { const h = !favoritos.has(card.dataset.id); if (card.hidden !== h) card.hidden = h; if (!h) visiveis++; });
    let vazio = document.querySelector('.favoritos-vazio');
    if (!vazio) {
      vazio = document.createElement('p');
      vazio.className = 'favoritos-vazio';
      vazio.innerHTML = 'Você ainda não marcou nenhuma peça.<br>Toque no coração das roupinhas que mais gostar para encontrá-las aqui.';
      catalogo.after(vazio);
    }
    vazio.hidden = !(ativo && visiveis === 0);
  }

  function decorar() {
    document.querySelectorAll('.grade-catalogo .peca').forEach(card => {
      const foto = card.querySelector('.foto');
      if (foto && !foto.querySelector('.favorito')) foto.append(criarBotao(card.dataset.id, false));
    });
    const info = document.querySelector('.detalhe-loja .detalhe-info');
    const ativa = document.querySelector('#grade .peca.selecionada');
    if (info && ativa && !info.querySelector('.favorito')) {
      info.querySelector('.detalhe-marca')?.after(criarBotao(ativa.dataset.id, true));
    }
    document.querySelectorAll('[data-favorito]').forEach(pintar);
    atualizarFiltro();
  }

  document.addEventListener('click', e => {
    const botao = e.target.closest('[data-favorito]');
    if (botao) {
      e.preventDefault(); e.stopPropagation();
      const id = botao.dataset.favorito;
      favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
      salvar();
      document.querySelectorAll(`[data-favorito="${id}"]`).forEach(b => { pintar(b); if (favoritos.has(id)) { b.classList.remove('pulsar'); void b.offsetWidth; b.classList.add('pulsar'); } });
      atualizarFiltro();
      return;
    }
    if (e.target.closest('.filtros-catalogo button')) setTimeout(atualizarFiltro);
  }, true);

  let agendado = false;
  new MutationObserver(() => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => { agendado = false; decorar(); });
  }).observe(document.body, { childList: true, subtree: true });
  decorar();
})();
