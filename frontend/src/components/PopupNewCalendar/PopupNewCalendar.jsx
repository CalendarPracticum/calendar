import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormNewCalendar } from '../FormNewCalendar/FormNewCalendar';

export function PopupNewCalendar({ visible, setVisible, onCreateCalendar }) {
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
			<FormNewCalendar
				setVisible={setVisible}
				onCreateCalendar={onCreateCalendar}
			/>
		</Dialog>
	);
}

PopupNewCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onCreateCalendar: PropTypes.func.isRequired,
};
