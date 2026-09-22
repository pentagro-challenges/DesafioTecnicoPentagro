import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alerta } from '../componentes/Alerta'
import { Botao } from '../componentes/Botao'
import { CampoDeTexto } from '../componentes/CampoDeTexto'
import { MolduraDeAcesso } from '../componentes/MolduraDeAcesso'
import { useAutenticacao } from '../contexto/useAutenticacao'
import { autenticar } from '../servicos/api'
import { separarErros } from '../servicos/erroDeFormulario'
import { MENSAGENS } from '../validacao/usuario'

const CAMPOS_DO_FORMULARIO = ['login', 'senha']

/** Mensagem trazida pela tela anterior: cadastro concluído ou sessão expirada. */
interface EstadoDeNavegacao {
  mensagem?: string
}

export function Login() {
  const navegar = useNavigate()
  const localizacao = useLocation()
  const { iniciarSessao } = useAutenticacao()

  const estadoRecebido = localizacao.state as EstadoDeNavegacao | null

  const [aviso, setAviso] = useState<string | null>(estadoRecebido?.mensagem ?? null)
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [errosPorCampo, setErrosPorCampo] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setAviso(null)
    setErroGeral(null)

    const erros: Record<string, string> = {}
    if (login.trim() === '') erros.login = MENSAGENS.loginObrigatorio
    if (senha === '') erros.senha = MENSAGENS.senhaObrigatoria

    setErrosPorCampo(erros)
    if (Object.keys(erros).length > 0) {
      return
    }

    setEnviando(true)

    try {
      const resposta = await autenticar({ login: login.trim(), senha })
      iniciarSessao(resposta)
      navegar('/usuarios', { replace: true })
    } catch (erro) {
      const separados = separarErros(erro, CAMPOS_DO_FORMULARIO)
      setErrosPorCampo(separados.porCampo)
      setErroGeral(separados.geral)
      setSenha('')
      setEnviando(false)
    }
  }

  return (
    <MolduraDeAcesso titulo="Entrar no sistema" descricao="Informe suas credenciais para continuar.">
      {aviso !== null && <Alerta tipo="informacao">{aviso}</Alerta>}
      {erroGeral !== null && <Alerta tipo="erro">{erroGeral}</Alerta>}

      <form className="acesso__formulario" onSubmit={entrar} noValidate>
        <CampoDeTexto
          id="login"
          rotulo="Login"
          valor={login}
          aoAlterar={setLogin}
          erro={errosPorCampo.login}
          autoComplete="username"
          focoInicial
          desabilitado={enviando}
        />
        <CampoDeTexto
          id="senha"
          rotulo="Senha"
          tipo="password"
          valor={senha}
          aoAlterar={setSenha}
          erro={errosPorCampo.senha}
          autoComplete="current-password"
          desabilitado={enviando}
        />
        <Botao tipo="submit" desabilitado={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </Botao>
      </form>

      <p className="acesso__rodape">
        Ainda não tem acesso?
        <Link className="acesso__link" to="/cadastro">
          Criar conta
        </Link>
      </p>
    </MolduraDeAcesso>
  )
}
