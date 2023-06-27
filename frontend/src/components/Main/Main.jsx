/* Core */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

/* Instruments */
import { CurrentUserContext } from '../../context';
import styles from './Main.module.css';

/* Components */
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import { YearCalendar } from '../YearCalendar/YearCalendar';
import { BackToTopButton } from '../BackToTopButton/BackToTopButton';

export function Main({
	onNewEventClick,
	onNewCalendarClick,
	onEditCalendarClick,
	onEventDoubleClick,
}) {
	const { loggedIn } = useContext(CurrentUserContext);
	const [visibleProdCalendar, setVisibleProdCalendar] = useState(false);

	const showCalendars = () => {
		if (visibleProdCalendar && loggedIn) {
			return (
				<>
					<BaseCalendar
						onEventDoubleClick={onEventDoubleClick}
						onNewEventClick={onNewEventClick}
					/>
					<YearCalendar />
				</>
			);
		}

		if (!visibleProdCalendar && loggedIn) {
			return (
				<BaseCalendar
					onEventDoubleClick={onEventDoubleClick}
					onNewEventClick={onNewEventClick}
				/>
			);
		}

		if (visibleProdCalendar && !loggedIn) {
			return <YearCalendar />;
		}

		return <BaseCalendar />;
	};

	return (
		<main className={`${styles.main} container`}>
			<Sidebar
				onEditCalendarClick={onEditCalendarClick}
				onNewEventClick={onNewEventClick}
				onNewCalendarClick={onNewCalendarClick}
				showProdCalendar={setVisibleProdCalendar}
				visibleProdCalendar={visibleProdCalendar}
			/>
			<div className={styles.content}>{showCalendars()}</div>
			<BackToTopButton />
		</main>
	);
}

Main.propTypes = {
	onEditCalendarClick: PropTypes.func.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	onNewCalendarClick: PropTypes.func.isRequired,
	onEventDoubleClick: PropTypes.func.isRequired,
};
