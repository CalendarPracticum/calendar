import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormEditUser } from '../Forms';

export function PopupEditUser({
	visible,
	setVisible,
	onUpdateUser,
	onDeleteUser,
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
			<FormEditUser
				setVisible={setVisible}
				onUpdateUser={onUpdateUser}
				onDeleteUser={onDeleteUser}
			/>
		</Dialog>
	);
}

PopupEditUser.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
	onUpdateUser: PropTypes.func.isRequired,
	onDeleteUser: PropTypes.func.isRequired,
};
