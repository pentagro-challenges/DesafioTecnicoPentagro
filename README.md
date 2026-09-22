# Desafio processo seletivo - Pentagro

**Desafio de estágio em desenvolvimento full stack — Pentagro**

Olá! Que bom ter você aqui.

Este repositório tem duas coisas: um sistema pequeno que já funciona — cadastro, login e listagem de
usuários — e o documento que descreve como ele deveria se comportar. O seu trabalho é colocá-lo no ar,
entendê-lo, evoluí-lo e explicar as suas decisões.

**Este é o único documento de instruções**: não existe outro enunciado. Você vai usar dois documentos
de **apoio**, a especificação (o contrato do
sistema) e o manual de execução atual. Leia até o fim antes de começar: são cerca de 25
minutos de leitura atenta, e eles evitam retrabalho depois.

| | |
|---|---|
| **O que é** | Um módulo de cadastro, login e listagem de usuários: uma API em .NET 10 e uma aplicação web em React 19, com a especificação funcional ao lado. |
| **O que se espera de você** | Subir o projeto, implementar a alteração de usuário, propor e aplicar uma ou mais melhorias sua, confrontar o código com a especificação e analisar o que temos ja implementado que pode ser evoluido, finalizando com uma explicação de suas escolhas. |
| **Qual é o prazo** | **2 dias corridos**, contados do e-mail em que você recebeu o acesso. A data e a hora exatas estão nesse e-mail, e é o que vale. |
| **Como você entrega** | Você cria uma cópia **privada** deste repositório na sua conta do GitHub, com o botão **Use this template**, trabalha em uma branch sua e responde ao e-mail com o link. |
| **E depois** | Uma reunião presencial será realizada para uma breve explicação pessoalmente sobre o que você entregou. |
| **Uso de IA** | Liberado e esperado. Veja a [seção 7](#7-uso-de-inteligência-artificial). |

**Nunca mexeu com .NET ou com React?** Sem problema, e é esperado — o desafio não pressupõe
experiência nessas tecnologias. O sistema já funciona: em boa parte do caminho você vai seguir o
padrão que já está no código. Consultar documentação e usar IA é liberado e faz parte.

**Nunca usou um template do GitHub?** Também sem problema — a [seção 2](#2-comece-por-aqui-crie-a-sua-cópia) tem o passo a
passo completo, com os comandos prontos para copiar. É o primeiro passo, e leva poucos minutos.

**Antes de começar, tenha à mão:** uma conta no GitHub, o Git instalado, o .NET SDK 10 e o Node 20.19
ou superior. A [seção 3.1](#31-o-que-precisa-estar-instalado) traz os links e como conferir cada um.

---

## Sumário

1. [O que é este desafio](#1-o-que-é-este-desafio)
2. [Comece por aqui: crie a sua cópia](#2-comece-por-aqui-crie-a-sua-cópia)
3. [Colocando o sistema no ar](#3-colocando-o-sistema-no-ar)
4. [O que se pede na etapa assíncrona](#4-o-que-se-pede-na-etapa-assíncrona)
5. [Uso de inteligência artificial](#7-uso-de-inteligência-artificial)
6. [Documento de Comentários](#6-documento-de-comentários-sobre-o-que-foi-entregue)
7. [Como entregar](#7-como-entregar)
8. [A etapa síncrona](#8-a-etapa-síncrona)
9. [Dúvidas](#9-dúvidas)


---

## 1. O que é este desafio

Não é prova de memória nem maratona de programação. Ele reproduz, em escala pequena, o que o time faz
toda semana: **pegar um sistema que já existe**, entender como ele funciona, comparar o que ele faz
com o que foi combinado que ele deveria fazer, evoluí-lo e explicar as decisões para outras pessoas.


### O que tem no repositório

| Item | Onde está | O que é |
|---|---|---|
| **O sistema** | [`sistema/`](sistema/) | A aplicação que já sobe e funciona: API em [`sistema/api`](sistema/api) (.NET 10, Minimal API, EF Core + SQLite) e aplicação web em [`sistema/web`](sistema/web) (React 19 + TypeScript + Vite). |
| **A especificação** | [`especificacao/ESPECIFICACAO.md`](especificacao/ESPECIFICACAO.md) | O documento funcional e técnico do módulo: regras de negócio numeradas (`RN-xx`), requisitos não funcionais (`RNF-xx`), contratos de API, telas e critérios de aceite (`CA-xx.y`). |

### A especificação é o contrato

A especificação descreve o **comportamento esperado** do módulo. Onde o documento e o código
discordarem, **o documento prevalece**.

Isso tem uma consequência prática, e ela está no centro do desafio: vale muito a pena ler o documento
com atenção e **entender com o que o sistema realmente faz** quando você o executa.


### As duas etapas

| Etapa | Formato | Duração |
|---|---|---|
| **Assíncrona** | Você trabalha sozinho, no seu computador, no seu ritmo | **2 dias corridos** a partir do recebimento |
| **Síncrona** | Conversa pessoalmente, explicação ao vivo do que foi entregue | **45 a 60 minutos**, agendada depois da entrega |

---
## 2. Comece por aqui: crie a sua cópia

Este repositório é um *template*, e ele não é o lugar do seu trabalho: o seu trabalho acontece em uma
**cópia sua, privada**, criada a partir dele. Nada do que você escrever deve ser enviado para cá.

Faça isso **antes** de mexer em qualquer arquivo, para que todos os seus commits nasçam no lugar certo.

### Passo 1 — Criar a sua cópia

Pela interface do GitHub, sem comando nenhum:

1. Entre no GitHub com a **sua** conta e abra a página deste repositório.
2. Clique no botão verde **Use this template** e depois em **Create a new repository**.
3. Em **Owner**, confirme que está a sua conta pessoal. Dê um nome ao repositório, por exemplo
   `desafio-pentagro`.
4. Marque **Private**. Isso importa: num repositório público, qualquer pessoa, inclusive outros
   candidatos, veria o seu trabalho.
5. Clique em **Create repository** e aguarde alguns segundos.

O GitHub leva você para o seu repositório novo. Confira a barra de endereço: ela agora mostra
`github.com/<seu-usuario>/<nome-que-voce-escolheu>`, e o nome aparece com a etiqueta **Private**.
Quem avalia o desafio só consegue abri-lo depois que você libera o acesso.


### Passo 2 — Clonar a sua cópia para a sua máquina

Clique no botão verde **Code** do **seu repositório** e copie a URL — confira que ela tem o seu nome
de usuário, e não `pentagro-challenges`. No terminal, na pasta onde você guarda seus projetos:

```bash
git clone https://github.com/<seu-usuario>/<nome-do-seu-repositorio>.git
cd <nome-do-seu-repositorio>
```
### Passo 3 — Criar a sua branch

Deixe a branch principal (`main`) exatamente como veio. Assim fica evidente, na comparação, o que foi
feito por você.

```bash
git checkout -b desafio/seu-nome
```

Troque `seu-nome` pelo seu nome, sem acentos e sem espaços — por exemplo, `desafio/maria-silva`.


### Três detalhes que evitam confusão

- **Não tente enviar nada para este repositório.** Você não tem permissão, e nem precisa: depois de
  clonar a **sua cópia**, o seu remoto `origin` já é ela, e é para lá que tudo vai.
- **Se quiser usar *pull request*** — e é uma boa ideia, a descrição é um ótimo lugar para resumir a
  entrega —, abra **dentro do seu próprio repositório**, da sua branch para a `main` dele.
- **Não se preocupe com arquivos gerados.** `node_modules`, `bin`, `obj`, o arquivo do banco e o
  `.env` já estão no `.gitignore` e não vão para o repositório.

---

## 3. Colocando o sistema no ar

Meta desta seção: **sistema rodando e primeiro login feito**. Com tudo instalado, são cerca de cinco
minutos; na primeira vez, contando os downloads do .NET e do npm, reserve de quinze a trinta.

### 3.1 O que precisa estar instalado

| Ferramenta | Versão | Para que serve | Como conferir |
|---|---|---|---|
| Conta no [GitHub](https://github.com) | — | Criar a sua cópia e entregar | Entrar em github.com com ela |
| [Git](https://git-scm.com/downloads) | Qualquer versão recente | Clonar, versionar e enviar o seu trabalho | `git --version` |
| [.NET SDK](https://dotnet.microsoft.com/download) | **10.0** ou superior — o **SDK**, não apenas o runtime | Compilar e executar a API | `dotnet --list-sdks` |
| [Node.js](https://nodejs.org) | **20.19** ou superior (recomendado 22 LTS; nas versões 22.x, a partir da 22.12) | Executar a aplicação web | `node --version` |

Fora Git, .NET e Node, nada mais: nenhum banco a instalar, nenhum contêiner a subir, nenhum serviço
externo a configurar. O banco é um arquivo SQLite criado sozinho na primeira execução. Qualquer editor
serve.

 ### 3.2 Subindo a API e a web

São dois processos, cada um no seu terminal, partindo da pasta `sistema/`. Suba a API primeiro, porque
a web depende dela.

```bash
# Terminal 1 — API. Na primeira vez o .NET baixa pacotes, compila e cria o banco.
cd api
dotnet run

# Terminal 2 — web. O npm install só é necessário na primeira vez.
cd web
npm install
npm run dev
```

A API responde em `http://localhost:5199` e a web abre em `http://localhost:5173`.

### 3.3 O primeiro login

Abra <http://localhost:5173>. A tela de login aparece. Entre com o usuário que a API cria sozinha na
inicialização, quando o banco ainda está vazio:

| Login | Senha |
|---|---|
| `admin` | `Admin@123` |

Dando certo, você chega à listagem de usuários. **Este é o marco: daqui em diante o sistema é seu para
explorar.** São credenciais de desenvolvimento local, evidentemente — nada que se use em ambiente real.

---

## 4. O que se pede na etapa assíncrona

Aqui listaremos e explicaremos melhor cada etapa, uma será seguida de outra para ter um fluxo organizado para a entrega final.

### 4.1 Coloque o projeto em execução

Ao final, você tem a API respondendo em
`http://localhost:5199`, a aplicação web aberta em `http://localhost:5173` e o login feito.

**O que esperamos:** que você chegue até aqui sozinho.

### 4.2 Entenda e verifique o sistema

Antes de escrever qualquer linha, **use** o sistema como uma pessoa usuária usaria: percorra cada caso
de uso do início ao fim, tanto no caminho que dá certo quanto nos caminhos que dão errado.

Depois faça o trajeto no código, acompanhando um caso de uso
inteiro, do clique no botão até a gravação no banco.

Por fim, repita o passeio com a especificação aberta ao lado, usando os critérios de aceite de cada
caso de uso como roteiro. Anote o que chamar a sua atenção — essas anotações são a matéria-prima passos seguintes

**O que esperamos:** que você saiba percorrer o caminho de uma requisição e dizer onde ficam as regras
de negócio. Não é preciso dominar o projeto inteiro.

### 4.3 Implemente a funcionalidade nova: alteração de usuário

A **seção 6 da especificação (UC-04 — Alteração de usuário)** descreve por completo um caso de uso que
**ainda não existe no código**: o endpoint `PUT /api/usuarios/{id}` e a tela `/usuarios/{id}/editar`.

A alteração difere do cadastro em alguns pontos, e as `RN-51` a `RN-61` tratam de cada um deles: leia-as
antes de começar. O único ponto que adiantamos aqui, porque costuma gerar dúvida legítima de escopo, é
que a **senha é opcional** na alteração — campos de senha em branco mantêm a senha atual.

**O que esperamos:** o caso de uso funcionando conforme o contrato e no padrão do código que já está
lá — mesma organização, mesmo idioma, mesmas mensagens do catálogo da especificação. Percorra os dez
critérios de aceite antes de dar a tarefa por encerrada; eles são a sua lista de verificação.

### 4.4 Proponha e implemente uma melhoria sua

Escolha **uma ou mais melhorias** e implemente-as. Serão suas: pode ser de interface, de acessibilidade, de
organização do código, de mensagens, de experiência de uso — o que você considerar que mais aumenta a
qualidade do produto pelo esforço investido. **Ideias de melhoria no front são muito bem-vindas.**

**O que esperamos:** menos a melhoria em si e mais o **critério**. Registre no documento de comentarios o que você mudou e por que escolheu justamente isso.

### 4.5 Confronte o código com a especificação e revise o código

Com o sistema no ar e a especificação aberta ao lado, passe pelos critérios de aceite de cada caso de
uso e veja se o comportamento corresponde ao que o documento determina. É uma leitura atenta: **três a cinco achados bem evidenciados já são uma ótima entrega**.

**O que esperamos:** achados concretos e verificáveis. Para cada um: o que o sistema faz, onde está
(arquivo e trecho), qual regra do documento ele contraria (`RN-xx`, `RNF-xx` ou `CA-xx.y`) e como
reproduzir. "O código poderia ser melhor organizado" não é um achado; é uma impressão.

---

## 5. Uso de inteligência artificial

**O uso de IA é liberado e esperado.** Use ChatGPT, Claude, Copilot, Cursor, o que preferir. Não há
prêmio por sofrimento: no time, essas ferramentas fazem parte do trabalho.

Duas condições, que valem aqui e no dia a dia:

1. **Você responde pelo que entrega.** Código gerado que você não sabe explicar é código que você não
   deveria ter entregado. Na etapa síncrona vamos conversar sobre trechos específicos do que você
   enviou.
2. **Verifique antes de aceitar.** IA erra com muita confiança. Rode, teste, confira contra a
   especificação — e não contra a própria IA. Se a ferramenta sugeriu algo que você conferiu e
   rejeitou, isso é um ótimo assunto para a conversa: conte para a gente.

Não é preciso registrar cada prompt — e nem queremos um histórico de conversa. O que queremos são dois
ou três exemplos concretos, e vale trazer isso para a conversa. Onde a IA ajudou muito, onde atrapalhou, e o
que você fez a respeito.

---

## 6. Documento de Comentários sobre o que foi entregue

Deixe o que você anotou num documento curto, junto com o código no seu repositório. Pode ser markdown,
txt ou o que for mais confortável — não há formato nem nome de arquivo obrigatório. 

Ele serve para chegarmos na conversa já sabendo um pouco da linha de ideia utilizada durante o desenvolvimento. O resto será entendido ao vivo no dia da entrevista.

Um cuidado que faz diferença: separe o que é **divergência entre o código e a especificação** do que é
**melhoria que você propõe**. A primeira é o sistema descumprindo o combinado; a segunda é uma sugestão
sua, legítima, mas fora do contrato atual.

---

## 7. Como entregar

**Prazo: 2 dias corridos** a partir do e-mail em que você recebeu o acesso. A data e a hora exatas estão
nesse e-mail.

### Passo 1 — Commits ao longo do caminho

Faça commits conforme avança, e não um único commit gigante no final: os seus commits contam a história
do seu raciocínio, e nós lemos essa história.

```bash
git add .
git commit -m "feat(usuarios): alteracao de usuario na API"
```

Uma boa prática é o uso do padrão Conventional Commits durante o desenvolvimento da solução.

### Passo 2 — Enviar para o seu repositório

Envie pelo menos uma vez no meio do caminho, e não só no último minuto do prazo. Depois do push, abra o
seu repositório no navegador, use o seletor de branch e confirme que os seus arquivos estão lá — é a
verificação mais confiável de que a entrega chegou.

### Passo 3 — Liberar o acesso ao seu repositório

O seu repositório é privado, então confirme que conseguimos abri-lo: no GitHub, em **Settings →
Collaborators → Add people**, adicione com acesso de leitura o usuário do GitHub que está indicado no
e-mail do desafio (é um `@usuario`, não o endereço de e-mail — a busca do GitHub costuma não encontrar
pelo e-mail corporativo). É um clique. Se o GitHub avisar que ele já tem acesso, não há nada a fazer.

### Passo 4 — Responder ao e-mail

Responda ao **mesmo e-mail em que você recebeu o desafio**, dentro do prazo, com:

1. o **link do seu repositório**;
2. o **nome da sua branch**;
3. qualquer aviso que julgue necessário para abrirmos o projeto.

O documento breve de comentarios feitos com relação ao que foi entregue deve estar no repositório, junto com o código. Ele é parte da entrega, e será analisado junto ao codigo entregue.

---

## 8. A etapa síncrona

Depois da entrega agendamos uma conversa de **45 a 60 minutos**, uma conversa técnica, parecida com as que o time tem toda semana de forma a entender o que foi entregue.

O roteiro, para que você chegue sem surpresas:

1. **Você apresenta** o sistema em execução e o que fez: a funcionalidade nova, a melhoria e as
   correções. Cerca de 10 minutos.
2. **Conversamos sobre o seu documento**: o que você encontrou, como classificou e por que priorizou
   daquele jeito.
3. **Uma pequena funcionalidade ao vivo**: pedimos uma adição simples ao sistema, definida na hora, e
   você a implementa com a gente assistindo. **Pode usar IA à vontade** — inclusive queremos ver como
   você a usa: como pede, como confere, o que aceita e o que descarta.
4. **Perguntas sobre o código** que você entregou, em pontos específicos.
5. **Espaço para a sua crítica**: decisões técnicas que você herdou e considera inadequadas. Fale à
   vontade — este é um espaço legítimo da conversa, e uma crítica bem fundamentada conta a seu favor.

---

## 9. Dúvidas

Perguntas são **bem-vindas** e não descontam ponto — ao contrário: saber perguntar cedo é uma qualidade
profissional que valorizamos.

Se algo neste enunciado ou na especificação parecer ambíguo ou contraditório, essa também é uma
pergunta válida. E, se você preferir seguir em frente e registrar no documento de comentários a
interpretação que adotou, também está certo: decidir com a informação disponível e deixar a decisão
registrada é exatamente o comportamento que procuramos.

---

Bom trabalho. Estamos torcendo por você.
