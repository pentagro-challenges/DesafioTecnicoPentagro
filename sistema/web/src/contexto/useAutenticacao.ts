import { useContext } from 'react'
import { AutenticacaoContexto, type Autenticacao, type Sessao } from './AutenticacaoContexto'

export function useAutenticacao(): Autenticacao {
  const contexto = useContext(AutenticacaoContexto)

  if (contexto === null) {
    throw new Error('useAutenticacao precisa ser usado dentro de ProvedorDeAutenticacao.')
  }

  return contexto
}

/** Sessão das telas autenticadas, que só são exibidas dentro de RotaProtegida (RN-42). */
export function useSessaoAtual(): Sessao {
  const { sessao } = useAutenticacao()

  if (sessao === null) {
    throw new Error('Esta tela exige uma sessão ativa e precisa estar dentro de RotaProtegida.')
  }

  return sessao
}
