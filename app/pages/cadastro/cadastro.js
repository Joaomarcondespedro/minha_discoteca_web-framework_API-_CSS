// =============================================================
// Cadastro: busca no iTunes, validação, rascunho e POST/PUT
// =============================================================
import { buscarAlbuns } from '../../service/itunes.js';
import { buscarDisco, criarDisco, atualizarDisco, MSG_SEM_API } from '../../service/api.js';
import { Disco } from '../../model/Disco.js';
import { REGEX, validarComRegex } from '../../util/validacao.js';
import { CHAVES, gravar, ler, remover } from '../../util/storage.js';
import { urlCapa, escapar, mostrarToast } from '../../util/ui.js';

const form = document.getElementById('formDisco');
const formBusca = document.getElementById('formBusca');
const termo = document.getElementById('termoBusca');
const statusBusca = document.getElementById('statusBusca');
const resultados = document.getElementById('resultadosBusca');
const capaPrevia = document.getElementById('capaPrevia');
const campoCatalogo = document.getElementById('catalogo');
const campoAno = document.getElementById('ano');

const CAPA_PADRAO = capaPrevia.src;
const ANO_ATUAL = new Date().getFullYear();
const idEdicao = new URLSearchParams(window.location.search).get('id');
let discoOriginal = null; // guardado na edição para manter a data de criação

// RN02: o limite do ano acompanha o ano atual
campoAno.max = ANO_ATUAL;
document.getElementById('anoErro').textContent = `Use um ano entre 1900 e ${ANO_ATUAL}.`;

// ---------- Preencher o formulário a partir de um Disco ----------
function preencher(disco) {
  for (const campo of [
    'id',
    'titulo',
    'artista',
    'ano',
    'genero',
    'faixas',
    'catalogo',
    'notas',
    'capaUrl',
    'itunesId',
  ]) {
    const el = form.elements[campo];
    if (!el || disco[campo] === undefined || disco[campo] === null) continue;
    // Gênero do iTunes que não está na lista vira "Outro"
    if (campo === 'genero' && ![...el.options].some((o) => o.value === disco.genero)) {
      el.value = disco.genero ? 'Outro' : '';
      continue;
    }
    el.value = disco[campo];
  }
  if (disco.formato)
    form.querySelector(`input[name="formato"][value="${disco.formato}"]`).checked = true;
  if (disco.conservacao) form.elements.conservacao.value = disco.conservacao;
  form.querySelectorAll('input[name="caracteristicas"]').forEach((cb) => {
    cb.checked = (disco.caracteristicas ?? []).includes(cb.value);
  });
  capaPrevia.src = disco.capaUrl ? urlCapa(disco.capaUrl, 400) : CAPA_PADRAO;
  atualizarContador();
}

// ---------- Busca na API pública (ID 24) ----------
function itemResultado(disco) {
  // Criação de elementos via JavaScript (manipulação do DOM)
  const li = document.createElement('li');
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'resultado-itunes';
  botao.innerHTML = `
    <img src="${urlCapa(disco.capaUrl, 200)}" alt="" width="56" height="56" loading="lazy">
    <span>
      <strong class="d-block">${escapar(disco.titulo)}</strong>
      <span class="small text-body-secondary">${escapar(disco.artista)}${disco.ano ? `, ${disco.ano}` : ''}</span>
    </span>`;
  botao.addEventListener('click', () => usarResultado(disco));
  li.append(botao);
  return li;
}

function usarResultado(disco) {
  // Mantém os dados do exemplar que o usuário já tinha escolhido
  const atual = Disco.doFormulario(form);
  preencher({
    ...disco,
    id: atual.id,
    formato: atual.formato,
    conservacao: atual.conservacao,
    caracteristicas: atual.caracteristicas,
    catalogo: atual.catalogo,
    notas: atual.notas,
  });
  salvarRascunho();
  // jQuery (ID 20): destaca os campos preenchidos pelo iTunes e rola até a ficha
  const $campos = $('#titulo, #artista, #ano, #genero, #faixas');
  $campos.addClass('campo-preenchido');
  setTimeout(() => $campos.removeClass('campo-preenchido'), 1200);
  $('html, body').animate({ scrollTop: $('#formDisco').offset().top - 80 }, 400);
  statusBusca.textContent = `Ficha preenchida com "${disco.titulo}". Agora escolha o formato e o estado do seu exemplar.`;
}

formBusca.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const texto = termo.value.trim();
  if (texto.length < 2) {
    termo.classList.add('is-invalid');
    statusBusca.textContent = 'Digite pelo menos 2 letras para buscar.';
    return;
  }
  termo.classList.remove('is-invalid');
  statusBusca.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Buscando no iTunes…';
  resultados.replaceChildren();

  try {
    const discos = await buscarAlbuns(texto);
    statusBusca.textContent = `${discos.length} álbuns encontrados. Clique em um para preencher a ficha.`;
    resultados.append(...discos.map(itemResultado));
  } catch (erro) {
    // A mensagem já vem pronta do service/itunes.js; o resto da página continua funcionando
    statusBusca.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-circle me-1" aria-hidden="true"></i>${escapar(erro.message)}</span>`;
  }
});

// ---------- Validações (IDs 11 e 12) ----------
function validarCatalogo() {
  return validarComRegex(
    campoCatalogo,
    REGEX.catalogo,
    'Use letras seguidas de números, como EMI 064 422.',
  );
}
campoCatalogo.addEventListener('input', validarCatalogo);

// Mensagens próprias para o ano no lugar do balão padrão do navegador
campoAno.addEventListener('input', () => {
  const v = campoAno.validity;
  if (v.rangeUnderflow || v.rangeOverflow || v.badInput) {
    campoAno.setCustomValidity(`Use um ano entre 1900 e ${ANO_ATUAL}.`);
  } else {
    campoAno.setCustomValidity('');
  }
});

// ---------- Rascunho no sessionStorage (ID 14) ----------
function salvarRascunho() {
  if (idEdicao) return; // edição não usa rascunho
  gravar(CHAVES.rascunho, Disco.doFormulario(form), sessionStorage);
}
form.addEventListener('input', salvarRascunho);
form.addEventListener('change', salvarRascunho);

// ---------- Contador de caracteres das notas (jQuery, ID 20) ----------
function atualizarContador() {
  const tamanho = $('#notas').val().length;
  $('#contadorNotas')
    .text(tamanho)
    .toggleClass('text-danger fw-bold', tamanho > 250);
}
$('#notas').on('input', atualizarContador);

// ---------- Envio ----------
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  validarCatalogo();
  form.classList.add('was-validated');

  // checkValidity confere required, min, max, maxlength, type e as mensagens do setCustomValidity
  if (!form.checkValidity()) {
    form.querySelector(':invalid')?.focus();
    return;
  }

  const disco = Disco.doFormulario(form);
  const botao = document.getElementById('btnSalvar');
  botao.disabled = true;

  try {
    if (disco.id) {
      disco.criadoEm = discoOriginal?.criadoEm ?? disco.criadoEm;
      await atualizarDisco(disco);
      mostrarToast('toastSalvo', `"${disco.titulo}" atualizado. Voltando ao acervo…`);
      setTimeout(() => (window.location.href = '../acervo/'), 1500);
    } else {
      await criarDisco(disco);
      mostrarToast('toastSalvo', `"${disco.titulo}" entrou no acervo.`);
      form.reset();
    }
  } catch (erro) {
    console.error(erro);
    mostrarToast(
      'toastSalvo',
      'Não foi possível salvar. Confira se o JSON Server está rodando.',
      'danger',
    );
  } finally {
    botao.disabled = false;
  }
});

form.addEventListener('reset', () => {
  remover(CHAVES.rascunho, sessionStorage);
  form.classList.remove('was-validated');
  campoCatalogo.setCustomValidity('');
  capaPrevia.src = CAPA_PADRAO;
  setTimeout(atualizarContador);
});

// ---------- Início: edição (?id=) ou rascunho ----------
async function iniciar() {
  if (idEdicao) {
    document.getElementById('tituloCadastro').textContent = 'Editar disco';
    document.title = 'Editar disco — Minha Discoteca';
    document.getElementById('btnSalvar').lastChild.textContent = 'Salvar alterações';
    try {
      discoOriginal = await buscarDisco(idEdicao);
      preencher(discoOriginal);
    } catch (erro) {
      console.error(erro);
      statusBusca.innerHTML = `<span class="text-danger">${MSG_SEM_API}</span>`;
    }
    return;
  }
  const rascunho = ler(CHAVES.rascunho, null, sessionStorage);
  if (rascunho) preencher(rascunho);
}

iniciar();
