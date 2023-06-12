import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewEvent } from '../Forms';

export function PopupNewEvent({ visible, setVisible, onCreateEvent }) {
	// const handleOverlayClick = (evt) => {
	// 	if (evt.target === evt.currentTarget) {
	// 		setVisible(false);
	// 	}
	// };

	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			// onMaskClick={handleOverlayClick}
			blockScroll
			draggable={false}
		>
			<FormNewEvent setVisible={setVisible} onCreateEvent={onCreateEvent} />
		</Dialog>
	);
}

PopupNewEvent.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onCreateEvent: PropTypes.func.isRequired,
};
