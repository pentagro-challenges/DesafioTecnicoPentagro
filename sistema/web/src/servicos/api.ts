/**
 * Cliente HTTP único da aplicação. Toda chamada à API passa por aqui, de modo que
 * o tratamento de erro (RN-62 e RN-66) fique em um só lugar.
 */

const URL_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5199'

const MENSAGEM_DE_FALHA = 'Ocorreu um erro. Tente novamente.'

export interface Usuario {
  id: number
  nome: string
  login: string
  email: string
  criadoEm: string
  atualizadoEm: string | null
}

interface ErroDeCampo {
  campo: string
  mensagem: string
}

export interface DadosDeCadastro {
  nome: string
  login: string
  email: string
  senha: string
  confirmacaoSenha: string
}

interface Credenciais {
  login: string
  senha: string
}

export interface RespostaDeLogin {
  token: string
  expiraEm: string
  usuario: Usuario
}

/** Falha devolvida pela API ou pela rede, já no formato que as telas exibem. */
export class ErroDeApi extends Error {
  readonly status: number
  readonly erros: ErroDeCampo[]

  constructor(mensagem: string, status: number, erros: ErroDeCampo[]) {
    super(mensagem)
    this.name = 'ErroDeApi'
    this.status = status
    this.erros = erros
  }
}

interface Requisicao {
  metodo: 'GET' | 'POST'
  caminho: string
  /** Texto exibido quando a resposta de erro não traz corpo interpretável (RN-66). */
  mensagemDeFalha: string
  corpo?: unknown
  token?: string
}

export function cadastrarUsuario(dados: DadosDeCadastro): Promise<Usuario> {
  return enviar<Usuario>({
    metodo: 'POST',
    caminho: '/api/usuarios',
    corpo: dados,
    mensagemDeFalha: 'Não foi possível cadastrar o usuário. Tente novamente.',
  })
}

export function autenticar(credenciais: Credenciais): Promise<RespostaDeLogin> {
  return enviar<RespostaDeLogin>({
    metodo: 'POST',
    caminho: '/api/auth/login',
    corpo: credenciais,
    mensagemDeFalha: 'Não foi possível entrar no sistema. Tente novamente.',
  })
}

export function listarUsuarios(token: string): Promise<Usuario[]> {
  return enviar<Usuario[]>({
    metodo: 'GET',
    caminho: '/api/usuarios',
    token,
    mensagemDeFalha: 'Não foi possível carregar a lista de usuários.',
  })
}

async function enviar<T>(requisicao: Requisicao): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${URL_BASE}${requisicao.caminho}`, {
      method: requisicao.metodo,
      headers: montarCabecalhos(requisicao),
      body: requisicao.corpo === undefined ? undefined : JSON.stringify(requisicao.corpo),
    })
  } catch {
    throw new ErroDeApi(MENSAGEM_DE_FALHA, 0, [])
  }

  if (!resposta.ok) {
    throw new ErroDeApi(MENSAGEM_DE_FALHA, resposta.status, [])
  }

  try {
    return (await resposta.json()) as T
  } catch {
    throw new ErroDeApi(requisicao.mensagemDeFalha, resposta.status, [])
  }
}

function montarCabecalhos(requisicao: Requisicao): Record<string, string> {
  const cabecalhos: Record<string, string> = { Accept: 'application/json' }

  if (requisicao.corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json'
  }

  if (requisicao.token !== undefined) {
    cabecalhos.Authorization = `Bearer ${requisicao.token}`
  }

  return cabecalhos
}
