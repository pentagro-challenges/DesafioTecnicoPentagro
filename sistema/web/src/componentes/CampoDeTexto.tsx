import './CampoDeTexto.css'

interface CampoDeTextoProps {
  /** Também usado como `name` do campo e como nome do campo no JSON da requisição. */
  id: string
  rotulo: string
  valor: string
  aoAlterar: (valor: string) => void
  tipo?: 'text' | 'email' | 'password'
  textoDeApoio?: string
  erro?: string
  autoComplete?: string
  focoInicial?: boolean
  desabilitado?: boolean
}

export function CampoDeTexto({
  id,
  rotulo,
  valor,
  aoAlterar,
  tipo = 'text',
  textoDeApoio,
  erro,
  autoComplete,
  focoInicial = false,
  desabilitado = false,
}: CampoDeTextoProps) {
  const idDoApoio = `${id}-apoio`
  const idDoErro = `${id}-erro`

  const descricoes: string[] = []
  if (textoDeApoio !== undefined) descricoes.push(idDoApoio)
  if (erro !== undefined) descricoes.push(idDoErro)

  return (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <input
        className={erro === undefined ? 'campo__entrada' : 'campo__entrada campo__entrada--invalida'}
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        autoComplete={autoComplete}
        autoFocus={focoInicial}
        disabled={desabilitado}
        aria-invalid={erro === undefined ? undefined : true}
        aria-describedby={descricoes.length === 0 ? undefined : descricoes.join(' ')}
      />
      {textoDeApoio !== undefined && (
        <p className="campo__apoio" id={idDoApoio}>
          {textoDeApoio}
        </p>
      )}
      {erro !== undefined && (
        <p className="campo__erro" id={idDoErro}>
          {erro}
        </p>
      )}
    </div>
  )
}
