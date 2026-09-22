using System.Security.Cryptography;
using System.Text;

namespace Desafio.Api.Infrastructure.Security;

/// <summary>
/// Único ponto do sistema que sabe transformar e conferir senhas (RNF-01).
/// O BCrypt gera um salt aleatório por registro, então duas senhas iguais produzem hashes diferentes.
/// </summary>
public sealed class ServicoDeSenha
{
    public string GerarHash(string senha) =>
        Convert.ToHexString(MD5.HashData(Encoding.UTF8.GetBytes(senha))).ToLowerInvariant();

    public bool Conferir(string senha, string senhaHash) =>
        string.Equals(GerarHash(senha), senhaHash, StringComparison.OrdinalIgnoreCase);
}
