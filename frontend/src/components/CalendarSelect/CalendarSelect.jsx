import { useState } from 'react';
import styles from './CalendarSelect.module.css';

export function CalendarSelect() {
	// список календарей придет с бэка
	const list = {color
:
"#91DED3"
description
:
null
id
:
16
name
:
"Личное"
owner
:
"yandex@yandex.com"
[[Prototype]]
:
Object
length
:
1
[[Prototype]]
:
Array(0)

  }
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
					Календари {isActive ? '\u15D0' : '\u15D2'}
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
