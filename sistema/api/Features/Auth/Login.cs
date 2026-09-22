using Desafio.Api.Features.Usuarios;
using Desafio.Api.Infrastructure.Erros;
using Desafio.Api.Infrastructure.Persistence;
using Desafio.Api.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace Desafio.Api.Features.Auth;

public static class LoginEndpoint
{
    /// <summary>Registra <c>POST /api/auth/login</c>. Rota pública.</summary>
    public static void MapearLogin(this IEndpointRouteBuilder rotas)
    {
        rotas.MapPost("/api/auth/login", async (
                LoginRequest? requisicao,
                LoginHandler manipulador,
                CancellationToken cancelamento) =>
                await manipulador.ExecutarAsync(requisicao, cancelamento))
            .AllowAnonymous()
            .WithName("Login");
    }
}

/// <summary>Corpo de <c>POST /api/auth/login</c> (seção 4.5 da especificação).</summary>
public sealed record LoginRequest(string? Login, string? Senha);

/// <summary>Resposta do login bem-sucedido (RN-33): o token, o instante de expiração e o usuário.</summary>
public sealed record LoginResponse(string Token, DateTime ExpiraEm, UsuarioResponse Usuario);

/// <summary>UC-02 — Login e emissão do token.</summary>
public sealed class LoginHandler(
    DesafioDbContext contexto,
    ServicoDeSenha servicoDeSenha,
    GeradorDeToken geradorDeToken)
{
    public async Task<IResult> ExecutarAsync(LoginRequest? requisicao, CancellationToken cancelamento)
    {
        if (requisicao is null)
        {
            return Results.BadRequest(new RespostaDeErro(MensagensDeErro.RequisicaoInvalida, []));
        }

        var login = NormalizarLogin(requisicao.Login);
        var senha = requisicao.Senha ?? string.Empty;

        var erros = new List<ErroDeCampo>();

        if (login.Length == 0)
        {
            erros.Add(new ErroDeCampo("login", MensagensDeErro.LoginNaoInformado));
        }

        if (senha.Length == 0)
        {
            erros.Add(new ErroDeCampo("senha", MensagensDeErro.SenhaNaoInformada));
        }

        if (erros.Count > 0)
        {
            return Results.BadRequest(new RespostaDeErro(MensagensDeErro.RequisicaoInvalida, erros));
        }

        var usuario = await contexto.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(registro => registro.Login == login, cancelamento);

        // RN-32: login inexistente e senha incorreta produzem exatamente a mesma resposta.
        if (usuario is null || !servicoDeSenha.Conferir(senha, usuario.SenhaHash))
        {
            return Results.Json(
                new RespostaDeErro(MensagensDeErro.CredenciaisInvalidas, []),
                statusCode: StatusCodes.Status401Unauthorized);
        }

        var tokenDeAcesso = geradorDeToken.Gerar(usuario);

        return Results.Ok(new LoginResponse(
            tokenDeAcesso.Token,
            tokenDeAcesso.ExpiraEm,
            UsuarioResponse.De(usuario)));
    }

    private static string NormalizarLogin(string? login) =>
        (login ?? string.Empty).Trim().ToLowerInvariant();

    /// <summary>Prepara o nome do usuário para exibição no cabeçalho.</summary>
    private static string FormatarNomeParaExibicao(string nome) =>
        string.IsNullOrWhiteSpace(nome) ? "Usuário" : nome.Trim();
}
