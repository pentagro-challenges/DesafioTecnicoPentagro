# Pentagro — Cadastro e Acesso de Usuários

**Especificação funcional e técnica — versão 1.0, aprovada para desenvolvimento**

Este documento descreve o comportamento esperado do módulo e é a fonte de verdade: onde o código e o documento discordarem, vale o documento.

Cada regra tem um número fixo: `RN-xx` para regra de negócio e `RNF-xx` para requisito não funcional. Toda regra é verificável, olhando o sistema rodando ou o código. **DEVE** e **NÃO DEVE** indicam obrigação; nada aqui é opcional, exceto onde estiver escrito "opcional". Texto entre aspas e em fonte monoespaçada é literal: é o que o sistema exibe ou devolve. Os critérios de aceite (`CA-xx.y`) de cada caso de uso são o jeito prático de conferir.

---

## 1. Visão geral e escopo

Módulo de cadastro, login, listagem e alteração de usuários da Pentagro. Pequeno de propósito: uma base correta, segura e fácil de ler.

### 1.1 Casos de uso e telas

| ID | Caso de uso | Rota HTTP | Autenticação | Tela |
|---|---|---|---|---|
| UC-01 | Cadastro de usuário | `POST /api/usuarios` | Pública | `/cadastro` |
| UC-02 | Login e emissão de token | `POST /api/auth/login` | Pública | `/login` |
| UC-03 | Listagem de usuários | `GET /api/usuarios` | Exige token | `/usuarios` |
| UC-04 | Alteração de usuário | `PUT /api/usuarios/{id}` | Exige token | `/usuarios/{id}/editar` |

A raiz (`/`) leva a `/usuarios` quando há sessão ativa e a `/login` quando não há.

### 1.2 Arquitetura e ambientes

| Componente | Tecnologia | Endereço em desenvolvimento |
|---|---|---|
| API | .NET 10, Minimal API, EF Core + SQLite | `http://localhost:5199` |
| Aplicação web | React 19 + TypeScript + Vite | `http://localhost:5173` |
| Banco de dados | SQLite, arquivo local | Criado na primeira execução |

Todos os recursos da API ficam sob `/api`. A web fala só com a API. O banco é criado na inicialização, com o usuário da **RN-12**. A web lê o endereço da API da configuração (**RNF-12**), e a API libera a origem da web no CORS (**RNF-04**).

### 1.3 Fora de escopo e perfil de uso

Não fazem parte desta versão, e a ausência não é divergência:

- recuperação de senha e verificação de e-mail;
- perfis, papéis e permissões: todo usuário autenticado tem o mesmo acesso;
- exclusão e inativação de conta;
- paginação, filtro e busca na listagem;
- *refresh token*, "lembrar-me", login por provedor externo e dois fatores;
- auditoria, histórico e relatórios.

O usuário é um colaborador da Pentagro, no computador e no celular. A base esperada é de dezenas a poucas centenas de registros.

### 1.4 Convenções gerais

**RN-01 — Formato da comunicação.** Web e API conversam em JSON (`application/json; charset=utf-8`), com propriedades em `camelCase`, como neste documento.

**RN-02 — Datas e horas.** Trafegam e são gravadas em UTC, em ISO 8601 com `Z` (ex.: `2026-03-14T18:25:43Z`). A tela exibe no fuso local do navegador, como `dd/MM/aaaa HH:mm`.

**RN-03 — Idioma.** Toda mensagem para pessoas é em português do Brasil, direta e sem jargão técnico.

**RN-04 — Espaços nas extremidades.** A API **DEVE** remover os espaços do início e do fim de `nome`, `login` e `email` antes de validar e gravar. Campo só com espaços é campo vazio. A senha nunca sofre esse ajuste.

**RN-05 — Propriedades desconhecidas.** Propriedade fora do contrato é ignorada: não gera erro e não é gravada.

## 2. Modelo de dados

Uma única entidade, `Usuario`.

| Campo | Tipo | Obrigatório | Tamanho | Origem | Observações |
|---|---|---|---|---|---|
| `id` | inteiro | sim | — | Sistema | Chave primária, sequencial, começa em 1 |
| `nome` | texto | sim | 3 a 120 | Informado | Nome de exibição; aceita acento, espaço, hífen e apóstrofo |
| `login` | texto | sim | 3 a 40 | Informado | Identificador de acesso; armazenado em minúsculas |
| `email` | texto | sim | até 160 | Informado | E-mail de contato; não serve para autenticar |
| `senhaHash` | texto | sim | até 100 | Sistema | Hash da senha; nunca a senha |
| `criadoEm` | data/hora UTC | sim | — | Sistema | Definido no cadastro; nunca muda depois |
| `atualizadoEm` | data/hora UTC | não | — | Sistema | Nulo até a primeira alteração (UC-04) |

**RN-06 — Identificador imutável.** O `id` é gerado pelo banco e **NÃO DEVE** mudar. Um `id` enviado no corpo de uma escrita é ignorado: vale o da URL.

**RN-07 — Normalização do login.** Depois da **RN-04**, o `login` **DEVE** virar minúsculas antes de ser validado, comparado ou gravado. `Maria.Silva`, `maria.silva` e `MARIA.SILVA` são o mesmo login.

**RN-08 — O login é único no sistema.** Não podem existir dois usuários com o mesmo `login`. No cadastro e na alteração, antes de gravar, o sistema **DEVE** verificar se outro usuário já tem o login normalizado (**RN-07**). Se tiver, responde `409 Conflict` no campo `login`, com `"Já existe um usuário cadastrado com este login."` A coluna `login` tem índice único.

**RN-09 — O e-mail não é único.** Dois usuários podem ter o mesmo `email`, como um endereço de setor. A API **NÃO DEVE** recusar cadastro nem alteração por e-mail repetido.

**RN-10 — Senha nunca em texto puro.** A senha **NÃO DEVE** ser gravada, escrita em log, devolvida pela API, guardada no navegador nem exibida em erro. Só o `senhaHash` é gravado (**RNF-01**).

**RN-11 — Representação pública do usuário.** Todo endpoint devolve o usuário nesta forma, sem `senha`, `confirmacaoSenha` nem `senhaHash`:

```json
{ "id": 7, "nome": "Maria Silva", "login": "maria.silva", "email": "maria.silva@pentagro.com.br",
  "criadoEm": "2026-03-14T13:05:22Z", "atualizadoEm": null }
```

**RN-12 — Usuário inicial.** Na inicialização, se não existir o login `admin`, a API **DEVE** criar o usuário com `nome` `Administrador`, `login` `admin`, `email` `admin@pentagro.com.br` e senha `Admin@123`, com hash como qualquer outro (**RNF-01**). Se ele já existir, a inicialização **NÃO DEVE** alterar nada.

## 3. UC-01 — Cadastro de usuário

Tela pública `/cadastro`. A pessoa preenche os campos abaixo e clica em **"Cadastrar"**. Dando certo, vai para `/login`. Dando errado, fica no formulário com o que digitou e a indicação do que corrigir. Há um link **"Já tenho conta"** para `/login`, e o foco inicial fica em Nome.

| Campo do formulário | Campo do JSON | Controle | Texto de apoio |
|---|---|---|---|
| Nome | `nome` | Texto de linha única | — |
| Login | `login` | Texto de linha única | "Somente letras, números, ponto, hífen e sublinhado." |
| E-mail | `email` | Texto de linha única | — |
| Senha | `senha` | Senha (mascarado) | "Mínimo de 6 caracteres." |
| Confirmação de senha | `confirmacaoSenha` | Senha (mascarado) | — |

### 3.1 Regras de validação

Toda regra é verificada **no servidor**. A web repete o que consegue, só para dar retorno rápido. As mensagens estão na seção 8.3.

**RN-13 — Nome obrigatório, de 3 a 120 caracteres.** Depois da **RN-04**, `nome` **DEVE** ter de 3 a 120 caracteres. Qualquer caractere é aceito: `José D'Ávila` passa, `Jo` não.

**RN-14 — Login obrigatório, com tamanho e formato definidos.** Depois das **RN-04** e **RN-07**, `login` **DEVE** casar com `^[a-z0-9._-]{3,40}$`: de 3 a 40 caracteres, só letras sem acento, dígitos, ponto, hífen e sublinhado. Aceitos: `maria.silva`, `joao_2026`. Recusados: `ma`, `maria silva`, `josé.silva`.

**RN-15 — E-mail obrigatório, com no máximo 160 caracteres.** Depois da **RN-04**, `email` **DEVE** ser informado e ter até 160 caracteres.

**RN-16 — O e-mail deve ter formato válido.** `email` **DEVE** casar com `^[^@\s]+@[^@\s]+\.[^@\s]+$`. Aceitos: `maria@pentagro.com.br`, `a_b-c@dominio.io`. Recusados: `maria`, `maria@`, `maria@pentagro`, `maria silva@pentagro.com.br`.

**RN-17 — Senha obrigatória, de 6 a 64 caracteres.** `senha` **DEVE** ter de 6 a 64 caracteres, exatamente como digitada: sem o ajuste da **RN-04** e diferenciando maiúsculas. Não há exigência de composição. Aceitas: `senha1`, `Pentagro 2026`. Recusada: `12345`.

**RN-18 — A senha e a confirmação de senha devem coincidir.** `confirmacaoSenha` **DEVE** ser informada e ser exatamente igual a `senha`, caractere a caractere. Diferindo, a resposta é `400 Bad Request`, com o erro no campo `confirmacaoSenha`.

**RN-19 — Todas as violações são reportadas juntas.** A validação **NÃO DEVE** parar na primeira falha. Uma requisição com e-mail inválido e senha curta devolve dois itens em `erros`.

**RN-20 — Ordem de avaliação da unicidade.** A unicidade do login (**RN-08**) só é verificada depois das validações de formato. Havendo erro de formato, responde `400`; resolvido o formato, o conflito responde `409`.

**RN-21 — Persistência do novo usuário.** Passando as validações, grava `nome`, `login` e `email` normalizados, o `senhaHash`, `criadoEm` com o instante atual em UTC e `atualizadoEm` nulo. Recusada a requisição, nada é gravado.

**RN-22 — Hash da senha.** O `senhaHash` segue a **RNF-01**, com *salt* aleatório por usuário. A mesma senha em dois usuários gera hashes diferentes.

**RN-23 — O cadastro é público.** `POST /api/usuarios` **NÃO DEVE** exigir token.

**RN-24 — Retorno do cadastro.** Sucesso responde `201 Created`, com o cabeçalho `Location: /api/usuarios/{id}` e o corpo da **RN-11**.

**RN-25 — Estrutura do formulário.** Os campos seguem a ordem da tabela, cada um com rótulo visível (`<label for>`). Senha e confirmação usam `type="password"`.

**RN-26 — Envio em andamento.** Durante o envio, o botão fica desabilitado e mostra **"Cadastrando..."**.

**RN-27 — Exibição dos erros.** Cada erro aparece abaixo do seu campo, com o texto exato da API. Erro sem campo aparece num bloco no topo do formulário. As mensagens antigas somem a cada nova tentativa.

**RN-28 — Depois do cadastro bem-sucedido.** A web leva a `/login` e mostra `"Cadastro realizado com sucesso. Faça login para continuar."` O cadastro não faz login automático.

**RN-29 — Depois de um erro.** Os valores digitados ficam no formulário, menos os dois campos de senha.

### 3.2 Contrato da API

```http
POST /api/usuarios
Content-Type: application/json
```

```json
{ "nome": "Maria Silva", "login": "maria.silva", "email": "maria.silva@pentagro.com.br",
  "senha": "Pentagro2026", "confirmacaoSenha": "Pentagro2026" }
```

Sucesso: `201` com `Location` e o corpo da **RN-11**. Falhas, no corpo da seção 8: `400` para corpo inválido e para validação (RN-13 a RN-18), `409` para login repetido (RN-08) e `500` para falha inesperada.

### 3.3 Critérios de aceite

| ID | Verificação |
|---|---|
| CA-01.1 | Dados válidos e login inédito dão `201`; o usuário aparece na listagem e consegue fazer login com a senha informada |
| CA-01.2 | Nome com 2 caracteres dá `400` com `"O nome deve ter entre 3 e 120 caracteres."`, e nenhum usuário é criado |
| CA-01.3 | Login com espaço ou acento dá `400` com `"O login pode conter apenas letras, números, ponto, hífen e sublinhado."` |
| CA-01.4 | Um login que já existe, mesmo escrito com outra combinação de maiúsculas e minúsculas, dá `409` com `"Já existe um usuário cadastrado com este login."` junto ao campo Login, e a quantidade de usuários não muda |
| CA-01.5 | `maria@pentagro` no campo `email` dá `400` com `"Informe um e-mail válido."`, e nenhum usuário é criado |
| CA-01.6 | Senha com 4 caracteres dá `400` com `"A senha deve ter entre 6 e 64 caracteres."` |
| CA-01.7 | Senha e confirmação diferentes dão `400` com `"A confirmação de senha não confere com a senha."`, e nenhum usuário é criado |
| CA-01.8 | Nome vazio e senha de 4 caracteres na mesma requisição dão `400` com os dois erros na mesma resposta |
| CA-01.9 | Depois de um cadastro bem-sucedido, a pessoa cai em `/login` e vê `"Cadastro realizado com sucesso. Faça login para continuar."` |
| CA-01.10 | Cadastro concluído, a coluna `senhaHash` contém um hash, e não a senha digitada; a resposta da API não traz campo de senha |

## 4. UC-02 — Login e sessão

Tela pública `/login`, a inicial de quem não está autenticado. Campos **Login** e **Senha**, botão **"Entrar"** e link **"Criar conta"** para `/cadastro`. O foco inicial fica em Login, e Enter envia o formulário. Quem chega de um cadastro ou de uma sessão expirada vê a mensagem correspondente acima do formulário.

### 4.1 Regras de autenticação e sessão

**RN-30 — Login e senha obrigatórios.** Faltando `login` ou `senha` no corpo, a resposta é `400 Bad Request`, com o erro no campo que faltou.

**RN-31 — Autenticação por login e senha.** O sistema **DEVE** buscar o usuário pelo login normalizado (**RN-07**) e conferir a senha com a função de verificação do algoritmo de hash (**RNF-01**), nunca por comparação de texto nem recalculando o hash para comparar.

**RN-32 — Falha de autenticação.** Login inexistente e senha errada **DEVEM** ter a mesma resposta: `401 Unauthorized` com `"Login ou senha inválidos."` e sem erros por campo. Dizer qual dos dois está errado revelaria quais logins existem.

**RN-33 — Retorno do login bem-sucedido.** Responde `200 OK` com o token, o instante de expiração e o usuário autenticado (**RN-11**).

**RN-34 — Formato do token.** JWT assinado com HS256, com as claims `sub` (o `id`), `nome`, `login`, `iss` (`Jwt:Issuer`), `aud` (`Jwt:Audience`), `iat` e `exp`. **NÃO DEVE** conter senha nem hash.

**RN-35 — Tempo de expiração.** O token expira em 60 minutos, valor lido de `Jwt:ExpiracaoMinutos` (padrão 60). O mesmo instante vai na claim `exp` e no campo `expiraEm`, em UTC.

**RN-36 — Segredo de assinatura fora do código-fonte.** A chave do token **DEVE** vir de configuração e **NÃO DEVE** estar escrita no código (**RNF-02**).

**RN-37 — Não há renovação automática.** Não existe *refresh token*. Expirado o token, a pessoa faz login de novo.

**RN-38 — Rotas protegidas exigem token.** UC-03 e UC-04 exigem o cabeçalho `Authorization: Bearer {token}`. Sem ele, a resposta é `401 Unauthorized` e nada é executado.

**RN-39 — Validação do token pelo servidor.** Em toda requisição protegida, a API **DEVE** recusar com `401` o token que falhar em qualquer item:

1. a assinatura confere com a chave configurada (**RN-36**);
2. o emissor (`iss`) é o esperado;
3. a audiência (`aud`) é a esperada;
4. o instante atual é anterior a `exp`, com tolerância de no máximo 1 minuto.

A expiração é verificada no servidor: token com `exp` no passado **DEVE** ser recusado, mesmo íntegro e assinado.

**RN-40 — Armazenamento da sessão no navegador.** A web guarda o token e os dados do usuário no `localStorage`, para a sessão sobreviver a um F5; senha nunca (**RN-10**). Ao restaurar, confere a expiração: sessão vencida é descartada e a pessoa vai para o login.

**RN-41 — Reação da web ao `401`.** Recebendo `401` em rota protegida, a web **DEVE** apagar a sessão, ir para `/login` e mostrar `"Sua sessão expirou. Faça login novamente."` Não pode ficar numa tela protegida vazia, em branco ou com a pessoa aparentemente autenticada.

**RN-42 — Proteção das rotas da web.** `/usuarios` e `/usuarios/{id}/editar` só abrem com sessão guardada. Sem ela, a web vai para `/login` antes de chamar a API.

**RN-43 — Encerrar sessão.** Toda tela autenticada tem o botão **"Sair"** no cabeçalho, que apaga a sessão e leva a `/login`.

**RN-44 — Regras da tela de login.** Os campos têm rótulo visível. Durante o envio, o botão fica desabilitado e mostra **"Entrando..."**. Credenciais inválidas mostram a mensagem da API acima do formulário, limpam a Senha e mantêm o Login. Sucesso leva a `/usuarios`.

### 4.2 Contrato da API

```http
POST /api/auth/login
Content-Type: application/json

{ "login": "maria.silva", "senha": "Pentagro2026" }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiraEm": "2026-03-14T14:05:22Z",
  "usuario": { "id": 7, "nome": "Maria Silva", "login": "maria.silva", "email": "maria.silva@pentagro.com.br",
               "criadoEm": "2026-03-14T13:05:22Z", "atualizadoEm": null }
}
```

Falhas, no corpo da seção 8: `400` sem `login` ou `senha` (RN-30), `401` para credenciais inválidas (RN-32) e `500` para falha inesperada.

### 4.3 Critérios de aceite

| ID | Verificação |
|---|---|
| CA-02.1 | Credenciais corretas dão `200`, com `token` e `expiraEm` preenchidos, e a pessoa vai para `/usuarios` |
| CA-02.2 | `expiraEm` fica 60 minutos à frente do instante do login e coincide com a claim `exp` do token |
| CA-02.3 | Senha incorreta e login inexistente dão os dois `401` com `"Login ou senha inválidos."` visível na tela |
| CA-02.4 | Entrar com `ADMIN` e a senha correta funciona: a busca do usuário não diferencia maiúsculas de minúsculas |
| CA-02.5 | `GET /api/usuarios` sem o cabeçalho `Authorization` é recusado com `401`, e nenhum dado é devolvido |
| CA-02.6 | `GET /api/usuarios` com um token cuja `exp` já passou é recusado com `401` pela API, mesmo que o token esteja íntegro e corretamente assinado |
| CA-02.7 | `GET /api/usuarios` com um token assinado por outro segredo é recusado com `401` |
| CA-02.8 | Recebendo `401` na listagem, a web leva a pessoa a `/login` com o aviso de sessão expirada, e o token deixa de existir no navegador |
| CA-02.9 | Recarregar a página com sessão válida mantém a pessoa autenticada |

## 5. UC-03 — Listagem de usuários

Tela `/usuarios`, a inicial de quem está autenticado. O cabeçalho mostra o título **"Usuários"**, o nome de quem está logado e o botão **"Sair"**. As colunas são Nome, Login, E-mail, Cadastrado em (`criadoEm`, no formato da **RN-02**) e Ações, com o botão **"Editar"**, que leva a `/usuarios/{id}/editar`.

### 5.1 Regras

**RN-45 — A listagem exige autenticação.** `GET /api/usuarios` exige token válido (**RN-38**, **RN-39**). Sem token, com token inválido ou expirado, responde `401` e **nenhum dado** é devolvido.

**RN-46 — Conteúdo da listagem.** Devolve todos os usuários, inclusive quem está logado. Nesta versão não há paginação, filtro, busca nem parâmetro de consulta.

**RN-47 — Ordenação.** Por `nome`, em ordem alfabética crescente, sem diferenciar maiúsculas; nomes iguais desempatam por `login`. Quem ordena é a API: a web exibe na ordem recebida.

**RN-48 — Campos devolvidos.** Cada item segue a **RN-11**. Nenhum dado de senha aparece na resposta nem na tela.

**RN-49 — Base vazia não é erro.** Sem usuários, a resposta é `200 OK` com `[]`.

**RN-50 — Estados da tela.** A tela nunca fica em branco. **Carregando:** mostra `"Carregando usuários..."`. **Lista vazia:** mostra `"Nenhum usuário cadastrado."`. **Falha:** mostra a mensagem de erro (seção 8) e o botão **"Tentar novamente"**, que refaz a requisição.

### 5.2 Contrato da API

`GET /api/usuarios`, com o cabeçalho `Authorization: Bearer {token}`.

Sucesso: `200` com a lista ordenada conforme a **RN-47**, ou `[]`. Falhas, no corpo da seção 8: `401` para token ausente, inválido ou expirado, e `500` para falha inesperada.

### 5.3 Critérios de aceite

| ID | Verificação |
|---|---|
| CA-03.1 | Com token válido, a resposta é `200` e traz todos os usuários cadastrados |
| CA-03.2 | Com os nomes `Zeca`, `ana` e `Bruno` cadastrados, a ordem devolvida é `ana`, `Bruno`, `Zeca` |
| CA-03.3 | Nenhum campo relacionado a senha aparece na resposta, nem com outro nome |
| CA-03.4 | Sem cabeçalho de autorização, a resposta é `401` |
| CA-03.5 | Abrir `/usuarios` sem sessão ativa redireciona para `/login` |
| CA-03.6 | Com a API parada, a tela exibe mensagem de erro visível e o botão **"Tentar novamente"**, e não uma tela em branco |

## 6. UC-04 — Alteração de usuário

Qualquer usuário autenticado pode alterar qualquer usuário, inclusive a si mesmo: esta versão não tem perfis. As regras desta seção valem para a API e para a tela.

Tela `/usuarios/{id}/editar`, aberta pelo botão **"Editar"** da listagem. O formulário chega preenchido com Nome (`nome`), Login (`login`, com o mesmo texto de apoio do cadastro) e E-mail (`email`). Nova senha (`senha`) e Confirmação da nova senha (`confirmacaoSenha`) chegam **vazias e opcionais**, com o apoio "Deixe em branco para manter a senha atual.". O botão **"Salvar"** mostra **"Salvando..."** desabilitado durante o envio, e **"Cancelar"** volta a `/usuarios` sem gravar.

Não existe `GET /api/usuarios/{id}`, e criar um está fora de escopo: os dados vêm da listagem. Aberta direto pelo endereço, a tela busca a listagem, localiza o registro pelo `id` e mostra `"Carregando dados do usuário..."` enquanto isso. Se o `id` não existir, mostra `"Usuário não encontrado."` e um link de volta para a listagem.

### 6.1 Regras

**RN-51 — A alteração exige autenticação.** `PUT /api/usuarios/{id}` exige token válido (**RN-38**, **RN-39**). Sem token, com token inválido ou expirado, responde `401` e **nada é gravado**.

**RN-52 — Usuário inexistente.** Sem usuário com o `id` da rota, responde `404 Not Found` com `"Usuário não encontrado."`

**RN-53 — Campos alteráveis e campos imutáveis.** São alteráveis `nome`, `login`, `email` e, opcionalmente, a senha. Valores de `id` (**RN-06**), `criadoEm` e `senhaHash` enviados no corpo são ignorados. Os três campos de texto são obrigatórios: campo ausente é campo não informado (**RN-13**, **RN-14** e **RN-15**), e não corpo malformado.

**RN-54 — As validações de campo são as mesmas do cadastro.** Valem as **RN-04**, **RN-07**, **RN-13**, **RN-14**, **RN-15**, **RN-16** e **RN-19**. O que não seria aceito no cadastro também não é aceito aqui.

**RN-55 — Login único, desconsiderando o próprio registro.** A **RN-08** vale aqui sem contar o próprio registro: há conflito só quando **outro** usuário (`id` diferente do da rota) já tem o login normalizado enviado: `409 Conflict` com `"Já existe um usuário cadastrado com este login."` Salvar mantendo o próprio login **NÃO DEVE** dar conflito.

**RN-56 — A senha é opcional na alteração.** Com `senha` e `confirmacaoSenha` ausentes, nulas ou vazias, a senha atual **DEVE** ser mantida, sem recalcular o hash.

**RN-57 — Informada a senha, valem as regras do cadastro.** Vindo `senha` preenchida, valem a **RN-17** e a **RN-18**. Vindo só um dos dois campos, responde `400`: só a senha, erro em `confirmacaoSenha`; só a confirmação, erro em `senha`. Passando, o hash é regerado (**RNF-01**) e a nova senha passa a valer no login.

**RN-58 — A alteração é tudo ou nada.** Violada qualquer regra, nada é gravado.

**RN-59 — Registro da alteração.** Concluída a alteração, `atualizadoEm` recebe o instante atual em UTC, e `criadoEm` não muda.

**RN-60 — Retorno da alteração.** Sucesso responde `200 OK` com o usuário atualizado (**RN-11**), com `atualizadoEm` preenchido.

**RN-61 — Comportamento da tela após salvar.** A web volta a `/usuarios`, recarrega a lista e mostra `"Usuário alterado com sucesso."` Os erros seguem a **RN-27**.

### 6.2 Contrato da API

```http
PUT /api/usuarios/{id}
Content-Type: application/json
Authorization: Bearer {token}
```

Mantendo a senha atual, com os dois campos de senha vazios, ausentes ou nulos (**RN-56**):

```json
{ "nome": "Maria Silva Costa", "login": "maria.costa", "email": "maria.costa@pentagro.com.br",
  "senha": "", "confirmacaoSenha": "" }
```

Trocando também a senha, com os dois campos preenchidos e iguais (**RN-57**):

```json
{ "nome": "Maria Silva Costa", "login": "maria.costa", "email": "maria.costa@pentagro.com.br",
  "senha": "NovaSenha2026", "confirmacaoSenha": "NovaSenha2026" }
```

Sucesso: `200` com o usuário atualizado, `criadoEm` original e `atualizadoEm` preenchido. Falhas, no corpo da seção 8: `400` para corpo inválido e validação (RN-54, RN-57), `401` sem token válido (RN-51), `404` para `id` inexistente (RN-52), `409` para login de outro usuário (RN-55) e `500` para falha inesperada.

### 6.3 Critérios de aceite

| ID | Verificação |
|---|---|
| CA-04.1 | Alterar o nome de um usuário dá `200`, e a listagem passa a exibir o novo nome, reordenada se for o caso |
| CA-04.2 | Salvar o formulário sem alterar o login dá `200`, e não `409` |
| CA-04.3 | Um login que pertence a outro usuário dá `409` com `"Já existe um usuário cadastrado com este login."`, e nada é gravado |
| CA-04.4 | Um e-mail sem ponto no domínio dá `400` com `"Informe um e-mail válido."`, e nada é gravado |
| CA-04.5 | Salvar com os campos de senha em branco dá `200`, e a pessoa continua entrando com a senha antiga |
| CA-04.6 | Nova senha com confirmação diferente dá `400` com `"A confirmação de senha não confere com a senha."`; a senha antiga continua valendo e o nome não é alterado |
| CA-04.7 | Nova senha válida com confirmação igual dá `200`; a senha antiga deixa de funcionar no login e a nova funciona |
| CA-04.8 | `PUT /api/usuarios/99999` dá `404` com `"Usuário não encontrado."` |
| CA-04.9 | `PUT /api/usuarios/1` sem token dá `401`, e o usuário 1 permanece inalterado |
| CA-04.10 | Depois de uma alteração bem-sucedida, `atualizadoEm` está preenchido e `criadoEm` mantém o valor original |

## 7. Requisitos não funcionais

### 7.1 Segurança de credenciais

**RNF-01 — Armazenamento seguro da senha.** A senha é gravada só como hash de um algoritmo **próprio para senhas**: lento por construção, com *salt* aleatório por registro e custo configurável. O sistema usa **BCrypt**, com custo nunca menor que 10. Não servem: texto puro, cifra reversível, função de resumo rápida e de uso geral (com ou sem *salt*) ou *salt* fixo. **Como verificar:** dois usuários com a mesma senha têm hashes diferentes, o valor gravado começa com `$2a$`, `$2b$` ou `$2y$`, e o login confere pela função de verificação do BCrypt, nunca por comparação de textos.

**RNF-02 — Segredo do token fora do código-fonte.** O segredo do token **NÃO DEVE** aparecer no código, nem como literal, nem como valor padrão, nem como constante. Segredo, emissor, audiência e expiração vêm da configuração (`Jwt:Secret`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiracaoMinutos`) ou de variável de ambiente (`Jwt__Secret`), que prevalece. O segredo tem ao menos 32 caracteres, e o arquivo versionado só pode trazer um segredo de desenvolvimento, identificado como tal. Sem segredo configurado, a API **DEVE** falhar na inicialização com mensagem clara, em vez de subir com um padrão embutido.

**RNF-03 — Validação da sessão no servidor.** Integridade e expiração do token são verificadas pela API em toda requisição protegida (**RN-39**). A web decide o que mostrar; quem autoriza o acesso ao dado é a API.

**RNF-04 — CORS.** A API libera a origem `http://localhost:5173`, os métodos `GET`, `POST` e `PUT` e o cabeçalho `Authorization`, sem curinga `*` com envio de credenciais.

### 7.2 Interface e responsividade

**RNF-05 — Responsividade a partir de 360px.** Toda tela **DEVE** continuar usável e legível a partir de 360px de largura, e correta em tablet e monitor. A 360px:

1. a página não rola na horizontal, e nenhum elemento sai da área visível;
2. nenhum texto, rótulo, campo ou botão fica cortado ou sobreposto;
3. os formulários ocupam a largura disponível, em uma coluna;
4. a tabela de usuários continua consultável, em cartões ou com rolagem horizontal **só no próprio contêiner da tabela**;
5. o cabeçalho se reorganiza sem sobreposição;
6. botões e links têm ao menos 40px de altura, e o texto principal não fica abaixo de 14px.

**RNF-06 — Acessibilidade básica e consistência visual.** Todo campo tem `<label for>`, o foco do teclado é visível, o Tab segue a ordem da tela e o texto de conteúdo tem contraste mínimo de 4,5:1. A interface usa CSS próprio, sem framework de componentes, com a mesma tipografia, paleta e espaçamento em todas as telas.

### 7.3 Tratamento de erro e comunicação com o usuário

**RNF-07 — Toda falha produz uma mensagem útil.** Nenhuma falha é silenciosa. Toda operação termina com um retorno visível, em português, dizendo o que aconteceu e, quando couber, o que fazer. "Erro", "Algo deu errado" ou "Erro 500", sozinhos, não servem.

1. Vindo `erros` preenchido, a tela mostra **as mensagens da API** junto aos campos, e **NÃO DEVE** trocá-las por mensagem genérica nem descartá-las.
2. Vindo erro sem campo, a tela mostra a `mensagem` da resposta.
3. Com a API fora do ar ou sem rede, a tela mostra `"Não foi possível conectar ao servidor. Verifique se a API está em execução e tente novamente."`
4. Nenhuma falha vira tela em branco, botão preso em "Carregando...", ação sem retorno ou erro visível só no console.

**RNF-08 — Estados de carregamento e prevenção de duplo envio.** Toda tela que busca dados mostra o carregamento, e todo formulário desabilita o envio enquanto a requisição corre.

**RNF-09 — Idioma do produto.** Interface, mensagens da API, rotas e campos JSON em português do Brasil. Datas em `dd/MM/aaaa`, e data com hora em `dd/MM/aaaa HH:mm`.

### 7.4 Qualidade de código

**RNF-10 — Legibilidade e ausência de duplicação.** Cada regra de negócio é implementada **uma vez**, num único lugar: validação de e-mail, política de senha, normalização de login e hash. Não fica código sem uso no repositório: função que ninguém chama, variável que ninguém lê, importação sobrando, resto de scaffold ou bloco comentado. Os nomes seguem o vocabulário deste documento.

**RNF-11 — Organização do código.** A API segue a organização por *vertical slices* já adotada pelo time: `Domain/Entities`, `Features/<Área>/<CasoDeUso>` e `Infrastructure`. Cada caso de uso concentra o seu request, response, handler e endpoint. Os endpoints são registrados por um método de extensão chamado no `Program.cs`.

### 7.5 Configuração e execução local

**RNF-12 — Subir o sistema não exige infraestrutura.** O banco é um arquivo SQLite criado na primeira execução, com o esquema e o usuário da **RN-12**. A web lê o endereço da API de `VITE_API_URL`, com padrão `http://localhost:5199`, e o repositório traz um `.env.example` com essa variável.

### 7.6 Classificação de criticidade

É a escala que o time usa para priorizar a correção de qualquer desvio deste documento. Onde cada desvio cai é decidido caso a caso por quem faz a triagem, pelo contexto em que ele se manifesta.

| Nível | Definição | Prazo |
|---|---|---|
| **Crítico** | Compromete a segurança, expõe credencial ou permite acesso a dado sem autorização. Consequência potencialmente irreversível. | Imediato; bloqueia a entrega |
| **Alto** | Regra de negócio descumprida: o sistema aceita o que deveria recusar, ou recusa o que deveria aceitar, gerando dado inconsistente na base. | Antes da entrega |
| **Médio** | O sistema faz o certo, mas a pessoa não consegue usar ou não entende o que aconteceu: mensagem ausente, fluxo travado, tela inutilizável em largura suportada. | Na mesma iteração |
| **Baixo** | Cosmético ou de manutenção: não impede o uso e não corrompe dado; afeta o custo de evoluir o código. | Quando houver folga |

## 8. Contrato de erros da API

### 8.1 Formato do corpo de erro

**RN-62 — Formato único de erro.** Toda resposta `4xx` ou `5xx` **DEVE** usar este corpo, e só ele. `mensagem` vem sempre preenchida, pronta para exibir. `erros` vem sempre, como `[]` quando a falha não é de campo; cada item tem `campo`, em `camelCase`, e `mensagem`.

```json
{ "mensagem": "Não foi possível cadastrar o usuário. Verifique os dados informados.",
  "erros": [ { "campo": "email", "mensagem": "Informe um e-mail válido." },
             { "campo": "senha", "mensagem": "A senha deve ter entre 6 e 64 caracteres." } ] }
```

**RN-63 — Mensagens endereçadas a pessoas.** Mensagens de erro **NÃO DEVEM** trazer *stack trace*, nome de classe, texto de exceção do framework, tabela, coluna, SQL, caminho de arquivo nem senha. Esse detalhe vai para o log do servidor.

**RN-64 — Falha inesperada.** Exceção não tratada resulta em `500 Internal Server Error`, com `mensagem` igual a `"Ocorreu um erro inesperado. Tente novamente."` e `erros` vazio.

### 8.2 Status por situação

**RN-65 — Cada situação tem um status definido.** Erro de validação nunca volta como `200`. `403 Forbidden` não é usado nesta versão, porque não há perfis.

| Status | Quando ocorre | Endpoints |
|---|---|---|
| `200 OK` | Login aceito, listagem devolvida, usuário alterado | `POST /api/auth/login`, `GET /api/usuarios`, `PUT /api/usuarios/{id}` |
| `201 Created` | Usuário criado, com cabeçalho `Location` | `POST /api/usuarios` |
| `400 Bad Request` | Corpo ausente ou malformado; uma ou mais validações de campo falharam | Todos |
| `401 Unauthorized` | Credenciais inválidas no login; token ausente, inválido ou expirado em rota protegida | `POST /api/auth/login`, `GET /api/usuarios`, `PUT /api/usuarios/{id}` |
| `404 Not Found` | Não existe recurso para o `id` da rota | `PUT /api/usuarios/{id}` |
| `409 Conflict` | Violação da unicidade do login | `POST /api/usuarios`, `PUT /api/usuarios/{id}` |
| `500 Internal Server Error` | Falha inesperada no servidor | Todos |

### 8.3 Catálogo de mensagens

| Campo | Situação | Mensagem |
|---|---|---|
| `nome` | não informado | `Informe o nome.` |
| `nome` | fora de 3 a 120 caracteres | `O nome deve ter entre 3 e 120 caracteres.` |
| `login` | não informado | `Informe o login.` |
| `login` | fora de 3 a 40 caracteres | `O login deve ter entre 3 e 40 caracteres.` |
| `login` | caractere não permitido | `O login pode conter apenas letras, números, ponto, hífen e sublinhado.` |
| `login` | já cadastrado | `Já existe um usuário cadastrado com este login.` |
| `email` | não informado | `Informe o e-mail.` |
| `email` | formato inválido | `Informe um e-mail válido.` |
| `email` | acima de 160 caracteres | `O e-mail deve ter no máximo 160 caracteres.` |
| `senha` | não informada | `Informe a senha.` |
| `senha` | fora de 6 a 64 caracteres | `A senha deve ter entre 6 e 64 caracteres.` |
| `confirmacaoSenha` | não informada | `Informe a confirmação de senha.` |
| `confirmacaoSenha` | diferente da senha | `A confirmação de senha não confere com a senha.` |
| — | cadastro recusado (mensagem geral) | `Não foi possível cadastrar o usuário. Verifique os dados informados.` |
| — | alteração recusada (mensagem geral) | `Não foi possível alterar o usuário. Verifique os dados informados.` |
| — | corpo da requisição ausente ou malformado | `A requisição enviada é inválida.` |
| — | credenciais inválidas | `Login ou senha inválidos.` |
| — | usuário inexistente | `Usuário não encontrado.` |
| — | token ausente, inválido ou expirado | `Sessão inválida ou expirada. Faça login novamente.` |
| — | falha inesperada | `Ocorreu um erro inesperado. Tente novamente.` |

### 8.4 Consumo pela aplicação web

**RN-66 — A web decide pelo status HTTP.** A web trata a resposta pelo status HTTP e nunca supõe sucesso só porque o `fetch` terminou sem exceção. Itens em `erros` vão para os campos correspondentes, ou para o bloco do topo (**RN-27**) se o campo não existir no formulário. Com `erros` vazio, a tela mostra a `mensagem` (**RNF-07**). Sem corpo interpretável, mostra um texto próprio da operação, como `"Não foi possível carregar a lista de usuários."` O `401` recebe, em qualquer tela, o tratamento da **RN-41**.
