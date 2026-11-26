// =============================================================
// Acervo: listagem vinda do JSON Server, filtros, grade/lista,
// ficha no modal e exclusão
// =============================================================
import { listarDiscos, excluirDisco, MSG_SEM_API } from '../../service/api.js';
import { CHAVES, gravar, ler } from '../../util/storage.js';
import { cardDisco, alerta, escapar, urlCapa, srcsetCapa } from '../../util/ui.js';

const estante = document.getElementById('estante');
const contagem = document.getElementById('contagemDiscos');
const campoBusca = document.getElementById('filtroBusca');
const campoFormato = document.getElementById('filtroFormato');
const modalEl = document.getElementById('modalDisco');

let discos = [];
let discoAberto = null;

// ---------- Preferências guardadas no localStorage (ID 14) ----------
function aplicarVisualizacao(modo) {
  estante.classList.toggle('estante--lista', modo === 'lista');
  document.getElementById(modo === 'lista' ? 'verLista' : 'verGrade').checked = true;
}

const filtrosSalvos = ler(CHAVES.filtros, { busca: '', formato: '' });
campoBusca.value = filtrosSalvos.busca;
campoFormato.value = filtrosSalvos.formato;
aplicarVisualizacao(ler(CHAVES.visualizacao, 'grade'));

// ---------- Renderização ----------
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function renderizar() {
  const busca = normalizar(campoBusca.value.trim());
  const formato = campoFormato.value;
  const filtrados = discos.filter(
    (d) =>
      (!formato || d.formato === formato) &&
      (!busca || normalizar(`${d.titulo} ${d.artista}`).includes(busca)),
  );

  contagem.textContent = `${filtrados.length} de ${discos.length} discos`;

  if (!discos.length) {
    estante.innerHTML = `
      <div class="col-12 estado-vazio">
        <span class="logo-selo d-block" aria-hidden="true"></span>
        <p class="h3">Sua estante está vazia</p>
        <p>Cadastre o primeiro disco buscando a capa no iTunes.</p>
        <a class="btn btn-primary" href="../cadastro/">Cadastrar disco</a>
      </div>`;
    return;
  }
  if (!filtrados.length) {
    estante.innerHTML = alerta(
      'Nenhum disco combina com a busca. Limpe o filtro ou tente outro nome.',
      'warning',
    );
    return;
  }

  estante.innerHTML = filtrados.map((d) => cardDisco(d)).join('');
  // jQuery (ID 20): os cards novos entram com um fade suave
  $('#estante > div').hide().fadeIn(250);
}

async function carregar() {
  try {
    discos = await listarDiscos();
    renderizar();
  } catch (erro) {
    console.error(erro);
    contagem.textContent = '';
    estante.innerHTML = alerta(MSG_SEM_API);
  }
}

// ---------- Filtros ----------
function salvarFiltros() {
  gravar(CHAVES.filtros, { busca: campoBusca.value.trim(), formato: campoFormato.value });
  renderizar();
}
campoBusca.addEventListener('input', salvarFiltros);
campoFormato.addEventListener('change', salvarFiltros);
document.getElementById('formFiltros').addEventListener('submit', (e) => e.preventDefault());

document.querySelectorAll('input[name="visualizacao"]').forEach((radio) =>
  radio.addEventListener('change', () => {
    gravar(CHAVES.visualizacao, radio.value);
    aplicarVisualizacao(radio.value);
  }),
);

// ---------- Ficha no modal ----------
// O Bootstrap dispara show.bs.modal; relatedTarget é o link clicado
modalEl.addEventListener('show.bs.modal', (evento) => {
  const id = evento.relatedTarget?.dataset.id;
  discoAberto = discos.find((d) => d.id === id);
  if (!discoAberto) return;
  const d = discoAberto;

  const capa = document.getElementById('fichaCapa');
  capa.src = urlCapa(d.capaUrl, 600);
  capa.srcset = srcsetCapa(d.capaUrl);
  capa.sizes = '18rem';
  capa.alt = `Capa do álbum ${d.titulo}`;
  document.getElementById('modalDiscoTitulo').textContent = d.titulo;
  document.getElementById('fichaArtista').textContent = d.artista;
  document.getElementById('fichaNotas').textContent = d.notas || '';

  const linhas = [
    ['Ano', d.ano],
    ['Gênero', d.genero],
    ['Formato', d.formato],
    ['Conservação', d.conservacao],
    ['Catálogo', d.catalogo],
    ['Faixas', d.faixas],
    ['Exemplar', d.caracteristicas?.join(', ')],
  ].filter(([, valor]) => valor);
  document.getElementById('fichaDados').innerHTML = linhas
    .map(
      ([rotulo, valor]) =>
        `<dt class="col-5">${rotulo}</dt><dd class="col-7">${escapar(valor)}</dd>`,
    )
    .join('');

  document.getElementById('btnEditar').href = `../cadastro/?id=${encodeURIComponent(d.id)}`;
});

document.getElementById('btnExcluir').addEventListener('click', async () => {
  if (!discoAberto) return;
  // RN08: confirmação antes de excluir
  const ok = window.confirm(
    `Excluir "${discoAberto.titulo}" do acervo? Essa ação não pode ser desfeita.`,
  );
  if (!ok) return;
  try {
    await excluirDisco(discoAberto.id);
    discos = discos.filter((d) => d.id !== discoAberto.id);
    bootstrap.Modal.getInstance(modalEl).hide();
    renderizar();
  } catch (erro) {
    console.error(erro);
    window.alert('Não foi possível excluir agora. Confira se o JSON Server está rodando.');
  }
});

carregar();
