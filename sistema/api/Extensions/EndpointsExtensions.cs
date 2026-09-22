using Desafio.Api.Features.Auth;
using Desafio.Api.Features.Usuarios;

namespace Desafio.Api.Extensions;

public static class EndpointsExtensions
{
    /// <summary>Registra os endpoints de todos os casos de uso da API.</summary>
    public static void MapearEndpointsDaApi(this IEndpointRouteBuilder rotas)
    {
        rotas.MapearCadastrarUsuario();
        rotas.MapearListarUsuarios();
        rotas.MapearLogin();
    }
}
