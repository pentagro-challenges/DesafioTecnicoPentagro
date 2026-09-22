namespace Desafio.Api.Infrastructure.Erros;

/// <summary>
/// Catálogo das mensagens devolvidas pela API (seção 8.3 da especificação).
/// Cada texto existe em um único lugar para que todas as telas vejam sempre a mesma redação.
/// </summary>
public static class MensagensDeErro
{
    public const string NomeNaoInformado = "Informe o nome.";
    public const string NomeForaDoTamanho = "O nome deve ter entre 3 e 120 caracteres.";

    public const string LoginNaoInformado = "Informe o login.";
    public const string LoginForaDoTamanho = "O login deve ter entre 3 e 40 caracteres.";
    public const string LoginComCaractereInvalido = "O login pode conter apenas letras, números, ponto, hífen e sublinhado.";
    public const string LoginJaCadastrado = "Já existe um usuário cadastrado com este login.";

    public const string EmailNaoInformado = "Informe o e-mail.";
    public const string EmailAcimaDoLimite = "O e-mail deve ter no máximo 160 caracteres.";
    public const string EmailInvalido = "Informe um e-mail válido.";

    public const string SenhaNaoInformada = "Informe a senha.";
    public const string SenhaForaDoTamanho = "A senha deve ter entre 6 e 64 caracteres.";
    public const string ConfirmacaoSenhaNaoInformada = "Informe a confirmação de senha.";
    public const string ConfirmacaoSenhaDivergente = "A confirmação de senha não confere com a senha.";

    public const string CadastroRecusado = "Não foi possível cadastrar o usuário. Verifique os dados informados.";
    public const string RequisicaoInvalida = "A requisição enviada é inválida.";
    public const string CredenciaisInvalidas = "Login ou senha inválidos.";
    public const string SessaoInvalidaOuExpirada = "Sessão inválida ou expirada. Faça login novamente.";
    public const string ErroInesperado = "Ocorreu um erro inesperado. Tente novamente.";
}
