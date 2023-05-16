import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewEvent } from '../FormNewEvent/FormNewEvent';

export function PopupNewEvent({
	visible,
	setVisible,
	onCreateEvent,
	allUserCalendars,
}) {
	const handleOverlayClick = (evt) => {
		if (evt.target === evt.currentTarget) {
			setVisible(false);
		}
	};

	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			onMaskClick={handleOverlayClick}
			blockScroll
		>
			<FormNewEvent
				setVisible={setVisible}
				onCreateEvent={onCreateEvent}
				allUserCalendars={allUserCalendars}
			/>
		</Dialog>
	);
}

PopupNewEvent.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onCreateEvent: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	allUserCalendars: PropTypes.array.isRequired,
};
