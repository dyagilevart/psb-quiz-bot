# Telegram Bot Template

Это шаблон телеграм бота на TypeScript

### Стек
- nestjs
- MongoDB
- telegraf
- typescript

### Чем может быть полезен?
В проекте настроен базовый шаблон с модулями и сервиса для легкого старта. От вас требуется только реализовать команды своего бота

### Как запустить?
#### Prod
Вам потребуется env файл с параметрами для запуска приложения
```
docker compose up 
```
#### DEV
Предварительно запустите БД
```
docker compose -f 'docker-compose.yaml' up -d --build 'mongo' 
```
затем
```
npm i
npm run start
```


### .env файл для docker-compose
Пример файла. 
>  Обязательно ${...} замените на свои значения
```
MONGODB_USER=${USER}
MONGODB_PASSWORD=${PASSWORD}
MONGODB_LOCAL_PORT=${27017}
MONGODB_DOCKER_PORT=${27017}
MONGODB_DATABASE=${DB_NAME}

NODE_LOCAL_PORT=${8080}
NODE_DOCKER_PORT=${3000}

TELEGRAM_BOT_TOKEN=${TOKEN}
```