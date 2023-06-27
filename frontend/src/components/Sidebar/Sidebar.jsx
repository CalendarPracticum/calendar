/* Core */
import { useContext } from 'react';
import PropTypes from 'prop-types';

/* Libraries */
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar } from 'react-big-calendar';
import { classNames as cn } from 'primereact/utils';
import { Button } from 'primereact/button';

/* Instruments */
import { culture, noop } from '../../utils/constants';
import { CurrentUserContext, LocalizationContext } from '../../context';
import styles from './Sidebar.module.css';

/* Components */
import { CalendarSelect } from '../CalendarSelect/CalendarSelect';

export function Sidebar({
	onEditCalendarClick,
	onNewEventClick,
	onNewCalendarClick,
	visibleProdCalendar,
	showProdCalendar,
}) {
	const localizer = useContext(LocalizationContext);
	const { format } = localizer;

	const { loggedIn } = useContext(CurrentUserContext);

	const { defaultDate, formats } = {
		defaultDate: new Date(),
		formats: {
			weekdayFormat: (date) => format(date, 'eeeeee', culture),
		},
	};

	return (
		<div className={styles.sidebar}>
			<Button
				label="Событие"
				icon="pi pi-plus"
				iconPos="right"
				className={styles.button}
				onClick={() => onNewEventClick(true)}
				disabled={!loggedIn}
			/>
			<Calendar
				className={styles.calendar}
				toolbar={false}
				culture={culture}
				onDrillDown={noop}
				onNavigate={noop}
				style={{ height: 210, margin: 0, padding: 0, width: '100%' }}
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
			{loggedIn && (
				<>
					<CalendarSelect onEditCalendarClick={onEditCalendarClick} />
					<Button
						label="Новый календарь"
						icon="pi pi-plus"
						iconPos="left"
						className={cn(
							`p-button-sm p-button-outlined ${styles.btnNewCalendar}`
						)}
						onClick={() => onNewCalendarClick(true)}
						disabled={!loggedIn}
					/>
				</>
			)}

			<a
				href="#year-calendar"
				className={cn(`p-button-sm p-button-link  ${styles.btnProdCalendar}`)}
				onClick={() => showProdCalendar((prevState) => !prevState)}
			>
				{`${
					visibleProdCalendar ? 'Скрыть' : 'Показать'
				} производственный календарь`}
			</a>
		</div>
	);
}
// href='#about-project'
Sidebar.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	onNewCalendarClick: PropTypes.func.isRequired,
	visibleProdCalendar: PropTypes.bool.isRequired,
	showProdCalendar: PropTypes.func.isRequired,
};
