📘 Translator
Translator — это серверное приложение на NestJS, предоставляющее API для перевода текста с использованием различных провайдеров, таких как Deepseek и Google Translate[^1].

[^1]: Необходимо 

~Особенности
Модульная архитектура NestJS с поддержкой нескольких провайдеров перевода
Интерфейс TranslatorProvider для легкой интеграции новых сервисов
Поддержка асинхронных переводов и обработки ошибок
Готовность к расширению и масштабированию

~Установка и запуск [^2]

```
# Клонируйте репозиторий
git clone https://github.com/Andrew-Causelof/translator.git
cd translator

# Установите зависимости
npm install

# Запустите приложение
npm run start
```
[^2]:*** Пока не создана автогенерация тестового проекта в таблице, без него не будет работать запрос

Перед запуском проекта необходимо создать файл .env в корне проекта и прописать в нём следующие переменные:

```
# Ключ API для Deepseek или другого провайдера перевода
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GPT_API_KEY=your_gpt_api_key_here

# Настройки подключения к базе данных (если используется)
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=translator_db

```

Приложение будет доступно по адресу: http://localhost:3001

📂 Структура проекта

```
translator/
├── src/
│   ├── app.controller.ts       # Контроллер для обработки HTTP-запросов
│   ├── app.module.ts           # Главный модуль приложения
│   ├── app.service.ts          # Сервис приложения
│   ├── translator/
│   │   ├── translator.interface.ts   # Интерфейс для провайдеров перевода
│   │   ├── deepseek.translator.ts    # Реализация провайдера Deepseek
│   │   └── google.translator.ts      # Реализация провайдера Google Translate
├── test/                       # Тесты
├── .eslintrc.js                # Конфигурация ESLint
├── .prettierrc                 # Конфигурация Prettier
├── package.json
└── README.md
```

~Использование API

```
curl -X POST http://localhost:3000/translate \
  -H "Content-Type: application/json" \
  -d '{
  "text": "Возможно ли упасть из положения лежа ?",
  "lang": "en",
  "project": "test-project",
  "services": ["deepseek"],
  "key": "moq"
}'
```
пример ответа 

```
{
    "id": 2,
    "key": "test-project:moq",
    "lang": "en",
    "original": "Возможно ли упасть из положения лежа ?",
    "translated": "Is it possible to fall from a lying position?",
    "createdAt": "2025-05-30T11:21:23.337Z"
}
```

📄 Лицензия
Этот проект распространяется под лицензией MIT.


