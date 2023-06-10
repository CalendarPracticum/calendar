import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditCalendar } from '../FormEditCalendar/FormEditCalendar';

export function PopupEditCalendar({
	visible,
	setVisible,
	onEditCalendar,
	onDeleteCalendar,
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
			<FormEditCalendar
				setVisible={setVisible}
				onEditCalendar={onEditCalendar}
				onDeleteCalendar={onDeleteCalendar}
			/>
		</Dialog>
	);
}

PopupEditCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onEditCalendar: PropTypes.func.isRequired,
	onDeleteCalendar: PropTypes.func.isRequired,
};
