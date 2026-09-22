using System.Security.Claims;
using System.Text;
using Desafio.Api.Domain.Entities;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Desafio.Api.Infrastructure.Security;

/// <summary>Token emitido no login: o texto do JWT e o instante em que ele deixa de valer.</summary>
public sealed record TokenDeAcesso(string Token, DateTime ExpiraEm);

/// <summary>Emite o JWT assinado em HS256 com as declarações previstas na RN-34.</summary>
public sealed class GeradorDeToken(ConfiguracaoJwt configuracao)
{
    public TokenDeAcesso Gerar(Usuario usuario)
    {
        var emitidoEm = DateTime.UtcNow;
        var expiraEm = emitidoEm.AddMinutes(configuracao.ExpiracaoMinutos);

        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuracao.Secret));

        var descritor = new SecurityTokenDescriptor
        {
            Issuer = configuracao.Issuer,
            Audience = configuracao.Audience,
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim("nome", usuario.Nome),
                new Claim("login", usuario.Login)
            ]),
            IssuedAt = emitidoEm,
            NotBefore = emitidoEm,
            Expires = expiraEm,
            SigningCredentials = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256)
        };

        var token = new JsonWebTokenHandler().CreateToken(descritor);

        return new TokenDeAcesso(token, expiraEm);
    }
}
