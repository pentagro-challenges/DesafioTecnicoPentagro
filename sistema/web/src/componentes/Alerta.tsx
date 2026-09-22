import type { ReactNode } from 'react'
import './Alerta.css'

interface AlertaProps {
  tipo: 'erro' | 'informacao'
  children: ReactNode
}

export function Alerta({ tipo, children }: AlertaProps) {
  return (
    <div className={`alerta alerta--${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
