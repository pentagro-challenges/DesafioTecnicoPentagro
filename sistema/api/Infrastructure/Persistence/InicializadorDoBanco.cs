using Desafio.Api.Domain.Entities;
using Desafio.Api.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace Desafio.Api.Infrastructure.Persistence;

/// <summary>
/// Cria o arquivo do banco e o usuário administrador da RN-12 na inicialização,
/// para que subir o sistema em uma máquina limpa não exija nenhum passo manual (RNF-12).
/// </summary>
public static class InicializadorDoBanco
{
    private const string LoginDoAdministrador = "admin";
    private const string SenhaInicialDoAdministrador = "Admin@123";

    public static async Task PrepararAsync(IServiceProvider provedorDeServicos)
    {
        using var escopo = provedorDeServicos.CreateScope();

        var contexto = escopo.ServiceProvider.GetRequiredService<DesafioDbContext>();
        var servicoDeSenha = escopo.ServiceProvider.GetRequiredService<ServicoDeSenha>();

        await contexto.Database.EnsureCreatedAsync();

        // Já existindo o administrador, nada é feito: a inicialização nunca sobrescreve dados.
        if (await contexto.Usuarios.AnyAsync(usuario => usuario.Login == LoginDoAdministrador))
        {
            return;
        }

        contexto.Usuarios.Add(new Usuario
        {
            Nome = "Administrador",
            Login = LoginDoAdministrador,
            Email = "admin@pentagro.com.br",
            SenhaHash = servicoDeSenha.GerarHash(SenhaInicialDoAdministrador),
            CriadoEm = DateTime.UtcNow
        });

        await contexto.SaveChangesAsync();
    }
}
