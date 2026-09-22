import { useEffect, useState } from 'react'
import logoPentagro from '../assets/pentagro-logo.png'
import { Alerta } from '../componentes/Alerta'
import { Botao } from '../componentes/Botao'
import { useAutenticacao, useSessaoAtual } from '../contexto/useAutenticacao'
import { ErroDeApi, listarUsuarios, type Usuario } from '../servicos/api'
import { MENSAGEM_FALHA_INESPERADA } from '../servicos/erroDeFormulario'
import { formatarDataHora } from '../utilitarios/data'
import './ListaUsuarios.css'

export function ListaUsuarios() {
  const { encerrarSessao } = useAutenticacao()
  const sessao = useSessaoAtual()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  /** Cada incremento refaz a requisição da listagem. */
  const [tentativas, setTentativas] = useState(0)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const lista = await listarUsuarios(sessao.token)
        if (ativo) setUsuarios(lista)
      } catch (falha) {
        if (falha instanceof ErroDeApi && falha.status === 401) {
          encerrarSessao(true)
          return
        }

        if (ativo) {
          setErro(falha instanceof ErroDeApi ? falha.message : MENSAGEM_FALHA_INESPERADA)
        }
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    void carregar()

    return () => {
      ativo = false
    }
  }, [sessao.token, encerrarSessao, tentativas])

  /** Refaz a requisição da listagem, a pedido do botão "Tentar novamente" (RN-50). */
  function tentarNovamente() {
    setCarregando(true)
    setErro(null)
    setTentativas((valor) => valor + 1)
  }

  function conteudo() {
    if (carregando) {
      return <p className="usuarios__estado">Carregando usuários...</p>
    }

    if (erro !== null) {
      return (
        <div className="usuarios__falha">
          <Alerta tipo="erro">{erro}</Alerta>
          <Botao aoClicar={tentarNovamente}>Tentar novamente</Botao>
        </div>
      )
    }

    if (usuarios.length === 0) {
      return <p className="usuarios__estado">Nenhum usuário cadastrado.</p>
    }

    return (
      <div className="usuarios__rolagem">
        <table className="usuarios__tabela">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Login</th>
              <th scope="col">E-mail</th>
              <th scope="col">Cadastrado em</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.login}</td>
                <td>{usuario.email}</td>
                <td>{formatarDataHora(usuario.criadoEm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="usuarios">
      <header className="usuarios__cabecalho">
        <div className="usuarios__marca">
          <img className="usuarios__logo" src={logoPentagro} alt="Pentagro" />
          <h1 className="usuarios__titulo">Usuários</h1>
        </div>
        <div className="usuarios__sessao">
          <span className="usuarios__autenticado">{sessao.usuario.nome}</span>
          <Botao variante="secundario" aoClicar={() => encerrarSessao()}>
            Sair
          </Botao>
        </div>
      </header>

      <main className="usuarios__conteudo">{conteudo()}</main>
    </div>
  )
}
