# PRD — Minha Discoteca

> Product Requirements Document: o **quê** e o **porquê** do sistema.

## 1. Identificação

| Item | Valor |
| :--- | :--- |
| Aluno | João Pedro Marcondes |
| Projeto | Minha Discoteca |
| Disciplina | Desenvolvimento Web — Frameworks CSS e Bibliotecas JavaScript |
| Repositório | https://github.com/Joaomarcondespedro/minha_discoteca_web-framework_API-_CSS |

## 2. Descrição e problema

Quem coleciona mídia física (vinil, CD e fita K7) costuma guardar a coleção em planilhas soltas, no caderno ou só na memória. Com o tempo fica difícil responder perguntas simples: *"eu já tenho esse disco?"*, *"em que estado está a minha cópia?"*, *"para quem eu emprestei aquele LP?"*.

O **Minha Discoteca** é uma aplicação web responsiva que funciona como a estante virtual do colecionador. Ela permite:

- **cadastrar discos** buscando os dados reais (título, artista, ano, gênero e capa) na **iTunes Search API**, sem digitar tudo à mão;
- **ver o acervo** em grade de capas ou em lista, filtrando por formato e buscando por título/artista;
- **controlar empréstimos**: registrar para quem cada disco foi emprestado, o telefone de contato e a data de devolução.

## 3. Público-alvo

Colecionadores de discos de 18 a 60 anos, frequentadores de sebos e feiras de vinil, que usam o celular na hora do garimpo (para conferir se já têm um disco) e o computador em casa (para organizar a coleção com calma).

## 4. Atores do sistema

| Ator | Descrição |
| :--- | :--- |
| **Colecionador** | Usuário único da aplicação. Cadastra, consulta, edita e exclui discos e empréstimos. |

## 5. Histórias de usuário

| ID | História | Página |
| :--- | :--- | :--- |
| US01 | Como **colecionador**, quero **ver um resumo da minha coleção ao abrir o site** para **saber quantos discos tenho de cada formato e quais foram os últimos que entraram**. | Início |
| US02 | Como **colecionador**, quero **ver meu acervo em grade de capas ou em lista** para **navegar pela coleção do jeito que for mais confortável no celular ou no computador**. | Acervo |
| US03 | Como **colecionador**, quero **buscar e filtrar os discos por título, artista e formato** para **conferir rapidamente, no meio do garimpo, se já tenho um disco**. | Acervo |
| US04 | Como **colecionador**, quero **buscar um álbum no iTunes e preencher o cadastro com um clique** para **não precisar digitar título, artista, ano, gênero e capa**. | Cadastro |
| US05 | Como **colecionador**, quero **cadastrar o formato, o estado de conservação e as características da minha cópia** para **diferenciar o meu exemplar de outras prensagens**. | Cadastro |
| US06 | Como **colecionador**, quero **editar e excluir um disco** para **manter o acervo igual ao que está na minha estante**. | Acervo / Cadastro |
| US07 | Como **colecionador**, quero **registrar o empréstimo de um disco a um amigo, com telefone e data de devolução** para **lembrar com quem ele está e quando deve voltar**. | Empréstimos |
| US08 | Como **colecionador**, quero **marcar um empréstimo como devolvido** para **manter a lista só com os discos que ainda estão fora**. | Empréstimos |
| US09 | Como **colecionador**, quero que **o site lembre a minha preferência de visualização e o rascunho do cadastro** para **não perder o que eu estava fazendo ao recarregar a página**. | Acervo / Cadastro |

## 6. Regras de negócio

| ID | Regra |
| :--- | :--- |
| RN01 | Título, artista, formato e estado de conservação são obrigatórios no cadastro de disco. |
| RN02 | O ano de lançamento, quando informado, deve estar entre **1900** e o ano atual. |
| RN03 | O formato é um destes três: **Vinil**, **CD** ou **K7**. |
| RN04 | O código de catálogo, quando informado, segue o padrão de prensagem: 2 a 5 letras, espaço ou hífen opcional e 3 a 6 dígitos (ex.: `EMI-064 422`, `ODEON 3803`, `SMOFB3789`). |
| RN05 | O telefone do amigo no empréstimo segue o padrão brasileiro `(00) 00000-0000` ou `(00) 0000-0000`. |
| RN06 | A data prevista de devolução não pode ser anterior à data do empréstimo. |
| RN07 | Um disco que já está emprestado (e não devolvido) não pode ser emprestado de novo. |
| RN08 | Ao excluir um disco, o sistema pede confirmação. |
| RN09 | Se a API (JSON Server ou iTunes) estiver fora do ar, a página mostra uma mensagem clara e o restante continua funcionando. |

## 7. Escopo mínimo atendido

- 4 páginas HTML distintas e responsivas: **Início**, **Acervo**, **Cadastro** e **Empréstimos**.
- Componentes do Bootstrap 5.3 (navbar, offcanvas, cards, modal, toast, formulários, tabela, badges).
- Formulários com campos obrigatórios e validação (HTML nativo + Regex em JavaScript).
- Persistência local com Web Storage (preferência de visualização e rascunho do cadastro).
- Listagem de itens em cards e em tabela, com editar e excluir.
- Duas entidades no JSON Server (`discos` e `emprestimos`) + consumo da iTunes Search API.

## 8. Fora do escopo

- Login e múltiplos usuários.
- Tocar as músicas (o app organiza a coleção, não é um player).
- Backend real em produção: no GitHub Pages, o site conversa com o JSON Server rodando no computador do colecionador.
