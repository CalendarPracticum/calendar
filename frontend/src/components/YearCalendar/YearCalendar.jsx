import { useMemo } from 'react';
import './YearCalendar.css';
import {
	firstQuarter,
	secondQuarter,
	thirdQuarter,
	fourthQuarter,
} from '../../utils/constants';
import { CalendarBlock } from '../CalendarBlock/CalendarBlock';

// некая рыба, которая придет с бэкенда в последствии
const year = '2023';
const info = 'бла-бла-бла - производственный календарь';

// взяла у Жени переделать!!!
const weekendStyle = {
	backgroundColor: '#e6e6e6',
};

// eslint-disable-next-line react/prop-types
export function YearCalendar({ localizer }) {
	// задаем формат шапки месяца
	const { defaultDate, formats } = useMemo(
		() => ({
			defaultDate: new Date(),
			formats: {
				weekdayFormat: (date, culture, local) =>
					local.format(date, 'eeeeee', culture), // для 2 букв eee
			},
		}),
		[]
	);

	return (
		<div className=" year-calendar">
			<h1 className="title">Производственный календарь</h1>
			<h2 className="subtitle">Первый квартал</h2>
			<div className="quarter-calendar">
				{firstQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<CalendarBlock
							formats={formats}
							localizer={localizer}
							date={defaultDate.setFullYear(year, index, 1)}
							dayPropGetter={(date) => {
								const dayOfWeek = date.getDay();
								return dayOfWeek === 0 || dayOfWeek === 6
									? { style: weekendStyle }
									: {};
							}}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Второй квартал</h2>
			<div className="quarter-calendar">
				{secondQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<CalendarBlock
							formats={formats}
							localizer={localizer}
							date={defaultDate.setFullYear(year, index + 3, 1)}
							dayPropGetter={(date) => {
								const dayOfWeek = date.getDay();
								return dayOfWeek === 0 || dayOfWeek === 6
									? { style: weekendStyle }
									: {};
							}}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Третий квартал</h2>
			<div className="quarter-calendar">
				{thirdQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<CalendarBlock
							formats={formats}
							localizer={localizer}
							date={defaultDate.setFullYear(year, index + 6, 1)}
							dayPropGetter={(date) => {
								const dayOfWeek = date.getDay();
								return dayOfWeek === 0 || dayOfWeek === 6
									? { style: weekendStyle }
									: {};
							}}
						/>
					</li>
				))}
			</div>
			<h2 className="subtitle">Четвертый квартал</h2>
			<div className="quarter-calendar">
				{fourthQuarter.map((month, index) => (
					<li className="month" key={month}>
						<p>{month}</p>
						<CalendarBlock
							formats={formats}
							localizer={localizer}
							date={defaultDate.setFullYear(year, index + 9, 1)}
							dayPropGetter={(date) => {
								const dayOfWeek = date.getDay();
								return dayOfWeek === 0 || dayOfWeek === 6
									? { style: weekendStyle }
									: {};
							}}
						/>
					</li>
				))}
			</div>
			<p>{info}</p>
		</div>
	);
}
