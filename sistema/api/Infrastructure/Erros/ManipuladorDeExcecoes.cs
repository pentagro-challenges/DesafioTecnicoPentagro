using Microsoft.AspNetCore.Diagnostics;

namespace Desafio.Api.Infrastructure.Erros;

/// <summary>
/// Converte qualquer falha não tratada no corpo de erro padrão (RN-62 a RN-64).
/// O detalhe técnico fica no log do servidor; o cliente recebe apenas uma mensagem legível.
/// </summary>
public sealed class ManipuladorDeExcecoes(ILogger<ManipuladorDeExcecoes> registrador) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext contexto,
        Exception excecao,
        CancellationToken cancelamento)
    {
        if (excecao is BadHttpRequestException)
        {
            registrador.LogWarning(excecao, "Requisição malformada em {Caminho}.", contexto.Request.Path);

            contexto.Response.StatusCode = StatusCodes.Status400BadRequest;
            await contexto.Response.WriteAsJsonAsync(
                new RespostaDeErro(MensagensDeErro.RequisicaoInvalida, []),
                cancelamento);

            return true;
        }

        registrador.LogError(excecao, "Falha inesperada em {Caminho}.", contexto.Request.Path);

        contexto.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await contexto.Response.WriteAsJsonAsync(
            new RespostaDeErro(MensagensDeErro.ErroInesperado, []),
            cancelamento);

        return true;
    }
}
