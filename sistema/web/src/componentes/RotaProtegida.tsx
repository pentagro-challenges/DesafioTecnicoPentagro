import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { MENSAGEM_SESSAO_EXPIRADA } from '../contexto/AutenticacaoContexto'
import { useAutenticacao } from '../contexto/useAutenticacao'

interface RotaProtegidaProps {
  children: ReactNode
}

/** Só exibe a tela quando há sessão ativa; caso contrário leva ao login (RN-41 e RN-42). */
export function RotaProtegida({ children }: RotaProtegidaProps) {
  const { sessao, sessaoExpirada } = useAutenticacao()

  if (sessao === null) {
    return (
      <Navigate
        to="/login"
        replace
        state={sessaoExpirada ? { mensagem: MENSAGEM_SESSAO_EXPIRADA } : undefined}
      />
    )
  }

  return <>{children}</>
}
