import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar/Sidebar';
import { BaseCalendar } from '../BaseCalendar/BaseCalendar';
import styles from './Main.module.css';
import { YearCalendar } from '../YearCalendar/YearCalendar';

export function Main({
	localizer,
	onNewEventClick,
	onNewCalendarClick,
	onEditCalendarClick,
}) {
	const [visibleProdCalendar, setVisibleProdCalendar] = useState(false);

	return (
		<main className={`${styles.main} container`}>
			<Sidebar
				onEditCalendarClick={onEditCalendarClick}
				onNewEventClick={onNewEventClick}
				onNewCalendarClick={onNewCalendarClick}
				localizer={localizer}
				showProdCalendar={setVisibleProdCalendar}
				visibleProdCalendar={visibleProdCalendar}
			/>
			<div className={styles.content}>
				<BaseCalendar localizer={localizer} />
				{visibleProdCalendar && <YearCalendar localizer={localizer} />}
			</div>
		</main>
	);
}

Main.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	localizer: PropTypes.object.isRequired,
	onEditCalendarClick: PropTypes.func.isRequired,
	onNewEventClick: PropTypes.func.isRequired,
	onNewCalendarClick: PropTypes.func.isRequired,
};
