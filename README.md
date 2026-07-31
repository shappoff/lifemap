# Life Map

Статический сайт на Next.js с четырьмя режимами просмотра биографий на карте.

## Режимы

- `/explorer` — MapLibre, кластеры, фильтры, боковая панель
- `/story` — scrollytelling с `flyTo` по главам
- `/waypoints` — Leaflet, фото в попапах, слои типов
- `/vitaemap` — карта + таймлайн с синхронизацией

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
