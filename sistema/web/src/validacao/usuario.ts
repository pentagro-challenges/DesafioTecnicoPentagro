import type { DadosDeCadastro } from '../servicos/api'

/**
 * Regras de validação dos formulários, com os mesmos textos do catálogo de mensagens
 * da especificação (seção 8.3). A verificação aqui dá retorno imediato à pessoa e
 * não substitui a validação feita pela API.
 *
 * Cada função acrescenta ao mapa a violação que encontrar, indexada pelo nome do campo
 * no JSON da requisição, para que todas sejam exibidas juntas (RN-19).
 */

export const MENSAGENS = {
  nomeObrigatorio: 'Informe o nome.',
  nomeTamanho: 'O nome deve ter entre 3 e 120 caracteres.',
  loginObrigatorio: 'Informe o login.',
  loginTamanho: 'O login deve ter entre 3 e 40 caracteres.',
  loginFormato: 'O login pode conter apenas letras, números, ponto, hífen e sublinhado.',
  emailObrigatorio: 'Informe o e-mail.',
  emailTamanho: 'O e-mail deve ter no máximo 160 caracteres.',
  emailFormato: 'Informe um e-mail válido.',
  senhaObrigatoria: 'Informe a senha.',
  senhaTamanho: 'A senha deve ter entre 6 e 64 caracteres.',
  confirmacaoObrigatoria: 'Informe a confirmação de senha.',
  confirmacaoDiferente: 'A confirmação de senha não confere com a senha.',
}

/** Remove os espaços das extremidades e converte para minúsculas (RN-04 e RN-07). */
export function normalizarLogin(valor: string): string {
  return valor.trim().toLowerCase()
}

/** Nome obrigatório, de 3 a 120 caracteres (RN-13). */
function validarNome(nome: string, erros: Record<string, string>): void {
  if (nome === '') {
    erros.nome = MENSAGENS.nomeObrigatorio
  } else if (nome.length < 3 || nome.length > 120) {
    erros.nome = MENSAGENS.nomeTamanho
  }
}

/** Login obrigatório, de 3 a 40 caracteres e sem caractere fora do formato previsto (RN-14). */
function validarLogin(login: string, erros: Record<string, string>): void {
  if (login === '') {
    erros.login = MENSAGENS.loginObrigatorio
  } else if (login.length < 3 || login.length > 40) {
    erros.login = MENSAGENS.loginTamanho
  } else if (!/^[a-z0-9._-]{3,40}$/.test(login)) {
    erros.login = MENSAGENS.loginFormato
  }
}

/** E-mail obrigatório, de no máximo 160 caracteres e bem formado (RN-15 e RN-16). */
function validarEmail(email: string, erros: Record<string, string>): void {
  if (email === '') {
    erros.email = MENSAGENS.emailObrigatorio
  } else if (email.length > 160) {
    erros.email = MENSAGENS.emailTamanho
  }
}

/**
 * Senha de 6 a 64 caracteres e confirmação igual a ela (RN-17 e RN-18). A senha não sofre
 * trim — espaços fazem parte dela — e a comparação com a confirmação é literal, caractere
 * a caractere.
 */
function validarSenha(senha: string, confirmacao: string, erros: Record<string, string>): void {
  if (senha === '') {
    erros.senha = MENSAGENS.senhaObrigatoria
  } else if (senha.length < 6 || senha.length > 64) {
    erros.senha = MENSAGENS.senhaTamanho
  }

  if (confirmacao === '') {
    erros.confirmacaoSenha = MENSAGENS.confirmacaoObrigatoria
  } else if (confirmacao !== senha) {
    erros.confirmacaoSenha = MENSAGENS.confirmacaoDiferente
  }
}

/**
 * Avalia todos os campos do cadastro sobre os valores já normalizados (RN-04 e RN-07)
 * e devolve todas as violações juntas (RN-19).
 */
export function validarCadastro(dados: DadosDeCadastro): Record<string, string> {
  const erros: Record<string, string> = {}

  validarNome(dados.nome.trim(), erros)
  validarLogin(normalizarLogin(dados.login), erros)
  validarEmail(dados.email.trim(), erros)
  validarSenha(dados.senha, dados.confirmacaoSenha, erros)

  return erros
}
