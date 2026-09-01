# Mercado — Sistema de Caixa de Supermercado

Projeto acadêmico (Engenharia de Software / Requisitos) de um sistema de controle de
fluxo de caixas para supermercado: cadastro de produtos por categoria, registro de
vendas, nota fiscal simplificada, controle de estoque com alerta automático e
dashboards de produtos, vendas e estoque.

Ver a documentação de requisitos completa em [`DOCUMENTACAO.md`](./DOCUMENTACAO.md).

## Stack

- **Backend:** NestJS + Prisma ORM
- **Banco de dados:** PostgreSQL
- **Frontend:** Next.js (App Router) + shadcn/ui (Tailwind CSS)
- **Autenticação:** JWT (login único, com permissões diferentes para `ADMIN` e
  `FUNCIONARIO`)

Estrutura do monorepo:

```
market-manager/
  api/     # Backend NestJS
  web/     # Frontend Next.js
  docker-compose.yml
```

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (para o PostgreSQL)

## 1. Subir o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe um PostgreSQL em `localhost:5433` (usuário/senha/banco: `market`/`market`/
`market_manager`). A porta `5433` foi escolhida para não conflitar com um Postgres
local eventualmente já rodando na `5432`; ajuste em `docker-compose.yml` e nos `.env`
se preferir outra porta.

## 2. Backend (`api/`)

```bash
cd api
cp .env.example .env   # ajuste se necessário
npm install
npx prisma migrate dev   # aplica as migrations
npx prisma db seed       # popula categorias, produtos e usuários de exemplo
npm run start:dev        # http://localhost:3001
```

Variáveis de ambiente (`api/.env`):

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `8h`) |
| `PORT` | Porta do servidor Nest (padrão `3001`) |
| `WEB_URL` | Origem liberada no CORS (padrão `http://localhost:3000`) |

### Usuários de teste (criados pelo seed)

| Papel | Email | Senha |
|---|---|---|
| Administrador | `admin@email.com` | `admin@123` |
| Funcionário (caixa) | `func@email.com` | `func@123` |

## 3. Frontend (`web/`)

```bash
cd web
cp .env.local.example .env.local   # ajuste se necessário
npm install
npm run dev   # http://localhost:3000
```

Variável de ambiente (`web/.env.local`):

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API Nest (padrão `http://localhost:3001`) |

## Páginas

| Rota | Descrição |
|---|---|
| `/login` | Login único, redireciona conforme o papel do usuário |
| `/caixa` | Operação do caixa: busca de produto, carrinho, dados do cliente, forma de pagamento e emissão de nota fiscal |
| `/admin/produtos` | CRUD de produtos e categorias |
| `/admin/estoque` | Painel de estoque com alertas críticos/médios |
| `/admin/vendas` | Painel de vendas com filtro por período e cancelamento |
| `/admin/fechamento` | Relatório diário de fechamento de caixa |

## Decisões de escopo (projeto de disciplina)

- **Autenticação no frontend**: o token JWT é guardado em `localStorage` e a proteção
  de rota no Next.js é apenas para UX (esconder/mostrar telas). A autorização real por
  papel (`ADMIN`/`FUNCIONARIO`) é sempre validada no backend via guards do NestJS.
- **Alerta de estoque (RNF-03)**: o aviso automático a fornecedor/gerente é simulado
  via log (`Logger.warn`) no console da API, junto com o registro de um `StockAlert`
  consultável pelo painel de estoque.
- **Cancelamento (RF-11)**: como o fluxo de caixa finaliza a venda em uma única
  chamada, o cancelamento (de item ou da venda inteira) é aplicado sobre uma venda já
  registrada — o estoque é restaurado automaticamente e a justificativa é obrigatória.
- **Concorrência (RNF-06)**: a baixa de estoque usa `updateMany` com condição de
  quantidade suficiente dentro de uma transação Prisma, evitando estoque negativo
  quando múltiplos caixas vendem o mesmo produto simultaneamente.

## Comandos úteis

```bash
# Backend
cd api
npm run build          # build de produção
npx prisma studio       # inspecionar o banco visualmente

# Frontend
cd web
npm run build           # build de produção
npm run lint             # eslint
```

## Deploy (produção)

Stack sugerida: **Neon** (Postgres), **Render** (API NestJS) e **Vercel** (frontend
Next.js). Cada peça é independente — pode trocar qualquer uma por outro provedor.

### 1. Banco de dados — Neon

1. Crie um projeto em [neon.tech](https://neon.tech) (tem free tier).
2. Copie a *connection string* (formato `postgresql://usuario:senha@host/banco?sslmode=require`).
3. Rode as migrations contra o banco do Neon a partir da sua máquina:
   ```bash
   cd api
   DATABASE_URL="<connection string do Neon>" npx prisma migrate deploy
   DATABASE_URL="<connection string do Neon>" npx prisma db seed   # opcional, dados de exemplo
   ```

### 2. Backend — Render

O repositório já tem um `render.yaml` (Blueprint) configurado com `rootDir: api`,
build (`npm install --include=dev && npx prisma generate && npm run build`) e start
(`npm run start:migrate:prod`, que roda `prisma migrate deploy` antes de subir o
servidor a cada deploy).

1. Em [render.com](https://render.com), **New > Blueprint**, aponte para este repositório.
2. Configure as variáveis de ambiente pedidas (`sync: false` no blueprint = você
   preenche na hora):
   - `DATABASE_URL` — connection string do Neon.
   - `WEB_URL` — URL do frontend na Vercel (pode preencher depois do passo 3 e
     redeployar; aceita múltiplas origens separadas por vírgula).
   - `JWT_SECRET` é gerado automaticamente pelo Render.
3. Deploy. Anote a URL pública gerada (algo como `https://market-manager-api.onrender.com`).

Sem `render.yaml`/Blueprint, dá pra criar o Web Service manualmente com os mesmos
comandos de build/start e Root Directory `api`.

### 3. Frontend — Vercel

1. Em [vercel.com](https://vercel.com), importe o repositório.
2. Em **Root Directory**, selecione `web`.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_API_URL` apontando para a URL
   do backend no Render (passo anterior).
4. Deploy. Depois, volte no Render e atualize `WEB_URL` com a URL final da Vercel para
   o CORS liberar o frontend em produção.
