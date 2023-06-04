![tests](https://github.com/AcceleratorYandexPracticum/calendar/actions/workflows/backend_lint.yml/badge.svg?branche=backend)

### Запуск проекта

##### 1. Клонировать репозиторий и перейти в директорию infra:
```bash
git clone git@github.com:AcceleratorYandexPracticum/calendar.git
cd infra
```
##### 2. Создать файл .env и заполнить необходимыми данными:

```dotenv
# Настройки DJANGO
DJANGO_SECRET_KEY=secret_key # вставьте секретный ключ
DEBUG=False # Режим дебагера
ALLOWED_HOSTS='localhost 127.0.0.1'

# Подключение к базе данных
DB_ENGINE=django.db.backends.postgresql # указываем, что работаем с postgresql
DB_NAME=db_name # имя базы данных
DB_USER=db_user # логин для подключения к базе данных
DB_PASSWORD=db_password # пароль для подключения к БД (установите свой)
DB_HOST=db_host # название сервиса (контейнера)
DB_PORT=5432  # порт для подключения к БД

# Логин/пароль SMTP-сервера
EMAIL_HOST_USER='your@email.address'
EMAIL_HOST_PASSWORD='your_smtp_password'
```
##### 3. Сборка и развертывание контейнеров

- `docker-compose up -d --build`
- media загружается с локальной машины снаружи контейнера

```text
backend:
  volumes:
    - <Путь до директории на локальной машине>:/app/back_media/
    
nginx:
  volumes:
    - <Путь до директории на локальной машине>:/app/back_media/
```

##### 4. Выполните миграции, соберите статику:

```bash
docker-compose exec backend python manage.py collectstatic --no-input
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Если хотите заполнить базу тестовыми файлами воспользуйтесь командой ниже
docker-compose exec backend python manage.py loaddata ./dump.json
```
#### 4. Создайте суперпользователя или войдите используя данные пользователя admin
```bash
docker-compose exec backend python manage.py createsuperuser
```
(если вы заполняли базу данных тестовыми данными из dump.json):
login: `admin@email.com`
password: `admin`

#### 5. Запустить в браузере 
- [Пользовательский интерфейс](http://localhost/)
- [Административный интерфейс](http://localhost/admin/)
- [Документация API](http://localhost/api/v1/docs)