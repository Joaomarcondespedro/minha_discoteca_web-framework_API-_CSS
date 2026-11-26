// =============================================================
// Página inicial: resumo da coleção, últimos discos e empréstimos
// =============================================================
import { listarDiscos, listarEmprestimos, MSG_SEM_API } from './service/api.js';
import { Emprestimo } from './model/Emprestimo.js';
import { cardDisco, alerta, escapar, formatarData } from './util/ui.js';

const resumo = document.getElementById('resumoColecao');
const ultimos = document.getElementById('ultimosDiscos');
const listaEmprestados = document.getElementById('listaEmprestados');

// "1 fita" / "3 fitas"
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

function mostrarResumo(discos) {
  if (!discos.length) {
    resumo.textContent = 'Sua estante ainda está vazia. Que tal cadastrar o primeiro disco?';
    return;
  }
  const total = (formato) => discos.filter((d) => d.formato === formato).length;
  // Monta "6 vinis, 3 CDs e 1 fita", pulando os formatos sem nenhum disco
  const partes = [
    [total('Vinil'), 'vinil', 'vinis'],
    [total('CD'), 'CD', 'CDs'],
    [total('K7'), 'fita', 'fitas'],
  ]
    .filter(([n]) => n > 0)
    .map(([n, um, varios]) => plural(n, um, varios));
  const lista =
    partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes.at(-1)}` : partes[0];
  resumo.innerHTML = `Você tem <strong>${plural(discos.length, 'disco', 'discos')}</strong>: ${lista}.`;
}

function mostrarUltimos(discos) {
  ultimos.innerHTML = discos
    .slice(0, 4)
    .map((d) => cardDisco(d, { comModal: false, linkAcervo: 'pages/acervo/' }))
    .join('');
}

function mostrarEmprestados(emprestimos) {
  const abertos = emprestimos.map((e) => new Emprestimo(e)).filter((e) => !e.devolvido);
  if (!abertos.length) {
    listaEmprestados.innerHTML =
      '<li class="list-group-item">Nenhum disco emprestado no momento.</li>';
    return;
  }
  listaEmprestados.innerHTML = abertos
    .map(
      (e) => `
      <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
        <span><strong>${escapar(e.disco?.titulo ?? 'Disco removido')}</strong> está com ${escapar(e.amigo)}</span>
        <span class="badge ${e.situacao === 'atrasado' ? 'text-bg-danger' : 'text-bg-light'}">devolve em ${formatarData(e.dataDevolucao)}</span>
      </li>`,
    )
    .join('');
}

async function iniciar() {
  try {
    // As duas requisições saem juntas; Promise.all espera as duas terminarem
    const [discos, emprestimos] = await Promise.all([listarDiscos(), listarEmprestimos()]);
    mostrarResumo(discos);
    mostrarUltimos(discos);
    mostrarEmprestados(emprestimos);
  } catch (erro) {
    console.error(erro);
    resumo.textContent = 'Não foi possível carregar a coleção agora.';
    ultimos.innerHTML = alerta(MSG_SEM_API);
    listaEmprestados.innerHTML = '<li class="list-group-item">Empréstimos indisponíveis.</li>';
  }
}

iniciar();
