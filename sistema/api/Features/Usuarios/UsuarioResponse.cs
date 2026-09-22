using Desafio.Api.Domain.Entities;

namespace Desafio.Api.Features.Usuarios;

/// <summary>
/// Representação pública do usuário (RN-11): é a forma usada por todos os endpoints que devolvem
/// um usuário. Nenhum dado de senha aparece aqui, sob nenhum nome.
/// </summary>
public sealed record UsuarioResponse(
    int Id,
    string Nome,
    string Login,
    string Email,
    DateTime CriadoEm,
    DateTime? AtualizadoEm)
{
    public static UsuarioResponse De(Usuario usuario) => new(
        usuario.Id,
        usuario.Nome,
        usuario.Login,
        usuario.Email,
        usuario.CriadoEm,
        usuario.AtualizadoEm);
}
