# Resumo geral do projeto ChampManager

## 1. Visão geral

O **ChampManager** é uma aplicação web Full Stack para gerenciamento de campeonatos de futebol amador. O projeto foi desenvolvido para uma disciplina de Interação Humano-Computador (IHC), portanto combina funcionalidades reais com problemas de usabilidade intencionais para posterior avaliação pelas heurísticas de Nielsen.

O sistema funciona em desktop e celular. No desktop utiliza Sidebar; no celular utiliza Bottom Navigation com apenas ícones, propositalmente sem legendas visíveis.

## 2. Tecnologias

### Backend

- Node.js
- NestJS 11
- TypeScript 6
- Prisma ORM 7
- PostgreSQL 17
- JWT com Passport
- bcryptjs para hash de senhas
- class-validator e ValidationPipe
- Multer em memória para upload de imagens
- Docker Compose para o PostgreSQL

### Frontend

- React 19
- Vite 8
- TypeScript
- Tailwind CSS 4
- React Router 7
- TanStack React Query 5
- Axios
- React Hook Form
- Zod 4
- Lucide React

## 3. Organização do repositório

O backend está na raiz do projeto:

```text
src/
  common/                 filtros e recursos transversais
  generated/prisma/       client gerado pelo Prisma
  modules/
    auth/
    championships/
    dashboard/
    health/
    matches/
    players/
    profile/
    standings/
    statistics/
    teams/
  shared/database/        PrismaModule e PrismaService
  app.module.ts
  main.ts
```

O frontend está em:

```text
frontend/src/
  app/                    providers, rotas e layout principal
  features/               APIs, schemas e tipos por domínio
  pages/                  páginas da aplicação
  shared/                 cliente HTTP, componentes, hooks e utilitários
```

Outros arquivos importantes:

- `prisma/schema.prisma`: modelo completo do banco.
- `prisma/seed.ts`: dados demonstrativos idempotentes.
- `docker-compose.yml`: PostgreSQL local na porta 5433.
- `HEURISTICAS_INTENCIONAIS.md`: documentação acadêmica das falhas de UX.
- `TUTORIAL_EXECUCAO.md`: tutorial para executar no PC e celular.

## 4. Autenticação e segurança

Funcionalidades implementadas:

- cadastro;
- login;
- JWT Bearer;
- hash bcrypt com custo 12;
- rotas protegidas com `JwtAuthGuard`;
- recuperação do usuário por `/auth/me`;
- logout no cliente;
- isolamento dos dados pelo ID do usuário;
- validação e normalização de e-mail;
- Helmet, CORS e tratamento global de exceções.

O logout é stateless: o frontend apaga o token, mas não existe blacklist de JWT no servidor.

## 5. Funcionalidades implementadas

### Dashboard

- quantidade de campeonatos;
- quantidade de times;
- quantidade de jogadores;
- quantidade de próximos jogos;
- lista dos próximos jogos;
- últimos resultados;
- dados filtrados pelo usuário autenticado.

### Campeonatos

- CRUD completo;
- nome, temporada, descrição e limite de times;
- formatos pontos corridos, grupos e mata-mata;
- datas inicial e final;
- busca, paginação e ordenação;
- seleção dos times participantes;
- limite máximo de participantes;
- bloqueio da alteração dos participantes depois de gerar jogos;
- geração da tabela escondida em menu de três pontos.

### Times

- CRUD completo;
- nome, cidade, estado, técnico e cores;
- upload e pré-visualização do escudo;
- formatos JPG, PNG e WebP;
- limite de 2 MB;
- busca e paginação;
- exclusão do arquivo ao remover o time;
- propriedade direta pelo usuário.

### Jogadores

- CRUD completo;
- vínculo obrigatório com um time do usuário;
- nome, número, posição, nascimento e capitão;
- idade calculada a partir da data de nascimento;
- upload e pré-visualização da foto;
- limite de 3 MB;
- busca e filtros por time e posição;
- paginação;
- número único dentro do elenco;
- remoção da foto ao excluir o jogador.

### Jogos

- geração automática de partidas;
- pontos corridos com algoritmo round-robin;
- divisão alternada em grupos A e B;
- primeira rodada de mata-mata;
- edição de data, horário e local;
- registro e edição do placar;
- filtros por campeonato e status;
- paginação;
- recálculo automático da classificação após salvar o resultado.

### Classificação

- posição;
- pontos;
- jogos;
- vitórias, empates e derrotas;
- gols pró e contra;
- saldo de gols;
- aproveitamento;
- ordenação clicando nos cabeçalhos;
- filtro por campeonato.

Critérios atuais de desempate:

1. pontos;
2. saldo de gols;
3. gols pró;
4. nome do time.

### Estatísticas

- melhor ataque;
- melhor defesa;
- total de gols;
- média de gols por partida;
- partidas finalizadas;
- artilheiro com base nos registros da tabela `Goal`.

O placar comum não solicita os autores dos gols. Os eventos individuais de gol existem no modelo e no seed, mas ainda não existe uma interface para cadastrá-los manualmente.

### Perfil

- alteração do nome;
- alteração do e-mail;
- alteração da senha;
- atualização do usuário no cabeçalho e Sidebar;
- nova senha armazenada com bcrypt.

### Tema e responsividade

- tema claro e escuro persistente;
- layout mobile first;
- Sidebar no desktop;
- Bottom Navigation fixa no celular;
- formulários, cards e modais responsivos;
- tabela de classificação com rolagem horizontal no celular.

## 6. Modelo do banco

Principais modelos:

- `User`
- `Championship`
- `Team`
- `ChampionshipTeam`
- `Player`
- `Match`
- `Standing`
- `Goal`

Principais relacionamentos:

- usuário possui campeonatos e times;
- campeonato possui participantes através de `ChampionshipTeam`;
- jogador pertence a um time;
- jogo pertence a um campeonato e possui mandante e visitante;
- classificação relaciona campeonato e time;
- gol relaciona partida, jogador e time.

## 7. Geração de partidas

### Pontos corridos

É gerado um turno completo, com cada time enfrentando todos os outros uma vez.

### Grupos

Os times são distribuídos alternadamente entre Grupo A e Grupo B. Dentro de cada grupo é gerado um turno completo.

### Mata-mata

Atualmente é gerada somente a primeira rodada, pareando os times na ordem em que foram adicionados. O avanço automático dos vencedores para novas fases ainda não foi implementado.

## 8. Seed demonstrativo

Comando:

```powershell
npm run prisma:seed
```

Credenciais:

```text
admin@champmanager.com
Champ123!
```

O seed cria:

- 1 usuário;
- 1 campeonato;
- 8 times;
- 15 jogadores por time, totalizando 120;
- 28 partidas de pontos corridos;
- 8 partidas finalizadas;
- 25 eventos de gol;
- classificação com 8 posições;
- dados suficientes para Dashboard, resultados e estatísticas.

O seed é idempotente: pode ser executado novamente sem duplicar os dados demonstrativos.

## 9. Rotas principais da API

### Autenticação

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Dashboard e perfil

```text
GET   /api/dashboard
PATCH /api/profile
```

### Campeonatos

```text
GET    /api/championships
GET    /api/championships/:id
POST   /api/championships
PATCH  /api/championships/:id
DELETE /api/championships/:id
GET    /api/championships/:id/teams
PATCH  /api/championships/:id/teams
```

### Times

```text
GET    /api/teams
GET    /api/teams/:id
POST   /api/teams
PATCH  /api/teams/:id
POST   /api/teams/:id/crest
DELETE /api/teams/:id
```

### Jogadores

```text
GET    /api/players
GET    /api/players/:id
POST   /api/players
PATCH  /api/players/:id
POST   /api/players/:id/photo
DELETE /api/players/:id
```

### Jogos

```text
GET   /api/matches
POST  /api/matches/generate/:championshipId
PATCH /api/matches/:id
PATCH /api/matches/:id/result
```

### Classificação e estatísticas

```text
GET /api/standings?championshipId=UUID
GET /api/statistics?championshipId=UUID
```

## 10. Rotas principais do frontend

```text
/login
/cadastro
/
/campeonatos
/campeonatos/novo
/campeonatos/:id/editar
/campeonatos/:id/times
/times
/times/novo
/times/:id/editar
/jogadores
/jogadores/novo
/jogadores/:id/editar
/jogos
/classificacao
/estatisticas
/perfil
```

## 11. Problemas de usabilidade intencionais

As seguintes falhas não devem ser corrigidas sem considerar o objetivo acadêmico:

1. exclusão sem confirmação;
2. ausência de toast de sucesso;
3. campo de busca pequeno;
4. navegação mobile somente com ícones;
5. ausência de loading em times, jogadores e jogos;
6. mensagens genéricas de erro;
7. botões Salvar e Excluir próximos e iguais na edição de campeonato;
8. ausência de breadcrumb;
9. geração da tabela escondida no menu de três pontos;
10. validação somente após envio;
11. contraste reduzido em textos secundários;
12. resultado fecha sem confirmação visual;
13. verbos Novo, Adicionar e Criar inconsistentes;
14. classificação horizontal no celular;
15. ordenação sem indicador nos cabeçalhos.

Todos os detalhes estão em `HEURISTICAS_INTENCIONAIS.md`.

## 12. Execução local

Requisitos:

- Node.js 20 ou superior;
- Docker Desktop.

Preparação:

```powershell
npm install
cd frontend
npm install
cd ..
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
```

Backend:

```powershell
npm run start:dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

Endereços:

```text
Frontend: http://localhost:5173
API:      http://localhost:3000/api
Banco:    localhost:5433
```

Para acessar pelo celular, é necessário colocar o IP local do computador em `frontend/.env`:

```env
VITE_API_URL=http://IP-DO-COMPUTADOR:3000/api
```

E iniciar o Vite com:

```powershell
npm run dev -- --host 0.0.0.0
```

## 13. Validações e testes já realizados

Foram testados manualmente através da API:

- cadastro, login, JWT e logout;
- rejeição de acesso sem token;
- isolamento entre dois usuários;
- criação, edição, busca e exclusão de campeonatos;
- upload e remoção de escudos;
- upload e remoção de fotos;
- número duplicado no mesmo elenco retornando HTTP 409;
- geração de seis partidas para quatro times;
- edição de agenda e local;
- registro de resultado;
- recálculo da classificação;
- estatísticas;
- alteração de perfil e senha;
- senha antiga retornando HTTP 401;
- seed executado repetidamente.

Comandos que atualmente passam:

```powershell
npm run lint
npm run build
npx prisma validate
npx prisma migrate status

cd frontend
npm run lint
npm run build
```

## 14. Limitações e pendências técnicas

Pontos importantes para continuação:

- Não existem testes automatizados unitários ou E2E; os testes feitos foram manuais.
- O bundle principal do frontend está em torno de 574 KB e o Vite emite aviso acima de 500 KB. É recomendável aplicar lazy loading e code splitting nas páginas.
- Os uploads são armazenados em `uploads/` no disco local. Isso funciona localmente, mas precisa de Cloudinary, S3 ou disco persistente para produção.
- O CORS aceita origens dinamicamente; em produção deve ser restrito ao endereço do frontend.
- Não há refresh token nem blacklist de JWT.
- O mata-mata não avança vencedores automaticamente.
- Não existe interface para registrar autores e minutos dos gols; somente o seed popula `Goal`.
- O cadastro de resultado não valida se a soma dos eventos individuais de gol corresponde ao placar.
- Não existe recuperação de senha por e-mail.
- Não existe remoção manual de foto ou escudo sem excluir/substituir a entidade.
- Não existe documentação Swagger/OpenAPI.
- Não foi realizado deploy público.
- O frontend possui algumas páginas extensas em um único arquivo e pode ser componentizado.
- A aplicação foi intencionalmente construída com problemas de usabilidade; não corrigir todos de forma automática.

## 15. Próximas tarefas sugeridas

Dependendo do objetivo da disciplina, boas próximas atividades seriam:

1. criar testes de usabilidade com usuários;
2. executar avaliação heurística de Nielsen;
3. registrar severidade, frequência e impacto dos problemas;
4. comparar tempo e erros entre desktop e celular;
5. criar uma versão corrigida após a avaliação;
6. adicionar testes automatizados;
7. aplicar code splitting no frontend;
8. implementar progressão completa do mata-mata;
9. permitir registrar autores dos gols;
10. preparar deploy com armazenamento externo de imagens.

## 16. Orientação para outro assistente

Antes de alterar o projeto:

1. ler `HEURISTICAS_INTENCIONAIS.md`;
2. não interpretar as falhas acadêmicas como bugs acidentais;
3. preservar isolamento por usuário em todas as consultas;
4. validar propriedade de campeonatos, times e jogadores;
5. executar lint e build no backend e frontend;
6. manter compatibilidade mobile;
7. não apagar o banco ou volumes Docker sem autorização.

Ao propor correções de UX, separar claramente:

- correções técnicas necessárias para funcionamento;
- melhorias que eliminariam uma falha intencional do estudo de IHC.
