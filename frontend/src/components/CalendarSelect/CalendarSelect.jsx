import { useState } from 'react';
import styles from './CalendarSelect.module.css';

export function CalendarSelect() {
	// список календарей придет с бэка
	const list = [
		{
			color: '#91DED3',
			description: null,
			id: 16,
			name: 'Личное',
			owner: 'yandex@yandex.com',
		},
		{
			color: '#7F9498',
			description: null,
			id: 17,
			name: 'Личное2',
			owner: 'yandex@yandex.com',
		},
		{
			color: '#FF9086',
			description: null,
			id: 18,
			name: 'Учеба',
			owner: 'yandex@yandex.com',
		},
		{
			color: '#225662',
			description: null,
			id: 19,
			name: 'Праздники',
			owner: 'yandex@yandex.com',
		},
		{
			color: '#7254F3',
			description: null,
			id: 20,
			name: 'Работа',
			owner: 'yandex@yandex.com',
		},
		{
			color: '#91DED3',
			description: null,
			id: 21,
			name: 'Фигня какая-то с очень длинным названием для проверки',
			owner: 'yandex@yandex.com',
		},
	];

	const [isActive, setIsActive] = useState(true);

	return (
		<div className={styles.calendarContainer}>
			<div className={styles.acordion}>
				<button
					className={styles.button}
					onClick={() => setIsActive(!isActive)}
					type="button"
				>
					Календари {isActive ? '\u15D0' : '\u15D2'}
				</button>
			</div>
			<div className={styles.allCalendars}>
				{isActive &&
					list.map((calendar) => (
						<label
							className={styles.list}
							htmlFor={calendar.id}
							key={calendar.id}
						>
							<input type="checkbox" id={calendar.id} name={calendar.id} />
							<span
								className={styles.checkbox}
								style={{ backgroundColor: calendar.color }}
							/>
							<span>{calendar.name}</span>
						</label>
					))}
			</div>
		</div>
	);
}
