using System.Text;
using Desafio.Api.Features.Auth;
using Desafio.Api.Features.Usuarios;
using Desafio.Api.Infrastructure.Erros;
using Desafio.Api.Infrastructure.Persistence;
using Desafio.Api.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Desafio.Api.Extensions;

public static class ServicosExtensions
{
    /// <summary>Origem do servidor de desenvolvimento da aplicação web (RNF-04).</summary>
    private const string OrigemDaAplicacaoWeb = "http://localhost:5173";

    public static IServiceCollection AdicionarServicosDaApi(
        this IServiceCollection servicos,
        IConfiguration configuracao)
    {
        var conexao = configuracao.GetConnectionString("Desafio")
            ?? throw new InvalidOperationException("Informe a cadeia de conexão 'Desafio' na configuração da API.");

        var configuracaoJwt = ConfiguracaoJwt.Ler(configuracao);

        servicos.AddDbContext<DesafioDbContext>(opcoes => opcoes.UseSqlite(conexao));

        servicos.AddSingleton(configuracaoJwt);
        servicos.AddSingleton<ServicoDeSenha>();
        servicos.AddSingleton<GeradorDeToken>();

        servicos.AddScoped<CadastrarUsuarioHandler>();
        servicos.AddScoped<ListarUsuariosHandler>();
        servicos.AddScoped<LoginHandler>();

        // O UseExceptionHandler exige um serviço de detalhamento registrado. Quem responde é sempre
        // o ManipuladorDeExcecoes, no formato de erro da RN-62.
        servicos.AddExceptionHandler<ManipuladorDeExcecoes>();
        servicos.AddProblemDetails();

        // Corpo ausente ou malformado vira exceção, tratada em ManipuladorDeExcecoes,
        // para que também esse erro saia no formato único da RN-62.
        servicos.Configure<RouteHandlerOptions>(opcoes => opcoes.ThrowOnBadRequest = true);

        servicos.AdicionarAutenticacaoJwt(configuracaoJwt);
        servicos.AdicionarCors();

        servicos.AddOpenApi();

        return servicos;
    }

    private static void AdicionarAutenticacaoJwt(this IServiceCollection servicos, ConfiguracaoJwt configuracaoJwt)
    {
        servicos
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opcoes =>
            {
                // RN-39: assinatura, emissor, audiência e expiração são conferidos no servidor,
                // em toda requisição protegida.
                opcoes.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuracaoJwt.Secret)),
                    ValidateIssuer = true,
                    ValidIssuer = configuracaoJwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = configuracaoJwt.Audience,
                    ValidateLifetime = false,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };

                // Token ausente, inválido ou expirado responde no formato único de erro da API.
                opcoes.Events = new JwtBearerEvents
                {
                    OnChallenge = async contexto =>
                    {
                        contexto.HandleResponse();
                        contexto.Response.StatusCode = StatusCodes.Status401Unauthorized;

                        await contexto.Response.WriteAsJsonAsync(
                            new RespostaDeErro(MensagensDeErro.SessaoInvalidaOuExpirada, []));
                    }
                };
            });

        servicos.AddAuthorization();
    }

    private static void AdicionarCors(this IServiceCollection servicos)
    {
        servicos.AddCors(opcoes => opcoes.AddDefaultPolicy(politica => politica
            .WithOrigins(OrigemDaAplicacaoWeb)
            .WithMethods("GET", "POST", "PUT")
            .WithHeaders("Authorization", "Content-Type")));
    }
}
