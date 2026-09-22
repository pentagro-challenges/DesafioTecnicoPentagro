using Desafio.Api.Domain.Entities;
using Desafio.Api.Infrastructure.Erros;
using Desafio.Api.Infrastructure.Persistence;
using Desafio.Api.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace Desafio.Api.Features.Usuarios;

public static class CadastrarUsuarioEndpoint
{
    /// <summary>Registra <c>POST /api/usuarios</c>. Rota pública: cadastrar-se não exige token (RN-23).</summary>
    public static void MapearCadastrarUsuario(this IEndpointRouteBuilder rotas)
    {
        rotas.MapPost("/api/usuarios", async (
                CadastrarUsuarioRequest? requisicao,
                CadastrarUsuarioHandler manipulador,
                CancellationToken cancelamento) =>
                await manipulador.ExecutarAsync(requisicao, cancelamento))
            .AllowAnonymous()
            .WithName("CadastrarUsuario");
    }
}

/// <summary>Corpo de <c>POST /api/usuarios</c> (seção 3.5 da especificação).</summary>
public sealed record CadastrarUsuarioRequest(
    string? Nome,
    string? Login,
    string? Email,
    string? Senha,
    string? ConfirmacaoSenha);

/// <summary>UC-01 — Cadastro de usuário.</summary>
public sealed class CadastrarUsuarioHandler(DesafioDbContext contexto, ServicoDeSenha servicoDeSenha)
{
    public async Task<IResult> ExecutarAsync(CadastrarUsuarioRequest? requisicao, CancellationToken cancelamento)
    {
        if (requisicao is null)
        {
            return Results.BadRequest(new RespostaDeErro(MensagensDeErro.RequisicaoInvalida, []));
        }

        var nome = ValidadorDeUsuario.NormalizarTexto(requisicao.Nome);
        var login = ValidadorDeUsuario.NormalizarLogin(requisicao.Login);
        var email = ValidadorDeUsuario.NormalizarTexto(requisicao.Email);
        var senha = requisicao.Senha ?? string.Empty;
        var confirmacaoSenha = requisicao.ConfirmacaoSenha ?? string.Empty;

        var erros = new List<ErroDeCampo>();
        ValidadorDeUsuario.ValidarNome(nome, erros);
        ValidadorDeUsuario.ValidarLogin(login, erros);
        ValidadorDeUsuario.ValidarEmail(email, erros);
        ValidadorDeUsuario.ValidarSenha(senha, confirmacaoSenha, erros);

        if (erros.Count > 0)
        {
            return Results.BadRequest(new RespostaDeErro(MensagensDeErro.CadastroRecusado, erros));
        }

        var novoUsuario = new Usuario
        {
            Nome = nome,
            Login = login,
            Email = email,
            SenhaHash = servicoDeSenha.GerarHash(senha),
            CriadoEm = DateTime.UtcNow
        };

        contexto.Usuarios.Add(novoUsuario);
        await contexto.SaveChangesAsync(cancelamento);

        return Results.Created($"/api/usuarios/{novoUsuario.Id}", UsuarioResponse.De(novoUsuario));
    }
}
