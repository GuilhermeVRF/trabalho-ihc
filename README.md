# ChampManager API

Base backend do ChampManager, construída com NestJS, TypeScript, Prisma ORM e PostgreSQL.

## Requisitos

- Node.js 20 ou superior
- Docker e Docker Compose

## Ambiente local

```bash
copy .env.example .env
npm install
docker compose up -d
npm run prisma:migrate -- --name initial
npm run start:dev
```

A verificação de saúde fica disponível em `GET http://localhost:3000/api/health`.

## Dados demonstrativos

```bash
npm run prisma:seed
```

Credenciais: `admin@champmanager.com` / `Champ123!`. O seed cria um campeonato,
8 times, 120 jogadores, 28 partidas, resultados, gols e classificação.

## Autenticação

- `POST /api/auth/register`: cria uma conta e retorna o token JWT
- `POST /api/auth/login`: autentica por e-mail e senha
- `GET /api/auth/me`: retorna o usuário da sessão (Bearer token)
- `POST /api/auth/logout`: encerra a sessão no cliente (Bearer token)

As senhas são armazenadas somente como hash bcrypt. Rotas privadas podem reutilizar
`JwtAuthGuard` e o decorator `CurrentUser`.

## Organização

- `src/modules`: módulos de negócio por domínio
- `src/common`: recursos transversais da API
- `src/shared`: infraestrutura compartilhada
- `prisma`: schema, migrations e seed do banco

Fundação e autenticação estão concluídas. Regras de negócio, seed e interface serão implementados nas etapas seguintes.
