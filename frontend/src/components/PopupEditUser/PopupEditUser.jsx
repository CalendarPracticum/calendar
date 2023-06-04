import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
// import { FormNewCalendar } from '../FormNewCalendar/FormNewCalendar';

export function PopupEditUser({ visible, setVisible }) {
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
			{/* <FormEditeUser
        setVisible={setVisible}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      /> */}
			FormEditUser will be here
		</Dialog>
	);
}

PopupEditUser.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	// onEditUser: PropTypes.func.isRequired,
	// onDeleteUser: PropTypes.func.isRequired,
};
