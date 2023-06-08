import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarSelect.module.css';

export function CalendarSelect({ allUserCalendars }) {

	const [isActive, setIsActive] = useState(true);
  const [values, setValues] = useState({});
  const handleCheckbox =(e) => {
    // handleChange(e);
    const input = e.target;
    const value = input.checked;
    setValues({...values, [input.name]:value});
  }

  console.log(values);
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
							<input type="checkbox" id={calendar.id} name={calendar.id} onChange={handleCheckbox} />
							<span
								className={styles.checkbox}
								style={{ backgroundColor: calendar.color }}
							/>
							<span className={styles.text}>{calendar.name}</span>
							<button
								className={styles.edit}
								type="button"
								onClick={() => console.log(calendar.name)}
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
	// eslint-disable-next-line react/forbid-prop-types
	allUserCalendars: PropTypes.array.isRequired,
};
