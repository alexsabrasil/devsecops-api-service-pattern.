# DevSecOps API Service Pattern

**API REST com Node.js, Express, Docker Multi-Stage e Pipeline DevSecOps**

## Sobre o projeto

Este projeto foi desenvolvido como parte das atividades práticas de DevOps, com o objetivo de aplicar conceitos de conteinerização, automação de testes, integração contínua e segurança no ciclo de desenvolvimento de software.

A aplicação consiste em uma API REST simples para gerenciamento de usuários, utilizada como base para experimentar práticas de **DevOps e DevSecOps**.

O desenvolvimento foi realizado de forma incremental, incluindo análise de vulnerabilidades, correção de problemas identificados e implementação de uma pipeline automatizada no GitHub Actions.

## Tecnologias utilizadas

- Node.js 22 e Express
- JavaScript
- Docker e Docker Multi-Stage
- Git e GitHub
- GitHub Actions
- Node.js Test Runner (`node:test`)
- npm audit
- Gitleaks
- Trivy

## Estrutura do projeto

```text
desafio-1/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── services/
│   │   └── userService.js
│   ├── app.js
│   └── index.js
├── tests/
│   └── users.test.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
└── package-lock.json
```

## Funcionalidades da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/users` | Lista os usuários cadastrados |
| POST | `/api/users` | Cadastra um novo usuário |

Os dados são mantidos em memória durante a execução da aplicação. Não há persistência em banco de dados nesta versão.

## Como executar

**Pré-requisitos:** Node.js, npm e Docker.

### Execução local

```bash
npm ci
npm start
```

A aplicação ficará disponível em:

`http://localhost:3000`

### Executar os testes

```bash
npm test
```

### Executar com Docker

Construir a imagem:

```bash
docker build -t api-service-pattern:3.0 .
```

Iniciar o contêiner:

```bash
docker run -d --name desafio1-api -p 3000:3000 api-service-pattern:3.0
```

Testar a API:

```bash
curl http://localhost:3000/api/users
```

Encerrar o contêiner:

```bash
docker stop desafio1-api
docker rm desafio1-api
```

## Otimização e segurança do Docker

O Dockerfile original utilizava uma imagem Node.js sem separação entre os estágios de preparação e execução.

A implementação evoluiu para um Dockerfile multi-stage, utilizando:

- `node:22` para preparação das dependências.
- `node:22-alpine` como imagem de execução.
- `npm ci --omit=dev` para instalar somente as dependências necessárias.
- Usuário não privilegiado `node`.
- Remoção de ferramentas desnecessárias do ambiente de execução, incluindo npm e Corepack.

### Resultado da otimização

| Indicador | Imagem inicial | Imagem otimizada |
|---|---:|---:|
| Docker Disk Usage | 1,64 GB | 241 MB |
| Docker Content Size | 413 MB | 61,4 MB |

**Redução aproximada: 85%**, considerando os valores reportados pelo Docker na comparação inicial.

## Testes automatizados

Foram implementados quatro testes utilizando o módulo nativo `node:test`:

1. Consultar usuários e receber HTTP 200.
2. Cadastrar usuário e receber HTTP 201.
3. Rejeitar cadastro sem e-mail, retornando HTTP 400.
4. Rejeitar cadastro sem nome, retornando HTTP 400.

**Resultado local:** 4 testes aprovados, sem falhas.

## Análise de segurança

### npm audit

Auditoria das dependências da aplicação.

**Resultado local:** nenhuma vulnerabilidade detectada.

### Gitleaks

Análise do histórico Git para identificar possíveis credenciais, tokens e outros segredos expostos.

**Resultado local:** nenhum segredo identificado.

### Trivy

Análise da imagem Docker para identificação de vulnerabilidades conhecidas.

| Imagem | HIGH | CRITICAL |
|---|---:|---:|
| `api-service-pattern:2.0` | 11 | 0 |
| `api-service-pattern:3.0` | 0 | 0 |

As vulnerabilidades inicialmente identificadas estavam associadas a dependências incluídas na instalação global do npm na imagem de execução.

Após a remoção das ferramentas desnecessárias do runtime e a reconstrução da imagem, a nova análise não detectou vulnerabilidades HIGH ou CRITICAL.

Esses resultados correspondem às verificações realizadas durante o desenvolvimento e podem mudar com novas divulgações de vulnerabilidades.

## Pipeline DevSecOps

O workflow `.github/workflows/ci.yml` utiliza o GitHub Actions para executar verificações automaticamente em eventos de `push` e `pull_request` na branch `main`.

### Etapas da pipeline

1. Checkout do repositório.
2. Configuração do Node.js 22.
3. Instalação das dependências com `npm ci`.
4. Execução dos testes com `npm test`.
5. Auditoria com `npm audit --audit-level=high`.
6. Detecção de segredos com Gitleaks.
7. Construção da imagem Docker.
8. Análise de vulnerabilidades HIGH e CRITICAL com Trivy.

O Trivy está configurado para retornar código de erro quando identificar vulnerabilidades nas severidades selecionadas.

### Resultado no GitHub Actions

- **Execução #1:** falhou devido a uma referência de versão inválida da ação Trivy.
- **Correção:** ajuste da referência da ação no workflow.
- **Execução #2:** concluída com sucesso em aproximadamente 55 segundos.

Essa experiência permitiu praticar também o diagnóstico e a correção de falhas de configuração em pipelines de CI.

## Aprendizados

O desenvolvimento deste desafio proporcionou experiência prática em:

- Estruturação e teste de uma API REST.
- Construção e otimização de imagens Docker.
- Aplicação do princípio de menor privilégio.
- Análise e remediação de vulnerabilidades.
- Detecção de possíveis segredos no código e no histórico Git.
- Automação de verificações de qualidade e segurança.
- Diagnóstico de falhas no GitHub Actions.
- Rastreabilidade das alterações por meio de commits.

## Melhorias futuras

- Fixar as ações do GitHub Actions em versões imutáveis.
- Ampliar a cobertura de testes.
- Adicionar testes de integração.
- Gerar relatórios e evidências das análises de segurança.
- Avaliar uma imagem de runtime ainda mais enxuta.
- Adaptar a aplicação para TypeScript, caso exigido pela atividade acadêmica.

## Autoria

**Alexsandra Tavares**

Estudante de Engenharia de Software e Segurança da Informação, com foco em DevOps, DevSecOps, Blue Team e Gestão de Vulnerabilidades.

[GitHub](https://github.com/alexsabrasil) | [LinkedIn](https://www.linkedin.com/in/aletavaress/)
