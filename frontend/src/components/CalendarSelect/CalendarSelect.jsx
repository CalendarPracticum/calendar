import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarSelect.module.css';
import CurrentUserContext from '../../context/CurrentUserContext';

export function CalendarSelect({ onEditCalendarClick }) {
	const userContext = useContext(CurrentUserContext);
	const {
		allUserCalendars,
		chooseCalendar,
		setChooseCalendar,
		setEditableCalendar,
	} = userContext;

	const [isActive, setIsActive] = useState(true);
	const handleCheckbox = (e) => {
		const input = e.target;
		const value = input.checked;
		setChooseCalendar({
			...chooseCalendar,
			[input.name]: value === true ? input.name : '',
		});
	};

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
					allUserCalendars.map((calendar) => (
						<label
							className={styles.list}
							htmlFor={calendar.id}
							key={calendar.id}
						>
							<input
								type="checkbox"
								id={calendar.id}
								name={calendar.id}
								onChange={handleCheckbox}
							/>
							<span
								className={styles.checkbox}
								style={{ backgroundColor: calendar.color }}
							/>
							<span className={styles.text}>{calendar.name}</span>
							<button
								className={styles.edit}
								type="button"
								onClick={() => {
									setEditableCalendar(calendar);
									onEditCalendarClick(true);
								}}
							>
								{'\u270E'}
							</button>
						</label>
					))}
			</div>
		</div>
	);
}

CalendarSelect.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
};
