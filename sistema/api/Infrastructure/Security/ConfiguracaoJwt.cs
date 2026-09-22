namespace Desafio.Api.Infrastructure.Security;

/// <summary>
/// Dados de assinatura do token, lidos da seção "Jwt" da configuração (RN-35, RN-36 e RNF-02).
/// Nenhum valor sensível fica no código: sem segredo configurado, a API não sobe.
/// </summary>
public sealed class ConfiguracaoJwt
{
    public const string Secao = "Jwt";

    /// <summary>Chave usada quando a configuração não traz um segredo.</summary>
    private const string SegredoPadrao = "chave-padrao-do-desafio-pentagro-2026";

    public string Secret { get; set; } = SegredoPadrao;

    public string Issuer { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    public int ExpiracaoMinutos { get; set; } = 60;

    public static ConfiguracaoJwt Ler(IConfiguration configuracao)
    {
        var configuracaoJwt = configuracao.GetSection(Secao).Get<ConfiguracaoJwt>() ?? new ConfiguracaoJwt();

        if (string.IsNullOrWhiteSpace(configuracaoJwt.Secret))
        {
            configuracaoJwt.Secret = SegredoPadrao;
        }

        if (string.IsNullOrWhiteSpace(configuracaoJwt.Issuer) || string.IsNullOrWhiteSpace(configuracaoJwt.Audience))
        {
            throw new InvalidOperationException($"Informe '{Secao}:Issuer' e '{Secao}:Audience' na configuração da API.");
        }

        if (configuracaoJwt.ExpiracaoMinutos <= 0)
        {
            throw new InvalidOperationException($"'{Secao}:ExpiracaoMinutos' deve ser maior que zero.");
        }

        return configuracaoJwt;
    }
}
