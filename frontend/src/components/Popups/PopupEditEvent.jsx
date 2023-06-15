import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditEvent } from '../Forms';

export function PopupEditEvent({
	visible,
	setVisible,
	onEditEvent,
	onDeleteEvent,
}) {
	return (
		<Dialog
			visible={visible}
			onHide={() => setVisible(false)}
			blockScroll
			draggable={false}
		>
			<FormEditEvent onEditEvent={onEditEvent} onDeleteEvent={onDeleteEvent} />
		</Dialog>
	);
}

PopupEditEvent.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onEditEvent: PropTypes.func.isRequired,
	onDeleteEvent: PropTypes.func.isRequired,
};
