import { createContext } from 'react'
import type { RespostaDeLogin, Usuario } from '../servicos/api'

/** Sessão do usuário autenticado, compartilhada com todas as telas. */

export const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Faça login novamente.'

export interface Sessao {
  token: string
  expiraEm: string
  usuario: Usuario
}

export interface Autenticacao {
  sessao: Sessao | null
  /** Verdadeiro quando a sessão foi descartada por expiração, e não por escolha da pessoa. */
  sessaoExpirada: boolean
  iniciarSessao: (resposta: RespostaDeLogin) => void
  encerrarSessao: (expirada?: boolean) => void
}

export const AutenticacaoContexto = createContext<Autenticacao | null>(null)
