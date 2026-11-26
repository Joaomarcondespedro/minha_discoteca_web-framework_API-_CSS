// =============================================================
// API pública real — iTunes Search API (ID 24)
// Documentação: https://performance-partners.apple.com/search-api
// =============================================================
import { Disco } from '../model/Disco.js';

const ITUNES_URL = 'https://itunes.apple.com/search';

/**
 * Busca álbuns no iTunes e devolve uma lista de Disco.
 * Lança um Error com uma mensagem pronta para mostrar na tela.
 */
export async function buscarAlbuns(termo) {
  // URLSearchParams monta a query string e codifica espaços e acentos
  const parametros = new URLSearchParams({
    term: termo,
    entity: 'album',
    country: 'BR',
    limit: '12',
  });

  let resposta;
  try {
    resposta = await fetch(`${ITUNES_URL}?${parametros}`);
  } catch {
    // Sem internet, DNS fora ou requisição bloqueada
    throw new Error(
      'O iTunes não respondeu. Confira sua conexão e tente de novo, ou preencha a ficha à mão.',
    );
  }

  if (!resposta.ok) {
    throw new Error(`O iTunes respondeu com erro ${resposta.status}. Tente de novo em instantes.`);
  }

  const dados = await resposta.json();
  if (dados.resultCount === 0) {
    throw new Error(`Nenhum álbum encontrado para "${termo}". Tente outro nome ou o artista.`);
  }

  return dados.results.map((item) => Disco.doItunes(item));
}
