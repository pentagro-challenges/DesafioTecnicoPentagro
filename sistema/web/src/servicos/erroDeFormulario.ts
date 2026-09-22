import { ErroDeApi } from './api'

/**
 * Distribui uma falha entre os campos do formulário e o bloco geral do topo,
 * preservando o texto devolvido pela API (RN-27 e RN-66).
 */

export const MENSAGEM_FALHA_INESPERADA = 'Ocorreu um erro inesperado. Tente novamente.'

interface ErrosDoFormulario {
  /** Mensagem de cada campo, indexada pelo nome do campo no JSON da requisição. */
  porCampo: Record<string, string>
  /** Mensagem exibida acima do formulário. */
  geral: string
}

export function separarErros(
  erro: unknown,
  camposDoFormulario: readonly string[],
): ErrosDoFormulario {
  if (!(erro instanceof ErroDeApi)) {
    return { porCampo: {}, geral: MENSAGEM_FALHA_INESPERADA }
  }

  const porCampo: Record<string, string> = {}
  const semCampoCorrespondente: string[] = []

  for (const item of erro.erros) {
    if (camposDoFormulario.includes(item.campo) && porCampo[item.campo] === undefined) {
      porCampo[item.campo] = item.mensagem
    } else {
      semCampoCorrespondente.push(item.mensagem)
    }
  }

  return { porCampo, geral: [erro.message, ...semCampoCorrespondente].join(' ') }
}
