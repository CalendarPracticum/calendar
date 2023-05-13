### Запуск проекта

Клонировать репозиторий и перейти в директорию deploy:
```
cd deploy
```
##### 1. Создать файл .env и заполнить необходимыми данными:

```
# Настройки DJANGO
DJANGO_SECRET_KEY=secret_key # вставьте секретный ключ, которого у вас нет
DEBUG=False # Режим дебагера

# База данных
POSTGRES_DB=db # имя базы данных
POSTGRES_PASSWORD=dbadmin # пароль от БД
POSTGRES_USER=db_admin # суперюзер БД

# Подключение к базе данных
DB_ENGINE=django.db.backends.postgresql # указываем, что работаем с postgresql
DB_NAME=db_name # имя базы данных
POSTGRES_USER=db_user # логин для подключения к базе данных
POSTGRES_PASSWORD=db_password # пароль для подключения к БД (установите свой)
DB_HOST=db_host # название сервиса (контейнера)
DB_PORT=5432  # порт для подключения к БД
```
##### 2. Выберете подходящую вам конфигурацию для загрузки медиа файлов

- _docker-compose -f ./docker-compose-local.yml up -d --build_
- media загружается с локальной машины снаружи контейнера

```
backend:
  volumes:
    - <Путь до директории на локальной машине>:/app/media/
    
nginx:
  volumes:
    - <Путь до директории на локальной машине>:/app/media/
```

- _docker-compose -f ./docker-compose-volume.yml up -d --build_
- media загружается внутри контейнера

```
backend:
  volumes:
    - media_value:/app/media/

nginx:
  volumes:
    - media_value:/var/html/media/
```

#### 3. Создайте контейнеры на основе выбранной конфигурации
```
docker-compose -f ./docker-compose-volume.yml up -d --build
или
docker-compose -f ./docker-compose-local.yml up -d --build

Выполните по очереди команды:
docker-compose exec backend python manage.py collectstatic --no-input
docker-compose exec backend python manage.py migrate

# Если хотите заполнить базу тестовыми файлами воспользуйтесь командой ниже
docker-compose exec backend python manage.py loaddata ./dump_v4.json
```
#### 4. Создайте суперпользователя или войдите используя данные пользователя admin
(если вы заполняли базу данных тестовыми данными из dump.json):

```
docker-compose exec backend python manage.py createsuperuser
```
#### 5. Запустить в браузере

```
http://localhost/
```