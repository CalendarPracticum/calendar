import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewEvent } from '../Forms';

export function PopupNewEvent({ visible, setVisible, onCreateEvent }) {
	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			blockScroll
			draggable={false}
		>
			<FormNewEvent onCreateEvent={onCreateEvent} />
		</Dialog>
	);
}

PopupNewEvent.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onCreateEvent: PropTypes.func.isRequired,
};
