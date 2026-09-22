namespace Desafio.Api.Domain.Entities;

/// <summary>
/// Usuário do sistema (seção 2 da especificação).
/// A senha nunca é guardada: o que se persiste é o hash em <see cref="SenhaHash"/>.
/// </summary>
public class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    /// <summary>Identificador de acesso, sempre gravado em minúsculas.</summary>
    public string Login { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string SenhaHash { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }

    public DateTime? AtualizadoEm { get; set; }
}
