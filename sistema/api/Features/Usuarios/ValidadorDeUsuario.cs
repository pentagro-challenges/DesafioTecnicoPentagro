using System.Text.RegularExpressions;
using Desafio.Api.Infrastructure.Erros;

namespace Desafio.Api.Features.Usuarios;

/// <summary>
/// Normalização e validação dos dados do usuário, em um único lugar (RN-04, RN-07 e RN-13 a RN-18).
/// Cada método acrescenta à lista as violações que encontrar, para que todas sejam devolvidas
/// juntas em uma só resposta (RN-19).
/// </summary>
public static class ValidadorDeUsuario
{
    private const int TamanhoMinimoDoNome = 3;
    private const int TamanhoMaximoDoNome = 120;
    private const int TamanhoMinimoDoLogin = 3;
    private const int TamanhoMaximoDoLogin = 40;
    private const int TamanhoMaximoDoEmail = 160;
    private const int TamanhoMinimoDaSenha = 6;
    private const int TamanhoMaximoDaSenha = 64;

    private static readonly Regex FormatoDoLogin = new(@"^[a-z0-9._-]{3,40}$", RegexOptions.Compiled);

    /// <summary>Remove os espaços das extremidades (RN-04).</summary>
    public static string NormalizarTexto(string? valor) => valor?.Trim() ?? string.Empty;

    /// <summary>Remove os espaços das extremidades e converte para minúsculas (RN-04 e RN-07).</summary>
    public static string NormalizarLogin(string? login) => NormalizarTexto(login).ToLowerInvariant();

    public static void ValidarNome(string nome, List<ErroDeCampo> erros)
    {
        if (nome.Length == 0)
        {
            erros.Add(new ErroDeCampo("nome", MensagensDeErro.NomeNaoInformado));
        }
        else if (nome.Length < TamanhoMinimoDoNome || nome.Length > TamanhoMaximoDoNome)
        {
            erros.Add(new ErroDeCampo("nome", MensagensDeErro.NomeForaDoTamanho));
        }
    }

    public static void ValidarLogin(string login, List<ErroDeCampo> erros)
    {
        if (login.Length == 0)
        {
            erros.Add(new ErroDeCampo("login", MensagensDeErro.LoginNaoInformado));
        }
        else if (login.Length < TamanhoMinimoDoLogin || login.Length > TamanhoMaximoDoLogin)
        {
            erros.Add(new ErroDeCampo("login", MensagensDeErro.LoginForaDoTamanho));
        }
        else if (!FormatoDoLogin.IsMatch(login))
        {
            erros.Add(new ErroDeCampo("login", MensagensDeErro.LoginComCaractereInvalido));
        }
    }

    public static void ValidarEmail(string email, List<ErroDeCampo> erros)
    {
        if (email.Length == 0)
        {
            erros.Add(new ErroDeCampo("email", MensagensDeErro.EmailNaoInformado));
        }
        else if (email.Length > TamanhoMaximoDoEmail)
        {
            erros.Add(new ErroDeCampo("email", MensagensDeErro.EmailAcimaDoLimite));
        }
    }

    /// <summary>
    /// Valida a senha e a confirmação (RN-17 e RN-18). A senha não sofre trim: espaços fazem
    /// parte dela, e a comparação com a confirmação é literal, caractere a caractere.
    /// </summary>
    public static void ValidarSenha(string senha, string confirmacaoSenha, List<ErroDeCampo> erros)
    {
        if (senha.Length == 0)
        {
            erros.Add(new ErroDeCampo("senha", MensagensDeErro.SenhaNaoInformada));
        }
        else if (senha.Length < TamanhoMinimoDaSenha || senha.Length > TamanhoMaximoDaSenha)
        {
            erros.Add(new ErroDeCampo("senha", MensagensDeErro.SenhaForaDoTamanho));
        }

        if (confirmacaoSenha.Length == 0)
        {
            erros.Add(new ErroDeCampo("confirmacaoSenha", MensagensDeErro.ConfirmacaoSenhaNaoInformada));
        }
    }
}
