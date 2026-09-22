import type { ReactNode } from 'react'
import logoPentagro from '../assets/pentagro-logo.png'
import './MolduraDeAcesso.css'

interface MolduraDeAcessoProps {
  titulo: string
  descricao: string
  children: ReactNode
}

/** Moldura comum das telas públicas de login e de cadastro. */
export function MolduraDeAcesso({ titulo, descricao, children }: MolduraDeAcessoProps) {
  return (
    <main className="acesso">
      <section className="acesso__conteudo">
        <header className="acesso__cabecalho">
          <img className="acesso__marca" src={logoPentagro} alt="Pentagro" />
          <h1 className="acesso__titulo">{titulo}</h1>
          <p className="acesso__descricao">{descricao}</p>
        </header>
        {children}
      </section>
    </main>
  )
}
