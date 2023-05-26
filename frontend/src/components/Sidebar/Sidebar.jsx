import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Sidebar.module.css';
import { culture, noop } from '../../utils/constants';

export function Sidebar({ onNewEventClick, localizer }) {
	const { defaultDate, formats } = useMemo(
		() => ({
			defaultDate: new Date(),
			formats: {
				weekdayFormat: (date) => localizer.format(date, 'eeeeee', culture),
			},
		}),
		[localizer]
	);
	return (
		<div className={styles.sidebar}>
			<Button
				label="Событие"
				icon="pi pi-plus"
				iconPos="right"
				className={styles.button}
				onClick={() => onNewEventClick(true)}
			/>
			<Calendar
				className={styles.calendar}
				toolbar={false}
				culture={culture}
				onDrillDown={noop}
				onNavigate={noop}
				style={{ height: 210, margin: 0, padding: 0, width: 210 }}
				formats={formats}
				localizer={localizer}
				defaultDate={defaultDate}
				dayPropGetter={(date) => {
					const dayOfWeek = date.getDay();
					const dateOfMonth = date.getMonth();
					const nowMonth = new Date().getMonth();
					const nowDay = new Date().getDate();
					const dayOfMonth = date.getDate();

					if (dateOfMonth !== nowMonth) {
						return { className: styles.otherMonth };
					}
					if (nowDay === dayOfMonth) {
						return { className: styles.today };
					}

					return dayOfWeek === 0 || dayOfWeek === 6
						? { className: styles.holiday }
						: {};
				}}
			/>
		</div>
	);
}

Sidebar.propTypes = {
	onNewEventClick: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	localizer: PropTypes.object.isRequired,
};
