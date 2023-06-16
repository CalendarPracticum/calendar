![LOGO](frontend/src/images/logo.svg)

# MyCalenDaily
MyCalenDaily - приложение, которое позволяет зарегистрированным пользователям планировать личные дела, разбивая их на разные календари, им так же доступен Производственный календарь.

Для не зарегистрированных пользователей доступен только Производственный календарь - информация о количестве рабочих, выходных и праздничных дней, необходимая бухгалтерам и кадровикам для работы, а сотрудникам - для планирования отпусков.
Производственный календарь на 2023 год составлен в соответствии с Постановлением Правительства РФ "О переносе выходных дней в 2023 году" от 29.08.2022 № 1505.

### Функционал
- Запросы к API (refresh и access токены)
- Регистрация/авторизация пользователя
- Личный профиль с возможностью смены пароля, email, почты и настройки предпочтительной темы
- Светлая и тёмная темы приложения
- Добавление и редактирование календарей
- Добавление и редактирование событий
- Выборочное отображение календарей
- Просмотр событий на месяц/неделю/день, общая сводка событий
- Производственный календарь

### Макет
> https://www.figma.com/file/ntxfCZU5xIGqwyRwPfp83z/%D0%9A%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8C-0.2?node-id=0-1&t=jXp4OWR4r2bu7fsd-0

### Деплой
> https://mycalendaily.practicum.ru
> IP-адрес сервера: 193.107.236.224

### Запуск проекта
`npm start`

### Библиотеки/npm-пакеты
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/en/main)
- [PrimeReact](https://primereact.org/) (русификация https://github.com/primefaces/primelocale)
- [Big Calendar](http://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page)
- [date-fns](https://date-fns.org/)
- [React Hook Form](https://react-hook-form.com/)
- [EsLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [prop-types](https://www.npmjs.com/package/prop-types)

### Следующий релиз
- Командные календари
- Drag and Drop событий в календаре
- Infinity Scroll
- tanstack
- TypeScript
- тестирование
- промо-страница с онбордингом
