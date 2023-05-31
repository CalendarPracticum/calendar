import { useState } from 'react';
import styles from './CalendarSelect.module.css';

export function CalendarSelect() {
	// список календарей придет с бэка
	const list = [
		'Личный',
		'Рабочий',
		'Нужное',
		'Дни Рождения',
		'Фигня какая-то с очень-очень-очень-очень длинным названием',
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
					Календари {isActive ? 'ᗐ' : 'ᗒ'}
				</button>
			</div>
			<div className={styles.allCalendars}>
				{isActive &&
					list.map((calendar) => (
						<label className={styles.list} htmlFor="calendar" key={calendar}>
							<input type="checkbox" value="calendar" />
							<span>{calendar}</span>
						</label>
					))}
			</div>
		</div>
	);
}
