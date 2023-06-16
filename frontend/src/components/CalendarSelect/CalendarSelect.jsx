import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarSelect.module.css';
import { CurrentUserContext } from '../../context';

export function CalendarSelect({ onEditCalendarClick }) {
	const userContext = useContext(CurrentUserContext);
	const {
		allUserCalendars,
		chosenCalendars,
		setChosenCalendars,
		setEditableCalendar,
	} = userContext;

	const [isActive, setIsActive] = useState(true);

	const handleCheckbox = (e) => {
		const calendarId = e.target.id;
		const isChecked = e.target.checked;
		if (isChecked) {
			setChosenCalendars((prevState) => [...prevState, +calendarId]);
		} else {
			setChosenCalendars((prevState) =>
				prevState.filter((id) => id !== +calendarId)
			);
		}
	};

	return (
		<div className={styles.calendarContainer}>
			<div className={styles.acordion}>
				<button
					className={styles.button}
					onClick={() => setIsActive(!isActive)}
					type="button"
				>
					{isActive ? '\u02c5' : '\u02c3'} Календари
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
								defaultChecked={chosenCalendars.some((c) => c === calendar.id)}
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
