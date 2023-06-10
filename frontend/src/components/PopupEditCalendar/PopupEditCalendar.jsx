import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
// import { FormEditCalendar } from '../FormEditCalendar/FormEditCalendar';
// , onEditCalendar, onDeleteCalendar, editableCalendar
export function PopupEditCalendar({ visible, setVisible }) {
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
			FormEditCalendar
			{/* <FormEditCalendar
        setVisible={setVisible}
        onEditCalendar={onEditCalendar}
        onDeleteCalendar={onDeleteCalendar}
        editableCalendar={editableCalendar}
      /> */}
		</Dialog>
	);
}

PopupEditCalendar.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	// onEditCalendar: PropTypes.func.isRequired,
	// onDeleteCalendar: PropTypes.func.isRequired,
	// editableCalendar: PropTypes.objectOf(PropTypes.object()).isRequired,
};
