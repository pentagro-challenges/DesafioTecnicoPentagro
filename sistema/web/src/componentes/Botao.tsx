import type { ReactNode } from 'react'
import './Botao.css'

interface BotaoProps {
  children: ReactNode
  tipo?: 'button' | 'submit'
  variante?: 'primario' | 'secundario'
  desabilitado?: boolean
  aoClicar?: () => void
}

export function Botao({
  children,
  tipo = 'button',
  variante = 'primario',
  desabilitado = false,
  aoClicar,
}: BotaoProps) {
  return (
    <button
      className={`botao botao--${variante}`}
      type={tipo}
      disabled={desabilitado}
      onClick={aoClicar}
    >
      {children}
    </button>
  )
}
