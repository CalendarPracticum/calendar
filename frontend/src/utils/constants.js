export const BASE_URL = 'http://mycalendaily.acceleratorpracticum.ru';

export const Color = {
	DEFAULT: '#49CBB8',
	ONE: '#158DE4',
	TWO: '#9BA434',
	THREE: '#FF8176',
	FOUR: '#00759A',
	FIVE: '#EE316E',
	SIX: '#40B160',
	SEVEN: '#225662',
	EIGHT: '#F43F3F',
	NINE: '#7F9498',
	TEN: '#E7B431',
	ELEVEN: '#74329D',
};

export const Status = {
	IDLE: 'idle',
	LOADING: 'loading',
	SUCCESS: 'success',
	ERROR: 'error',
};

export const noop = () => {};

export const messages = {
	date: 'Дата',
	time: 'Время',
	event: 'Событие',
	allDay: 'Весь день',
	week: 'Неделя',
	work_week: 'Рабочая неделя',
	day: 'День',
	month: 'Месяц',
	previous: 'Назад',
	next: 'Вперёд',
	yesterday: 'Вчера',
	tomorrow: 'Завтра',
	today: 'Сегодня',
	agenda: 'Сводка',
};

export const culture = 'ru';

export const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

export const holidays = [
	{
		color: '#6C70DE',
		description: '',
		id: 1,
		name: 'Праздники России',
		owner: 'admin@yandex.ru',
	},
];

export const info = {
	year: 2023,
	numberWorkDaysYear: 247,
	numberPreHolidaysYear: 3,
	numberWeekendAndHolidayYear: 118,
	normHoursYear: {
		fortyHours: 1973,
		thirtyNineHours: 1932.6,
		thirtySixHours: 1775.4,
		twentyFourHours: 1182.6,
	},
	normHoursJanuary: {
		fortyHours: 136,
		thirtyNineHours: 132.6,
		thirtySixHours: 122.4,
		twentyFourHours: 81.6,
	},
	changing:
		'Выходные дни (1 и 7, 8 января), совпадающие с нерабочими праздничными днями с 1 по 8 января, не переносятся автоматически на следующий после праздничного рабочий день. Правительство России может переносить только два таких выходных дня.',
	transferDays:
		'В 2023 году нерабочий праздничный день 4 ноября совпадает с выходным днем (суббота). Следовательно, этот выходной день переносится на следующий после праздничного рабочий день: на понедельник 6 ноября. В целях рационального использования работниками выходных и нерабочих праздничных дней выходные дни могут переноситься на другие дни федеральным законом или нормативным правовым актом Правительства РФ (часть пятая ст. 112 ТК РФ).',
	decreeDate: '29 августа 2022 г.',
	decreeNumber: '1505',
	listOfChanges: [
		'с воскресенья 1 января на пятницу 24 февраля;',
		'с воскресенья 8 января на понедельник 8 мая.',
	],
	aboutAllHoliday:
		'Таким образом, продолжительность "новогоднего отдыха" составит 9 дней - с 31 декабря 2022 г. по 8 января 2023 г. В 2023 г. 4-дневные периоды отдыха приходятся на День защитника Отечества (с 23 по 26 февраля) и День Победы (с 6 по 9 мая); 3-дневные периоды отдыха выпадают на Праздник Весны и Труда (с 29 апреля по 1 мая), День России (с 10 по 12 июня) и День народного единства (с 4 по 6 ноября).',
	aboutPreHolidays:
		'Предпраздничными днями в 2023 году являются 22 февраля, 7 марта и 3 ноября (продолжительность работы в эти дни должна быть уменьшена на 1 час).',
	numberOfDays: [
		{
			name: 'I Январь',
			workDays: '17 рабочих дней',
			weekends: '6 выходных дней',
			holidays: '8 нерабочих праздничных дней',
		},
		{
			name: 'II Февраль',
			workDays: '18 рабочих дней (1 предпраздничный)',
			weekends: '9 выходных дней',
			holidays: '1 нерабочий праздничных день',
		},
		{
			name: 'III Март',
			workDays: '22 рабочих дня (1 предпраздничный)',
			weekends: '8 выходных дней',
			holidays: '1 нерабочий праздничных день',
		},
		{
			name: 'IV Апрель',
			workDays: '20 рабочих дней',
			weekends: '8 выходных дней',
			holidays: 0,
		},
		{
			name: 'V Май',
			workDays: '20 рабочих дней',
			weekends: '9 выходных дней',
			holidays: '2 нерабочих праздничных дня',
		},
		{
			name: 'VI Июнь',
			workDays: '21 рабочий день',
			weekends: '8 выходных дней',
			holidays: '1 нерабочий праздничный день',
		},
		{
			name: 'VII Июль',
			workDays: '21 рабочий день',
			weekends: '10 выходных дней',
			holidays: 0,
		},
		{
			name: 'VIII Август',
			workDays: '23 рабочих дня',
			weekends: '8 выходных дня',
			holidays: 0,
		},
		{
			name: 'IX Сентябрь',
			workDays: '21 рабочий день',
			weekends: '9 выходных дней',
			holidays: 0,
		},
		{
			name: 'X Октябрь',
			workDays: '22 рабочих дня',
			weekends: '9 выходных дней',
			holidays: 0,
		},
		{
			name: 'XI Ноябрь',
			workDays: '21 рабочий день (1 предпраздничный день)',
			weekends: '8 выходных дней',
			holidays: '1 нерабочий праздничный день',
		},
		{
			name: 'XII Декабрь',
			workDays: '21 рабочий день',
			weekends: '10 выходных дней',
			holidays: 0,
		},
	],
};
