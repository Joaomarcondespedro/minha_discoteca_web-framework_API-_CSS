// =============================================================
// Expressões regulares das regras de negócio (ID 12)
// ^ e $ obrigam o valor INTEIRO a combinar com o padrão.
// =============================================================

export const REGEX = {
  // RN05 — (42) 99876-1234 ou (42) 3623-4455
  telefone: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  // nome@dominio.com — algo antes do @, domínio e extensão com 2+ letras
  email: /^[\w.+-]+@[\w-]+\.[\w.-]{2,}$/,
  // RN04 — 2 a 8 letras, hífen ou espaço opcional, 3 a 6 dígitos e um grupo extra opcional
  catalogo: /^[A-Z]{2,8}[- ]?\d{3,6}( ?\d{1,4})?$/i,
  // Nome e sobrenome: duas ou mais palavras com letras (aceita acentos)
  nomeCompleto: /^[A-Za-zÀ-ÿ']{2,}( [A-Za-zÀ-ÿ']{2,})+$/,
};

/**
 * Confere um campo com uma expressão regular e liga a mensagem
 * de erro à validação nativa do navegador (setCustomValidity).
 * Campo vazio e opcional é válido: quem cobra o vazio é o "required".
 */
export function validarComRegex(campo, regex, mensagem) {
  const valor = campo.value.trim();
  const valido = valor === '' || regex.test(valor);
  campo.setCustomValidity(valido ? '' : mensagem);
  return valido;
}
