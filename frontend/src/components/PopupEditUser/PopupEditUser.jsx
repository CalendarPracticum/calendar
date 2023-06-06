import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditUser } from '../FormEditUser/FormEditUser';

export function PopupEditUser({ visible, setVisible, onUpdateUser }) {
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
			<FormEditUser setVisible={setVisible} onUpdateUser={onUpdateUser} />
		</Dialog>
	);
}

PopupEditUser.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onUpdateUser: PropTypes.func.isRequired,
};
