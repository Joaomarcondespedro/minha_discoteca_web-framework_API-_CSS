// =============================================================
// Empréstimos: formulário com máscara e Regex, tabela vinda do
// JSON Server (_expand=disco) e "marcar como devolvido"
// =============================================================
import {
  listarDiscos,
  listarEmprestimos,
  criarEmprestimo,
  marcarDevolvido,
  MSG_SEM_API,
} from '../../service/api.js';
import { Emprestimo } from '../../model/Emprestimo.js';
import { REGEX, validarComRegex } from '../../util/validacao.js';
import { escapar, formatarData, hojeISO, mostrarToast } from '../../util/ui.js';

const form = document.getElementById('formEmprestimo');
const selectDisco = document.getElementById('discoId');
const campoAmigo = document.getElementById('amigo');
const campoTelefone = document.getElementById('telefone');
const campoEmail = document.getElementById('email');
const campoSaida = document.getElementById('dataEmprestimo');
const campoVolta = document.getElementById('dataDevolucao');
const corpo = document.getElementById('corpoTabela');

let discos = [];
let emprestimos = [];

// ---------- Plugin jQuery Mask (ID 21) ----------
// Celular tem 9 dígitos e fixo tem 8. A máscara muda conforme o
// tamanho: com 11 dígitos usa (00) 00000-0000, senão (00) 0000-00009.
const mascaraTelefone = (valor) =>
  valor.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
$('#telefone').mask(mascaraTelefone, {
  onKeyPress: (valor, _e, campo, opcoes) => campo.mask(mascaraTelefone(valor), opcoes),
});

// ---------- Datas ----------
campoSaida.value = hojeISO();
campoVolta.min = campoSaida.value;
campoSaida.addEventListener('change', () => {
  campoVolta.min = campoSaida.value;
  validarDatas();
});

// RN06: devolução não pode ser antes do empréstimo
function validarDatas() {
  const erro = campoVolta.value && campoVolta.value < campoSaida.value;
  campoVolta.setCustomValidity(erro ? 'A devolução não pode ser antes do empréstimo.' : '');
}
campoVolta.addEventListener('change', validarDatas);

// ---------- Regex (ID 12) ----------
const validarNome = () =>
  validarComRegex(campoAmigo, REGEX.nomeCompleto, 'Informe nome e sobrenome.');
const validarTelefone = () =>
  validarComRegex(campoTelefone, REGEX.telefone, 'Use o formato (00) 00000-0000.');
const validarEmail = () =>
  validarComRegex(campoEmail, REGEX.email, 'Confira o e-mail, como nome@email.com.');
campoAmigo.addEventListener('input', validarNome);
campoTelefone.addEventListener('input', validarTelefone);
campoEmail.addEventListener('input', validarEmail);

// ---------- Select de discos (RN07: só os que estão na estante) ----------
function preencherSelect() {
  const fora = new Set(emprestimos.filter((e) => !e.devolvido).map((e) => e.discoId));
  const opcoes = discos
    .filter((d) => !fora.has(d.id))
    .sort((a, b) => a.titulo.localeCompare(b.titulo))
    .map((d) => `<option value="${d.id}">${escapar(d.titulo)} — ${escapar(d.artista)}</option>`);
  selectDisco.innerHTML = `<option value="">Escolha um disco do acervo…</option>${opcoes.join('')}`;
}

// ---------- Tabela ----------
const SITUACAO = {
  devolvido: '<span class="badge text-bg-success">Devolvido</span>',
  atrasado: '<span class="badge text-bg-danger">Atrasado</span>',
  emprestado: '<span class="badge text-bg-warning">Emprestado</span>',
};

function renderizarTabela() {
  const filtro = document.querySelector('input[name="filtroSituacao"]:checked').value;
  const lista = emprestimos.filter((e) =>
    filtro === 'todos' ? true : filtro === 'devolvidos' ? e.devolvido : !e.devolvido,
  );

  if (!lista.length) {
    corpo.innerHTML =
      '<tr><td colspan="5" class="text-center py-4">Nenhum empréstimo nesta lista.</td></tr>';
    return;
  }

  corpo.innerHTML = lista
    .map(
      (e) => `
      <tr class="${e.situacao === 'atrasado' ? 'atrasado' : ''}" data-id="${e.id}">
        <td><strong>${escapar(e.disco?.titulo ?? 'Disco removido')}</strong><br><span class="small text-body-secondary">${escapar(e.disco?.artista ?? '')}</span></td>
        <td>${escapar(e.amigo)}<br><span class="small text-body-secondary telefone">${escapar(e.telefone)}</span></td>
        <td>${formatarData(e.dataDevolucao)}</td>
        <td>${SITUACAO[e.situacao]}</td>
        <td class="text-end">${e.devolvido ? '' : '<button class="btn btn-sm btn-outline-success btn-devolver text-nowrap" type="button">Recebi de volta</button>'}</td>
      </tr>`,
    )
    .join('');
}

document
  .querySelectorAll('input[name="filtroSituacao"]')
  .forEach((r) => r.addEventListener('change', renderizarTabela));

// jQuery (ID 20): delegação de evento — o botão é criado depois,
// então o .on() escuta no tbody e reage aos cliques nos botões dele
$('#corpoTabela').on('click', '.btn-devolver', async function () {
  const $linha = $(this).closest('tr');
  const id = $linha.data('id').toString();
  try {
    await marcarDevolvido(id);
    emprestimos.find((e) => e.id === id).devolvido = true;
    $linha.fadeOut(300, () => {
      renderizarTabela();
      preencherSelect();
    });
    mostrarToast('toastEmprestimo', 'Disco recebido de volta.');
  } catch (erro) {
    console.error(erro);
    mostrarToast('toastEmprestimo', 'Não foi possível atualizar. Confira o JSON Server.', 'danger');
  }
});

// ---------- Envio do formulário ----------
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  validarNome();
  validarTelefone();
  validarEmail();
  validarDatas();
  form.classList.add('was-validated');
  if (!form.checkValidity()) {
    form.querySelector(':invalid')?.focus();
    return;
  }

  const novo = Emprestimo.doFormulario(form);
  try {
    const salvo = await criarEmprestimo(novo.paraApi());
    emprestimos.push(
      new Emprestimo({ ...salvo, disco: discos.find((d) => d.id === salvo.discoId) }),
    );
    mostrarToast('toastEmprestimo', `Empréstimo para ${novo.amigo} registrado.`);
    form.reset();
    form.classList.remove('was-validated');
    campoSaida.value = hojeISO();
    preencherSelect();
    renderizarTabela();
  } catch (erro) {
    console.error(erro);
    mostrarToast(
      'toastEmprestimo',
      'Não foi possível registrar. Confira se o JSON Server está rodando.',
      'danger',
    );
  }
});

// ---------- Início ----------
async function iniciar() {
  try {
    const [listaDiscos, listaEmprestimos] = await Promise.all([
      listarDiscos(),
      listarEmprestimos(),
    ]);
    discos = listaDiscos;
    emprestimos = listaEmprestimos.map((e) => new Emprestimo(e));
    preencherSelect();
    renderizarTabela();
  } catch (erro) {
    console.error(erro);
    corpo.innerHTML = `<tr><td colspan="5"><div class="alert alert-danger mb-0" role="alert">${MSG_SEM_API}</div></td></tr>`;
    selectDisco.innerHTML = '<option value="">Acervo indisponível</option>';
  }
}

iniciar();
