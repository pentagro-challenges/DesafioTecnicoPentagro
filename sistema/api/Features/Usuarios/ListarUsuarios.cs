using Desafio.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Desafio.Api.Features.Usuarios;

public static class ListarUsuariosEndpoint
{
    /// <summary>Registra <c>GET /api/usuarios</c>. Rota protegida: exige token válido (RN-45).</summary>
    public static void MapearListarUsuarios(this IEndpointRouteBuilder rotas)
    {
        rotas.MapGet("/api/usuarios", async (
                ListarUsuariosHandler manipulador,
                CancellationToken cancelamento) =>
                await manipulador.ExecutarAsync(cancelamento))
            .RequireAuthorization()
            .WithName("ListarUsuarios");
    }
}

/// <summary>UC-03 — Listagem de usuários.</summary>
public sealed class ListarUsuariosHandler(DesafioDbContext contexto)
{
    public async Task<IResult> ExecutarAsync(CancellationToken cancelamento)
    {
        var usuarios = await contexto.Usuarios
            .AsNoTracking()
            .ToListAsync(cancelamento);

        // RN-47: ordem alfabética por nome sem diferenciar maiúsculas de minúsculas, com desempate
        // por login. A comparação é feita em memória porque o SQLite ordena texto byte a byte e
        // colocaria "Zeca" antes de "ana"; o volume esperado é de poucas centenas de registros.
        var usuariosOrdenados = usuarios
            .OrderBy(usuario => usuario.Nome, StringComparer.InvariantCultureIgnoreCase)
            .ThenBy(usuario => usuario.Login, StringComparer.Ordinal)
            .Select(UsuarioResponse.De)
            .ToList();

        return Results.Ok(usuariosOrdenados);
    }
}
