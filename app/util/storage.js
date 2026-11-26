// =============================================================
// Web Storage (ID 14)
// O Web Storage só guarda texto. Por isso, para gravar objetos e
// arrays, convertemos com JSON.stringify e, para ler, JSON.parse.
// =============================================================

export const CHAVES = {
  visualizacao: 'md:visualizacao', // localStorage: "grade" | "lista"
  filtros: 'md:filtros', // localStorage: { busca, formato }
  rascunho: 'md:rascunho', // sessionStorage: campos do cadastro
};

// Escrita: transforma o valor em texto JSON e grava na chave
export function gravar(chave, valor, armazenamento = localStorage) {
  armazenamento.setItem(chave, JSON.stringify(valor));
}

// Leitura: busca o texto e o converte de volta; se não existir
// (getItem devolve null) ou estiver corrompido, usa o valor padrão
export function ler(chave, padrao = null, armazenamento = localStorage) {
  const texto = armazenamento.getItem(chave);
  if (texto === null) return padrao;
  try {
    return JSON.parse(texto);
  } catch {
    return padrao;
  }
}

export function remover(chave, armazenamento = localStorage) {
  armazenamento.removeItem(chave);
}
