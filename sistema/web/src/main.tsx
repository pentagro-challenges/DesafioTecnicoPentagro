import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './estilos/variaveis.css'
import './estilos/reset.css'

const raiz = document.getElementById('root')

if (raiz === null) {
  throw new Error('Elemento raiz da aplicação não encontrado no documento.')
}

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
