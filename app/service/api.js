// =============================================================
// Conversa com a API fake — JSON Server (IDs 22 e 23)
// Rode com: npm run api  (http://localhost:3000)
// =============================================================

export const API_URL = 'http://localhost:3000';

export const MSG_SEM_API =
  'Não foi possível falar com o servidor de dados. Confira se o JSON Server está rodando com <code>npm run api</code> e recarregue a página.';

/**
 * Faz a requisição e devolve o JSON da resposta.
 * - O fetch devolve uma Promise: o await espera a resposta sem travar a página.
 * - O fetch só falha (catch) quando não há conexão. Um 404 ou 500 chega
 *   como resposta normal, por isso conferimos response.ok.
 */
async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${caminho}`);
  }
  // DELETE devolve um objeto vazio; .json() transforma o texto em objeto
  return resposta.json();
}

// ---------- Discos ----------
export const listarDiscos = () => requisitar('/discos?_sort=criadoEm&_order=desc');

export const buscarDisco = (id) => requisitar(`/discos/${id}`);

export const criarDisco = (disco) =>
  requisitar('/discos', { method: 'POST', body: JSON.stringify(disco) });

export const atualizarDisco = (disco) =>
  requisitar(`/discos/${disco.id}`, { method: 'PUT', body: JSON.stringify(disco) });

export const excluirDisco = (id) => requisitar(`/discos/${id}`, { method: 'DELETE' });

// ---------- Empréstimos ----------
export const listarEmprestimos = () =>
  requisitar('/emprestimos?_expand=disco&_sort=dataDevolucao&_order=asc');

export const criarEmprestimo = (emprestimo) =>
  requisitar('/emprestimos', { method: 'POST', body: JSON.stringify(emprestimo) });

export const marcarDevolvido = (id) =>
  requisitar(`/emprestimos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ devolvido: true }),
  });
