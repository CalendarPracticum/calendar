import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewEvent } from '../FormNewEvent/FormNewEvent';

export function PopupNewEvent({ visible, setVisible }) {
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
			<FormNewEvent setVisible={setVisible} />
		</Dialog>
	);
}

PopupNewEvent.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
};
