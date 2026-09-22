import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { RespostaDeLogin } from '../servicos/api'
import { AutenticacaoContexto, type Autenticacao, type Sessao } from './AutenticacaoContexto'

/**
 * Mantém a sessão no localStorage para que ela sobreviva à atualização da página
 * (RN-40). Nenhuma senha é guardada no navegador (RN-10).
 */

const CHAVE_DA_SESSAO = 'pentagro.sessao'

interface EstadoDaAutenticacao {
  sessao: Sessao | null
  sessaoExpirada: boolean
}

interface ProvedorDeAutenticacaoProps {
  children: ReactNode
}

export function ProvedorDeAutenticacao({ children }: ProvedorDeAutenticacaoProps) {
  const [estado, setEstado] = useState<EstadoDaAutenticacao>(restaurarSessaoArmazenada)

  const iniciarSessao = useCallback((resposta: RespostaDeLogin) => {
    const sessao: Sessao = {
      token: resposta.token,
      expiraEm: resposta.expiraEm,
      usuario: resposta.usuario,
    }

    localStorage.setItem(CHAVE_DA_SESSAO, JSON.stringify(sessao))
    setEstado({ sessao, sessaoExpirada: false })
  }, [])

  const encerrarSessao = useCallback((expirada = false) => {
    localStorage.removeItem(CHAVE_DA_SESSAO)
    setEstado({ sessao: null, sessaoExpirada: expirada })
  }, [])

  const valor = useMemo<Autenticacao>(
    () => ({ ...estado, iniciarSessao, encerrarSessao }),
    [estado, iniciarSessao, encerrarSessao],
  )

  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>
}

/** Lê a sessão guardada no navegador e descarta a que já passou do prazo (RN-40). */
function restaurarSessaoArmazenada(): EstadoDaAutenticacao {
  const conteudo = localStorage.getItem(CHAVE_DA_SESSAO)

  if (conteudo === null) {
    return { sessao: null, sessaoExpirada: false }
  }

  const sessao = interpretarSessao(conteudo)

  if (sessao !== null && new Date(sessao.expiraEm).getTime() > Date.now()) {
    return { sessao, sessaoExpirada: false }
  }

  localStorage.removeItem(CHAVE_DA_SESSAO)
  return { sessao: null, sessaoExpirada: sessao !== null }
}

function interpretarSessao(conteudo: string): Sessao | null {
  try {
    const valor = JSON.parse(conteudo) as Partial<Sessao>

    if (
      typeof valor.token !== 'string' ||
      typeof valor.expiraEm !== 'string' ||
      valor.usuario === undefined
    ) {
      return null
    }

    return { token: valor.token, expiraEm: valor.expiraEm, usuario: valor.usuario }
  } catch {
    return null
  }
}
