import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alerta } from '../componentes/Alerta'
import { Botao } from '../componentes/Botao'
import { CampoDeTexto } from '../componentes/CampoDeTexto'
import { MolduraDeAcesso } from '../componentes/MolduraDeAcesso'
import { cadastrarUsuario } from '../servicos/api'
import { separarErros } from '../servicos/erroDeFormulario'
import { normalizarLogin, validarCadastro } from '../validacao/usuario'

const CAMPOS_DO_FORMULARIO = ['nome', 'login', 'email', 'senha', 'confirmacaoSenha']

const MENSAGEM_CADASTRO_CONCLUIDO = 'Cadastro realizado com sucesso. Faça login para continuar.'

export function Cadastro() {
  const navegar = useNavigate()

  const [nome, setNome] = useState('')
  const [login, setLogin] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [errosPorCampo, setErrosPorCampo] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErroGeral(null)

    const erros = validarCadastro({ nome, login, email, senha, confirmacaoSenha })
    setErrosPorCampo(erros)
    if (Object.keys(erros).length > 0) {
      return
    }

    setEnviando(true)

    try {
      await cadastrarUsuario({
        nome: nome.trim(),
        login: normalizarLogin(login),
        email: email.trim(),
        senha,
        confirmacaoSenha,
      })
      navegar('/login', { replace: true, state: { mensagem: MENSAGEM_CADASTRO_CONCLUIDO } })
    } catch (erro) {
      const separados = separarErros(erro, CAMPOS_DO_FORMULARIO)
      setErrosPorCampo(separados.porCampo)
      setErroGeral(separados.geral)
      setSenha('')
      setConfirmacaoSenha('')
      setEnviando(false)
    }
  }

  return (
    <MolduraDeAcesso titulo="Criar conta" descricao="Preencha os dados abaixo para ter acesso.">
      {erroGeral !== null && <Alerta tipo="erro">{erroGeral}</Alerta>}

      <form className="acesso__formulario" onSubmit={cadastrar} noValidate>
        <CampoDeTexto
          id="nome"
          rotulo="Nome"
          valor={nome}
          aoAlterar={setNome}
          erro={errosPorCampo.nome}
          autoComplete="name"
          focoInicial
          desabilitado={enviando}
        />
        <CampoDeTexto
          id="login"
          rotulo="Login"
          valor={login}
          aoAlterar={setLogin}
          textoDeApoio="Somente letras, números, ponto, hífen e sublinhado."
          erro={errosPorCampo.login}
          autoComplete="username"
          desabilitado={enviando}
        />
        <CampoDeTexto
          id="email"
          rotulo="E-mail"
          tipo="email"
          valor={email}
          aoAlterar={setEmail}
          erro={errosPorCampo.email}
          autoComplete="email"
          desabilitado={enviando}
        />
        <CampoDeTexto
          id="senha"
          rotulo="Senha"
          tipo="password"
          valor={senha}
          aoAlterar={setSenha}
          textoDeApoio="Mínimo de 6 caracteres."
          erro={errosPorCampo.senha}
          autoComplete="new-password"
          desabilitado={enviando}
        />
        <CampoDeTexto
          id="confirmacaoSenha"
          rotulo="Confirmação de senha"
          tipo="password"
          valor={confirmacaoSenha}
          aoAlterar={setConfirmacaoSenha}
          erro={errosPorCampo.confirmacaoSenha}
          autoComplete="new-password"
          desabilitado={enviando}
        />
        <Botao tipo="submit" desabilitado={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </Botao>
      </form>

      <p className="acesso__rodape">
        <Link className="acesso__link" to="/login">
          Já tenho conta
        </Link>
      </p>
    </MolduraDeAcesso>
  )
}
