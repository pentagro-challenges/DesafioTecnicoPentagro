namespace Desafio.Api.Infrastructure.Erros;

/// <summary>
/// Corpo único de erro da API (seção 8 da especificação): toda resposta 4xx ou 5xx usa este formato.
/// <c>Erros</c> vem como lista vazia quando a falha não é de validação de campo.
/// </summary>
public sealed record RespostaDeErro(string Mensagem, IReadOnlyList<ErroDeCampo> Erros);

/// <summary>Violação de uma regra de validação, associada ao campo do JSON que a causou.</summary>
public sealed record ErroDeCampo(string Campo, string Mensagem);
