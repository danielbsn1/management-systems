# management-systems

Sistema web para gerenciamento de patrimônio empresarial: controle de **equipamentos**, **funcionários**, **empréstimos** e **solicitações**, com painel de relatórios e notificações.

Desenvolvido com **Laravel 12** + **React (Inertia.js)** + **MySQL**, rodando em **Docker**.

---

## Funcionalidades

- **Autenticação** com login/logout e controle de acesso por papel (`admin` / `user`)
- **Dashboard** com métricas: total de equipamentos, disponíveis, em uso, em manutenção e funcionários
- **Equipamentos**: cadastro, edição, filtros por tipo/status e importação via CSV
- **Funcionários**: cadastro, edição, vínculo com equipamentos e importação via CSV
- **Empréstimos**: registro e devolução de equipamentos vinculados a funcionários
- **Solicitações**: funcionário solicita um equipamento; o admin aprova ou rejeita (com notificação)
- **Notificações**: central de notificações para o usuário
- **Relatórios**: listagens e exportação em PDF (equipamentos, funcionários, empréstimos)
- **Usuários**: gestão de contas e papéis (área administrativa)
- Interface responsiva com **Tailwind CSS** e **React**

> **Observação:** o registro público foi removido. Usuários são criados apenas pelo administrador.

---

## Tecnologias

| Camada         | Tecnologia                         |
| -------------- | ---------------------------------- |
| Backend        | Laravel 12 (PHP 8.3)               |
| Frontend       | React 19 + TypeScript (Inertia.js) |
| Estilização    | Tailwind CSS 4                     |
| Build          | Vite 7                             |
| Banco de dados | MySQL 8.0                          |
| Servidor web   | Nginx                              |
| Infraestrutura | Docker + Docker Compose            |

---

## Instalação com Docker (desenvolvimento)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a passo

> Credenciais padrão do admin: `admin@admin.com` / `admin123`

**1. Clone o repositório**

```bash
git clone -b back-end https://github.com/danielbsn1/sistema-gerenciais.git
cd sistema-gerenciais
```

**2. Configure o ambiente**

```bash
cp .env.example .env
```

O `.env` de exemplo já vem pronto para o Docker (banco com `DB_HOST=db`). Ajuste `DB_USERNAME`/`DB_PASSWORD` se precisar:

```env
APP_NAME="Sistema Gerenciais"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sistema-gerenciais
DB_USERNAME=root
DB_PASSWORD=root
```

**3. Suba os containers**

```bash
docker compose up -d
```

O Compose sobe 5 serviços: `app` (PHP-FPM), `vite` (HMR na porta 5173), `nginx` (porta 8000), `db` (MySQL na porta 3307) e `phpmyadmin` (porta 8080).

**4. Instale as dependências e gere a chave**

```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
```

**5. Rode as migrations**

```bash
docker compose exec app php artisan migrate
```

**6. Popule com dados de exemplo (opcional)**

Cria o usuário `admin@admin.com` / `admin123` e dados fictícios para testar:

```bash
docker compose exec app php artisan db:seed
```

Ou crie apenas o usuário administrador:

```bash
docker compose exec app php artisan tinker
```

```php
App\Models\User::create([
    'name'     => 'Seu Nome',
    'email'    => 'seu@email.com',
    'password' => bcrypt('sua_senha'),
    'role'     => 'admin',
]);
```

**7. Acesse**

| Serviço      | URL                    |
| ------------ | ---------------------- |
| Aplicação    | http://localhost:8000  |
| Vite (HMR)   | http://localhost:5173  |
| phpMyAdmin   | http://localhost:8080  |
| MySQL        | localhost:3307 (root/root) |

> Com o `npm run build` também é possível servir os assets compilados (sem o container `vite`), mas para desenvolvimento o HMR da porta 5173 é o recomendado.

---

## Instalação Manual (sem Docker)

### Pré-requisitos

- PHP >= 8.2
- Composer
- Node.js >= 20.19
- MySQL 8.0

### Passo a passo

```bash
git clone -b back-end https://github.com/danielbsn1/sistema-gerenciais.git
cd sistema-gerenciais

composer install
npm install

cp .env.example .env        # ajuste DB_* para o seu MySQL
php artisan key:generate
php artisan migrate

npm run build               # ou npm run dev (para desenvolvimento)
php artisan serve           # http://localhost:8000
```

---

## Deploy em produção

O projeto inclui arquivos de produção prontos (`Dockerfile.prod`, `docker-compose.prod.yml`, `docker/nginx.prod.conf` e `.env.prod.example`), validados de ponta a ponta.

Siga o passo a passo completo (VPS Hostinger com Pix, SSL, backups) em [**DEPLOY.md**](DEPLOY.md).

---

## Estrutura do Projeto

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Resources/          # API Resources (dados mínimos ao frontend)
│   ├── Imports/                # Importação de CSV
│   ├── Models/
│   └── Notifications/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── ts/
│   │   ├── components/         # Componentes React (UI)
│   │   └── pages/              # Páginas Inertia (React)
│   └── views/
├── routes/
│   ├── web.php
│   └── auth.php
├── docker/
│   ├── nginx.conf              # config dev
│   └── nginx.prod.conf         # config produção
├── public/
├── .env.example
├── docker-compose.yml          # ambiente dev
├── docker-compose.prod.yml     # ambiente produção
├── Dockerfile.prod
├── DEPLOY.md
└── package.json
```

---

## Variáveis de Ambiente (principais)

| Variável         | Descrição                            | Padrão                  |
| ---------------- | ------------------------------------ | ----------------------- |
| `APP_ENV`        | Ambiente (`local` / `production`)    | `local`                 |
| `APP_DEBUG`      | Exibir erros detalhados              | `true`                  |
| `APP_URL`        | URL da aplicação                     | `http://localhost`      |
| `DB_HOST`        | Host do banco (usar `db` no Docker)  | `127.0.0.1`             |
| `DB_DATABASE`    | Nome do banco                        | `sistema-gerenciais`    |
| `DB_USERNAME`    | Usuário do banco                     | `root`                  |
| `DB_PASSWORD`    | Senha do banco                       | `root` (dev Docker)     |
| `SESSION_DRIVER` | Sessões no banco                     | `database`              |
| `QUEUE_CONNECTION`| Filas no banco                       | `database`              |
| `CACHE_STORE`    | Cache no banco                       | `database`              |
| `MAIL_MAILER`    | Envio de e-mail (`log` em dev)       | `log`                   |

---

## Segurança

- Todas as rotas protegidas por autenticação e controle de papel (`admin` / `user`)
- Senhas armazenadas com `bcrypt`
- Tokens CSRF em todos os formulários
- Validação de dados em todos os endpoints
- API Resources expõem apenas os dados necessários ao frontend
- Middleware de cabeçalhos de segurança (CSP, `X-Frame-Options`, etc.)

---

## Manual 
https://asset-manager-manual-3paq.vercel.app/

## Autor

Desenvolvido por **Daniel**
