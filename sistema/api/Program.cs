using Desafio.Api.Extensions;
using Desafio.Api.Infrastructure.Erros;
using Desafio.Api.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AdicionarServicosDaApi(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();

// Respostas 4xx produzidas pelo próprio framework antes de chegar ao endpoint — rota inexistente
// ou Content-Type ausente — sairiam sem corpo. Aqui elas recebem o corpo padrão de erro, para que
// toda resposta de falha da API tenha o mesmo formato (RN-62).
app.UseStatusCodePages(async contexto => await contexto.HttpContext.Response.WriteAsJsonAsync(
    new RespostaDeErro(MensagensDeErro.RequisicaoInvalida, [])));

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapearEndpointsDaApi();

// Cria o banco e o usuário administrador na primeira execução (RN-12 e RNF-12).
await InicializadorDoBanco.PrepararAsync(app.Services);

app.Run();
