/** Formata uma data/hora ISO 8601 em UTC no fuso do navegador, como dd/MM/aaaa HH:mm (RN-02). */
export function formatarDataHora(valorIso: string): string {
  const data = new Date(valorIso)

  if (Number.isNaN(data.getTime())) {
    return valorIso
  }

  const dia = comDoisDigitos(data.getDate())
  const mes = comDoisDigitos(data.getMonth() + 1)
  const hora = comDoisDigitos(data.getHours())
  const minuto = comDoisDigitos(data.getMinutes())

  return `${dia}/${mes}/${data.getFullYear()} ${hora}:${minuto}`
}

function comDoisDigitos(valor: number): string {
  return String(valor).padStart(2, '0')
}

/** Formata uma data ISO 8601 como dd/MM/aaaa. */
export function formatarData(valorIso: string): string {
  const data = new Date(valorIso)

  if (Number.isNaN(data.getTime())) {
    return valorIso
  }

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')

  return `${dia}/${mes}/${data.getFullYear()}`
}
