# Bügın’ Tenders

Найдите товары, надёжных поставщиков, честные цены и актуальные объявления — всё в одном умном поиске.

![Main page](https://raw.githubusercontent.com/complagaet/BuginTenders/refs/heads/main/screenshots/1.png)
![Main page](https://raw.githubusercontent.com/complagaet/BuginTenders/refs/heads/main/screenshots/2.png)

## Launch

Установите Yarn

```bash
npm install -g yarn
```

Клонируйте репозиторий и установите зависимости:

```bash
git clone https://github.com/complagaet/BuginTenders.git
cd BuginTenders

yarn install
```

Создайте `.env` файлы для клиента и админки:

**`packages/backend/.env`**

```dotenv
PORT=3333
DB_URL=mongodb+srv://...
JWT_SECRET=super-secret-key
JWT_LIFETIME=15d
FRONTEND_ORIGINS=http://localhost:3000,http://192.168.31.27:3000...
GEMINI_API_KEY=super-secret-key
```

`DB_URL, JWT_SECRET, JWT_LIFETIME` оставлены на будущее. В проекте реализована простая система учетных записей, но она не используется.

**`packages/frontend/.env`**

```dotenv
NEXT_PUBLIC_API_URL=http://192.168.31.27:3333
```

## Development

Запуск в режиме разработки (одновременно бекэнд и фронтэнд):

```bash
yarn dev
```

Сборка проекта:

```bash
yarn build
```

Запуск в production:

```bash
yarn start
```

Очистка кэша и сборок:

```bash
yarn clean
```
