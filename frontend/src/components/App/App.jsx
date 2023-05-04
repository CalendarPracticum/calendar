import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import ruLocale from 'date-fns/locale/ru';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { dateFnsLocalizer } from 'react-big-calendar';
import { Main } from '../../pages/Main/Main';
import { YearCalendar } from '../YearCalendar/YearCalendar';

const locales = {
	ru: ruLocale,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

const culture = 'ru';

function App() {
	return (
		<div>
			<p>Learn React</p>
			<Main />
			<YearCalendar localizer={localizer} culture={culture} />
		</div>
	);
}

export default App;
