// =============================================================
// Modelo: Empréstimo (docs/architecture.md §2.2)
// =============================================================
import { hojeISO } from '../util/ui.js';

export class Emprestimo {
  constructor(dados = {}) {
    this.id = dados.id;
    this.discoId = dados.discoId ?? '';
    this.amigo = (dados.amigo ?? '').trim();
    this.telefone = dados.telefone ?? '';
    this.email = (dados.email ?? '').trim();
    this.dataEmprestimo = dados.dataEmprestimo ?? hojeISO();
    this.dataDevolucao = dados.dataDevolucao ?? '';
    this.devolvido = dados.devolvido ?? false;
    // Com _expand=disco, o JSON Server já devolve o disco junto
    if (dados.disco) this.disco = dados.disco;
  }

  static doFormulario(form) {
    return new Emprestimo(Object.fromEntries(new FormData(form)));
  }

  // "devolvido" | "atrasado" | "emprestado"
  get situacao() {
    if (this.devolvido) return 'devolvido';
    return this.dataDevolucao < hojeISO() ? 'atrasado' : 'emprestado';
  }

  // Remove campos calculados antes de enviar para a API
  paraApi() {
    const dados = { ...this };
    delete dados.disco;
    return dados;
  }
}
