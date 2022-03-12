# Meating Backend

Сервер для приложения `Meating`

## Инструкция

### Запуск dev сервера

1. Создайте файл `.env` (пример `.env.example`) с настройками окружения.

2. Накатить миграций `yarn run mi:run`.

3. Запуск dev сервера `yarn run start:dev`.

## Скрипты

- `yarn run start` - запуск сервера;
- `yarn run start:dev` - запуск dev сервера;
- `yarn run start:prod` - запуск prod сервера;
- `yarn run mi:gen` - создание миграций;
- `yarn run mi:run` - накатить миграцию;
- `yarn run mi:rev` - откат миграции.
