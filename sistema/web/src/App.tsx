import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RotaProtegida } from './componentes/RotaProtegida'
import { ProvedorDeAutenticacao } from './contexto/ProvedorDeAutenticacao'
import { useAutenticacao } from './contexto/useAutenticacao'
import { Cadastro } from './paginas/Cadastro'
import { ListaUsuarios } from './paginas/ListaUsuarios'
import { Login } from './paginas/Login'

export default function App() {
  return (
    <BrowserRouter>
      <ProvedorDeAutenticacao>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/usuarios"
            element={
              <RotaProtegida>
                <ListaUsuarios />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProvedorDeAutenticacao>
    </BrowserRouter>
  )
}

/** A raiz leva à listagem quando há sessão ativa e ao login quando não há. */
function TelaInicial() {
  const { sessao } = useAutenticacao()

  return <Navigate to={sessao === null ? '/login' : '/usuarios'} replace />
}
