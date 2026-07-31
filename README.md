# Life Map

Статический сайт на Next.js: биографии на карте в режиме Waypoints (Leaflet).

## Маршруты

- `/` и `/waypoints` — карта с фото в попапах и фильтрами по типам мест

Данные: [`data/biographies.json`](data/biographies.json).

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка SSG

```bash
npm run build
```

Артефакт — папка `out/`.

Для GitHub Pages project site:

```bash
BASE_PATH=/lifemap npm run build
```

## Deploy

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) публикует `out/` на GitHub Pages при push в `main`.

В настройках репозитория: **Settings → Pages → Source: GitHub Actions**.
