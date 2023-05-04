import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const year = '2023';

const firstQuarter = ['Январь', 'Февраль', 'Март'];

const secondQuarter = ['Апрель', 'Май', 'Июнь'];

const thirdQuarter = ['Июль', 'Август', 'Сентябрь'];

const fourthQuarter = ['Октябрь', 'Ноябрь', 'Декабрь'];

const newDate = new Date();

// eslint-disable-next-line react/prop-types
export function YearCalendar({ localizer, culture }) {
	return (
		<div className=" year-calendar">
			<h1 className="title">Производственный календарь</h1>
			<h2 className="subtitle">Первый квартал</h2>
			<div className=" quarter-calendar">
				{firstQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<Calendar
							culture={culture}
							localizer={localizer}
							toolbar={false}
							date={newDate.setFullYear(year, index, 1)}
							style={{ height: 300, margin: 0, padding: 0, width: 300 }}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Второй квартал</h2>
			<div className=" quarter-calendar">
				{secondQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<Calendar
							culture={culture}
							localizer={localizer}
							toolbar={false}
							date={newDate.setFullYear(year, index + 3, 1)}
							style={{ height: 300, margin: 0, padding: 0, width: 300 }}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Третий квартал</h2>
			<div className=" quarter-calendar">
				{thirdQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<Calendar
							culture={culture}
							localizer={localizer}
							toolbar={false}
							date={newDate.setFullYear(year, index + 6, 1)}
							style={{ height: 300, margin: 0, padding: 0, width: 300 }}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Четвертый квартал</h2>
			<div className=" quarter-calendar">
				{fourthQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<Calendar
							culture={culture}
							localizer={localizer}
							toolbar={false}
							date={newDate.setFullYear(year, index + 9, 1)}
							style={{ height: 300, margin: 0, padding: 0, width: 300 }}
						/>
					</li>
				))}
			</div>
			<p>{year}</p>
		</div>
	);
}
