# Documentação de Requisitos — Sistema de Caixa de Supermercado

Fichas de requisito no padrão apresentado em aula (Identificador, Nome, Módulo, Data
de criação/Autor, Data de alteração/Autor, Versão/Dependências, Descrição).

## Requisitos Funcionais (RF)

| Campo | RF-01 |
|---|---|
| **Identificador** | RF-01 |
| **Nome** | Login administrador |
| **Módulo** | Autenticação |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Cadastro de usuários (RF-00) |
| **Descrição** | Permite que o administrador se autentique com email e senha, recebendo um token JWT com permissões completas sobre o sistema. |

| Campo | RF-02 |
|---|---|
| **Identificador** | RF-02 |
| **Nome** | Login funcionário |
| **Módulo** | Autenticação |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Cadastro de usuários (RF-00) |
| **Descrição** | Permite que o funcionário de caixa se autentique com email e senha, recebendo um token JWT com permissões restritas (apenas operação de caixa) em relação ao administrador. |

| Campo | RF-03 |
|---|---|
| **Identificador** | RF-03 |
| **Nome** | Dashboard de produtos |
| **Módulo** | Produtos |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — CRUD de produtos (RF-06) |
| **Descrição** | Lista todos os produtos cadastrados, exibindo categoria, quantidade em estoque e preço de cada item. |

| Campo | RF-04 |
|---|---|
| **Identificador** | RF-04 |
| **Nome** | Dashboard de vendas |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Nota fiscal (RF-08) |
| **Descrição** | Mostra os produtos mais vendidos, com filtro por período (semana, mês, 3 meses e semestre). |

| Campo | RF-05 |
|---|---|
| **Identificador** | RF-05 |
| **Nome** | Dashboard de estoque |
| **Módulo** | Estoque |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — CRUD de produtos (RF-06) |
| **Descrição** | Exibe os produtos em estado crítico e médio de estoque, calculados a partir dos níveis configurados por produto. |

| Campo | RF-06 |
|---|---|
| **Identificador** | RF-06 |
| **Nome** | CRUD de produtos e categorias |
| **Módulo** | Produtos |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — nenhuma |
| **Descrição** | Permite ao administrador criar, listar, editar e remover produtos e categorias (Frios/Quentes e suas variações). |

| Campo | RF-07 |
|---|---|
| **Identificador** | RF-07 |
| **Nome** | Dados do cliente |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | 31/08/2026 — Arthur Roberto |
| **Versão / Dependências** | 1.1 — nenhuma |
| **Descrição** | Solicita o CPF do cliente no momento da venda (CPF na nota), reutilizando o cadastro se já existir. Nome e contato foram removidos do fluxo por não refletirem a prática real de um caixa de supermercado. |

| Campo | RF-08 |
|---|---|
| **Identificador** | RF-08 |
| **Nome** | Nota fiscal simplificada |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Dados do cliente (RF-07), Formas de pagamento (RF-10) |
| **Descrição** | Gera uma nota fiscal simplificada ao finalizar a venda, listando produto, quantidade, valor individual e valor final de cada item e da venda. |

| Campo | RF-09 |
|---|---|
| **Identificador** | RF-09 |
| **Nome** | Histórico de vendas |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Nota fiscal (RF-08) |
| **Descrição** | Permite consultar os produtos mais e menos vendidos, filtrando por semana, mês e ano. |

| Campo | RF-10 |
|---|---|
| **Identificador** | RF-10 |
| **Nome** | Formas de pagamento |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — nenhuma |
| **Descrição** | Permite registrar a venda com uma das formas de pagamento: crédito, débito, pix ou dinheiro. |

| Campo | RF-11 (extra) |
|---|---|
| **Identificador** | RF-11 |
| **Nome** | Cancelamento de venda/item |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Nota fiscal (RF-08) |
| **Descrição** | Permite ao administrador cancelar um item ou a venda inteira já registrada, exigindo justificativa e restaurando automaticamente o estoque dos itens cancelados. |

| Campo | RF-12 (extra) |
|---|---|
| **Identificador** | RF-12 |
| **Nome** | Fechamento de caixa |
| **Módulo** | Vendas |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Nota fiscal (RF-08), Formas de pagamento (RF-10) |
| **Descrição** | Gera um relatório diário de fechamento com o total vendido e o total por forma de pagamento. |

## Requisitos Não Funcionais (RNF)

| Campo | RNF-01 |
|---|---|
| **Identificador** | RNF-01 |
| **Nome** | Interface do sistema |
| **Módulo** | Frontend |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — nenhuma |
| **Descrição** | Interface objetiva, clara, prática e organizada, tanto para o usuário (caixa) quanto para o administrador. |

| Campo | RNF-02 |
|---|---|
| **Identificador** | RNF-02 |
| **Nome** | Conexão com banco de dados |
| **Módulo** | Backend |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — nenhuma |
| **Descrição** | Persistência dos dados via Prisma ORM sobre PostgreSQL, com migrations versionadas em `api/prisma/migrations`. |

| Campo | RNF-03 |
|---|---|
| **Identificador** | RNF-03 |
| **Nome** | Alerta automático de estoque |
| **Módulo** | Estoque |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — CRUD de produtos (RF-06) |
| **Descrição** | Ao atingir nível crítico ou médio de estoque, o sistema dispara um aviso automático simulado (log da API) para o fornecedor e o gerente, além de registrar o alerta para consulta no painel de estoque. |

| Campo | RNF-04 |
|---|---|
| **Identificador** | RNF-04 |
| **Nome** | Painéis segmentados |
| **Módulo** | Frontend |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Dashboards (RF-03, RF-04, RF-05) |
| **Descrição** | Painéis separados de produtos, vendas e estoque, cada um com sua própria visualização e filtros específicos. |

| Campo | RNF-05 (extra) |
|---|---|
| **Identificador** | RNF-05 |
| **Nome** | Segurança |
| **Módulo** | Autenticação |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — Login (RF-01, RF-02) |
| **Descrição** | Senhas armazenadas com hash bcrypt e autenticação stateless via JWT; nenhuma senha é mantida em texto puro em nenhuma camada do sistema. |

| Campo | RNF-06 (extra) |
|---|---|
| **Identificador** | RNF-06 |
| **Nome** | Performance e concorrência |
| **Módulo** | Vendas / Estoque |
| **Data de criação / Autor** | 30/08/2026 — Arthur Roberto |
| **Data de alteração / Autor** | — |
| **Versão / Dependências** | 1.0 — CRUD de produtos (RF-06), Nota fiscal (RF-08) |
| **Descrição** | O sistema suporta múltiplos caixas registrando vendas simultaneamente sem conflito de estoque, usando transações do Prisma e atualização condicional de quantidade para evitar estoque negativo. |
