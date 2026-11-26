// =============================================================
// Modelo: Disco (docs/architecture.md §2.1)
// =============================================================

export class Disco {
  constructor(dados = {}) {
    this.id = dados.id;
    this.titulo = (dados.titulo ?? '').trim();
    this.artista = (dados.artista ?? '').trim();
    this.ano = dados.ano ? Number(dados.ano) : null;
    this.genero = dados.genero ?? '';
    this.formato = dados.formato ?? '';
    this.conservacao = dados.conservacao ?? '';
    this.caracteristicas = dados.caracteristicas ?? [];
    this.catalogo = (dados.catalogo ?? '').trim().toUpperCase();
    this.capaUrl = dados.capaUrl ?? '';
    this.faixas = dados.faixas ? Number(dados.faixas) : null;
    this.itunesId = dados.itunesId ?? '';
    this.notas = (dados.notas ?? '').trim();
    this.criadoEm = dados.criadoEm ?? new Date().toISOString();
  }

  // Lê o formulário de cadastro. O FormData pega o valor do radio
  // marcado (formato), a opção do select (conservação, gênero) e,
  // com getAll, todos os checkboxes marcados (características) — ID 13
  static doFormulario(form) {
    const dados = new FormData(form);
    return new Disco({
      id: dados.get('id') || undefined,
      titulo: dados.get('titulo'),
      artista: dados.get('artista'),
      ano: dados.get('ano'),
      genero: dados.get('genero'),
      formato: dados.get('formato'),
      conservacao: dados.get('conservacao'),
      caracteristicas: dados.getAll('caracteristicas'),
      catalogo: dados.get('catalogo'),
      capaUrl: dados.get('capaUrl'),
      faixas: dados.get('faixas'),
      itunesId: dados.get('itunesId'),
      notas: dados.get('notas'),
    });
  }

  // Converte um resultado da iTunes Search API para o nosso modelo
  static doItunes(item) {
    return new Disco({
      titulo: item.collectionName,
      artista: item.artistName,
      ano: item.releaseDate ? item.releaseDate.slice(0, 4) : null,
      genero: item.primaryGenreName,
      capaUrl: item.artworkUrl100,
      faixas: item.trackCount,
      itunesId: String(item.collectionId),
    });
  }
}
