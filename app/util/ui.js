// =============================================================
// Funções de apoio para montar a interface
// =============================================================

// Evita que um texto vindo da API seja interpretado como HTML
export function escapar(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// A URL da capa do iTunes termina em "100x100bb.jpg". Trocando esse
// final, pedimos outro tamanho e o formato WebP (ID 10).
const CAPA_PADRAO = new URL('../../assets/img/capa-hero-360.webp', import.meta.url).href;

export function urlCapa(capaUrl, tamanho) {
  if (!capaUrl) return CAPA_PADRAO;
  return capaUrl.replace(/\d+x\d+bb\.(jpg|png|webp)$/, `${tamanho}x${tamanho}bb.webp`);
}

export function srcsetCapa(capaUrl) {
  if (!capaUrl) return '';
  return [200, 400, 600].map((t) => `${urlCapa(capaUrl, t)} ${t}w`).join(', ');
}

// "2026-11-30" -> "30/11/2026"
export function formatarData(iso) {
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hojeISO() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

// Monta o card de um disco (o mesmo HTML da casca da Entrega 2)
export function cardDisco(disco, { comModal = true, linkAcervo = '' } = {}) {
  const link = comModal
    ? `href="#" data-bs-toggle="modal" data-bs-target="#modalDisco" data-id="${disco.id}"`
    : `href="${linkAcervo}"`;
  return `
    <div class="col-6 col-md-4 col-xl-3">
      <article class="card card-disco">
        <div class="capa-moldura">
          <img class="capa-img" src="${urlCapa(disco.capaUrl, 400)}"
            srcset="${srcsetCapa(disco.capaUrl)}"
            sizes="(min-width: 1200px) 18vw, (min-width: 768px) 30vw, 46vw"
            width="400" height="400" loading="lazy" alt="Capa do álbum ${escapar(disco.titulo)}">
        </div>
        <div class="card-body">
          <h3 class="card-title"><a class="stretched-link text-reset text-decoration-none" ${link}>${escapar(disco.titulo)}</a></h3>
          <p class="card-text mb-2">${escapar(disco.artista)}${disco.ano ? `, ${disco.ano}` : ''}</p>
          <span class="badge badge-formato">${escapar(disco.formato)}</span>
          <span class="badge badge-conservacao">${escapar(disco.conservacao)}</span>
        </div>
      </article>
    </div>`;
}

// Mensagem de erro/aviso padrão para quando a API não responde
export function alerta(mensagem, tipo = 'danger') {
  return `
    <div class="col-12">
      <div class="alert alert-${tipo} d-flex gap-2 align-items-start mb-0" role="alert">
        <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        <div>${mensagem}</div>
      </div>
    </div>`;
}

// Mostra o Toast do Bootstrap com uma mensagem
export function mostrarToast(id, mensagem, tipo = 'success') {
  const el = document.getElementById(id);
  el.className = `toast align-items-center text-bg-${tipo} border-0`;
  document.getElementById(`${id}Texto`).textContent = mensagem;
  bootstrap.Toast.getOrCreateInstance(el).show();
}
