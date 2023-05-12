import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { FormLogin } from '../FormLogin/FormLogin';

export function PopupLogin({ visible, setVisible }) {
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
			modal
		>
			<FormLogin />
		</Dialog>
	);
}

PopupLogin.propTypes = {
	visible: PropTypes.bool.isRequired,
	setVisible: PropTypes.func.isRequired,
};
